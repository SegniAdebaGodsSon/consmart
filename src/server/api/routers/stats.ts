import { ProjectStatus, ProjectType } from "@prisma/client";
import { ZodError, z } from "zod";
import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const statsRoueter = createTRPCRouter({
    getBasicStats: adminProcedure
        .query(async ({ ctx, input }) => {
            const usersCount = await ctx.prisma.user.count();
            const projectsCount = await ctx.prisma.project.count();
            const sitesCount = await ctx.prisma.site.count();

            return {
                usersCount,
                projectsCount,
                sitesCount
            }
        }),

    getProjectStats: adminProcedure
        .query(async ({ ctx, input }) => {
            const acceptedProjectsCount = await ctx.prisma.project.count(
                {
                    where: {
                        status: 'ACCEPTED'
                    }
                }
            );

            const pendingProjectsCount = await ctx.prisma.project.count(
                {
                    where: {
                        status: 'PENDING'
                    }
                }
            );

            const rejectedProjectsCount = await ctx.prisma.project.count(
                {
                    where: {
                        status: 'REJECTED'
                    }
                }
            );

            return {
                acceptedProjectsCount,
                pendingProjectsCount,
                rejectedProjectsCount
            }
        }),

    getUserStats: adminProcedure
        .query(async ({ ctx, input }) => {
            const mostProjectsAsConsultant = await ctx.prisma.user.findMany({
                orderBy: {
                    consultantRoleProjects: {
                        _count: 'desc'
                    }
                },
                include: {
                    consultantRoleProjects: true
                },
                take: 1
            });

            const mostProjectsAsContractor = await ctx.prisma.user.findMany({
                orderBy: {
                    contractorRoleProjects: {
                        _count: 'desc'
                    }
                },
                include: {
                    contractorRoleProjects: true
                },
                take: 1
            });

            const mostProjectsAsSiteManager = await ctx.prisma.user.findMany({
                orderBy: {
                    managerRoleProjects: {
                        _count: 'desc'
                    }
                },
                include: {
                    managerRoleProjects: true
                },
                take: 1
            });

            return {
                mostProjectsAsConsultant,
                mostProjectsAsContractor,
                mostProjectsAsSiteManager,
            }

        }),


})