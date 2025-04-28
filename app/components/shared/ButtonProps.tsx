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

    const colorStyles = {
        blue: "bg-blue-500 hover:bg-blue-600",
        green: "bg-green-500 hover:bg-green-600",
        red: "bg-red-500 hover:bg-red-600",
        yellow: "bg-yellow-500 hover:bg-yellow-600",
        gray: "bg-gray-500 hover:bg-gray-600"
    };

    const styles = disabled
        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
        : `${colorStyles[color]} text-white`;

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
