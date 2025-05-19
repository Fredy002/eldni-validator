import { useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
import type { Person } from "~/models/person";
import type { DniValidationResult } from "~/models/dniResults";
import { validateImportedData } from "~/models/dniResults";
import SearchForm from "~/components/shared/SearchForm";
import HistoryTable from "~/components/shared/HistoryTable";
import TabbedTables from "~/components/shared/TabbedTables";
import ImportModal from "~/components/ImportModal";
import Notification from "~/components/shared/Notification";
import ConfirmationDialog from "~/components/shared/ConfirmationDialog";
import Button from "~/components/shared/Button";
import { useDniHistory } from "~/hooks/useDniHistory";
import { Messages } from "~/utils/messages";

interface LoaderData {
    persons: Person[];
    q?: string;
    error?: string;
}

export default function DniPage() {
    const { persons, q, error } = useLoaderData<LoaderData>();
    const { history, addEntries, clearHistory } = useDniHistory();

    const [clientError, setClientError] = useState<string | null>(null);
    const [showImport, setShowImport] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [validationResults, setValidationResults] = useState<DniValidationResult[]>([]);

    useEffect(() => {
        if (persons.length === 1 && !error) addEntries(persons);
    }, [persons, error, addEntries]);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        setClientError(null);
        const v = (new FormData(e.currentTarget).get("q") || "").toString().trim();
        if (!v) {
            e.preventDefault();
            setClientError(Messages.EMPTY_DNI);
            return;
        }
    };

    const handleImport = async (data: Person[]) => {
        addEntries(data);
        const results = await Promise.all(data.map((p) => validateImportedData(p)));
        setValidationResults(results);
        setShowImport(false);
    };

    const confirmClear = () => {
        clearHistory();
        setValidationResults([]);
        setShowConfirm(false);
    };

    // columnas para TabbedTables
    const correctColumns = [
        { header: "NOMBRES IMPORTADO", accessor: (row: DniValidationResult) => row.imported.nombres },
        { header: "APELLIDOS IMPORTADO", accessor: (row: DniValidationResult) => row.imported.apellidoPaterno },
        { header: "DNI", accessor: (row: DniValidationResult) => row.imported.numeroDocumento }
    ];
    const incorrectColumns = [
        { header: "NOMBRES IMPORTADO", accessor: (row: DniValidationResult) => row.imported.nombres },
        { header: "APELLIDOS IMPORTADO", accessor: (row: DniValidationResult) => row.imported.apellidoPaterno },
        { header: "NOMBRES REAL", accessor: (row: DniValidationResult) => row.actual?.nombres || "N/A" },
        { header: "APELLIDOS REAL", accessor: (row: DniValidationResult) => row.actual?.apellidoPaterno || "N/A" },
        { header: "DNI", accessor: (row: DniValidationResult) => row.imported.numeroDocumento }
    ];
    const notFoundColumns = [
        { header: "NOMBRES IMPORTADO", accessor: (row: DniValidationResult) => row.imported.nombres },
        { header: "APELLIDOS IMPORTADO", accessor: (row: DniValidationResult) => row.imported.apellidoPaterno },
        { header: "DNI", accessor: (row: DniValidationResult) => row.imported.numeroDocumento }
    ];

    const tabs = [
        { title: "Datos Correctos", data: validationResults.filter(r => r.status === 'correct'), columns: correctColumns, itemsPerPage: 20 },
        { title: "Datos Incorrectos", data: validationResults.filter(r => r.status === 'incorrect'), columns: incorrectColumns, itemsPerPage: 20 },
        { title: "No Encontrados", data: validationResults.filter(r => r.status === 'not_found'), columns: notFoundColumns, itemsPerPage: 20 }
    ];

    const [importedData] = useState<Person[] | null>(null);

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
            onClick: () => setShowConfirm(true),
            disabled: history.length === 0,
        },
    ];

    return (
        <main className="p-6">
            <h1 className="text-xl font-semibold mb-4">🔍 Buscar por DNI</h1>
            {clientError && <Notification message={clientError} type="error" onClose={() => setClientError(null)} />}
            {error && <Notification message={error} type="error" onClose={() => { }} />}

            <div className="flex justify-center">
                <SearchForm q={q} onSubmit={handleSearchSubmit} />
            </div>

            <div className="flex justify-end gap-2 mb-8">
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

            {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={handleImport} />}
            {showConfirm && <ConfirmationDialog isOpen={true} message="¿Limpiar historial?" onConfirm={confirmClear} onCancel={() => setShowConfirm(false)} />}

            {validationResults.length > 0
                ? <TabbedTables tabs={tabs} />
                : <HistoryTable data={history} columns={[
                    { header: "NOMBRES", accessor: "nombres" },
                    { header: "APELLIDOS", accessor: "apellidoPaterno" },
                    { header: "DNI", accessor: "numeroDocumento" }
                ]} itemsPerPage={20} itemsPerPageOptions={[20, 50, 100]} />
            }
        </main>
    );
}
