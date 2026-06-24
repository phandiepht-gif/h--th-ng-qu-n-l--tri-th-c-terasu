/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Role, SystemAccount } from '../types';
import { INITIAL_ACCOUNTS } from '../data/mockData';
import { 
  Key, Calendar, DollarSign, User, ShieldAlert, Plus, 
  Eye, EyeOff, Search, Trash2, CheckCircle2, AlertTriangle, Info, ShieldCheck, X
} from 'lucide-react';

interface AccountManagerProps {
  currentRole: Role;
}

export function AccountManager({ currentRole }: AccountManagerProps) {
  const [accounts, setAccounts] = useState<SystemAccount[]>(INITIAL_ACCOUNTS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create state to toggle mask passwords/secrets
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  // Add Account form states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [platform, setPlatform] = useState<SystemAccount['platform']>('Facebook');
  const [serviceName, setServiceName] = useState('');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [manager, setManager] = useState('');
  const [renewalDate, setRenewalDate] = useState('2026-12-01');
  const [cost, setCost] = useState('1500000');
  const [notes, setNotes] = useState('');

  // Check role eligibility to view system accounts list
  const isAuthorized = currentRole === 'CEO' || currentRole === 'DIRECTOR' || currentRole === 'HEAD';

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const handleToggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !username.trim()) {
      alert('Vui lòng điền đầy đủ tên dịch vụ và thông tin tài khoản!');
      return;
    }

    const newAcc: SystemAccount = {
      id: `acc-${Date.now()}`,
      platform,
      serviceName: serviceName.trim(),
      url: url.trim() || 'https://google.com',
      username: username.trim(),
      manager: manager.trim() || 'Bộ phận kĩ thuật',
      createdAt: new Date().toISOString().split('T')[0],
      renewalDate: platform === 'Facebook' || platform === 'TikTok' ? 'N/A' : renewalDate,
      cost: Number(cost) || 0,
      accessRights: ['CEO', 'DIRECTOR', 'HEAD'],
      notes: notes.trim()
    };

    setAccounts(prev => [newAcc, ...prev]);
    setIsAddOpen(false);
    
    // reset form
    setServiceName('');
    setUrl('');
    setUsername('');
    setNotes('');
    alert('Khởi tạo tài khoản hệ thống dùng chung thành công!');
  };

  const handleDeleteAccount = (id: string) => {
    if (confirm('Bạn chắc chắn muốn xóa tài khoản này bảo mật này?')) {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  // Filtered accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      const q = searchTerm.toLowerCase();
      const matchSearch = acc.serviceName.toLowerCase().includes(q) || 
                          acc.platform.toLowerCase().includes(q) || 
                          acc.manager.toLowerCase().includes(q);
      
      // Strict role matching
      if (currentRole === 'CEO' || currentRole === 'DIRECTOR') return matchSearch;
      
      // Heads of department can only access specific apps unless granted
      return matchSearch && acc.accessRights.includes(currentRole);
    });
  }, [accounts, searchTerm, currentRole]);

  // Total costs aggregation
  const totalMonthlyCost = useMemo(() => {
    return accounts.reduce((acc, current) => {
      // flat rate sum
      return acc + current.cost;
    }, 0);
  }, [accounts]);

  // Security Access denial layout for external portals
  if (!isAuthorized) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-150 text-center max-w-lg mx-auto my-12 shadow-md space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto animate-bounce" />
        <h3 className="text-lg font-black text-slate-800">Cảnh báo: Quyền truy cập bị từ chối 🔒</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Thư mục tối mật **11. TÀI KHOẢN HỆ THỐNG** chỉ được phép quản trị bởi CEO và Trưởng phòng ban. 
          Vai trò hiện tại của bạn (<span className="text-orange-600 font-bold">{currentRole}</span>) không được cấp quyền token đối với cơ sở dữ liệu Facebook page tài khoản, hóa đơn Hosting hay Canva Pro.
        </p>
        <p className="text-[10px] text-slate-400">
          *Hành vi của bạn đã được lưu trữ an toàn trong Nhật ký Hệ thống (Audit Log).*
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="account-vault-module">
      
      {/* 1. Header and quick aggregates */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Key className="w-5 h-5 text-orange-600" />
            <span>Kho Lưu Trữ Tài Khoản & Mật Khẩu Hệ Thông TERASU</span>
          </h2>
          <p className="text-xs text-slate-500">
            Quản trị viên và Trưởng phòng ban cập nhật ngày gia hạn miền, SSL, chi phí phần mềm AMIS, Canva, ChatGPT Plus.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 bg-orange-50 rounded-lg border border-orange-100 shrink-0">
          <div className="text-right">
            <div className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Tổng Ngân sách Công nghệ / Tháng</div>
            <div className="text-sm font-black text-orange-950 font-mono">{formatVND(totalMonthlyCost)}</div>
          </div>
        </div>
      </div>

      {/* 2. Controls and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search input field */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm tài khoản, hosting, Canva..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-300"
          />
        </div>

        {/* Trigger addition button */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-slate-900 border border-slate-900 hover:bg-orange-600 hover:border-orange-600 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Khai báo Tài khoản Sử dụng mới</span>
        </button>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAccounts.map((acc) => {
          const isRevealed = !!revealedIds[acc.id];
          
          // Calculate upcoming renewal indicator
          const isNeverRenewal = acc.renewalDate === 'N/A';
          let renewalColor = 'text-slate-600';
          let isUrgent = false;

          if (!isNeverRenewal) {
            const today = new Date('2026-06-23'); // Standard mock date from prompt metadata
            const rDate = new Date(acc.renewalDate);
            const timeDiff = rDate.getTime() - today.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            if (daysDiff <= 30) {
              renewalColor = 'text-red-650 font-bold bg-red-50 border border-red-200 px-2 rounded';
              isUrgent = true;
            } else if (daysDiff <= 120) {
              renewalColor = 'text-amber-700 bg-amber-50 border border-amber-200 px-2 rounded';
            }
          }

          return (
            <div 
              key={acc.id}
              className="bg-white p-4 rounded-xl border border-slate-150 hover:border-orange-200 shadow-xs relative flex flex-col justify-between space-y-4 group transition-colors"
              id={`acc-card-${acc.id}`}
            >
              <div className="space-y-2.5">
                
                {/* Product indicator header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                    {acc.platform}
                  </span>
                  
                  {acc.cost > 0 && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      Phí: {formatVND(acc.cost)}
                    </span>
                  )}
                </div>

                {/* Subtitle name */}
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{acc.serviceName}</h4>
                  <a 
                    href={acc.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[10px] text-slate-400 hover:text-orange-600 hover:underline truncate block"
                  >
                    {acc.url}
                  </a>
                </div>

                {/* Security password reveal input row */}
                <div className="bg-slate-50 p-2.5 rounded-lg border text-xs space-y-1 font-mono relative">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Tài khoản / Login Token:</span>
                    {isUrgent && <span className="text-red-600 font-bold flex items-center gap-0.5"><AlertTriangle className="w-2.5 h-2.5" /> Sắp hết hạn</span>}
                  </div>
                  <div className="text-slate-800 font-bold truncate">
                    {acc.username}
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-200/50 pt-1 mt-1">
                    <span>Mật khẩu dùng chung:</span>
                    <button 
                      type="button" 
                      onClick={() => handleToggleReveal(acc.id)}
                      className="text-[10px] text-orange-600 hover:underline"
                    >
                      {isRevealed ? 'Ẩn token' : 'Kích xem mật khẩu'}
                    </button>
                  </div>
                  {isRevealed ? (
                    <div className="text-xs text-orange-800 font-bold bg-orange-50 p-1.5 rounded mt-1 border border-orange-100 flex items-center justify-between animate-in fade-in duration-100">
                      <span>TERASU_Pass_Secret#2026</span>
                      <ShieldCheck className="w-4 h-4 text-orange-600" />
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 mt-1 select-none">
                      ••••••••••••••••••••
                    </div>
                  )}
                </div>

                {/* Renewal metadata */}
                <div className="grid grid-cols-2 gap-2 text-[10.5px] border-t border-slate-50 pt-2 text-slate-500">
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase">Gia hạn kế tiếp</span>
                    <strong className={renewalColor}>{acc.renewalDate}</strong>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase">Người chăm lo</span>
                    <strong className="text-slate-700 truncate block">{acc.manager.split(' ')[0]}</strong>
                  </div>
                </div>

                {acc.notes && (
                  <p className="text-[10.5px] text-slate-400 bg-slate-50/50 p-1.5 rounded italic">
                    {acc.notes}
                  </p>
                )}
              </div>

              {/* CEO action deletion */}
              {(currentRole === 'CEO' || currentRole === 'DIRECTOR') && (
                <div className="pt-2 border-t border-slate-50 flex items-center justify-end">
                  <button
                    onClick={() => handleDeleteAccount(acc.id)}
                    className="text-[10px] text-red-500 hover:text-red-700 font-bold flex items-center gap-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Thu hồi tài khoản</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. New Account wizard Overlay Box */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl border animate-in fade-in zoom-in-95 duration-100">
            
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Key className="w-4.5 h-4.5 text-orange-500" />
                <h3 className="font-bold text-xs md:text-sm">Khai báo Tài khoản Hệ thống Sử dụng</h3>
              </div>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="p-5 space-y-3.5">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">Nền tảng</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as SystemAccount['platform'])}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                  >
                    {['Facebook', 'TikTok', 'Youtube', 'Website', 'Hosting', 'Domain', 'Canva', 'ChatGPT', 'Zoom', 'M365', 'Software'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">Chi phí / Kỳ (VND)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="Ví dụ: 1500000"
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Tên Dịch vụ Gọi tên</label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="Ví dụ: Kênh TikTok Đào tạo Kỹ thuật..."
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">URL truy cập</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Tài khoản Đăng nhập / ID</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username hoặc email..."
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">Người quản lý duyệt</label>
                  <input
                    type="text"
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    placeholder="Tên nhân sự..."
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">Ngày gia hạn kế tiếp</label>
                  <input
                    type="date"
                    value={renewalDate}
                    onChange={(e) => setRenewalDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Ghi chú lưu tâm</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ví dụ: Đã gia hạn tự động bằng thẻ tín dụng công ty đợt 1..."
                  rows={2.5}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 hover:bg-slate-100 border rounded-lg"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700"
                >
                  Khai báo lưu trữ
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
