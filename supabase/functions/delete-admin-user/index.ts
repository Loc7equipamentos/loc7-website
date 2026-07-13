import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ success: false, error: "user_id é obrigatório" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1️⃣ Deletar do AUTH
    const { error: authError } = await supabase.auth.admin.deleteUser(user_id);

    if (authError) {
      console.error("Auth delete error:", authError);
      return new Response(
        JSON.stringify({ success: false, error: authError.message }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 2️⃣ Deletar da tabela admin_users
    const { error: dbError } = await supabase
      .from("admin_users")
      .delete()
      .eq("id", user_id);

    if (dbError) {
      console.error("DB delete error:", dbError);
      return new Response(
        JSON.stringify({ success: false, error: dbError.message }),
        { status: 400, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, error: "Erro interno" }),
      { status: 500, headers: corsHeaders }
    );
  }
});