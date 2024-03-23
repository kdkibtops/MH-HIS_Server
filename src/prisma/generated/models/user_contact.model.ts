import { IsInt, IsDefined, IsOptional, IsString, IsDate } from "class-validator";
import { user } from "./";

export class user_contact {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    user_ind?: number;

    @IsOptional()
    @IsString()
    contact_description?: string;

    @IsOptional()
    @IsString()
    contact_value?: string;

    @IsOptional()
    @IsString()
    contact_notes?: string;

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
    user_user_contact_created_byTouser?: user;

    @IsOptional()
    user_user_contact_updated_byTouser?: user;

    @IsOptional()
    user_user_contact_user_indTouser?: user;
}
