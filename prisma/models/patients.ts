import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const testPrismDB = async () => {
	const connected = await prisma.$connect();
	console.log(connected);
};
