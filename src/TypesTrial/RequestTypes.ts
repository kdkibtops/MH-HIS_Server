import { InitialData } from '../Models/InitialData';
import { Order } from '../Models/Orders';
import { Patient } from '../Models/Patients';
import { Procedure } from '../Models/Procedures';
import { STATS } from '../Models/Stats';
import { Study } from '../Models/Studies';
import { dbConnectionTestResult } from '../database';
import { dbFile } from '../models_db/dbModel';
import { User } from './../Models/Users';
import {
	LocalAConfig,
	serviceAction,
	serviceStatus,
} from './../config/LocalConfiguration';

export type ResponseBody = {
	authenticated: boolean;
	accessToken: string;
	data: {
		action: string;
		result: string;
		accessToken: string;
		full_name: string;
		username: string;
		user_id: string;
	};
};
export type dataTypes =
	| User[]
	| Order[]
	| Patient[]
	| Study[]
	| dbFile[]
	| Procedure[]
	| dbConnectionTestResult[]
	| InitialData[]
	| { name?: string; path: string }[]
	| { columnName: string; dataType: string }[]
	| {
			hintText: string;
			buttonTitle: string;
			schemaName: string;
			tableName: string;
	  }[]
	| { failed: string[]; succeeded: string[] }[] // updated database response
	| STATS[];

export type dataTypesEntry =
	| User
	| Order
	| Patient
	| Study
	| Procedure
	| dbFile
	| dbConnectionTestResult;

// http://127.0.0.1:5858/users/getuserconfiguration
export type ResponseBodyMain = {
	feedback: serviceStatus;
	enteries: number;
	data: dataTypes;
	accessToken: string;
	action?: serviceAction;
	acceptedPending?: boolean;
	created?: boolean;
	updated?: boolean;
	successful?: boolean;
};

// http://127.0.0.1:5858/users/limitedshowall
// http://127.0.0.1:5858/studies/limitedshowall
// http://127.0.0.1:5858/patients/limitedshowall

let y: ResponseBodyMain = {
	feedback: LocalAConfig.serviceStatus.success,
	enteries: 1,
	data: [
		{
			patient_name: 'NABIH ALI EMAM',
			mrn: '4_693502',
		},
	],
	accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjEyMyIsImlhdCI6MTcwMDEyMTIzNSwiZXhwIjoxNzAwMTM5MjM1fQ.Y0hUyLiAFPI7V4yt3ph-F5ZqTnvu83ERDqj5TQTszBY`,
	// action: "Succeeded",
	action: serviceAction.success,
	successful: true,
};
