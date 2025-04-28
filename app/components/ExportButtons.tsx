import { useState } from "react";
import { exportToExcel, exportToPDF } from "~/utils/export";
import type { Person } from "~/models/person";

interface Props {
    data: Person[];
    fileName?: string;
}

export default function ExportSelector({ data, fileName = "historial" }: Props) {
    const [choice, setChoice] = useState("");
    const disabled = data.length === 0;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setChoice("");
        if (value === "excel") {
            exportToExcel(data, fileName);
        } else if (value === "pdf") {
            exportToPDF(data, fileName);
        }
    };

    return (
        <select
            value={choice}
            onChange={handleChange}
            disabled={disabled}
            className="
        border px-3 py-2 rounded
        bg-white text-gray-800
        dark:bg-gray-700 dark:text-gray-200
        disabled:opacity-50 disabled:cursor-not-allowed
        "
        >
            <option value="" disabled>
                {disabled ? "Sin datos" : "Exportar..."}
            </option>
            <option value="excel">Exportar a Excel</option>
            <option value="pdf">Exportar a PDF</option>
        </select>
    );
}
