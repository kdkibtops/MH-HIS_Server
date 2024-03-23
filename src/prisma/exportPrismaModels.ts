import { PrismaClient } from '@prisma/client';
export const prsima = new PrismaClient({ log: ['error'] });
export const prisma_radiology_order = prsima.radiology_order;
export const prisma_study = prsima.study;
export const prisma_user = prsima.user;
export const prisma_userJob = prsima.job;
export const prisma_userRole = prsima.user_role;
export const prisma_patient = prsima.personal;
export const prisma_procedure = prsima.proc;
