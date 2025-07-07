import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export const AdminAIAccessDenied = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
      <Card className="w-full max-w-md shadow-xl border-0 glass-morphism animate-scale-in">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-3 text-xl">
            <div className="p-3 bg-destructive/10 rounded-full">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
            <span className="text-destructive">অ্যাক্সেস অস্বীকৃত</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            এই ড্যাশবোর্ড অ্যাক্সেস করতে আপনার এডমিন অনুমতি প্রয়োজন।
          </p>
        </CardContent>
      </Card>
    </div>
  );
};