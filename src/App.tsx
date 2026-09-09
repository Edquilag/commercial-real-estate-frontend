import { useMemo, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { ArrowRight, Clock3, Heart, LayoutDashboard, MessageSquare, Send, ShieldCheck } from 'lucide-react'
import { getInquiries } from './api/client'
import { PublicLayout, ClientLayout } from './components/Layout'
import { PropertyCard } from './components/PropertyCard'
import { EmptyState, ErrorState, LoadingCards } from './components/ui'
import { useMarketplace } from './context/MarketplaceContext'
import { mockInquiries, mockMessages, mockProperties } from './data/mock'
import type { InquiryStatus } from './domain/types'
import { formatDate, statusLabel } from './lib/format'
import { useResource } from './hooks/useResource'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import PropertiesPage from './pages/PropertiesPage'
import PropertyPage from './pages/PropertyPage'

function ClientDashboardPage() {
  const { user, savedIds } = useMarketplace()
  const inquiries = useResource((signal) => getInquiries({ page: 1, per_page: 3 }, signal), 'client-dashboard-inquiries')
  const latestInquiries = inquiries.data?.data ?? mockInquiries.slice(0, 3)
  const recommendationList = mockProperties.filter((property) => !savedIds.includes(property.id)).slice(0, 3)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-clay">YOUR WORKSPACE</p>
          <h1 className="page-title mt-2">Good morning, {user?.name?.split(' ')[0] || 'there'}.</h1>
        </div>
        <Link className="btn btn-small" to="/properties">
          Explore properties <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard icon={<LayoutDashboard size={18} />} label="Total inquiries" value={String(inquiries.data?.meta.total ?? mockInquiries.length)} />
        <DashboardCard icon={<Heart size={18} />} label="Saved properties" value={String(savedIds.length)} />
        <DashboardCard icon={<MessageSquare size={18} />} label="Messages" value={String(mockMessages.length)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="card-panel p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent activity</h2>
            <Link className="text-link" to="/client/inquiries">View all</Link>
          </div>

          {inquiries.loading ? (
            <LoadingCards count={3} />
          ) : inquiries.error ? (
            <ErrorState error={inquiries.error} retry={inquiries.retry} />
          ) : (
            <div className="space-y-4">
              {latestInquiries.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-xl border border-line bg-[#f8f6f3] p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf1ee] text-[#1c5a52]">
                    {item.status === 'pending' ? <Clock3 size={16} /> : item.status === 'contacted' ? <Send size={16} /> : <ShieldCheck size={16} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-semibold text-ink">{item.status === 'pending' ? 'Inquiry submitted' : item.status === 'contacted' ? 'Broker responded' : 'Property updated'}</p>
                      <span className="text-xs uppercase tracking-[0.12em] text-clay">{statusLabel(item.status)}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{item.property?.title || 'Property inquiry'} · {formatDate(item.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card-panel p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recommended properties</h2>
            <Link className="text-link" to="/properties">Browse all</Link>
          </div>
          <div className="space-y-4">
            {recommendationList.map((property) => (
              <div key={property.id} className="rounded-xl border border-line bg-[#f8f6f3] p-4">
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function DashboardCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card-panel p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf1ee] text-[#1c5a52]">{icon}</div>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
    </div>
  )
}

function ClientInquiriesPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | InquiryStatus>('all')
  const inquiries = useResource(
    (signal) => getInquiries({ page: 1, per_page: 20 }, signal),
    `client-inquiries-${statusFilter}`
  )

  const rows = useMemo(() => {
    if (!inquiries.data) return mockInquiries
    return statusFilter === 'all'
      ? inquiries.data.data
      : inquiries.data.data.filter((item) => item.status === statusFilter)
  }, [inquiries.data, statusFilter])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-clay">CLIENT WORKSPACE</p>
          <h1 className="page-title mt-2">My Inquiries</h1>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'contacted', 'closed'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setStatusFilter(tab)}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${statusFilter === tab ? 'border-[#1c5a52] bg-[#1c5a52] text-white' : 'border-line bg-transparent text-muted'}`}
          >
            {tab === 'all' ? 'All' : statusLabel(tab)}
          </button>
        ))}
      </div>

      {inquiries.loading ? (
        <LoadingCards count={4} />
      ) : inquiries.error ? (
        <ErrorState error={inquiries.error} retry={inquiries.retry} />
      ) : rows.length === 0 ? (
        <EmptyState title="No inquiries yet." description="Your property inquiries will appear here as soon as you reach out to a broker." />
      ) : (
        <div className="grid gap-4">
          {rows.map((inquiry) => (
            <div key={inquiry.id} className="card-panel flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
                <img
                  src={inquiry.property?.images?.[0]?.url || mockProperties[0].images?.[0]?.url}
                  alt={inquiry.property?.title || 'Property'}
                  className="h-20 w-24 rounded-xl object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-ink">{inquiry.property?.title || 'Property inquiry'}</h2>
                    <span className="rounded-full border border-line bg-[#f4f1eb] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-clay">{statusLabel(inquiry.status)}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{inquiry.property?.location || 'Location pending'}</p>
                  <p className="mt-2 text-xs text-muted">Broker: {inquiry.property?.broker?.name || 'Assigned broker'} · {formatDate(inquiry.created_at)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link className="btn btn-outline btn-small" to={`/properties/${inquiry.property_id}`}>
                  View Property
                </Link>
                <button type="button" className="btn btn-small">
                  Message Broker
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ClientSavedPage() {
  const { savedIds } = useMarketplace()
  const savedProperties = mockProperties.filter((property) => savedIds.includes(property.id))

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-clay">CLIENT WORKSPACE</p>
        <h1 className="page-title mt-2">Saved Properties</h1>
      </div>

      {savedProperties.length === 0 ? (
        <EmptyState title="No saved properties yet." description="Save spaces you want to revisit and keep them in one place for quick follow-up." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {savedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} savedActions />
          ))}
        </div>
      )}
    </div>
  )
}

function ClientMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-clay">CLIENT WORKSPACE</p>
        <h1 className="page-title mt-2">Messages</h1>
      </div>
      <div className="card-panel p-6">
        <div className="space-y-4">
          {mockMessages.map((message) => (
            <div key={message.id} className="rounded-xl border border-line bg-[#f8f6f3] p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold text-ink">{message.from === 'broker' ? 'Broker' : 'You'}</p>
                <span className="text-xs text-muted">{formatDate(message.created_at)}</span>
              </div>
              <p className="text-sm leading-6 text-muted">{message.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ClientProfilePage() {
  const { user } = useMarketplace()

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-clay">CLIENT WORKSPACE</p>
        <h1 className="page-title mt-2">Profile</h1>
      </div>
      <div className="card-panel p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1c5a52] text-xl font-semibold text-white">
            {user?.name?.slice(0, 1) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ink">{user?.name || 'Client'}</h2>
            <p className="text-sm text-muted">{user?.email || 'client@example.com'}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <DetailItem label="Role" value="Client" />
          <DetailItem label="Status" value={user?.status === 'approved' ? 'Approved' : 'Pending'} />
          <DetailItem label="Verified email" value={user?.email_verified_at ? 'Yes' : 'Pending'} />
          <DetailItem label="Saved properties" value={String(mockProperties.length)} />
        </div>
      </div>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-[#f8f6f3] p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-clay">{label}</p>
      <p className="mt-2 text-base font-semibold text-ink">{value}</p>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="container py-20">
      <EmptyState title="Page not found." description="This page does not exist in the current frontend route map." action={<Link className="btn" to="/">Back home</Link>} />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyPage />} />
        <Route path="/sign-in" element={<AuthPage />} />
        <Route path="/get-started" element={<AuthPage />} />
      </Route>

      <Route element={<ClientLayout />}>
        <Route path="/client" element={<ClientDashboardPage />} />
        <Route path="/client/inquiries" element={<ClientInquiriesPage />} />
        <Route path="/client/saved" element={<ClientSavedPage />} />
        <Route path="/client/messages" element={<ClientMessagesPage />} />
        <Route path="/client/profile" element={<ClientProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
