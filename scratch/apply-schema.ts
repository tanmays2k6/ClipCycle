import { Client } from "pg";
import { readFileSync } from "fs";
import { resolve } from "path";

async function applySchema() {
  const client = new Client({
    connectionString: "postgresql://postgres:Imsflvs%4012@db.mmdpmyapvkmakuansywg.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("✅ Connected to Supabase DB");

    // 1. Drop existing tables if they exist to start fresh
    console.log("🗑️ Dropping any existing tables to reset schema...");
    await client.query(`
      drop trigger if exists on_auth_user_created on auth.users;
      drop function if exists public.handle_new_user cascade;
      drop function if exists public.handle_updated_at cascade;
      drop table if exists public.activity_logs cascade;
      drop table if exists public.ai_analysis cascade;
      drop table if exists public.generated_content cascade;
      drop table if exists public.ideas cascade;
      drop table if exists public.users cascade;
      drop type if exists public.activity_type cascade;
      drop type if exists public.content_type cascade;
      drop type if exists public.idea_platform cascade;
      drop type if exists public.idea_source cascade;
      drop type if exists public.idea_status cascade;
    `);

    // 2. Read the SQL schema file
    const sqlPath = resolve(process.cwd(), "supabase", "schema.sql");
    const sql = readFileSync(sqlPath, "utf-8");

    // 3. Execute the SQL schema
    console.log("📝 Executing schema.sql...");
    await client.query(sql);

    // 4. Grant privileges to anon and authenticated roles explicitly
    // Supabase sometimes requires this for PostgREST to expose the tables
    console.log("🔐 Granting privileges to anon and authenticated roles...");
    await client.query(`
      grant usage on schema public to anon, authenticated;
      grant all on all tables in schema public to anon, authenticated;
      grant all on all routines in schema public to anon, authenticated;
      grant all on all sequences in schema public to anon, authenticated;
    `);

    // 5. Notify PostgREST to reload the schema cache
    console.log("🔄 Reloading PostgREST schema cache...");
    await client.query(`NOTIFY pgrst, 'reload schema'`);

    console.log("🎉 Schema successfully applied and cache reloaded!");
  } catch (error) {
    console.error("❌ Error applying schema:", error);
  } finally {
    await client.end();
  }
}

applySchema();
