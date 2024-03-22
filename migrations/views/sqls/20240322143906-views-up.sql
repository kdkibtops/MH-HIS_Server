CREATE SCHEMA IF NOT EXISTS custom_views;
CREATE VIEW
    custom_views.detailed_radiology_order AS
SELECT
   (
       COALESCE(patients.personal.first_name, ' ')  || ' ' || COALESCE(patients.personal.middle_name, ' ') || ' ' || COALESCE(patients.personal.last_name, ' ')
    ) AS patient_name,
    radiology.study.study_name,
    patients.personal.mrn,
    patients.personal.dob,
    patients.personal.gender,
    (
        DATE_PART (
            'year',
            AGE (radiology.radiology_order.o_date, personal.dob)
        ) || '.' || DATE_PART (
            'month',
            AGE (radiology.radiology_order.o_date, personal.dob)
        )
    ):: NUMERIC AS age,
    radiology.radiology_order.*
 		FROM
    radiology.radiology_order
    JOIN patients.personal ON radiology_order.patient_ind = personal.ind
    JOIN radiology.study ON radiology_order.study_ind = study.ind
    ORDER BY radiology_order.ind;