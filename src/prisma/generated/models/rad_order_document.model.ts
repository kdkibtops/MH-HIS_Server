import { IsInt, IsDefined, IsOptional, IsString, IsDate } from "class-validator";
import { user, radiology_order } from "./";

export class rad_order_document {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    order_ind?: number;

    @IsOptional()
    @IsString()
    document_name?: string;

    @IsOptional()
    @IsString()
    document_description?: string;

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
    user_rad_order_document_created_byTouser?: user;

    @IsOptional()
    radiology_order?: radiology_order;

    @IsOptional()
    user_rad_order_document_updated_byTouser?: user;
}
