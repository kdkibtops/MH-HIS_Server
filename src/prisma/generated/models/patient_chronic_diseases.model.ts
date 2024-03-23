import { IsInt, IsDefined, IsDate, IsOptional } from "class-validator";
import { user, chronic_diseases_list, personal } from "./";

export class patient_chronic_diseases {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsDefined()
    @IsInt()
    patient_ind!: number;

    @IsDefined()
    @IsInt()
    disease_ind!: number;

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
    user_patient_chronic_diseases_created_byTouser?: user;

    @IsDefined()
    chronic_diseases_list!: chronic_diseases_list;

    @IsDefined()
    personal!: personal;

    @IsOptional()
    user_patient_chronic_diseases_updated_byTouser?: user;
}
