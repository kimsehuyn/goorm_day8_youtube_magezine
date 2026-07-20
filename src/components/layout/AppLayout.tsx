import { Outlet } from 'react-router-dom'
import { TopNav } from './TopNav'
import { SideNav } from './SideNav'
import { Footer } from './Footer'

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <SideNav />
      <div className="lg:ml-64 pt-20 flex-1 flex flex-col">
        <Outlet />
        <Footer />
      </div>
    </div>
  )
}
