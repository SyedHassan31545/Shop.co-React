// Static content (dress styles + brand logos).
// Products aur testimonials ab MongoDB se aate hain -- backend: server/ folder.
import bbds1 from '../assets/bbds-img-1.png'
import bbds2 from '../assets/bbds-img-2.png'
import bbds3 from '../assets/bbds-img-3.png'
import bbds4 from '../assets/bbds-img-4.png'
import brand1 from '../assets/brands-1.png'
import brand2 from '../assets/brands-2.png'
import brand3 from '../assets/brands-3.png'
import brand4 from '../assets/brands-4.png'
import brand5 from '../assets/brands-5.png'

export const dressStyles = [
  { id: 'casual', label: 'Casual', image: bbds1 },
  { id: 'formal', label: 'Formal', image: bbds2 },
  { id: 'party', label: 'Party', image: bbds3 },
  { id: 'gym', label: 'Gym', image: bbds4 },
]

export const brands = [
  { name: 'VERSACE', logo: brand1 },
  { name: 'ZARA', logo: brand2 },
  { name: 'GUCCI', logo: brand3 },
  { name: 'PRADA', logo: brand4 },
  { name: 'Calvin Klein', logo: brand5 },
]