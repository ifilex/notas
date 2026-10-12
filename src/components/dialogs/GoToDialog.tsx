import React, { useState } from 'react';
import { retroAudio } from '../../utils/audio';

interface GoToDialogProps {
  isOpen: boolean;
  maxLines: number;
  onClose: () => void;
  onGoToLine: (lineNumber: number) => void;
}

export const GoToDialog: React.FC<GoToDialogProps> = ({
  isOpen,
  maxLines,
  onClose,
  onGoToLine,
}) => {
  const [lineNumber, setLineNumber] = useState('1');

  if (!isOpen) return null;

  const handleConfirm = () => {
    const num = parseInt(lineNumber, 10);
    if (!isNaN(num) && num > 0) {
      retroAudio.play('click');
      onGoToLine(num);
      onClose();
    } else {
      retroAudio.play('stop');
    }
  };

  return (
    <div
      id="dialog-goto-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 select-none font-sans overflow-y-auto"
    >
      <div
        id="dialog-goto"
        className="w-full max-w-[340px] max-h-[94dvh] bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-2xl p-1 text-[12px] overflow-y-auto"
      >
        {/* Title Bar */}
        <div className="bg-[#000080] text-white px-2 py-0.5 font-bold flex justify-between items-center text-xs shrink-0">
          <span>Ir a la línea</span>
          <button
            type="button"
            onClick={onClose}
            className="w-4 h-3.5 bg-[#c0c0c0] text-black border-t border-l border-white border-r border-b border-black text-[9px] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-2.5 sm:p-3 space-y-3">
          <div className="space-y-1">
            <label className="block text-black">
              Número de línea (1 - {Math.max(1, maxLines)}):
            </label>
            <input
              id="input-goto-line"
              type="number"
              min="1"
              max={maxLines}
              value={lineNumber}
              onChange={(e) => setLineNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirm();
                if (e.key === 'Escape') onClose();
              }}
              className="w-full bg-white text-black border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white px-1.5 py-0.5 outline-none font-mono"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              id="btn-goto-accept"
              type="button"
              onClick={handleConfirm}
              className="win3-button font-bold px-3"
            >
              Aceptar
            </button>
            <button
              id="btn-goto-cancel"
              type="button"
              onClick={onClose}
              className="win3-button px-3"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
