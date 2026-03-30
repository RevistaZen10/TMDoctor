import React, { useState, useEffect } from 'react';
import { Eye, Check, X } from 'lucide-react';

type ColorMode = 'default' | 'achromatomia' | 'deuteranopia' | 'protanopia' | 'tritanopia';

const filters = {
  default: 'none',
  achromatomia: 'grayscale(100%)',
  deuteranopia: 'url(#deuteranopia-filter)',
  protanopia: 'url(#protanopia-filter)',
  tritanopia: 'url(#tritanopia-filter)',
};

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ColorMode>('default');

  useEffect(() => {
    document.documentElement.style.filter = filters[mode];
  }, [mode]);

  const modes: { id: ColorMode; label: string; desc: string }[] = [
    { id: 'default', label: 'Cores padrão', desc: 'Visual normal do site' },
    { id: 'achromatomia', label: 'Acromatomia / Acromatopsia', desc: 'Visão em preto e branco (sem cores)' },
    { id: 'deuteranopia', label: 'Deuteranomalia / Deuteranopia', desc: 'Dificuldade com tons de verde' },
    { id: 'protanopia', label: 'Protanomalia / Protanopia', desc: 'Dificuldade com tons de vermelho' },
    { id: 'tritanopia', label: 'Tritanomalia / Tritanopia', desc: 'Dificuldade com tons de azul' },
  ];

  return (
    <>
      <svg style={{ height: 0, width: 0, position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <filter id="protanopia-filter">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" />
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" />
          </filter>
        </defs>
      </svg>

      <div className="fixed bottom-6 left-6 z-50">
        {isOpen && (
          <div className="absolute bottom-16 left-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden mb-2">
            <div className="p-4 bg-cyan-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <h3 className="font-bold">Acessibilidade Visual</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-cyan-100 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl mb-1 flex items-start justify-between transition-colors ${
                    mode === m.id ? 'bg-cyan-50 border border-cyan-200' : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="pr-2">
                    <div className={`font-semibold text-sm ${mode === m.id ? 'text-cyan-700' : 'text-slate-700'}`}>
                      {m.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 leading-relaxed">{m.desc}</div>
                  </div>
                  {mode === m.id && <Check className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
          aria-label="Menu de Acessibilidade"
        >
          <Eye className="w-6 h-6" />
        </button>
      </div>
    </>
  );
}
