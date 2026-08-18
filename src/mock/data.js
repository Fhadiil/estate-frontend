// Mock data for standalone frontend demo
const now = new Date().toISOString();

const users = [
  {
    id: 1,
    username: "admin",
    full_name: "Administrator",
    email: "admin@example.com",
    password: "12345",
    role: "ADMIN",
    created_at: now,
  },
  {
    id: 2,
    username: "adamu",
    full_name: "Adamu Client",
    email: "adamu@example.com",
    password: "12345",
    role: "CLIENT",
    created_at: now,
  },
];

const properties = [
  {
    id: 1,
    title: "Modern Family Home in Lagos",
    description:
      "A beautiful 4 bedroom family home with spacious living areas and a large garden.",
    price: 250000,
    location: "Ikeja, Lagos",
    bedrooms: 4,
    bathrooms: 3,
    square_meter: 200,
    property_type: "HOUSE",
    status: "AVAILABLE",
    image:
      "https://images.unsplash.com/photo-1560184897-6b9e3b6a8d5c?auto=format&fit=crop&w=1350&q=80",
    created_at: now,
  },
  {
    id: 2,
    title: "Luxury Apartment with Sea View",
    description:
      "Elegant 3 bedroom apartment overlooking the ocean, with modern amenities.",
    price: 180000,
    location: "Victoria Island, Lagos",
    bedrooms: 3,
    bathrooms: 2,
    square_meter: 120,
    property_type: "APARTMENT",
    status: "AVAILABLE",
    image:
      "https://images.unsplash.com/photo-1505691723518-36a3d27c3b14?auto=format&fit=crop&w=1350&q=80",
    created_at: now,
  },
  {
    id: 3,
    title: "Cozy Condo Near Downtown",
    description:
      "Convenient condo ideal for young professionals, close to shops and transport.",
    price: 95000,
    location: "Yaba, Lagos",
    bedrooms: 2,
    bathrooms: 1,
    square_meter: 80,
    property_type: "CONDO",
    status: "RENTED",
    image:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1350&q=80",
    created_at: now,
  },
  {
    id: 4,
    title: "Commercial Office Space",
    description: "Spacious commercial unit suitable for offices or retail.",
    price: 400000,
    location: "Ikeja GRA, Lagos",
    bedrooms: 0,
    bathrooms: 2,
    square_meter: 500,
    property_type: "COMMERCIAL",
    status: "AVAILABLE",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1350&q=80",
    created_at: now,
  },
];

const enquiries = [];

export { users, properties, enquiries };
