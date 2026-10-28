import React, { useState, useRef, ChangeEvent } from 'react';
import {
  FileJson,
  Upload,
  Download,
  RotateCcw,
  Check,
  AlertCircle,
  X,
  Search,
  Eye,
  Code2
} from 'lucide-react';
import { QuestionItem } from '../types';

interface QuestionFileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuestionItem[];
  onUpdateQuestions: (newQuestions: QuestionItem[]) => void;
  onResetToDefault: () => void;
}

export function QuestionFileManagerModal({
  isOpen,
  onClose,
  questions,
  onUpdateQuestions,
  onResetToDefault,
}: QuestionFileManagerModalProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadStatus, setUploadStatus] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(questions, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'questions.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error('รูปแบบไฟล์ไม่ถูกต้อง: ต้องเป็น Array ของข้อคำถาม');
        }
        // Normalize questions with step numbers
        const sanitized: QuestionItem[] = parsed.map((q, idx) => ({
          id: q.id || `q${idx + 1}`,
          stepNumber: idx + 1,
          key: q.key || `question_${idx + 1}`,
          title: q.title || `คำถามข้อที่ ${idx + 1}`,
          subtitle: q.subtitle || '',
          type: q.type || 'single_choice',
          required: q.required ?? true,
          options: q.options || [],
          bannerImage: q.bannerImage,
          placeholder: q.placeholder,
          min: q.min,
          max: q.max,
          minLabel: q.minLabel,
          maxLabel: q.maxLabel,
          note: q.note,
        }));

        onUpdateQuestions(sanitized);
        setUploadStatus({
          success: true,
          message: `นำเข้าข้อคำถามสำเร็จแล้วทั้งหมด ${sanitized.length} ข้อ!`,
        });
        setTimeout(() => setUploadStatus(null), 4000);
      } catch (err: any) {
        setUploadStatus({
          success: false,
          message: err.message || 'ไม่สามารถอ่านไฟล์ JSON ได้ กรุณาตรวจสอบรูปแบบ',
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileJson size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                จัดการและใส่ข้อคำถามในไฟล์ (Question Data File)
              </h3>
              <p className="text-xs text-slate-500">
                ไฟล์ข้อมูล: <span className="font-mono text-indigo-600">src/data/questions.json</span> ({questions.length} ข้อคำถาม)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-slate-50 border-b border-slate-200 text-sm">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'preview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye size={14} />
              รายการคำถาม ({questions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'json'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 size={14} />
              โค้ด JSON
            </button>
          </div>

          {/* Quick File Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-medium shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <Download size={14} />
              ดาวน์โหลด questions.json
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium shadow-2xs transition-colors"
            >
              <Upload size={14} />
              นำเข้าไฟล์ JSON
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('ต้องการคืนค่าข้อคำถามตั้งต้นทั้งหมด 20 ข้อใช่หรือไม่?')) {
                  onResetToDefault();
                  setUploadStatus({
                    success: true,
                    message: 'คืนค่าชุดข้อคำถามตั้งต้นเรียบร้อยแล้ว',
                  });
                  setTimeout(() => setUploadStatus(null), 3000);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 rounded-xl text-xs font-medium transition-colors"
            >
              <RotateCcw size={14} />
              คืนค่าเริ่มต้น
            </button>

            <input
              type="file"
              accept=".json,application/json"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Upload Status Banner */}
        {uploadStatus && (
          <div
            className={`px-6 py-2.5 flex items-center gap-2 text-xs font-semibold ${
              uploadStatus.success
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-100'
                : 'bg-red-50 text-red-800 border-b border-red-100'
            }`}
          >
            {uploadStatus.success ? (
              <Check size={16} className="text-emerald-600" />
            ) : (
              <AlertCircle size={16} className="text-red-600" />
            )}
            <span>{uploadStatus.message}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'preview' ? (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาข้อคำถาม คีย์ หรือชนิด..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              {/* Questions List */}
              <div className="space-y-2.5">
                {filteredQuestions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        #{q.stepNumber || idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900">
                            {q.title}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              q.required
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {q.required ? 'จำเป็น' : 'ไม่บังคับ'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-mono">
                          <span>key: {q.key}</span>
                          <span>·</span>
                          <span>type: {q.type}</span>
                          {q.options && q.options.length > 0 && (
                            <>
                              <span>·</span>
                              <span>{q.options.length} ตัวเลือก</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredQuestions.length === 0 && (
                  <div className="text-center py-12 text-slate-400 text-sm">
                    ไม่พบข้อคำถามที่ตรงกับการค้นหา
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="relative">
              <pre className="p-4 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed">
                {JSON.stringify(questions, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <p>
            คุณสามารถแก้ไขไฟล์ <span className="font-mono text-slate-700">/src/data/questions.json</span> ในโปรเจกต์ได้โดยตรง
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
