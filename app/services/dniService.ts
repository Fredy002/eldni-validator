import type { Person } from "~/models/person";

export class DniService {
  async fetchByNumero(numero: string): Promise<Person> {
    const BASE = import.meta.env.PUBLIC_API_BASE_URL;
    const KEY = import.meta.env.PUBLIC_API_KEY;

    if (!BASE || !KEY) {
      throw new Error("Faltan variables de entorno para la API");
    }

    const url = `${BASE}?numero=${encodeURIComponent(numero)}`;
    const res = await fetch(url, {
      headers: { "Authorization": `Bearer ${KEY}` }
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status} al consultar DNI`);
    }
    return res.json();
  }
}
