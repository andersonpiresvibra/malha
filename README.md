# SGOA — Sistema de Gestao de Operacoes Aeroportuarias

Aplicacao web para gestao operacional de voos em aeroporto.
Construida com React + TypeScript + Firebase + Tailwind CSS.

## Estrutura

```
src/
  types/        # Tipos TypeScript centrais
  lib/          # Firebase config + parser CSV
  hooks/        # useFlights, useMeshBase
  contexts/     # ThemeContext (dark/light)
  components/   # AirlineLogo, FlightCard, MeshBaseTable, Modals...
  pages/        # OperationalPanel
  App.tsx       # Orquestrador
  main.tsx      # Entry point
```

## Funcionalidades

- **Malha Base**: programacao fixa das companhias, importacao via CSV/Excel
- **Posicao Prevista e Calco Previsto**: editaveis antes da operacao
- **Botao Atualizar**: promove o voo da malha para o painel operacional
- **Visao Geral**: exibe apenas voos que foram atualizados na malha base
- **Abas operacionais**: Chegada, Fila, Designados, Abastecendo, Finalizado
- **Turnos**: Manha, Tarde, Noite — cada turno opera a malha preparada pelo anterior
- **Dark/Light mode**
- **Sincronizacao Firebase Firestore** em tempo real

## Instalacao

```bash
# 1. Clone o repositorio
git clone https://github.com/andersonpiresvibra/malha.git
cd malha

# 2. Instale dependencias
npm install

# 3. Configure Firebase
cp .env.example .env
# Edite .env com suas credenciais do Firebase

# 4. Rode em desenvolvimento
npm run dev

# 5. Build producao
npm run build
```

## Importacao da Malha Base

1. Prepare um arquivo .csv ou .xlsx com as colunas:
   `COMP | ETA | V.SAIDA | ICAO | ETD | V.CHEG | PREFIXO | MODELO | CID | POS`
2. Na aba **Malha Base**, clique em **Importar CSV/Excel**
3. Os dados ja existentes sao preservados (prefixo, modelo, posicoes previstas)

## Fluxo de Turno

1. Turno anterior prepara a malha: preenche **Posicao Prevista** e **Calco Previsto**
2. Turno atual assume e clica **Atualizar** nos voos conforme a operacao
3. O voo e promovido para o painel operacional com status **CHEGADA**
4. A partir dai o voo segue o fluxo: Fila -> Designado -> Abastecendo -> Finalizado
