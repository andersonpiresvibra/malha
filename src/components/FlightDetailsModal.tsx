import React, { useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import type { FlightData, FlightStatus } from '../types';
import { AirlineLogo } from './AirlineLogo';

interface Props {
  flight: FlightData;
  onClose: () => void;
  onUpdate: (id: string, fields: Partial<FlightData>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const ALL_STATUS: FlightStatus[] = [
  'PROGRAMADO', 'CHEGADA', 'FILA', 'DESIGNADO', 'ABASTECENDO', 'FINALIZADO'
];

export const FlightDetailsModal: React.FC<Props> = ({ flight, onClose, onUpdate, onDelete }) => {
  const [form, setForm]       = useState<Partial<FlightData>>({ ...flight });
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);

  const change = (key: keyof FlightData, val: string) =>
    setForm(p => ({ ...p, [key]: val }));

  const save = async () => {
    setSaving(true);
    try { await onUpdate(flight.id, form); onClose(); }
    finally { setSaving(false); }
  };

  const del = async () => {
    if (!window.confirm('Remover este voo da operacao?')) return;
    setDeleting(true);
    try { await onDelete(flight.id); onClose(); }
    finally { setDeleting(false); }
  };

  const Field = ({ label, field }: { label: string; field: keyof FlightData }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
      <input
        value={String(form[field] ?? '')}
        onChange={e => change(field, e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                   bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
         onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
           onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-gray-200 dark:border-gray-700">
          <AirlineLogo airline={flight.airline} size="md" />
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">{flight.flightNumber}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {flight.airline.toUpperCase()} -- {flight.destination}
            </p>
          </div>
          <button onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 grid grid-cols-2 gap-4">
          {/* Status */}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {ALL_STATUS.map(s => (
                <button key={s} onClick={() => change('status', s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    form.status === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Field label="Numero do Voo"     field="flightNumber" />
          <Field label="Prefixo"           field="prefixo" />
          <Field label="Modelo"            field="modelo" />
          <Field label="Voo Chegada"       field="vCheg" />
          <Field label="ETA"               field="scheduledArrival" />
          <Field label="ETD"               field="scheduledDeparture" />
          <Field label="Posicao Prevista"  field="posicaoPrevista" />
          <Field label="Posicao Real"      field="positionId" />
          <Field label="Calco Previsto"    field="calcoPrevisto" />
          <Field label="Hora Real Chegada" field="actualArrivalTime" />
          <Field label="Hora Real Saida"   field="actualDepartureTime" />
          <Field label="Combustivel (L)"   field="fuelAmount" />
          <Field label="Op. Combustivel"   field="fuelOperator" />
          <Field label="Cidade Destino"    field="cid" />
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Observacoes</label>
            <textarea
              value={String(form.notes ?? '')}
              onChange={e => change('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-gray-200 dark:border-gray-700">
          <button onClick={del} disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600
                       text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Removendo...' : 'Remover Voo'}
          </button>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancelar
            </button>
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700
                         text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
