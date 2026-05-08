import { import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect, startTransition } from "react"
import type { CSSProperties } from "react"

interface LiveHeroProps {
    title: string
    subtitle: string
    buttonText: string
    facebookUrl: string
    videoFile: string
    showVideo: boolean
    backgroundColor: string
    accentColor: string
    textColor: string
    buttonColor: string
    buttonTextColor: string
    button2Text: string
    button2Color: string
    button2TextColor: string
    button3Text: string
    button3Color: string
    button3TextColor: string
    titleFont: any
    subtitleFont: any
    buttonFont: any
    showPulse: boolean
    showLogo: boolean
    logoImage: string
    logoAlt: string
    style?: CSSProperties
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function LiveHeroNuevo(props: LiveHeroProps) {
    const {
        title,
        subtitle,
        buttonText,
        facebookUrl,
        videoFile = "https://framerusercontent.com/assets/MLWPbW1dUQawJLhhun3dBwpgJak.mp4",
        showVideo,
        backgroundColor,
        accentColor,
        textColor,
        buttonColor,
        buttonTextColor,
        button2Text,
        button2Color,
        button2TextColor,
        button3Text,
        button3Color,
        button3TextColor,
        titleFont,
        subtitleFont,
        buttonFont,
        showPulse,
        showLogo,
        logoImage = "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
        logoAlt = "Logo",
        style,
    } = props

    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.15 })
    const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">(
        "desktop"
    )

    useEffect(() => {
        if (typeof window !== "undefined") {
            const onResize = () =>
                startTransition(() => {
                    if (window.innerWidth <= 767) setViewport("mobile")
                    else if (window.innerWidth <= 1024) setViewport("tablet")
                    else setViewport("desktop")
                })
            onResize()
            window.addEventListener("resize", onResize)
            return () => window.removeEventListener("resize", onResize)
        }
    }, [])

    const isMobile = viewport === "mobile"
    const isTablet = viewport === "tablet"
    const isDesktop = viewport === "desktop"

    const scrollToId = (id: string) => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: "smooth" })
    }

    const fadeUp = (delay = 0) => ({
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
        },
    })

    const fadeIn = (delay = 0) => ({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut", delay },
        },
    })

    const animate = isInView ? "visible" : "hidden"

    return (
        <section
            ref={ref}
            style={{
                width: "100%",
                minHeight: isMobile ? "auto" : "100vh",
                position: "relative",
                overflow: "hidden",
                isolation: "isolate",
                background: backgroundColor,
                fontFamily: "'Georgia', serif",
                ...style,
            }}
        >
            {/* ── BG Layer 1: deep vignette from edges ── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(ellipse 90% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)`,
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            {/* ── BG Layer 2: gold bloom bottom-left ── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(ellipse 65% 55% at -5% 100%, ${accentColor}55 0%, transparent 60%)`,
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            {/* ── BG Layer 3: gold bloom top-right ── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(ellipse 50% 45% at 105% 0%, ${accentColor}40 0%, transparent 60%)`,
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            {/* ── BG Layer 4: deep blue stripe left ── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(105deg, rgba(2,8,30,0.9) 0%, transparent 45%)`,
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            {/* ── BG Layer 5: subtle diagonal grid lines ── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.07,
                    backgroundImage: `repeating-linear-gradient(
                    -55deg,
                    transparent,
                    transparent 40px,
                    rgba(255,255,255,0.15) 40px,
                    rgba(255,255,255,0.15) 41px
                )`,
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            />

            {/* ── BG Layer 6: grain noise ── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.12,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E")`,
                    backgroundSize: "300px 300px",
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            />

            {/* ── Divider line text/video ── */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    right: isDesktop ? "38%" : "0",
                    width: 1,
                    height: "100%",
                    background: `linear-gradient(180deg, transparent 0%, ${accentColor}60 35%, ${accentColor}80 65%, transparent 100%)`,
                    pointerEvents: "none",
                    zIndex: 2,
                    display: isDesktop ? "block" : "none",
                }}
            />

            {/* ── Main grid ── */}
            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    maxWidth: 1320,
                    margin: "0 auto",
                    minHeight: isMobile ? undefined : "100vh",
                    display: "grid",
                    gridTemplateColumns:
                        isDesktop && showVideo && videoFile
                            ? "1fr 380px"
                            : "1fr",
                    gridTemplateRows: "1fr",
                    alignItems: "stretch",
                }}
            >
                {/* ── LEFT / MAIN CONTENT ── */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: isMobile ? "flex-start" : "center",
                        padding: isMobile
                            ? "52px 22px 56px"
                            : isTablet
                              ? "60px 40px 50px"
                              : "72px 64px 72px 56px",
                        gap: 0,
                        minHeight: isMobile ? "100svh" : undefined,
                        boxSizing: "border-box",
                    }}
                >
                    {/* Top bar: logo + live badge */}
                    <motion.div
                        variants={fadeIn(0)}
                        initial="hidden"
                        animate={animate}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: isMobile ? 12 : 16,
                            marginBottom: isMobile ? 28 : 52,
                        }}
                    >
                        {showLogo && logoImage && (
                            <div
                                style={{
                                    position: "relative",
                                    flexShrink: 0,
                                }}
                            >
                                {/* Gold ring */}
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: -3,
                                        borderRadius: "50%",
                                        background: `conic-gradient(${accentColor} 0deg, ${accentColor}30 180deg, ${accentColor} 360deg)`,
                                    }}
                                />
                                <img
                                    src={logoImage}
                                    alt={logoAlt}
                                    style={{
                                        position: "relative",
                                        width: isMobile ? 44 : 64,
                                        height: isMobile ? 44 : 64,
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        background: "#0a1f40",
                                        display: "block",
                                    }}
                                />
                            </div>
                        )}

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 4,
                            }}
                        >
                            <div
                                style={{
                                    color: accentColor,
                                    fontSize: isMobile ? 10 : 11,
                                    fontWeight: 700,
                                    letterSpacing: "0.2em",
                                    textTransform: "uppercase",
                                    fontFamily: "'Georgia', serif",
                                    opacity: 0.9,
                                }}
                            >
                                Nuestro Sueño Antigüedades
                            </div>

                            {/* Live badge */}
                            <div
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    background: "rgba(255,255,255,0.06)",
                                    border: `1px solid ${accentColor}40`,
                                    borderRadius: 4,
                                    padding: isMobile ? "4px 8px" : "5px 10px",
                                    width: "fit-content",
                                    maxWidth: isMobile
                                        ? "calc(100vw - 100px)"
                                        : undefined,
                                }}
                            >
                                <span
                                    style={{
                                        position: "relative",
                                        display: "inline-block",
                                        width: 7,
                                        height: 7,
                                        flexShrink: 0,
                                    }}
                                >
                                    <span
                                        style={{
                                            display: "block",
                                            width: 7,
                                            height: 7,
                                            borderRadius: "50%",
                                            background: "#FF4444",
                                            position: "relative",
                                            zIndex: 1,
                                        }}
                                    />
                                    {showPulse && (
                                        <span
                                            style={{
                                                position: "absolute",
                                                inset: -2,
                                                borderRadius: "50%",
                                                background: "#FF4444",
                                                animation:
                                                    "pulseLive 1.8s ease-in-out infinite",
                                                zIndex: 0,
                                            }}
                                        />
                                    )}
                                </span>
                                <span
                                    style={{
                                        color: "#fff",
                                        fontSize: isMobile ? 9 : 10,
                                        fontWeight: 700,
                                        letterSpacing: isMobile
                                            ? "0.08em"
                                            : "0.15em",
                                        textTransform: "uppercase",
                                        fontFamily: "'Georgia', serif",
                                        lineHeight: "1.3em",
                                    }}
                                >
                                    En vivo este domingo en Facebook
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Decorative label */}
                    <motion.div
                        variants={fadeUp(0.1)}
                        initial="hidden"
                        animate={animate}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            marginBottom: isMobile ? 14 : 24,
                        }}
                    >
                        <div
                            style={{
                                width: 32,
                                height: 1,
                                background: accentColor,
                                opacity: 0.7,
                            }}
                        />
                        <span
                            style={{
                                color: accentColor,
                                fontSize: isMobile ? 10 : 11,
                                fontWeight: 400,
                                letterSpacing: "0.22em",
                                textTransform: "uppercase",
                                fontFamily: "'Georgia', serif",
                                fontStyle: "italic",
                                opacity: 0.85,
                            }}
                        >
                            Transmisión en vivo
                        </span>
                    </motion.div>

                    {/* TITLE — editorial large */}
                    <motion.h1
                        variants={fadeUp(0.18)}
                        initial="hidden"
                        animate={animate}
                        style={{
                            margin: 0,
                            color: textColor,
                            textTransform: "uppercase",
                            fontFamily: "'Georgia', 'Times New Roman', serif",
                            fontWeight: 700,
                            lineHeight: "0.92em",
                            letterSpacing: "-0.01em",
                            wordBreak: "break-word",
                            fontSize: isMobile
                                ? "clamp(40px, 12vw, 56px)"
                                : isTablet
                                  ? "clamp(52px, 8vw, 70px)"
                                  : "clamp(62px, 5.5vw, 86px)",
                            ...(titleFont || {}),
                        }}
                    >
                        {title}
                    </motion.h1>

                    {/* Gold rule */}
                    <motion.div
                        variants={fadeUp(0.26)}
                        initial="hidden"
                        animate={animate}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            margin: isMobile ? "22px 0" : "28px 0",
                        }}
                    >
                        <div
                            style={{
                                height: 2,
                                width: isMobile ? 50 : 70,
                                background: accentColor,
                                borderRadius: 2,
                            }}
                        />
                        <div
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: accentColor,
                                flexShrink: 0,
                            }}
                        />
                        <div
                            style={{
                                height: 1,
                                flex: 1,
                                maxWidth: isMobile ? 60 : 100,
                                background: `linear-gradient(90deg, ${accentColor}60, transparent)`,
                            }}
                        />
                    </motion.div>

                    {/* Subtitle */}
                    <motion.p
                        variants={fadeUp(0.32)}
                        initial="hidden"
                        animate={animate}
                        style={{
                            margin: 0,
                            color: textColor,
                            opacity: 0.75,
                            fontFamily: "'Georgia', serif",
                            fontStyle: "italic",
                            fontWeight: 400,
                            lineHeight: "1.65em",
                            maxWidth: 520,
                            fontSize: isMobile
                                ? "clamp(15px, 4vw, 17px)"
                                : isTablet
                                  ? "17px"
                                  : "18px",
                            ...(subtitleFont || {}),
                        }}
                    >
                        {subtitle}
                    </motion.p>

                    {/* ── BUTTONS ── */}
                    <motion.div
                        variants={fadeUp(0.42)}
                        initial="hidden"
                        animate={animate}
                        style={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            flexWrap: isMobile ? "nowrap" : "wrap",
                            gap: isMobile ? 10 : 12,
                            marginTop: isMobile ? 28 : 44,
                        }}
                    >
                        {/* Button 1 — Facebook CTA (primary) */}
                        <a
                            href={facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                height: isMobile ? 52 : 52,
                                width: isMobile ? "100%" : undefined,
                                padding: isMobile ? "0" : "0 28px",
                                borderRadius: 3,
                                background: buttonColor,
                                color: buttonTextColor,
                                border: `1.5px solid ${buttonColor}`,
                                textTransform: "uppercase",
                                letterSpacing: "0.14em",
                                fontWeight: 700,
                                fontSize: isMobile ? 12 : 12,
                                fontFamily: "'Georgia', serif",
                                whiteSpace: "nowrap",
                                transition: "all 0.2s ease",
                                cursor: "pointer",
                                boxSizing: "border-box",
                                ...(buttonFont || {}),
                            }}
                            onMouseEnter={(e) => {
                                const el = e.currentTarget
                                el.style.background = "transparent"
                                el.style.color = buttonColor
                            }}
                            onMouseLeave={(e) => {
                                const el = e.currentTarget
                                el.style.background = buttonColor
                                el.style.color = buttonTextColor
                            }}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                style={{ flexShrink: 0 }}
                            >
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            {buttonText}
                        </a>

                        {/* Button 2 — ghost style */}
                        <a
                            href="#venta"
                            onClick={(e) => {
                                e.preventDefault()
                                scrollToId("venta")
                            }}
                            style={{
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: isMobile ? 52 : 52,
                                width: isMobile ? "100%" : undefined,
                                padding: isMobile ? "0" : "0 28px",
                                borderRadius: 3,
                                background: "transparent",
                                color: textColor,
                                border: `1.5px solid rgba(255,255,255,0.28)`,
                                textTransform: "uppercase",
                                letterSpacing: "0.14em",
                                fontWeight: 700,
                                fontSize: isMobile ? 12 : 12,
                                fontFamily: "'Georgia', serif",
                                whiteSpace: "nowrap",
                                transition: "all 0.2s ease",
                                cursor: "pointer",
                                boxSizing: "border-box",
                                ...(buttonFont || {}),
                            }}
                            onMouseEnter={(e) => {
                                const el = e.currentTarget
                                el.style.borderColor = accentColor
                                el.style.color = accentColor
                            }}
                            onMouseLeave={(e) => {
                                const el = e.currentTarget
                                el.style.borderColor = "rgba(255,255,255,0.28)"
                                el.style.color = textColor
                            }}
                        >
                            {button2Text}
                        </a>

                        {/* Button 3 — accent filled */}
                        <a
                            href="#losquieroyo"
                            onClick={(e) => {
                                e.preventDefault()
                                scrollToId("losquieroyo")
                            }}
                            style={{
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: isMobile ? 52 : 52,
                                width: isMobile ? "100%" : undefined,
                                padding: isMobile ? "0" : "0 28px",
                                borderRadius: 3,
                                background: accentColor,
                                color: "#0D1B2A",
                                border: `1.5px solid ${accentColor}`,
                                textTransform: "uppercase",
                                letterSpacing: "0.14em",
                                fontWeight: 700,
                                fontSize: isMobile ? 12 : 12,
                                fontFamily: "'Georgia', serif",
                                whiteSpace: "nowrap",
                                transition: "all 0.2s ease",
                                cursor: "pointer",
                                boxSizing: "border-box",
                                ...(buttonFont || {}),
                            }}
                            onMouseEnter={(e) => {
                                const el = e.currentTarget
                                el.style.background = "transparent"
                                el.style.color = accentColor
                            }}
                            onMouseLeave={(e) => {
                                const el = e.currentTarget
                                el.style.background = accentColor
                                el.style.color = "#0D1B2A"
                            }}
                        >
                            {button3Text}
                        </a>
                    </motion.div>

                    {/* Bottom ornament */}
                    <motion.div
                        variants={fadeIn(0.55)}
                        initial="hidden"
                        animate={animate}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: isMobile ? 10 : 14,
                            marginTop: isMobile ? 36 : 56,
                            opacity: 0.35,
                        }}
                    >
                        <div
                            style={{
                                height: 1,
                                width: 24,
                                background: textColor,
                            }}
                        />
                        <div
                            style={{
                                height: 4,
                                width: 4,
                                borderRadius: "50%",
                                background: accentColor,
                            }}
                        />
                        <div
                            style={{
                                height: 1,
                                width: 24,
                                background: textColor,
                            }}
                        />
                        <span
                            style={{
                                color: textColor,
                                fontSize: 10,
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                fontFamily: "'Georgia', serif",
                            }}
                        >
                            Domingos · Facebook Live
                        </span>
                        <div
                            style={{
                                height: 1,
                                width: 24,
                                background: textColor,
                            }}
                        />
                        <div
                            style={{
                                height: 4,
                                width: 4,
                                borderRadius: "50%",
                                background: accentColor,
                            }}
                        />
                        <div
                            style={{
                                height: 1,
                                width: 24,
                                background: textColor,
                            }}
                        />
                    </motion.div>
                </div>

                {/* ── RIGHT / VIDEO PANEL — hidden on mobile ── */}
                {showVideo && videoFile && !isMobile && (
                    <motion.div
                        variants={fadeIn(0.25)}
                        initial="hidden"
                        animate={animate}
                        style={{
                            position: isDesktop ? "relative" : "relative",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: isDesktop
                                ? "48px 40px 48px 24px"
                                : isMobile
                                  ? "0 24px 48px"
                                  : "0 40px 56px",
                            background: isDesktop
                                ? `linear-gradient(90deg, transparent 0%, ${accentColor}06 100%)`
                                : "transparent",
                        }}
                    >
                        {/* Decorative vertical text */}
                        {isDesktop && (
                            <div
                                style={{
                                    position: "absolute",
                                    left: -8,
                                    top: "50%",
                                    transform:
                                        "translateY(-50%) rotate(-90deg)",
                                    transformOrigin: "center center",
                                    color: accentColor,
                                    opacity: 0.25,
                                    fontSize: 9,
                                    letterSpacing: "0.3em",
                                    textTransform: "uppercase",
                                    fontFamily: "'Georgia', serif",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Previa del Live
                            </div>
                        )}

                        {/* Video card */}
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                maxWidth: isDesktop
                                    ? 300
                                    : isMobile
                                      ? 260
                                      : 300,
                                margin: "0 auto",
                            }}
                        >
                            {/* Glow behind */}
                            <div
                                style={{
                                    position: "absolute",
                                    inset: -20,
                                    borderRadius: 24,
                                    background: `radial-gradient(ellipse at center, ${accentColor}18, transparent 70%)`,
                                    filter: "blur(20px)",
                                    pointerEvents: "none",
                                }}
                            />

                            {/* Corner accents */}
                            {[
                                {
                                    top: -8,
                                    left: -8,
                                    borderTop: `2px solid ${accentColor}`,
                                    borderLeft: `2px solid ${accentColor}`,
                                },
                                {
                                    top: -8,
                                    right: -8,
                                    borderTop: `2px solid ${accentColor}`,
                                    borderRight: `2px solid ${accentColor}`,
                                },
                                {
                                    bottom: -8,
                                    left: -8,
                                    borderBottom: `2px solid ${accentColor}`,
                                    borderLeft: `2px solid ${accentColor}`,
                                },
                                {
                                    bottom: -8,
                                    right: -8,
                                    borderBottom: `2px solid ${accentColor}`,
                                    borderRight: `2px solid ${accentColor}`,
                                },
                            ].map((s, i) => (
                                <div
                                    key={i}
                                    style={{
                                        position: "absolute",
                                        width: 18,
                                        height: 18,
                                        ...s,
                                        pointerEvents: "none",
                                        zIndex: 3,
                                    }}
                                />
                            ))}

                            {/* Video wrapper */}
                            <div
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    aspectRatio: "9/16",
                                    borderRadius: 14,
                                    overflow: "hidden",
                                    background: "#040f1e",
                                    border: `1px solid rgba(255,255,255,0.12)`,
                                    boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px ${accentColor}20`,
                                }}
                            >
                                <video
                                    src={videoFile}
                                    controls
                                    playsInline
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                        background: "#040f1e",
                                        display: "block",
                                    }}
                                />
                            </div>

                            {/* Badge */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: -14,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    zIndex: 4,
                                    background: "#0A1A35",
                                    border: `1px solid ${accentColor}60`,
                                    borderRadius: 3,
                                    padding: "5px 14px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <span
                                    style={{
                                        width: 5,
                                        height: 5,
                                        borderRadius: "50%",
                                        background: accentColor,
                                        flexShrink: 0,
                                        display: "block",
                                    }}
                                />
                                <span
                                    style={{
                                        color: accentColor,
                                        fontSize: 9,
                                        fontWeight: 700,
                                        letterSpacing: "0.2em",
                                        textTransform: "uppercase",
                                        fontFamily: "'Georgia', serif",
                                    }}
                                >
                                    Previa del live
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            <style>{`
                @keyframes pulseLive {
                    0%, 100% { opacity: 0.8; transform: scale(1); }
                    50% { opacity: 0; transform: scale(2.5); }
                }
            `}</style>
        </section>
    )
}

    title: {
        type:         title: "Título",
        defaultValue: "Gran Live de Antigüedades",
    },
    subtitle: {
        type:         title: "Subtítulo",
        defaultValue:
            "Este domingo te esperamos en Facebook con piezas únicas, historia y oportunidades en vivo.",
        displayTextArea: true,
    },
    showVideo: {
        type:         title: "Mostrar Video",
        defaultValue: true,
        enabledTitle: "Sí",
        disabledTitle: "No",
    },
    videoFile: {
        type:         title: "Video",
        allowedFileTypes: ["mp4", "webm", "mov"],
        hidden: ({ showVideo }) => !showVideo,
    },
    buttonText: {
        type:         title: "Botón Facebook",
        defaultValue: "Ver en Facebook",
    },
    facebookUrl: {
        type:         title: "URL Facebook",
        defaultValue: "https://www.facebook.com/pablo.cassetta/",
    },
    button2Text: {
        type:         title: "Botón 2",
        defaultValue: "Venta directa",
    },
    button3Text: {
        type:         title: "Botón 3",
        defaultValue: "Los quiero yo",
    },
    backgroundColor: {
        type:         title: "Fondo",
        defaultValue: "#060F1E",
    },
    accentColor: {
        type:         title: "Acento",
        defaultValue: "#C8983C",
    },
    textColor: {
        type:         title: "Texto",
        defaultValue: "#F0EAD6",
    },
    buttonColor: {
        type:         title: "Botón FB Color",
        defaultValue: "#1877F2",
    },
    buttonTextColor: {
        type:         title: "Botón FB Texto",
        defaultValue: "#FFFFFF",
    },
    button2Color: {
        type:         title: "Botón 2 Color",
        defaultValue: "#153E75",
    },
    button2TextColor: {
        type:         title: "Botón 2 Texto",
        defaultValue: "#FFFFFF",
    },
    button3Color: {
        type:         title: "Botón 3 Color",
        defaultValue: "#C8983C",
    },
    button3TextColor: {
        type:         title: "Botón 3 Texto",
        defaultValue: "#060F1E",
    },
    titleFont: {
        type:         title: "Fuente Título",
        controls: "extended",
        defaultFontType: "serif",
        defaultValue: {
            fontSize: "86px",
            variant: "Bold",
            letterSpacing: "-0.01em",
            lineHeight: "0.92em",
        },
    },
    subtitleFont: {
        type:         title: "Fuente Subtítulo",
        controls: "extended",
        defaultFontType: "serif",
        defaultValue: {
            fontSize: "18px",
            variant: "Regular Italic",
            letterSpacing: "0em",
            lineHeight: "1.65em",
        },
    },
    buttonFont: {
        type:         title: "Fuente Botones",
        controls: "extended",
        defaultFontType: "serif",
        defaultValue: {
            fontSize: "12px",
            variant: "Bold",
            letterSpacing: "0.14em",
            lineHeight: "1em",
        },
    },
    showPulse: {
        type:         title: "Pulso Live",
        defaultValue: true,
        enabledTitle: "Sí",
        disabledTitle: "No",
    },
    showLogo: {
        type:         title: "Mostrar Logo",
        defaultValue: true,
        enabledTitle: "Sí",
        disabledTitle: "No",
    },
    logoImage: {
        type:         title: "Logo",
        hidden: ({ showLogo }) => !showLogo,
    },
    logoAlt: {
        type:         title: "Alt Logo",
        defaultValue: "Logo",
        hidden: ({ showLogo }) => !showLogo,
    },
})
