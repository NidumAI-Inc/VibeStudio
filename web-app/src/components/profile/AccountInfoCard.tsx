
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const AccountInfoCard = () => {
  const { user } = useAuth();

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-black">Account Information</CardTitle>
        <CardDescription className="text-gray-600">
          Your account details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-black">Email</Label>
          <Input
            value={user?.email || ''}
            disabled
            className="bg-gray-50 border-gray-200 text-gray-600"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-black">User ID</Label>
          <Input
            value={user?.id || ''}
            disabled
            className="bg-gray-50 border-gray-200 text-gray-600"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountInfoCard;
