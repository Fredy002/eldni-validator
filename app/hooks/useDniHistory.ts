import { useState, useEffect, useCallback } from "react";
import type { Person } from "~/models/person";
const STORAGE_KEY = "dniHistory";
export function useDniHistory() {
    const [history, setHistory] = useState<Person[]>(() => {
        const saved = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });
    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); }, [history]);
    const addEntries = useCallback((entries: Person[]) => {
        setHistory(prev => {
            const merged = [...prev];
            entries.forEach(e => { if (!merged.some(p => p.numeroDocumento === e.numeroDocumento)) merged.push(e); });
            return merged;
        });
    }, []);
    const clearHistory = useCallback(() => setHistory([]), []);
    return { history, addEntries, clearHistory };
}
