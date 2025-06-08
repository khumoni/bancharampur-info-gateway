
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";

export const Footer = () => {
  const emergencyNumbers = [
    { label: "ফায়ার সার্ভিস", number: "১৯৯" },
    { label: "পুলিশ", number: "৯৯৯" },
    { label: "অ্যাম্বুলেন্স", number: "১১৯৬" },
    { label: "জাতীয় হেল্পলাইন", number: "৩৩৩" },
  ];

  const quickLinks = [
    "উপজেলা প্রশাসন",
    "ডিজিটাল সেন্টার",
    "স্বাস্থ্য কমপ্লেক্স",
    "শিক্ষা বোর্ড",
    "কৃষি অফিস",
    "পোস্ট অফিস",
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
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">বাঁচারামপুর ইনফোগেট</h3>
            <p className="text-green-100 mb-4">
              স্থানীয় তথ্য, জরুরি বিজ্ঞপ্তি এবং সামাজিক যোগাযোগের একমাত্র ডিজিটাল প্ল্যাটফর্ম।
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
            <h3 className="text-xl font-bold mb-4">দ্রুত লিংক</h3>
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
            <h3 className="text-xl font-bold mb-4">সেবাসমূহ</h3>
            <ul className="space-y-2 text-green-100">
              <li>জরুরি বিজ্ঞপ্তি</li>
              <li>স্থানীয় সংবাদ</li>
              <li>প্রশ্নোত্তর</li>
              <li>চাকরির তথ্য</li>
              <li>বাজার দর</li>
              <li>পরিবহন তথ্য</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">যোগাযোগ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-green-100">
                <MapPin className="h-4 w-4" />
                <span>বাঁচারামপুর, ব্রাহ্মণবাড়িয়া</span>
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
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-700 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-green-100">
            © ২০২৪ বাঁচারামপুর ডিজিটাল ইনফোগেট। সকল অধিকার সংরক্ষিত।
          </p>
        </div>
      </div>
    </footer>
  );
};
