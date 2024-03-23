import { IsInt, IsDefined, IsString, IsOptional, IsDate } from "class-validator";
import { user } from "./";

export class categories {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsString()
    inv_category_id?: string;

    @IsOptional()
    @IsString()
    category_name?: string;

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
    user_categories_created_byTouser?: user;

    @IsOptional()
    user_categories_updated_byTouser?: user;
}
