CREATE TABLE
  IF NOT EXISTS "change_log" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    change_type VARCHAR(10) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    patient_id INTEGER NOT NULL,
    study_id INTEGER NOT NULL,
    StudyInstanceUID VARCHAR,
    processed BOOLEAN NOT NULL,
    last_update DATE DEFAULT (datetime ('now', 'localtime'))
  );

CREATE TABLE
  IF NOT EXISTS "patient" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referenceId INTEGER,
    PatientBirthDate TEXT,
    PatientSex TEXT,
    PatientName TEXT,
    PatientID TEXT,
    PatientBirthTime TEXT,
    RETIRED_OtherPatientIDs TEXT,
    OtherPatientNames TEXT,
    EthnicGroup TEXT,
    PatientComments TEXT,
    NumberOfPatientRelatedStudies TEXT,
    NumberOfPatientRelatedSeries TEXT,
    NumberOfPatientRelatedInstances TEXT,
    PlaceHoler TEXT
  );

CREATE TABLE
  IF NOT EXISTS "study" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referenceId INTEGER,
    SpecificCharacterSet TEXT,
    StudyDate TEXT,
    StudyTime TEXT,
    StudyID TEXT,
    AccessionNumber TEXT,
    ReferringPhysicianName TEXT,
    StudyDescription TEXT,
    NameOfPhysiciansReadingStudy TEXT,
    StudyInstanceUID TEXT UNIQUE,
    RETIRED_OtherStudyNumbers TEXT,
    AdmittingDiagnosesDescription TEXT,
    PatientAge TEXT,
    PatientSize TEXT,
    PatientWeight TEXT,
    Occupation TEXT,
    AdditionalPatientHistory TEXT,
    NumberOfStudyRelatedSeries TEXT,
    NumberOfStudyRelatedInstances TEXT,
    ModalitiesInStudy TEXT,
    PlaceHoler TEXT,
    CONSTRAINT fkey_study FOREIGN KEY ("referenceId") REFERENCES patient ("id") ON UPDATE CASCADE ON DELETE CASCADE
  );

CREATE TABLE
  IF NOT EXISTS "series" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referenceId INTEGER,
    SeriesNumber TEXT,
    SeriesInstanceUID TEXT UNIQUE,
    Modality TEXT,
    SeriesDescription TEXT,
    SeriesDate TEXT,
    SeriesTime TEXT,
    BodyPartExamined TEXT,
    PatientPosition TEXT,
    ProtocolName TEXT,
    NumberOfSeriesRelatedInstances TEXT,
    PlaceHoler TEXT,
    CONSTRAINT fkey_series FOREIGN KEY ("referenceId") REFERENCES study ("id") ON UPDATE CASCADE ON DELETE CASCADE
  );

CREATE TABLE
  IF NOT EXISTS "image" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referenceId INTEGER,
    InstanceNumber TEXT,
    SOPInstanceUID TEXT UNIQUE,
    SliceLocation TEXT,
    ImageType TEXT,
    NumberOfFrames TEXT,
    ROWS TEXT,
    Columns TEXT,
    WindowWidth TEXT,
    WindowCenter TEXT,
    PhotometricInterpretation TEXT,
    RescaleSlope TEXT,
    RescaleIntercept TEXT,
    SamplesPerPixel TEXT,
    PixelSpacing TEXT,
    BitsAllocated TEXT,
    BitsStored TEXT,
    HighBit TEXT,
    PixelRepresentation TEXT,
    ImagePositionPatient TEXT,
    ImageOrientationPatient TEXT,
    SOPClassUID TEXT,
    PrivateCreator TEXT,
    PlaceHoler TEXT,
    CONSTRAINT fkey_image FOREIGN KEY ("referenceId") REFERENCES series ("id") ON UPDATE CASCADE ON DELETE CASCADE
  );

CREATE INDEX IF NOT EXISTS imageIndex ON image (referenceId);

CREATE INDEX IF NOT EXISTS patientIndex ON patient (referenceId);

CREATE INDEX IF NOT EXISTS seriesIndex ON series (referenceId);

CREATE INDEX IF NOT EXISTS studyIndex ON study (referenceId);

CREATE TRIGGER IF NOT EXISTS syncDB AFTER INSERT ON study FOR EACH ROW BEGIN
INSERT INTO
  change_log (
    change_type,
    table_name,
    patient_id,
    study_id,
    StudyInstanceUID,
    processed
  )
VALUES
  (
    'INSERT',
    'study',
    NEW.referenceId,
    NEW.id,
    NEW.StudyInstanceUID,
    FALSE
  );

END;

CREATE TRIGGER IF NOT EXISTS sync_DB AFTER INSERT ON series BEGIN
UPDATE change_log
SET
  processed = FALSE
WHERE
  study_id = NEW.referenceId;

END;

-- if updated
CREATE TRIGGER IF NOT EXISTS syncDBupdate AFTER
UPDATE ON study FOR EACH ROW BEGIN
UPDATE change_log
SET
  change_type = 'UPDATE',
  processed = FALSE
WHERE
  study_id = NEW.id;

END;

CREATE TRIGGER IF NOT EXISTS sync_DBupdate AFTER
UPDATE ON series BEGIN
UPDATE change_log
SET
  processed = FALSE
WHERE
  study_id = NEW.referenceId;

END;

-- -- if deleted
CREATE TRIGGER IF NOT EXISTS syncDB_delete AFTER DELETE ON study FOR EACH ROW BEGIN
INSERT INTO
  change_log (
    change_type,
    table_name,
    patient_id,
    study_id,
    StudyInstanceUID,
    processed
  )
VALUES
  (
    'DELETE',
    'study',
    OLD.referenceId,
    OLD.id,
    OLD.StudyInstanceUID,
    FALSE
  );

END;

CREATE TRIGGER IF NOT EXISTS sync_DBupdate AFTER
UPDATE ON series BEGIN
UPDATE change_log
SET
  processed = FALSE
WHERE
  study_id = NEW.referenceId;

END;

-- CREATE TABLE IF NOT EXISTS "main_user_roles" (
--   "ind" SERIAL ,
--   "role_id" INTEGER PRIMARY KEY,
--   "role_name" varchar(50),
--   "role_privileges" json,
--   "updated_by" varchar(50),
--   "last_update" VARCHAR(75),
-- CONSTRAINT fkey_patients FOREIGN KEY ("updated_by") REFERENCES "main_users" ("username") ON UPDATE CASCADE ON DELETE CASCADE,
-- );
-- CREATE TABLE IF NOT EXISTS "main_users" (
--   "ind" SERIAL ,
--   "user_id" varchar(50),
--   "username" varchar(50) PRIMARY KEY,
--   "full_name" varchar(75),
--   "user_password" text,
--   "user_role" INTEGER,
--   "job" varchar(100),
--   "email" varchar(150),
--   "user_config" json,
--   "uploads" json,
--   "last_update" VARCHAR(75),
--   CONSTRAINT fkey_users FOREIGN KEY ("user_role") REFERENCES "main_user_roles" ("role_id") ON UPDATE CASCADE ON DELETE CASCADE,
-- );
-- CREATE TABLE IF NOT EXISTS "main_patients" (
--   "ind" SERIAL ,
--   "mrn" varchar(150) PRIMARY KEY,
--   "patient_name" varchar(100),
--   "national_id" varchar(14),
--   "dob" varchar(50),
--   "age" float,
--   "gender" varchar,
--   "contacts" varchar,
--   "email" varchar(150),
--   "updated_by" varchar(50),
--   "last_update" VARCHAR(75),
--   CONSTRAINT fkey_patients FOREIGN KEY ("updated_by") REFERENCES "main_users" ("username") ON UPDATE CASCADE ON DELETE CASCADE,
-- );
-- CREATE TABLE IF NOT EXISTS "main_studies" (
--   "ind" SERIAL ,
--   "study_id" varchar(150) PRIMARY KEY,
--   "modality" varchar(10),
--   "study_name" varchar(100),
--   "arabic_name" varchar,
--   "price" float,
--   "updated_by" varchar(50),
--   "last_update" VARCHAR(75),
-- CONSTRAINT fkey_studies FOREIGN KEY ("updated_by") REFERENCES "main_users" ("username") ON UPDATE CASCADE ON DELETE CASCADE,
-- );
-- CREATE TABLE IF NOT EXISTS "main_orders" (
--   "ind" SERIAL PRIMARY KEY,
--   "order_id" varchar(100)  ,
--   "mrn" varchar(150),
--   "study" varchar(150),
--   "o_date" date,
--   "o_status" varchar(20),
--   "report" text[],
--   "radiologist" varchar(75),
--   "report_status" varchar(50),
--   "critical"  varchar(50),
--   "radiation_dose" float,
--   "study_instance_uid" varchar UNIQUE,
--   "series_count" INTEGER,
--   "updated_by" varchar(50),
--   "last_update" VARCHAR(75),
-- CONSTRAINT fkey_orders_updated_by FOREIGN KEY ("updated_by") REFERENCES "main_users" ("username") ON UPDATE CASCADE ON DELETE CASCADE,,
-- CONSTRAINT fkey_orders_mrn FOREIGN KEY ("mrn") REFERENCES "main_patients" ("mrn" )ON UPDATE CASCADE ON DELETE CASCADE,,
-- CONSTRAINT fkey_orders_study FOREIGN KEY ("study") REFERENCES "main_studies" ("study_id") ON UPDATE CASCADE ON DELETE CASCADE,
-- );
-- CREATE TABLE IF NOT EXISTS "main_clinics" (
--   "ind" SERIAL ,
--   "clinic_id" INTEGER PRIMARY KEY,
--   "clinic_date" varchar(50),
--   "patients_id" varchar[],
--   "start_time" date,
--   "close_time" date,
--   "attending_physician" varchar(50),
--   "updated_by" varchar(50),
--   "last_update" VARCHAR(75),
-- CONSTRAINT fkey_clinics_attending_physician FOREIGN KEY ("attending_physician") REFERENCES "main_users" ("username") ON UPDATE CASCADE ON DELETE CASCADE,,
-- CONSTRAINT fkey_clinics_updated_by FOREIGN KEY ("updated_by") REFERENCES "main_users" ("username") ON UPDATE CASCADE ON DELETE CASCADE,
-- );
-- CREATE UNIQUE INDEX IF NOT EXISTS users_index ON "main_users" ("ind");
-- CREATE UNIQUE INDEX IF NOT EXISTS patients_index ON "main_patients" ("ind");
-- CREATE UNIQUE INDEX IF NOT EXISTS studies_index ON "main_studies" ("ind");
-- CREATE UNIQUE INDEX IF NOT EXISTS orders_index ON "main_orders" ("ind");
-- CREATE UNIQUE INDEX IF NOT EXISTS user_roles_index ON "main_user_roles" ("ind");
-- CREATE UNIQUE INDEX IF NOT EXISTS clinics_index ON "main_clinics" ("ind");
-- -- CREATE default Admin role 
-- INSERT INTO "main_user_roles" 
-- ("role_id","role_name","role_privileges")
-- VALUES
-- (
-- 1,
-- 'Admin',
-- '{"addRoles":true,"addUsers":true,"addPatients":true,"addStudies":true,"addOrders":true,"editRoles":true,"editUsers":true,"editPatients":true,"editStudies":true,"editOrders":true,"showAll":true,"showPending":true,"showVerified":true,"showPrinted":true,"showDelivered":true,"showAssigned":true,"editAll":true,"editPending":true,"editVerified":true,"editPrinted":true,"editDelivered":true,"editAssigned":true}'
-- ) ON CONFLICT DO NOTHING;
-- INSERT INTO "main_user_roles" 
-- ("role_id","role_name","role_privileges")
-- VALUES
-- (
-- 2,
-- 'Staff',
-- '{"addRoles":true,"addUsers":true,"addPatients":true,"addStudies":true,"addOrders":true,"editRoles":true,"editUsers":true,"editPatients":true,"editStudies":true,"editOrders":true,"showAll":true,"showPending":true,"showVerified":true,"showPrinted":true,"showDelivered":true,"showAssigned":true,"editAll":true,"editPending":true,"editVerified":true,"editPrinted":true,"editDelivered":true,"editAssigned":true}'
-- ) ON CONFLICT DO NOTHING;
-- INSERT INTO "main_user_roles" 
-- ("role_id","role_name","role_privileges")
-- VALUES
-- (
-- 3,
-- 'User',
-- '{"addRoles":true,"addUsers":true,"addPatients":true,"addStudies":true,"addOrders":true,"editRoles":true,"editUsers":true,"editPatients":true,"editStudies":true,"editOrders":true,"showAll":true,"showPending":true,"showVerified":true,"showPrinted":true,"showDelivered":true,"showAssigned":true,"editAll":true,"editPending":true,"editVerified":true,"editPrinted":true,"editDelivered":true,"editAssigned":true}'
-- ) ON CONFLICT DO NOTHING;
-- -- CREATE default admin user, username: admin, password: admin
-- INSERT INTO "main_users" 
-- ("user_id","username","full_name","user_role","user_password") 
-- VALUES 
-- ('1',
--  'admin',
--  'Admin',
--  1,
--  '$2b$10$iSPvkSNRPbNfDFKRq.AFhehLKIjK02SSKjbEfD8BxckS/.e8FxZD2'
-- ) ON CONFLICT DO NOTHING;