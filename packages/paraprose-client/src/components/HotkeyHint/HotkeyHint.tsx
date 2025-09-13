// Libraries
import React from 'react'
import { HotkeyChord } from './components/HotkeyChord'

interface HotkeyHintProps {
  chord: string[]
  children: React.ReactNode
}

export const HotkeyHint: React.FC<HotkeyHintProps> = ({ chord, children }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-steel">
      <HotkeyChord keys={chord} />
      <div>{children}</div>
    </div>
  )
}
