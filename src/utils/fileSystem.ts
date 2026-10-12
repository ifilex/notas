export interface LocalFileResult {
  fileName: string;
  content: string;
  handle?: any;
}

export async function openLocalFileDialog(): Promise<LocalFileResult | null> {
  // Try File System Access API if supported
  if ('showOpenFilePicker' in window) {
    try {
      const [handle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: 'Archivos de texto (*.txt, *.log, *.ini, *.bat)',
            accept: {
              'text/plain': ['.txt', '.log', '.ini', '.bat', '.cmd', '.cfg', '.md', '.json', '.csv', '.sys', '.inf', '.me'],
            },
          },
          {
            description: 'Todos los archivos (*.*)',
            accept: {
              '*/*': [],
            },
          },
        ],
        multiple: false,
      });

      if (!handle) return null;
      const file = await handle.getFile();
      const content = await file.text();
      return {
        fileName: file.name.toUpperCase(),
        content,
        handle,
      };
    } catch (e: any) {
      if (e.name === 'AbortError') return null;
      console.warn('Falling back to input element file picker', e);
    }
  }

  // Standard input fallback
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.log,.ini,.bat,.cfg,.me,.doc,.md,.json,*.*';
    input.style.display = 'none';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      try {
        const text = await file.text();
        resolve({
          fileName: file.name.toUpperCase(),
          content: text,
        });
      } catch (err) {
        console.error('Error reading local file', err);
        resolve(null);
      } finally {
        document.body.removeChild(input);
      }
    };

    input.oncancel = () => {
      resolve(null);
      if (document.body.contains(input)) {
        document.body.removeChild(input);
      }
    };

    document.body.appendChild(input);
    input.click();
  });
}

export async function saveLocalFile(
  content: string,
  suggestedName: string,
  existingHandle?: any
): Promise<{ success: boolean; newName: string; handle?: any }> {
  const cleanName = suggestedName.trim() || 'DOCUMENTO.TXT';

  // If we already have a writable handle
  if (existingHandle && 'createWritable' in existingHandle) {
    try {
      const writable = await existingHandle.createWritable();
      await writable.write(content);
      await writable.close();
      return { success: true, newName: cleanName, handle: existingHandle };
    } catch (e) {
      console.warn('Direct write failed, asking user to pick location', e);
    }
  }

  // Try showSaveFilePicker
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: cleanName,
        types: [
          {
            description: 'Archivos de texto (*.txt)',
            accept: {
              'text/plain': ['.txt', '.log', '.ini', '.bat', '.md'],
            },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
      const file = await handle.getFile();
      return { success: true, newName: file.name.toUpperCase(), handle };
    } catch (e: any) {
      if (e.name === 'AbortError') {
        return { success: false, newName: cleanName };
      }
      console.warn('Fallback to blob download', e);
    }
  }

  // Standard Blob Download Fallback
  try {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = cleanName.endsWith('.TXT') || cleanName.includes('.') ? cleanName : `${cleanName}.TXT`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
    return { success: true, newName: a.download };
  } catch (err) {
    console.error('Save failed', err);
    return { success: false, newName: cleanName };
  }
}

export function printDocument(title: string, content: string, header: string, footer: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const escapedContent = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const formattedHeader = header.replace('&f', title).replace('&d', new Date().toLocaleDateString());
  const formattedFooter = footer.replace('&p', '1').replace('&d', new Date().toLocaleDateString());

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { margin: 20mm; }
          body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 10pt;
            line-height: 1.4;
            color: #000;
            margin: 0;
            padding: 10px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #ccc;
            padding-bottom: 4px;
            margin-bottom: 12px;
            font-size: 8pt;
          }
          .footer {
            margin-top: 20px;
            border-top: 1px solid #ccc;
            padding-top: 4px;
            text-align: center;
            font-size: 8pt;
          }
          pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            margin: 0;
            font-family: inherit;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <span>${formattedHeader}</span>
          <span>${new Date().toLocaleTimeString()}</span>
        </div>
        <pre>${escapedContent}</pre>
        <div class="footer">
          <span>${formattedFooter}</span>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
