import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createRegistration, getRegistrations, getRegistrationCount } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  registrations: router({
    create: publicProcedure
      .input(
        z.object({
          type: z.enum(["pessoa_fisica", "pessoa_juridica"]),
          fullName: z.string().min(1),
          email: z.string().email(),
          phone: z.string().min(1),
          question: z.string().optional(),
          cpf: z.string().optional(),
          rg: z.string().optional(),
          birthDate: z.string().optional(),
          motherName: z.string().optional(),
          cnpj: z.string().optional(),
          companyName: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await createRegistration(input);
          return { success: true, message: "Cadastro realizado com sucesso!" };
        } catch (error) {
          console.error("Failed to create registration:", error);
          return { success: false, message: "Erro ao salvar cadastro" };
        }
      }),

    list: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input, ctx }) => {
        // Only admins can view registrations
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const registrations = await getRegistrations(input.limit, input.offset);
        const count = await getRegistrationCount();
        return { registrations, count };
      }),

    count: protectedProcedure.query(async ({ ctx }) => {
      // Only admins can view count
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await getRegistrationCount();
    }),
  }),
});

export type AppRouter = typeof appRouter;
