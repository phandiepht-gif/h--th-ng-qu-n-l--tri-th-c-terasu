/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Role, Document, WorkflowTicket } from '../types';
import { 
  Bell, CheckSquare, TrendingUp, AlertTriangle, FileText, 
  Sparkles, ShieldCheck, Clock, UserCheck, ChevronRight, FileUp, 
  HelpCircle, BarChart3, Search, PlaySquare
} from 'lucide-react';
import { INITIAL_DOCUMENTS, INITIAL_TICKETS } from '../data/mockData';

interface DashboardProps {
  currentRole: Role;
  onSetTab: (tab: string) => void;
  onViewDoc: (doc: Document) => void;
  onViewTicket: (ticket: WorkflowTicket) => void;
}

export function Dashboard({ currentRole, onSetTab, onViewDoc, onViewTicket }: DashboardProps) {
  const [quickSearch, setQuickSearch] = useState('');
  
  // Simulated stats based on role
  const getRoleGreetingAndKPI = () => {
    switch (currentRole) {
      case 'CEO':
        return {
          title: 'Tổng Giám Đốc Phan Điệp',
          personalKPI: '98%',
          deptKPI: '92% (Chỉ số Chuỗi đại lý)',
          personalKPIType: 'Hoàn thiện Chiến lược 2026',
          deptKPIType: 'Độ lấp đầy kệ hàng toàn miền Nam',
          pendingTasks: [
            { id: 't-1', text: 'Phê duyệt lô đặt hàng sên DID sỉ 5.000 bộ', priority: 'Cao', docCode: 'TRS-BG-DID-2026' },
            { id: 't-auth', text: 'Ký duyệt gia nhập chuỗi Đại lý độc quyền Cầu Giấy', priority: 'Trung bình', docCode: 'TRS-SOP-DL-02' }
          ]
        };
      case 'DIRECTOR':
        return {
          title: 'Giám Đốc Vận Hành Phạm Đức Long',
          personalKPI: '94%',
          deptKPI: '89% (Đội Thợ sửa chữa)',
          personalKPIType: 'Tối ưu Chi phí Logistics',
          deptKPIType: 'Kiểm chuẩn bảo hành 24h trạm chính',
          pendingTasks: [
            { id: 't-2', text: 'Ký quyết toán xe Honda Lead hụt điện của khách Điệp', priority: 'Cao', docCode: 'TRS-SOP-BH-03' },
            { id: 't-sop', text: 'Bảo hành kiểm thử nhông rơ đạt dung sai +/- 0.02mm', priority: 'Cao', docCode: 'TRS-QC-TS-2026' }
          ]
        };
      case 'HEAD':
        return {
          title: 'Trưởng Phòng Mua Hàng Trần Minh Quang',
          personalKPI: '87%',
          deptKPI: '82% (Thuế mậu dịch E)',
          personalKPIType: 'HS Code & Hải quan trơn tru',
          deptKPIType: 'Đàm phán chiết khấu DID kì hè',
          pendingTasks: [
            { id: 't-head1', text: 'Báo cáo thông thuế lô nhông trước Wave 110cc', priority: 'Cao', docCode: 'TRS-PL-HS-01' },
            { id: 't-head2', text: 'Cập nhật tài khoản Canva / ChatGPT Plus Team', priority: 'Thấp', docCode: 'acc-5' }
          ]
        };
      case 'EMPLOYEE':
        return {
          title: 'Kỹ Thuật Viên Sửa Chữa Lê Thợ Máy',
          personalKPI: '91%',
          deptKPI: '94% (Mức độ hài lòng của khách)',
          personalKPIType: 'Sửa chữa SOP thợ lành nghề',
          deptKPIType: 'Giải bài tập tự kiểm sên',
          pendingTasks: [
            { id: 't-3', text: 'Thực hiện bài thi kiểm chuẩn xe Wave và Dream sên 9ly', priority: 'Cao', docCode: 'tm-2' },
            { id: 't-4', text: 'Lập sơ đồ layout góc sắp xếp kệ phụ kiện phụ sên', priority: 'Trung bình', docCode: 'TRS-SOP-KHO-01' }
          ]
        };
      case 'SUPPLIER':
        return {
          title: 'Trực ban Đại diện DID Kogyo (Nhật Bản)',
          personalKPI: '100%',
          deptKPI: '96% (Tỷ lệ hàng đạt QC test)',
          personalKPIType: 'Xếp lịch chuyển hàng PO sên vàng',
          deptKPIType: 'Độ đàn hồi của chốt xích tải',
          pendingTasks: [
            { id: 't-s1', text: 'Gửi lô mẫu sên dập dã ngoại test kéo dĩa Wave', priority: 'Cao', docCode: 'TRS-QC-TS-2026' }
          ]
        };
      case 'CUSTOMER':
        return {
          title: 'Đối tác / Chủ Đại Lý Sửa Chữa (Cầu Giấy)',
          personalKPI: '100%',
          deptKPI: '100% (Khuyến mãi tích điểm)',
          personalKPIType: 'Ký nhận đổi mới ắc quy sụt áp',
          deptKPIType: 'Chỉ tiêu doanh thu Terasu Lube',
          pendingTasks: [
            { id: 't-c1', text: 'Khảo sát độ hài lòng bảo dưỡng xích DID vàng', priority: 'Cao', docCode: 'TRS-DT-SP-02' }
          ]
        };
    }
  };

  const dashboardInfo = getRoleGreetingAndKPI();

  // Filter latest documents matching role
  const latestDocs = INITIAL_DOCUMENTS.slice(0, 4);

  // Internal corporate announcements
  const announcements = [
    {
      id: 'ann-1',
      date: 'Hôm nay, 08:30',
      tag: 'QUAN TRỌNG',
      tagColor: 'bg-red-100 text-red-700',
      title: 'Triển khai áp dụng mã số HS Code mới đối với phụ tùng nhông trước xích sên Wave',
      body: 'Phòng Mua hàng chú ý cập nhật tờ khai hải quan theo biểu mẫu TRS-PL-HS-01 để tránh rủi ro thanh tra hải quan tại cảng Hải Phòng.'
    },
    {
      id: 'ann-2',
      date: 'Hôm qua, 14:15',
      tag: 'KỸ THUẬT',
      tagColor: 'bg-indigo-100 text-indigo-700',
      title: 'Sổ tay chẩn đoán sụt áp ắc quy khô TERASU v3.0 chính thức được thông qua',
      body: 'Toàn bộ các trạm sỹ thuộc chuỗi đại lý ủy quyền miền Bắc tiến hành học tập khóa học ngắn v3.0 trên hệ thống và làm bài test kiểm chuẩn.'
    },
    {
      id: 'ann-3',
      date: '21/06/2026',
      tag: 'HOẠT ĐỘNG',
      tagColor: 'bg-emerald-100 text-emerald-700',
      title: 'Nhập kho thành công lô hàng xích sỉ hãng DID từ đối tác Nhật Bản',
      body: 'Phòng kho bãi đã hoàn tất layout sếp dĩa, mã QR tag dán. Kính báo CEO phê chuẩn giải ngân nốt gói đặt cọc L/C đợt 2.'
    }
  ];

  return (
    <div className="space-y-6" id="dashboard-system-view">
      
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold font-mono">
              ROLE: {currentRole}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Cập nhật lúc: 23/06/2026 (Giờ Hà Nội)</span>
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
            Xin chào, <span className="text-orange-600">{dashboardInfo.title}</span> 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Hệ thống Quản lý Tri thức (EKMS) đang vận hành trơn tru. Toàn bộ 11 cây thư mục và 2 luồng quy trình nghiệp vụ đã được đồng bộ.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap gap-2">
          <button 
            type="button"
            onClick={() => onSetTab('search')}
            className="px-4 py-2 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white font-semibold text-xs md:text-sm rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>AI Search toàn sàn</span>
          </button>
          
          <button 
            type="button"
            onClick={() => onSetTab('knowledge')}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs md:text-sm rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileUp className="w-4 h-4" />
            <span>Tài liệu & SOP</span>
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Personal KPI */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">KPI Cá nhân tháng này</span>
            <h4 className="text-2xl font-black text-slate-800">{dashboardInfo.personalKPI}</h4>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>Chỉ số: {dashboardInfo.personalKPIType}</span>
            </p>
          </div>
          <div className="p-3 bg-orange-50 rounded-full text-orange-600">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Department KPI */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">KPI Phòng ban liên quan</span>
            <h4 className="text-2xl font-black text-slate-800">{dashboardInfo.deptKPI}</h4>
            <p className="text-[11px] text-blue-600 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>{dashboardInfo.deptKPIType}</span>
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        {/* Security / System Integrity */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">An ninh Tài liệu & SSL</span>
            <h4 className="text-xs md:text-sm font-bold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Đã phân quyền an toàn 100%</span>
            </h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Mã hóa dữ liệu tài khoản và đồng bộ mộc đỏ xuất nhập khẩu sên DID.
            </p>
          </div>
          <div className="p-2 bg-slate-100 rounded text-slate-600 font-mono text-[10px] text-right">
            <div>HOST: KDATA</div>
            <div className="text-orange-600 font-medium">SSL: Active</div>
          </div>
        </div>

      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Module: Announcements + Pending task queues (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Urgent Workflow Queue (Pending Approvals) */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-slate-800 text-sm md:text-base">Mục Việc Cần Xử Lý Cho Vai Trò Của Bạn</h3>
              </div>
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold font-mono">
                {dashboardInfo.pendingTasks.length} VIỆC
              </span>
            </div>

            <div className="space-y-2.5">
              {dashboardInfo.pendingTasks.map((task, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 bg-slate-50 hover:bg-orange-50/50 rounded-lg border border-slate-200 hover:border-orange-200 transition-all flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-sm ${
                        task.priority === 'Cao' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        Đầu việc {task.priority}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">CODE: {task.docCode}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-700">{task.text}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (task.id === 't-1' || task.id === 't-2') {
                        onSetTab('workflows');
                      } else if (task.id === 't-3') {
                        onSetTab('departments');
                      } else {
                        onSetTab('knowledge');
                      }
                    }}
                    className="text-xs bg-slate-900 text-white hover:bg-orange-600 px-3 py-1.5 rounded-md transition-colors flex items-center gap-0.5 whitespace-nowrap cursor-pointer"
                  >
                    <span>Giải quyết</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sổ tay thông báo nội bộ */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <Bell className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold text-slate-800 text-sm md:text-base">Thông Báo Và Tin Tức Nội Bộ</h3>
            </div>

            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="group relative pl-4 border-l-2 border-slate-200 hover:border-orange-500 transition-colors space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono font-bold">{ann.date}</span>
                    <span className={`text-[9.5px] uppercase font-black px-1.5 py-0.2 rounded ${ann.tagColor}`}>
                      {ann.tag}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs md:text-sm group-hover:text-orange-600 transition-colors leading-snug">
                    {ann.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {ann.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Module: Shortcuts + New SOPs released (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Shortcuts to Terasu 11 Folder Directories */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm md:text-base border-b border-slate-50 pb-2">
              Bản Bản đồ Cây tri thức TERASU
            </h3>
            
            <p className="text-xs text-slate-500">
              Chỉ mục nhanh tới cấu trúc cây 11 phòng ban. Nhấp để dịch chuyển nhanh:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {[
                { name: '01. Chiến lược', path: 'TERASU/01. CHIẾN LƯỢC' },
                { name: '02. HCNS', path: 'TERASU/02. HCNS' },
                { name: '03. Marketing', path: 'TERASU/03. MARKETING' },
                { name: '04. Kinh doanh', path: 'TERASU/04. KINH DOANH' },
                { name: '05. Kế toán', path: 'TERASU/05. KẾ TOÁN' },
                { name: '06. Mua hàng', path: 'TERASU/06. MUA HÀNG' },
                { name: '07. Kho bãi', path: 'TERASU/07. KHO' },
                { name: '08. QC Kỹ thuật', path: 'TERASU/08. QC KỸ THUẬT' },
                { name: '09. Dịch vụ sửa sỹ', path: 'TERASU/09. DỊCH VỤ SỬA CHỮA' },
                { name: '10. Pháp lý', path: 'TERASU/10. PHÁP LÝ' },
                { name: '11. Tài khoản', path: 'TERASU/11. TÀI KHOẢN HỆ THỐNG' },
              ].map((folder, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onSetTab('knowledge');
                    // Wait, we need to pass selected folder path
                    // We will handle this by updating state in App.tsx
                    // Let's pass folder.path to onSetCategory
                    onSetTab('knowledge');
                  }}
                  className="p-2 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-lg text-left text-xs font-semibold text-slate-700 transition-colors focus:outline-hidden group"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 group-hover:text-orange-500 text-[10px] font-bold">📂</span>
                    <span className="truncate group-hover:text-orange-700">{folder.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Newly updated SOPs / Bulletins */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-1.5">
                <FileText className="w-5 h-5 text-orange-600" />
                <span>Quy trình / Tài liệu Mới</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-bold">MỚI CẬP NHẬT</span>
            </div>

            <div className="space-y-3">
              {latestDocs.map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => onViewDoc(doc)}
                  className="p-3 rounded-lg border border-slate-150 hover:border-orange-300 hover:bg-slate-50/50 cursor-pointer transition-all flex items-start gap-2.5"
                >
                  <span className="p-1.5 bg-slate-100 rounded group-hover:bg-orange-100 text-slate-500">📎</span>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-mono text-slate-400 font-bold truncate">{doc.code}</span>
                      <span className="text-[9px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.2 rounded-sm whitespace-nowrap">v{doc.version}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-700 truncate">{doc.name}</h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Phòng: {doc.department}</span>
                      <span>{doc.updatedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onSetTab('knowledge')}
              className="w-full text-center py-2 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center justify-center gap-0.5"
            >
              <span>Xem tất cả kho Wiki tài liệu</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
