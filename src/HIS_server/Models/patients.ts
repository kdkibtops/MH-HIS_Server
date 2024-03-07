import client from '../../database';
export type HIS_Patients_Personal = {
	ind?: number;
	mrn: string;
	personal_id: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	dob: string;
	gender: string;
	payment_category: number;
	created: string;
	updated_by: string;
	last_update: string;
};
export type HIS_Patients_DiabetesDescriotion = {
	id: number;
	max_fasting: number;
	min_fasting: number;
	max_post_prandial: number;
	min_post_prandial: number;
	max_hba1c: number;
	min_hba1c: number;
	retina: string;
	kidney: string;
	coronaries: string;
	cerebral: string;
	neuropathy: string;
};
export type HIS_Patients_HTNDescriotion = {
	ind?: number;
	id: number;
	max_systolic: number;
	min_diastolic: number;
	retina: string;
	kidney: string;
	coronaries: string;
	cerebral: string;
	neuropathy: string;
};
export type HIS_Patients_LiverCondition = {
	ind?: number;
	id: number;
	condition_date: string;
	hcv_infection: boolean;
	hcv_AG: boolean;
	hcv_AB: boolean;
	hcv_ttt: string;
	hbv_infection: boolean;
	hbv_AG: boolean;
	hbv_AB: boolean;
	hbv_ttt: string;
	albumin: number;
	ast: number;
	alt: number;
	total_bilirubin: number;
	direct_bilirubin: number;
	inr: number;
	ascites: 'Mild' | 'Moderate' | 'Severe';
	child_score: number;
};
export type HIS_Patients_Clinical = {
	ind?: number;
	mrn: string;
	dm: number;
	htn: number;
	smoking: boolean;
};

export type HIS_Patients_Laboratory = {
	ind?: number;
	mrn: string;
	lab_date: string;
	test_name: string;
	entity_name: string;
	entity_value: string;
};
export type HIS_Patients_Imaging = {
	ind?: number;
	mrn: string;
	study_date: string;
	study_name: string;
	entity_name: string;
	entity_value: string;
};
export type HIS_Patients_Investigation = {
	ind?: number;
	mrn: string;
	investigation_date: string;
	investigation_name: string;
	entity_name: string;
	entity_value: string;
};
export type HIS_Patients_Intervention = {
	ind?: number;
	mrn: string;
	intervention_name: string;
	intervention_date: string;
	complications: string;
};
export type HIS_Patients_ChronicDisease = {
	ind?: number;
	mrn: string;
	disease_name: string;
	organ: string;
	system_affected: string;
};
export type HIS_Patients_Contact = {
	ind?: number;
	mrn: string;
	contact_description: string;
	contact_value: string;
	contact_notes: string;
};
