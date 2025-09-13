// Libraries
import React from 'react'

interface HotkeyProps {
  label: string
}

export const Hotkey: React.FC<HotkeyProps> = ({ label }) => {
  return <div className="hotkey">{label}</div>
}
