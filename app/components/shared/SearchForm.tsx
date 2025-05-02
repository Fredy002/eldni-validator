import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";
import Button from "./Button";

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
                placeholder="Ingrese el DNI"
                className="border px-3 py-2 rounded flex-1"
            />
            <Button
                label="Buscar"
                color="blue"
                type="submit"
            />
        </Form>
    );
}
