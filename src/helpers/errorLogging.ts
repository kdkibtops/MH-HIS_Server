import path from 'path';
import { getDateInEgypt } from '../config/getDate';
import { appendFile, existsSync, mkdirSync } from 'fs';
import { Request } from 'express';
import { REQBODY } from '../config/types';

const errorLogFolder = `E:/My_projects/RadAssist/Backend/Logs/Errors`;
const errorLogFile = path.join(
	errorLogFolder,
	`${getDateInEgypt().split('T')[0]}.txt`
);

export const logError = (err: Error, req?: Request) => {
	try {
		if (!existsSync(errorLogFolder)) {
			mkdirSync(errorLogFolder, { recursive: true });
		}
		const reqBody = req?.body as REQBODY;
		const errorName = err.name;
		const errorMsg = err.message;
		const errorStack = err.stack;
		const errorToLog = `
*******************************************Start Of Error*******************************************
*******************************@${getDateInEgypt()}*******************************

Client Error => Responded with status code: (400) - Bad Request
Request origin: ${
			req ? `${req.hostname}${req.baseUrl}${req.url}` : 'Request not provided'
		} 
Request:${
			req
				? ` ${
						reqBody.users
							? JSON.stringify({
									...reqBody,
									users: { ...reqBody.users, user_password: '****' },
							  })
							: JSON.stringify(reqBody)
				  }`
				: 'Request not provided'
		}
Name: ${errorName} @  ${getDateInEgypt()}
Message: ${errorMsg}
Stack: ${errorStack}
*******************************************End Of Error*******************************************
`;
		appendFile(errorLogFile, errorToLog, 'utf8', (err) => {
			if (err) console.log(`Server Error, Append to file failed: ${err}`);
		});
	} catch (err) {
		const error = err as Error;
		console.log(
			`Error in logging errors function\n${error.name} :could not be logged`
		);
		console.error(`Message: ${error.message}`);
		console.error(`Stack: ${error.stack}`);
	}
};
