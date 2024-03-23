import { IsInt, IsDefined, IsString, IsOptional, IsDate } from "class-validator";
import { proc_imaging, radiology_order, user, study_preparation } from "./";

export class study {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsString()
    study_id?: string;

    @IsOptional()
    @IsString()
    modality?: string;

    @IsOptional()
    @IsString()
    study_name?: string;

    @IsOptional()
    @IsString()
    arabic_name?: string;

    @IsOptional()
    price?: number;

    @IsOptional()
    @IsInt()
    study_preparation?: number;

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
    proc_imaging!: proc_imaging[];

    @IsDefined()
    radiology_order!: radiology_order[];

    @IsOptional()
    user_study_created_byTouser?: user;

    @IsOptional()
    study_preparation_study_study_preparationTostudy_preparation?: study_preparation;

    @IsOptional()
    user_study_updated_byTouser?: user;
}
