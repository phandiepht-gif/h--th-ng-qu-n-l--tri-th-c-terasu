import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { uploadFile } from '../lib/storage'

export interface UploadResult {
  success: boolean
  fileUrl?: string
  error?: string
}

export function useDocumentUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  async function uploadDocument(params: {
    file: File
    title: string
    code: string
    docType: string
    folderId?: string
    tags: string[]
    version: string
    isPublic: boolean
    description?: string
  }): Promise<UploadResult> {
    setUploading(true)
    setProgress(10)

    try {
      // 1. Upload file len Supabase Storage
      const folderPath = params.folderId || 'general'
      setProgress(30)
      const fileUrl = await uploadFile(params.file, folderPath)
      
      if (!fileUrl) {
        setUploading(false)
        return { success: false, error: 'Upload file that bai' }
      }

      setProgress(60)

      // 2. Luu metadata vao bang documents
      const fileExt = params.file.name.split('.').pop()?.toLowerCase() || ''
      const fileSizeKb = Math.round(params.file.size / 1024)

      const { data, error } = await supabase
        .from('documents')
        .insert([{
          code: params.code || null,
          title: params.title,
          description: params.description || null,
          doc_type: mapDocType(params.docType),
          folder_id: params.folderId || null,
          file_url: fileUrl,
          file_type: fileExt,
          file_size_kb: fileSizeKb,
          version: params.version,
          tags: params.tags,
          is_public: params.isPublic,
          view_count: 0
        }])
        .select()
        .single()

      setProgress(100)
      setUploading(false)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, fileUrl }

    } catch (err) {
      setUploading(false)
      return { success: false, error: 'Loi khong xac dinh' }
    }
  }

  function mapDocType(type: string): string {
    const map: Record<string, string> = {
      'SOP/Quy trinh': 'SOP_QUY_TRINH',
      'SOP/Quy trình': 'SOP_QUY_TRINH',
      'Bao gia/Hop dong': 'BAO_GIA_HOP_DONG',
      'Báo giá/Hợp đồng': 'BAO_GIA_HOP_DONG',
      'Tai lieu dao tao': 'TAI_LIEU_DAO_TAO',
      'Tài liệu đào tạo': 'TAI_LIEU_DAO_TAO',
      'Ho so phap ly': 'HO_SO_PHAP_LY',
      'Hồ sơ pháp lý': 'HO_SO_PHAP_LY',
      'Hinh anh QC': 'ANH_KY_THUAT',
      'Hình ảnh QC': 'ANH_KY_THUAT',
      'Bieu mau': 'BIEN_MAU',
      'Biểu mẫu': 'BIEN_MAU'
    }
    return map[type] || 'SOP_QUY_TRINH'
  }

  return { uploadDocument, uploading, progress }
}
