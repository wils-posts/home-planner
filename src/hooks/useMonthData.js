import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { getMonthRangePadded } from '../utils/dateUtils'

export function useMonthData(calendarId, viewYear, viewMonth) {
  const [monthData, setMonthData] = useState({})
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    if (!calendarId) return
    setLoading(true)

    const { start, end } = getMonthRangePadded(viewYear, viewMonth)

    const [entriesRes, notesRes] = await Promise.all([
      supabase
        .from('day_entries')
        .select('day, color')
        .eq('calendar_id', calendarId)
        .gte('day', start)
        .lte('day', end),
      supabase
        .from('day_notes')
        .select('day, notes')
        .eq('calendar_id', calendarId)
        .gte('day', start)
        .lte('day', end),
    ])

    const data = {}

    if (entriesRes.data) {
      for (const row of entriesRes.data) {
        if (!data[row.day]) data[row.day] = { colors: [], hasNotes: false }
        if (!data[row.day].colors.includes(row.color)) {
          data[row.day].colors.push(row.color)
        }
      }
    }

    if (notesRes.data) {
      for (const row of notesRes.data) {
        if (row.notes && row.notes.trim().length > 0) {
          if (!data[row.day]) data[row.day] = { colors: [], hasNotes: false }
          data[row.day].hasNotes = true
        }
      }
    }

    setMonthData(data)
    setLoading(false)
  }, [calendarId, viewYear, viewMonth])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { monthData, loading, refetch: fetch }
}
