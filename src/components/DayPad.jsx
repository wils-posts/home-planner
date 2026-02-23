import { useState, useEffect } from 'react'
import ColorPicker from './ColorPicker'
import AddEntryForm from './AddEntryForm'
import EntryRow from './EntryRow'
import NotesArea from './NotesArea'
import { formatDayHeader } from '../utils/dateUtils'

const COLOR_KEY = 'homeplanner_last_color'

function getInitialColor() {
  return localStorage.getItem(COLOR_KEY) || 'blue'
}

export default function DayPad({ calendarId, selectedDay, session, entries, notes, onRefetch, onToast }) {
  const [activeColor, setActiveColor] = useState(getInitialColor)
  const [notesSaving, setNotesSaving] = useState('')

  function handleColorChange(color) {
    setActiveColor(color)
    localStorage.setItem(COLOR_KEY, color)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-900 border-t border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0">
        <h2 className="text-sm font-semibold text-gray-100">
          {formatDayHeader(selectedDay)}
        </h2>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-3">
        {/* Color picker + Add entry */}
        <div className="flex flex-col gap-2">
          <ColorPicker activeColor={activeColor} onChange={handleColorChange} />
          <AddEntryForm
            activeColor={activeColor}
            selectedDay={selectedDay}
            calendarId={calendarId}
            userId={session.user.id}
            onAdded={onRefetch}
            onToast={onToast}
          />
        </div>

        {/* Entries list */}
        {entries.length > 0 && (
          <div className="divide-y divide-gray-800">
            {entries.map(entry => (
              <EntryRow
                key={entry.id}
                entry={entry}
                onDeleted={onRefetch}
                onUpdated={onRefetch}
                onToast={onToast}
              />
            ))}
          </div>
        )}

        {/* Notes */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Notes</span>
            {notesSaving && (
              <span className="text-xs text-gray-500">{notesSaving}</span>
            )}
          </div>
          <NotesArea
            calendarId={calendarId}
            selectedDay={selectedDay}
            initialNotes={notes}
            userId={session.user.id}
            onSavingChange={setNotesSaving}
            onToast={onToast}
          />
        </div>
      </div>
    </div>
  )
}
