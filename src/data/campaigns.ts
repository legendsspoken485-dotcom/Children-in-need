import { CampaignItem } from '../types';

export const DEMO_CAMPAIGNS: CampaignItem[] = [
  {
    id: 'camp-classroom-books',
    title: 'Primary School Learning Supplies & Literacy Packs',
    causeId: 'education',
    causeName: 'Education',
    region: 'East Africa',
    country: 'Kenya',
    description:
      'Providing durable backpacks, core textbooks, stationery kits, and classroom reading materials to 350 primary school learners in rural semi-arid communities.',
    detailedNeed:
      'Children in the participating primary schools frequently share single textbooks among four or five classmates. This staged campaign models the procurement of individual textbook sets, exercise books, pencils, and teacher instructional guides from accredited regional publishers.',
    image: '/src/assets/images/cause_education_supplies_1791836379471.jpg',
    imageAlt: 'Primary school children receiving notebooks and backpacks in an open pavilion',
    targetAmount: 8500,
    raisedAmount: 5200,
    donorCount: 42,
    status: 'community-pilot',
    isDemonstrationData: true
  },
  {
    id: 'camp-school-lunch',
    title: 'School Nutrition & Daily Balanced Meals Pilot',
    causeId: 'nutrition',
    causeName: 'Food and Nutrition',
    region: 'South Asia',
    country: 'Nepal',
    description:
      'Supplying high-protein legumes, fresh vegetables, fortified grains, and cooking fuel for hot daily school lunches across three mountainous community schools.',
    detailedNeed:
      'Seasonal food insecurity during early spring impacts student attendance and classroom focus. This staged pilot models community-managed school kitchens procuring grains directly from local agricultural collectives.',
    image: '/src/assets/images/cause_nutrition_meals_1791836339795.jpg',
    imageAlt: 'Fresh nutritious meals and fruits prepared for children in a community dining room',
    targetAmount: 12000,
    raisedAmount: 8400,
    donorCount: 68,
    status: 'active-preparation',
    isDemonstrationData: true
  },
  {
    id: 'camp-village-well',
    title: 'Solar Borehole & Safe Drinking Water Point',
    causeId: 'clean-water',
    causeName: 'Clean Water and Sanitation',
    region: 'Sub-Saharan Africa',
    country: 'Malawi',
    description:
      'Engineering a solar-powered deep borehole pump, elevated storage tank, and community tap stands serving two primary schools and 600 village households.',
    detailedNeed:
      'Students previously walked up to 3 kilometers multiple times daily to fetch turbid river water. This model initiative covers hydrological surveying, hydro-testing, ceramic purification units, and local technician maintenance training.',
    image: '/src/assets/images/cause_clean_water_1791836329388.jpg',
    imageAlt: 'Smiling children washing hands at a fresh water pump',
    targetAmount: 18500,
    raisedAmount: 14200,
    donorCount: 94,
    status: 'community-pilot',
    isDemonstrationData: true
  },
  {
    id: 'camp-family-foster',
    title: 'Kinship Care & Family Preservation Grants',
    causeId: 'parental-care',
    causeName: 'Children Without Parental Care',
    region: 'Eastern Europe',
    country: 'Moldova',
    description:
      'Providing small monthly caregiver stipends, home heating subsidies, and casework support to grandmothers and kinship guardians raising orphaned children.',
    detailedNeed:
      'Preventing unnecessary institutional placement by supporting kinship caregivers through cold winter months with food staples, utility assistance, and ongoing visits from licensed social workers.',
    image: '/src/assets/images/cause_parental_care_1791836318817.jpg',
    imageAlt: 'Kinship caregiver reading a book with children in a warm family room',
    targetAmount: 9500,
    raisedAmount: 6100,
    donorCount: 51,
    status: 'active-preparation',
    isDemonstrationData: true
  },
  {
    id: 'camp-pediatric-screening',
    title: 'Mobile Pediatric Health & Preventive Screening Clinic',
    causeId: 'healthcare',
    causeName: 'Healthcare',
    region: 'Central America',
    country: 'Guatemala',
    description:
      'Deploying a mobile clinical health van staffed by licensed pediatric nurses to conduct growth monitoring, vision screenings, and routine pediatric dental checks.',
    detailedNeed:
      'Early diagnosis of treatable vision and hearing deficiencies before they impede school performance. This staged program models essential diagnostics, basic medications, and referral transport funds.',
    image: '/src/assets/images/cause_healthcare_doctor_1791836389834.jpg',
    imageAlt: 'Pediatric clinician examining a young child in a clinic with family',
    targetAmount: 15000,
    raisedAmount: 15000,
    donorCount: 110,
    status: 'fully-funded-staged',
    isDemonstrationData: true
  },
  {
    id: 'camp-winter-warmth',
    title: 'Emergency Shelter Thermal Winterization Packs',
    causeId: 'shelter',
    causeName: 'Safe Shelter',
    region: 'Middle East',
    country: 'Jordan',
    description:
      'Supplying high-thermal fleece blankets, weatherized foam floor insulation, and clean heating stoves to families with infants residing in transitional housing.',
    detailedNeed:
      'Freezing seasonal drafts cause recurrent acute respiratory infections in infants. This prototype initiative models emergency weatherproofing and child safety barriers for vulnerable family accommodations.',
    image: '/src/assets/images/cause_safe_shelter_1791836367830.jpg',
    imageAlt: 'Children playing safely in clean, insulated transitional living quarters',
    targetAmount: 11200,
    raisedAmount: 7800,
    donorCount: 59,
    status: 'active-preparation',
    isDemonstrationData: true
  }
];
