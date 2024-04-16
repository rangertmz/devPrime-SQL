interface TableField {
  oldColumnName:string,
  columnName: string;
    dataType: string;
    maxLength?: number; 
    isNullable: boolean;
    isPrimaryKey: boolean;
    isIdentity?: boolean; 
    isNew?: boolean;
  }

  export default TableField