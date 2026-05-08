// Image Ticker - Horizontal scrolling ticker with square images
import { useEffect, useRef, useState, startTransition } from "react"
import { 
interface TickerProps {
    images: Array<{
        src: { src: string; srcSet?: string; alt?: string }
        alt: string
    }>
    speed: number
    gap: number
    imageSize: number
    pauseOnHover: boolean
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function Ticker(props: TickerProps) {
    const {
        images,
        speed = 50,
        gap = 16,
        imageSize = 100,
        pauseOnHover = true,
    } = props

    const [isPaused, setIsPaused] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const animationRef = useRef<number>()
    const positionRef = useRef(0)

    useEffect(() => {
        if (!containerRef.current || images.length === 0) return

        const container = containerRef.current
        const totalWidth = (imageSize + gap) * images.length

        const animate = () => {
            if (!isPaused) {
                positionRef.current -= speed / 60
                if (Math.abs(positionRef.current) >= totalWidth) {
                    positionRef.current = 0
                }
                container.style.transform = `translateX(${positionRef.current}px)`
            }
            animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [speed, gap, imageSize, images.length, isPaused])

    const handleMouseEnter = () => {
        if (pauseOnHover) {
            startTransition(() => setIsPaused(true))
        }
    }

    const handleMouseLeave = () => {
        if (pauseOnHover) {
            startTransition(() => setIsPaused(false))
        }
    }

    const duplicatedImages = [...images, ...images, ...images]

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "center",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={containerRef}
                style={{
                    display: "flex",
                    gap: `${gap}px`,
                    willChange: "transform",
                }}
            >
                {duplicatedImages.map((image, index) => (
                    <div
                        key={index}
                        style={{
                            width: `${imageSize}px`,
                            height: `${imageSize}px`,
                            flexShrink: 0,
                            borderRadius: "8px",
                            overflow: "hidden",
                        }}
                    >
                        <img
                            src={image.src.src}
                            srcSet={image.src.srcSet}
                            alt={
                                image.src.alt ||
                                image.alt ||
                                `Image ${index + 1}`
                            }
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

    images: {
        type:         control: {
            type:             controls: {
                src: {
                    type:                     title: "Image",
                },
                alt: {
                    type:                     title: "Alt Text",
                    defaultValue: "Image",
                },
            },
        },
        defaultValue: [
            {
                src: {
                    src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
                    alt: "Image 1",
                },
                alt: "Image 1",
            },
            {
                src: {
                    src: "https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg",
                    alt: "Image 2",
                },
                alt: "Image 2",
            },
            {
                src: {
                    src: "https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg",
                    alt: "Image 3",
                },
                alt: "Image 3",
            },
            {
                src: {
                    src: "https://framerusercontent.com/images/2uTNEj5aTl2K3NJaEFWMbnrA.jpg",
                    alt: "Image 4",
                },
                alt: "Image 4",
            },
            {
                src: {
                    src: "https://framerusercontent.com/images/f9RiWoNpmlCMqVRIHz8l8wYfeI.jpg",
                    alt: "Image 5",
                },
                alt: "Image 5",
            },
        ],
        maxCount: 20,
    },
    speed: {
        type:         title: "Speed",
        defaultValue: 50,
        min: 10,
        max: 200,
        step: 10,
    },
    gap: {
        type:         title: "Gap",
        defaultValue: 16,
        min: 0,
        max: 50,
        step: 1,
        unit: "px",
    },
    imageSize: {
        type:         title: "Image Size",
        defaultValue: 100,
        min: 50,
        max: 300,
        step: 10,
        unit: "px",
    },
    pauseOnHover: {
        type:         title: "Pause on Hover",
        defaultValue: true,
        enabledTitle: "Yes",
        disabledTitle: "No",
    },
})
