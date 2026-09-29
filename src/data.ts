export type Category = {
  id: string;
  name: string;
  keyword: string;
  lock: number;
  img?: string;
};

export type Product = {
  id: string;
  name: string;
  cat: string;
  price: number;
  was: number | null;
  rating: number;
  reviews: number;
  keyword: string;
  lock: number;
  desc: string;
  img?: string;
  // Seller-specific fields (for seller products)
  sellerId?: string;
  bio?: string;
};

export const CATEGORIES: Category[] = [
  { id: "phones", name: "Phones & Tablets", keyword: "smartphone", lock: 101 },
  {
    id: "electronics",
    name: "Electronics",
    keyword: "headphones,electronics",
    lock: 102,
  },
  {
    id: "fashion",
    name: "Fashion",
    keyword: "fashion,clothing-rack",
    lock: 103,
  },
  {
    id: "home",
    name: "Home & Living",
    keyword: "home-decor,living-room",
    lock: 104,
  },
  {
    id: "beauty",
    name: "Beauty & Grooming",
    keyword: "cosmetics,skincare",
    lock: 105,
  },
  {
    id: "grocery",
    name: "Supermarket",
    keyword: "groceries,supermarket",
    lock: 106,
  },
];

// Add img property to each category
CATEGORIES.forEach((c) => {
  c.img = `https://loremflickr.com/200/200/${c.keyword}/all?lock=${c.lock}`;
});

export const PRODUCTS: Product[] = [
  {
    id: "p01",
    name: "Aria Wireless Over-Ear Headphones, Noise Cancelling",
    cat: "electronics",
    price: 68500,
    was: 92000,
    rating: 4,
    reviews: 214,
    keyword: "headphones,wireless",
    lock: 1,
    desc: "Studio-tuned drivers with adaptive noise cancellation and a 40-hour battery. Foldable frame with a protective travel case included.",
  },
  {
    id: "p03",
    name: "Linen-Blend Tailored Blazer, Sand",
    cat: "fashion",
    price: 31500,
    was: 42000,
    rating: 4,
    reviews: 63,
    keyword: "blazer,menswear",
    lock: 3,
    desc: "A relaxed, unlined cut in a breathable linen-cotton blend. Fully lined at the shoulder for structure without the weight.",
  },
  // Phones & Tablets (p06-p13)
  {
    id: "p06",
    name: 'Verlo 6.1" Smartphone, 128GB, Single SIM',
    cat: "phones",
    price: 168000,
    was: 189000,
    rating: 4.5,
    reviews: 328,
    keyword: "smartphone,compact",
    lock: 6,
    desc: "A compact flagship with a vibrant OLED display, dual-lens camera system, and all-day battery life. Features facial recognition and water resistance.",
  },
  {
    id: "p07",
    name: 'Nova 10.9" Tablet, 64GB, WiFi',
    cat: "phones",
    price: 145000,
    was: 165000,
    rating: 4.2,
    reviews: 156,
    keyword: "tablet,ipad-alternative",
    lock: 7,
    desc: "A versatile tablet with a sharp 2K display, octa-core processor, and support for stylus input. Perfect for productivity and entertainment on the go.",
  },
  {
    id: "p08",
    name: "Verlo Buds Pro, True Wireless Earbuds",
    cat: "phones",
    price: 42000,
    was: 55000,
    rating: 4.4,
    reviews: 287,
    keyword: "earbuds,true-wireless",
    lock: 8,
    desc: "Premium sound quality with active noise cancellation, transparency mode, and IPX7 water resistance. Includes wireless charging case with 30-hour total battery life.",
  },
  {
    id: "p09",
    name: "MagSafe Wireless Charger 15W",
    cat: "phones",
    price: 18500,
    was: null,
    rating: 4.6,
    reviews: 412,
    keyword: "wireless-charger,magSafe",
    lock: 9,
    desc: "Efficient 15W wireless charging with magnetic alignment for compatible devices. Features overcharge protection and a sleek, minimalist design.",
  },
  {
    id: "p10",
    name: "Phone Stand & Wallet, Leather",
    cat: "phones",
    price: 12800,
    was: 16000,
    rating: 4.1,
    reviews: 89,
    keyword: "phone-stand,wallet,leather",
    lock: 10,
    desc: "Premium full-grain leather construction that combines a sturdy phone stand with a bifold wallet. Holds up to 3 cards and cash securely.",
  },
  {
    id: "p11",
    name: "Tempered Glass Screen Protector (2-pack)",
    cat: "phones",
    price: 3500,
    was: 5000,
    rating: 4.7,
    reviews: 523,
    keyword: "screen-protector,tempered-glass",
    lock: 11,
    desc: "9H hardness tempered glass with oleophobic coating to resist fingerprints and smudges. Includes installation kit and provides edge-to-edge protection.",
  },
  {
    id: "p12",
    name: "Rugged Phone Case, Military Grade",
    cat: "phones",
    price: 8900,
    was: 12000,
    rating: 4.3,
    reviews: 176,
    keyword: "phone-case,rugged",
    lock: 12,
    desc: "Multi-layer protection with shock-absorbing corners and raised bezels. Constructed from TPU and polycarbonate to meet MIL-STD-810H standards.",
  },
  {
    id: "p13",
    name: "Portable Power Bank 20,000mAh",
    cat: "phones",
    price: 24500,
    was: 32000,
    rating: 4.4,
    reviews: 234,
    keyword: "power-bank,portable-charger",
    lock: 13,
    desc: "High-capacity power bank with dual USB-C ports and 18W fast charging. Features LED power indicator and built-in safety protections.",
  },
  // Electronics (p14-p23)
  {
    id: "p14",
    name: "Aria Wireless On-Ear Headphones",
    cat: "electronics",
    price: 45000,
    was: 58000,
    rating: 4.2,
    reviews: 189,
    keyword: "headphones,on-ear,wireless",
    lock: 14,
    desc: "On-ear design with plush memory foam cushions and 30-hour battery life. Features Bluetooth 5.2 connectivity and built-in microphone for calls.",
  },
  {
    id: "p15",
    name: "Aria Wired Studio Headphones",
    cat: "electronics",
    price: 52000,
    was: null,
    rating: 4.6,
    reviews: 245,
    keyword: "headphones,wired,studio",
    lock: 15,
    desc: "Professional-grade over-ear headphones with 50mm drivers and frequency response of 20Hz-20kHz. Detachable cable with gold-plated connectors.",
  },
  {
    id: "p16",
    name: "SoundBar 2.1 Channel, Bluetooth",
    cat: "electronics",
    price: 89000,
    was: 115000,
    rating: 4.3,
    reviews: 156,
    keyword: "soundbar,bluetooth-speaker",
    lock: 16,
    desc: "2.1 channel soundbar with wireless subwoofer for deep bass. Includes Bluetooth connectivity, optical input, and multiple sound modes for movies, music, and gaming.",
  },
  {
    id: "p17",
    name: "Portable Bluetooth Speaker, IPX7",
    cat: "electronics",
    price: 38000,
    was: 48000,
    rating: 4.5,
    reviews: 312,
    keyword: "bluetooth-speaker,portable,waterproof",
    lock: 17,
    desc: "Rugged portable speaker with 360-degree sound and IPX7 waterproof rating. Features 24-hour battery life, built-in microphone, and ability to pair two speakers for stereo sound.",
  },
  {
    id: "p18",
    name: "Mechanical Keyboard, RGB, Hot-Swappable",
    cat: "electronics",
    price: 65000,
    was: 78000,
    rating: 4.4,
    reviews: 198,
    keyword: "mechanical-keyboard,rgb,gaming",
    lock: 18,
    desc: "Hot-swappable mechanical keyboard with per-key RGB lighting and aircraft-grade aluminum frame. Available with Red, Brown, or Blue switches for different typing experiences.",
  },
  {
    id: "p19",
    name: "Ergonomic Vertical Mouse, Wireless",
    cat: "electronics",
    price: 22000,
    was: 28000,
    rating: 4.1,
    reviews: 134,
    keyword: "mouse,vertical,ergonomic",
    lock: 19,
    desc: "Vertical ergonomic design reduces wrist strain and promotes natural hand position. Features adjustable DPI up to 4000, 6 programmable buttons, and 2.4GHz wireless connection.",
  },
  {
    id: "p20",
    name: '27" 4K Monitor, USB-C, 99% sRGB',
    cat: "electronics",
    price: 185000,
    was: 220000,
    rating: 4.7,
    reviews: 287,
    keyword: "monitor,4k,usb-c",
    lock: 20,
    desc: "27-inch IPS panel with 4K resolution, 99% sRGB color coverage, and HDR400 support. Includes USB-C with 90W power delivery, DisplayPort, and HDMI inputs.",
  },
  {
    id: "p21",
    name: "Laptop Stand, Aluminum, Adjustable",
    cat: "electronics",
    price: 15500,
    was: 19000,
    rating: 4.3,
    reviews: 112,
    keyword: "laptop-stand,aluminum",
    lock: 21,
    desc: "Premium aluminum laptop stand with adjustable height and angle settings. Features ventilated design for improved airflow and non-slip silicone pads.",
  },
  {
    id: "p22",
    name: "USB-C Hub 7-in-1",
    cat: "electronics",
    price: 18900,
    was: 24000,
    rating: 4.2,
    reviews: 176,
    keyword: "usb-c-hub,adapter",
    lock: 22,
    desc: "Versatile 7-in-1 USB-C hub with 4K HDMI, USB-A 3.0, USB-C power delivery, SD/microSD card readers, and Gigabit Ethernet port. Plug-and-play compatibility.",
  },
  {
    id: "p23",
    name: "Webcam 1080p, Privacy Cover, Noise Cancelling Mic",
    cat: "electronics",
    price: 28500,
    was: 35000,
    rating: 4.4,
    reviews: 203,
    keyword: "webcam,1080p,privacy",
    lock: 23,
    desc: "Full HD 1080p webcam with 60fps capability and built-in privacy shutter. Features dual noise-cancelling microphones, auto-low light correction, and wide-angle lens.",
  },
  // Fashion (p24-p31)
  {
    id: "p24",
    name: "Organic Cotton Crew Tee, White",
    cat: "fashion",
    price: 8500,
    was: 11000,
    rating: 4.2,
    reviews: 156,
    keyword: "t-shirt,cotton,organic",
    lock: 24,
    desc: "Made from 100% GOTS-certified organic cotton with a soft, breathable feel. Features ribbed collar, double-stitched hem, and tagless design for comfort.",
  },
  {
    id: "p25",
    name: "Merino Wool Sweater, Charcoal",
    cat: "fashion",
    price: 28000,
    was: 36000,
    rating: 4.5,
    reviews: 187,
    keyword: "sweater,merino-wool",
    lock: 25,
    desc: "Luxurious merino wool blend that provides natural temperature regulation and odor resistance. Features ribbed cuffs, hem, and neckline for lasting shape.",
  },
  {
    id: "p26",
    name: "Slim-Fit Chino Trousers, Khaki",
    cat: "fashion",
    price: 18500,
    was: 24000,
    rating: 4.1,
    reviews: 134,
    keyword: "chinos,trousers,slim-fit",
    lock: 26,
    desc: "Modern slim-fit chinos crafted from lightweight cotton twill with a touch of stretch for comfort. Features curved back pockets, hidden button fly, and tapered leg.",
  },
  {
    id: "p27",
    name: "Raw Selvedge Denim Jeans, Indigo",
    cat: "fashion",
    price: 34000,
    was: null,
    rating: 4.6,
    reviews: 224,
    keyword: "jeans,selvedge,raw-denim",
    lock: 27,
    desc: "Premium Japanese selvedge denim woven on vintage looms. Features raw unwashed finish, copper rivets, leather patch, and chain-stitch hem for authentic wear.",
  },
  {
    id: "p28",
    name: "Leather Chelsea Boots, Brown",
    cat: "fashion",
    price: 58000,
    was: 72000,
    rating: 4.4,
    reviews: 167,
    keyword: "chelsea-boots,leather",
    lock: 28,
    desc: "Handcrafted from full-grain leather with elastic side panels and pull tabs. Features Goodyear welt construction, leather lining, and durable rubber sole.",
  },
  {
    id: "p29",
    name: "Minimalist Leather Sneakers, White",
    cat: "fashion",
    price: 42000,
    was: 55000,
    rating: 4.3,
    reviews: 145,
    keyword: "sneakers,leather,minimalist",
    lock: 29,
    desc: "Clean, minimalist sneakers made from premium leather with rubber cup sole. Features perforated detailing for breathability and molded footbed for comfort.",
  },
  {
    id: "p30",
    name: "Structured Tote Bag, Leather",
    cat: "fashion",
    price: 65000,
    was: 85000,
    rating: 4.5,
    reviews: 198,
    keyword: "tote-bag,leather,structured",
    lock: 30,
    desc: "Structured tote bag made from vegetable-tanned leather with top handles and detachable shoulder strap. Features multiple interior pockets and secure zip closure.",
  },
  {
    id: "p31",
    name: "Silk Scarf, Abstract Print",
    cat: "fashion",
    price: 14500,
    was: 19000,
    rating: 4.2,
    reviews: 123,
    keyword: "silk-scarf,accessory",
    lock: 31,
    desc: "Lightweight 100% mulberry silk scarf with vibrant abstract print. Features hand-rolled edges and generous dimensions for versatile styling options.",
  },
  // Home & Living (p32-p39)
  {
    id: "p32",
    name: "Linen Duvet Cover Set, Queen",
    cat: "home",
    price: 38000,
    was: 48000,
    rating: 4.4,
    reviews: 178,
    keyword: "duvet-cover,linen,bedding",
    lock: 32,
    desc: "Premium European flax linen duvet cover set that gets softer with each wash. Includes matching pillowcases and features hidden button closure and corner ties.",
  },
  {
    id: "p33",
    name: "Weighted Blanket, 7kg",
    cat: "home",
    price: 28500,
    was: 35000,
    rating: 4.6,
    reviews: 214,
    keyword: "weighted-blanket,bedding",
    lock: 33,
    desc: "Therapeutic weighted blanket filled with non-toxic glass beads evenly distributed in individual pockets. Features removable, washable cover and corner loops to secure to duvet cover.",
  },
  {
    id: "p34",
    name: "Ceramic Table Lamp, Matte Finish",
    cat: "home",
    price: 22000,
    was: 28000,
    rating: 4.2,
    reviews: 134,
    keyword: "table-lamp,ceramic",
    lock: 34,
    desc: "Hand-thrown ceramic table lamp with matte glaze finish and organic shape. Features energy-efficient LED bulb with warm white temperature and touch dimmer.",
  },
  {
    id: "p35",
    name: "Woven Jute Rug, 8x10 ft",
    cat: "home",
    price: 45000,
    was: 58000,
    rating: 4.3,
    reviews: 167,
    keyword: "jute-rug,woven,natural",
    lock: 35,
    desc: "Natural fiber rug hand-woven from sustainable jute with tight, flat weave construction. Features cotton backing for durability and non-slip placement on hard floors.",
  },
  {
    id: "p36",
    name: "Acacia Wood Cutting Board, Large",
    cat: "home",
    price: 12800,
    was: 16000,
    rating: 4.5,
    reviews: 156,
    keyword: "cutting-board,acacia-wood",
    lock: 36,
    desc: "Large end-grain cutting board made from sustainably sourced acacia wood. Features juice groove, rounded edges, and food-safe mineral oil finish.",
  },
  {
    id: "p37",
    name: "Stainless Steel Cookware Set, 10-pc",
    cat: "home",
    price: 85000,
    was: 110000,
    rating: 4.6,
    reviews: 245,
    keyword: "cookware,stainless-steel",
    lock: 37,
    desc: "Tri-ply stainless steel cookware set with aluminum core for even heat distribution. Includes various-sized pots and pans with tempered glass lids and stay-cool handles.",
  },
  {
    id: "p38",
    name: "Aroma Diffuser, Ultrasonic, 300ml",
    cat: "home",
    price: 16500,
    was: 21000,
    rating: 4.4,
    reviews: 189,
    keyword: "aroma-diffuser,ultrasonic",
    lock: 38,
    desc: "Ultrasonic essential oil diffuser with large 300ml tank and up to 12 hours of runtime. Features multiple mist settings, LED mood lighting, and automatic shut-off.",
  },
  {
    id: "p39",
    name: "Velvet Throw Pillow Cover, 20x20",
    cat: "home",
    price: 6800,
    was: 9000,
    rating: 4.1,
    reviews: 112,
    keyword: "throw-pillow,velvet",
    lock: 39,
    desc: "Luxurious velvet throw pillow cover with soft pile and rich color saturation. Features concealed zipper insert and is filled with hypoallergenic polyester fiber.",
  },
  // Beauty & Grooming (p40-p47)
  {
    id: "p40",
    name: "Hyaluronic Acid Moisturizer, 50ml",
    cat: "beauty",
    price: 12500,
    was: 16000,
    rating: 4.3,
    reviews: 167,
    keyword: "moisturizer,hyaluronic-acid,skincare",
    lock: 40,
    desc: "Lightweight gel-cream moisturizer with multi-weight hyaluronic acid for intense hydration. Features niacinamide to strengthen skin barrier and ceramides to lock in moisture.",
  },
  {
    id: "p41",
    name: "Retinol Night Serum, 30ml",
    cat: "beauty",
    price: 18000,
    was: 23000,
    rating: 4.2,
    reviews: 145,
    keyword: "retinol,serum,anti-aging",
    lock: 41,
    desc: "Encapsulated retinol serum that delivers anti-aging benefits while minimizing irritation. Includes peptide complex to support collagen production and hyaluronic acid for hydration.",
  },
  {
    id: "p42",
    name: "Mineral Sunscreen SPF 50, 60ml",
    cat: "beauty",
    price: 14500,
    was: null,
    rating: 4.5,
    reviews: 198,
    keyword: "sunscreen,mineral,spf50",
    lock: 42,
    desc: "Broad-spectrum mineral sunscreen with non-nano zinc oxide for gentle yet effective protection. Features lightweight, non-greasy formula that leaves no white cast.",
  },
  {
    id: "p43",
    name: "Gentle Foaming Cleanser, 150ml",
    cat: "beauty",
    price: 8900,
    was: 11500,
    rating: 4.4,
    reviews: 176,
    keyword: "cleanser,foaming,gentle",
    lock: 43,
    desc: "pH-balanced foaming cleanser that removes impurities without stripping skin's natural moisture barrier. Features soothing aloe vera and green tea extract.",
  },
  {
    id: "p44",
    name: "Matte Liquid Lipstick, Terracotta",
    cat: "beauty",
    price: 9500,
    was: 12000,
    rating: 4.2,
    reviews: 134,
    keyword: "lipstick,liquid,matte",
    lock: 44,
    desc: "Long-wearing matte liquid lipstick with intense pigment transfer and comfortable wear. Features precision applicator for defined lines and feather-resistant formula.",
  },
  {
    id: "p45",
    name: "Volumizing Mascara, Waterproof",
    cat: "beauty",
    price: 11000,
    was: 14000,
    rating: 4.3,
    reviews: 156,
    keyword: "mascara,volumizing,waterproof",
    lock: 45,
    desc: "Volumizing mascara that lifts, separates, and defines lashes without clumping or flaking. Features waterproof formula that resists sweat, humidity, and tears.",
  },
  {
    id: "p46",
    name: "Beard Oil, Cedar & Sandalwood, 30ml",
    cat: "beauty",
    price: 7800,
    was: 10000,
    rating: 4.2,
    reviews: 123,
    keyword: "beard-oil,grooming,cedar",
    lock: 46,
    desc: "Nourishing beard oil blend with jojoba and argan oils to soften facial hair and condition skin underneath. Features cedarwood and sandalwood essential oils for a woodsy aroma.",
  },
  {
    id: "p47",
    name: "Safety Razor, Stainless Steel",
    cat: "beauty",
    price: 15500,
    was: 19000,
    rating: 4.4,
    reviews: 167,
    keyword: "safety-razor,stainless-steel",
    lock: 47,
    desc: "Classic double-edge safety razor made from precision-machined stainless steel. Features textured grip for secure handling and includes 10 platinum-coated blades.",
  },
  // Supermarket (p48-p55)
  {
    id: "p48",
    name: "Single-Origin Coffee Beans, 250g",
    cat: "grocery",
    price: 8500,
    was: null,
    rating: 4.6,
    reviews: 198,
    keyword: "coffee,beans,single-origin",
    lock: 48,
    desc: "Ethically sourced single-origin coffee beans roasted to perfection for optimal flavor profile. Features notes of citrus, chocolate, and floral undertones depending on origin.",
  },
  {
    id: "p49",
    name: "Artisan Dark Chocolate, 70%, 100g",
    cat: "grocery",
    price: 4200,
    was: 5500,
    rating: 4.4,
    reviews: 156,
    keyword: "dark-chocolate,artisan,70-percent",
    lock: 49,
    desc: "Small-batch artisanal dark chocolate made from premium cacao beans with minimal ingredients. Features smooth texture and complex flavor notes that develop on the palate.",
  },
  {
    id: "p50",
    name: "Extra Virgin Olive Oil, 500ml",
    cat: "grocery",
    price: 12800,
    was: 16000,
    rating: 4.5,
    reviews: 187,
    keyword: "olive-oil,extra-virgin",
    lock: 50,
    desc: "Cold-pressed extra virgin olive oil from early harvest olives with low acidity and fruity aroma. Features robust flavor profile perfect for dipping, dressing, and cooking.",
  },
  {
    id: "p51",
    name: "Organic Quinoa, 1kg",
    cat: "grocery",
    price: 6500,
    was: 8000,
    rating: 4.3,
    reviews: 134,
    keyword: "quinoa,organic,grains",
    lock: 51,
    desc: "Certified organic quinoa that's pre-rinsed to remove saponins and cook up fluffy and light. Complete protein source containing all nine essential amino acids.",
  },
  {
    id: "p52",
    name: "Raw Honey, Wildflower, 350g",
    cat: "grocery",
    price: 5800,
    was: null,
    rating: 4.7,
    reviews: 224,
    keyword: "honey,raw,wildflower",
    lock: 52,
    desc: "Raw, unfiltered wildflower honey straight from the hive with natural enzymes and pollen intact. Features varying flavor profiles based on seasonal bloom sources.",
  },
  {
    id: "p53",
    name: "Herb Garden Kit, Indoor",
    cat: "grocery",
    price: 18500,
    was: 23000,
    rating: 4.2,
    reviews: 145,
    keyword: "herb-garden,indoor,kit",
    lock: 53,
    desc: "Complete indoor herb garden kit with five biodegradable pots, organic seeds, nutrient-rich soil, and grow light. Includes basil, mint, rosemary, thyme, and cilantro varieties.",
  },
  {
    id: "p54",
    name: "Bamboo Cutlery Set, Travel",
    cat: "grocery",
    price: 4500,
    was: 6000,
    rating: 4.3,
    reviews: 123,
    keyword: "bamboo-cutlery,travel,eco-friendly",
    lock: 54,
    desc: "Reusable travel cutlery set made from sustainably sourced bamboo with natural antimicrobial properties. Includes fork, knife, spoon, straw, and cleaning brush in compact case.",
  },
  {
    id: "p55",
    name: "Reusable Produce Bags, Mesh, 8-pack",
    cat: "grocery",
    price: 3200,
    was: 4500,
    rating: 4.4,
    reviews: 156,
    keyword: "produce-bags,mesh,reusable",
    lock: 55,
    desc: "Set of eight reusable mesh produce bags in various sizes for fruits, vegetables, and grains. Features drawstring closure, tare weight tags, and machine washable construction.",
  },
];

// Add img property to each product
PRODUCTS.forEach((p) => {
  p.img = `https://loremflickr.com/200/200/${p.keyword}/all?lock=${p.lock}`;
});

/**
 * Utility function to generate product image URL
 * @param keyword - keyword for LoremFlickr
 * @param lock - lock number for consistent image
 * @returns URL string
 */
export const productImg = (keyword: string, lock: number): string =>
  `https://loremflickr.com/200/200/${keyword}/all?lock=${lock}`;

export type ProductFilters = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sort?: "relevance" | "price-asc" | "price-desc" | "rating";
};

/**
 * Get paginated products with filtering and sorting
 */
export function getProductsPaginated(
  products: typeof PRODUCTS,
  category: string | null,
  page: number,
  perPage: number,
  filters: ProductFilters = {},
): { products: Product[]; total: number; totalPages: number } {
  let filtered = products;

  // Apply category filter
  if (category) {
    filtered = filtered.filter((p) => p.cat === category);
  } else if (filters.category) {
    filtered = filtered.filter((p) => p.cat === filters.category);
  }

  // Apply price filter
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
  }

  // Apply rating filter
  if (filters.minRating !== undefined) {
    filtered = filtered.filter((p) => p.rating >= filters.minRating!);
  }

  // Apply in-stock filter (all mock products are in stock)
  // if (filters.inStock) {
  //   filtered = filtered.filter((p) => p.inStock);
  // }

  // Apply sorting
  switch (filters.sort) {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "relevance":
    default:
      filtered.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return a.price - b.price;
      });
      break;
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return { products: paginated, total, totalPages };
}

/**
 * Search products by query string
 * Searches in name, description, category, tags, and brand
 */
export function searchProducts(
  products: typeof PRODUCTS,
  query: string,
  filters: ProductFilters = {},
): Product[] {
  if (!query.trim()) return products;

  const searchTerm = query.toLowerCase().trim();
  const terms = searchTerm.split(/\s+/).filter(Boolean);

  let filtered = products;

  // Apply existing filters first
  if (filters.category) {
    filtered = filtered.filter((p) => p.cat === filters.category);
  }
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.minRating !== undefined) {
    filtered = filtered.filter((p) => p.rating >= filters.minRating!);
  }

  // Search across multiple fields
  filtered = filtered.filter((product) => {
    const searchableText = [
      product.name,
      product.desc,
      product.cat,
      product.keyword,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    // All search terms must match (AND logic)
    return terms.every((term) => searchableText.includes(term));
  });

  // Apply sorting
  switch (filters.sort) {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "relevance":
    default:
      // Relevance: sort by rating descending, then by price ascending
      filtered.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return a.price - b.price;
      });
      break;
  }

  return filtered;
}
