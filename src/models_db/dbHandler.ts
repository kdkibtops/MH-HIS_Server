import client from '../database';
import { Request, Response, Router } from 'express';
import {
	sendAcceptedCreatedResponse,
	sendAcceptedNoContentResponse,
	sendAcceptedUpdatedResponse,
	sendSuccessfulResponse,
} from '../ResponseHandler/SuccessfulResponse';
import formidable from 'formidable';
import path from 'path';
import { existsSync, mkdirSync, readdirSync, rmdirSync, unlinkSync } from 'fs';
import {
	allowedBulkUploadTables,
	creatTemplateCSVFile,
	dbUpdate_fromCSV,
	getTableColumnsFromDatabase,
} from './dbModel';
import {
	sendBadRequestResponse,
	sendNotFoundResponse,
} from '../ResponseHandler/ClientError';
import {
	LocalAConfig,
	serviceAction,
	serviceStatus,
} from '../config/LocalConfiguration';
import { sendServerError } from '../ResponseHandler/ServerError';

/**
 *
 * @param req request
 * @param res response
 * It recieves call from the client to update the database from the available csv files in the target folder then updates and replies to the client
 */
const updateDatabase = async (req: Request, res: Response) => {
	const newToken = req.body.token || '';
	try {
		const { schemaName, tableName, folderPath } = req.params;
		const foldPath = path.join(
			__dirname,
			'../../application_files/csv/',
			folderPath as string
		);
		const updateDatabase = await dbUpdate_fromCSV(foldPath, (err: Error) => {
			sendBadRequestResponse(
				res,
				{
					accessToken: newToken,
					data: { message: err.message },
					action: LocalAConfig.serviceAction.failed,
				},
				err
			);
		});
		if (updateDatabase.feedback === LocalAConfig.serviceStatus.success) {
			console.log(updateDatabase.feedback);
			sendAcceptedUpdatedResponse(res, newToken, updateDatabase.data);
		}
	} catch (error) {
		const err = error as Error;
		sendServerError(
			res,
			{
				accessToken: newToken,
				action: LocalAConfig.serviceAction.failed,
				data: { message: err.message },
			},
			err as Error
		);
	}
};
const importDataHandler = async (req: Request, res: Response) => {
	const newToken = req.body.token || '';
	try {
		const { schemaName, tableName, folderPath } = req.params;
		const csvFIlesPath = path.join(
			__dirname,
			'../../application_files/csv/',
			(folderPath as string) || 'undefined'
		);
		if (!existsSync(csvFIlesPath)) {
			mkdirSync(csvFIlesPath, { recursive: true });
		}
		const form = formidable({
			uploadDir: csvFIlesPath,
			multiples: true,
			keepExtensions: true,
			filename: (name, ext, part, form) => {
				let fileName = `${schemaName}-${tableName}`;
				return `${fileName}${ext}`;
			},
		});
		// Function is important to parse the form and save the file
		form.parse(req, (err, fields, files) => {});
		// Function when file is saved to storage
		form.on('file', async (form, file) => {
			console.log('CSV file saved success');
			return sendAcceptedCreatedResponse(res, newToken, [
				{ path: csvFIlesPath, fileName: file.filepath },
			]);
		});
	} catch (error) {
		const err = error as Error;
		sendServerError(
			res,
			{
				accessToken: newToken,
				action: LocalAConfig.serviceAction.failed,
				data: { message: err.message },
			},
			err as Error
		);
	}
};
const revertImportHadnler = async (req: Request, res: Response) => {
	const newToken = req.body.token || '';
	try {
		const { schemaName, tableName } = req.params;

		console.log('reverting');
		const fileName = `${schemaName}-${tableName}`;
		const csvFIlesPath = path.join(
			__dirname,
			'../../application_files/csv/',
			req.params.folderPath as string,
			`${fileName}.csv`
		);
		console.log(csvFIlesPath);
		if (existsSync(csvFIlesPath)) {
			unlinkSync(csvFIlesPath);
			const folderPath = path.join(
				__dirname,
				'../../application_files/csv/',
				req.params.folderPath as string
			);
			const filesRemaining = readdirSync(folderPath);
			if (filesRemaining.length === 0) {
				rmdirSync(folderPath);
				console.log('delete folder success');
			}
		}
		sendAcceptedNoContentResponse(res, newToken);
	} catch (error) {
		sendServerError(
			res,
			{ accessToken: newToken, data: [], action: serviceStatus.failed },
			error as Error
		);
	}
};
const cleanTemp = async (req: Request, res: Response) => {
	const newToken = req.body.token || '';
	try {
		const folderPath = path.join(
			__dirname,
			'../../application_files/csv/',
			req.params.folderPath as string
		);
		console.log(folderPath);
		if (existsSync(folderPath)) {
			console.log('folder found');
			const fileNames = readdirSync(folderPath);
			fileNames.forEach((file) => {
				unlinkSync(path.join(folderPath, file));
				console.log(`removed ${file}`);
			});

			rmdirSync(folderPath);
			console.log('delete folder success');
		}
	} catch (error) {
		const err = error as Error;
		sendServerError(
			res,
			{
				accessToken: newToken,
				action: LocalAConfig.serviceAction.failed,
				data: { message: err.message },
			},
			err as Error
		);
	}
	res.sendStatus(204);
};

const uploadAndUpdate = async (req: Request, res: Response) => {
	const csvFIlesPath = path.join(
		__dirname,
		'../../application_files/csvFiles',
		new Date().toISOString().replaceAll(':', '_')
	);
	if (!existsSync(csvFIlesPath)) {
		mkdirSync(csvFIlesPath, { recursive: true });
	}
	const form = formidable({
		uploadDir: csvFIlesPath,
		multiples: true,
		keepExtensions: true,

		filename: (name, ext, part, form) => {
			let fileName;
			switch (req.params.dataTable) {
				case 'studies':
					fileName = 'stu';
					break;
				case 'orders':
					fileName = 'ord';
					break;
				case 'patients':
					fileName = 'pat';
					break;
				default:
					fileName = 'newFile';
					break;
			}

			return `${fileName}${ext}`;
		},
	});
	// Function is important to parse the form and save the file
	form.parse(req, (err, fields, files) => {});
	// Function when file is saved to storage
	form.on('file', async (form, file) => {
		console.log('CSV file saved success');
		res.status(200).send(file.filepath);
	});
	const newToken = req.body.token || '';
	const SQL = `
	CREATE TEMP TABLE temp_table (
		"mrn" varchar(20) PRIMARY KEY,
		"patient_name" varchar(100),
		"national_id" varchar(14),
		"dob" varchar(50),
		"age" varchar,
		"gender" varchar,
		"contacts" varchar,
		"email" varchar(150),
		"registered_by" varchar(50),
		"registered_date" varchar
	  )
	  COPY temp_table (mrn,patient_name,national_id,dob,age,gender,contacts,email,registered_by,registered_date) FROM 'e:/My_projects/csv/2-9-2023/pat.csv'  DELIMITER',' 
	  CSV 
	  HEADER 
	  ENCODING 'UTF-8';
	  INSERT INTO main.patients 
	  (mrn,patient_name,national_id,dob,age,gender,contacts,email,registered_by,registered_date)
	  SELECT * FROM temp_table ON CONFLICT DO NOTHING
	`;
	const conn = await client.connect();
	const result = await conn.query(SQL);
	conn.release();
	return sendAcceptedNoContentResponse(res, newToken);
};
const getColumnNames = async (req: Request, res: Response) => {
	const newToken = req.body.token || '';

	try {
		const { schemaName, tableName } = req.params;
		const result = await getTableColumnsFromDatabase(schemaName, tableName);
		if (!result.err) {
			if (result.data.length > 0)
				sendSuccessfulResponse(res, newToken, result.data, 1);
			if (result.data.length === 0)
				sendNotFoundResponse(
					res,
					{
						accessToken: newToken,
						data: ['table not found'],
						action: serviceAction.failed,
					},
					new Error('Table not found')
				);
		} else {
			sendBadRequestResponse(
				res,
				{
					accessToken: newToken,
					data: result.data,
					action: serviceAction.failed,
				},
				result.err
			);
		}
	} catch (error) {
		sendServerError(
			res,
			{ accessToken: newToken, data: [], action: serviceAction.failed },
			error as Error
		);
	}
};
const getTemplateCSV = async (req: Request, res: Response) => {
	const newToken = req.body.token || '';
	try {
		console.log('download file');
		const { schemaName, tableName } = req.params;
		creatTemplateCSVFile(schemaName, tableName, res);
	} catch (error) {
		sendServerError(
			res,
			{ accessToken: newToken, data: [], action: serviceAction.failed },
			error as Error
		);
	}
};
const sendAllowedBulkUpload = async (req: Request, res: Response) => {
	const newToken = req.body.token || '';
	console.log(allowedBulkUploadTables);
	sendAcceptedUpdatedResponse(res, newToken, allowedBulkUploadTables);
};

const databaseManipulation = Router();
databaseManipulation.get('/updateDatabase/:folderPath', updateDatabase);
databaseManipulation.get('/cleantemp/:folderPath', cleanTemp);
databaseManipulation.post(
	'/importData/:schemaName/:tableName/:folderPath',
	importDataHandler
);
databaseManipulation.get(
	'/revert-import/:schemaName/:tableName/:folderPath',
	revertImportHadnler
);
databaseManipulation.get(
	'/getcolumnsnames/:schemaName/:tableName',
	getColumnNames
);
databaseManipulation.get('/getallowedbulkupload', sendAllowedBulkUpload);
databaseManipulation.get('/gettemplate/:schemaName/:tableName', getTemplateCSV);
export default databaseManipulation;
