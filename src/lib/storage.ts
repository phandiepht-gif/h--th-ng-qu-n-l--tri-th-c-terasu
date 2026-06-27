import { supabase } from './supabase'

export async function uploadFile(file: File, folderPath: string): Promise<string | null> {
  const timestamp = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = 'uploads/' + timestamp + '_' + safeName
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(filePath, file, { cacheControl: '3600', upsert: false })
  if (error) {
    console.error('Upload error:', error.message)
    return null
  }
  const { data: urlData } = supabase.storage
    .from('documents')
    .getPublicUrl(data.path)
  return urlData.publicUrl
}

export async function deleteFile(filePath: string): Promise<boolean> {
  const { error } = await supabase.storage
    .from('documents')
    .remove([filePath])
  return !error
}
