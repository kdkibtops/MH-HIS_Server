// THis file need to be synchronized with the localConfig.json file, both must always include the same data exactly
// otherwise the application will crash

import { appendFileSync, readFileSync } from 'fs';
import path from 'path';

export const UID_Columns = [
	'mrn',
	'username',
	'user_id',
	'study_id',
	'order_id',
];
export const arrayColumns = []; //put here the columns that needs to be inserted as array
export const JSONData = [
	'user_config',
	'uploads',
	'role_privileges',
	'paperwork',
]; //put here the columns that needs to be inserted as JSON

export enum serviceStatus {
	success = 'success',
	failed = 'failed',
}
export enum serviceAction {
	created = 'Created',
	updated = 'Updated',
	deleted = 'Deleted',
	success = 'Succeeded',
	failed = 'Failed',
	pending = 'pending',
}

import localconfiguration from './localConfig.json';

// Logic is added that:
// Any addition either in the JSON file or this ts file will be syncronized,
// Any change in values, this ts file will domninate
// Any delete must be done manually in both files

export const LocalAConfig = {
	...localconfiguration.LocalAConfig,
	dataTimeConfig: { DayLightTimeSaving: true },
	successfulMessages: {},
	errorMessages: {
		logMessages: {
			objectNotFoundInRequestBody: {
				userNotFoundAuth:
					'Bad Request, User {} is not found in the Authorization request body',
				userNotFound: 'Bad Request, User {} is not found in the request body',
				patientNotFound:
					'Bad Request, patient {} is not found in the request body',
				studyNotFound: 'Bad Request, study {} is not found in the request body',
				orderNotFound: 'Bad Request, order {} is not found in the request body',
				queryNotFound: 'Bad Request, query {} is not found in the request body',
				customObjNotFound: (obj: string) =>
					`Bad Request, ${obj} {} is not found in the request body`,
			},
			AuthorizationError: {
				badAuthRequest: '',
				authenticationFailed: 'Authenticatiion failed',
				authorizationFailed: 'Authorization failed',
				JWTisNull: 'JWT is null || not send in Authorization Header',
			},
			constraintNotFound: {
				userNotFound:
					'Due to F-Key constraint in database, request will fail becasue username is not found in the users table in database',
				patientNotFound:
					'Due to F-Key constraint in database, request will fail becasue patient mrn is not found in the patients table in database',
				studyNotFound:
					'Due to F-Key constraint in database, request will fail becasue study_id is not found in the studies table in database',
			},
			userAlreadyPresentInDB: 'Username already present in the database',
			canNotMessages: (txt: string) => `Can't ${txt}`,
			unknownError: (txt: string) => `Unknown error in ${txt}`,
		},
		toSendMessages: {
			UIDNotPresentInDatabase: (obj: string, UID: string) =>
				`Bad Request, ${obj}: ${UID} is not found in the  database`,
			BadRequest: 'Bad request sent to the server',
			badAuthRequest: '',
			authError: 'Authentication Error',
			tokenIsNull: 'Authorization headers are not provided properly',
			usernameNotFound: 'username not found',
			wrongPassword: 'Wrong password',
			notVerified: 'JWT not verified',
			userAlreadyPresentInDB: `Username is already present in database, try "Logging in" if registered, otherwise choose another username`,
			unknownError: (err: string) => `Unknown error in ${err}`,
		},
		systemMessages: {
			accessDenied: `Wrong password, Access denied`,
		},
	},
	errorNames: {
		badReuest: {
			improperConstruction: 'Immproperly Contructed Authentication Request',
			userAlreadyPresentInDB: 'Username already present',
		},
		wrongCredentials: 'Wrong credentials',
		jwtVerificationError: 'JWT Verification Error',
		JWTisNull: 'JWT is null Error',
		refreshJWTError: 'Error in JWT refresh function',
		authenticationError: 'Authentication Error',
		unknownError: `Unknown error `,
	},
	serviceStatus: serviceStatus,
	serviceAction: serviceAction,
	mainRoutes: {
		procedures: '/procedures',
		users: '/users',
		patients: '/patients',
		orders: '/orders',
		studies: '/studies',
		authentication: '/auth',
		database: '/db',
		getConfig: '/getconfig',
		files: '/files',
		initalData: '/initial',
		stats: '/stats',
		DICOM: '/dicom',
	},
	routes: {
		insert: '/insert',
		update: '/update',
		delete: '/delete',
		showAll: '/index',
		limitedShowAll: '/limitedshowall',
		showAllOnCriteria: '/searchoncriteria',
		showOne: '/showone',
		query: '/query',
		authenticate: '/authenticate',
		verifyToken: '/verifytoken',
		refreshJWT: '/refjwt',
		betaQuery: '/query',
		getUserConfiguration: '/getuserconfiguration',
		updateUserConfiguration: '/updateuserconfiguration',
		uploadDocument: '/uploadDocument',
		deleteDocument: '/deletedocument',
	},
	tokenExpiry: '300m',
	authenticatedHomePageServices: [
		{
			icon: 'fa-solid fa-book-medical fa-fw fa-2x',
			path: 'orders',
			text: 'Orders',
		},
		{
			icon: 'fa-solid fa-x-ray fa-fw fa-2x',
			path: 'studies',
			text: 'Studies',
		},
		{
			icon: 'fa-solid fa-bed-pulse fa-fw fa-2x',
			path: 'patients',
			text: 'Patients',
		},
		{
			icon: 'fa-solid fa-user-doctor fa-fw fa-2x',
			path: 'radiologists',
			text: 'Radiologists',
		},
		{
			icon: 'fa-solid fa-circle-h fa-fw fa-2x',
			path: 'clinics',
			text: 'Clinics',
		},
		{
			icon: 'fa-solid fa-syringe fa-fw fa-2x',
			path: 'intervention_radiology',
			text: 'IR',
		},
		{
			icon: 'fa-solid fa-user-tie fa-fw fa-2x',
			path: 'users',
			text: 'Users',
		},
		{
			icon: 'fa-solid fa-code fa-fw fa-2x',
			path: 'test',
			text: 'Test',
		},
		{
			icon: 'fa-solid fa-database fa-fw fa-2x',
			path: 'update_database',
			text: 'Bulk upload',
		},
		{
			icon: 'fa-solid fa-chart-line fa-fw fa-2x',
			path: 'stats',
			text: 'Statistics',
		},
	],
};
export const DBTablesMap = {
	...localconfiguration.DBTablesMap,
	users: {
		shcema: 'main',
		tableName: 'users',
		UID_Column: 'username',
		paperworkColumn: 'paperwork',
	},
	patients: {
		shcema: 'main',
		tableName: 'patients',
		UID_Column: 'mrn',
		paperworkColumn: 'paperwork',
	},
	studies: {
		shcema: 'main',
		tableName: 'studies',
		UID_Column: 'study_id',
		paperworkColumn: 'paperwork',
	},
	orders: {
		shcema: 'main',
		tableName: 'orders',
		UID_Column: 'order_id',
		paperworkColumn: 'paperwork',
	},
	user_roles: {
		shcema: 'main',
		tableName: 'user_roles',
		UID_Column: 'role_id',
		paperworkColumn: 'paperwork',
	},
	clinics: {
		shcema: 'main',
		tableName: 'clinics',
		UID_Column: 'clinic_id',
		paperworkColumn: 'paperwork',
	},
	procedures: {
		shcema: 'main',
		tableName: 'procedures',
		UID_Column: 'procedure_id',
		paperworkColumn: 'paperwork',
	},
	materials: {
		shcema: 'inventory',
		tableName: 'materials',
		UID_Column: 'item_id',
		paperworkColumn: 'paperwork',
	},
	inventory_categories: {
		shcema: 'inventory',
		tableName: 'categories',
		UID_Column: 'category_id',
		paperworkColumn: 'paperwork',
	},
	transactions: {
		shcema: 'inventory_',
		tableName: 'transactions',
		UID_Column: 'transaction_id',
		paperworkColumn: 'paperwork',
	},
	item_movements: {
		shcema: 'inventorydasd',
		tableName: 'item_movements',
		UID_Column: 'movement_id',
		paperworkColumn: 'paperwork',
	},
};

const localConfigObject = {
	UID_Columns,
	arrayColumns,
	JSONData,
	serviceAction,
	serviceStatus,
	LocalAConfig,
	DBTablesMap,
};

export const updateLoacalConfigJSON = async () => {
	try {
		console.log('....Updating local config JSON file');
		const jsconfigurationFile = path.join(__dirname, 'localConfig.json');
		const tsDirname = __dirname.replace('dist', 'src');
		const tsConfigurationFile = path.join(tsDirname, 'localConfig.json');
		const data = { ...localconfiguration, LocalAConfig, DBTablesMap };
		try {
			const jsonData = readFileSync(tsConfigurationFile, {
				flag: 'r',
				encoding: 'utf8',
			});
			const stringifiedData = JSON.stringify(data);
			if (jsonData !== stringifiedData) {
				console.log('Detected change in data... updating file');
				appendFileSync(jsconfigurationFile, JSON.stringify(data), {
					flag: 'w',
				});
				console.log(`Updating js local configuration succeeded`);

				appendFileSync(tsConfigurationFile, JSON.stringify(data), {
					flag: 'w',
				});
				console.log(`Updating ts local configuration succeeded`);
			} else if (jsonData === stringifiedData) {
				console.log('No change detected');
			}
		} catch (error) {
			const err = error as Error;
			console.error(` Error: ${err.name}`);
			console.error(` Message: ${err.message}`);
			console.error(` Stac: ${err.stack}`);
		}
	} catch (error) {
		console.error('Server local configuration could not be updated');
	}
};
