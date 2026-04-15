import { useState, useEffect, useCallback } from 'react';
import {
  collection, doc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, addDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { FlightData, FlightStatus } from '../types';

const FLIGHTS_COL = 'flights';

export function useFlights() {
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, FLIGHTS_COL), orderBy('scheduledArrival'));
    const unsub = onSnapshot(q,
      (snap) => {
        setFlights(snap.docs.map(d => ({ id: d.id, ...d.data() } as FlightData)));
        setLoading(false);
      },
      (err) => { setError(err.message); setLoading(false); }
    );
    return () => unsub();
  }, []);

  const updateFlight = useCallback(async (id: string, fields: Partial<FlightData>) => {
    await updateDoc(doc(db, FLIGHTS_COL, id), { ...fields, updatedAt: new Date().toISOString() });
  }, []);

  const updateStatus = useCallback(async (id: string, status: FlightStatus) => {
    await updateDoc(doc(db, FLIGHTS_COL, id), { status, updatedAt: new Date().toISOString() });
  }, []);

  const deleteFlight = useCallback(async (id: string) => {
    await deleteDoc(doc(db, FLIGHTS_COL, id));
  }, []);

  const addFlight = useCallback(async (flight: Omit<FlightData, 'id'>) => {
    const ref = await addDoc(collection(db, FLIGHTS_COL), flight);
    return ref.id;
  }, []);

  return { flights, loading, error, updateFlight, updateStatus, deleteFlight, addFlight };
}
