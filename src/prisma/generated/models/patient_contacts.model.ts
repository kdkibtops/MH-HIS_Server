import { IsInt, IsDefined, IsOptional, IsString, IsDate } from "class-validator";
import { user, personal } from "./";

export class patient_contacts {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    patient_ind?: number;

    @IsOptional()
    @IsString()
    contact_description?: string;

    @IsOptional()
    @IsString()
    contact_value?: string;

    @IsOptional()
    @IsString()
    contact_notes?: string;

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
    user_patient_contacts_created_byTouser?: user;

    @IsOptional()
    personal?: personal;

    @IsOptional()
    user_patient_contacts_updated_byTouser?: user;
}
