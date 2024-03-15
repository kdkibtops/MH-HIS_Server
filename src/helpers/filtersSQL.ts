import {
	OTHERFILTERS,
	joinDirection,
	numberMatch,
	stringMatch,
	stringORNull,
} from '../config/types';
const nonStringColumns = ['number', 'date'];

export const legacy_trialAddFilterSQL = (
	filters: OTHERFILTERS[],
	lastEndryIndex: number
): string => {
	const checkedFilters = filters.filter((f) => f.checked);

	const sqlArr = checkedFilters.map((f, index) => {
		let sqlString = '';
		if (f.multipleORValues) {
			console.error('multiple or values........');
		} else {
			console.error('not multiple OR Values');
		}
		if (index === 0 && filters.length === 1) {
			// START AND END
			sqlString += `( `;
			let values = f.oneValueOnly
				? `${
						f.type === 'number'
							? new String().concat(' = ', f.oneValueOnly)
							: f.type === 'date'
							? new String().concat(`='`, f.oneValueOnly, `'`)
							: f.exactMatch === 'exactMatchAll'
							? new String().concat(' = ', "'", f.oneValueOnly, "'")
							: f.exactMatch === 'matchCaseOnly'
							? new String().concat("LIKE '%", f.oneValueOnly, "%'")
							: f.exactMatch === 'matchWholeWordOnly'
							? new String().concat(" = LOWER('", f.oneValueOnly, "')")
							: new String().concat("LIKE LOWER('%", f.oneValueOnly, "%')")
				  }`
				: ` BETWEEN 
			${
				f.type === 'number'
					? f.startValue
					: new String().concat("'", f.startValue as string, "'")
			}
			AND 
			${
				f.type === 'number'
					? f.endValue
					: new String().concat("'", f.endValue as string, "'")
			}
			`;

			let columnStr = '';
			if (f.multipleORColumns) {
				let ie = 0;
				f.multipleORColumns.forEach((eachCriterionColumn, i) => {
					columnStr += ` ${
						nonStringColumns.includes(f.type)
							? eachCriterionColumn
							: f.exactMatch === 'exactMatchAll' ||
							  f.exactMatch === 'matchCaseOnly'
							? eachCriterionColumn
							: new String().concat('LOWER (', eachCriterionColumn, ')')
					} ${values}`;
					if (i < f.multipleORColumns.length - 1) {
						columnStr += ` OR `;
					}
					ie++;
				});
			}
			sqlString += columnStr;
			sqlString += `)`;
		} else if (index === 0 && filters.length > 1) {
			sqlString += `(`;
			// START ONLY
			let values = f.oneValueOnly
				? `${
						f.type === 'number'
							? new String().concat(' = ', f.oneValueOnly)
							: f.type === 'date'
							? new String().concat(`='`, f.oneValueOnly, `'`)
							: f.exactMatch === 'exactMatchAll'
							? new String().concat(' = ', "'", f.oneValueOnly, "'")
							: f.exactMatch === 'matchCaseOnly'
							? new String().concat("LIKE '%", f.oneValueOnly, "%'")
							: f.exactMatch === 'matchWholeWordOnly'
							? new String().concat(" = LOWER('", f.oneValueOnly, "')")
							: new String().concat("LIKE LOWER('%", f.oneValueOnly, "%')")
				  }`
				: ` BETWEEN 
			${
				f.type === 'number'
					? f.startValue
					: new String().concat("'", f.startValue as string, "'")
			}
			AND 
			${
				f.type === 'number'
					? f.endValue
					: new String().concat("'", f.endValue as string, "'")
			}
			`;

			let columnStr = '';
			if (f.multipleORColumns) {
				f.multipleORColumns.forEach((eachCriterionColumn, i) => {
					columnStr += ` ${
						nonStringColumns.includes(f.type)
							? eachCriterionColumn
							: f.exactMatch === 'exactMatchAll' ||
							  f.exactMatch === 'matchCaseOnly'
							? eachCriterionColumn
							: new String().concat('LOWER (', eachCriterionColumn, ')')
					} ${values} `;
					if (i < f.multipleORColumns.length - 1) {
						columnStr += ` OR `;
					}
				});
			}
			sqlString += columnStr;
			sqlString += `) ${f.next ? f.next : 'AND '}`;
		} else if (index !== 0 && index < filters.length - 1) {
			sqlString += `(`;
			// IN BETWEEN
			const values = f.oneValueOnly
				? `${
						f.type === 'number'
							? new String().concat(' = ', f.oneValueOnly)
							: f.type === 'date'
							? new String().concat(`='`, f.oneValueOnly, `'`)
							: f.exactMatch === 'exactMatchAll'
							? new String().concat(' = ', "'", f.oneValueOnly, "'")
							: f.exactMatch === 'matchCaseOnly'
							? new String().concat("LIKE '%", f.oneValueOnly, "%'")
							: f.exactMatch === 'matchWholeWordOnly'
							? new String().concat(" = LOWER('", f.oneValueOnly, "')")
							: new String().concat("LIKE LOWER('%", f.oneValueOnly, "%')")
				  }`
				: ` BETWEEN 
			${
				f.type === 'number'
					? f.startValue
					: new String().concat("'", f.startValue as string, "'")
			}
			AND 
			${
				f.type === 'number'
					? f.endValue
					: new String().concat("'", f.endValue as string, "'")
			}
			`;
			let columnStr = '';
			if (f.multipleORColumns) {
				f.multipleORColumns.forEach((eachCriterionColumn, i) => {
					columnStr += ` ${
						nonStringColumns.includes(f.type)
							? eachCriterionColumn
							: f.exactMatch === 'exactMatchAll' ||
							  f.exactMatch === 'matchCaseOnly'
							? eachCriterionColumn
							: new String().concat('LOWER (', eachCriterionColumn, ')')
					} ${values} `;
					if (i < f.multipleORColumns.length - 1) {
						columnStr += ` OR `;
					}
				});
			}
			sqlString += columnStr;
			sqlString += `) ${f.next ? f.next : 'AND '}`;
		} else {
			sqlString += `(`;
			// END ONLY
			const values = f.oneValueOnly
				? `${
						f.type === 'number'
							? new String().concat(' = ', f.oneValueOnly)
							: f.type === 'date'
							? new String().concat(`='`, f.oneValueOnly, `'`)
							: f.exactMatch === 'exactMatchAll'
							? new String().concat(' = ', "'", f.oneValueOnly, "'")
							: f.exactMatch === 'matchCaseOnly'
							? new String().concat("LIKE '%", f.oneValueOnly, "%'")
							: f.exactMatch === 'matchWholeWordOnly'
							? new String().concat(" = LOWER('", f.oneValueOnly, "')")
							: new String().concat("LIKE LOWER('%", f.oneValueOnly, "%')")
				  }`
				: ` BETWEEN 
			${
				f.type === 'number'
					? f.startValue
					: new String().concat("'", f.startValue as string, "'")
			}
			AND 
			${
				f.type === 'number'
					? f.endValue
					: new String().concat("'", f.endValue as string, "'")
			}
			`;
			let columnStr = '';
			if (f.multipleORColumns) {
				f.multipleORColumns.forEach((eachCriterionColumn, i) => {
					columnStr += ` ${
						nonStringColumns.includes(f.type)
							? eachCriterionColumn
							: f.exactMatch === 'exactMatchAll' ||
							  f.exactMatch === 'matchCaseOnly'
							? eachCriterionColumn
							: new String().concat('LOWER (', eachCriterionColumn, ')')
					} ${values} `;
					if (i < f.multipleORColumns.length - 1) {
						columnStr += ` OR `;
					}
				});
			}
			sqlString += columnStr;
			sqlString += `)`;
		}
		return sqlString;
	});

	return new String().concat(
		checkedFilters.length > 0 && lastEndryIndex
			? ' AND '
			: checkedFilters.length > 0
			? ' WHERE '
			: '',
		...sqlArr
	);
};

export class SELECTSQLQUERY {
	private where = '';
	private select = '';
	private join = '';
	private orderby = '';
	private groupbyAggregateFunction = '';
	private groupbyAggregateColumn = '';
	private limit = '';
	private firstWHEREStatement = true;
	private mainTableName = '';
	private mainSchemaName = '';
	private values = [];
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
				}"${column[0]}") LIKE LOWER('%${value[0]}%')) `;
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
			case '=':
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
		console.log(tablesName);
		console.log(columns);
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
	public SELECT(
		columns:
			| { tablesNames: string; columnsNames: '*'; asColumnsName: null }
			| {
					tablesNames: string;
					columnsNames: string;
					asColumnsName: stringORNull;
			  }
			| {
					tablesNames: string[];
					columnsNames: string[];
					asColumnsName: stringORNull[] | null;
			  },
		FROMschemaName: string,
		FROMtableName: string
	) {
		const { tablesNames, columnsNames, asColumnsName } = columns;
		// to be used later on when needed instead of requiring to provide in each function
		this.mainSchemaName = FROMschemaName;
		this.mainTableName = FROMtableName;
		this.select += `SELECT `;
		if (columnsNames === '*') {
			this.select += `"${tablesNames}".${columnsNames}\nFROM ${FROMschemaName}.${FROMtableName}`;
		} else if (asColumnsName) {
			if (typeof columnsNames === 'string') {
				this.select += `${tablesNames}.${
					columnsNames === '*' ? '*' : `"${columnsNames}"`
				} ${
					asColumnsName ? `AS "${asColumnsName}"` : ''
				}\nFROM "${FROMschemaName}"."${FROMtableName}" `;
			} else {
				columnsNames.forEach((col, i) => {
					this.select += `\n${tablesNames[i]}.${
						col === '*' ? '*' : `"${col}"`
					} ${asColumnsName[i] ? `AS "${asColumnsName[i]}"` : ''},`;
				});
				this.select = this.select.slice(0, -1);
				this.select += `\nFROM ${FROMschemaName}.${FROMtableName}`;
			}
		} else {
			this.select += `${new String(
				`${tablesNames}.${columnsNames}`
			)}\nFROM ${FROMschemaName}.${FROMtableName}`;
		}
		return this;
	}
	public JOIN(
		joinDirection: joinDirection,
		table2SchemaName: string,
		table2Name: string,
		table1Fkey: string,
		table2FKey: string
	) {
		// const { mainTableName } = this;
		if (this.mainTableName !== table2Name) {
			this.join += `\n${joinDirection} JOIN ${table2SchemaName}.${table2Name}\nON ${this.mainTableName}."${table1Fkey}" = ${table2Name}."${table2FKey}"`;
		}
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
	/** STILL UNDER DEVELOPMENT */
	public GROUPBY(
		aggregationMETHOD: 'AVG' | 'SUM' | 'MIN' | 'MAX' | 'COUNT',
		aggregationTable: string,
		agrregationColumn: string,
		asColumnName: string,
		groupBYtableName: string,
		groupBYcolumnName: string
	) {
		this.groupbyAggregateFunction = `,\n${aggregationMETHOD} (${aggregationTable}."${agrregationColumn}") AS ${asColumnName}`;
		this.groupbyAggregateColumn = `\nGROUP BY (${groupBYtableName}."${groupBYcolumnName}")`;
		return this;
	}
	public BUILDSQL() {
		// Process and arrange the SQL string
		let str = `${this.select}${this.join}${this.where}`;
		if (this.groupbyAggregateFunction !== '') {
			const [str1, str2] = str.split('\nFROM');
			str = `${str1}${this.groupbyAggregateFunction}\nFROM${str2}`;
			str = str.concat(this.groupbyAggregateColumn);
		}
		str += `${this.orderby}${this.limit};`;
		const countStr = str.split('LIMIT')[0];

		// Clear the object
		this.where = '';
		this.select = '';
		this.join = '';
		this.orderby = '';
		this.groupbyAggregateFunction = '';
		this.groupbyAggregateColumn = '';
		this.limit = '';
		this.firstWHEREStatement = true;
		// return the SQL string
		return [str, countStr];
	}
}
