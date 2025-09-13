// Libraries
import React, { useState, useEffect, useCallback } from 'react'

// Components
import { TagEditor } from '@/components/TagEditor'
import TextareaAutosize from 'react-textarea-autosize'

export interface StoryData {
  title: string
  description: string
  tags: string[]
}

interface StoryInfoFormProps {
  initialData: StoryData
  onChange: (data: Partial<StoryData>) => void
  debounceMs?: number
}

export const StoryInfoForm: React.FC<StoryInfoFormProps> = ({
  initialData,
  onChange,
  debounceMs = 500,
}) => {
  const [formData, setFormData] = useState<StoryData>(initialData)

  // Update internal state when initialData changes (e.g., from server)
  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  // Debounced onChange
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only call onChange if data has actually changed
      if (
        formData.title !== initialData.title ||
        formData.description !== initialData.description ||
        formData.tags !== initialData.tags
      ) {
        const changes: Partial<StoryData> = {}

        if (formData.title !== initialData.title) {
          changes.title = formData.title
        }
        if (formData.description !== initialData.description) {
          changes.description = formData.description
        }
        if (formData.tags !== initialData.tags) {
          changes.tags = formData.tags
        }

        if (Object.keys(changes).length > 0) {
          onChange(changes)
        }
      }
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [formData, initialData, onChange, debounceMs])

  const updateField = useCallback(
    (field: keyof StoryData, value: string | string[]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    },
    []
  )
  return (
    <form className="flex flex-col gap-2">
      <div className="flex flex-col">
        <label htmlFor="title" className="ui-small text-steel">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          className="ui-normal border border-silver rounded px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent"
          placeholder="Enter story title"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="description" className="ui-small text-steel">
          Description
        </label>
        <TextareaAutosize
          id="description"
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows={4}
          className="ui-normal border border-silver rounded px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent resize-vertical"
          placeholder="Enter story description"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="tags" className="ui-small text-steel">
          Tags
        </label>
        <TagEditor
          value={formData.tags}
          onChange={(tags) => updateField('tags', tags)}
          placeholder="Add tags..."
        />
      </div>
    </form>
  )
}
