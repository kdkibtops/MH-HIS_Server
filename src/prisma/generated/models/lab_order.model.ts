import { IsInt, IsDefined, IsString, IsOptional, IsDate } from "class-validator";
import { bills, user, personal, test, external_lab, lab_order_document } from "./";

export class lab_order {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsString()
    lab_order_id?: string;

    @IsOptional()
    @IsInt()
    patient_ind?: number;

    @IsOptional()
    @IsInt()
    test_ind?: number;

    @IsOptional()
    @IsDate()
    request_date?: Date;

    @IsOptional()
    @IsString()
    o_status?: string;

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
    @IsInt()
    test_location?: number;

    @IsOptional()
    @IsInt()
    chemist?: number;

    @IsOptional()
    @IsInt()
    pathologist?: number;

    @IsOptional()
    @IsInt()
    referring_phys?: number;

    @IsOptional()
    @IsString()
    report_status?: string;

    @IsOptional()
    @IsString()
    critical?: string;

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

    @IsOptional()
    bills?: bills;

    @IsOptional()
    user_lab_order_chemistTouser?: user;

    @IsOptional()
    user_lab_order_created_byTouser?: user;

    @IsOptional()
    user_lab_order_pathologistTouser?: user;

    @IsOptional()
    personal?: personal;

    @IsOptional()
    user_lab_order_referring_physTouser?: user;

    @IsOptional()
    test?: test;

    @IsOptional()
    external_lab?: external_lab;

    @IsOptional()
    user_lab_order_updated_byTouser?: user;

    @IsDefined()
    lab_order_document!: lab_order_document[];
}
