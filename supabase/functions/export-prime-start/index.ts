Deno.serve(async (_req: Request) => {
  return new Response(
    JSON.stringify({
      success: true,
      message: "Estrutura da integração LOC7 - Prime Start criada",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
});
