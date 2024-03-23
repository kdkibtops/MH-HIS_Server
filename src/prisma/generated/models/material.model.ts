import { IsInt, IsDefined, IsString, IsOptional, IsDate } from "class-validator";
import { item_movement, store, user } from "./";

export class material {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsString()
    material_id?: string;

    @IsOptional()
    @IsString()
    sku?: string;

    @IsOptional()
    @IsString()
    item_name?: string;

    @IsOptional()
    @IsInt()
    category?: number;

    @IsOptional()
    @IsInt()
    store_id?: number;

    @IsOptional()
    price?: number;

    @IsOptional()
    @IsInt()
    stock?: number;

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
    item_movement!: item_movement[];

    @IsOptional()
    store_material_categoryTostore?: store;

    @IsOptional()
    user_material_created_byTouser?: user;

    @IsOptional()
    store_material_store_idTostore?: store;

    @IsOptional()
    user_material_updated_byTouser?: user;
}
