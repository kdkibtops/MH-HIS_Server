import { IsInt, IsDefined, IsString, IsOptional, IsDate } from "class-validator";
import { lab_order, clinical, liver_condition, patient_chronic_diseases, patient_contacts, patient_imaging, patient_intervention, patient_investigation, patient_laboratory, patients_paperwork, user, payment_category, radiology_order } from "./";

export class personal {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsString()
    mrn?: string;

    @IsOptional()
    @IsString()
    personal_id?: string;

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
    @IsDate()
    dob?: Date;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @IsInt()
    payment_category?: number;

    @IsOptional()
    @IsDate()
    created_at?: Date;

    @IsOptional()
    @IsDate()
    updated_at?: Date;

    @IsOptional()
    @IsInt()
    created_by?: number;

    @IsOptional()
    @IsInt()
    updated_by?: number;

    @IsDefined()
    lab_order!: lab_order[];

    @IsDefined()
    clinical!: clinical[];

    @IsDefined()
    liver_condition!: liver_condition[];

    @IsDefined()
    patient_chronic_diseases!: patient_chronic_diseases[];

    @IsDefined()
    patient_contacts!: patient_contacts[];

    @IsDefined()
    patient_imaging!: patient_imaging[];

    @IsDefined()
    patient_intervention!: patient_intervention[];

    @IsDefined()
    patient_investigation!: patient_investigation[];

    @IsDefined()
    patient_laboratory!: patient_laboratory[];

    @IsDefined()
    patients_paperwork!: patients_paperwork[];

    @IsOptional()
    user_personal_created_byTouser?: user;

    @IsOptional()
    payment_category_personal_payment_categoryTopayment_category?: payment_category;

    @IsOptional()
    user_personal_updated_byTouser?: user;

    @IsDefined()
    radiology_order!: radiology_order[];
}
