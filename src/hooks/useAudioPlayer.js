import { useEffect, useRef, useCallback } from 'react'
import { useMusicStore } from '../stores/musicStore'

export function useAudioPlayer() {
  const audioRef = useRef(null)

  const currentIndex = useMusicStore((s) => s.currentIndex)
  const isPlaying = useMusicStore((s) => s.isPlaying)
  const volume = useMusicStore((s) => s.volume)
  const muted = useMusicStore((s) => s.muted)
  const currentTrack = useMusicStore((s) => s.playlist[s.currentIndex])

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio

    const onTimeUpdate = () => {
      useMusicStore.getState().setProgress(audio.currentTime)
    }
    const onLoadedMetadata = () => {
      useMusicStore.getState().setDuration(audio.duration || 0)
    }
    const onEnded = () => {
      useMusicStore.getState().next()
    }
    const onError = () => {
      useMusicStore.getState().setDuration(0)
      useMusicStore.getState().setProgress(0)
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.pause()
      audio.src = ''
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audioRef.current = null
    }
  }, [])

  // Change track
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    audio.src = currentTrack.src
    audio.load()
    if (isPlaying) {
      audio.play().catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  // Play / pause
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    if (isPlaying) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying])

  // Volume + muted
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = muted ? 0 : volume
  }, [volume, muted])

  const seek = useCallback((time) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = time
      useMusicStore.getState().setProgress(time)
    }
  }, [])

  return { seek }
}
