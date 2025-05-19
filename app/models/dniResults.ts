import { Person } from "./person";
import { DniService } from "~/services/dniService";

export interface DniValidationResult {
    imported: Person;
    actual?: Person;
    status: 'correct' | 'incorrect' | 'not_found';
}

export const comparePersons = (imported: Person, actual: Person): boolean => {
    return (
        imported.nombres === actual.nombres &&
        imported.apellidoPaterno === actual.apellidoPaterno &&
        imported.apellidoMaterno === actual.apellidoMaterno
    );
};

export async function validateImportedData(
    imported: Person
): Promise<DniValidationResult> {
    try {
        const actual = await new DniService().fetchByNumero(imported.numeroDocumento);
        const status = comparePersons(imported, actual) ? "correct" : "incorrect";
        return { imported, actual, status };
    } catch (err: unknown) {
        return { imported, status: "not_found" };
    }
}