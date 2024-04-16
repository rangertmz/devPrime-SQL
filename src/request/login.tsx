import BASE_URL from "../config/config";

export async function login(
  username: string,
  password: string
): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      return true; // Autenticación exitosa
    } else {
      return false; // Autenticación fallida
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw new Error("Ocurrió un error al iniciar sesión");
  }
}
