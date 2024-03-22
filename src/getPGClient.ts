import client from './database';
import { getDateInEgypt } from './config/getDate';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { QueryResult } from 'pg';
export const getPGClient = async (
	text: string,
	values: string[] | number[],
	stack?: string
): Promise<QueryResult | null> => {
	try {
		console.log(text);
		const conn = await client.connect();
		const start = Date.now();
		const res = await conn.query(text, values ? values : undefined);
		const duration = Date.now() - start + ' ms';
		conn.release();

		const queryLogFolder = path.join(__dirname, '../Logs/PGQueries');
		const queryLogFile = path.join(
			queryLogFolder,
			`stdout${getDateInEgypt().split('T')[0]}.log`
		);
		if (!existsSync(queryLogFolder)) {
			mkdirSync(queryLogFolder);
		}
		const fileLog = createWriteStream(queryLogFile, {
			encoding: 'utf8',
			flags: 'a',
		});
		const logged = fileLog.write(
			`>>>>>> Start @ ${getDateInEgypt()} <<<<<<<\nStack:\n${
				stack?.split('Error\n')[1]
			}\nQuery: ${text}\nDuration: ${duration}\nRows:${
				res.rowCount
			}\n<<<<<<< End >>>>>\n\n`,
			'utf8',
			(err) => {
				if (err) {
					console.warn('Error logging PGQuery');
				}
			}
		);
		return res;
	} catch (error) {
		const queryLogFolder = path.join(__dirname, '../Logs/PGQueries');
		const errLogFile = path.join(
			queryLogFolder,
			`stderr${getDateInEgypt().split('T')[0]}.log`
		);
		const err = error as Error;
		if (!existsSync(queryLogFolder)) {
			mkdirSync(errLogFile);
		}
		const fileLog = createWriteStream(errLogFile, {
			encoding: 'utf8',
			flags: 'a',
		});
		const logged = fileLog.write(
			`>>>>>> Start @ ${getDateInEgypt()} <<<<<<<\nStack:\n${
				stack?.split('Error\n')[1]
			}\nText:${text}\nValues:${values}\n<<<<<<< End >>>>>\n\n`,
			'utf8',
			(err) => {
				if (err) {
					console.warn('Error logging PGQuery');
				}
			}
		);
		return null;
	}
};

export default getPGClient;
