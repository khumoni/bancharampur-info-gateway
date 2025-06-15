
import { FC } from "react";
import { useApp } from "@/contexts/AppContext";

export const HeroSection: FC = () => {
  const { language } = useApp();
  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 mb-4">
            {language === "bn"
              ? "বাংচারামপুর মার্কেটপ্লেস"
              : "Bancharampur Marketplace"}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {language === "bn"
              ? "স্থানীয় ক্রয়-বিক্রয় এবং সেবার জন্য আপনার বিশ্বস্ত স্থান"
              : "Your trusted place for local buying, selling, and services"}
          </p>
        </div>
      </div>
    </section>
  );
};
