import type { Person } from "~/models/person";

const BASE = process.env.API_BASE_URL!;
const KEY = process.env.API_KEY!;

export class DniService {
  async fetchByNumero(numero: string): Promise<Person> {
    console.log("Calling RENIEC at:", BASE);
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
