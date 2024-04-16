import BASE_URL from "../config/config";

export const getConsults = async (consult: string) => {
  try {
    const response = await fetch(`${BASE_URL}/Consults`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ consult }),
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getCurrentDatabase = async () => {
  try {
    const response = await fetch(`${BASE_URL}/getConection`);
    if (!response.ok) {
      throw new Error("Error al obtener la base de datos actual");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener la base de datos actual:", error);
    throw error;
  }
};

export const Conect = async (database: string) => {
  try {
    const response = await fetch(`${BASE_URL}/Conect/${database}`);

    if (!response.ok) {
      throw new Error("Error al conectarse");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
