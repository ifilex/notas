import React, { useState, useEffect } from 'react';
import { SearchOptions } from '../../types';
import { retroAudio } from '../../utils/audio';

interface FindReplaceDialogProps {
  isOpen: boolean;
  mode: 'find' | 'replace';
  initialSearchText?: string;
  onClose: () => void;
  onFindNext: (options: SearchOptions) => boolean;
  onReplaceCurrent: (options: SearchOptions) => boolean;
  onReplaceAll: (options: SearchOptions) => number;
}

export const FindReplaceDialog: React.FC<FindReplaceDialogProps> = ({
  isOpen,
  mode,
  initialSearchText = '',
  onClose,
  onFindNext,
  onReplaceCurrent,
  onReplaceAll,
}) => {
  const [findText, setFindText] = useState(initialSearchText);
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialSearchText) setFindText(initialSearchText);
      setStatus(null);
    }
  }, [isOpen, initialSearchText]);

  if (!isOpen) return null;

  const currentOptions: SearchOptions = {
    findText,
    replaceText,
    matchCase,
    direction,
    wrapAround: true,
  };

  const handleFind = () => {
    if (!findText) return;
    const found = onFindNext(currentOptions);
    if (!found) {
      retroAudio.play('stop');
      setStatus(`No se encuentra "${findText}"`);
    } else {
      retroAudio.play('click');
      setStatus(null);
    }
  };

  const handleReplace = () => {
    if (!findText) return;
    const success = onReplaceCurrent(currentOptions);
    if (success) {
      retroAudio.play('save');
      setStatus('Texto reemplazado.');
    } else {
      retroAudio.play('stop');
      setStatus(`No se encuentra "${findText}"`);
    }
  };

  const handleReplaceAllClick = () => {
    if (!findText) return;
    const count = onReplaceAll(currentOptions);
    retroAudio.play('chord');
    setStatus(`Se reemplazaron ${count} ocurrencias.`);
  };

  return (
    <div
      id="dialog-findreplace-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/30 select-none font-sans overflow-y-auto"
    >
      <div
        id="dialog-findreplace"
        className="w-full max-w-[450px] max-h-[94dvh] bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-2xl p-1 text-[12px] overflow-y-auto"
      >
        {/* Title Bar */}
        <div className="bg-[#000080] text-white px-2 py-0.5 font-bold flex justify-between items-center text-xs shrink-0">
          <span>{mode === 'replace' ? 'Reemplazar' : 'Buscar'}</span>
          <button
            type="button"
            onClick={onClose}
            className="w-4 h-3.5 bg-[#c0c0c0] text-black border-t border-l border-white border-r border-b border-black text-[9px] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-2.5 sm:p-3 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-2">
              {/* Find what */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <label className="w-[85px] text-black shrink-0">
                  <span className="underline">B</span>uscar:
                </label>
                <input
                  id="input-find-text"
                  type="text"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleFind();
                    if (e.key === 'Escape') onClose();
                  }}
                  className="flex-1 bg-white text-black border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white px-1.5 py-0.5 outline-1 outline-black"
                  autoFocus
                />
              </div>

              {/* Replace with (if mode === 'replace') */}
              {mode === 'replace' && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <label className="w-[85px] text-black shrink-0">
                    Reemplazar:
                  </label>
                  <input
                    id="input-replace-text"
                    type="text"
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleReplace();
                    }}
                    className="flex-1 bg-white text-black border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white px-1.5 py-0.5 outline-1 outline-black"
                  />
                </div>
              )}

              {/* Checkboxes & Direction */}
              <div className="pt-2 flex flex-wrap items-start justify-between gap-2">
                <label className="flex items-center gap-2 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={matchCase}
                    onChange={(e) => setMatchCase(e.target.checked)}
                    className="accent-[#000080]"
                  />
                  <span>Coincidir <span className="underline">m</span>ayúsculas</span>
                </label>

                {/* Direction box */}
                <fieldset className="border border-[#808080] p-1.5 pt-0">
                  <legend className="text-[11px] px-1 text-black">Dirección</legend>
                  <div className="flex gap-2 text-[11px]">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="search-dir"
                        checked={direction === 'up'}
                        onChange={() => setDirection('up')}
                        className="accent-[#000080]"
                      />
                      <span>A<span className="underline">r</span>riba</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="search-dir"
                        checked={direction === 'down'}
                        onChange={() => setDirection('down')}
                        className="accent-[#000080]"
                      />
                      <span>A<span className="underline">b</span>ajo</span>
                    </label>
                  </div>
                </fieldset>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex sm:flex-col flex-row flex-wrap gap-1.5 sm:w-[110px]">
              <button
                id="btn-find-next"
                type="button"
                onClick={handleFind}
                disabled={!findText}
                className="win3-button font-bold text-center flex-1 sm:flex-initial"
              >
                Buscar
              </button>

              {mode === 'replace' && (
                <>
                  <button
                    id="btn-replace-current"
                    type="button"
                    onClick={handleReplace}
                    disabled={!findText}
                    className="win3-button text-center flex-1 sm:flex-initial"
                  >
                    Reemplazar
                  </button>
                  <button
                    id="btn-replace-all"
                    type="button"
                    onClick={handleReplaceAllClick}
                    disabled={!findText}
                    className="win3-button text-center flex-1 sm:flex-initial"
                  >
                    Reemplazar todo
                  </button>
                </>
              )}

              <button
                id="btn-find-cancel"
                type="button"
                onClick={onClose}
                className="win3-button text-center flex-1 sm:flex-initial"
              >
                Cancelar
              </button>
            </div>
          </div>

          {/* Feedback message */}
          {status && (
            <div className="bg-yellow-50 border border-[#808080] p-1 text-[11px] text-red-900 font-semibold text-center">
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
