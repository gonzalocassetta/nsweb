// Contact component with Google Maps location and social media links (WhatsApp, Facebook, Email)
// import { addPropertyControls, ControlType } from "framer"
// import { addPropertyControls, ControlType } from "framer"

interface ContactProps {
    mapLink: string
    whatsappNumber: string
    facebookUrl: string
    email: string
    backgroundColor: string
    textColor: string
    accentColor: string
    mapHeight: number
    showLabels: boolean
    heading: any
    labelFont: any
    style?: CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function Contact(props: ContactProps) {
    const {
        mapLink = "https://maps.google.com",
        whatsappNumber = "+1234567890",
        facebookUrl = "https://facebook.com",
        email = "contact@example.com",
        backgroundColor = "#F5F5F5",
        textColor = "#1a1a1a",
        accentColor = "#003366",
        mapHeight = 300,
        showLabels = true,
        heading,
        labelFont,
        style,
    } = props

    const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`
    const mailtoLink = `mailto:${email}`

    const contactItems = [
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                        fill={accentColor}
                    />
                </svg>
            ),
            label: "WhatsApp",
            link: whatsappLink,
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                        fill={accentColor}
                    />
                </svg>
            ),
            label: "Facebook",
            link: facebookUrl,
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                        fill={accentColor}
                    />
                </svg>
            ),
            label: "Email",
            link: mailtoLink,
        },
    ]

    return (
        <div
            style={{
                ...style,
                width: "100%",
                height: "100%",
                backgroundColor,
                display: "flex",
                flexDirection: "column",
                gap: 32,
                padding: 40,
                overflow: "auto",
            }}
        >
            <h2
                style={{
                    margin: 0,
                    color: textColor,
                    ...heading,
                }}
            >
                Contacto
            </h2>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                    width: "100%",
                    height: mapHeight,
                    borderRadius: 0,
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                    border: "1px solid #e0e0e0",
                }}
            >
                <iframe
                    src={mapLink}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación en Google Maps"
                />
            </motion.div>

            <div
                style={{
                    display: "flex",
                    gap: 20,
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                {contactItems.map((item, index) => (
                    <motion.a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                            duration: 0.5,
                            ease: "easeOut",
                            delay: index * 0.1,
                        }}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 12,
                            padding: "20px 24px",
                            borderRadius: 0,
                            backgroundColor: "#FFFFFF",
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                            minWidth: 120,
                            border: "1px solid #e0e0e0",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow =
                                "0 2px 6px rgba(0,0,0,0.12)"
                            e.currentTarget.style.borderColor = accentColor
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow =
                                "0 1px 3px rgba(0,0,0,0.08)"
                            e.currentTarget.style.borderColor = "#e0e0e0"
                        }}
                    >
                        <div style={{ width: 24, height: 24 }}>{item.icon}</div>
                        {showLabels && (
                            <span
                                style={{
                                    color: textColor,
                                    ...labelFont,
                                }}
                            >
                                {item.label}
                            </span>
                        )}
                    </motion.a>
                ))}
            </div>
        </div>
    )
}

    heading: {
        type:         title: "Heading Font",
        defaultValue: {
            fontSize: "28px",
            variant: "Semibold",
            letterSpacing: "-0.02em",
            lineHeight: "1.2em",
        },
        controls: "extended",
        defaultFontType: "sans-serif",
    },
    mapLink: {
        type:         title: "Google Maps Link",
        defaultValue: "https://maps.google.com",
        displayTextArea: true,
    },
    mapHeight: {
        type:         title: "Map Height",
        defaultValue: 300,
        min: 200,
        max: 600,
        step: 10,
        unit: "px",
    },
    whatsappNumber: {
        type:         title: "WhatsApp Number",
        defaultValue: "+1234567890",
        placeholder: "+1234567890",
    },
    facebookUrl: {
        type:         title: "Facebook URL",
        defaultValue: "https://facebook.com",
        placeholder: "https://facebook.com/yourpage",
    },
    email: {
        type:         title: "Email",
        defaultValue: "contact@example.com",
        placeholder: "contact@example.com",
    },
    showLabels: {
        type:         title: "Show Labels",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    labelFont: {
        type:         title: "Label Font",
        defaultValue: {
            fontSize: "13px",
            variant: "Medium",
            letterSpacing: "0em",
            lineHeight: "1.2em",
        },
        controls: "extended",
        defaultFontType: "sans-serif",
        hidden: ({ showLabels }) => !showLabels,
    },
    backgroundColor: {
        type:         title: "Background",
        defaultValue: "#F5F5F5",
    },
    textColor: {
        type:         title: "Text Color",
        defaultValue: "#1a1a1a",
    },
    accentColor: {
        type:         title: "Accent Color",
        defaultValue: "#003366",
    },
})
