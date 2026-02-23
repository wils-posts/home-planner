import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'

export default function NotesArea({ calendarId, selectedDay, initialNotes, userId, onSavingChange, onToast }) {
  const [localNotes, setLocalNotes] = useState(initialNotes || '')
  const isFocusedRef = useRef(false)
  const debounceRef = useRef(null)

  // Reset notes when day changes or when a realtime update arrives (only if not focused)
  useEffect(() => {
    if (!isFocusedRef.current) {
      setLocalNotes(initialNotes || '')
    }
  }, [selectedDay, initialNotes])

  async function save(notes) {
    onSavingChange('saving')
    const { error } = await supabase
      .from('day_notes')
      .upsert(
        {
          calendar_id: calendarId,
          day: selectedDay,
          notes,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'calendar_id,day' }
      )
    if (error) {
      onToast({ message: "Couldn't save — please try again", type: 'error' })
      onSavingChange('')
    } else {
      const now = new Date()
      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      onSavingChange(`Saved ${hhmm}`)
    }
  }

  function handleChange(e) {
    const val = e.target.value
    setLocalNotes(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => save(val), 800)
  }

  function handleBlur() {
    isFocusedRef.current = false
    clearTimeout(debounceRef.current)
    save(localNotes)
  }

  function handleFocus() {
    isFocusedRef.current = true
  }

  return (
    <textarea
      value={localNotes}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder="Notes…"
      className="w-full flex-1 bg-gray-800 text-gray-100 placeholder-gray-500 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-gray-500 resize-none min-h-[80px]"
    />
  )
}
