import { IsInt, IsDefined, IsString, IsOptional, IsDate } from "class-validator";
import { rad_order_document, bills, user, personal, study } from "./";

export class radiology_order {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsString()
    rad_order_id?: string;

    @IsOptional()
    @IsInt()
    patient_ind?: number;

    @IsOptional()
    @IsInt()
    study_ind?: number;

    @IsOptional()
    @IsInt()
    technician?: number;

    @IsOptional()
    @IsInt()
    radiologist?: number;

    @IsOptional()
    @IsInt()
    referring_phys?: number;

    @IsOptional()
    @IsString()
    o_status?: string;

    @IsOptional()
    @IsDate()
    request_date?: Date;

    @IsOptional()
    @IsDate()
    o_date?: Date;

    @IsOptional()
    @IsDate()
    start_time?: Date;

    @IsOptional()
    @IsDate()
    end_time?: Date;

    @IsOptional()
    @IsInt()
    bill_ind?: number;

    @IsOptional()
    @IsString()
    report_status?: string;

    @IsOptional()
    @IsString()
    cancelled_notes?: string;

    @IsOptional()
    @IsString()
    critical?: string;

    @IsOptional()
    radiation_dose?: number;

    @IsOptional()
    @IsString()
    study_instance_uid?: string;

    @IsOptional()
    @IsInt()
    series_count?: number;

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
    rad_order_document!: rad_order_document[];

    @IsOptional()
    bills?: bills;

    @IsOptional()
    user_radiology_order_created_byTouser?: user;

    @IsOptional()
    personal?: personal;

    @IsOptional()
    user_radiology_order_radiologistTouser?: user;

    @IsOptional()
    user_radiology_order_referring_physTouser?: user;

    @IsOptional()
    study?: study;

    @IsOptional()
    user_radiology_order_technicianTouser?: user;

    @IsOptional()
    user_radiology_order_updated_byTouser?: user;
}
