import BASE_URL from "../config/config";
import TableField from "../Interfaces/ITable";

export const deleteTable = async (databaseName: string, tableName: string) => {
  try {
    const response = await fetch(`${BASE_URL}/deleteTable`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ databaseName, tableName }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
export const getTables = async (databaseName: string) => {
  try {
    const response = await fetch(`${BASE_URL}/getTables/${databaseName}`);

    if (!response.ok) {
      throw new Error("Error al obtener las tablas");
    }
    const data = await response.json();
    return data.tables;
  } catch (error) {
    console.error("Error al obtener las tablas:", error);
    throw error;
  }
};

export const createTable = async (
  databaseName: string,
  tableName: string,
  fields: TableField[]
) => {
  try {
    const response = await fetch(`${BASE_URL}/createTable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ databaseName, tableName, fields }),
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
    console.log(response);
    return await response.json();
  } catch (error) {
    throw error;
  }
};
export const getColumns = async (databaseName: string, tableName: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/getColumns/${databaseName}/${tableName}`
    );

    if (!response.ok) {
      throw new Error("Error al obtener las columnas");
    }
    const data = await response.json();
    return data.columns;
  } catch (error) {
    console.error("Error al obtener las columnas:", error);
    throw error;
  }
};
export const updateTable = async (
  databaseName: string,
  tableName: string,
  modifiedColumns: TableField[],
  newTableName?: string
) => {
  try {
    const response = await fetch(`${BASE_URL}/updateTable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        databaseName,
        tableName,
        modifiedColumns,
        newTableName,
      }),
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
    console.log(response);
    return await response.json();
  } catch (error) {
    throw error;
  }
};
export const deleteColumn = async (
  databaseName: string,
  tableName: string,
  columnName: string
) => {
  try {
    const response = await fetch(`${BASE_URL}/deleteColumn`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ databaseName, tableName, columnName }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
