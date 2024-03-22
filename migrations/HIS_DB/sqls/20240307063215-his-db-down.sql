DROP TABLE IF EXISTS procedures_schema.proc_lab;

DROP TABLE IF EXISTS procedures_schema.proc_imaging;

DROP TABLE IF EXISTS procedures_schema.proc_paperwork;

DROP TABLE IF EXISTS procedures_schema.proc;

DROP TABLE IF EXISTS inventory.item_movement;

DROP TABLE IF EXISTS inventory.material;

DROP TABLE IF EXISTS inventory.categories;

DROP TABLE IF EXISTS inventory.store;

DROP TABLE IF EXISTS laboratory.lab_order_document;

DROP TABLE IF EXISTS laboratory.lab_order;

DROP TABLE IF EXISTS laboratory.external_lab_test;

DROP TABLE IF EXISTS laboratory.external_lab;

DROP TABLE IF EXISTS laboratory.test;

DROP TABLE IF EXISTS radiology.rad_order_document;

DROP TABLE IF EXISTS radiology.radiology_order;

DROP TABLE IF EXISTS radiology.study;

DROP TABLE IF EXISTS radiology.study_preparation;

DROP TABLE IF EXISTS patients.patients_paperwork;

DROP TABLE IF EXISTS patients.patient_intervention;

DROP TABLE IF EXISTS patients.patient_laboratory;

DROP TABLE IF EXISTS patients.patient_imaging;

DROP TABLE IF EXISTS patients.patient_investigation;

DROP TABLE IF EXISTS patients.patient_contacts;

DROP TABLE IF EXISTS patients.clinical;

DROP TABLE IF EXISTS patients.diabetes_description;

DROP TABLE IF EXISTS patients.hypertension_description;

DROP TABLE IF EXISTS patients.liver_condition;

DROP TABLE IF EXISTS patients.chronic_diseases;

DROP TABLE IF EXISTS patients.patient_chronic_diseases;

DROP TABLE IF EXISTS patients.chronic_diseases_list;

DROP TABLE IF EXISTS patients.patients_contact;

DROP TABLE IF EXISTS patients.personal;

DROP TABLE if EXISTS finance.transactions;

DROP TABLE IF EXISTS finance.bills;

DROP TABLE IF EXISTS finance.payment_category;

DROP TABLE IF EXISTS users.user_contact;

DROP TABLE IF EXISTS users.qualifications;

DROP TABLE IF EXISTS users.qualification_categories;

DROP TABLE IF EXISTS users.user;

DROP TABLE IF EXISTS users.job;

DROP TABLE IF EXISTS users.user_role;

DROP SCHEMA IF EXISTS procedures_schema;

DROP SCHEMA IF EXISTS laboratory;

DROP SCHEMA IF EXISTS radiology;

DROP SCHEMA IF EXISTS finance;

DROP SCHEMA IF EXISTS inventory;

DROP SCHEMA IF EXISTS patients;

DROP SCHEMA IF EXISTS users;