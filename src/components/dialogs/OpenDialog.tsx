import React, { useState, useEffect } from 'react';
import { CloudFile } from '../../types';
import { CloudStorageManager } from '../../utils/storage';
import { retroAudio } from '../../utils/audio';

interface OpenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCloudFile: (file: CloudFile) => void;
  onOpenLocalFile: () => void;
}

export const OpenDialog: React.FC<OpenDialogProps> = ({
  isOpen,
  onClose,
  onOpenCloudFile,
  onOpenLocalFile,
}) => {
  const [cloudFiles, setCloudFiles] = useState<CloudFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [selectedDrive, setSelectedDrive] = useState<'c:' | 'cloud:'>('cloud:');
  const [fileNameInput, setFileNameInput] = useState('*.TXT');
  const [fileType, setFileType] = useState('*.TXT');
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const files = CloudStorageManager.getAll();
      setCloudFiles(files);
      if (files.length > 0) {
        setSelectedFileId(files[0].id);
        setFileNameInput(files[0].name);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = (file: CloudFile) => {
    setSelectedFileId(file.id);
    setFileNameInput(file.name);
    retroAudio.play('click');
  };

  const handleConfirm = () => {
    if (selectedDrive === 'c:') {
      onClose();
      onOpenLocalFile();
      return;
    }

    const target = cloudFiles.find(
      (f) => f.id === selectedFileId || f.name.toLowerCase() === fileNameInput.trim().toLowerCase()
    );
    if (target) {
      retroAudio.play('open');
      onOpenCloudFile(target);
      onClose();
    } else {
      retroAudio.play('stop');
      alert(`No se encontró el archivo "${fileNameInput}" en la unidad virtual de la nube.`);
    }
  };

  return (
    <div
      id="dialog-open-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 select-none font-sans overflow-y-auto"
    >
      <div
        id="dialog-open"
        className="w-full max-w-[490px] max-h-[94dvh] flex flex-col bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-2xl p-1 text-[12px] overflow-y-auto"
      >
        {/* Title Bar */}
        <div className="bg-[#000080] text-white px-2 py-0.5 font-bold flex justify-between items-center text-xs shrink-0">
          <span>Abrir</span>
          <button
            type="button"
            onClick={onClose}
            className="w-4 h-3.5 bg-[#c0c0c0] text-black border-t border-l border-white border-r border-b border-black text-[9px] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-2.5 sm:p-3 space-y-3">
          {/* Top Row: File Name Input & Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex-1 space-y-1">
              <label className="block text-black font-semibold">
                Nombre de <span className="underline">a</span>rchivo:
              </label>
              <input
                id="input-open-filename"
                type="text"
                value={fileNameInput}
                onChange={(e) => setFileNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirm();
                  if (e.key === 'Escape') onClose();
                }}
                className="w-full bg-white text-black border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white px-1.5 py-0.5 outline-1 outline-black"
                autoFocus
              />
            </div>

            {/* Action Buttons Column */}
            <div className="flex sm:flex-col flex-row flex-wrap gap-1.5 sm:w-[110px]">
              <button
                id="btn-open-accept"
                type="button"
                onClick={handleConfirm}
                className="win3-button font-bold text-center flex-1 sm:flex-initial"
              >
                Aceptar
              </button>
              <button
                id="btn-open-cancel"
                type="button"
                onClick={() => {
                  retroAudio.play('click');
                  onClose();
                }}
                className="win3-button text-center flex-1 sm:flex-initial"
              >
                Cancelar
              </button>
              <button
                id="btn-open-local-disk"
                type="button"
                onClick={() => {
                  retroAudio.play('click');
                  onClose();
                  onOpenLocalFile();
                }}
                title="Abrir archivo desde el disco duro de este equipo"
                className="win3-button text-center text-blue-900 font-bold w-full sm:w-auto"
              >
                Disco local...
              </button>
            </div>
          </div>

          {/* Middle Row: Files List & Directories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Files List */}
            <div className="space-y-1">
              <label className="block text-black">
                <span className="underline">A</span>rchivos:
              </label>
              <div
                id="listbox-open-files"
                className="h-[110px] sm:h-[130px] bg-white border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white overflow-y-auto p-1 text-[11px]"
              >
                {selectedDrive === 'cloud:' ? (
                  cloudFiles.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => handleFileSelect(file)}
                      onDoubleClick={handleConfirm}
                      className={`px-1.5 py-0.5 cursor-pointer flex justify-between items-center truncate ${
                        selectedFileId === file.id
                          ? 'bg-[#000080] text-white'
                          : 'hover:bg-blue-100 text-black'
                      }`}
                    >
                      <span className="font-mono">{file.name}</span>
                      <span className="text-[10px] opacity-75">{Math.round(file.size / 1024 * 10) / 10 || 1} KB</span>
                    </div>
                  ))
                ) : (
                  <div
                    onClick={() => {
                      onClose();
                      onOpenLocalFile();
                    }}
                    className="p-2 text-center text-gray-600 cursor-pointer hover:bg-blue-100"
                  >
                    📂 Haga clic para examinar archivos locales del equipo...
                  </div>
                )}
              </div>
            </div>

            {/* Directories Tree */}
            <div className="space-y-1">
              <label className="block text-black">
                <span className="underline">D</span>irectorios:
              </label>
              <div
                id="listbox-open-dirs"
                className="h-[110px] sm:h-[130px] bg-white border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white overflow-y-auto p-1 font-mono text-[11px]"
              >
                <div className="font-bold text-black">
                  {selectedDrive === 'cloud:' ? 'cloud:\\' : 'c:\\'}
                </div>
                <div className="pl-3 text-gray-800">
                  <div>📁 [..]</div>
                  <div className="font-semibold text-blue-900">
                    📂 {selectedDrive === 'cloud:' ? 'documentos_nube' : 'windows'}
                  </div>
                  <div className="pl-3 text-gray-600">
                    <div>📁 system</div>
                    <div>📁 config</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: List Files of Type & Drives Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="block text-black">
                Lista de tipo de archivos:
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full bg-white text-black border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white px-1 py-0.5 text-xs outline-none"
              >
                <option value="*.TXT">Archivos de texto (*.TXT)</option>
                <option value="*.LOG;*.INI">Archivos de sistema (*.LOG;*.INI)</option>
                <option value="*.*">Todos los archivos (*.*)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-black">
                <span className="underline">U</span>nidades:
              </label>
              <select
                id="select-open-drive"
                value={selectedDrive}
                onChange={(e) => {
                  const val = e.target.value as 'c:' | 'cloud:';
                  setSelectedDrive(val);
                  retroAudio.play('click');
                }}
                className="w-full bg-white text-black border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white px-1 py-0.5 text-xs outline-none font-mono font-bold text-blue-900"
              >
                <option value="cloud:">☁ [-cloud-] Nube Virtual (Recomendado)</option>
                <option value="c:">💾 [-c-] Disco Local del Equipo</option>
              </select>
            </div>
          </div>

          {/* Read-only Option */}
          <div className="pt-1 flex items-center gap-2">
            <input
              type="checkbox"
              id="chk-read-only"
              checked={isReadOnly}
              onChange={(e) => setIsReadOnly(e.target.checked)}
              className="accent-[#000080]"
            />
            <label htmlFor="chk-read-only" className="text-black text-xs cursor-pointer">
              Sólo <span className="underline">l</span>ectura
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
