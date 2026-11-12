export const seedSchemes = [
  {
    id: "pm-kisan",
    code: "PM-KISAN",
    category: "Agriculture",
    level: "Central",
    state: "All India",
    targetBeneficiaries: "Farmers",
    department: "Ministry of Agriculture & Farmers Welfare",
    officialUrl: "https://pmkisan.gov.in/",
    lastVerified: "2026-11-05",
    verificationStatus: "Verified",
    title: {
      en: "PM-KISAN Samman Nidhi",
      hi: "पीएम-किसान सम्मान निधि",
      mr: "पीएम-किसान सन्मान निधी"
    },
    shortDesc: {
      en: "Direct annual income support of ₹6,000 for eligible landholding farmer families across India.",
      hi: "पात्र भूमिधारक किसान परिवारों को ₹6,000 प्रति वर्ष की प्रत्यक्ष आय सहायता।",
      mr: "पात्र शेतकरी कुटुंबांना प्रति वर्ष ₹6,000 ची थेट आर्थिक मदत."
    },
    benefits: {
      en: "₹6,000 per year transferred in 3 equal installments of ₹2,000 directly to bank account.",
      hi: "₹2,000 की 3 समान किस्तों में प्रति वर्ष ₹6,000 सीधे बैंक खाते में।",
      mr: "दरवर्षी ₹2,000 च्या 3 समान हप्त्यांत एकूण ₹6,000 थेट बँक खात्यात."
    },
    eligibilitySummary: {
      en: "Landholding farmer families with cultivable land records, excluding institutional landholders and income tax payers.",
      hi: "खेती योग्य भूमि वाले किसान परिवार; संस्थागत भूमिधारक व आयकर दाता अपात्र।",
      mr: "लागवडीयोग्य जमीन असलेली शेतकरी कुटुंबे; संस्थात्मक जमीनधारक व आयकरदाते अपात्र."
    },
    rules: [
      {
        id: "pk_occ",
        logic: "AND",
        question: "Are you a farmer / part of a farmer household?",
        type: "select",
        options: ["Farmer", "Agricultural Labourer", "Student", "Artisan", "Self-Employed", "Senior Citizen"],
        operator: "eq",
        value: "Farmer",
        profileField: "occupation"
      },
      {
        id: "pk_land",
        logic: "AND",
        question: "Do you own eligible cultivable land in revenue records (7/12 extract)?",
        type: "yesno",
        operator: "boolean_yes",
        value: true
      },
      {
        id: "pk_excl",
        logic: "NOT",
        question: "Does anyone in your family fall under exclusion criteria (Income Tax payer / Govt officer / Institutional landholder)?",
        type: "yesno",
        operator: "boolean_yes",
        value: true,
        manualConfirmNote: "Exclusion criteria require confirmation against official PM-KISAN guidelines."
      },
      {
        id: "pk_ekyc",
        logic: "AND",
        question: "Are you ready to complete official e-KYC and land verification at CSC / portal?",
        type: "yesno",
        operator: "boolean_yes",
        value: true
      }
    ],
    documents: [
      { id: "doc-id", name: "Official Identity Proof (for verification at portal)" },
      { id: "doc-land", name: "Cultivable Land Record (7/12 / Satbara / Khatauni)" },
      { id: "doc-bank", name: "Active Bank Account Details (for DBT transfer)" },
      { id: "doc-mobile", name: "Active Mobile Number for OTP / e-KYC" },
      { id: "doc-consent", name: "Self-Declaration of Non-Exclusion" }
    ],
    applicationGuide: {
      method: "Online via PM-KISAN Portal or Assisted through nearest CSC",
      portalName: "pmkisan.gov.in",
      helpline: "155261 / 011-24300606",
      steps: [
        "Check eligibility rules and verify land records (7/12 extract) are up to date.",
        "Visit pmkisan.gov.in (New Farmer Registration) or nearest GramConnect / CSC centre.",
        "Enter basic details, landholding survey details, and complete e-KYC.",
        "Submit application and securely record your Farmer Registration Reference Number."
      ]
    }
  },
  {
    id: "pmay-g",
    code: "PMAY-G",
    category: "Housing",
    level: "Central",
    state: "All India",
    targetBeneficiaries: "Rural Households",
    department: "Ministry of Rural Development",
    officialUrl: "https://pmayg.dord.gov.in/",
    lastVerified: "2026-11-04",
    verificationStatus: "Verified",
    title: {
      en: "Pradhan Mantri Awaas Yojana – Gramin",
      hi: "प्रधानमंत्री आवास योजना – ग्रामीण",
      mr: "प्रधानमंत्री आवास योजना – ग्रामीण"
    },
    shortDesc: {
      en: "Financial assistance for rural homeless households or families living in kutcha/dilapidated houses.",
      hi: "कच्चे या जर्जर मकानों में रहने वाले ग्रामीण परिवारों को पक्के घर के लिए सहायता।",
      mr: "कच्च्या किंवा जीर्ण घरात राहणाऱ्या ग्रामीण कुटुंबांना पक्क्या घरासाठी आर्थिक मदत."
    },
    benefits: {
      en: "₹1,20,000 in plain areas (₹1,30,000 in hilly/IAP areas) plus MGNREGA wage convergence & toilet support.",
      hi: "मैदानी क्षेत्रों में ₹1,20,000 (पहाड़ी क्षेत्रों में ₹1,30,000) व मनरेगा मजदूरी सहायता।",
      mr: "सपाट भागात ₹1,20,000 (डोंगराळ भागात ₹1,30,000) आणि मनरेगा मजुरी सहाय्य."
    },
    eligibilitySummary: {
      en: "Houseless rural households or families with zero/one/two room kutcha walls & roof as per SECC/Awaas+ verification.",
      hi: "SECC/आवास+ सर्वेक्षण के अनुसार कच्चे मकान या बेघर ग्रामीण परिवार।",
      mr: "SECC/आवास+ यादीनुसार बेघर किंवा कच्च्या घरातील ग्रामीण कुटुंबे."
    },
    rules: [
      {
        id: "pmay_rural",
        logic: "AND",
        question: "Do you reside in a Gram Panchayat / rural area?",
        type: "yesno",
        operator: "boolean_yes",
        value: true
      },
      {
        id: "pmay_kutcha",
        logic: "OR",
        question: "Is your family currently houseless?",
        type: "yesno",
        operator: "boolean_yes",
        value: true
      },
      {
        id: "pmay_1room",
        logic: "OR",
        question: "Do you live in a 0, 1, or 2 room house with kutcha wall and kutcha roof?",
        type: "yesno",
        operator: "boolean_yes",
        value: true
      },
      {
        id: "pmay_pucca_excl",
        logic: "NOT",
        question: "Does your household already own a pucca house or motorized 3/4-wheeler exclusion asset?",
        type: "yesno",
        operator: "boolean_yes",
        value: true
      }
    ],
    documents: [
      { id: "pmay-id", name: "Identity Proof (where required)" },
      { id: "pmay-bank", name: "Bank Account Details (DBT-linked)" },
      { id: "pmay-household", name: "Household / Ration Card Details" },
      { id: "pmay-gram", name: "Gram Sabha / SECC / Awaas+ Verification Consent" },
      { id: "pmay-land", name: "Homestead / Plot Record (where applicable)" }
    ],
    applicationGuide: {
      method: "Gram Panchayat / Block Development Office (Awaas+ Survey & Verification)",
      portalName: "pmayg.dord.gov.in",
      helpline: "1800-11-6446",
      steps: [
        "Verify whether your household appears in the Gram Panchayat SECC / Awaas+ priority list.",
        "Keep household, bank passbook, and homestead details ready.",
        "Contact your Gram Sevak / Panchayat Secretary or CSC for Awaas+ verification.",
        "Save your PMAY-G Registration / Sanction Reference ID to track installment milestones."
      ]
    }
  },
  {
    id: "pm-jay",
    code: "AB-PMJAY",
    category: "Healthcare",
    level: "Central",
    state: "All India",
    targetBeneficiaries: "Rural Households",
    department: "National Health Authority (MoHFW)",
    officialUrl: "https://beneficiary.nha.gov.in/",
    lastVerified: "2026-11-02",
    verificationStatus: "Verified",
    title: {
      en: "Ayushman Bharat – PM-JAY",
      hi: "आयुष्मान भारत – पीएम-जेएवाई",
      mr: "आयुष्मान भारत – पीएम-जेएवाय"
    },
    shortDesc: {
      en: "Cashless health insurance cover up to ₹5 lakh per family per year for secondary & tertiary hospitalization.",
      hi: "प्रति परिवार प्रति वर्ष ₹5 लाख तक का कैशलेस अस्पताल उपचार बीमा।",
      mr: "प्रति कुटुंब प्रति वर्ष ₹5 लाखांपर्यंतचे कॅशलेस रुग्णालय उपचार कवच."
    },
    benefits: {
      en: "₹5,00,000 annual cashless cover across empaneled public & private hospitals; covers pre-existing conditions.",
      hi: "सूचीबद्ध सरकारी व निजी अस्पतालों में ₹5,00,000 तक का निःशुल्क उपचार।",
      mr: "नोंदणीकृत सरकारी व खाजगी रुग्णालयांत ₹5,00,000 पर्यंत मोफत उपचार."
    },
    eligibilitySummary: {
      en: "SECC-deprived rural families, Antyodaya/priority ration card holders, or senior citizens aged 70+.",
      hi: "SECC पात्र परिवार, राशन कार्ड धारक या 70+ वर्ष के वरिष्ठ नागरिक।",
      mr: "SECC पात्र ग्रामीण कुटुंबे, रेशन कार्डधारक किंवा ७०+ वयाचे ज्येष्ठ नागरिक."
    },
    rules: [
      {
        id: "jay_secc",
        logic: "OR",
        question: "Is your family listed in SECC 2011 / Priority Ration Card database?",
        type: "yesno",
        operator: "boolean_yes",
        value: true
      },
      {
        id: "jay_senior",
        logic: "OR",
        question: "Are you a senior citizen aged 70 years or above?",
        type: "number",
        operator: "gte",
        value: 70,
        profileField: "age"
      },
      {
        id: "jay_income",
        logic: "OR",
        question: "Is your annual family income ₹2,50,000 or below (state-expanded eligibility)?",
        type: "number",
        operator: "lte",
        value: 250000,
        profileField: "income"
      }
    ],
    documents: [
      { id: "jay-id", name: "Official Identity Document" },
      { id: "jay-ration", name: "Ration Card / Family ID" },
      { id: "jay-mobile", name: "Mobile Number for e-KYC Verification" }
    ],
    applicationGuide: {
      method: "Online via NHA Beneficiary Portal or Ayushman Arogya Mandir / CSC",
      portalName: "beneficiary.nha.gov.in",
      helpline: "14555",
      steps: [
        "Search family eligibility on beneficiary.nha.gov.in using mobile/location.",
        "Complete e-KYC verification for each eligible family member.",
        "Download your Ayushman Card and verify empaneled hospitals nearby."
      ]
    }
  },
  {
    id: "mgnrega",
    code: "MGNREGA",
    category: "Employment",
    level: "Central",
    state: "All India",
    targetBeneficiaries: "Rural Households",
    department: "Ministry of Rural Development",
    officialUrl: "https://nrega.nic.in/",
    lastVerified: "2026-11-01",
    verificationStatus: "Verified",
    title: {
      en: "MGNREGA Rural Employment Guarantee",
      hi: "मनरेगा ग्रामीण रोजगार गारंटी योजना",
      mr: "मनरेगा ग्रामीण रोजगार हमी योजना"
    },
    shortDesc: {
      en: "Legal guarantee of at least 100 days of wage employment per financial year to rural households.",
      hi: "ग्रामीण परिवारों को प्रति वर्ष कम से कम 100 दिनों के अकुशल श्रम रोजगार की गारंटी।",
      mr: "ग्रामीण कुटुंबांना एका आर्थिक वर्षात किमान १०० दिवसांच्या रोजगाराची कायदेशीर हमी."
    },
    benefits: {
      en: "100+ days guaranteed unskilled manual work within 5 km of village, paid directly to bank account.",
      hi: "गांव के 5 किमी के भीतर रोजगार व सीधे खाते में मजदूरी भुगतान।",
      mr: "गावापासून ५ किमीच्या आत काम आणि थेट बँक खात्यात मजुरी."
    },
    eligibilitySummary: {
      en: "Any adult member (18+) of a rural household willing to do unskilled manual work.",
      hi: "ग्रामीण परिवार का कोई भी 18+ वयस्क सदस्य जो अकुशल श्रम करने को तैयार हो।",
      mr: "ग्रामीण कुटुंबातील १८+ वयाचा कोणताही प्रौढ सदस्य जो अकुशल काम करण्यास इच्छुक आहे."
    },
    rules: [
      {
        id: "mgn_age",
        logic: "AND",
        question: "Is the applicant 18 years of age or older?",
        type: "number",
        operator: "gte",
        value: 18,
        profileField: "age"
      },
      {
        id: "mgn_rural",
        logic: "AND",
        question: "Does your household reside in a rural Gram Panchayat area?",
        type: "yesno",
        operator: "boolean_yes",
        value: true
      },
      {
        id: "mgn_work",
        logic: "AND",
        question: "Are adult household members willing to perform unskilled manual work?",
        type: "yesno",
        operator: "boolean_yes",
        value: true
      }
    ],
    documents: [
      { id: "mgn-photo", name: "Passport-size Photographs of Adult Applicants" },
      { id: "mgn-addr", name: "Proof of Rural Residence (Gram Panchayat)" },
      { id: "mgn-bank", name: "Bank / Post Office Account Passbook Details" }
    ],
    applicationGuide: {
      method: "Offline at Gram Panchayat Office or via Rozgar Sevak",
      portalName: "nrega.nic.in",
      helpline: "1800-345-2244",
      steps: [
        "Submit written or oral application for Job Card registration to your Gram Panchayat.",
        "Collect your verified MGNREGA Job Card (issued within 15 days).",
        "Submit a dated work demand receipt whenever employment is needed."
      ]
    }
  },
  {
    id: "nsp-scholarship",
    code: "NSP-PM",
    category: "Education",
    level: "Central",
    state: "All India",
    targetBeneficiaries: "Students",
    department: "Ministry of Education / Social Justice",
    officialUrl: "https://scholarships.gov.in/",
    lastVerified: "2026-10-29",
    verificationStatus: "Verified",
    title: {
      en: "National Scholarship Portal (Post-Matric)",
      hi: "राष्ट्रीय छात्रवृत्ति पोर्टल (पोस्ट-मैट्रिक)",
      mr: "राष्ट्रीय शिष्यवृत्ती पोर्टल (पोस्ट-मॅट्रिक)"
    },
    shortDesc: {
      en: "Central & State scholarships for students from economically weaker and reserved categories.",
      hi: "आर्थिक रूप से कमजोर व पात्र विद्यार्थियों के लिए पोस्ट-मैट्रिक छात्रवृत्ति।",
      mr: "आर्थिकदृष्ट्या दुर्बल व पात्र विद्यार्थ्यांसाठी पोस्ट-मॅट्रिक शिष्यवृत्ती."
    },
    benefits: {
      en: "Tuition fee reimbursement plus annual maintenance allowance directly to student bank account.",
      hi: "ट्यूशन फीस प्रतिपूर्ति व वार्षिक निर्वाह भत्ता सीधे विद्यार्थी के खाते में।",
      mr: "शिक्षण शुल्क प्रतिपूर्ती व वार्षिक निर्वाह भत्ता थेट विद्यार्थ्यांच्या खात्यात."
    },
    eligibilitySummary: {
      en: "Students enrolled in Class 11/12, UG, PG or diploma with family income within scheme ceiling (typically ₹2.5L).",
      hi: "मान्यता प्राप्त संस्थान में अध्ययनरत विद्यार्थी जिनकी पारिवारिक आय सीमा के भीतर हो।",
      mr: "मान्यताप्राप्त महाविद्यालय/शाळेत शिकणारे विद्यार्थी ज्यांचे कौटुंबिक उत्पन्न मर्यादेत आहे."
    },
    rules: [
      {
        id: "nsp_occ",
        logic: "AND",
        question: "Is the applicant currently enrolled as a Student?",
        type: "select",
        options: ["Farmer", "Agricultural Labourer", "Student", "Artisan", "Self-Employed", "Senior Citizen"],
        operator: "eq",
        value: "Student",
        profileField: "occupation"
      },
      {
        id: "nsp_income",
        logic: "AND",
        question: "Is annual family income ₹2,50,000 or less?",
        type: "number",
        operator: "lte",
        value: 250000,
        profileField: "income"
      },
      {
        id: "nsp_att",
        logic: "AND",
        question: "Did the student pass the previous qualifying exam with required attendance?",
        type: "yesno",
        operator: "boolean_yes",
        value: true
      }
    ],
    documents: [
      { id: "nsp-bonafide", name: "Institute Bonafide & Fee Receipt" },
      { id: "nsp-income", name: "Valid Family Income Certificate (Tehsildar)" },
      { id: "nsp-marksheet", name: "Previous Year Marksheet" },
      { id: "nsp-bank", name: "Student Bank Passbook Details" }
    ],
    applicationGuide: {
      method: "Online via National Scholarship Portal (OTR + Application)",
      portalName: "scholarships.gov.in",
      helpline: "0120-6619540",
      steps: [
        "Generate One-Time Registration (OTR) on scholarships.gov.in.",
        "Select eligible Post-Matric scholarship and upload institute verification details.",
        "Submit form before deadline and track institute verification status."
      ]
    }
  },
  {
    id: "nsap-pension",
    code: "NSAP",
    category: "Pension",
    level: "Central",
    state: "All India",
    targetBeneficiaries: "Senior Citizens",
    department: "Ministry of Rural Development",
    officialUrl: "https://nsap.dord.gov.in/",
    lastVerified: "2026-10-30",
    verificationStatus: "Verified",
    title: {
      en: "NSAP Old Age & Widow Pension",
      hi: "राष्ट्रीय सामाजिक सहायता (वृद्धावस्था / विधवा पेंशन)",
      mr: "राष्ट्रीय सामाजिक सहाय्य (वृद्धापकाळ / विधवा पेन्शन)"
    },
    shortDesc: {
      en: "Monthly social security pension for BPL senior citizens (60+), widows, and persons with disabilities.",
      hi: "बीपीएल वरिष्ठ नागरिकों (60+), विधवाओं व दिव्यांगजनों के लिए मासिक पेंशन।",
      mr: "दारिद्र्यरेषेखालील ज्येष्ठ नागरिक (६०+), विधवा व दिव्यांग व्यक्तींसाठी मासिक पेन्शन."
    },
    benefits: {
      en: "Monthly pension (Central contribution + State top-up, e.g. Shravanbal / Sanjay Gandhi Niradhar in Maharashtra).",
      hi: "मासिक पेंशन सहायता सीधे बैंक/डाक खाते में (राज्य टॉप-अप सहित)।",
      mr: "मासिक पेन्शन थेट खात्यात (महाराष्ट्रातील श्रावणबाळ / संजय गांधी निराधार योजनेसह)."
    },
    eligibilitySummary: {
      en: "BPL household member aged 60+ (Old Age) or widow aged 40–79 (Widow Pension).",
      hi: "60+ वर्ष के बीपीएल वरिष्ठ नागरिक या पात्र विधवा महिलाएं।",
      mr: "६०+ वर्षे वयाचे बीपीएल ज्येष्ठ नागरिक किंवा पात्र विधवा महिला."
    },
    rules: [
      {
        id: "nsap_age",
        logic: "OR",
        question: "Is the applicant aged 60 years or above?",
        type: "number",
        operator: "gte",
        value: 60,
        profileField: "age"
      },
      {
        id: "nsap_widow",
        logic: "OR",
        question: "Is the applicant an eligible widow / person with severe disability (40+)?",
        type: "yesno",
        operator: "boolean_yes",
        value: true
      },
      {
        id: "nsap_bpl",
        logic: "AND",
        question: "Does the household belong to BPL / low-income category (<= ₹50,000/year)?",
        type: "number",
        operator: "lte",
        value: 50000,
        profileField: "income"
      }
    ],
    documents: [
      { id: "nsap-age", name: "Age Proof / Birth or School Certificate" },
      { id: "nsap-bpl", name: "BPL / Income Certificate" },
      { id: "nsap-bank", name: "Bank / Post Office Account Details" },
      { id: "nsap-res", name: "Residence Proof" }
    ],
    applicationGuide: {
      method: "Tehsil / Setu Kendra / Gram Panchayat or Aaple Sarkar (Maharashtra)",
      portalName: "nsap.dord.gov.in",
      helpline: "1800-11-6446",
      steps: [
        "Verify BPL or annual income certificate from Tehsil / Setu office.",
        "Submit pension form with age proof at Gram Panchayat or Setu Kendra.",
        "Record your sanction tracking number for monthly pension updates."
      ]
    }
  },
  {
    id: "pm-vishwakarma",
    code: "PM-VK",
    category: "Skill & Savings",
    level: "Central",
    state: "All India",
    targetBeneficiaries: "Artisans",
    department: "Ministry of MSME",
    officialUrl: "https://pmvishwakarma.gov.in/",
    lastVerified: "2026-11-03",
    verificationStatus: "Verified",
    title: {
      en: "PM Vishwakarma Artisan Support",
      hi: "पीएम विश्वकर्मा कारीगर योजना",
      mr: "पीएम विश्वकर्मा कारागीर योजना"
    },
    shortDesc: {
      en: "Recognition, skill training, ₹15,000 toolkit grant, and collateral-free credit for traditional rural artisans.",
      hi: "पारंपरिक कारीगरों को प्रशिक्षण, ₹15,000 टूलकिट सहायता व सस्ता ऋण।",
      mr: "पारंपरिक कारागिरांना कौशल्य प्रशिक्षण, ₹15,000 टूलकिट अनुदान व स्वस्त कर्ज."
    },
    benefits: {
      en: "PM Vishwakarma Certificate + ₹500/day training stipend + ₹15,000 toolkit e-voucher + loan up to ₹3 lakh at 5%.",
      hi: "पहचान पत्र, ₹500/दिन प्रशिक्षण भत्ता, ₹15,000 टूलकिट वाउचर व 5% ब्याज पर ऋण।",
      mr: "ओळखपत्र, ₹500/दिवस प्रशिक्षण भत्ता, ₹15,000 टूलकिट आणि ५% दराने कर्ज."
    },
    eligibilitySummary: {
      en: "Self-employed traditional artisans/craftspeople (18 trades: carpenter, blacksmith, potter, tailor, mason, etc.) aged 18+.",
      hi: "18 पारंपरिक व्यवसायों में कार्यरत 18+ वर्ष के स्व-रोजगार कारीगर।",
      mr: "१८ पारंपरिक व्यवसायांतील १८+ वयाचे स्वयंरोजगार कारागीर."
    },
    rules: [
      {
        id: "vk_occ",
        logic: "AND",
        question: "Are you engaged in one of the 18 traditional artisan trades (carpenter, potter, tailor, blacksmith, etc.)?",
        type: "yesno",
        operator: "boolean_yes",
        value: true
      },
      {
        id: "vk_age",
        logic: "AND",
        question: "Are you 18 years or older?",
        type: "number",
        operator: "gte",
        value: 18,
        profileField: "age"
      },
      {
        id: "vk_govt_excl",
        logic: "NOT",
        question: "Is any family member in regular Government service?",
        type: "yesno",
        operator: "boolean_yes",
        value: true
      }
    ],
    documents: [
      { id: "vk-id", name: "Official Identity & Address Proof" },
      { id: "vk-bank", name: "Savings Bank Account Details" },
      { id: "vk-ration", name: "Ration Card / Family Member Details" }
    ],
    applicationGuide: {
      method: "CSC Biometric Registration + Gram Panchayat Verification",
      portalName: "pmvishwakarma.gov.in",
      helpline: "1800-267-7777",
      steps: [
        "Visit your nearest Common Service Centre (CSC) for artisan registration.",
        "Complete Gram Panchayat / ULB verification of your trade.",
        "Attend 5-day basic skill training to unlock toolkit voucher."
      ]
    }
  },
  {
    id: "sukanya-samriddhi",
    code: "SSY",
    category: "Skill & Savings",
    level: "Central",
    state: "All India",
    targetBeneficiaries: "Women & Girls",
    department: "Ministry of Finance (India Post / Banks)",
    officialUrl: "https://www.indiapost.gov.in/",
    lastVerified: "2026-10-28",
    verificationStatus: "Verified",
    title: {
      en: "Sukanya Samriddhi Yojana (Girl Child Savings)",
      hi: "सुकन्या समृद्धि योजना (बालिका बचत)",
      mr: "सुकन्या समृद्धी योजना (मुलगी बचत)"
    },
    shortDesc: {
      en: "High-interest government-backed savings scheme for a girl child's future education and marriage expenses.",
      hi: "बेटी की उच्च शिक्षा व भविष्य के लिए उच्च ब्याज वाली सरकारी बचत योजना।",
      mr: "मुलीच्या उच्च शिक्षणासाठी व भविष्यासाठी उच्च व्याजदराची सरकारी बचत योजना."
    },
    benefits: {
      en: "8.2% p.a. tax-free compounded interest; start with just ₹250/year at any Post Office or bank.",
      hi: "8.2% वार्षिक कर-मुक्त ब्याज; डाकघर या बैंक में मात्र ₹250 से खाता शुरू करें।",
      mr: "८.२% वार्षिक करमुक्त व्याज; पोस्ट ऑफिस किंवा बँकेत फक्त ₹250 पासून सुरुवात."
    },
    eligibilitySummary: {
      en: "Parents/guardians of a girl child below 10 years of age (max 2 accounts per family).",
      hi: "10 वर्ष से कम आयु की बालिका के माता-पिता / अभिभावक (अधिकतम 2 बेटियां)।",
      mr: "१० वर्षांखालील मुलीचे पालक (एका कुटुंबात कमाल २ मुलींसाठी)."
    },
    rules: [
      {
        id: "ssy_girl",
        logic: "AND",
        question: "Are you opening the account for a girl child under 10 years of age?",
        type: "yesno",
        operator: "boolean_yes",
        value: true
      },
      {
        id: "ssy_res",
        logic: "AND",
        question: "Is the girl child a resident Indian citizen?",
        type: "yesno",
        operator: "boolean_yes",
        value: true
      }
    ],
    documents: [
      { id: "ssy-birth", name: "Girl Child Birth Certificate" },
      { id: "ssy-parent", name: "Parent / Guardian Identity & Address Proof" },
      { id: "ssy-deposit", name: "Initial Deposit (minimum ₹250)" }
    ],
    applicationGuide: {
      method: "Offline at nearest Post Office or Authorized Public/Private Bank",
      portalName: "indiapost.gov.in",
      helpline: "1800-266-6868",
      steps: [
        "Collect SSY account opening form from your village Post Office or bank branch.",
        "Attach girl child's birth certificate and guardian identity/address proof.",
        "Deposit minimum ₹250 and preserve the passbook account number."
      ]
    }
  },
  {
    id: "namo-shetkari-mh",
    code: "NSMNY-MH",
    category: "Agriculture",
    level: "State",
    state: "Maharashtra",
    targetBeneficiaries: "Farmers",
    department: "Department of Agriculture, Govt of Maharashtra",
    officialUrl: "https://mahadbt.maharashtra.gov.in/",
    lastVerified: "2026-11-06",
    verificationStatus: "Verified",
    title: {
      en: "Namo Shetkari Mahasanman Nidhi (Maharashtra)",
      hi: "नमो शेतकरी महासम्मान निधि (महाराष्ट्र)",
      mr: "नमो शेतकरी महासन्मान निधी (महाराष्ट्र)"
    },
    shortDesc: {
      en: "Additional ₹6,000/year Maharashtra State top-up over PM-KISAN — total ₹12,000/year for eligible farmers.",
      hi: "महाराष्ट्र के पात्र किसानों को पीएम-किसान के अतिरिक्त ₹6,000 प्रति वर्ष राज्य सहायता।",
      mr: "महाराष्ट्रातील पात्र शेतकऱ्यांना पीएम-किसान व्यतिरिक्त राज्य शासनाकडून ₹6,000 प्रति वर्ष मदत."
    },
    benefits: {
      en: "₹6,000/year from Maharashtra Govt (combined ₹12,000/year with PM-KISAN).",
      hi: "महाराष्ट्र सरकार से ₹6,000/वर्ष (पीएम-किसान के साथ कुल ₹12,000/वर्ष)।",
      mr: "राज्य शासनाकडून ₹6,000/वर्ष (पीएम-किसानसह एकूण ₹12,000/वर्ष)."
    },
    eligibilitySummary: {
      en: "Farmers domiciled in Maharashtra who are active verified beneficiaries under PM-KISAN.",
      hi: "महाराष्ट्र के मूल निवासी किसान जो पीएम-किसान के सक्रिय लाभार्थी हैं।",
      mr: "महाराष्ट्रातील रहिवासी शेतकरी जे पीएम-किसान योजनेचे सक्रिय लाभार्थी आहेत."
    },
    rules: [
      {
        id: "nsm_state",
        logic: "AND",
        question: "Is your agricultural land & residence in Maharashtra?",
        type: "select",
        options: ["Maharashtra", "Madhya Pradesh", "Chhattisgarh", "Other"],
        operator: "eq",
        value: "Maharashtra",
        profileField: "state"
      },
      {
        id: "nsm_pmk",
        logic: "AND",
        question: "Are you an active verified beneficiary under PM-KISAN?",
        type: "yesno",
        operator: "boolean_yes",
        value: true
      }
    ],
    documents: [
      { id: "nsm-pmk", name: "PM-KISAN Registration ID" },
      { id: "nsm-712", name: "Maharashtra 7/12 (Satbara) & 8A Land Extract" },
      { id: "nsm-bank", name: "DBT-Enabled Bank Account" }
    ],
    applicationGuide: {
      method: "Auto-linked via PM-KISAN / MahaDBT Farmer Portal",
      portalName: "mahadbt.maharashtra.gov.in",
      helpline: "1800-120-8040",
      steps: [
        "Ensure your PM-KISAN registration and e-KYC are active and verified.",
        "Verify your Maharashtra 7/12 land records match your registered farmer name.",
        "Check installment status on the MahaDBT / Namo Shetkari farmer portal."
      ]
    }
  },
  {
    id: "majhi-ladki-bahin-mh",
    code: "MLBY-MH",
    category: "Women Welfare",
    level: "State",
    state: "Maharashtra",
    targetBeneficiaries: "Women & Girls",
    department: "Women & Child Development Dept, Maharashtra",
    officialUrl: "https://ladakibahin.maharashtra.gov.in/",
    lastVerified: "2026-10-20",
    verificationStatus: "Needs Review",
    title: {
      en: "Mukhyamantri Majhi Ladki Bahin Yojana (MH)",
      hi: "मुख्यमंत्री माझी लाडकी बहीण योजना (महाराष्ट्र)",
      mr: "मुख्यमंत्री माझी लाडकी बहीण योजना (महाराष्ट्र)"
    },
    shortDesc: {
      en: "Monthly financial independence support of ₹1,500 for eligible women aged 21–65 in Maharashtra.",
      hi: "महाराष्ट्र की 21–65 वर्ष की पात्र महिलाओं को ₹1,500 प्रतिमाह आर्थिक सहायता।",
      mr: "महाराष्ट्रातील २१ ते ६५ वयोगटातील पात्र महिलांना दरमहा ₹1,500 आर्थिक मदत."
    },
    benefits: {
      en: "₹1,500 per month transferred directly to the beneficiary's DBT-linked bank account.",
      hi: "₹1,500 प्रतिमाह सीधे लाभार्थी के बैंक खाते में।",
      mr: "दरमहा ₹1,500 थेट लाभार्थी महिलेच्या बँक खात्यात."
    },
    eligibilitySummary: {
      en: "Women aged 21–65 domiciled in Maharashtra with family income <= ₹2.5 lakh/year.",
      hi: "महाराष्ट्र निवासी 21–65 वर्ष की महिलाएं जिनकी पारिवारिक आय ₹2.5 लाख से कम हो।",
      mr: "महाराष्ट्रातील २१–६५ वयोगटातील महिला ज्यांचे कौटुंबिक उत्पन्न ₹2.5 लाखांपेक्षा कमी आहे."
    },
    rules: [
      {
        id: "ml_gender",
        logic: "AND",
        question: "Is the applicant Female?",
        type: "select",
        options: ["Female", "Male", "Other"],
        operator: "eq",
        value: "Female",
        profileField: "gender"
      },
      {
        id: "ml_state",
        logic: "AND",
        question: "Is the applicant domiciled in Maharashtra?",
        type: "select",
        options: ["Maharashtra", "Madhya Pradesh", "Chhattisgarh", "Other"],
        operator: "eq",
        value: "Maharashtra",
        profileField: "state"
      },
      {
        id: "ml_age_min",
        logic: "AND",
        question: "Is the applicant aged 21 years or older?",
        type: "number",
        operator: "gte",
        value: 21,
        profileField: "age"
      },
      {
        id: "ml_age_max",
        logic: "AND",
        question: "Is the applicant aged 65 years or younger?",
        type: "number",
        operator: "lte",
        value: 65,
        profileField: "age"
      },
      {
        id: "ml_income",
        logic: "AND",
        question: "Is annual family income ₹2,50,000 or less?",
        type: "number",
        operator: "lte",
        value: 250000,
        profileField: "income"
      }
    ],
    documents: [
      { id: "ml-domicile", name: "Maharashtra Domicile / Ration Card / Voter ID" },
      { id: "ml-income", name: "Income Certificate / Yellow or Orange Ration Card" },
      { id: "ml-bank", name: "DBT-Enabled Individual Bank Account" }
    ],
    applicationGuide: {
      method: "Anganwadi / Setu Kendra / Nari Shakti Doot App / Official Portal",
      portalName: "ladakibahin.maharashtra.gov.in",
      helpline: "181",
      steps: [
        "Verify domicile and income eligibility documents.",
        "Apply via Setu / Anganwadi worker or official state portal.",
        "Record your Application Receipt Number for tracking."
      ]
    }
  }
];
