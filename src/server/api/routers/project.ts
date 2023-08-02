import { ProjectStatus, ProjectType } from "@prisma/client";
import { ZodError, z } from "zod";
import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

const validateDateRange = (obj: any) => {
    if (obj.startDate <= new Date()) {
        throw new ZodError([{ path: ["startDate"], code: z.ZodIssueCode.invalid_date, message: "Start date must be in the future" }])
    }
    if (obj.endDate <= obj.startDate) {
        throw new ZodError([{ path: ["endDate"], code: z.ZodIssueCode.invalid_date, message: "End date must be after start date" }])
    }

    if (!obj.contractorId) {
        throw new ZodError([{ path: ["contractorId"], code: z.ZodIssueCode.custom, message: "Contractor not chosen" }])
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
                ownerId: z.string().cuid(),
                startDate: z.date(),
                endDate: z.date()
            })
                .refine(validateDateRange))
        .mutation(async ({ ctx, input }) => {
            const currUserId = ctx.session.user.id;
            const { name, description, type, contractorId, ownerId, startDate, endDate } = input;

            const contractor = await ctx.prisma.user.findFirst({
                where: {
                    id: contractorId,
                },
            });

            if (!contractor) {
                throw new ZodError([{ path: ["contractorId"], code: z.ZodIssueCode.custom, message: "Contractor not found" }])
            }

            return ctx.prisma.project.create({
                data: {
                    name,
                    description,
                    type,
                    contractorId,
                    consultantId: currUserId,
                    ownerId,
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
                },
                include: {
                    consultant: true,
                    contractor: true,
                    owner: true
                }
            })
        }),

    getAll: protectedProcedure
        .input(z.object({
            page: z.number().min(1),
            limit: z.number().min(1),
            search: z.string(),
            orderBy: z.enum(['latest', 'urgent']),
            role: z.enum(['consultant', 'contractor', 'site manager', 'owner', 'all']),
            status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'ALL'])
        }))
        .query(async ({ ctx, input }) => {
            const currUserId = ctx.session.user.id;
            const { page, limit, search, orderBy, role, status } = input;

            const projects = await ctx.prisma.project.findMany({
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    startDate: orderBy === "latest" ? 'desc' : undefined,
                    endDate: orderBy === "urgent" ? 'asc' : undefined
                },
                where: {
                    OR: [
                        { ownerId: currUserId },
                        { consultantId: currUserId },
                        { contractorId: currUserId, status: 'ACCEPTED' },
                        {
                            sites: {
                                some: {
                                    managerId: currUserId,
                                },
                            },
                            status: 'ACCEPTED'
                        }
                    ],
                    status: status === 'ALL' ? undefined : status,
                    AND: [
                        {
                            OR: [
                                { name: { contains: search, mode: 'insensitive' } },
                                { description: { contains: search, mode: 'insensitive' } }
                            ]
                        },
                        role === 'owner' ? { ownerId: currUserId } : {},
                        role === 'consultant' ? { consultantId: currUserId } : {},
                        role === 'contractor' ? { contractorId: currUserId } : {},
                        role === 'site manager' ? {
                            sites: {
                                some: {
                                    managerId: currUserId
                                }
                            }
                        } : {},
                    ]
                },
                include: {
                    consultant: true,
                    contractor: true,
                }
            });

            const count = await ctx.prisma.project.count({
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    startDate: orderBy === "latest" ? 'desc' : undefined,
                    endDate: orderBy === "urgent" ? 'asc' : undefined
                },
                where: {
                    OR: [
                        { ownerId: currUserId },
                        { consultantId: currUserId },
                        { contractorId: currUserId, status: 'ACCEPTED' },
                        {
                            sites: {
                                some: {
                                    managerId: currUserId,
                                },
                            },
                            status: 'ACCEPTED'
                        }
                    ],
                    status: status === 'ALL' ? undefined : status,
                    AND: [
                        {
                            OR: [
                                { name: { contains: search, mode: 'insensitive' } },
                                { description: { contains: search, mode: 'insensitive' } }
                            ]
                        },
                        role === 'owner' ? { ownerId: currUserId } : {},
                        role === 'consultant' ? { consultantId: currUserId } : {},
                        role === 'contractor' ? { contractorId: currUserId } : {},
                        role === 'site manager' ? {
                            sites: {
                                some: {
                                    managerId: currUserId
                                }
                            }
                        } : {},
                    ]
                }
            });

            return {
                projects,
                total: count
            };

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
            search: z.string(),
            orderBy: z.enum(['latest', 'urgent']),
        }))
        .query(async ({ ctx, input }) => {
            const { page, limit, orderBy, search } = input;
            const projects = await ctx.prisma.project.findMany({
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    startDate: orderBy === "latest" ? 'desc' : undefined,
                    endDate: orderBy === "urgent" ? 'asc' : undefined
                },
                where: {
                    status: "PENDING",
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                    ]
                },
                include: {
                    consultant: true,
                    contractor: true,
                }
            });

            const count = await ctx.prisma.project.count({
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    startDate: orderBy === "latest" ? 'desc' : undefined,
                    endDate: orderBy === "urgent" ? 'asc' : undefined
                },
                where: {
                    status: "PENDING",
                    OR: [
                        { name: { contains: search } },
                        { description: { contains: search } },
                    ]
                }
            });

            return {
                projects,
                total: count
            };
        }),

    setStatusAdmin: adminProcedure
        .input(z.object({
            id: z.string().cuid(),
            action: z.enum(['reject', 'accept'])
        }))
        .mutation(async ({ ctx, input }) => {
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

    getCompletionPercentage: protectedProcedure
        .input(z.object({
            projectId: z.string().cuid()
        }))
        .query(async ({ ctx, input }) => {
            const { projectId } = input;
            const overallProgress = await ctx.prisma.task.aggregate({
                where: {
                    site: {
                        project: {
                            id: projectId,
                        },
                    },
                },
                _avg: {
                    progress: true,
                },
            });
            return overallProgress._avg.progress || 0;
        })



});