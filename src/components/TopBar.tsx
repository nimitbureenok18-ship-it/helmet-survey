import { ArrowLeft, FileJson, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface TopBarProps {
  progress?: number;
  onOpenFileManager?: () => void;
  onReset?: () => void;
  questionCount?: number;
}

export function TopBar({ progress, onOpenFileManager, onReset, questionCount }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-40 flex flex-col bg-surface/90 backdrop-blur-md border-b border-outline-variant">
      <div className="flex justify-between items-center px-4 md:px-6 h-16 w-full max-w-4xl mx-auto">
        {/* Brand / Left Zone */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs tracking-wider">
            NRRU
          </div>
          <span className="text-base md:text-lg font-bold tracking-tight text-on-surface whitespace-nowrap">
            วิจัยการสวมหมวกนิรภัย NRRU
          </span>
        </div>

        {/* Action Controls / Right Zone */}
        <div className="flex items-center gap-2">
          {onOpenFileManager && (
            <button
              type="button"
              onClick={onOpenFileManager}
              title="ดู/จัดการไฟล์ข้อคำถาม (questions.json)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-secondary-fixed text-primary hover:bg-indigo-100 transition-colors border border-primary/20 shadow-2xs whitespace-nowrap shrink-0"
            >
              <FileJson size={16} />
              <span>ไฟล์คำถาม {questionCount ? `(${questionCount})` : ''}</span>
            </button>
          )}

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              title="เริ่มทำแบบสอบถามใหม่"
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors rounded-xl"
            >
              <RotateCcw size={18} />
            </button>
          )}
        </div>
      </div>

      {progress !== undefined && (
        <div className="w-full h-1 bg-surface-container-high relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary origin-left"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      )}
    </header>
  );
}
