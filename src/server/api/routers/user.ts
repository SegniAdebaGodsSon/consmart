import { z } from "zod";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";
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
        }),

    getAllAdmin: adminProcedure
        .input(z.object({
            page: z.number().min(1),
            limit: z.number().min(1),
            search: z.string(),
            orderBy: z.enum(['latest', 'alphabet']),
        }))
        .query(async ({ ctx, input }) => {
            const { page, limit, search, orderBy } = input;
            const userId = ctx.session.user.id;

            let users = await ctx.prisma.user.findMany({
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: orderBy === "latest" ? 'desc' : undefined,
                    name: orderBy === "alphabet" ? 'desc' : undefined
                },
                where: {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } }
                    ],
                    name: {
                        contains: search, mode: 'insensitive'
                    },
                    NOT: {
                        id: userId
                    },
                    role: 'USER'
                },
                include: {
                    _count: {
                        select: {
                            consultantRoleProjects: true,
                            contractorRoleProjects: true,
                            managerRoleProjects: true
                        }
                    }
                }
            });

            const count = await ctx.prisma.user.count({
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: orderBy === "latest" ? 'desc' : undefined,
                    name: orderBy === "alphabet" ? 'desc' : undefined
                },
                where: {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } }
                    ],
                    name: {
                        contains: search, mode: 'insensitive'
                    },
                    NOT: {
                        id: userId
                    },
                    role: 'USER'
                }
            });

            return {
                users,
                total: count
            }
        }),

    updateUserRole: adminProcedure
        .input(z.object({
            id: z.string().cuid(),
            role: z.enum(['ADMIN', 'USER'])
        }))
        .mutation(async ({ ctx, input }) => {
            const { id, role } = input;

            return await ctx.prisma.user.update({
                where: {
                    id
                },
                data: {
                    role
                }
            })
        }),

    updateUserStatus: adminProcedure
        .input(z.object({
            id: z.string().cuid(),
            status: z.enum(['NORMAL', 'BANNED'])
        }))
        .mutation(async ({ ctx, input }) => {
            const { id, status } = input;

            return await ctx.prisma.user.update({
                where: {
                    id
                },
                data: {
                    status
                }
            })
        })
});