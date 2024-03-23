import { IsInt, IsDefined, IsOptional, IsString, IsDate } from "class-validator";
import { bills, user, personal } from "./";

export class payment_category {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    payment_id?: number;

    @IsOptional()
    @IsString()
    payment_name?: string;

    @IsOptional()
    @IsString()
    account?: string;

    @IsOptional()
    @IsInt()
    max_coverage_limit?: number;

    @IsOptional()
    @IsInt()
    payment_range_in_days?: number;

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
    bills!: bills[];

    @IsOptional()
    user_payment_category_created_byTouser?: user;

    @IsOptional()
    user_payment_category_updated_byTouser?: user;

    @IsDefined()
    personal_personal_payment_categoryTopayment_category!: personal[];
}
