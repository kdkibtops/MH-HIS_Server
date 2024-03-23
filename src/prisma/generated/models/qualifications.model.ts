import { IsInt, IsDefined, IsOptional, IsString, IsDate } from "class-validator";
import { user, qualification_categories } from "./";

export class qualifications {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    qualification_category_ind?: number;

    @IsOptional()
    @IsInt()
    user_ind?: number;

    @IsOptional()
    @IsString()
    qualification_description?: string;

    @IsOptional()
    @IsString()
    document_url?: string;

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
    user_qualifications_created_byTouser?: user;

    @IsOptional()
    qualification_categories?: qualification_categories;

    @IsOptional()
    user_qualifications_updated_byTouser?: user;

    @IsOptional()
    user_qualifications_user_indTouser?: user;
}
