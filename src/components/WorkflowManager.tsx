/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Role, WorkflowConfig, WorkflowTicket } from '../types';
import { WORKFLOWS, INITIAL_TICKETS } from '../data/mockData';
import { 
  ArrowRight, CheckCircle2, Circle, AlertCircle, Plus, 
  Clock, ArrowDown, User, Layers, FileSymlink, Sparkles, AlertTriangle, X
} from 'lucide-react';

interface WorkflowManagerProps {
  currentRole: Role;
}

export function WorkflowManager({ currentRole }: WorkflowManagerProps) {
  const [tickets, setTickets] = useState<WorkflowTicket[]>(INITIAL_TICKETS);
  const [activeWorkflowId, setActiveWorkflowId] = useState<'purchase' | 'warranty'>('purchase');
  const [selectedTicketId, setSelectedTicketId] = useState<string>('t-1');
  
  // New ticket state form
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newTicketName, setNewTicketName] = useState('');
  const [customFieldValue1, setCustomFieldValue1] = useState('Đại lý TERASU Đà Nẵng');
  const [customFieldValue2, setCustomFieldValue2] = useState('Sên vàng DID 428HD nhông sâm');

  const activeWorkflow = useMemo(() => {
    return WORKFLOWS.find(w => w.id === activeWorkflowId)!;
  }, [activeWorkflowId]);

  const activeTicket = useMemo(() => {
    return tickets.find(t => t.id === selectedTicketId && t.workflowId === activeWorkflowId);
  }, [tickets, selectedTicketId, activeWorkflowId]);

  // If active ticket is null (e.g. workflow switched), auto-select first of that workflow
  React.useEffect(() => {
    const firstOfWorkflow = tickets.find(t => t.workflowId === activeWorkflowId);
    if (firstOfWorkflow) {
      setSelectedTicketId(firstOfWorkflow.id);
    }
  }, [activeWorkflowId, tickets.length]);

  const handleNextStage = () => {
    if (!activeTicket) return;
    
    const currentStages = activeWorkflow.stages;
    const currentIndex = currentStages.findIndex(s => s.id === activeTicket.currentStage);
    
    if (currentIndex === -1 || currentIndex === currentStages.length - 1) {
      alert('Vụ việc đã hoàn tất toàn bộ quy trình và đóng hồ sơ sổ xanh!');
      return;
    }

    const nextStageNode = currentStages[currentIndex + 1];
    
    // Update ticket state
    const updatedTickets = tickets.map(t => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          currentStage: nextStageNode.id,
          updatedAt: new Date().toISOString().split('T')[0],
          history: [
            ...t.history,
            {
              stage: nextStageNode.id,
              actor: `Bộ phận vận hành (${currentRole})`,
              action: `Phê duyệt chuyển bước sang: ${nextStageNode.name}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              note: `Đã xác minh đầy đủ các chứng từ mộc đỏ quy định của bước trước.`
            }
          ]
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    alert(`Phê duyệt chuyển bước quy trình thành công! Tiến trình: ${nextStageNode.name}`);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketName.trim()) return;

    const firstStageId = activeWorkflow.stages[0].id;
    const newT: WorkflowTicket = {
      id: `t-${Date.now()}`,
      workflowId: activeWorkflowId,
      name: newTicketName.trim(),
      currentStage: firstStageId,
      updatedAt: new Date().toISOString().split('T')[0],
      creator: `Tài khoản ${currentRole}`,
      data: activeWorkflowId === 'purchase' ? {
        'Nhà cung cấp': customFieldValue1,
        'Yêu cầu chi tiết': customFieldValue2,
        'Mức độ khẩn': 'Khẩn cấp'
      } : {
        'Khách đại lý': customFieldValue1,
        'Phụ tùng bảo hành': customFieldValue2,
        'Lý do hỏng hóc': 'Tróc trượt mạ xi bên ngoài xích sên'
      },
      history: [
        {
          stage: firstStageId,
          actor: `Tài khoản (${currentRole})`,
          action: 'Khởi tạo hồ sơ vụ việc',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          note: 'Hồ sơ được đính kèm đầy đủ biểu mẫu nghiệp vụ số 01 của TERASU.'
        }
      ]
    };

    setTickets(prev => [newT, ...prev]);
    setSelectedTicketId(newT.id);
    setIsNewTicketOpen(false);
    setNewTicketName('');
    alert('Khởi tạo hồ sơ quy trình SOP mới thành công!');
  };

  return (
    <div className="space-y-6" id="workflow-orchestrator">
      
      {/* Selector of Workflows */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-2">
          {WORKFLOWS.map(w => (
            <button
              key={w.id}
              onClick={() => setActiveWorkflowId(w.id)}
              className={`px-4 py-2 text-xs md:text-sm font-bold border rounded-lg transition-colors cursor-pointer select-none ${
                activeWorkflowId === w.id 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                  : 'bg-white border-slate-200 text-slate-750 hover:bg-slate-50'
              }`}
            >
              Quy trình: {w.id === 'purchase' ? '🛒 Đề nghị mua sỉ' : '🛡️ Bảo hành ắc quy'}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-500 max-w-sm italic text-center sm:text-right">
          {activeWorkflow.description}
        </p>
      </div>

      {/* Pipeline Chart Visualization */}
      <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
            <Layers className="w-4 h-4" />
            <span>MÔ PHỎNG LƯU ĐỒ SƠ ĐỒ ĐƯỜNG ĐI (FLOWCHART PIPELINE)</span>
          </div>
          <span className="text-[10px] bg-slate-850 px-2 py-0.5 rounded text-indigo-300">SYSTEM AUTHORITATIVE</span>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs pt-2">
          {activeWorkflow.stages.map((stage, idx) => {
            const isActive = activeTicket?.currentStage === stage.id;
            const isCompleted = activeTicket 
              ? activeWorkflow.stages.findIndex(s => s.id === activeTicket.currentStage) > idx
              : false;

            return (
              <React.Fragment key={stage.id}>
                {/* Stage visual card */}
                <div 
                  className={`flex-1 p-3 rounded-xl border transition-all ${
                    isActive 
                      ? 'bg-orange-600 border-orange-500 text-white shadow-md ring-2 ring-orange-500/30 scale-105' 
                      : isCompleted 
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400' 
                        : 'bg-slate-850 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono opacity-85 uppercase font-bold">
                      BƯỚC {idx + 1}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                    )}
                  </div>
                  <h4 className="font-bold truncate text-xs">{stage.name}</h4>
                  <p className="text-[10px] opacity-75 mt-0.5 truncate uppercase">
                    {stage.actor}
                  </p>
                </div>

                {/* Connecting arrow */}
                {idx < activeWorkflow.stages.length - 1 && (
                  <div className="hidden md:flex justify-center items-center text-slate-700">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Linked Documents Information */}
        <div className="bg-slate-850/60 p-3 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <FileSymlink className="w-4 h-4 text-orange-400" />
            <span>Tự động liên thông tài liệu quy phạm:</span>
            <div className="flex gap-1.5">
              {activeWorkflow.documentsRequired.map(req => (
                <span key={req} className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono text-indigo-300">
                  {req}
                </span>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-slate-500 italic">
            *Tiến hành chuyển bước sẽ ghi nhận dữ liệu vào bảng mộc đỏ tự động.*
          </p>
        </div>
      </div>

      {/* Grid: Tickets List vs. Active Ticket Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left list of active documents / cases (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-800 text-xs md:text-sm">
              Hồ sơ Vụ việc Đang mở ({tickets.filter(t => t.workflowId === activeWorkflowId).length})
            </h3>
            <button
              onClick={() => setIsNewTicketOpen(true)}
              className="text-xs text-orange-600 hover:underline font-bold flex items-center gap-0.5"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm mới
            </button>
          </div>

          <div className="space-y-2">
            {tickets.filter(t => t.workflowId === activeWorkflowId).map(t => {
              const isSelected = selectedTicketId === t.id;
              const currentStageName = activeWorkflow.stages.find(s => s.id === t.currentStage)?.name || 'Không xác định';

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-orange-500 bg-orange-50/30' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                    <span>CASE: {t.id}</span>
                    <span>{t.updatedAt}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">{t.name}</h4>
                  
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                      Khởi tạo: {t.creator.split(' ')[0]}
                    </span>
                    <span className="text-orange-700 font-semibold bg-orange-50 px-1 rounded">
                      ☞ {currentStageName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Ticket Actions Board (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-5">
          {activeTicket ? (
            <div className="space-y-5">
              
              {/* Ticket Title Header */}
              <div className="flex items-start justify-between border-b pb-3 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    MÃ TIẾN TRÌNH: {activeTicket.id}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm md:text-base">
                    {activeTicket.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Người đệ trình ban đầu: <strong className="text-slate-700">{activeTicket.creator}</strong> - Cập nhật sau cùng: <strong>{activeTicket.updatedAt}</strong>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Trạng thái hiện thời</div>
                  <span className="text-xs bg-orange-600 text-white font-bold px-2.5 py-1 rounded inline-block mt-1">
                    {activeWorkflow.stages.find(s => s.id === activeTicket.currentStage)?.name}
                  </span>
                </div>
              </div>

              {/* Data Variables Fields summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thông số Nghiệp vụ Lưu trữ:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(activeTicket.data).map(([key, value]) => (
                    <div key={key} className="p-3 border border-slate-150 rounded-lg bg-slate-50">
                      <span className="block text-[10px] text-slate-400 font-medium">{key}:</span>
                      <strong className="text-xs text-slate-800 font-mono">{value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions controller */}
              <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 space-y-3">
                <h4 className="text-xs font-bold text-orange-950 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-orange-650" />
                  <span>Cửa sổ Điều hướng & Kiểm soát Tác vụ</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Trực ban có thể kiểm tra chéo các chứng từ biên nhận đính kèm của bước hiện tại, đối chiếu phiếu kiểm kho QC. Khi hoàn thiện các tiêu chuẩn kĩ thuật, nhấn nút phê chuẩn để đẩy CASE sang giai đoạn xử lý kế tiếp:
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={handleNextStage}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Duyệt & Chuyển bước tiếp theo</span>
                  </button>
                  <button
                    onClick={() => alert('Thao tác yêu cầu bổ sung chứng từ đã được ghi nhận. Hệ thống đã gửi tin nhắn Telegram tới bên phụ trách.')}
                    className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    Yêu cầu bổ sung tài liệu
                  </button>
                </div>
              </div>

              {/* History trail and auditing log */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Lịch trình & Lịch sử Phê duyệt Ký số</span>
                </h4>

                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {activeTicket.history.map((h, hi) => (
                    <div key={hi} className="flex gap-3 relative z-10 text-xs">
                      <div className="w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center shrink-0 font-bold border-2 border-white shadow-xs">
                        {hi + 1}
                      </div>
                      <div className="bg-slate-50 border border-slate-150 p-3 rounded-lg flex-1 space-y-1">
                        <div className="flex flex-wrap justify-between items-center text-[10px] text-slate-400">
                          <span className="font-bold text-slate-600">{h.actor}</span>
                          <span>{h.timestamp}</span>
                        </div>
                        <p className="font-bold text-slate-800">{h.action}</p>
                        {h.note && <p className="text-[11px] text-slate-500 italic">Ghi chú: {h.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <AlertCircle className="w-10 h-10 mx-auto mb-2 text-slate-350" />
              <span>Không tìm thấy thông tin vụ việc hợp chuẩn</span>
            </div>
          )}
        </div>

      </div>

      {/* New Ticket Wizard Box */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl border animate-in fade-in zoom-in-95 duration-100">
            
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Plus className="w-4.5 h-4.5 text-orange-500" />
                <h3 className="font-bold text-xs md:text-sm">Mở Hồ sơ Vụ việc / Quy trình mới</h3>
              </div>
              <button onClick={() => setIsNewTicketOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-5 space-y-3.5 text-xs">
              
              <div>
                <label className="text-[10px] font-bold text-slate-705 block mb-1">Tên Vụ Việc (Tiêu Đề Hồ Sơ Quy Trình)</label>
                <input
                  type="text"
                  value={newTicketName}
                  onChange={(e) => setNewTicketName(e.target.value)}
                  placeholder="Ví dụ: Đặt linh kiện sên DID vàng của hãng..."
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                  required
                />
              </div>

              {activeWorkflowId === 'purchase' ? (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-slate-705 block mb-1">Tên Nhà Cung Cấp</label>
                    <input
                      type="text"
                      value={customFieldValue1}
                      onChange={(e) => setCustomFieldValue1(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-705 block mb-1">Hàng mua sỉ phụ tùng chi tiết</label>
                    <input
                      type="text"
                      value={customFieldValue2}
                      onChange={(e) => setCustomFieldValue2(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-slate-705 block mb-1">Khách hàng đại lý ký nhận</label>
                    <input
                      type="text"
                      value={customFieldValue1}
                      onChange={(e) => setCustomFieldValue1(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-705 block mb-1">Phụ tùng yêu cầu bảo hành</label>
                    <input
                      type="text"
                      value={customFieldValue2}
                      onChange={(e) => setCustomFieldValue2(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                      required
                    />
                  </div>
                </>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="px-4 py-2 hover:bg-slate-100 border rounded-lg"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Mở hồ sơ vụ việc
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
