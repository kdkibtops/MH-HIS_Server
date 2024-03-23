import { IsInt, IsDefined, IsString, IsOptional, IsDate } from "class-validator";
import { study, user } from "./";

export class study_preparation {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsString()
    hint_text?: string;

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

    @IsDefined()
    study_study_study_preparationTostudy_preparation!: study[];

    @IsOptional()
    user_study_preparation_created_byTouser?: user;

    @IsOptional()
    user_study_preparation_updated_byTouser?: user;
}
