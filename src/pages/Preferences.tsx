import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UserPreferences } from "@/components/personalization/UserPreferences";

const Preferences = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <UserPreferences />
      </main>

      <Footer />
    </div>
  );
};

export default Preferences;