import React from 'react';
import { ActiveDocument } from '../types';

interface TitleBarProps {
  document: ActiveDocument;
  isDirty: boolean;
  onOpenCloudManager?: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  document,
  isDirty,
  onOpenCloudManager,
}) => {
  const displayName = document.fileName || '(Sin título)';
  const sourceTag = document.source === 'cloud' ? '[Nube]' : document.source === 'local' ? '[Local]' : '';
  const dirtyTag = isDirty ? ' *' : '';
  const titleText = `Bloc de notas - ${displayName}${dirtyTag} ${sourceTag}`;

  return (
    <header
      id="notepad-titlebar"
      className="h-[28px] px-2 flex items-center justify-between select-none text-white text-xs font-bold w-full bg-[#000080] shrink-0 border-b border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
    >
      {/* App Icon */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-sm" role="img" aria-label="Notepad">📝</span>
        <span className="hidden sm:inline font-sans text-[11px] text-blue-200">Bloc de notas</span>
      </div>

      {/* Document Title Text */}
      <div
        id="notepad-title-text"
        className="flex-1 mx-2 text-center truncate tracking-wide text-[11px] sm:text-[12px] font-sans font-bold text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]"
      >
        {titleText}
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onOpenCloudManager}
          title={document.source === 'cloud' ? 'Archivo en la nube - Clic para abrir el Administrador' : 'Documento local'}
          className="flex items-center gap-1 text-[10px] bg-blue-950/80 hover:bg-blue-900 border border-blue-400/80 px-1.5 py-0.5 text-blue-100 font-mono transition-colors"
        >
          {document.source === 'cloud' ? '☁ NUBE' : '💾 LOCAL'}
        </button>
      </div>
    </header>
  );
};
