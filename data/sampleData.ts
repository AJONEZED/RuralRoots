import { AppData, Farm, Job, Review, User } from '../types';

const sampleUsers: User[] = [
  { id: 'u1', name: 'Alice Customer', email: 'customer@test.com', password: 'password', type: 'customer' },
  { id: 'u2', name: 'Bob Farmer', email: 'farm@test.com', password: 'password', type: 'farm' },
  { id: 'u3', name: 'Charlie Worker', email: 'worker@test.com', password: 'password', type: 'worker' },
];

const sampleReviews: Review[] = [
    { id: 'r1', userId: 'u1', userName: 'Alice Customer', rating: 5, text: 'Absolutely fantastic produce and the friendliest staff. The organic strawberries were the best I have ever tasted!', date: new Date('2023-10-26T10:00:00Z').toISOString() },
    { id: 'r2', userId: 'u3', userName: 'Charlie Worker', rating: 4, text: 'A great place to visit. The corn maze was fun for the whole family. A bit crowded on weekends, though.', date: new Date('2023-10-22T14:30:00Z').toISOString() },
];

const sampleFarms: Farm[] = [
    {
        id: 'f1',
        ownerId: 'u2',
        name: 'Green Valley Organics',
        location: 'Sonoma, CA',
        region: 'North America',
        description: 'A family-owned farm specializing in certified organic vegetables, fruits, and free-range eggs. We believe in sustainable agriculture and providing the freshest produce to our community.',
        tags: ['organic', 'vegetables', 'eggs', 'family-friendly'],
        rating: 4.5,
        contact: 'contact@greenvalley.com',
        website: 'https://greenvalley.com',
        images: ['https://picsum.photos/seed/farm1/800/600', 'https://picsum.photos/seed/farm1a/800/600'],
        reviews: sampleReviews
    },
    {
        id: 'f2',
        ownerId: 'u2',
        name: 'Sunny Meadows Dairy',
        location: 'Upstate, NY',
        region: 'North America',
        description: 'Home to the happiest cows and the freshest dairy products. We offer milk, cheese, and yogurt, all made on-site from our pasture-raised cows.',
        tags: ['dairy', 'cheese', 'milk', 'organic'],
        rating: 4.8,
        contact: 'info@sunnymeadows.com',
        website: 'https://sunnymeadows.com',
        images: ['https://picsum.photos/seed/farm2/800/600', 'https://picsum.photos/seed/farm2a/800/600'],
        reviews: [
            { id: 'r3', userId: 'u1', userName: 'Alice Customer', rating: 5, text: 'The best cheese I have ever had. You can taste the quality and care.', date: new Date().toISOString() }
        ]
    },
    {
        id: 'f3',
        ownerId: 'u2',
        name: 'Orchard Grove',
        location: 'Wenatchee, WA',
        region: 'North America',
        description: 'Famous for our wide variety of apples and seasonal fruit picking. A perfect destination for a fall day trip. Come and taste our award-winning apple cider.',
        tags: ['apples', 'fruit-picking', 'cider', 'family-friendly'],
        rating: 4.2,
        contact: 'visit@orchardgrove.com',
        website: 'https://orchardgrove.com',
        images: ['https://picsum.photos/seed/farm3/800/600', 'https://picsum.photos/seed/farm3a/800/600'],
        reviews: []
    },
    {
        id: 'f4',
        ownerId: 'u2',
        name: 'Maple Leaf Acres',
        location: 'Niagara, ON',
        region: 'North America',
        description: 'Experience Canadian agriculture at its finest. We specialize in maple syrup production and offer guided tours during the spring season.',
        tags: ['maple-syrup', 'tours', 'family-friendly'],
        rating: 4.9,
        contact: 'info@mapleleafacres.com',
        website: 'https://mapleleafacres.com',
        images: ['https://picsum.photos/seed/farm4/800/600', 'https://picsum.photos/seed/farm4a/800/600'],
        reviews: [
            { id: 'r4', userId: 'u1', userName: 'Alice Customer', rating: 5, text: 'The maple syrup is out of this world! A must-visit if you are in the area.', date: new Date().toISOString() }
        ]
    },
    {
        id: 'f5',
        ownerId: 'u2',
        name: 'Amazonas Agroforest',
        location: 'Manaus, Brazil',
        region: 'South America',
        description: 'A sustainable agroforestry project deep in the heart of Brazil. We cultivate acai, Brazil nuts, and other native fruits while preserving the rainforest.',
        tags: ['agroforestry', 'acai', 'sustainable', 'tours'],
        rating: 4.7,
        contact: 'contact@amazonasagro.com',
        website: 'https://amazonasagro.com',
        images: ['https://picsum.photos/seed/farm5/800/600', 'https://picsum.photos/seed/farm5a/800/600'],
        reviews: []
    },
    {
        id: 'f6',
        ownerId: 'u2',
        name: 'Kyoto Tea Gardens',
        location: 'Uji, Japan',
        region: 'Asia',
        description: 'Generations of tea masters cultivating the finest Gyokuro and Matcha. Participate in a traditional tea ceremony and learn about our history.',
        tags: ['tea', 'matcha', 'organic', 'tours'],
        rating: 4.9,
        contact: 'info@kyototea.jp',
        website: 'https://kyototea.jp',
        images: ['https://picsum.photos/seed/farm6/800/600', 'https://picsum.photos/seed/farm6a/800/600'],
        reviews: []
    },
    {
        id: 'f7',
        ownerId: 'u2',
        name: 'Savanna Blooms',
        location: 'Naivasha, Kenya',
        region: 'Africa',
        description: 'A leading grower of fair-trade roses and other flowers, using geothermal energy and sustainable water practices. Our flowers are exported globally.',
        tags: ['flowers', 'roses', 'fair-trade', 'sustainable'],
        rating: 4.6,
        contact: 'sales@savannablooms.com',
        website: 'https://savannablooms.com',
        images: ['https://picsum.photos/seed/farm7/800/600', 'https://picsum.photos/seed/farm7a/800/600'],
        reviews: []
    },
    {
        id: 'f8',
        ownerId: 'u2',
        name: 'Tuscan Sun Vineyards',
        location: 'Florence, Italy',
        region: 'Europe',
        description: 'Historic vineyard in the heart of Tuscany producing world-class Chianti. Join us for wine tasting tours and cooking classes.',
        tags: ['wine', 'vineyard', 'tours', 'organic'],
        rating: 4.8,
        contact: 'ciao@tuscansun.it',
        website: 'https://tuscansun.it',
        images: ['https://picsum.photos/seed/farm8/800/600', 'https://picsum.photos/seed/farm8a/800/600'],
        reviews: []
    },
];

const sampleJobs: Job[] = [
    {
        id: 'j1',
        farmId: 'f1',
        title: 'Organic Farm Hand',
        type: 'full-time',
        description: 'Seeking a dedicated individual to assist with all aspects of our organic vegetable farm, including planting, weeding, harvesting, and packing. Must be physically fit and passionate about sustainable agriculture.',
        requirements: ['Previous farming experience preferred', 'Ability to lift 50 lbs', 'Works well in a team', 'Early morning availability'],
        salary: '$18 - $22/hour',
        posted: new Date('2023-11-01T09:00:00Z').toISOString(),
        applications: ['u3']
    },
    {
        id: 'j2',
        farmId: 'f2',
        title: 'Dairy Production Assistant',
        type: 'part-time',
        description: 'Part-time position available to help with our cheese and yogurt production. Duties include assisting the cheesemaker, packaging products, and maintaining a clean production environment.',
        requirements: ['Experience in food handling/production', 'High attention to detail', 'Knowledge of sanitation standards', 'Weekend availability'],
        salary: '$20/hour',
        posted: new Date('2023-10-28T12:00:00Z').toISOString(),
        applications: []
    }
];

export const sampleData: AppData = {
    users: sampleUsers,
    farms: sampleFarms,
    jobs: sampleJobs,
    currentUser: null
};

export const ALL_TAGS = Array.from(new Set(sampleFarms.flatMap(f => f.tags))).sort();
export const ALL_REGIONS = Array.from(new Set(sampleFarms.map(f => f.region))).sort();
export const REGIONAL_ZONES = ['Africa', 'Asia', 'Central America', 'Eurasia', 'Europe', 'North America', 'South America', 'The Middle East', 'The Pacific'].sort();