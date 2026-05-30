export type ServicePageData = {
  slug: string;
  seoTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    h1: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    tileBasePath: string;
    tilePrefix: string;
    rows: number;
    columns: number;
  };
  intro: {
    title: string;
    body: string;
  };
  outputsTitle?: string;
  whatWeCreate: Array<{
    title: string;
    body: string;
  }>;
  difference: {
    title: string;
    body: string;
    bullets: string[];
  };
  process: Array<{
    number: string;
    title: string;
    body: string;
  }>;
  processEyebrow?: string;
  useCases: string[];
  faq: Array<{
    question: string;
    answer: string;
  }>;
  imagePlaceholders: Array<{
    label: string;
    title: string;
    imageSrc: string;
    imageAlt: string;
  }>;
  contactTitle?: string;
  contactSubject?: string;
};

export const SERVICE_PAGES: ServicePageData[] = [
  {
    slug: "cinematic-real-estate-films",
    seoTitle: "Cinematic Real Estate Films Bangalore | Luxury Property Videos | Sthyra",
    metaDescription:
      "Bangalore's top choice for cinematic real estate films and architectural walkthroughs. Sthyra creates luxury property videos, launch films, and architectural animations that help developers in Bangalore and India showcase unbuilt spaces with emotional impact.",
    hero: {
      eyebrow: "Cinematic Real Estate Films",
      h1: "Cinematic Real Estate Films That Make Future Spaces Feel Real",
      description:
        "We create premium cinematic films for real estate developers, architects, and luxury property brands — transforming unbuilt projects into emotionally powerful visual stories that buyers can understand, feel, and believe in before construction is complete.",
      primaryCta: "Create Your Project Film",
      secondaryCta: "View Cinematic Work",
      tileBasePath: "/cinematic_page_tiles",
      tilePrefix: "cinematic_tile",
      rows: 2,
      columns: 8,
    },
    intro: {
      title: "Why Cinematic Films Matter",
      body:
        "Before a buyer studies a floor plan, they need to feel the space. A cinematic real estate film turns architecture, landscape, amenities, and lifestyle into one clear emotional experience — helping your project stand out in launches, presentations, campaigns, and sales conversations. Real estate video marketing, property launch films, and luxury real estate video now work best when the story feels lived-in, emotional, and cinematic rather than sterile.",
    },
    whatWeCreate: [
      {
        title: "Project Launch Films",
        body:
          "High-impact cinematic films designed for real estate launches, investor decks, sales galleries, and digital campaigns.",
      },
      {
        title: "Architectural Walkthrough Films",
        body:
          "Smooth camera journeys through towers, villas, apartments, clubhouses, landscapes, and amenity spaces.",
      },
      {
        title: "Lifestyle & Amenity Films",
        body:
          "Emotion-led films that show how the project feels — morning routines, arrival sequences, balcony views, clubhouse moments, gardens, pools, and community spaces.",
      },
      {
        title: "Masterplan & Township Films",
        body:
          "Large-scale cinematic visualizations that explain towers, zones, roads, landscapes, water features, amenities, and the overall project vision.",
      },
      {
        title: "Pre-Construction Sales Films",
        body:
          "Films created before construction is complete, helping developers sell the promise of the project with clarity and confidence.",
      },
    ],
    difference: {
      title: "The Sthyra Difference",
      body:
        "Most real estate videos simply show a building. Sthyra builds a visual journey around the project’s emotion, scale, materiality, and sales story. Every camera move, lighting choice, transition, and scene is designed to make the buyer feel closer to the future space.",
      bullets: [
        "Unreal Engine-quality cinematic visuals",
        "Photorealistic lighting and materials",
        "Story-led camera direction",
        "Luxury real estate visual language",
        "Smooth walkthrough and flythrough sequences",
        "Launch-ready edits for web, social, sales, and presentations",
        "Built for developers, architects, and premium property brands",
      ],
    },
    process: [
      {
        number: "01",
        title: "Project Understanding",
        body: "We study your plans, design intent, buyer profile, amenities, and sales goals.",
      },
      {
        number: "02",
        title: "Visual Direction",
        body: "We define the mood, camera language, lighting style, music direction, and story arc.",
      },
      {
        number: "03",
        title: "3D Scene Creation",
        body:
          "We build or refine the digital environment with accurate architecture, landscaping, interiors, and materials.",
      },
      {
        number: "04",
        title: "Cinematic Production",
        body:
          "We create camera paths, lighting, transitions, atmosphere, and motion that make the project feel alive.",
      },
      {
        number: "05",
        title: "Final Delivery",
        body:
          "You receive polished films for launches, websites, social campaigns, presentations, and sales teams.",
      },
    ],
    useCases: [
      "Real estate project launches",
      "Luxury apartment campaigns",
      "Villa and plotted development marketing",
      "Township and masterplan presentations",
      "Investor presentations",
      "Sales gallery screens",
      "Website hero videos",
      "Social media teasers",
      "YouTube campaigns",
      "RERA-stage project communication",
      "Pre-construction sales",
    ],
    faq: [
      {
        question: "What is a cinematic real estate film?",
        answer:
          "A cinematic real estate film is a premium visual story created to showcase a property, development, or unbuilt project using cinematic camera movement, photorealistic visuals, lighting, music, and storytelling. It helps buyers understand the space emotionally and spatially before visiting or before construction is complete.",
      },
      {
        question: "How is this different from a normal real estate video?",
        answer:
          "A normal real estate video usually records an existing property. A cinematic real estate film is directed like a high-end brand film, often using 3D visualization, architectural animation, walkthroughs, lifestyle moments, and carefully designed camera sequences to present the project with stronger emotion and clarity.",
      },
      {
        question: "Can you create films for projects that are not built yet?",
        answer:
          "Yes. Cinematic films are especially powerful for pre-construction real estate projects. Using architectural plans, 3D models, material references, and design intent, we create photorealistic films that show the project before it physically exists.",
      },
      {
        question: "Who needs cinematic real estate films?",
        answer:
          "Real estate developers, architects, interior designers, luxury property brands, plotted development companies, villa developers, and marketing teams use cinematic films for project launches, sales presentations, websites, social campaigns, and investor communication.",
      },
      {
        question: "Can cinematic films help with real estate sales?",
        answer:
          "Yes. Cinematic films help buyers understand the project faster, reduce imagination gaps, and create stronger emotional confidence. They are useful for explaining layouts, amenities, lifestyle, scale, and the overall project vision.",
      },
    ],
    imagePlaceholders: [
      {
        label: "Launch Film",
        title: "Cinematic arrival, amenity, and hero sequences.",
        imageSrc: "/Cinematic_Image_1.avif",
        imageAlt: "Cinematic architectural film placeholder",
      },
      {
        label: "Walkthrough",
        title: "Camera paths built around spatial clarity.",
        imageSrc: "/Cinematic_Image_2.avif",
        imageAlt: "Architectural walkthrough film placeholder",
      },
      {
        label: "Masterplan",
        title: "Large-scale development stories made legible.",
        imageSrc: "/Cinematic_image_3.avif",
        imageAlt: "Masterplan cinematic film placeholder",
      },
      {
        label: "Sales Story",
        title: "Launch-ready edits for web, social, and presentations.",
        imageSrc: "/images_last_frame.jpg",
        imageAlt: "Luxury real estate cinematic sales film placeholder",
      },
    ],
  },
  {
    slug: "interactive-real-estate-web-experiences",
    seoTitle: "Interactive Real Estate Websites Bangalore | 3D Property Web Experiences | Sthyra",
    metaDescription:
      "Bangalore's leading provider of interactive real estate websites and 3D web experiences. Sthyra creates immersive property platforms, virtual walkthroughs, and interactive marketing sites that help developers in Bangalore and India convert more buyers online.",
    hero: {
      eyebrow: "Interactive Real Estate Web Experiences",
      h1: "Interactive Real Estate Web Experiences That Turn Projects Into Journeys",
      description:
        "We create premium interactive web experiences for real estate developers, architects, and luxury property brands — transforming project websites into immersive digital journeys where buyers can explore towers, amenities, layouts, walkthroughs, and future spaces directly from the browser.",
      primaryCta: "Build Your Interactive Experience",
      secondaryCta: "Explore Web Experiences",
      tileBasePath: "/web_tiles_4x8",
      tilePrefix: "web_tile",
      rows: 2,
      columns: 8,
    },
    intro: {
      title: "Why Interactive Web Experiences Matter",
      body:
        "A buyer should not have to imagine the project from static images, brochures, or floor plans. An interactive real estate web experience allows them to explore the project, understand the space, compare options, and feel the development before visiting the site. It turns your website into a sales tool — not just an online brochure. Interactive real estate websites, 3D property websites, virtual property walkthroughs, real estate web experiences, and immersive property marketing help buyers move from curiosity to confidence online.",
    },
    whatWeCreate: [
      {
        title: "Interactive Project Websites",
        body:
          "Premium real estate websites built around visual storytelling, project clarity, smooth motion, and high-converting buyer journeys.",
      },
      {
        title: "3D Tower & Masterplan Experiences",
        body:
          "Interactive tower views, masterplan navigation, amenity zones, unit highlights, and spatial storytelling designed for large-scale developments.",
      },
      {
        title: "Virtual Walkthrough Web Experiences",
        body:
          "Browser-based walkthroughs that let buyers move through apartments, villas, clubhouses, landscapes, and amenities without needing powerful local devices.",
      },
      {
        title: "Interactive Unit Selectors",
        body:
          "Clickable apartment, floor, and unit selection systems that help buyers explore availability, layouts, views, and project details with clarity.",
      },
      {
        title: "Immersive Launch Microsites",
        body:
          "High-impact digital launch pages built for campaigns, ads, investor presentations, and premium project reveals.",
      },
    ],
    difference: {
      title: "The Sthyra Difference",
      body:
        "Most real estate websites only present information. Sthyra creates interactive journeys that make the project understandable, memorable, and emotionally convincing. Every scroll, transition, hotspot, camera movement, and interaction is designed to guide buyers from curiosity to confidence.",
      bullets: [
        "Premium real estate website design",
        "Interactive 3D and WebGL experiences",
        "Smooth scroll-based storytelling",
        "Tower, unit, and masterplan interactions",
        "Virtual walkthrough and panorama integration",
        "Fast browser-based performance optimization",
        "Luxury UI/UX for developers and property brands",
        "Built for launches, campaigns, and sales teams",
      ],
    },
    process: [
      {
        number: "01",
        title: "Project Understanding",
        body:
          "We study your project, buyer journey, architecture, amenities, layouts, sales goals, and brand positioning.",
      },
      {
        number: "02",
        title: "Experience Strategy",
        body:
          "We define how users should explore the project — from hero storytelling to tower selection, walkthroughs, amenities, and calls to action.",
      },
      {
        number: "03",
        title: "Visual & Interface Design",
        body:
          "We design a premium interface with cinematic layouts, smooth motion, clean navigation, and luxury real estate visual language.",
      },
      {
        number: "04",
        title: "Interactive Development",
        body:
          "We build responsive web experiences using modern web technologies, 3D assets, scroll interactions, hotspots, videos, panoramas, and optimized animations.",
      },
      {
        number: "05",
        title: "Final Delivery",
        body:
          "You receive a polished interactive website or microsite ready for launches, campaigns, sales presentations, and buyer engagement.",
      },
    ],
    useCases: [
      "Real estate project websites",
      "Luxury apartment launches",
      "Villa and plotted development websites",
      "Township and masterplan platforms",
      "Interactive tower selection",
      "Unit and floor plan exploration",
      "Amenity storytelling pages",
      "Virtual walkthrough websites",
      "Sales gallery digital experiences",
      "Investor presentation microsites",
      "Campaign landing pages",
      "Pre-construction project marketing",
    ],
    faq: [
      {
        question: "What is an interactive real estate web experience?",
        answer:
          "An interactive real estate web experience is a premium digital platform that lets buyers explore a property or development through interactive visuals, animations, 3D views, virtual walkthroughs, hotspots, masterplans, unit selectors, and guided storytelling. It helps users understand the project more clearly than a traditional static website.",
      },
      {
        question: "How is this different from a normal real estate website?",
        answer:
          "A normal real estate website usually shows images, text, floor plans, and contact forms. An interactive real estate web experience allows buyers to actively explore the project through motion, 3D visuals, clickable areas, walkthroughs, immersive sections, and guided project storytelling.",
      },
      {
        question: "Can you create interactive websites for projects that are not built yet?",
        answer:
          "Yes. Interactive web experiences are especially useful for pre-construction real estate projects. Using architectural plans, 3D models, renders, videos, panoramas, and project data, we create digital experiences that help buyers understand and feel the project before it is physically complete.",
      },
      {
        question: "Who needs interactive real estate web experiences?",
        answer:
          "Real estate developers, architects, luxury property brands, villa developers, plotted development companies, township developers, and sales teams use interactive web experiences for project launches, buyer education, digital campaigns, sales presentations, and investor communication.",
      },
      {
        question: "Can interactive web experiences help with real estate sales?",
        answer:
          "Yes. Interactive web experiences help buyers spend more time with the project, understand layouts faster, explore amenities clearly, and build confidence before contacting the sales team. They reduce confusion and turn the website into a stronger sales and presentation tool.",
      },
    ],
    imagePlaceholders: [
      {
        label: "Project Website",
        title: "Interactive storytelling for premium project launches.",
        imageSrc: "/webimage1.jpg",
        imageAlt: "Interactive real estate project website placeholder",
      },
      {
        label: "3D Experience",
        title: "Tower, masterplan, and amenity exploration in browser.",
        imageSrc: "/webimage3.avif",
        imageAlt: "3D real estate web experience placeholder",
      },
      {
        label: "Walkthrough",
        title: "Browser-based virtual walkthroughs for buyer clarity.",
        imageSrc: "/webimage2.jpg",
        imageAlt: "Virtual real estate walkthrough web experience placeholder",
      },
      {
        label: "Launch Microsite",
        title: "Immersive campaign pages built to convert attention.",
        imageSrc: "/images_last_frame.jpg",
        imageAlt: "Immersive real estate launch microsite placeholder",
      },
    ],
  },
  {
    slug: "real-estate-digital-twins",
    seoTitle: "Real Estate Digital Twins Bangalore | Interactive 3D Property Models | Sthyra",
    metaDescription:
      "Create digital twins for your real estate project with Sthyra, Bangalore's top architectural visualization studio. Interactive 3D models, masterplan platforms, and sales gallery digital twins help developers and architects in Bangalore showcase projects with clarity.",
    hero: {
      eyebrow: "Real Estate Digital Twins",
      h1: "Real Estate Digital Twins That Make Projects Instantly Understandable",
      description:
        "We create premium digital twins for real estate developers, architects, and luxury property brands — transforming complex projects into interactive 3D replicas where buyers, teams, and stakeholders can explore towers, amenities, layouts, views, and masterplans with complete clarity.",
      primaryCta: "Build Your Digital Twin",
      secondaryCta: "Explore Digital Twin Work",
      tileBasePath: "/unreal_tiles_4x8",
      tilePrefix: "unreal_tile",
      rows: 2,
      columns: 8,
    },
    intro: {
      title: "Why Digital Twins Matter",
      body:
        "Large real estate projects are difficult to explain through brochures, static renders, and floor plans alone. A digital twin turns the entire development into an interactive visual system — helping buyers understand the project, sales teams explain it faster, and stakeholders align around one clear version of the space. Real estate digital twins, interactive 3D property models, digital twins for real estate, interactive masterplans, and 3D real estate visualization platforms make complex developments easier to understand and sell.",
    },
    whatWeCreate: [
      {
        title: "Interactive Project Digital Twins",
        body:
          "Complete 3D replicas of real estate projects designed for browser-based exploration, sales presentations, launch campaigns, and stakeholder communication.",
      },
      {
        title: "Tower & Unit Digital Twins",
        body:
          "Interactive tower models with floor selection, unit highlights, apartment views, layout exploration, and project information mapped clearly to the building.",
      },
      {
        title: "Masterplan Digital Twins",
        body:
          "Large-scale interactive masterplans that explain towers, roads, amenity zones, landscapes, open spaces, water features, and the overall project vision.",
      },
      {
        title: "Amenity & Lifestyle Digital Twins",
        body:
          "Immersive digital spaces that let buyers explore clubhouses, pools, gardens, sky decks, lobbies, courtyards, and community areas interactively.",
      },
      {
        title: "Sales & Presentation Digital Twins",
        body:
          "High-impact digital twin experiences designed for sales galleries, investor meetings, launch events, websites, and customer-facing presentations.",
      },
    ],
    difference: {
      title: "The Sthyra Difference",
      body:
        "Most digital models only show geometry. Sthyra builds digital twins that feel like premium sales experiences. We combine accurate 3D structure, cinematic visual design, intuitive interaction, and real estate storytelling so every buyer can understand the project without confusion.",
      bullets: [
        "Interactive 3D real estate visualization",
        "Tower, unit, and floor-level exploration",
        "Masterplan and amenity navigation",
        "Browser-based WebGL experiences",
        "Photorealistic materials and lighting",
        "Hotspots, labels, views, and project information",
        "Sales-ready interfaces for developers and teams",
        "Built for launches, websites, and presentations",
      ],
    },
    process: [
      {
        number: "01",
        title: "Project Understanding",
        body:
          "We study your masterplan, architecture, floor plans, unit mix, amenities, sales goals, and buyer journey.",
      },
      {
        number: "02",
        title: "Digital Twin Strategy",
        body:
          "We define what users should explore — towers, floors, units, layouts, views, amenities, project zones, and key sales information.",
      },
      {
        number: "03",
        title: "3D Model Preparation",
        body:
          "We optimize architectural models, create clean visual layers, prepare geometry, materials, labels, and interaction-ready project elements.",
      },
      {
        number: "04",
        title: "Interactive Experience Development",
        body:
          "We build the digital twin using browser-based 3D, hotspots, camera paths, unit selectors, masterplan navigation, and smooth UI interactions.",
      },
      {
        number: "05",
        title: "Final Delivery",
        body:
          "You receive a polished digital twin platform ready for websites, sales galleries, launch campaigns, investor meetings, and buyer presentations.",
      },
    ],
    useCases: [
      "Real estate project launches",
      "Luxury apartment developments",
      "Villa and plotted development projects",
      "Township and masterplan presentations",
      "Interactive tower exploration",
      "Unit and floor selection",
      "Amenity zone explanation",
      "Sales gallery experiences",
      "Investor presentations",
      "Website-based 3D project exploration",
      "Pre-construction project marketing",
      "Stakeholder alignment and project communication",
    ],
    faq: [
      {
        question: "What is a real estate digital twin?",
        answer:
          "A real estate digital twin is an interactive 3D replica of a property, building, or development. It allows buyers, developers, architects, sales teams, and stakeholders to explore towers, floors, units, amenities, layouts, and masterplans digitally before or after the project is built.",
      },
      {
        question: "How is a digital twin different from a normal 3D model?",
        answer:
          "A normal 3D model usually shows the building visually. A digital twin turns that model into an interactive experience with clickable towers, floors, units, amenities, data points, views, labels, guided navigation, and project information that users can explore in real time.",
      },
      {
        question: "Can you create digital twins for projects that are not built yet?",
        answer:
          "Yes. Digital twins are especially powerful for pre-construction real estate projects. Using architectural plans, 3D models, renders, floor plans, and project information, we create interactive replicas that help buyers understand the project before it physically exists.",
      },
      {
        question: "Who needs real estate digital twins?",
        answer:
          "Real estate developers, architects, township developers, luxury property brands, villa developers, plotted development companies, sales teams, and investor relations teams use digital twins to explain projects more clearly and create stronger buyer confidence.",
      },
      {
        question: "Can digital twins help with real estate sales?",
        answer:
          "Yes. Digital twins help buyers explore the project interactively, understand layouts faster, compare units, visualize amenities, and feel more confident before making a decision. They also help sales teams explain complex developments with less confusion.",
      },
    ],
    imagePlaceholders: [
      {
        label: "Project Twin",
        title: "Interactive project replicas for complete buyer clarity.",
        imageSrc: "/Cinematic_Image_1.avif",
        imageAlt: "Real estate digital twin platform placeholder",
      },
      {
        label: "Tower Model",
        title: "Tower, floor, and unit exploration mapped in 3D.",
        imageSrc: "/Cinematic_Image_2.avif",
        imageAlt: "Interactive tower digital twin placeholder",
      },
      {
        label: "Masterplan",
        title: "Large-scale masterplans turned into explorable systems.",
        imageSrc: "/Cinematic_image_3.avif",
        imageAlt: "Masterplan digital twin placeholder",
      },
      {
        label: "Sales Platform",
        title: "Presentation-ready digital twins for launches and teams.",
        imageSrc: "/images_last_frame.jpg",
        imageAlt: "Sales presentation digital twin placeholder",
      },
    ],
  },
  {
    slug: "ultra-real-real-estate-renders",
    seoTitle: "Ultra-Real Real Estate Renders Bangalore | Architectural Visualization | Sthyra",
    metaDescription:
      "Get photorealistic real estate renders in Bangalore from Sthyra. We create stunning architectural visualizations, interior renders, exterior renders, and property marketing visuals for developers, architects, and luxury property brands across India.",
    hero: {
      eyebrow: "Ultra-Real Real Estate Renders",
      h1: "Ultra-Real Real Estate Renders That Make Future Spaces Feel Built",
      description:
        "We create ultra-real renders for real estate developers, architects, interior designers, and luxury property brands — transforming unbuilt spaces into photorealistic visuals that buyers can understand, trust, and emotionally connect with before construction is complete.",
      primaryCta: "Create Your Project Renders",
      secondaryCta: "View Render Portfolio",
      tileBasePath: "/unreal_tiles_4x8",
      tilePrefix: "unreal_tile",
      rows: 2,
      columns: 8,
    },
    intro: {
      title: "Why Ultra-Real Renders Matter",
      body:
        "Before buyers visit a site, they judge the project through visuals. Ultra-real real estate renders help them see the architecture, interiors, materials, landscaping, lighting, and lifestyle with clarity. They turn plans and design intent into believable marketing images that support launches, brochures, websites, hoardings, investor decks, and sales conversations. Photorealistic architectural rendering, real estate renderings, property marketing visuals, interior rendering, exterior rendering, and pre-construction visualization help buyers understand materiality and make more confident decisions before construction is complete.",
    },
    whatWeCreate: [
      {
        title: "Exterior Architectural Renders",
        body:
          "Photorealistic exterior visuals that showcase towers, villas, facades, entrances, podiums, landscapes, lighting, and the full architectural character of the project.",
      },
      {
        title: "Interior Real Estate Renders",
        body:
          "Ultra-real interior visuals for apartments, villas, lobbies, clubhouses, bedrooms, kitchens, living rooms, lounges, and premium amenity spaces.",
      },
      {
        title: "Amenity & Lifestyle Renders",
        body:
          "Emotion-led visuals that present pools, gardens, gyms, co-working zones, sky decks, courtyards, children’s play areas, arrival zones, and community spaces.",
      },
      {
        title: "Masterplan & Aerial Renders",
        body:
          "Large-scale real estate visuals that explain the complete development — towers, roads, open spaces, landscapes, amenities, water features, and project zones.",
      },
      {
        title: "Marketing & Campaign Renders",
        body:
          "Launch-ready visuals created for websites, brochures, digital ads, billboards, hoardings, investor presentations, sales galleries, and social media campaigns.",
      },
    ],
    difference: {
      title: "The Sthyra Difference",
      body:
        "Most renders simply show what a project looks like. Sthyra creates visuals that make the project feel desirable, believable, and premium. Every frame is crafted with attention to light, material, mood, composition, scale, landscaping, and buyer emotion — so the final image works as a sales asset, not just a design preview.",
      bullets: [
        "Photorealistic architectural visualization",
        "Exterior and interior real estate renders",
        "Luxury lighting, material, and mood direction",
        "Accurate spatial scale and architectural detailing",
        "Landscape, amenity, and lifestyle storytelling",
        "Launch-ready image formats for web and print",
        "Premium visuals for brochures, hoardings, and ads",
        "Built for developers, architects, and property brands",
      ],
    },
    process: [
      {
        number: "01",
        title: "Project Understanding",
        body:
          "We study your architectural plans, design intent, materials, buyer profile, location, amenities, and marketing goals.",
      },
      {
        number: "02",
        title: "Visual Direction",
        body:
          "We define the image style, camera angles, lighting mood, time of day, composition, landscape treatment, and emotional tone.",
      },
      {
        number: "03",
        title: "3D Scene Creation",
        body:
          "We build or refine the project environment with accurate architecture, interiors, materials, furniture, landscaping, lighting, and surrounding context.",
      },
      {
        number: "04",
        title: "Ultra-Real Rendering",
        body:
          "We create photorealistic images with detailed lighting, textures, reflections, shadows, atmosphere, depth, and premium cinematic composition.",
      },
      {
        number: "05",
        title: "Final Delivery",
        body:
          "You receive polished high-resolution renders ready for websites, brochures, launch campaigns, hoardings, sales galleries, investor decks, and presentations.",
      },
    ],
    useCases: [
      "Real estate project launches",
      "Luxury apartment campaigns",
      "Villa and plotted development marketing",
      "Exterior elevation presentations",
      "Interior design visualization",
      "Clubhouse and amenity marketing",
      "Masterplan and aerial presentations",
      "Brochure and catalogue visuals",
      "Website hero images",
      "Digital ad creatives",
      "Hoardings and outdoor campaigns",
      "Investor presentations",
      "Sales gallery displays",
      "Pre-construction property sales",
      "RERA-stage project communication",
    ],
    faq: [
      {
        question: "What are ultra-real real estate renders?",
        answer:
          "Ultra-real real estate renders are photorealistic images created from architectural plans, 3D models, material references, and design intent. They show what a property, interior, exterior, amenity, or development will look like before it is physically built.",
      },
      {
        question: "How are ultra-real renders different from normal 3D renders?",
        answer:
          "Normal 3D renders may show the space clearly, but ultra-real renders focus on realism, emotion, lighting, material accuracy, atmosphere, composition, landscaping, and premium presentation. They are created to look believable enough for real estate marketing, launch campaigns, sales presentations, and buyer communication.",
      },
      {
        question: "Can you create renders for projects that are not built yet?",
        answer:
          "Yes. Ultra-real renders are especially useful for pre-construction real estate projects. Using floor plans, elevations, 3D models, material references, and design direction, we create photorealistic visuals that help buyers understand the project before construction is complete.",
      },
      {
        question: "Who needs ultra-real architectural renders?",
        answer:
          "Real estate developers, architects, interior designers, luxury property brands, villa developers, plotted development companies, township developers, and marketing teams use ultra-real renders for launches, brochures, websites, hoardings, investor presentations, and sales conversations.",
      },
      {
        question: "Can real estate renders help with sales?",
        answer:
          "Yes. Real estate renders help buyers visualize the final project, understand finishes and layouts, compare spaces, and build confidence before making a decision. They are especially useful when the project is still under construction or only available through plans and drawings.",
      },
    ],
    imagePlaceholders: [
      {
        label: "Exterior Render",
        title: "Photoreal exteriors shaped for launches and campaigns.",
        imageSrc: "/ultrarender1.avif",
        imageAlt: "Ultra-real exterior real estate render placeholder",
      },
      {
        label: "Interior Render",
        title: "Interior visuals with premium lighting and material depth.",
        imageSrc: "/Cinematic_Image_2.avif",
        imageAlt: "Photorealistic interior real estate render placeholder",
      },
      {
        label: "Amenity Render",
        title: "Lifestyle-led amenity visuals that sell the feeling.",
        imageSrc: "/Cinematic_image_3.avif",
        imageAlt: "Ultra-real amenity render placeholder",
      },
      {
        label: "Campaign Visual",
        title: "High-resolution renders ready for web, print, and outdoor.",
        imageSrc: "/ultrarender2.avif",
        imageAlt: "Real estate marketing render campaign placeholder",
      },
    ],
  },
  {
    slug: "ar-vr-real-estate-experiences",
    seoTitle: "AR VR Real Estate Experiences Bangalore | Virtual Property Tours | Sthyra",
    metaDescription:
      "Experience AR and VR real estate tours in Bangalore. Sthyra creates immersive virtual property walkthroughs, augmented reality experiences, and 360 tours for real estate developers and architects to help buyers explore projects before construction.",
    hero: {
      eyebrow: "AR & VR Real Estate Experiences",
      h1: "AR & VR Real Estate Experiences That Let Buyers Step Inside the Future",
      description:
        "We create immersive AR and VR experiences for real estate developers, architects, and luxury property brands — allowing buyers to walk through apartments, villas, amenities, towers, and masterplans before the project is physically built.",
      primaryCta: "Create Your Immersive Experience",
      secondaryCta: "Explore AR & VR Work",
      tileBasePath: "/vr_tiles_4x8",
      tilePrefix: "vr_tile",
      rows: 2,
      columns: 8,
    },
    intro: {
      title: "Why AR & VR Experiences Matter",
      body:
        "Static images show a project. AR and VR experiences let buyers enter it. For real estate developments that are still under construction, immersive walkthroughs help people understand scale, layout, views, materials, amenities, and lifestyle with far more confidence than brochures or floor plans alone. AR real estate experience, VR real estate tour, virtual property walkthrough, augmented reality property visualization, immersive real estate marketing, and pre-construction VR tour experiences help buyers move from imagination to certainty.",
    },
    outputsTitle: "Immersive outputs for launches, sales, and buyer confidence.",
    whatWeCreate: [
      {
        title: "VR Property Walkthroughs",
        body:
          "Immersive virtual reality walkthroughs that let buyers experience apartments, villas, clubhouses, lobbies, landscapes, and amenities as if they are physically inside the space.",
      },
      {
        title: "AR Project Visualizations",
        body:
          "Augmented reality experiences that allow users to place towers, villas, interiors, floor plans, or project models into real-world environments through mobile or tablet devices.",
      },
      {
        title: "Virtual Sales Gallery Experiences",
        body:
          "Premium VR experiences designed for sales galleries, launch events, expos, investor presentations, and customer-facing project demonstrations.",
      },
      {
        title: "360° Real Estate Tours",
        body:
          "Interactive panoramic tours for apartments, villas, show flats, clubhouses, amenities, and outdoor spaces, optimized for web, mobile, and headset viewing.",
      },
      {
        title: "Immersive Masterplan Experiences",
        body:
          "Large-scale AR and VR experiences that help users explore towers, roads, landscapes, amenities, open spaces, and project zones from a clear spatial perspective.",
      },
    ],
    difference: {
      title: "The Sthyra Difference",
      body:
        "Most AR and VR experiences focus only on technology. Sthyra builds immersive real estate journeys that feel premium, intuitive, and sales-ready. We combine spatial accuracy, cinematic visuals, smooth interaction, and buyer-focused storytelling so every experience makes the project easier to understand and more desirable.",
      bullets: [
        "Immersive VR walkthroughs for real estate",
        "AR property visualization for mobile and tablet",
        "360° virtual tours and panoramic experiences",
        "Interactive masterplans and amenity exploration",
        "Photorealistic lighting, materials, and atmosphere",
        "Sales-gallery-ready immersive presentations",
        "Browser, mobile, and headset-friendly delivery",
        "Built for developers, architects, and luxury property brands",
      ],
    },
    processEyebrow: "From Project Plans to Immersive AR & VR Experience",
    process: [
      {
        number: "01",
        title: "Project Understanding",
        body:
          "We study your architecture, floor plans, 3D models, materials, amenities, buyer journey, and sales goals.",
      },
      {
        number: "02",
        title: "Immersive Experience Strategy",
        body:
          "We define how users should explore the project — through VR walkthroughs, AR models, 360° tours, masterplan views, hotspots, or guided sales experiences.",
      },
      {
        number: "03",
        title: "3D Environment Preparation",
        body:
          "We build or optimize the project spaces with accurate geometry, realistic materials, lighting, furniture, landscaping, and interaction-ready assets.",
      },
      {
        number: "04",
        title: "AR & VR Development",
        body:
          "We create the immersive experience with navigation, hotspots, spatial transitions, interactive views, device optimization, and smooth real-time performance.",
      },
      {
        number: "05",
        title: "Final Delivery",
        body:
          "You receive a polished AR or VR experience ready for sales galleries, launch campaigns, websites, mobile devices, investor meetings, and buyer presentations.",
      },
    ],
    useCases: [
      "Real estate project launches",
      "Luxury apartment walkthroughs",
      "Villa and plotted development marketing",
      "Virtual show flat experiences",
      "Sales gallery VR presentations",
      "AR tower and masterplan visualization",
      "360° apartment and amenity tours",
      "Clubhouse and lifestyle walkthroughs",
      "Investor presentations",
      "Expo and launch event demonstrations",
      "Website-based virtual property tours",
      "Pre-construction sales experiences",
      "Stakeholder alignment and design communication",
    ],
    faq: [
      {
        question: "What are AR and VR real estate experiences?",
        answer:
          "AR and VR real estate experiences are immersive digital tools that allow buyers, developers, architects, and sales teams to explore a property or development virtually. VR places users inside a digital space, while AR brings digital project models into the real world through phones, tablets, or compatible devices.",
      },
      {
        question: "How is a VR property tour different from a normal video walkthrough?",
        answer:
          "A video walkthrough is watched passively. A VR property tour allows users to actively look around, move through spaces, explore rooms, understand scale, and experience the property from their own point of view. It creates a stronger sense of presence and spatial clarity.",
      },
      {
        question: "Can you create AR and VR experiences for projects that are not built yet?",
        answer:
          "Yes. AR and VR experiences are especially powerful for pre-construction real estate projects. Using architectural plans, 3D models, renders, material references, and design intent, we create immersive experiences that help buyers explore the project before it physically exists.",
      },
      {
        question: "Who needs AR and VR real estate experiences?",
        answer:
          "Real estate developers, architects, luxury property brands, villa developers, plotted development companies, township developers, sales teams, and investor relations teams use AR and VR experiences for launches, sales galleries, expos, presentations, websites, and buyer education.",
      },
      {
        question: "Can AR and VR help with real estate sales?",
        answer:
          "Yes. AR and VR help buyers understand scale, layout, views, amenities, and lifestyle more clearly. They reduce imagination gaps, create stronger emotional confidence, and give sales teams a more powerful way to explain projects before construction is complete.",
      },
    ],
    imagePlaceholders: [
      {
        label: "VR Walkthrough",
        title: "Immersive movement through spaces before they are built.",
        imageSrc: "/Cinematic_Image_1.avif",
        imageAlt: "VR property walkthrough placeholder",
      },
      {
        label: "AR Visualization",
        title: "Project models placed into real-world sales contexts.",
        imageSrc: "/Cinematic_Image_2.avif",
        imageAlt: "AR property visualization placeholder",
      },
      {
        label: "Sales Gallery",
        title: "Headset, mobile, and presentation-ready experiences.",
        imageSrc: "/Cinematic_image_3.avif",
        imageAlt: "Virtual sales gallery experience placeholder",
      },
      {
        label: "Masterplan",
        title: "Large developments made clear through spatial exploration.",
        imageSrc: "/images_last_frame.jpg",
        imageAlt: "Immersive masterplan experience placeholder",
      },
    ],
    contactTitle: "Create your immersive experience.",
    contactSubject: "AR & VR Real Estate Experience",
  },
];

export function getServicePage(slug: string) {
  return SERVICE_PAGES.find((service) => service.slug === slug);
}
