import React, { useState, useRef } from 'react';
import {
  CheckCircle2,
  Info,
  User,
  Users,
  Car,
  ThumbsUp,
  ThumbsDown,
  Navigation2,
  Navigation,
  MapPin,
  Sun,
  CloudRain,
  Cloud,
  Umbrella,
  Siren,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Gavel,
  Repeat,
  HelpCircle,
  CheckSquare,
  Square,
  Star,
  UploadCloud,
  Mic,
  MicOff,
  Camera,
  Loader2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  GripVertical
} from 'lucide-react';
import { Reorder, motion } from 'motion/react';
import { QuestionItem, EmergencyContact } from '../types';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  User,
  Users,
  Car,
  Navigation2,
  Navigation,
  MapPin,
  Sun,
  CloudRain,
  Cloud,
  Umbrella,
  Siren,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Gavel,
  Repeat,
  HelpCircle,
};

interface DynamicQuestionRendererProps {
  question: QuestionItem;
  step: number;
  totalSteps: number;
  value: any;
  scarAnalysis?: any;
  onChange: (value: any, extraData?: any) => void;
  onAutoAdvance?: () => void;
}

export function DynamicQuestionRenderer({
  question,
  step,
  totalSteps,
  value,
  scarAnalysis,
  onChange,
  onAutoAdvance,
}: DynamicQuestionRendererProps) {
  const percentage = Math.round((step / totalSteps) * 100);

  // States for specific interactive types
  const [isRecording, setIsRecording] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzingScar, setAnalyzingScar] = useState(false);
  const [scarError, setScarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSingleSelect = (val: string) => {
    onChange(val);
    if (onAutoAdvance) {
      setTimeout(() => {
        onAutoAdvance();
      }, 400);
    }
  };

  const handleBooleanSelect = (val: boolean) => {
    onChange(val);
    if (onAutoAdvance) {
      setTimeout(() => {
        onAutoAdvance();
      }, 400);
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        const textToAdd = value ? `${value} (เสียงบันทึก: อุบัติเหตุบริเวณหน้าประตูมหาวิทยาลัย)` : "เสียงบันทึก: อุบัติเหตุเฉียดชนบริเวณหน้ามหาวิทยาลัยช่วงเย็น";
        onChange(textToAdd);
        setIsRecording(false);
      }, 2500);
    }
  };

  const handleScarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setAnalyzingScar(true);
        setScarError(null);
        try {
          const res = await fetch('/api/analyze-scar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64 }),
          });
          if (!res.ok) throw new Error('การวิเคราะห์รูปภาพไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
          const result = await res.json();
          onChange(base64, result);
        } catch (err: any) {
          setScarError(err.message || 'เกิดข้อผิดพลาดในการวิเคราะห์');
          onChange(base64, null);
        } finally {
          setAnalyzingScar(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      {/* Step Indicator with Progress Ring */}
      <div className="flex flex-col items-center gap-2 mb-2">
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-16 h-16 -rotate-90">
            <circle
              className="text-surface-variant stroke-current"
              cx="32"
              cy="32"
              fill="transparent"
              r="26"
              strokeWidth="5"
            />
            <circle
              className="text-primary stroke-current transition-all duration-500 ease-out"
              cx="32"
              cy="32"
              fill="transparent"
              r="26"
              strokeWidth="5"
              strokeDasharray="163.3"
              strokeDashoffset={163.3 - (163.3 * (percentage / 100))}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-xs font-bold text-primary">{percentage}%</span>
        </div>
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.05em]">
          Question {step} of {totalSteps}
        </p>
      </div>

      {/* Optional Banner Image */}
      {question.bannerImage && (
        <div className="rounded-[24px] overflow-hidden shadow-sm aspect-[21/9] border border-outline-variant max-h-48">
          <img
            src={question.bannerImage}
            alt="Survey banner"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Main Question Card */}
      <div className="bg-white rounded-[24px] p-6 md:p-10 border border-outline-variant shadow-sm transition-all hover:border-secondary">
        {question.section && (
          <div className="mb-3 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block">
            {question.section}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-[0.05em] ${
                question.required
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {question.required ? 'Required' : 'Optional'}
            </span>
            <span className="text-xs font-medium text-on-surface-variant">
              ข้อที่ {step} ({question.key})
            </span>
          </div>
          {question.subtitle && (
            <span className="text-xs font-medium text-slate-400">
              {question.subtitle}
            </span>
          )}
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-6 leading-tight">
          {question.title}
        </h2>

        {/* LIKERT SCALE TYPE (5 Levels for Research Survey) */}
        {question.type === 'likert_scale' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {question.options?.map((opt) => {
                const isSelected = value === opt.label || value === opt.id || value === opt.score;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => handleSingleSelect(opt.label)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-md ring-2 ring-primary/30'
                        : 'bg-surface-container-low border-outline-variant hover:border-secondary hover:shadow-xs text-on-surface'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 shadow-2xs ${
                        isSelected
                          ? 'bg-white text-primary'
                          : 'bg-white border border-outline-variant text-slate-700'
                      }`}
                    >
                      {opt.score}
                    </div>
                    <span className="text-sm font-semibold text-center leading-snug">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="hidden sm:flex justify-between items-center text-xs text-slate-400 px-2 font-medium">
              <span>(5) เห็นด้วยมากที่สุด</span>
              <span>(3) ไม่แน่ใจ</span>
              <span>(1) ไม่เห็นด้วยมากที่สุด</span>
            </div>
          </div>
        )}

        {/* NUMBER INPUT TYPE */}
        {question.type === 'number_input' && (
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={10}
              max={100}
              value={value ?? ''}
              onChange={(e) => onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
              placeholder={question.placeholder || 'ระบุอายุเป็นตัวเลข (ปี)...'}
              className="w-full max-w-xs p-4 rounded-2xl border border-outline-variant bg-surface-container-low text-2xl font-bold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            <span className="text-lg font-semibold text-slate-600">ปี</span>
          </div>
        )}

        {/* 1. DROPDOWN TYPE */}
        {question.type === 'dropdown' && (
          <div className="relative">
            <select
              value={value || ''}
              onChange={(e) => {
                const val = e.target.value;
                onChange(val);
                if (val && onAutoAdvance) setTimeout(onAutoAdvance, 400);
              }}
              className="w-full p-4 rounded-2xl border border-outline-variant bg-surface-container-low text-lg font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
            >
              <option value="" disabled>
                {question.placeholder || '-- กรุณาเลือก --'}
              </option>
              {question.options?.map((opt) => (
                <option key={opt.id} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        )}

        {/* 2. SINGLE CHOICE (CARDS / RADIO) */}
        {question.type === 'single_choice' && (
          <div className="grid grid-cols-1 gap-3">
            {question.options?.map((opt) => {
              const isSelected = value === opt.id || value === opt.label;
              const IconComponent = opt.icon ? ICON_MAP[opt.icon] : null;

              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => handleSingleSelect(opt.id)}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-200 text-left active:scale-[0.99] ${
                    isSelected
                      ? 'bg-secondary-fixed border-primary shadow-sm ring-1 ring-primary'
                      : 'border-outline-variant bg-surface-container-low hover:border-secondary hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {IconComponent && (
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-primary text-white'
                            : 'bg-secondary-fixed text-primary'
                        }`}
                      >
                        <IconComponent size={20} />
                      </div>
                    )}
                    <div>
                      <p className="text-lg font-semibold text-on-surface">
                        {opt.label}
                      </p>
                      {opt.subtitle && (
                        <p className="text-xs text-on-surface-variant">
                          {opt.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <CheckCircle2
                    className={
                      isSelected
                        ? 'text-primary shrink-0 ml-2'
                        : 'text-outline-variant opacity-40 shrink-0 ml-2'
                    }
                    size={24}
                    fill={isSelected ? 'currentColor' : 'none'}
                    stroke={isSelected ? 'white' : 'currentColor'}
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* 3. BOOLEAN (YES / NO) */}
        {question.type === 'boolean' && (
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleBooleanSelect(true)}
              className={`flex flex-col items-center justify-center p-8 gap-4 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${
                value === true
                  ? 'bg-secondary-fixed border-primary shadow-sm text-primary ring-1 ring-primary'
                  : 'border-outline-variant bg-surface-container-low hover:border-secondary hover:shadow-md text-on-surface'
              }`}
            >
              <ThumbsUp size={44} />
              <span className="text-xl font-bold">มี (Yes)</span>
            </button>
            <button
              type="button"
              onClick={() => handleBooleanSelect(false)}
              className={`flex flex-col items-center justify-center p-8 gap-4 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${
                value === false
                  ? 'bg-red-50 border-red-500 shadow-sm text-red-600 ring-1 ring-red-400'
                  : 'border-outline-variant bg-surface-container-low hover:border-red-300 hover:shadow-md text-on-surface'
              }`}
            >
              <ThumbsDown size={44} />
              <span className="text-xl font-bold">ไม่มี (No)</span>
            </button>
          </div>
        )}

        {/* 4. TEXT INPUT */}
        {question.type === 'text_input' && (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || 'กรอกคำตอบของคุณที่นี่...'}
            className="w-full p-4 rounded-2xl border border-outline-variant bg-surface-container-low text-lg font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        )}

        {/* 5. MULTI SELECT */}
        {question.type === 'multi_select' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-on-surface-variant mb-1">
              คลิกเพื่อเลือกหรือยกเลิกสถานที่ที่เดินทางประจำ
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              {question.options?.map((opt) => {
                const currentList: string[] = Array.isArray(value) ? value : [];
                const isSelected = currentList.includes(opt.label) || currentList.includes(opt.id);

                const handleToggle = () => {
                  const targetVal = opt.label;
                  if (currentList.includes(targetVal)) {
                    onChange(currentList.filter((v) => v !== targetVal));
                  } else {
                    onChange([...currentList, targetVal]);
                  }
                };

                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={handleToggle}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-secondary-fixed border-primary shadow-sm text-primary font-semibold'
                        : 'border-outline-variant bg-surface-container-low hover:border-secondary text-on-surface'
                    }`}
                  >
                    <span className="text-base">{opt.label}</span>
                    <CheckCircle2
                      size={20}
                      className={isSelected ? 'text-primary' : 'text-slate-300'}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. MULTI CHOICE (CHECKBOXES) */}
        {question.type === 'multi_choice' && (
          <div className="grid grid-cols-1 gap-3">
            {question.options?.map((opt) => {
              const currentList: string[] = Array.isArray(value) ? value : [];
              const isSelected = currentList.includes(opt.id);

              const handleToggle = () => {
                if (isSelected) {
                  onChange(currentList.filter((v) => v !== opt.id));
                } else {
                  onChange([...currentList, opt.id]);
                }
              };

              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={handleToggle}
                  className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 active:scale-[0.99] text-left ${
                    isSelected
                      ? 'bg-secondary-fixed border-primary shadow-sm'
                      : 'border-outline-variant bg-surface-container-low hover:border-secondary hover:shadow-sm'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary text-white'
                        : 'border-outline bg-white'
                    }`}
                  >
                    {isSelected ? <CheckSquare size={16} /> : <Square size={16} className="opacity-0" />}
                  </div>
                  <span
                    className={`text-lg font-semibold ${
                      isSelected ? 'text-primary' : 'text-on-surface'
                    }`}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 7. IMAGE PICKER */}
        {question.type === 'image_picker' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {question.options?.map((type) => {
              const isSelected = value === type.id;
              return (
                <label key={type.id} className="group relative cursor-pointer">
                  <input
                    type="radio"
                    name={question.key}
                    className="sr-only"
                    value={type.id}
                    checked={isSelected}
                    onChange={() => handleSingleSelect(type.id)}
                  />
                  <div
                    className={`h-full flex flex-col items-center p-6 bg-surface-container-low border rounded-2xl transition-all duration-200 ${
                      isSelected
                        ? 'border-primary bg-secondary-fixed ring-1 ring-primary shadow-sm'
                        : 'border-outline-variant hover:border-secondary hover:shadow-md'
                    }`}
                  >
                    <div className="w-24 h-24 mb-4 overflow-hidden rounded-lg bg-white p-2 flex items-center justify-center">
                      {type.image ? (
                        <img
                          src={type.image}
                          alt={type.label}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <CheckCircle2 size={36} className="text-primary" />
                      )}
                    </div>
                    <span className="text-base font-bold text-on-surface text-center">
                      {type.label}
                    </span>
                    {type.subtitle && (
                      <span className="text-xs text-on-surface-variant text-center">
                        {type.subtitle}
                      </span>
                    )}
                    <div
                      className={`mt-4 transition-opacity ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                      }`}
                    >
                      <CheckCircle2 className="text-primary" size={24} />
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}

        {/* 8. STAR RATING */}
        {question.type === 'star_rating' && (
          <div className="flex flex-col items-center py-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => {
                    onChange(star);
                    if (onAutoAdvance) setTimeout(onAutoAdvance, 400);
                  }}
                  className={`p-2 transition-transform active:scale-90 hover:scale-110 ${
                    (value || 0) >= star ? 'text-amber-400' : 'text-slate-300'
                  }`}
                >
                  <Star
                    size={48}
                    fill={(value || 0) >= star ? 'currentColor' : 'none'}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
            <div className="flex justify-between w-full max-w-sm mt-4 text-sm font-medium text-on-surface-variant px-2">
              <span>{question.minLabel || 'แย่มาก (1)'}</span>
              <span>{question.maxLabel || 'ดีมาก (5)'}</span>
            </div>
          </div>
        )}

        {/* 9. SLIDER (GAUGE) */}
        {question.type === 'slider' && (
          <div className="flex flex-col items-center gap-8 py-4">
            <div className="text-6xl font-black text-primary tracking-tight">
              {value ?? 5}
            </div>
            <div className="w-full max-w-md flex flex-col gap-4">
              <input
                type="range"
                min={question.min || 1}
                max={question.max || 10}
                value={value ?? 5}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
                className="w-full accent-primary h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between w-full text-sm text-on-surface-variant font-medium">
                <span>{question.minLabel || 'ไม่มั่นใจเลย (1)'}</span>
                <span>{question.maxLabel || 'มั่นใจมาก (10)'}</span>
              </div>
            </div>
          </div>
        )}

        {/* 10. RANK ORDER */}
        {question.type === 'rank_order' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-on-surface-variant mb-2">
              กดลูกศรขึ้น/ลง หรือลากและวางเพื่อจัดอันดับความสำคัญ
            </p>
            {(() => {
              const defaultRank = question.options?.map((o) => o.label) || [];
              const currentRanking: string[] =
                Array.isArray(value) && value.length > 0 ? value : defaultRank;

              const moveUp = (index: number) => {
                if (index === 0) return;
                const updated = [...currentRanking];
                [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
                onChange(updated);
              };

              const moveDown = (index: number) => {
                if (index === currentRanking.length - 1) return;
                const updated = [...currentRanking];
                [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
                onChange(updated);
              };

              return (
                <Reorder.Group
                  axis="y"
                  values={currentRanking}
                  onReorder={onChange}
                  className="flex flex-col gap-2.5"
                >
                  {currentRanking.map((item, index) => (
                    <Reorder.Item
                      key={item}
                      value={item}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-outline-variant bg-white shadow-sm cursor-grab active:cursor-grabbing relative z-0"
                    >
                      <GripVertical className="text-slate-400 shrink-0" size={20} />
                      <div className="w-8 h-8 rounded-full bg-secondary-fixed text-primary font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>
                      <span className="flex-grow font-medium text-base text-on-surface">
                        {item}
                      </span>
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveUp(index);
                          }}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 transition-colors"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button
                          type="button"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveDown(index);
                          }}
                          disabled={index === currentRanking.length - 1}
                          className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 transition-colors"
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              );
            })()}
          </div>
        )}

        {/* 11. PHOTO UPLOAD */}
        {question.type === 'photo_upload' && (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                onChange(e.dataTransfer.files[0].name);
              }
            }}
            className={`flex flex-col items-center justify-center w-full h-60 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
              isDragging
                ? 'border-primary bg-secondary-fixed/50'
                : 'border-outline-variant bg-surface-container-low hover:bg-surface-container-high'
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
              <UploadCloud
                size={44}
                className={`mb-3 ${
                  isDragging ? 'text-primary' : 'text-on-surface-variant'
                }`}
              />
              {value ? (
                <div className="space-y-1">
                  <p className="text-base font-semibold text-primary">
                    ไฟล์ที่เลือก: {value}
                  </p>
                  <p className="text-xs text-slate-500">คลิกเพื่อเปลี่ยนไฟล์ภาพ</p>
                </div>
              ) : (
                <>
                  <p className="mb-1 text-base font-semibold text-on-surface">
                    คลิกเพื่ออัปโหลด หรือลากไฟล์รูปภาพมาวางที่นี่
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    รองรับไฟล์ PNG, JPG, GIF หรือ WebP
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onChange(e.target.files[0].name);
                }
              }}
            />
          </label>
        )}

        {/* 12. VOICE TEXTAREA */}
        {question.type === 'voice_textarea' && (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <textarea
                className="w-full h-40 p-4 pb-14 rounded-2xl border border-outline-variant bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none font-sans"
                placeholder={question.placeholder || 'พิมพ์คำตอบของคุณที่นี่...'}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
              />
              <button
                type="button"
                onClick={handleVoiceToggle}
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
              <p className="text-sm text-red-500 text-center animate-pulse">
                กำลังจำลองการบันทึกเสียงและแปลงเป็นข้อความ...
              </p>
            )}
          </div>
        )}

        {/* 13. SCAR ANALYSIS (AI) */}
        {question.type === 'scar_analysis' && (
          <div className="space-y-4">
            {!value ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video md:aspect-[16/9] border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center gap-3 bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Camera size={28} />
                </div>
                <div className="text-center px-4">
                  <p className="font-medium text-on-surface">คลิกเพื่อถ่ายภาพหรือเลือกไฟล์รูปภาพรอยแผล</p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    ระบบ AI จะวิเคราะห์ระดับความรุนแรงและให้คำแนะนำในการขับขี่
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden aspect-video md:aspect-[16/9] bg-surface-container border border-outline-variant">
                  <img
                    src={value}
                    alt="Scar preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onChange(null, null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-full text-xs font-semibold hover:bg-red-700 transition-colors shadow-sm"
                  >
                    ถ่ายใหม่ / เปลี่ยนรูป
                  </button>
                </div>

                {analyzingScar && (
                  <div className="flex flex-col items-center justify-center py-6 gap-3 bg-surface-container-lowest rounded-2xl border border-outline-variant">
                    <Loader2 className="animate-spin text-primary" size={28} />
                    <p className="text-on-surface-variant font-medium text-sm">
                      กำลังประเมินรอยแผลด้วยระบบ AI...
                    </p>
                  </div>
                )}

                {scarError && (
                  <div className="p-4 rounded-xl bg-red-50 text-red-700 flex items-start gap-3 border border-red-200 text-sm">
                    <AlertCircle className="shrink-0 mt-0.5" size={18} />
                    <p>{scarError}</p>
                  </div>
                )}

                {scarAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-indigo-50 text-indigo-900 p-5 rounded-2xl space-y-3 shadow-sm border border-indigo-100"
                  >
                    <div className="flex items-center justify-between border-b border-indigo-200/50 pb-3">
                      <h3 className="font-bold text-base">ผลการประเมินจากระบบ AI</h3>
                      <div className="flex items-center gap-2 bg-white/70 px-3 py-1 rounded-full text-xs font-semibold">
                        <span>ระดับความรุนแรง: {scarAnalysis.severity || 2}/5</span>
                      </div>
                    </div>
                    {scarAnalysis.empathyMessage && (
                      <p className="text-sm leading-relaxed">{scarAnalysis.empathyMessage}</p>
                    )}
                    {scarAnalysis.advice && (
                      <p className="text-sm font-medium text-indigo-800 bg-white/60 p-3 rounded-xl border border-indigo-100">
                        คำแนะนำความปลอดภัย: {scarAnalysis.advice}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleScarUpload}
            />
          </div>
        )}

        {/* 14. EMERGENCY CONTACT FORM */}
        {question.type === 'contact_form' && (
          <div className="flex flex-col gap-4">
            {(() => {
              const contact: EmergencyContact = value || { name: '', phone: '', relation: '' };
              const updateField = (field: keyof EmergencyContact, val: string) => {
                onChange({ ...contact, [field]: val });
              };

              return (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2">
                      ชื่อ-นามสกุล (Name)
                    </label>
                    <input
                      type="text"
                      value={contact.name || ''}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="เช่น สมชาย ใจดี"
                      className="w-full p-4 rounded-2xl border border-outline-variant bg-surface-container-low text-base font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2">
                      เบอร์โทรศัพท์ (Phone Number)
                    </label>
                    <input
                      type="tel"
                      value={contact.phone || ''}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="เช่น 081-234-5678"
                      className="w-full p-4 rounded-2xl border border-outline-variant bg-surface-container-low text-base font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2">
                      ความสัมพันธ์ (Relationship)
                    </label>
                    <input
                      type="text"
                      value={contact.relation || ''}
                      onChange={(e) => updateField('relation', e.target.value)}
                      placeholder="เช่น บิดา / มารดา / ญาติสนิท"
                      className="w-full p-4 rounded-2xl border border-outline-variant bg-surface-container-low text-base font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* 15. TEXTAREA */}
        {question.type === 'textarea' && (
          <textarea
            className="w-full h-36 p-4 rounded-2xl border border-outline-variant bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
            placeholder={question.placeholder || 'พิมพ์ข้อความของคุณที่นี่...'}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>

      {/* Note message */}
      {question.note && (
        <div className="flex items-center gap-3 p-4 bg-tertiary-container/10 border border-tertiary-container/30 rounded-xl">
          <Info className="text-tertiary shrink-0" size={18} />
          <p className="text-xs text-tertiary">{question.note}</p>
        </div>
      )}
    </div>
  );
}
