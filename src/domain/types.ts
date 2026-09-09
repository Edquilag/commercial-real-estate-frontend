export interface Broker {
  id: number
  name: string
  photo?: string
  company?: string
  email?: string
  phone?: string
  verified?: boolean
}

export interface Property {
  id: number
  title: string
  description: string | null
  property_type: string
  listing_type: 'sale' | 'lease'
  location: string
  price: number
  floor_area: number
  status: string
  images?: { id: number; url: string }[]
  broker?: Broker
  published_at?: string | null
  last_confirmed_at?: string | null
  // Optional enrichment: not supplied by the current Laravel resource.
  features?: string[]
  price_period?: 'month'
}

export interface PropertyFilters {
  keyword?: string
  location?: string
  city?: string
  area?: string
  property_type?: string
  listing_type?: string
  price_min?: number
  price_max?: number
  floor_area_min?: number
  floor_area_max?: number
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'area_desc'
  page?: number
  per_page?: number
}

export interface Page<T> {
  data: T[]
  meta: { current_page: number; last_page: number; per_page: number; total: number }
}

export interface User {
  id: number
  name: string
  email: string
  role: 'client' | 'broker' | 'admin'
  status: string
  email_verified_at: string | null
}

export type InquiryStatus = 'pending' | 'contacted' | 'closed'
export interface Inquiry {
  id: number
  property_id: number
  client_id: number
  broker_id: number | null
  conversation_id?: number | null
  message: string
  status: InquiryStatus
  created_at: string
  property?: Property
}

export interface Message {
  id: number
  conversation_id: number
  body: string
  from: 'client' | 'broker'
  created_at: string
}
