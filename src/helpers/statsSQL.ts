import {
	joinDirection,
	numberMatch,
	stringMatch,
	stringORNull,
} from '../config/types';

export class STATSQUERY {
	private foreignKeys = {
		orders: 'mrn',
		studies: 'study_id',
		patients: 'mrn',
		users: 'radiologist',
	};
	private mainTableSchemaName = '';
	private mainTableName = '';
	private where = '';
	private select = '';
	private join = '';
	private orderby = '';
	private groupBY = '';
	private limit = '';
	private firstWHEREStatement = true;
	public OR_in_WHERE_statement() {
		//  to avoid adding OR if no previous WHERE STATAEMENT
		this.where += this.where.includes('WHERE') ? `\nOR ` : '';
		return this;
	}
	public AND_in_WHERE_statement() {
		//  to avoid adding AND if no previous WHERE STATAEMENT
		this.where += this.where.includes('WHERE') ? `\nAND ` : '';
		return this;
	}
	public WHERE_statement_Only = () => {
		this.where += `\nWHERE`;
		this.firstWHEREStatement = false;
		return this;
	};
	public openWhereParantheses = () => {
		this.where += `\n(\n`;
		return this;
	};
	public closeWhereParantheses = () => {
		this.where += `\n)`;
		return this;
	};

	/**NUMBERS */
	/**WHERE single column BETWEEN 2 values */
	public Number_WHERE_SingleColumn_BETWEEN_TWOValues(
		tableName: stringORNull[],
		column: string[],
		values: number[],
		match?: numberMatch[]
	) {
		this.where += this.firstWHEREStatement ? `\nWHERE (` : ` (`;
		this.where += `${tableName[0] ? `${tableName[0]}.` : ''}"${
			column[0]
		}" BETWEEN ${values[0]} AND ${values[1]}`;
		this.where += `)`;
		this.firstWHEREStatement = false;
		return this;
	}
	/**WHERE any of multiple columns BETWEEN same 2 values */
	public Number_WHERE_MutliColumns_OR_BETWEEN_SameTWOValues(
		tablesName: stringORNull[],
		columns: string[],
		values: number[],
		match?: numberMatch[]
	) {
		this.where += this.firstWHEREStatement ? `\nWHERE (` : ` (`;
		columns.forEach((col, i) => {
			this.where += ` ${
				tablesName[i] ? `${tablesName[i]}.` : ''
			}"${col}" BETWEEN ${values[0]} AND ${values[1]}) `;
			if (i < columns.length - 1) {
				this.where += ` OR `;
			}
		});
		this.where += `)`;
		this.firstWHEREStatement = false;
		return this;
	}
	/**WHERE all of the multiple columns BETWEEN same 2 values */
	public Number_WHERE_MutliColumns_AND_BETWEEN_SameTWOValues(
		tablesName: stringORNull[],
		columns: string[],
		values: number[],
		match?: numberMatch[]
	) {
		this.where += this.firstWHEREStatement ? `\nWHERE (` : ` (`;
		columns.forEach((col, i) => {
			this.where += ` ${
				tablesName[i] ? `${tablesName[i]}.` : ''
			}"${col}" BETWEEN ${values[0]} AND ${values[1]}) `;
			if (i < columns.length - 1) {
				this.where += ` AND `;
			}
		});
		this.where += `)`;
		this.firstWHEREStatement = false;
		return this;
	}
	/**Number only, and there's no = operator to act like between */
	public Number_WHERE_SingleColumn_AND_MultipleValues(
		tableName: stringORNull[],
		column: string[],
		values: number[],
		match: numberMatch[]
	) {
		this.where += this.firstWHEREStatement ? `\nWHERE (` : ` (`;
		values.forEach((val, i) => {
			this.where += `${tableName[0] ? `${tableName[0]}.` : ''}"${column[0]}" ${
				match[i] ? match[i] : match[0]
			} ${val}`;
			if (i < values.length - 1) {
				this.where += ` AND `;
			}
		});
		this.where += `)`;
		this.firstWHEREStatement = false;
		return this;
	}
	/**WHERE single column !matches! single value */
	public Number_WHERE_SingleColumnSingleValue(
		tableName: stringORNull[],
		column: string[],
		value: number[],
		match: numberMatch[]
	) {
		this.where += ` ${this.firstWHEREStatement ? `\nWHERE ` : ``} (${
			tableName[0] ? `${tableName[0]}.` : ''
		}"${column[0]}" ${match[0]} ${value[0]}) `;
		this.firstWHEREStatement = false;
		return this;
	}
	/**WHERE single column !matches! any of multiple values */
	public Number_WHERE_SingleColumn_OR_MultipleValues(
		tableName: stringORNull[],
		column: string[],
		values: number[],
		match: numberMatch[]
	) {
		this.where += this.firstWHEREStatement ? `\nWHERE (` : ` (`;
		values.forEach((val, i) => {
			this.where += `${tableName[0] ? `${tableName[0]}.` : ''}"${column[0]}" ${
				match[i] ? match[i] : match[0]
			} ${val}`;
			if (i < values.length - 1) {
				this.where += ` OR `;
			}
		});
		this.where += `)`;
		this.firstWHEREStatement = false;
		return this;
	}
	/**WHERE any column of mutliple columns !matches! single value */
	public Number_WHERE_MultiColumns_OR_SameSingleValue(
		tablesName: stringORNull[],
		columns: string[],
		value: number[],
		match: numberMatch[]
	) {
		this.where += this.firstWHEREStatement ? `\nWHERE (` : ` (`;
		columns.forEach((col, i) => {
			this.where += ` ${tablesName[i] ? `${tablesName[i]}.` : ''}"${col}" ${
				match[0]
			} ${value[0]}) `;
			if (i < columns.length - 1) {
				this.where += ` OR `;
			}
		});
		this.where += `) `;
		this.firstWHEREStatement = false;
		return this;
	}
	/**WHERE mutliple columns !matches!  value respectivley */
	public Number_WHERE_MultiColumns_AND_SameSingleValue(
		tablesName: stringORNull[],
		columns: string[],
		value: number[],
		match: numberMatch[]
	) {
		this.where += this.firstWHEREStatement ? `\nWHERE (` : ` (`;
		columns.forEach((col, i) => {
			this.where += ` ${tablesName[i] ? `${tablesName[i]}.` : ''}"${col}" ${
				match[0]
			} ${value[0]}) `;
			if (i < columns.length - 1) {
				this.where += ` AND `;
			}
		});
		this.where += `) `;
		this.firstWHEREStatement = false;
		return this;
	}
	/**WHERE any of mutliple columns !matches! mutliple values respectivley */
	public Number_WHERE_MultiColmns_OR_DifferentValues(
		tablesName: stringORNull[],
		columns: string[],
		values: number[],
		match: numberMatch[]
	) {
		this.where += this.firstWHEREStatement ? `\nWHERE (` : ` (`;
		columns.forEach((col, i) => {
			this.where += ` ${tablesName[i] ? `${tablesName[i]}.` : ''}"${col}" ${
				match[i] ? match[i] : match[0]
			} ${values[i]}`;
			if (i < columns.length - 1) {
				this.where += ` OR `;
			}
		});
		this.where += ` )`;
		this.firstWHEREStatement = false;
		return this;
	}
	/**WHERE mutliple columns !matches! mutliple values respectivley */
	public Number_WHERE_MultiColmns_AND_DifferentValues(
		tablesName: stringORNull[],
		columns: string[],
		values: number[],
		match: numberMatch[]
	) {
		this.where += this.firstWHEREStatement ? `\nWHERE (` : ` (`;
		columns.forEach((col, i) => {
			this.where += ` ${tablesName[i] ? `${tablesName[i]}.` : ''}"${col}" ${
				match[i] ? match[i] : match[0]
			} ${values[i]}`;
			if (i < columns.length - 1) {
				this.where += ` AND `;
			}
		});
		this.where += ` )`;
		this.firstWHEREStatement = false;
		return this;
	}

	/**STRING */
	/**WHERE single column !matches! single value */
	public String_WHERE_SingleColumnSingleValue(
		tableName: stringORNull[],
		column: string[],
		value: string[],
		match: stringMatch[]
	) {
		switch (match[0]) {
			case 'anyMatch':
				this.where += ` ${this.firstWHEREStatement ? `\nWHERE ` : ``} ( LOWER(${
					tableName[0] ? `${tableName[0]}.` : ''
				}"${column[0]}") = LOWER('%${value[0]}%')) `;
				this.firstWHEREStatement = false;
				break;
			case 'matchCaseOnly':
				this.where += ` ${this.firstWHEREStatement ? `\nWHERE ` : ``} ( ${
					tableName[0] ? `${tableName[0]}.` : ''
				}"${column[0]}" LIKE '%${value[0]}%') `;
				this.firstWHEREStatement = false;
				break;
			case 'matchWholeWordOnly':
				this.where += ` ${this.firstWHEREStatement ? `\nWHERE ` : ``} ( LOWER(${
					tableName[0] ? `${tableName[0]}.` : ''
				}"${column[0]}") = LOWER('${value[0]}')) `;
				this.firstWHEREStatement = false;
				break;

			case 'exactMatchAll':
				this.where += ` ${this.firstWHEREStatement ? `\nWHERE ` : ``} ( ${
					tableName[0] ? `${tableName[0]}.` : ''
				}"${column[0]}" = '${value[0]}') `;
				this.firstWHEREStatement = false;
				break;
		}
		return this;
	}
	/**WHERE single column BETWEEN 2 values */
	public String_WHERE_SingleColumnBETWEEN_TWOValues(
		tableName: stringORNull[],
		column: string[],
		values: string[],
		match?: stringMatch[]
	) {
		this.where += this.firstWHEREStatement ? `\nWHERE (` : ` (`;
		this.where += `${tableName[0] ? `${tableName[0]}.` : ''}"${
			column[0]
		}" BETWEEN '${values[0]}' AND '${values[1]}'`;
		this.where += `)`;
		this.firstWHEREStatement = false;

		return this;
	}
	/**WHERE any of multiple columns BETWEEN same 2 values */
	public String_WHERE_MutliColumns_OR_BETWEEN_SameTWOValues(
		tablesName: stringORNull[],
		columns: string[],
		values: string[],
		match?: stringMatch[]
	) {
		this.where += this.firstWHEREStatement ? `\nWHERE (` : ` (`;
		columns.forEach((col, i) => {
			this.where += ` ${
				tablesName[i] ? `${tablesName[i]}.` : ''
			}"${col}" BETWEEN '${values[0]}' AND '${values[1]}') `;
			if (i < columns.length - 1) {
				this.where += `OR `;
			}
		});
		this.where += `)`;
		this.firstWHEREStatement = false;
		return this;
	}
	/**WHERE all of the multiple columns BETWEEN same 2 values */
	public String_WHERE_MutliColumns_AND_BETWEEN_SameTWOValues(
		tablesName: stringORNull[],
		columns: string[],
		values: string[],
		match?: stringMatch[]
	) {
		this.where += this.firstWHEREStatement ? `\nWHERE (` : ` (`;
		columns.forEach((col, i) => {
			this.where += ` ${
				tablesName[i] ? `${tablesName[i]}.` : ''
			}"${col}" BETWEEN '${values[0]}' AND '${values[1]}') `;
			if (i < columns.length - 1) {
				this.where += `AND `;
			}
		});
		this.where += `)`;
		this.firstWHEREStatement = false;
		return this;
	}
	/**WHERE single column !matches! any of multiple values */
	public String_WHERE_SingleColumn_OR_MultipleValues(
		tableName: stringORNull[],
		column: string[],
		values: string[],
		match: stringMatch[]
	) {
		this.where += this.firstWHEREStatement ? `\nWHERE (` : ` (`;
		values.forEach((val, i) => {
			switch (match[0]) {
				case 'anyMatch':
					this.where += `LOWER(${tableName[0] ? `${tableName[0]}.` : ''}"${
						column[0]
					}") LIKE LOWER('%${val}%') `;
					if (i < values.length - 1) {
						this.where += `OR `;
					}
					break;
				case 'matchCaseOnly':
					this.where += `${tableName[0] ? `${tableName[0]}.` : ''}"${
						column[0]
					}" LIKE '%${val}%' `;
					if (i < values.length - 1) {
						this.where += `OR `;
					}
					break;
				case 'matchWholeWordOnly':
					this.where += `LOWER(${tableName[0] ? `${tableName[0]}.` : ''}"${
						column[0]
					}") = LOWER('${val}') `;
					if (i < values.length - 1) {
						this.where += `OR `;
					}
					break;
				case 'exactMatchAll':
					this.where += `${tableName[0] ? `${tableName[0]}.` : ''}"${
						column[0]
					}" = '${val}' `;
					if (i < values.length - 1) {
						this.where += `OR `;
					}
					break;
			}
		});
		this.where += `) `;
		this.firstWHEREStatement = false;

		return this;
	}
	/**WHERE any column of mutliple columns !matches! single value */
	public String_WHERE_MultiColumns_OR_SameSingleValue(
		tablesName: stringORNull[],
		columns: string[],
		value: string[],
		match: stringMatch[]
	) {
		this.where += this.firstWHEREStatement ? `\nWHERE (` : ` (`;
		switch (match[0]) {
			case 'anyMatch':
				columns.forEach((col, i) => {
					this.where += `LOWER(${
						tablesName[i] ? `${tablesName[i]}.` : ''
					}"${col}") LIKE LOWER('%${value[0]}%') `;
					if (i < columns.length - 1) {
						this.where += `OR `;
					}
				});
				break;
			case 'matchCaseOnly':
				columns.forEach((col, i) => {
					this.where += `${
						tablesName[i] ? `${tablesName[i]}.` : ''
					}"${col}" LIKE '%${value[0]}%' `;
					if (i < columns.length - 1) {
						this.where += `OR `;
					}
				});
				break;
			case 'matchWholeWordOnly':
				columns.forEach((col, i) => {
					this.where += `LOWER(${
						tablesName[i] ? `${tablesName[i]}.` : ''
					}"${col}") = LOWER('${value[0]}') `;
					if (i < columns.length - 1) {
						this.where += `OR `;
					}
				});
				break;
			case 'exactMatchAll':
				columns.forEach((col, i) => {
					this.where += `${
						tablesName[i] ? `${tablesName[i]}.` : ''
					}"${col}" = '${value[0]}' `;
					if (i < columns.length - 1) {
						this.where += `OR `;
					}
				});
				break;
		}
		this.where += `) `;
		this.firstWHEREStatement = false;
		return this;
	}
	/**WHERE mutliple columns !matches!  value respectivley */
	public String_WHERE_MultiColumns_AND_SameSingleValue(
		tablesName: stringORNull[],
		columns: string[],
		value: string[],
		match: stringMatch[]
	) {
		this.where += this.firstWHEREStatement ? `\nWHERE (` : ` (`;
		switch (match[0]) {
			case 'anyMatch':
				columns.forEach((col, i) => {
					this.where += `LOWER(${
						tablesName[i] ? `${tablesName[i]}.` : ''
					}"${col}") LIKE LOWER('%${value[0]}%') `;
					if (i < columns.length - 1) {
						this.where += `AND `;
					}
				});
				break;
			case 'matchCaseOnly':
				columns.forEach((col, i) => {
					this.where += `${
						tablesName[i] ? `${tablesName[i]}.` : ''
					}"${col}" LIKE '%${value[0]}%' `;
					if (i < columns.length - 1) {
						this.where += `AND `;
					}
				});
				break;
			case 'matchWholeWordOnly':
				columns.forEach((col, i) => {
					this.where += `LOWER(${
						tablesName[i] ? `${tablesName[i]}.` : ''
					}"${col}") = LOWER('${value[0]}') `;
					if (i < columns.length - 1) {
						this.where += `AND `;
					}
				});
				break;
			case 'exactMatchAll':
				columns.forEach((col, i) => {
					this.where += `${
						tablesName[i] ? `${tablesName[i]}.` : ''
					}"${col}" = '${value[0]}' `;
					if (i < columns.length - 1) {
						this.where += `AND `;
					}
				});
				break;
		}
		this.where += `) `;
		this.firstWHEREStatement = false;
		return this;
	}
	/**WHERE any of mutliple columns !matches! mutliple values respectivley */
	public String_WHERE_MultiColmns_OR_DifferentValues(
		tablesName: stringORNull[],
		columns: string[],
		values: string[],
		match: stringMatch[]
	) {
		this.where += this.firstWHEREStatement ? `\nWHERE (` : ` (`;
		columns.forEach((col, i) => {
			switch (match[i]) {
				case 'anyMatch':
					this.where += ` LOWER(${
						tablesName[i] ? `${tablesName[i]}.` : ''
					}"${col}") LIKE LOWER('%${values[i]}%')`;
					if (i < columns.length - 1) {
						this.where += ` OR `;
					}
					break;
				case 'matchCaseOnly':
					this.where += ` ${
						tablesName[i] ? `${tablesName[i]}.` : ''
					}"${col}" LIKE '%${values[i]}%'`;
					if (i < columns.length - 1) {
						this.where += ` OR `;
					}
					break;
				case 'matchWholeWordOnly':
					this.where += ` LOWER(${
						tablesName[i] ? `${tablesName[i]}.` : ''
					}"${col}") = LOWER('${values[i]}')`;
					if (i < columns.length - 1) {
						this.where += ` OR `;
					}
					break;
				case 'exactMatchAll':
					this.where += ` ${
						tablesName[i] ? `${tablesName[i]}.` : ''
					}"${col}" = '${values[i]}'`;
					if (i < columns.length - 1) {
						this.where += ` OR `;
					}
					break;
			}
		});

		this.where += ` )`;
		this.firstWHEREStatement = false;
		return this;
	}
	/**WHERE mutliple columns !matches! mutliple values respectivley */
	public String_WHERE_MultiColmns_AND_DifferentValues(
		tablesName: stringORNull[],
		columns: string[],
		values: string[],
		match: stringMatch[]
	) {
		this.where += this.firstWHEREStatement ? `\nWHERE (` : ` (`;
		columns.forEach((col, i) => {
			switch (match[i]) {
				case 'anyMatch':
					this.where += ` LOWER(${
						tablesName[i] ? `${tablesName[i]}.` : ''
					}"${col}") LIKE LOWER('%${values[i]}%')`;
					if (i < columns.length - 1) {
						this.where += ` AND `;
					}
					break;
				case 'matchCaseOnly':
					this.where += ` ${
						tablesName[i] ? `${tablesName[i]}.` : ''
					}"${col}" LIKE '%${values[i]}%'`;
					if (i < columns.length - 1) {
						this.where += ` AND `;
					}
					break;
				case 'matchWholeWordOnly':
					this.where += ` LOWER(${
						tablesName[i] ? `${tablesName[i]}.` : ''
					}"${col}") = LOWER('${values[i]}')`;
					if (i < columns.length - 1) {
						this.where += ` AND `;
					}
					break;
				case 'exactMatchAll':
					this.where += ` ${
						tablesName[i] ? `${tablesName[i]}.` : ''
					}"${col}" = '${values[i]}'`;
					if (i < columns.length - 1) {
						this.where += ` AND `;
					}
					break;
			}
		});
		this.where += ` )`;
		this.firstWHEREStatement = false;
		return this;
	}

	public QUERY_countPatientsByGender() {
		this.mainTableSchemaName = 'main';
		this.mainTableName = 'patients';
		this.select = `SELECT gender, COUNT(*) AS patient_count
FROM ${this.mainTableSchemaName}."${this.mainTableName}"
GROUP BY gender`;
		return this;
	}
	public QUERY_averageAgeOfPatients() {
		this.mainTableSchemaName = 'main';
		this.mainTableName = 'patients';
		this.select = `SELECT AVG(age) AS average_age
FROM ${this.mainTableSchemaName}."${this.mainTableName}"`;
		return this;
	}
	public QUERY_totalNumberOfStudies() {
		this.mainTableSchemaName = 'main';
		this.mainTableName = 'studies';
		this.select = `SELECT COUNT(*) AS total_studies
FROM ${this.mainTableSchemaName}."${this.mainTableName}"`;
		return this;
	}
	public QUERY_numberOfStudiesBYModality() {
		this.mainTableSchemaName = 'main';
		this.mainTableName = 'studies';
		this.select = `SELECT modality, COUNT(*) AS study_count
FROM ${this.mainTableSchemaName}."${this.mainTableName}"`;
		this.groupBY = `GROUP BY modality`;
		return this;
	}
	public totalNumberOfOrders = `SELECT COUNT(*) AS total_orders
FROM ${this.mainTableSchemaName}."${this.mainTableName}"`;
	public QUERY_totalNumberOfOrderByStatus() {
		this.mainTableSchemaName = 'main';
		this.mainTableName = 'orders';
		this.select = `SELECT o_status, COUNT(*) AS order_count
FROM ${this.mainTableSchemaName}."${this.mainTableName}"`;
		this.groupBY = `\nGROUP BY o_status`;
		return this;
	}
	public QUERY_mostFrequentlyOrderdStudies() {
		this.mainTableSchemaName = 'main';
		this.mainTableName = 'orders';
		this.select = `SELECT studies.study_name, COUNT(*) AS order_count
FROM ${this.mainTableSchemaName}."${this.mainTableName}"
INNER JOIN studies ON orders.study_id = studies.study_id`;
		this.groupBY = `\nGROUP BY studies.study_name`;
		this.orderby = `\nORDER BY order_count DESC`;
		this.limit = `\nLIMIT 10`;
		return this;
	}
	public QUERY_reportStatusCountForRadiologist() {
		this.mainTableSchemaName = 'main';
		this.mainTableName = 'orders';
		this.select = `SELECT orders.report_status, COUNT(*) AS reports_count
FROM ${this.mainTableSchemaName}."${this.mainTableName}"`;
		this.groupBY = `\nGROUP BY report_status`;
		return this;
	}
	public ORDERBY(tableName: string, column: string, ORDER: 'DESC' | 'ASC') {
		this.orderby += `\nORDER BY ${tableName}."${column}" ${ORDER}`;
		return this;
	}
	public LIMIT(no: number) {
		this.limit += `\nLIMIT ${no}`;
		return this;
	}
	public JOIN(
		joinDirection: joinDirection,
		table2SchemaName: string,
		table2Name: string,
		table1Fkey: string,
		table2FKey: string
	) {
		const { mainTableSchemaName, mainTableName } = this;
		if (
			mainTableName !== table2Name ||
			mainTableSchemaName !== table2SchemaName
		) {
			const x = Object.keys(this.foreignKeys).filter(
				(k) => k === this.mainTableName
			)[0];
			console.log(x);
			const fKey = x[mainTableName as keyof typeof x];
			// this.join += `\n${joinDirection} JOIN ${table2SchemaName}.${table2Name}\nON ${mainTableName}."${table1Fkey}" = ${table2Name}."${table2FKey}"`}
			this.join += `\n${joinDirection} JOIN ${table2SchemaName}.${table2Name}\nON ${mainTableName}."${fKey}" = ${table2Name}."${fKey}"`;
		}
		return this;
	}
	/** STILL UNDER DEVELOPMENT */
	public BUILDSQL() {
		// Process and arrange the SQL string
		let str = `${this.select}${this.join}${this.where}${this.groupBY}${this.orderby}${this.limit}`;
		// Clear the object
		this.where = '';
		this.select = '';
		this.join = '';
		this.orderby = '';
		this.groupBY = '';
		this.limit = '';
		this.firstWHEREStatement = true;
		// return the SQL string
		return str;
	}
}
