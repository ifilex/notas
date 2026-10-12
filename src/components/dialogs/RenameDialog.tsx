import React, { useState, useEffect } from 'react';
import { retroAudio } from '../../utils/audio';

interface RenameDialogProps {
  isOpen: boolean;
  currentName: string;
  onClose: () => void;
  onConfirmRename: (newName: string) => void;
}

export const RenameDialog: React.FC<RenameDialogProps> = ({
  isOpen,
  currentName,
  onClose,
  onConfirmRename,
}) => {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleSave = () => {
    let clean = name.trim().toUpperCase();
    if (!clean) clean = 'DOCUMENTO.TXT';
    if (!clean.includes('.')) clean += '.TXT';

    retroAudio.play('save');
    onConfirmRename(clean);
    onClose();
  };

  return (
    <div
      id="dialog-rename-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 select-none font-sans overflow-y-auto"
    >
      <div
        id="dialog-rename"
        className="w-full max-w-[360px] max-h-[94dvh] bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-2xl p-1 text-[12px] overflow-y-auto"
      >
        {/* Title Bar */}
        <div className="bg-[#000080] text-white px-2 py-0.5 font-bold flex justify-between items-center text-xs shrink-0">
          <span>Cambiar nombre de archivo</span>
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
            <label className="block text-black font-semibold">
              Nuevo nombre del archivo:
            </label>
            <input
              id="input-rename-value"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') onClose();
              }}
              className="w-full bg-white text-black border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white px-1.5 py-0.5 font-mono font-bold outline-none"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              id="btn-rename-accept"
              type="button"
              onClick={handleSave}
              className="win3-button font-bold px-3"
            >
              Aceptar
            </button>
            <button
              id="btn-rename-cancel"
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
