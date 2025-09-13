// Libraries
import { Link } from '@tanstack/react-router'
import React from 'react'

interface ChapterCardProps {
  id: string
  title: string
  position: number
}

export const ChapterCard: React.FC<ChapterCardProps> = ({
  id: chapterId,
  title,
  position,
}) => {
  return (
    <div className="card p-2 relative">
      <div className="flex items-center gap-4">
        <h3 className="flex gap-2">
          <div className="bg-royal text-white w-6 flex items-center justify-center rounded font-semibold">
            {position + 1}
          </div>{' '}
          {title}
        </h3>

        <div className="ui-small text-steel">2k words</div>
      </div>

      <Link
        to={`/write/$chapterId`}
        params={{
          chapterId,
        }}
        className="absolute inset-0"
      ></Link>
    </div>
  )
}
