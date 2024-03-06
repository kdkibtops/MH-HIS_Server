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

async function uploadFile(req: Request, res: Response) {
	try {
		// order_id will be either present as a param or in the request headers: order_id
		const order_id = req.params.order_id || (req.headers.order_id as string);
		const { order, patient } = await getOrderPatientData(order_id);
		if (order === null || patient === null) {
			res.json({ status: 'Failed', enteries: 0, data: [] }).status(400);
			return;
		}
		// const uploadFilePath = path.join(__dirname, '../../a_store/uploads');
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
				'main.orders',
				'order_id',
				order_id,
				'report',
				file.filepath
			);
			res.status(200).send(file.filepath);
		});
	} catch (error) {
		console.log(`Error at uploadFile in uploadHandler: ${error}`);
		res.status(400);
	}
}

async function deleteFIle(req: Request, res: Response) {
	try {
		const order_id = req.params.order_id;
		const filePath = req.body.filePath as string;
		if (existsSync(filePath)) {
			unlinkSync(filePath);
		}
		const result = await deletePathFromDB(
			'main.orders',
			'order_id',
			order_id,
			'report',
			filePath
		);
		const orderFolder = path.dirname(filePath);
		const patientFolder = path.dirname(orderFolder);
		const reports = readdirSync(orderFolder);
		if (reports.length === 0) {
			rmdirSync(orderFolder);
		}
		const ordersWithReports = readdirSync(patientFolder);
		if (ordersWithReports.length === 0) {
			rmdirSync(patientFolder);
		}

		res.json({ data: result }).status(200);
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
filesHandler.post('/upload', uploadFile);
filesHandler.post('/open', downloadFile);
filesHandler.post('/delete/:order_id', deleteFIle);
// filesHandler.post('/deletedocument/:table/:ID/:dataCategory', deleteDocument);
filesHandler.post('/genericupload', genericUploadFile);

filesHandler.post('/upload/:order_id', uploadFile);
filesHandler.post('/openfile', openFile);

export default filesHandler;
