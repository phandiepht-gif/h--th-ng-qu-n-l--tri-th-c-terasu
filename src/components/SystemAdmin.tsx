import React, { useState, useMemo } from 'react';
import { Role, AuditLog } from '../types';
import { 
  Shield, Users, Mail, Phone, Building, Briefcase, MapPin, 
  KeyRound, Lock, History, Database, CheckSquare, Square, 
  Save, Plus, Trash2, Edit2, Search, Server, ShieldCheck, 
  Cpu, AlertCircle, Terminal, Download, FileCode, CheckCircle2, X
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SystemAdminProps {
  currentRole: Role;
  auditLogs: AuditLog[];
  onAddAuditLog: (action: string, target: string, status: 'Thành công' | 'Thất bại') => void;
}

// Sub-tabs in System Admin
type AdminTab = 
  | 'dashboard'
  | 'users'
  | 'emails'
  | 'phones'
  | 'departments'
  | 'positions'
  | 'branches'
  | 'roles'
  | 'permissions'
  | 'logins'
  | 'audit'
  | 'security'
  | 'schema'
  | 'backup';

// 1. Initial Mock Databases
const INITIAL_USERS = [
  { id: 'usr-1', fullname: 'Nguyễn Văn Terasu', email: 'terasu.ceo@terasu.vn', phone: '0901234567', department: 'Ban Giám Đốc', position: 'CEO', branch: 'Trụ sở Hà Nội', role: 'CEO', status: 'Active' },
  { id: 'usr-2', fullname: 'Trần Minh Quang', email: 'quang.tm@terasu.vn', phone: '0912345678', department: 'Phòng Mua Hàng', position: 'Trưởng phòng Purchase', branch: 'Trụ sở Hà Nội', role: 'HEAD', status: 'Active' },
  { id: 'usr-3', fullname: 'Vũ Nam Khánh', email: 'khanh.vn@terasu.vn', phone: '0983456789', department: 'Phòng Hiệu Suất & KPI', position: 'Giám đốc Nhân sự & Hiệu suất', branch: 'Chi nhánh TP.HCM', role: 'DIRECTOR', status: 'Active' },
  { id: 'usr-4', fullname: 'Lê Thợ Máy', email: 'lethomay@terasu.vn', phone: '0944567890', department: 'Dịch vụ Sửa chữa', position: 'Trưởng bộ phận kỹ thuật', branch: 'Nhà xưởng Bình Dương', role: 'EMPLOYEE', status: 'Active' },
  { id: 'usr-5', fullname: 'Phạm Thanh Hà', email: 'ha.pt@terasu.vn', phone: '0965678901', department: 'Tài chính Kế toán', position: 'Kế toán trưởng', branch: 'Trụ sở Hà Nội', role: 'HEAD', status: 'Active' },
  { id: 'usr-6', fullname: 'Nguyễn Thị Kho', email: 'kho.nt@terasu.vn', phone: '0976789012', department: 'Kho vận & Giao nhận', position: 'Thủ kho tổng', branch: 'Văn phòng Đà Nẵng', role: 'EMPLOYEE', status: 'Suspended' }
];

const INITIAL_EMAILS = [
  { id: 'em-1', email: 'terasu.ceo@terasu.vn', userId: 'usr-1', type: 'Primary', isVerified: true, alias: 'ceo@terasu.vn' },
  { id: 'em-2', email: 'quang.tm@terasu.vn', userId: 'usr-2', type: 'Primary', isVerified: true, alias: 'purchase@terasu.vn' },
  { id: 'em-3', email: 'khanh.vn@terasu.vn', userId: 'usr-3', type: 'Primary', isVerified: true, alias: 'hr.manager@terasu.vn' },
  { id: 'em-4', email: 'lethomay@terasu.vn', userId: 'usr-4', type: 'Primary', isVerified: true, alias: 'service@terasu.vn' },
  { id: 'em-5', email: 'ha.pt@terasu.vn', userId: 'usr-5', type: 'Primary', isVerified: true, alias: 'accounting@terasu.vn' },
  { id: 'em-6', email: 'kho.nt@terasu.vn', userId: 'usr-6', type: 'Primary', isVerified: false, alias: 'warehouse@terasu.vn' }
];

const INITIAL_PHONES = [
  { id: 'ph-1', phoneNumber: '0901234567', userId: 'usr-1', usage: 'Cá nhân & SMS OTP', isVerified: true },
  { id: 'ph-2', phoneNumber: '0912345678', userId: 'usr-2', usage: 'Công việc', isVerified: true },
  { id: 'ph-3', phoneNumber: '0983456789', userId: 'usr-3', usage: 'Cá nhân & SMS OTP', isVerified: true },
  { id: 'ph-4', phoneNumber: '0944567890', userId: 'usr-4', usage: 'Công việc', isVerified: true },
  { id: 'ph-5', phoneNumber: '0965678901', userId: 'usr-5', usage: 'SMS OTP bảo mật', isVerified: true },
  { id: 'ph-6', phoneNumber: '0976789012', userId: 'usr-6', usage: 'Chưa kích hoạt OTP', isVerified: false }
];

const INITIAL_DEPARTMENTS = [
  { code: 'BGD', name: 'Ban Giám Đốc', head: 'Nguyễn Văn Terasu', count: 3, location: 'Tầng 5, HN' },
  { code: 'MH', name: 'Phòng Mua Hàng', head: 'Trần Minh Quang', count: 8, location: 'Tầng 3, HN' },
  { code: 'HS_KPI', name: 'Phòng Hiệu Suất & KPI', head: 'Vũ Nam Khánh', count: 6, location: 'Tầng 4, HCM' },
  { code: 'KT', name: 'Tài chính Kế toán', head: 'Phạm Thanh Hà', count: 4, location: 'Tầng 2, HN' },
  { code: 'KHO', name: 'Kho vận & Giao nhận', head: 'Nguyễn Văn Terasu (Kiêm)', count: 15, location: 'Kho tổng Q9, HCM' },
  { code: 'SC', name: 'Dịch vụ Sửa chữa', head: 'Lê Thợ Máy', count: 22, location: 'Trạm Bình Dương' }
];

const INITIAL_POSITIONS = [
  { code: 'CEO', title: 'CEO (Giám đốc Điều hành)', grade: 'Mức 10', salaryCoef: 8.5, activeUsers: 1 },
  { code: 'DIR', title: 'DIRECTOR (Giám đốc Khối)', grade: 'Mức 8', salaryCoef: 6.0, activeUsers: 2 },
  { code: 'HEAD', title: 'HEAD (Trưởng bộ phận)', grade: 'Mức 6', salaryCoef: 4.5, activeUsers: 5 },
  { code: 'EMP', title: 'EMPLOYEE (Chuyên viên)', grade: 'Mức 3', salaryCoef: 2.5, activeUsers: 45 }
];

const INITIAL_BRANCHES = [
  { code: 'CN-HN', name: 'Trụ sở Hà Nội', address: 'Số 12A Hai Bà Trưng, Hoàn Kiếm, HN', manager: 'Nguyễn Văn Terasu', status: 'Hoạt động' },
  { code: 'CN-HCM', name: 'Chi nhánh TP.HCM', address: 'Số 450 Nguyễn Thị Minh Khai, Q3, HCM', manager: 'Vũ Nam Khánh', status: 'Hoạt động' },
  { code: 'CN-DN', name: 'Văn phòng Đà Nẵng', address: 'Số 88 Nguyễn Văn Linh, Hải Châu, ĐN', manager: 'Trần Minh Quang (Kiêm)', status: 'Hoạt động' },
  { code: 'CN-BD', name: 'Nhà xưởng Bình Dương', address: 'Đại lộ Bình Dương, Thuận An, BD', manager: 'Lê Thợ Máy', status: 'Hoạt động' }
];

const INITIAL_ROLES = [
  { code: 'CEO', name: 'CEO Nguyễn Văn Terasu', desc: 'Quyền tối cao toàn hệ thống, có thể xem và duyệt mọi dữ liệu tài chính, nhân sự, quy trình.' },
  { code: 'DIRECTOR', name: 'DIRECTOR (Giám đốc Khối)', desc: 'Quyền quản lý khối vận hành, xem báo cáo tổng thể, duyệt SOP và định hướng phòng ban.' },
  { code: 'HEAD', name: 'HEAD (Trưởng phòng)', desc: 'Quản trị và xây dựng tài liệu SOP chuyên trách cho một hoặc nhiều phòng ban được phân bổ.' },
  { code: 'EMPLOYEE', name: 'EMPLOYEE (Nhân sự)', desc: 'Nhân viên thực thi, chỉ xem tài liệu được ban hành và tham gia đào tạo kiểm tra năng lực.' },
  { code: 'CUSTOMER', name: 'CUSTOMER (Khách hàng)', desc: 'Tài khoản khách mời tra cứu biểu mẫu công khai và gửi khiếu nại bảo hành trực tuyến.' },
  { code: 'SUPPLIER', name: 'SUPPLIER (Nhà cung cấp)', desc: 'Truy cập tài liệu kỹ thuật, gửi hồ sơ kiểm định chất lượng và CO Form E xuất nhập khẩu.' }
];

// Permission Matrix (Role vs Area Permissions)
const INITIAL_PERMISSION_ROLES: Record<string, string[]> = {
  CEO: ['READ_ALL', 'WRITE_ALL', 'APPROVE_ALL', 'DELETE_ALL', 'MANAGE_SYSTEM', 'DOWNLOAD_REPORT'],
  DIRECTOR: ['READ_ALL', 'WRITE_DEPT', 'APPROVE_DEPT', 'DOWNLOAD_REPORT'],
  HEAD: ['READ_DEPT', 'WRITE_DEPT', 'APPROVE_FORM'],
  EMPLOYEE: ['READ_ASSIGNED', 'QUIZ_TAKE'],
  CUSTOMER: ['READ_PUBLIC', 'SUBMIT_CLAIM'],
  SUPPLIER: ['READ_SPEC', 'UPLOAD_CO_FORM']
};

const ALL_PERMISSIONS = [
  { code: 'READ_ALL', label: 'Xem tất cả tài liệu', category: 'Tài liệu' },
  { code: 'WRITE_ALL', label: 'Soạn thảo & Sửa tất cả', category: 'Tài liệu' },
  { code: 'APPROVE_ALL', label: 'Phê duyệt toàn hệ thống', category: 'Quy trình' },
  { code: 'DELETE_ALL', label: 'Xóa tài liệu vĩnh viễn', category: 'Bảo mật' },
  { code: 'MANAGE_SYSTEM', label: 'Quản trị người dùng & Phân quyền', category: 'Bảo mật' },
  { code: 'DOWNLOAD_REPORT', label: 'Tải báo cáo tài chính & KPIs', category: 'Báo cáo' },
  { code: 'WRITE_DEPT', label: 'Tạo tài liệu trong phòng ban', category: 'Tài liệu' },
  { code: 'APPROVE_DEPT', label: 'Phê duyệt SOP phòng ban', category: 'Quy trình' },
  { code: 'APPROVE_FORM', label: 'Ký duyệt biểu mẫu nội bộ', category: 'Quy trình' },
  { code: 'READ_DEPT', label: 'Xem tài liệu phòng ban chuyên trách', category: 'Tài liệu' },
  { code: 'READ_ASSIGNED', label: 'Xem quy trình được bàn giao', category: 'Tài liệu' },
  { code: 'QUIZ_TAKE', label: 'Làm bài thi đánh giá năng lực', category: 'Đào tạo' },
  { code: 'READ_PUBLIC', label: 'Xem chính sách công khai', category: 'Tài liệu' },
  { code: 'SUBMIT_CLAIM', label: 'Tạo phiếu khiếu nại bảo hành', category: 'Quy trình' },
  { code: 'READ_SPEC', label: 'Xem thông số kỹ thuật phụ tùng', category: 'Tài liệu' },
  { code: 'UPLOAD_CO_FORM', label: 'Upload chứng nhận xuất xứ CO', category: 'Tài liệu' }
];

const INITIAL_LOGINS = [
  { id: 'log-1', username: 'terasu.ceo@terasu.vn', ip: '113.161.4.12', device: 'Chrome / Windows 11', time: '2026-06-23 09:30:15', location: 'Hà Nội, VN', status: 'Thành công' },
  { id: 'log-2', username: 'quang.tm@terasu.vn', ip: '113.161.4.15', device: 'Safari / macOS Sequoia', time: '2026-06-23 08:10:02', location: 'Hà Nội, VN', status: 'Thành công' },
  { id: 'log-3', username: 'khanh.vn@terasu.vn', ip: '14.161.50.3', device: 'Firefox / Linux Mint', time: '2026-06-23 08:00:44', location: 'TP. Hồ Chí Minh, VN', status: 'Thành công' },
  { id: 'log-4', username: 'lethomay@terasu.vn', ip: '42.113.156.92', device: 'Chrome Mobile / iOS', time: '2026-06-23 07:42:19', location: 'Bình Dương, VN', status: 'Thành công' },
  { id: 'log-5', username: 'unknown.hacker@gmail.com', ip: '103.45.10.111', device: 'Edge / Windows 10', time: '2026-06-23 07:15:00', location: 'Unknown (Proxy)', status: 'Thất bại' }
];

export function SystemAdmin({ currentRole, auditLogs, onAddAuditLog }: SystemAdminProps) {
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('dashboard');
  const [userSubTab, setUserSubTab] = useState<'list' | 'invitations'>('list');

  // Interactive local states (to allow actual edits and additions)
  const [users, setUsers] = useState(INITIAL_USERS);

  // Nạp dữ liệu người dùng thật từ Supabase (bảng profiles)
  React.useEffect(() => {
    async function loadRealUsers() {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) { console.error('Lỗi tải profiles:', error.message); return; }
      if (data && data.length > 0) {
        const mapped = data.map((p: any) => ({
          id: p.id,
          fullname: p.full_name || '(Chưa đặt tên)',
          email: '(Xem trong Supabase Auth)',
          phone: p.phone || '-',
          department: p.department || '-',
          position: p.role || '-',
          branch: '-',
          role: p.role || 'EMPLOYEE',
          status: p.is_active ? 'Active' : 'Suspended'
        }));
        setUsers(mapped);
      }
    }
    loadRealUsers();
  }, []);
  const [emails, setEmails] = useState(INITIAL_EMAILS);
  const [phones, setPhones] = useState(INITIAL_PHONES);
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [positions, setPositions] = useState(INITIAL_POSITIONS);
  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [permissionRoles, setPermissionRoles] = useState<Record<string, string[]>>(INITIAL_PERMISSION_ROLES);
  const [loginLogs, setLoginLogs] = useState(INITIAL_LOGINS);
  
  // Security Policies State
  const [securityConfig, setSecurityConfig] = useState({
    minPasswordLength: 8,
    requireSpecialChar: true,
    requireNumbers: true,
    requireUppercase: true,
    enforce2FA: true,
    sessionTimeoutMins: 30,
    whitelistedIPs: ['113.161.4.12', '14.161.50.3', '42.113.156.92']
  });

  // Query Console state
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM tbl_users WHERE status = \'Active\';');
  const [sqlResult, setSqlResult] = useState<any[] | null>(INITIAL_USERS);
  const [sqlColumns, setSqlColumns] = useState<string[]>(Object.keys(INITIAL_USERS[0]));
  const [sqlStatus, setSqlStatus] = useState<string>('Hệ thống sẵn sàng. Nhấn nút Run Query để mô phỏng thực thi trên Database.');

  // Email invitations and User Activation Workflow state
  const [invitations, setInvitations] = useState([
    { id: 'inv-1', email: 'vuducmanh@terasu.vn', role: 'EMPLOYEE' as Role, department: 'Kho vận & Giao nhận', branch: 'Nhà xưởng Bình Dương', expiresAt: '2026-06-24 15:30', status: 'Pending' },
    { id: 'inv-2', email: 'tranlananh@terasu.vn', role: 'HEAD' as Role, department: 'Tài chính Kế toán', branch: 'Trụ sở Hà Nội', expiresAt: '2026-06-25 10:15', status: 'Pending' },
    { id: 'inv-3', email: 'nguyencao@terasu.vn', role: 'DIRECTOR' as Role, department: 'Ban Giám Đốc', branch: 'Trụ sở Hà Nội', expiresAt: '2026-06-22 18:00', status: 'Expired' }
  ]);
  const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('EMPLOYEE');
  const [inviteDept, setInviteDept] = useState('HCNS');
  const [inviteBranch, setInviteBranch] = useState('Trụ sở Hà Nội');
  const [inviteExpires, setInviteExpires] = useState('24h');

  // Branch Access Permissions state
  const [branchPermissions, setBranchPermissions] = useState<Record<string, Role[]>>({
    'Trụ sở Hà Nội': ['SUPER_ADMIN', 'CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE', 'CUSTOMER', 'SUPPLIER'],
    'Chi nhánh TP.HCM': ['SUPER_ADMIN', 'CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE'],
    'Văn phòng Đà Nẵng': ['SUPER_ADMIN', 'CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE'],
    'Nhà xưởng Bình Dương': ['SUPER_ADMIN', 'CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE', 'SUPPLIER']
  });

  // System Database Backups and Restore
  const [backups, setBackups] = useState([
    { id: 'bk-1', name: 'Backup_ERP_Core_20260623_0800.sql', size: '42.5 MB', type: 'Full Database', createdAt: '2026-06-23 08:00:00', createdBy: 'SUPER_ADMIN' },
    { id: 'bk-2', name: 'Backup_ERP_Wiki_20260622_1200.sql', size: '11.8 MB', type: 'Wiki Metadata', createdAt: '2026-06-22 12:00:00', createdBy: 'SUPER_ADMIN' },
    { id: 'bk-3', name: 'Backup_Assets_20260620_0400.sql', size: '185.2 MB', type: 'Media Files', createdAt: '2026-06-20 04:00:00', createdBy: 'CEO' }
  ]);

  // Deleted records (Trash Bin) for Super Admin recovery
  const [deletedDocs, setDeletedDocs] = useState([
    { id: 'del-1', code: 'TRS-KT-OFF-01', name: 'Báo cáo chi phí ngoài luồng của đại lý phía Bắc năm 2025', type: 'Tài liệu Kế toán', department: 'Tài chính Kế toán', deletedAt: '2026-06-22 17:15', deletedBy: 'Phạm Thanh Hà' },
    { id: 'del-2', code: 'TRS-SOP-HR-99', name: 'Quy chế sa thải nhân sự tự ý nghỉ không phép', type: 'SOP/Quy trình', department: 'Phòng Hiệu Suất & KPI', deletedAt: '2026-06-21 11:30', deletedBy: 'Vũ Nam Khánh' }
  ]);

  // Global search filters
  const [searchTerm, setSearchTerm] = useState('');

  // Modals / Input states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    fullname: '', email: '', phone: '', department: 'Ban Giám Đốc', position: 'Chuyên viên', branch: 'Trụ sở Hà Nội', role: 'EMPLOYEE' as Role
  });

  const [isAddEmailOpen, setIsAddEmailOpen] = useState(false);
  const [newEmail, setNewEmail] = useState({ email: '', userId: 'usr-1', type: 'Secondary', isVerified: true, alias: '' });

  const [isAddPhoneOpen, setIsAddPhoneOpen] = useState(false);
  const [newPhone, setNewPhone] = useState({ phoneNumber: '', userId: 'usr-1', usage: 'Công việc', isVerified: true });

  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [newDept, setNewDept] = useState({ code: '', name: '', head: '', count: 1, location: '' });

  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [newBranch, setNewBranch] = useState({ code: '', name: '', address: '', manager: '', status: 'Hoạt động' });

  const [isAddIPOpen, setIsAddIPOpen] = useState(false);
  const [newIP, setNewIP] = useState('');

  // 12. Security Key Credentials Import (Document Upload simulator)
  const [uploadedConfigName, setUploadedConfigName] = useState<string | null>(null);
  const [isUploadingConfig, setIsUploadingConfig] = useState(false);

  // Check if current user is Authorized (SUPER_ADMIN, CEO or DIRECTOR)
  const isAuthorized = currentRole === 'SUPER_ADMIN' || currentRole === 'CEO' || currentRole === 'DIRECTOR';

  // Stats calculation
  const stats = useMemo(() => {
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'Active').length,
      totalEmails: emails.length,
      verifiedEmails: emails.filter(e => e.isVerified).length,
      totalPhones: phones.length,
      verifiedPhones: phones.filter(p => p.isVerified).length,
      totalDepartments: departments.length,
      totalBranches: branches.length,
      activeLoginsToday: loginLogs.filter(l => l.status === 'Thành công').length,
      failedLoginsToday: loginLogs.filter(l => l.status === 'Thất bại').length,
      securityScore: securityConfig.enforce2FA && securityConfig.minPasswordLength >= 8 ? 'A+' : 'B'
    };
  }, [users, emails, phones, departments, branches, loginLogs, securityConfig]);

  // --- ACTIONS ---
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.fullname.trim() || !newUser.email.trim() || !newUser.phone.trim()) {
      alert('Vui lòng điền đủ Họ tên, Email và Số điện thoại!');
      return;
    }

    const nextId = `usr-${users.length + 1}`;
    const createdUser = {
      id: nextId,
      fullname: newUser.fullname.trim(),
      email: newUser.email.trim(),
      phone: newUser.phone.trim(),
      department: newUser.department,
      position: newUser.position,
      branch: newUser.branch,
      role: newUser.role,
      status: 'Active'
    };

    // Auto update linked lists to simulate relational database
    setUsers(prev => [...prev, createdUser]);
    
    setEmails(prev => [...prev, {
      id: `em-${emails.length + 1}`,
      email: createdUser.email,
      userId: nextId,
      type: 'Primary',
      isVerified: true,
      alias: `${createdUser.email.split('@')[0]}.alias@terasu.vn`
    }]);

    setPhones(prev => [...prev, {
      id: `ph-${phones.length + 1}`,
      phoneNumber: createdUser.phone,
      userId: nextId,
      usage: 'Cá nhân & SMS OTP',
      isVerified: true
    }]);

    setIsAddUserOpen(false);
    onAddAuditLog('Tạo mới Người dùng', `Tên: ${createdUser.fullname} (ID: ${nextId})`, 'Thành công');
    
    // Reset form
    setNewUser({
      fullname: '', email: '', phone: '', department: 'Ban Giám Đốc', position: 'Chuyên viên', branch: 'Trụ sở Hà Nội', role: 'EMPLOYEE'
    });
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa vĩnh viễn người dùng ${name} (ID: ${id}) khỏi hệ thống? Dữ liệu liên kết email/số điện thoại cũng sẽ bị loại bỏ!`)) {
      setUsers(prev => prev.filter(u => u.id !== id));
      setEmails(prev => prev.filter(e => e.userId !== id));
      setPhones(prev => prev.filter(p => p.userId !== id));
      onAddAuditLog('Xóa Người dùng', `Tên: ${name} (ID: ${id})`, 'Thành công');
    }
  };

  const handleToggleUserStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    onAddAuditLog('Cập nhật trạng thái', `Đổi trạng thái người dùng ID ${id} sang ${newStatus}`, 'Thành công');
  };

  const handleAddEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.email.trim()) return;
    const nextId = `em-${emails.length + 1}`;
    setEmails(prev => [...prev, {
      id: nextId,
      email: newEmail.email.trim(),
      userId: newEmail.userId,
      type: newEmail.type,
      isVerified: newEmail.isVerified,
      alias: newEmail.alias.trim() || undefined
    }]);
    setIsAddEmailOpen(false);
    onAddAuditLog('Thêm Email liên kết', `Email: ${newEmail.email} cho User ID: ${newEmail.userId}`, 'Thành công');
  };

  const handleAddPhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhone.phoneNumber.trim()) return;
    const nextId = `ph-${phones.length + 1}`;
    setPhones(prev => [...prev, {
      id: nextId,
      phoneNumber: newPhone.phoneNumber.trim(),
      userId: newPhone.userId,
      usage: newPhone.usage,
      isVerified: newPhone.isVerified
    }]);
    setIsAddPhoneOpen(false);
    onAddAuditLog('Thêm SĐT liên kết', `SĐT: ${newPhone.phoneNumber} cho User ID: ${newPhone.userId}`, 'Thành công');
  };

  const handleAddDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.code.trim() || !newDept.name.trim()) return;
    setDepartments(prev => [...prev, {
      code: newDept.code.toUpperCase().trim(),
      name: newDept.name.trim(),
      head: newDept.head.trim() || 'Chưa phân bổ',
      count: Number(newDept.count) || 1,
      location: newDept.location.trim() || 'Tòa nhà Terasu'
    }]);
    setIsAddDeptOpen(false);
    onAddAuditLog('Khởi tạo Phòng ban', `Mã: ${newDept.code.toUpperCase()}`, 'Thành công');
  };

  const handleAddBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.code.trim() || !newBranch.name.trim()) return;
    setBranches(prev => [...prev, {
      code: newBranch.code.toUpperCase().trim(),
      name: newBranch.name.trim(),
      address: newBranch.address.trim(),
      manager: newBranch.manager.trim() || 'Chưa bổ nhiệm',
      status: newBranch.status
    }]);
    setIsAddBranchOpen(false);
    onAddAuditLog('Mở rộng Chi nhánh', `Mã: ${newBranch.code.toUpperCase()}`, 'Thành công');
  };

  const handlePermissionToggle = (roleCode: string, permissionCode: string) => {
    setPermissionRoles(prev => {
      const currentPerms = prev[roleCode] || [];
      const updated = currentPerms.includes(permissionCode)
        ? currentPerms.filter(p => p !== permissionCode)
        : [...currentPerms, permissionCode];
      return {
        ...prev,
        [roleCode]: updated
      };
    });
  };

  const handleSavePermissions = () => {
    onAddAuditLog('Lưu cấu hình phân quyền', `Cập nhật ma trận Permission Matrix cho ${Object.keys(permissionRoles).length} nhóm vai trò`, 'Thành công');
    alert('Đã lưu cấu hình ma trận phân quyền (Permission Matrix) của hệ thống TERASU thành công!');
  };

  const handleAddIPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIP.trim()) return;
    setSecurityConfig(prev => ({
      ...prev,
      whitelistedIPs: [...prev.whitelistedIPs, newIP.trim()]
    }));
    onAddAuditLog('Thêm IP Whitelist', `IP: ${newIP.trim()}`, 'Thành công');
    setNewIP('');
    setIsAddIPOpen(false);
  };

  const handleRemoveIP = (ip: string) => {
    setSecurityConfig(prev => ({
      ...prev,
      whitelistedIPs: prev.whitelistedIPs.filter(item => item !== ip)
    }));
    onAddAuditLog('Xóa IP Whitelist', `IP: ${ip}`, 'Thành công');
  };

  const handleUploadCredentials = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingConfig(true);
    setTimeout(() => {
      setUploadedConfigName(file.name);
      setIsUploadingConfig(false);
      onAddAuditLog('Upload Chứng chỉ/Chìa khóa bảo mật', `File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, 'Thành công');
      alert(`Đã nạp thành công chứng chỉ bảo mật ${file.name}! Cấu hình mã hóa SSL đã được cập nhật.`);
    }, 1500);
  };

  // --- SQL EXECUTOR SIMULATOR ---
  const handleExecuteSql = () => {
    const query = sqlQuery.trim().toUpperCase();
    onAddAuditLog('Mô phỏng truy vấn SQL', query.substring(0, 100), 'Thành công');

    try {
      if (query.includes('FROM TBL_USERS')) {
        let res = [...users];
        if (query.includes("STATUS = 'ACTIVE'") || query.includes("STATUS = 'Active'")) {
          res = res.filter(u => u.status === 'Active');
        } else if (query.includes("ROLE = 'HEAD'")) {
          res = res.filter(u => u.role === 'HEAD');
        }
        setSqlResult(res);
        setSqlColumns(Object.keys(res[0] || {}));
        setSqlStatus(`Truy vấn thành công! Trả về ${res.length} dòng dữ liệu.`);
      } else if (query.includes('FROM TBL_EMAILS')) {
        setSqlResult(emails);
        setSqlColumns(Object.keys(emails[0] || {}));
        setSqlStatus(`Truy vấn thành công! Trả về ${emails.length} dòng dữ liệu.`);
      } else if (query.includes('FROM TBL_PHONES')) {
        setSqlResult(phones);
        setSqlColumns(Object.keys(phones[0] || {}));
        setSqlStatus(`Truy vấn thành công! Trả về ${phones.length} dòng dữ liệu.`);
      } else if (query.includes('FROM TBL_DEPARTMENTS')) {
        setSqlResult(departments);
        setSqlColumns(Object.keys(departments[0] || {}));
        setSqlStatus(`Truy vấn thành công! Trả về ${departments.length} dòng dữ liệu.`);
      } else if (query.includes('FROM TBL_BRANCHES')) {
        setSqlResult(branches);
        setSqlColumns(Object.keys(branches[0] || {}));
        setSqlStatus(`Truy vấn thành công! Trả về ${branches.length} dòng dữ liệu.`);
      } else if (query.includes('FROM TBL_POSITIONS')) {
        setSqlResult(positions);
        setSqlColumns(Object.keys(positions[0] || {}));
        setSqlStatus(`Truy vấn thành công! Trả về ${positions.length} dòng dữ liệu.`);
      } else if (query.includes('FROM TBL_ROLES')) {
        setSqlResult(roles);
        setSqlColumns(Object.keys(roles[0] || {}));
        setSqlStatus(`Truy vấn thành công! Trả về ${roles.length} dòng dữ liệu.`);
      } else if (query.includes('SELECT * FROM TBL_SECURITY_POLICIES')) {
        const dummyPolicies = [
          { key: 'minPasswordLength', value: securityConfig.minPasswordLength.toString(), type: 'INT' },
          { key: 'requireSpecialChar', value: securityConfig.requireSpecialChar.toString(), type: 'BOOLEAN' },
          { key: 'requireNumbers', value: securityConfig.requireNumbers.toString(), type: 'BOOLEAN' },
          { key: 'enforce2FA', value: securityConfig.enforce2FA.toString(), type: 'BOOLEAN' },
          { key: 'sessionTimeoutMins', value: securityConfig.sessionTimeoutMins.toString(), type: 'INT' },
          { key: 'whitelistedIPCount', value: securityConfig.whitelistedIPs.length.toString(), type: 'INT' }
        ];
        setSqlResult(dummyPolicies);
        setSqlColumns(Object.keys(dummyPolicies[0]));
        setSqlStatus(`Truy vấn thành công! Trả về ${dummyPolicies.length} dòng cấu hình bảo mật.`);
      } else {
        // Fallback dummy output for generic queries
        const randomData = [
          { message: 'Query parsed, syntax verified', database: 'PostgreSQL 16.2 on x86_64-pc-linux-gnu', timestamp: new Date().toISOString() }
        ];
        setSqlResult(randomData);
        setSqlColumns(Object.keys(randomData[0]));
        setSqlStatus('Truy vấn thực thi thành công trên schema ảo hóa (Virtual DB Engine).');
      }
    } catch (err: any) {
      setSqlStatus(`Lỗi cú pháp SQL: ${err.message || 'Không thể biên dịch truy vấn'}`);
      setSqlResult(null);
    }
  };

  // Filter systems based on search inputs
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const q = searchTerm.toLowerCase();
      return u.fullname.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q) || u.position.toLowerCase().includes(q);
    });
  }, [users, searchTerm]);

  const filteredEmails = useMemo(() => {
    return emails.filter(e => e.email.toLowerCase().includes(searchTerm.toLowerCase()) || (e.alias && e.alias.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [emails, searchTerm]);

  const filteredPhones = useMemo(() => {
    return phones.filter(p => p.phoneNumber.includes(searchTerm) || p.usage.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [phones, searchTerm]);

  const filteredLoginLogs = useMemo(() => {
    return loginLogs.filter(l => l.username.toLowerCase().includes(searchTerm.toLowerCase()) || l.ip.includes(searchTerm) || l.location.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [loginLogs, searchTerm]);

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(l => l.user.toLowerCase().includes(searchTerm.toLowerCase()) || l.action.toLowerCase().includes(searchTerm.toLowerCase()) || l.target.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [auditLogs, searchTerm]);

  // Sidebar admin menu configuration
  const adminMenuItems = [
    { id: 'dashboard', name: 'Thống kê Hệ thống', icon: Shield, badge: 'Overview' },
    { id: 'users', name: '1. Quản lý Người dùng', icon: Users },
    { id: 'emails', name: '2. Quản lý Email Đăng nhập', icon: Mail },
    { id: 'phones', name: '3. Quản lý Số điện thoại', icon: Phone },
    { id: 'departments', name: '4. Quản lý Phòng ban', icon: Building },
    { id: 'positions', name: '5. Quản lý Chức danh', icon: Briefcase },
    { id: 'branches', name: '6. Quản lý Chi nhánh', icon: MapPin },
    { id: 'roles', name: '7. Quản lý Vai trò (Role)', icon: ShieldCheck },
    { id: 'permissions', name: '8. Quản lý Phân quyền (Permission)', icon: KeyRound },
    { id: 'logins', name: '9. Quản lý Đăng nhập', icon: Lock },
    { id: 'audit', name: '10. Nhật ký Hoạt động (Audit)', icon: History },
    { id: 'security', name: '11. Quản lý Bảo mật', icon: Lock, badge: 'SSL' },
    { id: 'schema', name: 'Database Relational Schema', icon: Database, badge: 'SQL' },
    { id: 'backup', name: '12. Sao lưu & Khôi phục', icon: Server, badge: 'Backup' }
  ];

  // If role is employee or customer or supplier, block access with a stylish visual shield
  if (!isAuthorized) {
    return (
      <div className="bg-white rounded-xl border border-red-100 p-8 shadow-xs max-w-2xl mx-auto my-12 text-center" id="admin-unauthorized-guard">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
          <Shield className="w-8 h-8 animate-pulse" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">TRUY CẬP BỊ TỪ CHỐI</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
          Khu vực phân quyền tối cao: **QUẢN TRỊ VIÊN HỆ THỐNG**. Tài khoản hiện tại của bạn thuộc nhóm vai trò <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-orange-600 font-bold text-[11px]">{currentRole}</span>, không đủ đặc quyền truy cập cơ sở dữ liệu và cấu hình phân quyền hệ thống.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <span className="text-[11px] bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg border">
            Yêu cầu cấp quyền: Gửi Ticket phê duyệt đến Giám đốc Điều hành (CEO)
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row min-h-[640px] overflow-hidden" id="system-admin-panel">
      
      {/* 1. Left Navigation Menu Bar */}
      <aside className="w-full md:w-64 bg-slate-50 border-r border-slate-200/60 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <span className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white text-[11px] font-black font-mono">
              AD
            </span>
            <div>
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-tight">System Administrator</h3>
              <p className="text-[10px] text-slate-400 font-medium font-mono">Vận hành hạt nhân ERP</p>
            </div>
          </div>

          <div className="space-y-1">
            {adminMenuItems.map(item => {
              const IconComponent = item.icon;
              const isSelected = activeAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveAdminTab(item.id as AdminTab);
                    setSearchTerm('');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected 
                      ? 'bg-slate-950 text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                  id={`admin-nav-${item.id}`}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] px-1 rounded font-bold uppercase ${
                      isSelected ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 p-3 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 space-y-2 text-[10.5px] font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Server className="w-3 h-3 animate-pulse" />
            <span>CLOUD SERVER ACTIVE</span>
          </div>
          <div className="text-[9.5px] text-slate-400 space-y-1">
            <p>Database: PostgreSQL 16.2</p>
            <p>Tables: 11 / Relations: 14</p>
            <p>Backup: Auto-24h (OK)</p>
          </div>
        </div>
      </aside>

      {/* 2. Right Content Pane */}
      <main className="flex-1 p-6 flex flex-col justify-between overflow-x-auto">
        <div>
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-black font-mono">SYSTEM AD</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500">Chi nhánh: Toàn quốc</span>
              </div>
              <h2 className="text-base md:text-lg font-black tracking-tight text-slate-900 mt-1 uppercase">
                {adminMenuItems.find(i => i.id === activeAdminTab)?.name}
              </h2>
            </div>

            {/* General Search Input for lists */}
            {activeAdminTab !== 'dashboard' && activeAdminTab !== 'schema' && activeAdminTab !== 'security' && activeAdminTab !== 'permissions' && (
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm dữ liệu quản trị..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs pl-8.5 pr-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-hidden transition-all"
                  id="admin-search-input"
                />
              </div>
            )}
          </div>

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeAdminTab === 'dashboard' && (
            <div className="space-y-6" id="view-admin-dashboard">
              {/* Stats Bento Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Tổng Người Dùng</span>
                    <Users className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">{stats.totalUsers}</span>
                    <span className="text-[10px] text-emerald-600 font-bold font-mono">Active: {stats.activeUsers}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Tài khoản nhân sự được định danh</p>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Email định danh</span>
                    <Mail className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">{stats.totalEmails}</span>
                    <span className="text-[10px] text-emerald-600 font-bold font-mono">Xác thực: {stats.verifiedEmails}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Mã hóa email login bảo mật SSO</p>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">SĐT Đăng ký OTP</span>
                    <Phone className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">{stats.totalPhones}</span>
                    <span className="text-[10px] text-indigo-600 font-bold font-mono">Liên kết: {stats.verifiedPhones}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Xác thực bảo mật SMS OTP</p>
                </div>

                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl space-y-2 border border-slate-800">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">Hệ số An ninh</span>
                    <Lock className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">{stats.securityScore}</span>
                    <span className="text-[10px] text-emerald-400 font-bold font-mono">SSL ACTIVE</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Tuân thủ chính sách mật khẩu & 2FA</p>
                </div>
              </div>

              {/* Server Engine Status & Quick Diagnostic */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-indigo-500" />
                    <span>Mô phỏng sức khỏe hạ tầng (Live Server Metrics)</span>
                  </h3>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <p className="text-[10px] text-slate-400 font-bold font-mono">CPU USAGE</p>
                      <p className="text-lg font-black text-indigo-600 mt-1 font-mono">1.4%</p>
                      <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                        <div className="bg-indigo-600 h-full w-[14%]"></div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <p className="text-[10px] text-slate-400 font-bold font-mono">RAM ALLOC</p>
                      <p className="text-lg font-black text-emerald-600 mt-1 font-mono">248 MB</p>
                      <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[24%]"></div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <p className="text-[10px] text-slate-400 font-bold font-mono">DB POOL</p>
                      <p className="text-lg font-black text-orange-600 mt-1 font-mono">4/100</p>
                      <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                        <div className="bg-orange-500 h-full w-[4%]"></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-[11px] bg-slate-900 text-slate-300 font-mono p-3.5 rounded-lg border border-slate-800">
                    <p className="text-orange-400 font-bold"># DIAGNOSTIC ENGINE SYSTEM STATUS:</p>
                    <p className="text-emerald-400">● core_db_service: CONNECTED TO POSTGRESQL SUCCESSFUL (100% HEALTH)</p>
                    <p className="text-indigo-400">● sso_oauth_gateway: ACTIVE (LISTENING ON PORT 3000)</p>
                    <p className="text-slate-400">● security_encryption_key: ACTIVE (AES-256-GCM STANDARD)</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-orange-500" />
                    <span>Bộ máy Hành chính ERP</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Chi nhánh vận hành:</span>
                      <span className="font-bold text-slate-800">{stats.totalBranches}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Phòng ban cấu trúc:</span>
                      <span className="font-bold text-slate-800">{stats.totalDepartments}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Đăng nhập hôm nay:</span>
                      <span className="font-bold text-emerald-600">{stats.activeLoginsToday}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Đăng nhập thất bại:</span>
                      <span className="font-bold text-red-600">{stats.failedLoginsToday}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-200 text-center">
                      <button 
                        onClick={() => setActiveAdminTab('schema')}
                        className="text-[11px] font-bold text-slate-900 hover:text-orange-600 underline"
                      >
                        Khám phá Database Schema & SQL Console &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeAdminTab === 'users' && (
            <div className="space-y-4" id="view-admin-users">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500 font-medium">Danh sách các tài khoản nhân sự được định cấu hình trên lõi ERP.</p>
                <button
                  onClick={() => setIsAddUserOpen(true)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  id="btn-add-user"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm người dùng</span>
                </button>
              </div>

              {/* Users Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-3">ID / Họ và Tên</th>
                      <th className="p-3">Thông tin liên hệ</th>
                      <th className="p-3">Phòng ban & Chức danh</th>
                      <th className="p-3">Chi nhánh</th>
                      <th className="p-3">Quyền hạn (Role)</th>
                      <th className="p-3">Trạng thái</th>
                      <th className="p-3 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-xs">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/60">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{u.fullname}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{u.id}</div>
                        </td>
                        <td className="p-3 space-y-0.5">
                          <div className="text-slate-600 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{u.email}</span>
                          </div>
                          <div className="text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{u.phone}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-700">{u.department}</div>
                          <div className="text-[10.5px] text-slate-500">{u.position}</div>
                        </td>
                        <td className="p-3 font-medium text-slate-600">{u.branch}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded font-bold font-mono text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                              u.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            }`}
                            title="Click để đổi trạng thái"
                          >
                            {u.status}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteUser(u.id, u.fullname)}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                            title="Xóa tài khoản"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                          Không tìm thấy tài khoản nhân sự nào phù hợp với bộ lọc tìm kiếm.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: EMAIL LOGIN MANAGEMENT */}
          {activeAdminTab === 'emails' && (
            <div className="space-y-4" id="view-admin-emails">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500 font-medium">Bản đồ liên kết Email định danh Đăng nhập bảo mật (Multi-Email per Account mapping).</p>
                <button
                  onClick={() => setIsAddEmailOpen(true)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  id="btn-add-email"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Liên kết Email mới</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-3">ID Email</th>
                      <th className="p-3">Địa chỉ Email đăng nhập</th>
                      <th className="p-3">Mã định danh User ID</th>
                      <th className="p-3">Thuộc tính</th>
                      <th className="p-3">Trạng thái xác thực</th>
                      <th className="p-3">Địa chỉ Alias</th>
                      <th className="p-3 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-xs">
                    {filteredEmails.map(e => (
                      <tr key={e.id} className="hover:bg-slate-50/60">
                        <td className="p-3 font-mono font-bold text-slate-400">{e.id}</td>
                        <td className="p-3 font-semibold text-slate-900">{e.email}</td>
                        <td className="p-3 font-mono text-slate-600">{e.userId}</td>
                        <td className="p-3">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            e.type === 'Primary' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {e.type}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            e.isVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {e.isVerified ? '✓ Verified' : '✗ Unverified'}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-500">{e.alias || '-'}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setEmails(prev => prev.filter(item => item.id !== e.id));
                              onAddAuditLog('Xóa Email liên kết', `Xóa email ${e.email}`, 'Thành công');
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                            title="Xóa email liên kết"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PHONE NUMBER MANAGEMENT */}
          {activeAdminTab === 'phones' && (
            <div className="space-y-4" id="view-admin-phones">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500 font-medium">Danh bạ số điện thoại và phân quyền nhận mã OTP bảo mật giao dịch, kiểm định.</p>
                <button
                  onClick={() => setIsAddPhoneOpen(true)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  id="btn-add-phone"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Số điện thoại</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-3">Mã SĐT ID</th>
                      <th className="p-3">Số điện thoại liên kết</th>
                      <th className="p-3">Mã định danh User ID</th>
                      <th className="p-3">Phân nhóm sử dụng</th>
                      <th className="p-3">Kênh SMS OTP</th>
                      <th className="p-3 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-xs">
                    {filteredPhones.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/60">
                        <td className="p-3 font-mono font-bold text-slate-400">{p.id}</td>
                        <td className="p-3 font-mono font-bold text-slate-900">{p.phoneNumber}</td>
                        <td className="p-3 font-mono text-slate-600">{p.userId}</td>
                        <td className="p-3 text-slate-600 font-medium">{p.usage}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.isVerified ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {p.isVerified ? '● Đã kích hoạt' : '○ Chờ kích hoạt'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setPhones(prev => prev.filter(item => item.id !== p.id));
                              onAddAuditLog('Xóa SĐT liên kết', `Xóa SĐT ${p.phoneNumber}`, 'Thành công');
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: DEPARTMENT MANAGEMENT */}
          {activeAdminTab === 'departments' && (
            <div className="space-y-4" id="view-admin-departments">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500 font-medium">Thiết lập cơ cấu phòng ban, gán Trưởng phòng chuyên trách và địa bàn hành chính.</p>
                <button
                  onClick={() => setIsAddDeptOpen(true)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  id="btn-add-dept"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Khởi tạo phòng ban</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-3">Mã phòng ban</th>
                      <th className="p-3">Tên phòng ban hành chính</th>
                      <th className="p-3">Trưởng phòng chuyên trách</th>
                      <th className="p-3 text-center">Nhân sự hiện hữu</th>
                      <th className="p-3">Văn phòng / Vị trí</th>
                      <th className="p-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-xs">
                    {departments.map(d => (
                      <tr key={d.code} className="hover:bg-slate-50/60">
                        <td className="p-3 font-mono font-bold text-slate-900">{d.code}</td>
                        <td className="p-3 font-bold text-slate-800">{d.name}</td>
                        <td className="p-3 text-slate-700 font-medium">{d.head}</td>
                        <td className="p-3 text-center font-bold text-slate-600">{d.count} chuyên viên</td>
                        <td className="p-3 text-slate-500 font-mono text-[10.5px]">{d.location}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Xóa phòng ban ${d.name}?`)) {
                                setDepartments(prev => prev.filter(item => item.code !== d.code));
                                onAddAuditLog('Xóa phòng ban', `Mã: ${d.code}`, 'Thành công');
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: JOB TITLES */}
          {activeAdminTab === 'positions' && (
            <div className="space-y-4" id="view-admin-positions">
              <p className="text-xs text-slate-500 font-medium">Bảng bậc hàm chức vụ, hệ số lương và cơ cấu phân nhóm người dùng ERP.</p>
              
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-3">Mã chức hàm</th>
                      <th className="p-3">Tên chức vụ chính quy</th>
                      <th className="p-3">Bậc ngạch</th>
                      <th className="p-3 font-mono">Hệ số đóng góp (Salary Coef)</th>
                      <th className="p-3 text-center">Nhân sự gán hàm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-xs">
                    {positions.map(p => (
                      <tr key={p.code} className="hover:bg-slate-50/60">
                        <td className="p-3 font-mono font-bold text-slate-900">{p.code}</td>
                        <td className="p-3 font-bold text-slate-800">{p.title}</td>
                        <td className="p-3 font-semibold text-slate-600">{p.grade}</td>
                        <td className="p-3 font-mono text-indigo-600 font-bold">{p.salaryCoef}</td>
                        <td className="p-3 text-center text-slate-600 font-medium">{p.activeUsers} nhân sự</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: BRANCH MANAGEMENT */}
          {activeAdminTab === 'branches' && (
            <div className="space-y-4" id="view-admin-branches">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500 font-medium">Quản lý mạng lưới chi nhánh, nhà xưởng và trung tâm kiểm định dịch vụ TERASU.</p>
                <button
                  onClick={() => setIsAddBranchOpen(true)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  id="btn-add-branch"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Khai trương Chi nhánh</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-3">Mã chi nhánh</th>
                      <th className="p-3">Tên chi nhánh / Văn phòng</th>
                      <th className="p-3">Địa điểm / Địa chỉ chi tiết</th>
                      <th className="p-3">Giám đốc Chi nhánh</th>
                      <th className="p-3">Trạng thái</th>
                      <th className="p-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-xs">
                    {branches.map(b => (
                      <tr key={b.code} className="hover:bg-slate-50/60">
                        <td className="p-3 font-mono font-bold text-slate-900">{b.code}</td>
                        <td className="p-3 font-bold text-slate-800">{b.name}</td>
                        <td className="p-3 text-slate-600 font-medium">{b.address}</td>
                        <td className="p-3 text-slate-700 font-semibold">{b.manager}</td>
                        <td className="p-3">
                          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold text-[10px] border border-emerald-200">
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Đóng cửa chi nhánh ${b.name}?`)) {
                                setBranches(prev => prev.filter(item => item.code !== b.code));
                                onAddAuditLog('Đóng cửa chi nhánh', `Mã: ${b.code}`, 'Thành công');
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: ROLES */}
          {activeAdminTab === 'roles' && (
            <div className="space-y-4" id="view-admin-roles">
              <p className="text-xs text-slate-500 font-medium">Bảng kê các vai trò thành viên quy định các quyền cốt lõi trên kho tài liệu.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map(r => (
                  <div key={r.code} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-indigo-50 text-indigo-700 font-black font-mono px-2 py-0.5 rounded border border-indigo-200">
                        {r.code}
                      </span>
                      <span className="text-[10px] text-slate-400">Security Grade: High</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-800">{r.name}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: PERMISSION MATRIX */}
          {activeAdminTab === 'permissions' && (
            <div className="space-y-6" id="view-admin-permissions">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="text-xs text-slate-500 font-medium">
                  Ma trận phân quyền tối cao (Permission Matrix). Tích chọn các đặc quyền chi tiết ứng với từng vai trò hệ thống và nhấn lưu.
                </p>
                <button
                  onClick={handleSavePermissions}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <Save className="w-4 h-4 text-orange-400" />
                  <span>Lưu ma trận phân quyền</span>
                </button>
              </div>

              {/* Permission Grid Matrix */}
              <div className="border border-slate-200 rounded-lg overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-3 min-w-[240px]">Tính năng / Đặc quyền chi tiết</th>
                      <th className="p-3 text-center">CEO</th>
                      <th className="p-3 text-center">DIRECTOR</th>
                      <th className="p-3 text-center">HEAD</th>
                      <th className="p-3 text-center">EMPLOYEE</th>
                      <th className="p-3 text-center">CUSTOMER</th>
                      <th className="p-3 text-center">SUPPLIER</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-xs">
                    {ALL_PERMISSIONS.map(p => (
                      <tr key={p.code} className="hover:bg-slate-50/60">
                        <td className="p-3">
                          <div className="font-bold text-slate-800">{p.label}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9.5px] bg-slate-100 text-slate-500 font-mono font-bold px-1 rounded">
                              {p.category}
                            </span>
                            <span className="text-[9.5px] text-slate-400 font-mono">
                              ({p.code})
                            </span>
                          </div>
                        </td>
                        
                        {/* Interactive Matrix Checkboxes for 6 Roles */}
                        {['CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE', 'CUSTOMER', 'SUPPLIER'].map(role => {
                          const hasPermission = (permissionRoles[role] || []).includes(p.code);
                          return (
                            <td key={role} className="p-3 text-center">
                              <button
                                onClick={() => handlePermissionToggle(role, p.code)}
                                className="mx-auto text-slate-400 hover:text-slate-900 transition-colors cursor-pointer flex items-center justify-center p-1 rounded hover:bg-slate-100"
                                title={`Gán ${p.code} cho ${role}`}
                              >
                                {hasPermission ? (
                                  <CheckSquare className="w-4 h-4 text-indigo-600" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300" />
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 10: LOGINS LOG */}
          {activeAdminTab === 'logins' && (
            <div className="space-y-4" id="view-admin-logins">
              <p className="text-xs text-slate-500 font-medium">Lịch sử đăng nhập người dùng, phát hiện thiết bị và cảnh báo địa chỉ IP lạ đột nhập.</p>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-3">Mã log</th>
                      <th className="p-3">Tài khoản Email đăng nhập</th>
                      <th className="p-3">Địa chỉ IP</th>
                      <th className="p-3">Thiết bị & Hệ điều hành</th>
                      <th className="p-3 font-mono">Thời gian</th>
                      <th className="p-3">Vùng địa lý</th>
                      <th className="p-3">Kết quả</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-xs">
                    {filteredLoginLogs.map(l => (
                      <tr key={l.id} className="hover:bg-slate-50/60">
                        <td className="p-3 font-mono font-bold text-slate-400">{l.id}</td>
                        <td className="p-3 font-bold text-slate-900">{l.username}</td>
                        <td className="p-3 font-mono text-indigo-600 font-semibold">{l.ip}</td>
                        <td className="p-3 text-slate-600 font-medium">{l.device}</td>
                        <td className="p-3 font-mono text-slate-500">{l.time}</td>
                        <td className="p-3 text-slate-500 font-medium">{l.location}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                            l.status === 'Thành công'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                          }`}>
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 11: AUDIT LOG */}
          {activeAdminTab === 'audit' && (
            <div className="space-y-4" id="view-admin-audit">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500 font-medium">Nhật ký hoạt động toàn vẹn hệ thống (SOP Update, login, phân quyền, v.v.)</p>
                <button
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href",     dataStr);
                    downloadAnchor.setAttribute("download", `TERASU-AuditLogs-${new Date().toISOString().split('T')[0]}.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                    onAddAuditLog('Xuất Excel/JSON Nhật ký', 'Tập tin nhật ký đầy đủ', 'Thành công');
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all border border-slate-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất file JSON</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-3">Thời điểm</th>
                      <th className="p-3">Người dùng / Vai trò</th>
                      <th className="p-3">Hành động thực thi</th>
                      <th className="p-3">Đối tượng tác động</th>
                      <th className="p-3">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-xs font-mono">
                    {filteredAuditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/60">
                        <td className="p-3 text-slate-500 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-800 font-sans">{log.user}</div>
                          <div className="text-[10px] text-slate-400 font-bold">{log.role}</div>
                        </td>
                        <td className="p-3 text-slate-900 font-semibold">{log.action}</td>
                        <td className="p-3 text-slate-600 font-sans">{log.target}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'Thành công' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : 'bg-red-50 text-red-700 border border-red-100'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 12: SECURITY CONFIG */}
          {activeAdminTab === 'security' && (
            <div className="space-y-6" id="view-admin-security">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 12A: Global Password & Authentication Policies */}
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-indigo-500" />
                    <span>Quy tắc mật khẩu & Bảo mật 2 lớp (2FA)</span>
                  </h3>

                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Độ dài mật khẩu tối thiểu:</span>
                      <select 
                        value={securityConfig.minPasswordLength}
                        onChange={(e) => setSecurityConfig(prev => ({ ...prev, minPasswordLength: Number(e.target.value) }))}
                        className="bg-white border border-slate-200 rounded p-1 font-bold focus:outline-hidden"
                      >
                        <option value={6}>6 ký tự</option>
                        <option value={8}>8 ký tự (Đề xuất)</option>
                        <option value={12}>12 ký tự (Bảo mật cao)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Bắt buộc ký tự đặc biệt (!@#$):</span>
                      <button
                        onClick={() => setSecurityConfig(prev => ({ ...prev, requireSpecialChar: !prev.requireSpecialChar }))}
                        className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        {securityConfig.requireSpecialChar ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Bắt buộc số (0-9):</span>
                      <button
                        onClick={() => setSecurityConfig(prev => ({ ...prev, requireNumbers: !prev.requireNumbers }))}
                        className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        {securityConfig.requireNumbers ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Bắt buộc chữ hoa (A-Z):</span>
                      <button
                        onClick={() => setSecurityConfig(prev => ({ ...prev, requireUppercase: !prev.requireUppercase }))}
                        className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        {securityConfig.requireUppercase ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <div>
                        <span className="text-slate-800 font-bold block">Bắt buộc xác thực 2 bước (2FA OTP):</span>
                        <span className="text-[10px] text-slate-400">Enforce SMS OTP cho Giám đốc & CEO</span>
                      </div>
                      <button
                        onClick={() => setSecurityConfig(prev => ({ ...prev, enforce2FA: !prev.enforce2FA }))}
                        className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        {securityConfig.enforce2FA ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Thời gian tự động logout (Session Timeout):</span>
                      <select 
                        value={securityConfig.sessionTimeoutMins}
                        onChange={(e) => setSecurityConfig(prev => ({ ...prev, sessionTimeoutMins: Number(e.target.value) }))}
                        className="bg-white border border-slate-200 rounded p-1 font-bold focus:outline-hidden"
                      >
                        <option value={15}>15 phút</option>
                        <option value={30}>30 phút (Tiêu chuẩn)</option>
                        <option value={60}>60 phút</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          onAddAuditLog('Cập nhật chính sách mật khẩu', 'Thay đổi cấu hình bảo mật mật khẩu hệ thống', 'Thành công');
                          alert('Đã cập nhật chính sách mật khẩu và cấu hình an ninh bảo mật thành công!');
                        }}
                        className="w-full py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 cursor-pointer text-center"
                      >
                        Cập nhật quy chuẩn bảo mật
                      </button>
                    </div>
                  </div>
                </div>

                {/* 12B: IP Access Whitelisting */}
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Server className="w-4 h-4 text-orange-500" />
                      <span>IP Access Whitelist (Chỉ địa chỉ IP này được đăng nhập)</span>
                    </h3>
                    <button
                      onClick={() => setIsAddIPOpen(true)}
                      className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add IP
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Đảm bảo chặn đứng các hành vi giả mạo, hack từ bên ngoài hệ thống nội bộ TERASU.
                  </p>

                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                    {securityConfig.whitelistedIPs.map(ip => (
                      <div key={ip} className="flex justify-between items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                          <span>{ip}</span>
                          {ip === '113.161.4.12' && (
                            <span className="text-[9px] bg-slate-900 text-white px-1 rounded uppercase font-bold tracking-wider">Trụ sở HN</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveIP(ip)}
                          className="text-slate-400 hover:text-red-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Document/Credential Import feature requested */}
                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 block uppercase">Nạp chứng thư số mật khẩu / Key SSL (.crt / .pem):</span>
                    <div className="relative border border-dashed border-slate-300 rounded-lg p-3 text-center bg-white hover:bg-slate-50 transition-all">
                      <input 
                        type="file" 
                        accept=".crt,.pem,.key,.json"
                        onChange={handleUploadCredentials}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        id="admin-security-cert-uploader"
                      />
                      <div className="space-y-1">
                        <span className="text-xs text-indigo-600 font-bold block">
                          {isUploadingConfig ? 'Đang giải mã...' : uploadedConfigName || 'Chọn tệp bảo mật của bạn hoặc kéo thả'}
                        </span>
                        <span className="text-[10px] text-slate-400 block">Định dạng hỗ trợ: .crt, .pem, .json (Chìa khóa mã hóa)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: DATABASE SCHEMA DIAGRAM & INTERACTIVE CONSOLE */}
          {activeAdminTab === 'schema' && (
            <div className="space-y-6" id="view-admin-schema">
              
              {/* Relational Schema Visualization Block */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-500" />
                  <span>Sơ đồ liên kết thực thể quan hệ cơ sở dữ liệu (PostgreSQL Relational Schema)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  
                  {/* Table Users representation */}
                  <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="bg-slate-900 text-white p-2 text-[11px] font-bold flex justify-between">
                      <span>tbl_users</span>
                      <span className="text-[9px] text-orange-400 font-bold">PRIMARY</span>
                    </div>
                    <div className="p-2.5 space-y-1 text-[10.5px]">
                      <p className="text-indigo-600 font-bold">🔑 id: VARCHAR(30) [PK]</p>
                      <p>fullname: VARCHAR(100)</p>
                      <p>email: VARCHAR(100) [FK &rarr; tbl_emails]</p>
                      <p>phone: VARCHAR(20) [FK &rarr; tbl_phones]</p>
                      <p>department_code: VARCHAR(20) [FK]</p>
                      <p>position_code: VARCHAR(20) [FK]</p>
                      <p>branch_code: VARCHAR(20) [FK]</p>
                      <p>role_code: VARCHAR(20) [FK]</p>
                      <p className="text-emerald-600">status: VARCHAR(20) DEFAULT 'Active'</p>
                    </div>
                  </div>

                  {/* Table Emails representation */}
                  <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="bg-slate-800 text-white p-2 text-[11px] font-bold flex justify-between">
                      <span>tbl_emails</span>
                      <span className="text-[9px] text-indigo-400 font-bold">RELATION</span>
                    </div>
                    <div className="p-2.5 space-y-1 text-[10.5px]">
                      <p className="text-indigo-600 font-bold">🔑 id: VARCHAR(30) [PK]</p>
                      <p className="text-indigo-600">🔗 user_id: VARCHAR(30) [FK]</p>
                      <p className="font-bold">email: VARCHAR(100) [UNIQUE]</p>
                      <p>type: VARCHAR(20) DEFAULT 'Primary'</p>
                      <p>is_verified: BOOLEAN DEFAULT TRUE</p>
                      <p>alias_email: VARCHAR(100)</p>
                    </div>
                  </div>

                  {/* Table Phones representation */}
                  <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="bg-slate-800 text-white p-2 text-[11px] font-bold flex justify-between">
                      <span>tbl_phones</span>
                      <span className="text-[9px] text-indigo-400 font-bold">RELATION</span>
                    </div>
                    <div className="p-2.5 space-y-1 text-[10.5px]">
                      <p className="text-indigo-600 font-bold">🔑 id: VARCHAR(30) [PK]</p>
                      <p className="text-indigo-600">🔗 user_id: VARCHAR(30) [FK]</p>
                      <p className="font-bold">phone_number: VARCHAR(20)</p>
                      <p>usage_type: VARCHAR(50)</p>
                      <p>is_verified: BOOLEAN DEFAULT TRUE</p>
                    </div>
                  </div>

                </div>

                <div className="bg-slate-900 text-slate-300 font-mono p-3.5 rounded-lg border border-slate-800 text-[10.5px] max-h-40 overflow-y-auto space-y-1">
                  <p className="text-indigo-400 font-bold">-- POSTGRESQL DDL GENERATED SCRIPT (SCHEMA DEFINITION):</p>
                  <p>CREATE TABLE tbl_users (</p>
                  <p>&nbsp;&nbsp;id VARCHAR(30) PRIMARY KEY,</p>
                  <p>&nbsp;&nbsp;fullname VARCHAR(100) NOT NULL,</p>
                  <p>&nbsp;&nbsp;department_code VARCHAR(20) REFERENCES tbl_departments(code),</p>
                  <p>&nbsp;&nbsp;position_code VARCHAR(20) REFERENCES tbl_positions(code),</p>
                  <p>&nbsp;&nbsp;branch_code VARCHAR(20) REFERENCES tbl_branches(code),</p>
                  <p>&nbsp;&nbsp;role_code VARCHAR(20) REFERENCES tbl_roles(code),</p>
                  <p>&nbsp;&nbsp;status VARCHAR(20) DEFAULT 'Active'</p>
                  <p>);</p>
                  <p>ALTER TABLE tbl_emails ADD CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES tbl_users(id) ON DELETE CASCADE;</p>
                </div>
              </div>

              {/* Interactive Virtual SQL query Console */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-3 p-4 bg-slate-950 text-slate-100">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black uppercase font-mono tracking-tight text-white">TERASU SQL Query Console</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">STATUS: ONLINE</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold block uppercase">Viết câu lệnh SQL (SELECT * FROM):</label>
                  <div className="flex gap-2">
                    <textarea
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                      className="flex-1 bg-slate-900 text-slate-100 font-mono p-3 text-xs rounded-lg border border-slate-800 focus:outline-hidden focus:border-emerald-500"
                      rows={2}
                      id="sql-query-area"
                    />
                    <button
                      onClick={handleExecuteSql}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black rounded-lg transition-all flex flex-col items-center justify-center gap-1 shrink-0 cursor-pointer"
                      id="btn-execute-sql"
                    >
                      <span>▶</span>
                      <span>Run Query</span>
                    </button>
                  </div>
                </div>

                {/* Hot shortcut templates to quickly click */}
                <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                  <span className="text-slate-500 self-center">Mẫu nhanh:</span>
                  <button 
                    onClick={() => setSqlQuery("SELECT * FROM tbl_users WHERE status = 'Active';")} 
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2 py-0.5 rounded text-indigo-400"
                  >
                    SELECT Active Users
                  </button>
                  <button 
                    onClick={() => setSqlQuery("SELECT * FROM tbl_emails;")} 
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2 py-0.5 rounded text-emerald-400"
                  >
                    SELECT Emails
                  </button>
                  <button 
                    onClick={() => setSqlQuery("SELECT * FROM tbl_phones;")} 
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2 py-0.5 rounded text-amber-400"
                  >
                    SELECT Phones
                  </button>
                  <button 
                    onClick={() => setSqlQuery("SELECT * FROM tbl_departments;")} 
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2 py-0.5 rounded text-purple-400"
                  >
                    SELECT Departments
                  </button>
                  <button 
                    onClick={() => setSqlQuery("SELECT * FROM tbl_security_policies;")} 
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2 py-0.5 rounded text-orange-400"
                  >
                    SELECT Security Policies
                  </button>
                </div>

                {/* Console Output status */}
                <div className="text-[11px] text-slate-400 font-mono bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-emerald-400 font-bold">&gt;_ </span>
                  <span>{sqlStatus}</span>
                </div>

                {/* Query Result Table representation */}
                {sqlResult && (
                  <div className="max-h-60 overflow-y-auto overflow-x-auto border border-slate-800 rounded bg-slate-900 text-xs font-mono">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 text-[10px] font-bold text-slate-400">
                          {sqlColumns.map(col => (
                            <th key={col} className="p-2 border-r border-slate-800">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sqlResult.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-800 hover:bg-slate-900/60 text-slate-300 text-[11px]">
                            {sqlColumns.map(col => (
                              <td key={col} className="p-2 border-r border-slate-800 truncate max-w-[150px]">
                                {typeof row[col] === 'boolean' ? (row[col] ? 'TRUE' : 'FALSE') : row[col]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 14: BACKUP, RESTORE & SYSTEM TRASH CAN (SUPER ADMIN ONLY) */}
          {activeAdminTab === 'backup' && (
            <div className="space-y-6 animate-in fade-in duration-200" id="view-admin-backup">
              
              {/* Header banner */}
              <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-600 rounded-lg text-white">
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm md:text-base tracking-tight flex items-center gap-2">
                      <span>Quản lý Sao lưu & Khôi phục Hệ thống</span>
                      <span className="text-[10px] bg-red-600 font-extrabold px-1.5 py-0.2 rounded">SUPER ADMIN ONLY</span>
                    </h3>
                    <p className="text-xs text-slate-300">
                      Thực thi sao lưu nóng dữ liệu (Hot Backup), khôi phục cơ sở dữ liệu về thời điểm quá khứ và cứu hộ tài liệu rác đã xóa.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const newId = `bk-${Date.now()}`;
                    const newBk = {
                      id: newId,
                      name: `Backup_ERP_Manual_${new Date().toISOString().replace(/[-:T]/g, '').substring(0, 14)}.sql`,
                      size: '28.4 MB',
                      type: 'Manual Hot Backup',
                      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
                      createdBy: currentRole
                    };
                    setBackups([newBk, ...backups]);
                    onAddAuditLog('Tạo bản sao lưu', `Bản lưu ${newBk.name} khẩn cấp`, 'Thành công');
                    alert(`Đã hoàn tất sao lưu nóng toàn bộ dữ liệu hệ thống ERP & Wiki. Bản lưu được lưu trữ an toàn trong Cloud Storage!`);
                  }}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span>📥</span>
                  <span>Tạo bản sao lưu ngay (Backup NOW)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Backups Panel */}
                <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-4 shadow-xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <span>📦</span>
                      <span>Lịch sử các bản sao lưu cơ sở dữ liệu</span>
                    </h4>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">{backups.length} bản lưu</span>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {backups.map(bk => (
                      <div key={bk.id} className="p-3 bg-slate-50 rounded-lg border border-slate-150 flex items-center justify-between text-xs gap-4 hover:border-orange-200 transition-colors">
                        <div className="space-y-1">
                          <p className="font-mono font-bold text-slate-800 text-[11px] break-all">{bk.name}</p>
                          <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 font-mono">
                            <span>Dung lượng: <strong className="text-slate-700">{bk.size}</strong></span>
                            <span>•</span>
                            <span>Loại: <strong className="text-slate-700">{bk.type}</strong></span>
                            <span>•</span>
                            <span>Ngày tạo: {bk.createdAt}</span>
                          </div>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              if (confirm(`Bạn chắc chắn muốn khôi phục toàn bộ cơ sở dữ liệu về bản sao lưu [${bk.name}]? Việc này sẽ ghi đè dữ liệu hiện tại!`)) {
                                onAddAuditLog('Khôi phục cơ sở dữ liệu', `Bản lưu ${bk.name}`, 'Thành công');
                                alert(`🔄 Đang khởi động tiến trình khôi phục cơ sở dữ liệu:\n- Đang đọc tệp tin SQL...\n- Đang dọn dẹp các bảng hệ thống...\n- Đang khôi phục dữ liệu ERP & Wiki...\nKhôi phục hoàn tất 100% thành công! Hệ thống đã quay lại trạng thái đồng bộ.`);
                              }
                            }}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded cursor-pointer transition-colors"
                          >
                            Restore
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Xóa vĩnh viễn bản lưu ${bk.name}?`)) {
                                setBackups(backups.filter(b => b.id !== bk.id));
                                onAddAuditLog('Xóa bản sao lưu', bk.name, 'Thành công');
                              }
                            }}
                            className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trash Can Panel for SUPER_ADMIN to restore records */}
                <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-4 shadow-xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <span>🗑️</span>
                      <span>Thùng rác Hệ thống (Cứu hộ tài liệu đã xóa)</span>
                    </h4>
                    <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded font-bold">{deletedDocs.length} tệp rác</span>
                  </div>

                  {deletedDocs.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {deletedDocs.map(doc => (
                        <div key={doc.id} className="p-3 bg-red-50/20 rounded-lg border border-red-100 flex items-center justify-between text-xs gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold font-mono">{doc.code}</span>
                              <p className="font-bold text-slate-800 text-[11px] line-clamp-1">{doc.name}</p>
                            </div>
                            <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 font-mono">
                              <span>Bộ phận: {doc.department}</span>
                              <span>•</span>
                              <span>Loại: {doc.type}</span>
                              <span>•</span>
                              <span>Ngày xóa: {doc.deletedAt}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setDeletedDocs(deletedDocs.filter(d => d.id !== doc.id));
                              onAddAuditLog('Cứu hộ tài liệu', `Khôi phục thành công SOP ${doc.code} - ${doc.name}`, 'Thành công');
                              alert(`⚡ Đã khôi phục tài liệu [${doc.code}] thành công về trạng thái ban hành hoạt động!`);
                            }}
                            className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded cursor-pointer transition-colors"
                          >
                            Khôi phục
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-slate-50 border border-dotted border-slate-200 rounded-lg text-slate-400">
                      <span>Thùng rác trống rỗng. Không có tài liệu nào bị xóa gần đây.</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      {/* --- MODAL DIALOGS FOR ADDS --- */}
      
      {/* 1. Modal Add User */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-extrabold text-xs uppercase tracking-wider">Thêm mới tài khoản người dùng</h3>
              <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddUserSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Họ và Tên chính quy:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn Hải"
                  value={newUser.fullname}
                  onChange={(e) => setNewUser(prev => ({ ...prev, fullname: e.target.value }))}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email đăng nhập:</label>
                  <input
                    type="email"
                    placeholder="hai.nv@terasu.vn"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Số điện thoại OTP:</label>
                  <input
                    type="text"
                    placeholder="0911223344"
                    value={newUser.phone}
                    onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Bộ phận hành chính:</label>
                  <select
                    value={newUser.department}
                    onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  >
                    {departments.map(d => (
                      <option key={d.code} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Chức vụ gán bậc:</label>
                  <input
                    type="text"
                    placeholder="Chuyên viên kỹ thuật"
                    value={newUser.position}
                    onChange={(e) => setNewUser(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Chi nhánh phân bổ:</label>
                  <select
                    value={newUser.branch}
                    onChange={(e) => setNewUser(prev => ({ ...prev, branch: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  >
                    {branches.map(b => (
                      <option key={b.code} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Quyền hạn hệ thống (Role):</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as Role }))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  >
                    <option value="CEO">CEO</option>
                    <option value="DIRECTOR">DIRECTOR</option>
                    <option value="HEAD">HEAD</option>
                    <option value="EMPLOYEE">EMPLOYEE</option>
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="SUPPLIER">SUPPLIER</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-850"
                  id="btn-submit-add-user"
                >
                  Khởi tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal Add Email link */}
      {isAddEmailOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-extrabold text-xs uppercase tracking-wider font-mono">LINK EMAIL</h3>
              <button onClick={() => setIsAddEmailOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddEmailSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Địa chỉ Email đăng nhập liên kết:</label>
                <input
                  type="email"
                  placeholder="work.email@terasu.vn"
                  value={newEmail.email}
                  onChange={(e) => setNewEmail(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Liên kết tài khoản Nhân sự (User ID):</label>
                <select
                  value={newEmail.userId}
                  onChange={(e) => setNewEmail(prev => ({ ...prev, userId: e.target.value }))}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.fullname} ({u.id})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Phân loại cấu hình:</label>
                <select
                  value={newEmail.type}
                  onChange={(e) => setNewEmail(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                >
                  <option value="Primary">Email Đăng nhập chính (SSO)</option>
                  <option value="Secondary">Email dự phòng / Báo cáo</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Alias thay thế (nếu có):</label>
                <input
                  type="text"
                  placeholder="contact.alias@terasu.vn"
                  value={newEmail.alias}
                  onChange={(e) => setNewEmail(prev => ({ ...prev, alias: e.target.value }))}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEmailOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800"
                >
                  Lưu cấu hình
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal Add Phone link */}
      {isAddPhoneOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-extrabold text-xs uppercase tracking-wider font-mono">LINK PHONE</h3>
              <button onClick={() => setIsAddPhoneOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddPhoneSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Số điện thoại liên kết chính:</label>
                <input
                  type="text"
                  placeholder="0911223344"
                  value={newPhone.phoneNumber}
                  onChange={(e) => setNewPhone(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Liên kết tài khoản Nhân sự (User ID):</label>
                <select
                  value={newPhone.userId}
                  onChange={(e) => setNewPhone(prev => ({ ...prev, userId: e.target.value }))}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.fullname} ({u.id})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mục đích sử dụng:</label>
                <input
                  type="text"
                  placeholder="Công việc / Nhận mã bảo vệ OTP giao dịch"
                  value={newPhone.usage}
                  onChange={(e) => setNewPhone(prev => ({ ...prev, usage: e.target.value }))}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPhoneOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800"
                >
                  Kích hoạt SĐT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal Add Department */}
      {isAddDeptOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-extrabold text-xs uppercase tracking-wider">Khởi tạo Phòng ban mới</h3>
              <button onClick={() => setIsAddDeptOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddDeptSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mã phòng ban (Viết tắt):</label>
                <input
                  type="text"
                  placeholder="Ví dụ: MKT, SALE, QC"
                  value={newDept.code}
                  onChange={(e) => setNewDept(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden uppercase"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tên phòng ban chính thức:</label>
                <input
                  type="text"
                  placeholder="Phòng Truyền thông & Thương hiệu"
                  value={newDept.name}
                  onChange={(e) => setNewDept(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Người đứng đầu (Trưởng phòng):</label>
                <input
                  type="text"
                  placeholder="Họ tên trưởng phòng"
                  value={newDept.head}
                  onChange={(e) => setNewDept(prev => ({ ...prev, head: e.target.value }))}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nhân sự ban đầu:</label>
                  <input
                    type="number"
                    value={newDept.count}
                    onChange={(e) => setNewDept(prev => ({ ...prev, count: Number(e.target.value) }))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden"
                    min={1}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Địa chỉ / Vị trí phòng:</label>
                  <input
                    type="text"
                    placeholder="Tầng 4, Tòa HN"
                    value={newDept.location}
                    onChange={(e) => setNewDept(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDeptOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg"
                >
                  Tạo phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal Add Branch */}
      {isAddBranchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-extrabold text-xs uppercase tracking-wider">Khai trương Chi nhánh mới</h3>
              <button onClick={() => setIsAddBranchOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddBranchSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mã chi nhánh (Branch Code):</label>
                <input
                  type="text"
                  placeholder="CN-HP, CN-QN, CN-CT"
                  value={newBranch.code}
                  onChange={(e) => setNewBranch(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden uppercase"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tên chi nhánh / Địa điểm chính:</label>
                <input
                  type="text"
                  placeholder="Văn phòng Hải Phòng"
                  value={newBranch.name}
                  onChange={(e) => setNewBranch(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Địa chỉ cụ thể:</label>
                <input
                  type="text"
                  placeholder="Số 44 Lạch Tray, Ngô Quyền, Hải Phòng"
                  value={newBranch.address}
                  onChange={(e) => setNewBranch(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Giám đốc Chi nhánh bổ nhiệm:</label>
                <input
                  type="text"
                  placeholder="Họ tên giám đốc chi nhánh"
                  value={newBranch.manager}
                  onChange={(e) => setNewBranch(prev => ({ ...prev, manager: e.target.value }))}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBranchOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg"
                >
                  Lưu khai trương
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Modal Add IP Whitelist */}
      {isAddIPOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-xs w-full overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-extrabold text-xs uppercase tracking-wider font-mono">WHITELIST IP</h3>
              <button onClick={() => setIsAddIPOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddIPSubmit} className="p-4 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Địa chỉ IPv4 hoặc CIDR Block:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 115.79.138.40"
                  value={newIP}
                  onChange={(e) => setNewIP(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden font-mono"
                  required
                />
                <span className="text-[10px] text-slate-400 block font-sans">Địa chỉ này sẽ có quyền truy cập đăng nhập bỏ qua chặn IP địa lý.</span>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddIPOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 rounded text-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded"
                >
                  Whitelist IP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
