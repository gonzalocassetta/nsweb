
import Navbar from "./components/NAVBAR"
import Hero from "./components/HERO"
import Ticker from "./components/TICKER"
import AuctionLotsHero from "./components/AUCTIONLOTSHERO"
import RemateGridNuevo from "./components/RemateGridNuevo"
import AuctionLotsHero2 from "./components/AUCTIONLOTSHERO2"
import ComponentesVentaDirecta from "./components/COMPONENTES_VENTA_DIRECTA"
import Contact from "./components/Contact"
import Footer from "./components/Footer"

export default function App() {
  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <Ticker />
      <AuctionLotsHero />
      <RemateGridNuevo />
      <AuctionLotsHero2 />
      <ComponentesVentaDirecta />
      <Contact />
      <Footer />
    </div>
  )
}
