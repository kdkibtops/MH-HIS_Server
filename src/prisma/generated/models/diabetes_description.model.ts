import { IsInt, IsDefined, IsOptional, IsString, IsDate } from "class-validator";
import { clinical, user } from "./";

export class diabetes_description {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    max_fasting?: number;

    @IsOptional()
    @IsInt()
    min_fasting?: number;

    @IsOptional()
    @IsInt()
    max_post_prandial?: number;

    @IsOptional()
    @IsInt()
    min_post_prandial?: number;

    @IsOptional()
    max_hba1c?: number;

    @IsOptional()
    min_hba1c?: number;

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
    user_diabetes_description_created_byTouser?: user;

    @IsOptional()
    user_diabetes_description_updated_byTouser?: user;
}
