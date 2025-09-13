// Libraries
import React from 'react'
import { Hotkey } from '../Hotkey/Hotkey'

interface HotkeyChordProps {
  keys: string[]
}

export const HotkeyChord: React.FC<HotkeyChordProps> = ({ keys }) => {
  return (
    <div className="flex gap-1">
      {keys.map((key, i) => (
        <>
          <Hotkey key={key} label={key} />
          {i < keys.length - 1 && <span>+</span>}
        </>
      ))}
    </div>
  )
}
