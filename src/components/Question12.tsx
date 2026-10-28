interface Props {
  value: string | null;
  onChange: (value: string) => void;
  step: number;
  totalSteps: number;
}

export function Question12({ value, onChange, step, totalSteps }: Props) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-white rounded-[24px] p-6 md:p-10 border border-outline-variant shadow-sm transition-all hover:border-secondary">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-[0.05em]">Optional</span>
          <span className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.05em]">Question {step} of {totalSteps}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">รถจักรยานยนต์ที่คุณใช้งานหลักคือรุ่นใด?</h2>
        <p className="text-on-surface-variant mb-8">Single-Line Input</p>
        
        <input 
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="เช่น Honda Wave 110i, Yamaha Grand Filano..."
          className="w-full p-4 rounded-2xl border border-outline-variant bg-surface-container-low text-lg font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        />
      </div>
    </div>
  );
}
