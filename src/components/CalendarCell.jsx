const DOT_COLORS = {
  blue: 'bg-blue-400',
  green: 'bg-green-400',
  red: 'bg-red-400',
}

const COLOR_ORDER = ['blue', 'green', 'red']

export default function CalendarCell({ dayStr, dayNum, isCurrentMonth, isToday, isSelected, colors = [], hasNotes, onSelect }) {
  const visibleColors = COLOR_ORDER.filter(c => colors.includes(c))

  return (
    <button
      onClick={() => onSelect(dayStr)}
      className={`relative flex flex-col justify-between p-0.5 w-full aspect-square text-left rounded
        ${!isCurrentMonth ? 'opacity-30' : ''}
        ${isSelected ? 'bg-white/20' : isToday ? 'ring-1 ring-white/40' : ''}
      `}
    >
      <div className="flex justify-between w-full">
        <span className={`text-xs leading-none font-medium ${isSelected ? 'text-white' : 'text-gray-100'}`}>
          {dayNum}
        </span>
        {hasNotes && (
          <span className="text-[10px] leading-none">📝</span>
        )}
      </div>
      <div className="flex gap-0.5 pb-0.5">
        {visibleColors.map(c => (
          <span key={c} className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[c]}`} />
        ))}
      </div>
    </button>
  )
}
