import { Mic, MicOff } from 'lucide-react';
import { useState } from 'react';

interface Question6Props {
  value: string | null;
  onChange: (value: string) => void;
  step: number;
  totalSteps: number;
}

export function Question6({ value, onChange, step, totalSteps }: Question6Props) {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        onChange((value || "") + " (เสียงที่บันทึกไว้: อุบัติเหตุเล็กน้อยบริเวณแยกหน้ามหาวิทยาลัย)");
        setIsRecording(false);
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-white rounded-[24px] p-6 md:p-10 border border-outline-variant shadow-sm transition-all hover:border-secondary">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-[0.05em]">Optional</span>
          <span className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.05em]">Question {step} of {totalSteps}</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">
          โปรดอธิบายประสบการณ์เฉียดอุบัติเหตุ (ถ้ามี)
        </h2>
        <p className="text-on-surface-variant mb-8">Long Text with Voice Input (Microphone)</p>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              className="w-full h-40 p-4 pb-14 rounded-2xl border border-outline-variant bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
              placeholder="พิมพ์คำตอบของคุณที่นี่ หรือกดปุ่มไมโครโฟนเพื่อพูด..."
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            />
            <button 
              onClick={toggleRecording}
              className={`absolute bottom-4 right-4 p-3 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                isRecording 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-primary text-white hover:bg-secondary'
              }`}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          </div>
          {isRecording && (
            <p className="text-sm text-red-500 text-center animate-pulse">กำลังบันทึกเสียง...</p>
          )}
        </div>
      </div>
    </div>
  );
}
