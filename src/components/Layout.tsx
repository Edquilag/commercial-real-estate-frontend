import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ArrowUpRight, Building2, Heart, LayoutDashboard, LogOut, Menu, MessageSquare, Send, UserRound } from 'lucide-react'
import { isDemo } from '../api/http'
import { useMarketplace } from '../context/MarketplaceContext'
import { EmptyState, Modal } from './ui'

export function Logo({ light = false }: { light?: boolean }) {
  return <Link to="/" className={`logo ${light ? 'text-white' : ''}`} aria-label="Meridian home"><span className="logo-mark"><Building2 size={24} strokeWidth={1.4} /></span><span>MERIDIAN<span className="text-clay">.</span><small>COMMERCIAL REAL ESTATE</small></span></Link>
}
const navigation = [['Buy', '/properties?listing_type=sale'], ['Rent', '/properties?listing_type=lease'], ['Property Types', '/#property-types'], ['Brokers', '/#brokers'], ['About', '/#about'], ['Contact', '/#contact']]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, savedIds } = useMarketplace()
  const location = useLocation()
  useEffect(() => setMenuOpen(false), [location])
  return <header className="site-header"><div className="container flex h-[86px] items-center justify-between gap-5"><Logo /><nav aria-label="Main navigation" className="hidden lg:flex gap-7 xl:gap-8">{navigation.map(([name, href]) => <Link key={name} to={href} className="nav-link">{name}</Link>)}</nav><div className="hidden md:flex items-center gap-5">{user ? <><Link className="icon-button relative" to="/client/saved" aria-label={`Saved properties, ${savedIds.length}`}><Heart size={20} /><span className="count-dot">{savedIds.length}</span></Link><Link to="/client" className="btn btn-small">My workspace <ArrowUpRight size={16} /></Link></> : <><Link className="nav-link" to="/sign-in">Sign In</Link><Link to="/get-started" className="btn btn-small">Get Started <ArrowUpRight size={16} /></Link></>}</div><button className="icon-button lg:hidden" aria-label="Open navigation menu" onClick={() => setMenuOpen(true)}><Menu size={23} /></button></div>
    {menuOpen && <Modal title="Explore Meridian" onClose={() => setMenuOpen(false)}><nav className="flex flex-col gap-1">{navigation.map(([name, href]) => <Link className="mobile-link" key={name} to={href}>{name}<ArrowUpRight size={16} /></Link>)}<Link className="btn mt-5" to={user ? '/client' : '/sign-in'}>{user ? 'My workspace' : 'Sign In'}</Link></nav></Modal>}
  </header>
}
export function Footer() {
  return <footer className="footer" id="contact"><div className="container"><div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1.3fr] pb-12"><div><Logo light /><p className="mt-6 max-w-xs text-sm leading-7 text-white/60">Extraordinary spaces for everyday ambition. Your next business chapter starts here.</p><span className="mt-6 inline-block text-[10px] uppercase tracking-[.2em] text-white/50">Built around your next move</span></div><div><h2>Explore</h2><Link to="/properties?listing_type=sale">Properties for sale</Link><Link to="/properties?listing_type=lease">Properties for rent</Link><Link to="/properties">All properties</Link><Link to="/client/saved">Saved properties</Link></div><div><h2>Meridian</h2><Link to="/#about">Our approach</Link><Link to="/#brokers">Our professionals</Link><Link to="/client/inquiries">My inquiries</Link><Link to="/get-started">Get started</Link></div><div><h2>Let's connect</h2><p className="text-sm leading-7 text-white/60">Philippines<br />Connect with a listing broker<br />through the property inquiry form.</p><div className="mt-5 flex gap-4 text-xs text-white/55" aria-label="Social channels coming soon"><span>Instagram</span><span>LinkedIn</span><span>Facebook</span></div></div></div><div className="border-t border-white/15 py-6 flex flex-col gap-3 sm:flex-row justify-between text-xs text-white/50"><p>© {new Date().getFullYear()} Meridian. All rights reserved.</p><p>{isDemo ? 'Preview collection · sample listings & broker profiles' : 'Property information is provided by listing brokers.'}</p></div></div></footer>
}
export function PublicLayout() { return <><Header /><main id="main-content"><Outlet /></main><Footer /></> }

const clientNavigation = [
  { label: 'Dashboard', to: '/client', icon: LayoutDashboard, end: true },
  { label: 'My Inquiries', to: '/client/inquiries', icon: Send },
  { label: 'Saved Properties', to: '/client/saved', icon: Heart },
  { label: 'Messages', to: '/client/messages', icon: MessageSquare },
  { label: 'Profile', to: '/client/profile', icon: UserRound },
]
export function Sidebar({ close }: { close?: () => void }) {
  const { user, logout, savedIds, notify } = useMarketplace()
  const navigate = useNavigate()
  return <div className="flex flex-col h-full"><div className="p-7"><Logo /></div><p className="eyebrow px-7 mt-8 mb-4">Your workspace</p><nav className="px-4 flex flex-col gap-2" aria-label="Client navigation">{clientNavigation.map(({ label, to, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={close} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><Icon size={19} strokeWidth={1.6} />{label}{to.endsWith('/saved') && <span className="ml-auto text-xs">{savedIds.length}</span>}</NavLink>)}</nav><div className="mt-auto p-6 border-t border-line"><div className="flex items-center gap-3 mb-5"><span className="avatar">{user?.name.slice(0, 1)}</span><div><strong className="text-sm">{user?.name}</strong><p className="text-xs text-muted mt-1">{isDemo ? 'Preview account' : 'Client account'}</p></div></div><button className="btn-quiet" onClick={async () => { try { await logout(); navigate('/') } catch { notify('Sign out failed. Please try again.') } }}><LogOut size={17} /> Logout</button></div></div>
}
export function ClientLayout() {
  const { user, authLoading, authError } = useMarketplace()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  if (authLoading) return <div className="container py-20" role="status">Checking your session…</div>
  if (!user) return <><Header /><main id="main-content" className="container py-16"><EmptyState title="A space for your next move." description={authError || 'Sign in to keep your inquiries, saved properties, and conversations in one place.'} action={<Link className="btn" to={`/sign-in?next=${encodeURIComponent(location.pathname + location.search)}`}>Sign In <ArrowUpRight size={18} /></Link>} /></main><Footer /></>
  if (user.role !== 'client' || user.status !== 'approved' || !user.email_verified_at) return <><Header /><main id="main-content" className="container py-16"><EmptyState title="Your account needs a quick check." description="This workspace is for approved clients with a verified email. Please complete your account setup in Laravel." action={<Link className="btn" to="/sign-in">Account access</Link>} /></main></>
  return <div className="client-layout"><aside className="client-sidebar"><Sidebar /></aside><div className="client-main"><header className="client-header"><button aria-label="Open workspace menu" className="icon-button lg:hidden" onClick={() => setOpen(true)}><Menu size={22} /></button><span className="hidden sm:block text-sm text-muted">A clearer view of your next opportunity.</span><Link className="btn-quiet ml-auto" to="/properties">Explore properties <ArrowUpRight size={17} /></Link></header><main id="main-content" className="client-content"><Outlet /></main></div>{open && <Modal title="Your workspace" onClose={() => setOpen(false)}><Sidebar close={() => setOpen(false)} /></Modal>}</div>
}
