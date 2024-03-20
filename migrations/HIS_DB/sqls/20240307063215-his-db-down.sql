DROP TABLE IF EXISTS procedures_schema.lab;

DROP TABLE IF EXISTS procedures_schema.imaging;

DROP TABLE IF EXISTS procedures_schema.paperwork;

DROP TABLE IF EXISTS procedures_schema.procedure;

DROP SCHEMA IF EXISTS procedures_schema;

DROP TABLE IF EXISTS inventory.item_movement;

DROP TABLE IF EXISTS inventory.transaction;

DROP TABLE IF EXISTS inventory.material;

DROP TABLE IF EXISTS inventory.categories;

DROP TABLE IF EXISTS inventory.store;

DROP SCHEMA IF EXISTS inventory;

DROP TABLE IF EXISTS laboratory.order_document;

DROP TABLE IF EXISTS laboratory.order;

DROP TABLE IF EXISTS laboratory.external_lab_test;

DROP TABLE IF EXISTS laboratory.external_lab;

DROP TABLE IF EXISTS laboratory.test;

DROP SCHEMA IF EXISTS laboratory;

DROP TABLE IF EXISTS radiology.order_document;

DROP TABLE IF EXISTS radiology.order;

DROP TABLE IF EXISTS radiology.study;

DROP TABLE IF EXISTS radiology.study_preparation;

DROP SCHEMA IF EXISTS radiology;

DROP TABLE IF EXISTS patients.paperwork;

DROP TABLE IF EXISTS patients.intervention;

DROP TABLE IF EXISTS patients.laboratory;

DROP TABLE IF EXISTS patients.imaging;

DROP TABLE IF EXISTS patients.investigation;

DROP TABLE IF EXISTS patients.contact;

DROP TABLE IF EXISTS patients.clinical;

DROP TABLE IF EXISTS patients.diabetes_description;

DROP TABLE IF EXISTS patients.hypertension_description;

DROP TABLE IF EXISTS patients.liver_condition;

DROP TABLE IF EXISTS patients.chronic_disease;

DROP TABLE IF EXISTS patients.patients_contact;

DROP TABLE IF EXISTS patients.personal;

DROP SCHEMA IF EXISTS patients;

DROP TABLE IF EXISTS finance.payment_category;

DROP SCHEMA IF EXISTS finance;

DROP TABLE IF EXISTS users.user_contact;

DROP TABLE IF EXISTS users.qualification;

DROP TABLE IF EXISTS users.qualification_category;

DROP TABLE IF EXISTS users.user;

DROP TABLE IF EXISTS users.job;

DROP TABLE IF EXISTS users.user_role;

DROP SCHEMA IF EXISTS users;