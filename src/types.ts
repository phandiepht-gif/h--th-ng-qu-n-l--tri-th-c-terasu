/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'SUPER_ADMIN' | 'CEO' | 'DIRECTOR' | 'HEAD' | 'EMPLOYEE' | 'CUSTOMER' | 'SUPPLIER';

export interface UserRoleSchema {
  id: Role;
  name: string;
  description: string;
  allowedCategories: string[]; // List of category directories they can access
  hasFullAccess: boolean;
}

export type DocumentType = 'SOP/Quy trình' | 'Biểu mẫu' | 'Tài liệu đào tạo' | 'Video/Slide' | 'Hình ảnh QC' | 'Hồ sơ pháp lý' | 'Báo giá/Hợp đồng';

export interface Document {
  id: string;
  code: string;
  name: string;
  type: DocumentType;
  department: string; // HCNS, MARKETING, KINH DOANH, KẾ TOÁN, MUA HÀNG, KHO, QC KỸ THUẬT, DỊCH VỤ SỬA CHỮA, PHÁP LÝ, CHIẾN LƯỢC
  categoryPath: string; // e.g., "01. CHIẾN LƯỢC/Tầm nhìn"
  creator: string;
  approver: string;
  createdAt: string;
  updatedAt: string;
  version: string;
  status: 'Ban hành' | 'Dự thảo' | 'Chờ duyệt' | 'Hết hiệu lực';
  tags: string[];
  accessRights: Role[];
  contentSummary?: string; // Text content simulated for semantic/OCR search queries
  fileUrl?: string;
  fileSize?: string;
}

export interface FolderNode {
  name: string;
  path: string;
  children?: FolderNode[];
}

export interface TrainingMaterial {
  id: string;
  title: string;
  category: 'Hội nhập' | 'Văn hóa' | 'Sản phẩm' | 'Kỹ thuật' | 'Kinh doanh' | 'Quản lý' | 'Lãnh đạo';
  videoUrl?: string; // Standard simulated video source
  duration: string;
  slidesCount?: number;
  pdfAttached?: string;
  description: string;
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

export interface SystemAccount {
  id: string;
  platform: 'Facebook' | 'TikTok' | 'Youtube' | 'Website' | 'Hosting' | 'Email' | 'Domain' | 'Canva' | 'ChatGPT' | 'Zoom' | 'M365' | 'Software';
  serviceName: string;
  url: string;
  username: string;
  manager: string;
  createdAt: string;
  renewalDate: string;
  cost: number; // in VND
  accessRights: Role[];
  notes?: string;
}

export interface WorkflowTicket {
  id: string;
  workflowId: 'purchase' | 'warranty';
  name: string; // e.g., "Mở đại lý DID mới" or "Bảo hành ắc quy xe Wave"
  currentStage: string;
  updatedAt: string;
  creator: string;
  data: Record<string, string>;
  history: {
    stage: string;
    actor: string;
    action: string;
    timestamp: string;
    note?: string;
  }[];
}

export interface WorkflowStage {
  id: string;
  name: string;
  actor: string; // Role or department
  description: string;
}

export interface WorkflowConfig {
  id: 'purchase' | 'warranty';
  name: string;
  description: string;
  stages: WorkflowStage[];
  documentsRequired: string[]; // Related document tags/types
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: Role;
  action: string;
  target: string;
  status: 'Thành công' | 'Thất bại';
}
