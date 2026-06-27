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
    { value: 'SOP_QUY_TRINH', label: 'SOP / Quy trinh' },
    { value: 'BAO_GIA_HOP_DONG', label: 'Bao gia / Hop dong' },
    { value: 'TAI_LIEU_DAO_TAO', label: 'Tai lieu dao tao' },
    { value: 'HO_SO_PHAP_LY', label: 'Ho so phap ly' },
    { value: 'ANH_KY_THUAT', label: 'Hinh anh / QC' },
    { value: 'BIEN_MAU', label: 'Bieu mau' },
  ]

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || [])
    const newItems: FileItem[] = selected.map(f => ({
      file: f,
      title: f.name.replace(/\.[^/.]+$/, ''),
      folderId: folders[0]?.id || '',
      docType: 'SOP_QUY_TRINH',
      tags: '',
      status: 'pending',
      progress: 0,
    }))
    setFiles(prev => [...prev, ...newItems])
  }

  function updateFile(index: number, patch: Partial<FileItem>) {
    setFiles(prev => prev.map((f, i) => i === index ? { ...f, ...patch } : f))
  }

  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  async function uploadAll() {
    setUploading(true)
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'done') continue
      updateFile(i, { status: 'uploading', progress: 30 })
      try {
        const url = await uploadFile(files[i].file, files[i].folderId)
        if (!url) throw new Error('Upload failed')
        updateFile(i, { progress: 70 })
        const { error } = await supabase.from('documents').insert({
          title: files[i].title,
          folder_id: files[i].folderId || null,
          doc_type: files[i].docType,
          tags: files[i].tags.split(',').map(t => t.trim()).filter(Boolean),
          file_url: url,
          file_name: files[i].file.name,
          file_size: files[i].file.size,
        })
        if (error) throw error
        updateFile(i, { status: 'done', progress: 100 })
      } catch (err: any) {
        updateFile(i, { status: 'error', error: err.message })
      }
    }
    setUploading(false)
  }

  const pendingCount = files.filter(f => f.status === 'pending').length
  const doneCount = files.filter(f => f.status === 'done').length

  if (files.length === 0) return (
    <div className="mt-6 border-2 border-dashed border-slate-600 rounded-xl p-8 text-center">
      <p className="text-slate-400 mb-3">Keo tha nhieu file vao day hoac</p>
      <button
        onClick={() => inputRef.current?.click()}
        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-lg"
      >
        Chon nhieu file (Bulk Upload)
      </button>
      <input ref={inputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
    </div>
  )

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold">Bulk Upload ({files.length} file)</h3>
        <div className="flex gap-2">
          <button
            onClick={() => inputRef.current?.click()}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-lg"
          >
            + Them file
          </button>
          <button
            onClick={uploadAll}
            disabled={uploading}
            className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg"
          >
            {uploading ? 'Dang upload...' : `Upload ${pendingCount} file`}
          </button>
        </div>
      </div>
      <input ref={inputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
      <div className="space-y-3">
        {files.map((item, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex gap-3">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  value={item.title}
                  onChange={e => updateFile(i, { title: e.target.value })}
                  placeholder="Ten tai lieu"
                  className="bg-slate-700 text-white text-sm px-3 py-1.5 rounded col-span-2"
                />
                <select
                  value={item.folderId}
                  onChange={e => updateFile(i, { folderId: e.target.value })}
                  className="bg-slate-700 text-white text-sm px-3 py-1.5 rounded"
                >
                  {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
                <select
                  value={item.docType}
                  onChange={e => updateFile(i, { docType: e.target.value })}
                  className="bg-slate-700 text-white text-sm px-3 py-1.5 rounded"
                >
                  {docTypes.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
                <input
                  value={item.tags}
                  onChange={e => updateFile(i, { tags: e.target.value })}
                  placeholder="Tags (cach nhau bang dau phay)"
                  className="bg-slate-700 text-white text-sm px-3 py-1.5 rounded col-span-2"
                />
              </div>
              <button onClick={() => removeFile(i)} className="text-slate-500 hover:text-red-400 text-lg">x</button>
            </div>
            {item.status === 'uploading' && (
              <div className="mt-2 bg-slate-700 rounded-full h-1.5">
                <div className="bg-orange-500 h-1.5 rounded-full transition-all" style={{ width: `${item.progress}%` }} />
              </div>
            )}
            {item.status === 'done' && <p className="text-emerald-400 text-xs mt-1">Upload thanh cong</p>}
            {item.status === 'error' && <p className="text-red-400 text-xs mt-1">Loi: {item.error}</p>}
          </div>
        ))}
      </div>
      {doneCount === files.length && files.length > 0 && !uploading && (
        <p className="text-center text-emerald-400 text-sm mt-3">Tat ca {doneCount} file da upload thanh cong!</p>
      )}
    </div>
  )
}
