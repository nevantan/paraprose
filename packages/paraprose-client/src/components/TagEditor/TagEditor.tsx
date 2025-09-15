import React, { useState, useRef, type KeyboardEvent } from 'react'

interface TagEditorProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export const TagEditor: React.FC<TagEditorProps> = ({
  value: tags,
  onChange,
  placeholder = 'Add tags...',
}) => {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const updateTags = (newTags: string[]) => {
    onChange(newTags)
  }

  const addTag = (tagText: string) => {
    const trimmedTag = tagText.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      updateTags([...tags, trimmedTag])
    }
    setInputValue('')
  }

  const removeTag = (indexToRemove: number) => {
    updateTags(tags.filter((_, index) => index !== indexToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault()
      if (inputValue.trim()) {
        addTag(inputValue)
      }
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Remove last tag when backspacing with empty input
      removeTag(tags.length - 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    // Check if user typed a comma - if so, create a tag
    if (newValue.includes(',')) {
      const parts = newValue.split(',')
      const tagToAdd = parts[0].trim()
      if (tagToAdd) {
        addTag(tagToAdd)
      }
      // Keep any text after the comma as the new input value
      setInputValue(parts.slice(1).join(','))
    } else {
      setInputValue(newValue)
    }
  }

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div
      className="flex flex-wrap items-center gap-1 border border-silver rounded px-2.5 py-2 focus-within:ring-2 focus-within:ring-royal focus-within:border-transparent cursor-text min-h-[2.5rem]"
      onClick={handleContainerClick}
    >
      {tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="bg-royal text-white rounded px-2 py-1 ui-small cursor-pointer hover:bg-opacity-80 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            removeTag(index)
          }}
        >
          {tag}
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[100px] outline-none bg-transparent ui-normal"
      />
    </div>
  )
}
