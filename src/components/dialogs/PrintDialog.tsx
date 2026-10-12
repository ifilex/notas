import React, { useState } from 'react';
import { retroAudio } from '../../utils/audio';

interface PrintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPrint: () => void;
}

export const PrintDialog: React.FC<PrintDialogProps> = ({
  isOpen,
  onClose,
  onConfirmPrint,
}) => {
  const [copies, setCopies] = useState(1);
  const [range, setRange] = useState<'all' | 'selection' | 'pages'>('all');
  const [collate, setCollate] = useState(true);

  if (!isOpen) return null;

  const handlePrint = () => {
    retroAudio.play('save');
    onClose();
    onConfirmPrint();
  };

  return (
    <div
      id="dialog-print-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 select-none font-sans overflow-y-auto"
    >
      <div
        id="dialog-print"
        className="w-full max-w-[460px] max-h-[94dvh] bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-2xl p-1 text-[12px] overflow-y-auto"
      >
        {/* Title Bar */}
        <div className="bg-[#000080] text-white px-2 py-0.5 font-bold flex justify-between items-center text-xs shrink-0">
          <span>Imprimir</span>
          <button
            type="button"
            onClick={onClose}
            className="w-4 h-3.5 bg-[#c0c0c0] text-black border-t border-l border-white border-r border-b border-black text-[9px] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-2.5 sm:p-3 space-y-3">
          {/* Printer Info */}
          <div className="border border-[#808080] p-2 bg-white/40 text-xs">
            <div className="flex justify-between">
              <span className="font-bold text-black">Impresora:</span>
              <span className="font-mono text-gray-800 truncate ml-2">HP LaserJet 4/4M</span>
            </div>
            <div className="flex justify-between mt-1 text-[11px] text-gray-600">
              <span>Estado: Preparada</span>
              <span>LPT1:</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Range */}
            <fieldset className="border border-[#808080] p-2 space-y-1.5 text-xs">
              <legend className="text-[11px] px-1 text-black font-semibold">Intervalo de impresión</legend>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="print-range"
                  checked={range === 'all'}
                  onChange={() => setRange('all')}
                  className="accent-[#000080]"
                />
                <span><span className="underline">T</span>odo</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="print-range"
                  checked={range === 'selection'}
                  onChange={() => setRange('selection')}
                  className="accent-[#000080]"
                />
                <span><span className="underline">S</span>elección</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="print-range"
                  checked={range === 'pages'}
                  onChange={() => setRange('pages')}
                  className="accent-[#000080]"
                />
                <span>Páginas 1 a 1</span>
              </label>
            </fieldset>

            {/* Copies */}
            <fieldset className="border border-[#808080] p-2 space-y-2 text-xs">
              <legend className="text-[11px] px-1 text-black font-semibold">Copias</legend>
              <div className="flex items-center gap-2">
                <label>Número de <span className="underline">c</span>opias:</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={copies}
                  onChange={(e) => setCopies(Number(e.target.value))}
                  className="w-12 bg-white border border-[#808080] px-1 py-0.5 text-center font-mono"
                />
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={collate}
                  onChange={(e) => setCollate(e.target.checked)}
                  className="accent-[#000080]"
                />
                <span>Intercalar copias</span>
              </label>
            </fieldset>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              id="btn-print-accept"
              type="button"
              onClick={handlePrint}
              className="win3-button font-bold px-4 flex-1 sm:flex-initial"
            >
              Aceptar
            </button>
            <button
              id="btn-print-cancel"
              type="button"
              onClick={onClose}
              className="win3-button px-4 flex-1 sm:flex-initial"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
