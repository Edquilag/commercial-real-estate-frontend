import { useState, type FormEvent } from 'react'
import { Search } from 'lucide-react'
import { cities, propertyTypes } from '../lib/format'

export function PropertyFilters({ initial, onApply, onReset }: { initial: URLSearchParams; onApply: (params: URLSearchParams) => void; onReset: () => void }) {
  const [error, setError] = useState('')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    for (const [min, max] of [['price_min', 'price_max'], ['floor_area_min', 'floor_area_max']]) {
      if (form.get(min) && form.get(max) && Number(form.get(min)) > Number(form.get(max))) { setError('The maximum must be greater than or equal to the minimum.'); return }
    }
    const params = new URLSearchParams()
    form.forEach((value, key) => { if (String(value).trim()) params.set(key, String(value).trim()) })
    setError(''); onApply(params)
  }
  return <form onSubmit={submit} className="filter-form"><div className="flex justify-between items-center mb-6"><h2 className="text-lg font-semibold">Refine your search</h2><button type="button" onClick={onReset} className="text-clay text-xs font-semibold">Clear all</button></div><fieldset><legend>Location</legend><label className="field-label">City<select name="city" defaultValue={initial.get('city') || ''}><option value="">All cities</option>{cities.map((city) => <option key={city}>{city}</option>)}</select></label><label className="field-label">Barangay / Area<input name="area" placeholder="e.g. Legazpi Village" maxLength={100} defaultValue={initial.get('area') || initial.get('location') || ''} /></label></fieldset><fieldset><legend>Property type</legend>{['All types', ...propertyTypes].map((type) => <label className="radio-label" key={type}><input name="property_type" type="radio" value={type === 'All types' ? '' : type} defaultChecked={(initial.get('property_type') || '') === (type === 'All types' ? '' : type)} /><span>{type}</span></label>)}</fieldset><fieldset><legend>Listing type</legend><select name="listing_type" aria-label="Listing type" defaultValue={initial.get('listing_type') || ''}><option value="">For Sale & For Rent</option><option value="sale">For Sale</option><option value="lease">For Rent</option></select></fieldset>{[['Price range (₱)', 'price_min', 'price_max'], ['Floor area (m²)', 'floor_area_min', 'floor_area_max']].map(([title, min, max]) => <fieldset key={min}><legend>{title}</legend><div className="grid grid-cols-2 gap-2"><label className="field-label">Minimum<input type="number" min="0" step="any" name={min} aria-label={`Minimum ${min === 'price_min' ? 'price' : 'floor area'}`} placeholder="No min" defaultValue={initial.get(min) || ''} /></label><label className="field-label">Maximum<input type="number" min="0" step="any" name={max} aria-label={`Maximum ${max === 'price_max' ? 'price' : 'floor area'}`} placeholder="No max" defaultValue={initial.get(max) || ''} /></label></div></fieldset>)}{error && <p role="alert" className="form-error">{error}</p>}<button className="btn w-full" type="submit"><Search size={17} /> Apply filters</button></form>
}
