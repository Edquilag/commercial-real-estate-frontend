import type { Broker, Inquiry, Message, Property, User } from '../domain/types'

export const photos = {
  tower: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
  office: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85',
  workspace: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85',
  retail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85',
  warehouse: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=85',
  mixed: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=85',
  land: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=85',
}
export const demoUser: User = { id: 101, name: 'Juan dela Cruz', email: 'juan@example.com', role: 'client', status: 'approved', email_verified_at: '2026-09-01T00:00:00Z' }
export const brokers: Broker[] = [
  { id: 201, name: 'Maria Santos', company: 'EstateHub Commercial', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=85', verified: true },
  { id: 202, name: 'Jose Dela Cruz', company: 'EstateHub Commercial', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=85', verified: true },
]
const seed: Array<[string, string, Property['listing_type'], string, number, number, string]> = [
  ['Modern Office Building', 'Office', 'sale', 'Downtown, Davao City', 35000000, 2000, photos.tower],
  ['Retail Space', 'Retail', 'lease', 'Lanang, Davao City', 200000, 500, photos.retail],
  ['Commercial Lot', 'Commercial Lot', 'sale', 'Buhangin, Davao City', 15000000, 1000, photos.land],
  ['Warehouse Facility', 'Warehouse', 'lease', 'Davao City', 120000, 900, photos.warehouse],
  ['Mixed Use Building', 'Mixed Use', 'sale', 'Matina, Davao City', 50000000, 1500, photos.mixed],
  ['Office Space', 'Office', 'lease', 'Davao City', 180000, 500, photos.workspace],
  ['Executive Office Floor', 'Office', 'lease', 'Lanang, Davao City', 250000, 700, photos.office],
  ['Corner Retail Unit', 'Retail', 'lease', 'Poblacion, Davao City', 150000, 260, photos.retail],
  ['Distribution Center', 'Warehouse', 'lease', 'Buhangin, Davao City', 320000, 2400, photos.warehouse],
  ['Business Suites', 'Office', 'sale', 'Davao Business Park', 52000000, 380, photos.workspace],
  ['Commercial Exchange', 'Mixed Use', 'sale', 'Matina, Davao City', 88000000, 760, photos.mixed],
  ['North Commercial Site', 'Commercial Lot', 'sale', 'Buhangin, Davao City', 64000000, 1100, photos.land],
]
export const mockProperties: Property[] = seed.map(([title, type, listing, location, price, area, image], index) => ({
  id: index + 1, title, property_type: type, listing_type: listing, location, price, floor_area: area,
  status: 'available', broker: brokers[index % brokers.length],
  published_at: new Date(Date.UTC(2026, 8, 5 - index)).toISOString(),
  last_confirmed_at: '2026-09-05T08:00:00Z',
  ...(listing === 'lease' ? { price_period: 'month' as const } : {}),
  description: `Make room for your next chapter at ${title}. Located in ${location}, this ${type.toLowerCase()} space offers a considered setting for an ambitious business.\n\nWith ${area.toLocaleString()} square meters of adaptable space, the property brings together a well-connected address and the flexibility to make it your own. Speak with the listing broker about viewing arrangements, fit-out options, and the complete terms.`,
  features: type === 'Commercial Lot' ? ['Accessibility', 'Business District'] : ['Parking', 'Security', 'Accessibility', 'Business District', 'Ready Occupancy'],
  images: [image, ...(type === 'Office' || type === 'Mixed Use' ? [photos.office, photos.workspace] : [])].map((url, imageIndex) => ({ id: index * 10 + imageIndex + 1, url })),
}))
export const mockInquiries: Inquiry[] = [
  { id: 301, property_id: 1, client_id: 101, broker_id: 201, conversation_id: 401, message: 'I would love to arrange a viewing for our team this week.', status: 'contacted', created_at: '2026-09-04T02:30:00Z', property: mockProperties[0] },
  { id: 302, property_id: 7, client_id: 101, broker_id: 201, conversation_id: 402, message: 'Could you share the lease terms and fit-out options?', status: 'pending', created_at: '2026-09-05T06:00:00Z', property: mockProperties[6] },
  { id: 303, property_id: 4, client_id: 101, broker_id: 202, conversation_id: 403, message: 'Thank you for the information. We have decided on a different location.', status: 'closed', created_at: '2026-09-02T08:00:00Z', property: mockProperties[3] },
]
export const mockMessages: Message[] = [
  { id: 501, conversation_id: 401, body: mockInquiries[0].message, from: 'client', created_at: mockInquiries[0].created_at },
  { id: 502, conversation_id: 401, body: 'Hello Juan, thank you for your interest. I would be happy to show you the space. What day works best for your team?', from: 'broker', created_at: '2026-09-04T03:10:00Z' },
  { id: 503, conversation_id: 402, body: mockInquiries[1].message, from: 'client', created_at: mockInquiries[1].created_at },
]
