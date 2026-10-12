import React from 'react';
import { retroAudio } from '../utils/audio';

interface QuickToolbarProps {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onCloudManager: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onFind: () => void;
  onReplace: () => void;
  onFontDialog: () => void;
  onInsertDateTime: () => void;
  wordWrap: boolean;
  onToggleWordWrap: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPrint: () => void;
  onHelp: () => void;
}

export const QuickToolbar: React.FC<QuickToolbarProps> = ({
  onNew,
  onOpen,
  onSave,
  onCloudManager,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onFind,
  onReplace,
  onFontDialog,
  onInsertDateTime,
  wordWrap,
  onToggleWordWrap,
  onZoomIn,
  onZoomOut,
  onPrint,
  onHelp,
}) => {
  return (
    <div
      id="notepad-quick-toolbar"
      className="bg-[#c0c0c0] px-1.5 py-1 border-b border-[#808080] flex items-center gap-1 overflow-x-auto select-none shrink-0 shadow-[inset_0_1px_0_#ffffff] text-xs scrollbar-none"
    >
      {/* File Group */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          id="tb-btn-new"
          type="button"
          onClick={() => {
            retroAudio.play('click');
            onNew();
          }}
          title="Nuevo documento (Ctrl+N)"
          className="win3-button h-[30px] sm:h-[26px] px-2 flex items-center gap-1 active:translate-y-0.5 text-black font-semibold"
        >
          <span className="text-sm">📄</span>
          <span className="hidden sm:inline text-[11px]">Nuevo</span>
        </button>

        <button
          id="tb-btn-open"
          type="button"
          onClick={() => {
            retroAudio.play('open');
            onOpen();
          }}
          title="Abrir archivo (Ctrl+O)"
          className="win3-button h-[30px] sm:h-[26px] px-2 flex items-center gap-1 active:translate-y-0.5 text-black font-semibold"
        >
          <span className="text-sm">📂</span>
          <span className="hidden sm:inline text-[11px]">Abrir</span>
        </button>

        <button
          id="tb-btn-save"
          type="button"
          onClick={() => {
            retroAudio.play('save');
            onSave();
          }}
          title="Guardar documento (Ctrl+S)"
          className="win3-button h-[30px] sm:h-[26px] px-2 flex items-center gap-1 active:translate-y-0.5 text-black font-semibold text-blue-900"
        >
          <span className="text-sm">💾</span>
          <span className="hidden sm:inline text-[11px]">Guardar</span>
        </button>

        <button
          id="tb-btn-cloud"
          type="button"
          onClick={() => {
            retroAudio.play('click');
            onCloudManager();
          }}
          title="Explorador de la nube"
          className="win3-button h-[30px] sm:h-[26px] px-2 flex items-center gap-1 active:translate-y-0.5 text-black font-semibold"
        >
          <span className="text-sm">☁</span>
          <span className="hidden md:inline text-[11px]">Nube</span>
        </button>
      </div>

      <div className="w-[2px] h-[20px] bg-[#808080] border-r border-white mx-0.5 shrink-0" />

      {/* Edit & History Group */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          id="tb-btn-undo"
          type="button"
          disabled={!canUndo}
          onClick={() => {
            retroAudio.play('click');
            onUndo();
          }}
          title="Deshacer (Ctrl+Z)"
          className={`win3-button h-[30px] sm:h-[26px] px-2 flex items-center gap-1 active:translate-y-0.5 text-black ${
            !canUndo ? 'opacity-50 cursor-default' : 'font-semibold'
          }`}
        >
          <span className="text-sm">↩</span>
          <span className="hidden lg:inline text-[11px]">Deshacer</span>
        </button>

        <button
          id="tb-btn-redo"
          type="button"
          disabled={!canRedo}
          onClick={() => {
            retroAudio.play('click');
            onRedo();
          }}
          title="Rehacer (Ctrl+Y)"
          className={`win3-button h-[30px] sm:h-[26px] px-2 flex items-center gap-1 active:translate-y-0.5 text-black ${
            !canRedo ? 'opacity-50 cursor-default' : 'font-semibold'
          }`}
        >
          <span className="text-sm">↪</span>
          <span className="hidden lg:inline text-[11px]">Rehacer</span>
        </button>
      </div>

      <div className="w-[2px] h-[20px] bg-[#808080] border-r border-white mx-0.5 shrink-0" />

      {/* Search & Replace Group */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          id="tb-btn-find"
          type="button"
          onClick={() => {
            retroAudio.play('click');
            onFind();
          }}
          title="Buscar texto (Ctrl+F)"
          className="win3-button h-[30px] sm:h-[26px] px-2 flex items-center gap-1 active:translate-y-0.5 text-black font-semibold"
        >
          <span className="text-sm">🔍</span>
          <span className="hidden sm:inline text-[11px]">Buscar</span>
        </button>

        <button
          id="tb-btn-replace"
          type="button"
          onClick={() => {
            retroAudio.play('click');
            onReplace();
          }}
          title="Reemplazar texto (Ctrl+H)"
          className="win3-button h-[30px] sm:h-[26px] px-2 flex items-center gap-1 active:translate-y-0.5 text-black font-semibold"
        >
          <span className="text-sm">🔄</span>
          <span className="hidden md:inline text-[11px]">Reemplazar</span>
        </button>
      </div>

      <div className="w-[2px] h-[20px] bg-[#808080] border-r border-white mx-0.5 shrink-0" />

      {/* Formatting & Zoom */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          id="tb-btn-font"
          type="button"
          onClick={() => {
            retroAudio.play('click');
            onFontDialog();
          }}
          title="Tipografía y formato"
          className="win3-button h-[30px] sm:h-[26px] px-2 flex items-center gap-1 active:translate-y-0.5 text-black font-semibold"
        >
          <span className="text-sm">🔤</span>
          <span className="hidden sm:inline text-[11px]">Fuente</span>
        </button>

        <button
          id="tb-btn-zoomin"
          type="button"
          onClick={() => {
            retroAudio.play('click');
            onZoomIn();
          }}
          title="Aumentar tamaño de letra"
          className="win3-button h-[30px] sm:h-[26px] px-2 flex items-center justify-center font-bold text-xs active:translate-y-0.5 text-black"
        >
          A+
        </button>

        <button
          id="tb-btn-zoomout"
          type="button"
          onClick={() => {
            retroAudio.play('click');
            onZoomOut();
          }}
          title="Disminuir tamaño de letra"
          className="win3-button h-[30px] sm:h-[26px] px-2 flex items-center justify-center font-bold text-xs active:translate-y-0.5 text-black"
        >
          A-
        </button>

        <button
          id="tb-btn-wrap"
          type="button"
          onClick={() => {
            retroAudio.play('click');
            onToggleWordWrap();
          }}
          title={wordWrap ? 'Ajuste de línea activado' : 'Ajuste de línea desactivado'}
          className={`win3-button h-[30px] sm:h-[26px] px-2 flex items-center gap-1 active:translate-y-0.5 text-black ${
            wordWrap ? 'font-bold bg-[#dcdcdc]' : ''
          }`}
        >
          <span className="text-sm">↵</span>
          <span className="hidden lg:inline text-[11px]">Ajuste</span>
        </button>
      </div>

      <div className="w-[2px] h-[20px] bg-[#808080] border-r border-white mx-0.5 shrink-0" />

      {/* Utilities Group */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          id="tb-btn-datetime"
          type="button"
          onClick={() => {
            retroAudio.play('click');
            onInsertDateTime();
          }}
          title="Insertar Fecha y Hora (F5)"
          className="win3-button h-[30px] sm:h-[26px] px-2 flex items-center gap-1 active:translate-y-0.5 text-black font-semibold"
        >
          <span className="text-sm">📅</span>
          <span className="hidden md:inline text-[11px]">F5</span>
        </button>

        <button
          id="tb-btn-print"
          type="button"
          onClick={() => {
            retroAudio.play('click');
            onPrint();
          }}
          title="Imprimir documento (Ctrl+P)"
          className="win3-button h-[30px] sm:h-[26px] px-2 flex items-center gap-1 active:translate-y-0.5 text-black font-semibold"
        >
          <span className="text-sm">🖨</span>
          <span className="hidden lg:inline text-[11px]">Imprimir</span>
        </button>

        <button
          id="tb-btn-help"
          type="button"
          onClick={() => {
            retroAudio.play('click');
            onHelp();
          }}
          title="Ayuda del Bloc de notas"
          className="win3-button h-[30px] sm:h-[26px] px-2 flex items-center gap-1 active:translate-y-0.5 text-black font-semibold text-green-900"
        >
          <span className="text-sm">❓</span>
          <span className="hidden sm:inline text-[11px]">Ayuda</span>
        </button>
      </div>
    </div>
  );
};
