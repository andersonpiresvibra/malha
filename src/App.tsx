import React, { useState } from 'react';
import { Plane, Database, LayoutDashboard } from 'lucide-react';
import { DashboardHeader }  from './components/DashboardHeader';
import { OperationalPanel } from './pages/OperationalPanel';
import { MeshBaseTable }    from './components/MeshBaseTable';
import { useFlights }       from './hooks/useFlights';
import type { Turno } from './types';

type View = 'operacional' | 'malha';

export default function App() {
  const [view,   setView]   = useState<View>('operacional');
  const [turno,  setTurno]  = useState<Turno>('MANHA');

  const {
    flights, loading, error,
    updateFlight, updateStatus, deleteFlight
  } = useFlights();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">

      {/* Header global */}
      <DashboardHeader turnoAtivo={turno} onChangeTurno={setTurno} />

      {/* Nav secundaria */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4">
        <div className="flex gap-1 overflow-x-auto">
          <button
            onClick={() => setView('operacional')}
            className={'flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ' + (
              view === 'operacional'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            )}>
            <LayoutDashboard className="w-4 h-4" />
            Operacional
          </button>

          <button
            onClick={() => setView('malha')}
            className={'flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ' + (
              view === 'malha'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            )}>
            <Database className="w-4 h-4" />
            Malha Base
          </button>
        </div>
      </nav>

      {/* Conteudo */}
      <main className="max-w-full px-4 py-5">
        {loading && (
          <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
            <div className="animate-spin w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full" />
            <span>Conectando ao Firebase...</span>
          </div>
        )}

        {error && !loading && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700
                          rounded-xl p-5 text-center">
            <Plane className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-amber-700 dark:text-amber-400 font-medium text-sm">
              Configure o Firebase no arquivo .env para ativar a sincronizacao em tempo real.
            </p>
            <p className="text-amber-500 dark:text-amber-500 text-xs mt-1">{error}</p>
          </div>
        )}

        {!loading && view === 'operacional' && (
          <OperationalPanel
            flights={flights}
            onUpdate={updateFlight}
            onDelete={deleteFlight}
          />
        )}

        {!loading && view === 'malha' && (
          <MeshBaseTable turnoAtivo={turno} />
        )}
      </main>
    </div>
  );
}
