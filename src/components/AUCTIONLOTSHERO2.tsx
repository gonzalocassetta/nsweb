// Mini hero section para introducir los lotes del remate de antigüedades

import { import type { CSSProperties } from "react"

interface AuctionLotsHeroProps {
    title: string
    subtitle: string
    backgroundColor: string
    titleColor: string
    subtitleColor: string
    titleFont: CSSProperties
    subtitleFont: CSSProperties
    style?: CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function AuctionLotsHero(props: AuctionLotsHeroProps) {
    const {
        title,
        subtitle,
        backgroundColor,
        titleColor,
        subtitleColor,
        titleFont,
        subtitleFont,
        style,
    } = props

    const isFixedWidth = style?.width === "100%"

    return (
        <div
            style={{
                ...style,
                position: "relative",
                width: "100%",
                backgroundColor,
                padding: "60px 40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                overflow: "hidden",
            }}
        >
            <h1
                style={{
                    margin: 0,
                    color: titleColor,
                    textAlign: "center",
                    width: isFixedWidth ? "100%" : "max-content",
                    ...titleFont,
                }}
            >
                {title}
            </h1>
            <p
                style={{
                    margin: 0,
                    color: subtitleColor,
                    textAlign: "center",
                    maxWidth: "800px",
                    width: isFixedWidth ? "100%" : "max-content",
                    ...subtitleFont,
                }}
            >
                {subtitle}
            </p>
        </div>
    )
}

    title: {
        type:         title: "Título",
        defaultValue: "LOTES DISPONIBLES",
    },
    subtitle: {
        type:         title: "Subtítulo",
        defaultValue:
            "Explora nuestra selección de antigüedades únicas en subasta",
        displayTextArea: true,
    },
    backgroundColor: {
        type:         title: "Fondo",
        defaultValue: "#0A2647",
    },
    titleColor: {
        type:         title: "Color Título",
        defaultValue: "#FFFFFF",
    },
    subtitleColor: {
        type:         title: "Color Subtítulo",
        defaultValue: "#CCCCCC",
    },
    titleFont: {
        type:         title: "Fuente Título",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "40px",
            variant: "Bold",
            letterSpacing: "-0.02em",
            lineHeight: "1em",
        },
    },
    subtitleFont: {
        type:         title: "Fuente Subtítulo",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "15px",
            variant: "Medium",
            letterSpacing: "-0.01em",
            lineHeight: "1.3em",
        },
    },
})
