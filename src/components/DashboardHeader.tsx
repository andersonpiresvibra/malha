import React, { useState, useEffect } from 'react';
import { Plane, Moon, Sun, Clock } from 'lucide-react';
import type { Turno } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  turnoAtivo: Turno;
  onChangeTurno: (t: Turno) => void;
}

const TURNOS: Turno[] = ['MANHA', 'TARDE', 'NOITE'];
const TURNO_LABELS: Record<Turno, string> = { MANHA: 'Manha', TARDE: 'Tarde', NOITE: 'Noite' };
const TURNO_ICONS:  Record<Turno, string> = { MANHA: 'sun', TARDE: 'cloud', NOITE: 'moon' };
const TURNO_COLORS: Record<Turno, string> = {
  MANHA: 'bg-yellow-500 text-white',
  TARDE: 'bg-orange-500 text-white',
  NOITE: 'bg-indigo-600 text-white',
};

export const DashboardHeader: React.FC<Props> = ({ turnoAtivo, onChangeTurno }) => {
  const { theme, toggleTheme } = useTheme();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-full px-4 py-3 flex items-center justify-between gap-4 flex-wrap">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">SGOA</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">Gestao de Operacoes Aeroportuarias</p>
          </div>
        </div>

        {/* Relogio */}
        <div className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Clock className="w-4 h-4" />
          <span className="font-mono text-sm font-semibold">
            {now.toLocaleTimeString('pt-BR')} &mdash; {now.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
          </span>
        </div>

        {/* Seletor de Turno */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {TURNOS.map(t => (
            <button
              key={t}
              onClick={() => onChangeTurno(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                turnoAtivo === t
                  ? TURNO_COLORS[t]
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {TURNO_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Tema */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300
                     hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="Alternar tema"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
