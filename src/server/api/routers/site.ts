import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const siteRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({
            name: z.string().min(5, { message: "Site name must be 5 or more characters long" }).max(255, { message: "Site name must be 255 or fewer characters long" }).trim(),
            location: z.string().min(1).max(255).trim(),
            // schedule: z.ZodJ,
            projectId: z.string().cuid(),

        })).mutation(async ({ ctx, input }) => {
            const currUserId = ctx.session.user.id;
            const { name, location, projectId } = input;

            // project must exist
            const project = await ctx.prisma.project.findFirst({
                where: {
                    id: projectId,
                },
            });

            if (!project) {
                throw new Error('Project not found');
            }

            // user must be a contractor of the specified project to add a site
            if (currUserId !== project.contractorId) {
                throw new Error('Forbidden! User must be the contractor of the specified project to add a new site')
            }

            return ctx.prisma.site.create({
                data: {
                    name,
                    location,
                    schedule: {},
                    managerId: currUserId,
                    projectId
                }
            })

        }),

    getOne: protectedProcedure
        .input(z.object({
            siteId: z.string().cuid(),

        })).mutation(async ({ ctx, input }) => {
            const currUserId = ctx.session.user.id;
            const { siteId } = input;

            return ctx.prisma.site.findFirst({
                where: {
                    id: siteId
                }
            })

        }),

    getAll: protectedProcedure
        .input(z.object({
            projectId: z.string().cuid(),

        })).mutation(async ({ ctx, input }) => {
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


            return ctx.prisma.site.findMany({
                where: {
                    projectId
                }
            })

        })
})