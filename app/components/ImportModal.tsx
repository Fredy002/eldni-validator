import type { Person } from "~/models/person";
import { useState } from "react";
import * as XLSX from "xlsx";
import { FaTimes } from "react-icons/fa";
import Notification from "~/components/shared/Notification";
import HistoryTable from "~/components/HistoryTable";

interface Props {
    onClose: () => void;
    onImport: (data: Person[]) => void;
}

export default function ImportModal({ onClose, onImport }: Props) {
    const [error, setError] = useState<string | null>(null);
    const [importedData, setImportedData] = useState<Person[] | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const buf = await file.arrayBuffer();
            const workbook = XLSX.read(buf, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: "" }) as Record<string, unknown>[];

            const raw = rawRows.map(row => {
                const norm: Record<string, string | number> = {};
                Object.entries(row).forEach(([key, val]) => {
                    norm[key.toUpperCase().trim()] = val as string | number;
                });
                return norm;
            });

            const missing = raw.find(row =>
                row["NOMBRES"] === undefined ||
                row["APELLIDOS"] === undefined ||
                row["DOC. NACIONAL DE IDENTIDAD (DNI)"] === undefined
            );
            if (missing) {
                throw new Error("Estructura inválida");
            }

            const persons: Person[] = raw.map(row => {
                const [apellidoPaterno, apellidoMaterno] = String(row["APELLIDOS"])
                    .split(" ", 2);
                return {
                    nombres: String(row["NOMBRES"]),
                    apellidoPaterno: apellidoPaterno || "",
                    apellidoMaterno: apellidoMaterno || "",
                    nombreCompleto: `${row["NOMBRES"]} ${row["APELLIDOS"]}`,
                    tipoDocumento: "1",
                    numeroDocumento: String(row["DOC. NACIONAL DE IDENTIDAD (DNI)"]),
                    digitoVerificador: "",
                };
            });

            setImportedData(persons);
            onImport(persons);
        } catch (err: unknown) {
            console.error(err);
            const msg =
                err instanceof Error && err.message === "Estructura inválida"
                    ? "El archivo debe incluir al menos las columnas NOMBRES, APELLIDOS y DOC. NACIONAL DE IDENTIDAD (DNI)."
                    : "Error al leer el archivo. Asegúrate de que es un .xlsx válido.";
            setError(msg);
        }
    };

    return (
        <>
            {error && (
                <Notification
                    message={error}
                    type="error"
                    onClose={() => setError(null)}
                />
            )}

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl mx-4 p-6 relative">
                    <button
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                    >
                        <FaTimes size={24} />
                    </button>

                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                        Importar Historial
                    </h2>

                    <div className="mb-6">
                        <label
                            htmlFor="fileInput"
                            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Seleccionar archivo Excel
                        </label>
                        <input
                            id="fileInput"
                            type="file"
                            accept=".xlsx"
                            onChange={handleFileChange}
                            className="
                            block w-full text-sm text-gray-600 dark:text-gray-400
                            file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
                            file:text-sm file:font-semibold file:bg-blue-600 file:text-white
                            hover:file:bg-blue-700
                            "
                        />
                    </div>

                    {importedData && (
                        <div className="mb-4">
                            <HistoryTable history={importedData} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
