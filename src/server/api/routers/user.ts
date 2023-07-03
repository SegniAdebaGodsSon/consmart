import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { UserRole } from "@prisma/client";

export const userRouter = createTRPCRouter({
    searchUser: protectedProcedure
        .input(z.object({
            nameOrEmail: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const currUserId = ctx.session.user.id;
            const { nameOrEmail } = input;

            if (nameOrEmail === "") {
                return []
            }

            return ctx.prisma.user.findMany({
                where: {
                    OR: [
                        { name: { contains: nameOrEmail } },
                        { email: { contains: nameOrEmail } },
                    ],
                    NOT: [
                        { id: currUserId },
                        { role: UserRole.ADMIN }
                    ]
                }
            })
        })
});