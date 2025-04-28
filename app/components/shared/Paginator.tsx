import React from "react";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

interface PaginatorProps {
    totalItems: number;
    itemsPerPage: number;
    itemsPerPageOptions?: number[];
    onPageChange?: (page: number) => void;
    onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export default function Paginator({
    totalItems,
    itemsPerPage,
    itemsPerPageOptions = [5, 10, 20],
    onPageChange,
    onItemsPerPageChange,
}: PaginatorProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const [currentPage, setCurrentPage] = React.useState(1);

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        onPageChange?.(page);
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = Number(e.target.value);
        onItemsPerPageChange?.(newSize);
        setCurrentPage(1);
        onPageChange?.(1);
    };

    return (
        <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1 || totalPages === 0}
                    className="p-1 rounded border disabled:opacity-50 hover:bg-gray-100"
                    aria-label="Página anterior"
                >
                    <MdKeyboardDoubleArrowLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 rounded border transition-colors
                            ${page === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-blue-600 hover:bg-blue-50'}
                        `}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-1 rounded border disabled:opacity-50 hover:bg-gray-100"
                    aria-label="Siguiente página"
                >
                    <MdKeyboardDoubleArrowRight className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-2">
                <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="
                    border px-3 py-2 rounded
                    bg-white text-gray-800
                    dark:bg-gray-700 dark:text-gray-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    "
                >
                    {itemsPerPageOptions.map(option => (
                        <option key={option} value={option}>
                            {option} por página
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
