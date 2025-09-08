import { auth } from '@/lib/auth';
import { forbidden } from 'next/navigation';
import ProviderOverviewCard from '@/app/admin/dashboard/provider-overview-card';
import ArtistOverviewCard from '@/app/admin/dashboard/artist-overview-card';

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.role.includes('ADMINISTRATOR')) {
    forbidden();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <ProviderOverviewCard />
      <ArtistOverviewCard />
    </div>
  );
}
