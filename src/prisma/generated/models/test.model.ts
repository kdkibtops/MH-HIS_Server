import { IsInt, IsDefined, IsString, IsOptional, IsDate } from "class-validator";
import { external_lab_test, lab_order, user, proc_lab } from "./";

export class test {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsString()
    test_id?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    test_name?: string;

    @IsOptional()
    @IsString()
    arabic_name?: string;

    @IsOptional()
    price?: number;

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
    external_lab_test!: external_lab_test[];

    @IsDefined()
    lab_order!: lab_order[];

    @IsOptional()
    user_test_created_byTouser?: user;

    @IsOptional()
    user_test_updated_byTouser?: user;

    @IsDefined()
    proc_lab!: proc_lab[];
}
