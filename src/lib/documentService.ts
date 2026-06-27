import { supabase } from './supabase'

export async function saveDocumentToSupabase(params: {
  title: string
  code?: string
  docType: string
  version: string
  tags: string[]
  isPublic: boolean
  description?: string
}): Promise<{ id: string } | null> {
  const typeMap: Record<string, string> = {
    'SOP/Quy trinh': 'SOP_QUY_TRINH',
    'SOP/Quy trình': 'SOP_QUY_TRINH',
    'Báo giá/Hợp đồng': 'BAO_GIA_HOP_DONG',
    'Tài liệu đào tạo': 'TAI_LIEU_DAO_TAO',
    'Hồ sơ pháp lý': 'HO_SO_PHAP_LY',
    'Hình ảnh QC': 'ANH_KY_THUAT',
    'Biểu mẫu': 'BIEN_MAU'
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
      view_count: 0
    }])
    .select('id')
    .single()
  if (error) { console.error('Supabase save error:', error.message); return null }
  return data
}
