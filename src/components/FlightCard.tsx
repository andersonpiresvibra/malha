import React from 'react';
import { Clock, MapPin, User, ChevronRight } from 'lucide-react';
import type { FlightData, FlightStatus } from '../types';
import { AirlineLogo } from './AirlineLogo';

interface Props {
  flight: FlightData;
  onClick: (f: FlightData) => void;
}

const STATUS_STYLES: Record<FlightStatus, string> = {
  PROGRAMADO:   'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  CHEGADA:      'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  FILA:         'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  DESIGNADO:    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  ABASTECENDO:  'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  FINALIZADO:   'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
};

export const FlightCard: React.FC<Props> = ({ flight, onClick }) => (
  <div
    onClick={() => onClick(flight)}
    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
               hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md
               transition-all cursor-pointer p-4 flex items-center gap-4"
  >
    <AirlineLogo airline={flight.airline} size="md" />

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-mono font-bold text-gray-900 dark:text-white text-base">
          {flight.flightNumber}
        </span>
        {flight.prefixo && (
          <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{flight.prefixo}</span>
        )}
        <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[flight.status]}`}>
          {flight.status}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-green-500" />
          ETA {flight.scheduledArrival}
        </span>
        {flight.scheduledDeparture && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-orange-500" />
            ETD {flight.scheduledDeparture}
          </span>
        )}
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-blue-500" />
          {flight.positionId || flight.posicaoPrevista || '--'}
        </span>
        {flight.destination && (
          <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
            {flight.destination}
          </span>
        )}
        {(flight.assignedOperators?.length ?? 0) > 0 && (
          <span className="flex items-center gap-1">
            <User className="w-3 h-3 text-indigo-500" />
            {flight.assignedOperators.length} op.
          </span>
        )}
      </div>
    </div>

    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
  </div>
);
