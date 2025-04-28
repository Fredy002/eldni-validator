import React from "react";

interface ButtonProps {
    label: string;
    color?: "blue" | "green" | "red" | "yellow" | "gray";
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

export default function Button({
    label,
    color = "red",
    onClick,
    disabled = false,
    type = "button",
}: ButtonProps) {
    const base = "px-4 py-2 rounded font-medium transition ";
    const styles = disabled
        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
        : `bg-${color}-500 text-white hover:bg-${color}-600`;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={base + styles}
        >
            {label}
        </button>
    );
}
