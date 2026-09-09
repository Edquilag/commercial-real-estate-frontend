import type { Inquiry, InquiryStatus, Message, Page, User } from '../domain/types'
import { demoUser, mockInquiries, mockMessages, mockProperties } from '../data/mock'
import { readStorage, writeStorage } from '../lib/format'
import { demoDelay, isDemo, queryString, request } from './http'

const leadKey = 'meridian:demo:101:inquiries:v1'
const messageKey = 'meridian:demo:101:messages:v1'
export const readDemoInquiries = () => readStorage<Inquiry[]>(leadKey, mockInquiries)
export const readDemoMessages = () => readStorage<Message[]>(messageKey, mockMessages)
export async function getCurrentUser(signal?: AbortSignal): Promise<User | null> {
  if (isDemo) return readStorage('meridian:demo:session', false) ? demoUser : null
  return request('/api/user', { signal })
}
export async function getInquiries(filters: { status?: InquiryStatus; page?: number; per_page?: number } = {}, signal?: AbortSignal): Promise<Page<Inquiry>> {
  if (!isDemo) return request(`/api/v1/inquiries?${queryString(filters)}`, { signal })
  await demoDelay(signal)
  const rows = readDemoInquiries().filter((inquiry) => !filters.status || inquiry.status === filters.status).sort((a, b) => b.created_at.localeCompare(a.created_at))
  const page = filters.page || 1
  const size = filters.per_page || 20
  return { data: rows.slice((page - 1) * size, page * size), meta: { total: rows.length, current_page: page, per_page: size, last_page: Math.max(1, Math.ceil(rows.length / size)) } }
}
export async function submitInquiry(propertyId: number, message: string): Promise<Inquiry> {
  if (!isDemo) {
    await request('/sanctum/csrf-cookie')
    return (await request<{ data: Inquiry }>(`/api/v1/properties/${propertyId}/inquiries`, { method: 'POST', body: JSON.stringify({ message }) })).data
  }
  await demoDelay()
  const inquiries = readDemoInquiries()
  let inquiry = inquiries.find((lead) => lead.property_id === propertyId)
  if (inquiry) { if (inquiry.status === 'closed') inquiry.status = 'pending' }
  else {
    inquiry = { id: Date.now(), property_id: propertyId, client_id: 101, broker_id: mockProperties.find((p) => p.id === propertyId)?.broker?.id || null, conversation_id: Date.now(), message, status: 'pending', created_at: new Date().toISOString(), property: mockProperties.find((p) => p.id === propertyId) }
    inquiries.push(inquiry)
  }
  writeStorage(leadKey, inquiries)
  addDemoMessage(inquiry.conversation_id!, message)
  return inquiry
}
export function addDemoMessage(conversationId: number, body: string) {
  writeStorage(messageKey, [...readDemoMessages(), { id: Date.now(), conversation_id: conversationId, body, from: 'client', created_at: new Date().toISOString() }])
}
