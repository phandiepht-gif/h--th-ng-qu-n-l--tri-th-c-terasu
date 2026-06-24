/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Document, FolderNode, SystemAccount, WorkflowConfig, WorkflowTicket, TrainingMaterial, AuditLog, Role } from '../types';

export const DIRECTORY_TREE: FolderNode = {
  name: 'TERASU',
  path: 'TERASU',
  children: [
    {
      name: '01. CHIẾN LƯỢC',
      path: 'TERASU/01. CHIẾN LƯỢC',
      children: [
        { name: 'Tầm nhìn', path: 'TERASU/01. CHIẾN LƯỢC/Tầm nhìn' },
        { name: 'Kế hoạch năm', path: 'TERASU/01. CHIẾN LƯỢC/Kế hoạch năm' },
        { name: 'OKR', path: 'TERASU/01. CHIẾN LƯỢC/OKR' },
        { name: 'Dự án', path: 'TERASU/01. CHIẾN LƯỢC/Dự án' }
      ]
    },
    {
      name: '02. HCNS',
      path: 'TERASU/02. HCNS',
      children: [
        { name: 'Nhân sự', path: 'TERASU/02. HCNS/Nhân sự' },
        { name: 'Hợp đồng', path: 'TERASU/02. HCNS/Hợp đồng' },
        { name: 'KPI', path: 'TERASU/02. HCNS/KPI' },
        { name: 'Đào tạo', path: 'TERASU/02. HCNS/Đào tạo' },
        { name: 'Nội quy', path: 'TERASU/02. HCNS/Nội quy' }
      ]
    },
    {
      name: '03. MARKETING',
      path: 'TERASU/03. MARKETING',
      children: [
        { name: 'Hình ảnh', path: 'TERASU/03. MARKETING/Hình ảnh' },
        { name: 'Video', path: 'TERASU/03. MARKETING/Video' },
        { name: 'Content', path: 'TERASU/03. MARKETING/Content' },
        { name: 'POSM', path: 'TERASU/03. MARKETING/POSM' },
        { name: 'Thương hiệu', path: 'TERASU/03. MARKETING/Thương hiệu' }
      ]
    },
    {
      name: '04. KINH DOANH',
      path: 'TERASU/04. KINH DOANH',
      children: [
        { name: 'Đại lý', path: 'TERASU/04. KINH DOANH/Đại lý' },
        { name: 'Chính sách', path: 'TERASU/04. KINH DOANH/Chính sách' },
        { name: 'Báo giá', path: 'TERASU/04. KINH DOANH/Báo giá' },
        { name: 'Catalogue', path: 'TERASU/04. KINH DOANH/Catalogue' },
        { name: 'Chương trình bán hàng', path: 'TERASU/04. KINH DOANH/Chương trình bán hàng' }
      ]
    },
    {
      name: '05. KẾ TOÁN',
      path: 'TERASU/05. KẾ TOÁN',
      children: [
        { name: 'Thuế', path: 'TERASU/05. KẾ TOÁN/Thuế' },
        { name: 'Công nợ', path: 'TERASU/05. KẾ TOÁN/Công nợ' },
        { name: 'Báo cáo', path: 'TERASU/05. KẾ TOÁN/Báo cáo' },
        { name: 'Ngân sách', path: 'TERASU/05. KẾ TOÁN/Ngân sách' }
      ]
    },
    {
      name: '06. MUA HÀNG',
      path: 'TERASU/06. MUA HÀNG',
      children: [
        { name: 'NCC Trung Quốc', path: 'TERASU/06. MUA HÀNG/NCC Trung Quốc' },
        { name: 'NCC Việt Nam', path: 'TERASU/06. MUA HÀNG/NCC Việt Nam' },
        { name: 'HS Code', path: 'TERASU/06. MUA HÀNG/HS Code' },
        { name: 'Hợp đồng', path: 'TERASU/06. MUA HÀNG/Hợp đồng' },
        { name: 'Báo giá', path: 'TERASU/06. MUA HÀNG/Báo giá' }
      ]
    },
    {
      name: '07. KHO',
      path: 'TERASU/07. KHO',
      children: [
        { name: 'SOP', path: 'TERASU/07. KHO/SOP' },
        { name: 'Kiểm kê', path: 'TERASU/07. KHO/Kiểm kê' },
        { name: 'Layout kho', path: 'TERASU/07. KHO/Layout kho' },
        { name: 'Hướng dẫn', path: 'TERASU/07. KHO/Hướng dẫn' }
      ]
    },
    {
      name: '08. QC KỸ THUẬT',
      path: 'TERASU/08. QC KỸ THUẬT',
      children: [
        { name: 'Tiêu chuẩn', path: 'TERASU/08. QC KỸ THUẬT/Tiêu chuẩn' },
        { name: 'Lỗi sản phẩm', path: 'TERASU/08. QC KỸ THUẬT/Lỗi sản phẩm' },
        { name: 'Bản vẽ', path: 'TERASU/08. QC KỸ THUẬT/Bản vẽ' },
        { name: 'Video kỹ thuật', path: 'TERASU/08. QC KỸ THUẬT/Video kỹ thuật' }
      ]
    },
    {
      name: '09. DỊCH VỤ SỬA CHỮA',
      path: 'TERASU/09. DỊCH VỤ SỬA CHỮA',
      children: [
        { name: 'SOP sửa chữa', path: 'TERASU/09. DỊCH VỤ SỬA CHỮA/SOP sửa chữa' },
        { name: 'Đào tạo thợ', path: 'TERASU/09. DỊCH VỤ SỬA CHỮA/Đào tạo thợ' },
        { name: 'Bảo hành', path: 'TERASU/09. DỊCH VỤ SỬA CHỮA/Bảo hành' },
        { name: 'Hình ảnh thực tế', path: 'TERASU/09. DỊCH VỤ SỬA CHỮA/Hình ảnh thực tế' }
      ]
    },
    {
      name: '10. PHÁP LÝ',
      path: 'TERASU/10. PHÁP LÝ',
      children: [
        { name: 'Giấy phép', path: 'TERASU/10. PHÁP LÝ/Giấy phép' },
        { name: 'Thương hiệu', path: 'TERASU/10. PHÁP LÝ/Thương hiệu' },
        { name: 'Hợp đồng', path: 'TERASU/10. PHÁP LÝ/Hợp đồng' },
        { name: 'Văn bản pháp luật', path: 'TERASU/10. PHÁP LÝ/Văn bản pháp luật' }
      ]
    },
    {
      name: '11. TÀI KHOẢN HỆ THỐNG',
      path: 'TERASU/11. TÀI KHOẢN HỆ THỐNG',
      children: [
        { name: 'Email', path: 'TERASU/11. TÀI KHOẢN HỆ THỐNG/Email' },
        { name: 'Facebook', path: 'TERASU/11. TÀI KHOẢN HỆ THỐNG/Facebook' },
        { name: 'TikTok', path: 'TERASU/11. TÀI KHOẢN HỆ THỐNG/TikTok' },
        { name: 'Website', path: 'TERASU/11. TÀI KHOẢN HỆ THỐNG/Website' },
        { name: 'Hosting', path: 'TERASU/11. TÀI KHOẢN HỆ THỐNG/Hosting' },
        { name: 'Phần mềm', path: 'TERASU/11. TÀI KHOẢN HỆ THỐNG/Phần mềm' }
      ]
    }
  ]
};

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    code: 'TRS-SOP-MH-01',
    name: 'Quy trình mua hàng nước ngoài & nhập khẩu linh kiện',
    type: 'SOP/Quy trình',
    department: 'MUA HÀNG',
    categoryPath: 'TERASU/06. MUA HÀNG/NCC Trung Quốc',
    creator: 'Trần Minh Quang (Trưởng Phòng Purchase)',
    approver: 'Nguyễn Văn Terasu (CEO)',
    createdAt: '2026-01-10',
    updatedAt: '2026-05-15',
    version: '2.1',
    status: 'Ban hành',
    tags: ['SOP', 'Mua hàng', 'Nhập khẩu', 'Trung Quốc', 'Hợp đồng'],
    accessRights: ['CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE'],
    contentSummary: 'Quy trình chi tiết liên hệ nhà cung cấp Trung Quốc, đàm phán hợp đồng thương mại, mở L/C thanh toán quốc tế, khai báo tờ khai hải quan nhập khẩu phụ tùng xích, nhông xe máy, má phanh dĩa thương hiệu TERASU.'
  },
  {
    id: 'doc-2',
    code: 'TRS-BG-DID-2026',
    name: 'Báo giá xích DID Nhật Bản nhập khẩu kì tháng 6',
    type: 'Báo giá/Hợp đồng',
    department: 'MUA HÀNG',
    categoryPath: 'TERASU/06. MUA HÀNG/Báo giá',
    creator: 'Lê Kiều Mỹ (Phó Phòng Purchase)',
    approver: 'Trần Minh Quang (Trưởng Phòng Purchase)',
    createdAt: '2026-06-01',
    updatedAt: '2026-06-01',
    version: '1.0',
    status: 'Ban hành',
    tags: ['DID', 'Xích', 'Báo giá', 'Mua hàng', '2026', 'Nhập khẩu'],
    accessRights: ['CEO', 'DIRECTOR', 'HEAD'],
    contentSummary: 'Bản báo giá xích tải DID nhập khẩu chính cơ quan đại diện Việt Nam, chiết khấu đại lý cấp 1 năm 2026. Bao gồm sên DID 428D, 428HD vàng, sên phốt cao su đen DID T-Ring áp dụng cho xe Honda Wave, Yamaha Exciter.'
  },
  {
    id: 'doc-3',
    code: 'TRS-SOP-BH-03',
    name: 'Quy trình bảo hành ắc quy khô xe máy TERASU',
    type: 'SOP/Quy trình',
    department: 'DỊCH VỤ SỬA CHỮA',
    categoryPath: 'TERASU/09. DỊCH VỤ SỬA CHỮA/Bảo hành',
    creator: 'Nguyễn Kỹ Thuật (Trưởng Bộ Phận QC)',
    approver: 'Phạm Đức Long (Giám Đốc Vận Hành)',
    createdAt: '2026-02-14',
    updatedAt: '2026-06-12',
    version: '3.0',
    status: 'Ban hành',
    tags: ['Ắc quy', 'Bảo hành', 'Kỹ thuật', 'Dịch vụ', 'SOP'],
    accessRights: ['CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE', 'CUSTOMER', 'SUPPLIER'],
    contentSummary: 'Quy chuẩn đổi mới ắc quy xe máy TERASU lỗi hụt điện, phồng rộp vỏ, chết cell do lỗi sản xuất. Tiếp nhận từ khách hàng tại các trạm dịch vụ, đo thông số Ampe/Volt, xác nhận lỗi nhà sản xuất, QC duyệt và viết phiếu xuất kho đổi mới trong 24h.'
  },
  {
    id: 'doc-4',
    code: 'TRS-PL-HS-01',
    name: 'Hồ sơ mã HS Code nhông xích và phụ tùng xe máy',
    type: 'Hồ sơ pháp lý',
    department: 'MUA HÀNG',
    categoryPath: 'TERASU/06. MUA HÀNG/HS Code',
    creator: 'Trần Minh Quang (Trưởng Phòng Purchase)',
    approver: 'Nguyễn Văn Terasu (CEO)',
    createdAt: '2025-05-20',
    updatedAt: '2026-04-01',
    version: '1.4',
    status: 'Ban hành',
    tags: ['HS Code', 'Mua hàng', 'Pháp lý', 'Phụ tùng', 'Hải quan'],
    accessRights: ['CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE'],
    contentSummary: 'Danh mục mã HS Code hải quan áp dụng đối với hàng phụ tùng xe gắn máy nhập khẩu: Nhông xe Wave (Mã HS: 8714.10.90), Xích tải truyền động (Mã HS: 7315.11.90), Vòng bi bạc đạn (Mã HS: 8482.10.00). Thuế nhập khẩu ưu đãi đặc biệt C/O Form E.'
  },
  {
    id: 'doc-5',
    code: 'TRS-DT-SP-02',
    name: 'Video đào tạo quy trình kiểm tra xích nhông sên dĩa TERASU',
    type: 'Tài liệu đào tạo',
    department: 'DỊCH VỤ SỬA CHỮA',
    categoryPath: 'TERASU/09. DỊCH VỤ SỬA CHỮA/Đào tạo thợ',
    creator: 'Nguyễn Văn Hoàng (Chuyên Gia Kỹ Thuật)',
    approver: 'Nguyễn Kỹ Thuật (Trưởng Bộ Phận QC)',
    createdAt: '2026-03-25',
    updatedAt: '2026-03-25',
    version: '1.2',
    status: 'Ban hành',
    tags: ['Xích', 'Sản phẩm', 'Kỹ thuật', 'Đào tạo', 'Video'],
    accessRights: ['CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE'],
    contentSummary: 'Clip hướng dẫn đo độ rơ sên dĩa, cách bôi trơn bảo dưỡng định kỳ bằng chai xịt sên chuyên dụng TERASU Chain Lube, phát hiện lỗi mòn không đều để khuyến khích khách hàng thay thế combo nhông sên dĩa để giữ an toàn.'
  },
  {
    id: 'doc-6',
    code: 'TRS-SOP-DL-02',
    name: 'Quy trình hướng dẫn mở đại lý ký gửi cấp 1',
    type: 'SOP/Quy trình',
    department: 'KINH DOANH',
    categoryPath: 'TERASU/04. KINH DOANH/Đại lý',
    creator: 'Nguyễn Kinh Doanh (Trưởng Phòng Sales)',
    approver: 'Nguyễn Văn Terasu (CEO)',
    createdAt: '2026-01-15',
    updatedAt: '2026-05-18',
    version: '2.0',
    status: 'Ban hành',
    tags: ['Đại lý', 'Chính sách', 'SOP', 'Kinh doanh', 'Phát triển thương hiệu'],
    accessRights: ['CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE'],
    contentSummary: 'Điều kiện mở đại lý phân phối phụ tùng xe máy TERASU độc quyền khu vực: Showroom trưng bày tối thiểu 20m2, đơn hàng tối thiểu ban đầu 50 triệu đồng, cam kết bảng hiệu độc quyền TERASU, chính sách hoa hồng lũy tiến lên đến 15%.'
  },
  {
    id: 'doc-7',
    code: 'TRS-MARK-POSM-04',
    name: 'Thiết kế biển hiệu đại lý ủy quyền TERASU 2026',
    type: 'Hình ảnh QC',
    department: 'MARKETING',
    categoryPath: 'TERASU/03. MARKETING/POSM',
    creator: 'Lê Mỹ Thuật (Thiết Kế Đồ Họa)',
    approver: 'Phạm Đức Long (Giám Đốc Vận Hành)',
    createdAt: '2026-05-02',
    updatedAt: '2026-05-05',
    version: '1.1',
    status: 'Ban hành',
    tags: ['POSM', 'Biển hiệu', 'Marketing', 'Hình ảnh', 'Đại lý'],
    accessRights: ['CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE', 'CUSTOMER', 'SUPPLIER'],
    contentSummary: 'Phác thảo 3D và kích thước tiêu chuẩn của bảng hiệu Alu ngoài trời dành cho các tiệm sửa xe máy kết hợp bán phụ tùng liên kết nhãn hàng TERASU. Code màu đỏ cam chủ đạo #FF4500 phối nền đen tinh tế.'
  },
  {
    id: 'doc-8',
    code: 'TRS-KT-CC-2026',
    name: 'Biểu mẫu đề nghị thanh toán nhà cung cấp',
    type: 'Biểu mẫu',
    department: 'KẾ TOÁN',
    categoryPath: 'TERASU/05. KẾ TOÁN/Thuế',
    creator: 'Trần Thị Thuế (Kế Toán Trưởng)',
    approver: 'Nguyễn Văn Terasu (CEO)',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    version: '1.0',
    status: 'Ban hành',
    tags: ['Biểu mẫu', 'Excel', 'Thanh toán', 'Thu chi', 'Kế toán'],
    accessRights: ['CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE'],
    contentSummary: 'File Excel chuẩn ban hành toàn doanh nghiệp phục vụ lập đề nghị thanh toán tạm ứng hoặc quyết toán hóa đơn mua hàng có chữ ký của Trưởng phòng đề xuất, Kế toán trưởng kiểm soát và Giám đốc phê duyệt.'
  },
  {
    id: 'doc-9',
    code: 'TRS-QC-TS-2026',
    name: 'Bản vẽ chi tiết nhông trước sên dĩa Wave 110cc',
    type: 'Hình ảnh QC',
    department: 'QC KỸ THUẬT',
    categoryPath: 'TERASU/08. QC KỸ THUẬT/Bản vẽ',
    creator: 'Vũ Kỹ Sư (Kỹ sư R&D)',
    approver: 'Nguyễn Kỹ Thuật (Trưởng Bộ Phận QC)',
    createdAt: '2025-11-12',
    updatedAt: '2026-02-18',
    version: '2.4',
    status: 'Ban hành',
    tags: ['Bản vẽ', 'Nhông', 'Wave', 'Kỹ thuật', 'Tiêu chuẩn'],
    accessRights: ['CEO', 'DIRECTOR', 'HEAD', 'SUPPLIER'],
    contentSummary: 'Bản vẽ kỹ thuật chi tiết bước răng sên 428, thông số lỗ cốt nhông 17mm áp dụng cho xe Honda Wave Alpha 110cc, quy định dung sai cho phép +/- 0.02mm, độ cứng bề mặt nhiệt luyện đạt 45-50 HRC.'
  },
  {
    id: 'doc-10',
    code: 'TRS-SOP-KHO-01',
    name: 'Quy trình kiểm kê và sắp xếp kho phụ tùng',
    type: 'SOP/Quy trình',
    department: 'KHO',
    categoryPath: 'TERASU/07. KHO/SOP',
    creator: 'Lương Kho Bãi (Quản Lý Kho)',
    approver: 'Phạm Đức Long (Giám Đốc Vận Hành)',
    createdAt: '2026-02-05',
    updatedAt: '2026-02-05',
    version: '1.0',
    status: 'Ban hành',
    tags: ['SOP', 'Kho', 'Kiểm kê', 'Layout kho', 'Vận hành'],
    accessRights: ['CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE'],
    contentSummary: 'Quy tắc dán mã QR nhãn phụ tùng sên dĩa, bố trí khu vực sắp xếp hàng DID riêng biệt, hàng thương hiệu bình dân riêng lẻ. Quy trình kiểm kho đột xuất cuối tháng đối chiếu phần mềm bán hàng ERP báo cáo chênh lệch.'
  }
];

export const INITIAL_ACCOUNTS: SystemAccount[] = [
  {
    id: 'acc-1',
    platform: 'Facebook',
    serviceName: 'Fanpage Phụ Tùng Xe Máy TERASU chính hãng',
    url: 'https://facebook.com/terasu.vietnam',
    username: 'admin_terasu_page (Lê Mỹ Thuật quản lý)',
    manager: 'Phạm Đức Long (Giám đốc Marketing)',
    createdAt: '2025-04-12',
    renewalDate: 'N/A',
    cost: 0,
    accessRights: ['CEO', 'DIRECTOR', 'HEAD'],
    notes: 'Kênh truyền thông phân phối chính thức, quảng cáo chương trình tặng bóng đèn hậu bôi trơn sên DID.'
  },
  {
    id: 'acc-2',
    platform: 'TikTok',
    serviceName: 'Kênh TikTok Đào tạo Kỹ thuật Xe TERASU',
    url: 'https://tiktok.com/@terasu.racing',
    username: 'terasu_racing_official',
    manager: 'Lê Kiều Mỹ (Marketing Leader)',
    createdAt: '2025-08-01',
    renewalDate: 'N/A',
    cost: 1500000,
    accessRights: ['CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE'],
    notes: 'Kênh hướng dẫn thợ các mẹo rửa sên xe máy, bảo quản rơ lốp. Chi phí mua đồ dùng phụ trợ quay video hàng tháng.'
  },
  {
    id: 'acc-3',
    platform: 'Website',
    serviceName: 'Trang chủ Hệ thống Đại lý Terasu.vn',
    url: 'https://www.terasu.vn',
    username: 'terasu_wordpress_admin',
    manager: 'Nguyễn Văn Terasu (CEO)',
    createdAt: '2025-01-01',
    renewalDate: '2027-01-01',
    cost: 5000000,
    accessRights: ['CEO', 'DIRECTOR'],
    notes: 'Cổng thông tin đại lý, tải catalogue phụ tùng sên dĩa, ắc quy khô. Quản lý bảng tra cứu lỗi cho thợ.'
  },
  {
    id: 'acc-4',
    platform: 'Hosting',
    serviceName: 'Cloud Server KDATA chứa dữ liệu hệ thống',
    url: 'https://kdata.vn/portal/services',
    username: 'hosting_kdata_terasu@gmail.com',
    manager: 'Trần Minh Quang (Trưởng Phòng Tech)',
    createdAt: '2025-01-01',
    renewalDate: '2026-10-01',
    cost: 12000000,
    accessRights: ['CEO', 'DIRECTOR'],
    notes: 'Nơi lưu trữ file source code ERP ban đầu và ứng dụng quản lý tài liệu. Gia hạn tự động bằng thẻ tín dụng công ty.'
  },
  {
    id: 'acc-5',
    platform: 'ChatGPT',
    serviceName: 'ChatGPT Plus Team Account cho R&D',
    url: 'https://chatgpt.com',
    username: 'team_ai_terasu@terasu.vn',
    manager: 'Trần Minh Quang (Trưởng Phòng Tech)',
    createdAt: '2026-02-01',
    renewalDate: '2026-07-01',
    cost: 1250000,
    accessRights: ['CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE'],
    notes: 'Sử dụng bản quyền Premium GPT-4 để lập trình tự động, dịch sổ tay tài liệu gốc từ đối tác sên dĩa Nhật Bản.'
  },
  {
    id: 'acc-6',
    platform: 'Canva',
    serviceName: 'Canva Pro Enterprise Thiết kế Banner',
    url: 'https://canva.com',
    username: 'design_terasu_creative@gmail.com',
    manager: 'Lê Mỹ Thuật (Thiết Kế Đồ Họa)',
    createdAt: '2025-05-15',
    renewalDate: '2026-05-15',
    cost: 3800000,
    accessRights: ['CEO', 'DIRECTOR', 'HEAD', 'EMPLOYEE'],
    notes: '3 tài khoản thiết kế biển hiệu đại lý, bài đăng Facebook sên súp-páp sên nhông dĩa dán decal TERASU.'
  }
];

export const WORKFLOWS: WorkflowConfig[] = [
  {
    id: 'purchase',
    name: 'Đề nghị mua hàng & Nhập kho quốc tế',
    description: 'Quy trình đệ trình phê duyệt báo giá từ nhà cung cấp lớn, đặt cọc mua hàng quốc tế, thông hải quan và nhập kho thành phẩm TERASU.',
    stages: [
      { id: '1_request', name: 'Đề xuất mua hàng', actor: 'Phòng Purchase', description: 'Trình lập tờ khai mua hàng kèm báo giá chi tiết sên dĩa, mã HS Code.' },
      { id: '2_approve', name: 'CEO Phê duyệt', actor: 'Ban Giám Đốc/CEO', description: 'Phân tích tài chính ngân sách phân bổ, phê chuẩn duyệt lệnh chi tiền đặt cọc.' },
      { id: '3_order', name: 'Đặt hàng & Sản xuất', actor: 'Nhà Cung Cấp', description: 'Đối tác khởi công sản xuất theo đúng lô mã số kỹ thuật được đặt thiết kế.' },
      { id: '4_customs', name: 'Thông quan Hải quan', actor: 'Nhân viên Xuất nhập khẩu', description: 'Nộp thuế, xác minh kiểm hóa thực tế của Cơ quan Hải quan cửa khẩu Việt Nam.' },
      { id: '5_warehouse', name: 'Nhập kho & QC', actor: 'Thủ kho & Kỹ thuật viên QC', description: 'Đối soát số lượng thùng nhận thực tế, lấy mẫu test độ kéo đứt xích sên trước khi xếp kệ.' },
      { id: '6_payment', name: 'Quyết quyết toán', actor: 'Phòng Kế toán', description: 'Chi trả nốt giá trị đợt 2 của hợp đồng và nhập tài liệu lưu trữ vào EKMS.' }
    ],
    documentsRequired: ['Báo giá/Hợp đồng', 'Biểu mẫu', 'SOP/Quy trình']
  },
  {
    id: 'warranty',
    name: 'Tiếp nhận & Xử lý bảo hành Phụ tùng',
    description: 'Lưu đồ từ lúc tiếp khố xích dĩa xe máy hỏng của khách tại các trạm sửa chữa, kiểm tra lỗi kĩ thuật, đổi mới và đền bù từ nhà máy.',
    stages: [
      { id: '1_receive', name: 'Tiếp nhận lỗi', actor: 'Nhân viên trạm/Cửa hàng', description: 'Ghi nhận thông tin xe đi mấy vạn km, chụp ảnh sên võng, xích chùng hoặc má phanh mòn.' },
      { id: '2_check', name: 'Kiểm tra kỹ thuật', actor: 'Kỹ thuật viên tại xưởng', description: 'Sử dụng thước đo tiêu chuẩn sên mòn và kiểm tra pin nén ắc quy hụt nguồn.' },
      { id: '3_qc', name: 'QC phê chuẩn', actor: 'Đội trưởng QC vùng', description: 'Phê duyệt phiếu đổi mới nếu xác định nứt chốt hay thủng bình từ ban đầu.' },
      { id: '4_replace', name: 'Đổi mới phụ tùng', actor: 'Thủ kho phụ tùng', description: 'Xuất hàng mới, hướng dẫn thợ đổi mới hoàn toàn miễn phí cho khách.' },
      { id: '5_archive', name: 'Đóng hồ sơ bảo hành', actor: 'Bộ phận Chăm sóc khách hàng', description: 'Khảo sát độ hài lòng của khách qua Zalo và đồng bộ dữ liệu hoàn trả hãng.' }
    ],
    documentsRequired: ['SOP/Quy trình', 'Hình ảnh QC', 'Biểu mẫu']
  }
];

export const INITIAL_TICKETS: WorkflowTicket[] = [
  {
    id: 't-1',
    workflowId: 'purchase',
    name: 'Đặt mua lô sên dĩa sỉ DID 428D vàng tháng 6/2026',
    currentStage: '3_order',
    updatedAt: '2026-06-18',
    creator: 'Trần Minh Quang',
    data: {
      'Nhà cung cấp': 'DID Kogyo Co. Ltd (Nhật Bản)',
      'Số lượng': '5,000 bộ xích sên dĩa',
      'Giá trị dự tính': '1.2 Tỷ VNĐ',
      'Hình thức thanh toán': 'L/C trả thẳng sau kiểm hóa'
    },
    history: [
      { stage: '1_request', actor: 'Trần Minh Quang', action: 'Gửi đề xuất mua hàng sỉ', timestamp: '2026-06-10 09:30', note: 'Sản phẩm phục vụ chiến dịch mở rộng cửa hàng phía Nam.' },
      { stage: '2_approve', actor: 'CEO Nguyễn Văn Terasu', action: 'Phê duyệt cấp ngân sách đợt 1', timestamp: '2026-06-12 14:15', note: 'Duyệt nhanh để kịp chạy chiến dịch Marketing hè.' },
      { stage: '3_order', actor: 'DID Kogyo Overseas Sales', action: 'Nhận PO và xác minh lịch giao hàng', timestamp: '2026-06-15 11:00', note: 'Đã chuyển cọc 30% giá trị lô sên tải.' }
    ]
  },
  {
    id: 't-2',
    workflowId: 'warranty',
    name: 'Yêu cầu bảo hành Bình ắc quy khô xe Honda Lead 125',
    currentStage: '4_replace',
    updatedAt: '2026-06-22',
    creator: 'Đại lý TERASU Cầu Giấy',
    data: {
      'Khách hàng': 'Phan Điệp (Hà Nội)',
      'Mã bình ắc quy': 'TRS-BT-091',
      'Triệu chứng': 'Đang đi sụt áp bất chợt còn 9V, còi bé, bấm đề không ăn',
      'Đánh giá kĩ thuật': 'Chết cell bên trong do đầu cực gia nhiệt hàn lỗi phát sinh'
    },
    history: [
      { stage: '1_receive', actor: 'Lê Thợ Máy (Trạm sỹ Cầu Giấy)', action: 'Nhận bình lỗi của anh Điệp gửi', timestamp: '2026-06-20 10:00' },
      { stage: '2_check', actor: 'KTV Nguyễn Chí Thanh', action: 'Đo điện áp xả dưới tải', timestamp: '2026-06-20 10:45', note: 'Sản lượng nạp chỉ giữ 9V dưới dòng phóng lớn.' },
      { stage: '3_qc', actor: 'QC Trưởng Hà Nội (Vũ Thể)', action: 'Duyệt thay thế ắc quy mới 100%', timestamp: '2026-06-21 08:30', note: 'Áp dụng quy chuẩn bảo hành xe máy 12 tháng TERASU.' },
      { stage: '4_replace', actor: 'Thủ kho chi nhánh', action: 'Nhận phiếu và đang hoàn thiện xuất mới', timestamp: '2026-06-22 15:40' }
    ]
  }
];

export const TRAINING_CURRICULUM: TrainingMaterial[] = [
  {
    id: 'tm-1',
    title: 'Khóa học Đào tạo Hội nhập văn hóa TERASU',
    category: 'Văn hóa',
    duration: '45 phút',
    slidesCount: 18,
    description: 'Quy chuẩn hành ứng xử chuyên nghiệp của nhân viên, tư tưởng cốt lõi của ban lãnh đạo và sơ đồ tổ chức phòng ban và đại lý liên kết.',
    quiz: [
      {
        question: 'Giá trị cốt lõi hàng đầu của hệ thống phụ tùng xe máy TERASU là gì?',
        options: [
          'A. Bán rẻ nhất thị trường bất chấp xuất xứ',
          'B. Chất lượng an toàn kỹ thuật là sinh mệnh, luôn minh bạch giấy tờ HS Code và CO/CQ',
          'C. Đổi trả không cần lý do kể cả do khách làm rơi vỡ',
          'D. Chỉ tập trung chăm sóc khách lớn bỏ qua khách sỉ nhỏ lẻ'
        ],
        correctAnswer: 1,
        explanation: 'Đối với TERASU, uy tín từ CO/CQ và độ bền kéo, khả năng chống nứt sên là danh dự của người sáng lập.'
      }
    ]
  },
  {
    id: 'tm-2',
    title: 'Kiến thức Sản phẩm: Hệ Nhông Sên Dĩa (Chain & Sprockets) TERASU & DID',
    category: 'Sản phẩm',
    duration: '60 phút',
    slidesCount: 32,
    pdfAttached: 'Camket_Sanpham_DID_Terasu.pdf',
    description: 'Chi tiết thông số kỹ thuật bộ nhông sên dĩa dành cho dòng xe cỏ Wave, Dream và xe côn tay Winner, Exciter. Phân biệt thép C45 dán nhiệt mạ titanium.',
    quiz: [
      {
        question: 'Đối với xe Honda Wave 110cc, mã xích tải tiêu chuẩn của hãng thường có thông số là gì?',
        options: [
          'A. Sên mã 520 (xích tải siêu lớn của xe phân khối lớn)',
          'B. Sên mã 428 (hoặc thường gọi sên 9 ly, tương ứng độ dày và độ khít răng 12.7mm)',
          'C. Sên mã 415 (bản mỏng dành cho xe đạp điện)',
          'D. Sên mã 420 (dày bản nhỏ)'
        ],
        correctAnswer: 1,
        explanation: 'Nhông dĩa sên xe 100-110cc tại Đông Nam Á sử dụng thông số 428 (9ly hoặc 10ly) để chịu lực bền bỉ hàng vạn dặm.'
      },
      {
        question: 'Ý nghĩa của mã xuất xứ Form E trên CO (Certificate of Origin) khi nhập khẩu nhông dĩa TERASU là gì?',
        options: [
          'A. Nhập khẩu trực tiếp từ thị trường Châu Âu',
          'B. Hàng xuất xứ từ các nước thành viên ASEAN và Trung Quốc được hưởng thuế suất nhập khẩu ưu đãi đặc biệt',
          'C. Hàng tự sản xuất gia công tại Việt Nam',
          'D. Sản xuất tại Nhật Bản xuất khẩu'
        ],
        correctAnswer: 1,
        explanation: 'Tờ khai gốc C/O Form E thể hiện xuất xứ hàng hóa sản xuất theo hiệp định biên mậu Trung Quốc - ASEAN giúp tối ưu thuế quan xuống còn 0%.'
      }
    ]
  },
  {
    id: 'tm-3',
    title: 'Kỹ thuật: Sổ tay chẩn đoán sụt nguồn Ắc quy khô & Cách thay thế sửa chữa an toàn',
    category: 'Kỹ thuật',
    duration: '90 phút',
    videoUrl: 'https://vimeo.com/simulated_terasu_battery_training',
    description: 'Quy chuẩn 6 bước kiểm tra hỏng hóc ắc quy, vệ sinh 2 đầu cọc âm dương, lắp đặt chặt khít khay dập sườn xe máy không lo rung chấn.',
    quiz: [
      {
        question: 'Khi đo điện áp ắc quy xe máy đã nạp căng mà không có tải tiêu thụ, đồng hồ vạn năng tối thiểu phải báo bao nhiêu Volt để coi là tốt?',
        options: [
          'A. Dưới 10.5 Volt',
          'B. Từ 12.4 Volt đến 12.8 Volt',
          'C. Đủ 24 Volt',
          'D. Chỉ cần sáng đèn nhỏ'
        ],
        correctAnswer: 1,
        explanation: 'Ắc quy chì-axit hoặc ắc quy Gel TERASU đầy điện ở trạng thái chờ không tải phải báo trên 12.4V (thường là 12.6V - 12.8V).'
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'al-1',
    timestamp: '2026-06-23 08:30:11',
    user: 'Trần Minh Quang',
    role: 'HEAD',
    action: 'Tìm kiếm Từ khóa',
    target: 'báo giá DID sên vàng kì tháng 6',
    status: 'Thành công'
  },
  {
    id: 'al-2',
    timestamp: '2026-06-23 08:12:45',
    user: 'Nguyễn Văn Terasu',
    role: 'CEO',
    action: 'Phê duyệt quy trình',
    target: 'TRS-SOP-BH-03 Quy trình bảo hành ắc quy khô xe máy',
    status: 'Thành công'
  },
  {
    id: 'al-3',
    timestamp: '2026-06-23 08:05:00',
    user: 'Lê Thợ Máy',
    role: 'EMPLOYEE',
    action: 'Xem tài liệu đào tạo thợ',
    target: 'Kiểu sên xe dòng Wave và Dream 110cc',
    status: 'Thành công'
  },
  {
    id: 'al-4',
    timestamp: '2026-06-23 07:45:12',
    user: 'Đại diện DID Kogyo',
    role: 'SUPPLIER',
    action: 'Cố gắng truy cập thư mục chiến lược lương thưởng',
    target: '02. HCNS/Nhân sự/Bảng Lương Đội Hướng Dẫn',
    status: 'Thất bại'
  }
];

export const RACI_MATRIX = [
  { activity: 'Thiết lập Chiến lược hàng năm', r: 'Ban Giám Đốc', a: 'CEO Nguyễn Văn Terasu', c: 'Trưởng bộ phận', i: 'Khách hàng / Đại lý' },
  { activity: 'Mua hàng Trung Quốc & Kiểm CO Form E', r: 'Nhân viên Mua hàng', a: 'Trưởng phòng Purchase', c: 'CEO', i: 'Kế toán trưởng' },
  { activity: 'Bảo hành ắc quy & phụ tùng lỗi', r: 'KTV Trạm sửa chữa', a: 'QC sên dĩa Vùng', c: 'Phòng Purchase đối chiếu', i: 'Khách hàng' },
  { activity: 'Kiểm kê định kì cuối quý', r: 'Thủ kho & Nhân sự hỗ trợ', a: 'Giám đốc Vận hành', c: 'Kế toán tổng hợp', i: 'CEO Nguyễn Văn Terasu' },
  { activity: 'Quản trị Fanpage & Kênh TikTok', r: 'Content Creator', a: 'Marketing Leader', c: 'Trưởng phòng Sales', i: 'Toàn hệ thống' },
  { activity: 'Cập nhật tài khoản dùng chung Canva, Zoom', r: 'Nhân viên Hành chính', a: 'Trưởng phòng Tech & Marketing', c: 'Chi phí duyệt kế toán', i: 'Nhân viên được cấp quyền' }
];
