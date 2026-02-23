import CalendarCell from './CalendarCell'
import { buildCalendarCells } from '../utils/dateUtils'

const DAY_HEADERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function CalendarGrid({ viewYear, viewMonth, selectedDay, todayStr, onDaySelect, monthData }) {
  const cells = buildCalendarCells(viewYear, viewMonth)

  return (
    <div className="flex flex-col h-full">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-0.5">
        {DAY_HEADERS.map((d, i) => (
          <div key={i} className="text-center text-xs text-gray-400 py-0.5 font-medium">
            {d}
          </div>
        ))}
      </div>
      {/* 6-row grid */}
      <div className="grid grid-cols-7 grid-rows-6 flex-1 gap-px">
        {cells.map(({ dayStr, dayNum, isCurrentMonth }) => {
          const data = monthData[dayStr] || {}
          return (
            <CalendarCell
              key={dayStr}
              dayStr={dayStr}
              dayNum={dayNum}
              isCurrentMonth={isCurrentMonth}
              isToday={dayStr === todayStr}
              isSelected={dayStr === selectedDay}
              colors={data.colors || []}
              hasNotes={data.hasNotes || false}
              onSelect={onDaySelect}
            />
          )
        })}
      </div>
    </div>
  )
}
