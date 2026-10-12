/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ActiveDocument,
  DialogType,
  FontSettings,
  PageSetupSettings,
  SearchOptions,
} from './types';
import { TitleBar } from './components/TitleBar';
import { MenuBar } from './components/MenuBar';
import { QuickToolbar } from './components/QuickToolbar';
import { Editor } from './components/Editor';
import { StatusBar } from './components/StatusBar';

// Dialogs
import { OpenDialog } from './components/dialogs/OpenDialog';
import { SaveAsDialog } from './components/dialogs/SaveAsDialog';
import { CloudManagerDialog } from './components/dialogs/CloudManagerDialog';
import { FindReplaceDialog } from './components/dialogs/FindReplaceDialog';
import { FontDialog } from './components/dialogs/FontDialog';
import { PageSetupDialog } from './components/dialogs/PageSetupDialog';
import { PrintDialog } from './components/dialogs/PrintDialog';
import { AboutDialog } from './components/dialogs/AboutDialog';
import { GoToDialog } from './components/dialogs/GoToDialog';
import { RenameDialog } from './components/dialogs/RenameDialog';
import { ConfirmCloseDialog } from './components/dialogs/ConfirmCloseDialog';
import { HelpTopicsDialog } from './components/dialogs/HelpTopicsDialog';
import { SoundSettingsDialog } from './components/dialogs/SoundSettingsDialog';

import { CloudStorageManager } from './utils/storage';
import { openLocalFileDialog, saveLocalFile, printDocument } from './utils/fileSystem';
import { retroAudio } from './utils/audio';

const INITIAL_DOC: ActiveDocument = {
  id: 'sample-readme',
  fileName: 'LEAME.TXT',
  content: '',
  savedContent: '',
  source: 'cloud',
  cloudFileId: 'sample-readme',
};

const DEFAULT_FONT_SETTINGS: FontSettings = {
  fontFamily: 'Courier Prime',
  fontSize: 14,
  isBold: false,
  isItalic: false,
  textColor: '#000000',
  bgColor: '#ffffff',
};

const DEFAULT_PAGE_SETUP: PageSetupSettings = {
  header: '&f',
  footer: 'Página &p',
  marginLeft: 20,
  marginRight: 20,
  marginTop: 25,
  marginBottom: 25,
  orientation: 'portrait',
};

export default function App() {
  // Document State
  const [doc, setDoc] = useState<ActiveDocument>(INITIAL_DOC);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  
  // Dialogs
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [findMode, setFindMode] = useState<'find' | 'replace'>('find');
  const [pendingActionAfterConfirm, setPendingActionAfterConfirm] = useState<(() => void) | null>(null);

  // Settings & Toggles
  const [fontSettings, setFontSettings] = useState<FontSettings>(DEFAULT_FONT_SETTINGS);
  const [pageSetup, setPageSetup] = useState<PageSetupSettings>(DEFAULT_PAGE_SETUP);
  const [wordWrap, setWordWrap] = useState(true);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Editor cursor stats
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1, selectionLength: 0 });

  // Is current file modified?
  const isDirty = doc.content !== doc.savedContent;

  // Initialize initial document from cloud on mount
  useEffect(() => {
    const defaultFile = CloudStorageManager.getById('sample-readme') || CloudStorageManager.getAll()[0];
    if (defaultFile) {
      let content = defaultFile.content;
      // .LOG feature check: automatic date stamp if first line starts with .LOG
      if (content.startsWith('.LOG')) {
        const timestamp = `\n${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}\n`;
        content += timestamp;
      }
      setDoc({
        id: defaultFile.id,
        fileName: defaultFile.name,
        content,
        savedContent: defaultFile.content,
        source: 'cloud',
        cloudFileId: defaultFile.id,
      });
    }
  }, []);

  // Content Change with Undo tracking
  const handleContentChange = (newContent: string) => {
    setUndoStack((prev) => [...prev.slice(-40), doc.content]);
    setRedoStack([]);
    setDoc((prev) => ({ ...prev, content: newContent }));
  };

  // Undo / Redo
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, doc.content]);
    setDoc((prev) => ({ ...prev, content: last }));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, doc.content]);
    setDoc((prev) => ({ ...prev, content: next }));
  };

  // Zoom In / Out
  const handleZoomIn = () => {
    setFontSettings((prev) => ({
      ...prev,
      fontSize: Math.min(48, prev.fontSize + 2),
    }));
  };

  const handleZoomOut = () => {
    setFontSettings((prev) => ({
      ...prev,
      fontSize: Math.max(10, prev.fontSize - 2),
    }));
  };

  // Insert Date/Time (F5)
  const handleInsertDateTime = () => {
    const now = new Date();
    const formatted = `${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${now.toLocaleDateString()}`;
    const textarea = document.getElementById('notepad-textarea') as HTMLTextAreaElement | null;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      const newVal = val.substring(0, start) + formatted + val.substring(end);
      handleContentChange(newVal);
      setTimeout(() => {
        textarea.selectionStart = start + formatted.length;
        textarea.selectionEnd = start + formatted.length;
        textarea.focus();
      }, 10);
    } else {
      handleContentChange(doc.content + formatted);
    }
    retroAudio.play('click');
  };

  // New Document
  const handleNew = () => {
    if (isDirty) {
      setPendingActionAfterConfirm(() => () => {
        setDoc({
          id: null,
          fileName: 'Sin título.txt',
          content: '',
          savedContent: '',
          source: 'new',
        });
        setUndoStack([]);
        setRedoStack([]);
      });
      setActiveDialog('confirmNew');
    } else {
      setDoc({
        id: null,
        fileName: 'Sin título.txt',
        content: '',
        savedContent: '',
        source: 'new',
      });
      setUndoStack([]);
      setRedoStack([]);
      retroAudio.play('click');
    }
  };

  // Open Handlers
  const handleOpenClick = () => {
    if (isDirty) {
      setPendingActionAfterConfirm(() => () => {
        setActiveDialog('open');
      });
      setActiveDialog('confirmOpen');
    } else {
      setActiveDialog('open');
    }
  };

  const handleLoadCloudFile = (file: { id: string; name: string; content: string }) => {
    let content = file.content;
    if (content.startsWith('.LOG')) {
      const timestamp = `\n${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}\n`;
      content += timestamp;
    }
    setDoc({
      id: file.id,
      fileName: file.name,
      content,
      savedContent: file.content,
      source: 'cloud',
      cloudFileId: file.id,
    });
    setUndoStack([]);
    setRedoStack([]);
    setActiveDialog(null);
    retroAudio.play('open');
  };

  const handleLoadLocalFile = async () => {
    const res = await openLocalFileDialog();
    if (res) {
      let content = res.content;
      if (content.startsWith('.LOG')) {
        const timestamp = `\n${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}\n`;
        content += timestamp;
      }
      setDoc({
        id: null,
        fileName: res.fileName,
        content,
        savedContent: res.content,
        source: 'local',
      });
      setUndoStack([]);
      setRedoStack([]);
      setActiveDialog(null);
      retroAudio.play('open');
    }
  };

  // Save Document Handlers
  const handleSave = async () => {
    if (doc.source === 'new') {
      setActiveDialog('saveAs');
      return;
    }

    if (doc.source === 'cloud' && doc.cloudFileId) {
      CloudStorageManager.save(doc.fileName, doc.content, doc.cloudFileId);
      setDoc((prev) => ({ ...prev, savedContent: doc.content }));
      retroAudio.play('save');
    } else {
      // Local file download / save
      saveLocalFile(doc.fileName, doc.content);
      setDoc((prev) => ({ ...prev, savedContent: doc.content }));
      retroAudio.play('save');
    }
  };

  const handleSaveAsCloud = (fileName: string) => {
    const saved = CloudStorageManager.save(fileName, doc.content, doc.cloudFileId);
    setDoc({
      id: saved.id,
      fileName: saved.name,
      content: doc.content,
      savedContent: doc.content,
      source: 'cloud',
      cloudFileId: saved.id,
    });
    setActiveDialog(null);
    retroAudio.play('save');
  };

  const handleSaveAsLocal = (fileName: string) => {
    saveLocalFile(fileName, doc.content);
    setDoc({
      id: null,
      fileName,
      content: doc.content,
      savedContent: doc.content,
      source: 'local',
    });
    setActiveDialog(null);
    retroAudio.play('save');
  };

  // Rename Current Document
  const handleConfirmRenameCurrentDoc = (newName: string) => {
    if (doc.source === 'cloud' && doc.cloudFileId) {
      CloudStorageManager.rename(doc.cloudFileId, newName);
    }
    setDoc((prev) => ({ ...prev, fileName: newName }));
    setActiveDialog(null);
    retroAudio.play('click');
  };

  // Search & Replace Handlers
  const handleFindNext = (options: SearchOptions): boolean => {
    const textarea = document.getElementById('notepad-textarea') as HTMLTextAreaElement | null;
    if (!textarea || !options.findText) return false;

    const fullText = textarea.value;
    const target = options.matchCase ? options.findText : options.findText.toLowerCase();
    const source = options.matchCase ? fullText : fullText.toLowerCase();

    let searchStartPos = options.direction === 'down' ? textarea.selectionEnd : textarea.selectionStart - 1;
    let foundIndex = -1;

    if (options.direction === 'down') {
      foundIndex = source.indexOf(target, searchStartPos);
      if (foundIndex === -1 && options.wrapAround) {
        foundIndex = source.indexOf(target, 0);
      }
    } else {
      foundIndex = source.lastIndexOf(target, Math.max(0, searchStartPos));
      if (foundIndex === -1 && options.wrapAround) {
        foundIndex = source.lastIndexOf(target);
      }
    }

    if (foundIndex !== -1) {
      textarea.focus();
      textarea.setSelectionRange(foundIndex, foundIndex + options.findText.length);
      retroAudio.play('click');
      return true;
    } else {
      retroAudio.play('asterisk');
      alert(`No se encontró "${options.findText}"`);
      return false;
    }
  };

  const handleReplaceCurrent = (options: SearchOptions) => {
    const textarea = document.getElementById('notepad-textarea') as HTMLTextAreaElement | null;
    if (!textarea || !options.findText) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);

    const matches = options.matchCase
      ? selected === options.findText
      : selected.toLowerCase() === options.findText.toLowerCase();

    if (matches) {
      const val = textarea.value;
      const updated = val.substring(0, start) + options.replaceText + val.substring(end);
      handleContentChange(updated);
      setTimeout(() => {
        handleFindNext(options);
      }, 20);
    } else {
      handleFindNext(options);
    }
  };

  const handleReplaceAll = (options: SearchOptions): number => {
    if (!options.findText) return 0;
    const flags = options.matchCase ? 'g' : 'gi';
    const escaped = options.findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, flags);
    const count = (doc.content.match(regex) || []).length;

    if (count > 0) {
      const replaced = doc.content.replace(regex, options.replaceText);
      handleContentChange(replaced);
      retroAudio.play('save');
      alert(`Se reemplazaron ${count} apariciones.`);
    } else {
      retroAudio.play('asterisk');
      alert(`No se encontró "${options.findText}"`);
    }
    return count;
  };

  // Go To Line
  const handleGoToLine = (lineNumber: number) => {
    const textarea = document.getElementById('notepad-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const lines = textarea.value.split('\n');
    const targetLine = Math.max(1, Math.min(lineNumber, lines.length));
    
    let charIndex = 0;
    for (let i = 0; i < targetLine - 1; i++) {
      charIndex += lines[i].length + 1; // +1 for \n
    }

    textarea.focus();
    textarea.setSelectionRange(charIndex, charIndex);
    setActiveDialog(null);
    retroAudio.play('click');
  };

  // Drop Local File onto Notepad Editor
  const handleFileDrop = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e.target?.result as string) || '';
      if (isDirty) {
        setPendingActionAfterConfirm(() => () => {
          let text = content;
          if (text.startsWith('.LOG')) {
            text += `\n${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}\n`;
          }
          setDoc({
            id: null,
            fileName: file.name,
            content: text,
            savedContent: content,
            source: 'local',
          });
          setUndoStack([]);
          setRedoStack([]);
          retroAudio.play('open');
        });
        setActiveDialog('confirmOpen');
      } else {
        let text = content;
        if (text.startsWith('.LOG')) {
          text += `\n${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}\n`;
        }
        setDoc({
          id: null,
          fileName: file.name,
          content: text,
          savedContent: content,
          source: 'local',
        });
        setUndoStack([]);
        setRedoStack([]);
        retroAudio.play('open');
      }
    };
    reader.readAsText(file);
  };

  // Global Keyboard Shortcuts
  const handleKeyDownShortcuts = useCallback(
    (e: React.KeyboardEvent | KeyboardEvent) => {
      // F5 -> Insert Date/Time
      if (e.key === 'F5') {
        e.preventDefault();
        handleInsertDateTime();
        return;
      }
      // F3 -> Find Next
      if (e.key === 'F3') {
        e.preventDefault();
        handleFindNext({
          findText: '',
          replaceText: '',
          matchCase: false,
          direction: 'down',
          wrapAround: true,
        });
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'o':
            e.preventDefault();
            handleOpenClick();
            break;
          case 'n':
            e.preventDefault();
            handleNew();
            break;
          case 'p':
            e.preventDefault();
            setActiveDialog('print');
            break;
          case 'f':
            e.preventDefault();
            setFindMode('find');
            setActiveDialog('find');
            break;
          case 'h':
            e.preventDefault();
            setFindMode('replace');
            setActiveDialog('replace');
            break;
          case 'g':
            e.preventDefault();
            setActiveDialog('goTo');
            break;
          case 'z':
            if (e.shiftKey) {
              e.preventDefault();
              handleRedo();
            } else {
              e.preventDefault();
              handleUndo();
            }
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
          case '+':
          case '=':
            e.preventDefault();
            handleZoomIn();
            break;
          case '-':
            e.preventDefault();
            handleZoomOut();
            break;
        }
      }
    },
    [doc, undoStack, redoStack, isDirty]
  );

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if focus is in a dialog modal input
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'INPUT' && target.id !== 'notepad-textarea') {
        return;
      }
      handleKeyDownShortcuts(e);
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleKeyDownShortcuts]);

  const totalLines = doc.content.split('\n').length;
  const wordCount = doc.content.trim() ? doc.content.trim().split(/\s+/).length : 0;
  const charCount = doc.content.length;

  return (
    <main
      id="notepad-app-root"
      className="w-full h-screen h-[100dvh] flex flex-col bg-[#c0c0c0] font-sans select-none overflow-hidden"
    >
      {/* Title / Header Bar */}
      <TitleBar
        document={doc}
        isDirty={isDirty}
        onOpenCloudManager={() => setActiveDialog('cloudManager')}
      />

      {/* Menu Bar with Full Notepad Menus */}
      <MenuBar
        onNew={handleNew}
        onOpen={handleOpenClick}
        onSave={handleSave}
        onSaveAs={() => setActiveDialog('saveAs')}
        onSaveCloud={() => setActiveDialog('saveAs')}
        onCloudManager={() => setActiveDialog('cloudManager')}
        onRename={() => setActiveDialog('rename')}
        onPageSetup={() => setActiveDialog('pageSetup')}
        onPrint={() => setActiveDialog('print')}
        onExit={() => {
          if (isDirty) setActiveDialog('confirmExit');
          else handleNew();
        }}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onCut={() => {
          const ta = document.getElementById('notepad-textarea') as HTMLTextAreaElement | null;
          if (ta) {
            const start = ta.selectionStart;
            const end = ta.selectionEnd;
            if (start !== end) {
              const selected = ta.value.substring(start, end);
              navigator.clipboard?.writeText(selected);
              const updated = ta.value.substring(0, start) + ta.value.substring(end);
              handleContentChange(updated);
            }
          }
          retroAudio.play('click');
        }}
        onCopy={() => {
          const ta = document.getElementById('notepad-textarea') as HTMLTextAreaElement | null;
          if (ta) {
            const start = ta.selectionStart;
            const end = ta.selectionEnd;
            if (start !== end) {
              const selected = ta.value.substring(start, end);
              navigator.clipboard?.writeText(selected);
            }
          }
          retroAudio.play('click');
        }}
        onPaste={async () => {
          try {
            const text = await navigator.clipboard?.readText();
            if (text) {
              const ta = document.getElementById('notepad-textarea') as HTMLTextAreaElement | null;
              if (ta) {
                const start = ta.selectionStart;
                const end = ta.selectionEnd;
                const val = ta.value;
                const updated = val.substring(0, start) + text + val.substring(end);
                handleContentChange(updated);
                setTimeout(() => {
                  ta.selectionStart = start + text.length;
                  ta.selectionEnd = start + text.length;
                  ta.focus();
                }, 10);
              }
            }
          } catch {
            // Fallback
            document.execCommand('paste');
          }
          retroAudio.play('click');
        }}
        onDelete={() => {
          const ta = document.getElementById('notepad-textarea') as HTMLTextAreaElement | null;
          if (ta && ta.selectionStart !== ta.selectionEnd) {
            const updated = ta.value.substring(0, ta.selectionStart) + ta.value.substring(ta.selectionEnd);
            handleContentChange(updated);
          }
        }}
        onSelectAll={() => {
          const ta = document.getElementById('notepad-textarea') as HTMLTextAreaElement | null;
          if (ta) {
            ta.select();
            ta.focus();
          }
        }}
        onInsertDateTime={handleInsertDateTime}
        wordWrap={wordWrap}
        onToggleWordWrap={() => setWordWrap(!wordWrap)}
        showStatusBar={showStatusBar}
        onToggleStatusBar={() => setShowStatusBar(!showStatusBar)}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          retroAudio.setEnabled(next);
        }}
        onFind={() => {
          setFindMode('find');
          setActiveDialog('find');
        }}
        onFindNext={() =>
          handleFindNext({
            findText: '',
            replaceText: '',
            matchCase: false,
            direction: 'down',
            wrapAround: true,
          })
        }
        onReplace={() => {
          setFindMode('replace');
          setActiveDialog('replace');
        }}
        onGoTo={() => setActiveDialog('goTo')}
        onFontDialog={() => setActiveDialog('font')}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onHelpTopics={() => setActiveDialog('helpTopics')}
        onAbout={() => setActiveDialog('about')}
        onExportBackup={() => {
          const json = CloudStorageManager.exportJSON();
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `RESPALDO_BLOC_NOTAS_${new Date().toISOString().slice(0, 10)}.JSON`;
          a.click();
        }}
        onImportBackup={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.json';
          input.onchange = async () => {
            const f = input.files?.[0];
            if (f) {
              const t = await f.text();
              CloudStorageManager.importJSON(t);
              retroAudio.play('tada');
              alert('¡Copia de seguridad importada con éxito!');
            }
          };
          input.click();
        }}
        onResetCloud={() => {
          if (window.confirm('¿Desea restablecer los archivos predeterminados de la nube?')) {
            CloudStorageManager.resetToDefault();
            retroAudio.play('tada');
            alert('Archivos de la nube restablecidos.');
          }
        }}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        hasSelection={cursorPos.selectionLength > 0}
      />

      {/* Quick-Access Touch & Tablet Toolbar */}
      <QuickToolbar
        onNew={handleNew}
        onOpen={handleOpenClick}
        onSave={handleSave}
        onCloudManager={() => setActiveDialog('cloudManager')}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onFind={() => {
          setFindMode('find');
          setActiveDialog('find');
        }}
        onReplace={() => {
          setFindMode('replace');
          setActiveDialog('replace');
        }}
        onFontDialog={() => setActiveDialog('font')}
        onInsertDateTime={handleInsertDateTime}
        wordWrap={wordWrap}
        onToggleWordWrap={() => setWordWrap(!wordWrap)}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onPrint={() => setActiveDialog('print')}
        onHelp={() => setActiveDialog('helpTopics')}
      />

      {/* Main Text Editor Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-white overflow-hidden">
        <Editor
          content={doc.content}
          onChange={handleContentChange}
          fontSettings={fontSettings}
          wordWrap={wordWrap}
          onCursorChange={(line, col, selectionLength) => {
            setCursorPos({ line, col, selectionLength });
          }}
          onFileDrop={handleFileDrop}
          onKeyDownShortcut={handleKeyDownShortcuts}
        />
      </div>

      {/* Status Bar */}
      {showStatusBar && (
        <StatusBar
          document={doc}
          isDirty={isDirty}
          line={cursorPos.line}
          col={cursorPos.col}
          charCount={charCount}
          wordCount={wordCount}
          soundEnabled={soundEnabled}
          onOpenCloudManager={() => setActiveDialog('cloudManager')}
        />
      )}

      {/* Dialog Modals */}
      <OpenDialog
        isOpen={activeDialog === 'open'}
        onClose={() => setActiveDialog(null)}
        onOpenCloudFile={handleLoadCloudFile}
        onOpenLocalFile={handleLoadLocalFile}
      />

      <SaveAsDialog
        isOpen={activeDialog === 'saveAs'}
        currentFileName={doc.fileName}
        defaultDestination={doc.source === 'local' ? 'local' : 'cloud'}
        onClose={() => setActiveDialog(null)}
        onSaveAsCloud={handleSaveAsCloud}
        onSaveAsLocal={handleSaveAsLocal}
      />

      <CloudManagerDialog
        isOpen={activeDialog === 'cloudManager'}
        onClose={() => setActiveDialog(null)}
        onSelectFileToOpen={handleLoadCloudFile}
        onRenameCurrentDoc={(newName) => setDoc((prev) => ({ ...prev, fileName: newName }))}
      />

      <FindReplaceDialog
        isOpen={activeDialog === 'find' || activeDialog === 'replace'}
        mode={findMode}
        onClose={() => setActiveDialog(null)}
        onFindNext={handleFindNext}
        onReplaceCurrent={handleReplaceCurrent}
        onReplaceAll={handleReplaceAll}
      />

      <FontDialog
        isOpen={activeDialog === 'font'}
        currentSettings={fontSettings}
        onClose={() => setActiveDialog(null)}
        onApply={(newSettings) => setFontSettings(newSettings)}
      />

      <PageSetupDialog
        isOpen={activeDialog === 'pageSetup'}
        settings={pageSetup}
        onClose={() => setActiveDialog(null)}
        onApply={(s) => setPageSetup(s)}
      />

      <PrintDialog
        isOpen={activeDialog === 'print'}
        onClose={() => setActiveDialog(null)}
        onConfirmPrint={() => {
          printDocument(doc.fileName, doc.content, pageSetup.header, pageSetup.footer);
        }}
      />

      <AboutDialog
        isOpen={activeDialog === 'about'}
        onClose={() => setActiveDialog(null)}
      />

      <GoToDialog
        isOpen={activeDialog === 'goTo'}
        maxLines={totalLines}
        onClose={() => setActiveDialog(null)}
        onGoToLine={handleGoToLine}
      />

      <RenameDialog
        isOpen={activeDialog === 'rename'}
        currentName={doc.fileName}
        onClose={() => setActiveDialog(null)}
        onConfirmRename={handleConfirmRenameCurrentDoc}
      />

      <HelpTopicsDialog
        isOpen={activeDialog === 'helpTopics'}
        onClose={() => setActiveDialog(null)}
      />

      <SoundSettingsDialog
        isOpen={activeDialog === 'soundSettings'}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          retroAudio.setEnabled(next);
        }}
        onClose={() => setActiveDialog(null)}
      />

      {/* Confirmation Dialogs */}
      <ConfirmCloseDialog
        isOpen={activeDialog === 'confirmNew' || activeDialog === 'confirmOpen' || activeDialog === 'confirmExit'}
        fileName={doc.fileName}
        onSave={async () => {
          await handleSave();
          setActiveDialog(null);
          if (pendingActionAfterConfirm) {
            pendingActionAfterConfirm();
            setPendingActionAfterConfirm(null);
          }
        }}
        onDiscard={() => {
          setActiveDialog(null);
          if (pendingActionAfterConfirm) {
            pendingActionAfterConfirm();
            setPendingActionAfterConfirm(null);
          }
        }}
        onCancel={() => {
          setActiveDialog(null);
          setPendingActionAfterConfirm(null);
        }}
      />
    </main>
  );
}
