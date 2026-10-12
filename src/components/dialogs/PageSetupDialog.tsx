import React, { useState } from 'react';
import { PageSetupSettings } from '../../types';
import { retroAudio } from '../../utils/audio';

interface PageSetupDialogProps {
  isOpen: boolean;
  settings: PageSetupSettings;
  onClose: () => void;
  onApply: (settings: PageSetupSettings) => void;
}

export const PageSetupDialog: React.FC<PageSetupDialogProps> = ({
  isOpen,
  settings,
  onClose,
  onApply,
}) => {
  const [header, setHeader] = useState(settings.header);
  const [footer, setFooter] = useState(settings.footer);
  const [marginLeft, setMarginLeft] = useState(settings.marginLeft);
  const [marginRight, setMarginRight] = useState(settings.marginRight);
  const [marginTop, setMarginTop] = useState(settings.marginTop);
  const [marginBottom, setMarginBottom] = useState(settings.marginBottom);
  const [orientation, setOrientation] = useState(settings.orientation);

  if (!isOpen) return null;

  const handleSave = () => {
    retroAudio.play('save');
    onApply({
      header,
      footer,
      marginLeft,
      marginRight,
      marginTop,
      marginBottom,
      orientation,
    });
    onClose();
  };

  return (
    <div
      id="dialog-pagesetup-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 select-none font-sans overflow-y-auto"
    >
      <div
        id="dialog-pagesetup"
        className="w-full max-w-[440px] max-h-[94dvh] bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-2xl p-1 text-[12px] overflow-y-auto"
      >
        {/* Title Bar */}
        <div className="bg-[#000080] text-white px-2 py-0.5 font-bold flex justify-between items-center text-xs shrink-0">
          <span>Configurar página</span>
          <button
            type="button"
            onClick={onClose}
            className="w-4 h-3.5 bg-[#c0c0c0] text-black border-t border-l border-white border-r border-b border-black text-[9px] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-2.5 sm:p-3 space-y-3">
          {/* Header and Footer */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="w-[80px] text-black">
                <span className="underline">E</span>ncabezado:
              </label>
              <input
                type="text"
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                className="flex-1 bg-white text-black border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white px-1.5 py-0.5"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-[80px] text-black">
                <span className="underline">P</span>ie de página:
              </label>
              <input
                type="text"
                value={footer}
                onChange={(e) => setFooter(e.target.value)}
                className="flex-1 bg-white text-black border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white px-1.5 py-0.5"
              />
            </div>
          </div>

          {/* Margins */}
          <fieldset className="border border-[#808080] p-2 space-y-2">
            <legend className="text-[11px] px-1 text-black font-semibold">Márgenes (milímetros)</legend>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <label className="w-16">Izquierdo:</label>
                <input
                  type="number"
                  value={marginLeft}
                  onChange={(e) => setMarginLeft(Number(e.target.value))}
                  className="w-16 bg-white border border-[#808080] px-1 py-0.5 text-right"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-16">Derecho:</label>
                <input
                  type="number"
                  value={marginRight}
                  onChange={(e) => setMarginRight(Number(e.target.value))}
                  className="w-16 bg-white border border-[#808080] px-1 py-0.5 text-right"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-16">Superior:</label>
                <input
                  type="number"
                  value={marginTop}
                  onChange={(e) => setMarginTop(Number(e.target.value))}
                  className="w-16 bg-white border border-[#808080] px-1 py-0.5 text-right"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-16">Inferior:</label>
                <input
                  type="number"
                  value={marginBottom}
                  onChange={(e) => setMarginBottom(Number(e.target.value))}
                  className="w-16 bg-white border border-[#808080] px-1 py-0.5 text-right"
                />
              </div>
            </div>
          </fieldset>

          {/* Orientation */}
          <fieldset className="border border-[#808080] p-2">
            <legend className="text-[11px] px-1 text-black font-semibold">Orientación</legend>
            <div className="flex gap-4 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="page-orient"
                  checked={orientation === 'portrait'}
                  onChange={() => setOrientation('portrait')}
                  className="accent-[#000080]"
                />
                <span>Vertical</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="page-orient"
                  checked={orientation === 'landscape'}
                  onChange={() => setOrientation('landscape')}
                  className="accent-[#000080]"
                />
                <span>Horizontal</span>
              </label>
            </div>
          </fieldset>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              id="btn-pagesetup-accept"
              type="button"
              onClick={handleSave}
              className="win3-button font-bold px-4"
            >
              Aceptar
            </button>
            <button
              id="btn-pagesetup-cancel"
              type="button"
              onClick={onClose}
              className="win3-button px-4"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
