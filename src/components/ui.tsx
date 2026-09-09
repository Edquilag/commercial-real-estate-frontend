import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Building2, X } from 'lucide-react'
import type { Page } from '../domain/types'

export function Modal({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null)
  const id = useId()
  useEffect(() => {
    const element = ref.current
    const oldOverflow = document.body.style.overflow
    element?.showModal()
    document.body.style.overflow = 'hidden'
    return () => { element?.close(); document.body.style.overflow = oldOverflow }
  }, [])
  return <dialog ref={ref} aria-labelledby={id} className={`modal ${wide ? 'modal-wide' : ''}`} onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <div className="modal-inner"><div className="flex items-center justify-between gap-5 mb-6"><h2 id={id} className="text-xl font-semibold">{title}</h2><button className="icon-button" onClick={onClose} aria-label={`Close ${title}`}><X size={20} /></button></div>{children}</div>
  </dialog>
}
export function PropertyImage({ src, alt, className = '', eager = false }: { src?: string; alt: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])
  if (!src || failed) return <div className={`image-fallback ${className}`} role="img" aria-label={alt}><Building2 size={40} strokeWidth={1} /><span>Image unavailable</span></div>
  return <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" className={className} onError={() => setFailed(true)} />
}
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="empty-state"><Building2 size={32} strokeWidth={1.2} className="text-clay" /><h2 className="mt-5 text-2xl font-display">{title}</h2><p className="mt-3 max-w-md text-muted text-sm leading-7">{description}</p>{action && <div className="mt-6">{action}</div>}</div>
}
export function ErrorState({ error, retry }: { error: Error; retry?: () => void }) {
  return <div role="alert"><EmptyState title="We couldn't load this just yet." description={error.message} action={retry && <button className="btn" onClick={retry}>Try again</button>} /></div>
}
export function LoadingCards({ count = 3 }: { count?: number }) {
  return <div role="status" aria-label="Loading properties" className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"><span className="sr-only">Loading properties</span>{Array.from({ length: count }, (_, index) => <div key={index} className="skeleton h-[370px]" />)}</div>
}
export function Pagination({ meta, onPage }: { meta: Page<unknown>['meta']; onPage: (page: number) => void }) {
  if (meta.last_page <= 1) return null
  return <nav aria-label="Pagination" className="pagination"><button className="btn-quiet" disabled={meta.current_page <= 1} onClick={() => onPage(meta.current_page - 1)}><ArrowLeft size={16} /> Previous</button><span className="text-sm">Page <strong>{meta.current_page}</strong> of {meta.last_page}</span><button className="btn-quiet" disabled={meta.current_page >= meta.last_page} onClick={() => onPage(meta.current_page + 1)}>Next <ArrowRight size={16} /></button></nav>
}
