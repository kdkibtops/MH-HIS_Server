import { IsInt, IsDefined, IsOptional, IsBoolean, IsDate } from "class-validator";
import { user, diabetes_description, hypertension_description, personal } from "./";

export class clinical {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    patient_ind?: number;

    @IsOptional()
    @IsInt()
    dm?: number;

    @IsOptional()
    @IsInt()
    htn?: number;

    @IsOptional()
    @IsBoolean()
    smoking?: boolean;

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
    user_clinical_created_byTouser?: user;

    @IsOptional()
    diabetes_description?: diabetes_description;

    @IsOptional()
    hypertension_description?: hypertension_description;

    @IsOptional()
    personal?: personal;

    @IsOptional()
    user_clinical_updated_byTouser?: user;
}
