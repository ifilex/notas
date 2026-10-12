import React, { useState } from 'react';
import { FontSettings } from '../../types';
import { retroAudio } from '../../utils/audio';

interface FontDialogProps {
  isOpen: boolean;
  currentSettings: FontSettings;
  onClose: () => void;
  onApply: (settings: FontSettings) => void;
}

const FONTS = [
  { name: 'Courier Prime', label: 'Courier Prime (Win 3.1 Fijo)' },
  { name: 'VT323', label: 'VT323 (Terminal Clásico)' },
  { name: 'MS Sans Serif', label: 'MS Sans Serif (Sistema)' },
  { name: 'Fira Code', label: 'Fira Code (Monospaced)' },
  { name: 'Source Code Pro', label: 'Source Code Pro' },
  { name: 'monospace', label: 'Fixedsys / Consola' },
];

const SIZES = [9, 10, 11, 12, 14, 16, 18, 20, 24, 28];

const RETRO_PALETTE = [
  { name: 'Negro', hex: '#000000' },
  { name: 'Azul Marino', hex: '#000080' },
  { name: 'Verde Oscuro', hex: '#008000' },
  { name: 'Turquesa', hex: '#008080' },
  { name: 'Rojo Granate', hex: '#800000' },
  { name: 'Púrpura', hex: '#800080' },
  { name: 'Oliva', hex: '#808000' },
  { name: 'Gris Oscuro', hex: '#808080' },
  { name: 'Blanco', hex: '#ffffff' },
  { name: 'Azul Brillante', hex: '#0000ff' },
  { name: 'Verde Lima', hex: '#00ff00' },
  { name: 'Cyan', hex: '#00ffff' },
  { name: 'Rojo', hex: '#ff0000' },
  { name: 'Magenta', hex: '#ff00ff' },
  { name: 'Amarillo', hex: '#ffff00' },
  { name: 'Gris Claro', hex: '#c0c0c0' },
];

export const FontDialog: React.FC<FontDialogProps> = ({
  isOpen,
  currentSettings,
  onClose,
  onApply,
}) => {
  const [fontFamily, setFontFamily] = useState(currentSettings.fontFamily);
  const [fontSize, setFontSize] = useState(currentSettings.fontSize);
  const [isBold, setIsBold] = useState(currentSettings.isBold);
  const [isItalic, setIsItalic] = useState(currentSettings.isItalic);
  const [textColor, setTextColor] = useState(currentSettings.textColor);
  const [bgColor, setBgColor] = useState(currentSettings.bgColor);

  if (!isOpen) return null;

  const handleConfirm = () => {
    retroAudio.play('save');
    onApply({
      fontFamily,
      fontSize,
      isBold,
      isItalic,
      textColor,
      bgColor,
    });
    onClose();
  };

  return (
    <div
      id="dialog-font-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 select-none font-sans overflow-y-auto"
    >
      <div
        id="dialog-font"
        className="w-full max-w-[520px] max-h-[94dvh] bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-2xl p-1 text-[12px] overflow-y-auto"
      >
        {/* Title Bar */}
        <div className="bg-[#000080] text-white px-2 py-0.5 font-bold flex justify-between items-center text-xs shrink-0">
          <span>Fuente</span>
          <button
            type="button"
            onClick={onClose}
            className="w-4 h-3.5 bg-[#c0c0c0] text-black border-t border-l border-white border-r border-b border-black text-[9px] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-2.5 sm:p-3 space-y-3">
          {/* Top 3 Listboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Font Family */}
            <div className="sm:col-span-5 space-y-1">
              <label className="block text-black font-semibold">
                <span className="underline">F</span>uente:
              </label>
              <input
                type="text"
                value={fontFamily}
                readOnly
                className="w-full bg-white text-black border-t border-l border-[#808080] border-r border-b border-white px-1 py-0.5 text-xs font-mono"
              />
              <div className="h-[80px] sm:h-[100px] bg-white border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white overflow-y-auto p-1 text-xs">
                {FONTS.map((f) => (
                  <div
                    key={f.name}
                    onClick={() => setFontFamily(f.name)}
                    className={`px-1 py-0.5 cursor-pointer truncate ${
                      fontFamily === f.name ? 'bg-[#000080] text-white' : 'hover:bg-blue-50 text-black'
                    }`}
                  >
                    {f.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Font Style */}
            <div className="sm:col-span-4 space-y-1">
              <label className="block text-black font-semibold">
                Estilo:
              </label>
              <input
                type="text"
                value={
                  isBold && isItalic
                    ? 'Negrita Cursiva'
                    : isBold
                    ? 'Negrita'
                    : isItalic
                    ? 'Cursiva'
                    : 'Normal'
                }
                readOnly
                className="w-full bg-white text-black border-t border-l border-[#808080] border-r border-b border-white px-1 py-0.5 text-xs font-mono"
              />
              <div className="h-[80px] sm:h-[100px] bg-white border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white overflow-y-auto p-1 text-xs">
                <div
                  onClick={() => {
                    setIsBold(false);
                    setIsItalic(false);
                  }}
                  className={`px-1 py-0.5 cursor-pointer ${
                    !isBold && !isItalic ? 'bg-[#000080] text-white' : 'hover:bg-blue-50'
                  }`}
                >
                  Normal
                </div>
                <div
                  onClick={() => {
                    setIsBold(false);
                    setIsItalic(true);
                  }}
                  className={`px-1 py-0.5 cursor-pointer italic ${
                    !isBold && isItalic ? 'bg-[#000080] text-white' : 'hover:bg-blue-50'
                  }`}
                >
                  Cursiva
                </div>
                <div
                  onClick={() => {
                    setIsBold(true);
                    setIsItalic(false);
                  }}
                  className={`px-1 py-0.5 cursor-pointer font-bold ${
                    isBold && !isItalic ? 'bg-[#000080] text-white' : 'hover:bg-blue-50'
                  }`}
                >
                  Negrita
                </div>
                <div
                  onClick={() => {
                    setIsBold(true);
                    setIsItalic(true);
                  }}
                  className={`px-1 py-0.5 cursor-pointer font-bold italic ${
                    isBold && isItalic ? 'bg-[#000080] text-white' : 'hover:bg-blue-50'
                  }`}
                >
                  Negrita Cursiva
                </div>
              </div>
            </div>

            {/* Font Size */}
            <div className="sm:col-span-3 space-y-1">
              <label className="block text-black font-semibold">
                <span className="underline">T</span>amaño:
              </label>
              <input
                type="text"
                value={fontSize}
                readOnly
                className="w-full bg-white text-black border-t border-l border-[#808080] border-r border-b border-white px-1 py-0.5 text-xs font-mono"
              />
              <div className="h-[80px] sm:h-[100px] bg-white border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white overflow-y-auto p-1 text-xs">
                {SIZES.map((s) => (
                  <div
                    key={s}
                    onClick={() => setFontSize(s)}
                    className={`px-1 py-0.5 cursor-pointer ${
                      fontSize === s ? 'bg-[#000080] text-white font-bold' : 'hover:bg-blue-50 text-black'
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Color Choices & Preview Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
            {/* Retro Colors */}
            <fieldset className="border border-[#808080] p-2 space-y-2">
              <legend className="text-[11px] px-1 text-black font-semibold">Paleta Windows 3.11</legend>
              <div>
                <label className="block text-[10px] text-gray-800 mb-1">Color de Texto:</label>
                <div className="flex flex-wrap gap-1">
                  {RETRO_PALETTE.map((c) => (
                    <button
                      key={'text-' + c.hex}
                      type="button"
                      onClick={() => setTextColor(c.hex)}
                      title={c.name}
                      style={{ backgroundColor: c.hex }}
                      className={`w-5 h-4 border border-black ${
                        textColor === c.hex ? 'ring-2 ring-blue-600 ring-offset-1' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-800 mb-1">Color de Fondo:</label>
                <div className="flex flex-wrap gap-1">
                  {RETRO_PALETTE.map((c) => (
                    <button
                      key={'bg-' + c.hex}
                      type="button"
                      onClick={() => setBgColor(c.hex)}
                      title={c.name}
                      style={{ backgroundColor: c.hex }}
                      className={`w-5 h-4 border border-black ${
                        bgColor === c.hex ? 'ring-2 ring-blue-600 ring-offset-1' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
            </fieldset>

            {/* Sample Box */}
            <fieldset className="border border-[#808080] p-2 h-full flex flex-col">
              <legend className="text-[11px] px-1 text-black font-semibold">Muestra</legend>
              <div
                className="flex-1 min-h-[60px] sm:min-h-[75px] border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white p-2 flex items-center justify-center text-center overflow-hidden"
                style={{
                  fontFamily,
                  fontSize: `${fontSize}px`,
                  fontWeight: isBold ? 'bold' : 'normal',
                  fontStyle: isItalic ? 'italic' : 'normal',
                  color: textColor,
                  backgroundColor: bgColor,
                }}
              >
                AaBbYyZz 123
              </div>
            </fieldset>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              id="btn-font-accept"
              type="button"
              onClick={handleConfirm}
              className="win3-button font-bold px-4 flex-1 sm:flex-initial"
            >
              Aceptar
            </button>
            <button
              id="btn-font-cancel"
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
