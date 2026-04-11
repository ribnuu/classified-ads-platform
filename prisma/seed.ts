import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Create Locations
  const locations = [
    { name: 'Colombo', slug: 'colombo' },
    { name: 'Gampaha', slug: 'gampaha' },
    { name: 'Kandy', slug: 'kandy' },
    { name: 'Galle', slug: 'galle' },
    { name: 'Jaffna', slug: 'jaffna' },
  ]

  for (const location of locations) {
    await prisma.location.upsert({
      where: { slug: location.slug },
      update: {},
      create: location,
    })
  }
  console.log('✅ Created locations')

  // Create Parent Categories
  const vehicles = await prisma.category.upsert({
    where: { slug: 'vehicles' },
    update: {},
    create: { name: 'Vehicles', slug: 'vehicles' },
  })

  const property = await prisma.category.upsert({
    where: { slug: 'property' },
    update: {},
    create: { name: 'Property', slug: 'property' },
  })

  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: { name: 'Electronics', slug: 'electronics' },
  })

  const home = await prisma.category.upsert({
    where: { slug: 'home-garden' },
    update: {},
    create: { name: 'Home & Garden', slug: 'home-garden' },
  })

  const jobs = await prisma.category.upsert({
    where: { slug: 'jobs' },
    update: {},
    create: { name: 'Jobs', slug: 'jobs' },
  })

  console.log('Created parent categories')

  // Create Sub-categories
  const subcategories = [
    { name: 'Cars', slug: 'cars', parentId: vehicles.id },
    { name: 'Motorcycles', slug: 'motorcycles', parentId: vehicles.id },
    { name: 'Three Wheelers', slug: 'three-wheelers', parentId: vehicles.id },
    { name: 'Vans', slug: 'vans', parentId: vehicles.id },
    { name: 'Buses', slug: 'buses', parentId: vehicles.id },
    { name: 'Houses for Sale', slug: 'houses-sale', parentId: property.id },
    { name: 'Apartments for Rent', slug: 'apartments-rent', parentId: property.id },
    { name: 'Land', slug: 'land', parentId: property.id },
    { name: 'Commercial Property', slug: 'commercial', parentId: property.id },
    { name: 'Mobile Phones', slug: 'mobile-phones', parentId: electronics.id },
    { name: 'Laptops', slug: 'laptops', parentId: electronics.id },
    { name: 'TVs', slug: 'tvs', parentId: electronics.id },
    { name: 'Cameras', slug: 'cameras', parentId: electronics.id },
    { name: 'Audio & Music', slug: 'audio', parentId: electronics.id },
    { name: 'Furniture', slug: 'furniture', parentId: home.id },
    { name: 'Appliances', slug: 'appliances', parentId: home.id },
    { name: 'Home Decor', slug: 'home-decor', parentId: home.id },
    { name: 'Garden Tools', slug: 'garden', parentId: home.id },
    { name: 'IT & Software', slug: 'it-jobs', parentId: jobs.id },
    { name: 'Sales & Marketing', slug: 'sales-jobs', parentId: jobs.id },
    { name: 'Teaching', slug: 'teaching-jobs', parentId: jobs.id },
    { name: 'Driver', slug: 'driver-jobs', parentId: jobs.id },
  ]

  for (const subcat of subcategories) {
    await prisma.category.upsert({
      where: { slug: subcat.slug },
      update: {},
      create: subcat,
    })
  }
  console.log('Created subcategories')

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })