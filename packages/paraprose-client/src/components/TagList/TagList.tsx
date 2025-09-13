import React, { useState, useEffect, useRef } from 'react'
import { Tooltip } from 'react-tooltip'

interface TagListProps {
  tags: string[]
}

export const TagList: React.FC<TagListProps> = ({ tags }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleTags, setVisibleTags] = useState<string[]>(tags)
  const [overflowCount, setOverflowCount] = useState(0)
  const [overflowTags, setOverflowTags] = useState<string[]>([])

  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current || tags.length === 0) return

      const container = containerRef.current
      const containerWidth = container.offsetWidth
      let currentWidth = 0
      let lastFittingIndex = tags.length

      // Create temporary elements to measure tag widths
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.visibility = 'hidden'
      tempContainer.style.whiteSpace = 'nowrap'
      tempContainer.className = 'flex gap-1'
      document.body.appendChild(tempContainer)

      // Measure each tag
      for (let i = 0; i < tags.length; i++) {
        const tempTag = document.createElement('span')
        tempTag.className = 'bg-royal text-white ui-small py-0.5 px-1 rounded'
        tempTag.textContent =
          tags[i].slice(0, 1).toUpperCase() + tags[i].slice(1)
        tempContainer.appendChild(tempTag)

        const tagWidth = tempTag.offsetWidth + 4 // 4px for gap
        currentWidth += tagWidth

        // Reserve space for "+X" indicator if needed
        const plusIndicatorWidth = i < tags.length - 1 ? 32 : 0 // approximate width of "+X"

        if (currentWidth + plusIndicatorWidth > containerWidth) {
          lastFittingIndex = i
          break
        }
      }

      document.body.removeChild(tempContainer)

      if (lastFittingIndex < tags.length) {
        setVisibleTags(tags.slice(0, lastFittingIndex))
        setOverflowCount(tags.length - lastFittingIndex)
        setOverflowTags(tags.slice(lastFittingIndex))
      } else {
        setVisibleTags(tags)
        setOverflowCount(0)
        setOverflowTags([])
      }
    }

    checkOverflow()

    // Recheck on window resize
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [tags])

  return (
    <div ref={containerRef} className="flex gap-1 overflow-hidden z-20">
      {visibleTags.map((tag) => (
        <span
          key={tag}
          className="bg-royal text-white ui-small py-0.5 px-1 rounded whitespace-nowrap"
        >
          {tag.slice(0, 1).toUpperCase() + tag.slice(1)}
        </span>
      ))}
      {overflowCount > 0 && (
        <>
          <span
            data-tooltip-id="overflow-tags"
            className="text-royal ui-small py-0.5 px-1 underline whitespace-nowrap"
          >
            +{overflowCount}
          </span>
          <Tooltip
            id="overflow-tags"
            place="top"
            className="!bg-white !border !border-silver shadow-panel !p-2"
            classNameArrow="hidden"
          >
            <div className="flex flex-wrap gap-1">
              {overflowTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-royal text-white ui-small py-0.5 px-1 rounded"
                >
                  {tag.slice(0, 1).toUpperCase() + tag.slice(1)}
                </span>
              ))}
            </div>
          </Tooltip>
        </>
      )}
    </div>
  )
}
