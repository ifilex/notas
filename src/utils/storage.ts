import { CloudFile } from '../types';

const CLOUD_STORAGE_KEY = 'win311_notepad_cloud_files_v1';

const INITIAL_CLOUD_FILES: CloudFile[] = [
  {
    id: 'sample-readme',
    name: 'LEAME.TXT',
    content: `=================================================================
                  BLOC DE NOTAS - MICROSOFT WINDOWS 3.11
=================================================================

Bienvenido al Bloc de notas de Windows 3.11 con soporte para la nube 
y archivos de disco local.

CARACTERÍSTICAS PRINCIPALES:
-----------------------------------------------------------------
1. ARCHIVOS LOCALES:
   - Abra cualquier archivo de su equipo mediante Archivo > Abrir.
   - Guarde directamente en su disco duro con Guardar / Guardar como.
   - Soporte para arrastrar y soltar archivos (.txt, .log, .ini, etc.)
     directamente sobre la ventana.

2. ARCHIVOS EN LA NUBE:
   - Almacene documentos en el espacio virtual seguro de la nube.
   - Abra el "Administrador de la nube" desde el menú Nube o Archivo.
   - Cree nuevos archivos en la nube, renómbrelos o bórrelos.
   - Exporte e importe copias de seguridad de sus documentos.

3. FUNCIONES CLÁSICAS DE WINDOWS 3.11:
   - Truco .LOG: Escriba .LOG en mayúsculas en la primera línea de 
     cualquier archivo y al abrirlo se insertará automáticamente 
     la fecha y hora actual.
   - Tecla F5: Inserta fecha y hora en la posición del cursor.
   - Búsqueda y reemplazo con dirección Arriba/Abajo.
   - Fuentes personalizables (Fixedsys, Courier, MS Sans Serif).
   - Ajuste de línea automático (Word Wrap).
   - Sonidos clásicos de Windows 3.11 (Tada, Ding, Chord, Chimes).

¡Disfrute de la experiencia retro más fiel de 1993!
`,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    size: 1420,
    isSample: true,
  },
  {
    id: 'sample-winini',
    name: 'SYSTEM.INI',
    content: `; Archivo de configuración del sistema Windows 3.11
[boot]
shell=progman.exe
mouse.drv=mouse.drv
network.drv=wfwsys.drv
language.dll=
sound.drv=mmsound.drv
386grabber=vga.3gr
display.drv=vga.drv

[386Enh]
32BitDiskAccess=ON
32BitFileAccess=ON
PageBuffers=32
device=*vshare
device=*vcd
device=*vpd
device=*vpicd
device=*vtd
device=*reboot
device=*vdmad
device=*vsd
MinSPs=4
`,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    size: 382,
    isSample: true,
  },
  {
    id: 'sample-notas',
    name: 'NOTAS.TXT',
    content: `.LOG
10:30 PM 21/08/2026
- Recordar guardar los respaldos de archivos en la nube.
- Probar el comando de búsqueda con F3.
- Personalizar el tamaño de fuente en el menú Formato.
`,
    createdAt: Date.now() - 3600000 * 5,
    updatedAt: Date.now() - 3600000 * 5,
    size: 198,
    isSample: true,
  },
];

export class CloudStorageManager {
  private static loadRaw(): CloudFile[] {
    try {
      const data = localStorage.getItem(CLOUD_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(INITIAL_CLOUD_FILES));
        return INITIAL_CLOUD_FILES;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse cloud storage', e);
      return INITIAL_CLOUD_FILES;
    }
  }

  private static saveRaw(files: CloudFile[]): void {
    try {
      localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(files));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }

  public static getAll(): CloudFile[] {
    return this.loadRaw().sort((a, b) => b.updatedAt - a.updatedAt);
  }

  public static getById(id: string): CloudFile | undefined {
    return this.loadRaw().find((f) => f.id === id);
  }

  public static save(name: string, content: string, existingId?: string): CloudFile {
    const files = this.loadRaw();
    const cleanName = name.trim().toUpperCase() || 'DOCUMENTO.TXT';
    const now = Date.now();
    const size = new Blob([content]).size;

    if (existingId) {
      const idx = files.findIndex((f) => f.id === existingId);
      if (idx !== -1) {
        const updated: CloudFile = {
          ...files[idx],
          name: cleanName,
          content,
          updatedAt: now,
          size,
        };
        files[idx] = updated;
        this.saveRaw(files);
        return updated;
      }
    }

    // Check if filename already exists
    const duplicate = files.find((f) => f.name.toLowerCase() === cleanName.toLowerCase());
    if (duplicate && !existingId) {
      // update duplicate
      duplicate.content = content;
      duplicate.updatedAt = now;
      duplicate.size = size;
      this.saveRaw(files);
      return duplicate;
    }

    const newFile: CloudFile = {
      id: 'cloud_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36),
      name: cleanName,
      content,
      createdAt: now,
      updatedAt: now,
      size,
    };

    files.unshift(newFile);
    this.saveRaw(files);
    return newFile;
  }

  public static rename(id: string, newName: string): CloudFile | null {
    const files = this.loadRaw();
    const idx = files.findIndex((f) => f.id === id);
    if (idx === -1) return null;

    let cleanName = newName.trim().toUpperCase();
    if (!cleanName.includes('.')) {
      cleanName += '.TXT';
    }

    files[idx].name = cleanName;
    files[idx].updatedAt = Date.now();
    this.saveRaw(files);
    return files[idx];
  }

  public static delete(id: string): boolean {
    const files = this.loadRaw();
    const filtered = files.filter((f) => f.id !== id);
    if (filtered.length !== files.length) {
      this.saveRaw(filtered);
      return true;
    }
    return false;
  }

  public static createEmpty(name: string = 'NUEVO.TXT'): CloudFile {
    return this.save(name, '');
  }

  public static exportJSON(): string {
    const files = this.loadRaw();
    return JSON.stringify(
      {
        app: 'Windows 3.11 Notepad Cloud Backup',
        version: '1.0',
        exportedAt: new Date().toISOString(),
        files,
      },
      null,
      2
    );
  }

  public static importJSON(jsonStr: string): number {
    try {
      const parsed = JSON.parse(jsonStr);
      const incoming = Array.isArray(parsed) ? parsed : parsed.files;
      if (!Array.isArray(incoming)) return 0;

      const current = this.loadRaw();
      let importedCount = 0;

      incoming.forEach((item: Partial<CloudFile>) => {
        if (item.name && typeof item.content === 'string') {
          const id = item.id || 'imported_' + Math.random().toString(36).substring(2, 9);
          const existingIdx = current.findIndex((c) => c.id === id || c.name === item.name);
          const fileEntry: CloudFile = {
            id,
            name: item.name.toUpperCase(),
            content: item.content,
            createdAt: item.createdAt || Date.now(),
            updatedAt: item.updatedAt || Date.now(),
            size: new Blob([item.content]).size,
          };

          if (existingIdx !== -1) {
            current[existingIdx] = fileEntry;
          } else {
            current.push(fileEntry);
          }
          importedCount++;
        }
      });

      this.saveRaw(current);
      return importedCount;
    } catch (e) {
      console.error('Import failed', e);
      throw new Error('Formato de archivo de respaldo no válido.');
    }
  }

  public static resetToDefault(): void {
    localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(INITIAL_CLOUD_FILES));
  }
}
