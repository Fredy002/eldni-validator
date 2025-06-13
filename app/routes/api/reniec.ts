import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { DniService } from "~/services/dniService";

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const numero = url.searchParams.get("numero");
    if (!numero) {
        return json({ error: "Falta el parámetro numero" }, { status: 400 });
    }

    try {
        const person = await new DniService().fetchByNumero(numero);
        return json(person);
    } catch (err: unknown) {
        let errorMessage = "Error validando DNI";
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        return json({ error: errorMessage }, { status: 502 });
    }
};
