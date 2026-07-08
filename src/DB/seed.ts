import dotenv from 'dotenv';
dotenv.config();

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema/exporter.js';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.DB_NAME,
  ssl: false,
});

const db = drizzle(pool, { schema });

const { user, userProfile, products } = schema;

const indianNames = [
  'Aarav Sharma',
  'Priya Patel',
  'Rohan Gupta',
  'Ananya Reddy',
  'Vikram Singh',
  'Neha Joshi',
  'Arjun Nair',
  'Kavya Iyer',
  'Aditya Verma',
  'Deepa Menon',
  'Siddharth Rao',
  'Pooja Deshmukh',
  'Karthik Bhat',
  'Megha Kulkarni',
  'Rahul Mishra',
  'Shruti Pandey',
  'Nikhil Tiwari',
  'Divya Kaur',
  'Amit Chauhan',
  'Sanjana Rao',
  'Varun Kumar',
  'Tanvi Gokhale',
  'Pratik Shah',
  'Ritika Sen',
  'Manan Desai',
  'Akanksha Pillai',
  'Gaurav Malhotra',
  'Nishtha Jain',
  'Sagar Patil',
  'Bhavya Reddy',
  'Harsh Bansal',
  'Isha Bhatt',
  'Jay Thakur',
  'Komal Sarode',
  'Lakshya Mehta',
  'Mitali Chakraborty',
  'Naman Kapoor',
  'Oviya Sundaram',
  'Parth Kulkarni',
  'Qureshi Farhan',
  'Rashi Bhargava',
  'Saurabh Khandelwal',
  'Tanya Malhotra',
  'Uday Gavhane',
  'Vishal Jha',
  'Waniya Siddiqui',
  'Yash Puri',
  'Zara Khan',
  'Abhay Dixit',
  'Bhumika Lokhande',
];

const batches = ['2021-22', '2022-23', '2023-24', '2024-25'];

const categories = [
  {
    name: 'Electronics',
    items: [
      {
        name: 'MacBook Pro 2021',
        price: 80000,
        detail: 'M1 Pro chip, 16GB RAM, 512GB SSD. Excellent condition.',
      },
      {
        name: 'iPhone 14',
        price: 45000,
        detail: '128GB, Blue color. 6 months old, with warranty.',
      },
      {
        name: 'Sony WH-1000XM5',
        price: 18000,
        detail: 'Noise cancelling headphones. Used for 3 months.',
      },
      { name: 'iPad Air M1', price: 35000, detail: '64GB, Wi-Fi model. Comes with Apple Pencil.' },
      { name: 'Samsung Galaxy S23', price: 40000, detail: '128GB, Phantom Black. Mint condition.' },
      {
        name: 'Dell Monitor 27 inch',
        price: 12000,
        detail: '4K IPS panel, USB-C connectivity. Barely used.',
      },
      {
        name: 'Logitech MX Keys Keyboard',
        price: 5500,
        detail: 'Wireless backlit keyboard. Like new.',
      },
      { name: 'HP Pavilion Laptop', price: 35000, detail: 'i5 12th gen, 8GB RAM, 512GB SSD.' },
      { name: 'Realme Air Buds Pro', price: 2500, detail: 'ANC earbuds. 2 months old.' },
      {
        name: 'Canon EOS M50 Camera',
        price: 42000,
        detail: 'Mirrorless camera with 15-45mm lens kit.',
      },
      {
        name: 'JBL Flip 6 Speaker',
        price: 8000,
        detail: 'Portable Bluetooth speaker. Waterproof.',
      },
      { name: 'Apple Watch SE', price: 15000, detail: '40mm, GPS model. Band included.' },
      { name: 'OnePlus Nord CE 3', price: 18000, detail: '128GB, Gray Shadow. 4 months old.' },
      {
        name: 'Asus ROG Strix Laptop',
        price: 65000,
        detail: 'Ryzen 7, RTX 3060, 16GB RAM, 1TB SSD.',
      },
      {
        name: 'LG Ultrawide Monitor',
        price: 22000,
        detail: '34 inch curved, 1440p. Great for productivity.',
      },
      {
        name: 'Razer DeathAdder Mouse',
        price: 3500,
        detail: 'Ergonomic gaming mouse. RGB lighting.',
      },
      { name: 'Kindle Paperwhite', price: 7000, detail: '2022 model, 8GB. With cover.' },
      {
        name: 'Anker PowerBank 20000mAh',
        price: 2500,
        detail: 'Fast charging support. Barely used.',
      },
      { name: 'Fire TV Stick 4K', price: 3000, detail: 'With remote. Includes 1 month Prime.' },
      {
        name: 'Noise ColorFit Pro 4',
        price: 2000,
        detail: 'Smartwatch with BT calling. 1 month old.',
      },
      { name: 'Samsung T7 SSD 500GB', price: 4000, detail: 'Portable SSD. Read speed 1050MB/s.' },
      {
        name: 'Logitech G502 Mouse',
        price: 3000,
        detail: 'Wired gaming mouse. Adjustable weight.',
      },
      { name: 'Boat Rockerz 550', price: 1500, detail: 'Over-ear wireless headphones. Good bass.' },
      {
        name: 'TP-Link WiFi Router',
        price: 2000,
        detail: 'Dual band AC1200. Good for hostel use.',
      },
      { name: 'SanDisk 128GB Pen Drive', price: 800, detail: 'USB 3.0, high speed transfer.' },
    ],
  },
  {
    name: 'Books',
    items: [
      {
        name: 'Physics NCERT Class 12',
        price: 250,
        detail: 'Full syllabus covered. Minimal markings.',
      },
      {
        name: 'Cengage Maths JEE',
        price: 600,
        detail: 'Complete JEE preparation book. Good condition.',
      },
      {
        name: 'Introduction to Algorithms CLRS',
        price: 500,
        detail: '3rd edition. Essential for CS students.',
      },
      {
        name: 'Operating Systems Galvin',
        price: 400,
        detail: '9th edition. Some highlighting inside.',
      },
      {
        name: 'Database System Concepts Korth',
        price: 450,
        detail: '7th edition. Almost new condition.',
      },
      {
        name: 'Engineering Chemistry ND Jain',
        price: 300,
        detail: 'First year syllabus. Clean copy.',
      },
      {
        name: 'Engineering Drawing N.D. Bhatt',
        price: 350,
        detail: 'Standard textbook for ED course.',
      },
      {
        name: 'Data Structures using C Reema Thareja',
        price: 280,
        detail: 'Good for semester exams.',
      },
      {
        name: 'Mathematics NCERT Class 12',
        price: 200,
        detail: 'With solved examples. Light pencil work.',
      },
      {
        name: 'Computer Networks Tanenbaum',
        price: 550,
        detail: '5th edition. Essential for CN course.',
      },
      {
        name: 'Signals and Systems Oppenheim',
        price: 400,
        detail: '2nd edition. Some pages have notes.',
      },
      {
        name: 'Control Systems Nagrath Kothari',
        price: 350,
        detail: 'Standard reference for control systems.',
      },
      {
        name: 'H.C. Verma Physics',
        price: 250,
        detail: 'Concepts of Physics Vol 1. Well maintained.',
      },
      { name: 'O.P. Agarwal Maths', price: 300, detail: 'Higher Engineering Mathematics.' },
      { name: 'Thermodynamics PK Nag', price: 320, detail: '5th edition. Clean copy.' },
      {
        name: 'Machine Design VB Bhandari',
        price: 380,
        detail: 'Standard for mechanical engineering.',
      },
      {
        name: 'Strength of Materials Rattan',
        price: 290,
        detail: 'With solved problems. Useful for exams.',
      },
      {
        name: 'Digital Electronics Morris Mano',
        price: 420,
        detail: 'Fundamentals with VHDL. Good condition.',
      },
      {
        name: 'Engineering Economics Venkataramaiah',
        price: 200,
        detail: 'Complete syllabus coverage.',
      },
      { name: 'Automata Theory Hopcroft', price: 380, detail: '3rd edition. Core CS reference.' },
    ],
  },
  {
    name: 'Furniture',
    items: [
      {
        name: 'Study Chair - Ergonomic',
        price: 3500,
        detail: 'Adjustable height and armrest. Used for 1 year.',
      },
      {
        name: 'Foldable Study Table',
        price: 2500,
        detail: 'Wooden top, metal legs. Easy to store.',
      },
      { name: 'LED Desk Lamp', price: 800, detail: 'Adjustable brightness. USB charging port.' },
      {
        name: 'Single Bed Mattress',
        price: 4000,
        detail: 'Memory foam, 6 inch thick. 8 months old.',
      },
      { name: 'Bookshelf - 3 Tier', price: 1500, detail: 'Metal frame. Can hold 50+ books.' },
      { name: 'Bean Bag Chair', price: 1200, detail: 'Large size, grey color. Filled with beans.' },
      { name: 'Wall Mirror - Full Length', price: 900, detail: '3x1 feet. With adhesive hooks.' },
      {
        name: 'Storage Ottoman',
        price: 1800,
        detail: 'Doubles as seat and storage. 40L capacity.',
      },
      { name: 'Under-bed Storage Box', price: 600, detail: 'Plastic, 60L capacity. With wheels.' },
      {
        name: 'Clothes Rack - Portable',
        price: 1000,
        detail: 'Foldable metal rack. 4 bars for hanging.',
      },
      { name: 'Floor Lamp - Bamboo', price: 1200, detail: 'Warm light. Adjustable height.' },
      {
        name: 'Pillow Set - 2 pcs',
        price: 500,
        detail: 'Memory foam pillows. Soft and comfortable.',
      },
      {
        name: 'Desk Organizer - Wood',
        price: 400,
        detail: 'Multi-compartment. For stationery and phone.',
      },
      {
        name: 'Bed Sheet Set - King',
        price: 700,
        detail: 'Cotton, 2 bed sheets + 2 pillow covers.',
      },
      {
        name: 'Curtain Set - 2 pcs',
        price: 600,
        detail: 'Blackout curtains. 5x6 feet. Grey color.',
      },
    ],
  },
  {
    name: 'Clothing',
    items: [
      {
        name: 'Nike Air Max Sneakers',
        price: 3000,
        detail: 'Size 10. Used for 2 months. Like new.',
      },
      { name: 'Denim Jacket - Levis', price: 2000, detail: 'Size L. Dark blue. Classic fit.' },
      {
        name: 'Formal Blazer - Black',
        price: 2500,
        detail: 'Size M. For placement season. Barely worn.',
      },
      { name: 'Puma Running Shoes', price: 2200, detail: 'Size 9. Lightweight and comfortable.' },
      {
        name: 'Hoodie - Campus Edition',
        price: 800,
        detail: 'Size L. VNIT themed. New condition.',
      },
      { name: 'Formal Trousers - 2 pcs', price: 1200, detail: 'Size 32. Black and navy blue.' },
      {
        name: 'Winter Jacket - Puffer',
        price: 1800,
        detail: 'Size L. Warm and compact. 1 year old.',
      },
      {
        name: 'Sports T-shirt Set - 3 pcs',
        price: 900,
        detail: 'Cotton blend. M size. Good for gym.',
      },
      { name: 'Ethnic Kurta - White', price: 600, detail: 'Size L. Cotton. Festival ready.' },
      { name: 'Jeans - Wrangler', price: 1000, detail: 'Size 32. Slim fit. Dark wash.' },
      { name: 'Sneakers - Adidas', price: 2800, detail: 'Size 10. Stan Smith model. White.' },
      { name: 'Raincoat - Waterproof', price: 700, detail: 'Size L. Compact and foldable.' },
      { name: 'Belt - Leather', price: 500, detail: 'Brown, size 34. Genuine leather.' },
      { name: 'Sports Shorts - 2 pcs', price: 600, detail: 'Size L. With pockets. Quick dry.' },
      {
        name: 'Socks Pack - 5 pairs',
        price: 300,
        detail: 'Cotton, ankle length. White and black.',
      },
    ],
  },
  {
    name: 'Sports',
    items: [
      {
        name: 'SS Cricket Bat',
        price: 2000,
        detail: 'Kashmir willow. Short handle. 2 months use.',
      },
      { name: 'Nivia Football', price: 800, detail: 'Size 5. Official weight. Good grip.' },
      {
        name: 'Dumbbells Set - 10kg',
        price: 1500,
        detail: '2 dumbbells of 5kg each. Vinyl coated.',
      },
      { name: 'Yoga Mat - 6mm', price: 600, detail: 'Non-slip surface. Purple color.' },
      { name: 'Yonex Badminton Racket', price: 1800, detail: 'Lightweight. With grip and cover.' },
      { name: 'Table Tennis Set', price: 1200, detail: '2 rackets + 3 balls. With carry case.' },
      {
        name: 'Resistance Bands Set',
        price: 500,
        detail: '5 bands with different resistance levels.',
      },
      {
        name: 'Skipping Rope - Speed',
        price: 300,
        detail: 'Adjustable length. Ball bearing handle.',
      },
      { name: 'Cricket Wicket Set', price: 1000, detail: '3 stumps + 2 bails. PVC material.' },
      { name: 'Football Shin Guards', price: 400, detail: 'Size M. With straps. Good protection.' },
      { name: 'Basketball - Nivia', price: 700, detail: 'Size 7. Official grip. Indoor/outdoor.' },
      {
        name: 'Swimming Goggles',
        price: 500,
        detail: 'Anti-fog, UV protection. Adjustable strap.',
      },
      { name: 'Kettlebell - 8kg', price: 1200, detail: 'Cast iron. Vinyl coated. Green color.' },
      {
        name: 'Tennis Racket - Head',
        price: 2200,
        detail: 'With strings and grip. Includes cover.',
      },
      { name: 'Foam Roller', price: 800, detail: '18 inch. High density. For muscle recovery.' },
    ],
  },
  {
    name: 'Accessories',
    items: [
      {
        name: 'Wildcraft Backpack 40L',
        price: 2000,
        detail: 'Waterproof. Multiple compartments. Laptop sleeve.',
      },
      {
        name: 'Fossil Analog Watch',
        price: 1800,
        detail: 'Leather strap. Silver dial. 1 year old.',
      },
      { name: 'Ray-Ban Sunglasses', price: 1500, detail: 'Aviator model. UV400 protection.' },
      { name: 'Anker Power Bank 10000mAh', price: 1200, detail: 'Fast charging. Dual USB output.' },
      {
        name: 'Wildcraft Wallet - Leather',
        price: 600,
        detail: 'Brown, RFID blocking. 6 card slots.',
      },
      {
        name: 'Keychain Multi-Tool',
        price: 300,
        detail: 'Bottle opener, screwdriver, knife. Stainless steel.',
      },
      {
        name: 'Phone Stand - Adjustable',
        price: 200,
        detail: 'Foldable. Compatible with all phones.',
      },
      {
        name: 'Laptop Sleeve - 15 inch',
        price: 500,
        detail: 'Waterproof. Padded interior. Grey color.',
      },
      { name: 'Wireless Mouse Logitech', price: 800, detail: 'M350 model. Silent clicks. Blue.' },
      { name: 'USB Hub - 4 Port', price: 400, detail: 'USB 3.0. Plug and play. Compact design.' },
    ],
  },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomMobile(start: number, offset: number): string {
  return String(start + offset).padStart(10, '0');
}

async function seed() {
  console.log('Seeding database...');

  // Clear existing data
  console.log('Clearing existing data...');
  await db.delete(products);
  await db.delete(userProfile);
  await db.delete(user);

  // Insert 50 users
  console.log('Inserting 50 users...');
  const insertedUsers = await db
    .insert(user)
    .values(
      Array.from({ length: 50 }, (_, i) => ({
        clerkId: `user_seed_${String(i + 1).padStart(2, '0')}`,
        email: `student${String(i + 1).padStart(2, '0')}@vnit.ac.in`,
      })),
    )
    .returning({ id: user.id });

  // Insert 50 user profiles
  console.log('Inserting 50 user profiles...');
  const profileValues = insertedUsers.map((u, i) => ({
    userId: u.id,
    name: indianNames[i]!,
    mobile: randomMobile(9876543210, i),
    batch: pickRandom(batches),
    collageName: 'VNIT Nagpur',
  }));

  await db.insert(userProfile).values(profileValues);

  // Insert 100 products
  console.log('Inserting 100 products...');
  const allItems: Array<{
    name: string;
    category: string;
    price: number;
    detail: string;
  }> = [];

  for (const cat of categories) {
    for (const item of cat.items) {
      allItems.push({ ...item, category: cat.name });
    }
  }

  // Shuffle and pick 100
  const shuffled = allItems.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 100);

  const productValues = selected.map((item, i) => {
    const userIndex = i % 50;
    const u = insertedUsers[userIndex]!;
    return {
      name: item.name,
      category: item.category,
      userId: u.id,
      price: item.price,
      collageName: 'VNIT Nagpur',
      detail: item.detail,
      status: Math.random() < 0.8 ? 'available' : 'unavailable',
      images: ['https://placehold.co/600x400'],
    };
  });

  await db.insert(products).values(productValues);

  console.log('Seeding complete!');
  console.log(`  - ${insertedUsers.length} users`);
  console.log(`  - ${profileValues.length} profiles`);
  console.log(`  - ${productValues.length} products`);

  await pool.end();
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
