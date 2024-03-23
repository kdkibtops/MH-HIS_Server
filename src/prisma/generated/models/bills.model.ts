import { IsInt, IsDefined, IsOptional, IsDate } from "class-validator";
import { user, payment_category, transactions, lab_order, radiology_order } from "./";

export class bills {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    bill_id?: number;

    @IsOptional()
    @IsInt()
    payment_category_ind?: number;

    @IsOptional()
    total_exclusive?: number;

    @IsOptional()
    vat_tax?: number;

    @IsOptional()
    other_tax?: number;

    @IsOptional()
    total_inclusive?: number;

    @IsOptional()
    discount?: number;

    @IsOptional()
    net_to_pay?: number;

    @IsOptional()
    @IsDate()
    payement_due?: Date;

    @IsOptional()
    @IsDate()
    payed_at?: Date;

    @IsOptional()
    @IsInt()
    issued_by?: number;

    @IsOptional()
    @IsInt()
    revised_by?: number;

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
    user_bills_created_byTouser?: user;

    @IsOptional()
    user_bills_issued_byTouser?: user;

    @IsOptional()
    payment_category?: payment_category;

    @IsOptional()
    user_bills_revised_byTouser?: user;

    @IsOptional()
    user_bills_updated_byTouser?: user;

    @IsDefined()
    transactions!: transactions[];

    @IsDefined()
    lab_order!: lab_order[];

    @IsDefined()
    radiology_order!: radiology_order[];
}
