import React, { useState, useEffect } from 'react';
import { CloudFile } from '../../types';
import { CloudStorageManager } from '../../utils/storage';
import { retroAudio } from '../../utils/audio';

interface CloudManagerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFileToOpen: (file: CloudFile) => void;
  onRenameCurrentDoc?: (newFileName: string) => void;
}

export const CloudManagerDialog: React.FC<CloudManagerDialogProps> = ({
  isOpen,
  onClose,
  onSelectFileToOpen,
  onRenameCurrentDoc,
}) => {
  const [files, setFiles] = useState<CloudFile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newFileName, setNewFileName] = useState('NUEVO_DOC.TXT');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const refreshList = () => {
    const list = CloudStorageManager.getAll();
    setFiles(list);
    if (list.length > 0 && !selectedId) {
      setSelectedId(list[0].id);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
      setIsRenaming(false);
      setIsCreatingNew(false);
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedFile = files.find((f) => f.id === selectedId);

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenFile = (file: CloudFile) => {
    retroAudio.play('open');
    onSelectFileToOpen(file);
    onClose();
  };

  const handleStartRename = () => {
    if (!selectedFile) return;
    setRenameValue(selectedFile.name);
    setIsRenaming(true);
    retroAudio.play('click');
  };

  const handleConfirmRename = () => {
    if (!selectedFile || !renameValue.trim()) return;
    const updated = CloudStorageManager.rename(selectedFile.id, renameValue);
    if (updated) {
      retroAudio.play('save');
      refreshList();
      setIsRenaming(false);
      setStatusMessage(`Archivo renombrado a "${updated.name}"`);
      if (onRenameCurrentDoc) {
        onRenameCurrentDoc(updated.name);
      }
    }
  };

  const handleStartCreateNew = () => {
    setNewFileName(`DOCUMENTO_${files.length + 1}.TXT`);
    setIsCreatingNew(true);
    retroAudio.play('click');
  };

  const handleConfirmCreateNew = () => {
    if (!newFileName.trim()) return;
    let clean = newFileName.trim().toUpperCase();
    if (!clean.includes('.')) clean += '.TXT';

    const created = CloudStorageManager.save(clean, '');
    retroAudio.play('save');
    refreshList();
    setSelectedId(created.id);
    setIsCreatingNew(false);
    setStatusMessage(`Documento "${clean}" creado.`);
  };

  const handleDelete = () => {
    if (!selectedFile) return;
    const confirmDel = window.confirm(
      `¿Está seguro de que desea eliminar el archivo "${selectedFile.name}" de la nube?`
    );
    if (confirmDel) {
      CloudStorageManager.delete(selectedFile.id);
      retroAudio.play('stop');
      const updated = CloudStorageManager.getAll();
      setFiles(updated);
      setSelectedId(updated.length > 0 ? updated[0].id : null);
      setStatusMessage(`Archivo eliminado.`);
    }
  };

  const handleDownloadLocal = () => {
    if (!selectedFile) return;
    retroAudio.play('click');
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
    setStatusMessage(`Descargado "${selectedFile.name}" a su disco local.`);
  };

  const handleUploadToCloud = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.log,.ini,.bat,.cfg,.md,.json,*.*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const text = await file.text();
        const created = CloudStorageManager.save(file.name.toUpperCase(), text);
        retroAudio.play('save');
        refreshList();
        setSelectedId(created.id);
        setStatusMessage(`Archivo "${created.name}" subido a la nube.`);
      }
    };
    input.click();
  };

  const handleExportBackup = () => {
    retroAudio.play('click');
    const json = CloudStorageManager.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RESPALDO_NUBE_WIN311_${new Date().toISOString().slice(0, 10)}.JSON`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
  };

  const handleImportBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const count = CloudStorageManager.importJSON(text);
          retroAudio.play('tada');
          refreshList();
          setStatusMessage(`¡Se importaron exitosamente ${count} archivos de la copia de seguridad!`);
        } catch (e: any) {
          retroAudio.play('stop');
          alert('Error al importar el archivo: ' + e.message);
        }
      }
    };
    input.click();
  };

  const totalBytes = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div
      id="dialog-cloud-manager-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 select-none font-sans overflow-y-auto"
    >
      <div
        id="dialog-cloud-manager"
        className="w-full max-w-[760px] h-[92dvh] max-h-[600px] bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-2xl flex flex-col p-1 text-[12px] overflow-hidden"
      >
        {/* Title Bar */}
        <div className="bg-[#000080] text-white px-2 py-1 font-bold flex justify-between items-center text-xs shrink-0">
          <div className="flex items-center gap-1.5 truncate">
            <span>☁ Administrador de Archivos de la Nube</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-4 h-3.5 bg-[#c0c0c0] text-black border-t border-l border-white border-r border-b border-black text-[9px] flex items-center justify-center font-bold shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-[#c0c0c0] p-1.5 flex flex-wrap items-center justify-between gap-1 border-b border-[#808080] shrink-0">
          <div className="flex flex-wrap gap-1 items-center">
            <button
              id="btn-cloud-new-doc"
              type="button"
              onClick={handleStartCreateNew}
              className="win3-button font-bold text-xs"
            >
              📄 Nuevo
            </button>
            <button
              id="btn-cloud-open-editor"
              type="button"
              disabled={!selectedFile}
              onClick={() => selectedFile && handleOpenFile(selectedFile)}
              className="win3-button font-bold text-xs text-blue-900"
            >
              ✏ Abrir
            </button>
            <button
              id="btn-cloud-rename-doc"
              type="button"
              disabled={!selectedFile}
              onClick={handleStartRename}
              className="win3-button text-xs"
            >
              🏷 Renombrar
            </button>
            <button
              id="btn-cloud-delete-doc"
              type="button"
              disabled={!selectedFile}
              onClick={handleDelete}
              className="win3-button text-xs text-red-900"
            >
              🗑 Eliminar
            </button>
            <div className="h-4 w-[1px] bg-[#808080] mx-0.5 hidden sm:block" />
            <button
              id="btn-cloud-download-local"
              type="button"
              disabled={!selectedFile}
              onClick={handleDownloadLocal}
              className="win3-button text-xs"
              title="Guardar archivo seleccionado en el disco duro local"
            >
              💾 Descargar
            </button>
            <button
              id="btn-cloud-upload-local"
              type="button"
              onClick={handleUploadToCloud}
              className="win3-button text-xs"
              title="Subir archivo del disco duro a la nube"
            >
              ⬆ Subir
            </button>
          </div>

          <div className="flex gap-1">
            <button
              id="btn-cloud-backup-export"
              type="button"
              onClick={handleExportBackup}
              className="win3-button text-[11px]"
              title="Exportar copia de seguridad en archivo JSON"
            >
              Respaldo
            </button>
            <button
              id="btn-cloud-backup-import"
              type="button"
              onClick={handleImportBackup}
              className="win3-button text-[11px]"
              title="Importar copia de seguridad JSON"
            >
              Importar
            </button>
          </div>
        </div>

        {/* Search & Stats Bar */}
        <div className="px-2 py-1 bg-white/40 flex flex-wrap items-center justify-between gap-1.5 border-b border-[#808080] text-xs shrink-0">
          <div className="flex items-center gap-1 flex-1 min-w-[200px]">
            <label className="text-black font-semibold">🔍 Filtrar:</label>
            <input
              type="text"
              placeholder="Buscar por nombre o contenido..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white text-black border border-[#808080] px-1.5 py-0.5 text-xs flex-1 max-w-[260px] outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[10px] text-gray-700 underline"
              >
                Limpiar
              </button>
            )}
          </div>
          <div className="text-[10px] sm:text-[11px] text-gray-700 font-mono">
            {files.length} archivos | {(totalBytes / 1024).toFixed(2)} KB
          </div>
        </div>

        {/* Inline Create or Rename Bar */}
        {isCreatingNew && (
          <div className="bg-yellow-100 p-2 border-b-2 border-[#808080] flex flex-wrap items-center gap-2 shrink-0">
            <span className="font-bold text-xs text-black">Nuevo archivo:</span>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmCreateNew();
                if (e.key === 'Escape') setIsCreatingNew(false);
              }}
              className="bg-white text-black border border-black px-1.5 py-0.5 text-xs font-mono font-bold flex-1 min-w-[140px]"
              autoFocus
            />
            <button
              type="button"
              onClick={handleConfirmCreateNew}
              className="win3-button font-bold text-xs"
            >
              Crear
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="win3-button text-xs"
            >
              Cancelar
            </button>
          </div>
        )}

        {isRenaming && selectedFile && (
          <div className="bg-blue-100 p-2 border-b-2 border-[#808080] flex flex-wrap items-center gap-2 shrink-0">
            <span className="font-bold text-xs text-black truncate max-w-[150px]">Renombrar:</span>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmRename();
                if (e.key === 'Escape') setIsRenaming(false);
              }}
              className="bg-white text-black border border-black px-1.5 py-0.5 text-xs font-mono font-bold flex-1 min-w-[140px]"
              autoFocus
            />
            <button
              type="button"
              onClick={handleConfirmRename}
              className="win3-button font-bold text-xs"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setIsRenaming(false)}
              className="win3-button text-xs"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Main Content Area: Split List & Preview */}
        <div className="flex-1 flex flex-col md:flex-row gap-2 p-1.5 sm:p-2 overflow-hidden min-h-0">
          {/* File List (Windows 3.11 File Manager table) */}
          <div className="flex-1 md:w-[55%] flex flex-col bg-white border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white overflow-hidden min-h-[140px]">
            {/* Table Header */}
            <div className="bg-[#c0c0c0] border-b border-[#808080] text-[11px] font-bold text-black flex px-1 py-0.5 select-none shrink-0">
              <div className="w-[50%]">Nombre</div>
              <div className="w-[20%] text-right">Tamaño</div>
              <div className="w-[30%] text-right pr-1">Modificado</div>
            </div>

            {/* Table Rows */}
            <div className="flex-1 overflow-y-auto">
              {filteredFiles.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-xs">
                  No hay archivos que coincidan.
                </div>
              ) : (
                filteredFiles.map((file) => {
                  const isSelected = selectedId === file.id;
                  const dateStr = new Date(file.updatedAt).toLocaleDateString();
                  const sizeKB = (file.size / 1024).toFixed(1);

                  return (
                    <div
                      key={file.id}
                      onClick={() => {
                        setSelectedId(file.id);
                        retroAudio.play('click');
                      }}
                      onDoubleClick={() => handleOpenFile(file)}
                      className={`flex px-1.5 py-1 cursor-pointer text-[11px] font-mono border-b border-gray-100 ${
                        isSelected
                          ? 'bg-[#000080] text-white font-bold'
                          : 'hover:bg-blue-50 text-black'
                      }`}
                    >
                      <div className="w-[50%] flex items-center gap-1 truncate">
                        <span>📄</span>
                        <span className="truncate">{file.name}</span>
                      </div>
                      <div className="w-[20%] text-right">{sizeKB} KB</div>
                      <div className="w-[30%] text-right pr-1 text-[10px] opacity-80">
                        {dateStr}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right/Bottom Pane: Document Preview */}
          <div className="flex-1 md:w-[45%] flex flex-col bg-white border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white overflow-hidden min-h-[120px]">
            <div className="bg-[#c0c0c0] border-b border-[#808080] text-[11px] font-bold px-2 py-0.5 text-black flex justify-between items-center shrink-0">
              <span>Vista previa</span>
              {selectedFile && (
                <span className="font-mono text-[10px] text-blue-900 truncate max-w-[150px]">{selectedFile.name}</span>
              )}
            </div>

            <div className="flex-1 p-2 overflow-auto font-mono text-[11px] text-black bg-[#fcfcfc] whitespace-pre-wrap selection:bg-[#000080] selection:text-white">
              {selectedFile ? (
                selectedFile.content || <em className="text-gray-400">&lt;Archivo vacío&gt;</em>
              ) : (
                <div className="text-gray-400 italic text-center mt-6">
                  Seleccione un archivo para ver su contenido.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Status Message & Close Button */}
        <div className="p-1 flex items-center justify-between border-t border-[#808080] text-xs shrink-0">
          <div className="text-blue-950 font-semibold px-1 truncate max-w-[65%] text-[11px]">
            {statusMessage || 'Haga doble clic en un archivo para abrirlo.'}
          </div>
          <div className="flex gap-1.5">
            {selectedFile && (
              <button
                type="button"
                onClick={() => handleOpenFile(selectedFile)}
                className="win3-button font-bold text-blue-900"
              >
                Abrir
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="win3-button"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
