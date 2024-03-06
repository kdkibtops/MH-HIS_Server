Installing the application:
Install postgreSQL
Create super user on postgreSQL
Create you own enviroment variables in .env file locally or on the host server including the following:
POSTGRES_HOST=127.0.0.1| local IP Address | host url
POSTGRES_DB=rad_assist_db
TEST_DB=rad_assist_db_test
POSTGRES_USER= postgreSQL SUPER USER username
POSTGRES_PASSWORD= postgreSQL username password
DB_PORT=5432
SERVER_PORT= -- Preferred port for server to listen on (9001) --
PROXY_PORT= -- Preferred port for proxy server to listen on (9000) --
CLIENT_URL='http://localhost'|URL of the front end client
CLIENT_PORT=3000 | port of the front end client
ENV=Dev|Production # to be used when testing or production
PEPPER= -- PEPPER for bcrypt --
SALT_ROUNDS=10
TOKEN_SECRET= -- secret for access token of jwt --
REFRESH_TOKEN_SECRET= -- secret for refresh token of jwt --
Run 'npm run install-production-db' on command line
Run 'npm start' on command line
