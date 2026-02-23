import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useCalendar(userId) {
  const [calendarId, setCalendarId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) return

    async function load() {
      setLoading(true)
      setError(null)

      // First check the user is in the allowlist
      const { data: allowed, error: allowedError } = await supabase
        .from('allowed_users')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle()

      if (allowedError || !allowed) {
        setError('no_membership')
        setLoading(false)
        return
      }

      // Fetch the single household calendar
      const { data, error } = await supabase
        .from('calendars')
        .select('id')
        .limit(1)
        .maybeSingle()

      if (error) {
        setError('rls')
      } else if (!data) {
        setError('no_membership')
      } else {
        setCalendarId(data.id)
      }
      setLoading(false)
    }

    load()
  }, [userId])

  return { calendarId, loading, error }
}
