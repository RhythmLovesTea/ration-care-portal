import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface UsageAnalyticsProps {
  historicalEntitlements: Array<{
    month: number;
    year: number;
    rice_total: number;
    rice_used: number;
    wheat_total: number;
    wheat_used: number;
    sugar_total: number;
    sugar_used: number;
  }>;
}

export const UsageAnalytics = ({ historicalEntitlements }: UsageAnalyticsProps) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const chartData = historicalEntitlements.map(ent => ({
    name: `${monthNames[ent.month - 1]} ${ent.year}`,
    Rice: ent.rice_used,
    Wheat: ent.wheat_used,
    Sugar: ent.sugar_used,
    riceTotal: ent.rice_total,
    wheatTotal: ent.wheat_total,
    sugarTotal: ent.sugar_total
  }));

  const usagePercentageData = historicalEntitlements.map(ent => ({
    name: `${monthNames[ent.month - 1]}`,
    Rice: Math.round((ent.rice_used / ent.rice_total) * 100),
    Wheat: Math.round((ent.wheat_used / ent.wheat_total) * 100),
    Sugar: Math.round((ent.sugar_used / ent.sugar_total) * 100)
  }));

  if (historicalEntitlements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Usage Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No historical data available yet. Start collecting rations to see your usage trends.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Usage Trends (kg)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Rice" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line type="monotone" dataKey="Wheat" stroke="hsl(var(--chart-2))" strokeWidth={2} />
              <Line type="monotone" dataKey="Sugar" stroke="hsl(var(--chart-3))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage Percentage</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usagePercentageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Bar dataKey="Rice" fill="hsl(var(--primary))" />
              <Bar dataKey="Wheat" fill="hsl(var(--chart-2))" />
              <Bar dataKey="Sugar" fill="hsl(var(--chart-3))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
