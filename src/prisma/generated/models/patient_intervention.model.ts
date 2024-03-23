import { IsInt, IsDefined, IsOptional, IsString, IsDate } from "class-validator";
import { user, personal } from "./";

export class patient_intervention {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    patient_ind?: number;

    @IsDefined()
    @IsString()
    intervention_name!: string;

    @IsOptional()
    @IsDate()
    intervention_date?: Date;

    @IsOptional()
    @IsString()
    complications?: string;

    @IsOptional()
    @IsString()
    done_by?: string;

    @IsOptional()
    @IsString()
    done_at?: string;

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
    user_patient_intervention_created_byTouser?: user;

    @IsOptional()
    personal?: personal;

    @IsOptional()
    user_patient_intervention_updated_byTouser?: user;
}
