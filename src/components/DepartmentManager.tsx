/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Role, TrainingMaterial } from '../types';
import { TRAINING_CURRICULUM, RACI_MATRIX } from '../data/mockData';
import { 
  Users, Award, HelpCircle, BookOpen, Clock, Play, FileText, 
  CheckCircle2, XCircle, ChevronRight, BarChart3, ShieldAlert,
  Sparkles, TrendingUp, DollarSign, RefreshCw, AlertCircle, Calendar,
  Activity, Info
} from 'lucide-react';

interface DepartmentManagerProps {
  currentRole: Role;
}

export function DepartmentManager({ currentRole }: DepartmentManagerProps) {
  const [activeDept, setActiveDept] = useState<string>('HCNS');
  
  // Interactive Training / Exam states
  const [activeQuizCourse, setActiveQuizCourse] = useState<TrainingMaterial | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // States for PHÒNG HIỆU SUẤT & KPI
  const [kpiSubTab, setKpiSubTab] = useState<'dashboard' | 'personal' | 'appraisal' | 'portfolio' | 'sync' | 'promotions'>('dashboard');
  const [kpiRoleFilter, setKpiRoleFilter] = useState<'purchase' | 'sales' | 'warehouse'>('purchase');
  
  // Appraisal Sliders
  const [appraisalKpi, setAppraisalKpi] = useState<number>(88);
  const [appraisalCompetence, setAppraisalCompetence] = useState<number>(85);
  const [appraisalAttitude, setAppraisalAttitude] = useState<number>(95);
  const [appraisalSubmitted, setAppraisalSubmitted] = useState<boolean>(false);
  const [appraisalComments, setAppraisalComments] = useState<string>('Thực hiện tốt chỉ tiêu sỉ sên dĩa DID, thái độ học tập thợ máy tốt.');

  // Selected employee profile
  const [selectedEmpProfile, setSelectedEmpProfile] = useState<string>('quang');

  // Sync logs
  const [isSyncingKpi, setIsSyncingKpi] = useState<boolean>(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  // Promo salary calculator
  const [baseSalary, setBaseSalary] = useState<number>(12000000);

  const departments = [
    {
      id: 'HCNS',
      name: 'HCNS (Hợp đồng - Nhân sự)',
      head: 'Nguyễn Thị Tuyết (Trưởng Phòng HR)',
      staffCount: 14,
      activities: ['Thực hiện tuyển dụng', 'Lập ma trận RACIS', 'Kiểm soát KPIs tháng', 'Cập nhật nội quy văn phòng'],
      details: 'Quản lý 120 hồ sơ lao động chính thức và cộng tác viên tại 3 chuỗi chi nhánh sửa chữa liên kết.'
    },
    {
      id: 'KDOANH',
      name: 'Kinh Doanh & Phát triển Đại lý',
      head: 'Nguyễn Kinh Doanh (Trưởng phòng Sales)',
      staffCount: 22,
      activities: ['Mở mới đại lý phụ tùng', 'Phân bổ báo giá xích DID', 'Catalogue sản phẩm', 'Tính hoa hồng'],
      details: 'Theo dõi hợp đồng phân phối ký gửi và chính sách giá sĩ thương hiệu TERASU.'
    },
    {
      id: 'MUA_HANG',
      name: 'Mua Hàng & Xuất Nhập Khẩu',
      head: 'Trần Minh Quang (Trưởng phòng Purchase)',
      staffCount: 8,
      activities: ['Đối tác Trung Quốc/Nhật Bản', 'Xác minh HS Code hải quan', 'Hải quan cảng', 'CO Form E'],
      details: 'Chịu trách nhiệm nhập thô thép mạ vàng và chuỗi xích DID nhập khẩu chất lượng cao.'
    },
    {
      id: 'QC_TECH',
      name: 'QC & Kỹ thuật R&D',
      head: 'Nguyễn Kỹ Thuật (Trưởng bộ phận QC)',
      staffCount: 10,
      activities: ['Tiêu chuẩn nén kéo xích', 'Bản vẽ CAD nhông xe máy', 'Bảng thông tin mã lỗi ắc quy', 'QC xuất kho'],
      details: 'Phòng thí nghiệm kiểm tra dung sai +/- 0.02mm nhông WAVE 110cc.'
    },
    {
      id: 'SERVICE',
      name: 'Dịch vụ sửa chữa & Bảo hành',
      head: 'Phạm Đức Long (Giám Đốc Vận Hành)',
      staffCount: 45,
      activities: ['SOP sửa chữa thợ máy', 'Đào tạo học nghề sên dĩa', 'Quy trình đổi trả ắc quy Lead', 'Chụp ảnh thực tế'],
      details: 'Chuỗi 5 cửa hàng sửa chữa kết hợp bán sỉ sên súp dập hộp vàng TERASU.'
    },
    {
      id: 'KPI_PERFORMANCE',
      name: 'Hiệu Suất & KPI (Performance Management)',
      head: 'Vũ Nam Khánh (Giám đốc Nhân sự & Hiệu suất)',
      staffCount: 6,
      activities: ['Thiết kế khung năng lực', 'Đo lường KPIs & OKRs', 'Duyệt phiếu đánh giá tháng', 'Tính toán quỹ thưởng năm'],
      details: 'Mục tiêu: Theo dõi hiệu suất cá nhân, phòng ban, chi nhánh; Quản lý KPI, OKR, BSC; Đánh giá năng lực nhân sự; Tổng hợp kết quả năm phục vụ thưởng, tăng lương, bổ nhiệm.'
    }
  ];

  const handleStartExam = (course: TrainingMaterial) => {
    setActiveQuizCourse(course);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleSelectAnswer = (qIdx: number, aIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: aIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuizCourse) return;
    
    let correctCount = 0;
    activeQuizCourse.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    setQuizScore(correctCount);
    setQuizSubmitted(true);
  };

  const getRaciBadge = (roleName: string) => {
    switch (roleName) {
      case 'R': return 'bg-blue-100 text-blue-800 font-bold';
      case 'A': return 'bg-orange-100 text-orange-950 font-bold';
      case 'C': return 'bg-indigo-100 text-indigo-800';
      case 'I': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-50 text-slate-400';
    }
  };

  // Appraisal Calculation
  const appraisalTotalScore = Math.round((appraisalKpi * 0.7) + (appraisalCompetence * 0.2) + (appraisalAttitude * 0.1));
  const getAppraisalGrade = (score: number) => {
    if (score >= 90) return { label: 'XUẤT SẮC (Loại A)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 80) return { label: 'TỐT (Loại B)', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (score >= 70) return { label: 'ĐẠT (Loại C)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'CẦN CẢI THIỆN (Loại D)', color: 'text-red-700 bg-red-50 border-red-200 animate-pulse' };
  };
  const appraisalGrade = getAppraisalGrade(appraisalTotalScore);

  const handleTriggerSync = () => {
    setIsSyncingKpi(true);
    setSyncLogs(['Bắt đầu đối soát cơ sở dữ liệu...', 'Kết nối API Kinh doanh (Doanh số đại lý sỉ)...']);
    
    setTimeout(() => {
      setSyncLogs(prev => [...prev, 'Kết nối API Kho (Sai lệch nhông sên dĩa)... OK', 'Kết nối API QC (Tỷ lệ hỏng cell ắc quy Lead)... OK']);
    }, 800);

    setTimeout(() => {
      setSyncLogs(prev => [...prev, 'Đang kéo kết quả đào tạo của 45 thợ máy...', 'Đồng bộ hóa OKRs & BSC của Ban Giám Đốc...']);
    }, 1600);

    setTimeout(() => {
      setIsSyncingKpi(false);
      setSyncLogs(prev => [...prev, 'Đồng bộ thành công! Toàn bộ 100% dữ liệu KPIs đã được cập nhật trực tiếp.']);
    }, 2400);
  };

  // Render Section for KPI PERFORMANCE Department
  const renderKpiPerformanceWorkspace = (dept: any) => {
    return (
      <div key={dept.id} className="space-y-6 w-full animate-in fade-in duration-300">
        
        {/* Top Header Banner for performance department */}
        <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-600 rounded-lg text-white">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm md:text-base tracking-tight flex items-center gap-2">
                <span>{dept.name}</span>
                <span className="text-[10px] bg-emerald-600 font-extrabold px-1.5 py-0.2 rounded">LIVE PLATFORM</span>
              </h3>
              <p className="text-xs text-slate-300">
                Chuyên trách: <span className="text-orange-400 font-bold">{dept.head}</span> • Quy mô: {dept.staffCount} chuyên viên kiểm soát hiệu suất.
              </p>
            </div>
          </div>
          <div className="text-[10px] bg-slate-800 text-slate-300 p-2 rounded-lg border border-slate-700 max-w-xs font-medium">
            🎯 OKRs Mục tiêu: <span className="text-orange-400 font-bold">Kiểm soát thông suốt 11 phòng ban</span>, tăng 15% hiệu suất thợ máy.
          </div>
        </div>

        {/* Local sub-tabs menu */}
        <div className="flex flex-wrap border-b border-slate-200 bg-white p-1 rounded-xl shadow-xs gap-1">
          {[
            { id: 'dashboard', label: '📊 KPI Dashboard', desc: 'Xu hướng & Top nhân sự' },
            { id: 'personal', label: '🎯 KPI Cá nhân', desc: 'Mục tiêu Mua hàng & Kho' },
            { id: 'appraisal', label: '📝 Đánh giá & Năng lực', desc: 'Đánh giá tháng/năm' },
            { id: 'portfolio', label: '👤 Hồ sơ hiệu suất', desc: 'Khen thưởng & Kỷ luật' },
            { id: 'sync', label: '🔗 Liên kết Module', desc: 'Kết nối dữ liệu live' },
            { id: 'promotions', label: '💸 Thưởng & Tăng lương', desc: 'Chế độ đãi ngộ' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setKpiSubTab(tab.id as any)}
              className={`flex-1 min-w-[150px] text-left px-3 py-2 rounded-lg transition-all cursor-pointer focus:outline-hidden ${
                kpiSubTab === tab.id 
                  ? 'bg-slate-900 text-white font-bold shadow-xs' 
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="text-xs">{tab.label}</div>
              <div className={`text-[9px] ${kpiSubTab === tab.id ? 'text-slate-300' : 'text-slate-400'}`}>{tab.desc}</div>
            </button>
          ))}
        </div>

        {/* SUB TAB 1: KPI DASHBOARD (A & H) */}
        {kpiSubTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Core Scorecards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'KPI THÁNG 6', value: '92.4%', change: '+2.1%', desc: 'Tăng trưởng so với tháng 5', trend: 'up' },
                { title: 'KPI QUÝ II', value: '89.5%', change: '+0.8%', desc: 'Đạt tiến độ mục tiêu đề ra', trend: 'up' },
                { title: 'KPI NĂM 2026', value: '86.2%', change: 'Dự báo', desc: 'Dự kiến đạt 94.2% kế hoạch', trend: 'neutral' },
                { title: 'HOÀN THÀNH MỤC TIÊU', value: '91.8%', change: '68/75 thợ', desc: 'Đã hoàn tất đánh giá tháng', trend: 'up' }
              ].map((card, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{card.title}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl md:text-2xl font-extrabold text-slate-900">{card.value}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1 rounded">{card.change}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Charts & Rankings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Custom SVG Line Chart - KPI Trends */}
              <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span className="font-bold text-xs md:text-sm text-slate-800">Biểu đồ Xu hướng KPI Doanh nghiệp 6 tháng đầu năm</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">ĐƠN VỊ: % HIỆU SUẤT</span>
                </div>

                {/* SVG Visual Chart */}
                <div className="relative pt-4">
                  <svg viewBox="0 0 500 160" className="w-full h-auto overflow-visible">
                    {/* Grid Lines */}
                    <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="140" x2="480" y2="140" stroke="#e2e8f0" strokeWidth="1.5" />

                    {/* Chart labels */}
                    <text x="15" y="24" className="text-[8px] fill-slate-400 font-mono" textAnchor="middle">100%</text>
                    <text x="15" y="64" className="text-[8px] fill-slate-400 font-mono" textAnchor="middle">80%</text>
                    <text x="15" y="104" className="text-[8px] fill-slate-400 font-mono" textAnchor="middle">60%</text>

                    {/* Line path T1 (78) -> T2 (80) -> T3 (85) -> T4 (89) -> T5 (91) -> T6 (92.4) */}
                    <path
                      d="M 60 104 L 140 100 L 220 90 L 300 82 L 380 78 L 460 75"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Gradient under line */}
                    <path
                      d="M 60 104 L 140 100 L 220 90 L 300 82 L 380 78 L 460 75 L 460 140 L 60 140 Z"
                      fill="url(#kpiTrendGrad)"
                      opacity="0.15"
                    />

                    {/* Points markers */}
                    <circle cx="60" cy="104" r="4" className="fill-white stroke-orange-500 stroke-2" />
                    <circle cx="140" cy="100" r="4" className="fill-white stroke-orange-500 stroke-2" />
                    <circle cx="220" cy="90" r="4" className="fill-white stroke-orange-500 stroke-2" />
                    <circle cx="300" cy="82" r="4" className="fill-white stroke-orange-500 stroke-2" />
                    <circle cx="380" cy="78" r="4" className="fill-white stroke-orange-500 stroke-2" />
                    <circle cx="460" cy="75" r="5" className="fill-white stroke-orange-600 stroke-2" />

                    {/* Labels */}
                    <text x="60" y="152" className="text-[8px] fill-slate-500 font-semibold" textAnchor="middle">Tháng 1 (78%)</text>
                    <text x="140" y="152" className="text-[8px] fill-slate-500 font-semibold" textAnchor="middle">Tháng 2 (80%)</text>
                    <text x="220" y="152" className="text-[8px] fill-slate-500 font-semibold" textAnchor="middle">Tháng 3 (85%)</text>
                    <text x="300" y="152" className="text-[8px] fill-slate-500 font-semibold" textAnchor="middle">Tháng 4 (89%)</text>
                    <text x="380" y="152" className="text-[8px] fill-slate-500 font-semibold" textAnchor="middle">Tháng 5 (91%)</text>
                    <text x="460" y="152" className="text-[8px] fill-orange-600 font-bold" textAnchor="middle">Tháng 6 (92.4%)</text>

                    {/* Defs for gradient */}
                    <defs>
                      <linearGradient id="kpiTrendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ffffff" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Performance Rankings Lists */}
              <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs space-y-4">
                <div className="border-b pb-2">
                  <span className="font-bold text-xs md:text-sm text-slate-800">Xếp hạng Hiệu suất Doanh nghiệp</span>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Top personnel */}
                  <div className="space-y-2">
                    <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">⭐ Top 5 Nhân sự xuất sắc</span>
                    {[
                      { name: 'Nguyễn Thị Lan', dept: 'Kinh Doanh', score: '98/100', rank: 'A' },
                      { name: 'Trần Minh Quang', dept: 'Mua Hàng', score: '95/100', rank: 'A' },
                      { name: 'Phạm Đức Long', dept: 'Dịch vụ Vận hành', score: '94/100', rank: 'A' },
                      { name: 'Vũ Nam Khánh', dept: 'Hiệu suất & KPI', score: '92/100', rank: 'A' },
                      { name: 'Nguyễn Kỹ Thuật', dept: 'QC Kỹ thuật', score: '91/100', rank: 'A' }
                    ].map((per, pi) => (
                      <div key={pi} className="flex items-center justify-between p-1.5 rounded bg-slate-50 border border-slate-100 font-medium">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-orange-600 flex items-center justify-center text-white text-[8px] font-bold">
                            {pi+1}
                          </span>
                          <div>
                            <div className="font-bold text-slate-800 text-[11px]">{per.name}</div>
                            <div className="text-[9px] text-slate-400">{per.dept}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-800 font-mono text-[11px]">{per.score}</div>
                          <span className="text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded-sm uppercase tracking-wider">
                            Loại {per.rank}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Top Departments */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">🏢 Xếp hạng Phòng ban</span>
                    {[
                      { name: '1. Mua Hàng & XNK', pct: '94%' },
                      { name: '2. QC & Kỹ thuật R&D', pct: '91%' },
                      { name: '3. Dịch vụ & Bảo hành', pct: '89%' },
                      { name: '4. Kinh Doanh & Đại lý', pct: '87%' }
                    ].map((dept, di) => (
                      <div key={di} className="flex items-center justify-between font-mono font-medium">
                        <span className="text-slate-700 font-semibold">{dept.name}</span>
                        <span className="text-orange-600 font-extrabold text-[11px]">{dept.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* H. BÁO CÁO CEO (Special panel visible to CEO / Director) */}
            <div className="bg-slate-950 text-slate-100 p-5 rounded-xl border border-slate-800 space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-orange-600/30 text-orange-400 rounded-md">👑</span>
                  <div>
                    <h4 className="font-extrabold text-xs md:text-sm text-slate-100 tracking-tight">H. BÁO CÁO TOÀN DIỆN DÀNH CHO CEO & BAN GIÁM ĐỐC</h4>
                    <p className="text-[9.5px] text-slate-400">Dự báo KPIs, phát hiện lỗ hổng hiệu suất và đề xuất thăng tiến tự động.</p>
                  </div>
                </div>
                <span className="text-[10px] bg-red-600/20 text-red-400 font-mono font-bold px-2 py-0.5 rounded">CONFIDENTIAL</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Hệ thống AI tự động đối soát chéo kết quả xuất nhập khẩu sên dĩa của Mua hàng, số dư công nợ của Kế toán, và tay nghề cơ khí của bộ phận Dịch vụ để kết xuất 2 nhóm nhân sự phục vụ phân hoạch nhân tài:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {/* Outstanding 10 people summary */}
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                  <span className="text-[9.5px] font-black text-emerald-400 uppercase tracking-wider block">✓ 10 NHÂN SỰ XUẤT SẮC ĐỀ XUẤT BỔ NHIỆM:</span>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between"><span>1. Trần Minh Quang (Mua hàng)</span> <span className="text-emerald-400">95đ - Tiến cử</span></div>
                    <div className="flex justify-between"><span>2. Nguyễn Thị Lan (Sales)</span> <span className="text-emerald-400">98đ - Tiến cử</span></div>
                    <div className="flex justify-between"><span>3. Phạm Đức Long (Dịch vụ)</span> <span className="text-emerald-400">94đ - Tiến cử</span></div>
                    <div className="flex justify-between text-slate-500 font-sans italic"><span>Và 7 nhân sự thợ máy bậc cao khác...</span> <span className="text-slate-500">Xem file PDF</span></div>
                  </div>
                  <button className="w-full text-center py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-bold font-sans transition-colors cursor-pointer">
                    Phê chuẩn Quy hoạch cán bộ nguồn
                  </button>
                </div>

                {/* Performance warnings */}
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                  <span className="text-[9.5px] font-black text-red-400 uppercase tracking-wider block">⚠ 10 NHÂN SỰ CẦN CẢI THIỆN / ĐÀO TẠO LẠI:</span>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between"><span>1. Lê Thăng Long (Kho nhông xích)</span> <span className="text-red-400">65đ - Sút áp KPIs</span></div>
                    <div className="flex justify-between"><span>2. Hoàng Minh Tuấn (Học việc thợ sên)</span> <span className="text-red-400">62đ - Lắp lệch sên</span></div>
                    <div className="flex justify-between"><span>3. Trần Tiến Dũng (Sales rep)</span> <span className="text-red-400">68đ - Chậm thu nợ</span></div>
                    <div className="flex justify-between text-slate-500 font-sans italic"><span>Và 7 nhân viên thử việc chưa đạt chuẩn...</span> <span className="text-slate-500">Xem kĩ</span></div>
                  </div>
                  <button className="w-full text-center py-1.5 bg-red-600/30 hover:bg-red-600/40 text-red-200 rounded text-[10px] font-bold font-sans transition-colors cursor-pointer">
                    Kích hoạt Quy trình Đào tạo lại (Academy)
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* SUB TAB 2: PERSONAL OBJECTIVES (B) */}
        {kpiSubTab === 'personal' && (
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs space-y-5 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b pb-3">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Mục tiêu KPIs cá nhân theo quý / tháng</span>
                <p className="text-[11px] text-slate-400">Mỗi vị trí hành chính hoặc thợ xưởng có các chỉ số cốt lõi riêng biệt để liên thông dữ liệu.</p>
              </div>

              {/* Position Switcher dropdown */}
              <div className="flex items-center bg-slate-100 p-1 rounded-lg border">
                <span className="p-1 text-xs">🎯</span>
                <select 
                  value={kpiRoleFilter} 
                  onChange={(e) => setKpiRoleFilter(e.target.value as any)}
                  className="bg-transparent font-bold text-xs text-slate-700 focus:outline-hidden cursor-pointer pr-1"
                >
                  <option value="purchase">Nhân Viên Mua Hàng</option>
                  <option value="sales">Nhân Viên Kinh Doanh</option>
                  <option value="warehouse">Nhân Viên Kho</option>
                </select>
              </div>
            </div>

            {/* Display list of goals */}
            <div className="space-y-4">
              {kpiRoleFilter === 'purchase' && (
                <>
                  {[
                    { title: '1. Tiết giảm giá mua linh kiện nhông xích sên', weight: '70%', target: '-3.0%', actual: '-3.5%', pct: 116.6, status: 'Vượt chỉ tiêu', desc: 'Đàm phán tối ưu biên độ thép nhông xích nhập thô.' },
                    { title: '2. Tỷ lệ giao hàng đúng hạn sên DID', weight: '20%', target: '>98.0%', actual: '98.5%', pct: 100.5, status: 'Đạt chỉ tiêu', desc: 'Theo dõi tiến độ tàu cảng CO Form E Hải quan.' },
                    { title: '3. Tỷ lệ lỗi linh kiện từ nhà cung cấp', weight: '10%', target: '<0.5%', actual: '0.3%', pct: 120.0, status: 'Vượt chỉ tiêu', desc: 'Kiểm soát dung sai dung dịch ắc quy Lead sụt áp.' }
                  ].map((goal, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs font-medium">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="font-bold text-slate-800 text-sm">{goal.title}</span>
                        <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded">
                          Trọng số {goal.weight}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px]">{goal.desc}</p>
                      <div className="grid grid-cols-3 gap-2 py-1 bg-white p-2.5 rounded-lg border font-mono">
                        <div><span className="text-slate-400 block text-[10px]">MỤC TIÊU:</span> <strong>{goal.target}</strong></div>
                        <div><span className="text-slate-400 block text-[10px]">THỰC TẾ ĐẠT:</span> <strong>{goal.actual}</strong></div>
                        <div><span className="text-slate-400 block text-[10px]">TỶ LỆ HOÀN THÀNH:</span> <strong className="text-emerald-600">{goal.pct}%</strong></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-orange-500 h-full rounded-full" style={{ width: `${Math.min(goal.pct, 100)}%` }} />
                        </div>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.2 rounded shrink-0">
                          {goal.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {kpiRoleFilter === 'sales' && (
                <>
                  {[
                    { title: '1. Doanh số sỉ sên vàng hộp TERASU', weight: '70%', target: '1.2 Tỷ VNĐ', actual: '1.35 Tỷ VNĐ', pct: 112.5, status: 'Vượt chỉ tiêu', desc: 'Mở rộng luồng bán sỉ trực tiếp cho chuỗi 15 đại lý mới.' },
                    { title: '2. Mở mới khách hàng / Đại lý phân phối sên dĩa', weight: '20%', target: '5 Đại lý', actual: '6 Đại lý', pct: 120.0, status: 'Vượt chỉ tiêu', desc: 'Ký kết hợp đồng đại lý miền Bắc hưởng ưu đãi 35%.' },
                    { title: '3. Tỷ lệ thu hồi công nợ đại lý sỉ', weight: '10%', target: '>95.0%', actual: '93.0%', pct: 97.8, status: 'Đạt tiệm cận', desc: 'Đối soát đúng hạn chu kỳ thanh toán gối đầu.' }
                  ].map((goal, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs font-medium">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="font-bold text-slate-800 text-sm">{goal.title}</span>
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded">
                          Trọng số {goal.weight}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px]">{goal.desc}</p>
                      <div className="grid grid-cols-3 gap-2 py-1 bg-white p-2.5 rounded-lg border font-mono">
                        <div><span className="text-slate-400 block text-[10px]">MỤC TIÊU:</span> <strong>{goal.target}</strong></div>
                        <div><span className="text-slate-400 block text-[10px]">THỰC TẾ ĐẠT:</span> <strong>{goal.actual}</strong></div>
                        <div><span className="text-slate-400 block text-[10px]">TỶ LỆ HOÀN THÀNH:</span> <strong className="text-emerald-600">{goal.pct}%</strong></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min(goal.pct, 100)}%` }} />
                        </div>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.2 rounded shrink-0">
                          {goal.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {kpiRoleFilter === 'warehouse' && (
                <>
                  {[
                    { title: '1. Sai lệch tồn kho nhông xích dĩa xe máy', weight: '70%', target: '0.00%', actual: '0.01%', pct: 99.9, status: 'Đạt chuẩn', desc: 'Kiểm kho định kỳ bằng quét mã vạch SKU dập khuôn.' },
                    { title: '2. Tỷ lệ giao hàng đúng đại lý sỉ', weight: '20%', target: '>99.5%', actual: '99.8%', pct: 100.3, status: 'Vượt chỉ tiêu', desc: 'Kiểm soát nhãn mác đai xích vàng nhôm đúng số lượng sợi.' },
                    { title: '3. Tỷ lệ kiểm kê chính xác dòng ắc quy chì', weight: '10%', target: '100.0%', actual: '100.0%', pct: 100.0, status: 'Đạt chuẩn', desc: 'Tránh thất thoát, bảo quản cell trong môi trường khô mát.' }
                  ].map((goal, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs font-medium">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="font-bold text-slate-800 text-sm">{goal.title}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">
                          Trọng số {goal.weight}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px]">{goal.desc}</p>
                      <div className="grid grid-cols-3 gap-2 py-1 bg-white p-2.5 rounded-lg border font-mono">
                        <div><span className="text-slate-400 block text-[10px]">MỤC TIÊU:</span> <strong>{goal.target}</strong></div>
                        <div><span className="text-slate-400 block text-[10px]">THỰC TẾ ĐẠT:</span> <strong>{goal.actual}</strong></div>
                        <div><span className="text-slate-400 block text-[10px]">TỶ LỆ HOÀN THÀNH:</span> <strong className="text-emerald-600">{goal.pct}%</strong></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-slate-700 h-full rounded-full" style={{ width: `${Math.min(goal.pct, 100)}%` }} />
                        </div>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.2 rounded shrink-0">
                          {goal.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* SUB TAB 3: MONTHLY & ANNUAL APPRAISALS & COMPETENCIES (C, D & F) */}
        {kpiSubTab === 'appraisal' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* C. Monthly Appraisal Simulator (8 cols) */}
            <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs space-y-4">
              <div className="border-b pb-2">
                <h4 className="font-bold text-xs md:text-sm text-slate-800 flex items-center gap-1">
                  <span>📝 C. Bộ công cụ Giả lập Đánh giá Hiệu suất Hàng tháng</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                  Quy trình 3 cấp: Nhân viên tự đánh giá (Self-assess) → Trưởng bộ phận chấm → Ban Giám đốc phê duyệt.
                </p>
              </div>

              {/* Steps indicator */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                <div onClick={() => setAppraisalSubmitted(false)} className={`p-2 rounded-lg cursor-pointer ${!appraisalSubmitted ? 'bg-orange-100 text-orange-900 border border-orange-200' : 'bg-slate-100 text-slate-400'}`}>
                  1. Nhân viên Tự đánh giá (70%)
                </div>
                <div className={`p-2 rounded-lg ${appraisalSubmitted ? 'bg-orange-100 text-orange-900 border border-orange-200' : 'bg-slate-50 text-slate-400'}`}>
                  2. Trưởng bộ phận duyệt (20%)
                </div>
                <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                  3. CEO Phê chuẩn (10%)
                </div>
              </div>

              {/* Sliders Container */}
              <div className="space-y-4 pt-2 text-xs">
                
                {/* Weighted Slider 1: KPI (70%) */}
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>1. Điểm KPI kết quả công việc cụ thể (Trọng số 70%)</span>
                    <strong className="text-orange-600 text-sm font-mono">{appraisalKpi} điểm</strong>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="100" 
                    value={appraisalKpi}
                    onChange={(e) => setAppraisalKpi(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <span className="text-[10px] text-slate-400 block">Ví dụ: Mức độ tiết kiệm thép mạ vàng, đúng hạn sên DID, đạt doanh số.</span>
                </div>

                {/* Weighted Slider 2: Competence (20%) */}
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>2. Năng lực chuyên môn & Kỹ nghệ kỹ thuật (Trọng số 20%)</span>
                    <strong className="text-orange-600 text-sm font-mono">{appraisalCompetence} điểm</strong>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="100" 
                    value={appraisalCompetence}
                    onChange={(e) => setAppraisalCompetence(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <span className="text-[10px] text-slate-400 block">Kiến thức dung sai xích, quy trình đổi trả ắc quy chì lỏng sụt áp.</span>
                </div>

                {/* Weighted Slider 3: Attitude (10%) */}
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>3. Thái độ, tác phong và Văn hóa doanh nghiệp (Trọng số 10%)</span>
                    <strong className="text-orange-600 text-sm font-mono">{appraisalAttitude} điểm</strong>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="100" 
                    value={appraisalAttitude}
                    onChange={(e) => setAppraisalAttitude(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <span className="text-[10px] text-slate-400 block">Kỷ luật chuyên cần, hỗ trợ đồng đội trong xưởng hoặc hành chính.</span>
                </div>

                {/* Score Summary Box */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">TỔNG ĐIỂM ĐÁNH GIÁ THÁNG:</span>
                    <strong className="text-lg text-slate-900 font-mono">{appraisalTotalScore} / 100 điểm</strong>
                  </div>
                  <div className={`p-2 border rounded-md font-bold text-center text-xs ${appraisalGrade.color}`}>
                    Xếp loại: {appraisalGrade.label}
                  </div>
                  <div className="space-y-1 pt-1">
                    <label className="block text-[10px] text-slate-400 font-bold">Ý kiến nhận xét của Trưởng bộ phận:</label>
                    <input 
                      type="text" 
                      value={appraisalComments}
                      onChange={(e) => setAppraisalComments(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded text-xs text-slate-800 bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setAppraisalSubmitted(true);
                      alert(`Đã nộp phiếu đánh giá ${appraisalTotalScore} điểm (Xếp loại: ${appraisalGrade.label}) lên Hệ thống lưu trữ. Trạng thái: Đang chờ CEO phê duyệt.`);
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-orange-600 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xác nhận Nộp phiếu Đánh giá hàng tháng</span>
                  </button>
                </div>

              </div>

            </div>

            {/* D & F. Competencies & Year-end Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* D. Khung năng lực theo chức danh */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs space-y-3">
                <span className="font-bold text-xs text-slate-800 block">🎖️ D. Khung năng lực Chức danh</span>
                <p className="text-[11px] text-slate-400 leading-normal">Khung năng lực cốt lõi theo tiêu chuẩn ISO 9001 của xưởng cơ khí TERASU:</p>
                
                <div className="space-y-2 text-[11px] font-medium">
                  {[
                    { label: 'Kiến thức chuyên môn', val: '85%' },
                    { label: 'Kỹ năng thực chiến thợ máy', val: '92%' },
                    { label: 'Thái độ & Tác phong', val: '95%' },
                    { label: 'Năng lực lãnh đạo / Quản trị', val: '78%' }
                  ].map((cap, ci) => (
                    <div key={ci} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-600">{cap.label}</span>
                        <span className="font-bold text-slate-800 font-mono">{cap.val}</span>
                      </div>
                      <div className="bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full rounded-full" style={{ width: cap.val }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-50 text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Cập nhật kiểm tra tay nghề định kỳ: 2026</span>
                </div>
              </div>

              {/* F. Tổng hợp cuối năm */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="font-bold text-xs text-orange-400 block uppercase">📈 F. Tổng hợp Cuối năm tự động</span>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Hệ thống tự động cộng dồn 12 tháng, lấy trung bình tính điểm xếp hạng khen thưởng và tăng lương:
                </p>

                <div className="space-y-1.5 text-[10.5px] font-mono leading-relaxed">
                  <div className="flex justify-between items-center bg-slate-950 p-1.5 rounded border border-slate-800">
                    <span className="text-emerald-400 font-bold">LOẠI A (Xuất sắc):</span>
                    <span>&gt; 90 điểm</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950 p-1.5 rounded border border-slate-800">
                    <span className="text-blue-400 font-bold">LOẠI B (Tốt):</span>
                    <span>80 - 89 điểm</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950 p-1.5 rounded border border-slate-800">
                    <span className="text-amber-400 font-bold">LOẠI C (Đạt):</span>
                    <span>70 - 79 điểm</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950 p-1.5 rounded border border-slate-800">
                    <span className="text-red-400 font-bold">LOẠI D (Cần cải thiện):</span>
                    <span>&lt; 70 điểm</span>
                  </div>
                </div>

                <div className="text-[9.5px] text-slate-400 leading-relaxed italic bg-slate-950/40 p-2 rounded border border-slate-800">
                  *Thưởng năm: Loại A được thưởng thêm 3 tháng lương; Loại B được thưởng 2 tháng lương.
                </div>
              </div>

            </div>

          </div>
        )}

        {/* SUB TAB 4: EMP PERFORMANCE FILE PORTFOLIO (E) */}
        {kpiSubTab === 'portfolio' && (
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs space-y-5 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b pb-3">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">E. Hồ sơ Hiệu suất Nhân sự Chi tiết</span>
                <p className="text-[11px] text-slate-400">Dữ liệu cá nhân tích lũy qua nhiều năm, hỗ trợ lộ trình thăng tiến cán bộ nguồn.</p>
              </div>

              {/* Employee selection */}
              <div className="flex items-center bg-slate-100 p-1 rounded-lg border">
                <span className="p-1 text-xs">👤</span>
                <select 
                  value={selectedEmpProfile} 
                  onChange={(e) => setSelectedEmpProfile(e.target.value)}
                  className="bg-transparent font-bold text-xs text-slate-700 focus:outline-hidden cursor-pointer pr-1"
                >
                  <option value="quang">Trần Minh Quang (Mua Hàng)</option>
                  <option value="lan">Nguyễn Thị Lan (Sales Rep)</option>
                  <option value="long">Lê Thăng Long (Nhân viên Kho)</option>
                  <option value="thuat">Nguyễn Kỹ Thuật (QC R&D)</option>
                </select>
              </div>
            </div>

            {/* Profile Detail Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              
              {/* Mini Avatar summary */}
              <div className="md:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-center space-y-3.5">
                <div className="w-16 h-16 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xl font-black mx-auto">
                  {selectedEmpProfile === 'quang' ? 'MQ' : selectedEmpProfile === 'lan' ? 'NL' : selectedEmpProfile === 'long' ? 'TL' : 'KT'}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    {selectedEmpProfile === 'quang' && 'Trần Minh Quang'}
                    {selectedEmpProfile === 'lan' && 'Nguyễn Thị Lan'}
                    {selectedEmpProfile === 'long' && 'Lê Thăng Long'}
                    {selectedEmpProfile === 'thuat' && 'Nguyễn Kỹ Thuật'}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono font-bold uppercase mt-0.5">
                    {selectedEmpProfile === 'quang' && 'Trưởng phòng Purchase - Mua hàng'}
                    {selectedEmpProfile === 'lan' && 'Chuyên viên Phát triển Đại lý - Kinh doanh'}
                    {selectedEmpProfile === 'long' && 'Thủ kho Nhông xích dĩa - Kho'}
                    {selectedEmpProfile === 'thuat' && 'Kỹ sư Thí nghiệm nén xích - QC'}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t text-xs text-slate-600">
                  <div className="flex justify-between"><span>Điểm KPI năm:</span> <strong className="text-slate-800">92 / 100đ</strong></div>
                  <div className="flex justify-between"><span>Kết quả đào tạo:</span> <strong className="text-emerald-700">Đạt chứng chỉ</strong></div>
                  <div className="flex justify-between"><span>Mức đãi ngộ:</span> <strong className="text-orange-600">Level 3</strong></div>
                </div>
              </div>

              {/* Detailed Performance History */}
              <div className="md:col-span-8 space-y-4">
                
                {/* Score breakdown metrics */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-emerald-50 text-emerald-950 border border-emerald-100 rounded-lg">
                    <span className="text-[9px] text-emerald-700 font-bold block">KPI TRUNG BÌNH THÁNG</span>
                    <strong className="text-base font-mono">92.4%</strong>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-950 border border-blue-100 rounded-lg">
                    <span className="text-[9px] text-blue-700 font-bold block">XẾP LOẠI NĂM NAY</span>
                    <strong className="text-base font-mono">LOẠI A</strong>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-950 border border-indigo-100 rounded-lg">
                    <span className="text-[9px] text-indigo-700 font-bold block">MỨC THĂNG TIẾN</span>
                    <strong className="text-xs">ĐỀ XUẤT QUY HOẠCH</strong>
                  </div>
                </div>

                {/* Awards & Disciplines history */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3 text-xs">
                  <span className="font-bold text-slate-800 block border-b pb-1">🎖️ Lịch sử Khen thưởng & Đề xuất thăng tiến</span>
                  
                  <div className="space-y-2 font-medium">
                    <div className="p-2 bg-white rounded border border-slate-150 flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓ KHEN THƯỞNG:</span>
                      <p className="text-slate-600">
                        {selectedEmpProfile === 'quang' && 'Bằng khen cá nhân xuất sắc về quản lý chuỗi HS Code và CO Form E giúp tiết kiệm thuế nhập khẩu.'}
                        {selectedEmpProfile === 'lan' && 'Chiến binh Sales xuất sắc nhất miền Bắc tháng 5/2026, mở mới 6 đại lý.'}
                        {selectedEmpProfile === 'long' && 'Khen thưởng hoàn thành 100% kiểm kho ắc quy không lệch cell.'}
                        {selectedEmpProfile === 'thuat' && 'Bằng khen R&D chế tạo thành công mẫu nhông dĩa WAVE độ cứng cao.'}
                      </p>
                    </div>

                    <div className="p-2 bg-white rounded border border-slate-150 flex items-start gap-2">
                      <span className="text-red-600 font-bold">⚠ KỶ LUẬT:</span>
                      <p className="text-slate-600">Không có vi phạm quy chuẩn hay SOP vận hành.</p>
                    </div>

                    <div className="p-2 bg-white rounded border border-slate-150 flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">✦ ĐỀ XUẤT THĂNG TIẾN:</span>
                      <p className="text-slate-600">
                        {selectedEmpProfile === 'quang' && 'Quy hoạch cán bộ nguồn lên Phó Giám Đốc Chuỗi cung ứng.'}
                        {selectedEmpProfile === 'lan' && 'Bổ nhiệm Trưởng nhóm Kinh doanh phụ tùng chuỗi miền Bắc.'}
                        {selectedEmpProfile === 'long' && 'Xét duyệt thăng hàm Quản lý Tổng kho xe máy TERASU.'}
                        {selectedEmpProfile === 'thuat' && 'Bổ nhiệm Trưởng nhóm Kiểm định QC sên DID chính hãng.'}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* SUB TAB 5: MODULE SYNCHRONIZATION (G) */}
        {kpiSubTab === 'sync' && (
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs space-y-5 animate-in fade-in duration-150">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">G. Đồng bộ Tự động với các Module Phòng ban</span>
              <p className="text-[11px] text-slate-400">Các chỉ số KPIs được kết xuất trực tiếp qua API từ 11 phòng ban không cần nhập tay.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              
              {/* Left block connections states */}
              <div className="md:col-span-6 space-y-3 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trạng thái liên kết cổng kết nối:</span>
                
                {[
                  { name: 'Phòng Mua Hàng', metric: 'Tỷ lệ lỗi nhà cung cấp sên DID', status: 'Liên kết LIVE ●', color: 'text-emerald-600 font-bold' },
                  { name: 'Phòng Kinh Doanh', metric: 'Doanh số thực tế của 15 đại lý sỉ', status: 'Liên kết LIVE ●', color: 'text-emerald-600 font-bold' },
                  { name: 'Phòng Kho Nhông Xích', metric: 'Số liệu sai lệch tồn kho dán nhãn', status: 'Liên kết LIVE ●', color: 'text-emerald-600 font-bold' },
                  { name: 'Phòng QC Kỹ thuật', metric: 'Tỷ lệ hỏng cell ắc quy chì Lead', status: 'Liên kết LIVE ●', color: 'text-emerald-600 font-bold' },
                  { name: 'Phòng Kế toán', metric: 'Tổng chi phí thực tế phát sinh', status: 'Liên kết LIVE ●', color: 'text-emerald-600 font-bold' },
                  { name: 'Dịch vụ sửa chữa', metric: 'Điểm khảo sát tay nghề thợ máy', status: 'Liên kết LIVE ●', color: 'text-emerald-600 font-bold' }
                ].map((con, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border flex items-center justify-between font-medium">
                    <div>
                      <span className="font-bold text-slate-800 block">{con.name}</span>
                      <span className="text-[10px] text-slate-500 block">Dữ liệu lấy: {con.metric}</span>
                    </div>
                    <span className={`text-[10px] font-mono ${con.color}`}>{con.status}</span>
                  </div>
                ))}
              </div>

              {/* Right block Sync controller & logs */}
              <div className="md:col-span-6 space-y-4">
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-xs space-y-3">
                  <span className="font-bold text-orange-950 block">💡 Cơ chế nạp dữ liệu ERP</span>
                  <p className="text-orange-900 leading-normal">
                    Để đảm bảo tính khách quan tối đa, nhân sự không thể tự sửa điểm KPI đầu ra. Toàn bộ sụt áp của bình điện TERASU hay doanh số đại lý đều được tổng hợp tự động 100% qua API.
                  </p>

                  <button
                    type="button"
                    onClick={handleTriggerSync}
                    disabled={isSyncingKpi}
                    className="w-full py-2 bg-slate-900 hover:bg-orange-600 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingKpi ? 'animate-spin' : ''}`} />
                    <span>{isSyncingKpi ? 'Đang thực hiện đối soát live...' : 'Kích hoạt Cập nhật API & Đồng bộ KPIs Ngay'}</span>
                  </button>
                </div>

                {/* Sync Console */}
                {syncLogs.length > 0 && (
                  <div className="bg-slate-900 text-slate-300 font-mono p-3 rounded-lg border border-slate-800 text-[10.5px] space-y-1.5 max-h-48 overflow-y-auto">
                    <div className="text-[9.5px] text-emerald-400 font-bold border-b border-slate-800 pb-1">
                      CONSOLE SYNC LOGS:
                    </div>
                    {syncLogs.map((log, li) => (
                      <div key={li} className="flex items-start gap-1">
                        <span className="text-emerald-500 font-bold">&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* SUB TAB 6: BONUS & SALARY INCENTIVES (I) */}
        {kpiSubTab === 'promotions' && (
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs space-y-5 animate-in fade-in duration-150">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">I. Hệ thống Thưởng và Xét duyệt Tăng lương tự động</span>
              <p className="text-[11px] text-slate-400">Kết nối trực tiếp kết quả đánh giá cuối năm (A, B, C, D) với quỹ phúc lợi của công ty.</p>
            </div>

            {/* Incentive Policy Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {[
                { title: '💵 THƯỞNG CUỐI NĂM', desc1: '• Hạng A: Thưởng +3 tháng lương', desc2: '• Hạng B: Thưởng +2 tháng lương', bg: 'bg-emerald-50 border-emerald-100 text-emerald-950' },
                { title: '📈 XÉT TĂNG LƯƠNG', desc1: '• Hạng A: Tăng 15% lương cơ bản', desc2: '• Hạng B: Tăng 8% lương cơ bản', bg: 'bg-blue-50 border-blue-100 text-blue-950' },
                { title: '🚀 BỔ NHIỆM QUẢN LÝ', desc1: '• Đạt Hạng A trong 2 năm liên tiếp', desc2: '• Ưu tiên quy hoạch cán bộ nguồn', bg: 'bg-indigo-50 border-indigo-100 text-indigo-950' }
              ].map((pol, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${pol.bg} space-y-2 font-medium`}>
                  <span className="font-bold text-[11px] uppercase tracking-wider block">{pol.title}</span>
                  <div className="space-y-1 font-semibold">
                    <div>{pol.desc1}</div>
                    <div>{pol.desc2}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Calculator widget */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-xl mx-auto space-y-4 text-xs font-medium">
              <span className="font-bold text-slate-800 block">🧮 Trình tính toán dự toán quỹ thưởng Tết & Tăng lương dự kiến</span>
              <p className="text-slate-500 leading-normal">Nhập mức lương cơ bản hiện tại của vị trí thợ máy hoặc hành chính để tính quỹ phúc lợi tương ứng:</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Mức lương cơ bản (VND):</label>
                  <input 
                    type="number" 
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 bg-white rounded font-mono font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Hạng đánh giá hiện thời:</label>
                  <div className="p-2 bg-white border border-slate-200 rounded font-bold text-orange-600 font-mono">
                    Hạng A (Từ sliders đánh giá)
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white border rounded-lg space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>Dự kiến Thưởng cuối năm (+3 tháng):</span>
                  <strong className="text-emerald-600">{(baseSalary * 3).toLocaleString()} VND</strong>
                </div>
                <div className="flex justify-between">
                  <span>Mức lương mới sau xét tăng (+15%):</span>
                  <strong className="text-emerald-600">{(baseSalary * 1.15).toLocaleString()} VND</strong>
                </div>
                <div className="flex justify-between border-t pt-1.5 font-sans font-bold text-slate-800 text-xs">
                  <span>Ưu tiên bổ nhiệm:</span>
                  <span className="text-indigo-600">Được quy hoạch cán bộ cấp quản lý</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    );
  };

  return (
    <div className="space-y-6" id="departmental-workspace">
      
      {/* Tab bar of Departments */}
      <div className="flex flex-wrap gap-2 border-b border-slate-150 pb-3">
        {departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => {
              setActiveDept(dept.id);
              setActiveQuizCourse(null); // Reset active course on dept switch
            }}
            className={`px-4 py-2.5 rounded-lg border text-xs md:text-sm font-bold transition-colors cursor-pointer focus:outline-hidden ${
              activeDept === dept.id 
                ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {dept.name}
          </button>
        ))}
      </div>

      {/* Main Department Body */}
      {departments.filter(d => d.id === activeDept).map((dept) => {
        
        {/* Render separate Workspace for Performance KPI department */}
        if (dept.id === 'KPI_PERFORMANCE') {
          return renderKpiPerformanceWorkspace(dept);
        }

        return (
          <div key={dept.id} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-300">
            
            {/* Left Block: Information Card (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 text-orange-700 rounded-lg">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm md:text-base">{dept.name}</h3>
                    <p className="text-xs text-slate-400">Trưởng phòng: {dept.head}</p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-50 pt-3">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Nhân đai chính thức:</span>
                    <strong className="text-slate-800">{dept.staffCount} người</strong>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Phân quyền cơ bản:</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-bold px-1.5 py-0.2 rounded uppercase">
                      Level 2 (Department Head)
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg border">
                  {dept.details}
                </p>

                <div className="space-y-1.5">
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Các việc vận hành chính:</span>
                  <div className="space-y-1 text-xs">
                    {dept.activities.map((act, ai) => (
                      <div key={ai} className="flex items-center gap-1.5 text-slate-600">
                        <span className="text-orange-500 text-[10px]">•</span>
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Matrix RACIS Block only shown under certain conditions or for general clarity */}
              {activeDept === 'HCNS' && (
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-3">
                  <h4 className="font-bold text-slate-800 text-xs md:text-sm flex items-center gap-1">
                    <Users className="w-4.5 h-4.5 text-orange-600" />
                    <span>Sơ đồ Ma trận Phân quyền RACIS</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Biểu đồ phân vai cụ thể cho các chuỗi hoạt động của phụ tùng TERASU:
                  </p>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {RACI_MATRIX.map((r, ri) => (
                      <div key={ri} className="p-2 border border-slate-150 rounded bg-slate-50 space-y-1 text-xs">
                        <div className="font-bold text-slate-700">{r.activity}</div>
                        <div className="grid grid-cols-4 gap-1 text-[9px] text-center pt-1 font-mono">
                          <span className="bg-blue-50 text-blue-700 rounded p-0.5" title="Responsible - Thực hiện">R: {r.r}</span>
                          <span className="bg-orange-50 text-orange-700 rounded p-0.5" title="Accountable - Phê duyệt">A: {r.a}</span>
                          <span className="bg-indigo-50 text-indigo-700 rounded p-0.5" title="Consulted - Tham vấn">C: {r.c}</span>
                          <span className="bg-slate-100 text-slate-600 rounded p-0.5" title="Informed - Nhận tin">I: {r.i}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Block: Training Materials and Curriculums (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Training Courses List */}
              {!activeQuizCourse ? (
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-orange-600" />
                      <h3 className="font-bold text-slate-800 text-sm md:text-base">Trung Tâm Huấn Luyện & Kiểm Soát Tay Nghề Thợ</h3>
                    </div>
                    <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded">ACADEMY</span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Để đảm bảo chất lượng sửa chữa đồng đều cho chuỗi đối tác dịch vụ, mọi nhân viên và thợ cơ khí liên kết TERASU bắt buộc phải hoàn thành các bài học nghiệp vụ. Slide hướng lắp xích DID, video tháo dỡ sên chùng và phiếu tính dung sai dưới đây:
                  </p>

                  <div className="space-y-3">
                    {TRAINING_CURRICULUM.map((course) => (
                      <div 
                        key={course.id}
                        className="p-4 rounded-xl border border-slate-150 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] uppercase font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded font-mono">
                              {course.category}
                            </span>
                            <span className="text-slate-400 text-xs flex items-center gap-0.5">
                              <Clock className="w-3 h-3" /> {course.duration}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-800 text-xs md:text-sm truncate">{course.title}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartExam(course)}
                            className="px-4 py-2 bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3" fill="currentColor" />
                            <span>Học & Làm Bài Test</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Active Educational Test / Quiz Module */
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4 animate-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-orange-600" />
                      <div>
                        <h3 className="font-bold text-slate-800 text-xs md:text-sm">Đang thi kiểm chuẩn: {activeQuizCourse.title}</h3>
                        <p className="text-[10px] text-slate-400">Danh mục thi đua: {activeQuizCourse.category}</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setActiveQuizCourse(null)}
                      className="text-xs text-slate-500 hover:text-slate-800 hover:underline"
                    >
                      Quay lại danh sách bài học
                    </button>
                  </div>

                  {/* Subtitle / Details panel */}
                  <div className="p-3 bg-orange-50 text-orange-900 border border-orange-100 rounded-lg text-xs leading-relaxed">
                    <strong>Quy chuẩn nộp bài:</strong> Trả lời chính xác tất cả các câu hỏi trắc nghiệm dưới đây để chứng minh kỹ năng thợ máy bậc 3 hoặc nhân viên am hiểu HS Code. Kết quả thi sẽ tự nộp về kho KPIs cá nhân của bạn.
                  </div>

                  {/* Quiz Body Questions list */}
                  <div className="space-y-6 pt-2">
                    {activeQuizCourse.quiz.map((q, qIndex) => (
                      <div key={qIndex} className="space-y-3 p-4 border border-slate-150 rounded-xl bg-slate-50/50">
                        <div className="font-bold text-slate-800 text-xs md:text-sm flex items-start gap-1">
                          <span className="text-orange-600 shrink-0">Câu {qIndex + 1}:</span>
                          <span>{q.question}</span>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 pl-4">
                          {q.options.map((opt, oIndex) => {
                            const isSelected = selectedAnswers[qIndex] === oIndex;
                            const isCorrect = q.correctAnswer === oIndex;
                            
                            let btnClass = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50';
                            if (isSelected) {
                              btnClass = 'border-orange-500 bg-orange-50 text-orange-950 font-semibold';
                            }
                            
                            if (quizSubmitted) {
                              if (isCorrect) {
                                btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                              } else if (isSelected) {
                                btnClass = 'border-red-500 bg-red-50 text-red-950';
                              } else {
                                btnClass = 'border-slate-100 bg-slate-50 text-slate-400 opacity-70';
                              }
                            }

                            return (
                              <button
                                key={oIndex}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() => handleSelectAnswer(qIndex, oIndex)}
                                className={`text-left p-3 rounded-lg border text-xs md:text-sm transition-all focus:outline-hidden flex items-center justify-between ${btnClass}`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && isCorrect && <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 ml-2" />}
                                {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-4.5 h-4.5 text-red-600 shrink-0 ml-2" />}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="text-xs text-slate-600 bg-white p-3 rounded border border-slate-100 mt-2 italic leading-relaxed">
                            <strong>Lời giải chi tiết:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Submit Panel / Scoring Feedback */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    {quizSubmitted ? (
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-black">
                          SCORE: {quizScore} / {activeQuizCourse.quiz.length}
                        </div>
                        <div className="text-xs">
                          {quizScore === activeQuizCourse.quiz.length ? (
                            <span className="text-emerald-700 font-bold">Xuất sắc! Bạn đã đạt chứng chỉ chuyên môn này.</span>
                          ) : (
                            <span className="text-amber-700 font-bold">Khá tốt. Vui lòng đọc kĩ file PDF để đạt điểm tuyệt đối kì sau.</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500">
                        Vui lòng tích vào đáp án phù hợp trước khi nộp tờ khảo sát.
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveQuizCourse(null)}
                        className="px-4 py-2 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                      >
                        Hủy thi
                      </button>
                      {!quizSubmitted ? (
                        <button
                          type="button"
                          onClick={handleSubmitQuiz}
                          disabled={Object.keys(selectedAnswers).length < activeQuizCourse.quiz.length}
                          className="px-5 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
                        >
                          Nộp Bài Thi
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartExam(activeQuizCourse)}
                          className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          Thi lại chuyên đề
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>
        );
      })}

    </div>
  );
}
