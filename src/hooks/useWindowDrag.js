import { useCallback, useRef } from 'react'

export function useWindowDrag(id, x, y, onDrag) {
  const isDragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e) => {
      if (e.target.closest('.window-btns') || e.target.closest('.win-btn')) return
      isDragging.current = true
      offset.current = { x: e.clientX - x, y: e.clientY - y }
    },
    [x, y]
  )

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging.current) return
      onDrag(id, e.clientX - offset.current.x, e.clientY - offset.current.y)
    },
    [id, onDrag]
  )

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
  }, [])

  return { handleMouseDown, handleMouseMove, handleMouseUp, isDragging }
}
