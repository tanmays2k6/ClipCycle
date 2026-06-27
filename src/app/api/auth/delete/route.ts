import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authData.user.id;
    const body = await request.json();

    if (body.confirmation !== "DELETE") {
      return NextResponse.json({ error: "Invalid confirmation" }, { status: 400 });
    }

    // Initialize Supabase Admin client with service_role key to bypass RLS and delete users
    // If service role key is not available, we can't delete the auth user directly from client context.
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceRoleKey || !supabaseUrl) {
      console.warn("Missing SUPABASE_SERVICE_ROLE_KEY. Cannot delete auth user.");
      return NextResponse.json(
        { error: "Server configuration error. Cannot perform deletion." },
        { status: 500 }
      );
    }

    const supabaseAdmin = createAdminClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    });

    // Delete the user from auth.users (this triggers cascade deletes across all public tables due to FKs)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("Admin user deletion error:", deleteError);
      return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
    }

    // Sign out the current session
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
