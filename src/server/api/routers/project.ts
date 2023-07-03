import { ProjectStatus, ProjectType } from "@prisma/client";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

const validateDateRange = (obj: any) => {
    if (obj.startDate <= new Date()) {
        return { message: "Start date must be in the future" };
    }
    if (obj.endDate <= obj.startDate) {
        return { message: "End date must be after start date" };
    }
    return true;
};

export const projectRoueter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(5, { message: "Project name must be 5 or more characters long" }).max(255, { message: "Project name must be 255 or fewer characters long" }).trim(),
                description: z.string().min(10, { message: "Project description must be 5 or more characters long" }).max(255, { message: "Project description must be 255 or fewer characters long" }),
                type: z.nativeEnum(ProjectType),
                contractorId: z.string().cuid(),
                startDate: z.date(),
                endDate: z.date(),
            })
                .refine(validateDateRange))
        .mutation(async ({ ctx, input }) => {
            const currUserId = ctx.session.user.id;
            const { name, description, type, contractorId, startDate, endDate } = input;

            const contractor = await ctx.prisma.project.findFirst({
                where: {
                    id: contractorId,
                },
            });

            if (!contractor) {
                throw new Error('Contractor not found');
            }

            return ctx.prisma.project.create({
                data: {
                    name,
                    description,
                    type,
                    contractorId,
                    consultantId: currUserId,
                    startDate,
                    endDate
                }
            })
        }),

    getOne: protectedProcedure
        .input(z.object({
            id: z.string().cuid()
        }))
        .query(async ({ ctx, input }) => {
            const { id } = input;
            return ctx.prisma.project.findFirst({
                where: {
                    id
                }
            })
        }),

    getAllWhereRoleIsConsultant: protectedProcedure
        .input(z.object({
            page: z.number().min(1),
            limit: z.number().min(1),
            orderBy: z.enum(['latest', 'urgent']),
            status: z.nativeEnum(ProjectStatus).optional()
        }))
        .query(async ({ ctx, input }) => {
            const currUserId = ctx.session.user.id;
            const { page, limit, orderBy, status } = input;
            const projects = ctx.prisma.project.findMany({
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    startDate: orderBy === "latest" ? 'desc' : undefined,
                    endDate: orderBy === "urgent" ? 'asc' : undefined
                },
                where: {
                    status: status || undefined,
                    consultantId: currUserId
                }
            });
            return projects;
        }),

    getAllWhereRoleIsContractor: protectedProcedure
        .input(z.object({
            page: z.number().min(1),
            limit: z.number().min(1),
            orderBy: z.enum(['latest', 'urgent']),
            status: z.nativeEnum(ProjectStatus).optional()
        }))
        .query(async ({ ctx, input }) => {
            const currUserId = ctx.session.user.id;
            const { page, limit, orderBy, status } = input;
            const projects = ctx.prisma.project.findMany({
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    startDate: orderBy === "latest" ? 'desc' : undefined,
                    endDate: orderBy === "urgent" ? 'asc' : undefined
                },
                where: {
                    status: status || undefined,
                    contractorId: currUserId
                }
            });
            return projects;
        }),

    getAllWhereRoleIsSiteManager: protectedProcedure
        .input(z.object({
            page: z.number().min(1),
            limit: z.number().min(1),
            orderBy: z.enum(['latest', 'urgent']),
            status: z.nativeEnum(ProjectStatus).optional()
        }))
        .query(async ({ ctx, input }) => {
            const currUserId = ctx.session.user.id;
            const { page, limit, orderBy, status } = input;
            const projects = ctx.prisma.project.findMany({
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    startDate: orderBy === "latest" ? 'desc' : undefined,
                    endDate: orderBy === "urgent" ? 'asc' : undefined
                },
                where: {
                    status: status || undefined,
                    sites: {
                        some: {
                            managerId: currUserId
                        }
                    }
                }
            });
            return projects;
        }),

    // getUsersInProject: protectedProcedure
    // .input(z.object({
    //     projectId: z.string().cuid()
    // }))
    // .query(async ({ctx, input}) => {
    //     const currUserId = ctx.session.user.id;
    //     const { projectId } = input;


    // }),

    getAllAdmin: adminProcedure
        .input(z.object({
            page: z.number().min(1),
            limit: z.number().min(1),
            orderBy: z.enum(['latest', 'urgent']),
            status: z.nativeEnum(ProjectStatus).optional()
        }))
        .query(async ({ ctx, input }) => {
            const { page, limit, orderBy, status } = input;
            const projects = ctx.prisma.project.findMany({
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    startDate: orderBy === "latest" ? 'desc' : undefined,
                    endDate: orderBy === "urgent" ? 'asc' : undefined
                },
                where: {
                    status: status || undefined
                }
            });
            return projects;
        }),

    setStatusAdmin: adminProcedure
        .input(z.object({
            id: z.string().cuid(),
            action: z.enum(['reject', 'accept'])
        }))
        .query(async ({ ctx, input }) => {
            const { id, action } = input;

            const project = await ctx.prisma.project.findFirst({
                where: {
                    id,
                    status: 'PENDING',
                },
            });

            if (!project) {
                throw new Error('Project not found or status is not PENDING');
            }

            let updatedProject;

            if (action === 'reject') {
                updatedProject = await ctx.prisma.project.update({
                    where: {
                        id,
                    },
                    data: {
                        status: 'REJECTED',
                    },
                });
            } else if (action === 'accept') {
                updatedProject = await ctx.prisma.project.update({
                    where: {
                        id,
                    },
                    data: {
                        status: 'ACCEPTED',
                    },
                });
            }

            return updatedProject;
        }),


});