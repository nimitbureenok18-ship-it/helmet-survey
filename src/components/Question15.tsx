import { UploadCloud } from 'lucide-react';
import React, { useState } from 'react';

interface Props {
  value: string | null;
  onChange: (value: string) => void;
  step: number;
  totalSteps: number;
}

export function Question15({ value, onChange, step, totalSteps }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0].name);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0].name);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-white rounded-[24px] p-6 md:p-10 border border-outline-variant shadow-sm transition-all hover:border-secondary">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-[0.05em]">Optional</span>
          <span className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.05em]">Question {step} of {totalSteps}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">อัปโหลดรูปภาพหมวกกันน็อคของคุณ</h2>
        <p className="text-on-surface-variant mb-8">File Upload</p>
        
        <label 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
            isDragging ? 'border-primary bg-secondary-fixed/50' : 'border-outline-variant bg-surface-container-low hover:bg-surface-container-high'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud size={48} className={`mb-4 ${isDragging ? 'text-primary' : 'text-on-surface-variant'}`} />
            {value ? (
              <p className="mb-2 text-lg font-semibold text-primary">ไฟล์ที่เลือก: {value}</p>
            ) : (
              <>
                <p className="mb-2 text-lg font-semibold text-on-surface">คลิกเพื่ออัปโหลด หรือลากไฟล์มาวางที่นี่</p>
                <p className="text-sm text-on-surface-variant">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </>
            )}
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleChange} />
        </label>
      </div>
    </div>
  );
}
