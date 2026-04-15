// ============================================================
// TIPOS CENTRAIS DO SISTEMA SGOA
// ============================================================

export type Turno = 'MANHA' | 'TARDE' | 'NOITE';

export type FlightStatus =
  | 'PROGRAMADO'
  | 'CHEGADA'
  | 'FILA'
  | 'DESIGNADO'
  | 'ABASTECENDO'
  | 'FINALIZADO';

export type Tab =
  | 'GERAL'
  | 'CHEGADA'
  | 'FILA'
  | 'DESIGNADOS'
  | 'ABASTECENDO'
  | 'FINALIZADO'
  | 'MALHA';

// Voo da Malha Base (programação fixa das companhias)
export interface MeshFlight {
  id: string;
  comp: string;            // companhia
  prefixo: string;         // prefixo aeronave (preenchido manualmente)
  modelo: string;          // modelo aeronave (preenchido manualmente)
  vCheg: string;           // número do voo chegada (manual)
  eta: string;             // horário estimado chegada
  vSaida: string;          // número do voo saída
  icao: string;            // código ICAO destino
  cid: string;             // cidade destino (manual)
  pos: string;             // posição real (manual)
  etd: string;             // horário estimado partida
  posicaoPrevista: string; // posição prevista (editável antes da operação)
  calcoPrevisto: string;   // calço previsto (editável antes da operação)
  atualizado: boolean;     // true = promovido para operacional
  turno: Turno | '';       // turno que fez a atualização
  updatedAt?: string;
}

// Voo Operacional (promovido da malha ou criado manualmente)
export interface FlightData {
  id: string;
  meshId?: string;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  origin: string;
  destination: string;
  scheduledArrival: string;
  scheduledDeparture: string;
  status: FlightStatus;
  positionId: string;
  posicaoPrevista: string;
  calcoPrevisto: string;
  actualArrivalTime: string;
  actualDepartureTime: string;
  prefixo: string;
  modelo: string;
  vCheg: string;
  cid: string;
  fuelAmount: string;
  fuelOperator: string;
  assignedOperators: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
  turno: Turno | '';
  isMeshFlight: boolean;
}

export interface Operator {
  id: string;
  name: string;
  role: string;
  shift: Turno;
  available: boolean;
}

export const AIRLINE_LOGOS: Record<string, string> = {
  latam:      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/LATAM_Airlines_logo.svg/200px-LATAM_Airlines_logo.svg.png',
  gol:        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/GOL_Linhas_A%C3%A9reas_logo.svg/200px-GOL_Linhas_A%C3%A9reas_logo.svg.png',
  american:   'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/American_Airlines_logo_2013.svg/200px-American_Airlines_logo_2013.svg.png',
  copa:       'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Copa_Airlines_logo.svg/200px-Copa_Airlines_logo.svg.png',
  delta:      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Delta_logo.svg/200px-Delta_logo.svg.png',
  swiss:      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Swiss_International_Air_Lines_Logo_2011.svg/200px-Swiss_International_Air_Lines_Logo_2011.svg.png',
  aerolineas: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Aerol%C3%ADneas_Argentinas_logo.svg/200px-Aerol%C3%ADneas_Argentinas_logo.svg.png',
  ita:        'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/ITA_Airways_logo.svg/200px-ITA_Airways_logo.svg.png',
  atlas:      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Atlas_Air_Logo.svg/200px-Atlas_Air_Logo.svg.png',
};

export const ICAO_TO_CITY: Record<string, string> = {
  SBGR: 'Sao Paulo (GRU)', SBGL: 'Rio de Janeiro (GIG)', SBRJ: 'Rio de Janeiro (SDU)',
  SBPA: 'Porto Alegre', SBCT: 'Curitiba', SBFL: 'Florianopolis', SBCF: 'Belo Horizonte',
  SBSV: 'Salvador', SBRF: 'Recife', SBFZ: 'Fortaleza', SBBR: 'Brasilia',
  SBEG: 'Manaus', SBBE: 'Belem', SBMO: 'Maceio', SBJP: 'Joao Pessoa',
  SBTE: 'Teresina', SBSL: 'Sao Luis', SBPV: 'Porto Velho', SBCY: 'Cuiaba',
  SBGO: 'Goiania', SBCG: 'Campo Grande', SBFI: 'Foz do Iguacu', SBLO: 'Londrina',
  SBMG: 'Maringa', SBSR: 'Sao Jose do Rio Preto', SBRP: 'Ribeirao Preto',
  SBUL: 'Uberlandia', SBVT: 'Vitoria', SBNF: 'Navegantes', SBCX: 'Caxias do Sul',
  SBJV: 'Joinville', SBCH: 'Chapeco', SBCA: 'Cascavel', SBPJ: 'Palmas',
  SBIZ: 'Imperatriz', SBFN: 'Fernando de Noronha', SBPL: 'Petrolina',
  SBJU: 'Juazeiro do Norte', SBDO: 'Dourados', SBAR: 'Aracaju', SBMK: 'Montes Claros',
  KMIA: 'Miami', KJFK: 'Nova York (JFK)', KATL: 'Atlanta', KDFW: 'Dallas',
  KLAX: 'Los Angeles', KMCO: 'Orlando',
  LEMD: 'Madri', LFPG: 'Paris', EGLL: 'Londres', EDDF: 'Frankfurt',
  LIRF: 'Roma', LIMC: 'Milao', EHAM: 'Amsterda', LSZH: 'Zurique', LPPT: 'Lisboa',
  MPTO: 'Cidade do Panama', MMMX: 'Cidade do Mexico',
  SCEL: 'Santiago', SAEZ: 'Buenos Aires (EZE)', SABE: 'Buenos Aires (AEP)',
  SUMU: 'Montevideu', SKBO: 'Bogota', SPJC: 'Lima', SVMI: 'Caracas',
  SLVR: 'Santa Cruz (Bolivia)', SGAS: 'Assuncao', SAAR: 'Rosario',
  SACO: 'Cordoba', SAME: 'Mendoza', FAOR: 'Joanesburgo',
};
