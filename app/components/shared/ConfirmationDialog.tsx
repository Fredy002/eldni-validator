import Button from "./Button";

interface ConfirmationDialogProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationDialog({
    isOpen,
    message,
    onConfirm,
    onCancel,
}: ConfirmationDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 z-10 w-full max-w-md ring-4 ring-indigo-300">
                <div className="mb-6 text-center mat-dialog-content text-black text-lg font-semibold">
                    {message}
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-6 mat-dialog-actions">
                    <Button
                        label="SÍ"
                        color="green"
                        onClick={onConfirm}
                        type="button"
                    />
                    <Button
                        label="NO"
                        color="red"
                        onClick={onCancel}
                        type="button"
                    />
                </div>
            </div>
        </div>
    );
}
