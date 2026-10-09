// HexaHome Authentic Data Model & Static Content

export const CITIES = [
  { id: 'noida', name: 'Noida', count: '12,450+ Properties', popular: true },
  { id: 'greater-noida', name: 'Greater Noida', count: '8,200+ Properties', popular: true },
  { id: 'delhi', name: 'Delhi', count: '24,100+ Properties', popular: true },
  { id: 'gurgaon', name: 'Gurgaon', count: '18,900+ Properties', popular: true },
  { id: 'ghaziabad', name: 'Ghaziabad', count: '9,500+ Properties', popular: false },
  { id: 'faridabad', name: 'Faridabad', count: '5,300+ Properties', popular: false },
  { id: 'bengaluru', name: 'Bengaluru', count: '32,000+ Properties', popular: true },
  { id: 'mumbai', name: 'Mumbai', count: '28,500+ Properties', popular: true },
  { id: 'pune', name: 'Pune', count: '15,600+ Properties', popular: false },
  { id: 'hyderabad', name: 'Hyderabad', count: '19,200+ Properties', popular: true }
];

export const CATEGORIES = [
  { id: 'rent', label: 'Rent', icon: 'Home', active: true },
  { id: 'coliving', label: 'Co-living', icon: 'Users' },
  { id: 'pg', label: 'PG', icon: 'Bed' },
  { id: 'buy', label: 'Buy', icon: 'Key' },
  { id: 'plots', label: 'Plots', icon: 'Map' },
  { id: 'commercial', label: 'Commercial', icon: 'Building2' },
  { id: 'projects', label: 'Projects', icon: 'Layers' }
];

export const PROPERTY_TYPES = [
  'All Types',
  'Apartment / Flat',
  'Independent House / Villa',
  'Builder Floor',
  '1 RK / Studio',
  'Residential Plot',
  'Commercial Office / Shop'
];

export const BUDGET_RANGES = [
  'Any Budget',
  'Under ₹15,000',
  '₹15,000 - ₹30,000',
  '₹30,000 - ₹50,000',
  '₹50,000 - ₹1,00,000',
  '₹1,00,000+'
];

export const BHK_OPTIONS = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'];

export const OUR_OFFERINGS = [
  {
    id: 'residential',
    title: 'Residential Properties',
    subtitle: 'Apartments, Builder Floors, Villas & More',
    tag: 'Popular',
    image: 'https://assets.hexahome.in/static/home/homepage/our-offerings/residential-properties-img.webp',
    fallbackColor: '#033487'
  },
  {
    id: 'commercial',
    title: 'Commercial Properties',
    subtitle: 'Offices, Retail Shops, Showrooms',
    tag: 'Trending',
    image: 'https://assets.hexahome.in/static/home/homepage/our-offerings/commercial-properties-img.webp',
    fallbackColor: '#0c4a6e'
  },
  {
    id: 'pg',
    title: 'Search PG’s',
    subtitle: 'Comfortable Boys, Girls & Unisex PGs',
    tag: 'Verified',
    image: 'https://assets.hexahome.in/static/home/homepage/our-offerings/search-pg-img.webp',
    fallbackColor: '#1e3a8a'
  },
  {
    id: 'plots',
    title: 'Plots for sale',
    subtitle: 'Gated Society & Freehold Land',
    tag: 'High ROI',
    image: 'https://assets.hexahome.in/static/home/homepage/our-offerings/plot-land-img.webp',
    fallbackColor: '#1e293b'
  },
  {
    id: 'coliving',
    title: 'Co-Living',
    subtitle: 'Modern Shared Spaces with Amenities',
    tag: 'Zero Brokerage',
    image: 'https://assets.hexahome.in/static/home/homepage/our-offerings/coliving-img.webp',
    fallbackColor: '#1e1b4b'
  }
];

export const RESIDENTIAL_EXPLORE = [
  {
    id: 'apartment',
    title: 'Apartment / Flats',
    count: '3,840+ Listings',
    image: 'https://assets.hexahome.in/static/home/homepage/explore-residential-properties/apartment-flats-img.webp'
  },
  {
    id: 'builder-floor',
    title: 'Builder Floor',
    count: '1,420+ Listings',
    image: 'https://assets.hexahome.in/static/home/homepage/explore-residential-properties/individual-floor-img.webp'
  },
  {
    id: 'studio',
    title: '1RK/Studio House',
    count: '950+ Listings',
    image: 'https://assets.hexahome.in/static/home/homepage/explore-residential-properties/1rk-studio-img.webp'
  },
  {
    id: 'plot',
    title: 'Residential Plot/Land',
    count: '1,120+ Listings',
    image: 'https://assets.hexahome.in/static/home/homepage/explore-residential-properties/residential-plot-img.webp'
  },
  {
    id: 'independent',
    title: 'Independent House',
    count: '820+ Listings',
    image: 'https://assets.hexahome.in/static/home/homepage/explore-residential-properties/independent-house-img.webp'
  },
  {
    id: 'villa',
    title: 'Villa',
    count: '430+ Listings',
    image: 'https://assets.hexahome.in/static/home/homepage/explore-residential-properties/independent-villa-img.webp'
  }
];

export const FURNISHING_TYPES = [
  {
    id: 'fully',
    title: 'Fully Furnished',
    description: 'Ready to move with AC, Bed, TV, Sofa & Modular Kitchen',
    image: 'https://assets.hexahome.in/static/home/homepage/furnishing-type/fully-furnished-img.webp',
    tag: 'Move-in Ready'
  },
  {
    id: 'semi',
    title: 'Semi Furnished',
    description: 'Fitted wardrobes, fans, lights, modular kitchen cabinets',
    image: 'https://assets.hexahome.in/static/home/homepage/furnishing-type/semi-furnished-img.webp',
    tag: 'Most Popular'
  },
  {
    id: 'unfurnished',
    title: 'Unfurnished',
    description: 'Empty space tailored to your personal furniture & style',
    image: 'https://assets.hexahome.in/static/home/homepage/furnishing-type/unfurnished-img.webp',
    tag: 'Pocket Friendly'
  }
];

export const PG_COLLECTIONS = [
  {
    id: 'girls',
    title: 'PG’s for Girls',
    description: 'Safe, CCTV protected, gated security with 24x7 warden support',
    count: '450+ Rooms available',
    image: 'https://assets.hexahome.in/static/home/homepage/pg-section/girls-pg.webp'
  },
  {
    id: 'boys',
    title: 'PG’s for Boys',
    description: 'High speed WiFi, laundry, gaming zones & flexible notice periods',
    count: '620+ Rooms available',
    image: 'https://assets.hexahome.in/static/home/homepage/pg-section/boys-pg.webp'
  },
  {
    id: 'meal',
    title: 'PG’s With Meal',
    description: 'Hygienic 3-time home cooked meals included in monthly rent',
    count: '780+ Rooms available',
    image: 'https://assets.hexahome.in/static/home/homepage/pg-section/pg-with-meal.webp'
  }
];

export const COMMERCIAL_OFFERINGS = [
  {
    id: 'office',
    title: 'Office Space',
    count: '620+ Spaces',
    image: 'https://assets.hexahome.in/static/home/homepage/commercial-offerings/office-space-img.webp'
  },
  {
    id: 'retail',
    title: 'Retail Shop',
    count: '410+ Shops',
    image: 'https://assets.hexahome.in/static/home/homepage/commercial-offerings/retail-shop-img.webp'
  },
  {
    id: 'warehouse',
    title: 'Warehouse',
    count: '180+ Units',
    image: 'https://assets.hexahome.in/static/home/homepage/commercial-offerings/warehouse-img.webp'
  },
  {
    id: 'showroom',
    title: 'Showrooms',
    count: '120+ Units',
    image: 'https://assets.hexahome.in/static/home/homepage/commercial-offerings/showrooms-img.webp'
  },
  {
    id: 'commercial-plot',
    title: 'Commercial Plots',
    count: '95+ Plots',
    image: 'https://assets.hexahome.in/static/home/homepage/commercial-offerings/commercial-plots-img.webp'
  }
];

export const RENT_PROPERTIES = [
  {
    id: 'prop-1',
    title: '3BHK Apartment for rent in Sector 81-Block C, Phase II',
    location: 'Sector 81-Block C, Phase II, Noida',
    price: 34000,
    deposit: '₹68,000',
    type: '3 BHK',
    baths: 3,
    sqft: 1650,
    furnishing: 'Semi Furnished',
    floor: '8th of 18 Floors',
    availability: 'Immediate',
    verified: true,
    featured: true,
    tag: 'Family Favorite',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    postedBy: 'Owner',
    postedAgo: '2 days ago'
  },
  {
    id: 'prop-2',
    title: '1BHK Apartment for rent in Sector 130-Block Wa, Bajidpur',
    location: 'Sector 130-Block Wa, Bajidpur, Noida',
    price: 15500,
    deposit: '₹15,500',
    type: '1 BHK',
    baths: 1,
    sqft: 650,
    furnishing: 'Fully Furnished',
    floor: '3rd of 5 Floors',
    availability: 'Within 7 Days',
    verified: true,
    featured: false,
    tag: 'Bachelor Friendly',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    postedBy: 'Verified Agent',
    postedAgo: 'Today'
  },
  {
    id: 'prop-3',
    title: '2BHK Luxury High-Rise Apartment in Sector 76',
    location: 'Amrapali Silicon City, Sector 76, Noida',
    price: 27500,
    deposit: '₹55,000',
    type: '2 BHK',
    baths: 2,
    sqft: 1150,
    furnishing: 'Semi Furnished',
    floor: '12th of 22 Floors',
    availability: 'Immediate',
    verified: true,
    featured: true,
    tag: 'Hot Deal',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80'
    ],
    postedBy: 'Owner',
    postedAgo: '3 days ago'
  },
  {
    id: 'prop-4',
    title: '3BHK Premium Green View Apartment in Sector 108',
    location: 'Parx Laureate, Sector 108, Noida',
    price: 52000,
    deposit: '₹1,00,000',
    type: '3 BHK',
    baths: 3,
    sqft: 2200,
    furnishing: 'Fully Furnished',
    floor: '15th of 25 Floors',
    availability: 'Immediate',
    verified: true,
    featured: true,
    tag: 'Premium Luxury',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
    ],
    postedBy: 'HexaHome Certified',
    postedAgo: '1 day ago'
  },
  {
    id: 'prop-5',
    title: '2BHK Budget Builder Floor in Sector 85, Phase II',
    location: 'Yakubpur-Sector 85-Block B, Phase II, Noida',
    price: 18000,
    deposit: '₹18,000',
    type: '2 BHK',
    baths: 2,
    sqft: 900,
    furnishing: 'Unfurnished',
    floor: '1st of 4 Floors',
    availability: 'Immediate',
    verified: true,
    featured: false,
    tag: 'Budget Pick',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=800&q=80'
    ],
    postedBy: 'Owner',
    postedAgo: 'Just now'
  },
  {
    id: 'prop-6',
    title: '2BHK Apartment for rent in Sector 46, Near Metro',
    location: 'Gardenia Glory, Sector 46, Noida',
    price: 29000,
    deposit: '₹58,000',
    type: '2 BHK',
    baths: 2,
    sqft: 1220,
    furnishing: 'Semi Furnished',
    floor: '6th of 14 Floors',
    availability: 'From 1st Next Month',
    verified: true,
    featured: false,
    tag: 'Near Metro',
    images: [
      'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=800&q=80'
    ],
    postedBy: 'Owner',
    postedAgo: '5 days ago'
  }
];

export const PLOTS_DATA = [
  {
    id: 'plot-1',
    title: 'Residential Plot in Sector 143, Noida Expressway',
    size: '150 Sq. Yards',
    price: '₹1.15 Cr',
    facing: 'North-East Facing',
    boundary: 'Gated Boundary Wall',
    road: '18m Wide Road',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'plot-2',
    title: 'Corner Plot with Wide Road Access in Sector 105',
    size: '250 Sq. Yards',
    price: '₹2.40 Cr',
    facing: 'Corner Plot',
    boundary: 'Complete Boundary Done',
    road: '24m Wide Road',
    image: 'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'plot-3',
    title: 'Freehold Residential Land in Sector 144',
    size: '100 Sq. Yards',
    price: '₹75 Lacs',
    facing: 'East Facing',
    boundary: 'Registry Ready',
    road: '12m Wide Road',
    image: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=800&q=80'
  }
];

export const COMMERCIAL_LISTINGS = [
  {
    id: 'comm-1',
    title: 'Retail Shop for sale in Sector 98, Noida',
    price: '₹48 Lacs',
    area: '280 sq.ft.',
    rentalYield: '7.8% Assured Return',
    location: 'Sector 98, Expressway, Noida',
    status: 'Ready to Move',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'comm-2',
    title: 'Furnished Office Space in Sector 140A, Noida',
    price: '₹72 Lacs',
    area: '620 sq.ft.',
    rentalYield: '8.4% Return with Lock-in',
    location: 'Bhutani Cyberthum, Sector 140A',
    status: 'Under Construction (Possession Soon)',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'comm-3',
    title: 'High Street Showroom in Sector 129',
    price: '₹1.85 Cr',
    area: '1,100 sq.ft.',
    rentalYield: 'Double Height Ceiling',
    location: 'Jaypee Greens Wish Town, Sector 129',
    status: 'Ready for Fitouts',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'List Your Property for Free',
    description: 'Enter your property specifications, address, pricing, and expectations in less than 2 minutes.',
    icon: 'FileText'
  },
  {
    step: '02',
    title: 'Upload High Quality Photos',
    description: 'Add real photographs and virtual walkthroughs to get 5x more verified buyer and tenant inquiries.',
    icon: 'Camera'
  },
  {
    step: '03',
    title: 'Get Direct Verified Inquiries',
    description: 'Directly connect with screened buyers and tenants with zero hidden fees and no middlemen.',
    icon: 'MessageSquareCheck'
  },
  {
    step: '04',
    title: 'Close the Deal with Confidence',
    description: 'Use HexaHome legal documentation and rent agreement generators to finalize seamlessly.',
    icon: 'ShieldCheck'
  }
];

export const FAQS = [
  {
    id: 1,
    question: 'Is HexaHome a safe and secure platform for buying, selling, and renting properties?',
    answer: 'Yes, HexaHome is a safe and secure platform. We prioritize user privacy and safety by verifying listings and allowing users to keep their contact details private until they are comfortable sharing them.'
  },
  {
    id: 2,
    question: 'How do I list my property for rent or sale on HexaHome?',
    answer: 'Posting your property on HexaHome is simple and free. Just click on "Post Property", select your listing type, fill in the details, upload photos, and publish your listing.'
  },
  {
    id: 3,
    question: 'How can I download the HexaHome app?',
    answer: 'You can download the HexaHome app from the Google Play Store or Apple App Store. Simply search for "HexaHome" and install it on your mobile device.'
  },
  {
    id: 4,
    question: "I'm facing issues with the HexaHome app or website. What should I do?",
    answer: 'If you encounter any issues, try refreshing the page or restarting the app. You can also clear your cache or reach out to our customer support team for immediate assistance.'
  },
  {
    id: 5,
    question: 'What makes HexaHome different from other property platforms?',
    answer: 'HexaHome offers zero brokerage listings, direct owner-to-tenant communication, verified listings, and smart real estate tools to make your property search seamless and transparent.'
  },
  {
    id: 6,
    question: 'How long does it usually take to find a property or a buyer?',
    answer: 'It depends on location and market demand. However, most verified listings on HexaHome receive responses within 24 to 48 hours of posting.'
  },
  {
    id: 7,
    question: 'How can I contact property owners, agents, or potential roommates through HexaHome?',
    answer: 'Click on "Contact Owner" or "Get Contact" on the property card. You can connect directly via call, WhatsApp, or in-app messaging.'
  },
  {
    id: 8,
    question: 'When will my property become visible on HexaHome?',
    answer: 'Once submitted, your property listing goes through a quick verification check and usually becomes visible on the platform within 10 to 15 minutes.'
  },
  {
    id: 9,
    question: 'What documents do I need to post a property?',
    answer: 'No heavy documentation is required to post a property. However, uploading identity proof or ownership proof helps get your listing verified faster.'
  },
  {
    id: 10,
    question: 'The property type I am looking for is not available on the site. What should I do?',
    answer: 'You can set up a custom alert or contact our support team. New listings are added daily, and we can notify you as soon as a matching property is listed.'
  },
  {
    id: 11,
    question: 'How can I view responses on my property?',
    answer: 'Log in to your account, go to "My Dashboard" or "My Listings", and click on "View Responses" to see all tenant and buyer inquiries.'
  },
  {
    id: 12,
    question: 'I received a response, but the user was looking for a different property. What should I do?',
    answer: 'You can politely inform the user or update your listing description to be more specific about property parameters and location.'
  }
];
