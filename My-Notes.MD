# database.json is concerned to the db-migrate so always connect it to an already existing database so you can create and manipulate other databases,

so this changes only globally and has no effect on the local application, however this will affect db-migrate up and down commands

# Default env for db-migrate is 'dev', so if you need to run db-migrate commands on different enviroments put --env env_name after the command, if omitted it wil be default 'dev'

# database.ts configures how pg library connects to database, so this is changed according to the application

# command set ENVIROMENT_VARIABLE_NAME=value in command CLI

# Take care you need to install drivers for db-migrate to work, it will be installed globally at first time on PC then you don't need to install again, also it can be installed locally to the project

e.g.: npm install -g db-migrate-sqlite3 / npm install db-migrate-sqlite3
This is mandatory before running migrations up.

to run certain migrations, create new folder in the migrations main folder, then put the sql up and down into sqls folder inside the created folder, then put the js file as well in the created folder, to run this certain
migration on CLI: db-migrate up:folder_name (revise scoping in db0migrate documentations).
