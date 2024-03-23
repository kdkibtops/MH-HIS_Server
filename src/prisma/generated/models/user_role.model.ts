import { Prisma } from "@prisma/client";
import { IsInt, IsDefined, IsOptional, IsString, IsDate } from "class-validator";
import { user } from "./";

export class user_role {
    @IsDefined()
    @IsInt()
    ind!: number;

    @IsOptional()
    @IsInt()
    role_id?: number;

    @IsOptional()
    @IsString()
    role_name?: string;

    @IsOptional()
    role_privileges?: Prisma.JsonValue;

    @IsOptional()
    @IsDate()
    created_at?: Date;

    @IsOptional()
    @IsDate()
    updated_at?: Date;

    @IsDefined()
    user_user_user_roleTouser_role!: user[];
}
