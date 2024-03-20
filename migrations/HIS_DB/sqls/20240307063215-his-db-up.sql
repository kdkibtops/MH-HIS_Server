CREATE SCHEMA IF NOT EXISTS users;

CREATE TABLE
    IF NOT EXISTS users.user_role (
        ind SERIAL PRIMARY KEY,
        id INTEGER UNIQUE,
        role_name VARCHAR(50),
        role_privileges JSON
    );

CREATE TABLE
    IF NOT EXISTS users.job (
        ind SERIAL PRIMARY KEY,
        id INTEGER UNIQUE,
        job_name VARCHAR(70)
    );

CREATE TABLE
    IF NOT EXISTS users.qualification_category (
        ind SERIAL PRIMARY KEY,
        category_name VARCHAR(50) UNIQUE,
        category_description VARCHAR(200)
    );

CREATE TABLE
    IF NOT EXISTS users.user (
        ind SERIAL PRIMARY KEy,
        username VARCHAR(50) UNIQUE,
        first_name VARCHAR(50),
        middle_name VARCHAR(50),
        last_name VARCHAR(50),
        dob VARCHAR(12),
        user_password VARCHAR(80),
        user_role INTEGER REFERENCES users.user_role (ind) ON UPDATE CASCADE,
        job INTEGER REFERENCES users.job (ind) ON UPDATE CASCADE,
        user_config JSON
    );

CREATE TABLE
    IF NOT EXISTS users.user_contact (
        ind SERIAL PRIMARY KEY,
        user_ind INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        contact_description VARCHAR(75),
        contact_value VARCHAR(100),
        contact_notes VARCHAR(200),
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE SCHEMA IF NOT EXISTS finance;

CREATE TABLE
    IF NOT EXISTS finance.payment_category (
        ind SERIAL PRIMARY KEY,
        id INTEGER UNIQUE,
        payment_name VARCHAR(50),
        account VARCHAR(50),
        max_coverage_limit INTEGER,
        payment_range_in_days INTEGER,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE SCHEMA IF NOT EXISTS patients;

CREATE TABLE
    IF NOT EXISTS patients.personal (
        ind SERIAL PRIMARY KEY,
        mrn VARCHAR(100) UNIQUE,
        personal_id VARCHAR(100) UNIQUE,
        first_name VARCHAR(50),
        middle_name VARCHAR(50),
        last_name VARCHAR(50),
        dob VARCHAR(12),
        gender VARCHAR(10),
        payment_category INTEGER REFERENCES finance.payment_category (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS patients.diabetes_description (
        ind SERIAL PRIMARY KEY,
        max_fasting INTEGER,
        min_fasting INTEGER,
        max_post_prandial INTEGER,
        min_post_prandial INTEGER,
        max_hba1c FLOAT,
        min_hba1c FLOAT,
        retina VARCHAR(100),
        kidney VARCHAR(100),
        coronaries VARCHAR(100),
        cerebral VARCHAR(100),
        neuropathy VARCHAR(100),
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS patients.hypertension_description (
        ind SERIAL PRIMARY KEY,
        max_systolic INTEGER,
        min_diastolic INTEGER,
        retina VARCHAR(100),
        kidney VARCHAR(100),
        coronaries VARCHAR(100),
        cerebral VARCHAR(100),
        neuropathy VARCHAR(100),
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS patients.liver_condition (
        ind SERIAL PRIMARY KEY,
        patient_ind INTEGER REFERENCES patients.personal (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        condition_date DATE,
        hcv_infection BOOLEAN,
        hcv_AG BOOLEAN,
        hcv_AB BOOLEAN,
        hcv_ttt VARCHAR(150),
        hbv_infection BOOLEAN,
        hbv_AG BOOLEAN,
        hbv_AB BOOLEAN,
        hbv_ttt VARCHAR(150),
        albumin FLOAT,
        ast INTEGER,
        alt INTEGER,
        total_bilirubin FLOAT,
        direct_bilirubin FLOAT,
        inr FLOAT,
        ascites VARCHAR(10),
        child_score INTEGER,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS patients.clinical (
        ind SERIAL PRIMARY KEY,
        patient_ind INTEGER REFERENCES patients.personal (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        dm INTEGER REFERENCES patients.diabetes_description (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        htn INTEGER REFERENCES patients.hypertension_description (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        smoking BOOLEAN,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS patients.laboratory (
        ind SERIAL PRIMARY KEY,
        patient_ind INTEGER REFERENCES patients.personal (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        lab_date DATE,
        test_name VARCHAR(50),
        entity_name VARCHAR(50),
        entity_value VARCHAR(15),
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS patients.imaging (
        ind SERIAL PRIMARY KEY,
        patient_ind INTEGER REFERENCES patients.personal (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        study_date DATE,
        study_name VARCHAR(50),
        entity_name VARCHAR(50),
        entity_value VARCHAR(15),
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS patients.investigation (
        ind SERIAL PRIMARY KEY,
        patient_ind INTEGER REFERENCES patients.personal (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        investigation_date DATE,
        investigation_name VARCHAR(50),
        entity_name VARCHAR(50),
        entity_value VARCHAR(15),
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS patients.intervention (
        ind SERIAL PRIMARY KEY,
        patient_ind INTEGER REFERENCES patients.personal (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        intervention_name VARCHAR(50),
        intervention_date DATE,
        complications TEXT,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS patients.chronic_disease (
        ind SERIAL PRIMARY KEY,
        patient_ind INTEGER REFERENCES patients.personal (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        disease_name VARCHAR(50),
        organ VARCHAR(50),
        system_affected VARCHAR(50),
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS patients.patients_contact (
        ind SERIAL PRIMARY KEY,
        patient_ind INTEGER REFERENCES patients.personal (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        contact_description VARCHAR(75),
        contact_value VARCHAR(100),
        contact_notes VARCHAR(200),
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS patients.paperwork (
        ind SERIAL PRIMARY KEY,
        patient_ind INTEGER REFERENCES patients.personal (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        document_description VARCHAR(150),
        document_date VARCHAR(12),
        submit_date VARCHAR(12),
        document_file_path TEXT,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE SCHEMA IF NOT EXISTS radiology;

CREATE TABLE
    IF NOT EXISTS radiology.study_preparation (
        ind SERIAL PRIMARY KEY,
        hint_text TEXT,
        document_file_path TEXT,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS radiology.study (
        ind SERIAL PRIMARY KEY,
        id VARCHAR(150) UNIQUE,
        modality VARCHAR(10),
        study_name VARCHAR(100),
        arabic_name VARCHAR,
        price FLOAT,
        study_preparation INTEGER REFERENCES radiology.study_preparation (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS radiology.order (
        ind SERIAL PRIMARY KEY,
        id VARCHAR(100) UNIQUE,
        patient_ind INTEGER REFERENCES patients.personal (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        age FLOAT,
        study_ind INTEGER REFERENCES radiology.study (ind) ON UPDATE CASCADE,
        technician INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        radiologist INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        referring_phys INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        o_status VARCHAR(20),
        request_date DATE,
        o_date DATE,
        start_time TIME,
        end_time TIME,
        payment_category INTEGER REFERENCES finance.payment_category (ind) ON UPDATE CASCADE,
        report_status VARCHAR(50),
        cancelled_notes TEXT,
        critical VARCHAR(50),
        radiation_dose FLOAT,
        study_instance_uid VARCHAR UNIQUE,
        series_count INTEGER,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS radiology.order_document (
        ind SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES radiology.order (ind),
        document_name VARCHAR(50) DEFAULT 'Report',
        document_description VARCHAR(150),
        document_file_path TEXT,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE SCHEMA IF NOT EXISTS laboratory;

CREATE TABLE
    IF NOT EXISTS laboratory.test (
        ind SERIAL PRIMARY KEY,
        id VARCHAR(150) UNIQUE,
        category VARCHAR(20),
        test_name VARCHAR(100),
        arabic_name VARCHAR,
        price FLOAT,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS laboratory.external_lab (
        ind SERIAL PRIMARY KEY,
        id INTEGER UNIQUE,
        lab_name VARCHAR(100),
        full_address VARCHAR(150),
        city VARCHAR(50),
        country VARCHAR(50),
        district VARCHAR(50),
        primary_contact VARCHAR(50),
        secondary_contact VARCHAR(50),
        emergency_contact VARCHAR(50),
        email VARCHAR(50),
        result_range_in_hours INTEGER,
        payment_range_in_days INTEGER,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS laboratory.external_lab_test (
        ind SERIAL PRIMARY KEY,
        test_ind INTEGER REFERENCES laboratory.test (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        external_lab_id INTEGER REFERENCES laboratory.external_lab (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS laboratory.order (
        ind SERIAL PRIMARY KEY,
        id VARCHAR(100) UNIQUE,
        patient_ind INTEGER REFERENCES patients.personal (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        age FLOAT,
        test_ind INTEGER REFERENCES laboratory.test (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        request_date TIMESTAMP,
        o_status VARCHAR(20),
        o_date DATE,
        start_time TIME,
        end_time TIME,
        payment_category INTEGER REFERENCES finance.payment_category (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        test_location INTEGER REFERENCES laboratory.external_lab (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        chemist INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        pathologist INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        referring_phys INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        report_status VARCHAR(50),
        critical VARCHAR(50),
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS laboratory.order_document (
        ind SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES laboratory.order (ind),
        document_name VARCHAR(50) DEFAULT 'Report',
        document_description VARCHAR(150),
        document_file_path TEXT,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE SCHEMA IF NOT EXISTS procedures_schema;

CREATE TABLE
    IF NOT EXISTS procedures_schema.procedure (
        ind SERIAL PRIMARY KEY,
        id VARCHAR(50) UNIQUE,
        proc_name VARCHAR(100),
        price FLOAT,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS procedures_schema.lab (
        ind SERIAL PRIMARY KEY,
        procedure_ind INTEGER REFERENCES procedures_schema.procedure (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        test_id INTEGER REFERENCES laboratory.test (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        max_limit FLOAT,
        min_limit FLOAT,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS procedures_schema.imaging (
        ind SERIAL PRIMARY KEY,
        procedure_ind INTEGER REFERENCES procedures_schema.procedure (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        study_id INTEGER REFERENCES radiology.study (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS procedures_schema.paperwork (
        ind SERIAL PRIMARY KEY,
        procedure_ind INTEGER REFERENCES procedures_schema.procedure (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        document_name INTEGER,
        document_description VARCHAR(150),
        document_file_path TEXT,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE SCHEMA IF NOT EXISTS inventory;

CREATE TABLE
    IF NOT EXISTS inventory.categories (
        ind SERIAL PRIMARY KEY,
        id VARCHAR(50) UNIQUE,
        category_name VARCHAR(100),
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS inventory.store (
        ind SERIAL PRIMARY KEY,
        id VARCHAR(50) UNIQUE,
        store_name VARCHAR(50),
        store_location VARCHAR(50),
        trustee INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS inventory.material (
        ind SERIAL PRIMARY KEY,
        id VARCHAR(50) UNIQUE,
        sku VARCHAR(12),
        item_name VARCHAR(100),
        category INTEGER REFERENCES inventory.store (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        store_id INTEGER REFERENCES inventory.store (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        price FLOAT,
        stock INTEGER,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS inventory.transaction (
        ind SERIAL PRIMARY KEY,
        id VARCHAR(50) UNIQUE,
        patient_ind INTEGER REFERENCES patients.personal (ind) ON UPDATE CASCADE ON DELETE CASCADE,
        username VARCHAR(50),
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS inventory.item_movement (
        ind SERIAL PRIMARY KEY,
        id VARCHAR(50) UNIQUE,
        trasnaction_id INTEGER REFERENCES inventory.transaction ON UPDATE CASCADE ON DELETE CASCADE,
        item_id VARCHAR(50),
        amount INTEGER,
        movement_date VARCHAR(50),
        movement_status VARCHAR(6),
        cost FLOAT,
        created_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE,
        updated_by INTEGER REFERENCES users.user (ind) ON UPDATE CASCADE
    );

-- CREATE TRIGGER to calculate age for each order after inseting order in radiology;
-- CREATE TRIGGER to calculate age for each order after inseting order in lab;
-- CREATE TRIGGER to calculate stock for each material after inseting/updating in item_movements;