'use client'

import { useEffect, useRef, useState } from 'react'

interface AddressParts {
  line1: string
  city: string
  state: string
  postal_code: string
  country: string
}

interface Props {
  value: string
  onChange: (line1: string) => void
  onSelect: (parts: AddressParts) => void
}

declare global {
  interface Window {
    google: any
    initGooglePlaces: () => void
  }
}

export default function AddressAutocomplete({ value, onChange, onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY
    if (!apiKey) return

    if (window.google?.maps?.places) {
      setLoaded(true)
      return
    }

    window.initGooglePlaces = () => setLoaded(true)

    const existing = document.getElementById('google-places-script')
    if (!existing) {
      const script = document.createElement('script')
      script.id = 'google-places-script'
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGooglePlaces`
      script.async = true
      document.head.appendChild(script)
    }
  }, [])

  useEffect(() => {
    if (!loaded || !inputRef.current) return

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      fields: ['address_components', 'formatted_address'],
    })

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace()
      if (!place.address_components) return

      const get = (type: string) =>
        place.address_components.find((c: any) => c.types.includes(type))?.long_name ?? ''
      const getShort = (type: string) =>
        place.address_components.find((c: any) => c.types.includes(type))?.short_name ?? ''

      const streetNumber = get('street_number')
      const route = get('route')
      const line1 = [streetNumber, route].filter(Boolean).join(' ')

      onSelect({
        line1,
        city: get('locality') || get('postal_town') || get('administrative_area_level_2'),
        state: getShort('administrative_area_level_1'),
        postal_code: get('postal_code'),
        country: getShort('country'),
      })
    })

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [loaded])

  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Address
      </label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Start typing your address…"
        autoComplete="off"
        style={{
          width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 10,
          padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
          transition: 'border-color 200ms',
        }}
        onFocus={e => (e.target.style.borderColor = '#C8883A')}
        onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
      />
    </div>
  )
}
