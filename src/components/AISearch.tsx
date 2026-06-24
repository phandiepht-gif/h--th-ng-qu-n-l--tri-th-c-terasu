/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Document, Role } from '../types';
import { INITIAL_DOCUMENTS } from '../data/mockData';
import { 
  Search, Sparkles, FileText, FileVideo, Image, FileSpreadsheet, 
  CornerDownRight, Copy, ArrowRight, Eye, Tag, AlertCircle, FileBox, HelpCircle, Send, Cpu
} from 'lucide-react';

interface AISearchProps {
  currentRole: Role;
  documents: Document[];
  onViewDoc: (doc: Document) => void;
  onSetCategory: (catPath: string) => void;
  onSetTab: (tab: string) => void;
}

export function AISearch({ currentRole, documents, onViewDoc, onSetCategory, onSetTab }: AISearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [isSemanticEnabled, setIsSemanticEnabled] = useState(true);
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrTextResult, setOcrTextResult] = useState<string | null>(null);
  const [ocrFeedbackFiles, setOcrFeedbackFiles] = useState<Document[]>([]);
  
  // AI Chat Assistant State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string; citations?: { code: string; name: string }[] }[]>([
    {
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ Lý Tri Thức AI của TERASU. Bạn có thể hỏi tôi về quy trình bảo hành, HS Code nhông xích, điều kiện đại lý hoặc tra cứu bất kỳ SOP nào tại đây.'
    }
  ]);

  // Extract all unique tags dynamically
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    documents.forEach(doc => {
      doc.tags.forEach(t => tagsSet.add(t));
    });
    return Array.from(tagsSet);
  }, [documents]);

  // Filter documents based on Role & Search Query & Selected Tag
  const searchResults = useMemo(() => {
    let list = documents;

    // Filter by Role Permissions
    list = list.filter(doc => {
      if (currentRole === 'CEO') return true;
      if (currentRole === 'DIRECTOR') return true;
      if (currentRole === 'HEAD') {
        // Can read unless categorized as Strategy (which only CEO has full control over)
        return !doc.categoryPath.includes('01. CHIẾN LƯỢC');
      }
      return doc.accessRights.includes(currentRole);
    });

    // Filter by type
    if (filterType !== 'all') {
      if (filterType === 'sop') list = list.filter(d => d.type === 'SOP/Quy trình');
      if (filterType === 'form') list = list.filter(d => d.type === 'Biểu mẫu');
      if (filterType === 'training') list = list.filter(d => d.type === 'Tài liệu đào tạo' || d.tags.includes('Video'));
      if (filterType === 'image') list = list.filter(d => d.type === 'Hình ảnh QC' || d.tags.includes('Hình ảnh'));
      if (filterType === 'legal') list = list.filter(d => d.type === 'Hồ sơ pháp lý');
    }

    // Filter by Tag Clicked
    if (selectedTag) {
      list = list.filter(d => d.tags.includes(selectedTag));
    }

    // Search query match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();

      // Implement intelligent synonym extension & keyword association
      // e.g. "ắc quy bảo hành" -> matches "ắc quy", "bảo hành"
      const searchTerms = q.split(/\s+/).filter(t => t.length > 0);

      list = list.filter(doc => {
        // Match all terms (AND) or any (OR)? Let's use any term (OR) but sort by score
        return searchTerms.some(term => {
          const inTitle = doc.name.toLowerCase().includes(term);
          const inCode = doc.code.toLowerCase().includes(term);
          const inDept = doc.department.toLowerCase().includes(term);
          const inSummary = doc.contentSummary?.toLowerCase().includes(term);
          const inTags = doc.tags.some(t => t.toLowerCase().includes(term));
          return inTitle || inCode || inDept || inSummary || inTags;
        });
      });
    }

    return list;
  }, [currentRole, searchQuery, selectedTag, filterType]);

  // Smart Pre-defined Responses for AI Assistant
  const handleChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let replyText = '';
      let citations: { code: string; name: string }[] = [];

      if (lower.includes('bảo hành') || lower.includes('ắc quy') || lower.includes('ac quy')) {
        replyText = `Dựa trên tài liệu nghiệp vụ của TERASU:
Quy trình bảo hành ắc quy khô xe máy (mã **TRS-SOP-BH-03**) quy định cực kỳ rõ ràng:
1. Tiếp nhận lỗi từ khách hàng trực tiếp tại trạm sửa chữa (đo điện áp không tải và điện áp sụt dòng dưới tải).
2. Nếu xác định chết cell từ nhà sản xuất (phồng rộp, hụt nguồn dưới 10.5V đột ngột), QC duyệt thay mới 100% trong vòng 24h miễn phí.
Bạn có thể tham khảo trực tiếp biểu mẫu và SOP đính kèm để in phiếu bảo hành.`;
        citations = [{ code: 'TRS-SOP-BH-03', name: 'Quy trình bảo hành ắc quy khô xe máy TERASU' }];
      } 
      else if (lower.includes('hs code') || lower.includes('hs-code') || lower.includes('nhông') || lower.includes('nhong')) {
        replyText = `Mã HS Code áp dụng cho phụ tùng nhông xích xe máy nhập khẩu của TERASU (từ tài liệu sổ tay nhập khẩu **TRS-PL-HS-01**):
- **Nhông trước/sau xe Wave 110cc**: Mã HS \`8714.10.90\` (Phụ tùng xe gắn máy khác), được hưởng thuế C/O Form E ưu đãi cực kỳ đặc biệt từ đối tác thương mại Trung Quốc.
- **Xích truyền động (Sên tải)**: Mã HS \`7315.11.90\` (Xích dạng khớp bằng sắt hoặc thép).`;
        citations = [
          { code: 'TRS-PL-HS-01', name: 'Hồ sơ mã HS Code nhông xích và phụ tùng xe máy' },
          { code: 'TRS-SOP-MH-01', name: 'Quy trình mua hàng nước ngoài & nhập khẩu linh kiện' }
        ];
      } 
      else if (lower.includes('đại lý') || lower.includes('dai ly') || lower.includes('mở cửa hàng')) {
        replyText = `Theo văn bản hướng dẫn chiến lược bán hàng thương hiệu (**TRS-SOP-DL-02**):
Để chính thức mở đại lý phân phối cấp 1 ký gửi sản phẩm TERASU, quý đối tác cần đảm bảo:
1. Showroom hoặc tiệm dịch vụ sửa chữa có diện tích tối thiểu 20m2.
2. Cam kết treo lắp biển hiệu Alu màu đỏ cam tiêu chuẩn thương hiệu #FF4500.
3. Giá trị đơn hàng ký cược ban đầu tối thiểu là 50 Triệu VNĐ. Chiết khấu lũy tiến lên đến 15% vào cuối kỳ kế toán.`;
        citations = [
          { code: 'TRS-SOP-DL-02', name: 'Quy trình hướng dẫn mở đại lý ký gửi cấp 1' },
          { code: 'TRS-MARK-POSM-04', name: 'Thiết kế biển hiệu đại lý ủy quyền TERASU 2026' }
        ];
      } 
      else if (lower.includes('did') || lower.includes('sên') || lower.includes('xích')) {
        replyText = `Thông tin xích sên hãng DID nhập khẩu tháng 6 (**TRS-BG-DID-2026**):
- Lô hàng bao gồm sên DID 428D, 428HD vàng và sên phốt đen T-ring chính hãng DID Kogyo Nhật Bản nhập khẩu khẩu qua đại diện mậu dịch.
- Đơn giá sỉ được áp dụng từ ngày 01/06/2026 cho toàn bộ chuỗi hệ thống sửa chữa liên kết TERASU miền Bắc và miền Nam. Chú ý hướng dẫn thợ đo kỹ sên 9 ly để thay đúng dòng Wave sên mòn.`;
        citations = [
          { code: 'TRS-BG-DID-2026', name: 'Báo giá xích DID Nhật Bản nhập khẩu kì tháng 6' },
          { code: 'TRS-DT-SP-02', name: 'Video đào tạo quy trình kiểm tra xích nhông sên dĩa TERASU' }
        ];
      } 
      else {
        replyText = `Cảm ơn câu hỏi của bạn. Để tìm kiếm tốt nhất về "${userMsg}", bạn có thể gõ từ khóa lên thanh công cụ Tìm kiếm Tri thức bên trái hoặc nhấp vào các nhãn dán thông minh (Tags. Ví dụ: *Ắc quy, DID, HS Code*).
Hệ thống lưu trữ 11 thư mục tri thức ERP từ Chiến lược tới Sổ tay thợ máy sửa chữa luôn sẵn sàng đáp ứng!`;
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: replyText, citations }]);
    }, 1200);
  };

  // Preset OCR File Simulators
  const runOcrSimulator = (filename: string, textExtracted: string, matchCodes: string[]) => {
    setOcrScanning(true);
    setOcrTextResult(null);
    setOcrFeedbackFiles([]);
    
    setTimeout(() => {
      setOcrScanning(false);
      setOcrTextResult(`[OCR ĐỌC THÀNH CÔNG] - Tên File: ${filename}
-----------------------------------------------------------
Nội dung văn bản quét được:
${textExtracted}`);
      
      const matched = documents.filter(doc => matchCodes.includes(doc.code));
      setOcrFeedbackFiles(matched);
    }, 1800);
  };

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'SOP/Quy trình': return <FileText className="w-5 h-5 text-indigo-600" />;
      case 'Báo giá/Hợp đồng': return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'Biểu mẫu': return <FileSpreadsheet className="w-5 h-5 text-cyan-600" />;
      case 'Tài liệu đào tạo': return <FileVideo className="w-5 h-5 text-amber-600" />;
      case 'Hình ảnh QC': return <Image className="w-5 h-5 text-pink-600" />;
      default: return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6" id="ai-search-module">
      
      {/* 1. Main Search Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 md:p-8 rounded-2xl shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Cpu className="w-48 h-48 transform rotate-12" />
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-orange-600/20 text-orange-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> TERASU INTELLECTUAL COGNITION
          </div>
          <h2 className="text-xl md:text-3xl font-bold tracking-tight">AI Search & Tri thức Vận hành liên phòng ban</h2>
          <p className="text-xs md:text-sm text-slate-300">
            Tra cứu thông minh giống Google. Nhập câu hỏi, mã HS Code, quy trình bảo hành sên sỉ DID để hệ thống truy tìm kết quả từ file Word, Excel, PDF, video và sơ đồ kỹ thuật.
          </p>

          {/* Central Input Box */}
          <div className="pt-2">
            <div className="relative flex items-center bg-white rounded-lg p-1.5 shadow-lg border border-slate-700/50">
              <Search className="w-5 h-5 text-slate-400 absolute left-4" />
              <input
                type="text"
                placeholder="Ví dụ: Báo giá xích DID, bảo hành ắc quy, HS Code nhông xe Wave..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedTag(null); // Clear selected tag on active type
                }}
                className="w-full pl-11 pr-24 py-3 text-slate-800 placeholder-slate-400 focus:outline-hidden text-sm md:text-base rounded-md"
                id="search-input-main"
              />
              <div className="absolute right-2 flex items-center gap-2">
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-slate-400 hover:text-slate-600 px-1"
                  >
                    Xóa
                  </button>
                )}
                <div className="hidden md:flex items-center gap-1 bg-orange-50 text-orange-600 text-[10px] px-2 py-1 rounded font-mono font-bold">
                  <Cpu className="w-3 h-3" /> AI Active
                </div>
              </div>
            </div>
          </div>

          {/* Search Toggle Options */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-orange-400 select-none">
              <input
                type="checkbox"
                checked={isSemanticEnabled}
                onChange={(e) => setIsSemanticEnabled(e.target.checked)}
                className="rounded accent-orange-500 w-3.5 h-3.5"
              />
              <span>Semantic Search (Mô hình Ngữ nghĩa)</span>
            </label>
            <span className="text-slate-600">•</span>
            <span>Khớp từ khóa thông minh (Fuzzy Index)</span>
            <span className="text-slate-600">•</span>
            <span>Bộ giải mã OCR hình ảnh văn bản</span>
          </div>
        </div>
      </div>

      {/* Grid Layout: Search Results vs. AI Chat Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Search Filter and Results (8/12 width on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Quick Category & Tag Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-800 text-xs md:text-sm">Bộ lọc nhanh</span>
              {(selectedTag || searchQuery || filterType !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTag(null);
                    setFilterType('all');
                  }}
                  className="text-xs text-orange-600 hover:underline font-medium"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
            
            {/* Type Filters */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Tất cả tài liệu' },
                { id: 'sop', label: 'SOP & Quy trình' },
                { id: 'form', label: 'Biểu mẫu Excel/PDF' },
                { id: 'training', label: 'Video & Slide Đào tạo' },
                { id: 'image', label: 'Ảnh QC/Kỹ thuật' },
                { id: 'legal', label: 'Hồ sơ pháp lý / HS Code' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setFilterType(item.id)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                    filterType === item.id 
                      ? 'bg-slate-800 text-white font-medium shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Smart Tags cloud */}
            <div className="space-y-1">
              <div className="text-[11px] text-slate-500 font-medium">Nhãn dán tri thức nổi bật (Tag cloud)</div>
              <div className="flex flex-wrap gap-1">
                {allTags.map(tag => {
                  const isSelected = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(isSelected ? null : tag)}
                      className={`text-[10px] px-2 py-0.5 rounded-sm flex items-center gap-1 border transition-all ${
                        isSelected 
                          ? 'bg-orange-500 text-white border-orange-500 font-bold' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Search Result List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Đã tìm thấy <strong className="text-slate-800">{searchResults.length}</strong> đề mục phù hợp</span>
              <span>Vai trò hiện tại: <span className="font-semibold text-slate-700">{currentRole}</span></span>
            </div>

            {searchResults.length > 0 ? (
              <div className="space-y-2.5">
                {searchResults.map((doc) => (
                  <div 
                    key={doc.id}
                    className="p-4 bg-white rounded-xl border border-slate-150 hover:border-orange-200 transition-all shadow-xs relative group hover:shadow-xs"
                    id={`search-card-${doc.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                        {getDocIcon(doc.type)}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {doc.code}
                          </span>
                          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                            {doc.department}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Phiên bản: v{doc.version}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm md:text-base group-hover:text-orange-600 transition-colors">
                          {doc.name}
                        </h4>
                        
                        {doc.contentSummary && (
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 pt-0.5">
                            {doc.contentSummary}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                          {doc.tags.map(t => (
                            <span 
                              key={t}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTag(t);
                              }}
                              className="text-[9px] bg-slate-100 text-slate-500 hover:bg-orange-100 hover:text-orange-700 px-1.5 py-0.2 rounded-sm cursor-pointer"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>

                        {/* Location path breadcrumb */}
                        <div className="flex items-center gap-1 pt-2.5 border-t border-slate-50 mt-2 text-[10px] text-slate-400 font-medium">
                          <span>Đường dẫn cây tư liệu:</span>
                          <button
                            onClick={() => {
                              onSetCategory(doc.categoryPath);
                              onSetTab('knowledge');
                            }}
                            className="hover:text-orange-600 hover:underline flex items-center gap-0.5"
                          >
                            {doc.categoryPath} <ArrowRight className="w-2.5 h-2.5 inline" />
                          </button>
                        </div>
                      </div>

                      {/* Action trigger button */}
                      <div className="self-center">
                        <button 
                          onClick={() => onViewDoc(doc)}
                          className="p-1.5 bg-slate-100 text-slate-600 hover:bg-orange-600 hover:text-white rounded-full transition-colors"
                          title="Xem chi tiết và Metadata"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-xl border border-dotted border-slate-200">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h5 className="font-medium text-slate-700">Không tìm thấy tài liệu phù hợp</h5>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Vui lòng kiểm tra lại từ khóa tìm kiếm (báo giá DID, ắc quy bảo hành) hoặc chuyển đổi vai trò người dùng (ví dụ: Nhà cung cấp có thể bị chặn xem sơ đồ chính sách của CEO).
                </p>
              </div>
            )}

            {/* 2. Visual OCR Image Scanning Simulator Box */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4.5 h-4.5 text-orange-600" />
                  <span className="font-bold text-xs md:text-sm text-slate-800">Trình Giả Lập OCR Đọc Hình Ảnh & File PDF Hợp Đồng</span>
                </div>
                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">OCR SCANNER</span>
              </div>
              <p className="text-xs text-slate-500">
                Nhân viên trong xưởng sửa chữa hoặc nhân sự kho có thể chụp ảnh phiếu linh kiện của khách hàng cực kỳ nhanh để hệ thống tự quét văn bản, trích lục và gợi ý tài liệu đối soát tương ứng:
              </p>

              {/* Presets to Simulate Click to OCR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => runOcrSimulator(
                    'Anh_Binh_Ac_Quy_Lead_Hong_Cell.png',
                    '[MODEL: TERASU LEAD BATTERY - TRS-BT-091]\n[SERIAL: 202611A092]\nKHÁCH PHẢN ÁNH: DÒNG ĐỀ YẾU, BÌNH BỊ PHỒNG CỰC DƯƠNG, SỤT ÁP KHÔNG ĐỦ CƠ CẤU 12V.',
                    ['doc-3']
                  )}
                  className="p-3 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-lg text-left transition-all space-y-1 focus:outline-hidden"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Image className="w-3.5 h-3.5 text-orange-600" />
                    <span>Preset 1: Ảnh Ắc quy Lead bị lỗi</span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">Mô phỏng quét nhãn thiết bị chết cell chẩn đoán rơ</p>
                </button>

                <button
                  type="button"
                  onClick={() => runOcrSimulator(
                    'To_khai_Hai_quan_Sên_DID.pdf',
                    'CỤC HẢI QUAN HẢI PHÒNG - TỜ KHAI HÀNG HÓA NHẬP KHẨU\nDOANH NGHIỆP: TERASU CO., LTD\nMÃ HS CODE: 7315.11.90 (XÍCH TẢI DID TRUYỀN ĐỘNG THÉP C45 NHA TRANG)\nORIGIN: DID KOGYO - JAPAN - FORM E ATTACHED',
                    ['doc-1', 'doc-4']
                  )}
                  className="p-3 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-lg text-left transition-all space-y-1 focus:outline-hidden"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <FileText className="w-3.5 h-3.5 text-orange-600" />
                    <span>Preset 2: Tờ khai Hải quan sên DID</span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">Mô phỏng tách chữ OCR PDF mộc đỏ hải quan</p>
                </button>
              </div>

              {/* Live Status Indicators */}
              {ocrScanning && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-xs text-orange-700 font-bold">
                    AI Đang Quét Giấy Tờ / Ảnh (Trực tiếp phân tích OCR nét chữ và trích lọc tags)...
                  </div>
                </div>
              )}

              {/* OCR Scanning Results Panel */}
              {ocrTextResult && !ocrScanning && (
                <div className="bg-slate-900 text-emerald-400 font-mono text-[11px] p-3 rounded-lg border border-slate-800 space-y-2 max-h-48 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{ocrTextResult}</pre>
                </div>
              )}

              {/* Suggested Documents from OCR Matches */}
              {ocrFeedbackFiles.length > 0 && !ocrScanning && (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-2">
                  <div className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-4.5 h-4.5 text-emerald-700" />
                    <span>AI đề xuất quy trình liên quan khớp ảnh OCR:</span>
                  </div>
                  <div className="space-y-1.5">
                    {ocrFeedbackFiles.map(doc => (
                      <div 
                        key={doc.id} 
                        onClick={() => onViewDoc(doc)}
                        className="bg-white p-2 rounded border border-emerald-150 hover:bg-emerald-100/50 cursor-pointer transition-colors text-xs flex items-center justify-between"
                      >
                        <div>
                          <strong className="text-slate-800">{doc.code}</strong> - {doc.name}
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1 py-0.2 rounded">
                          {doc.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Right Column: Interactive AI Wissdom Chat Helper Assistant (5/12 width) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[640px] sticky top-4">
            
            {/* Chatbot Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-orange-500 rounded-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xs md:text-sm">Trợ lý Hỏi Đáp Tri Thức (LLM)</h3>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                    <span>Hệ cơ sỡ dữ liệu sên DID, ắc quy khô TERASU online</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                v2.4
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50" id="chat-messages-scroll">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex flex-col max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-slate-800 text-white rounded-br-none' 
                      : 'bg-white text-slate-800 border border-slate-100 shadow-xs rounded-bl-none'
                  }`}>
                    {/* Render message line breaks cleanly */}
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Citations block */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                        <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Tư liệu nguồn:</span>
                        {msg.citations.map((cit, cid) => (
                          <div 
                            key={cid}
                            onClick={() => {
                              const found = INITIAL_DOCUMENTS.find(d => d.code === cit.code);
                              if (found) onViewDoc(found);
                            }}
                            className="text-[10px] text-orange-600 hover:underline font-semibold cursor-pointer flex items-center gap-1"
                          >
                            <CornerDownRight className="w-3 h-3 text-slate-400" />
                            {cit.code} - {cit.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">
                    {msg.sender === 'user' ? 'Bạn' : 'Smart Expert AI'}
                  </span>
                </div>
              ))}
            </div>

            {/* Recommended Questions to Ask AI */}
            <div className="p-3 bg-slate-50 border-t border-slate-150">
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Gợi ý câu hỏi nhanh:</div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Bảo hành ắc quy xe Lead thế nào?',
                  'Mã HS Code nhông xe Wave?',
                  'Điều kiện mở đại lý phân phối?',
                  'Chính sách xích sỉ DID tháng 6?'
                ].map((qLabel, qid) => (
                  <button
                    key={qid}
                    onClick={() => {
                      setChatInput(qLabel);
                    }}
                    className="text-[10px] bg-white hover:bg-orange-50 text-slate-600 hover:text-orange-700 font-medium px-2 py-1 rounded-sm border border-slate-200 hover:border-orange-300 transition-colors"
                  >
                    {qLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleChatSend} className="p-3 border-t border-slate-100 bg-white flex gap-2">
              <input
                type="text"
                placeholder="Hỏi về cách lắp sên xe, CO/CQ, quy trình mua Trung Quốc..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 border border-slate-200 focus:border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Hỏi</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        </div>

      </div>

    </div>
  );
}
