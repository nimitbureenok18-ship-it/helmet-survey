import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldCheck, HeartPulse, Download, BrainCircuit, Activity, AlertTriangle, Lightbulb, Loader2, Users, Zap, RotateCcw, Database } from 'lucide-react';
import { motion } from 'motion/react';
import jsPDF from 'jspdf';
import { SurveyData, QuestionItem } from '../types';
import { saveSurveyToSupabase, isSupabaseConfigured } from '../lib/supabase';

interface Props {
  data?: SurveyData;
  onReset?: () => void;
  questions?: QuestionItem[];
}

interface SurveyAnalysis {
  persona?: {
    title: string;
    emoji: string;
    description: string;
  };
  riskProfile: string;
  behavioralArchetype: string;
  theoreticalMetrics?: {
    tpb: { score: number; insight: string };
    hbm: { score: number; insight: string };
    riskCompensation: { score: number; insight: string };
  };
  keyInsights: string[];
  recommendedInterventions: string[];
}

export function SuccessScreen({ data, onReset, questions }: Props) {
  const analysis = data?.scarAnalysis;
  const [surveyAnalysis, setSurveyAnalysis] = useState<SurveyAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<{ saved: boolean; loading: boolean; error?: string }>({
    saved: false,
    loading: false,
  });

  useEffect(() => {
    if (data && isSupabaseConfigured && !supabaseStatus.saved && !supabaseStatus.loading) {
      setSupabaseStatus({ saved: false, loading: true });
      saveSurveyToSupabase(data).then((res) => {
        if (res.success) {
          setSupabaseStatus({ saved: true, loading: false });
        } else {
          setSupabaseStatus({ saved: false, loading: false, error: res.error });
        }
      });
    }
  }, [data, supabaseStatus.saved, supabaseStatus.loading]);

  useEffect(() => {
    if (data && !surveyAnalysis && !analyzing) {
      setAnalyzing(true);
      fetch('/api/analyze-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ surveyData: data }),
      })
        .then((res) => res.json())
        .then((result) => setSurveyAnalysis(result))
        .catch((err) => console.error("Error analyzing survey:", err))
        .finally(() => setAnalyzing(false));
    }
  }, [data, surveyAnalysis, analyzing]);

  const handleDownloadPDF = () => {
    if (!data) return;
    
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;
    const pageHeight = doc.internal.pageSize.height;
    
    const checkPageBreak = (spaceNeeded: number) => {
      if (y + spaceNeeded > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };
    
    doc.setFontSize(20);
    doc.text('Helmet Safety Survey Summary', margin, y);
    y += 15;
    
    doc.setFontSize(12);
    
    const addLine = (label: string, value: string | number | boolean | null | undefined) => {
      if (value === null || value === undefined || value === '') return;
      checkPageBreak(10);
      const text = `${label}: ${value}`;
      
      // Split text if it's too long
      const splitText = doc.splitTextToSize(text, 170);
      doc.text(splitText, margin, y);
      y += (splitText.length * 7);
    };

    if (questions && questions.length > 0) {
      questions.forEach((q) => {
        const val = data[q.key];
        if (val !== null && val !== undefined && val !== '') {
          const displayVal = typeof val === 'object' 
            ? (Array.isArray(val) ? val.join(', ') : JSON.stringify(val))
            : String(val);
          addLine(`[ข้อ ${q.stepNumber}] ${q.title}`, displayVal);
        }
      });
    } else {
      Object.entries(data).forEach(([key, val]) => {
        if (key === 'scarAnalysis') return;
        if (val !== null && val !== undefined && val !== '') {
          addLine(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
        }
      });
    }

    if (surveyAnalysis) {
      checkPageBreak(30);
      y += 5;
      doc.setFontSize(16);
      doc.text('Traffic Engineering Analysis', margin, y);
      y += 10;
      doc.setFontSize(12);

      if (surveyAnalysis.persona) {
        addLine('Persona', `${surveyAnalysis.persona.emoji} ${surveyAnalysis.persona.title}`);
        addLine('Persona Description', surveyAnalysis.persona.description);
      }

      addLine('Risk Profile', surveyAnalysis.riskProfile);
      addLine('Behavioral Archetype', surveyAnalysis.behavioralArchetype);
      
      if (surveyAnalysis.keyInsights && surveyAnalysis.keyInsights.length > 0) {
        checkPageBreak(10);
        doc.text('Key Insights:', margin, y);
        y += 7;
        surveyAnalysis.keyInsights.forEach((item, idx) => {
          checkPageBreak(7);
          const splitText = doc.splitTextToSize(`- ${item}`, 160);
          doc.text(splitText, margin + 5, y);
          y += (splitText.length * 7);
        });
      }
      
      if (surveyAnalysis.recommendedInterventions && surveyAnalysis.recommendedInterventions.length > 0) {
        checkPageBreak(10);
        doc.text('Recommended Interventions:', margin, y);
        y += 7;
        surveyAnalysis.recommendedInterventions.forEach((item, idx) => {
          checkPageBreak(7);
          const splitText = doc.splitTextToSize(`- ${item}`, 160);
          doc.text(splitText, margin + 5, y);
          y += (splitText.length * 7);
        });
      }

      if (surveyAnalysis.theoreticalMetrics) {
        checkPageBreak(30);
        y += 5;
        doc.setFontSize(14);
        doc.text('Psychological Frameworks', margin, y);
        y += 10;
        doc.setFontSize(12);
        
        addLine('TPB Score', surveyAnalysis.theoreticalMetrics.tpb.score);
        addLine('TPB Insight', surveyAnalysis.theoreticalMetrics.tpb.insight);
        
        addLine('HBM Score', surveyAnalysis.theoreticalMetrics.hbm.score);
        addLine('HBM Insight', surveyAnalysis.theoreticalMetrics.hbm.insight);
        
        addLine('Risk Comp Score', surveyAnalysis.theoreticalMetrics.riskCompensation.score);
        addLine('Risk Comp Insight', surveyAnalysis.theoreticalMetrics.riskCompensation.insight);
      }
    }
    
    if (analysis) {
      checkPageBreak(30);
      y += 5;
      doc.setFontSize(16);
      doc.text('AI Scar Assessment', margin, y);
      y += 10;
      doc.setFontSize(12);
      addLine('Severity (1-5)', analysis.severity);
      addLine('Observation', analysis.empathyMessage);
      addLine('Recommendation', analysis.advice);
    }
    
    doc.save('helmet-survey-summary.pdf');
  };

  const handleDownloadCSV = () => {
    if (!data) return;
    const rows = [
      ['Question ID', 'Question Title', 'Key', 'Answer']
    ];

    if (questions && questions.length > 0) {
      questions.forEach((q) => {
        const rawVal = data[q.key];
        let displayVal = '';
        if (typeof rawVal === 'object' && rawVal !== null) {
          if (Array.isArray(rawVal)) {
            displayVal = rawVal.join('; ');
          } else {
            displayVal = JSON.stringify(rawVal);
          }
        } else {
          displayVal = rawVal !== undefined && rawVal !== null ? String(rawVal) : '';
        }
        rows.push([q.id, `"${(q.title || '').replace(/"/g, '""')}"`, q.key, `"${displayVal.replace(/"/g, '""')}"`]);
      });
    } else {
      Object.entries(data).forEach(([k, v]) => {
        if (k === 'scarAnalysis') return;
        const displayVal = typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v ?? '');
        rows.push([k, k, k, `"${displayVal.replace(/"/g, '""')}"`]);
      });
    }

    const csvContent = '\uFEFF' + rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'helmet-survey-results.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getRiskColor = (profile: string) => {
    const p = profile.toLowerCase();
    if (p.includes('high')) return 'text-error bg-error-container';
    if (p.includes('low')) return 'text-primary bg-primary-container';
    return 'text-tertiary bg-tertiary-container';
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 md:px-12 text-center bg-surface-container-lowest rounded-[32px] border border-outline-variant shadow-sm mt-8 mx-auto w-full max-w-2xl">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
        className="w-24 h-24 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mb-8 shadow-sm"
      >
        <CheckCircle2 size={48} />
      </motion.div>
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-on-surface mb-4"
      >
        ขอบคุณสำหรับข้อมูล!
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-on-surface-variant max-w-lg mx-auto text-lg mb-8 leading-relaxed"
      >
        คำตอบของคุณถูกบันทึกเรียบร้อยแล้ว ข้อมูลนี้จะช่วยให้เราเข้าใจและพัฒนาความปลอดภัยในการขับขี่ได้ดียิ่งขึ้น
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap gap-3 mb-8 w-full justify-center"
      >
        <button
          onClick={handleDownloadPDF}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-xl font-semibold shadow-sm hover:bg-primary/90 transition-colors active:scale-95 text-sm"
        >
          <Download size={18} />
          ดาวน์โหลด PDF
        </button>
        <button
          onClick={handleDownloadCSV}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-outline-variant text-on-surface rounded-xl font-semibold shadow-xs hover:bg-surface-container-low transition-colors active:scale-95 text-sm"
        >
          <Download size={18} />
          ดาวน์โหลด CSV
        </button>
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-secondary-container text-on-secondary-container rounded-xl font-semibold shadow-xs hover:bg-secondary-container/80 transition-colors active:scale-95 text-sm"
          >
            <RotateCcw size={18} />
            ทำแบบสอบถามใหม่
          </button>
        )}
      </motion.div>

      {/* Database Status Indicator */}
      <div className="mb-6 flex justify-center w-full">
        {isSupabaseConfigured ? (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            <Database size={14} className="text-emerald-600" />
            {supabaseStatus.loading ? (
              <span>กำลังส่งข้อมูลไปบันทึกที่ Supabase...</span>
            ) : supabaseStatus.saved ? (
              <span>บันทึกผลลงฐานข้อมูล Supabase สำเร็จ</span>
            ) : supabaseStatus.error ? (
              <span className="text-red-600">ข้อผิดพลาด Supabase: {supabaseStatus.error}</span>
            ) : (
              <span>เชื่อมต่อฐานข้อมูล Supabase พร้อมใช้งาน</span>
            )}
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-slate-500 bg-slate-100/80">
            <Database size={13} className="text-slate-400" />
            <span>บันทึกในเครื่อง (พร้อมเชื่อมต่อ Supabase ด้วย VITE_SUPABASE_URL)</span>
          </div>
        )}
      </div>

      {analyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3 w-full p-8 bg-surface-container rounded-3xl mb-8 border border-outline-variant/30"
        >
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-on-surface-variant font-medium">กำลังวิเคราะห์ข้อมูล (Generating Engineering Analysis)...</p>
        </motion.div>
      )}

      {surveyAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full space-y-8"
        >
          {surveyAnalysis.persona && (
            <div className="relative overflow-hidden bg-surface-container-lowest p-8 md:p-12 rounded-3xl text-center border border-outline-variant shadow-sm">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#gridPattern)" />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary-container text-on-primary-container text-sm font-bold tracking-widest mb-6">
                  บุคลิกการขับขี่ของคุณ (RIDER PERSONA)
                </div>
                <div className="text-7xl mb-6 drop-shadow-sm">{surveyAnalysis.persona.emoji}</div>
                <h2 className="text-3xl md:text-4xl font-black text-on-surface mb-4">{surveyAnalysis.persona.title}</h2>
                <p className="text-on-surface-variant text-lg leading-relaxed max-w-lg mx-auto">
                  {surveyAnalysis.persona.description}
                </p>
              </div>
            </div>
          )}

          <div className="bg-surface-container p-6 rounded-3xl text-left border border-outline-variant/50 shadow-sm">
            <div className="flex items-center gap-3 mb-6 text-on-surface border-b border-outline-variant/50 pb-4">
              <div className="p-2 bg-primary-container text-on-primary-container rounded-full">
                <BrainCircuit size={24} />
              </div>
              <h3 className="text-xl font-bold">ข้อมูลเชิงลึกด้านวิศวกรรม (Engineering Insights)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/50">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={18} className="text-on-surface-variant" />
                <span className="font-semibold text-sm text-on-surface-variant uppercase tracking-wider">ระดับความเสี่ยง (Risk Profile)</span>
              </div>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(surveyAnalysis.riskProfile)}`}>
                {surveyAnalysis.riskProfile}
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/50">
              <div className="flex items-center gap-2 mb-2">
                <BrainCircuit size={18} className="text-on-surface-variant" />
                <span className="font-semibold text-sm text-on-surface-variant uppercase tracking-wider">รูปแบบพฤติกรรม (Archetype)</span>
              </div>
              <p className="font-bold text-on-surface text-lg">
                {surveyAnalysis.behavioralArchetype}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/50">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={20} className="text-tertiary" />
                <h4 className="font-bold text-on-surface">ข้อมูลเชิงลึก (Key Insights)</h4>
              </div>
              <ul className="space-y-3">
                {surveyAnalysis.keyInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-on-surface-variant text-[15px] leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-tertiary shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/50">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={20} className="text-primary" />
                <h4 className="font-bold text-on-surface">ข้อเสนอแนะ (Recommended Interventions)</h4>
              </div>
              <ul className="space-y-3">
                {surveyAnalysis.recommendedInterventions.map((intervention, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-on-surface-variant text-[15px] leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {intervention}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {surveyAnalysis.theoreticalMetrics && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-2 mb-4 text-on-surface">
                <BrainCircuit size={20} className="text-secondary" />
                <h4 className="font-bold">กรอบแนวคิดทางจิตวิทยา (Psychological Frameworks)</h4>
              </div>
              
              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/50">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 text-on-surface">
                    <Users size={18} className="text-primary" />
                    <span className="font-semibold text-sm">ทฤษฎีพฤติกรรมตามแผน (TPB)</span>
                  </div>
                  <span className="text-sm font-bold text-primary">{surveyAnalysis.theoreticalMetrics.tpb.score}/100</span>
                </div>
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden mb-3">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${surveyAnalysis.theoreticalMetrics.tpb.score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {surveyAnalysis.theoreticalMetrics.tpb.insight}
                </p>
              </div>

              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/50">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 text-on-surface">
                    <HeartPulse size={18} className="text-error" />
                    <span className="font-semibold text-sm">แบบแผนความเชื่อด้านสุขภาพ (HBM)</span>
                  </div>
                  <span className="text-sm font-bold text-error">{surveyAnalysis.theoreticalMetrics.hbm.score}/100</span>
                </div>
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden mb-3">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${surveyAnalysis.theoreticalMetrics.hbm.score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-error rounded-full"
                  />
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {surveyAnalysis.theoreticalMetrics.hbm.insight}
                </p>
              </div>

              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/50">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 text-on-surface">
                    <Zap size={18} className="text-tertiary" />
                    <span className="font-semibold text-sm">การชดเชยความเสี่ยง (Risk Compensation)</span>
                  </div>
                  <span className="text-sm font-bold text-tertiary">{surveyAnalysis.theoreticalMetrics.riskCompensation.score}/100</span>
                </div>
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden mb-3">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${surveyAnalysis.theoreticalMetrics.riskCompensation.score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-tertiary rounded-full"
                  />
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {surveyAnalysis.theoreticalMetrics.riskCompensation.insight}
                </p>
              </div>
            </div>
          )}
          </div>
        </motion.div>
      )}

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full bg-secondary-container/30 border border-secondary/20 p-6 rounded-3xl text-left"
        >
          <div className="flex items-center gap-3 mb-4 text-on-secondary-container">
            <div className="p-2 bg-secondary-container rounded-full">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold">คำแนะนำจากรูปถ่าย (AI Analysis)</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/50">
              <div className="flex items-center gap-2 mb-2 text-on-surface">
                <HeartPulse size={18} className="text-primary" />
                <span className="font-semibold text-sm">ข้อสังเกต (Observation)</span>
              </div>
              <p className="text-on-surface-variant leading-relaxed text-[15px]">
                {analysis.empathyMessage}
              </p>
            </div>
            
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/50">
              <div className="flex items-center gap-2 mb-2 text-on-surface">
                <ShieldCheck size={18} className="text-primary" />
                <span className="font-semibold text-sm">คำแนะนำ (Recommendation)</span>
              </div>
              <p className="text-on-surface-variant leading-relaxed text-[15px]">
                {analysis.advice}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
