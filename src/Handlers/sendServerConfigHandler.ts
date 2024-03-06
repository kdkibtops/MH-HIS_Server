import { Request, Response, Router } from 'express';
import client from '../database';
const getTableHeaders = async (req: Request, res: Response) => {
	try {
		const schema = req.params.schema;
		const tableName = req.params.tableName;
		let columns: string[] = [];
		const SQL = `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = '${schema}'
        AND table_name   = '${tableName}';`;
		const conn = await client.connect();
		const result = await conn.query(SQL);
		if (result.rowCount > 0) {
			columns = result.rows.map((e) => e.column_name);
			res.status(200).json({ columns: columns });
		} else {
			const columns = `Schema: ${schema} or Table: ${tableName} are not found in database`;
			res.status(400).json({ columns: columns });
		}
	} catch (error) {
		res.status(400).json({ columns: error });
	}
};

const sendServerConig = Router();
sendServerConig.get('/getheaders/:schema/:tableName', getTableHeaders);
export default sendServerConig;
