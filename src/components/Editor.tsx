import React, { useRef, useEffect, useState } from 'react';
import { FontSettings } from '../types';
import { retroAudio } from '../utils/audio';

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
  fontSettings: FontSettings;
  wordWrap: boolean;
  onCursorChange: (line: number, col: number, selectionLength: number) => void;
  onFileDrop: (file: File) => void;
  onKeyDownShortcut: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const Editor: React.FC<EditorProps> = ({
  content,
  onChange,
  fontSettings,
  wordWrap,
  onCursorChange,
  onFileDrop,
  onKeyDownShortcut,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Update cursor position
  const handleSelection = () => {
    if (!textareaRef.current) return;
    const text = textareaRef.current.value;
    const selStart = textareaRef.current.selectionStart;
    const selEnd = textareaRef.current.selectionEnd;

    // Calculate line and col
    const textBefore = text.substring(0, selStart);
    const lines = textBefore.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    const selectionLength = Math.abs(selEnd - selStart);

    onCursorChange(line, col, selectionLength);
  };

  useEffect(() => {
    // Focus editor on load
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      retroAudio.play('open');
      onFileDrop(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    handleSelection();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab key support
    if (e.key === 'Tab' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const ta = textareaRef.current;
      if (ta) {
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const val = ta.value;
        const updated = val.substring(0, start) + '\t' + val.substring(end);
        onChange(updated);
        setTimeout(() => {
          ta.selectionStart = start + 1;
          ta.selectionEnd = start + 1;
          handleSelection();
        }, 10);
        return;
      }
    }

    onKeyDownShortcut(e);
    setTimeout(handleSelection, 10);
  };

  return (
    <div
      id="notepad-editor-container"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex-1 w-full relative bg-white overflow-hidden p-[2px]"
      style={{
        borderTop: '2px solid #808080',
        borderLeft: '2px solid #808080',
        borderRight: '2px solid #ffffff',
        borderBottom: '2px solid #ffffff',
      }}
    >
      {/* Drag & Drop Visual Indicator */}
      {isDragOver && (
        <div
          id="dropzone-indicator"
          className="absolute inset-0 bg-[#000080]/20 border-4 border-dashed border-[#000080] flex flex-col items-center justify-center z-30 pointer-events-none"
        >
          <div className="bg-[#c0c0c0] border-2 border-black p-4 text-center shadow-lg">
            <p className="font-bold text-sm text-black">📂 Soltar archivo para abrir en el Bloc de notas</p>
            <p className="text-xs text-gray-700 mt-1">Soporta .TXT, .INI, .LOG, .BAT, .SYS, etc.</p>
          </div>
        </div>
      )}

      {/* Main Textarea with Enhanced Touch & Typing Ergonomics */}
      <textarea
        ref={textareaRef}
        id="notepad-textarea"
        value={content}
        onChange={handleChange}
        onKeyUp={handleSelection}
        onClick={handleSelection}
        onSelect={handleSelection}
        onTouchStart={handleSelection}
        onTouchEnd={handleSelection}
        onInput={handleSelection}
        onKeyDown={handleKeyDown}
        wrap={wordWrap ? 'soft' : 'off'}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className={`w-full h-full resize-none outline-none border-none p-2 sm:p-3 selection:bg-[#000080] selection:text-white touch-pan-y ${
          wordWrap ? 'overflow-y-scroll overflow-x-hidden' : 'overflow-auto whitespace-pre'
        }`}
        style={{
          fontFamily: fontSettings.fontFamily,
          fontSize: `${fontSettings.fontSize}px`,
          fontWeight: fontSettings.isBold ? 'bold' : 'normal',
          fontStyle: fontSettings.isItalic ? 'italic' : 'normal',
          color: fontSettings.textColor,
          backgroundColor: fontSettings.bgColor,
          lineHeight: '1.45',
          tabSize: 4,
          caretColor: fontSettings.textColor,
        }}
        placeholder=""
      />
    </div>
  );
};
