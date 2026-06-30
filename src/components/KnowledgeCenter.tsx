/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FolderNode, Document, Role, DocumentType } from '../types';
import { DIRECTORY_TREE } from '../data/mockData';
import { 
  Folder, FolderOpen, FileText, ChevronRight, ChevronDown, Check,
  Plus, Upload, Shield, Tag, Info, Trash2, Edit3, X, Eye, EyeOff
} from 'lucide-react';
import BulkUpload from './BulkUpload';

interface KnowledgeCenterProps {
  currentRole: Role;
  documents: Document[];
  onAddDocument: (doc: Document) => void;
  onDeleteDocument: (id: string) => void;
  onViewDocDetails: (doc: Document) => void;
  selectedCategoryPath: string;
  onSetCategoryPath: (cat: string) => void;
}

export function KnowledgeCenter({
  currentRole,
  documents,
  onAddDocument,
  onDeleteDocument,
  onViewDocDetails,
  selectedCategoryPath,
  onSetCategoryPath
}: KnowledgeCenterProps) {
  
  // Dynamic Folder Permissions Matrix (State)
  const [folderPermissions, setFolderPermissions] = useState<Record<string, Role[]>>({
    'TERASU/01. CHIẾN LƯỢC': ['SUPER_ADMIN', 'CEO', 'DIRECTOR'],
    'TERASU/02. HCNS': ['SUPER_ADMIN', 'CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE'],
    'TERASU/03. MARKETING': ['SUPER_ADMIN', 'CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE', 'CUSTOMER', 'SUPPLIER'],
    'TERASU/04. KINH DOANH': ['SUPER_ADMIN', 'CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE', 'CUSTOMER'],
    'TERASU/05. KẾ TOÁN': ['SUPER_ADMIN', 'CEO', 'DIRECTOR', 'HEAD'],
    'TERASU/06. MUA HÀNG': ['SUPER_ADMIN', 'CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE', 'SUPPLIER'],
    'TERASU/07. KHO': ['SUPER_ADMIN', 'CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE'],
    'TERASU/08. QC KỸ THUẬT': ['SUPER_ADMIN', 'CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE', 'SUPPLIER'],
    'TERASU/09. DỊCH VỤ SỬA CHỮA': ['SUPER_ADMIN', 'CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE', 'CUSTOMER'],
    'TERASU/10. PHÁP LÝ': ['SUPER_ADMIN', 'CEO', 'DIRECTOR', 'HEAD'],
    'TERASU/11. TÀI KHOẢN HỆ THỐNG': ['SUPER_ADMIN', 'CEO']
  });
  const [isFolderPermOpen, setIsFolderPermOpen] = useState(false);

  // Expanded directories tracking state
  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>({
    'TERASU': true,
    'TERASU/06. MUA HÀNG': true,
    'TERASU/09. DỊCH VỤ SỬA CHỮA': true,
  });

  // Dynamic state to control document upload wizard form
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // New Document Input states with default suggestions
  const [newCode, setNewCode] = useState('TRS-SOP-MH-02');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<DocumentType>('SOP/Quy trình');
  const [newDept, setNewDept] = useState('MUA HÀNG');
  const [newPath, setNewPath] = useState('TERASU/06. MUA HÀNG/NCC Nước Ngoài');
  const [newCreator, setNewCreator] = useState('Trần Minh Quang');
  const [newApprover, setNewApprover] = useState('Nguyễn Văn Terasu');
  const [newVersion, setNewVersion] = useState('1.0');
  const [newTagsString, setNewTagsString] = useState('DID, Mua hàng, Nhập khẩu');
  const [newAccess, setNewAccess] = useState<Role[]>(['SUPER_ADMIN', 'CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE']);
  const [newSummary, setNewSummary] = useState('');

  // Dropdown list extraction of all leaf paths for file location selection
  const leafPaths: string[] = [];
  const extractLeafPaths = (node: FolderNode) => {
    if (!node.children || node.children.length === 0) {
      leafPaths.push(node.path);
    } else {
      node.children.forEach(extractLeafPaths);
    }
  };
  extractLeafPaths(DIRECTORY_TREE);

  const toggleExpand = (path: string) => {
    setExpandedPaths(prev => ({ ...prev, [path]: !prev[path] }));
  };

  // Check if role has rights to view folder path (enforced via dynamic matrix)
  const isAuthorizedToViewPath = (path: string) => {
    if (currentRole === 'SUPER_ADMIN') return true;

    // Check custom dynamic folder permission matrix
    const sortedKeys = Object.keys(folderPermissions).sort((a, b) => b.length - a.length);
    const matchingKey = sortedKeys.find(key => path === key || path.startsWith(key + '/'));
    if (matchingKey) {
      return folderPermissions[matchingKey].includes(currentRole);
    }

    // Fallback standard rules
    if (currentRole === 'CEO' || currentRole === 'DIRECTOR') return true;
    if (currentRole === 'HEAD') {
      // Can't read CEO Strategy folder
      return !path.includes('01. CHIẾN LƯỢC');
    }
    if (currentRole === 'CUSTOMER') {
      // Customers can only see marketing & repair services & catalogue
      return path.includes('03. MARKETING') || path.includes('09. DỊCH VỤ SỬA CHỮA') || path.includes('04. KINH DOANH/Catalogue');
    }
    if (currentRole === 'SUPPLIER') {
      // Suppliers view specific subdirs
      return path.includes('08. QC KỸ THUẬT') || path.includes('06. MUA HÀNG/Báo giá') || path.includes('06. MUA HÀNG/Hợp đồng');
    }
    // Employees standard access exclude Strategy
    return !path.includes('01. CHIẾN LƯỢC') && !path.includes('05. KẾ TOÁN') && !path.includes('11. TÀI KHOẢN HỆ THỐNG');
  };

  // Rendering the Folder Tree recursively
  const renderTree = (node: FolderNode) => {
    const isExpanded = !!expandedPaths[node.path];
    const isLeaf = !node.children || node.children.length === 0;
    const isSelected = selectedCategoryPath === node.path;
    const isAuthorized = isAuthorizedToViewPath(node.path);

    return (
      <div key={node.path} className="pl-3.5" id={`dir-node-${node.name.replace(/[^a-zA-Z0-9]/g, '')}`}>
        <div 
          onClick={() => {
            if (isAuthorized) {
              onSetCategoryPath(node.path);
              if (!isLeaf) toggleExpand(node.path);
            }
          }}
          className={`flex items-center justify-between py-1 px-2 rounded-md cursor-pointer group text-xs md:text-sm select-none transition-colors ${
            isSelected 
              ? 'bg-orange-100 text-orange-950 font-bold border-l-2 border-orange-600' 
              : isAuthorized 
                ? 'hover:bg-slate-100 text-slate-700' 
                : 'opacity-40 text-slate-400 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {!isLeaf ? (
              isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            ) : (
              <span className="w-3.5" />
            )}
            
            {isLeaf ? (
              <span className="text-slate-400 font-mono text-[10px] shrink-0">📄</span>
            ) : (
              isExpanded 
                ? <FolderOpen className="w-4 h-4 text-orange-600 shrink-0" /> 
                : <Folder className="w-4 h-4 text-slate-400 shrink-0" />
            )}
            <span className="truncate">{node.name}</span>
          </div>

          <div className="flex items-center gap-1">
            {!isAuthorized && (
              <span className="text-[9px] bg-slate-200 text-slate-600 px-1 rounded flex items-center gap-0.5">
                <EyeOff className="w-2.5 h-2.5" /> Khóa
              </span>
            )}
            {isSelected && <span className="w-1.5 h-1.5 bg-orange-600 rounded-full shrink-0" />}
          </div>
        </div>

        {!isLeaf && isExpanded && isAuthorized && (
          <div className="border-l border-slate-200 ml-2.5 mt-0.5 space-y-0.5">
            {node.children!.map(child => renderTree(child))}
          </div>
        )}
      </div>
    );
  };

  // Filter local documents strictly based on the selected directory tree path
  const filteredDocs = documents.filter(doc => {
    // If selected root, show everything authorized
    if (selectedCategoryPath === 'TERASU') {
      if (currentRole === 'SUPER_ADMIN' || currentRole === 'CEO' || currentRole === 'DIRECTOR') return true;
      return doc.accessRights.includes(currentRole);
    }
    // Else check matching path (strictly match or starts with)
    const isPathMatch = doc.categoryPath.startsWith(selectedCategoryPath);
    
    // Auth check
    const isRoleMatch = currentRole === 'SUPER_ADMIN' || currentRole === 'CEO' || currentRole === 'DIRECTOR' || doc.accessRights.includes(currentRole);
    
    return isPathMatch && isRoleMatch;
  });

  const getDocTypeColor = (type: string) => {
    switch (type) {
      case 'SOP/Quy trình': return 'bg-indigo-50 text-indigo-700 border-indigo-150';
      case 'Biểu mẫu': return 'bg-cyan-50 text-cyan-700 border-cyan-150';
      case 'Tài liệu đào tạo': return 'bg-amber-50 text-amber-700 border-amber-150';
      case 'Video/Slide': return 'bg-orange-50 text-orange-700 border-orange-150';
      case 'Hình ảnh QC': return 'bg-pink-50 text-pink-700 border-pink-150';
      case 'Hồ sơ pháp lý': return 'bg-red-50 text-red-700 border-red-150';
      case 'Báo giá/Hợp đồng': return 'bg-emerald-50 text-emerald-700 border-emerald-150';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) {
      alert('Vui lòng điền mã tài liệu và tên tài liệu!');
      return;
    }

    const tagsArray = newTagsString.split(',').map(t => t.trim()).filter(t => t.length > 0);
    
    const doc: Document = {
      id: `doc-${Date.now()}`,
      code: newCode.toUpperCase().trim(),
      name: newName.trim(),
      type: newType,
      department: newDept,
      categoryPath: newPath,
      creator: newCreator + ' (Tài khoản ' + currentRole + ')',
      approver: newApprover,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      version: newVersion,
      status: 'Ban hành',
      tags: tagsArray,
      accessRights: newAccess,
      contentSummary: newSummary || `SOP đặc tả chi tiết nghiệp vụ ${newName}. Triển khai thực hiện toàn ban vận hành.`
    };

    onAddDocument(doc);
    setIsUploadOpen(false);
    
    // Reset forms
    setNewName('');
    setNewSummary('');
    setNewTagsString('DID, Terasu, Quy trình');
    alert('Thêm tài liệu mới vào hệ thống tri thức thành công!');
  };

  const handleRoleToggle = (role: Role) => {
    if (newAccess.includes(role)) {
      setNewAccess(newAccess.filter(r => r !== role));
    } else {
      setNewAccess([...newAccess, role]);
    }
  };

  const currentCategoryLabel = selectedCategoryPath.replace('TERASU/', '');

  return (
    <div className="space-y-6" id="knowledge-repository">
      
      {/* Informative Help Alert */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-slate-800">Wikipedia nội bộ của Doanh nghiệp sản xuất TERASU</h4>
          <p className="text-slate-600 leading-relaxed">
            Hệ thống sắp xếp tài liệu khoa học theo 11 mục chuẩn. Doanh nghiệp phụ tùng xe máy dễ dàng lập chỉ mục cho nhãn hàng xích sỉ Nhật Bản (DID), ắc quy Lead, quy trình sửa chữa. 
            <strong> Chú ý:</strong> Khách hàng (Portal riêng) chỉ xem được catalog thương mại, sên tải hướng dẫn bảo dưỡng mà không thấy bản vẽ kỹ thuật chi tiết của Nhà cung cấp (QC).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: standard Folder Explorer Hierarchy (4 cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-800 text-xs md:text-sm flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-orange-600" />
              <span>Sơ Đồ 11 Thư Mục TERASU</span>
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold font-mono">TREE</span>
          </div>

          <div className="space-y-1 max-h-[520px] overflow-y-auto pr-1">
            {renderTree(DIRECTORY_TREE)}
          </div>

          <div className="pt-2 border-t border-slate-150">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mới / Tải lên tài liệu Wiki</span>
            </button>
          </div>
        </div>

        {/* Right Column: Files Grid lists inside selected directory (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Header indicator bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
            <div>
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Thư mục hiện tại</div>
              <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-1">
                <span>📂</span>
                <span className="text-orange-600">{currentCategoryLabel}</span>
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              {(currentRole === 'SUPER_ADMIN' || currentRole === 'CEO') && (
                <button
                  onClick={() => setIsFolderPermOpen(true)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-250 text-[11px] font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                  id="btn-folder-perm"
                >
                  <Shield className="w-3 h-3 text-orange-600" />
                  <span>Cấu hình Quyền Thư mục</span>
                </button>
              )}
              
              <div className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-mono font-medium">
                Số lượng: <strong className="text-slate-800">{filteredDocs.length}</strong> tệp tài liệu
              </div>
            </div>
          </div>

          {/* List of documents in grid */}
          {filteredDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocs.map((doc) => (
                <div 
                  key={doc.id}
                  className="bg-white rounded-xl border border-slate-150 hover:border-orange-200 transition-all p-4 flex flex-col justify-between space-y-3 relative overflow-hidden group hover:shadow-xs"
                  id={`doc-card-${doc.id}`}
                >
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] font-mono text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                        {doc.code}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getDocTypeColor(doc.type)}`}>
                        {doc.type}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 
                      onClick={() => onViewDocDetails(doc)}
                      className="font-bold text-slate-800 text-sm hover:text-orange-600 cursor-pointer min-h-10 line-clamp-2"
                    >
                      {doc.name}
                    </h4>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.map(tag => (
                        <span key={tag} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded-sm border border-slate-150">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Author block */}
                    <div className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-50">
                      <div>Người lập: <strong className="text-slate-700">{doc.creator}</strong></div>
                      <div>Ngày cập nhật: <span className="text-slate-800">{doc.updatedAt}</span></div>
                    </div>
                  </div>

                  {/* Buttons tray */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                    <button
                      onClick={() => onViewDocDetails(doc)}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-orange-600 hover:text-white text-slate-700 font-bold text-xs rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem & Metadata</span>
                    </button>
                    {(currentRole === 'SUPER_ADMIN' || currentRole === 'CEO' || currentRole === 'DIRECTOR') && (
                      <button
                        onClick={() => {
                          if (confirm(`Bạn chắc chắn muốn xóa tài liệu ${doc.code} ra khỏi hệ thống tri thức chứ?`)) {
                            onDeleteDocument(doc.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded bg-slate-50 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Xóa tài liệu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center bg-white rounded-xl border border-dotted border-slate-200">
              <Folder className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h5 className="font-bold text-slate-700 text-sm md:text-base">Mục thư mục này chưa có tài liệu</h5>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Chưa có tài liệu phân quyền nào được tải lên trong thư mục này đối với quyền hạn của vai trò <strong className="text-slate-700">{currentRole}</strong>. Hãy nhấn nút phía dưới để tải lên SOP đầu tiên!
              </p>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="mt-4 px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-lg hover:bg-orange-600 transition-colors"
              >
                Tải lên tài liệu Wiki mới
              </button>
            </div>
          )}

        </div>

      </div>

      {/* 4. Upload Wizard Overlay Box Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl border border-slate-150 animate-in fade-in zoom-in-95 duration-100">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-sm md:text-base">Tải lên & Khởi tạo Metadata Tài liệu Doanh nghiệp</h3>
              </div>
              <button 
                onClick={() => setIsUploadOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateDocument} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              
              {/* Drag-and-drop file upload simulator zone */}
              <div 
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  const files = e.dataTransfer.files;
                  if (files && files.length > 0) {
                    const f = files[0];
                    setNewName(f.name.substring(0, f.name.lastIndexOf('.')) || f.name);
                    // Autofills fields
                    const ext = f.name.split('.').pop()?.toLowerCase();
                    if (ext === 'xlsx' || ext === 'xls') setNewType('Biểu mẫu');
                    else if (ext === 'pdf') setNewType('SOP/Quy trình');
                    else if (ext === 'png' || ext === 'jpg') setNewType('Hình ảnh QC');
                    alert(`Đã nhận file mô phỏng: ${f.name} (${(f.size / 1024).toFixed(1)} KB)`);
                  }
                }}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                  isDragOver 
                    ? 'border-orange-500 bg-orange-50/50' 
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50'
                }`}
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Kéo thả File Word, Excel, PDF hoặc Hình ảnh vào đây</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Hoặc click để chọn một tệp mô phỏng từ máy tính của bạn</p>
                <input 
                  type="file" 
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const f = files[0];
                      setNewName(f.name.substring(0, f.name.lastIndexOf('.')) || f.name);
                      const ext = f.name.split('.').pop()?.toLowerCase();
                      if (ext === 'xlsx' || ext === 'xls') setNewType('Biểu mẫu');
                      else if (ext === 'pdf') setNewType('SOP/Quy trình');
                      else if (ext === 'png' || ext === 'jpg') setNewType('Hình ảnh QC');
                    }
                  }}
                  className="hidden" 
                  id="file-upload-input-real" 
                />
                <label 
                  htmlFor="file-upload-input-real"
                  className="mt-2.5 inline-flex items-center bg-white border border-slate-200 text-slate-700 text-[11px] px-3 py-1.5 rounded-md font-bold cursor-pointer hover:bg-slate-100"
                >
                  Chọn file từ thiết bị
                </label>
              </div>

              {/* Form Input fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Product code */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Mã Tài liệu (SOP Code)</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="Ví dụ: TRS-SOP-MH-02"
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                    required
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Tên Tài liệu / SOP</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Tên tài liệu tri thức..."
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                    required
                  />
                </div>

                {/* Document Type */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Loại Tài liệu</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as DocumentType)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                  >
                    <option value="SOP/Quy trình">Quy trình/SOP</option>
                    <option value="Biểu mẫu">Biểu mẫu (Excel/Word)</option>
                    <option value="Tài liệu đào tạo">Tài liệu đào tạo</option>
                    <option value="Hình ảnh QC">Hình ảnh QC/Kỹ thuật</option>
                    <option value="Hồ sơ pháp lý">Hồ sơ pháp lý</option>
                    <option value="Báo giá/Hợp đồng">Báo giá/Hợp đồng</option>
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Phòng ban Phụ trách</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                  >
                    {['HCNS', 'MARKETING', 'KINH DOANH', 'KẾ TOÁN', 'MUA HÀNG', 'KHO', 'QC KỸ THUẬT', 'DỊCH VỤ SỬA CHỮA', 'PHÁP LÝ'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Target Directory Path */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Vị trí Cây Thư Mục</label>
                  <select
                    value={newPath}
                    onChange={(e) => setNewPath(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                  >
                    {leafPaths.map(path => (
                      <option key={path} value={path}>{path.replace('TERASU/', '')}</option>
                    ))}
                  </select>
                </div>

                {/* Version */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Phiên bản</label>
                  <input
                    type="text"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    placeholder="1.0"
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                    required
                  />
                </div>

                {/* Document builder */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Người biên soạn</label>
                  <input
                    type="text"
                    value={newCreator}
                    onChange={(e) => setNewCreator(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                    required
                  />
                </div>

                {/* Approver */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Người phê duyệt ký ban hành</label>
                  <input
                    type="text"
                    value={newApprover}
                    onChange={(e) => setNewApprover(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                    required
                  />
                </div>
              </div>

              {/* Tags comma split input */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Thẻ Tags (Chỉ định tìm kiếm AI - Phân cách bằng dấu phẩy)</label>
                <div className="relative flex items-center">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    value={newTagsString}
                    onChange={(e) => setNewTagsString(e.target.value)}
                    placeholder="Ví dụ: xích DID, sên vàng, Wave, Suzuki"
                    className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Content description for OCR semantic simulation */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Tắt tóm lược / Nội dung file (Phục vụ truy vấn thông minh Semantic)</label>
                <textarea
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Mô tả tóm lược hoặc nội dung chi tiết bài viết, đoạn văn bản để AI dễ dàng OCR tìm trúng ngay..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-hidden"
                />
              </div>

              {/* Access limits checks checkboxes */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Nhóm được cấp quyền truy cập (Phân quyền):</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(['CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE', 'CUSTOMER', 'SUPPLIER'] as Role[]).map(role => {
                    const active = newAccess.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleToggle(role)}
                        className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded-md border flex items-center gap-1 ${
                          active 
                            ? 'bg-orange-50 text-orange-700 border-orange-500' 
                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>{role}</span>
                        {active && <Check className="w-3 h-3 text-orange-600 ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg transition-colors border border-slate-200"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Ký số ban hành (Publish)
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Folder Permission Settings Modal */}
      {isFolderPermOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500 animate-pulse" />
                <div>
                  <h3 className="font-bold text-xs md:text-sm">Phân quyền Thư mục (Folder Level Auth)</h3>
                  <p className="text-[10px] text-slate-400">Đường dẫn: {selectedCategoryPath}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsFolderPermOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 text-xs text-slate-500 leading-relaxed">
                Thiết lập quyền xem và khai thác tài liệu cho thư mục <strong className="text-slate-700">{currentCategoryLabel}</strong> và tất cả các thư mục con trực thuộc.
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Các vai trò được phép truy cập:</label>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {(['SUPER_ADMIN', 'CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE', 'CUSTOMER', 'SUPPLIER'] as Role[]).map(role => {
                    const currentAllowed = folderPermissions[selectedCategoryPath] || [];
                    const isAllowed = currentAllowed.includes(role);
                    return (
                      <label 
                        key={role}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                          isAllowed 
                            ? 'bg-orange-50 border-orange-300 text-orange-950' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                            {role.substring(0,2)}
                          </span>
                          <span>{role}</span>
                        </div>
                        <input 
                          type="checkbox"
                          checked={isAllowed}
                          onChange={() => {
                            const newRoles = isAllowed 
                              ? currentAllowed.filter(r => r !== role)
                              : [...currentAllowed, role];
                            setFolderPermissions(prev => ({
                              ...prev,
                              [selectedCategoryPath]: newRoles
                            }));
                          }}
                          className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-150 flex items-center justify-end gap-2 text-xs">
                <button
                  onClick={() => setIsFolderPermOpen(false)}
                  className="px-4 py-2 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition-colors font-bold"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    setIsFolderPermOpen(false);
                    alert(`Đã lưu cấu hình phân quyền thư mục [${selectedCategoryPath}] thành công!`);
                  }}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors"
                >
                  Áp dụng quyền mộc đỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BulkUpload currentRole={currentRole} />
    </div>
  );
}


