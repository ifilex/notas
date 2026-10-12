import React, { useState } from 'react';
import { retroAudio } from '../../utils/audio';
import { SoundEffect } from '../../types';

interface SoundSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const SOUND_LIST: { id: SoundEffect; label: string; file: string }[] = [
  { id: 'tada', label: 'Inicio de Windows (TADA)', file: 'TADA.WAV' },
  { id: 'ding', label: 'Campana de notificación (DING)', file: 'DING.WAV' },
  { id: 'chord', label: 'Acorde polifónico (CHORD)', file: 'CHORD.WAV' },
  { id: 'chimes', label: 'Campanillas brillantes (CHIMES)', file: 'CHIMES.WAV' },
  { id: 'stop', label: 'Detención crítica / Error (STOP)', file: 'STOP.WAV' },
  { id: 'asterisk', label: 'Información / Asterisco', file: 'ASTERISK.WAV' },
];

export const SoundSettingsDialog: React.FC<SoundSettingsDialogProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
}) => {
  const [selectedSound, setSelectedSound] = useState<SoundEffect>('tada');

  if (!isOpen) return null;

  const handleTestSound = () => {
    retroAudio.play(selectedSound);
  };

  return (
    <div
      id="dialog-sound-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 select-none font-sans overflow-y-auto"
    >
      <div
        id="dialog-sound"
        className="w-full max-w-[440px] max-h-[94dvh] bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-2xl p-1 text-[12px] overflow-y-auto"
      >
        {/* Title Bar */}
        <div className="bg-[#000080] text-white px-2 py-0.5 font-bold flex justify-between items-center text-xs shrink-0">
          <span>Panel de Control - Sonido</span>
          <button
            type="button"
            onClick={onClose}
            className="w-4 h-3.5 bg-[#c0c0c0] text-black border-t border-l border-white border-r border-b border-black text-[9px] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-2.5 sm:p-3 space-y-3">
          {/* Enable/Disable checkbox */}
          <div className="border border-[#808080] p-2 bg-white/40">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-black">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={onToggleSound}
                className="accent-[#000080]"
              />
              <span>Habilitar efectos de audio clásicos de Windows 3.11</span>
            </label>
          </div>

          {/* Sound Events & Test list */}
          <div className="space-y-1">
            <label className="block text-black font-semibold">
              Eventos y archivos de sonido:
            </label>
            <div className="h-[130px] bg-white border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white overflow-y-auto p-1 font-mono text-xs">
              {SOUND_LIST.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSelectedSound(s.id);
                    retroAudio.play(s.id);
                  }}
                  className={`px-2 py-1 cursor-pointer flex justify-between items-center ${
                    selectedSound === s.id
                      ? 'bg-[#000080] text-white font-bold'
                      : 'hover:bg-blue-50 text-black'
                  }`}
                >
                  <span className="truncate">{s.label}</span>
                  <span className="text-[10px] opacity-75 font-sans">[{s.file}]</span>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-2">
            <button
              id="btn-sound-test"
              type="button"
              onClick={handleTestSound}
              className="win3-button font-bold text-blue-900"
            >
              ▶ Probar Sonido
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  retroAudio.play('click');
                  onClose();
                }}
                className="win3-button font-bold min-w-[70px]"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
