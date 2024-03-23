import { IsInt, IsDefined, IsString, IsOptional, IsDate } from "class-validator";
import { user, patient_chronic_diseases } from "./";

export class chronic_diseases_list {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsDefined()
    @IsString()
    disease_name!: string;

    @IsOptional()
    @IsString()
    organ?: string;

    @IsOptional()
    @IsString()
    system_affected?: string;

    @IsOptional()
    @IsString()
    disease_noted?: string;

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
    user_chronic_diseases_list_created_byTouser?: user;

    @IsOptional()
    user_chronic_diseases_list_updated_byTouser?: user;

    @IsDefined()
    patient_chronic_diseases!: patient_chronic_diseases[];
}
