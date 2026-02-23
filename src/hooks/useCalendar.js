import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useCalendar(userId) {
  const [calendarId, setCalendarId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) return

    async function load() {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('calendar_members')
        .select('calendar_id')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle()

      if (error) {
        setError('rls')
      } else if (!data) {
        setError('no_membership')
      } else {
        setCalendarId(data.calendar_id)
      }
      setLoading(false)
    }

    load()
  }, [userId])

  return { calendarId, loading, error }
}
