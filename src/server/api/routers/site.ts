import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const siteRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({
            name: z.string().min(5, { message: "Site name must be 5 or more characters long" }).max(255, { message: "Site name must be 255 or fewer characters long" }).trim(),
            location: z.string().min(1).max(255).trim(),
            projectId: z.string().cuid(),
            managerId: z.string().cuid()

        })).mutation(async ({ ctx, input }) => {
            const currUserId = ctx.session.user.id;
            const { name, location, projectId, managerId } = input;

            const project = await ctx.prisma.project.findFirst({
                where: {
                    id: projectId,
                },
            });

            if (!project) {
                throw new Error('Project not found');
            }

            if (currUserId !== project.contractorId) {
                throw new Error('Forbidden! User must be the contractor of the specified project to add a new site')
            }

            return ctx.prisma.site.create({
                data: {
                    name,
                    location,
                    managerId,
                    projectId
                }
            });

        }),

    getOne: protectedProcedure
        .input(z.object({
            id: z.string().cuid(),
        })).query(async ({ ctx, input }) => {
            const currUserId = ctx.session.user.id;
            const { id } = input;

            return ctx.prisma.site.findFirst({
                where: {
                    id
                },
                include: {
                    tasks: true,
                    manager: true,
                    project: true
                }
            })

        }),

    getAll: protectedProcedure
        .input(z.object({
            projectId: z.string().cuid(),
        }))
        .query(async ({ ctx, input }) => {
            const currUserId = ctx.session.user.id;
            const { projectId } = input;

            // project must exist
            const project = await ctx.prisma.project.findFirst({
                where: {
                    id: projectId,
                },
            });

            if (!project) {
                throw new Error('Project not found');
            }

            // if the user is site manager
            if (
                currUserId !== project.ownerId &&
                currUserId !== project.consultantId &&
                currUserId !== project.contractorId
            ) {
                const sites = await ctx.prisma.site.findMany({
                    where: {
                        projectId,
                        managerId: currUserId,
                    },
                    include: {
                        tasks: true,
                    },
                });

                const sitesWithProgress = sites.map((site) => {
                    const progressArr = site.tasks.map((task) => task.progress);
                    const averageProgress =
                        progressArr.reduce((acc, curr) => acc + curr, 0) / progressArr.length;

                    return {
                        ...site,
                        progress: averageProgress,
                    };
                });

                return sitesWithProgress;
            }

            // if the user is the owner/consultant/contractor
            const sites = await ctx.prisma.site.findMany({
                where: {
                    projectId,
                },
                include: {
                    tasks: true,
                },
            });

            const sitesWithProgress = sites.map((site) => {
                const progressArr = site.tasks.map((task) => task.progress);
                const averageProgress =
                    progressArr.reduce((acc, curr) => acc + curr, 0) / progressArr.length;

                return {
                    ...site,
                    progress: averageProgress,
                };
            });

            return sitesWithProgress;
        })
})