// Parser CSV/Excel -> Malha Base
// Suporta .csv, .xlsx, .xls
import * as XLSX from 'xlsx';
import type { MeshFlight } from '../types';

export function parseCsvToMesh(file: File): Promise<MeshFlight[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data     = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheet    = workbook.Sheets[workbook.SheetNames[0]];
        const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        const flights: MeshFlight[] = rows
          .map((row, i) => ({
            id:              `mesh_${String(i).padStart(4, '0')}`,
            comp:            String(row['COMP']    || '').trim().toLowerCase(),
            prefixo:         String(row['PREFIXO'] || '').trim(),
            modelo:          String(row['MODELO']  || '').trim(),
            vCheg:           String(row['V.CHEG']  || row['VCHEG']  || '').trim(),
            eta:             String(row['ETA']      || '').trim(),
            vSaida:          String(row['V.SAIDA'] || row['V.SAÍDA'] || row['VSAIDA'] || '').trim(),
            icao:            String(row['ICAO']     || '').trim().toUpperCase(),
            cid:             String(row['CID']      || '').trim(),
            pos:             String(row['POS']      || '').trim(),
            etd:             String(row['ETD']      || '').trim(),
            posicaoPrevista: '',
            calcoPrevisto:   '',
            atualizado:      false,
            turno:           '' as const,
          }))
          .filter(f => f.comp && f.eta);

        resolve(flights);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsBinaryString(file);
  });
}
