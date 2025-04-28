import * as XLSX from 'xlsx';
import FileSaverPkg from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Person } from '~/models/person';

const { saveAs } = FileSaverPkg;

export function exportToExcel(data: Person[], fileName: string) {
    const sheetData = data.map(p => ({
        NOMBRES: p.nombres,
        APELLIDOS: `${p.apellidoPaterno} ${p.apellidoMaterno}`,
        DNI: p.numeroDocumento
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Historial');

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${fileName}.xlsx`);
}

export function exportToPDF(data: Person[], fileName: string) {
    const doc = new jsPDF();

    const columns = ['NOMBRES', 'APELLIDOS', 'DNI'];
    const rows = data.map(p => [
        p.nombres,
        `${p.apellidoPaterno} ${p.apellidoMaterno}`,
        p.numeroDocumento
    ]);

    autoTable(doc, {
        startY: 20,
        head: [columns],
        body: rows,
        styles: { fontSize: 10 },
        theme: 'grid'
    });

    doc.save(`${fileName}.pdf`);
}
