import type { Page, Property, PropertyFilters } from '../domain/types'
import { mockProperties } from '../data/mock'
import { ApiError, demoDelay, isDemo, propertiesEndpoint, queryString, request } from './http'
export type { Property, PropertyFilters } from '../domain/types'

export function filterProperties(properties: Property[], filters: PropertyFilters): Page<Property> {
  const contains = (value: string, term?: string) => !term || value.toLowerCase().includes(term.toLowerCase())
  const rows = properties.filter((property) =>
    contains(`${property.title} ${property.description} ${property.location}`, filters.keyword)
    && contains(property.location, filters.location) && contains(property.location, filters.city) && contains(property.location, filters.area)
    && (!filters.property_type || property.property_type.toLowerCase() === filters.property_type.toLowerCase())
    && (!filters.listing_type || property.listing_type === filters.listing_type)
    && (filters.price_min === undefined || property.price >= filters.price_min)
    && (filters.price_max === undefined || property.price <= filters.price_max)
    && (filters.floor_area_min === undefined || property.floor_area >= filters.floor_area_min)
    && (filters.floor_area_max === undefined || property.floor_area <= filters.floor_area_max))
    .sort((a, b) => filters.sort === 'price_asc' ? a.price - b.price : filters.sort === 'price_desc' ? b.price - a.price : filters.sort === 'area_desc' ? b.floor_area - a.floor_area : (b.published_at || '').localeCompare(a.published_at || '') || b.id - a.id)
  const page = filters.page || 1
  const size = filters.per_page || 6
  return { data: rows.slice((page - 1) * size, page * size), meta: { total: rows.length, current_page: page, per_page: size, last_page: Math.max(1, Math.ceil(rows.length / size)) } }
}
export async function getProperties(filters: PropertyFilters = {}, signal?: AbortSignal): Promise<Page<Property>> {
  if (!isDemo) return request(`${propertiesEndpoint}?${queryString(filters)}`, { signal })
  await demoDelay(signal)
  return filterProperties(mockProperties, filters)
}
export async function getProperty(id: number, signal?: AbortSignal): Promise<Property> {
  if (!isDemo) return (await request<{ data: Property }>(`${propertiesEndpoint}/${id}`, { signal })).data
  await demoDelay(signal)
  const property = mockProperties.find((item) => item.id === id)
  if (!property) throw new ApiError(404, 'This property is no longer available.')
  return property
}
