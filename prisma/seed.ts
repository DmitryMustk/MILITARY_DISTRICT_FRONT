import {
  $Enums,
  ArtistTitle,
  ArtTheme,
  Country,
  Gender,
  Industry,
  LegalStatus,
  OpportunityType,
  OpportunityVisibility,
  PrismaClient,
  ResidencyOffering,
} from '@prisma/client';

const prisma = new PrismaClient();

const env = process.env.NODE_ENV || 'development';

async function main() {
  if (env === 'production') {
    // Seed Users
    const users = [
      {
        username: 'admin',
        password: '$2a$10$Mr/ME6TmGbZuva.KMEM56uJ3xypS8yfhLLpKC7ovEh34foabR1Xia',
        role: [$Enums.Role.ADMINISTRATOR],
      },
    ];

    await prisma.user.createMany({ data: users });
    return;
  }

  // Seed Providers
  const providers = [
    {
      organizationName: 'Creative Arts Foundation',
      representativeName: 'John Doe',
      website: 'https://www.creativeartsfoundation.org',
      information: 'Supporting emerging artists through grants and residencies.',
      phone: '+1 (555) 123-4567',
    },
    {
      organizationName: 'Tech & Arts Collaborative',
      representativeName: 'Jane Smith',
      website: 'https://www.techartscollab.com',
      information: 'Bridging technology and arts through innovative funding programs.',
      phone: '+1 (555) 987-6543',
    },
    {
      organizationName: 'E Corp',
      representativeName: 'John Smith',
      website: 'https://www.e.com',
      information: 'We are the future',
      phone: '+1 (500) 100-2222',
    },
  ];

  const providersEmails = ['john.doe@creativeartsfoundation.org', 'jane.smith@techartscollab.com', 'john.smith@e.com'];

  // we cannot use createMany here, because it does not support nested creates
  for (let i = 0; i < providers.length; ++i) {
    await prisma.user.create({
      data: {
        username: `provider${i + 1}`,
        password: '$2a$12$ByB7gkqNHjKwPoSDW9rL0ud9NZUaiyp65cuwKqeP96luWnhGRbeju',
        role: [$Enums.Role.PROVIDER],
        email: providersEmails[i],
        provider: {
          create: providers[i],
        },
      },
    });
  }

  // Seed Opportunities
  const opportunities = [
    {
      title: 'Artist Residency Program',
      providerId: 1,
      type: OpportunityType.residency,
      minResidencyTime: 12,
      maxResidencyTime: 12,
      description:
        'A 3-month residency program for visual artists to explore new techniques and create a body of work.',
      industry: [Industry.visual_arts_and_crafts],
      applicationDeadline: new Date('2025-08-31'),
      visibility: OpportunityVisibility.all,
    },
    {
      title: 'Digital Art Innovation Fund',
      providerId: 2,
      type: OpportunityType.grant,
      minGrantAmount: 7500,
      description:
        'Funding for artists exploring the intersection of technology and art, with a focus on interactive and immersive experiences.',
      applicationDeadline: new Date('2025-09-30'),
      visibility: OpportunityVisibility.all,
    },
    {
      title: 'Amount is not stated',
      providerId: 2,
      type: OpportunityType.grant,
      description: 'This opportunity has no specified amount limits',
      applicationDeadline: new Date('2025-09-30'),
      visibility: OpportunityVisibility.all,
    },
    {
      title: 'Old Outdated Program',
      providerId: 1,
      type: OpportunityType.other,
      description: 'Deadline passed long time ago.',
      applicationDeadline: new Date('1970-01-01'),
      visibility: OpportunityVisibility.all,
    },
    {
      title: 'Program by invitation only',
      providerId: 1,
      type: OpportunityType.other,
      description: 'Available by invitation only',
      applicationDeadline: new Date('2025-02-28'),
      responseDeadline: new Date('2025-02-28'),
      visibility: OpportunityVisibility.invited,
    },
    {
      title: 'With great power comes great responsibility',
      providerId: 3,
      type: OpportunityType.grant,
      minGrantAmount: 500000,
      maxGrantAmount: 100000000,
      description: 'Could you overcome the power of the fortune?',
      legalStatus: [LegalStatus.individual],
      gender: [Gender.male],
      applicationDeadline: new Date('2025-12-31'),
      responseDeadline: new Date('2026-01-01'),
      visibility: OpportunityVisibility.all,
    },
    {
      title: 'Expedition to nowhere',
      providerId: 3,
      type: OpportunityType.residency,
      minResidencyTime: 1565,
      maxResidencyTime: 3130,
      residencyOffering: [
        ResidencyOffering.accommodation,
        ResidencyOffering.transportation,
        ResidencyOffering.workspace,
        ResidencyOffering.allowance,
      ],
      residencyOfferingDescription: 'Return transportation is not included',
      description: 'Use all the abilities to explore the Universe and find the way home',
      countryCitizenship: [Country.India, Country.China],
      countryResidence: [Country.Antarctica],
      applicationDeadline: new Date('2025-12-31'),
      responseDeadline: new Date('2026-01-01'),
      visibility: OpportunityVisibility.all,
    },
    {
      title: 'Internal systems of E Corp',
      providerId: 3,
      type: OpportunityType.award,
      awardSpecialAccess: 'All the data and computing power of mankind',
      description:
        'Try to create your own artificial world model. The best one will grant access to all the databases and subsystems for further integration',
      industry: [Industry.design_and_creative_services],
      theme: [ArtTheme.innovation],
      countryResidence: [Country.United_States],
      applicationDeadline: new Date('2025-12-31'),
      responseDeadline: new Date('2026-01-01'),
      visibility: OpportunityVisibility.all,
    },
    {
      title: 'Move around the city by copter',
      providerId: 3,
      type: OpportunityType.mobility,
      description: 'You have to do nothing. Apply and our systems will choose the luckiest ones',
      legalStatus: [LegalStatus.individual],
      applicationDeadline: new Date('2025-12-31'),
      responseDeadline: new Date('2026-01-01'),
      visibility: OpportunityVisibility.all,
    },
    {
      title: 'Rebranding for our company',
      providerId: 3,
      type: OpportunityType.commission,
      description:
        'The current name, logo and representation of our corporation are obsolete. We look for teams that can completely change the situation',
      legalStatus: [LegalStatus.collective, LegalStatus.organization],
      industry: [Industry.audiovisual_and_interactive_media, Industry.books_and_press],
      applicationDeadline: new Date('2025-12-31'),
      responseDeadline: new Date('2026-01-01'),
      visibility: OpportunityVisibility.all,
    },
    {
      title: 'Beekeeping',
      providerId: 3,
      type: OpportunityType.other,
      description: 'Institute of Beekeeping is looking for young and keen specialists',
      industry: [Industry.audiovisual_and_interactive_media],
      applicationDeadline: new Date('2025-12-31'),
      responseDeadline: new Date('2026-01-01'),
      visibility: OpportunityVisibility.all,
    },
    {
      title: 'International Artist Residency Program',
      providerId: 1,
      type: OpportunityType.residency,
      minResidencyTime: 12,
      maxResidencyTime: 12,
      description: `
    The International Artist Residency Program offers a unique 12-week immersive experience for visual artists seeking to expand their creative practice. 
    Located in a historic arts district, the program provides private studio space (30-50 sqm), accommodation, and access to specialized facilities including 
    printmaking studios, wood/metal workshops, and digital media labs. Residents will receive a $2,000 material stipend and opportunities to participate in 
    monthly critique sessions with renowned curators. The program culminates in a group exhibition at a prominent local gallery, with catalog production included.
    
    Ideal candidates are mid-career artists working in painting, sculpture, installation, or mixed media who are ready to push boundaries in their practice.
  `,
      industry: [Industry.visual_arts_and_crafts],
      applicationDeadline: new Date('2025-08-31'),
      visibility: OpportunityVisibility.all,
    },
  ];

  await prisma.opportunity.createMany({ data: opportunities });

  // Seed Artists
  const artists = [
    {
      firstName: 'Jane',
      lastName: 'Doe',
      bio: 'Jane Doe is a contemporary artist known for her vibrant abstract paintings and innovative digital art installations.',
      phone: '+1 (555) 123-4567',
      languages: [$Enums.Languages.English, $Enums.Languages.French],
      active: true,
      industry: [Industry.visual_arts_and_crafts],
      title: ArtistTitle.Artist,
      countryResidence: Country.Armenia,
      countryCitizenship: Country.Armenia,
      birthDay: new Date(98, 5, 3),
      theme: ['Education'],
      statement: 'Education should be beautiful',
      moderationStatus: $Enums.ModerationStatus.Approved,
      moderationComment: '',
    },
    {
      firstName: 'John',
      lastName: 'Smith',
      bio: 'John Smith is a sculptor and installation artist, renowned for his large-scale public art projects.',
      phone: '+1 (555) 987-6543',
      languages: [$Enums.Languages.English, $Enums.Languages.German],
      active: false,
      industry: [Industry.cultural_and_natural_heritage],
      title: ArtistTitle.Curator,
      countryResidence: Country.Australia,
      countryCitizenship: Country.United_States,
      birthDay: new Date(99, 5, 6),
      theme: ['Ecology'],
      statement: 'I want to create',
      moderationStatus: $Enums.ModerationStatus.Approved,
      moderationComment: '',
    },
    {
      firstName: 'Maria',
      lastName: 'Garcia',
      bio: 'Maria Garcia is an emerging digital artist and animator, blending traditional illustration with cutting-edge digital tools.',
      phone: '+1 (555) 246-8135',
      languages: [$Enums.Languages.English, $Enums.Languages.Portuguese],
      active: true,
      industry: [Industry.design_and_creative_services],
      title: ArtistTitle.CulturalProducer,
      countryResidence: Country.Finland,
      countryCitizenship: Country.United_States,
      birthDay: new Date(95, 0, 3),
      theme: ['Youth'],
      statement: 'I want to create',
      moderationStatus: $Enums.ModerationStatus.Approved,
      moderationComment: '',
    },
    {
      firstName: 'Polyglot',
      lastName: 'Artist',
      bio: 'An artist who speaks all languages and works across all mediums.',
      phone: '+1 (555) 111-1111',
      languages: Object.values($Enums.Languages),
      active: true,
      industry: Object.values($Enums.Industry),
      title: ArtistTitle.Artist,
      countryResidence: Country.Abkhazia,
      countryCitizenship: Country.France,
      birthDay: new Date(1980, 0, 1),
      theme: Object.values($Enums.ArtTheme),
      statement: 'I communicate through all possible means',
      moderationStatus: $Enums.ModerationStatus.Approved,
      moderationComment: 'Extremely versatile artist',
      links: ['https://polyglot.com', 'https://art.com/polyglot', 'https://social.com/polyglot'],
    },
    // Minimal artist with only required fields
    {
      firstName: 'Minimal',
      lastName: 'Artist',
      active: true,
      title: ArtistTitle.Artist,
      countryResidence: Country.Japan,
      countryCitizenship: Country.Japan,
      birthDay: new Date(1990, 5, 15),
      languages: [],
      statement: 'Less is more',
      moderationStatus: $Enums.ModerationStatus.Approved,
      moderationComment: 'Just cool artist',
    },
    // Artist with no languages specified
    {
      firstName: 'Silent',
      lastName: 'Creator',
      bio: 'An artist who prefers to communicate through art alone',
      phone: '+1 (555) 222-2222',
      active: true,
      industry: [$Enums.Industry.visual_arts_and_crafts],
      title: ArtistTitle.Artist,
      countryResidence: Country.Abkhazia,
      countryCitizenship: Country.British_Indian_Ocean_Territory,
      birthDay: new Date(1975, 10, 20),
      theme: [],
      statement: 'My art speaks for itself',
      moderationStatus: $Enums.ModerationStatus.Approved,
      moderationComment: 'Approved but needs language update',
    },
    // Artist with multiple industries
    {
      firstName: 'Multi',
      lastName: 'Disciplinary',
      bio: 'Works across multiple creative disciplines',
      phone: '+1 (555) 333-3333',
      languages: [$Enums.Languages.English, $Enums.Languages.Spanish],
      active: true,
      industry: Object.values(Industry),
      title: ArtistTitle.Artist,
      countryResidence: Country.Germany,
      countryCitizenship: Country.Spain,
      birthDay: new Date(1985, 7, 12),
      theme: [$Enums.ArtTheme.technology, $Enums.ArtTheme.innovation],
      statement: 'Bridging gaps between disciplines',
      moderationStatus: $Enums.ModerationStatus.Approved,
      moderationComment: 'Strong multidisciplinary approach',
    },
    // Artist with empty fields
    {
      languages: [],
      active: true,
      industry: [],
      title: ArtistTitle.Artist,
      countryResidence: Country.Japan,
      countryCitizenship: Country.Japan,
      birthDay: new Date(1995, 2, 28),
      theme: [],
      statement: '',
      moderationStatus: $Enums.ModerationStatus.Approved,
      moderationComment: 'Incomplete profile information but ok',
    },
    // Cultural Producer
    {
      artistName: 'Creative Collective XYZ',
      bio: 'A group of artists working together to create innovative installations',
      phone: '+1 (555) 444-4444',
      languages: [$Enums.Languages.English, $Enums.Languages.French, $Enums.Languages.German],
      active: true,
      industry: [$Enums.Industry.visual_arts_and_crafts, $Enums.Industry.cultural_and_natural_heritage],
      title: ArtistTitle.CulturalProducer,
      countryResidence: Country.France,
      countryCitizenship: Country.France,
      birthDay: new Date(2000, 0, 1), // Using founding date
      theme: [$Enums.ArtTheme.social_justice_and_inclusion, $Enums.ArtTheme.ecology],
      statement: 'Creating art for social change',
      moderationStatus: $Enums.ModerationStatus.Approved,
      moderationComment: 'Verified collective',
      links: ['https://creativecollective.xyz', 'https://instagram.com/creativecollective'],
    },
    {
      firstName: 'Hyper',
      lastName: 'Linked',
      artistName: 'Link Master',
      bio: 'Digital artist specializing in web-based art and interactive installations. All my work exists at the intersection of art and technology.',
      phone: '+1 (555) 999-9999',
      languages: [$Enums.Languages.English, $Enums.Languages.Japanese, $Enums.Languages.Spanish],
      active: true,
      industry: [
        $Enums.Industry.audiovisual_and_interactive_media,
        $Enums.Industry.design_and_creative_services,
        $Enums.Industry.visual_arts_and_crafts,
      ],
      title: ArtistTitle.Artist,
      countryResidence: Country.United_States,
      countryCitizenship: Country.United_States,
      birthDay: new Date(1990, 6, 15),
      theme: [$Enums.ArtTheme.technology, $Enums.ArtTheme.innovation, $Enums.ArtTheme.social_justice_and_inclusion],
      statement: 'My art lives on the internet. Follow the links to explore my digital universe.',
      moderationStatus: $Enums.ModerationStatus.Approved,
      moderationComment: 'Verified all links are working',
      links: [
        // Portfolio websites
        'https://hyperlinked.art',
        'https://hyperlinked.digital',
        'https://linkmaster-creative.com',

        // Social media
        'https://instagram.com/hyperlinked',
        'https://twitter.com/hyperlinked',
        'https://facebook.com/hyperlinked.artist',
        'https://tiktok.com/@hyperlinked',
        'https://www.linkedin.com/in/hyperlinked/',
        'https://www.pinterest.com/hyperlinked/',

        // Art platforms
        'https://www.artstation.com/hyperlinked',
        'https://www.behance.net/hyperlinked',
        'https://dribbble.com/hyperlinked',
        'https://www.deviantart.com/hyperlinked',

        // Video channels
        'https://www.youtube.com/hyperlinked',
        'https://vimeo.com/hyperlinked',

        // Stores and marketplaces
        'https://hyperlinked.redbubble.com',
        'https://www.etsy.com/shop/hyperlinked',
        'https://www.saatchiart.com/hyperlinked',

        // Blog and writing
        'https://medium.com/@hyperlinked',
        'https://hyperlinked.substack.com',

        // Code repositories
        'https://github.com/hyperlinked',
        'https://gitlab.com/hyperlinked',

        // Web3 and blockchain
        'https://foundation.app/@hyperlinked',
        'https://opensea.io/hyperlinked',
        'https://rarible.com/hyperlinked',

        // Audio platforms
        'https://soundcloud.com/hyperlinked',
        'https://hyperlinked.bandcamp.com',

        // Other creative profiles
        'https://www.kickstarter.com/profile/hyperlinked',
        'https://www.patreon.com/hyperlinked',

        // Experimental and web art
        'https://hyperlinked.newart.city',
        'https://www.are.na/hyper-linked',

        // Documentation
        'https://hyperlinked.notion.site',

        // Contact
        'mailto:hyper@linked.art',
        'https://calendly.com/hyperlinked',

        // Legacy systems
        'http://hyperlinked.geocities.com', // Testing HTTP and old TLDs
        'ftp://files.hyperlinked.art', // Testing non-HTTP protocols
        // Portfolio websites
        'https://hyperlinked.art',
        'https://hyperlinked.digital',
        'https://linkmaster-creative.com',

        // Social media
        'https://instagram.com/hyperlinked',
        'https://twitter.com/hyperlinked',
        'https://facebook.com/hyperlinked.artist',
        'https://tiktok.com/@hyperlinked',
        'https://www.linkedin.com/in/hyperlinked/',
        'https://www.pinterest.com/hyperlinked/',

        // Art platforms
        'https://www.artstation.com/hyperlinked',
        'https://www.behance.net/hyperlinked',
        'https://dribbble.com/hyperlinked',
        'https://www.deviantart.com/hyperlinked',

        // Video channels
        'https://www.youtube.com/hyperlinked',
        'https://vimeo.com/hyperlinked',

        // Stores and marketplaces
        'https://hyperlinked.redbubble.com',
        'https://www.etsy.com/shop/hyperlinked',
        'https://www.saatchiart.com/hyperlinked',

        // Blog and writing
        'https://medium.com/@hyperlinked',
        'https://hyperlinked.substack.com',

        // Code repositories
        'https://github.com/hyperlinked',
        'https://gitlab.com/hyperlinked',

        // Web3 and blockchain
        'https://foundation.app/@hyperlinked',
        'https://opensea.io/hyperlinked',
        'https://rarible.com/hyperlinked',

        // Audio platforms
        'https://soundcloud.com/hyperlinked',
        'https://hyperlinked.bandcamp.com',

        // Other creative profiles
        'https://www.kickstarter.com/profile/hyperlinked',
        'https://www.patreon.com/hyperlinked',

        // Experimental and web art
        'https://hyperlinked.newart.city',
        'https://www.are.na/hyper-linked',

        // Documentation
        'https://hyperlinked.notion.site',

        // Contact
        'mailto:hyper@linked.art',
        'https://calendly.com/hyperlinked',

        // Legacy systems
        'http://hyperlinked.geocities.com', // Testing HTTP and old TLDs
        'ftp://files.hyperlinked.art', // Testing non-HTTP protocols
        // Portfolio websites
        'https://hyperlinked.art',
        'https://hyperlinked.digital',
        'https://linkmaster-creative.com',

        // Social media
        'https://instagram.com/hyperlinked',
        'https://twitter.com/hyperlinked',
        'https://facebook.com/hyperlinked.artist',
        'https://tiktok.com/@hyperlinked',
        'https://www.linkedin.com/in/hyperlinked/',
        'https://www.pinterest.com/hyperlinked/',

        // Art platforms
        'https://www.artstation.com/hyperlinked',
        'https://www.behance.net/hyperlinked',
        'https://dribbble.com/hyperlinked',
        'https://www.deviantart.com/hyperlinked',

        // Video channels
        'https://www.youtube.com/hyperlinked',
        'https://vimeo.com/hyperlinked',

        // Stores and marketplaces
        'https://hyperlinked.redbubble.com',
        'https://www.etsy.com/shop/hyperlinked',
        'https://www.saatchiart.com/hyperlinked',

        // Blog and writing
        'https://medium.com/@hyperlinked',
        'https://hyperlinked.substack.com',

        // Code repositories
        'https://github.com/hyperlinked',
        'https://gitlab.com/hyperlinked',

        // Web3 and blockchain
        'https://foundation.app/@hyperlinked',
        'https://opensea.io/hyperlinked',
        'https://rarible.com/hyperlinked',

        // Audio platforms
        'https://soundcloud.com/hyperlinked',
        'https://hyperlinked.bandcamp.com',

        // Other creative profiles
        'https://www.kickstarter.com/profile/hyperlinked',
        'https://www.patreon.com/hyperlinked',

        // Experimental and web art
        'https://hyperlinked.newart.city',
        'https://www.are.na/hyper-linked',

        // Documentation
        'https://hyperlinked.notion.site',

        // Contact
        'mailto:hyper@linked.art',
        'https://calendly.com/hyperlinked',

        // Legacy systems
        'http://hyperlinked.geocities.com', // Testing HTTP and old TLDs
        'ftp://files.hyperlinked.art', // Testing non-HTTP protocols
        // Portfolio websites
        'https://hyperlinked.art',
        'https://hyperlinked.digital',
        'https://linkmaster-creative.com',

        // Social media
        'https://instagram.com/hyperlinked',
        'https://twitter.com/hyperlinked',
        'https://facebook.com/hyperlinked.artist',
        'https://tiktok.com/@hyperlinked',
        'https://www.linkedin.com/in/hyperlinked/',
        'https://www.pinterest.com/hyperlinked/',

        // Art platforms
        'https://www.artstation.com/hyperlinked',
        'https://www.behance.net/hyperlinked',
        'https://dribbble.com/hyperlinked',
        'https://www.deviantart.com/hyperlinked',

        // Video channels
        'https://www.youtube.com/hyperlinked',
        'https://vimeo.com/hyperlinked',

        // Stores and marketplaces
        'https://hyperlinked.redbubble.com',
        'https://www.etsy.com/shop/hyperlinked',
        'https://www.saatchiart.com/hyperlinked',

        // Blog and writing
        'https://medium.com/@hyperlinked',
        'https://hyperlinked.substack.com',

        // Code repositories
        'https://github.com/hyperlinked',
        'https://gitlab.com/hyperlinked',

        // Web3 and blockchain
        'https://foundation.app/@hyperlinked',
        'https://opensea.io/hyperlinked',
        'https://rarible.com/hyperlinked',

        // Audio platforms
        'https://soundcloud.com/hyperlinked',
        'https://hyperlinked.bandcamp.com',

        // Other creative profiles
        'https://www.kickstarter.com/profile/hyperlinked',
        'https://www.patreon.com/hyperlinked',

        // Experimental and web art
        'https://hyperlinked.newart.city',
        'https://www.are.na/hyper-linked',

        // Documentation
        'https://hyperlinked.notion.site',

        // Contact
        'mailto:hyper@linked.art',
        'https://calendly.com/hyperlinked',

        // Legacy systems
        'http://hyperlinked.geocities.com', // Testing HTTP and old TLDs
        'ftp://files.hyperlinked.art', // Testing non-HTTP protocols
        // Portfolio websites
        'https://hyperlinked.art',
        'https://hyperlinked.digital',
        'https://linkmaster-creative.com',

        // Social media
        'https://instagram.com/hyperlinked',
        'https://twitter.com/hyperlinked',
        'https://facebook.com/hyperlinked.artist',
        'https://tiktok.com/@hyperlinked',
        'https://www.linkedin.com/in/hyperlinked/',
        'https://www.pinterest.com/hyperlinked/',

        // Art platforms
        'https://www.artstation.com/hyperlinked',
        'https://www.behance.net/hyperlinked',
        'https://dribbble.com/hyperlinked',
        'https://www.deviantart.com/hyperlinked',

        // Video channels
        'https://www.youtube.com/hyperlinked',
        'https://vimeo.com/hyperlinked',

        // Stores and marketplaces
        'https://hyperlinked.redbubble.com',
        'https://www.etsy.com/shop/hyperlinked',
        'https://www.saatchiart.com/hyperlinked',

        // Blog and writing
        'https://medium.com/@hyperlinked',
        'https://hyperlinked.substack.com',

        // Code repositories
        'https://github.com/hyperlinked',
        'https://gitlab.com/hyperlinked',

        // Web3 and blockchain
        'https://foundation.app/@hyperlinked',
        'https://opensea.io/hyperlinked',
        'https://rarible.com/hyperlinked',

        // Audio platforms
        'https://soundcloud.com/hyperlinked',
        'https://hyperlinked.bandcamp.com',

        // Other creative profiles
        'https://www.kickstarter.com/profile/hyperlinked',
        'https://www.patreon.com/hyperlinked',

        // Experimental and web art
        'https://hyperlinked.newart.city',
        'https://www.are.na/hyper-linked',

        // Documentation
        'https://hyperlinked.notion.site',

        // Contact
        'mailto:hyper@linked.art',
        'https://calendly.com/hyperlinked',

        // Legacy systems
        'http://hyperlinked.geocities.com', // Testing HTTP and old TLDs
        'ftp://files.hyperlinked.art', // Testing non-HTTP protocols
        // Portfolio websites
        'https://hyperlinked.art',
        'https://hyperlinked.digital',
        'https://linkmaster-creative.com',

        // Social media
        'https://instagram.com/hyperlinked',
        'https://twitter.com/hyperlinked',
        'https://facebook.com/hyperlinked.artist',
        'https://tiktok.com/@hyperlinked',
        'https://www.linkedin.com/in/hyperlinked/',
        'https://www.pinterest.com/hyperlinked/',

        // Art platforms
        'https://www.artstation.com/hyperlinked',
        'https://www.behance.net/hyperlinked',
        'https://dribbble.com/hyperlinked',
        'https://www.deviantart.com/hyperlinked',

        // Video channels
        'https://www.youtube.com/hyperlinked',
        'https://vimeo.com/hyperlinked',

        // Stores and marketplaces
        'https://hyperlinked.redbubble.com',
        'https://www.etsy.com/shop/hyperlinked',
        'https://www.saatchiart.com/hyperlinked',

        // Blog and writing
        'https://medium.com/@hyperlinked',
        'https://hyperlinked.substack.com',

        // Code repositories
        'https://github.com/hyperlinked',
        'https://gitlab.com/hyperlinked',

        // Web3 and blockchain
        'https://foundation.app/@hyperlinked',
        'https://opensea.io/hyperlinked',
        'https://rarible.com/hyperlinked',

        // Audio platforms
        'https://soundcloud.com/hyperlinked',
        'https://hyperlinked.bandcamp.com',

        // Other creative profiles
        'https://www.kickstarter.com/profile/hyperlinked',
        'https://www.patreon.com/hyperlinked',

        // Experimental and web art
        'https://hyperlinked.newart.city',
        'https://www.are.na/hyper-linked',

        // Documentation
        'https://hyperlinked.notion.site',

        // Contact
        'mailto:hyper@linked.art',
        'https://calendly.com/hyperlinked',

        // Legacy systems
        'http://hyperlinked.geocities.com', // Testing HTTP and old TLDs
        'ftp://files.hyperlinked.art', // Testing non-HTTP protocols
      ],
    },
    {
      firstName: 'Cassandra',
      lastName: 'Limitless',
      artistName: 'The Boundary Pusher',
      bio: `
Born in a small coastal town where the mist meets the mountains, I've spent my life exploring the intersection of nature and technology through mixed media installations. My work questions the boundaries between organic and synthetic, often incorporating found objects, digital projections, and interactive elements that respond to viewer presence. Trained at the Academy of Experimental Arts and recipient of the International Emerging Artist Award, I've exhibited in 23 countries across 5 continents, with permanent installations in Tokyo, Berlin, and São Paulo.

My creative process begins with extensive field recordings—capturing everything from urban soundscapes to the ultrasonic communications of bats. These auditory experiences are translated into visual patterns through custom algorithms I develop, creating a synesthetic bridge between senses. Recent projects include "Ephemeral Code" (2023), a series of AI-generated tapestries that decay naturally over time, and "Neural Shoreline" (2022), an interactive beach that responds to tidal data with light patterns.

Collaboration is central to my practice. I've worked with marine biologists on coral reef sonification projects, partnered with indigenous weavers to create fiber-optic traditional textiles, and developed educational programs for underprivileged youth in 7 countries. My studio functions as an open laboratory where artists, scientists, and technologists converge to push material boundaries.`,
      statement: `
Born in a small coastal town where the mist meets the mountains, I've spent my life exploring the intersection of nature and technology through mixed media installations. My work questions the boundaries between organic and synthetic, often incorporating found objects, digital projections, and interactive elements that respond to viewer presence. Trained at the Academy of Experimental Arts and recipient of the International Emerging Artist Award, I've exhibited in 23 countries across 5 continents, with permanent installations in Tokyo, Berlin, and São Paulo.

My creative process begins with extensive field recordings—capturing everything from urban soundscapes to the ultrasonic communications of bats. These auditory experiences are translated into visual patterns through custom algorithms I develop, creating a synesthetic bridge between senses. Recent projects include "Ephemeral Code" (2023), a series of AI-generated tapestries that decay naturally over time, and "Neural Shoreline" (2022), an interactive beach that responds to tidal data with light patterns.

Collaboration is central to my practice. I've worked with marine biologists on coral reef sonification projects, partnered with indigenous weavers to create fiber-optic traditional textiles, and developed educational programs for underprivileged youth in 7 countries. My studio functions as an open laboratory where artists, scientists, and technologists converge to push material boundaries.

Current obsessions include: 
- The aesthetics of machine learning errors
- Mycelium-based electronics
- Archeology of future civilizations
- Quantum computing as artistic medium
- Sonic landscapes of melting glaciers.`,
      phone: '+1 (555) 999-9999',
      languages: [
        $Enums.Languages.English,
        $Enums.Languages.Japanese,
        $Enums.Languages.Spanish,
        $Enums.Languages.French,
      ],
      active: true,
      industry: [
        $Enums.Industry.audiovisual_and_interactive_media,
        $Enums.Industry.design_and_creative_services,
        $Enums.Industry.visual_arts_and_crafts,
        $Enums.Industry.cultural_and_natural_heritage,
      ],
      title: ArtistTitle.Artist,
      countryResidence: Country.Canada,
      countryCitizenship: Country.Japan,
      birthDay: new Date(1985, 2, 15),
      theme: [
        $Enums.ArtTheme.technology,
        $Enums.ArtTheme.ecology,
        $Enums.ArtTheme.social_justice_and_inclusion,
        $Enums.ArtTheme.innovation,
      ],
      moderationStatus: $Enums.ModerationStatus.Approved,
      moderationComment: 'Validated extreme field length handling',
      links: [
        'https://boundarypusher.art',
        'https://instagram.com/boundarypusher',
        'https://github.com/boundarypusher',
        'https://vimeo.com/boundarypusher',
      ],
    },
  ];

  const artistsEmails = [
    'jane.doe@example.com',
    'john.smith@example.com',
    'maria.garcia@example.com',
    'alex.wong@artmail.com',
    'sophia.bernard@creative.org',
    'diego.rivera@painter.net',
    'yuki.tanaka@japanart.jp',
    'olga.petrova@russianart.ru',
    'kwame.osei@africanart.gh',
    'luca.ferrari@italianart.it',
    'lucaas.ri@italianart.it',
  ];

  for (let i = 0; i < 20; ++i) {
    artists.push({
      firstName: 'Jane',
      lastName: 'Doe',
      bio: 'Jane Doe is a contemporary artist known for her vibrant abstract paintings and innovative digital art installations.',
      phone: '+1 (555) 123-4567',
      languages: [$Enums.Languages.English, $Enums.Languages.French],
      active: true,
      industry: [Industry.visual_arts_and_crafts],
      title: ArtistTitle.Artist,
      countryResidence: Country.Armenia,
      countryCitizenship: Country.Armenia,
      birthDay: new Date(2003, 3, 3),
      theme: ['Youth'],
      statement: 'I want to create',
      moderationStatus: $Enums.ModerationStatus.Approved,
      moderationComment: '',
    });

    artistsEmails.push(`jane.doe.${i}@example.com`);
  }

  // we cannot use createMany here, because it does not support nested creates
  for (let i = 0; i < artists.length; ++i) {
    await prisma.user.create({
      data: {
        username: `artist${i + 1}`,
        password: '$2a$12$ByB7gkqNHjKwPoSDW9rL0ud9NZUaiyp65cuwKqeP96luWnhGRbeju',
        role: [$Enums.Role.ARTIST],
        email: artistsEmails[i],
        artist: {
          create: artists[i],
        },
      },
    });
  }

  await prisma.user.create({
    data: {
      username: 'moderator',
      password: '$2a$12$ByB7gkqNHjKwPoSDW9rL0ud9NZUaiyp65cuwKqeP96luWnhGRbeju',
      role: [$Enums.Role.MODERATOR],
      moderator: {
        create: {},
      },
    },
  });

  // Seed Users
  const users = [
    {
      username: 'admin',
      password: '$2a$12$ByB7gkqNHjKwPoSDW9rL0ud9NZUaiyp65cuwKqeP96luWnhGRbeju',
      role: [$Enums.Role.ADMINISTRATOR],
    },
    {
      username: 'cm',
      password: '$2a$12$ByB7gkqNHjKwPoSDW9rL0ud9NZUaiyp65cuwKqeP96luWnhGRbeju',
      role: [$Enums.Role.CONTENT_MANAGER],
    },
    {
      username: 'cm_admin',
      password: '$2a$12$ByB7gkqNHjKwPoSDW9rL0ud9NZUaiyp65cuwKqeP96luWnhGRbeju',
      role: [$Enums.Role.CONTENT_MANAGER, $Enums.Role.ADMINISTRATOR],
    },
  ];

  await prisma.user.createMany({ data: users });

  // Seed Projects
  const projects = [
    {
      title: 'Urban Landscapes Exhibition',
      description:
        'I am seeking a grant of $5,000 to create a series of large-scale paintings depicting urban landscapes for an upcoming exhibition in downtown Los Angeles.',
      tags: ['Painting', 'Urban', 'Exhibition', 'Funds'],
      artistId: 1,
      moderationStatus: $Enums.ModerationStatus.Approved,
      moderationComment: '',
      exclusiveSupport: true,
      hidden: false,
      reach: 300,
      budget: 1000,
    },
    {
      title: 'Digital Art Workshop Series',
      description:
        "I'm looking for support to organize a series of digital art workshops for underprivileged youth in my community. The goal is to introduce them to digital art tools and techniques.",
      tags: ['Digital', 'Workshop', 'Community', 'Youth'],
      artistId: 1,
      moderationStatus: $Enums.ModerationStatus.Draft,
      moderationComment: '',
      exclusiveSupport: true,
      hidden: false,
      reach: 1000000,
      budget: 15000,
    },
    {
      title: 'Eco-Friendly Sculpture Park',
      description:
        "I'm seeking partnerships and funding to create an eco-friendly sculpture park using recycled materials. The park will serve as both an artistic installation and an educational space about sustainability.",
      tags: ['Sculpture', 'Eco-Friendly', 'Public Art', 'Education'],
      artistId: 2,
      moderationStatus: $Enums.ModerationStatus.OnModeration,
      moderationComment: '',
      exclusiveSupport: false,
      hidden: false,
      reach: 10,
      budget: 175,
    },
    {
      title: 'Virtual Reality Art Experience',
      description:
        "I'm looking to collaborate with VR developers to create an immersive virtual reality art experience based on my sculptures. This project aims to make art more accessible to people worldwide.",
      tags: ['VR', 'Technology', 'Sculpture', 'Accessibility'],
      artistId: 2,
      moderationStatus: $Enums.ModerationStatus.OnModeration,
      moderationComment: '',
      exclusiveSupport: true,
      hidden: false,
      reach: 500,
      budget: 1650,
    },
    {
      title: 'Animated Short Film Production',
      description:
        "I'm seeking funding and a team to produce a 10-minute animated short film that explores themes of cultural identity and belonging. The project will combine traditional 2D animation with digital techniques.",
      tags: ['Animation', 'Film', 'Cultural', 'Funds'],
      artistId: 3,
      moderationStatus: $Enums.ModerationStatus.Approved,
      moderationComment: '',
      exclusiveSupport: true,
      hidden: false,
      reach: 10000000,
      budget: 5000,
    },
    {
      title: 'Digital Art Residency',
      description:
        "I'm looking for opportunities to participate in a digital art residency program to further develop my skills and create a new body of work focusing on interactive digital installations.",
      tags: ['Digital', 'Residency', 'Interactive', 'Installation'],
      artistId: 3,
      moderationStatus: $Enums.ModerationStatus.Draft,
      moderationComment: '',
      exclusiveSupport: true,
      hidden: false,
      reach: 300,
      budget: 300000,
    },
    {
      title: 'Contemporary Watercolor Techniques: Blending Tradition with Approaches',
      description:
        "Explore the evolving world of watercolor painting in this deep dive into contemporary techniques that bridge classical methods with avant-garde experimentation. Modern artists are pushing boundaries by combining traditional washes with unconventional tools like salt, alcohol, and plastic wrap to create mesmerizing textures. This guide covers essential supplies, paper selection tips for different effects, and step-by-step demonstrations of innovative layering approaches. Learn how today's practitioners use digital tools for composition planning while maintaining the organic beauty of hand-painted watercolors. Whether you're interested in botanical illustration, urban sketching, or abstract expressionism, these methods will expand your creative repertoire.",
      tags: [
        'watercolor',
        'contemporary-art',
        'painting-techniques',
        'mixed-media',
        'art-tutorial',
        'texture-effects',
        'color-theory',
        'art-supplies',
        'creative-process',
        'experimental-art',
        'botanical-art',
        'urban-sketching',
        'abstract-art',
        'pigments',
        'art-education',
        'artist-interview',
        'composition',
        'art-materials',
        'beginner-artist',
        'professional-artist',
        'watercolor',
        'oil-painting',
        'acrylics',
        'gouache',
        'ink',
        'charcoal',
        'pastels',
        'colored-pencils',
        'graphite',
        'mixed-media',
        'digital-art',
        'vector-art',
        '3d-modeling',
        'printmaking',
        'collage',
        'airbrush',
        'enamel',
        'spray-paint',
        'tempera',
        'fresco',
        'encaustic',
        'sgraffito',
        'impasto',
        'glazing',
        'drybrush',
        'pointillism',
        'scumbling',
        'underpainting',
        'alla-prima',
        'grisaille',
      ],
      artistId: 3,
      moderationStatus: $Enums.ModerationStatus.Approved,
      moderationComment: '',
      exclusiveSupport: true,
      hidden: false,
      reach: 300,
      budget: 300000,
    },
  ];

  await prisma.project.createMany({ data: projects });

  const applications = [
    {
      artistId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      opportunityId: 1,
      message: 'wow, it so interesting!!',
      projectId: null,
      status: $Enums.OpportunityApplicationStatus.new,
    },
    {
      artistId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      opportunityId: 1,
      message: 'wow, it so interesting!!',
      projectId: 2,
      status: $Enums.OpportunityApplicationStatus.sent,
    },
    {
      artistId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      opportunityId: 3,
      message: "woohoo, I'm excited!",
      projectId: null,
      status: $Enums.OpportunityApplicationStatus.shortlisted,
    },
    {
      artistId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      opportunityId: 3,
      message: 'sadly, not shortlisted',
      projectId: null,
      status: $Enums.OpportunityApplicationStatus.rejected,
    },
    {
      artistId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      opportunityId: 1,
      message: 'left for archive',
      projectId: null,
      status: $Enums.OpportunityApplicationStatus.archived,
    },
    {
      artistId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      opportunityId: 3,
      message: 'viewing later',
      projectId: null,
      status: $Enums.OpportunityApplicationStatus.viewlater,
    },
    {
      artistId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      opportunityId: 3,
      message: 'hope to hear back soon!',
      projectId: 4,
      status: $Enums.OpportunityApplicationStatus.sent,
    },
    {
      artistId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      opportunityId: 3,
      message: 'cant wait to hear back',
      projectId: null,
      status: $Enums.OpportunityApplicationStatus.sent,
    },
    {
      artistId: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      opportunityId: 1,
      message: `Grant Application: [Project Name]

[Your Organization] seeks funding for [brief project description, e.g., "a community solar initiative to reduce energy poverty in rural areas"]. This project aligns with [grantor’s mission/focus area] by addressing [specific problem, e.g., "unequal access to clean energy"].

Objectives:

    [Target, e.g., "Install 50 solar systems for low-income households"]

    [Measurable outcome, e.g., "Reduce CO₂ emissions by 30 tons annually"]

    [Community impact, e.g., "Train 20 locals in renewable tech"]

Budget: $[Amount] will cover [key expenses, e.g., "equipment, training, and monitoring"].

Why Us? With [X years] of experience in [field] and partnerships with [local stakeholders], we ensure sustainable impact. Support will empower [beneficiaries] and create a model for scalable change.

Contact: [Name] | [Email] | [Phone]`,
      projectId: 7,
      status: $Enums.OpportunityApplicationStatus.sent,
    },
    {
      artistId: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      opportunityId: 1,
      message: 'Master link is waiting',
      projectId: null,
      status: $Enums.OpportunityApplicationStatus.sent,
    },
  ];

  await prisma.opportunityApplication.createMany({ data: applications });

  const opportunityInvites = [
    {
      artistId: 1,
      opportunityId: 5,
      message: 'Wake up, Neo...',
      status: $Enums.OpportunityInviteStatus.pending,
    },
  ];

  await prisma.opportunityInvite.createMany({ data: opportunityInvites });

  const newsData = [
    {
      authorId: 1,
      title: 'New Product Launch',
      description: 'We are excited to announce our latest product that will revolutionize the industry.',
      html: '<div><h2>New Product</h2><p>Introduction paragraph</p><img src="product-image.jpg" alt="Product"/></div>',
      showAtNewsPage: true,
      showAtHomePage: true,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      color: '#FF5733',
    },
    {
      authorId: 1,
      title: 'Company Wins Award',
      description: 'Our company has been recognized as the best in our category for the third year running.',
      html: '<div><h2>Award Announcement</h2><p>Details about the award</p><blockquote>We are honored</blockquote></div>',
      showAtNewsPage: true,
      showAtHomePage: false,
      uuid: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      color: '#33A8FF',
    },
    {
      authorId: 1,
      title: 'Upcoming Event',
      description: 'Join us for our annual conference featuring industry leaders and innovative workshops.',
      html: '<div><h2>Annual Conference</h2><p>Event details</p><a href="/register">Register Now</a></div>',
      showAtNewsPage: true,
      showAtHomePage: true,
      uuid: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      color: '#33FF57',
    },
    {
      authorId: 1,
      title: 'Sustainability Report',
      description: "Read our latest sustainability initiatives and how we're reducing our environmental impact.",
      html: '<div><h2>Sustainability</h2><p>Our achievements</p><ul><li>Carbon Reduction: 25%</li><li>Recycled Materials: 80%</li></ul></div>',
      showAtNewsPage: true,
      showAtHomePage: false,
      uuid: '9c4d0a1e-6b3f-4a9d-8e1f-3b7d5c2a1b0f',
      color: '#F3FF33',
    },
    {
      authorId: 1,
      title: 'Partnership Announcement',
      description: 'We are proud to announce our new strategic partnership with a leading technology firm.',
      html: '<div><h2>New Partnership</h2><p>Details about the collaboration</p><img src="partner-logo.png" alt="Partner"/></div>',
      showAtNewsPage: true,
      showAtHomePage: true,
      uuid: '8ebc9a1d-5a3f-4c8d-9e2f-1d7b6c5a4b3e',
      color: '#D933FF',
    },
  ];

  for (const data of newsData) {
    await prisma.news.create({
      data,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
