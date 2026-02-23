import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'

export function useDayData(calendarId, selectedDay) {
  const [entries, setEntries] = useState([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    if (!calendarId || !selectedDay) return
    setLoading(true)

    const [entriesRes, notesRes] = await Promise.all([
      supabase
        .from('day_entries')
        .select('id, color, text, created_at, created_by, batch_id')
        .eq('calendar_id', calendarId)
        .eq('day', selectedDay)
        .order('created_at', { ascending: true }),
      supabase
        .from('day_notes')
        .select('notes')
        .eq('calendar_id', calendarId)
        .eq('day', selectedDay)
        .maybeSingle(),
    ])

    setEntries(entriesRes.data || [])
    setNotes(notesRes.data?.notes || '')
    setLoading(false)
  }, [calendarId, selectedDay])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { entries, notes, loading, refetch: fetch }
}
