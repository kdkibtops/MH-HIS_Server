import { IsInt, IsDefined, IsOptional, IsString, IsDate } from "class-validator";
import { user } from "./";

export class job {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    job_id?: number;

    @IsOptional()
    @IsString()
    job_name?: string;

    @IsOptional()
    @IsDate()
    created_at?: Date;

    @IsOptional()
    @IsDate()
    updated_at?: Date;

    @IsDefined()
    user_user_jobTojob!: user[];
}
