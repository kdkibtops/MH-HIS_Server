import dotenv from 'dotenv';
dotenv.config();

export const setupData = {
	host: process.env.POSTGRES_HOST,
	database:
		process.env.ENV === 'Production'
			? process.env.POSTGRES_DB
			: process.env.TEST_DB,
	DB_username: process.env.POSTGRES_USER,
	DB_password: process.env.POSTGRES_PASSWORD,
	DB_port: Number(process.env.DB_port),
	main_server_port: Number(process.env.MAIN_PORT),
	auth_server_port: Number(process.env.AUTHORIZATION_PORT),
	https_main_server_port: Number(process.env.HTTPS_MAIN_PORT),
	https_auth_server_port: Number(process.env.HTTPS_AUTHORIZATION_PORT),
	client_url: process.env.CLIENT_URL,
	https_client_url: process.env.HTTPS_CLIENT_URL,
	client_port: Number(process.env.CLIENT_PORT),
	hashPassword: process.env.BCRYPT_PASSWORD,
	pepper: process.env.PEPPER,
	JWT_access_secret: process.env.TOKEN_SECRET as string,
	JWT_refresh_secret: process.env.REFRESH_TOKEN_SECRET as string,
	DaylightTimeSaving: true,
};
