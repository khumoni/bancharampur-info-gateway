
import { MarketRateManager } from "@/components/admin/MarketRateManager";

export function MarketRatePanel() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-3">বাজারদর ব্যবস্থাপনা</h1>
      <MarketRateManager />
    </div>
  );
}
