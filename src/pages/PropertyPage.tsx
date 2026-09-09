import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { getProperty } from '../api/properties'
import { ApiError, isDemo } from '../api/http'
import { useResource } from '../hooks/useResource'
import { BrokerCard, FeatureList, PropertyGallery, PropertyInfo } from '../components/PropertyDetails'
import { EmptyState, ErrorState } from '../components/ui'

export default function PropertyPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const result = useResource((signal) => getProperty(Number(id), signal), `property-${id}`)
  if (result.loading) return <div className="container py-12" role="status" aria-label="Loading property"><div className="skeleton h-[420px]" /><div className="skeleton h-32 mt-8" /></div>
  if (result.error) return <div className="container py-16">{result.error instanceof ApiError && result.error.status === 404 ? <EmptyState title="This space has a new chapter." description="The property may have been withdrawn or is no longer available. Explore the latest available spaces." action={<Link className="btn" to="/properties">Browse properties</Link>} /> : <ErrorState error={result.error} retry={result.retry} />}</div>
  if (!result.data) return null
  const property = result.data
  return <div className="container detail-page"><nav className="breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight size={12} /><Link to="/properties">Properties</Link><ChevronRight size={12} /><span>{property.title}</span></nav>{isDemo && <p className="collection-note mt-4">Preview property · illustrative photos, features, and broker profile</p>}<PropertyGallery key={property.id} property={property} /><div className="detail-layout"><div><PropertyInfo property={property} /><FeatureList features={property.features} /><div className="detail-section"><h2>See the possibilities in person.</h2><p className="text-muted leading-7 mt-4">Connect with the listing broker to confirm availability, property details, and a convenient time to view the space.</p></div></div><BrokerCard property={property} initialInquiry={params.get('inquire') === '1'} /></div></div>
}
