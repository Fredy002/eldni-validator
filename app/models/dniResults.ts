import { DniService } from "~/services/dniService";
import { Person } from "./person";

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

// Utiliza DniService para consultar el API y clasifica el resultado

export async function validateImportedData(person: Person): Promise<DniValidationResult> {
    try {
        const result = await new DniService().fetchByNumero(person.numeroDocumento);
        if (result?.nombres) {
            return { status: comparePersons(person, result) ? 'correct' : 'incorrect', imported: person, actual: result };
        }
        // If result exists but does not have nombres, treat as not found
        return { status: 'not_found', imported: person };
    } catch (err: unknown) {
        if (err instanceof Error && err.message.includes('404')) {
            return { status: 'not_found', imported: person };
        }
        return { status: 'incorrect', imported: person };
    }
}