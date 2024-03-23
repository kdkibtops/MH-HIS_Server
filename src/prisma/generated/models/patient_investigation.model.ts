import { Prisma } from "@prisma/client";
import { IsInt, IsDefined, IsOptional, IsDate, IsString } from "class-validator";
import { user, personal } from "./";

export class patient_investigation {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    patient_ind?: number;

    @IsOptional()
    @IsDate()
    investigation_date?: Date;

    @IsDefined()
    @IsString()
    investigation_name!: string;

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
    user_patient_investigation_created_byTouser?: user;

    @IsOptional()
    personal?: personal;

    @IsOptional()
    user_patient_investigation_updated_byTouser?: user;
}
