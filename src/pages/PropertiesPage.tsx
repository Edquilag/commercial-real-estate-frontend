import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronRight, Grid2X2, SlidersHorizontal, X } from 'lucide-react'
import { getProperties } from '../api/properties'
import type { PropertyFilters as Filters } from '../domain/types'
import { isDemo } from '../api/http'
import { useResource } from '../hooks/useResource'
import { PropertyCard } from '../components/PropertyCard'
import { PropertyFilters } from '../components/PropertyFilters'
import { EmptyState, ErrorState, LoadingCards, Modal, Pagination } from '../components/ui'

export default function PropertiesPage() {
  const [params, setParams] = useSearchParams()
  const [drawer, setDrawer] = useState(false)
  const filters: Filters = {}
  for (const key of ['keyword', 'city', 'area', 'location', 'property_type', 'listing_type'] as const) if (params.get(key)) filters[key] = params.get(key)!
  for (const key of ['price_min', 'price_max', 'floor_area_min', 'floor_area_max'] as const) if (params.get(key) && Number.isFinite(Number(params.get(key)))) filters[key] = Math.max(0, Number(params.get(key)))
  filters.page = Math.min(10000, Math.max(1, Number(params.get('page')) || 1))
  filters.per_page = 6
  filters.sort = ['newest', 'price_asc', 'price_desc'].includes(params.get('sort') || '') ? params.get('sort') as Filters['sort'] : 'newest'
  const result = useResource((signal) => getProperties(filters, signal), JSON.stringify(filters))
  const apply = (next: URLSearchParams) => { if (params.get('sort')) next.set('sort', params.get('sort')!); setParams(next); setDrawer(false) }
  const reset = () => { setParams({}); setDrawer(false) }
  const change = (key: string, value: string) => { const next = new URLSearchParams(params); next.set(key, value); if (key !== 'page') next.delete('page'); setParams(next) }
  const chips = Array.from(params.entries()).filter(([key]) => !['sort', 'page'].includes(key))
  return <div className="container listing-page"><nav className="breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight size={12} /><span>Properties</span></nav><div className="section-heading mt-8"><div><p className="eyebrow text-clay">THE PROPERTY DESK</p><h1 className="page-title">Find your next address.</h1><p className="text-muted mt-4">Good spaces. Real possibilities. Room for what comes next.</p></div><span className="hidden md:block text-xs text-muted">{isDemo ? 'THE PREVIEW COLLECTION' : 'THE LATEST OPPORTUNITIES'}</span></div><div className="listing-layout"><aside className="filter-sidebar"><PropertyFilters key={params.toString()} initial={params} onApply={apply} onReset={reset} /></aside><section aria-label="Property results"><div className="results-toolbar"><div><h2 className="text-xl font-semibold">Properties</h2><p className="text-sm text-muted mt-1" role="status">{result.loading ? 'Finding your next space…' : `${result.data?.meta.total ?? 0} available listings`}</p></div><div className="flex gap-3 items-center"><button className="btn btn-outline btn-small lg:hidden" onClick={() => setDrawer(true)}><SlidersHorizontal size={16} /> Filters</button><label className="sort-label"><span className="hidden sm:block text-xs text-muted">Sort by</span><select aria-label="Sort properties" value={filters.sort} onChange={(e) => change('sort', e.target.value)}><option value="newest">Newest</option><option value="price_asc">Price Low–High</option><option value="price_desc">Price High–Low</option></select></label><Grid2X2 size={17} className="hidden xl:block text-forest" /></div></div>{chips.length > 0 && <div className="filter-chips">{chips.map(([key, value]) => <button key={key} onClick={() => { const next = new URLSearchParams(params); next.delete(key); next.delete('page'); setParams(next) }} aria-label={`Remove ${key} filter`}>{key.replaceAll('_', ' ')}: {value}<X size={12} /></button>)}</div>}{result.loading ? <LoadingCards count={6} /> : result.error ? <ErrorState error={result.error} retry={result.retry} /> : result.data?.data.length ? <><div className="grid gap-6 sm:grid-cols-2">{result.data.data.map((property) => <PropertyCard key={property.id} property={property} />)}</div><Pagination meta={result.data.meta} onPage={(page) => change('page', String(page))} /></> : <EmptyState title="A little more room to search." description="No properties match these filters. Try a nearby area, a wider budget, or another property type." action={<button onClick={reset} className="btn">Clear filters</button>} />}</section></div>{drawer && <Modal title="Property filters" onClose={() => setDrawer(false)}><PropertyFilters initial={params} onApply={apply} onReset={reset} /></Modal>}</div>
}
