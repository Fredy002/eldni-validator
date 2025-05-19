import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { DniService } from "~/services/dniService";
import { Messages } from "~/utils/messages";

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.trim();
    if (!q) return json({ persons: [], q: null, error: null });

    const lengthError = q.length !== 8 ? Messages.INVALID_LENGTH : null;
    if (lengthError) {
        return json({ persons: [], q, error: lengthError });
    }

    try {
        const person = await new DniService().fetchByNumero(q);
        return json({ persons: [person], q, error: null });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : Messages.INVALID_DNI;
        return json({ persons: [], q, error: msg });
    }
};