import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface Document {
  id: string
  code: string
  title: string
  description?: string
  doc_type?: string
  folder_id?: string
  file_url?: string
  file_type?: string
  version: string
  tags: string[]
  is_public: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  async function fetchDocuments() {
    setLoading(true)
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setDocuments(data || [])
    }
    setLoading(false)
  }

  async function addDocument(doc: Omit<Document, 'id' | 'created_at' | 'updated_at' | 'view_count'>) {
    const { data, error } = await supabase
      .from('documents')
      .insert([doc])
      .select()
      .single()

    if (error) {
      setError(error.message)
      return null
    }
    setDocuments(prev => [data, ...prev])
    return data
  }

  async function deleteDocument(id: string) {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)

    if (error) {
      setError(error.message)
      return false
    }
    setDocuments(prev => prev.filter(d => d.id !== id))
    return true
  }

  async function incrementViewCount(id: string) {
    await supabase.rpc('increment_view_count', { doc_id: id })
  }

  return { documents, loading, error, addDocument, deleteDocument, fetchDocuments, incrementViewCount }
}
