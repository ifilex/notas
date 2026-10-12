import React from 'react';
import { retroAudio } from '../../utils/audio';

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutDialog: React.FC<AboutDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="dialog-about-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 select-none font-sans overflow-y-auto"
    >
      <div
        id="dialog-about"
        className="w-full max-w-[420px] max-h-[94dvh] bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-2xl p-1 text-[12px] overflow-y-auto"
      >
        {/* Title Bar */}
        <div className="bg-[#000080] text-white px-2 py-0.5 font-bold flex justify-between items-center text-xs shrink-0">
          <span>Acerca del Bloc de notas</span>
          <button
            type="button"
            onClick={onClose}
            className="w-4 h-3.5 bg-[#c0c0c0] text-black border-t border-l border-white border-r border-b border-black text-[9px] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Header with Windows 3.1 Flag */}
          <div className="flex gap-4 items-center border-b border-[#808080] pb-3">
            {/* Pixelated Windows Flag Icon */}
            <div className="w-12 h-12 flex flex-col justify-center items-center bg-black p-1 border border-white">
              <div className="grid grid-cols-2 gap-0.5 w-8 h-8 rotate-[-6deg]">
                <div className="bg-[#ff0000] border border-black" />
                <div className="bg-[#00ff00] border border-black" />
                <div className="bg-[#0000ff] border border-black" />
                <div className="bg-[#ffff00] border border-black" />
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-black font-sans leading-tight">
                Microsoft Windows
              </h2>
              <p className="text-xs text-gray-800 font-semibold">
                Bloc de notas - Windows para Trabajo en Grupo 3.11
              </p>
              <p className="text-[11px] text-gray-600">
                Versión 3.11.0.40 - Edición Nube y Disco Local
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                Copyright © 1985-1993 Microsoft Corporation
              </p>
            </div>
          </div>

          {/* User Registration & Memory Specs */}
          <div className="space-y-2 text-[11px] text-black">
            <div>
              <p className="text-gray-600">Este producto tiene licencia para:</p>
              <p className="font-bold pl-2">Usuario de Windows 3.11</p>
              <p className="font-mono text-gray-700 pl-2">Cloud Workstation Pro</p>
            </div>

            <div className="border-t border-[#808080] pt-2 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-700">Modo de ejecución:</span>
                <span className="font-semibold">Modo mejorado 386</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Memoria libre de Windows:</span>
                <span className="font-mono font-semibold">15,820 KB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Recursos del sistema:</span>
                <span className="font-mono font-semibold text-green-800">86% libres</span>
              </div>
            </div>
          </div>

          {/* OK Button */}
          <div className="flex justify-center pt-2">
            <button
              id="btn-about-ok"
              type="button"
              onClick={() => {
                retroAudio.play('click');
                onClose();
              }}
              className="win3-button font-bold min-w-[80px]"
              autoFocus
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
