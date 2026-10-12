import React, { useState, useEffect } from 'react';
import { retroAudio } from '../../utils/audio';

interface SaveAsDialogProps {
  isOpen: boolean;
  currentFileName: string;
  defaultDestination: 'cloud' | 'local';
  onClose: () => void;
  onSaveAsCloud: (fileName: string) => void;
  onSaveAsLocal: (fileName: string) => void;
}

export const SaveAsDialog: React.FC<SaveAsDialogProps> = ({
  isOpen,
  currentFileName,
  defaultDestination,
  onClose,
  onSaveAsCloud,
  onSaveAsLocal,
}) => {
  const [fileName, setFileName] = useState('');
  const [destination, setDestination] = useState<'cloud' | 'local'>('cloud');

  useEffect(() => {
    if (isOpen) {
      const clean = currentFileName === '(Sin título)' ? 'NOTAS.TXT' : currentFileName;
      setFileName(clean);
      setDestination(defaultDestination);
    }
  }, [isOpen, currentFileName, defaultDestination]);

  if (!isOpen) return null;

  const handleSave = () => {
    let clean = fileName.trim().toUpperCase();
    if (!clean) clean = 'DOCUMENTO.TXT';
    if (!clean.includes('.')) clean += '.TXT';

    retroAudio.play('save');
    if (destination === 'cloud') {
      onSaveAsCloud(clean);
    } else {
      onSaveAsLocal(clean);
    }
    onClose();
  };

  return (
    <div
      id="dialog-saveas-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 select-none font-sans overflow-y-auto"
    >
      <div
        id="dialog-saveas"
        className="w-full max-w-[480px] max-h-[94dvh] flex flex-col bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-2xl p-1 text-[12px] overflow-y-auto"
      >
        {/* Title Bar */}
        <div className="bg-[#000080] text-white px-2 py-0.5 font-bold flex justify-between items-center text-xs shrink-0">
          <span>Guardar como</span>
          <button
            type="button"
            onClick={onClose}
            className="w-4 h-3.5 bg-[#c0c0c0] text-black border-t border-l border-white border-r border-b border-black text-[9px] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-2.5 sm:p-3 space-y-3">
          {/* Top row */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex-1 space-y-1">
              <label className="block text-black font-semibold">
                Nombre de <span className="underline">a</span>rchivo:
              </label>
              <input
                id="input-saveas-filename"
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') onClose();
                }}
                className="w-full bg-white text-black border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white px-1.5 py-0.5 outline-1 outline-black font-mono font-bold"
                autoFocus
              />
            </div>

            <div className="flex sm:flex-col flex-row gap-1.5 sm:w-[100px]">
              <button
                id="btn-saveas-accept"
                type="button"
                onClick={handleSave}
                className="win3-button font-bold text-center flex-1 sm:flex-initial"
              >
                Aceptar
              </button>
              <button
                id="btn-saveas-cancel"
                type="button"
                onClick={() => {
                  retroAudio.play('click');
                  onClose();
                }}
                className="win3-button text-center flex-1 sm:flex-initial"
              >
                Cancelar
              </button>
            </div>
          </div>

          {/* Destination Choice */}
          <div className="border border-[#808080] p-2 bg-white/50 space-y-2">
            <label className="block text-black font-semibold">
              Destino de almacenamiento:
            </label>
            <div className="space-y-1 pl-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="save-dest"
                  checked={destination === 'cloud'}
                  onChange={() => setDestination('cloud')}
                  className="accent-[#000080]"
                />
                <span className="font-bold text-blue-900">☁ Almacenamiento en la Nube (Virtual Drive)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="save-dest"
                  checked={destination === 'local'}
                  onChange={() => setDestination('local')}
                  className="accent-[#000080]"
                />
                <span>💾 Descargar al Disco Duro Local (*.TXT)</span>
              </label>
            </div>
          </div>

          {/* Directories / Path preview */}
          <div className="space-y-1">
            <label className="block text-black">
              Ruta destino:
            </label>
            <div className="bg-white border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white p-2 font-mono text-[11px]">
              {destination === 'cloud' ? (
                <div>
                  <span className="text-blue-900 font-bold">cloud:\documentos\</span>
                  <span className="text-black">{fileName || 'DOCUMENTO.TXT'}</span>
                </div>
              ) : (
                <div>
                  <span className="text-gray-700 font-bold">c:\descargas\</span>
                  <span className="text-black">{fileName || 'DOCUMENTO.TXT'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
