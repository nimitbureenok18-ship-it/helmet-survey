interface ContactData {
  name: string;
  phone: string;
  relation: string;
}

interface Props {
  value: ContactData;
  onChange: (value: ContactData) => void;
  step: number;
  totalSteps: number;
}

export function Question13({ value, onChange, step, totalSteps }: Props) {
  const updateField = (field: keyof ContactData, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-white rounded-[24px] p-6 md:p-10 border border-outline-variant shadow-sm transition-all hover:border-secondary">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-[0.05em]">Optional</span>
          <span className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.05em]">Question {step} of {totalSteps}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">ข้อมูลผู้ติดต่อกรณีฉุกเฉิน</h2>
        <p className="text-on-surface-variant mb-8">Multiple Textboxes</p>
        
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">ชื่อ-นามสกุล (Name)</label>
            <input 
              type="text"
              value={value.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full p-4 rounded-2xl border border-outline-variant bg-surface-container-low text-lg font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">เบอร์โทรศัพท์ (Phone Number)</label>
            <input 
              type="tel"
              value={value.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full p-4 rounded-2xl border border-outline-variant bg-surface-container-low text-lg font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">ความสัมพันธ์ (Relationship)</label>
            <input 
              type="text"
              value={value.relation}
              onChange={(e) => updateField('relation', e.target.value)}
              className="w-full p-4 rounded-2xl border border-outline-variant bg-surface-container-low text-lg font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
