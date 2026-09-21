import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import CustomCursor from './CustomCursor.jsx'
import GlassFilter from './GlassFilter.jsx'
import ScrollTop from './ScrollTop.jsx'
import GestureControl from './GestureControl.jsx'

// Shared page shell: navbar on top, page content in the middle, footer below.
export default function Layout() {
  return (
    <div className="site">
      <GlassFilter />
      <CustomCursor />
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
      <ScrollTop />
      <GestureControl />
    </div>
  )
}
