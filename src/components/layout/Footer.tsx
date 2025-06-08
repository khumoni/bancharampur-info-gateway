
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";

export const Footer = () => {
  const { language } = useApp();

  const emergencyNumbers = [
    { label: language === 'bn' ? "ফায়ার সার্ভিস" : "Fire Service", number: "১৯৯" },
    { label: language === 'bn' ? "পুলিশ" : "Police", number: "৯৯৯" },
    { label: language === 'bn' ? "অ্যাম্বুলেন্স" : "Ambulance", number: "১১৯৬" },
    { label: language === 'bn' ? "জাতীয় হেল্পলাইন" : "National Helpline", number: "৩৩৩" },
  ];

  const quickLinks = language === 'bn' ? [
    "উপজেলা প্রশাসন",
    "ডিজিটাল সেন্টার",
    "স্বাস্থ্য কমপ্লেক্স",
    "শিক্ষা বোর্ড",
    "কৃষি অফিস",
    "পোস্ট অফিস",
  ] : [
    "Upazila Administration",
    "Digital Center",
    "Health Complex",
    "Education Board",
    "Agriculture Office",
    "Post Office",
  ];

  const services = language === 'bn' ? [
    "জরুরি বিজ্ঞপ্তি",
    "স্থানীয় সংবাদ",
    "প্রশ্নোত্তর",
    "চাকরির তথ্য",
    "বাজার দর",
    "পরিবহন তথ্য",
  ] : [
    "Emergency Notices",
    "Local News",
    "Q&A",
    "Job Information",
    "Market Rates",
    "Transport Information",
  ];

  return (
    <footer className="bg-gradient-to-r from-green-800 to-blue-800 text-white">
      {/* Emergency Numbers */}
      <div className="bg-red-600 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {emergencyNumbers.map((item) => (
              <div key={item.number} className="flex items-center space-x-2 bg-red-700 px-4 py-2 rounded-lg">
                <Phone className="h-4 w-4" />
                <span className="font-medium">{item.label}:</span>
                <span className="font-bold">{item.number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t("siteName", language)}</h3>
            <p className="text-green-100 mb-4">
              {language === 'bn' 
                ? "স্থানীয় তথ্য, জরুরি বিজ্ঞপ্তি এবং সামাজিক যোগাযোগের একমাত্র ডিজিটাল প্ল্যাটফর্ম।"
                : "The only digital platform for local information, emergency notices and social communication."
              }
            </p>
            <div className="flex space-x-3">
              <Button size="sm" variant="secondary" className="p-2">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="p-2">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="p-2">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {language === 'bn' ? "দ্রুত লিংক" : "Quick Links"}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-green-100 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {language === 'bn' ? "সেবাসমূহ" : "Services"}
            </h3>
            <ul className="space-y-2 text-green-100">
              {services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {language === 'bn' ? "যোগাযোগ" : "Contact"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-green-100">
                <MapPin className="h-4 w-4" />
                <span>{language === 'bn' ? "বাঁচারামপুর, ব্রাহ্মণবাড়িয়া" : "Bancharampur, Brahmanbaria"}</span>
              </div>
              <div className="flex items-center space-x-2 text-green-100">
                <Phone className="h-4 w-4" />
                <span>০৮৫১-৫৬৭৮৯</span>
              </div>
              <div className="flex items-center space-x-2 text-green-100">
                <Mail className="h-4 w-4" />
                <span>info@bancharampur.gov.bd</span>
              </div>
            </div>
          </div>

          {/* Admin Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t("contactInfo", language)}</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-green-200 mb-2">{t("adminEmail", language)}:</h4>
                <a 
                  href="mailto:mdaytullaalkhumoni@gmail.com" 
                  className="text-green-100 hover:text-white transition-colors break-all"
                >
                  mdaytullaalkhumoni@gmail.com
                </a>
              </div>
              <div>
                <h4 className="font-medium text-green-200 mb-2">{t("adminPhone", language)}:</h4>
                <a 
                  href="tel:+8801962396959" 
                  className="text-green-100 hover:text-white transition-colors"
                >
                  +৮৮০১৯৬২৩৯৬৯৫৯
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-700 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-green-100">
            {language === 'bn' 
              ? "© ২০২৪ বাঁচারামপুর ডিজিটাল ইনফোগেট। সকল অধিকার সংরক্ষিত।"
              : "© 2024 Bancharampur Digital Infogate. All rights reserved."
            }
          </p>
        </div>
      </div>
    </footer>
  );
};
