import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface Folder {
  id: string
  name: string
  code: string
  parent_id: string | null
  sort_order: number
}

export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('folders')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        setFolders(data || [])
        setLoading(false)
      })
  }, [])

  return { folders, loading }
}
