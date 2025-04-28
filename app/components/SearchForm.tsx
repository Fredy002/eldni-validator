import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";

interface Props {
    q?: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function SearchForm({ q, onSubmit }: Props) {
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (q) {
            setInputValue("");
        }
    }, [q]);

    return (
        <Form method="get" onSubmit={onSubmit} className="flex gap-2 mb-8">
            <input
                name="q"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ej: 12345678"
                className="border px-3 py-2 rounded flex-1"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Buscar
            </button>
        </Form>
    );
}
