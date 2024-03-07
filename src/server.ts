import express from 'express';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import { setupData } from './config/config';
import { dbConnectionTestResult, testDBConncetion } from './database';
import orderHandler from './Handlers/ordersHandler';
import usersHandler from './Handlers/usersHandler';
import patientHandler from './Handlers/patientsHandler';
import studyHandler from './Handlers/studiesHandler';
import filesHandler from './Handlers/FileUploadHandler';
import databaseManipulation from './models_db/dbHandler';

import { refreshAccessToken } from './Authentication/MiddleWares/HandleToken';
import {
	sendServerError,
	sendServiceUnavailableError,
} from './ResponseHandler/ServerError';
import { sendSuccessfulResponse } from './ResponseHandler/SuccessfulResponse';
import path from 'path';
import sendServerConig from './Handlers/sendServerConfigHandler';
import authenticationRoutes from './Authentication/Handlers/AuthenticationHandler';

/**Function to test connection with database */
const DBConnectionTest = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const testResult = await testDBConncetion();
		if (testResult.status === 'Connected') {
			console.log(`Front end db connection test: ${testResult}`);
			sendSuccessfulResponse(res, '', [testResult as dbConnectionTestResult]);
		}
		if (testResult.status === 'Failed') {
			const err: Error = {
				name: 'Database Connection Failed',
				message: `Connection to database ${testResult.returnVal.databaseName} in Enviroment '${testResult.returnVal.enviroment}' is ${testResult.returnVal.connection}`,
				stack: `at Testdb Function in ${path.join(__dirname, '/server.js')}`,
			};
			sendServiceUnavailableError(
				res,
				{ accessToken: '', data: [], action: 'Failed' },
				err as Error
			);
		}
		if (testResult.status === 'Error') {
			sendServerError(
				res,
				{ accessToken: '', data: [], action: 'Failed' },
				testResult.retunVal as Error
			);
		}
	} catch (err) {
		sendServerError(
			res,
			{ accessToken: '', data: [], action: 'failed' },
			err as Error
		);
	}
};

import { networkInterfaces } from 'os';
import proceduresHandler from './Handlers/proceduresHandler';
import initalDataHandler from './Handlers/InitialDataHandler';
import { appendFileSync, existsSync, writeFileSync } from 'fs';
import {
	LocalAConfig,
	updateLoacalConfigJSON,
} from './config/LocalConfiguration';
import updateDB from './syncDatabase';
import StatsHandler from './Handlers/StatsHandler';
import { pushStudy } from './DICOM/DICOMServer';
import DICOMHandler from './DICOM/DICOMHandlers';

let IP;
const nets = networkInterfaces();
for (const name of Object.keys(nets)) {
	if (!name.includes('Loop')) {
		IP = nets[name]?.filter((n) => n.family === 'IPv4')[0].address;
	}
}

const allowedOriginsList = [
	`http://localhost:3000`,
	`http://127.0.0.1:3000`,
	`http://localhost:3000 `,
	'http://128.16.66.2:3000',
	`${setupData.client_url}:${setupData.client_port}`,
	`http://${IP}:${setupData.client_port}`,
];
//Define main server
const radAssitApp = express();
const port = setupData.server_port;
radAssitApp.use(urlencoded({ extended: false })); //body-parser
radAssitApp.use(json()); //body-parser
const corsOptions: cors.CorsOptions = {
	// origin: `http://localhost:3000`,
	// origin: `${setupData.client_url}:${setupData.client_port}`,
	origin: function (origin, callBack) {
		if (allowedOriginsList.indexOf(origin as string) !== -1) {
			console.log(`Main Server: ${origin} allowed`);
			callBack(null, true);
		} else {
			callBack(new Error(`Main server: ${origin} Not allowed by CORS`));
		}
	},
	methods: 'GET, PUT, POST, DELETE, PATCH',
	allowedHeaders: `Access-Control-Allow-Credentials, Credentials, Authorization, Content-Type, Set-Cookie, Content-Disposition , Access-Control-Allow-Methods, Access-Control-Allow-Origin , Access-Control-Allow-Headers, order_id, fileData`,
	// allowedHeaders: `*`,
	credentials: true,
};
radAssitApp.use(cors(corsOptions));
const startServer = () =>
	console.log(`-Reporting assist application started at port: ${port}`);

testDBConncetion();

// Define Authorization server
const authPort = setupData.auth_server_port;
const authServer = express();
authServer.use(urlencoded({ extended: false })); //body-parser
authServer.use(json()); //body-parser
const authCorsOptions: cors.CorsOptions = {
	// origin: `http://localhost:3000`,
	// origin: `${setupData.client_url}:${setupData.client_port}`,
	origin: function (origin, callBack) {
		if (allowedOriginsList.indexOf(origin as string) !== -1) {
			console.log(`Auth Server: ${origin} allowed`);
			callBack(null, true);
		} else {
			callBack(
				new Error(`Authorization server: ${origin} Not allowed by CORS`)
			);
		}
	},
	methods: 'GET, PUT, POST, DELETE, PATCH',
	allowedHeaders: `Access-Control-Allow-Credentials,Credentials, Authorization, Content-Type, Set-Cookie, Content-Disposition , Access-Control-Allow-Methods, Access-Control-Allow-Origin , Access-Control-Allow-Headers`,
	credentials: true,
};

authServer.use(cors(authCorsOptions));
const startAuthServer = () => {
	console.log(`-Authorization server started at port: ${authPort}`);
};

// Define local Folder serving server
const filesServer = express();
const filesServerPort = setupData.files_server_port;
filesServer.use(urlencoded({ extended: false })); //body-parser
// filesServer.use(json()); //body-parser
const fileServerCorsOptions: cors.CorsOptions = {
	//Below is bypass to origin to allow any origin, I don't know why but request preflight
	// has an origin however the request itself is sent with undefined origin
	origin(requestOrigin, callback) {
		console.log(requestOrigin);
		callback(null, true);
	},
	methods: 'GET, PUT, POST, DELETE, PATCH',
	allowedHeaders: `Access-Control-Allow-Credentials,Credentials, Authorization, Content-Type, Set-Cookie, Content-Disposition , Access-Control-Allow-Methods, Access-Control-Allow-Origin , Access-Control-Allow-Headers`,
	credentials: true,
};
filesServer.use(cors(fileServerCorsOptions));

const startFileServer = () => {
	console.log(`-Files server started at port: ${filesServerPort}`);
};

/** Initiate servers */
console.log(`\nServers initiation:`);
/**  Main server */
radAssitApp.listen(port, startServer);
/**  Authorization server */
authServer.listen(authPort, startAuthServer);
/**Files server */
filesServer.use(
	'',
	express.static(path.join(__dirname, '../', 'application_files'))
);
filesServer.listen(filesServerPort, startFileServer);
const getAppConfig = async (req: express.Request, res: express.Response) => {
	sendSuccessfulResponse(res, '', [{ username: 'this is the app config' }]);
};
//Main Routes
const mainRoutes = LocalAConfig.mainRoutes;

radAssitApp.get('/testdb', DBConnectionTest);
radAssitApp.get(mainRoutes.getConfig, getAppConfig);
radAssitApp.use(mainRoutes.files, refreshAccessToken, filesHandler);
radAssitApp.use(mainRoutes.orders, refreshAccessToken, orderHandler);
radAssitApp.use(mainRoutes.studies, refreshAccessToken, studyHandler);
radAssitApp.use(mainRoutes.patients, refreshAccessToken, patientHandler);
radAssitApp.use(mainRoutes.procedures, refreshAccessToken, proceduresHandler);
radAssitApp.use(mainRoutes.users, usersHandler);
radAssitApp.use(mainRoutes.stats, StatsHandler);
radAssitApp.use(mainRoutes.DICOM, DICOMHandler);

// under trial
radAssitApp.use('/getserverconfig', sendServerConig);

// Authorizatiion Routes
authServer.use(mainRoutes.authentication, authenticationRoutes);

radAssitApp.use(mainRoutes.database, databaseManipulation);

setInterval(() => {
	console.log('Updating Database');
	updateDB();
}, 5000);

// Should update the localConfig.json file to the current configuration from the server
updateLoacalConfigJSON();

// The following route handles all the inital data that is essential to run the front end
radAssitApp.use(mainRoutes.initalData, initalDataHandler);

export default radAssitApp;
