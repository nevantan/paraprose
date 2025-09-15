import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getRouteApi } from '@tanstack/react-router'
import { v4 as uuid } from 'uuid'
import { useLiveQuery } from '@tanstack/react-db'

// Icons
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { EmptyState } from '../../components/EmptyState'
import { StoriesLayout } from '@/layouts/StoriesLayout'
import { StoryInfoForm, type StoryData } from './components/StoryInfoForm'
import { ChapterCard } from './components/ChapterCard'

// Data
import { storiesCollection } from '@/collections/stories'
import { chaptersCollection } from '@/collections/chapters'

const route = getRouteApi('/story/$storyId')

export const StoryPage: React.FC = () => {
  const { storyId: id } = route.useParams()

  const {
    data: [story],
    isLoading: isLoadingStory,
    isError: isStoryError,
  } = useLiveQuery((q) => q.from({ stories: storiesCollection }))

  const updateStory = async (updatedData: Partial<StoryData>) => {
    storiesCollection.update(id, (draft) => {
      draft.title = updatedData.title ?? draft.title
      draft.description = updatedData.description ?? draft.description
      draft.updatedAt = new Date().toISOString()
    })
  }

  const {
    data: chapters,
    isLoading: isLoadingChapters,
    isError: isChaptersError,
  } = useLiveQuery((q) => q.from({ chapters: chaptersCollection }))

  const handleCreateChapter = () => {
    chaptersCollection.insert({
      id: uuid(),
      title: `Chapter ${(chapters?.length ?? 0) + 1}`,
      position: chapters?.length ?? 0,
      storyId: id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: '',
    })
  }

  return (
    <StoriesLayout
      title={
        isLoadingStory ? (
          <div className="text-steel">Loading...</div>
        ) : (
          story?.title || <div className="text-steel">Untitled Story</div>
        )
      }
    >
      <div className="flex flex-col flex-1 gap-4">
        <div className="card p-2">
          {isLoadingStory ? (
            <div>Loading...</div>
          ) : isStoryError ? (
            <div>Error loading story</div>
          ) : (
            <StoryInfoForm
              initialData={{
                title: story.title,
                description: story.description ?? '',
                tags: story.tags ?? '',
              }}
              onChange={(changes) => updateStory({ ...changes })}
            />
          )}
        </div>

        <div className="flex justify-between">
          <h2 className="ui-header">Chapters</h2>

          <button className="ghost ui-small" onClick={handleCreateChapter}>
            <FontAwesomeIcon icon={faPlus} /> New Chapter
          </button>
        </div>

        <div className="flex flex-col flex-1">
          {isLoadingChapters ? (
            <div>Loading...</div>
          ) : isChaptersError ? (
            <div>Error loading chapters</div>
          ) : (
            <>
              {chapters.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {chapters.map((chapter) => (
                    <ChapterCard
                      key={chapter.id}
                      id={chapter.id}
                      title={chapter.title}
                      position={chapter.position}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-1 w-full items-center justify-center">
                  <EmptyState
                    message="No Chapters Yet!"
                    ctaText="Create one"
                    onCtaClick={handleCreateChapter}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </StoriesLayout>
  )
}
