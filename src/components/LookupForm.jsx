import { useState } from 'react';
import { searchClient } from '../api/creatio.js';
import { MOCK_DB } from '../api/mock.js';
import { CONFIG } from '../config.js';
import { SearchIcon } from './icons.jsx';

const SAMPLE_RUCS = Object.keys(MOCK_DB);

export default function LookupForm() {
  const [ruc, setRuc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setError(null);
    setResult(null);

    if (!ruc || ruc.length < 8) {
      setError('Ingresa un RUC válido (mínimo 8 dígitos).');
      setSearched(false);
      return;
    }

    setLoading(true);
    try {
      const client = await searchClient(ruc);
      if (client) {
        setResult(client);
      } else {
        setError(`No se encontró un cliente registrado con el RUC ${ruc}.`);
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error consultando Creatio.');
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  const onRucChange = (e) => {
    setRuc(e.target.value.replace(/\D/g, '').slice(0, 11));
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <main className="max-w-3xl mx-auto px-6 pb-20">
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-10 shadow-[0_2px_24px_rgba(0,0,0,0.04)]">
        <div>
          <label htmlFor="ruc-input" className="block text-sm font-medium text-neutral-800 mb-2">
            RUC del cliente
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="ruc-input"
              type="text"
              inputMode="numeric"
              value={ruc}
              onChange={onRucChange}
              onKeyDown={onKeyDown}
              placeholder="Ej. 20100017491"
              className="flex-1 border border-neutral-300 rounded-full px-5 py-3 text-base focus:outline-none focus:border-movistar-blue focus:ring-2 focus:ring-movistar-blue/20 transition"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-movistar-blue hover:bg-movistar-blue-dark text-white rounded-full px-8 py-3 font-medium text-base transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Consultando...' : 'Consultar'}
            </button>
          </div>

          {CONFIG.mode === 'mock' && (
            <div className="mt-3 text-xs text-neutral-500 flex flex-wrap items-center gap-2">
              <span>Probar con:</span>
              {SAMPLE_RUCS.map(r => (
                <button
                  key={r}
                  onClick={() => setRuc(r)}
                  className="text-movistar-blue hover:underline"
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {(loading || result) && (
          <div className="mt-8 pt-8 border-t border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-6">
              Información del cliente
            </h2>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              <ResultField label="Nombre" value={result?.Name} loading={loading} />
              <ResultField label="Correo electrónico" value={result?.Email} loading={loading} />
              <ResultField label="Sexo / Tipo" value={result?.UsrGender} loading={loading} />
              <ResultField
                label="Edad / Antigüedad"
                value={result?.UsrAge != null ? `${result.UsrAge} años` : null}
                loading={loading}
              />
            </div>
          </div>
        )}

        {!loading && !result && !error && !searched && (
          <div className="mt-8 pt-8 border-t border-neutral-200 text-center py-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-movistar-blue/10 mb-4">
              <SearchIcon className="w-6 h-6 text-movistar-blue" />
            </div>
            <p className="text-neutral-500 text-sm">
              Ingresa un RUC y pulsa <span className="font-medium text-neutral-700">Consultar</span> para ver la información del cliente.
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-neutral-400 mt-5 text-center">
        {CONFIG.mode === 'mock'
          ? 'Modo demostración · datos locales para evaluación de la interfaz.'
          : 'Datos obtenidos en tiempo real desde Creatio CRM vía OData REST API.'}
      </p>
    </main>
  );
}

function ResultField({ label, value, loading }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1.5">{label}</div>
      <div className={`text-base min-h-[24px] ${value ? 'text-neutral-900 font-medium' : 'text-neutral-300'}`}>
        {loading ? (
          <span className="inline-block bg-neutral-200 rounded h-4 w-32 animate-pulse" />
        ) : (
          value || '—'
        )}
      </div>
    </div>
  );
}
