// Libraries
import { TagList } from '@/components/TagList'
import { Link } from '@tanstack/react-router'
import React from 'react'
import { formatDistanceToNow, format } from 'date-fns'
import { Tooltip } from 'react-tooltip'

interface StoryCardProps {
  id: string
  title: string
  description?: string
  tags?: string[]
  chapterCount: number
  wordCount: number
  updatedAt: string
  createdAt: string
}

export const StoryCard: React.FC<StoryCardProps> = ({
  id,
  title,
  description,
  tags,
  chapterCount,
  wordCount,
  updatedAt,
  createdAt,
}) => {
  // Use updatedAt if available, otherwise fall back to createdAt
  const displayDate = updatedAt || createdAt
  const relativeDate = formatDistanceToNow(new Date(displayDate), {
    addSuffix: true,
  })
  const exactDate = format(new Date(displayDate), 'PPPpp')
  const tooltipId = `date-tooltip-${id}`
  return (
    <div className="flex flex-col relative gap-2 p-2 w-full md:w-[calc(50%_-_4px)] lg:w-[calc(33.3333333%_-_6px)] border border-silver rounded select-none cursor-pointer">
      <header className="flex justify-between items-center">
        <h2 className="ui-header">{title}</h2>

        <div className="ui-small text-steel z-20" data-tooltip-id={tooltipId}>
          {relativeDate}
        </div>
      </header>

      <TagList tags={tags ?? []} />

      <div className="ui-normal line-clamp-4">{description}</div>

      <footer className="flex justify-between items-center ui-small text-steel">
        <div className="">{chapterCount} chapters</div>
        <div className="">{wordCount} words</div>
      </footer>

      <Link to={`/story/$storyId`} params={{ storyId: id }}>
        <div className="absolute inset-0 z-10"></div>
      </Link>

      <Tooltip
        id={tooltipId}
        place="top"
        className="!bg-white !border !border-silver shadow-panel !p-2 !text-black"
      >
        {exactDate}
      </Tooltip>
    </div>
  )
}
