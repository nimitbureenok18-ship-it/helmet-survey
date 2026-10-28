import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface Props {
  value: boolean | null;
  onChange: (value: boolean) => void;
  step: number;
  totalSteps: number;
}

export function Question10({ value, onChange, step, totalSteps }: Props) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-white rounded-[24px] p-6 md:p-10 border border-outline-variant shadow-sm transition-all hover:border-secondary">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-[0.05em]">Required</span>
          <span className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.05em]">Question {step} of {totalSteps}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">คุณมีใบอนุญาตขับขี่รถจักรยานยนต์หรือไม่?</h2>
        <p className="text-on-surface-variant mb-8">Yes/No (Boolean)</p>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => onChange(true)}
            className={`flex flex-col items-center justify-center p-8 gap-4 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${value === true ? 'bg-secondary-fixed border-primary shadow-sm text-primary' : 'border-outline-variant bg-surface-container-low hover:border-secondary hover:shadow-md text-on-surface'}`}
          >
            <ThumbsUp size={48} />
            <span className="text-xl font-bold">มี (Yes)</span>
          </button>
          <button 
            onClick={() => onChange(false)}
            className={`flex flex-col items-center justify-center p-8 gap-4 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${value === false ? 'bg-red-100 border-red-500 shadow-sm text-red-600' : 'border-outline-variant bg-surface-container-low hover:border-red-400 hover:shadow-md text-on-surface'}`}
          >
            <ThumbsDown size={48} />
            <span className="text-xl font-bold">ไม่มี (No)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
