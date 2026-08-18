export const SHOP_NAME = 'Hasnain Food Point';
export const SHOP_TAGLINE = 'Fresh & Honest Food in Sahiwal';
export const DEFAULT_WHATSAPP_NUMBER = '0305 1589494';
export const DEFAULT_WHATSAPP_RAW = '923051589494';
export const DEFAULT_ADDRESS = '94/9-L, Sahiwal';
export const DEFAULT_OPENING_HOURS = '12:00 PM – 9:00 PM, Daily';
export const DEFAULT_MAP_URL = 'https://maps.app.goo.gl/pbYxzzyQbwvbU8897';
export const DEFAULT_OWNER_NAME = 'Hasnain Zafar';
export const DEFAULT_OWNER_STORY =
  "Hasnain Zafar started Hasnain Food Point right here in Sahiwal with one simple idea — serve fresh, honest food, made the way he'd want to eat it himself. What began as a small food point has become a daily stop for fries, rolls, and burgers made fresh to order. Every plate carries his name, so every plate gets his full attention.";

export const NAV_LINKS = [
  { label: 'Menu', href: '#menu' },
  { label: 'About', href: '#about' },
  { label: 'Location', href: '#location' },
];

export const DEFAULT_ORDER_TEMPLATE = (itemName) =>
  `Hi! I'd like to order: ${itemName}`;

export const DEFAULT_GENERAL_MESSAGE =
  'Hi! I would like to place an order at Hasnain Food Point.';

// Seeded / fallback menu items matching PRD §4 and memory.md
// Image assets are high-quality placeholders (marked TODO for real photos when client provides studio shots)
export const DEFAULT_MENU = [
  {
    id: 1,
    name: 'Fries',
    urduName: 'فرائز',
    icon: '🍟',
    description: 'Crispy & Fresh • گرما گرم فرائز',
    displayOrder: 1,
    items: [
      {
        id: 101,
        name: 'Half Plate Fries',
        urduName: 'ہاف پلیٹ فرائز',
        description: 'Crispy seasoned potato fries • ہاف پلیٹ',
        price: 50,
        priceDisplay: 'Rs. 50',
        imageUrl: '/assets/images/fries-half.webp',
        isAvailable: true,
      },
      {
        id: 102,
        name: 'Full Plate Fries',
        urduName: 'فل پلیٹ فرائز',
        description: 'Generous serving of hot crispy fries • فل پلیٹ',
        price: 100,
        priceDisplay: 'Rs. 100',
        imageUrl: '/assets/images/fries-full.webp',
        isAvailable: true,
      },
    ],
  },
  {
    id: 2,
    name: 'Burger',
    urduName: 'آملیٹ برگر',
    icon: '🍔',
    description: 'Fresh & Juicy • تازہ انڈہ برگر',
    displayOrder: 2,
    items: [
      {
        id: 201,
        name: 'Amelet Burger',
        urduName: 'آملیٹ برگر',
        description: 'Spiced egg patty in toasted bun • سپیشل انڈہ برگر',
        price: 150,
        priceDisplay: 'Rs. 150',
        imageUrl: '/assets/images/amelet-burger.webp',
        isAvailable: true,
      },
    ],
  },
  {
    id: 3,
    name: 'Samosa',
    urduName: 'آلو سموسہ',
    icon: '🥟',
    description: 'Crispy Golden • کرسپی سموسہ',
    displayOrder: 3,
    items: [
      {
        id: 301,
        name: 'Aloo Samosa',
        urduName: 'آلو سموسہ',
        description: 'Crispy pastry with spicy potato filling • گرما گرم سموسہ',
        price: 30,
        priceDisplay: 'Rs. 30',
        imageUrl: '/assets/images/aloo-samosa.webp',
        isAvailable: true,
      },
    ],
  },
  {
    id: 4,
    name: 'Roll',
    urduName: 'آلو رول',
    icon: '🌯',
    description: 'Crunchy Snack • ذائقہ دار رول',
    displayOrder: 4,
    items: [
      {
        id: 401,
        name: 'Aloo Roll',
        urduName: 'آلو رول',
        description: 'Golden fried roll with spiced potatoes • کرسپی آلو رول',
        price: 10,
        priceDisplay: 'Rs. 10',
        imageUrl: '/assets/images/aloo-roll.webp',
        isAvailable: true,
      },
    ],
  },
  {
    id: 5,
    name: 'Naan',
    urduName: 'آلو نان',
    icon: '🫓',
    description: 'Soft & Stuffed • تندوری آلو نان',
    displayOrder: 5,
    items: [
      {
        id: 501,
        name: 'Aloo Naan',
        urduName: 'آلو نان',
        description: 'Warm tandoori naan with spiced potatoes • تازہ تندوری نان',
        price: 70,
        priceDisplay: 'Rs. 70',
        imageUrl: '/assets/images/aloo-naan.webp',
        isAvailable: true,
      },
    ],
  },
  {
    id: 6,
    name: 'Cold Drinks & Juices',
    urduName: 'کولڈ ڈرنکس اور جوس',
    icon: '🥤',
    description: 'Chilled Refreshments • ٹھنڈی بوتلیں',
    displayOrder: 6,
    items: [
      {
        id: 601,
        name: 'Gourmet, Coke, Pepsi',
        urduName: 'کولڈ ڈرنکس (گورمے، کوک، پیپسی)',
        description: 'Chilled drinks & juices • حسبِ پسند بوتل',
        price: 0,
        priceDisplay: 'Ask on WhatsApp',
        imageUrl: '/assets/images/cold-drinks.webp',
        isAvailable: true,
      },
    ],
  },
];
