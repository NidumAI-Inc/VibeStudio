
import HomeWrapper from '@/components/home-wrapper';
import Dashboard from './dashboard';

function Home() {
  return (
    <HomeWrapper>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">App Servers</h1>
            <p className="text-muted-foreground">Manage your App Servers and Deployments</p>
          </div>
        </div>

        <Dashboard />
      </div>
    </HomeWrapper>
  )
}

export default Home
