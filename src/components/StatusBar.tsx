import React from 'react';
import { ActiveDocument } from '../types';

interface StatusBarProps {
  document: ActiveDocument;
  isDirty: boolean;
  line: number;
  col: number;
  charCount: number;
  wordCount: number;
  soundEnabled: boolean;
  onOpenCloudManager: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  document,
  isDirty,
  line,
  col,
  charCount,
  wordCount,
  soundEnabled,
  onOpenCloudManager,
}) => {
  const sourceLabel =
    document.source === 'cloud'
      ? `☁ Nube: ${document.fileName}`
      : document.source === 'local'
      ? `💾 Local: ${document.fileName}`
      : `📄 Nuevo: ${document.fileName}`;

  return (
    <div
      id="notepad-statusbar"
      className="bg-[#c0c0c0] text-black h-[22px] flex items-center px-1 text-[11px] select-none gap-1 border-t border-[#808080]"
      style={{
        boxShadow: 'inset 0 1px 0 #ffffff',
      }}
    >
      {/* File & Storage Status Panel */}
      <div
        id="statusbar-file-panel"
        onClick={document.source === 'cloud' ? onOpenCloudManager : undefined}
        title={document.source === 'cloud' ? 'Clic para abrir el Administrador de la nube' : ''}
        className={`flex-1 px-2 h-[18px] flex items-center truncate text-[11px] font-sans ${
          document.source === 'cloud' ? 'cursor-pointer hover:bg-white/40' : ''
        }`}
        style={{
          borderTop: '1px solid #808080',
          borderLeft: '1px solid #808080',
          borderRight: '1px solid #ffffff',
          borderBottom: '1px solid #ffffff',
        }}
      >
        <span className="truncate">{sourceLabel}</span>
        {isDirty && <span className="text-red-700 font-bold ml-1.5">[Modificado]</span>}
      </div>

      {/* Position Panel */}
      <div
        id="statusbar-pos-panel"
        className="px-2 h-[18px] flex items-center justify-center shrink-0 text-[10px] sm:text-[11px] min-w-[80px] sm:w-[120px]"
        style={{
          borderTop: '1px solid #808080',
          borderLeft: '1px solid #808080',
          borderRight: '1px solid #ffffff',
          borderBottom: '1px solid #ffffff',
        }}
      >
        Lín {line}, Col {col}
      </div>

      {/* Stats Panel (Hidden on small mobile) */}
      <div
        id="statusbar-stats-panel"
        className="hidden md:flex px-2 h-[18px] items-center justify-center truncate text-[11px] w-[140px] shrink-0"
        style={{
          borderTop: '1px solid #808080',
          borderLeft: '1px solid #808080',
          borderRight: '1px solid #ffffff',
          borderBottom: '1px solid #ffffff',
        }}
      >
        {charCount} car. | {wordCount} pal.
      </div>

      {/* Encoding & Sound Panel */}
      <div
        id="statusbar-mode-panel"
        className="hidden sm:flex px-1.5 h-[18px] items-center justify-between text-[11px] w-[70px] sm:w-[90px] shrink-0"
        style={{
          borderTop: '1px solid #808080',
          borderLeft: '1px solid #808080',
          borderRight: '1px solid #ffffff',
          borderBottom: '1px solid #ffffff',
        }}
      >
        <span>ANSI</span>
        <span title={soundEnabled ? 'Sonido activado' : 'Sonido desactivado'}>
          {soundEnabled ? '🔊' : '🔇'}
        </span>
      </div>
    </div>
  );
};
