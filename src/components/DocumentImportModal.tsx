/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Document, Role, DocumentType } from '../types';
import { 
  Upload, FileText, FileSpreadsheet, FileVideo, Image, Folder, FolderPlus,
  Sparkles, Cpu, Tag, Shield, History, Check, X, Info, ChevronRight,
  Database, RefreshCw, Lock, HelpCircle, CornerDownRight, Eye, Plus
} from 'lucide-react';

interface DocumentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: Role;
  documents: Document[];
  onAddDocument: (doc: Document) => void;
  onAddAuditLog: (action: string, target: string, status: 'Thành công' | 'Thất bại') => void;
}

export function DocumentImportModal({
  isOpen,
  onClose,
  currentRole,
  documents,
  onAddDocument,
  onAddAuditLog
}: DocumentImportModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'create' | 'sync' | 'ai-search'>('upload');
  const [actionType, setActionType] = useState<'import' | 'sop' | 'form' | 'process' | 'video' | 'folder'>('import');
  
  // File Upload states
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; type: string }[]>([]);
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Form states for manual declaration or OCR review
  const [docName, setDocName] = useState('');
  const [docCode, setDocCode] = useState('');
  const [docType, setDocType] = useState<DocumentType>('SOP/Quy trình');
  const [docDept, setDocDept] = useState('MUA HÀNG');
  const [docPath, setDocPath] = useState('TERASU/06. MUA HÀNG/NCC Nước Ngoài');
  const [docOwner, setDocOwner] = useState('Trần Minh Quang');
  const [docVersion, setDocVersion] = useState('1.0');
  const [docVersionLog, setDocVersionLog] = useState('Khởi tạo tài liệu lần đầu');
  const [docTags, setDocTags] = useState('DID, Nhập khẩu, Phụ tùng');
  const [docSecurity, setDocSecurity] = useState<'Public' | 'Internal' | 'Confidential' | 'Restricted'>('Internal');
  const [docAccess, setDocAccess] = useState<Role[]>(['CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE']);
  const [docSummary, setDocSummary] = useState('');

  // Sync states
  const [syncSource, setSyncSource] = useState<'excel' | 'gsheets' | 'gdrive' | 'onedrive' | 'sharepoint' | 'fileserver'>('excel');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'completed'>('idle');
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  // AI Knowledge Search state
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiCitations, setAiCitations] = useState<Document[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Virtual folder creation states
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderParent, setNewFolderParent] = useState('TERASU/06. MUA HÀNG');

  // Preset quick templates for OCR simulation
  const ocrPresets = [
    {
      title: 'Tờ khai Hải quan Ắc quy Lead.jpg',
      type: 'Tờ khai Hải quan',
      text: 'MẪU HẢI QUAN VN: TKHQ-2026-AQ01\nNGÀY NHẬP KHẨU: 2026-06-23\nNHÀ CUNG CẤP: LeadPower Batteries Co. (Trung Quốc)\nSẢN PHẨM: Ắc quy chì axit lỏng xe Wave 12V 5Ah TERASU\nMÃ HS CODE: 8507.10.99',
      tags: 'Ắc quy, Hải quan, 8507.10.99, LeadPower',
      code: 'SOP-HQ-AQ-01',
      name: 'Tờ khai hải quan nhập khẩu Ắc quy chì LeadPower',
      summary: 'Biểu mẫu tờ khai thông quan nhập sỉ linh kiện ắc quy từ nhà máy Thâm Quyến Trung Quốc, mã HS sụt áp.',
      dept: 'MUA HÀNG',
      path: 'TERASU/06. MUA HÀNG/HS Code'
    },
    {
      title: 'Báo giá xích vàng DID tháng 6.xlsx',
      type: 'Báo giá Excel',
      text: 'DAIDO KOGYO CO., LTD - JAPAN\nBẢNG GIÁ SỈ XÍCH DID 428D / 428HD VÀNG CHÍNH HÃNG\nĐƠN VỊ TÍNH: SỢI\nCHIẾT KHẤU ĐẠI LÝ: 35% CHO ĐƠN HÀNG TRÊN 500 SỢI.',
      tags: 'DID, Báo giá, Xích, Daido Kogyo',
      code: 'BG-DID-2026-06',
      name: 'Báo giá sỉ nhông xích vàng Daido Kogyo Nhật Bản',
      summary: 'Danh mục báo giá sỉ chuỗi xích DID vàng chính hãng của Nhật Bản dành riêng cho các chuỗi phân phối xe máy TERASU.',
      dept: 'KINH DOANH',
      path: 'TERASU/04. KINH DOANH/Báo giá'
    },
    {
      title: 'SOP kiểm lỗi ắc quy Lead sụt áp.pdf',
      type: 'Tài liệu PDF kỹ thuật',
      text: 'QUY TRÌNH KIỂM TRA ĐIỆN ÁP ẮC QUY XE MÁY TERASU\nBƯỚC 1: ĐO ÁP KHÔNG TẢI (>12.6V LÀ ĐẠT).\nBƯỚC 2: ĐO ÁP DƯỚI TẢI ĐỀ (KHÔNG SỤT DƯỚI 9.6V TRONG 5 GIÂY).\nĐIỀU KIỆN ĐỔI TRẢ: BẢO HÀNH 12 THÁNG NẾU LỖI CELL NỘI BỘ.',
      tags: 'Ắc quy, Bảo hành, SOP, Sụt áp',
      code: 'SOP-BH-AQ-12',
      name: 'SOP quy chuẩn xử lý bảo hành ắc quy chì TERASU',
      summary: 'Quy trình thợ máy chẩn đoán hỏng cell ắc quy chì lỏng để áp dụng chính sách đổi mới 1-đổi-1 cho khách hàng.',
      dept: 'DỊCH VỤ SỬA CHỮA',
      path: 'TERASU/09. DỊCH VỤ SỬA CHỮA/Bảo hành'
    }
  ];

  if (!isOpen) return null;

  // Toggle roles in access rights list
  const handleToggleAccess = (role: Role) => {
    if (docAccess.includes(role)) {
      setDocAccess(prev => prev.filter(r => r !== role));
    } else {
      setDocAccess(prev => [...prev, role]);
    }
  };

  // Drag and drop mechanics
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).map((f: File) => ({
        name: f.name,
        size: (f.size / 1024).toFixed(1) + ' KB',
        type: f.name.split('.').pop() || 'unknown'
      }));
      setUploadedFiles(prev => [...prev, ...files]);
      setRawFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);

      // Simulate automatic OCR if matched
      triggerOcrScan(files[0].name);
    }
  };

  const handleManualFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files).map((f: File) => ({
        name: f.name,
        size: (f.size / 1024).toFixed(1) + ' KB',
        type: f.name.split('.').pop() || 'unknown'
      }));
      setUploadedFiles(prev => [...prev, ...files]);
      setRawFiles(prev => [...prev, ...Array.from(e.target.files)]);
      triggerOcrScan(files[0].name);
    }
  };

  // OCR and AI auto tagging simulation
  const triggerOcrScan = (filename: string) => {
    setIsScanning(true);
    setScanResult(null);

    // Look for preset simulation data
    const preset = ocrPresets.find(p => filename.toLowerCase().includes(p.title.toLowerCase().split('.')[0]));

    setTimeout(() => {
      setIsScanning(false);
      if (preset) {
        setScanResult(preset.text);
        setDocName(preset.name);
        setDocCode(preset.code);
        setDocTags(preset.tags);
        setDocSummary(preset.summary);
        setDocDept(preset.dept);
        setDocPath(preset.path);
        
        // Dynamic type mapping
        if (preset.type.includes('Báo giá')) setDocType('Báo giá/Hợp đồng');
        else if (preset.type.includes('PDF')) setDocType('SOP/Quy trình');
        
        onAddAuditLog('OCR & AI Quét Tài liệu', `Trích xuất thông số từ file: ${filename}`, 'Thành công');
      } else {
        // Generic OCR
        setScanResult(`[OCR ĐỌC HOÀN TẤT] Tên file: ${filename}\nNội dung: Trích xuất các dòng chữ ngẫu nhiên, phát hiện một vài từ khóa kỹ thuật phụ tùng xe máy.`);
        setDocName(filename.split('.')[0].toUpperCase().replace(/_/g, ' '));
        setDocCode(`TRS-GEN-${Math.floor(Math.random() * 900) + 100}`);
        setDocTags('Tài liệu, Phụ tùng, Mới');
        setDocSummary(`Tài liệu được tải lên hệ thống tự động thông qua tính năng Import nhanh.`);
        onAddAuditLog('OCR Quét Tài liệu', `Quét văn bản tự động file: ${filename}`, 'Thành công');
      }
    }, 1500);
  };

  // Submit and Save newly imported/created document to system
  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !docCode) {
      alert('Vui lòng nhập Tên tài liệu và Mã tài liệu!');
      return;
    }

    const newDoc: Document = {
      id: `imported-${Date.now()}`,
      code: docCode,
      name: docName,
      type: docType,
      department: docDept,
      categoryPath: docPath,
      creator: `${docOwner} (${currentRole})`,
      approver: 'Nguyễn Văn Terasu (CEO)',
      createdAt: new Date().toISOString().substring(0, 10),
      updatedAt: new Date().toISOString().substring(0, 10),
      version: docVersion,
      status: 'Ban hành',
      tags: docTags.split(',').map(t => t.trim()).filter(Boolean),
      accessRights: docAccess,
      contentSummary: docSummary || `Văn bản tri thức được lưu trữ bảo mật cấp độ: ${docSecurity}. Ghi chú phiên bản: ${docVersionLog}`
    };

    onAddDocument(newDoc);
    onAddAuditLog('Import / Khởi tạo Tài liệu', `${docCode} - ${docName} (v${docVersion})`, 'Thành công');import('../lib/documentService').then(({ saveDocumentToSupabase }) => {
  saveDocumentToSupabase({ title: docName, code: docCode, docType: docType, version: docVersion, tags: docTags.split(',').map(t => t.trim()).filter(Boolean), isPublic: docSecurity === 'Public', description: docSummary, dept: docDept, file: rawFiles[0] || null })
})
    
    // Reset forms and notify
    alert(`Đã lưu thành công tài liệu: ${docCode} vào thư mục ${docPath}! Toàn bộ hệ thống và Trợ lý AI đã được đồng bộ hóa.`);
    
    // Clean states
    setUploadedFiles([]);
    setRawFiles([]);
    setScanResult(null);
    setDocName('');
    setDocCode('');
    onClose();
  };

  // Create Virtual Folder
  const handleCreateFolder = () => {
    if (!newFolderName) {
      alert('Vui lòng nhập tên thư mục!');
      return;
    }
    const createdPath = `${newFolderParent}/${newFolderName}`;
    onAddAuditLog('Tạo Thư mục Tri thức', `Thư mục mới: ${createdPath}`, 'Thành công');
    alert(`Đã tạo thành công thư mục mới: "${newFolderName}" tại đường dẫn "${newFolderParent}". Hệ thống quản lý tri thức đã cập nhật.`);
    setNewFolderName('');
    
  };

  // Trigger sync simulation
  const handleTriggerSync = () => {
    setSyncStatus('syncing');
    setSyncLogs([`Bắt đầu kết nối cổng thông tin ${syncSource.toUpperCase()}...`]);
    
    setTimeout(() => {
      setSyncLogs(prev => [...prev, `Xác minh giao thức bảo mật SSL Token... OK`]);
    }, 600);

    setTimeout(() => {
      setSyncLogs(prev => [...prev, `Đang đối soát danh sách tệp thay đổi từ 24h qua...`]);
    }, 1200);

    setTimeout(() => {
      let documentCount = 3;
      setSyncLogs(prev => [...prev, `Đã tìm thấy ${documentCount} tệp tri thức mới chưa đồng bộ.`]);
    }, 1800);

    setTimeout(() => {
      setSyncStatus('completed');
      setSyncLogs(prev => [...prev, `Đồng bộ hoàn tất! 3 tài liệu mới đã được nạp tự động vào hệ thống ERP.`]);
      onAddAuditLog('Đồng bộ Cổng Dữ liệu', `Nhập dữ liệu từ ${syncSource.toUpperCase()}`, 'Thành công');
    }, 2500);
  };

  // AI Knowledge Search simulation
  const handleAiKnowledgeQuery = () => {
    if (!aiQuery) return;
    setIsAiLoading(true);
    setAiResponse(null);
    setAiCitations([]);

    setTimeout(() => {
      setIsAiLoading(false);
      const q = aiQuery.toLowerCase();
      
      if (q.includes('bảo hành') || q.includes('ắc quy') || q.includes('ac quy')) {
        setAiResponse(`Dựa trên tài liệu [SOP-BH-002: Quy trình bảo hành ắc quy chì TERASU], quy trình bảo hành gồm 3 bước quy chuẩn:
1. Thợ máy đo điện áp không tải: Thiết bị đo phải đạt trên 12.6V để xác định ắc quy đầy điện.
2. Kiểm tra sụt áp dưới tải đề: Cho thợ đề nổ liên tục trong 5 giây, áp không được sụt dưới 9.6V. Nếu sụt sâu, xác định hỏng cell lỏng.
3. Chụp ảnh thực tế số seri và bình phồng gửi lên ban điều hành duyệt đổi mới 1-đổi-1 trong vòng 12 tháng.`);
        
        // Find documents
        const found = documents.filter(d => d.name.includes('ắc quy') || d.tags.includes('Ắc quy'));
        setAiCitations(found);
      } else if (q.includes('hs code') || q.includes('nhông') || q.includes('xích')) {
        setAiResponse(`Dựa vào [TRS-SOP-MH-01: Danh mục HS Code & Thuế Nhập khẩu], xích xe máy và linh kiện nhông xích sên dĩa được quản lý dưới các mã sau:
- Xích con lăn xe máy (DID vàng): HS Code 7315.11.00 (Thuế suất nhập khẩu thông thường 20%, có CO Form E giảm còn 0% - 5%).
- Nhông đĩa xích WAVE 110cc: HS Code 8714.10.90 (Bộ phận của xe máy).
Yêu cầu đối soát kỹ bản vẽ CAD của QC để xác định dung sai +/-0.02mm trước khi nộp thông quan.`);
        
        const found = documents.filter(d => d.name.includes('mua hàng') || d.tags.includes('Nhập khẩu'));
        setAiCitations(found);
      } else if (q.includes('nhà cung cấp') || q.includes('did') || q.includes('đại lý')) {
        setAiResponse(`Nhà cung cấp độc quyền xích sên dĩa vàng hiện tại của TERASU là Daido Kogyo Co., Ltd (Nhật Bản). 
- Hợp đồng thương mại ký kết có thời hạn 3 năm.
- Điều khoản đại lý: Chiết khấu trực tiếp 35% cho các tổng đại lý nhập sỉ trên 500 sợi/đơn hàng.
- Mọi khiếu nại chất lượng (sên chùng, đứt liên kết) phải được QC lập biên bản kỹ thuật trong vòng 7 ngày kể từ lúc thợ máy kiểm kê.`);
        
        const found = documents.filter(d => d.name.includes('đại lý') || d.tags.includes('DID'));
        setAiCitations(found);
      } else {
        setAiResponse(`Tôi đã quét toàn bộ kho tri thức tài liệu của TERASU nhưng chưa tìm thấy quy trình khớp chính xác với câu hỏi "${aiQuery}". Tuy nhiên, dựa trên nghiệp vụ, bạn có thể tham khảo mục [Trung tâm Tri thức / 06. MUA HÀNG] hoặc [09. DỊCH VỤ SỬA CHỮA] để tìm kiếm thêm.`);
        setAiCitations([]);
      }
      
      onAddAuditLog('AI Knowledge Search', `Hỏi AI: "${aiQuery}"`, 'Thành công');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs" id="global-import-dialog">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-5xl shadow-2xl flex flex-col my-8 overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Header bar */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-orange-600 rounded-lg text-white">
              <Database className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm md:text-base tracking-tight flex items-center gap-2">
                <span>11. HỆ THỐNG IMPORT DỮ LIỆU & QUẢN LÝ TÀI LIỆU</span>
                <span className="text-[10px] bg-orange-600 font-bold px-1.5 py-0.2 rounded">SMART WIKI</span>
              </h3>
              <p className="text-[10px] text-slate-300">
                Đọc nội dung thông minh OCR, tự gắn tag nhãn, phân loại, tìm kiếm và phân quyền bảo mật tri thức.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Action Buttons Quick panel (Mandated: Import, Tạo SOP, Tạo Biểu mẫu, Tạo Quy trình, Tạo Video đào tạo, Tạo Thư mục) */}
        <div className="bg-slate-50 border-b border-slate-200 p-3.5 flex flex-wrap gap-2 items-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Khởi tạo nhanh:</span>
          
          <button 
            onClick={() => { setActionType('import'); setActiveTab('upload'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              actionType === 'import' && activeTab === 'upload'
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import tài liệu</span>
          </button>

          <button 
            onClick={() => { setActionType('sop'); setDocType('SOP/Quy trình'); setActiveTab('create'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              actionType === 'sop' && activeTab === 'create'
                ? 'bg-orange-600 text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-orange-600" />
            <span>Tạo SOP</span>
          </button>

          <button 
            onClick={() => { setActionType('form'); setDocType('Biểu mẫu'); setActiveTab('create'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              actionType === 'form' && activeTab === 'create'
                ? 'bg-orange-600 text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tạo Biểu mẫu</span>
          </button>

          <button 
            onClick={() => { setActionType('process'); setDocType('SOP/Quy trình'); setActiveTab('create'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              actionType === 'process' && activeTab === 'create'
                ? 'bg-orange-600 text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-600" />
            <span>Tạo Quy trình</span>
          </button>

          <button 
            onClick={() => { setActionType('video'); setDocType('Tài liệu đào tạo'); setActiveTab('create'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              actionType === 'video' && activeTab === 'create'
                ? 'bg-orange-600 text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FileVideo className="w-3.5 h-3.5 text-amber-600" />
            <span>Tạo Video đào tạo</span>
          </button>

          <button 
            onClick={() => { setActionType('folder'); setActiveTab('create'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              actionType === 'folder' && activeTab === 'create'
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5 text-blue-600" />
            <span>Tạo Thư mục</span>
          </button>
        </div>

        {/* Modal Main Tabs navigation */}
        <div className="flex border-b border-slate-200 bg-white">
          <button 
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 text-xs md:text-sm font-bold text-center border-b-2 cursor-pointer transition-colors ${
              activeTab === 'upload' 
                ? 'border-slate-900 text-slate-900 bg-slate-50/50' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📁 1. Tải lên & OCR Đọc File
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 text-xs md:text-sm font-bold text-center border-b-2 cursor-pointer transition-colors ${
              activeTab === 'create' 
                ? 'border-slate-900 text-slate-900 bg-slate-50/50' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ✍️ 2. Biên soạn Tri thức mới
          </button>
          <button 
            onClick={() => setActiveTab('sync')}
            className={`flex-1 py-3 text-xs md:text-sm font-bold text-center border-b-2 cursor-pointer transition-colors ${
              activeTab === 'sync' 
                ? 'border-slate-900 text-slate-900 bg-slate-50/50' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🔗 3. Đồng bộ Excel / Cloud Sheets
          </button>
          <button 
            onClick={() => setActiveTab('ai-search')}
            className={`flex-1 py-3 text-xs md:text-sm font-bold text-center border-b-2 cursor-pointer transition-colors ${
              activeTab === 'ai-search' 
                ? 'border-slate-900 text-slate-900 bg-slate-50/50' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🧠 4. AI Knowledge Search
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 p-5 overflow-y-auto max-h-[500px]">

          {/* TAB 1: UPLOAD & OCR SCANNER */}
          {activeTab === 'upload' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* Drag & Drop Area + Files info */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Kéo thả hoặc Chọn tệp tin từ thiết bị
                  </div>

                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all relative flex flex-col items-center justify-center min-h-[180px] cursor-pointer ${
                      dragActive 
                        ? 'border-orange-500 bg-orange-50/30' 
                        : 'border-slate-300 hover:border-orange-400 bg-slate-50/40 hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="file" 
                      id="file-upload-dialog-input" 
                      multiple 
                      onChange={handleManualFileSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className={`w-10 h-10 mb-2.5 transition-colors ${dragActive ? 'text-orange-600' : 'text-slate-400'}`} />
                    <p className="text-xs md:text-sm font-bold text-slate-700">Kéo & Thả file tài liệu vào đây</p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                      Hỗ trợ Word (.doc, .docx), Excel (.xlsx), PowerPoint, PDF, JPG, PNG, MP4, ZIP
                    </p>
                    <span className="mt-3 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-[11px] font-bold shadow-xs">
                      Hoặc Duyệt tìm file
                    </span>
                  </div>

                  {/* Quick Simulators (Prescribed preset clicking) */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wide block">
                      💡 Click nhanh để Giả lập Upload mẫu có OCR đọc dữ liệu:
                    </span>
                    <div className="space-y-1.5">
                      {ocrPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setUploadedFiles([{ name: preset.title, size: '245 KB', type: 'preset' }]);
                            triggerOcrScan(preset.title);
                          }}
                          className="w-full text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/20 text-xs flex items-center justify-between transition-all"
                        >
                          <span className="font-semibold text-slate-700 truncate max-w-[280px]">
                            📁 {preset.title}
                          </span>
                          <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 rounded-sm font-mono uppercase font-bold shrink-0">
                            {preset.type}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Area: Form Declaration reviewed under OCR */}
                <div className="lg:col-span-6 space-y-4">
                  
                  {/* OCR AI Reading Panel */}
                  <div className="bg-slate-900 text-slate-100 rounded-xl p-4 border border-slate-800 space-y-2.5 shadow-xs font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="font-extrabold text-orange-400 text-[10px] uppercase flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 animate-pulse" /> AI OCR / Trích xuất thực tế
                      </span>
                      {isScanning ? (
                        <span className="text-[10px] text-orange-300 font-bold animate-pulse">Đang đọc nội dung...</span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Trạng thái: Sẵn sàng</span>
                      )}
                    </div>
                    
                    {isScanning ? (
                      <div className="py-8 text-center text-slate-400 space-y-2">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-orange-500" />
                        <p className="text-[10px]">Đang chạy mạng nơ-ron OCR đọc chữ, tự động tìm kiếm HS Code, dán nhãn tag...</p>
                      </div>
                    ) : scanResult ? (
                      <div className="space-y-2">
                        <div className="bg-slate-950 p-2.5 rounded text-[10px] max-h-32 overflow-y-auto leading-relaxed text-emerald-400 border border-slate-800">
                          {scanResult}
                        </div>
                        <div className="text-[10px] text-orange-400 font-bold flex items-center gap-1 bg-orange-950/40 p-1.5 rounded">
                          <Sparkles className="w-3 h-3 text-orange-400" />
                          <span>AI Đề xuất tự gắn Tags: #{docTags.split(',').join(' #')}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-slate-500 text-[11px] italic leading-relaxed">
                        Hãy kéo thả tệp tin hoặc click các file mẫu bên trái để hệ thống OCR tự nhận diện trường dữ liệu và điền mẫu.
                      </div>
                    )}
                  </div>

                  {/* Target Metadata configuration Form */}
                  <form onSubmit={handleSaveDocument} className="space-y-3 bg-white p-4 rounded-xl border border-slate-150">
                    <div className="text-xs font-black text-slate-700 border-b pb-1.5 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-orange-600" />
                      <span>THÔNG TIN TÀI LIỆU ERP (METADATA)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Mã tài liệu / Số SOP:</label>
                        <input 
                          type="text" 
                          value={docCode} 
                          onChange={(e) => setDocCode(e.target.value)}
                          placeholder="TRS-SOP-MH-01" 
                          className="w-full p-2 border border-slate-200 rounded font-mono font-bold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Tên tài liệu tri thức:</label>
                        <input 
                          type="text" 
                          value={docName} 
                          onChange={(e) => setDocName(e.target.value)}
                          placeholder="Ví dụ: Quy định sên DID" 
                          className="w-full p-2 border border-slate-200 rounded font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Loại tài liệu:</label>
                        <select 
                          value={docType}
                          onChange={(e) => setDocType(e.target.value as DocumentType)}
                          className="w-full p-2 border border-slate-200 rounded text-slate-800 font-bold"
                        >
                          <option value="SOP/Quy trình">SOP/Quy trình kỹ thuật</option>
                          <option value="Báo giá/Hợp đồng">Báo giá/Hợp đồng thương mại</option>
                          <option value="Biểu mẫu">Biểu mẫu hành chính</option>
                          <option value="Tài liệu đào tạo">Video / Tài liệu đào tạo</option>
                          <option value="Hình ảnh QC">Hình ảnh kiểm lỗi QC</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Cấp bảo mật:</label>
                        <select 
                          value={docSecurity}
                          onChange={(e) => setDocSecurity(e.target.value as any)}
                          className="w-full p-2 border border-slate-200 rounded text-slate-800 font-bold"
                        >
                          <option value="Public">Công khai nội bộ (Public)</option>
                          <option value="Internal">Nội bộ ban chuyên trách (Internal)</option>
                          <option value="Confidential">Mật - Chỉ Trưởng bộ phận (Confidential)</option>
                          <option value="Restricted">Tối mật - Chỉ CEO & Ban Giám đốc</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Phòng ban liên quan:</label>
                        <select 
                          value={docDept}
                          onChange={(e) => setDocDept(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded text-slate-800 font-medium"
                        >
                          <option value="MUA HÀNG">Mua Hàng & Xuất Nhập Khẩu</option>
                          <option value="KINH DOANH">Kinh Doanh & Đại lý</option>
                          <option value="HCNS">Hành Chính - Nhân Sự</option>
                          <option value="QC_TECH">QC & Kỹ thuật R&D</option>
                          <option value="SERVICE">Dịch vụ sửa chữa & Bảo hành</option>
                          <option value="KẾ TOÁN">Kế Toán Tài Chính</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Cây lưu trữ thư mục:</label>
                        <select 
                          value={docPath}
                          onChange={(e) => setDocPath(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded text-slate-800 font-mono text-[11px]"
                        >
                          <option value="TERASU/01. CHIẾN LƯỢC/OKR">TERASU/01. CHIẾN LƯỢC/OKR</option>
                          <option value="TERASU/02. HCNS/KPI">TERASU/02. HCNS/KPI</option>
                          <option value="TERASU/04. KINH DOANH/Báo giá">TERASU/04. KINH DOANH/Báo giá</option>
                          <option value="TERASU/06. MUA HÀNG/HS Code">TERASU/06. MUA HÀNG/HS Code</option>
                          <option value="TERASU/06. MUA HÀNG/NCC Nước Ngoài">TERASU/06. MUA HÀNG/NCC Nước Ngoài</option>
                          <option value="TERASU/07. KHO/SOP">TERASU/07. KHO/SOP</option>
                          <option value="TERASU/08. QC KỸ THUẬT/Bản vẽ">TERASU/08. QC KỸ THUẬT/Bản vẽ</option>
                          <option value="TERASU/09. DỊCH VỤ SỬA CHỮA/Bảo hành">TERASU/09. DỊCH VỤ SỬA CHỮA/Bảo hành</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 text-[11px]">
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Người biên soạn:</label>
                        <input 
                          type="text" 
                          value={docOwner}
                          onChange={(e) => setDocOwner(e.target.value)}
                          className="w-full p-1.5 border border-slate-200 rounded text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Phiên bản nộp:</label>
                        <input 
                          type="text" 
                          value={docVersion} 
                          onChange={(e) => setDocVersion(e.target.value)}
                          className="w-full p-1.5 border border-slate-200 rounded text-slate-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Ngày hiệu lực:</label>
                        <input 
                          type="text" 
                          defaultValue="2026-06-23" 
                          className="w-full p-1.5 border border-slate-200 rounded text-slate-800 font-mono"
                        />
                      </div>
                    </div>

                    {/* Access control list checkboxes */}
                    <div className="text-xs space-y-1 pt-1">
                      <label className="block text-slate-500 font-semibold">Quyền đọc truy cập theo Phân quyền:</label>
                      <div className="flex flex-wrap gap-2">
                        {(['CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE', 'SUPPLIER', 'CUSTOMER'] as Role[]).map(r => (
                          <label key={r} className="flex items-center gap-1 cursor-pointer bg-slate-50 hover:bg-slate-100 p-1 rounded border border-slate-200 text-[10px] select-none font-bold">
                            <input 
                              type="checkbox" 
                              checked={docAccess.includes(r)}
                              onChange={() => handleToggleAccess(r)}
                              className="accent-orange-500"
                            />
                            <span>{r}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs">
                      <label className="block text-slate-500 font-semibold mb-1">Tóm tắt nội dung văn bản (Phục vụ AI Search):</label>
                      <textarea 
                        rows={2}
                        value={docSummary}
                        onChange={(e) => setDocSummary(e.target.value)}
                        placeholder="Mô tả tóm lược tài liệu này để Trợ lý AI dễ đối sánh từ khóa nguồn..."
                        className="w-full p-2 border border-slate-200 rounded text-slate-800 font-medium"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-2 bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Lưu & Đồng bộ Wiki Toàn ERP</span>
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: CREATE NEW (SOP, Form, Process, Video, Virtual Folder) */}
          {activeTab === 'create' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {actionType === 'folder' ? (
                /* Virtual Folder Creator Sub-form */
                <div className="p-5 bg-slate-50 border rounded-xl space-y-4 max-w-lg mx-auto">
                  <div className="flex items-center gap-2 text-slate-800">
                    <FolderPlus className="w-5 h-5 text-blue-600" />
                    <h4 className="font-extrabold text-sm md:text-base">Tạo Thư mục Tri thức mới</h4>
                  </div>
                  
                  <p className="text-xs text-slate-500 leading-normal">
                    Tạo các nhánh phân mục mới trong Cây thư mục Tri thức TERASU ERP để định vị chính xác khu vực lưu trữ SOP và báo giá sỉ.
                  </p>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Đường dẫn cha (Parent Directory):</label>
                      <select 
                        value={newFolderParent}
                        onChange={(e) => setNewFolderParent(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded bg-white text-slate-700 font-mono"
                      >
                        <option value="TERASU">Thư mục gốc (TERASU)</option>
                        <option value="TERASU/01. CHIẾN LƯỢC">01. CHIẾN LƯỢC</option>
                        <option value="TERASU/02. HCNS">02. HCNS</option>
                        <option value="TERASU/04. KINH DOANH">04. KINH DOANH</option>
                        <option value="TERASU/06. MUA HÀNG">06. MUA HÀNG</option>
                        <option value="TERASU/07. KHO">07. KHO</option>
                        <option value="TERASU/08. QC KỸ THUẬT">08. QC KỸ THUẬT</option>
                        <option value="TERASU/09. DỊCH VỤ SỬA CHỮA">09. DỊCH VỤ SỬA CHỮA</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Tên Thư mục mới cần tạo:</label>
                      <input 
                        type="text" 
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Ví dụ: Quy định sên vàng DID, File CAD Nhông WAVE..." 
                        className="w-full p-2 border border-slate-200 rounded bg-white text-slate-800 font-bold"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleCreateFolder}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Khởi Tạo Thư mục Mới</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Creator for SOPs, Forms, Processes, Videos */
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-orange-950">
                      <strong>Đang biên soạn mẫu nhanh:</strong> Hệ thống tự động thiết kế bộ khung tiêu chuẩn cho hành động <span className="font-bold uppercase text-orange-800">{actionType === 'sop' ? 'Tạo SOP chất lượng' : actionType === 'form' ? 'Tạo Biểu mẫu dữ liệu' : actionType === 'process' ? 'Tạo Bản vẽ quy trình' : 'Tạo Video huấn luyện'}</span>. Bạn chỉ cần nhập các mô tả cốt lõi, AI sẽ tự động đóng gói dưới dạng tệp tin Wiki trong ERP.
                    </div>
                  </div>

                  <form onSubmit={handleSaveDocument} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    <div className="lg:col-span-8 space-y-4 bg-white p-4 rounded-xl border border-slate-200">
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b pb-1.5">
                        Biên Tập Nội dung Chi Tiết
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">Tên tài liệu / SOP cần xuất bản:</label>
                          <input 
                            type="text" 
                            required
                            placeholder={actionType === 'sop' ? 'Ví dụ: Quy định thợ máy tháo sên xe dĩa' : 'Ví dụ: Tờ phiếu khảo sát bảo hành ắc quy'}
                            value={docName}
                            onChange={(e) => setDocName(e.target.value)}
                            className="w-full p-2 border border-slate-200 rounded font-bold text-slate-800"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-500 font-semibold mb-1">Mã tài liệu kiểm toán:</label>
                            <input 
                              type="text" 
                              required
                              placeholder="TRS-SOP-..."
                              value={docCode}
                              onChange={(e) => setDocCode(e.target.value)}
                              className="w-full p-2 border border-slate-200 rounded font-mono font-bold text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold mb-1">Từ khóa phân tách (Tags):</label>
                            <input 
                              type="text" 
                              value={docTags}
                              onChange={(e) => setDocTags(e.target.value)}
                              placeholder="Ắc quy, Bảo hành, DID..."
                              className="w-full p-2 border border-slate-200 rounded text-slate-800"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">Nội dung cốt lõi của Tri thức (Hoặc link video youtube / drive):</label>
                          <textarea 
                            rows={4}
                            required
                            value={docSummary}
                            onChange={(e) => setDocSummary(e.target.value)}
                            placeholder="Biên soạn văn bản chi tiết tại đây. Ví dụ: Bước 1: thợ sên dán keo, Bước 2: xịt dưỡng xích sên DID chuyên dụng, Bước 3..."
                            className="w-full p-2 border border-slate-200 rounded text-slate-800 leading-relaxed font-medium"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-500 font-semibold mb-1">Nhật ký thay đổi phiên bản (Change Log):</label>
                            <input 
                              type="text" 
                              value={docVersionLog}
                              onChange={(e) => setDocVersionLog(e.target.value)}
                              placeholder="Cập nhật nội dung sụt áp bình cell"
                              className="w-full p-2 border border-slate-200 rounded text-slate-700 italic"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold mb-1">Vị trí cây thư mục:</label>
                            <select 
                              value={docPath}
                              onChange={(e) => setDocPath(e.target.value)}
                              className="w-full p-2 border border-slate-200 rounded text-slate-700 text-[11px] font-mono"
                            >
                              <option value="TERASU/01. CHIẾN LƯỢC/OKR">TERASU/01. CHIẾN LƯỢC/OKR</option>
                              <option value="TERASU/02. HCNS/KPI">TERASU/02. HCNS/KPI</option>
                              <option value="TERASU/04. KINH DOANH/Báo giá">TERASU/04. KINH DOANH/Báo giá</option>
                              <option value="TERASU/06. MUA HÀNG/HS Code">TERASU/06. MUA HÀNG/HS Code</option>
                              <option value="TERASU/07. KHO/SOP">TERASU/07. KHO/SOP</option>
                              <option value="TERASU/08. QC KỸ THUẬT/Bản vẽ">TERASU/08. QC KỸ THUẬT/Bản vẽ</option>
                              <option value="TERASU/09. DỊCH VỤ SỬA CHỮA/Bảo hành">TERASU/09. DỊCH VỤ SỬA CHỮA/Bảo hành</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Left block options of form */}
                    <div className="lg:col-span-4 space-y-4">
                      <div className="bg-slate-50 p-4 border rounded-xl space-y-3.5 text-xs">
                        <div className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5 text-orange-600" />
                          <span>Thiết lập Chuyên quyền</span>
                        </div>

                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">Vai trò soạn:</label>
                          <input 
                            type="text" 
                            value={docOwner}
                            onChange={(e) => setDocOwner(e.target.value)}
                            className="w-full p-1.5 border border-slate-200 rounded bg-white text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">Cấp bảo mật:</label>
                          <select 
                            value={docSecurity}
                            onChange={(e) => setDocSecurity(e.target.value as any)}
                            className="w-full p-1.5 border border-slate-200 rounded bg-white text-slate-800 font-bold"
                          >
                            <option value="Public">Public (Toàn nhân sự)</option>
                            <option value="Internal">Internal (Bán sỉ & Kỹ thuật)</option>
                            <option value="Confidential">Confidential (Chỉ Trưởng phòng)</option>
                            <option value="Restricted">Restricted (Chỉ CEO & Giám Đốc)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-slate-500 font-semibold">Cấp quyền duyệt sửa đổi:</label>
                          <div className="space-y-1 bg-white p-2 rounded border max-h-36 overflow-y-auto">
                            {(['CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE', 'SUPPLIER', 'CUSTOMER'] as Role[]).map(r => (
                              <label key={r} className="flex items-center gap-1.5 cursor-pointer text-[10px] select-none font-semibold text-slate-600">
                                <input 
                                  type="checkbox" 
                                  checked={docAccess.includes(r)}
                                  onChange={() => handleToggleAccess(r)}
                                  className="accent-orange-500"
                                />
                                <span>{r}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className="w-full py-2 bg-slate-900 hover:bg-orange-600 text-white font-bold rounded-lg text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Check className="w-4 h-4" />
                            <span>Đăng Tải & Đồng Bộ</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DATA SYNC SHEET CHANNELS */}
          {activeTab === 'sync' && (
            <div className="space-y-4 animate-in fade-in duration-200 text-xs">
              <div className="max-w-xl mx-auto space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-extrabold text-sm md:text-base text-slate-800">Đồng bộ tư liệu từ Cổng lưu trữ ngoài</h4>
                </div>
                
                <p className="text-slate-500 leading-relaxed">
                  Hệ thống hỗ trợ quét tự động qua các API cổng dữ liệu đám mây chính thức của doanh nghiệp (OneDrive, Google Drive, SharePoint, File Server). Toàn bộ nhãn dán, nội dung nén, mã HS sẽ được AI tự xử lý mượt mà.
                </p>

                <div className="space-y-3">
                  <label className="block font-bold text-slate-700">Chọn nguồn nạp dữ liệu (Cloud Sync Source):</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'excel', name: 'Microsoft Excel', icon: '📊' },
                      { id: 'gsheets', name: 'Google Sheets', icon: '🟢' },
                      { id: 'gdrive', name: 'Google Drive', icon: '📐' },
                      { id: 'onedrive', name: 'Microsoft OneDrive', icon: '☁️' },
                      { id: 'sharepoint', name: 'SharePoint', icon: '🕸️' },
                      { id: 'fileserver', name: 'File Server Nội bộ', icon: '💽' }
                    ].map(src => (
                      <button
                        key={src.id}
                        type="button"
                        onClick={() => { setSyncSource(src.id as any); setSyncStatus('idle'); }}
                        className={`p-3 border rounded-lg text-center font-bold flex flex-col items-center justify-center gap-1 transition-all hover:bg-slate-100 ${
                          syncSource === src.id 
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-xs' 
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        <span className="text-lg">{src.icon}</span>
                        <span>{src.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleTriggerSync}
                      disabled={syncStatus === 'syncing'}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                      <span>{syncStatus === 'syncing' ? 'Đang kéo dữ liệu...' : `Kích hoạt đồng bộ ${syncSource.toUpperCase()} ngay`}</span>
                    </button>
                  </div>
                </div>

                {/* Console sync logs */}
                {syncLogs.length > 0 && (
                  <div className="bg-slate-900 text-slate-300 font-mono p-3 rounded-lg border border-slate-800 space-y-1 text-[11px] max-h-40 overflow-y-auto">
                    <div className="text-[10px] text-emerald-400 font-bold border-b border-slate-800 pb-1 flex items-center justify-between">
                      <span>ERP SYNC TRACE:</span>
                      <span>{syncStatus === 'completed' ? 'ĐỒNG BỘ XONG ✓' : 'PROCESSING...'}</span>
                    </div>
                    {syncLogs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-1">
                        <span className="text-emerald-500 font-bold shrink-0">&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: AI KNOWLEDGE SEARCH RETRIEVAL */}
          {activeTab === 'ai-search' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="text-center space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" /> AI KNOWLEDGE RAG ENGINE
                  </div>
                  <h4 className="font-extrabold text-sm md:text-base text-slate-800">Hỏi đáp Trợ lý Tri thức Thông minh</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Hệ thống tự động liên kết tất cả các SOP xích DID, quy trình đổi trả bảo hành ắc quy sụt áp để trích xuất câu trả lời chính xác có chú dẫn nguồn gốc.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex items-center gap-1.5 shadow-md">
                  <HelpCircle className="w-5 h-5 text-slate-400 ml-2" />
                  <input 
                    type="text" 
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiKnowledgeQuery()}
                    placeholder="Nhập câu hỏi (ví dụ: quy trình bảo hành ắc quy chì, HS code xích DID...)"
                    className="w-full p-2.5 text-xs md:text-sm text-slate-800 focus:outline-hidden rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleAiKnowledgeQuery}
                    className="px-4 py-2 bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    Hỏi AI
                  </button>
                </div>

                {/* AI Text Response rendering panel */}
                {isAiLoading && (
                  <div className="p-10 text-center space-y-2 bg-slate-50 rounded-xl border">
                    <RefreshCw className="w-7 h-7 animate-spin mx-auto text-orange-600" />
                    <p className="text-xs text-slate-500">AI đang quét các tài liệu Wiki, đọc bản vẽ QC và tóm tắt thông số kỹ thuật...</p>
                  </div>
                )}

                {aiResponse && (
                  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm animate-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <Cpu className="w-5 h-5 text-orange-600" />
                      <div>
                        <span className="font-extrabold text-slate-800 text-xs md:text-sm">Trí Tuệ Nhân Tạo TERASU AI</span>
                        <span className="text-[9px] text-slate-400 block font-mono">Precision Answers with Citations</span>
                      </div>
                    </div>

                    <div className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                      {aiResponse}
                    </div>

                    {/* Citations references mapping */}
                    {aiCitations.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Các văn bản làm căn cứ nguồn:</span>
                        <div className="space-y-1.5">
                          {aiCitations.map(cit => (
                            <div 
                              key={cit.id}
                              className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-150 flex items-center justify-between text-[11px] font-medium"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-orange-600" />
                                <span className="text-slate-500 font-mono font-bold">{cit.code}</span>
                                <span className="text-slate-700 font-semibold">{cit.name}</span>
                              </div>
                              <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded font-semibold font-mono uppercase">
                                {cit.department}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal footer with quick action tips */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 text-[10.5px] text-slate-400 flex flex-wrap items-center justify-between gap-3 font-medium">
          <div className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-orange-600" />
            <span>Mức an ninh hiện thời: <span className="font-bold text-slate-700">{currentRole}</span></span>
          </div>
          <div>
            Hệ thống Wiki đồng bộ tức thời với cơ sở dữ liệu Elasticsearch & Vector DB ERP Terasu.
          </div>
        </div>

      </div>
    </div>
  );
}


