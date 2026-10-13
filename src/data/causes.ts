import { CauseItem } from '../types';

export const CAUSES_DATA: CauseItem[] = [
  {
    id: 'parental-care',
    title: 'Children Without Parental Care',
    tagline: 'Safe, loving family-based environments for every child',
    shortDescription:
      'Every child deserves a safe, caring environment. Support qualified organizations providing family-based care, protection, and essential support to children who have lost parental care or are at risk of losing it.',
    fullDescription:
      'Children thrive best when nurtured within stable families and supportive communities. When parental care is disrupted by extreme poverty, illness, or conflict, our priority is family strengthening and kinship preservation. Where biological reunification is not possible, we advocate for verified foster families and protective family-like community alternatives, working strictly against unregulated institutionalization.',
    image: '/src/assets/images/cause_parental_care_1791836318817.jpg',
    imageAlt: 'Caregiver reading a storybook with young children in a comfortable family living room',
    whyItMatters: [
      'Early childhood bonding within family settings is critical for cognitive, emotional, and social development.',
      'Prolonged institutional confinement has well-documented detrimental effects on developmental milestones and long-term autonomy.',
      'Preventative family support costs less and creates lasting resilience compared to reactionary emergency placement.',
      'Every child has a universal right under the UN Convention on the Rights of the Child to grow up in a safe, caring family environment.'
    ],
    typesOfAssistance: [
      'Kinship care support grants for grandparents and extended relatives raising orphaned children.',
      'Family preservation kits providing emergency supplies to families at risk of separation.',
      'Psychosocial counseling and specialized trauma therapy delivered by certified child psychologists.',
      'Legal documentation assistance ensuring children receive birth certificates and formal protection status.'
    ],
    responsibleDelivery: [
      'Strict adherence to the UN Guidelines for the Alternative Care of Children.',
      'Zero support for unregistered orphanages or commercial "orphanage tourism".',
      'Regular monitored home visits by certified social workers.',
      'Community-led child protection committees that monitor child welfare without stigma.'
    ],
    partnerRole:
      'HOPEBRIDGE coordinates exclusively with licensed child welfare organizations, accredited foster care networks, and certified local social service departments with documented safeguarding audits.',
    stagedCampaignIds: ['camp-family-foster', 'camp-kinship-support']
  },
  {
    id: 'nutrition',
    title: 'Food and Nutrition',
    tagline: 'Nourishing meals that fuel health, learning, and growth',
    shortDescription:
      'Help improve access to nutritious food and essential nutrition support for children and families experiencing food insecurity.',
    fullDescription:
      'Nutritious food is the bedrock of physical resilience, immune defense, and academic focus. Acute and chronic malnutrition in early childhood can cause irreversible physical and neurological stunting. HOPEBRIDGE focuses on community-rooted meal programs, maternal infant dietary support, and local agricultural sourcing that feed children while uplifting local smallholder farmers.',
    image: '/src/assets/images/cause_nutrition_meals_1791836339795.jpg',
    imageAlt: 'Wholesome nutritious meal trays with fresh vegetables and warm soup served to children in a community dining space',
    whyItMatters: [
      'The first 1,000 days of life define brain development, immune architecture, and lifelong learning capability.',
      'School-based meal programs directly increase student attendance rates, particularly for young girls.',
      'Nutrient-dense diets protect against preventable childhood illnesses like anemia, diarrhea, and infections.',
      'Community-sourced food programs stimulate rural markets and reinforce food sovereignty.'
    ],
    typesOfAssistance: [
      'Daily balanced hot lunches prepared in hygienic school and community kitchens.',
      'Therapeutic feeding packs (RUTF) for children diagnosed with moderate acute malnutrition.',
      'Micronutrient supplementation (vitamin A, iron, zinc, folic acid) for mothers and toddlers.',
      'Family staple dry food parcels during seasonal lean periods and agricultural droughts.'
    ],
    responsibleDelivery: [
      'Menus designed by certified pediatric nutritionists adhering to WHO dietary standards.',
      'Food procurement prioritized from local women-led farmer cooperatives to avoid market disruption.',
      'Regular anthropometric height-for-age and weight-for-height tracking by community health nurses.',
      'Hygiene education integrated with meal distribution to prevent waterborne contamination.'
    ],
    partnerRole:
      'HOPEBRIDGE partners with qualified community food banks, verified school feeding federations, and regional health clinics to ensure equitable, dignified food access.',
    stagedCampaignIds: ['camp-school-lunch', 'camp-nutrition-recovery']
  },
  {
    id: 'shelter',
    title: 'Safe Shelter',
    tagline: 'Secure, dignified living spaces during crisis and displacement',
    shortDescription:
      'Help vulnerable children and families access safe accommodation and essential support during emergencies and periods of hardship.',
    fullDescription:
      'Without safe shelter, children face heightened risks of severe weather exposure, physical danger, respiratory illness, and sexual exploitation. Whether displaced by sudden climate emergencies, natural disasters, or family crisis, children require dry, secure, and dignified living quarters where their fundamental right to privacy and safety is guaranteed.',
    image: '/src/assets/images/cause_safe_shelter_1791836367830.jpg',
    imageAlt: 'Children playing safely in a clean, brightly lit community family living center with caregivers nearby',
    whyItMatters: [
      'Physical security is an essential prerequisite for psychological stability and peaceful sleep.',
      'Substandard shelter causes recurrent respiratory infections, vector-borne illnesses, and sleep deprivation.',
      'Safe, monitored living environments drastically reduce child exposure to trafficking and domestic violence.',
      'Stabilized housing enables consistent school attendance and parental economic reintegration.'
    ],
    typesOfAssistance: [
      'Emergency weatherproof shelter kits including reinforced tarpaulins, insulation, and repair tools.',
      'Transitional housing rent subsidies for displaced families with young children.',
      'Child-friendly safe spaces within community transit shelters equipped with quiet study and play corners.',
      'Essential household restoration packs (warm blankets, sleeping mats, solar lanterns, cooking sets).'
    ],
    responsibleDelivery: [
      'Child safeguarding design standards: adequate lighting, private partitions, and separated facilities.',
      'Direct coordination with local municipal housing boards to avoid secondary displacement.',
      'Culturally appropriate shelter materials that withstand seasonal weather extremes.',
      'Independent protection inspections to ensure zero harassment or extortion in temporary accommodations.'
    ],
    partnerRole:
      'We work alongside certified humanitarian shelter agencies, municipal housing assistance charities, and grassroots disaster recovery teams committed to child protection.',
    stagedCampaignIds: ['camp-winter-warmth', 'camp-transitional-home']
  },
  {
    id: 'education',
    title: 'Education',
    tagline: 'Unlocking potential through learning materials and open classrooms',
    shortDescription:
      'Help children access education through school supplies, learning materials, educational support, and opportunities to continue learning.',
    fullDescription:
      'Education is the most powerful catalyst for breaking cycles of intergenerational hardship. Millions of children are barred from classrooms not by lack of ambition, but by the prohibitive costs of basic uniforms, textbooks, registration fees, or lack of accessible facilities. HOPEBRIDGE removes these friction points so that every child can sit in an enriching classroom and learn with dignity.',
    image: '/src/assets/images/cause_education_supplies_1791836379471.jpg',
    imageAlt: 'School children smiling as they receive sturdy backpacks and new textbooks in a learning pavilion',
    whyItMatters: [
      'Each additional year of basic primary schooling increases a child’s future lifetime earning potential by up to 10%.',
      'Literacy and numeracy provide the tools needed to navigate modern society, health information, and civic life.',
      'Schools serve as vital community safety nets, providing peer interaction, protection, and emotional structure.',
      'Educated girls marry later, have healthier families, and reinvest the majority of their income back into their communities.'
    ],
    typesOfAssistance: [
      'Back-to-school kits containing sturdy backpacks, lined exercise books, pens, rulers, and geometric sets.',
      'Primary school textbook distribution aligned with official national educational curriculums.',
      'Classroom furniture (durable desks, benches, chalkboards, and reading libraries).',
      'Community remedial tutoring programs for children who missed school due to displacement or economic pressure.'
    ],
    responsibleDelivery: [
      'Supplies procured from local regional stationers and vendors to stimulate economic development.',
      'Gender-equitable distribution ensuring girls and boys have equal access to essential STEM and reading materials.',
      'Active collaboration with headteachers and parent-teacher associations to monitor student retention.',
      'Respectful distribution processes that preserve student dignity and avoid commercial branding.'
    ],
    partnerRole:
      'HOPEBRIDGE partners with verified primary school administrations, non-formal community learning centers, and registered educational non-profits operating with authorized curricula.',
    stagedCampaignIds: ['camp-classroom-books', 'camp-stem-girls']
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    tagline: 'Timely medical treatment, preventative checks, and pediatric wellness',
    shortDescription:
      'Support access to appropriate healthcare, preventive services, and essential medical assistance through qualified healthcare providers.',
    fullDescription:
      'Treatable conditions such as pneumonia, malaria, intestinal parasites, and dental infections should never cost a child their future. In underprivileged regions, basic medical visits are often deferred until acute emergencies arise. HOPEBRIDGE supports preventative pediatric screenings, subsidized medications, routine immunizations, and specialized referrals managed by licensed clinicians.',
    image: '/src/assets/images/cause_healthcare_doctor_1791836389834.jpg',
    imageAlt: 'Pediatrician gently performing a routine stethoscope checkup on a young girl with her mother in a clean clinic',
    whyItMatters: [
      'Preventative care catches developmental delays, vision impairments, and chronic illnesses early when treatment is most effective.',
      'Immunization shields entire communities from life-threatening communicable disease outbreaks.',
      'Maternal and pediatric checkups reduce infant mortality and postpartum complications significantly.',
      'Healthy children miss far fewer school days and participate actively in community life.'
    ],
    typesOfAssistance: [
      'Routine school-based health and vision screenings by certified nurses and optometrists.',
      'Pediatric medicine subsidies covering essential antibiotics, oral rehydration salts, and deworming treatments.',
      'Specialized care transportation funds for families traveling to regional pediatric surgical centers.',
      'Child mental health counseling and developmental occupational support.'
    ],
    responsibleDelivery: [
      'Strict clinical protocols: all care is provided exclusively by certified medical doctors and registered nurses.',
      'Zero delivery of unprescribed or expired medications; all pharmaceuticals adhere to national regulatory standards.',
      'Confidential patient record keeping with complete adherence to pediatric medical privacy.',
      'Integrated preventative hygiene and maternal health counseling during every clinic engagement.'
    ],
    partnerRole:
      'HOPEBRIDGE coordinates directly with licensed district hospitals, accredited charitable pediatric clinics, and registered mobile medical teams.',
    stagedCampaignIds: ['camp-pediatric-screening', 'camp-vision-glasses']
  },
  {
    id: 'clean-water',
    title: 'Clean Water and Sanitation',
    tagline: 'Safe drinking water, hygienic school taps, and dignified sanitation',
    shortDescription:
      'Help communities improve access to safe drinking water, hygiene resources, and appropriate sanitation facilities.',
    fullDescription:
      'Waterborne bacteria and contaminated drinking sources are among the leading causes of preventable child mortality worldwide. Furthermore, children—particularly young girls—often walk hours each day carrying heavy water jugs rather than attending school. HOPEBRIDGE invests in reliable community water points, school handwashing stations, and dignified latrine facilities.',
    image: '/src/assets/images/cause_clean_water_1791836329388.jpg',
    imageAlt: 'Joyful children washing hands at a fresh clean water pump in a village community',
    whyItMatters: [
      'Clean water reduces diarrheal diseases and parasitic infections among school children by over 40%.',
      'Placing safe water sources near schools and villages restores hours previously lost to daily water trekking.',
      'Dignified private sanitation facilities at schools dramatically improve adolescent girls’ school retention.',
      'Reliable water access is indispensable for food preparation, school hygiene, and healthcare clinic safety.'
    ],
    typesOfAssistance: [
      'Construction and rehabilitation of deep boreholes, solar-powered pumps, and gravity-fed piping networks.',
      'School-based rainwater harvesting systems with multi-stage ceramic filtration units.',
      'Gender-segregated ventilated improved pit latrines and private handwashing stations at schools.',
      'Community WASH (Water, Sanitation, and Hygiene) training workshops led by local facilitators.'
    ],
    responsibleDelivery: [
      'Rigorous water quality testing: chemical and bacteriological purity certified before commissioning any well.',
      'Formation and training of local community water management committees to ensure 10-year mechanical maintenance.',
      'Child-friendly pump mechanics and tap heights accessible to young children and children with disabilities.',
      'Environmentally sustainable groundwater extraction verified by regional hydrologists.'
    ],
    partnerRole:
      'HOPEBRIDGE partners with verified water engineering NGOs, local water user associations, and district sanitation authorities.',
    stagedCampaignIds: ['camp-village-well', 'camp-school-wash']
  }
];
