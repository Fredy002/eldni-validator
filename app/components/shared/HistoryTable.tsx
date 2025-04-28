import { useState } from 'react';
import type { Person } from '~/models/person';
import Paginator from './Paginator';

interface Props {
    history: Person[];
    itemsPerPage?: number;
    itemsPerPageOptions?: number[];
}

export default function HistoryTable({
    history,
    itemsPerPage = 5,
    itemsPerPageOptions = [5, 10, 20]
}: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    const [localItemsPerPage, setLocalItemsPerPage] = useState(itemsPerPage);

    const totalItems = history.length;
    const startIdx = (currentPage - 1) * localItemsPerPage;
    const endIdx = startIdx + localItemsPerPage;
    const pagedHistory = history.slice(startIdx, endIdx);

    const handleItemsPerPageChange = (newSize: number) => {
        setLocalItemsPerPage(newSize);
        setCurrentPage(1);
    };

    return (
        <div>
            <div className="overflow-x-auto mb-4">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-800">
                            <th className="px-4 py-2 border">NOMBRES</th>
                            <th className="px-4 py-2 border">APELLIDOS</th>
                            <th className="px-4 py-2 border">DNI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagedHistory.length > 0 ? (
                            pagedHistory.map((p) => (
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

            <div className="flex justify-end gap-2 mb-8">
                <Paginator
                    totalItems={totalItems}
                    itemsPerPage={localItemsPerPage}
                    itemsPerPageOptions={itemsPerPageOptions}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            </div>
        </div>
    );
}
