import express from 'express';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import { setupData } from './config/config';
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
import authenticationRoutes from './Authentication/Handlers/AuthenticationHandler';
import { networkInterfaces } from 'os';
import proceduresHandler from './Handlers/proceduresHandler';
import initalDataHandler from './Handlers/InitialDataHandler';
import { LocalAConfig } from './config/LocalConfiguration';
import updateDB from './syncDatabase';
import StatsHandler from './Handlers/StatsHandler';
import DICOMHandler from './DICOM/DICOMHandlers';
import { existsSync, readFileSync } from 'fs';
import https from 'https';
import sendServerConig from './Handlers/sendServerConfigHandler';
import { dbConnectionTestResult, testDBConnection } from './database';
import { startDICOMDCME } from './DICOM/DICOMServer';

/**Function to test connection with database */
const DBConnectionTest = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const testResult = await testDBConnection();
		if (testResult.status === 'Connected') {
			console.log(`Front end db connection test: ${testResult}`);
			sendSuccessfulResponse(
				res,
				'',
				[testResult as dbConnectionTestResult],
				1
			);
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
testDBConnection();
startDICOMDCME();

let IP;
const nets = networkInterfaces();
for (const name of Object.keys(nets)) {
	if (!name.includes('Loop')) {
		IP = nets[name]?.filter((n) => n.family === 'IPv4')[0].address;
	}
}
console.log(`Server IP: ${IP}`);
console.log(`HTTP URL: ${setupData.client_url}:${setupData.client_port}`);
console.log(
	`HTTPS URL: ${setupData.https_client_url}:${setupData.client_port}`
);
const allowedOriginsList = [
	`http://localhost:3000`,
	`http://127.0.0.1:3000`,
	`http://localhost:3000 `,
	'http://128.16.66.2:3000',
	`${setupData.client_url}:${setupData.client_port}`,
	`${setupData.https_client_url}:${setupData.client_port}`,
	`http://${IP}:${setupData.client_port}`,
	`https://${IP}:${setupData.client_port}`,
];
/**Creates Cors options for applications */
const createCorsOptions = (serverName: string) => {
	const corsOptions: cors.CorsOptions = {
		origin: function (origin, callBack) {
			if (allowedOriginsList.indexOf(origin as string) !== -1) {
				console.log(`${serverName} Server: ${origin} allowed`);
				callBack(null, true);
			} else {
				callBack(
					new Error(`${serverName} Server: ${origin} Not allowed by CORS`)
				);
			}
		},
		methods: 'GET, PUT, POST, DELETE, PATCH',
		allowedHeaders: `Access-Control-Allow-Credentials, Credentials, Authorization, Content-Type, Set-Cookie, Content-Disposition , Access-Control-Allow-Methods, Access-Control-Allow-Origin , Access-Control-Allow-Headers,fileData`,
		credentials: true,
	};
	return corsOptions;
};
//Define main application
const radAssitApp = express();
radAssitApp.use(urlencoded({ extended: false })); //body-parser
radAssitApp.use(json()); //body-parser
radAssitApp.use(cors(createCorsOptions('Main HTTP')));
// Define Authorization application
const authServer = express();
authServer.use(urlencoded({ extended: false })); //body-parser
authServer.use(json()); //body-parser
authServer.use(cors(createCorsOptions('Authorization HTTP')));
// Define DICOM application
const DICOMApp = express();
DICOMApp.use(urlencoded({ extended: false }));
DICOMApp.use(json());
// DICOMApp.use(cors(createCorsOptions('DICOM Listener')));
DICOMApp.get('/event', (req, res) => {
	updateDB();
	res.status(200).send('Updating databse');
});

/** Define HTTPS Application */
const keyFile = path.join(__dirname, '../', 'ssl', 'radassist-privateKey.key');
const certFile = path.join(__dirname, '../', 'ssl', 'radassist.crt');
/** Check SSL files are present */
if (!existsSync(keyFile) || !existsSync(certFile)) {
	console.log('SSL files not found');
}
/**Define HTTPS server options */
const httpsOptions = {
	key: readFileSync(keyFile),
	cert: readFileSync(certFile),
};
/**Define HTTPS main application */
const mainServerHTTPS = https.createServer(httpsOptions, radAssitApp);
/**Define HTTPS Authorization application */
const authServerHTTPS = https.createServer(httpsOptions, authServer);

/**Call back function for starting servers */
const startServerCallback = (serverName: string, port: number) =>
	console.log(`${serverName} connected to ${port}`);

//Main Routes
const mainRoutes = LocalAConfig.mainRoutes;
//Main Routes
radAssitApp.get('/testdb', DBConnectionTest);
radAssitApp.use(mainRoutes.files, refreshAccessToken, filesHandler);
radAssitApp.use(mainRoutes.orders, refreshAccessToken, orderHandler);
radAssitApp.use(mainRoutes.studies, refreshAccessToken, studyHandler);
radAssitApp.use(mainRoutes.patients, refreshAccessToken, patientHandler);
radAssitApp.use(mainRoutes.procedures, refreshAccessToken, proceduresHandler);
radAssitApp.use(mainRoutes.users, usersHandler);
radAssitApp.use(mainRoutes.stats, StatsHandler);
radAssitApp.use(mainRoutes.DICOM, DICOMHandler);
radAssitApp.use(mainRoutes.database, databaseManipulation);
// Authorizatiion Routes
authServer.use(mainRoutes.authentication, authenticationRoutes);
// The following route handles all the inital data that is essential to run the front end
radAssitApp.use(mainRoutes.initalData, initalDataHandler);

// // under trial
radAssitApp.use('/getserverconfig', sendServerConig);

export {
	radAssitApp,
	authServer,
	mainServerHTTPS,
	authServerHTTPS,
	DICOMApp,
	startServerCallback,
};
