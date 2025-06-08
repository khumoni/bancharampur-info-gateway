
export const translations = {
  bn: {
    siteName: "বাঁচারামপুর ডিজিটাল ইনফোগেট",
    tagline: "আপনার প্রয়োজনীয় তথ্য এক জায়গায়",
    joinUs: "যোগ দিন",
    viewMap: "মানচিত্র দেখুন",
    emergencyNotices: "জরুরি বিজ্ঞপ্তি",
    quickServices: "দ্রুত সেবা",
    communityFeed: "কমিউনিটি ফিড",
    home: "হোম",
    notices: "বিজ্ঞপ্তি",
    map: "মানচিত্র",
    social: "সামাজিক",
    qa: "প্রশ্নোত্তর",
    jobs: "চাকরি",
    login: "লগইন",
    register: "রেজিস্টার",
    profile: "প্রোফাইল",
    admin: "অ্যাডমিন",
    contactInfo: "যোগাযোগের তথ্য",
    adminEmail: "অ্যাডমিন ইমেইল",
    adminPhone: "অ্যাডমিন ফোন",
    language: "ভাষা",
    darkMode: "ডার্ক মোড",
    settings: "সেটিংস"
  },
  en: {
    siteName: "Bancharampur Digital Infogate",
    tagline: "All your essential information in one place",
    joinUs: "Join Us",
    viewMap: "View Map",
    emergencyNotices: "Emergency Notices",
    quickServices: "Quick Services",
    communityFeed: "Community Feed",
    home: "Home",
    notices: "Notices",
    map: "Map",
    social: "Social",
    qa: "Q&A",
    jobs: "Jobs",
    login: "Login",
    register: "Register",
    profile: "Profile",
    admin: "Admin",
    contactInfo: "Contact Information",
    adminEmail: "Admin Email",
    adminPhone: "Admin Phone",
    language: "Language",
    darkMode: "Dark Mode",
    settings: "Settings"
  }
};

export const t = (key: keyof typeof translations.bn, language: 'bn' | 'en' = 'bn') => {
  return translations[language][key] || translations.bn[key];
};
