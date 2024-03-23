import { IsInt, IsDefined, IsOptional, IsString, IsDate } from "class-validator";
import { user, external_lab_test, lab_order } from "./";

export class external_lab {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    ext_lab_id?: number;

    @IsOptional()
    @IsString()
    lab_name?: string;

    @IsOptional()
    @IsString()
    full_address?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    primary_contact?: string;

    @IsOptional()
    @IsString()
    secondary_contact?: string;

    @IsOptional()
    @IsString()
    emergency_contact?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsInt()
    result_range_in_hours?: number;

    @IsOptional()
    @IsInt()
    payment_range_in_days?: number;

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
    user_external_lab_created_byTouser?: user;

    @IsOptional()
    user_external_lab_updated_byTouser?: user;

    @IsDefined()
    external_lab_test!: external_lab_test[];

    @IsDefined()
    lab_order!: lab_order[];
}
