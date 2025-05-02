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