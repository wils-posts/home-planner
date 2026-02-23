import { useState } from 'react'
import { supabase } from '../supabaseClient'
import ColorPicker from './ColorPicker'

const DOT_COLORS = {
  blue: 'bg-blue-400',
  green: 'bg-green-400',
  red: 'bg-red-400',
}

export default function EntryRow({ entry, onDeleted, onUpdated, onToast }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(entry.text)
  const [editColor, setEditColor] = useState(entry.color)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase
      .from('day_entries')
      .update({ text: editText, color: editColor, updated_at: new Date().toISOString() })
      .eq('id', entry.id)
    setSaving(false)
    if (error) {
      onToast({ message: "Couldn't save — please try again", type: 'error' })
    } else {
      setIsEditing(false)
      onUpdated()
    }
  }

  async function handleDelete() {
    const { error } = await supabase
      .from('day_entries')
      .delete()
      .eq('id', entry.id)
    if (error) {
      onToast({ message: "Couldn't save — please try again", type: 'error' })
    } else {
      onDeleted()
    }
  }

  function handleCancel() {
    setEditText(entry.text)
    setEditColor(entry.color)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 bg-gray-800 rounded-lg p-3">
        <input
          type="text"
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
          autoFocus
          className="bg-gray-700 text-gray-100 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-gray-500"
        />
        <ColorPicker activeColor={editColor} onChange={setEditColor} />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gray-600 text-white rounded px-3 py-1.5 text-sm font-medium active:bg-gray-500 disabled:opacity-40"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="text-gray-400 text-sm px-3 py-1.5"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 py-2 px-1 min-h-[44px]">
      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${DOT_COLORS[entry.color] || 'bg-gray-400'}`} />
      <span
        className="flex-1 text-sm text-gray-100 cursor-pointer"
        onClick={() => setIsEditing(true)}
      >
        {entry.text}
      </span>
      <button
        onClick={handleDelete}
        aria-label="Delete entry"
        className="text-gray-500 hover:text-gray-300 text-lg leading-none px-1 min-w-[44px] text-center"
      >
        ×
      </button>
    </div>
  )
}
