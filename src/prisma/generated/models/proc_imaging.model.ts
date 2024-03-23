import { IsInt, IsDefined, IsOptional, IsDate } from "class-validator";
import { user, proc, study } from "./";

export class proc_imaging {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    procedure_ind?: number;

    @IsOptional()
    @IsInt()
    study_ind?: number;

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
    user_proc_imaging_created_byTouser?: user;

    @IsOptional()
    proc?: proc;

    @IsOptional()
    study?: study;

    @IsOptional()
    user_proc_imaging_updated_byTouser?: user;
}
