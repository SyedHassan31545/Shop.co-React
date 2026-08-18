// Central product catalogue for the store.
// Images are royalty-free placeholders (Picsum) seeded so each product
// always gets the same photo.

const img = (seed) => `https://picsum.photos/seed/${seed}/600/720`

export const products = [
  {
    id: 'tshirt-tape-details',
    name: 'T-shirt with Tape Details',
    price: 120,
    oldPrice: null,
    rating: 4.5,
    reviews: 128,
    image: './src/assets/product-img-1.png',
    style: 'casual',
    gender: 'men',
    colors: ['#1c1c1c', '#8b8b8b', '#2f3e34'],
    sizes: ['S', 'M', 'L', 'XL'],
    tag: 'new',
    description:
      'A relaxed-fit tee finished with a bold shoulder tape detail. Cut from heavyweight combed cotton so it keeps its shape wash after wash.',
  },
  {
    id: 'skinny-fit-jeans',
    name: 'Skinny Fit Jeans',
    price: 240,
    oldPrice: 260,
    rating: 3.5,
    reviews: 89,
    image: './src/assets/product-img-2.png',
    style: 'casual',
    gender: 'men',
    colors: ['#3b5375', '#1c1c1c'],
    sizes: ['28', '30', '32', '34', '36'],
    tag: 'new',
    description:
      'Stretch denim tailored close to the leg from hip to ankle without feeling restrictive. A five-pocket classic that layers under anything.',
  },
  {
    id: 'checkered-shirt',
    name: 'Checkered Shirt',
    price: 180,
    oldPrice: null,
    rating: 4.5,
    reviews: 63,
    image: './src/assets/product-img-3.png',
    style: 'formal',
    gender: 'men',
    colors: ['#7c2436', '#22304a'],
    sizes: ['S', 'M', 'L', 'XL'],
    tag: 'new',
    description:
      'A crisp cotton shirt in a classic check, cut with a full button placket and a point collar that works equally well tucked or loose.',
  },
  {
    id: 'sleeve-striped-tshirt',
    name: 'Sleeve Striped T-shirt',
    price: 130,
    oldPrice: 160,
    rating: 4.5,
    reviews: 154,
    image: './src/assets/product-img-4.png',
    style: 'casual',
    gender: 'men',
    colors: ['#d9531e', '#1c1c1c'],
    sizes: ['S', 'M', 'L', 'XL'],
    tag: 'new',
    description:
      'Contrast raglan sleeves and fine stripes give this tee a varsity feel. Soft jersey knit that breathes all day long.',
  },
  {
    id: 'vertical-striped-shirt',
    name: 'Vertical Striped Shirt',
    price: 212,
    oldPrice: 232,
    rating: 5.0,
    reviews: 41,
    image: './src/assets/product-img-5.png',
    style: 'formal',
    gender: 'men',
    colors: ['#4b5c46', '#1c1c1c'],
    sizes: ['S', 'M', 'L', 'XL'],
    tag: 'top',
    description:
      'A slim, vertical stripe runs the full length of this shirt for a lean silhouette. Lightweight cotton poplin, easy to dress up or down.',
  },
  {
    id: 'courage-graphic-tshirt',
    name: 'Courage Graphic T-shirt',
    price: 145,
    oldPrice: null,
    rating: 4.0,
    reviews: 97,
    image: './src/assets/product-img-6.png',
    style: 'casual',
    gender: 'men',
    colors: ['#c1531b', '#1c1c1c'],
    sizes: ['S', 'M', 'L', 'XL'],
    tag: 'top',
    description:
      'Oversized graphic print on heavyweight cotton. Garment-washed for a broken-in feel straight out of the bag.',
  },
  {
    id: 'loose-fit-bermuda-shorts',
    name: 'Loose Fit Bermuda Shorts',
    price: 80,
    oldPrice: null,
    rating: 3.0,
    reviews: 52,
    image: './src/assets/product-img-7.png',
    style: 'gym',
    gender: 'men',
    colors: ['#7896b0', '#1c1c1c'],
    sizes: ['S', 'M', 'L', 'XL'],
    tag: 'top',
    description:
      'Above-the-knee shorts in washed denim with a roomy, loose fit. Deep pockets and a relaxed drape make them a warm-weather staple.',
  },
  {
    id: 'faded-skinny-jeans',
    name: 'Faded Skinny Jeans',
    price: 210,
    oldPrice: null,
    rating: 4.5,
    reviews: 73,
    image: './src/assets/product-img-8.png',
    style: 'casual',
    gender: 'women',
    colors: ['#1c1c1c', '#3b5375'],
    sizes: ['24', '26', '28', '30', '32'],
    tag: 'top',
    description:
      'A faded black wash gives these skinny jeans a worn-in edge. Four-way stretch denim moves with you all day.',
  },
]

export const newArrivals = products.filter((p) => p.tag === 'new')
export const topSelling = products.filter((p) => p.tag === 'top')

export const dressStyles = [
  { id: 'casual', label: 'Casual', image: './src/assets/bbds-img-1.png' },
  { id: 'formal', label: 'Formal', image: './src/assets/bbds-img-2.png' },
  { id: 'party', label: 'Party', image: './src/assets/bbds-img-3.png' },
  { id: 'gym', label: 'Gym', image: './src/assets/bbds-img-4.png' },
]

export const brands = [
  { name: 'VERSACE', logo: './src/assets/brands-1.png' },
  { name: 'ZARA', logo: './src/assets/brands-2.png' },
  { name: 'GUCCI', logo: './src/assets/brands-3.png' },
  { name: 'PRADA', logo: './src/assets/brands-4.png' },
  { name: 'Calvin Klein', logo: './src/assets/brands-5.png' },
]

export const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    rating: 5,
    text:
      "I'm blown away by the quality and style of the clothes I received from Shop.co. Every piece I've bought has exceeded my expectations.",
  },
  {
    id: 2,
    name: 'Alex K.',
    rating: 5,
    text:
      'Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options is truly remarkable.',
  },
  {
    id: 3,
    name: 'James L.',
    rating: 5,
    text:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. Diverse and on-point with the latest trends.",
  },
  {
    id: 4,
    name: 'Moore W.',
    rating: 5,
    text:
      "Shop.co has become my go-to for anything fashion. Fast shipping, true-to-size fits and a support team that actually replies.",
  },
]
