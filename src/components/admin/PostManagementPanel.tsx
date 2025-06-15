
import { PostManager } from "@/components/admin/PostManager";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PostManagementPanel() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-3">পোস্ট ও ইউজার ব্যবস্থাপনা</h1>
      <PostManager />
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>ব্যবহারকারী ব্যবস্থাপনা (শীঘ্রই আসছে...)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-4 text-center text-gray-500">
              ব্যবহারকারী ব্যবস্থাপনা ফিচার শীঘ্রই আসছে...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
