import { Response } from 'express';
export const importData = async (res: Response) => {
	try {
		console.log('importing data ');
		fetch('http://127.0.0.1:8978', { method: 'GET' });
		res.status(200);
	} catch (error) {
		console.log(`${error}`);
	}
};
