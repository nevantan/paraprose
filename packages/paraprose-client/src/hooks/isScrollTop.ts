import { useEffect, useState } from 'react'

const useIsScrollTop = (): boolean => {
  const [isScrollTop, setIsScrollTop] = useState<boolean>(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrollTop(window.scrollY === 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return isScrollTop
}

export default useIsScrollTop
