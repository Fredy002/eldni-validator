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

// TODO: REVISAR LOS ERRORES, ADEMAS VERIFICAR SI ESTA FUNCIONAL O NO /API/RENIEC

export async function validateImportedData(person: Person): Promise<DniValidationResult> {
    try {
        const resp = await fetch(`/api/reniec?numero=${person.numeroDocumento}`);

        const result = await resp.json();
        if (resp.ok && result?.nombres) {
            return { status: 'correct', imported: person, actual: result };
        } else {
            return { status: result?.error ? 'not_found' : 'incorrect', imported: person, actual: result };
        }
    } catch {
        return { status: 'not_found', imported: person };
    }
}