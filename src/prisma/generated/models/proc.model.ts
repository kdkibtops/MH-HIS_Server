import { IsInt, IsDefined, IsString, IsOptional, IsDate } from "class-validator";
import { user, proc_imaging, proc_lab, proc_paperwork } from "./";

export class proc {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsString()
    proc_id?: string;

    @IsOptional()
    @IsString()
    proc_name?: string;

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

    @IsOptional()
    user_proc_created_byTouser?: user;

    @IsOptional()
    user_proc_updated_byTouser?: user;

    @IsDefined()
    proc_imaging!: proc_imaging[];

    @IsDefined()
    proc_lab!: proc_lab[];

    @IsDefined()
    proc_paperwork!: proc_paperwork[];
}
