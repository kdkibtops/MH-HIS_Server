import jwt from 'jsonwebtoken';
import bcrypt, { genSaltSync } from 'bcrypt';
import {
	AuthenticationReqBody,
	REQBODY,
	// RegisterationReqBody,
} from '../../config/types';
import client from '../../database';
import { setupData } from '../../config/config';
import { User } from '../../Models/Users';
import {
	//  FailedStatus	,
	LocalAConfig,
	serviceStatus,
} from '../../config/LocalConfiguration';
import { text } from 'body-parser';
import { logError } from '../../helpers/errorLogging';
import getPGClient from '../../getPGClient';

const tokenSecret = setupData.JWT_access_secret;

export const showUser = async (
	queryColumn: string,
	queryValue: string
): Promise<User | null> => {
	try {
		const SQL = {
			text: `SELECT * FROM main.users WHERE ${queryColumn} = $1`,
			values: [queryValue],
		};
		const result = await getPGClient(SQL.text, SQL.values, new Error().stack);
		if (result && result.rowCount) {
			delete result.rows[0].user_password;
			return result.rows[0];
		} else {
			return null;
		}
	} catch (error) {
		const err = error as Error;
		console.log(`${err}`);
		logError(err);
		return null;
	}
};

// ------ ! -------- Start of user service functions ------ ! --------

// Register new user
export const registeruser = async (
	reqBody: REQBODY,
	callBackErr?: Function
): Promise<User> => {
	try {
		const tableName = 'users';

		const hashedPassword =
			reqBody.users.user_password &&
			bcrypt.hashSync(reqBody.users.user_password, genSaltSync());
		reqBody.users.user_password = hashedPassword;
		let enteries = Object.entries(reqBody);
		const columnNames = enteries.map((e) => e[0]);
		const values = enteries.map((e) => e[1]);
		columnNames.push('created');
		const newValues = [...values, new Date().toISOString()];
		// values.push(new Date().toISOString());
		const valuesSQL = newValues.map((val) => `'${val}'`);
		const SQL = `INSERT INTO main.${tableName} 
            (${[...columnNames]})
            VALUES  
            (${valuesSQL})
            RETURNING
            *;
            `;
		const conn = await client.connect();
		const rawResult = await client.query(SQL);
		conn.release();
		const result = rawResult.rows[0];
		const response: User = {
			ind: result.ind,
			full_name: result.full_name,
			username: result.username,
		};
		return response;
	} catch (error) {
		console.log(`${error}`);
		return {
			username: '',
			ind: 0,
		};
	}
};

// ------ ! -------- Start of authentication service functions ------ ! --------

/**Checks users credentials against database, if correct it will supply JWT to response
 * JWT can be stored in localstorage or cookie for further sign in
 * */
export async function authentication(
	reqBody: AuthenticationReqBody,
	callBackErr?: Function
): Promise<
	| {
			result: true;
			accessToken: string;
			full_name: string;
			username: string;
			user_id: string;
			users_ind: number;
			user_role: string;
			job: string;
	  }
	| { result: null; message: string }
	| { result: false; message: string }
	| { result: serviceStatus.failed }
> {
	try {
		/**Return null if res.status is sent to avoid resetting headers */
		const authUser = await authenticateUser(
			reqBody,
			callBackErr && callBackErr
		);
		if (authUser.authStatus === true) {
			return {
				result: authUser.authStatus,
				accessToken: authUser.jwt,
				full_name: authUser.full_name,
				username: authUser.username,
				user_id: authUser.user_id,
				users_ind: authUser.users_ind,
				user_role: authUser.user_role,
				job: authUser.job,
			};
		} else if (authUser.authStatus === false && !authUser.err) {
			if (authUser.username) {
				return {
					result: null,
					message: LocalAConfig.errorMessages.toSendMessages.wrongPassword,
				};
			} else {
				return {
					result: null,
					message: LocalAConfig.errorMessages.toSendMessages.usernameNotFound,
				};
			}
		} else {
			return { result: LocalAConfig.serviceStatus.failed };
		}
	} catch (error) {
		if (callBackErr) {
			callBackErr(error as Error);
			return { result: LocalAConfig.serviceStatus.failed };
		} else {
			console.log(`Error: ${error}`);
			return { result: LocalAConfig.serviceStatus.failed };
		}
	}
}

/**Check if user is authenticated, supply JWT to response body to be pass to req.header later on
 * @returns {{ jwt: string; full_name: string; username: string; authStatus: true }}: if success
 * @returns {{ jwt: ''; full_name: null; username: null; authStatus: false }}: if username is not found
 * @returns {{ jwt: ''; full_name: string; username: string; authStatus: false }}:  if password is incorrect
 * @returns {{ authStatus: false; message: 'Unknown error' }}:  if other errors
 */
export async function authenticateUser(
	reqBody: AuthenticationReqBody,
	callBackErr?: Function
): Promise<
	| {
			jwt: string;
			full_name: string;
			user_id: string;
			users_ind: number;
			username: string;
			user_role: string;
			job: string;
			authStatus: true;
			err: null;
	  }
	| {
			jwt: '';
			full_name: null;
			user_id: null;
			users_ind: null;
			username: null;
			authStatus: false;
			err: null;
	  }
	| {
			jwt: '';
			full_name: string;
			user_id: string;
			users_ind: null;
			username: string;
			authStatus: false;
			err: null;
	  }
	| { authStatus: false; username: null; message: 'Unknown error'; err: Error }
> {
	const username: string = reqBody.username?.toLowerCase() as string;
	const password: string = reqBody.user_password as string;
	const auth = await authenticate(
		username,
		password,
		callBackErr && callBackErr
	);
	console.log(`'${username}' authenticated: ${auth.status}`);
	console.log(bcrypt.hashSync(password, genSaltSync()));
	if (auth.status === true) {
		const BEARER_JWT = jwt.sign({ ...auth }, tokenSecret, {
			expiresIn: LocalAConfig.tokenExpiry,
		});
		const JWT: {
			jwt: string;
			full_name: string;
			user_id: string;
			users_ind: number;
			username: string;
			user_role: string;
			job: string;
			authStatus: true;
			err: null;
		} = {
			jwt: BEARER_JWT,
			full_name: auth.full_name as string,
			user_id: auth.user_id as string,
			users_ind: auth.users_ind as number,
			username: username,
			user_role: auth.user_role as string,
			job: auth.job as string,
			authStatus: auth.status,
			err: null,
		};
		return JWT;
	} else if (auth.status === false && auth.full_name === null) {
		return {
			jwt: '',
			full_name: null,
			user_id: null,
			users_ind: null,
			username: null,
			authStatus: false,
			err: null,
		};
	} else if (auth.status === false) {
		return {
			jwt: '',
			full_name: auth.full_name as string,
			user_id: auth.user_id as string,
			users_ind: null,
			username: auth.username as string,
			authStatus: false,
			err: null,
		};
	} else {
		return {
			authStatus: false,
			username: null,
			message: 'Unknown error',
			err: new Error('Unknown error in authenticating the user'),
		};
	}
}

/** Compares user input password with password in DB and returns boolean DEBUGGED AND WORKING*/
export async function authenticate(
	username: string,
	password: string,
	callBackErr?: Function
): Promise<{
	status: boolean;
	full_name: string | null;
	user_id: string | null;
	users_ind: number | null;
	username: string | null;
	user_role?: string | null;
	job?: string | null;
}> {
	try {
		const sql = {
			text: `SELECT ind, user_id, user_password,full_name,username,user_role, job, email from main.users WHERE LOWER (username) = LOWER($1);`,
			values: [username],
		};
		const result = await getPGClient(sql.text, sql.values, new Error().stack);
		if (!result || result.rowCount === 0) {
			// username is not found
			return {
				status: false,
				full_name: null,
				user_id: null,
				users_ind: null,
				username: username,
			};
		} else {
			// username is found
			const pass_digest = result.rows[0].user_password;
			const { ind, user_id, full_name, user_role, job } = result.rows[0];
			const authenticated: boolean = bcrypt.compareSync(password, pass_digest);
			return {
				status: authenticated, //true if authenticated, false if not authenticated
				full_name: full_name, // will always return the full name
				user_id: user_id, // will always return the user_id
				users_ind: ind, // will always return the users_ind
				username: result.rows[0].username, // will always return the username
				user_role: user_role,
				job: job,
			};
		}
	} catch (error) {
		const err = error as Error;
		err.name = LocalAConfig.errorNames.authenticationError;
		if (callBackErr) {
			callBackErr(err);
		} else {
			console.log(`${error}`);
		}
		return {
			status: false,
			full_name: '',
			user_id: '',
			username: username,
			users_ind: null,
		};
	}
}

// ------ ! -------- End of authentication service functions ------ ! --------
