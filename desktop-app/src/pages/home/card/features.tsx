
import { Badge } from "@/components/ui/badge";

interface VMFeature {
  name: string;
  description: string;
  status: 'active' | 'inactive';
  endpoint?: string;
}

interface props {
  features: VMFeature[];
}

const VMFeatures = ({ features }: props) => {
  if (!features || features.length === 0) return null;

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium mb-2">Features & APIs</h4>
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">{feature.name}</span>
              <Badge variant={feature.status === 'active' ? 'default' : 'secondary'}>
                {feature.status}
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs mt-1">{feature.description}</p>
            {feature.endpoint && (
              <code className="text-xs bg-muted p-1 rounded mt-1 block">
                {feature.endpoint}
              </code>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VMFeatures;
