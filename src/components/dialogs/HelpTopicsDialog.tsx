import React, { useState } from 'react';
import { retroAudio } from '../../utils/audio';

interface HelpTopicsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOPICS = [
  {
    id: 'general',
    title: 'Información general del Bloc de notas',
    content: `El Bloc de notas de Windows 3.11 es un editor de texto clásico ideal para crear y editar archivos de texto sin formato (.TXT), archivos de inicialización (.INI), archivos por lotes (.BAT) y notas diarias.

Esta edición especial incluye integración completa para:
• Edición de archivos locales desde su disco duro.
• Espacio virtual en la nube para sincronizar sus notas sin perder datos.
• Compatibilidad total con la estética, atajos y sonidos originales de 1993.`,
  },
  {
    id: 'cloud',
    title: 'Almacenamiento y gestión en la Nube',
    content: `CÓMO USAR LA NUBE:
1. Menú Archivo > Guardar en la nube: Guarda el documento actual en su espacio virtual en la nube.
2. Menú Nube > Explorador de la nube: Permite ver todos los documentos, crear carpetas virtuales, renombrar archivos y ver estadísticas de tamaño.
3. Copias de seguridad: Puede exportar todos sus documentos en un archivo .JSON para transferirlos o respaldarlos con un solo clic.`,
  },
  {
    id: 'log',
    title: 'El truco secreto de .LOG',
    content: `TRUCO HISTÓRICO DE WINDOWS NOTEPAD:
Si escribe .LOG (en letras mayúsculas con el punto inicial) en la primera línea de cualquier archivo:
Cada vez que vuelva a abrir el documento, el Bloc de notas añadirá automáticamente una marca con la hora y fecha actual al final del texto.

¡Pruébelo creando un archivo que comience con .LOG para llevar su diario personal o registro de tareas!`,
  },
  {
    id: 'shortcuts',
    title: 'Atajos de teclado de Windows 3.11',
    content: `ATAJOS DISPONIBLES:
• Ctrl+N : Nuevo archivo
• Ctrl+O : Abrir archivo (Local o Nube)
• Ctrl+S : Guardar archivo actual
• Ctrl+P : Imprimir documento
• Alt+F4 : Cerrar el Bloc de notas
• Ctrl+Z : Deshacer cambio
• Ctrl+Y : Rehacer cambio
• Ctrl+X : Cortar texto
• Ctrl+C : Copiar texto
• Ctrl+V : Pegar texto
• Ctrl+A : Seleccionar todo
• F5     : Insertar Hora y Fecha actual
• Ctrl+F : Buscar texto
• F3     : Buscar siguiente ocurrencia
• Ctrl+H : Reemplazar texto
• Ctrl+G : Ir a un número de línea específico`,
  },
  {
    id: 'local',
    title: 'Trabajar con archivos del disco local',
    content: `TRABAJAR CON EL DISCO DURO:
• Puede arrastrar cualquier archivo .txt, .log o de código directamente desde su explorador a la ventana de la aplicación para abrirlo de inmediato.
• Al pulsar Archivo > Abrir > "Disco local...", podrá seleccionar cualquier archivo de su computadora.
• Al pulsar Guardar como > "Descargar al Disco Duro Local", se generará un archivo .TXT compatible con cualquier editor moderno.`,
  },
];

export const HelpTopicsDialog: React.FC<HelpTopicsDialogProps> = ({ isOpen, onClose }) => {
  const [activeTopicId, setActiveTopicId] = useState('general');

  if (!isOpen) return null;

  const currentTopic = TOPICS.find((t) => t.id === activeTopicId) || TOPICS[0];

  return (
    <div
      id="dialog-help-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 select-none font-sans overflow-y-auto"
    >
      <div
        id="dialog-help"
        className="w-full max-w-[660px] h-[92dvh] max-h-[520px] bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-2xl flex flex-col p-1 text-[12px] overflow-hidden"
      >
        {/* Title Bar */}
        <div className="bg-[#000080] text-white px-2 py-0.5 font-bold flex justify-between items-center text-xs shrink-0">
          <span>Ayuda - NOTEPAD.HLP</span>
          <button
            type="button"
            onClick={onClose}
            className="w-4 h-3.5 bg-[#c0c0c0] text-black border-t border-l border-white border-r border-b border-black text-[9px] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Win 3.1 Help Toolbar */}
        <div className="bg-[#c0c0c0] border-b border-[#808080] p-1 flex flex-wrap gap-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              retroAudio.play('click');
              setActiveTopicId('general');
            }}
            className="win3-button font-bold text-xs"
          >
            Contenido
          </button>
          <button
            type="button"
            onClick={() => {
              retroAudio.play('click');
              setActiveTopicId('shortcuts');
            }}
            className="win3-button text-xs"
          >
            Atajos (F5...)
          </button>
          <button
            type="button"
            onClick={() => {
              retroAudio.play('click');
              setActiveTopicId('log');
            }}
            className="win3-button text-xs font-bold text-blue-900"
          >
            Truco .LOG
          </button>
          <button
            type="button"
            onClick={() => {
              retroAudio.play('click');
              setActiveTopicId('cloud');
            }}
            className="win3-button text-xs text-blue-900"
          >
            Nube
          </button>
        </div>

        {/* Main Help Body */}
        <div className="flex-1 flex flex-col sm:flex-row gap-2 p-1.5 sm:p-2 overflow-hidden bg-[#c0c0c0] min-h-0">
          {/* Topics sidebar */}
          <div className="h-[90px] sm:h-auto sm:w-[190px] bg-white border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white overflow-y-auto p-1 space-y-0.5 shrink-0">
            <div className="font-bold text-[11px] text-gray-700 px-1 py-0.5 border-b border-gray-200">
              Temas de ayuda:
            </div>
            {TOPICS.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  retroAudio.play('click');
                  setActiveTopicId(t.id);
                }}
                className={`px-1.5 py-0.5 cursor-pointer text-[11px] truncate ${
                  activeTopicId === t.id
                    ? 'bg-[#000080] text-white font-bold'
                    : 'hover:bg-blue-50 text-blue-950 underline'
                }`}
              >
                {t.title}
              </div>
            ))}
          </div>

          {/* Topic content viewer */}
          <div className="flex-1 bg-white border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white p-2.5 sm:p-3 overflow-y-auto font-sans text-xs min-h-0">
            <h3 className="text-sm font-bold text-black border-b border-gray-300 pb-1 mb-2 text-green-900">
              {currentTopic.title}
            </h3>
            <div className="text-black whitespace-pre-wrap leading-relaxed">
              {currentTopic.content}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-1 flex justify-end border-t border-[#808080] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="win3-button font-bold min-w-[70px]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
