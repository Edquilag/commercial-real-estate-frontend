import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, Check, ShieldCheck } from 'lucide-react'
import { backendOrigin, isDemo } from '../api/http'
import { useMarketplace } from '../context/MarketplaceContext'
import { photos } from '../data/mock'

export default function AuthPage() {
  const { signInDemo, user } = useMarketplace()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const location = useLocation()
  const register = location.pathname === '/get-started'
  const next = params.get('next') || '/client'
  const safeNext = /^\/(client|properties)(\/|\?|$)/.test(next) ? next : '/client'
  return <div className="container py-12 md:py-20"><div className="auth-layout"><div className="auth-art"><img src={photos.office} alt="Thoughtfully designed business workspace" /><div><p className="eyebrow text-white/70">YOUR NEXT CHAPTER</p><h2>Great things<br />need the<br /><em>right space.</em></h2></div></div><div className="auth-panel"><p className="eyebrow text-clay">WELCOME TO MERIDIAN</p><h1 className="page-title mt-4">{register ? 'Make room for more.' : 'Your next move, together.'}</h1><p className="text-muted leading-7 mt-5">Save spaces you love, connect with listing professionals, and keep your next business move organized.</p><ul className="space-y-4 mt-8 mb-8 text-sm">{['A shortlist that stays with you', 'Your property inquiries in one place', 'Direct conversations with brokers'].map((text) => <li className="flex gap-3" key={text}><Check size={18} className="text-forest" />{text}</li>)}</ul>{isDemo ? <><div className="notice mb-6"><ShieldCheck size={19} /><p>This preview uses Juan's sample account. No password is needed and no real account is created.</p></div><button className="btn w-full" onClick={() => { signInDemo(); navigate(safeNext) }}>{user ? 'Continue to workspace' : 'Explore as Juan'} <ArrowUpRight size={17} /></button></> : <><a className="btn w-full" href={`${backendOrigin}/${register ? 'register' : 'login'}`}>{register ? 'Create your account' : 'Continue to secure sign in'} <ArrowUpRight size={17} /></a><p className="text-sm text-muted mt-4 leading-7">Account access is handled by Meridian's Laravel application. After signing in, return here and refresh to access your workspace.</p></>}<Link className="text-link mt-7 text-sm" to="/properties">Keep exploring properties <ArrowUpRight size={16} /></Link></div></div></div>
}
