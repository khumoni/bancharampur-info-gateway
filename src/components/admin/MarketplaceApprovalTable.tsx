
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/marketplace/types";
import { useApp } from "@/contexts/AppContext";

type ProductForApproval = Product & { status?: "pending" | "approved" | "rejected" };

interface MarketplaceApprovalTableProps {
  products: ProductForApproval[];
  onStatusChange: (id: string, status: "approved" | "rejected") => void;
}

export function MarketplaceApprovalTable({ products, onStatusChange }: MarketplaceApprovalTableProps) {
  const { language } = useApp();

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">{language === "bn" ? "শিরোনাম" : "Title"}</th>
                <th className="py-2 px-2 border-b">{language === "bn" ? "বিক্রেতা" : "Seller"}</th>
                <th className="py-2 px-2 border-b">{language === "bn" ? "অবস্থা" : "Status"}</th>
                <th className="py-2 px-2 border-b">{language === "bn" ? "লোকেশন" : "Location"}</th>
                <th className="py-2 px-2 border-b">{language === "bn" ? "অ্যাকশন" : "Action"}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-accent">
                  <td className="py-2 px-4 border-b">{prod.title}</td>
                  <td className="py-2 px-2 border-b">{prod.seller.name}</td>
                  <td className="py-2 px-2 border-b">
                    <Badge variant={prod.status === "approved" ? "default" : prod.status === "pending" ? "secondary" : "destructive"}>
                      {prod.status === "approved"
                        ? (language === "bn" ? "অনুমোদিত" : "Approved")
                        : prod.status === "rejected"
                        ? (language === "bn" ? "বাতিল" : "Rejected")
                        : (language === "bn" ? "অপেক্ষমাণ" : "Pending")}
                    </Badge>
                  </td>
                  <td className="py-2 px-2 border-b">{prod.location}</td>
                  <td className="py-2 px-2 border-b space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={prod.status === "approved"}
                      onClick={() => onStatusChange(prod.id, "approved")}
                    >
                      {language === "bn" ? "অনুমোদন" : "Approve"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={prod.status === "rejected"}
                      onClick={() => onStatusChange(prod.id, "rejected")}
                    >
                      {language === "bn" ? "বাতিল" : "Reject"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              {language === "bn" ? "কোনো পণ্য নেই" : "No products"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
