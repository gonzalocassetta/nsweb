import * as React from "react"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabase = createClient(
    "https://ywcjjzytqweldccmfclt.supabase.co",
    "sb_publishable_bqOA6KS5kkbXfuyXMZ9UyQ_c_qDB1BV"
)

type User = { id: string; email?: string }

type DirectProduct = {
    id: string
    title: string
    description: string | null
    price: number
    image_url: string | null
    image_urls: string[] | null
    is_active: boolean
    is_sold: boolean
    sold_at: string | null
    created_at: string
}

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

function getImages(p: DirectProduct) {
    const arr = Array.isArray(p.image_urls)
        ? p.image_urls.map((x) => String(x).trim()).filter(Boolean)
        : []
    const legacy = p.image_url ? [p.image_url.trim()] : []
    const unique = [...new Set([...arr, ...legacy])]
    return unique.length > 0
        ? unique
        : ["https://placehold.co/700x700?text=Sin+imagen"]
}

function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n))
}

function touchDistance(t1: Touch, t2: Touch) {
    const dx = t1.clientX - t2.clientX
    const dy = t1.clientY - t2.clientY
    return Math.sqrt(dx * dx + dy * dy)
}

function ImagePreviewModal({
    open,
    images,
    index,
    title,
    isMobile,
    onClose,
    onPrev,
    onNext,
    onSetIndex,
}: {
    open: boolean
    images: string[]
    index: number
    title: string
    isMobile: boolean
    onClose: () => void
    onPrev: () => void
    onNext: () => void
    onSetIndex: (i: number) => void
}) {
    const [zoom, setZoom] = React.useState(1)
    const pinchRef = React.useRef<{ distance: number; zoom: number } | null>(
        null
    )
    const swipeStartX = React.useRef<number | null>(null)
    const swipeCurrentX = React.useRef<number | null>(null)

    React.useEffect(() => {
        if (!open) return
        setZoom(1)
    }, [open, index])

    React.useEffect(() => {
        if (!open) return
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = prev
        }
    }, [open])

    React.useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
            if (e.key === "ArrowLeft" && images.length > 1) onPrev()
            if (e.key === "ArrowRight" && images.length > 1) onNext()
            if (e.key === "+" || e.key === "=")
                setZoom((z) => clamp(z + 0.25, 1, 4))
            if (e.key === "-") setZoom((z) => clamp(z - 0.25, 1, 4))
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [open, images.length, onClose, onPrev, onNext])

    if (!open) return null

    const current =
        images[index] || "https://placehold.co/1200x900?text=Sin+imagen"

    const zoomIn = () => setZoom((z) => clamp(z + 0.25, 1, 4))
    const zoomOut = () => setZoom((z) => clamp(z - 0.25, 1, 4))
    const resetZoom = () => setZoom(1)

    return (
        <div style={s.modalOverlay} onClick={onClose}>
            <div
                style={s.modal}
                onClick={(e) => e.stopPropagation()}
                onWheel={(e) => {
                    e.preventDefault()
                    const delta = e.deltaY < 0 ? 0.2 : -0.2
                    setZoom((z) => clamp(z + delta, 1, 4))
                }}
                onTouchStart={(e) => {
                    if (e.touches.length === 2) {
                        pinchRef.current = {
                            distance: touchDistance(e.touches[0], e.touches[1]),
                            zoom,
                        }
                        return
                    }
                    if (e.touches.length === 1 && zoom === 1) {
                        swipeStartX.current = e.touches[0].clientX
                        swipeCurrentX.current = e.touches[0].clientX
                    }
                }}
                onTouchMove={(e) => {
                    if (e.touches.length === 2 && pinchRef.current) {
                        const d = touchDistance(e.touches[0], e.touches[1])
                        const factor = d / pinchRef.current.distance
                        setZoom(clamp(pinchRef.current.zoom * factor, 1, 4))
                        return
                    }
                    if (e.touches.length === 1 && zoom === 1) {
                        swipeCurrentX.current = e.touches[0].clientX
                    }
                }}
                onTouchEnd={() => {
                    pinchRef.current = null
                    if (zoom !== 1 || images.length < 2) return
                    if (
                        swipeStartX.current == null ||
                        swipeCurrentX.current == null
                    )
                        return
                    const dx = swipeCurrentX.current - swipeStartX.current
                    if (dx > 45) onPrev()
                    if (dx < -45) onNext()
                    swipeStartX.current = null
                    swipeCurrentX.current = null
                }}
            >
                <div style={s.modalTopBar}>
                    <div style={s.modalTitle} title={title}>
                        {title}
                    </div>
                    <button
                        style={s.iconBtn}
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                </div>

                <div style={s.viewer}>
                    {images.length > 1 && (
                        <button
                            style={{ ...s.navBtn, left: isMobile ? 8 : 14 }}
                            onClick={onPrev}
                            aria-label="Imagen anterior"
                        >
                            ‹
                        </button>
                    )}

                    <img
                        src={current}
                        alt={title}
                        style={{
                            ...s.modalImg,
                            transform: `scale(${zoom})`,
                            cursor: zoom > 1 ? "zoom-out" : "zoom-in",
                        }}
                        onDoubleClick={() => setZoom((z) => (z > 1 ? 1 : 2))}
                    />

                    {images.length > 1 && (
                        <button
                            style={{ ...s.navBtn, right: isMobile ? 8 : 14 }}
                            onClick={onNext}
                            aria-label="Imagen siguiente"
                        >
                            ›
                        </button>
                    )}
                </div>

                <div style={s.modalBottomBar}>
                    <div style={s.zoomControls}>
                        <button
                            style={s.ctrlBtn}
                            onClick={zoomOut}
                            aria-label="Alejar"
                        >
                            -
                        </button>
                        <span style={s.zoomText}>
                            {Math.round(zoom * 100)}%
                        </span>
                        <button
                            style={s.ctrlBtn}
                            onClick={zoomIn}
                            aria-label="Acercar"
                        >
                            +
                        </button>
                        <button
                            style={s.ctrlBtn}
                            onClick={resetZoom}
                            aria-label="Reset"
                        >
                            1:1
                        </button>
                    </div>
                    <div style={s.indexText}>
                        {index + 1}/{images.length}
                    </div>
                </div>

                {images.length > 1 && (
                    <div style={s.thumbRow}>
                        {images.map((img, i) => (
                            <button
                                key={`${img}-${i}`}
                                style={{
                                    ...s.thumbBtn,
                                    borderColor:
                                        i === index
                                            ? "#38bdf8"
                                            : "rgba(255,255,255,0.25)",
                                }}
                                onClick={() => onSetIndex(i)}
                                aria-label={`Ir a imagen ${i + 1}`}
                            >
                                <img
                                    src={img}
                                    alt={`Miniatura ${i + 1}`}
                                    style={s.thumbImg}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function ProductCard({
    product,
    user,
    buying,
    onBuy,
    onOpenPreview,
}: {
    product: DirectProduct
    user: User | null
    buying: boolean
    onBuy: (p: DirectProduct) => void
    onOpenPreview: (images: string[], startIndex: number, title: string) => void
}) {
    const images = getImages(product)
    const cover = images[0]
    const disabled = product.is_sold || !product.is_active || buying

    return (
        <div style={s.card}>
            <div style={s.imgWrap}>
                <button
                    type="button"
                    style={s.imageButton}
                    onClick={() => onOpenPreview(images, 0, product.title)}
                    aria-label={`Ver imágenes de ${product.title}`}
                >
                    <img src={cover} alt={product.title} style={s.img} />
                </button>

                {images.length > 1 && (
                    <span style={s.multiBadge}>{images.length} fotos</span>
                )}
                {product.is_sold && <span style={s.soldTag}>VENDIDO</span>}
            </div>

            <div style={s.content}>
                <p style={s.smallLabel}>Venta directa</p>
                <h3 style={s.title}>{product.title}</h3>

                {product.description && (
                    <p style={s.desc}>{product.description}</p>
                )}

                <div style={s.priceRow}>
                    <span style={s.price}>UYU$ {product.price}</span>
                </div>

                {!product.is_sold ? (
                    !user ? (
                        <button style={s.btnDisabled} disabled>
                            Iniciá sesión para comprar
                        </button>
                    ) : (
                        <button
                            style={disabled ? s.btnDisabled : s.btnBuy}
                            disabled={disabled}
                            onClick={() => onBuy(product)}
                        >
                            {buying ? "Procesando..." : "Comprar ahora"}
                        </button>
                    )
                ) : (
                    <button style={s.btnSold} disabled>
                        Producto vendido
                    </button>
                )}
            </div>
        </div>
    )
}

export default function VentaDirectaGrid() {
    const isMobile = useIsMobile()

    const [user, setUser] = React.useState<User | null>(null)
    const [products, setProducts] = React.useState<DirectProduct[]>([])
    const [loading, setLoading] = React.useState(true)
    const [buyingId, setBuyingId] = React.useState<string | null>(null)

    const [preview, setPreview] = React.useState<{
        open: boolean
        title: string
        images: string[]
        index: number
    }>({
        open: false,
        title: "",
        images: [],
        index: 0,
    })

    const loadProducts = React.useCallback(async () => {
        const { data } = await supabase
            .from("direct_products")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false })

        setProducts((data ?? []) as DirectProduct[])
    }, [])

    React.useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser((session?.user as User) ?? null)
        })

        loadProducts().finally(() => setLoading(false))

        const channel = supabase
            .channel("direct_products_live")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "direct_products" },
                () => loadProducts()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [loadProducts])

    const buyProduct = async (product: DirectProduct) => {
        if (!user) return
        if (product.is_sold) return

        const ok = window.confirm(
            `¿Seguro que querés comprar este artículo?\n\n${product.title}\nUYU$ ${product.price}`
        )
        if (!ok) return

        setBuyingId(product.id)

        const { error } = await supabase.rpc("buy_direct_product", {
            p_product_id: product.id,
            p_user_id: user.id,
        })

        if (error) {
            alert(error.message || "No se pudo completar la compra.")
        } else {
            alert("Compra confirmada. Te contactaremos pronto.")
        }

        setBuyingId(null)
        await loadProducts()
    }

    if (loading) {
        return (
            <div style={s.centered}>
                <div style={s.spinner} />
                <p style={{ marginTop: "10px", color: "#64748b" }}>
                    Cargando productos...
                </p>
            </div>
        )
    }

    return (
        <>
            <style>{`
                * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            <section style={s.app}>
                <div
                    style={{
                        ...s.grid,
                        gridTemplateColumns: isMobile
                            ? "repeat(2, 1fr)"
                            : "repeat(auto-fill, minmax(220px, 1fr))",
                        gap: isMobile ? "10px" : "15px",
                        padding: isMobile ? "12px" : "20px",
                    }}
                >
                    {products.map((p) => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            user={user}
                            buying={buyingId === p.id}
                            onBuy={buyProduct}
                            onOpenPreview={(images, startIndex, title) =>
                                setPreview({
                                    open: true,
                                    images,
                                    index: startIndex,
                                    title,
                                })
                            }
                        />
                    ))}
                </div>
            </section>

            <ImagePreviewModal
                open={preview.open}
                images={preview.images}
                index={preview.index}
                title={preview.title}
                isMobile={isMobile}
                onClose={() => setPreview((p) => ({ ...p, open: false }))}
                onPrev={() =>
                    setPreview((p) => ({
                        ...p,
                        index:
                            (p.index - 1 + p.images.length) % p.images.length,
                    }))
                }
                onNext={() =>
                    setPreview((p) => ({
                        ...p,
                        index: (p.index + 1) % p.images.length,
                    }))
                }
                onSetIndex={(i) => setPreview((p) => ({ ...p, index: i }))}
            />
        </>
    )
}

const s: Record<string, React.CSSProperties> = {
    app: {
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        background: "#f5f5f5",
    },
    grid: { display: "grid" },

    card: {
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    },
    imgWrap: {
        position: "relative",
        background: "#fff",
        height: "150px",
        padding: "8px",
    },
    imageButton: {
        border: "none",
        background: "transparent",
        width: "100%",
        height: "100%",
        padding: 0,
        cursor: "zoom-in",
    },
    img: {
        width: "100%",
        height: "100%",
        objectFit: "contain",
    },
    multiBadge: {
        position: "absolute",
        left: "10px",
        top: "10px",
        fontSize: "10px",
        fontWeight: 700,
        background: "rgba(0,0,0,0.65)",
        color: "#fff",
        borderRadius: "999px",
        padding: "3px 8px",
        pointerEvents: "none",
    },
    soldTag: {
        position: "absolute",
        right: "10px",
        top: "10px",
        fontSize: "10px",
        fontWeight: 700,
        background: "#991b1b",
        color: "#fff",
        borderRadius: "999px",
        padding: "3px 8px",
        pointerEvents: "none",
    },
    content: {
        padding: "10px",
        borderTop: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
        flex: 1,
    },
    smallLabel: {
        fontSize: "11px",
        fontWeight: 700,
        color: "#374151",
        margin: 0,
    },
    title: {
        fontSize: "14px",
        fontWeight: 700,
        color: "#111827",
        margin: "6px 0 8px 0",
        lineHeight: "1.35",
    },
    desc: {
        fontSize: "12px",
        color: "#4b5563",
        margin: "0 0 10px 0",
        lineHeight: "1.4",
    },
    priceRow: {
        marginTop: "auto",
        marginBottom: "10px",
        borderTop: "1px solid #eee",
        paddingTop: "8px",
    },
    price: {
        fontSize: "20px",
        fontWeight: 800,
        color: "#003380",
    },
    btnBuy: {
        width: "100%",
        border: "none",
        borderRadius: "6px",
        padding: "11px",
        fontSize: "12px",
        fontWeight: 700,
        cursor: "pointer",
        color: "#fff",
        background: "#0f766e",
    },
    btnDisabled: {
        width: "100%",
        border: "none",
        borderRadius: "6px",
        padding: "11px",
        fontSize: "11px",
        cursor: "not-allowed",
        color: "#9ca3af",
        background: "#eee",
    },
    btnSold: {
        width: "100%",
        border: "none",
        borderRadius: "6px",
        padding: "11px",
        fontSize: "11px",
        fontWeight: 700,
        cursor: "not-allowed",
        color: "#fca5a5",
        background: "#1f2937",
    },

    centered: {
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
    },
    spinner: {
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        border: "3px solid #d1d5db",
        borderTopColor: "#2563eb",
        animation: "spin 0.7s linear infinite",
    },

    modalOverlay: {
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px",
    },
    modal: {
        width: "min(100vw, 1200px)",
        height: "min(100vh, 900px)",
        display: "flex",
        flexDirection: "column",
        background: "transparent",
        color: "#fff",
        userSelect: "none",
    },
    modalTopBar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        padding: "6px 8px",
    },
    modalTitle: {
        fontSize: "14px",
        fontWeight: 700,
        opacity: 0.95,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    iconBtn: {
        border: "1px solid rgba(255,255,255,0.25)",
        background: "rgba(15,23,42,0.6)",
        color: "#fff",
        borderRadius: "8px",
        width: "34px",
        height: "34px",
        fontSize: "16px",
        cursor: "pointer",
    },
    viewer: {
        position: "relative",
        flex: 1,
        minHeight: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    modalImg: {
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
        transition: "transform 0.14s ease-out",
        transformOrigin: "center center",
    },
    navBtn: {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: "42px",
        height: "42px",
        borderRadius: "999px",
        border: "1px solid rgba(255,255,255,0.25)",
        background: "rgba(15,23,42,0.65)",
        color: "#fff",
        fontSize: "28px",
        lineHeight: 1,
        cursor: "pointer",
    },
    modalBottomBar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px",
        gap: "8px",
    },
    zoomControls: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },
    ctrlBtn: {
        border: "1px solid rgba(255,255,255,0.25)",
        background: "rgba(15,23,42,0.6)",
        color: "#fff",
        borderRadius: "8px",
        minWidth: "36px",
        height: "34px",
        padding: "0 10px",
        fontSize: "14px",
        fontWeight: 700,
        cursor: "pointer",
    },
    zoomText: {
        minWidth: "54px",
        textAlign: "center",
        fontSize: "12px",
        opacity: 0.9,
    },
    indexText: {
        fontSize: "12px",
        opacity: 0.85,
    },
    thumbRow: {
        display: "flex",
        gap: "8px",
        overflowX: "auto",
        padding: "8px",
    },
    thumbBtn: {
        border: "2px solid rgba(255,255,255,0.25)",
        background: "transparent",
        borderRadius: "8px",
        width: "56px",
        height: "56px",
        padding: 0,
        cursor: "pointer",
        flex: "0 0 auto",
    },
    thumbImg: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "6px",
    },
}
