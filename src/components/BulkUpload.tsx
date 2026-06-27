import React, { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { uploadFile } from '../lib/storage'
import { useFolders } from '../hooks/useFolders'

interface FileItem {
  file: File
  title: string
  folderId: string
  docType: string
  tags: string
  status: 'pending' | 'uploading' | 'done' | 'error'
  progress: number
  error?: string
}

export default function BulkUpload({ currentRole }: { currentRole: string }) {
  const { folders } = useFolders()
  const [files, setFiles] = useState<FileItem[]>([])
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const docTypes = [
    { value: 'SOP_QUY_TRINH', label: 'SOP / Quy trình' },
    { value: 'BAO_GIA_HOP_DONG', label: 'Báo giá / H?p d?ng' },
    { value: 'TAI_LIEU_DAO_TAO', label: 'Tài li?u dào t?o' },
    { value: 'HO_SO_PHAP_LY', label: 'H? so pháp lý' },
    { value: 'ANH_KY_THUAT', label: 'Hình ?nh / QC' },
    { value: 'BIEN_MAU', label: 'Bi?u m?u' }
  ]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    const newFiles: FileItem[] = selected.map(f => ({
      file: f,
      title: f.name.replace(/\.[^/.]+$/, ''),
      folderId: folders[0]?.id || '',
      docType: 'SOP_QUY_TRINH',
      tags: '',
      status: 'pending',
      progress: 0
    }))
    setFiles(prev => [...prev, ...newFiles])
  }

  const updateFile = (index: number, updates: Partial<FileItem>) => {
    setFiles(prev => prev.map((f, i) => i === index ? { ...f, ...updates } : f))
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadAll = async () => {
    setUploading(true)
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'done') continue
      updateFile(i, { status: 'uploading', progress: 10 })
      try {
        const f = files[i]
        const fileUrl = await uploadFile(f.file, f.folderId || 'general')
        updateFile(i, { progress: 60 })
        if (!fileUrl) { updateFile(i, { status: 'error', error: 'Upload file th?t b?i' }); continue }
        const { error } = await supabase.from('documents').insert([{
          title: f.title,
          doc_type: f.docType,
          folder_id: f.folderId || null,
          file_url: fileUrl,
          file_type: f.file.name.split('.').pop()?.toLowerCase(),
          file_size_kb: Math.round(f.file.size / 1024),
          version: 'v1.0',
          tags: f.tags.split(',').map(t => t.trim()).filter(Boolean),
          is_public: false,
          view_count: 0
        }])
        if (error) { updateFile(i, { status: 'error', error: error.message }); continue }
        updateFile(i, { status: 'done', progress: 100 })
      } catch (err) {
        updateFile(i, { status: 'error', error: 'L?i không xác d?nh' })
      }
    }
    setUploading(false)
  }

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase()
    if (['pdf'].includes(ext || '')) return '??'
    if (['doc', 'docx'].includes(ext || '')) return '??'
    if (['xls', 'xlsx'].includes(ext || '')) return '??'
    if (['png', 'jpg', 'jpeg', 'gif'].includes(ext || '')) return '???'
    if (['mp4', 'avi', 'mov'].includes(ext || '')) return '??'
    return '??'
  }

  const pendingCount = files.filter(f => f.status === 'pending').length
  const doneCount = files.filter(f => f.status === 'done').length

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            ?? Bulk Upload Tài li?u
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Upload nhi?u file cùng lúc vào h? th?ng</p>
        </div>
        {files.length > 0 && (
          <div className="text-xs text-slate-500">
            {doneCount}/{files.length} hoàn thành
          </div>
        )}
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors"
      >
        <div className="text-3xl mb-2">??</div>
        <p className="text-sm font-semibold text-slate-600">Click d? ch?n file</p>
        <p className="text-xs text-slate-400 mt-1">PDF, Word, Excel, ?nh, video — không gi?i h?n s? lu?ng</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.mp4,.avi,.mov"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {files.map((f, i) => (
            <div key={i} className={order rounded-lg p-3 text-xs space-y-2 }>
              <div className="flex items-center justify-between gap-2">
                <span className="text-base">{getFileIcon(f.file.name)}</span>
                <span className="text-slate-500 truncate flex-1">{f.file.name}</span>
                <span className="text-slate-400">{Math.round(f.file.size/1024)}KB</span>
                {f.status === 'pending' && (
                  <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600 font-bold">?</button>
                )}
                {f.status === 'done' && <span className="text-emerald-600 font-bold">?</span>}
                {f.status === 'error' && <span className="text-red-600 font-bold">?</span>}
              </div>

              {f.status === 'pending' && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={f.title}
                    onChange={e => updateFile(i, { title: e.target.value })}
                    placeholder="Tên tài li?u"
                    className="col-span-2 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-orange-400"
                  />
                  <select
                    value={f.folderId}
                    onChange={e => updateFile(i, { folderId: e.target.value })}
                    className="border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-orange-400"
                  >
                    {folders.map(folder => (
                      <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                  <select
                    value={f.docType}
                    onChange={e => updateFile(i, { docType: e.target.value })}
                    className="border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-orange-400"
                  >
                    {docTypes.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <input
                    value={f.tags}
                    onChange={e => updateFile(i, { tags: e.target.value })}
                    placeholder="Tags: SOP, MuaHang, DID..."
                    className="col-span-2 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-orange-400"
                  />
                </div>
              )}

              {f.status === 'uploading' && (
                <div className="w-full bg-orange-100 rounded-full h-1.5">
                  <div className="bg-orange-500 h-1.5 rounded-full transition-all" style={{ width: f.progress + '%' }}></div>
                </div>
              )}

              {f.status === 'error' && (
                <p className="text-red-600">{f.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {pendingCount > 0 && (
        <button
          onClick={uploadAll}
          disabled={uploading}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-sm py-2.5 rounded-lg transition-colors"
        >
          {uploading ? 'Ðang upload...' : Upload  file lên h? th?ng}
        </button>
      )}

      {doneCount === files.length && files.length > 0 && !uploading && (
        <div className="text-center text-emerald-600 font-bold text-sm py-2">
          ? T?t c? {doneCount} file dã upload thành công!
        </div>
      )}
    </div>
  )
}
