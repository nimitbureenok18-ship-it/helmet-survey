# ระบบจัดการและโหลดชุดข้อคำถามจากไฟล์ (Survey Question Data File Integration)

แผนงานนี้จัดทำขึ้นเพื่อรวมศูนย์และจัดเก็บข้อคำถามแบบสอบถามทั้งหมดไว้ในไฟล์ข้อมูลโครงสร้างที่ชัดเจน (`src/data/questions.json` และตัวแปลงประเภท `src/data/surveyQuestions.ts`) พร้อมระบบเรนเดอร์แบบสอบถามแบบไดนามิก และเครื่องมือนำเข้า/ส่งออกไฟล์คำถาม เพื่อให้สามารถแก้ไข เพิ่มเติม หรือเปลี่ยนชุดข้อคำถามได้สะดวกทันที

### User Review & Critical Decisions

> [!IMPORTANT]
> ระบบจะจัดโครงสร้างข้อคำถามด้านความปลอดภัยและการใช้หมวกกันน็อคทั้งหมด 20 ข้อเดิมลงในไฟล์ข้อมูลโครงสร้าง JSON พร้อมรองรับการนำเข้าไฟล์ชุดคำถามใหม่ (JSON / Template) และการปรับแต่งคำถามได้ทันที

- **Confirmed Decision 1**: จัดเก็บชุดคำถามหลักทั้งหมดในไฟล์โครงสร้างข้อมูล `src/data/questions.json` เพื่อให้สามารถเปิดอ่าน แก้ไข เพิ่มข้อคำถามใหม่ หรือสลับภาษาได้อย่างเป็นระเบียบ
- **Confirmed Decision 2**: พัฒนา Questionnaire Engine ให้สามารถเรนเดอร์ข้อคำถามตามชนิดในไฟล์ (Single Choice, Multi Choice, Image Picker, Numeric Scale, Photo Upload, Text Input, Contact Form)
- **Confirmed Decision 3**: เพิ่มแผงเครื่องมือ "จัดการชุดคำถาม (Question File Manager)" ในหน้าแรกหรือปุ่มตั้งค่า เพื่อให้ผู้ดูแลสามารถดาวน์โหลดไฟล์คำถามต้นแบบ (Template JSON) และอัปโหลดไฟล์คำถามชุดใหม่เข้าไปใช้งานได้ทันที

---

### 1. Overview & Core Concept

- **What It Does**: ปรับเปลี่ยนระบบแบบสอบถามจากการฮาร์ดโค้ดคำถามแยกในคอมโพเนนต์ 20 ไฟล์ ให้เป็นการอ่านและประมวลผลข้อคำถามจากไฟล์ข้อมูลเดียว (`src/data/questions.json`) พร้อมฟังก์ชันให้ผู้ใช้สามารถอัปโหลดไฟล์ข้อคำถามของตนเองเพื่อใช้งานในระบบได้ทันที
- **Target Audience / Persona**: นักวิจัย, สถาบันการศึกษา, ผู้จัดทำแบบสำรวจพฤติกรรมการขับขี่และความปลอดภัยทางถนน และผู้ตอบแบบสอบถาม
- **Key Value**: เพิ่มความยืดหยุ่นสูงสุด สามารถเพิ่ม ลบ หรือแก้ไขข้อคำถามได้ง่ายๆ เพียงแก้ไขไฟล์ JSON โดยไม่ต้องเขียนโค้ด React ใหม่ในทุกๆ ข้อ

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Survey Initiation & File Status**:
   - ผู้ใช้เข้าสู่หน้าแบบสอบถาม ระบบโหลดชุดข้อคำถามจากไฟล์ `questions.json` เริ่มต้นโดยอัตโนมัติ
   - มีปุ่มตัวเลือกเปิด "จัดการไฟล์คำถาม" ที่มุมขวาบน สำหรับดูโครงสร้างคำถาม หรืออัปโหลดไฟล์ชุดคำถามใหม่
2. **Interactive Stepper Experience**:
   - ผู้ตอบแบบสอบถามตอบข้อคำถามทีละสเต็ปตามลำดับในไฟล์ มี Progress Ring แสดงความคืบหน้าชัดเจน
   - การเลือกตัวเลือกเดี่ยว (Single Choice / Image Picker) จะตอบสนองด้วย Haptic Vibration และเลื่อนไปข้อถัดไปโดยอัตโนมัติอย่างราบรื่น
3. **Completion & Dynamic Summary**:
   - เมื่อตอบครบทุกข้อ หน้า SuccessScreen จะสรุปคำตอบโดยจับคู่กับหัวข้อคำถามในไฟล์ข้อมูลโดยอัตโนมัติ
   - ผู้ใช้สามารถส่งออกรายงานผลลัพธ์เป็นไฟล์ PDF หรือ CSV ได้

#### Visual Identity & Theme
- **Aesthetic Direction**: คลีน มินิมอล ได้มาตรฐานความปลอดภัยระดับสากล สบายตา เน้นการอ่านง่ายและเข้าถึงได้สะดวกบนมือถือและเดสก์ท็อป
- **Color Palette**:
  - พื้นหลังหลัก (Canvas 60%): `#f8fafc` (Slate 50) สบายตา ไม่ล้าสายตา
  - พื้นผิวการ์ด (Surfaces 30%): `#ffffff` พร้อมเส้นขอบละเอียด `1px solid #e2e8f0`
  - สีเน้น (Accent 10%): `#4f46e5` (Indigo 600) สำหรับปุ่มหลักและสถานะความคืบหน้า
- **Typography & Touch Targets**:
  - ฟอนต์ผสม 'Sarabun' (ภาษาไทย) และ 'Inter' (สากล)
  - ความสูงของตัวเลือกและปุ่มอย่างน้อย 44px ตามมาตรฐาน Ergonomic Touch Zones

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: รูปแบบโครงสร้างไฟล์คำถาม (Structured JSON vs TS Config)**
  - *Chosen Approach*: ใช้ไฟล์ `src/data/questions.json` พร้อม TypeScript interfaces ที่รัดกุมใน `src/types.ts`
  - *Why*: สะดวกต่อการนำเข้าไฟล์จากภายนอก (Import/Export JSON) และแก้ไขได้ง่ายโดยผู้ใช้ทั่วไป
  - *Alternatives Considered*: เก็บใน SQLite หรือ Firebase ซึ่งซับซ้อนเกินความจำเป็นสำหรับการสำรวจที่ทำงานออฟไลน์ได้
- **Decision 2: ความเข้ากันได้กับคำถามประเภทพิเศษ (AI Photo Analysis & Emergency Contact)**
  - *Chosen Approach*: รองรับประเภทคำถามแบบ `scar_analysis`, `emergency_contact`, `photo_upload` ในโครงสร้าง JSON เพื่อให้ฟังก์ชันการวิเคราะห์รูปถ่ายแผลเป็นและข้อมูลฉุกเฉินยังคงทำงานได้อย่างสมบูรณ์

---

### 4. Technical Architecture & Data Strategy

#### Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                             │
│  src/data/questions.json  <───>  File Import / Export Modal  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Questionnaire Engine                       │
│  DynamicQuestionRenderer.tsx (maps question type to UI)     │
│   ├── ChoiceQuestion (Single/Multi-choice)                  │
│   ├── ImagePickerQuestion (Helmet types)                    │
│   ├── RatingScaleQuestion (Confidence, Safety 1-10)         │
│   ├── PhotoUploadQuestion (Helmet / Scar photo + AI)        │
│   └── FormInputQuestion (Contact, Motorcycle model)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Survey State & Persistence                      │
│   LocalStorage (helmetSurveyData, customQuestions)          │
│   TopBar (Progress) / BottomBar (Navigation Controls)       │
│   SuccessScreen.tsx (Dynamic Summary & Export)              │
└─────────────────────────────────────────────────────────────┘
```

#### Data Model (`QuestionItem` Structure)
```typescript
export interface QuestionOption {
  id: string;
  label: string;
  subtitle?: string;
  image?: string;
}

export interface QuestionItem {
  id: string;
  key: string;
  title: string;
  description?: string;
  type: 'single_choice' | 'multi_choice' | 'image_picker' | 'rating_scale' | 'rank_order' | 'text' | 'photo' | 'scar_analysis' | 'emergency_contact';
  required: boolean;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  placeholder?: string;
}
```

#### Interactive State Mapping
- เมื่อเปลี่ยนคำถามใน `questions.json` สเต็ปทั้งหมดและเงื่อนไข `isNextDisabled` จะคำนวณอัตโนมัติตามฟิลด์ `required` ของคำถามปัจจุบัน
- การบันทึกคำตอบจะผูกกับ `key` ของข้อคำถามแบบไดนามิก รองรับทั้งชุดคำถามเริ่มต้นและชุดคำถามใหม่ที่นำเข้าจากไฟล์
