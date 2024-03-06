import { Pool } from 'pg';
import { setupData } from './config/config';
import dotenv from 'dotenv';
dotenv.config();

const client =
	String(process.env.ENV) === 'Dev'
		? new Pool({
				host: setupData.host,
				database: setupData.database,
				user: setupData.DB_username,
				password: setupData.DB_password,
				port: setupData.DB_port,
		  })
		: new Pool({
				host: setupData.host,
				database: setupData.database,
				user: setupData.DB_username,
				password: setupData.DB_password,
				port: setupData.DB_port,
		  });

export type dbConnectionTestResult = {
	primaryKey?: string;
	status: string;
	returnVal: unknown;
};
export const testDBConncetion = async (): Promise<
	| {
			status: 'Connected';
			returnVal: {};
	  }
	| {
			status: 'Failed';
			returnVal: {
				connection: unknown;
				databaseName: string;
				enviroment: string;
			};
	  }
	| { status: 'Error'; retunVal: Error }
> => {
	try {
		const connected = await client.connect();
		if (connected) {
			const sql = 'SELECT NOW ();';
			const response = await connected.query(sql);
			connected.release();
			const result = response.rows[0].now;
			String(process.env.ENV) === 'Production' &&
				console.log(
					`\nDATABASE CONNECTION: \n-Production Enviroment\n-Connection to database: "${setupData.database}" is successful\n-Connected at: ${result}\n`
				);
			String(process.env.ENV) === 'Dev' &&
				console.log(
					`\nDATABASE CONNECTION: \n-Devlopment Enviroment\n-Connection to database: "${setupData.database}" is successful\n-Connected at: ${result}\n`
				);
			String(process.env.ENV) !== 'Production' &&
				String(process.env.ENV) !== 'Dev' &&
				console.log(
					`\nDATABASE CONNECTION: \n-${process.env.ENV} Enviroment\n-Connection to database: "${setupData.database}" is successful\n-Connected at: ${result}\n`
				);
			return { status: 'Connected', returnVal: result };
		} else {
			console.log(
				`\nDATABASE CONNECTION: \n-Connection to database: "${setupData.database}"  failed\n`
			);
			return {
				status: 'Failed',
				returnVal: {
					connection: connected,
					databaseName: setupData.database as string,
					enviroment: process.env.ENV as string,
				},
			};
		}
	} catch (error) {
		console.log(
			`\nDATABASE CONNECTION: \n-Connection to database: "${setupData.database}"  failed\n`
		);
		return { status: 'Error', retunVal: error as Error };
	}
};

export default client;
