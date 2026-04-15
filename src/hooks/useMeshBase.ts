import { useState, useEffect, useCallback } from 'react';
import {
  collection, getDocs, doc, updateDoc,
  onSnapshot, writeBatch, query, orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { MeshFlight, FlightData, Turno } from '../types';
import { parseCsvToMesh } from '../lib/csvImport';
import { ICAO_TO_CITY } from '../types';

const MESH_COL    = 'mesh_base';
const FLIGHTS_COL = 'flights';

export function useMeshBase() {
  const [meshFlights, setMeshFlights] = useState<MeshFlight[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error,   setError]           = useState<string | null>(null);

  // Listener em tempo real
  useEffect(() => {
    const q = query(collection(db, MESH_COL), orderBy('eta'));
    const unsub = onSnapshot(q,
      (snap) => {
        setMeshFlights(snap.docs.map(d => ({ id: d.id, ...d.data() } as MeshFlight)));
        setLoading(false);
      },
      (err) => { setError(err.message); setLoading(false); }
    );
    return () => unsub();
  }, []);

  // Atualiza campos editaveis de um voo da malha
  const updateMeshFlight = useCallback(async (
    id: string,
    fields: Partial<Pick<MeshFlight, 'posicaoPrevista' | 'calcoPrevisto' | 'prefixo' | 'modelo' | 'vCheg' | 'cid' | 'pos'>>
  ) => {
    await updateDoc(doc(db, MESH_COL, id), fields);
  }, []);

  // Promove voo da malha para operacional — botao ATUALIZAR
  const promoteToOperational = useCallback(async (mesh: MeshFlight, turno: Turno) => {
    const flightId = `flight_${mesh.id}_${Date.now()}`;

    const flight: FlightData = {
      id:                  flightId,
      meshId:              mesh.id,
      flightNumber:        mesh.vSaida,
      airline:             mesh.comp,
      airlineCode:         mesh.vSaida.replace(/[0-9]/g, '').substring(0, 2).toUpperCase(),
      origin:              'SBGR',
      destination:         mesh.icao,
      scheduledArrival:    mesh.eta,
      scheduledDeparture:  mesh.etd,
      status:              'CHEGADA',
      positionId:          mesh.posicaoPrevista,
      posicaoPrevista:     mesh.posicaoPrevista,
      calcoPrevisto:       mesh.calcoPrevisto,
      actualArrivalTime:   '',
      actualDepartureTime: '',
      prefixo:             mesh.prefixo,
      modelo:              mesh.modelo,
      vCheg:               mesh.vCheg,
      cid:                 mesh.cid || ICAO_TO_CITY[mesh.icao] || mesh.icao,
      fuelAmount:          '',
      fuelOperator:        '',
      assignedOperators:   [],
      notes:               '',
      createdAt:           new Date().toISOString(),
      updatedAt:           new Date().toISOString(),
      turno,
      isMeshFlight:        true,
    };

    const batch = writeBatch(db);
    batch.set(doc(db, FLIGHTS_COL, flightId), flight);
    batch.update(doc(db, MESH_COL, mesh.id), {
      atualizado: true,
      turno,
      updatedAt: new Date().toISOString(),
    });
    await batch.commit();
  }, []);

  // Importa CSV/Excel e faz merge inteligente na mesh_base
  const importFromFile = useCallback(async (file: File): Promise<number> => {
    const parsed = await parseCsvToMesh(file);
    const batch  = writeBatch(db);

    // Carrega existentes para preservar dados manuais
    const snap     = await getDocs(collection(db, MESH_COL));
    const existing = new Map<string, MeshFlight>();
    snap.docs.forEach(d => {
      const m = d.data() as MeshFlight;
      existing.set(`${m.vSaida}_${m.eta}`, m);
    });

    parsed.forEach((flight) => {
      const key     = `${flight.vSaida}_${flight.eta}`;
      const current = existing.get(key);
      const ref     = doc(db, MESH_COL, flight.id);

      batch.set(ref, current
        ? {
            ...flight,
            prefixo:         current.prefixo,
            modelo:          current.modelo,
            vCheg:           current.vCheg,
            cid:             current.cid,
            pos:             current.pos,
            posicaoPrevista: current.posicaoPrevista,
            calcoPrevisto:   current.calcoPrevisto,
            atualizado:      current.atualizado,
            turno:           current.turno,
          }
        : flight
      );
    });

    await batch.commit();
    return parsed.length;
  }, []);

  return { meshFlights, loading, error, updateMeshFlight, promoteToOperational, importFromFile };
}
