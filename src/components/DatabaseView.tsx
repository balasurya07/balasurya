import React, { useState } from 'react';
import {
  Database,
  Copy,
  Check,
  Download,
  Table as TableIcon,
  Code2,
  Sparkles,
  Key,
  Shield,
  Layers,
} from 'lucide-react';
import { SCHEMA_TABLES, POSTGRES_PGVECTOR_DDL } from '../data/databaseSchema';

export function DatabaseView() {
  const [activeTab, setActiveTab] = useState<'tables' | 'ddl'>('tables');
  const [selectedTable, setSelectedTable] = useState<string>(SCHEMA_TABLES[0].name);
  const [copied, setCopied] = useState<boolean>(false);

  const activeTableData = SCHEMA_TABLES.find((t) => t.name === selectedTable) || SCHEMA_TABLES[0];

  const handleCopyDDL = () => {
    navigator.clipboard.writeText(POSTGRES_PGVECTOR_DDL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSQL = () => {
    const blob = new Blob([POSTGRES_PGVECTOR_DDL], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'copilot_production_schema_pgvector.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-semibold uppercase">
            <Database className="w-4 h-4" />
            <span>Relational & Vector Storage Layer</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            PostgreSQL 16 + pgvector Production Schema
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Optimized for real-time biometrics correlation, dynamic budget envelope enforcement, and sub-15ms HNSW cosine vector similarity facial recall.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyDDL}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-all shadow-md"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            <span>{copied ? 'Copied SQL!' : 'Copy DDL'}</span>
          </button>

          <button
            onClick={handleDownloadSQL}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center space-x-1.5 transition-all shadow-lg shadow-amber-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download .sql</span>
          </button>
        </div>
      </div>

      {/* Navigation sub-tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('tables')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
            activeTab === 'tables'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <TableIcon className="w-4 h-4" />
          <span>Table Schema Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab('ddl')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
            activeTab === 'ddl'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Full DDL Script (SQL)</span>
        </button>
      </div>

      {activeTab === 'tables' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Table list selection sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-mono font-bold text-slate-400 px-2 uppercase tracking-wider">
              Core Database Tables
            </div>
            {SCHEMA_TABLES.map((table) => (
              <button
                key={table.name}
                onClick={() => setSelectedTable(table.name)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  selectedTable === table.name
                    ? 'bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-950/20'
                    : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white flex items-center space-x-2">
                    <TableIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>{table.name}</span>
                  </span>
                  {table.columns.some((c) => c.isVector) && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      pgvector
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {table.description}
                </p>
                <div className="mt-2 text-[10px] font-mono text-slate-500">
                  PK: {table.primaryKey} | Columns: {table.columns.length}
                </div>
              </button>
            ))}
          </div>

          {/* Table Details & Columns View */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div>
                  <h3 className="text-base font-bold text-white font-mono flex items-center space-x-2">
                    <TableIcon className="w-4 h-4 text-amber-400" />
                    <span>{activeTableData.name}</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">{activeTableData.description}</p>
                </div>
                <div className="text-xs font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
                  Primary Key: <span className="text-amber-400 font-bold">{activeTableData.primaryKey}</span>
                </div>
              </div>

              {/* Columns Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                      <th className="p-2.5">Column</th>
                      <th className="p-2.5">Data Type</th>
                      <th className="p-2.5">Nullable</th>
                      <th className="p-2.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {activeTableData.columns.map((col, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-2.5 font-bold text-white flex items-center space-x-1.5">
                          {col.isVector && <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
                          {col.isForeign && <Key className="w-3.5 h-3.5 text-cyan-400" />}
                          <span>{col.name}</span>
                        </td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${
                            col.isVector
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                              : 'bg-slate-800 text-amber-300'
                          }`}>
                            {col.type}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-400">{col.nullable ? 'YES' : 'NO'}</td>
                        <td className="p-2.5 text-slate-300 font-sans text-xs">{col.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Indexes & Vector Properties */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                  Configured Indexes & Constraints
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeTableData.indexes.map((idx, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center space-x-1"
                    >
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{idx}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample Record JSON */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                  Sample Seed Document
                </div>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                  {JSON.stringify(activeTableData.sampleRecord, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl relative">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="text-xs font-mono text-slate-400">
              PostgreSQL 16 Script with <span className="text-purple-400 font-bold">pgvector</span> and HNSW Cosine Indexing
            </div>
            <button
              onClick={handleCopyDDL}
              className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-4 bg-slate-900/60 rounded-xl max-h-[600px] leading-relaxed select-all">
            {POSTGRES_PGVECTOR_DDL}
          </pre>
        </div>
      )}
    </div>
  );
}
