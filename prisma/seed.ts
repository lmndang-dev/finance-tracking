import { PrismaClient, TransactionType } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const categories = [
  // ─── EXPENSE ────────────────────────────────────────────────────────────────
  {
    name: "Food & Beverage",
    type: TransactionType.EXPENSE,
    icon: "utensils",
    order: 1,
    subcategories: [
      { name: "Supermarket",    icon: "shopping-cart",  order: 1 },
      { name: "Restaurant",     icon: "beef",           order: 2 },
      { name: "Fast Food",      icon: "hamburger",      order: 3 },
      { name: "Coffee Shop",    icon: "coffee",         order: 4 },
      { name: "Food Delivery",  icon: "bike",           order: 5 },
    ],
  },
  {
    name: "Transportation",
    type: TransactionType.EXPENSE,
    icon: "car",
    order: 2,
    subcategories: [
      { name: "Gas",              icon: "fuel",         order: 1 },
      { name: "Car Maintenance",  icon: "wrench",       order: 2 },
      { name: "Parking",          icon: "parking-meter",order: 3 },
      { name: "Public Transit",   icon: "bus",          order: 4 },
      { name: "Ride Share",       icon: "car-taxi-front",order: 5 },
      { name: "Toll",             icon: "milestone",    order: 6 },
    ],
  },
  {
    name: "Shopping",
    type: TransactionType.EXPENSE,
    icon: "shopping-bag",
    order: 3,
    subcategories: [
      { name: "Clothing",     icon: "shirt",        order: 1 },
      { name: "Electronics",  icon: "laptop",       order: 2 },
      { name: "Household",    icon: "sofa",         order: 3 },
      { name: "Accessories",  icon: "watch",        order: 4 },
    ],
  },
  {
    name: "Housing & Bills",
    type: TransactionType.EXPENSE,
    icon: "house",
    order: 4,
    subcategories: [
      { name: "Rent",         icon: "key-round",    order: 1 },
      { name: "Electricity",  icon: "zap",          order: 2 },
      { name: "Water",        icon: "droplets",     order: 3 },
      { name: "Internet",     icon: "wifi",         order: 4 },
      { name: "Phone Bill",   icon: "phone",        order: 5 },
      { name: "Insurance",    icon: "shield",       order: 6 },
    ],
  },
  {
    name: "Health",
    type: TransactionType.EXPENSE,
    icon: "heart-pulse",
    order: 5,
    subcategories: [
      { name: "Doctor",   icon: "stethoscope",  order: 1 },
      { name: "Medicine", icon: "pill",         order: 2 },
      { name: "Gym",      icon: "dumbbell",     order: 3 },
      { name: "Dental",   icon: "smile",        order: 4 },
    ],
  },
  {
    name: "Entertainment",
    type: TransactionType.EXPENSE,
    icon: "tv",
    order: 6,
    subcategories: [
      { name: "Streaming", icon: "play-circle", order: 1 },
      { name: "Movies",    icon: "clapperboard", order: 2 },
      { name: "Games",     icon: "gamepad-2",   order: 3 },
      { name: "Hobbies",   icon: "palette",     order: 4 },
    ],
  },
  {
    name: "Education",
    type: TransactionType.EXPENSE,
    icon: "book-open",
    order: 7,
    subcategories: [
      { name: "Tuition",        icon: "graduation-cap", order: 1 },
      { name: "Books",          icon: "book",           order: 2 },
      { name: "Online Courses", icon: "monitor-play",   order: 3 },
    ],
  },
  {
    name: "Travel",
    type: TransactionType.EXPENSE,
    icon: "plane",
    order: 8,
    subcategories: [
      { name: "Hotel",       icon: "bed-double",  order: 1 },
      { name: "Flight",      icon: "plane",       order: 2 },
      { name: "Activities",  icon: "map",         order: 3 },
    ],
  },
  {
    name: "Personal Care",
    type: TransactionType.EXPENSE,
    icon: "sparkles",
    order: 9,
    subcategories: [
      { name: "Haircut",   icon: "scissors",     order: 1 },
      { name: "Skincare",  icon: "droplet",      order: 2 },
      { name: "Spa",       icon: "flower-2",     order: 3 },
    ],
  },
  {
    name: "Others",
    type: TransactionType.EXPENSE,
    icon: "circle-ellipsis",
    order: 10,
    subcategories: [],
  },

  // ─── INCOME ─────────────────────────────────────────────────────────────────
  {
    name: "Salary",
    type: TransactionType.INCOME,
    icon: "briefcase",
    order: 1,
    subcategories: [
      { name: "Full-time",  icon: "building-2",  order: 1 },
      { name: "Part-time",  icon: "clock",       order: 2 },
      { name: "Freelance",  icon: "laptop",      order: 3 },
      { name: "Bonus",      icon: "star",        order: 4 },
    ],
  },
  {
    name: "Business",
    type: TransactionType.INCOME,
    icon: "store",
    order: 2,
    subcategories: [
      { name: "Sales",            icon: "tag",          order: 1 },
      { name: "Service Revenue",  icon: "handshake",    order: 2 },
    ],
  },
  {
    name: "Investment",
    type: TransactionType.INCOME,
    icon: "trending-up",
    order: 3,
    subcategories: [
      { name: "Stocks",     icon: "bar-chart-2",  order: 1 },
      { name: "Dividends",  icon: "percent",      order: 2 },
      { name: "Crypto",     icon: "bitcoin",      order: 3 },
      { name: "Interest",   icon: "landmark",     order: 4 },
    ],
  },
  {
    name: "Gift & Transfer",
    type: TransactionType.INCOME,
    icon: "gift",
    order: 4,
    subcategories: [
      { name: "Gift",           icon: "gift",         order: 1 },
      { name: "ATM Deposit",    icon: "landmark",     order: 2 },
      { name: "Bank Transfer",  icon: "arrow-left-right", order: 3 },
    ],
  },
  {
    name: "Others",
    type: TransactionType.INCOME,
    icon: "circle-ellipsis",
    order: 5,
    subcategories: [],
  },
];

async function main() {
  console.log("Seeding categories and subcategories...");

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { name_type: { name: cat.name, type: cat.type } },
      update: { icon: cat.icon, order: cat.order },
      create: {
        name: cat.name,
        type: cat.type,
        icon: cat.icon,
        order: cat.order,
      },
    });

    for (const sub of cat.subcategories) {
      await prisma.subcategory.upsert({
        where: { name_categoryId: { name: sub.name, categoryId: category.id } },
        update: { icon: sub.icon, order: sub.order },
        create: {
          name: sub.name,
          icon: sub.icon,
          order: sub.order,
          categoryId: category.id,
        },
      });
    }

    console.log(`  ✓ ${cat.type} — ${cat.name} (${cat.subcategories.length} subcategories)`);
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
