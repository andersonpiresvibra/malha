import React, { useState, useMemo } from 'react';
import type { FlightData, FlightStatus, Tab } from '../types';
import { FlightCard }        from '../components/FlightCard';
import { FlightDetailsModal } from '../components/FlightDetailsModal';
import { StatsBar }           from '../components/StatsBar';

interface Props {
  flights:       FlightData[];
  onUpdate:      (id: string, fields: Partial<FlightData>) => Promise<void>;
  onDelete:      (id: string) => Promise<void>;
}

const TABS: { id: Tab; label: string; status?: FlightStatus }[] = [
  { id: 'GERAL',        label: 'Visao Geral' },
  { id: 'CHEGADA',      label: 'Chegada',     status: 'CHEGADA'     },
  { id: 'FILA',         label: 'Fila',        status: 'FILA'        },
  { id: 'DESIGNADOS',   label: 'Designados',  status: 'DESIGNADO'   },
  { id: 'ABASTECENDO',  label: 'Abastecendo', status: 'ABASTECENDO' },
  { id: 'FINALIZADO',   label: 'Finalizado',  status: 'FINALIZADO'  },
];

const STATUS_BADGE_COLORS: Record<string, string> = {
  GERAL:       'bg-gray-500',
  CHEGADA:     'bg-green-500',
  FILA:        'bg-yellow-500',
  DESIGNADOS:  'bg-blue-500',
  ABASTECENDO: 'bg-orange-500',
  FINALIZADO:  'bg-purple-500',
};

export const OperationalPanel: React.FC<Props> = ({ flights, onUpdate, onDelete }) => {
  const [activeTab,    setActiveTab]    = useState<Tab>('GERAL');
  const [selectedFlight, setSelectedFlight] = useState<FlightData | null>(null);
  const [search, setSearch]            = useState('');

  const visibleFlights = useMemo(() => {
    const tabDef = TABS.find(t => t.id === activeTab);
    let list = tabDef?.status
      ? flights.filter(f => f.status === tabDef.status)
      : flights;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(f =>
        f.flightNumber.toLowerCase().includes(q) ||
        f.airline.toLowerCase().includes(q) ||
        f.destination.toLowerCase().includes(q) ||
        f.prefixo?.toLowerCase().includes(q) ||
        f.positionId?.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => a.scheduledArrival.localeCompare(b.scheduledArrival));
  }, [flights, activeTab, search]);

  const getCount = (tab: Tab) => {
    const t = TABS.find(x => x.id === tab);
    return t?.status ? flights.filter(f => f.status === t.status).length : flights.length;
  };

  return (
    <div className="flex flex-col gap-4">
      <StatsBar flights={flights} />

      {/* Barra de busca */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar por voo, cia, destino, posicao..."
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
                   bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      />

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {TABS.map(tab => {
          const count = getCount(tab.id);
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ' + (active
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700')}>
              {tab.label}
              {count > 0 && (
                <span className={'text-xs font-bold px-1.5 py-0.5 rounded-full ' + (active ? 'bg-white/25 text-white' : STATUS_BADGE_COLORS[tab.id] + ' text-white')}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Lista de voos */}
      {visibleFlights.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
                        flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
          Nenhum voo nesta aba
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {visibleFlights.map(f => (
            <FlightCard key={f.id} flight={f} onClick={setSelectedFlight} />
          ))}
        </div>
      )}

      {/* Modal detalhes */}
      {selectedFlight && (
        <FlightDetailsModal
          flight={selectedFlight}
          onClose={() => setSelectedFlight(null)}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};
