import sqlite3, { OPEN_CREATE } from 'sqlite3';
import { open, Database, ISqlite, IMigrate } from 'sqlite';

const db = new sqlite3.Database(
	'../../application_files/dicom/image.db',
	sqlite3.OPEN_CREATE,
	(err) => {
		if (err) {
			console.error(err);
		}
	}
);
const config: ISqlite.Config = {
	filename: 'image.db',
	driver: sqlite3.Database,
	mode: OPEN_CREATE,
};

const migrateSQL: IMigrate.MigrationFile = {
	filename: '',
	id: 0,
	name: '',
};
const migrateSQLParams: IMigrate.MigrationParams = {
	force: true,
	migrationsPath: './',
};

const rdb = new Database(config);
rdb.migrate(migrateSQLParams);

db.exec(
	`CREATE TABLE change_log (
        id SERIAL PRIMARY KEY,
        change_type VARCHAR(10) NOT NULL,
        table_name VARCHAR(50) NOT NULL,
        row_id INTEGER NOT NULL,
        StudyInstanceUID VARCHAR , 
        proccessed BOOLEAN NOT NULL,
        last_update DATE DEFAULT (datetime('now','localtime'))
      )`
);
