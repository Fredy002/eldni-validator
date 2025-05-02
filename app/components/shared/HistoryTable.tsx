import { useState } from 'react';
import Paginator from './Paginator';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
}

interface HistoryTableProps<T> {
    data: T[];
    columns: Column<T>[];
    itemsPerPage?: number;
    itemsPerPageOptions?: number[];
}

export default function HistoryTable<T extends object>({
    data,
    columns,
    itemsPerPage = 5,
    itemsPerPageOptions = [5, 10, 20],
}: HistoryTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [localItemsPerPage, setLocalItemsPerPage] = useState(itemsPerPage);

    const totalItems = data.length;
    const startIdx = (currentPage - 1) * localItemsPerPage;
    const endIdx = startIdx + localItemsPerPage;
    const pagedData = data.slice(startIdx, endIdx);

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
                            {columns.map((col) => (
                                <th
                                    key={String(col.accessor)}
                                    className="px-4 py-2 border text-left"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pagedData.length > 0 ? (
                            pagedData.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className="odd:bg-gray-100 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-900"
                                >
                                    {columns.map((col) => (
                                        <td key={String(col.accessor)} className="px-4 py-2 border">
                                            {typeof col.accessor === 'function' ? col.accessor(row) : String(row[col.accessor] ?? '')}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-4 py-4 text-center border"
                                >
                                    No hay datos para mostrar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end gap-2">
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
