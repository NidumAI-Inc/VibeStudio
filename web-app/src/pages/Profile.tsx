
import ProfileHeader from '@/components/profile/ProfileHeader';
import AccountInfoCard from '@/components/profile/AccountInfoCard';
import PasswordUpdateCard from '@/components/profile/PasswordUpdateCard';
import DangerZoneCard from '@/components/profile/DangerZoneCard';
import CostTrackingCard from '@/components/profile/CostTrackingCard';

const Profile = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-4xl mx-auto p-6">
        <ProfileHeader />

        <div className="grid gap-6 lg:grid-cols-2">
          <AccountInfoCard />
          <PasswordUpdateCard />
        </div>

        <div className="mt-6">
          <CostTrackingCard />
        </div>

        <DangerZoneCard />
      </div>
    </div>
  );
};

export default Profile;
