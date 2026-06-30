/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage'
import { useAuth } from './hooks/useAuth'
import { Role, Document, AuditLog, WorkflowTicket } from './types';
import { INITIAL_DOCUMENTS, INITIAL_AUDIT_LOGS } from './data/mockData';
import { supabase } from './lib/supabase';

// Component imports
import { RoleSelector } from './components/RoleSelector';
import { Dashboard } from './components/Dashboard';
import { AISearch } from './components/AISearch';
import { KnowledgeCenter } from './components/KnowledgeCenter';
import BulkUpload from './components/BulkUpload';
import { DepartmentManager } from './components/DepartmentManager';
import { AccountManager } from './components/AccountManager';
import { WorkflowManager } from './components/WorkflowManager';
import { DocumentImportModal } from './components/DocumentImportModal';
import { SystemAdmin } from './components/SystemAdmin';

import { motion } from 'motion/react';

// Icon imports
import { 
  BarChart3, Search, FolderClosed, BookOpen, Key, Workflow, 
  History, ShieldAlert, Award, LogOut, Sliders, Menu, X, Info, HelpCircle, Shield
} from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('CEO');
  const { user, loading: authLoading, signOut } = useAuth()

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);

  // Nạp tài liệu thật từ Supabase, gộp với danh sách mock
  React.useEffect(() => {
    async function loadRealDocuments() {
      const { data, error } = await supabase
        .from('documents')
        .select('*, folders(name, code)')
        .order('id', { ascending: false });
      if (error) { console.error('Lỗi tải documents:', error.message); return; }
      if (data && data.length > 0) {
        const mapped: Document[] = data.map((d: any) => ({
          id: String(d.id),
          code: d.code || '(Chưa có mã)',
          name: d.title,
          type: (d.doc_type as any) || 'SOP/Quy trình',
          department: d.folders?.name || '-',
          categoryPath: (function() { var m = {'CHIEN_LUOC':'TERASU/01. CHIẾN LƯỢC','HCNS':'TERASU/02. HCNS','MARKETING':'TERASU/03. MARKETING','KINH_DOANH':'TERASU/04. KINH DOANH','KE_TOAN':'TERASU/05. KẾ TOÁN','MUA_HANG':'TERASU/06. MUA HÀNG','KHO_BAI':'TERASU/07. KHO','QC_KY_THUAT':'TERASU/08. QC KỸ THUẬT','DICH_VU_SUA_CHUA':'TERASU/09. DỊCH VỤ SỬA CHỮA','PHAP_LY':'TERASU/10. PHÁP LÝ','TAI_KHOAN':'TERASU/11. TÀI KHOẢN'}; var code = d.folders ? d.folders.code : null; return m[code] || 'TERASU'; })(),
          creator: '-',
          approver: '-',
          createdAt: d.created_at ? String(d.created_at).substring(0,10) : '-',
          updatedAt: d.created_at ? String(d.created_at).substring(0,10) : '-',
          version: d.version || '1.0',
          status: 'Ban hành',
          tags: d.tags || [],
          accessRights: ['CEO','DIRECTOR','HEAD','EMPLOYEE'] as any,
          contentSummary: d.description || '',
          fileUrl: d.file_url || undefined,
          fileSize: d.file_size_kb ? (d.file_size_kb + ' KB') : undefined
        }));
        setDocuments(prev => [...mapped, ...prev]);
      }
    }
    loadRealDocuments();
  }, []);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Selected category path when jumping from shortcuts
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<string>('TERASU');

  // Preview Document metadata drawer state
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  // Mobile sidebar visibility toggle close
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global Import Modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Auto scroll to chat messages simulator helpers
  const handleViewDocDetails = (doc: Document) => {
    setPreviewDoc(doc);
    
    // Add audit log for viewing document
    const newLog: AuditLog = {
      id: `al-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: `Nhân sự (${currentRole})`,
      role: currentRole,
      action: 'Xem Hồ sơ Metadata',
      target: `${doc.code} - ${doc.name}`,
      status: 'Thành công'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleAddDocument = (newDoc: Document) => {
    setDocuments(prev => [newDoc, ...prev]);
    
    // Add audit log for uploads
    const newLog: AuditLog = {
      id: `al-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: `Quản trị viên (${currentRole})`,
      role: currentRole,
      action: 'Đăng tải tài liệu Wiki',
      target: `${newDoc.code} - ${newDoc.name}`,
      status: 'Thành công'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleDeleteDocument = (id: string) => {
    const targetDoc = documents.find(d => d.id === id);
    if (!targetDoc) return;

    setDocuments(prev => prev.filter(d => d.id !== id));

    // Audit log
    const newLog: AuditLog = {
      id: `al-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: `Hủy duyệt viên (${currentRole})`,
      role: currentRole,
      action: 'Thu hồi / Xóa tài liệu',
      target: `${targetDoc.code} - ${targetDoc.name}`,
      status: 'Thành công'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Switch Role handler
  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    setIsMobileMenuOpen(false);

    // Audit log
    const newLog: AuditLog = {
      id: `al-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Hệ thống an ninh',
      role: role,
      action: 'Chuyển đổi Ủy quyền',
      target: `Đặt mức vai trò chính: ${role}`,
      status: 'Thành công'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Sidebar Menu list
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard Tổng quan', icon: BarChart3 },
    { id: 'search', name: 'AI Search & Trợ lý', icon: Search, badge: 'Smart' },
    { id: 'knowledge', name: 'Trung tâm Tri thức', icon: FolderClosed },
    { id: 'departments', name: 'Phòng ban & Đào tạo', icon: BookOpen },
    { id: 'accounts', name: 'Tài khoản Hệ thống', icon: Key },
    { id: 'workflows', name: 'Quy trình & Phê duyệt', icon: Workflow },
    { id: 'audit', name: 'Nhật ký Hoạt động', icon: History },
    { id: 'admin', name: 'Quản trị Hệ thống', icon: ShieldAlert, badge: 'Full' }
  ];

  const getActiveTabLabel = () => {
    return menuItems.find(item => item.id === activeTab)?.name || 'Hệ thống';
  };

 if (authLoading) return (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <span className="text-slate-400 text-sm">Đang tải...</span>
  </div>
)
if (!user) return <LoginPage onLoginSuccess={() => {}} />
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col antialiased text-slate-800" id="master-terasu-ekms">
      
      {/* High Density Top Navbar Header - Modern Light Accent themed */}
      <header className="h-16 bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between shadow-xs" id="layout-header-pane">
        
        {/* Left Side: Brand Logo for Mobile */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-slate-500 hover:text-slate-800 md:hidden rounded-md hover:bg-slate-100"
            title="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-sm bg-orange-600 flex items-center justify-center text-white font-extrabold text-xs tracking-tight shadow-xs">
              TR
            </span>
            <div className="leading-tight">
              <h1 className="font-extrabold text-xs md:text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
                <span>TERASU EKMS</span>
                <span className="text-[9px] bg-slate-900 text-slate-100 font-bold px-1 rounded-sm uppercase tracking-wider">v2.4</span>
              </h1>
              <p className="text-[9px] text-slate-500 font-medium">
                Hệ thống Quản lý Tri thức Doanh nghiệp Phụ tùng Xe máy
              </p>
            </div>
          </div>
        </div>

        {/* Center: System Status & Clock (High Density design) */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-200/60 text-[11px] text-slate-600 font-medium">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
          <span>Bảo mật: <span className="text-emerald-700 font-mono font-bold">Safe SSL</span></span>
          <span className="text-slate-300">|</span>
          <span>Hành chính: <span className="font-mono text-slate-800 font-semibold">2026-06-23</span></span>
        </div>

        {/* Global Import Action Button */}
        <button 
          onClick={() => setIsImportModalOpen(true)}
          className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black rounded-lg transition-all shadow-xs cursor-pointer flex items-center gap-1.5 animate-pulse hover:animate-none"
          title="Import tài liệu & Biên soạn SOP biểu mẫu"
          id="global-header-import-btn"
        >
          <span>📁</span>
          <span>Import / Tạo tài liệu</span>
        </button>

        {/* Right Side: Role & Identity Access selector */}
        <div className="flex items-center gap-3">
          
          {/* Quick role preview text */}
          <div className="hidden sm:flex flex-col text-right leading-none">
            <span className="text-[10px] text-slate-400 font-semibold">Vai trò phân quyền:</span>
            <span className="text-[11px] text-slate-800 font-extrabold mt-0.5 uppercase tracking-wide">
           {user?.email || 'Đang tải...'}
            </span>
          </div>

          {/* Compact Role Selector Dropdown */}
          <div className="flex items-center bg-slate-100/80 rounded-lg p-1 border border-slate-200/80 hover:bg-slate-150 transition-colors">
            <span className="p-0.5 text-xs">🛡️</span>
            <select
              value={currentRole}
              onChange={(e) => handleRoleChange(e.target.value as Role)}
              className="bg-transparent text-[11px] text-slate-700 focus:outline-hidden font-bold pr-1 cursor-pointer"
              id="role-dropdown-quick"
            >
              <option value="CEO">CEO (Bán sỉ & Khắc khổ)</option>
              <option value="DIRECTOR">Ban Giám Đốc</option>
              <option value="HEAD">Trưởng Phòng</option>
              <option value="EMPLOYEE">Nhân Viên / Thợ máy</option>
              <option value="SUPPLIER">Nhà Cung Cấp</option>
              <option value="CUSTOMER">Khách hàng / Đại lý</option>
            </select>
          </div>

        </div>
      </header>

      {/* Main Structural Layout Box */}
      <div className="w-full flex-1 flex flex-col md:flex-row relative z-10" id="main-structural-grid">
        
        {/* Navigation Sidebar (Desktop - Custom Dark Slate High Density) */}
        <aside className="hidden md:block w-60 bg-slate-950 text-slate-300 shrink-0 border-r border-slate-800 flex flex-col justify-between" id="sidebar-pane">
          
          <div className="p-3.5 space-y-5">
            {/* Sidebar Title Subbar */}
            <div>
              <span className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest block px-2 mb-2">QUẢN LÝ TRI THỨC</span>
              
              {/* Menu List */}
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (item.id === 'knowledge') {
                          setSelectedCategoryPath('TERASU');
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold transition-all flex items-center justify-between group cursor-pointer focus:outline-hidden ${
                        isActive 
                          ? 'bg-orange-600 text-white font-bold shadow-sm' 
                          : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                      id={`nav-item-${item.id}`}
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[8px] font-bold uppercase px-1 rounded-xs ${
                          isActive ? 'bg-white text-orange-700 font-extrabold' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section: Authority Scope Details */}
            <div className="pt-3 border-t border-slate-800">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-bold text-orange-400">
                  <Sliders className="w-3 h-3" />
                  <span>PHẠM VI ĐỐI SOÁT:</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal font-medium">
                  {currentRole === 'CEO' && 'Hệ số tối cao: Biên độ sỉ sên dĩa DID, hợp đồng pháp lý mộc đỏ, accounts tối mật.'}
                  {currentRole === 'DIRECTOR' && 'Biên độ: Đối soát 11 phòng ban, phê duyệt quy chuẩn thợ máy, giám sát bảo hành.'}
                  {currentRole === 'HEAD' && 'Biên độ: Quản trị phòng ban chuyên trách, tự chế thông tin quy trình bộ phận.'}
                  {currentRole === 'EMPLOYEE' && 'Biên độ: Học tập kĩ nghệ sên DID, sửa trực tiếp, cập thẻ khảo sát thợ máy.'}
                  {currentRole === 'SUPPLIER' && 'Biên độ: Portal mậu dịch sỉ sên dĩa, tải file CAD QC bản vẽ nhông dĩa.'}
                  {currentRole === 'CUSTOMER' && 'Biên độ: Độc quyền catalogue, tra giá sỉ sên vàng DID, phản hồi trả lỗi.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick info status line in dark footer sidebar */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Hà Nội Zone UTC+7</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>

        </aside>

        {/* Mobile menu modal tray */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/60 z-40 md:hidden flex" id="mobile-menu-overlay">
            <div className="w-64 bg-slate-950 text-white p-4 space-y-6 flex flex-col justify-between animate-in slide-in-from-left duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-xs">Mục lục ERP Terasu</span>
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-1">
                  {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                          if (item.id === 'knowledge') {
                            setSelectedCategoryPath('TERASU');
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 ${
                          isActive ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg text-[10px] text-slate-400">
                Ủy quyền: <span className="text-orange-400 font-bold">{currentRole}</span>
              </div>
            </div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        {/* Primary View Area (Viewport with animation) */}
        <main className="flex-1 p-4 md:p-5 lg:p-6 min-w-0 bg-[#F8FAFC]" id="main-viewport-frame">
          
          {/* Quick Header showing the active Tab label for context */}
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 uppercase font-semibold">
              <span>Hệ thống TERASU</span> <span className="text-slate-300">/</span> <span className="text-slate-600">{getActiveTabLabel()}</span>
            </div>
            
            {/* Security Integrity Status Badge */}
            <div className="text-[10px] flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-full font-mono text-slate-500 font-semibold shadow-xs">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>Phiên làm việc: {currentRole}</span>
            </div>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.12 }}
            id="tab-rendering-box"
          >
            {activeTab === 'dashboard' && (
              <Dashboard 
                currentRole={currentRole} 
                onSetTab={setActiveTab}
                onViewDoc={handleViewDocDetails}
                onViewTicket={(ticket) => setActiveTab('workflows')}
              />
            )}

            {activeTab === 'search' && (
              <AISearch 
                currentRole={currentRole} 
                documents={documents}
                onViewDoc={handleViewDocDetails}
                onSetCategory={(catPath) => {
                  setSelectedCategoryPath(catPath);
                  setActiveTab('knowledge');
                }}
                onSetTab={setActiveTab}
              />
            )}

            {activeTab === 'knowledge' && (
              <KnowledgeCenter 
                currentRole={currentRole}
                documents={documents}
                onAddDocument={handleAddDocument}
                onDeleteDocument={handleDeleteDocument}
                onViewDocDetails={handleViewDocDetails}
                selectedCategoryPath={selectedCategoryPath}
                onSetCategoryPath={setSelectedCategoryPath}
              />
            )}

            {activeTab === 'departments' && (
              <DepartmentManager currentRole={currentRole} />
            )}

            {activeTab === 'accounts' && (
              <AccountManager currentRole={currentRole} />
            )}

            {activeTab === 'workflows' && (
              <WorkflowManager currentRole={currentRole} />
            )}

            {activeTab === 'audit' && (
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-1.5">
                    <History className="w-5 h-5 text-orange-600" />
                    <span>Nhật ký Kiểm toán & Nhật ký Hoạt động (Audit Log)</span>
                  </h3>
                  <button 
                    onClick={() => {
                      if (confirm('Bạn chắc chắn muốn xóa sạch nhật ký kiểm toán chứ?')) {
                        setAuditLogs([]);
                      }
                    }}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Xóa sạch nhật ký log
                  </button>
                </div>

                <p className="text-xs text-slate-500">
                  Ghi nhận tự động vĩnh viễn toàn bộ các hành vi cố tình truy xuất files, xem tokens mật khẩu accounts Facebook/Website, hay chuyển bước quy trình đặt mua DID Trung Quốc phê duyệt của ban giám đốc.
                </p>

                <div className="border border-slate-150 rounded-lg overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b font-bold text-slate-400">
                      <tr>
                        <th className="p-3">Thời gian</th>
                        <th className="p-3">Nhân sự thực hiện</th>
                        <th className="p-3">Hành vi</th>
                        <th className="p-3">Hồ sơ / Đối tượng đích</th>
                        <th className="p-3 text-center">Trạng thái an ninh</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-700 font-mono">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50">
                          <td className="p-3 whitespace-nowrap text-slate-500">{log.timestamp}</td>
                          <td className="p-3 whitespace-nowrap font-bold text-slate-800">
                            {log.user} <span className="text-[10px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded font-normal">{log.role}</span>
                          </td>
                          <td className="p-3 whitespace-nowrap">{log.action}</td>
                          <td className="p-3 text-slate-600 truncate max-w-xs" title={log.target}>{log.target}</td>
                          <td className="p-3 text-center">
                            <span className={`text-[9.5px] font-black px-1.5 py-0.5 rounded-sm ${
                              log.status === 'Thành công' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-red-100 text-red-800 font-bold animate-pulse'
                            }`}>
                              {log.status === 'Thành công' ? 'PASSED ●' : 'BLOCKED ⚠'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'admin' && (
              <SystemAdmin 
                currentRole={currentRole}
                auditLogs={auditLogs}
                onAddAuditLog={(action, target, status: 'Thành công' | 'Thất bại') => {
                  const newLog: AuditLog = {
                    id: `al-${Date.now()}`,
                    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                    user: `Nhân sự (${currentRole})`,
                    role: currentRole,
                    action,
                    target,
                    status
                  };
                  setAuditLogs(prev => [newLog, ...prev]);
                }}
              />
            )}
          </motion.div>

          {/* Quick Role switcher shortcut directly underneath the active workspace to increase visibility */}
          <div className="mt-8">
            <RoleSelector currentRole={currentRole} onChangeRole={handleRoleChange} />
          </div>

        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-500 text-xs py-6 px-4 text-center border-t border-slate-800 space-y-2 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026. Công ty Phụ Tùng Xe Máy & Hệ Thống Dịch Vụ Sửa Chữa TERASU CO., LTD. Độc quyền xích tải DID Nhật Bản.</p>
          <div className="flex gap-4">
            <span className="text-slate-400 font-bold">EKMS Platform v2.4</span>
            <span>|</span>
            <span>Bảo mật chuẩn ISO/IEC 27001</span>
          </div>
        </div>
      </footer>

      {/* Advanced Global Document Detail / Metadata Inspector Drawer Modal Pop */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border animate-in fade-in zoom-in-95 duration-155">
            
            {/* Modal Header */}
            <div className="p-4.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-orange-600 text-white rounded p-1 text-xs font-bold leading-none">TRS</span>
                <div>
                  <h3 className="font-bold text-xs md:text-sm">Bản Đặc tả Tri thức & Sổ tay Phân quyền</h3>
                  <p className="text-[10px] text-slate-400">ID tài liệu kiểm toán: {previewDoc.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {/* Document Summary Header */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-[10px] font-mono bg-slate-250 text-slate-650 px-1.5 py-0.5 rounded font-black">
                      {previewDoc.code}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                      Phòng: {previewDoc.department}
                    </span>
                  </div>
                  <h4 className="font-black text-slate-800 text-sm md:text-base pt-1">
                    {previewDoc.name}
                  </h4>
                </div>
                <span className="text-xs bg-orange-100 text-orange-850 font-black px-2.5 py-1 rounded inline-block whitespace-nowrap">
                  v{previewDoc.version}
                </span>
              </div>

              {/* Grid Metadata Specifications */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Thông số siêu dữ liệu (Metadata):</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  
                  <div className="p-2.5 bg-slate-50 rounded border">
                    <span className="block text-[9.5px] text-slate-400 uppercase">Loại tài liệu</span>
                    <strong className="text-slate-700">{previewDoc.type}</strong>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded border">
                    <span className="block text-[9.5px] text-slate-400 uppercase">Quy chuẩn mộc đỏ</span>
                    <strong className="text-slate-700">ISO-9001:2026</strong>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded border">
                    <span className="block text-[9.5px] text-slate-400 uppercase">Trạng thái</span>
                    <strong className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded inline-block">{previewDoc.status}</strong>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded border">
                    <span className="block text-[9.5px] text-slate-400 uppercase">Người biên soạn</span>
                    <strong className="text-slate-700 block truncate">{previewDoc.creator}</strong>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded border">
                    <span className="block text-[9.5px] text-slate-400 uppercase">Người phê chuẩn duyệt</span>
                    <strong className="text-slate-700 block truncate">{previewDoc.approver}</strong>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded border">
                    <span className="block text-[9.5px] text-slate-400 uppercase">Ngày hạ hiệu lực</span>
                    <strong className="text-slate-700">Vô thời hạn</strong>
                  </div>

                </div>
              </div>

              {/* Simulated File Contents Preview */}
              {previewDoc.contentSummary && (
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Đọc thử nội dung (Giả lập OCR & Text Content):</h4>
                  <div className="p-4 bg-slate-900 text-slate-350 rounded-xl font-mono text-xs border border-slate-800 leading-relaxed max-h-40 overflow-y-auto">
                    {previewDoc.contentSummary}
                  </div>
                </div>
              )}

              {/* Tags panel */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-semibold text-slate-400">Từ khóa đối soát sỹ:</span>
                {previewDoc.tags.map(t => (
                  <span key={t} className="text-[10.5px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded border">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Access right details */}
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                    <span>Bảo mật & Phân quyền Tài liệu (Document Level Access)</span>
                  </span>
                  <span className="text-[9px] bg-indigo-200 text-indigo-900 font-bold px-1.5 py-0.5 rounded uppercase">
                    Mộc Đỏ ERP
                  </span>
                </div>

                <p className="text-[11px] text-indigo-950">
                  Các chức năng/vai trò có quyền xem và tải xuống tệp văn bản này. Quyền này được thực thi nghiêm ngặt tại giao diện và tầng nghiệp vụ:
                </p>

                {(currentRole === 'SUPER_ADMIN' || currentRole === 'CEO') ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(['SUPER_ADMIN', 'CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE', 'CUSTOMER', 'SUPPLIER'] as Role[]).map(role => {
                      const active = previewDoc.accessRights.includes(role);
                      return (
                        <button
                          key={role}
                          onClick={() => {
                            const nextRoles = active 
                              ? previewDoc.accessRights.filter(r => r !== role)
                              : [...previewDoc.accessRights, role];
                            
                            // Update local preview state
                            setPreviewDoc({
                              ...previewDoc,
                              accessRights: nextRoles
                            });

                            // Update global documents list
                            setDocuments(prev => prev.map(d => d.id === previewDoc.id ? { ...d, accessRights: nextRoles } : d));

                            // Add audit log
                            const newLog: AuditLog = {
                              id: `al-${Date.now()}`,
                              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                              user: `Phân quyền viên (${currentRole})`,
                              role: currentRole,
                              action: 'Sửa quyền tài liệu',
                              target: `${previewDoc.code} - ${previewDoc.name} -> Cấp cho [${nextRoles.join(', ')}]`,
                              status: 'Thành công'
                            };
                            setAuditLogs(prev => [newLog, ...prev]);
                          }}
                          className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                            active 
                              ? 'bg-indigo-600 text-white border-indigo-700' 
                              : 'bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-100/50'
                          }`}
                        >
                          <span>{role}</span>
                          {active && '✓'}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="font-bold text-slate-700 bg-white/60 p-2 rounded border">
                    {previewDoc.accessRights.join(', ')}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t flex items-center justify-between gap-3 text-xs">
                <span className="text-xs text-slate-400">Cập nhật sau cùng: {previewDoc.updatedAt}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (previewDoc && previewDoc.fileUrl) { window.open(previewDoc.fileUrl, '_blank'); } else { alert('Thao tác tải xuống mộc ký chữ ký điện tử PDF thành công! Hệ thống đã ghi nhận log.'); }
                    }}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Tải File Đính kèm (.pdf/.xlsx)
                  </button>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="px-4 py-2 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Global 11. Module Import Dữ liệu & Quản lý tài liệu Modal */}
      <DocumentImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        currentRole={currentRole}
        documents={documents}
        onAddDocument={handleAddDocument}
        onAddAuditLog={(action, target, status: 'Thành công' | 'Thất bại') => {
          const newLog: AuditLog = {
            id: `al-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            user: `Nhân sự (${currentRole})`,
            role: currentRole,
            action,
            target,
            status
          };
          setAuditLogs(prev => [newLog, ...prev]);
        }}
      />

    </div>
  );
}
