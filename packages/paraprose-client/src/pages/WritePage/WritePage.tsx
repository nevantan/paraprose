// Libraries
import React from 'react'
import clsx from 'clsx'

// Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { getRouteApi, Link } from '@tanstack/react-router'
import { HotkeyHint } from '@/components/HotkeyHint'
import { Editor } from '@/components/Editor'
import { eq, useLiveQuery } from '@tanstack/react-db'
import { chaptersCollection } from '@/collections/chapters'
import { storiesCollection } from '@/collections/stories'
import useIsScrollTop from '@/hooks/isScrollTop'

const route = getRouteApi('/write/$chapterId')

export const WritePage: React.FC = () => {
  const { chapterId } = route.useParams()
  const isScrollTop = useIsScrollTop()

  const {
    data,
    isLoading: isLoadingChapter,
    isError: isChapterError,
  } = useLiveQuery((q) =>
    q
      .from({ chapter: chaptersCollection })
      .join({ story: storiesCollection }, ({ chapter, story }) =>
        eq(chapter.storyId, story.id)
      )
      .where(({ chapter }) => eq(chapter.id, chapterId))
  )

  if (isLoadingChapter) return <div>Loading...</div>
  if (isChapterError) return <div>Error</div>

  const [{ chapter, story }] = data

  return (
    <div className="flex flex-col h-screen">
      <header
        className={clsx(
          'flex gap-2 p-2 fixed top-0 w-full bg-anti transition-all z-10',
          {
            'shadow-panel': !isScrollTop,
          }
        )}
      >
        <Link to="/">
          <FontAwesomeIcon icon={faHome} className="text-steel" />
        </Link>

        <div className="text-steel">/</div>

        <Link to="/story/$storyId" params={{ storyId: chapter.storyId }}>
          {story?.title}
        </Link>

        <div className="text-steel">/</div>

        <div>{chapter.title}</div>
      </header>

      <div className="flex flex-1 justify-center pt-12">
        <div className="flex flex-col gap-5 w-2xl px-4 leading-7 content-text mb-[90vh]">
          <Editor chapterId={chapterId} />

          <div className="w-full flex justify-center">
            <HotkeyHint chord={['Ctrl', 'Enter']}>
              Generate next paragraph
            </HotkeyHint>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-4 p-2 fixed bottom-0 w-full">
        <div className="w-[calc(((100vw_-_var(--container-2xl)_-_var(--spacing)_*_4)_/_2))]">
          <div className="card p-2 flex flex-col gap-1 max-w-[300px]">
            <HotkeyHint chord={['Shift', 'Tab']}>
              Select previous sentence
            </HotkeyHint>
          </div>
        </div>

        <div className="flex flex-1 justify-center"></div>

        <div className="w-[calc(((100vw_-_var(--container-2xl)_-_var(--spacing)_*_4)_/_2))]"></div>
      </div>
    </div>
  )
}
