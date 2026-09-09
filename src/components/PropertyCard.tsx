import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronLeft, ChevronRight, Heart, MapPin, Ruler } from 'lucide-react'
import type { Property } from '../domain/types'
import { useMarketplace } from '../context/MarketplaceContext'
import { formatNumber, formatPrice, typeLabel } from '../lib/format'
import { PropertyImage } from './ui'

export function SaveButton({ property, full = false }: { property: Property; full?: boolean }) {
  const { savedIds, toggleSaved } = useMarketplace()
  const saved = savedIds.includes(property.id)
  return <button type="button" aria-pressed={saved} aria-label={`${saved ? 'Remove' : 'Save'} ${property.title}${saved ? ' from saved properties' : ''}`} onClick={() => toggleSaved(property.id)} className={full ? 'btn btn-outline w-full' : `save-button ${saved ? 'is-saved' : ''}`}><Heart size={18} fill={saved ? 'currentColor' : 'none'} />{full && (saved ? 'Saved Property' : 'Save Property')}</button>
}
export function PropertyCard({ property, savedActions = false }: { property: Property; savedActions?: boolean }) {
  const [imageIndex, setImageIndex] = useState(0)
  const images = property.images || []
  return <article className="property-card"><div className="property-card-image"><Link to={`/properties/${property.id}`} aria-label={`View ${property.title}`}><PropertyImage src={images[imageIndex]?.url} alt={property.title} className="h-full w-full object-cover" /></Link><span className="listing-badge">{property.listing_type === 'lease' ? 'For Rent' : 'For Sale'}</span><div className="absolute right-4 top-4"><SaveButton property={property} /></div>{images.length > 1 && <div className="gallery-controls"><button aria-label={`Previous image of ${property.title}`} onClick={() => setImageIndex((imageIndex - 1 + images.length) % images.length)}><ChevronLeft size={16} /></button><span>{imageIndex + 1} / {images.length}</span><button aria-label={`Next image of ${property.title}`} onClick={() => setImageIndex((imageIndex + 1) % images.length)}><ChevronRight size={16} /></button></div>}</div><div className="p-5 xl:p-6"><p className="eyebrow text-clay mb-3">{typeLabel(property.property_type)}</p><h2 className="card-title"><Link to={`/properties/${property.id}`}>{property.title}</Link></h2><p className="mt-2 flex items-start gap-1.5 text-xs text-muted leading-5"><MapPin size={14} className="shrink-0 mt-0.5" />{property.location}</p><div className="mt-6 pt-4 border-t border-line flex justify-between gap-2 items-end"><div><p className="font-semibold text-forest text-lg tracking-tight">{formatPrice(property)}</p><p className="flex items-center gap-1.5 mt-2 text-xs text-muted"><Ruler size={13} />{formatNumber(property.floor_area)} m²</p></div><Link to={`/properties/${property.id}`} className="card-arrow" aria-label={`Details for ${property.title}`}><ArrowUpRight size={19} /></Link></div>{savedActions && <Link className="btn btn-outline w-full mt-5" to={`/properties/${property.id}?inquire=1`}>Send Inquiry <ArrowUpRight size={16} /></Link>}</div></article>
}
