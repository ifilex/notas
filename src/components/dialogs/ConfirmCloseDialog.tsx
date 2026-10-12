import React from 'react';
import { retroAudio } from '../../utils/audio';

interface ConfirmCloseDialogProps {
  isOpen: boolean;
  fileName: string;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export const ConfirmCloseDialog: React.FC<ConfirmCloseDialogProps> = ({
  isOpen,
  fileName,
  onSave,
  onDiscard,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="dialog-confirm-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 select-none font-sans overflow-y-auto"
    >
      <div
        id="dialog-confirm"
        className="w-full max-w-[390px] max-h-[94dvh] bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-2xl p-1 text-[12px] overflow-y-auto"
      >
        {/* Title Bar */}
        <div className="bg-[#000080] text-white px-2 py-0.5 font-bold flex justify-between items-center text-xs shrink-0">
          <span>Bloc de notas</span>
          <button
            type="button"
            onClick={onCancel}
            className="w-4 h-3.5 bg-[#c0c0c0] text-black border-t border-l border-white border-r border-b border-black text-[9px] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-3 sm:p-4 space-y-4">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Windows 3.11 Exclamation Warning Icon */}
            <div className="w-9 h-9 min-w-9 bg-[#ffff00] border-2 border-black rounded-full flex items-center justify-center font-black text-black text-xl shadow-[1px_1px_0_#fff] shrink-0">
              !
            </div>
            <div className="text-black text-xs font-semibold">
              El texto del archivo <span className="font-mono text-blue-900 font-bold break-all">"{fileName}"</span> ha cambiado.
              <br />
              <span className="font-normal text-gray-800">¿Desea guardar los cambios antes de continuar?</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <button
              id="btn-confirm-yes"
              type="button"
              onClick={() => {
                retroAudio.play('save');
                onSave();
              }}
              className="win3-button font-bold flex-1 min-w-[70px]"
              autoFocus
            >
              Sí
            </button>
            <button
              id="btn-confirm-no"
              type="button"
              onClick={() => {
                retroAudio.play('click');
                onDiscard();
              }}
              className="win3-button flex-1 min-w-[70px]"
            >
              No
            </button>
            <button
              id="btn-confirm-cancel"
              type="button"
              onClick={() => {
                retroAudio.play('click');
                onCancel();
              }}
              className="win3-button flex-1 min-w-[70px]"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
