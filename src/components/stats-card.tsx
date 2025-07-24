import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium text-gray-600 text-sm">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-gray-600" />
      </CardHeader>
      <CardContent>
        <div className="font-bold text-2xl">{value}</div>
        {change && <p className="mt-1 text-gray-600 text-xs">{change}</p>}
      </CardContent>
    </Card>
  );
}
