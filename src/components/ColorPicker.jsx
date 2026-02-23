const COLORS = [
  { id: 'blue', bg: 'bg-blue-500', ring: 'ring-blue-400', label: 'Blue (Me)' },
  { id: 'green', bg: 'bg-green-500', ring: 'ring-green-400', label: 'Green (Partner)' },
  { id: 'red', bg: 'bg-red-500', ring: 'ring-red-400', label: 'Red (Son)' },
]

export default function ColorPicker({ activeColor, onChange }) {
  return (
    <div className="flex gap-4 items-center">
      {COLORS.map(({ id, bg, ring, label }) => (
        <button
          key={id}
          aria-label={label}
          onClick={() => onChange(id)}
          className={`w-9 h-9 rounded-full ${bg} transition-all ${
            activeColor === id
              ? `ring-2 ring-offset-2 ring-offset-gray-900 ${ring} scale-110`
              : 'opacity-50'
          }`}
        />
      ))}
    </div>
  )
}
