import { Prisma } from '@prisma/client';
import {
	IsInt,
	IsDefined,
	IsString,
	IsOptional,
	IsDate,
} from 'class-validator';
import {
	bills,
	payment_category,
	transactions,
	categories,
	item_movement,
	material,
	store,
	external_lab,
	external_lab_test,
	lab_order,
	lab_order_document,
	test,
	chronic_diseases_list,
	clinical,
	diabetes_description,
	hypertension_description,
	liver_condition,
	patient_chronic_diseases,
	patient_contacts,
	patient_imaging,
	patient_intervention,
	patient_investigation,
	patient_laboratory,
	patients_paperwork,
	personal,
	proc,
	proc_imaging,
	proc_lab,
	proc_paperwork,
	rad_order_document,
	radiology_order,
	study,
	study_preparation,
	qualification_categories,
	qualifications,
	job,
	user_role,
	user_contact,
} from './';

export class user {
	@IsDefined()
	@IsInt()
	ind!: number;

	@IsOptional()
	@IsString()
	username?: string;

	@IsOptional()
	@IsString()
	first_name?: string;

	@IsOptional()
	@IsString()
	middle_name?: string;

	@IsOptional()
	@IsString()
	last_name?: string;

	@IsOptional()
	@IsString()
	dob?: string;

	@IsOptional()
	@IsString()
	user_password?: string;

	@IsOptional()
	@IsInt()
	user_role?: number;

	@IsOptional()
	@IsInt()
	job?: number;

	@IsOptional()
	user_config?: Prisma.JsonValue;

	@IsOptional()
	@IsDate()
	created_at?: Date;

	@IsOptional()
	@IsDate()
	updated_at?: Date;

	@IsDefined()
	bills_bills_created_byTouser!: bills[];

	@IsDefined()
	bills_bills_issued_byTouser!: bills[];

	@IsDefined()
	bills_bills_revised_byTouser!: bills[];

	@IsDefined()
	bills_bills_updated_byTouser!: bills[];

	@IsDefined()
	payment_category_payment_category_created_byTouser!: payment_category[];

	@IsDefined()
	payment_category_payment_category_updated_byTouser!: payment_category[];

	@IsDefined()
	transactions_transactions_created_byTouser!: transactions[];

	@IsDefined()
	transactions_transactions_issued_byTouser!: transactions[];

	@IsDefined()
	transactions_transactions_updated_byTouser!: transactions[];

	@IsDefined()
	categories_categories_created_byTouser!: categories[];

	@IsDefined()
	categories_categories_updated_byTouser!: categories[];

	@IsDefined()
	item_movement_item_movement_created_byTouser!: item_movement[];

	@IsDefined()
	item_movement_item_movement_updated_byTouser!: item_movement[];

	@IsDefined()
	material_material_created_byTouser!: material[];

	@IsDefined()
	material_material_updated_byTouser!: material[];

	@IsDefined()
	store_store_created_byTouser!: store[];

	@IsDefined()
	store_store_trusteeTouser!: store[];

	@IsDefined()
	store_store_updated_byTouser!: store[];

	@IsDefined()
	external_lab_external_lab_created_byTouser!: external_lab[];

	@IsDefined()
	external_lab_external_lab_updated_byTouser!: external_lab[];

	@IsDefined()
	external_lab_test_external_lab_test_created_byTouser!: external_lab_test[];

	@IsDefined()
	external_lab_test_external_lab_test_updated_byTouser!: external_lab_test[];

	@IsDefined()
	lab_order_lab_order_chemistTouser!: lab_order[];

	@IsDefined()
	lab_order_lab_order_created_byTouser!: lab_order[];

	@IsDefined()
	lab_order_lab_order_pathologistTouser!: lab_order[];

	@IsDefined()
	lab_order_lab_order_referring_physTouser!: lab_order[];

	@IsDefined()
	lab_order_lab_order_updated_byTouser!: lab_order[];

	@IsDefined()
	lab_order_document_lab_order_document_created_byTouser!: lab_order_document[];

	@IsDefined()
	lab_order_document_lab_order_document_updated_byTouser!: lab_order_document[];

	@IsDefined()
	test_test_created_byTouser!: test[];

	@IsDefined()
	test_test_updated_byTouser!: test[];

	@IsDefined()
	chronic_diseases_list_chronic_diseases_list_created_byTouser!: chronic_diseases_list[];

	@IsDefined()
	chronic_diseases_list_chronic_diseases_list_updated_byTouser!: chronic_diseases_list[];

	@IsDefined()
	clinical_clinical_created_byTouser!: clinical[];

	@IsDefined()
	clinical_clinical_updated_byTouser!: clinical[];

	@IsDefined()
	diabetes_description_diabetes_description_created_byTouser!: diabetes_description[];

	@IsDefined()
	diabetes_description_diabetes_description_updated_byTouser!: diabetes_description[];

	@IsDefined()
	hypertension_description_hypertension_description_created_byTouser!: hypertension_description[];

	@IsDefined()
	hypertension_description_hypertension_description_updated_byTouser!: hypertension_description[];

	@IsDefined()
	liver_condition_liver_condition_created_byTouser!: liver_condition[];

	@IsDefined()
	liver_condition_liver_condition_updated_byTouser!: liver_condition[];

	@IsDefined()
	patient_chronic_diseases_patient_chronic_diseases_created_byTouser!: patient_chronic_diseases[];

	@IsDefined()
	patient_chronic_diseases_patient_chronic_diseases_updated_byTouser!: patient_chronic_diseases[];

	@IsDefined()
	patient_contacts_patient_contacts_created_byTouser!: patient_contacts[];

	@IsDefined()
	patient_contacts_patient_contacts_updated_byTouser!: patient_contacts[];

	@IsDefined()
	patient_imaging_patient_imaging_created_byTouser!: patient_imaging[];

	@IsDefined()
	patient_imaging_patient_imaging_updated_byTouser!: patient_imaging[];

	@IsDefined()
	patient_intervention_patient_intervention_created_byTouser!: patient_intervention[];

	@IsDefined()
	patient_intervention_patient_intervention_updated_byTouser!: patient_intervention[];

	@IsDefined()
	patient_investigation_patient_investigation_created_byTouser!: patient_investigation[];

	@IsDefined()
	patient_investigation_patient_investigation_updated_byTouser!: patient_investigation[];

	@IsDefined()
	patient_laboratory_patient_laboratory_created_byTouser!: patient_laboratory[];

	@IsDefined()
	patient_laboratory_patient_laboratory_updated_byTouser!: patient_laboratory[];

	@IsDefined()
	patients_paperwork_patients_paperwork_created_byTouser!: patients_paperwork[];

	@IsDefined()
	patients_paperwork_patients_paperwork_updated_byTouser!: patients_paperwork[];

	@IsDefined()
	personal_personal_created_byTouser!: personal[];

	@IsDefined()
	personal_personal_updated_byTouser!: personal[];

	@IsDefined()
	proc_proc_created_byTouser!: proc[];

	@IsDefined()
	proc_proc_updated_byTouser!: proc[];

	@IsDefined()
	proc_imaging_proc_imaging_created_byTouser!: proc_imaging[];

	@IsDefined()
	proc_imaging_proc_imaging_updated_byTouser!: proc_imaging[];

	@IsDefined()
	proc_lab_proc_lab_created_byTouser!: proc_lab[];

	@IsDefined()
	proc_lab_proc_lab_updated_byTouser!: proc_lab[];

	@IsDefined()
	proc_paperwork_proc_paperwork_created_byTouser!: proc_paperwork[];

	@IsDefined()
	proc_paperwork_proc_paperwork_updated_byTouser!: proc_paperwork[];

	@IsDefined()
	rad_order_document_rad_order_document_created_byTouser!: rad_order_document[];

	@IsDefined()
	rad_order_document_rad_order_document_updated_byTouser!: rad_order_document[];

	@IsDefined()
	radiology_order_radiology_order_created_byTouser!: radiology_order[];

	@IsDefined()
	radiology_order_radiology_order_radiologistTouser!: radiology_order[];

	@IsDefined()
	radiology_order_radiology_order_referring_physTouser!: radiology_order[];

	@IsDefined()
	radiology_order_radiology_order_technicianTouser!: radiology_order[];

	@IsDefined()
	radiology_order_radiology_order_updated_byTouser!: radiology_order[];

	@IsDefined()
	study_study_created_byTouser!: study[];

	@IsDefined()
	study_study_updated_byTouser!: study[];

	@IsDefined()
	study_preparation_study_preparation_created_byTouser!: study_preparation[];

	@IsDefined()
	study_preparation_study_preparation_updated_byTouser!: study_preparation[];

	@IsDefined()
	qualification_categories_qualification_categories_created_byTouser!: qualification_categories[];

	@IsDefined()
	qualification_categories_qualification_categories_updated_byTouser!: qualification_categories[];

	@IsDefined()
	qualifications_qualifications_created_byTouser!: qualifications[];

	@IsDefined()
	qualifications_qualifications_updated_byTouser!: qualifications[];

	@IsDefined()
	qualifications_qualifications_user_indTouser!: qualifications[];

	@IsOptional()
	job_user_jobTojob?: job;

	@IsOptional()
	user_role_user_user_roleTouser_role?: user_role;

	@IsDefined()
	user_contact_user_contact_created_byTouser!: user_contact[];

	@IsDefined()
	user_contact_user_contact_updated_byTouser!: user_contact[];

	@IsDefined()
	user_contact_user_contact_user_indTouser!: user_contact[];
}
