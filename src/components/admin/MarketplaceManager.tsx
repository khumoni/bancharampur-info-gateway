
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketplaceApprovalTable } from "./MarketplaceApprovalTable";
import { useApp } from "@/contexts/AppContext";

interface ProductWithStatus {
  id: string;
  title: string;
  status?: "pending" | "approved" | "rejected";
  location: string;
  seller: { name: string };
  // ... রাখুন না লাগলে 
}

/**
  Temporary: Demo productStatus state client-side only!
  Production এ অবশ্যই Supabase/DB status field ব্যবহার করবেন 
*/
export function MarketplaceManager() {
  const { products } = useData();
  const { language } = useApp();

  // Client only demo: products status state
  const [productStatus, setProductStatus] = useState<Record<string, "pending" | "approved" | "rejected">>({});

  const getProductsWithStatus = () =>
    products.map((p) => ({
      ...p,
      status: productStatus[p.id] || "pending",
    }));

  const handleStatusChange = (id: string, status: "approved" | "rejected") => {
    setProductStatus((prev) => ({ ...prev, [id]: status }));
  };

  return (
    <div>
      <CardHeader>
        <CardTitle>
          {language === "bn" ? "মার্কেটপ্লেস পণ্য অনুমোদন" : "Marketplace Product Approval"}
        </CardTitle>
      </CardHeader>
      <MarketplaceApprovalTable
        products={getProductsWithStatus()}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
