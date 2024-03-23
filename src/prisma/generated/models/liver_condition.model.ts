import { IsInt, IsDefined, IsOptional, IsDate, IsBoolean, IsString } from "class-validator";
import { user, personal } from "./";

export class liver_condition {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    patient_ind?: number;

    @IsOptional()
    @IsDate()
    condition_date?: Date;

    @IsOptional()
    @IsBoolean()
    hcv_infection?: boolean;

    @IsOptional()
    @IsBoolean()
    hcv_ag?: boolean;

    @IsOptional()
    @IsBoolean()
    hcv_ab?: boolean;

    @IsOptional()
    @IsString()
    hcv_ttt?: string;

    @IsOptional()
    @IsBoolean()
    hbv_infection?: boolean;

    @IsOptional()
    @IsBoolean()
    hbv_ag?: boolean;

    @IsOptional()
    @IsBoolean()
    hbv_ab?: boolean;

    @IsOptional()
    @IsString()
    hbv_ttt?: string;

    @IsOptional()
    albumin?: number;

    @IsOptional()
    @IsInt()
    ast?: number;

    @IsOptional()
    @IsInt()
    alt?: number;

    @IsOptional()
    total_bilirubin?: number;

    @IsOptional()
    direct_bilirubin?: number;

    @IsOptional()
    inr?: number;

    @IsOptional()
    @IsString()
    ascites?: string;

    @IsOptional()
    @IsInt()
    child_score?: number;

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
    user_liver_condition_created_byTouser?: user;

    @IsOptional()
    personal?: personal;

    @IsOptional()
    user_liver_condition_updated_byTouser?: user;
}
