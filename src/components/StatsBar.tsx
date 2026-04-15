import React from 'react';
import type { FlightData } from '../types';

interface Props { flights: FlightData[]; }

export const StatsBar: React.FC<Props> = ({ flights }) => {
  const items = [
    { label: 'Total',       value: flights.length,                                       color: 'text-gray-700 dark:text-gray-200',    bg: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700' },
    { label: 'Chegada',     value: flights.filter(f => f.status === 'CHEGADA').length,    color: 'text-green-700 dark:text-green-400',  bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
    { label: 'Fila',        value: flights.filter(f => f.status === 'FILA').length,       color: 'text-yellow-700 dark:text-yellow-400',bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' },
    { label: 'Designado',   value: flights.filter(f => f.status === 'DESIGNADO').length,  color: 'text-blue-700 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
    { label: 'Abastecendo', value: flights.filter(f => f.status === 'ABASTECENDO').length,color: 'text-orange-700 dark:text-orange-400',bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' },
    { label: 'Finalizado',  value: flights.filter(f => f.status === 'FINALIZADO').length, color: 'text-purple-700 dark:text-purple-400',bg: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {items.map(i => (
        <div key={i.label} className={`${i.bg} rounded-xl p-3 text-center shadow-sm border`}>
          <div className={`text-2xl font-bold ${i.color}`}>{i.value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{i.label}</div>
        </div>
      ))}
    </div>
  );
};
