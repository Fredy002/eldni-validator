import { useEffect, useState } from "react";

interface Props {
    message: string;
    type?: "error" | "success" | "info";
    onClose: () => void;
}

export default function AlertNotification({ message, type = "error", onClose }: Props) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!visible) return null;

    return (
        <div
            role="alert"
            className={`
                fixed top-4 right-4 flex items-start space-x-2
                p-4 rounded shadow-lg
                ${type === "error" ? "bg-red-100 text-red-800" : ""}
                ${type === "success" ? "bg-green-100 text-green-800" : ""}
                ${type === "info" ? "bg-blue-100 text-blue-800" : ""} // Corregí el color amarillo
            `}
        >
            <div className="flex-1">{message}</div>
            <button
                onClick={() => {
                    setVisible(false);
                    onClose();
                }}
                className="ml-2 text-xl leading-none focus:outline-none"
                aria-label="Cerrar"
            >
                &times;
            </button>
        </div>
    );
}