import { IsInt, IsDefined, IsOptional, IsString, IsDate } from "class-validator";
import { user, proc } from "./";

export class proc_paperwork {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    procedure_ind?: number;

    @IsOptional()
    @IsInt()
    document_name?: number;

    @IsOptional()
    @IsString()
    document_description?: string;

    @IsOptional()
    @IsString()
    document_file_path?: string;

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
    user_proc_paperwork_created_byTouser?: user;

    @IsOptional()
    proc?: proc;

    @IsOptional()
    user_proc_paperwork_updated_byTouser?: user;
}
