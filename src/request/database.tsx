import BASE_URL from "../config/config";

export const createDatabase = async (
  databaseName: string,
  collation: string
) => {
  try {
    const response = await fetch(`${BASE_URL}/createDatabase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ databaseName, collation }),
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

export const getDatabases = async () => {
  try {
    const response = await fetch(`${BASE_URL}/getDatabase`);
    if (!response.ok) {
      throw new Error("Error al obtener la lista de bases de datos");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteDatabase = async (databaseName: string) => {
  try {
    const response = await fetch(`${BASE_URL}/deleteDatabase`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ databaseName }),
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

export const updateDatabase = async (
  database: string,
  name: string,
  collation: string
) => {
  try {
    const response = await fetch(`${BASE_URL}/UpdateDatabase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ database, name, collation }),
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
