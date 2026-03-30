import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

type ColorMode = 'default' | 'deuteranomaly' | 'deuteranopia' | 'protanomaly' | 'protanopia' | 'tritanomaly' | 'tritanopia' | 'achromatomia' | 'high-contrast';

const filters = {
  default: 'none',
  deuteranomaly: 'url(#deuteranomaly-filter)',
  deuteranopia: 'url(#deuteranopia-filter)',
  protanomaly: 'url(#protanomaly-filter)',
  protanopia: 'url(#protanopia-filter)',
  tritanomaly: 'url(#tritanomaly-filter)',
  tritanopia: 'url(#tritanopia-filter)',
  achromatomia: 'grayscale(100%)',
  'high-contrast': 'contrast(150%) saturate(150%)',
};

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ColorMode>('default');

  useEffect(() => {
    document.documentElement.style.filter = filters[mode];
  }, [mode]);

  const modes: { id: ColorMode; label: string; gradient: string; isDark?: boolean }[] = [
    { id: 'default', label: 'Padrão', gradient: 'linear-gradient(135deg, #000 50%, #fff 50%)' },
    { id: 'deuteranomaly', label: 'Deuteranomalia', gradient: 'linear-gradient(135deg, #d4af37 50%, #4169e1 50%)' },
    { id: 'deuteranopia', label: 'Deuteranopia', gradient: 'linear-gradient(135deg, #8b6508 50%, #000080 50%)' },
    { id: 'protanomaly', label: 'Protanomalia', gradient: 'linear-gradient(135deg, #2e8b57 50%, #20b2aa 50%)' },
    { id: 'protanopia', label: 'Protanopia', gradient: 'linear-gradient(135deg, #006400 50%, #008080 50%)' },
    { id: 'tritanomaly', label: 'Tritanomalia', gradient: 'linear-gradient(135deg, #cd5c5c 50%, #3cb371 50%)' },
    { id: 'tritanopia', label: 'Tritanopia', gradient: 'linear-gradient(135deg, #8b0000 50%, #006400 50%)' },
    { id: 'achromatomia', label: 'Acromatopsia', gradient: 'linear-gradient(135deg, #666 50%, #ccc 50%)' },
    { id: 'high-contrast', label: 'Alto Contraste', gradient: '#000', isDark: true },
  ];

  return (
    <>
      <svg style={{ height: 0, width: 0, position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <filter id="protanomaly-filter">
            <feColorMatrix type="matrix" values="0.817, 0.183, 0, 0, 0  0.333, 0.667, 0, 0, 0  0, 0.125, 0.875, 0, 0  0, 0, 0, 1, 0" />
          </filter>
          <filter id="protanopia-filter">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" />
          </filter>
          <filter id="deuteranomaly-filter">
            <feColorMatrix type="matrix" values="0.8, 0.2, 0, 0, 0  0.258, 0.742, 0, 0, 0  0, 0.142, 0.858, 0, 0  0, 0, 0, 1, 0" />
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" />
          </filter>
          <filter id="tritanomaly-filter">
            <feColorMatrix type="matrix" values="0.967, 0.033, 0, 0, 0  0, 0.733, 0.267, 0, 0  0, 0.183, 0.817, 0, 0  0, 0, 0, 1, 0" />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" />
          </filter>
        </defs>
      </svg>

      <div className="fixed top-1/2 -translate-y-1/2 left-0 z-50 flex items-start">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-black text-white p-3 rounded-r-md shadow-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
          aria-label="Menu de Acessibilidade"
        >
          <Eye className="w-5 h-5" />
        </button>

        {isOpen && (
          <div className="ml-1 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2 text-gray-500">
              <Eye className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Modo de Visão</h3>
            </div>
            <div className="py-2">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors text-sm ${
                    m.isDark 
                      ? 'bg-black text-white hover:bg-gray-900' 
                      : 'hover:bg-gray-50 text-gray-700'
                  } ${mode === m.id && !m.isDark ? 'bg-gray-100 font-medium' : ''}`}
                >
                  <div 
                    className={`w-4 h-4 rounded-full shrink-0 ${m.isDark ? 'border border-gray-700' : 'border border-gray-300 shadow-sm'}`}
                    style={{ background: m.gradient }}
                  />
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
