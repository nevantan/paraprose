// Libraries
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWind } from '@fortawesome/free-solid-svg-icons'

interface EmptyStateProps {
  message: string
  ctaText: string
  onCtaClick: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  ctaText,
  onCtaClick,
}) => {
  return (
    <div className="flex flex-col gap-8 items-center p-4">
      <FontAwesomeIcon className="text-silver" size="8x" icon={faWind} />
      <div className="flex flex-col gap-2">
        <div className="text-lg">{message}</div>
        <button
          className="text-royal underline cursor-pointer"
          onClick={onCtaClick}
        >
          {ctaText}
        </button>
      </div>
    </div>
  )
}
