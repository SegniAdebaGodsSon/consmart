import { z } from "zod";
import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const taskRoueter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({
            name: z.string().min(5, { message: "Task name must be 5 or more characters long" }).max(255, { message: "Task name must be 255 or fewer characters long" }).trim(),
            progress: z.number().min(0).max(100),
            detail: z.string().min(5).max(255),
            siteId: z.string().cuid()

        })).mutation(async ({ ctx, input }) => {
            const currUserId = ctx.session.user.id;
            const { name, progress, detail, siteId } = input;

            const site = await ctx.prisma.site.findFirst({
                where: {
                    id: siteId,
                }
            });

            if (!site) {
                throw new Error('Site not found');
            }

            // if (currUserId !== site.managerId) {
            //     throw new Error('Forbidden! User must be the site manager of the specified site to add a new task')
            // }

            return ctx.prisma.task.create({
                data: {
                    name,
                    progress,
                    detail,
                    siteId
                }
            });

        }),

})