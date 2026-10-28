import React from 'react';
interface Props {
  value: string[];
  onChange: (value: string[]) => void;
  step: number;
  totalSteps: number;
}

const LOCATIONS = [
  'อาคารเรียนรวม (Central Lecture Building)',
  'โรงอาหาร (Cafeteria)',
  'ห้องสมุด (Library)',
  'สนามกีฬา (Sports Complex)',
  'หอพัก (Dormitory)'
];

export function Question9({ value, onChange, step, totalSteps }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
    onChange(selected);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-white rounded-[24px] p-6 md:p-10 border border-outline-variant shadow-sm transition-all hover:border-secondary">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-[0.05em]">Optional</span>
          <span className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.05em]">Question {step} of {totalSteps}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">สถานที่ที่คุณมักจะขับขี่ไปเป็นประจำ?</h2>
        <p className="text-on-surface-variant mb-8">กด Ctrl (Windows) หรือ Command (Mac) เพื่อเลือกหลายข้อ (Multi-Select Dropdown)</p>
        <select 
          multiple
          value={value} 
          onChange={handleChange}
          className="w-full p-4 rounded-2xl border border-outline-variant bg-surface-container-low text-lg font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none h-48"
        >
          {LOCATIONS.map(loc => <option key={loc} value={loc} className="p-2 my-1 rounded-lg">{loc}</option>)}
        </select>
      </div>
    </div>
  );
}
