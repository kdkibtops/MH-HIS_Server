import { IsInt, IsDefined, IsString, IsOptional, IsDate } from "class-validator";
import { bills, user } from "./";

export class transactions {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsString()
    transaction_name?: string;

    @IsOptional()
    @IsDate()
    transaction_at?: Date;

    @IsOptional()
    @IsInt()
    bill_ind?: number;

    @IsOptional()
    @IsInt()
    issued_by?: number;

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
    bills?: bills;

    @IsOptional()
    user_transactions_created_byTouser?: user;

    @IsOptional()
    user_transactions_issued_byTouser?: user;

    @IsOptional()
    user_transactions_updated_byTouser?: user;
}
