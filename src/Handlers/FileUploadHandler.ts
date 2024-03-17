import { Request, Response, Router } from 'express';
import {
	existsSync,
	mkdirSync,
	readdirSync,
	unlinkSync,
	rmdirSync,
	unlink,
	rmdir,
} from 'fs';
import path from 'path';
import formidable, { errors as formidableErrors } from 'formidable';
// import fs from 'fs';
import {
	deletePathFromDB,
	genericInsertPathToDB,
	getOrderPatientData,
	insertPathToDB,
} from '../Models/FileUpload';
import { sendBadRequestResponse } from '../ResponseHandler/ClientError';
import { serviceAction } from '../config/LocalConfiguration';
export type OrderReport = {
	ind: number;
	order_ind: number;
	order_id: string;
	paperwork_name: string;
	paperwork_path: string;
	updated_by: string;
	last_update: string;
	category: string | null;
};

async function uploadFile(req: Request, res: Response) {
	try {
		// order_id will be either present as a param or in the request headers: order_id
		const { orderind, fileName, category } = req.params;
		const { order, patient } = await getOrderPatientData(Number(orderind));
		if (order === null || patient === null) {
			res.json({ status: 'Failed', enteries: 0, data: [] }).status(400);
			return;
		}
		const uploadFilePath = path.join(
			__dirname,
			'../../application_files/orders/reports'
		);
		const patientRootFolderPath = path.join(uploadFilePath, `${patient.mrn}`);
		const orderRootFolderPath = path.join(
			patientRootFolderPath,
			order.order_id
		);
		if (!existsSync(orderRootFolderPath)) {
			mkdirSync(orderRootFolderPath, { recursive: true });
		}
		const form = formidable({
			uploadDir: orderRootFolderPath,
			multiples: true,
			keepExtensions: true,
			filename: (name, ext, part, form) => {
				return `${name.replaceAll(' ', '_')}_${new Date()
					.toISOString()
					.replaceAll(':', '_')}${ext}`;
			},
		});
		// Function is important to parse the form and save the file
		form.parse(req, (err, fields, files) => {});
		// Function when file is saved to storage
		form.on('file', async (form, file) => {
			const pathSavedToDb = await insertPathToDB(
				Number(orderind),
				order.order_id,
				file.filepath,
				fileName,
				category
			);
			res
				.status(pathSavedToDb ? 200 : 400)
				.json(pathSavedToDb ? pathSavedToDb : null);
		});
	} catch (error) {
		console.log(`Error at uploadFile in uploadHandler: ${error}`);
		res.status(400);
	}
}

async function deleteFIle(req: Request, res: Response) {
	try {
		const report = req.body.report as OrderReport;
		if (existsSync(report.paperwork_path)) {
			unlinkSync(report.paperwork_path);
		}
		const reportDeleted = await deletePathFromDB(report);
		if (reportDeleted) {
			const orderFolder = path.dirname(report.paperwork_path);
			const patientFolder = path.dirname(orderFolder);
			const reports = readdirSync(orderFolder);
			if (reports.length === 0) {
				rmdirSync(orderFolder);
			}
			const ordersWithReports = readdirSync(patientFolder);
			if (ordersWithReports.length === 0) {
				rmdirSync(patientFolder);
			}
			res.json({ data: report }).status(200);
		} else {
			sendBadRequestResponse(
				res,
				{
					accessToken: '',
					data: { message: 'Report not found in DB' },
					action: serviceAction.failed,
				},
				new Error('Report not found in DB')
			);
		}
	} catch (error) {
		res.status(400);
	}
}

/** Function to donwload the file to the frontend, file.path is the only mandatory field*/
async function downloadFile(req: Request, res: Response) {
	try {
		const file = req.body.file.path;
		const parsedPath = path.parse(file);
		const filePath = path.join(path.join(parsedPath.dir, parsedPath.base));
		res.status(200).sendFile(filePath);
	} catch (error) {
		res.status(400);
	}
}

/**Handles uploading reports to orders only
 * @param Request body should contain {schema_name:string; table_name:string; UID_column:string;f ileColumnInDB:string; parent_folder_name:string; UID:string; UID2:string;}
 *
 * The above data are mandatory, UID2 is the only param that could be omitted, all the other params are madnatory
 */
async function genericUploadFile(req: Request, res: Response) {
	try {
		const fileData = JSON.parse(req.header('fileData') as string);
		const {
			schema_name,
			table_name,
			UID_column,
			UID,
			parent_folder_name,
			fileColumnInDB,
			UID2,
			fileKeyName,
			replacePrevious,
		} = fileData;

		const applicationFilesFolder = path.join(
			__dirname,
			`../../application_files`
		);
		const parentUploadPath = path.join(
			applicationFilesFolder,
			`/${parent_folder_name}`
		);
		let rootFolderPath = path.join(parentUploadPath, `${UID}`);
		if (UID2) {
			rootFolderPath = path.join(rootFolderPath, UID2 as string);
		}
		if (!existsSync(rootFolderPath)) {
			mkdirSync(rootFolderPath, { recursive: true });
		}

		const form = formidable({
			uploadDir: rootFolderPath,
			multiples: true,
			keepExtensions: true,
			filename: (name, ext, part, form) => {
				return `${name.replaceAll(' ', '_')}_${new Date()
					.toISOString()
					.replaceAll(':', '_')}${ext}`;
			},
		});
		// Function is important to parse the form and save the file
		form.parse(req, (err, fields, files) => {});
		// Function when file is saved to storage
		form.on('file', async (form, file) => {
			console.log(file.filepath.split(applicationFilesFolder)[1]);
			const pathSavedToDb = await genericInsertPathToDB(
				schema_name,
				table_name,
				UID_column as string,
				UID as string,
				fileColumnInDB as string,
				fileKeyName as string,
				file.filepath.split(applicationFilesFolder)[1],
				replacePrevious,
				applicationFilesFolder
			);
			res.status(200).send(file.filepath.split(applicationFilesFolder)[1]);
		});
	} catch (error) {
		console.log(`Error at genericUploadFile in uploadHandler: ${error}`);
		res.status(400);
	}
}

/**Under development */
/** Function to donwload the file to the frontend, file.path is the only mandatory field*/
async function openFile(req: Request, res: Response) {
	try {
		const file = req.body.file.path;
		const parsedPath = path.parse(file);
		const filePath = path.join(path.join(parsedPath.dir, parsedPath.base));
		res.status(200).send(filePath);
	} catch (error) {
		res.status(400);
	}
}

const filesHandler = Router();
filesHandler.post('/upload/:orderind/:fileName/:category', uploadFile);
filesHandler.post('/open', downloadFile);
filesHandler.post('/delete', deleteFIle);
// filesHandler.post('/deletedocument/:table/:ID/:dataCategory', deleteDocument);
filesHandler.post('/genericupload', genericUploadFile);

filesHandler.post('/upload/:order_id', uploadFile);
filesHandler.post('/openfile', openFile);

export default filesHandler;
