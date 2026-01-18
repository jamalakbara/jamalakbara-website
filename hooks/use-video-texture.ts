'use client'

import { useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'

/**
 * Custom hook to create a Three.js VideoTexture from a video URL.
 * Video plays as autoplay, muted, loop.
 */
export function useVideoTexture(
    videoUrl: string | undefined,
    isActive: boolean
): THREE.VideoTexture | null {
    const [texture, setTexture] = useState<THREE.VideoTexture | null>(null)
    const [video, setVideo] = useState<HTMLVideoElement | null>(null)
    const [isReady, setIsReady] = useState(false)

    // Initialize video element and texture
    useEffect(() => {
        if (!videoUrl) {
            setTexture(null)
            setVideo(null)
            setIsReady(false)
            return
        }

        console.log('[VideoTexture] Creating video element for:', videoUrl)

        // Create video element
        const videoElement = document.createElement('video')
        videoElement.src = videoUrl
        videoElement.crossOrigin = 'anonymous'
        videoElement.loop = true
        videoElement.muted = true
        videoElement.playsInline = true
        videoElement.preload = 'auto'

        // Create texture immediately
        const videoTexture = new THREE.VideoTexture(videoElement)
        videoTexture.minFilter = THREE.LinearFilter
        videoTexture.magFilter = THREE.LinearFilter
        videoTexture.format = THREE.RGBAFormat
        videoTexture.colorSpace = THREE.SRGBColorSpace

        // Handle video ready state
        const handleCanPlay = () => {
            console.log('[VideoTexture] Video ready to play:', videoUrl)
            setIsReady(true)
        }

        const handleError = (e: ErrorEvent) => {
            console.error('[VideoTexture] Video load error:', e.message, videoUrl)
        }

        videoElement.addEventListener('canplay', handleCanPlay)
        videoElement.addEventListener('error', handleError as EventListener)

        // Start loading
        videoElement.load()

        setVideo(videoElement)
        setTexture(videoTexture)

        return () => {
            console.log('[VideoTexture] Cleaning up video:', videoUrl)
            videoElement.removeEventListener('canplay', handleCanPlay)
            videoElement.removeEventListener('error', handleError as EventListener)
            videoElement.pause()
            videoElement.src = ''
            videoElement.remove()
            videoTexture.dispose()
        }
    }, [videoUrl])

    // Handle play/pause based on active state
    useEffect(() => {
        if (!video || !isReady) return

        if (isActive) {
            console.log('[VideoTexture] Playing video')
            const playPromise = video.play()
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    console.warn('[VideoTexture] Autoplay blocked:', err)
                })
            }
        } else {
            console.log('[VideoTexture] Pausing video')
            video.pause()
        }
    }, [video, isActive, isReady])

    // Only return texture if video is ready
    return isReady ? texture : null
}
