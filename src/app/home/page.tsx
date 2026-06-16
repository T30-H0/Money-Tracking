import { HomeScreen } from "@/app/home/_components/HomeScreen";
import { mockFinancialOverview } from "@/themes/finance-data";

export default function HomePage() {
  return <HomeScreen overview={mockFinancialOverview} />;
}
