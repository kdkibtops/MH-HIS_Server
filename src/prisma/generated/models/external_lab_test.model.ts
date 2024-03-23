import { IsInt, IsDefined, IsOptional, IsDate } from "class-validator";
import { user, external_lab, test } from "./";

export class external_lab_test {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    test_ind?: number;

    @IsOptional()
    @IsInt()
    external_lab_id?: number;

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
    user_external_lab_test_created_byTouser?: user;

    @IsOptional()
    external_lab?: external_lab;

    @IsOptional()
    test?: test;

    @IsOptional()
    user_external_lab_test_updated_byTouser?: user;
}
