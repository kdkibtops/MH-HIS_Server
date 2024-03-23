import { IsInt, IsDefined, IsString, IsOptional, IsDate } from "class-validator";
import { user, qualifications } from "./";

export class qualification_categories {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsString()
    category_name?: string;

    @IsOptional()
    @IsString()
    category_description?: string;

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
    user_qualification_categories_created_byTouser?: user;

    @IsOptional()
    user_qualification_categories_updated_byTouser?: user;

    @IsDefined()
    qualifications!: qualifications[];
}
