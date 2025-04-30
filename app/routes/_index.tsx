import type { DataFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import { DniService } from "~/services/dniService";
import type { Person } from "~/models/person";
import HistoryTable from "~/components/shared/HistoryTable";
import Notification from "~/components/shared/Notification";
import { Messages } from "~/utils/messages";
import ImportModal from "~/components/ImportModal";
import Button from "~/components/shared/ButtonProps";
import SearchForm from "~/components/shared/SearchForm";
import ExportButtons from "~/components/shared/ExportButtons";
import TabbedTables from "~/components/shared/TabbedTables";

interface Column<T> {
  header: string;
  accessor: keyof T;
}

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
  const [showImport, setShowImport] = useState(false);

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
      //TODO: hacer un componente confirm con opcion de si/no
    if (importedData) {
      const ok = window.confirm(
        "¿Seguro que quieres volver a la búsqueda? Esto perderá tus datos importados."
      );
      if (!ok) {
        e.preventDefault();
        return;
      }
      setImportedData(null);
    }

    const form = e.currentTarget;
    const v = (new FormData(form).get("q") || "").toString().trim();
    if (v && v.length !== 8) {
      e.preventDefault();
      setClientError(Messages.INVALID_LENGTH);
    }
  };

  const handleImport = (newData: Person[]) => {
    const merged = [
      ...history,
      ...newData.filter(nd => !history.some(h => h.numeroDocumento === nd.numeroDocumento))
    ];
    setHistory(merged);
    localStorage.setItem("dniHistory", JSON.stringify(merged));
    setImportedData(newData);
  };

  const handleClear = () => {
    localStorage.removeItem("dniHistory");
    setHistory([]);
  };

  const buttons = [
    {
      label: "Importar",
      color: "green" as const,
      onClick: () => setShowImport(true),
      disabled: false,
    },
    {
      label: "Limpiar",
      color: "yellow" as const,
      onClick: handleClear,
      disabled: history.length === 0,
    },
  ];

  const [importedData, setImportedData] = useState<Person[] | null>(null);

  const columns: Column<Person>[] = [
    { header: "NOMBRES", accessor: "nombres" },
    { header: "APELLIDOS", accessor: "apellidoPaterno" },
    { header: "DOC. NACIONAL DE IDENTIDAD (DNI)", accessor: "numeroDocumento" },
  ];


  //TODO: implementar logica para mostrar datos correctos, datos incorrectos y datos no encontrados
  const historyColumns: Column<Person>[] = [
    { header: "NOMBRES1", accessor: "nombres" },
    { header: "APELLIDOS", accessor: "apellidoPaterno" },
    { header: "DNI", accessor: "numeroDocumento" },
  ];

  const errorColumns: Column<Person>[] = [
    { header: "NOMBRES2", accessor: "nombres" },
    { header: "APELLIDOS", accessor: "apellidoPaterno" },
    { header: "DNI", accessor: "numeroDocumento" },
  ];

  const summaryColumns: Column<Person>[] = [
    { header: "NOMBRES3", accessor: "nombres" },
    { header: "APELLIDOS", accessor: "apellidoPaterno" },
    { header: "DNI", accessor: "numeroDocumento" },
  ];

  const tabsConfig = [
    {
      title: "Historial DNI",
      data: history,
      columns: historyColumns,
      itemsPerPage: 20,
      itemsPerPageOptions: [20, 50, 100],
    },
    {
      title: "Historial DNI",
      data: history,
      columns: errorColumns,
      itemsPerPage: 20,
      itemsPerPageOptions: [20, 50, 100],
    },
    {
      title: "Historial DNI",
      data: history,
      columns: summaryColumns,
      itemsPerPage: 20,
      itemsPerPageOptions: [20, 50, 100],
    },
  ];

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">🔍 Buscar por DNI 🔒</h1>

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

      <div className="flex justify-end gap-2 mb-8">
        <ExportButtons data={history} fileName="busquedas_dni" />

        {buttons
          .filter(({ label }) => !(importedData && label === "Limpiar"))
          .map(({ label, color, onClick, disabled }) => (
            <Button
              key={label}
              label={label}
              color={color}
              onClick={onClick}
              disabled={disabled}
            />
          ))}
      </div>

      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onImport={handleImport}
        />
      )}

      {importedData ? <TabbedTables tabs={tabsConfig} /> : <HistoryTable
        data={history}
        columns={columns}
        itemsPerPage={20}
        itemsPerPageOptions={[20, 50, 100]}
      />
      }
    </main>
  );
}
