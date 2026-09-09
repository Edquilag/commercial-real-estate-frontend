import type { Property } from '../domain/types'

export const propertyTypes = ['Office', 'Retail', 'Warehouse', 'Commercial Lot', 'Mixed Use']
export const cities = ['Davao City', 'Buhangin', 'Lanang', 'Matina', 'Makati City', 'Taguig']
export const formatNumber = (value: number) => new Intl.NumberFormat('en-PH').format(value)
export const formatPrice = (property: Pick<Property, 'price' | 'price_period'>) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(property.price)
  + (property.price_period === 'month' ? ' / mo' : '')
export const formatDate = (value: string) => new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
export const typeLabel = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
export const statusLabel = (value: string) => value === 'contacted' ? 'Responded' : typeLabel(value)

export function readStorage<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback } catch { return fallback }
}

export function writeStorage(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* In-memory interaction still works when storage is unavailable. */ }
}
