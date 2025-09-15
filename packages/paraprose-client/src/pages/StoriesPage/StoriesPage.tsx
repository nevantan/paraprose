import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { v4 as uuid } from 'uuid'

// Icons
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { EmptyState } from '../../components/EmptyState'
import { StoryCard } from './components/StoryCard'
import { StoriesLayout } from '@/layouts/StoriesLayout'
import { useLiveQuery } from '@tanstack/react-db'
import { storiesCollection } from '@/collections/stories'

export const StoriesPage: React.FC = () => {
  const {
    data: stories,
    isLoading: isLoadingStories,
    isError: isStoriesError,
  } = useLiveQuery((q) => q.from({ stories: storiesCollection }))

  const createStory = () => {
    storiesCollection.insert({
      id: uuid(),
      title: 'Untitled Story',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'user-id',
      tags: [],
      chapterCount: 0,
      wordCount: 0,
    })
  }

  return (
    <StoriesLayout title="Your Stories">
      <div className="card">
        <header className="flex p-1 border-b border-silver">
          <div className="flex flex-1">
            <input
              type="text"
              className="w-full p-2"
              placeholder="Search stories..."
            />
          </div>

          <button
            className="ghost"
            onClick={() => createStory()}
            disabled={isLoadingStories}
          >
            <FontAwesomeIcon icon={faPlus} /> New Story
          </button>
        </header>

        <div className="flex flex-1 min-h-[400px]">
          {isLoadingStories ? (
            <div className="flex items-center justify-center w-full flex-1">
              Loading...
            </div>
          ) : isStoriesError ? (
            <div>Something went wrong loading your stories.</div>
          ) : (
            <>
              {stories.length === 0 ? (
                <div className="flex items-center justify-center w-full flex-1">
                  <EmptyState
                    message="No Stories Yet!"
                    ctaText="Create one"
                    onCtaClick={() => console.log('CTA clicked')}
                  />
                </div>
              ) : (
                <div className="flex flex-wrap w-full items-start gap-2 p-2">
                  {stories.map((story) => (
                    <StoryCard
                      key={story.id}
                      id={story.id}
                      title={story.title}
                      description={story.description}
                      tags={story.tags}
                      chapterCount={story.chapterCount}
                      wordCount={story.wordCount}
                      updatedAt={story.updatedAt}
                      createdAt={story.createdAt}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </StoriesLayout>
  )
}
