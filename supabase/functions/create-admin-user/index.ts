import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizeRole(role: string) {
  const value = String(role || "").trim().toLowerCase();

  if (value === "admin" || value === "administrador") return "Administrador";
  if (value === "operador") return "Operador";

  return "";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse(
        { success: false, error: "SUPABASE_SERVICE_ROLE_KEY não configurada" },
        500
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const name = String(body.name || body.full_name || "").trim();
    const role = normalizeRole(body.role);

    if (!name) {
      return jsonResponse({ success: false, error: "Nome obrigatório" }, 400);
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ success: false, error: "E-mail inválido" }, 400);
    }

    if (!password || password.length < 6) {
      return jsonResponse(
        { success: false, error: "A senha deve ter no mínimo 6 caracteres" },
        400
      );
    }

    if (!role) {
      return jsonResponse({ success: false, error: "Permissão inválida" }, 400);
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name,
          role,
        },
      });

    if (authError || !authData.user) {
      return jsonResponse(
        {
          success: false,
          error: authError?.message || "Erro ao criar usuário no Auth",
        },
        400
      );
    }

    const userId = authData.user.id;

    const { error: dbError } = await supabase.from("admin_users").upsert(
      {
        id: userId,
        name,
        email,
        role,
        active: true,
      },
      { onConflict: "id" }
    );

    if (dbError) {
      await supabase.auth.admin.deleteUser(userId);

      return jsonResponse(
        {
          success: false,
          error: `Erro ao salvar usuário no banco: ${dbError.message}`,
        },
        400
      );
    }

    return jsonResponse(
      {
        success: true,
        message: "Usuário criado com sucesso",
        data: {
          user_id: userId,
          email,
          role,
        },
      },
      201
    );
  } catch (error) {
    console.error(error);

    return jsonResponse(
      { success: false, error: "Erro interno do servidor" },
      500
    );
  }
});