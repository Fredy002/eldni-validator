import type { Person } from "~/models/person";

interface Props {
    history: Person[];
}

export default function HistoryTable({ history }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200 dark:bg-gray-800">
                        <th className="px-4 py-2 border">NOMBRES</th>
                        <th className="px-4 py-2 border">APELLIDOS</th>
                        <th className="px-4 py-2 border">DNI</th>
                    </tr>
                </thead>
                <tbody>
                    {history.length > 0 ? (
                        history.map((p) => (
                            <tr
                                key={p.numeroDocumento}
                                className="odd:bg-gray-100 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-900"
                            >
                                <td className="px-4 py-2 border">{p.nombres}</td>
                                <td className="px-4 py-2 border">
                                    {p.apellidoPaterno} {p.apellidoMaterno}
                                </td>
                                <td className="px-4 py-2 border">{p.numeroDocumento}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="px-4 py-4 text-center border">
                                Aún no tienes búsquedas guardadas.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
