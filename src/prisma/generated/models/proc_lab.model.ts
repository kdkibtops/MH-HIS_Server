import { IsInt, IsDefined, IsOptional, IsDate } from "class-validator";
import { user, proc, test } from "./";

export class proc_lab {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    procedure_ind?: number;

    @IsOptional()
    @IsInt()
    test_id?: number;

    @IsOptional()
    max_limit?: number;

    @IsOptional()
    min_limit?: number;

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
    user_proc_lab_created_byTouser?: user;

    @IsOptional()
    proc?: proc;

    @IsOptional()
    test?: test;

    @IsOptional()
    user_proc_lab_updated_byTouser?: user;
}
