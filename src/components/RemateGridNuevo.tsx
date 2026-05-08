import * as React from "react"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabase = createClient(
    "https://ywcjjzytqweldccmfclt.supabase.co",
    "sb_publishable_bqOA6KS5kkbXfuyXMZ9UyQ_c_qDB1BV"
)

type User = { id: string; email?: string }

type Lot = {
    id: string
    lot_number: number
    title: string
    description: string | null
    image_url: string | null
    image_urls: string[] | null
    starting_price: number
    current_price: number
    bid_count: number
    starts_at: string
    end_time: string
    is_active: boolean
    bid_lock_until: string | null
    last_bid_amount: number | null
    last_bidder_name: string | null
}

function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(
        typeof window !== "undefined" ? window.innerWidth < 640 : false
    )
    React.useEffect(() => {
        const h = () => setIsMobile(window.innerWidth < 640)
        window.addEventListener("resize", h)
        return () => window.removeEventListener("resize", h)
    }, [])
    return isMobile
}

function getImages(item: {
    image_url: string | null
    image_urls: string[] | null
}) {
    const arr = Array.isArray(item.image_urls)
        ? item.image_urls.map((x) => String(x).trim()).filter(Boolean)
        : []
    const legacy = item.image_url ? [item.image_url.trim()] : []
    const unique = [...new Set([...arr, ...legacy])]
    return unique.length > 0
        ? unique
        : ["https://placehold.co/700x700?text=Sin+imagen"]
}

function isClosed(l: Lot) {
    return !l.is_active || new Date(l.end_time).getTime() <= Date.now()
}

function isLocked(l: Lot, nowMs: number) {
    if (!l.bid_lock_until) return false
    return new Date(l.bid_lock_until).getTime() > nowMs
}

function LotCountdown({ endTime }: { endTime: string }) {
    const [text, setText] = React.useState("00:00:00")
    const [closed, setClosed] = React.useState(false)

    React.useEffect(() => {
        const tick = () => {
            const diff = new Date(endTime).getTime() - Date.now()
            if (diff <= 0) {
                setClosed(true)
                setText("FINALIZADO")
                return
            }
            const d = Math.floor(diff / 86400000)
            const h = Math.floor((diff / 3600000) % 24)
            const m = Math.floor((diff / 60000) % 60)
            const s = Math.floor((diff / 1000) % 60)

            setText(
                d > 0
                    ? `${String(d).padStart(2, "0")}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`
                    : `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
            )
        }

        tick()
        const id = window.setInterval(tick, 1000)
        return () => window.clearInterval(id)
    }, [endTime])

    return (
        <div
            style={{
                margin: "6px 0 10px",
                fontSize: 11,
                fontWeight: 700,
                color: closed ? "#b91c1c" : "#003380",
            }}
        >
            Cierra en: {text}
        </div>
    )
}

export default function RemateGridNuevo() {
    const isMobile = useIsMobile()

    const [user, setUser] = React.useState<User | null>(null)
    const [lots, setLots] = React.useState<Lot[]>([])
    const [loading, setLoading] = React.useState(true)

    const [bidLot, setBidLot] = React.useState<Lot | null>(null)
    const [bidAmount, setBidAmount] = React.useState(0)
    const [sending, setSending] = React.useState(false)

    const [nowMs, setNowMs] = React.useState(Date.now())

    const [viewer, setViewer] = React.useState<{
        open: boolean
        title: string
        images: string[]
        idx: number
    }>({ open: false, title: "", images: [], idx: 0 })

    const loadLots = React.useCallback(async () => {
        const { data, error } = await supabase.rpc("get_auction_lots_public")
        if (error) {
            alert(error.message)
            return
        }
        setLots((data ?? []) as Lot[])
    }, [])

    React.useEffect(() => {
        const id = window.setInterval(() => setNowMs(Date.now()), 350)
        return () => window.clearInterval(id)
    }, [])

    React.useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser((session?.user as User) ?? null)
        })

        loadLots().finally(() => setLoading(false))

        const ch = supabase
            .channel("auction_live_grid")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "auction_lots" },
                () => loadLots()
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "auction_bids" },
                () => loadLots()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(ch)
        }
    }, [loadLots])

    const openBid = (lot: Lot) => {
        if (!user) return alert("Iniciá sesión para pedir.")
        if (isClosed(lot)) return alert("Este articulo ya está cerrado.")
        if (isLocked(lot, Date.now())) {
            return alert(
                "Este articulo está procesando un pedido. Intenta en 2 segundos."
            )
        }
        setBidLot(lot)
        setBidAmount(Number(lot.current_price) + 50)
    }

    const confirmBid = async () => {
        if (!bidLot) return

        const min = Number(bidLot.current_price) + 50
        if (bidAmount < min) return alert(`La oferta mínima es UYU$ ${min}.`)

        setSending(true)
        const { error } = await supabase.rpc("place_auction_bid", {
            p_lot_id: bidLot.id,
            p_amount: bidAmount,
        })
        setSending(false)

        if (error) return alert(error.message)

        setBidLot(null)
        await loadLots()
    }

    const closeViewer = () =>
        setViewer({ open: false, title: "", images: [], idx: 0 })
    const nextImage = () =>
        setViewer((v) => ({ ...v, idx: (v.idx + 1) % v.images.length }))
    const prevImage = () =>
        setViewer((v) => ({
            ...v,
            idx: (v.idx - 1 + v.images.length) % v.images.length,
        }))

    if (loading) {
        return (
            <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
                Cargando articulos...
            </div>
        )
    }

    return (
        <>
            <style>{`
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
      `}</style>

            <section
                style={{
                    fontFamily: "Arial, sans-serif",
                    background: "#f5f5f5",
                    minHeight: "100vh",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: isMobile
                            ? "repeat(2, 1fr)"
                            : "repeat(auto-fill, minmax(230px, 1fr))",
                        gap: isMobile ? 10 : 14,
                        padding: isMobile ? 12 : 20,
                    }}
                >
                    {lots.map((lot) => {
                        const imgs = getImages(lot)
                        const closed = isClosed(lot)
                        const locked = isLocked(lot, nowMs)
                        const canBid = !closed && !locked

                        return (
                            <div
                                key={lot.id}
                                style={{
                                    background: "#fff",
                                    border: "1px solid #ddd",
                                    borderRadius: 8,
                                    overflow: "hidden",
                                    opacity: closed ? 0.78 : 1,
                                }}
                            >
                                <div
                                    style={{
                                        position: "relative",
                                        height: 150,
                                        padding: 8,
                                    }}
                                >
                                    <img
                                        src={imgs[0]}
                                        alt={lot.title}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                            cursor: "zoom-in",
                                        }}
                                        onClick={() =>
                                            setViewer({
                                                open: true,
                                                title: lot.title,
                                                images: imgs,
                                                idx: 0,
                                            })
                                        }
                                    />
                                    {imgs.length > 1 && (
                                        <span
                                            style={{
                                                position: "absolute",
                                                left: 10,
                                                top: 10,
                                                fontSize: 10,
                                                fontWeight: 700,
                                                background: "rgba(0,0,0,.65)",
                                                color: "#fff",
                                                borderRadius: 999,
                                                padding: "3px 8px",
                                            }}
                                        >
                                            {imgs.length} fotos
                                        </span>
                                    )}
                                </div>

                                <div
                                    style={{
                                        padding: 10,
                                        borderTop: "1px solid #eee",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 700,
                                            color: "#374151",
                                        }}
                                    >
                                        Lote {lot.lot_number}
                                    </div>
                                    <h3
                                        style={{
                                            margin: "6px 0 8px",
                                            fontSize: 14,
                                            color: "#111827",
                                        }}
                                    >
                                        {lot.title}
                                    </h3>

                                    <div
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 800,
                                            color: "#003380",
                                        }}
                                    >
                                        UYU$ {lot.current_price}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: 11,
                                            color: "#666",
                                            marginTop: 2,
                                        }}
                                    >
                                        Interesados: {lot.bid_count || 0}
                                    </div>

                                    <LotCountdown endTime={lot.end_time} />

                                    <div
                                        style={{
                                            fontSize: 11,
                                            margin: "0 0 10px",
                                            color: "#0b3d91",
                                        }}
                                    >
                                        {lot.last_bid_amount
                                            ? `${lot.last_bidder_name ?? "Usuario"} pidió UYU$ ${lot.last_bid_amount}`
                                            : "Sin pedidos aún"}
                                    </div>

                                    <button
                                        style={{
                                            width: "100%",
                                            border: "none",
                                            borderRadius: 6,
                                            padding: 11,
                                            fontSize: 12,
                                            fontWeight: 700,
                                            cursor: canBid
                                                ? "pointer"
                                                : "not-allowed",
                                            color: "#fff",
                                            background: closed
                                                ? "#1f2937"
                                                : locked
                                                  ? "#9ca3af"
                                                  : "#003380",
                                        }}
                                        disabled={!canBid}
                                        onClick={() => openBid(lot)}
                                    >
                                        {closed
                                            ? "ARTICULO CERRADO"
                                            : locked
                                              ? "PROCESANDO PEDIDO..."
                                              : "PEDIR"}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {bidLot && (
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 1000,
                            background: "rgba(0,0,0,.82)",
                            display: "flex",
                            alignItems: isMobile ? "flex-end" : "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            style={{
                                background: "#fff",
                                width: isMobile ? "100%" : 340,
                                maxWidth: "95vw",
                                borderRadius: isMobile ? "18px 18px 0 0" : 12,
                                padding: 20,
                                position: "relative",
                            }}
                        >
                            <button
                                onClick={() => setBidLot(null)}
                                style={{
                                    position: "absolute",
                                    right: 10,
                                    top: 10,
                                    border: "none",
                                    background: "transparent",
                                    fontSize: 20,
                                    cursor: "pointer",
                                }}
                            >
                                ✕
                            </button>

                            <h3 style={{ marginTop: 0, marginBottom: 10 }}>
                                Lote {bidLot.lot_number}
                            </h3>
                            <p
                                style={{
                                    marginTop: 0,
                                    marginBottom: 12,
                                    color: "#4b5563",
                                }}
                            >
                                Precio actual:{" "}
                                <strong>UYU$ {bidLot.current_price}</strong>
                            </p>

                            <input
                                type="number"
                                min={Number(bidLot.current_price) + 50}
                                value={bidAmount}
                                onChange={(e) =>
                                    setBidAmount(Number(e.target.value))
                                }
                                inputMode="numeric"
                                style={{
                                    width: "100%",
                                    fontSize: 24,
                                    fontWeight: 700,
                                    textAlign: "center",
                                    border: "2px solid #003380",
                                    borderRadius: 8,
                                    padding: 8,
                                    marginBottom: 12,
                                    color: "#003380",
                                }}
                            />

                            <button
                                onClick={confirmBid}
                                disabled={sending}
                                style={{
                                    width: "100%",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: 12,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    cursor: sending ? "not-allowed" : "pointer",
                                    color: "#fff",
                                    background: sending ? "#9ca3af" : "#f0ad4e",
                                }}
                            >
                                {sending ? "Enviando..." : "CONFIRMAR PEDIDO"}
                            </button>
                        </div>
                    </div>
                )}

                {viewer.open && (
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,.92)",
                            zIndex: 1200,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 12,
                        }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) closeViewer()
                        }}
                    >
                        <button
                            onClick={closeViewer}
                            style={{
                                position: "fixed",
                                top: 10,
                                right: 12,
                                width: 40,
                                height: 40,
                                borderRadius: 999,
                                border: "none",
                                background: "rgba(255,255,255,.2)",
                                color: "#fff",
                                fontSize: 20,
                                cursor: "pointer",
                            }}
                        >
                            ✕
                        </button>

                        {viewer.images.length > 1 && (
                            <button
                                onClick={prevImage}
                                style={{
                                    position: "fixed",
                                    left: 8,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    width: 42,
                                    height: 42,
                                    borderRadius: 999,
                                    border: "none",
                                    background: "rgba(255,255,255,.2)",
                                    color: "#fff",
                                    fontSize: 28,
                                    cursor: "pointer",
                                }}
                            >
                                ‹
                            </button>
                        )}

                        <img
                            src={viewer.images[viewer.idx]}
                            alt={viewer.title}
                            style={{
                                maxWidth: "100%",
                                maxHeight: "86vh",
                                objectFit: "contain",
                                borderRadius: 8,
                            }}
                        />

                        {viewer.images.length > 1 && (
                            <button
                                onClick={nextImage}
                                style={{
                                    position: "fixed",
                                    right: 8,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    width: 42,
                                    height: 42,
                                    borderRadius: 999,
                                    border: "none",
                                    background: "rgba(255,255,255,.2)",
                                    color: "#fff",
                                    fontSize: 28,
                                    cursor: "pointer",
                                }}
                            >
                                ›
                            </button>
                        )}
                    </div>
                )}
            </section>
        </>
    )
}
