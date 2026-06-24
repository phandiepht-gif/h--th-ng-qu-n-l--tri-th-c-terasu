/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Role } from '../types';
import { Shield, User, Users, Briefcase, Award, Globe, HelpCircle } from 'lucide-react';

interface RoleSelectorProps {
  currentRole: Role;
  onChangeRole: (role: Role) => void;
}

export function RoleSelector({ currentRole, onChangeRole }: RoleSelectorProps) {
  const rolesInfo = [
    {
      id: 'SUPER_ADMIN' as Role,
      name: 'SUPER ADMIN (Hệ thống tối cao)',
      description: 'Quyền quản trị lõi hệ thống: Quản lý người dùng, email, phân quyền thư mục/tài liệu, cấu hình bảo mật, quản lý sao lưu (Backup) & khôi phục (Restore). Không thể sửa đổi quyền của CEO.',
      icon: Shield,
      color: 'border-red-600 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400',
      badge: 'Admin Core'
    },
    {
      id: 'CEO' as Role,
      name: 'CEO (Giám đốc điều hành)',
      description: 'Quyền hạn tối cao (100%). Toàn quyền xem, phê chuẩn, điều phối tất cả phòng ban, quy trình và quản trị tài khoản tối mật.',
      icon: Award,
      color: 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400',
      badge: 'Toàn Quyền'
    },
    {
      id: 'DIRECTOR' as Role,
      name: 'Ban Giám đốc (C-Level)',
      description: 'Xem báo cáo liên phòng ban, phê duyệt quy chuẩn chất lượng, giám sát KPIs và phân tích chiến lược tổng quát.',
      icon: Shield,
      color: 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400',
      badge: 'Xem & Duyệt'
    },
    {
      id: 'HEAD' as Role,
      name: 'Trưởng phòng (Department Head)',
      description: 'Toàn quyền điều hành trong phòng ban phụ trách (ví dụ: Mua hàng, Kế toán). Không được phép xem lương nội bộ hoặc dự phòng chiến lược của CEO.',
      icon: Users,
      color: 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400',
      badge: 'Độc Lập Dept'
    },
    {
      id: 'EMPLOYEE' as Role,
      name: 'Nhân viên (Vận hành / KTV)',
      description: 'Xem quy trình làm việc SOP, tài liệu đào tạo chuyên môn và thực hiện báo cáo bảo hành, kiểm kê quy định.',
      icon: User,
      color: 'border-slate-500 bg-slate-50 text-slate-700 dark:bg-slate-950/20 dark:text-slate-400',
      badge: 'Quy Trình & SOP'
    },
    {
      id: 'SUPPLIER' as Role,
      name: 'Nhà cung cấp (Supplier Portal)',
      description: 'Cổng thông tin riêng. Chỉ xem bản vẽ kỹ thuật chi tiết duyệt QC, các hợp đồng mua sỉ đã ký kết và biểu mẫu báo giá quy chuẩn.',
      icon: Briefcase,
      color: 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400',
      badge: 'Đối Tác Portal'
    },
    {
      id: 'CUSTOMER' as Role,
      name: 'Khách hàng / Đại lý (Client Portal)',
      description: 'Cổng thông tin đại lý. Chỉ tra cứu thông tin chính sách chiết khấu xích DID, sổ tay hướng dẫn lỗi ắc quy và tải catalogue.',
      icon: Globe,
      color: 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-950/20 dark:text-cyan-400',
      badge: 'Khách Hàng Portal'
    }
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs" id="role-selector-pane">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-slate-800 text-sm md:text-base">Mô phỏng Phân Quyền Vai Trò</h3>
        </div>
        <div className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-mono">
          Hiện tại: <span className="font-bold text-orange-600">{currentRole}</span>
        </div>
      </div>
      
      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
        Hệ thống phân quyền thông minh dựa trên chức danh sẽ tự động giới hạn quyền xem cây thư mục, bảo mật tài khoản dùng chung, danh mục HS code và cấu hình duyệt quy trình phê duyệt (SOP). Hãy thử chuyển đổi vai trò dưới đây để thấy sự khác biệt:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rolesInfo.map((role) => {
          const IconComponent = role.icon;
          const isSelected = currentRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => onChangeRole(role.id)}
              className={`text-left p-3 rounded-lg border transition-all relative flex flex-col justify-between h-32 focus:outline-hidden ${
                isSelected 
                  ? `${role.color} border-2 shadow-sm ring-1 ring-orange-500/20` 
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
              id={`role-btn-${role.id}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-medium text-xs md:text-sm">
                    <IconComponent className="w-4 h-4 text-slate-600" />
                    <span className={isSelected ? 'font-bold' : ''}>{isSelected ? `✓ ${role.name}` : role.name}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm ${
                    isSelected ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {role.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                  {role.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
