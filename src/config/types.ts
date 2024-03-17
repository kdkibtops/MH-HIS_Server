import { Procedure } from './../Models/Procedures';
import { Order } from '../Models/Orders';
import { Patient } from '../Models/Patients';
import { Study } from '../Models/Studies';
import { User } from '../Models/Users';

export type AuthenticationReqBody = {
	username?: string;
	user_password?: string;
	JWT?: string;
	authenticated?: {
		status: boolean;
		full_name: string | null;
	};
	timestamp?: string;
};

export type QueryObject = {
	schema: string;
	tableName: string;
	filterColumn: string;
	filterValue: string;
};
export type REQBODY = {
	orders: Order;
	users: User;
	patients: Patient;
	studies: Study;
	query: QueryObject;
	procedure: Procedure;
	criteria: SEARCHCRITERIA;
};

export type aggregationMETHOD = 'AVG' | 'SUM' | 'MIN' | 'MAX' | 'COUNT';
export type numberMatch = '>' | '<' | '>=' | '<=' | '=';
export type stringMatch =
	| '='
	| 'startsWith'
	| 'anyMatch'
	| 'matchCaseOnly'
	| 'matchWholeWordOnly'
	| 'exactMatchAll';
export type stringORNull = string | null;
export type joinDirection = 'LEFT' | 'RIGHT';
export type JOINObject = {
	use: boolean;
	joinDirection: joinDirection;
	table2SchemaName: string;
	table2Name: string;
	table1Fkey: string;
	table2FKey: string;
};
export type GROUPBYObject = {
	use: boolean;
	aggregationMETHOD: aggregationMETHOD;
	aggregationTable: string;
	aggregationColumn: string;
	asColumnName: string;
	groupBYtableName: string[];
	groupBYcolumnName: string[];
};
export type tableObject = {
	use: boolean;
	columns: {
		tablesNames: string[];
		columnsNames: string[];
		asColumnsName: stringORNull[];
	};
	FROMschemaName: string;
	FROMtableName: string;
};
export type newSEARCHFILTERS =
	| {
			checked: boolean;
			WHEREStatement:
				| 'String_WHERE_SingleColumnBETWEEN_TWOValues'
				| 'String_WHERE_MutliColumns_OR_BETWEEN_SameTWOValues'
				| 'String_WHERE_MutliColumns_AND_BETWEEN_SameTWOValues'
				| 'String_WHERE_SingleColumnSingleValue'
				| 'String_WHERE_SingleColumn_OR_MultipleValues'
				| 'String_WHERE_MultiColumns_OR_SameSingleValue'
				| 'String_WHERE_MultiColumns_AND_SameSingleValue'
				| 'String_WHERE_MultiColmns_OR_DifferentValues'
				| 'String_WHERE_MultiColmns_AND_DifferentValues';
			type: 'string';
			tablesName: stringORNull[];
			next: 'OR' | 'AND';
			multipleColumns: string[];
			multipleValues: string[];
			match: stringMatch[];
	  }
	| {
			checked: boolean;
			WHEREStatement:
				| 'String_WHERE_SingleColumnBETWEEN_TWOValues'
				| 'String_WHERE_MutliColumns_OR_BETWEEN_SameTWOValues'
				| 'String_WHERE_MutliColumns_AND_BETWEEN_SameTWOValues'
				| 'String_WHERE_SingleColumnSingleValue'
				| 'String_WHERE_SingleColumn_OR_MultipleValues'
				| 'String_WHERE_MultiColumns_OR_SameSingleValue'
				| 'String_WHERE_MultiColumns_AND_SameSingleValue'
				| 'String_WHERE_MultiColmns_OR_DifferentValues'
				| 'String_WHERE_MultiColmns_AND_DifferentValues';
			type: 'date';
			tablesName: stringORNull[];
			next: 'OR' | 'AND';
			multipleColumns: string[];
			multipleValues: stringMatch[];
			match: stringMatch[];
	  }
	| {
			checked: boolean;
			WHEREStatement:
				| 'Number_WHERE_SingleColumn_BETWEEN_TWOValues'
				| 'Number_WHERE_MutliColumns_OR_BETWEEN_SameTWOValues'
				| 'Number_WHERE_MutliColumns_AND_BETWEEN_SameTWOValues'
				| 'Number_WHERE_SingleColumn_AND_MultipleValues'
				| 'Number_WHERE_SingleColumnSingleValue'
				| 'Number_WHERE_SingleColumn_OR_MultipleValues'
				| 'Number_WHERE_MultiColumns_OR_SameSingleValue'
				| 'Number_WHERE_MultiColumns_AND_SameSingleValue'
				| 'Number_WHERE_MultiColmns_OR_DifferentValues'
				| 'Number_WHERE_MultiColmns_AND_DifferentValues';
			type: 'number';
			tablesName: stringORNull[];
			next: 'OR' | 'AND';
			multipleColumns: string[];
			multipleValues: number[];
			match: numberMatch[];
	  };
export type newSEARCHCRITERIA = {
	customFilterSelected?: number | string;
	lastEntryInd: number;
	LIMIT?: number;
	otherFilters?: newSEARCHFILTERS[];
};

export type OTHERFILTERS =
	| {
			checked: boolean;
			tableName: string;
			criterionColumn: string;
			multipleORColumns: null;
			type: string;
			multipleORValues: null;
			oneValueOnly: string;
			startValue: null;
			endValue: null;
			next?: string | null;
			exactMatch?: boolean | string;
	  }
	| {
			checked: boolean;
			tableName: string;
			criterionColumn: string;
			multipleORColumns: null;
			type: string;
			multipleORValues: null;
			oneValueOnly: null;
			startValue: string;
			endValue: string;
			next?: string | null;
			exactMatch?: boolean | string;
	  }
	| {
			checked: boolean;
			tableName: string;
			criterionColumn: string;
			multipleORColumns: null;
			type: string;
			multipleORValues: string[];
			oneValueOnly: null;
			startValue: null;
			endValue: null;
			next?: string | null;
			exactMatch?: boolean | string;
	  }
	| {
			checked: boolean;
			tableName: string;
			criterionColumn: null;
			multipleORColumns: string[];
			multipleORValues: null;
			type: string;
			oneValueOnly: string;
			startValue: null;
			endValue: null;
			next?: string | null;
			exactMatch?: boolean | string;
	  }
	| {
			checked: boolean;
			tableName: string;
			criterionColumn: null;
			multipleORColumns: string[];
			type: string;
			multipleORValues: string[];
			oneValueOnly: null;
			startValue: null;
			endValue: null;
			next?: string | null;
			exactMatch?: boolean | string;
	  };

export type SEARCHCRITERIA = {
	lastEntryInd: number;
	LIMIT?: number;
	otherFilters?: OTHERFILTERS[];
};

/**This is the only data passed in request headers and not body becasue the body will be containing the file so it's already occupied */
export type FILESINREQHEADER = {
	schema_name: string;
	table_name: string;
	UID_column: string;
	fileColumnInDB: string;
	parent_folder_name: string;
	UID: string;
	UID2: string;
};
