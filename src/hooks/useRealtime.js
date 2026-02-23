import { useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'

export function useRealtime(calendarId, onchange) {
  const onchangeRef = useRef(onchange)
  onchangeRef.current = onchange

  useEffect(() => {
    if (!calendarId) return

    const channel = supabase
      .channel(`calendar-${calendarId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'day_entries',
          filter: `calendar_id=eq.${calendarId}`,
        },
        () => onchangeRef.current()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'day_notes',
          filter: `calendar_id=eq.${calendarId}`,
        },
        () => onchangeRef.current()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [calendarId])
}
