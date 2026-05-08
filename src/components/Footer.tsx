// Footer component - fully editable with property controls for all elements
import { import type { CSSProperties } from "react"
import { useState, useEffect } from "react"

interface ContactInfo {
    label: string
    value: string
}

interface TeamMember {
    name: string
    matricula: string
}

interface FooterProps {
    anniversaryLogo: { src: string; alt: string }
    buttonText: string
    buttonColor: string
    buttonTextColor: string
    buttonFont: CSSProperties
    phoneLabel: string
    phoneValue: string
    emailLabel: string
    emailValue: string
    hoursLabel: string
    hoursValue: string
    officeLabel: string
    officeValue: string
    contactFont: CSSProperties
    contactLabelColor: string
    contactValueColor: string
    teamMembers: TeamMember[]
    teamFont: CSSProperties
    teamNameColor: string
    teamMatriculaColor: string
    link1Text: string
    link2Text: string
    link3Text: string
    linkFont: CSSProperties
    linkColor: string
    copyrightText: string
    copyrightFont: CSSProperties
    copyrightColor: string
    poweredByImage: { src: string; alt: string }
    backgroundColor: string
    iconColor: string
    style?: CSSProperties
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Footer(props: FooterProps) {
    const {
        anniversaryLogo = {
            src: "https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg",
            alt: "Anniversary Logo",
        },
        buttonText = "SUSCRIBIRME AL NEWSLETTER",
        buttonColor = "#004A8F",
        buttonTextColor = "#FFFFFF",
        buttonFont,
        phoneLabel = "Teléfono",
        phoneValue = "+598 2915 5801",
        emailLabel = "Correo",
        emailValue = "info@bavastronline.com.uy",
        hoursLabel = "Horarios",
        hoursValue = "Lun. a Vie. de 9:00 a 18:00hs.",
        officeLabel = "Oficinas",
        officeValue = "Cerrito 470",
        contactFont,
        contactLabelColor = "#666666",
        contactValueColor = "#004A8F",
        teamMembers = [
            { name: "HÉCTOR BAVASTRO CAVALLARO", matricula: "Matrícula: 2237" },
            {
                name: "EUGENIA BAVASTRO CAVALLARO",
                matricula: "Matrícula: 4402",
            },
            {
                name: "EUGENIO BAVASTRO MIRABALLES",
                matricula: "Matrícula: 5922",
            },
            {
                name: "LUCIANA BAVASTRO MIRABALLES",
                matricula: "Matrícula: 6790",
            },
        ],
        teamFont,
        teamNameColor = "#004A8F",
        teamMatriculaColor = "#666666",
        link1Text = "Preguntas Frecuentes",
        link2Text = "Contacto",
        link3Text = "Ver los Términos y Condiciones",
        linkFont,
        linkColor = "#004A8F",
        copyrightText = "© 2026, Todos los derechos reservados",
        copyrightFont,
        copyrightColor = "#999999",
        poweredByImage = {
            src: "https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg",
            alt: "Powered by",
        },
        backgroundColor = "#F5F5F5",
        iconColor = "#999999",
        style,
    } = props

    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        if (typeof window === "undefined") return

        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    return (
        <footer
            style={{
                ...style,
                backgroundColor,
                padding: isMobile ? "40px 20px 30px" : "60px 40px 40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: isMobile ? "30px" : "40px",
                width: "100%",
            }}
        >
            {/* Top Section - Logos */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "1200px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <img
                    {...anniversaryLogo}
                    style={{
                        height: isMobile ? "70px" : "100px",
                        objectFit: "contain",
                    }}
                />
            </div>

            {/* Newsletter Button */}
            <a
                href="https://www.facebook.com/pablo.cassetta"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    backgroundColor: buttonColor,
                    color: buttonTextColor,
                    border: "none",
                    borderRadius: "25px",
                    padding: isMobile ? "12px 24px" : "14px 40px",
                    cursor: "pointer",
                    ...buttonFont,
                    fontSize: isMobile
                        ? "12px"
                        : buttonFont?.fontSize || "14px",
                    width: isMobile ? "100%" : "auto",
                    maxWidth: isMobile ? "320px" : "none",
                    textDecoration: "none",
                    display: "inline-block",
                    textAlign: "center",
                }}
            >
                {buttonText}
            </a>

            {/* Contact Info */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "1200px",
                    display: "flex",
                    justifyContent: "center",
                    gap: isMobile ? "20px" : "60px",
                    flexWrap: "wrap",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                }}
            >
                {/* Phone */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <svg
                        width={isMobile ? "20" : "24"}
                        height={isMobile ? "20" : "24"}
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M20 15.5C18.75 15.5 17.55 15.3 16.43 14.93C16.08 14.82 15.69 14.9 15.41 15.17L13.21 17.37C10.38 15.93 8.06 13.62 6.62 10.79L8.82 8.58C9.1 8.31 9.18 7.92 9.07 7.57C8.7 6.45 8.5 5.25 8.5 4C8.5 3.45 8.05 3 7.5 3H4C3.45 3 3 3.45 3 4C3 13.39 10.61 21 20 21C20.55 21 21 20.55 21 20V16.5C21 15.95 20.55 15.5 20 15.5Z"
                            fill={iconColor}
                        />
                    </svg>
                    <div>
                        <div
                            style={{
                                ...contactFont,
                                color: contactLabelColor,
                                fontSize: isMobile ? "11px" : "12px",
                            }}
                        >
                            {phoneLabel}
                        </div>
                        <div
                            style={{
                                ...contactFont,
                                color: contactValueColor,
                                fontWeight: 600,
                                fontSize: isMobile
                                    ? "13px"
                                    : contactFont?.fontSize || "14px",
                            }}
                        >
                            {phoneValue}
                        </div>
                    </div>
                </div>

                {/* Email */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <svg
                        width={isMobile ? "20" : "24"}
                        height={isMobile ? "20" : "24"}
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                            fill={iconColor}
                        />
                    </svg>
                    <div>
                        <div
                            style={{
                                ...contactFont,
                                color: contactLabelColor,
                                fontSize: isMobile ? "11px" : "12px",
                            }}
                        >
                            {emailLabel}
                        </div>
                        <div
                            style={{
                                ...contactFont,
                                color: contactValueColor,
                                fontWeight: 600,
                                fontSize: isMobile
                                    ? "13px"
                                    : contactFont?.fontSize || "14px",
                            }}
                        >
                            {emailValue}
                        </div>
                    </div>
                </div>

                {/* Hours */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <svg
                        width={isMobile ? "20" : "24"}
                        height={isMobile ? "20" : "24"}
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"
                            fill={iconColor}
                        />
                    </svg>
                    <div>
                        <div
                            style={{
                                ...contactFont,
                                color: contactLabelColor,
                                fontSize: isMobile ? "11px" : "12px",
                            }}
                        >
                            {hoursLabel}
                        </div>
                        <div
                            style={{
                                ...contactFont,
                                color: contactValueColor,
                                fontWeight: 600,
                                fontSize: isMobile
                                    ? "13px"
                                    : contactFont?.fontSize || "14px",
                            }}
                        >
                            {hoursValue}
                        </div>
                    </div>
                </div>

                {/* Office */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <svg
                        width={isMobile ? "20" : "24"}
                        height={isMobile ? "20" : "24"}
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                            fill={iconColor}
                        />
                    </svg>
                    <div>
                        <div
                            style={{
                                ...contactFont,
                                color: contactLabelColor,
                                fontSize: isMobile ? "11px" : "12px",
                            }}
                        >
                            {officeLabel}
                        </div>
                        <div
                            style={{
                                ...contactFont,
                                color: contactValueColor,
                                fontWeight: 600,
                                fontSize: isMobile
                                    ? "13px"
                                    : contactFont?.fontSize || "14px",
                            }}
                        >
                            {officeValue}
                        </div>
                    </div>
                </div>
            </div>

            {/* Links */}
            <div
                style={{
                    display: "flex",
                    gap: isMobile ? "20px" : "30px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                }}
            >
                <a
                    href="/terminos"
                    style={{
                        ...linkFont,
                        color: linkColor,
                        textDecoration: "underline",
                        fontSize: isMobile ? "13px" : "14px",
                        textAlign: "center",
                    }}
                >
                    {link3Text}
                </a>
            </div>

            {/* Copyright */}
            <div
                style={{
                    ...copyrightFont,
                    color: copyrightColor,
                    fontSize: isMobile ? "11px" : "12px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? "8px" : "20px",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <span>{copyrightText}</span>
                <span>
                    Hecho por{" "}
                    <a
                        href="https://www.facebook.com/gonzalodevs"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: "#0066FF",
                            textDecoration: "underline",
                        }}
                    >
                        Gonzalo DevTeam
                    </a>
                </span>
            </div>
        </footer>
    )
}

    anniversaryLogo: {
        type:         title: "Anniversary Logo",
    },
    buttonText: {
        type:         title: "Button Text",
        defaultValue: "SUSCRIBIRME AL NEWSLETTER",
    },
    buttonColor: {
        type:         title: "Button Color",
        defaultValue: "#004A8F",
    },
    buttonTextColor: {
        type:         title: "Button Text Color",
        defaultValue: "#FFFFFF",
    },
    buttonFont: {
        type:         title: "Button Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "14px",
            variant: "Semibold",
            letterSpacing: "0.5px",
            lineHeight: "1em",
        },
    },
    phoneLabel: {
        type:         title: "Phone Label",
        defaultValue: "Teléfono",
    },
    phoneValue: {
        type:         title: "Phone Value",
        defaultValue: "+598 2915 5801",
    },
    emailLabel: {
        type:         title: "Email Label",
        defaultValue: "Correo",
    },
    emailValue: {
        type:         title: "Email Value",
        defaultValue: "info@bavastronline.com.uy",
    },
    hoursLabel: {
        type:         title: "Hours Label",
        defaultValue: "Horarios",
    },
    hoursValue: {
        type:         title: "Hours Value",
        defaultValue: "Lun. a Vie. de 9:00 a 18:00hs.",
    },
    officeLabel: {
        type:         title: "Office Label",
        defaultValue: "Oficinas",
    },
    officeValue: {
        type:         title: "Office Value",
        defaultValue: "Cerrito 470",
    },
    contactFont: {
        type:         title: "Contact Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "14px",
            variant: "Medium",
            letterSpacing: "-0.01em",
            lineHeight: "1.3em",
        },
    },
    contactLabelColor: {
        type:         title: "Contact Label Color",
        defaultValue: "#666666",
    },
    contactValueColor: {
        type:         title: "Contact Value Color",
        defaultValue: "#004A8F",
    },
    teamMembers: {
        type:         title: "Team Members",
        control: {
            type:             controls: {
                name: {
                    type:                     title: "Name",
                    defaultValue: "HÉCTOR BAVASTRO CAVALLARO",
                },
                matricula: {
                    type:                     title: "Matrícula",
                    defaultValue: "Matrícula: 2237",
                },
            },
        },
        defaultValue: [
            { name: "HÉCTOR BAVASTRO CAVALLARO", matricula: "Matrícula: 2237" },
            {
                name: "EUGENIA BAVASTRO CAVALLARO",
                matricula: "Matrícula: 4402",
            },
            {
                name: "EUGENIO BAVASTRO MIRABALLES",
                matricula: "Matrícula: 5922",
            },
            {
                name: "LUCIANA BAVASTRO MIRABALLES",
                matricula: "Matrícula: 6790",
            },
        ],
    },
    teamFont: {
        type:         title: "Team Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "11px",
            variant: "Medium",
            letterSpacing: "0.5px",
            lineHeight: "1.3em",
        },
    },
    teamNameColor: {
        type:         title: "Team Name Color",
        defaultValue: "#004A8F",
    },
    teamMatriculaColor: {
        type:         title: "Team Matrícula Color",
        defaultValue: "#666666",
    },
    link1Text: {
        type:         title: "Link 1 Text",
        defaultValue: "Preguntas Frecuentes",
    },
    link2Text: {
        type:         title: "Link 2 Text",
        defaultValue: "Contacto",
    },
    link3Text: {
        type:         title: "Link 3 Text",
        defaultValue: "Ver los Términos y Condiciones",
    },
    linkFont: {
        type:         title: "Link Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "14px",
            variant: "Medium",
            letterSpacing: "-0.01em",
            lineHeight: "1em",
        },
    },
    linkColor: {
        type:         title: "Link Color",
        defaultValue: "#004A8F",
    },
    copyrightText: {
        type:         title: "Copyright Text",
        defaultValue: "© 2026, Todos los derechos reservados",
    },
    copyrightFont: {
        type:         title: "Copyright Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "12px",
            variant: "Regular",
            letterSpacing: "-0.01em",
            lineHeight: "1em",
        },
    },
    copyrightColor: {
        type:         title: "Copyright Color",
        defaultValue: "#999999",
    },
    poweredByImage: {
        type:         title: "Powered By Image",
    },
    backgroundColor: {
        type:         title: "Background Color",
        defaultValue: "#F5F5F5",
    },
    iconColor: {
        type:         title: "Icon Color",
        defaultValue: "#999999",
    },
})
