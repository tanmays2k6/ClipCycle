import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials in .env.local");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log("🚀 Starting Database Tests...");

  // 1. Create a temporary test user
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = "securepassword123";

  console.log(`\n👤 1. Signing up test user: ${testEmail}`);
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  });

  if (authError) {
    console.error("❌ Auth Error:", authError.message);
    return;
  }

  const userId = authData.user?.id;
  if (!userId) {
    console.error("❌ No user ID returned from signup");
    return;
  }
  console.log("✅ User created successfully:", userId);

  // 2. INSERT
  console.log("\n📝 2. Testing INSERT...");
  const { data: insertData, error: insertError } = await supabase
    .from("ideas")
    .insert({
      user_id: userId,
      title: "Test Idea 1",
      description: "This is a test description",
      status: "pending",
      platforms: ["twitter"],
      tags: ["test"],
      source: "text",
    })
    .select()
    .single();

  if (insertError) {
    console.error("❌ Insert Error:", insertError.message);
    return;
  }
  console.log("✅ Insert successful! Idea ID:", insertData.id);
  const ideaId = insertData.id;

  // 3. SELECT
  console.log("\n🔍 3. Testing SELECT...");
  const { data: selectData, error: selectError } = await supabase
    .from("ideas")
    .select("*")
    .eq("id", ideaId)
    .single();

  if (selectError) {
    console.error("❌ Select Error:", selectError.message);
    return;
  }
  console.log("✅ Select successful! Title:", selectData.title);

  // 4. UPDATE
  console.log("\n✏️  4. Testing UPDATE...");
  const { data: updateData, error: updateError } = await supabase
    .from("ideas")
    .update({ title: "Updated Idea Title" })
    .eq("id", ideaId)
    .select()
    .single();

  if (updateError) {
    console.error("❌ Update Error:", updateError.message);
    return;
  }
  console.log("✅ Update successful! New Title:", updateData.title);

  // 5. DELETE
  console.log("\n🗑️  5. Testing DELETE...");
  const { error: deleteError } = await supabase
    .from("ideas")
    .delete()
    .eq("id", ideaId);

  if (deleteError) {
    console.error("❌ Delete Error:", deleteError.message);
    return;
  }
  console.log("✅ Delete successful!");

  // Verify deletion
  const { data: verifyData } = await supabase
    .from("ideas")
    .select("*")
    .eq("id", ideaId)
    .single();

  if (!verifyData) {
    console.log("✅ Verified idea no longer exists.");
  }

  // Cleanup: Delete the test user (only possible via admin API, so we just log out)
  await supabase.auth.signOut();
  console.log("\n🎉 All tests passed successfully!");
}

runTests().catch(console.error);
