import { IsInt, IsDefined, IsOptional, IsString, IsDate } from "class-validator";
import { clinical, user } from "./";

export class hypertension_description {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    max_systolic?: number;

    @IsOptional()
    @IsInt()
    min_diastolic?: number;

    @IsOptional()
    @IsString()
    retina?: string;

    @IsOptional()
    @IsString()
    kidney?: string;

    @IsOptional()
    @IsString()
    coronaries?: string;

    @IsOptional()
    @IsString()
    cerebral?: string;

    @IsOptional()
    @IsString()
    neuropathy?: string;

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
    clinical!: clinical[];

    @IsOptional()
    user_hypertension_description_created_byTouser?: user;

    @IsOptional()
    user_hypertension_description_updated_byTouser?: user;
}
