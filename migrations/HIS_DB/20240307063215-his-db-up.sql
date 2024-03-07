CREATE SCHEMA IF NOT EXISTS users;

CREATE TABLE
    IF NOT EXISTS users.user_role (
        ind SERIAL,
        id INTEGER PRIMARY KEY,
        role_name VARCHAR(50),
        role_privileges JSON,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS users.job (
        ind SERIAL,
        id INTEGER PRIMARY KEY,
        job_name VARCHAR(70),
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS users.user (
        ind SERIAL,
        username VARCHAR(50) PRIMARY KEY,
        first_name VARCHAR(50),
        middle_name VARCHAR(50),
        last_name VARCHAR(50),
        dob VARCHAR(12),
        user_password VARCHAR(80),
        user_role INTEGER REFERENCES users.user_role (id) ON UPDATE CASCADE,
        job INTEGER REFERENCES users.job (id) ON UPDATE CASCADE,
        user_config JSON,
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS users.qualification_category (
        ind SERIAL,
        id INTEGER PRIMARY KEY,
        category_name VARCHAR(50) UNIQUE
    );

CREATE TABLE
    IF NOT EXISTS users.qualification (
        ind SERIAL PRIMARY KEY,
        username VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        qualification_description VARCHAR(75),
        qualification_date VARCHAR(12),
        submit_date VARCHAR(12),
        document_file_path TEXT,
        qualification_category INTEGER REFERENCES users.qualification_category (id),
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS users.contact (
        ind SERIAL PRIMARY KEY,
        username VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        contact_description VARCHAR(75),
        contact_value VARCHAR(100),
        contact_notes VARCHAR(200),
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE SCHEMA IF NOT EXISTS finance;

CREATE TABLE
    IF NOT EXISTS finance.payment_category (
        ind SERIAL,
        id INTEGER PRIMARY KEY,
        payment_name VARCHAR(50),
        account VARCHAR(50),
        max_coverage_limit INTEGER,
        payment_range_in_days INTEGER,
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE SCHEMA IF NOT EXISTS patients;

CREATE TABLE
    IF NOT EXISTS patients.personal (
        ind SERIAL,
        mrn VARCHAR(100) PRIMARY KEY,
        personal_id VARCHAR(100) UNIQUE,
        first_name VARCHAR(50),
        middle_name VARCHAR(50),
        last_name VARCHAR(50),
        dob VARCHAR(12),
        gender VARCHAR(10),
        payment_category INTEGER REFERENCES finance.payment_category (id) ON UPDATE CASCADE,
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS patients.diabetes_description (
        ind SERIAL,
        id INTEGER PRIMARY KEY,
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
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS patients.hypertension_description (
        ind SERIAL,
        id INTEGER PRIMARY KEY,
        max_systolic INTEGER,
        min_diastolic INTEGER,
        retina VARCHAR(100),
        kidney VARCHAR(100),
        coronaries VARCHAR(100),
        cerebral VARCHAR(100),
        neuropathy VARCHAR(100),
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS patients.liver_condition (
        ind SERIAL,
        id INTEGER PRIMARY KEY,
        max_fasting INTEGER,
        min_fasting INTEGER,
        max_post_prandial INTEGER,
        min_post_prandial INTEGER,
        max_hba1c FLOAT,
        min_hba1c FLOAT,
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS patients.clinical (
        ind SERIAL PRIMARY KEY,
        mrn VARCHAR(100) REFERENCES patients.personal (mrn) ON UPDATE CASCADE,
        dm INTEGER REFERENCES patients.diabetes_description (id) ON UPDATE CASCADE,
        htn INTEGER REFERENCES patients.hypertension_description (id) ON UPDATE CASCADE,
        smoking BOOLEAN,
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS patients.chronic_disease (
        ind SERIAL PRIMARY KEY,
        mrn VARCHAR(100) REFERENCES patients.personal (mrn) ON UPDATE CASCADE,
        disease_name VARCHAR(50),
        organ VARCHAR(50),
        system_affected VARCHAR(50),
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS patients.contact (
        ind SERIAL PRIMARY KEY,
        mrn VARCHAR(50) REFERENCES patients.personal (mrn) ON UPDATE CASCADE,
        contact_description VARCHAR(75),
        contact_value VARCHAR(100),
        contact_notes VARCHAR(200),
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS patients.paperwork (
        ind SERIAL PRIMARY KEY,
        mrn VARCHAR(50) REFERENCES patients.personal (mrn) ON UPDATE CASCADE,
        document_description VARCHAR(150),
        document_date VARCHAR(12),
        submit_date VARCHAR(12),
        document_file_path TEXT,
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE SCHEMA IF NOT EXISTS radiology;

CREATE TABLE
    IF NOT EXISTS radiology.study (
        ind SERIAL,
        id VARCHAR(150) PRIMARY KEY,
        modality VARCHAR(10),
        study_name VARCHAR(100),
        arabic_name VARCHAR,
        price FLOAT,
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS radiology.order (
        ind SERIAL,
        id VARCHAR(100) PRIMARY KEY,
        mrn VARCHAR(50) REFERENCES patients.personal (mrn) ON UPDATE CASCADE,
        age FLOAT,
        study_id VARCHAR(150) REFERENCES radiology.study (id) ON UPDATE CASCADE,
        technician VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        radiologist VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        referring_phys VARCHAR(75),
        request_date TIMESTAMP,
        o_status VARCHAR(20),
        o_date DATE,
        start_time TIME,
        end_time TIME,
        payment_category INTEGER REFERENCES finance.payment_category (id) ON UPDATE CASCADE,
        report_status VARCHAR(50),
        cancelled_notes TEXT,
        critical VARCHAR(50),
        radiation_dose FLOAT,
        study_instance_uid VARCHAR UNIQUE,
        series_count INTEGER,
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS radiology.order_document (
        ind SERIAL PRIMARY KEY,
        order_id VARCHAR(100) REFERENCES radiology.order (id),
        document_name VARCHAR(50) DEFAULT 'Report',
        document_description VARCHAR(150),
        document_file_path TEXT,
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE SCHEMA IF NOT EXISTS laboratory;

CREATE TABLE
    IF NOT EXISTS laboratory.test (
        ind SERIAL,
        id VARCHAR(150) PRIMARY KEY,
        category VARCHAR(20),
        test_name VARCHAR(100),
        arabic_name VARCHAR,
        price FLOAT,
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS laboratory.external_lab (
        ind SERIAL,
        id INTEGER PRIMARY KEY,
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
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS laboratory.external_lab_test (
        ind SERIAL PRIMARY KEY,
        test_id VARCHAR(150) REFERENCES laboratory.test (id) ON UPDATE CASCADE,
        external_lab_id INTEGER REFERENCES laboratory.external_lab (id) ON UPDATE CASCADE,
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS laboratory.order (
        ind SERIAL,
        id VARCHAR(100) PRIMARY KEY,
        mrn VARCHAR(50) REFERENCES patients.personal (mrn) ON UPDATE CASCADE,
        age FLOAT,
        test_id VARCHAR(150) REFERENCES laboratory.test (id) ON UPDATE CASCADE,
        request_date TIMESTAMP,
        o_status VARCHAR(20),
        o_date DATE,
        start_time TIME,
        end_time TIME,
        payment_category INTEGER REFERENCES finance.payment_category (id) ON UPDATE CASCADE,
        test_location INTEGER REFERENCES laboratory.external_lab (id) ON UPDATE CASCADE,
        chemist VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        pathologist VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        referring_phys VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        report_status VARCHAR(50),
        critical VARCHAR(50),
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS laboratory.order_document (
        ind SERIAL,
        order_id VARCHAR(100) REFERENCES laboratory.order (id),
        document_name VARCHAR(50) DEFAULT 'Report',
        document_description VARCHAR(150),
        document_file_path TEXT,
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE SCHEMA IF NOT EXISTS procedures;

CREATE TABLE
    IF NOT EXISTS procedures.procedure (
        ind SERIAL,
        id VARCHAR(50) PRIMARY KEY,
        proc_name VARCHAR(100),
        price FLOAT,
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS procedures.lab (
        ind SERIAL PRIMARY KEY,
        procedure_id VARCHAR(50) REFERENCES procedures.procedure (id) ON UPDATE CASCADE,
        test_id VARCHAR(150) REFERENCES laboratory.test (id) ON UPDATE CASCADE,
        max_limit FLOAT,
        min_limit FLOAT,
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS procedures.imaging (
        ind SERIAL PRIMARY KEY,
        procedure_id VARCHAR(50) REFERENCES procedures.procedure (id) ON UPDATE CASCADE,
        study_id VARCHAR(150) REFERENCES radiology.study (id) ON UPDATE CASCADE,
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS procedures.paperwork (
        ind SERIAL,
        procedure_id VARCHAR(100) REFERENCES laboratory.order (id),
        document_name VARCHAR(50),
        document_description VARCHAR(150),
        document_file_path TEXT,
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE SCHEMA IF NOT EXISTS inventory;

CREATE TABLE
    IF NOT EXISTS inventory.categories (
        ind SERIAL,
        id VARCHAR(50) PRIMARY KEY,
        category_name VARCHAR(100),
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS inventory.store (
        ind SERIAL,
        id VARCHAR(50) PRIMARY KEY,
        store_name VARCHAR(50),
        store_location VARCHAR(50),
        trustee VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS inventory.material (
        ind SERIAL,
        id VARCHAR(50) PRIMARY KEY,
        sku VARCHAR(12),
        item_name VARCHAR(100),
        category VARCHAR(50) REFERENCES inventory.store (id) ON UPDATE CASCADE,
        store_id VARCHAR(50) REFERENCES inventory.store (id) ON UPDATE CASCADE,
        price FLOAT,
        stock INTEGER,
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS inventory.transaction (
        ind SERIAL,
        id VARCHAR(50) PRIMARY KEY,
        mrn VARCHAR(150),
        username VARCHAR(50),
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS inventory.item_movement (
        ind SERIAL,
        id VARCHAR(50) PRIMARY KEY,
        trasnaction_id VARCHAR(50) REFERENCES inventory.transaction ON UPDATE CASCADE,
        item_id VARCHAR(50),
        amount INTEGER,
        movement_date VARCHAR(50),
        movement_status VARCHAR(6),
        cost FLOAT,
        created VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        updated_by VARCHAR(50) REFERENCES users.user (username) ON UPDATE CASCADE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- CREATE SCHEMA IF NOT EXISTS clinics;
-- CREATE TABLE IF NOT EXISTS clinics.clinic(
--     ind SERIAL,
-- )
-- CREATE TRIGGER to calculate age for each order after inseting order in radiology;
-- CREATE TRIGGER to calculate age for each order after inseting order in lab;
-- CREATE TRIGGER to calculate stock for each material after inseting/updating in item_movements;