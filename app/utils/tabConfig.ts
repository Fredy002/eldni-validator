import type { DniValidationResult } from "~/models/dniResults";
export function buildTabs(results: DniValidationResult[]) {
    const correct = results.filter(r => r.status === 'correct');
    const incorrect = results.filter(r => r.status === 'incorrect');
    const notFound = results.filter(r => r.status === 'not_found');
    return [
        { title: 'Correctos', data: correct },
        { title: 'Incorrectos', data: incorrect },
        { title: 'No Encontrados', data: notFound },
    ];
}