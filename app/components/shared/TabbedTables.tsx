import { useState } from "react";
import HistoryTable from "./HistoryTable";

interface Column<T> {
    header: string;
    accessor: keyof T;
}

interface Tab<T extends object> {
    title: string;
    data: T[];
    columns: Column<T>[];
    itemsPerPage?: number;
    itemsPerPageOptions?: number[];
}

interface TabbedTablesProps<T extends object> {
    tabs: Tab<T>[];
}

export default function TabbedTables<T extends object>({ tabs }: TabbedTablesProps<T>) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div>
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    {tabs.map((tab, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none ${idx === activeIndex
                                    ? "border-indigo-500 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            {tab.title}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">
                    {tabs[activeIndex].title}
                </h2>
                <HistoryTable<T>
                    data={tabs[activeIndex].data}
                    columns={tabs[activeIndex].columns}
                    itemsPerPage={tabs[activeIndex].itemsPerPage ?? 20}
                    itemsPerPageOptions={
                        tabs[activeIndex].itemsPerPageOptions ?? [20, 50, 100]
                    }
                />
            </div>
        </div>
    );
}
