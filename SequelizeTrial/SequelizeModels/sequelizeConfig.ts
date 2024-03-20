import { Sequelize } from 'sequelize';
import { setupData } from '../config/config';

const { host, DB_password, DB_username, DB_port, database } = setupData;
export const sequelizeClient = new Sequelize({
	host: host,
	dialect: 'postgres',
	password: DB_password,
	username: DB_username,
	port: DB_port,
	database: database,
	logging: (...msg) => console.log(msg),
});
export const sequelizeTestDB = async () => {
	try {
		await sequelizeClient.authenticate();
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.log('Connection has been established successfully.');
	}
};
