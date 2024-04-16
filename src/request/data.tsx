import BASE_URL from "../config/config";

export const getData = async (databaseName: string, tableName: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/GetData/${databaseName}/${tableName}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los datos");
    }
    return await response.json();
  } catch (e) {
    console.log(e);
    throw e;
  }
};
export const deleteData = async (
  databaseName: string,
  tableName: string,
  conditions: Record<string, string>
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/deleteData/${databaseName}/${tableName}?${new URLSearchParams(
        conditions
      )}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createData = async (
  databaseName: string,
  tableName: string,
  columns: string[],
  data: any[]
) => {
  try {
    const requestData = {
      databaseName: databaseName,
      tableName: tableName,
      columns: columns,
      data: data,
    };

    const response = await fetch(`${BASE_URL}/createData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
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

export const updateData = async (
  databaseName: string,
  tableName: string,
  columns: string[],
  data: any[]
) => {
  try {
    const requestData = {
      databaseName: databaseName,
      tableName: tableName,
      columns: columns,
      data: data,
    };

    const response = await fetch(`${BASE_URL}/updateData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
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
