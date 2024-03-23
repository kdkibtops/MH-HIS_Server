import { IsInt, IsDefined, IsOptional, IsString, IsDate } from "class-validator";
import { user, material } from "./";

export class item_movement {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    item_ind?: number;

    @IsOptional()
    @IsInt()
    amount?: number;

    @IsOptional()
    @IsString()
    movement_date?: string;

    @IsOptional()
    @IsString()
    movement_status?: string;

    @IsOptional()
    @IsString()
    moved_from?: string;

    @IsOptional()
    @IsString()
    moved_to?: string;

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
    user_item_movement_created_byTouser?: user;

    @IsOptional()
    material?: material;

    @IsOptional()
    user_item_movement_updated_byTouser?: user;
}
