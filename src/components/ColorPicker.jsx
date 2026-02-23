const COLORS = [
  { id: 'blue', bg: 'bg-blue-500', label: 'Blue (Me)' },
  { id: 'green', bg: 'bg-green-500', label: 'Green (Partner)' },
  { id: 'red', bg: 'bg-red-500', label: 'Red (Son)' },
]

export default function ColorPicker({ activeColor, onChange }) {
  return (
    <div className="flex gap-3 items-center">
      {COLORS.map(({ id, bg, label }) => (
        <button
          key={id}
          aria-label={label}
          onClick={() => onChange(id)}
          className={`w-7 h-7 rounded-full ${bg} ${
            activeColor === id
              ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-white'
              : 'opacity-60'
          }`}
        />
      ))}
    </div>
  )
}
