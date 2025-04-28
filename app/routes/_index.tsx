import type { DataFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import { DniService } from "~/services/dniService";
import type { Person } from "~/models/person";
import SearchForm from "~/components/SearchForm";
import HistoryTable from "~/components/HistoryTable";
import Notification from "~/components/Notification";
import { Messages } from "~/utils/messages";
import ExportButtons from "~/components/ExportButtons";

export async function loader({ request }: DataFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();
  let persons: Person[] = [];
  let error: string | null = null;

  if (q) {
    if (q.length !== 8) {
      error = Messages.INVALID_LENGTH;
    } else {
      try {
        const service = new DniService();
        persons = [await service.fetchByNumero(q)];
      } catch (e: unknown) {
        const msg = e instanceof Error
          ? e.message.toLowerCase()
          : typeof e === 'string'
            ? e.toLowerCase()
            : 'unknown error';
        error = msg.includes("not found")
          ? Messages.NOT_FOUND
          : Messages.INVALID_DNI;
      }
    }
  }

  return json({ persons, q, error });
}

export default function Index() {
  const { persons, q, error: serverError } =
    useLoaderData<{ persons: Person[]; q?: string; error?: string }>();

  const [history, setHistory] = useState<Person[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("dniHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [clientError, setClientError] = useState<string | null>(null);
  const [serverErrorState, setServerError] = useState<string | null>(serverError ?? null);

  useEffect(() => {
    if (!serverErrorState && persons.length === 1) {
      const nuevo = persons[0];
      if (!history.some((p) => p.numeroDocumento === nuevo.numeroDocumento)) {
        const next = [...history, nuevo];
        setHistory(next);
        localStorage.setItem("dniHistory", JSON.stringify(next));
      }
    }
  }, [persons, serverErrorState, history]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setClientError(null);
    const form = e.currentTarget;
    const v = (new FormData(form).get("q") || "").toString().trim();
    if (v && v.length !== 8) {
      e.preventDefault();
      setClientError(Messages.INVALID_LENGTH);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">🔍 Buscar por DNI</h1>

      {/* Toasts */}
      {clientError && (
        <Notification
          message={clientError}
          type="error"
          onClose={() => setClientError(null)}
        />
      )}
      {serverErrorState && (
        <Notification
          message={serverErrorState}
          type="error"
          onClose={() => setServerError(null)}
        />
      )}

      <div className="flex justify-center">
        <SearchForm q={q} onSubmit={handleSubmit} />
      </div>

      <div className="flex justify-end">
        <ExportButtons data={history} fileName="busquedas_dni" />
      </div>

      <h2 className="text-lg font-medium mb-2">Historial de búsquedas</h2>
      <HistoryTable history={history} />
    </main>
  );
}
