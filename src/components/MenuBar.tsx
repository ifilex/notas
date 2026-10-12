import React, { useState, useEffect, useRef } from 'react';
import { retroAudio } from '../utils/audio';

interface MenuBarProps {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onSaveCloud: () => void;
  onCloudManager: () => void;
  onRename: () => void;
  onPageSetup: () => void;
  onPrint: () => void;
  onExit: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onSelectAll: () => void;
  onInsertDateTime: () => void;
  wordWrap: boolean;
  onToggleWordWrap: () => void;
  showStatusBar: boolean;
  onToggleStatusBar: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onFind: () => void;
  onFindNext: () => void;
  onReplace: () => void;
  onGoTo: () => void;
  onFontDialog: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onHelpTopics: () => void;
  onAbout: () => void;
  onExportBackup: () => void;
  onImportBackup: () => void;
  onResetCloud: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onNew,
  onOpen,
  onSave,
  onSaveAs,
  onSaveCloud,
  onCloudManager,
  onRename,
  onPageSetup,
  onPrint,
  onExit,
  onUndo,
  onRedo,
  onCut,
  onCopy,
  onPaste,
  onDelete,
  onSelectAll,
  onInsertDateTime,
  wordWrap,
  onToggleWordWrap,
  showStatusBar,
  onToggleStatusBar,
  soundEnabled,
  onToggleSound,
  onFind,
  onFindNext,
  onReplace,
  onGoTo,
  onFontDialog,
  onZoomIn,
  onZoomOut,
  onHelpTopics,
  onAbout,
  onExportBackup,
  onImportBackup,
  onResetCloud,
  canUndo,
  canRedo,
  hasSelection,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent | TouchEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    window.addEventListener('mousedown', handleGlobalClick);
    window.addEventListener('touchstart', handleGlobalClick);
    return () => {
      window.removeEventListener('mousedown', handleGlobalClick);
      window.removeEventListener('touchstart', handleGlobalClick);
    };
  }, []);

  const handleMenuClick = (menuKey: string) => {
    retroAudio.play('click');
    setActiveMenu(activeMenu === menuKey ? null : menuKey);
  };

  const handleMenuHover = (menuKey: string) => {
    if (activeMenu !== null && activeMenu !== menuKey) {
      setActiveMenu(menuKey);
    }
  };

  const closeAndRun = (action: () => void) => {
    retroAudio.play('click');
    setActiveMenu(null);
    action();
  };

  return (
    <div
      ref={menuBarRef}
      id="notepad-menubar"
      className="bg-[#c0c0c0] text-black border-b border-[#808080] select-none text-[12px] flex items-center px-1 h-[28px] sm:h-[24px] relative z-40 whitespace-nowrap"
    >
      {/* Invisible backdrop when a menu is open for mobile / outside tap */}
      {activeMenu !== null && (
        <div
          id="menu-backdrop-overlay"
          onClick={() => setActiveMenu(null)}
          className="fixed inset-0 z-40 bg-transparent"
        />
      )}

      {/* Archivo */}
      <div className="relative inline-block z-50">
        <button
          id="menu-archivo"
          type="button"
          onClick={() => handleMenuClick('archivo')}
          onMouseEnter={() => handleMenuHover('archivo')}
          className={`px-2.5 sm:px-2 py-1.5 sm:py-0.5 hover:bg-[#000080] hover:text-white cursor-pointer focus:outline-none transition-colors ${
            activeMenu === 'archivo' ? 'bg-[#000080] text-white' : ''
          }`}
        >
          <span className="underline font-semibold sm:font-normal">A</span>rchivo
        </button>

        {activeMenu === 'archivo' && (
          <div
            id="dropdown-archivo"
            className="absolute left-0 top-[27px] sm:top-[23px] bg-[#c0c0c0] text-black border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-xl min-w-[220px] max-w-[calc(100vw-20px)] py-1 z-50 text-[12px]"
          >
            <div
              id="menu-item-new"
              onClick={() => closeAndRun(onNew)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span><span className="underline">N</span>uevo</span>
              <span className="text-gray-600 group-hover:text-white text-[11px] ml-4">Ctrl+N</span>
            </div>
            <div
              id="menu-item-open"
              onClick={() => closeAndRun(onOpen)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span><span className="underline">A</span>brir...</span>
              <span className="text-gray-600 text-[11px] ml-4">Ctrl+O</span>
            </div>
            <div
              id="menu-item-save"
              onClick={() => closeAndRun(onSave)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer active:bg-[#000080] active:text-white font-semibold"
            >
              <span><span className="underline">G</span>uardar</span>
              <span className="text-gray-600 text-[11px] ml-4">Ctrl+S</span>
            </div>
            <div
              id="menu-item-saveas"
              onClick={() => closeAndRun(onSaveAs)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white cursor-pointer active:bg-[#000080] active:text-white"
            >
              Guardar co<span className="underline">m</span>o...
            </div>

            <div className="border-t border-[#808080] border-b border-white my-1" />

            <div
              id="menu-item-save-cloud"
              onClick={() => closeAndRun(onSaveCloud)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer text-blue-900 active:bg-[#000080] active:text-white font-semibold"
            >
              <span>Guardar en la <span className="underline">N</span>ube...</span>
              <span>☁</span>
            </div>
            <div
              id="menu-item-cloud-manager"
              onClick={() => closeAndRun(onCloudManager)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span>Ad<span className="underline">m</span>inistrador de la nube...</span>
              <span>📁</span>
            </div>

            <div className="border-t border-[#808080] border-b border-white my-1" />

            <div
              id="menu-item-pagesetup"
              onClick={() => closeAndRun(onPageSetup)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white cursor-pointer active:bg-[#000080] active:text-white"
            >
              Configurar <span className="underline">p</span>ágina...
            </div>
            <div
              id="menu-item-print"
              onClick={() => closeAndRun(onPrint)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span><span className="underline">I</span>mprimir...</span>
              <span className="text-gray-600 text-[11px] ml-4">Ctrl+P</span>
            </div>

            <div className="border-t border-[#808080] border-b border-white my-1" />

            <div
              id="menu-item-exit"
              onClick={() => closeAndRun(onExit)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span><span className="underline">S</span>alir</span>
              <span className="text-gray-600 text-[11px] ml-4">Ctrl+Q</span>
            </div>
          </div>
        )}
      </div>

      {/* Edición */}
      <div className="relative inline-block z-50">
        <button
          id="menu-edicion"
          type="button"
          onClick={() => handleMenuClick('edicion')}
          onMouseEnter={() => handleMenuHover('edicion')}
          className={`px-2.5 sm:px-2 py-1.5 sm:py-0.5 hover:bg-[#000080] hover:text-white cursor-pointer focus:outline-none transition-colors ${
            activeMenu === 'edicion' ? 'bg-[#000080] text-white' : ''
          }`}
        >
          <span className="underline font-semibold sm:font-normal">E</span>dición
        </button>

        {activeMenu === 'edicion' && (
          <div
            id="dropdown-edicion"
            className="absolute left-0 sm:left-0 top-[27px] sm:top-[23px] bg-[#c0c0c0] text-black border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-xl min-w-[220px] max-w-[calc(100vw-20px)] py-1 z-50 text-[12px]"
          >
            <div
              id="menu-item-undo"
              onClick={() => {
                if (canUndo) closeAndRun(onUndo);
              }}
              className={`px-3 sm:px-4 py-2 sm:py-1 flex justify-between items-center ${
                canUndo
                  ? 'hover:bg-[#000080] hover:text-white cursor-pointer active:bg-[#000080] active:text-white'
                  : 'text-gray-500 cursor-default'
              }`}
            >
              <span><span className="underline">D</span>eshacer</span>
              <span className="text-gray-600 text-[11px] ml-4">Ctrl+Z</span>
            </div>
            <div
              id="menu-item-redo"
              onClick={() => {
                if (canRedo) closeAndRun(onRedo);
              }}
              className={`px-3 sm:px-4 py-2 sm:py-1 flex justify-between items-center ${
                canRedo
                  ? 'hover:bg-[#000080] hover:text-white cursor-pointer active:bg-[#000080] active:text-white'
                  : 'text-gray-500 cursor-default'
              }`}
            >
              <span><span className="underline">R</span>ehacer</span>
              <span className="text-gray-600 text-[11px] ml-4">Ctrl+Y</span>
            </div>

            <div className="border-t border-[#808080] border-b border-white my-1" />

            <div
              id="menu-item-cut"
              onClick={() => closeAndRun(onCut)}
              className={`px-3 sm:px-4 py-2 sm:py-1 flex justify-between items-center ${
                hasSelection ? 'hover:bg-[#000080] hover:text-white cursor-pointer' : 'hover:bg-[#000080] hover:text-white cursor-pointer'
              }`}
            >
              <span>Cor<span className="underline">t</span>ar</span>
              <span className="text-gray-600 text-[11px] ml-4">Ctrl+X</span>
            </div>
            <div
              id="menu-item-copy"
              onClick={() => closeAndRun(onCopy)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span><span className="underline">C</span>opiar</span>
              <span className="text-gray-600 text-[11px] ml-4">Ctrl+C</span>
            </div>
            <div
              id="menu-item-paste"
              onClick={() => closeAndRun(onPaste)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span><span className="underline">P</span>egar</span>
              <span className="text-gray-600 text-[11px] ml-4">Ctrl+V</span>
            </div>
            <div
              id="menu-item-delete"
              onClick={() => closeAndRun(onDelete)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span><span className="underline">E</span>liminar</span>
              <span className="text-gray-600 text-[11px] ml-4">Supr</span>
            </div>

            <div className="border-t border-[#808080] border-b border-white my-1" />

            <div
              id="menu-item-selectall"
              onClick={() => closeAndRun(onSelectAll)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span>Seleccionar <span className="underline">t</span>odo</span>
              <span className="text-gray-600 text-[11px] ml-4">Ctrl+A</span>
            </div>
            <div
              id="menu-item-datetime"
              onClick={() => closeAndRun(onInsertDateTime)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer active:bg-[#000080] active:text-white font-semibold text-blue-950"
            >
              <span><span className="underline">H</span>ora/Fecha</span>
              <span className="text-gray-600 text-[11px] ml-4">F5</span>
            </div>
          </div>
        )}
      </div>

      {/* Buscar */}
      <div className="relative inline-block z-50">
        <button
          id="menu-buscar"
          type="button"
          onClick={() => handleMenuClick('buscar')}
          onMouseEnter={() => handleMenuHover('buscar')}
          className={`px-2.5 sm:px-2 py-1.5 sm:py-0.5 hover:bg-[#000080] hover:text-white cursor-pointer focus:outline-none transition-colors ${
            activeMenu === 'buscar' ? 'bg-[#000080] text-white' : ''
          }`}
        >
          <span className="underline font-semibold sm:font-normal">B</span>uscar
        </button>

        {activeMenu === 'buscar' && (
          <div
            id="dropdown-buscar"
            className="absolute left-0 sm:left-0 top-[27px] sm:top-[23px] bg-[#c0c0c0] text-black border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-xl min-w-[210px] max-w-[calc(100vw-20px)] py-1 z-50 text-[12px]"
          >
            <div
              id="menu-item-find"
              onClick={() => closeAndRun(onFind)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span><span className="underline">B</span>uscar...</span>
              <span className="text-gray-600 text-[11px] ml-4">Ctrl+F</span>
            </div>
            <div
              id="menu-item-findnext"
              onClick={() => closeAndRun(onFindNext)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span>Buscar <span className="underline">s</span>iguiente</span>
              <span className="text-gray-600 text-[11px] ml-4">F3</span>
            </div>
            <div
              id="menu-item-replace"
              onClick={() => closeAndRun(onReplace)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span><span className="underline">R</span>eemplazar...</span>
              <span className="text-gray-600 text-[11px] ml-4">Ctrl+H</span>
            </div>
            <div
              id="menu-item-goto"
              onClick={() => closeAndRun(onGoTo)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span><span className="underline">I</span>r a la línea...</span>
              <span className="text-gray-600 text-[11px] ml-4">Ctrl+G</span>
            </div>
          </div>
        )}
      </div>

      {/* Nube */}
      <div className="relative inline-block z-50">
        <button
          id="menu-nube"
          type="button"
          onClick={() => handleMenuClick('nube')}
          onMouseEnter={() => handleMenuHover('nube')}
          className={`px-2.5 sm:px-2 py-1.5 sm:py-0.5 hover:bg-[#000080] hover:text-white cursor-pointer focus:outline-none transition-colors ${
            activeMenu === 'nube' ? 'bg-[#000080] text-white' : ''
          }`}
        >
          <span className="underline font-semibold sm:font-normal">N</span>ube
        </button>

        {activeMenu === 'nube' && (
          <div
            id="dropdown-nube"
            className="absolute left-0 sm:left-0 top-[27px] sm:top-[23px] bg-[#c0c0c0] text-black border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-xl min-w-[240px] max-w-[calc(100vw-20px)] py-1 z-50 text-[12px]"
          >
            <div
              id="menu-item-cloud-new"
              onClick={() => closeAndRun(onNew)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span className="underline">N</span>uevo archivo en la nube
            </div>
            <div
              id="menu-item-cloud-open"
              onClick={() => closeAndRun(onCloudManager)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer active:bg-[#000080] active:text-white font-semibold"
            >
              <span><span className="underline">E</span>xplorador de la nube...</span>
              <span>📁</span>
            </div>
            <div
              id="menu-item-cloud-save"
              onClick={() => closeAndRun(onSaveCloud)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span className="underline">G</span>uardar archivo actual en la nube
            </div>
            <div
              id="menu-item-cloud-rename"
              onClick={() => closeAndRun(onRename)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span className="underline">C</span>ambiar nombre de archivo...
            </div>

            <div className="border-t border-[#808080] border-b border-white my-1" />

            <div
              id="menu-item-cloud-export"
              onClick={() => closeAndRun(onExportBackup)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white cursor-pointer active:bg-[#000080] active:text-white"
            >
              E<span className="underline">x</span>portar respaldo de nube (JSON)...
            </div>
            <div
              id="menu-item-cloud-import"
              onClick={() => closeAndRun(onImportBackup)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span className="underline">I</span>mportar respaldo de nube...
            </div>
            <div
              id="menu-item-cloud-reset"
              onClick={() => closeAndRun(onResetCloud)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white cursor-pointer text-red-900 active:bg-[#000080] active:text-white"
            >
              Restablecer archivos de ejemplo
            </div>
          </div>
        )}
      </div>

      {/* Formato / Ver */}
      <div className="relative inline-block z-50">
        <button
          id="menu-formato"
          type="button"
          onClick={() => handleMenuClick('formato')}
          onMouseEnter={() => handleMenuHover('formato')}
          className={`px-2.5 sm:px-2 py-1.5 sm:py-0.5 hover:bg-[#000080] hover:text-white cursor-pointer focus:outline-none transition-colors ${
            activeMenu === 'formato' ? 'bg-[#000080] text-white' : ''
          }`}
        >
          <span className="underline font-semibold sm:font-normal">F</span>ormato
        </button>

        {activeMenu === 'formato' && (
          <div
            id="dropdown-formato"
            className="absolute left-auto right-0 sm:right-auto sm:left-0 top-[27px] sm:top-[23px] bg-[#c0c0c0] text-black border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-xl min-w-[220px] max-w-[calc(100vw-20px)] py-1 z-50 text-[12px]"
          >
            <div
              id="menu-item-font"
              onClick={() => closeAndRun(onFontDialog)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white cursor-pointer active:bg-[#000080] active:text-white font-semibold"
            >
              <span className="underline">F</span>uente y tamaño...
            </div>
            <div
              id="menu-item-format-wrap"
              onClick={() => closeAndRun(onToggleWordWrap)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex items-center justify-between cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span><span className="underline">A</span>juste de línea</span>
              {wordWrap && <span className="font-bold text-blue-900">✓</span>}
            </div>
            <div
              id="menu-item-format-status"
              onClick={() => closeAndRun(onToggleStatusBar)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex items-center justify-between cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span>Barra de <span className="underline">e</span>stado</span>
              {showStatusBar && <span className="font-bold text-blue-900">✓</span>}
            </div>

            <div className="border-t border-[#808080] border-b border-white my-1" />

            <div
              id="menu-item-zoomin"
              onClick={() => closeAndRun(onZoomIn)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span>Aumentar tamaño de letra</span>
              <span className="font-mono font-bold text-xs">A+</span>
            </div>
            <div
              id="menu-item-zoomout"
              onClick={() => closeAndRun(onZoomOut)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span>Disminuir tamaño de letra</span>
              <span className="font-mono font-bold text-xs">A-</span>
            </div>

            <div className="border-t border-[#808080] border-b border-white my-1" />

            <div
              id="menu-item-format-sound"
              onClick={() => closeAndRun(onToggleSound)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex items-center justify-between cursor-pointer active:bg-[#000080] active:text-white"
            >
              <span><span className="underline">S</span>onidos retro (PC Audio)</span>
              {soundEnabled && <span className="font-bold text-blue-900">✓</span>}
            </div>
          </div>
        )}
      </div>

      {/* Ayuda */}
      <div className="relative inline-block z-50">
        <button
          id="menu-ayuda"
          type="button"
          onClick={() => handleMenuClick('ayuda')}
          onMouseEnter={() => handleMenuHover('ayuda')}
          className={`px-2.5 sm:px-2 py-1.5 sm:py-0.5 hover:bg-[#000080] hover:text-white cursor-pointer focus:outline-none transition-colors ${
            activeMenu === 'ayuda' ? 'bg-[#000080] text-white' : ''
          }`}
        >
          A<span className="underline font-semibold sm:font-normal">y</span>uda
        </button>

        {activeMenu === 'ayuda' && (
          <div
            id="dropdown-ayuda"
            className="absolute left-auto right-0 sm:right-auto sm:left-0 top-[27px] sm:top-[23px] bg-[#c0c0c0] text-black border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-xl min-w-[220px] max-w-[calc(100vw-20px)] py-1 z-50 text-[12px]"
          >
            <div
              id="menu-item-help-topics"
              onClick={() => closeAndRun(onHelpTopics)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center cursor-pointer active:bg-[#000080] active:text-white font-semibold text-green-950"
            >
              <span><span className="underline">C</span>ontenido de la ayuda</span>
              <span className="text-gray-600 text-[11px] ml-4">F1</span>
            </div>

            <div className="border-t border-[#808080] border-b border-white my-1" />

            <div
              id="menu-item-about"
              onClick={() => closeAndRun(onAbout)}
              className="px-3 sm:px-4 py-2 sm:py-1 hover:bg-[#000080] hover:text-white cursor-pointer active:bg-[#000080] active:text-white"
            >
              A<span className="underline">c</span>erca del Bloc de notas...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
