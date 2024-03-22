CREATE SCHEMA IF NOT EXISTS "main";

CREATE SCHEMA IF NOT EXISTS "inventory";

CREATE SCHEMA IF NOT EXISTS "orders_schema";

CREATE TABLE IF NOT EXISTS "main"."setupdata" (
"ind" SERIAL PRIMARY KEY,
"data_id" VARCHAR(10),
"selectOptions" json,
"selectOptionsValues" json,
"RAQSdictionary" json,
"specialFields" json,
"pageConstants" json
);

CREATE TABLE IF NOT EXISTS "main"."users" (
  "ind" SERIAL ,
  "user_id" VARCHAR(50),
  "username" VARCHAR(50) PRIMARY KEY,
  "full_name" VARCHAR(75),
  "user_password" text,
  "user_role" INTEGER,
  "job" VARCHAR(100),
  "email" VARCHAR(150),
  "verified" BOOLEAN,
  "user_config" json,
  "uploads" json,
  "last_update" VARCHAR(75)
);

CREATE TABLE IF NOT EXISTS "main"."patients" (
  "ind" SERIAL ,
  "mrn" VARCHAR(150) PRIMARY KEY,
  "category" VARCHAR (15),
  "rank" VARCHAR (20),
  "status" VARCHAR (20),
  "patient_name" VARCHAR(100),
  "national_id" VARCHAR(14),
  "dob" VARCHAR(50),
  "gender" VARCHAR,
  "contacts" VARCHAR,
  "email" VARCHAR(150),
  "updated_by" VARCHAR(50),
  "last_update" VARCHAR(75)
);

CREATE TABLE IF NOT EXISTS "main"."studies" (
  "ind" SERIAL ,
  "study_id" VARCHAR(150) PRIMARY KEY,
  "modality" VARCHAR(10),
  "study_name" VARCHAR(100),
  "arabic_name" VARCHAR,
  "price" float,
  "updated_by" VARCHAR(50),
  "last_update" VARCHAR(75)
);

CREATE TABLE IF NOT EXISTS "main"."orders" (
  "ind" SERIAL UNIQUE,
  "order_id" VARCHAR(100) PRIMARY KEY,
  "mrn" VARCHAR(150),
  "age" float,
  "study_id" VARCHAR(150),
  "o_date" date,
  "o_status" VARCHAR(20) ,
  -- "report" text[],
  "radiologist" VARCHAR(75),
  "referring_phys" VARCHAR(75),
  "report_status" VARCHAR(50) ,
  "critical"  VARCHAR(50),
  "radiation_dose" float,
  "study_instance_uid" VARCHAR UNIQUE,
  "series_count" INTEGER,
  "updated_by" VARCHAR(50),
  "last_update" VARCHAR(75)
);

CREATE TABLE IF NOT EXISTS "orders_schema"."paperwork" (
  "ind" SERIAL PRIMARY KEY,
  "order_ind" INTEGER ,
  "order_id" VARCHAR(100),
  "paperwork_name" VARCHAR(50),
  "paperwork_path" TEXT,
  "category" VARCHAR(50),
  "updated_by" VARCHAR(50),
  "last_update" VARCHAR(75),
  CONSTRAINT fkey_ord_paperwork FOREIGN KEY ("order_id") REFERENCES main.orders ("order_id") ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fkey_ord_updated_by FOREIGN KEY ("updated_by") REFERENCES main.users ("username") ON UPDATE CASCADE 
);

CREATE TABLE IF NOT EXISTS "main"."user_roles" (
  "ind" SERIAL ,
  "role_id" INTEGER PRIMARY KEY,
  "role_name" VARCHAR(50),
  "role_privileges" json,
  "updated_by" VARCHAR(50),
  "last_update" VARCHAR(75)
);

CREATE TABLE IF NOT EXISTS "main"."clinics" (
  "ind" SERIAL ,
  "clinic_id" INTEGER PRIMARY KEY,
  "clinic_date" VARCHAR(50),
  "patients_id" VARCHAR[],
  "start_time" date,
  "close_time" date,
  "attending_physician" VARCHAR(50),
  "updated_by" VARCHAR(50),
  "last_update" VARCHAR(75)
);

CREATE TABLE IF NOT EXISTS "main"."procedures" (
  "ind" SERIAL ,
  "procedure_id" VARCHAR(50) PRIMARY KEY,
  "procedure_name" VARCHAR(100),
  "laboratory" VARCHAR(50)[],
  "imaging" VARCHAR(50)[],
  "recommended_material" VARCHAR(150)[],
  "paperwork" json,
  "updated_by" VARCHAR(50),
  "last_update" VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS "inventory"."materials" (
  "ind" SERIAL,
  "item_id" VARCHAR(50) PRIMARY KEY,
  "item_name" VARCHAR(100),
  "category" VARCHAR(50),
  "store_id" VARCHAR(50),
  "price" float,
  "stock" INTEGER,
  "updated_by" VARCHAR(50),
  "last_update" VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS "inventory"."categories" (
  "ind" SERIAL,
  "category_id" VARCHAR(50) PRIMARY KEY,
  "category_name" VARCHAR(100),
  "updated_by" VARCHAR(50),
  "last_update" VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS "inventory"."stores" (
  "ind" SERIAL,
  "store_id" VARCHAR(50) PRIMARY KEY,
  "store_name" VARCHAR(50),
  "location" VARCHAR(50),
  "trustee" VARCHAR(50),
  "last_checked" VARCHAR(50),
  "updated_by" VARCHAR(50),
  "last_update" VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS "inventory"."transactions" (
  "ind" SERIAL,
  "transaction_id" VARCHAR(50) PRIMARY KEY,
  "mrn" VARCHAR(150),
  "username" VARCHAR(50),
  "items_id" VARCHAR(50)[],
  "procedure_id" VARCHAR(50),
  "updated_by" VARCHAR(50),
  "last_update" VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS "inventory"."item_movements" (
  "ind" SERIAL,
  "movement_id" VARCHAR(50) PRIMARY KEY,
  "trasnaction_id" VARCHAR(50),
  "item_id" VARCHAR(50),
  "amount" INTEGER,
  "movement_date" VARCHAR(50),
  "status" VARCHAR(6),
  "cost" float,
  "username" VARCHAR(50),
  "updated_by" VARCHAR(50),
  "last_update" VARCHAR(50)
);


ALTER TABLE "main"."orders" ADD FOREIGN KEY ("mrn") REFERENCES "main"."patients" ("mrn" )ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "main"."orders" ADD FOREIGN KEY ("study_id") REFERENCES "main"."studies" ("study_id") ON UPDATE CASCADE ;

ALTER TABLE "main"."orders" ADD FOREIGN KEY ("radiologist") REFERENCES "main"."users" ("username") ON UPDATE CASCADE ;

ALTER TABLE "main"."users" ADD FOREIGN KEY ("user_role") REFERENCES "main"."user_roles" ("role_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "main"."clinics" ADD FOREIGN KEY ("attending_physician") REFERENCES "main"."users" ("username") ON UPDATE CASCADE ;

ALTER TABLE "inventory"."transactions" ADD FOREIGN KEY ("mrn") REFERENCES "main"."patients" ("mrn") ON UPDATE CASCADE;

ALTER TABLE "inventory"."transactions" ADD FOREIGN KEY ("username") REFERENCES "main"."users" ("username") ON UPDATE CASCADE ;

ALTER TABLE "inventory"."transactions" ADD FOREIGN KEY ("procedure_id") REFERENCES "main"."procedures" ("procedure_id") ON UPDATE CASCADE ;

ALTER TABLE "inventory"."item_movements" ADD FOREIGN KEY ("trasnaction_id") REFERENCES "inventory"."transactions" ("transaction_id") ON UPDATE CASCADE ;

ALTER TABLE "inventory"."item_movements" ADD FOREIGN KEY ("item_id") REFERENCES "inventory"."materials" ("item_id") ON UPDATE CASCADE ;

ALTER TABLE "inventory"."item_movements" ADD FOREIGN KEY ("username") REFERENCES "main"."users" ("username") ON UPDATE CASCADE ;

ALTER TABLE "inventory"."materials" ADD FOREIGN KEY ("category") REFERENCES "inventory"."categories" ("category_id") ON UPDATE CASCADE;

ALTER TABLE "inventory"."materials" ADD FOREIGN KEY ("store_id") REFERENCES "inventory"."stores" ("store_id") ON UPDATE CASCADE ;

ALTER TABLE "inventory"."stores" ADD FOREIGN KEY ("trustee") REFERENCES "main"."users" ON UPDATE CASCADE ;


-- Below are creating foregin key for updating queries to username
ALTER TABLE "main"."orders" ADD FOREIGN KEY ("updated_by") REFERENCES "main"."users" ("username") ON UPDATE CASCADE ;

ALTER TABLE "main"."patients" ADD FOREIGN KEY ("updated_by") REFERENCES "main"."users" ("username") ON UPDATE CASCADE ;

ALTER TABLE "main"."studies" ADD FOREIGN KEY ("updated_by") REFERENCES "main"."users" ("username") ON UPDATE CASCADE ;

ALTER TABLE "main"."clinics" ADD FOREIGN KEY ("updated_by") REFERENCES "main"."users" ("username") ON UPDATE CASCADE ;

ALTER TABLE "main"."procedures" ADD FOREIGN KEY ("updated_by") REFERENCES "main"."users" ("username") ON UPDATE CASCADE ;

ALTER TABLE "inventory"."materials" ADD FOREIGN KEY ("updated_by") REFERENCES "main"."users" ("username") ON UPDATE CASCADE ;

ALTER TABLE "inventory"."transactions" ADD FOREIGN KEY ("updated_by") REFERENCES "main"."users" ("username") ON UPDATE CASCADE ;

ALTER TABLE "inventory"."item_movements" ADD FOREIGN KEY ("updated_by") REFERENCES "main"."users" ("username") ON UPDATE CASCADE ;

ALTER TABLE "inventory"."categories" ADD FOREIGN KEY ("updated_by") REFERENCES "main"."users" ("username") ON UPDATE CASCADE ;

ALTER TABLE "inventory"."stores" ADD FOREIGN KEY ("updated_by") REFERENCES "main"."users" ("username") ON UPDATE CASCADE ;

CREATE UNIQUE INDEX users_index ON "main"."users" ("ind");

CREATE UNIQUE INDEX patients_index ON "main"."patients" ("ind");

CREATE UNIQUE INDEX studies_index ON "main"."studies" ("ind");

CREATE UNIQUE INDEX orders_index ON "main"."orders" ("ind");

CREATE UNIQUE INDEX user_roles_index ON "main"."user_roles" ("ind");

CREATE UNIQUE INDEX clinics_index ON "main"."clinics" ("ind");

CREATE UNIQUE INDEX procedures_index ON "main"."procedures" ("ind");

CREATE UNIQUE INDEX materials_index ON "inventory"."materials" ("ind");

CREATE UNIQUE INDEX transactions_index ON "inventory"."transactions" ("ind");

CREATE UNIQUE INDEX item_movements_index ON "inventory"."item_movements" ("ind");

CREATE UNIQUE INDEX categories_index ON "inventory"."categories" ("ind");

CREATE UNIQUE INDEX stores_index ON "inventory"."stores" ("ind");

-- CREATE default Admin role 
INSERT INTO "main"."user_roles" 
("role_id","role_name","role_privileges")
VALUES
(
1,
'Admin',
'{"addRoles":true,"addUsers":true,"addPatients":true,"addStudies":true,"addOrders":true,"editRoles":true,"editUsers":true,"editPatients":true,"editStudies":true,"editOrders":true,"showAll":true,"showPending":true,"showVerified":true,"showPrinted":true,"showDelivered":true,"showAssigned":true,"editAll":true,"editPending":true,"editVerified":true,"editPrinted":true,"editDelivered":true,"editAssigned":true}'
);
INSERT INTO "main"."user_roles" 
("role_id","role_name","role_privileges")
VALUES
(
2,
'Staff',
'{"addRoles":true,"addUsers":true,"addPatients":true,"addStudies":true,"addOrders":true,"editRoles":true,"editUsers":true,"editPatients":true,"editStudies":true,"editOrders":true,"showAll":true,"showPending":true,"showVerified":true,"showPrinted":true,"showDelivered":true,"showAssigned":true,"editAll":true,"editPending":true,"editVerified":true,"editPrinted":true,"editDelivered":true,"editAssigned":true}'
);
INSERT INTO "main"."user_roles" 
("role_id","role_name","role_privileges")
VALUES
(
3,
'User',
'{"addRoles":true,"addUsers":true,"addPatients":true,"addStudies":true,"addOrders":true,"editRoles":true,"editUsers":true,"editPatients":true,"editStudies":true,"editOrders":true,"showAll":true,"showPending":true,"showVerified":true,"showPrinted":true,"showDelivered":true,"showAssigned":true,"editAll":true,"editPending":true,"editVerified":true,"editPrinted":true,"editDelivered":true,"editAssigned":true}'
);

-- CREATE default admin user, username: admin, password: admin
INSERT INTO users.user 
("username","first_name","user_role","user_password") 
VALUES 
(
 'admin',
 'Admin',
 1,
 '$2b$10$iSPvkSNRPbNfDFKRq.AFhehLKIjK02SSKjbEfD8BxckS/.e8FxZD2'
);
-- INSERT MATERILAS & PROCEDURES FROM CSV Files

-- CREATE TEMP TABLE temp_table_categories(
--   "category_id" VARCHAR(50) PRIMARY KEY,
--   "category_name" VARCHAR(100),
--   "updated_by" VARCHAR(50),
--   "last_update" VARCHAR(50)
-- );

-- CREATE TEMP TABLE temp_table_procedures (
--   "procedure_id" VARCHAR(50) PRIMARY KEY,
--   "procedure_name" VARCHAR(100),
--   "laboratory" VARCHAR(50)[],
--   "imaging" VARCHAR(50)[],
--   "recommended_material" VARCHAR(150)[],
--   "paperwork" json,
--   "updated_by" VARCHAR(50),
--   "last_update" VARCHAR(50)
-- );

-- CREATE TEMP TABLE temp_table_materials (
--   "item_id" VARCHAR(50) PRIMARY KEY,
--   "item_name" VARCHAR(100),
--   "category" VARCHAR(50),
--   "store_id" VARCHAR(50),
--   "price" float,
--   "stock" INTEGER,
--   "updated_by" VARCHAR(50),
--   "last_update" VARCHAR(50)
-- );


-- COPY temp_table_categories 
-- (category_id,category_name,updated_by,last_update) 
-- FROM 'E:\categories.csv'
-- DELIMITER',' 
-- CSV 
-- HEADER 
-- ENCODING 'UTF-8';
-- INSERT INTO inventory.categories 
-- (category_id,category_name,updated_by,last_update)
-- SELECT * FROM temp_table_categories ON CONFLICT DO NOTHING;
-- UPDATE main.procedures SET last_update = NOW() WHERE last_update IS NULL ;
-- UPDATE main.procedures SET updated_by = 'admin' WHERE updated_by IS NULL ;

-- COPY temp_table_materials 
-- (item_id,item_name,category,store_id,price,stock,updated_by,last_update) 
-- FROM 'E:\materials.csv'
-- DELIMITER',' 
-- CSV 
-- HEADER 
-- ENCODING 'UTF-8';
-- INSERT INTO inventory.materials 
-- (item_id,item_name,category,store_id,price,stock,updated_by,last_update)
-- SELECT * FROM temp_table_materials ON CONFLICT DO NOTHING;
-- UPDATE inventory.materials SET last_update = NOW() WHERE last_update IS NULL ;
-- UPDATE inventory.materials SET updated_by = 'admin' WHERE updated_by IS NULL ;

-- COPY temp_table_procedures 
-- (procedure_id,procedure_name,laboratory,imaging,recommended_material,paperwork,updated_by,last_update) 
-- FROM 'E:\procedures.csv'
-- DELIMITER',' 
-- CSV 
-- HEADER 
-- ENCODING 'UTF-8';
-- INSERT INTO main.procedures 
-- (procedure_id,procedure_name,laboratory,imaging,recommended_material,paperwork,updated_by,last_update)
-- SELECT * FROM temp_table_procedures ON CONFLICT DO NOTHING;
-- UPDATE main.procedures SET last_update = NOW() WHERE last_update IS NULL ;
-- UPDATE main.procedures SET updated_by = 'admin' WHERE updated_by IS NULL ;