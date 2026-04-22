import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'

const Layout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
