import { Prisma } from "@prisma/client";
import { IsInt, IsDefined, IsOptional, IsDate, IsString } from "class-validator";
import { user, personal } from "./";

export class patient_laboratory {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    patient_ind?: number;

    @IsOptional()
    @IsDate()
    lab_date?: Date;

    @IsOptional()
    @IsString()
    test_name?: string;

    @IsOptional()
    result_key_value?: Prisma.JsonValue;

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
    user_patient_laboratory_created_byTouser?: user;

    @IsOptional()
    personal?: personal;

    @IsOptional()
    user_patient_laboratory_updated_byTouser?: user;
}