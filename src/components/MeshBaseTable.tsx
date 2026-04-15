import React, { useState, useMemo } from 'react';
import { RefreshCw, Upload, ChevronUp, ChevronDown, CheckCircle2, Filter } from 'lucide-react';
import type { MeshFlight, Turno } from '../types';
import { AirlineLogo } from './AirlineLogo';
import { useMeshBase } from '../hooks/useMeshBase';

interface Props { turnoAtivo: Turno; }

type SortField = 'eta' | 'comp' | 'vSaida' | 'icao' | 'etd';
type SortDir   = 'asc' | 'desc';

const TURNO_BADGE: Record<Turno, string> = {
  MANHA: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  TARDE: 'bg-orange-100 text-orange-800 border-orange-300',
  NOITE: 'bg-indigo-100 text-indigo-800 border-indigo-300',
};

export const MeshBaseTable: React.FC<Props> = ({ turnoAtivo }) => {
  const {
    meshFlights, loading, error,
    updateMeshFlight, promoteToOperational, importFromFile,
  } = useMeshBase();

  const [editingId,   setEditingId]   = useState<string | null>(null);
  const [editValues,  setEditValues]  = useState<Partial<MeshFlight>>({});
  const [sortField,   setSortField]   = useState<SortField>('eta');
  const [sortDir,     setSortDir]     = useState<SortDir>('asc');
  const [filterComp,  setFilterComp]  = useState('');
  const [filterStatus,setFilterStatus]= useState<'todos'|'pendentes'|'atualizados'>('todos');
  const [promoting,   setPromoting]   = useState<string | null>(null);
  const [importing,   setImporting]   = useState(false);

  const companhias = useMemo(() =>
    Array.from(new Set(meshFlights.map(f => f.comp))).sort(), [meshFlights]);

  const filtered = useMemo(() =>
    meshFlights
      .filter(f => {
        if (filterComp && f.comp !== filterComp) return false;
        if (filterStatus === 'pendentes'   && f.atualizado)  return false;
        if (filterStatus === 'atualizados' && !f.atualizado) return false;
        return true;
      })
      .sort((a, b) => {
        const av = String(a[sortField] ?? '');
        const bv = String(b[sortField] ?? '');
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }),
    [meshFlights, filterComp, filterStatus, sortField, sortDir]
  );

  const startEdit = (f: MeshFlight) => {
    setEditingId(f.id);
    setEditValues({
      posicaoPrevista: f.posicaoPrevista,
      calcoPrevisto:   f.calcoPrevisto,
      prefixo:         f.prefixo,
      modelo:          f.modelo,
      vCheg:           f.vCheg,
      cid:             f.cid,
    });
  };

  const saveEdit = async (f: MeshFlight) => {
    await updateMeshFlight(f.id, editValues as Parameters<typeof updateMeshFlight>[1]);
    setEditingId(null);
    setEditValues({});
  };

  const handlePromote = async (f: MeshFlight) => {
    setPromoting(f.id);
    try { await promoteToOperational(f, turnoAtivo); }
    finally { setPromoting(null); }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const count = await importFromFile(file);
      alert(count + ' voos importados/atualizados na malha base!');
    } catch { alert('Erro ao importar arquivo.'); }
    finally { setImporting(false); e.target.value = ''; }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field
      ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
      : <span className="w-3 h-3" />;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      <span className="ml-3 text-gray-500">Carregando malha base...</span>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      Erro: {error}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">

      {/* Cabecalho */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 flex-1">
          <span className="font-bold text-gray-800 dark:text-gray-100 text-lg">Malha Base</span>
          <span className={'text-xs font-semibold px-2 py-1 rounded-full border ' + TURNO_BADGE[turnoAtivo]}>
            Turno: {turnoAtivo}
          </span>
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
            {filtered.length} / {meshFlights.length} voos
          </span>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select value={filterComp} onChange={e => setFilterComp(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <option value="">Todas cias</option>
            {companhias.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
            className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <option value="todos">Todos</option>
            <option value="pendentes">Pendentes</option>
            <option value="atualizados">Atualizados</option>
          </select>
        </div>

        {/* Importar */}
        <label className={'flex items-center gap-2 px-3 py-2 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors ' + (importing ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700')}>
          <Upload className="w-4 h-4" />
          {importing ? 'Importando...' : 'Importar CSV/Excel'}
          <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleImport} disabled={importing} />
        </label>
      </div>

      {/* Stats rapidas */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{meshFlights.length}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-green-200 dark:border-green-800 text-center">
          <div className="text-2xl font-bold text-green-600">{meshFlights.filter(f => f.atualizado).length}</div>
          <div className="text-xs text-gray-500">Atualizados</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-orange-200 dark:border-orange-800 text-center">
          <div className="text-2xl font-bold text-orange-500">{meshFlights.filter(f => !f.atualizado).length}</div>
          <div className="text-xs text-gray-500">Pendentes</div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">CIA</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 cursor-pointer"
                    onClick={() => toggleSort('vSaida')}>
                  <span className="flex items-center gap-1">V.SAIDA <SortIcon field="vSaida" /></span>
                </th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 cursor-pointer"
                    onClick={() => toggleSort('eta')}>
                  <span className="flex items-center gap-1">ETA <SortIcon field="eta" /></span>
                </th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 cursor-pointer"
                    onClick={() => toggleSort('etd')}>
                  <span className="flex items-center gap-1">ETD <SortIcon field="etd" /></span>
                </th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 cursor-pointer"
                    onClick={() => toggleSort('icao')}>
                  <span className="flex items-center gap-1">ICAO <SortIcon field="icao" /></span>
                </th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">V.CHEG</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">PREFIXO</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">MODELO</th>
                <th className="px-3 py-3 text-left font-semibold text-blue-600 dark:text-blue-400">POS.PREV</th>
                <th className="px-3 py-3 text-left font-semibold text-blue-600 dark:text-blue-400">CALCO.PREV</th>
                <th className="px-3 py-3 text-center font-semibold text-gray-600 dark:text-gray-300">ACOES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map(f => {
                const isEditing  = editingId === f.id;
                const isPromoting = promoting === f.id;

                return (
                  <tr key={f.id}
                    className={('transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50') + (f.atualizado ? ' bg-green-50/50 dark:bg-green-900/10' : '')}>

                    {/* CIA */}
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <AirlineLogo airline={f.comp} size="sm" />
                        <span className="font-semibold text-xs text-gray-700 dark:text-gray-200 uppercase">{f.comp}</span>
                      </div>
                    </td>

                    {/* V.Saida */}
                    <td className="px-3 py-2">
                      <span className="font-mono font-bold text-gray-800 dark:text-gray-100">{f.vSaida}</span>
                    </td>

                    {/* ETA */}
                    <td className="px-3 py-2">
                      <span className="font-mono text-green-700 dark:text-green-400 font-bold">{f.eta}</span>
                    </td>

                    {/* ETD */}
                    <td className="px-3 py-2">
                      <span className="font-mono text-orange-600 dark:text-orange-400">{f.etd || '--'}</span>
                    </td>

                    {/* ICAO */}
                    <td className="px-3 py-2">
                      <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded">
                        {f.icao}
                      </span>
                    </td>

                    {/* V.Cheg editavel */}
                    <td className="px-3 py-2">
                      {isEditing
                        ? <input className="w-20 px-1.5 py-1 text-xs border border-blue-300 rounded-md dark:bg-gray-700 dark:border-blue-500 dark:text-white"
                            value={editValues.vCheg ?? ''} onChange={e => setEditValues(v => ({ ...v, vCheg: e.target.value }))} />
                        : <span className="text-gray-600 dark:text-gray-400 font-mono text-xs">{f.vCheg || '--'}</span>
                      }
                    </td>

                    {/* Prefixo editavel */}
                    <td className="px-3 py-2">
                      {isEditing
                        ? <input className="w-20 px-1.5 py-1 text-xs border border-blue-300 rounded-md dark:bg-gray-700 dark:border-blue-500 dark:text-white"
                            value={editValues.prefixo ?? ''} onChange={e => setEditValues(v => ({ ...v, prefixo: e.target.value }))} />
                        : <span className="font-mono text-xs text-gray-600 dark:text-gray-400">{f.prefixo || '--'}</span>
                      }
                    </td>

                    {/* Modelo editavel */}
                    <td className="px-3 py-2">
                      {isEditing
                        ? <input className="w-20 px-1.5 py-1 text-xs border border-blue-300 rounded-md dark:bg-gray-700 dark:border-blue-500 dark:text-white"
                            value={editValues.modelo ?? ''} onChange={e => setEditValues(v => ({ ...v, modelo: e.target.value }))} />
                        : <span className="text-xs text-gray-600 dark:text-gray-400">{f.modelo || '--'}</span>
                      }
                    </td>

                    {/* Posicao Prevista */}
                    <td className="px-3 py-2">
                      {isEditing
                        ? <input className="w-16 px-1.5 py-1 text-xs border border-blue-400 rounded-md bg-blue-50 dark:bg-blue-900/30 dark:text-white font-bold"
                            value={editValues.posicaoPrevista ?? ''} onChange={e => setEditValues(v => ({ ...v, posicaoPrevista: e.target.value }))} />
                        : <span className={'text-xs font-bold px-2 py-1 rounded ' + (f.posicaoPrevista ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-300')}>
                            {f.posicaoPrevista || '--'}
                          </span>
                      }
                    </td>

                    {/* Calco Previsto */}
                    <td className="px-3 py-2">
                      {isEditing
                        ? <input className="w-16 px-1.5 py-1 text-xs border border-blue-400 rounded-md bg-blue-50 dark:bg-blue-900/30 dark:text-white font-bold"
                            value={editValues.calcoPrevisto ?? ''} onChange={e => setEditValues(v => ({ ...v, calcoPrevisto: e.target.value }))} />
                        : <span className={'text-xs font-bold px-2 py-1 rounded ' + (f.calcoPrevisto ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-300')}>
                            {f.calcoPrevisto || '--'}
                          </span>
                      }
                    </td>

                    {/* Acoes */}
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-1">
                        {isEditing ? (
                          <>
                            <button onClick={() => saveEdit(f)}
                              className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-md">
                              Salvar
                            </button>
                            <button onClick={() => setEditingId(null)}
                              className="px-2 py-1 bg-gray-400 hover:bg-gray-500 text-white text-xs font-medium rounded-md">
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(f)}
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-md">
                              Editar
                            </button>
                            {!f.atualizado ? (
                              <button onClick={() => handlePromote(f)} disabled={isPromoting}
                                className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold rounded-md">
                                {isPromoting
                                  ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  : <RefreshCw className="w-3 h-3" />}
                                Atualizar
                              </button>
                            ) : (
                              <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                <CheckCircle2 className="w-3 h-3" /> OK
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
