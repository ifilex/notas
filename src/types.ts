export interface CloudFile {
  id: string;
  name: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  size: number;
  category?: string;
  isSample?: boolean;
}

export type StorageSource = 'new' | 'local' | 'cloud';

export interface ActiveDocument {
  id: string | null;
  fileName: string;
  content: string;
  savedContent: string;
  source: StorageSource;
  cloudFileId?: string;
  localPath?: string;
  isReadOnly?: boolean;
}

export type DialogType =
  | null
  | 'open'
  | 'saveAs'
  | 'cloudManager'
  | 'rename'
  | 'find'
  | 'replace'
  | 'goTo'
  | 'font'
  | 'pageSetup'
  | 'print'
  | 'about'
  | 'confirmNew'
  | 'confirmOpen'
  | 'confirmExit'
  | 'helpTopics'
  | 'soundSettings'
  | 'exportImport';

export interface FontSettings {
  fontFamily: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  textColor: string;
  bgColor: string;
}

export interface PageSetupSettings {
  header: string;
  footer: string;
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  marginBottom: number;
  orientation: 'portrait' | 'landscape';
}

export interface SearchOptions {
  findText: string;
  replaceText: string;
  matchCase: boolean;
  direction: 'up' | 'down';
  wrapAround: boolean;
}

export interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;
}

export type SoundEffect =
  | 'tada'
  | 'ding'
  | 'chord'
  | 'chimes'
  | 'stop'
  | 'asterisk'
  | 'click'
  | 'save'
  | 'open';
