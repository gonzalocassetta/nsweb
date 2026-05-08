import * as React from "react"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabase = createClient(
    "https://ywcjjzytqweldccmfclt.supabase.co",
    "sb_publishable_bqOA6KS5kkbXfuyXMZ9UyQ_c_qDB1BV"
)

// ─── Hook de viewport ─────────────────────────────────────────────────────────
function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(
        typeof window !== "undefined" ? window.innerWidth < 640 : false
    )
    React.useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < 640)
        window.addEventListener("resize", handler)
        return () => window.removeEventListener("resize", handler)
    }, [])
    return isMobile
}

// ─── Validaciones Uruguay ─────────────────────────────────────────────────────

function validarCedulaUY(raw: string): boolean {
    const ci = raw.replace(/\D/g, "")
    if (ci.length < 6 || ci.length > 8) return false
    const padded = ci.padStart(8, "0")
    const factors = [2, 9, 8, 7, 6, 3, 4]
    let sum = 0
    for (let i = 0; i < 7; i++) sum += parseInt(padded[i]) * factors[i]
    const remainder = sum % 10
    const verifier = remainder === 0 ? 0 : 10 - remainder
    return verifier === parseInt(padded[7])
}

function formatCedula(raw: string): string {
    const digits = raw.replace(/\D/g, "").slice(0, 8)
    if (digits.length <= 1) return digits
    if (digits.length <= 4) return digits.slice(0, -1) + "." + digits.slice(-1)
    const body = digits.slice(0, -1)
    const check = digits.slice(-1)
    if (body.length <= 3) return body + "-" + check
    const parts = body.padStart(7, "0")
    const formatted =
        parseInt(parts.slice(0, 1)) > 0
            ? `${parts.slice(0, 1)}.${parts.slice(1, 4)}.${parts.slice(4, 7)}`
            : `${parts.slice(1, 4)}.${parts.slice(4, 7)}`
    return formatted.replace(/^0+\.?/, "") + "-" + check
}

function validarTelefonoUY(raw: string): { ok: boolean; msg: string } {
    const digits = raw.replace(/\D/g, "")
    if (digits.length === 0) return { ok: false, msg: "" }
    if (digits.startsWith("09")) {
        if (digits.length !== 9)
            return { ok: false, msg: "Celular: 9 dígitos (09X XXX XXX)" }
        return { ok: true, msg: "" }
    }
    if (digits.startsWith("2")) {
        if (digits.length !== 8)
            return { ok: false, msg: "Fijo Mvd: 8 dígitos (2X XX XX XX)" }
        return { ok: true, msg: "" }
    }
    if (["3", "4", "5", "6", "7"].some((p) => digits.startsWith(p))) {
        if (digits.length !== 8)
            return { ok: false, msg: "Fijo interior: 8 dígitos" }
        return { ok: true, msg: "" }
    }
    return { ok: false, msg: "Ej: 099 123 456 ó 2901 2345" }
}

function formatTelefono(raw: string): string {
    const digits = raw.replace(/\D/g, "").slice(0, 9)
    if (digits.startsWith("09")) {
        if (digits.length <= 3) return digits
        if (digits.length <= 6)
            return digits.slice(0, 3) + " " + digits.slice(3)
        return (
            digits.slice(0, 3) +
            " " +
            digits.slice(3, 6) +
            " " +
            digits.slice(6)
        )
    }
    if (digits.length <= 2) return digits
    if (digits.length <= 6)
        return (
            digits.slice(0, 2) +
            " " +
            digits.slice(2, 4) +
            " " +
            digits.slice(4)
        )
    return (
        digits.slice(0, 2) +
        " " +
        digits.slice(2, 4) +
        " " +
        digits.slice(4, 6) +
        " " +
        digits.slice(6)
    )
}

type Mode = "login" | "register"
type FieldErrors = Record<string, string>

// ─── InputField ───────────────────────────────────────────────────────────────

function InputField({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    error,
    hint,
    required,
    inputMode,
}: {
    label: string
    type?: string
    value: string
    onChange: (v: string) => void
    placeholder?: string
    error?: string
    hint?: string
    required?: boolean
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
}) {
    const [focused, setFocused] = React.useState(false)
    const hasError = !!error
    const isValid = !hasError && value.length > 0

    return (
        <div style={{ marginBottom: "4px" }}>
            <label style={f.label}>
                {label}
                {required && <span style={{ color: "#e53e3e" }}> *</span>}
            </label>
            <div
                style={{
                    position: "relative",
                    borderRadius: "10px",
                    border: `1.5px solid ${hasError ? "#e53e3e" : focused ? "#003380" : isValid ? "#38a169" : "#d1d5db"}`,
                    background: hasError
                        ? "#fff5f5"
                        : isValid
                          ? "#f0fff4"
                          : "#fff",
                    transition: "all 0.2s",
                }}
            >
                <input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    inputMode={inputMode}
                    required={required}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(e) => onChange(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "13px 40px 13px 14px",
                        border: "none",
                        background: "transparent",
                        fontSize: "16px",
                        color: "#1a202c",
                        outline: "none",
                        boxSizing: "border-box" as const,
                        fontFamily: "'DM Sans', sans-serif",
                        WebkitAppearance: "none",
                    }}
                />
                {isValid && (
                    <span
                        style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#38a169",
                            fontSize: "16px",
                        }}
                    >
                        ✓
                    </span>
                )}
                {hasError && (
                    <span
                        style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#e53e3e",
                            fontSize: "16px",
                        }}
                    >
                        !
                    </span>
                )}
            </div>
            {hasError && <p style={f.errorMsg}>{error}</p>}
            {!hasError && hint && <p style={f.hintMsg}>{hint}</p>}
        </div>
    )
}

function PasswordField({
    label,
    value,
    onChange,
    error,
    showStrength,
}: {
    label: string
    value: string
    onChange: (v: string) => void
    error?: string
    showStrength?: boolean
}) {
    const [show, setShow] = React.useState(false)
    const [focused, setFocused] = React.useState(false)

    const strength = React.useMemo(() => {
        if (!value) return 0
        let s = 0
        if (value.length >= 8) s++
        if (/[A-Z]/.test(value)) s++
        if (/[0-9]/.test(value)) s++
        if (/[^A-Za-z0-9]/.test(value)) s++
        return s
    }, [value])

    const strengthLabel = ["", "Débil", "Regular", "Buena", "Fuerte"][strength]
    const strengthColor = ["", "#e53e3e", "#dd6b20", "#d69e2e", "#38a169"][
        strength
    ]

    return (
        <div style={{ marginBottom: "4px" }}>
            <label style={f.label}>
                {label}
                <span style={{ color: "#e53e3e" }}> *</span>
            </label>
            <div
                style={{
                    position: "relative",
                    borderRadius: "10px",
                    border: `1.5px solid ${error ? "#e53e3e" : focused ? "#003380" : "#d1d5db"}`,
                    background: error ? "#fff5f5" : "#fff",
                    transition: "all 0.2s",
                }}
            >
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(e) => onChange(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "13px 72px 13px 14px",
                        border: "none",
                        background: "transparent",
                        fontSize: "16px",
                        color: "#1a202c",
                        outline: "none",
                        boxSizing: "border-box" as const,
                        fontFamily: "'DM Sans', sans-serif",
                        WebkitAppearance: "none",
                    }}
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#718096",
                        fontSize: "12px",
                        padding: "4px 6px",
                        fontFamily: "'DM Sans', sans-serif",
                        WebkitTapHighlightColor: "transparent",
                    }}
                >
                    {show ? "OCULTAR" : "VER"}
                </button>
            </div>
            {showStrength && value.length > 0 && (
                <div style={{ marginTop: "6px" }}>
                    <div
                        style={{
                            display: "flex",
                            gap: "4px",
                            marginBottom: "3px",
                        }}
                    >
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                style={{
                                    flex: 1,
                                    height: "4px",
                                    borderRadius: "2px",
                                    background:
                                        i <= strength
                                            ? strengthColor
                                            : "#e2e8f0",
                                    transition: "background 0.3s",
                                }}
                            />
                        ))}
                    </div>
                    <p style={{ ...f.hintMsg, color: strengthColor }}>
                        {strengthLabel}
                    </p>
                </div>
            )}
            {error && <p style={f.errorMsg}>{error}</p>}
        </div>
    )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export default function Navbar() {
    const isMobile = useIsMobile()
    const [user, setUser] = React.useState<any>(null)
    const [profileName, setProfileName] = React.useState("")
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [mode, setMode] = React.useState<Mode>("login")
    const [loading, setLoading] = React.useState(false)
    const [signingOut, setSigningOut] = React.useState(false)
    const [sendingReset, setSendingReset] = React.useState(false)
    const [successMsg, setSuccessMsg] = React.useState("")
    const [infoMsg, setInfoMsg] = React.useState("")
    const [errors, setErrors] = React.useState<FieldErrors>({})
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [fullName, setFullName] = React.useState("")
    const [phone, setPhone] = React.useState("")
    const [cedula, setCedula] = React.useState("")

    // Solo recargar si el evento fue disparado por una acción del usuario (login/logout)
    const authIntentRef = React.useRef<null | "login" | "logout">(null)
    const reloadScheduledRef = React.useRef(false)

    const loadProfileName = React.useCallback(async (uid: string) => {
        const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", uid)
            .single()

        if (profile?.full_name) setProfileName(profile.full_name)
        else setProfileName("")
    }, [])

    React.useEffect(() => {
        let mounted = true

        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (!mounted) return
            const u = session?.user ?? null
            setUser(u)
            if (u) await loadProfileName(u.id)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return

            const u = session?.user ?? null
            setUser(u)

            if (event === "SIGNED_OUT") {
                setProfileName("")
                setSigningOut(false)
            } else if (u) {
                await loadProfileName(u.id)
            }

            const shouldReloadNow =
                (event === "SIGNED_IN" && authIntentRef.current === "login") ||
                (event === "SIGNED_OUT" && authIntentRef.current === "logout")

            if (shouldReloadNow && !reloadScheduledRef.current) {
                reloadScheduledRef.current = true
                authIntentRef.current = null
                window.setTimeout(() => {
                    window.location.reload()
                }, 250)
            }

            if (event === "SIGNED_IN") {
                setIsModalOpen(false)
                setErrors({})
                setInfoMsg("")
                setSuccessMsg("")
            }
        })

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [loadProfileName])

    const handleSignOut = async () => {
        if (signingOut) return
        setSigningOut(true)
        authIntentRef.current = "logout"
        try {
            const { error } = await supabase.auth.signOut()
            if (error) {
                authIntentRef.current = null
                setErrors({ general: error.message })
                setSigningOut(false)
            }
        } catch {
            authIntentRef.current = null
            setErrors({
                general: "No se pudo cerrar sesión. Intentá nuevamente.",
            })
            setSigningOut(false)
        }
    }

    const resetForm = () => {
        setEmail("")
        setPassword("")
        setFullName("")
        setPhone("")
        setCedula("")
        setErrors({})
        setSuccessMsg("")
        setInfoMsg("")
    }

    const switchMode = (m: Mode) => {
        setMode(m)
        resetForm()
    }

    const closeModal = () => {
        setIsModalOpen(false)
        resetForm()
    }

    const handlePhoneChange = (raw: string) => {
        const formatted = formatTelefono(raw)
        setPhone(formatted)
        const { ok, msg } = validarTelefonoUY(formatted)
        setErrors((prev) => ({ ...prev, phone: ok ? "" : msg }))
    }

    const handleCedulaChange = (raw: string) => {
        const digits = raw.replace(/\D/g, "").slice(0, 8)
        const formatted = formatCedula(digits)
        setCedula(formatted)
        if (digits.length >= 7) {
            const ok = validarCedulaUY(digits)
            setErrors((prev) => ({
                ...prev,
                cedula: ok ? "" : "Cédula inválida. Verificá el número.",
            }))
        } else {
            setErrors((prev) => ({ ...prev, cedula: "" }))
        }
    }

    const handleForgotPassword = async () => {
        setInfoMsg("")
        setErrors((prev) => ({ ...prev, general: "" }))

        const cleanEmail = email.trim()
        if (!cleanEmail) {
            setErrors((prev) => ({
                ...prev,
                general:
                    "Ingresá tu email para enviarte el link de recuperación.",
            }))
            return
        }

        setSendingReset(true)
        const redirectTo = `${window.location.origin}/reset-password`
        const { error } = await supabase.auth.resetPasswordForEmail(
            cleanEmail,
            {
                redirectTo,
            }
        )
        setSendingReset(false)

        if (error) {
            setErrors((prev) => ({ ...prev, general: error.message }))
            return
        }

        setInfoMsg(
            "Te enviamos un link para restaurar tu contraseña. Revisá tu correo."
        )
    }

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setInfoMsg("")

        const newErrors: FieldErrors = {}
        if (mode === "register") {
            if (!fullName.trim() || fullName.trim().split(" ").length < 2)
                newErrors.fullName = "Ingresá nombre y apellido."
            const { ok: phoneOk, msg: phoneMsg } = validarTelefonoUY(phone)
            if (!phoneOk) newErrors.phone = phoneMsg || "Teléfono requerido."
            const cDigits = cedula.replace(/\D/g, "")
            if (!validarCedulaUY(cDigits))
                newErrors.cedula = "Cédula uruguaya inválida."
            if (password.length < 8) newErrors.password = "Mínimo 8 caracteres."
        }

        if (Object.keys(newErrors).some((k) => newErrors[k])) {
            setErrors(newErrors)
            return
        }

        setLoading(true)

        if (mode === "login") {
            authIntentRef.current = "login"
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) {
                authIntentRef.current = null
                setErrors({ general: "Email o contraseña incorrectos." })
            } else {
                closeModal()
            }
        } else {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName.trim(),
                        phone: phone.replace(/\D/g, ""),
                        cedula: cedula.replace(/\D/g, ""),
                    },
                },
            })
            if (error) {
                setErrors({ general: error.message })
            } else {
                setSuccessMsg("¡Cuenta creada! Revisá tu email para confirmar.")
            }
        }

        setLoading(false)
    }

    const displayName = profileName || user?.email?.split("@")[0] || ""
    const initials = profileName
        ? profileName
              .split(" ")
              .map((w: string) => w[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()
        : user?.email?.[0]?.toUpperCase() || "?"

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap"
                rel="stylesheet"
            />
            <style>{`
                * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
                body { margin: 0; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            <nav style={{ ...n.nav, height: isMobile ? "58px" : "66px" }}>
                <div style={n.inner}>
                    <div
                        style={n.logo}
                        onClick={() => (window.location.href = "/")}
                    >
                        <span
                            style={{
                                ...n.logoBold,
                                fontSize: isMobile ? "16px" : "20px",
                            }}
                        >
                            NUESTRO SUEÑO
                        </span>
                        {!isMobile && (
                            <span style={n.logoLight}> ANTIGUEDADES</span>
                        )}
                    </div>

                    {user ? (
                        <div style={n.userArea}>
                            <div
                                style={{
                                    ...n.avatar,
                                    width: isMobile ? "32px" : "36px",
                                    height: isMobile ? "32px" : "36px",
                                }}
                            >
                                {initials}
                            </div>
                            {!isMobile && (
                                <div style={n.userInfo}>
                                    <span style={n.userName}>
                                        {displayName}
                                    </span>
                                    <span style={n.userEmail}>
                                        {user.email}
                                    </span>
                                </div>
                            )}
                            <button
                                onClick={handleSignOut}
                                disabled={signingOut}
                                style={{
                                    ...n.btnLogout,
                                    padding: isMobile ? "6px 10px" : "6px 14px",
                                    fontSize: isMobile ? "11px" : "12px",
                                    opacity: signingOut ? 0.6 : 1,
                                    cursor: signingOut
                                        ? "not-allowed"
                                        : "pointer",
                                }}
                            >
                                {signingOut ? "Saliendo..." : "Salir"}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            style={{
                                ...n.btnCTA,
                                padding: isMobile ? "8px 14px" : "9px 20px",
                                fontSize: isMobile ? "13px" : "14px",
                            }}
                        >
                            <span>Ingresar</span>
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                        </button>
                    )}
                </div>
            </nav>

            {isModalOpen && (
                <div
                    style={m.overlay}
                    onClick={(e) =>
                        e.target === e.currentTarget && closeModal()
                    }
                >
                    <div
                        style={{
                            ...m.sheet,
                            maxHeight: isMobile ? "100dvh" : "90vh",
                            borderRadius: isMobile ? "20px 20px 0 0" : "16px",
                            maxWidth: isMobile ? "100%" : "400px",
                            alignSelf: isMobile ? "flex-end" : "center",
                            overflowY: "auto",
                        }}
                    >
                        <div style={m.header}>
                            <div>
                                <p style={m.headerEyebrow}>Remate Online</p>
                                <h2
                                    style={{
                                        ...m.headerTitle,
                                        fontSize: isMobile ? "20px" : "22px",
                                    }}
                                >
                                    {mode === "login"
                                        ? "Bienvenido de nuevo"
                                        : "Crear cuenta"}
                                </h2>
                            </div>
                            <button onClick={closeModal} style={m.closeBtn}>
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div style={m.tabRow}>
                            {(["login", "register"] as Mode[]).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => switchMode(t)}
                                    style={{
                                        ...m.tab,
                                        ...(mode === t ? m.tabActive : {}),
                                    }}
                                >
                                    {t === "login"
                                        ? "Iniciar sesión"
                                        : "Registrarse"}
                                </button>
                            ))}
                        </div>

                        {successMsg ? (
                            <div
                                style={{
                                    ...m.successBox,
                                    paddingBottom: "24px",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "40px",
                                        marginBottom: "8px",
                                    }}
                                >
                                    ✅
                                </div>
                                <p
                                    style={{
                                        fontWeight: "600",
                                        color: "#1a202c",
                                        marginBottom: "4px",
                                        fontSize: "16px",
                                    }}
                                >
                                    {successMsg}
                                </p>
                                <p
                                    style={{
                                        fontSize: "13px",
                                        color: "#718096",
                                    }}
                                >
                                    Podés cerrar esta ventana.
                                </p>
                                <button
                                    onClick={closeModal}
                                    style={{
                                        ...n.btnCTA,
                                        marginTop: "16px",
                                        width: "100%",
                                        justifyContent: "center",
                                    }}
                                >
                                    Cerrar
                                </button>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleAuth}
                                style={{ ...m.form, paddingBottom: "8px" }}
                            >
                                {errors.general && (
                                    <div style={m.errorBanner}>
                                        <span>⚠️</span> {errors.general}
                                    </div>
                                )}
                                {infoMsg && (
                                    <div style={m.infoBanner}>✉️ {infoMsg}</div>
                                )}

                                {mode === "register" && (
                                    <>
                                        <InputField
                                            label="Nombre completo"
                                            value={fullName}
                                            onChange={setFullName}
                                            placeholder="Juan Pérez"
                                            error={errors.fullName}
                                            hint="Nombre y apellido como figura en tu cédula"
                                            required
                                        />
                                        <InputField
                                            label="Cédula de identidad"
                                            value={cedula}
                                            onChange={handleCedulaChange}
                                            placeholder="1.234.567-8"
                                            error={errors.cedula}
                                            hint={
                                                cedula.replace(/\D/g, "")
                                                    .length >= 7 &&
                                                !errors.cedula
                                                    ? "✓ Cédula válida"
                                                    : "Formato: 1.234.567-8"
                                            }
                                            inputMode="numeric"
                                            required
                                        />
                                        <InputField
                                            label="Teléfono / WhatsApp"
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            placeholder="099 123 456"
                                            error={errors.phone}
                                            hint="Celular: 09X XXX XXX · Fijo: 2X XX XX XX"
                                            inputMode="tel"
                                            required
                                        />
                                    </>
                                )}

                                <InputField
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={setEmail}
                                    placeholder="correo@ejemplo.com"
                                    required
                                />

                                <PasswordField
                                    label="Contraseña"
                                    value={password}
                                    onChange={setPassword}
                                    error={errors.password}
                                    showStrength={mode === "register"}
                                />

                                {mode === "login" && (
                                    <div
                                        style={{
                                            textAlign: "right",
                                            marginTop: "-2px",
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={handleForgotPassword}
                                            disabled={sendingReset}
                                            style={{
                                                ...m.linkBtn,
                                                fontSize: "12px",
                                                opacity: sendingReset ? 0.7 : 1,
                                            }}
                                        >
                                            {sendingReset
                                                ? "Enviando..."
                                                : "Olvidé mi contraseña?"}
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        ...m.submitBtn,
                                        opacity: loading ? 0.7 : 1,
                                        cursor: loading
                                            ? "not-allowed"
                                            : "pointer",
                                        padding: "15px",
                                        fontSize: "15px",
                                    }}
                                >
                                    {loading ? (
                                        <span
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <span style={m.spinner} />{" "}
                                            Procesando...
                                        </span>
                                    ) : mode === "login" ? (
                                        "Iniciar sesión"
                                    ) : (
                                        "Crear cuenta"
                                    )}
                                </button>

                                {mode === "login" && (
                                    <p
                                        style={{
                                            textAlign: "center",
                                            fontSize: "13px",
                                            color: "#718096",
                                            marginTop: "4px",
                                        }}
                                    >
                                        ¿No tenés cuenta?{" "}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                switchMode("register")
                                            }
                                            style={{
                                                ...m.linkBtn,
                                                fontSize: "13px",
                                            }}
                                        >
                                            Registrate
                                        </button>
                                    </p>
                                )}
                            </form>
                        )}

                        <p style={m.footerNote}>
                            🔒 Tus datos están protegidos y nunca serán
                            compartidos.
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const n: Record<string, React.CSSProperties> = {
    nav: {
        width: "100%",
        background: "#001f5c",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        fontFamily: "'DM Sans', sans-serif",
        position: "sticky",
        top: 0,
        zIndex: 100,
    },
    inner: {
        width: "95%",
        maxWidth: "1280px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logo: {
        cursor: "pointer",
        userSelect: "none" as const,
        letterSpacing: "0.5px",
    },
    logoBold: {
        fontWeight: "700",
        color: "#ffffff",
        fontFamily: "'DM Serif Display', serif",
    },
    logoLight: {
        fontSize: "20px",
        fontWeight: "300",
        color: "rgba(255,255,255,0.55)",
        fontFamily: "'DM Serif Display', serif",
    },
    userArea: { display: "flex", alignItems: "center", gap: "8px" },
    avatar: {
        borderRadius: "50%",
        background: "linear-gradient(135deg, #f0ad4e, #e07b00)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "13px",
        fontWeight: "700",
        color: "#fff",
        flexShrink: 0,
    },
    userInfo: { display: "flex", flexDirection: "column", gap: "1px" },
    userName: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#fff",
        lineHeight: "1.2",
        maxWidth: "160px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    userEmail: {
        fontSize: "11px",
        color: "rgba(255,255,255,0.45)",
        maxWidth: "160px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    btnLogout: {
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        color: "rgba(255,255,255,0.7)",
        borderRadius: "6px",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "500",
    },
    btnCTA: {
        background: "#f0ad4e",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: "0 2px 8px rgba(240,173,78,0.35)",
    },
}

const m: Record<string, React.CSSProperties> = {
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,15,40,0.8)",
        backdropFilter: "blur(4px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        zIndex: 2000,
    },
    sheet: {
        background: "#fff",
        width: "100%",
        boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
        fontFamily: "'DM Sans', sans-serif",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "24px 24px 0 24px",
    },
    headerEyebrow: {
        fontSize: "11px",
        fontWeight: "600",
        color: "#f0ad4e",
        textTransform: "uppercase" as const,
        letterSpacing: "1px",
        margin: "0 0 4px 0",
    },
    headerTitle: {
        fontWeight: "700",
        color: "#001f5c",
        margin: 0,
        fontFamily: "'DM Serif Display', serif",
    },
    closeBtn: {
        background: "#f7f8fa",
        border: "none",
        borderRadius: "8px",
        width: "36px",
        height: "36px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#718096",
        flexShrink: 0,
    },
    tabRow: {
        display: "flex",
        margin: "16px 24px 0",
        borderBottom: "1px solid #e2e8f0",
    },
    tab: {
        flex: 1,
        padding: "12px 0",
        border: "none",
        background: "none",
        cursor: "pointer",
        color: "#a0aec0",
        fontSize: "14px",
        fontWeight: "500",
        fontFamily: "'DM Sans', sans-serif",
        borderBottom: "2px solid transparent",
    },
    tabActive: {
        color: "#001f5c",
        fontWeight: "700",
        borderBottom: "2px solid #003380",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "16px 24px 0",
    },
    errorBanner: {
        background: "#fff5f5",
        border: "1px solid #fed7d7",
        borderRadius: "8px",
        padding: "12px 14px",
        fontSize: "13px",
        color: "#c53030",
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    infoBanner: {
        background: "#ebf8ff",
        border: "1px solid #bee3f8",
        borderRadius: "8px",
        padding: "12px 14px",
        fontSize: "13px",
        color: "#2b6cb0",
    },
    submitBtn: {
        background: "linear-gradient(135deg, #003380 0%, #0055cc 100%)",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        fontWeight: "700",
        fontFamily: "'DM Sans', sans-serif",
        cursor: "pointer",
        marginTop: "4px",
        width: "100%",
        boxShadow: "0 4px 12px rgba(0,51,128,0.3)",
    },
    linkBtn: {
        background: "none",
        border: "none",
        color: "#003380",
        cursor: "pointer",
        fontWeight: "600",
        fontFamily: "'DM Sans', sans-serif",
        padding: 0,
    },
    successBox: {
        textAlign: "center" as const,
        padding: "24px 24px 0",
        fontFamily: "'DM Sans', sans-serif",
    },
    footerNote: {
        textAlign: "center" as const,
        fontSize: "11px",
        color: "#a0aec0",
        padding: "14px 24px 20px",
        margin: 0,
        borderTop: "1px solid #f0f0f0",
        marginTop: "14px",
    },
    spinner: {
        display: "inline-block",
        width: "14px",
        height: "14px",
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
    },
}

const f: Record<string, React.CSSProperties> = {
    label: {
        display: "block",
        fontSize: "13px",
        fontWeight: "600",
        color: "#4a5568",
        marginBottom: "5px",
        fontFamily: "'DM Sans', sans-serif",
    },
    errorMsg: {
        margin: "4px 0 0",
        fontSize: "12px",
        color: "#e53e3e",
        fontFamily: "'DM Sans', sans-serif",
    },
    hintMsg: {
        margin: "4px 0 0",
        fontSize: "12px",
        color: "#718096",
        fontFamily: "'DM Sans', sans-serif",
    },
}
