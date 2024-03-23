import { IsInt, IsDefined, IsOptional, IsString, IsDate } from "class-validator";
import { user, personal } from "./";

export class patients_paperwork {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    patient_ind?: number;

    @IsOptional()
    @IsString()
    document_description?: string;

    @IsOptional()
    @IsString()
    document_date?: string;

    @IsOptional()
    @IsString()
    submit_date?: string;

    @IsOptional()
    @IsString()
    document_file_path?: string;

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
    user_patients_paperwork_created_byTouser?: user;

    @IsOptional()
    personal?: personal;

    @IsOptional()
    user_patients_paperwork_updated_byTouser?: user;
}
