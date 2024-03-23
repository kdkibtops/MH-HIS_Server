import { IsInt, IsDefined, IsString, IsOptional, IsDate } from "class-validator";
import { material, user } from "./";

export class store {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsString()
    store_id?: string;

    @IsOptional()
    @IsString()
    store_name?: string;

    @IsOptional()
    @IsString()
    store_location?: string;

    @IsOptional()
    @IsInt()
    trustee?: number;

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
    material_material_categoryTostore!: material[];

    @IsDefined()
    material_material_store_idTostore!: material[];

    @IsOptional()
    user_store_created_byTouser?: user;

    @IsOptional()
    user_store_trusteeTouser?: user;

    @IsOptional()
    user_store_updated_byTouser?: user;
}
