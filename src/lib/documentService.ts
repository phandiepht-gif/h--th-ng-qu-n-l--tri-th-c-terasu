import { supabase } from './supabase'

const typeMap: Record<string, string> = {
  'SOP/Quy trinh': 'SOP_QUY_TRINH',
  'SOP/Quy trình': 'SOP_QUY_TRINH',
  'Báo giá/Hợp đồng': 'BAO_GIA_HOP_DONG',
  'Tài liệu đào tạo': 'TAI_LIEU_DAO_TAO',
  'Hồ sơ pháp lý': 'HO_SO_PHAP_LY',
  'Hình ảnh QC': 'ANH_KY_THUAT',
  'Biểu mẫu': 'BIEN_MAU'
}

// Map giá trị docDept (UI) -> code trong bảng folders
const deptToFolderCode: Record<string, string> = {
  'MUA HÀNG': 'MUA_HANG',
  'KINH DOANH': 'KINH_DOANH',
  'HCNS': 'HCNS',
  'QC_TECH': 'QC_KY_THUAT',
  'SERVICE': 'DICH_VU_SUA_CHUA',
  'KẾ TOÁN': 'KE_TOAN'
}

let folderCache: { id: string; code: string }[] | null = null

async function getFolderIdByDept(dept: string): Promise<string | null> {
  if (!folderCache) {
    const { data, error } = await supabase.from('folders').select('id, code')
    if (error) { console.error('Lỗi tải danh sách folders:', error.message); return null }
    folderCache = data
  }
  const folderCode = deptToFolderCode[dept]
  if (!folderCode) return null
  const match = folderCache.find(f => f.code === folderCode)
  return match ? match.id : null
}

export async function saveDocumentToSupabase(params: {
  title: string
  code?: string
  docType: string
  version: string
  tags: string[]
  isPublic: boolean
  description?: string
  dept: string
  file?: File | null
}): Promise<{ id: string } | null> {

  const folderId = await getFolderIdByDept(params.dept)
  if (!folderId) {
    console.warn(`Không tìm thấy folder tương ứng với phòng ban "${params.dept}". Tài liệu sẽ được lưu KHÔNG có folder_id.`)
  }

  let fileUrl: string | null = null
  let fileType: string | null = null
  let fileSizeKb: number | null = null

  if (params.file) {
    const ext = params.file.name.split('.').pop()
    const storagePath = `documents/${Date.now()}_${params.file.name}`

    const { error: uploadError } = await supabase
      .storage
      .from('documents')
      .upload(storagePath, params.file, { upsert: false })

    if (uploadError) {
      console.error('Lỗi upload file lên Storage:', uploadError.message)
    } else {
      const { data: publicUrlData } = supabase
        .storage
        .from('documents')
        .getPublicUrl(storagePath)
      fileUrl = publicUrlData.publicUrl
      fileType = ext || null
      fileSizeKb = Math.round(params.file.size / 1024)
    }
  }

  const { data, error } = await supabase
    .from('documents')
    .insert([{
      code: params.code || null,
      title: params.title,
      description: params.description || null,
      doc_type: typeMap[params.docType] || 'SOP_QUY_TRINH',
      version: params.version,
      tags: params.tags,
      is_public: params.isPublic,
      view_count: 0,
      folder_id: folderId,
      file_url: fileUrl,
      file_type: fileType,
      file_size_kb: fileSizeKb
    }])
    .select('id')
    .single()

  if (error) { console.error('Supabase save error:', error.message); return null }
  return data
}
