import { useState } from 'react'
import { FileText, User, BarChart, ArrowLeft } from "lucide-react"
import { useNavigate } from 'react-router-dom'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'

import HomeWrapper from '@/components/home-wrapper'
import Overview from './overview'
import Billing from './billing'
import Usage from './usage'

function Profile() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('overview')

  return (
    <HomeWrapper>
      <Button
        size='sm'
        variant='ghost'
        onClick={() => navigate('/')}
        className='mb-4 hover:bg-white'
      >
        <ArrowLeft /> Back to dashboard
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">User Profile</h1>
          <p className="text-muted-foreground">Manage your account and check resource usage</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="overview">
            <User className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>

          <TabsTrigger value="usage">
            <BarChart className="h-4 w-4 mr-2" />
            Usage
          </TabsTrigger>

          <TabsTrigger value="billing">
            <FileText className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Overview />
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Usage />
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Billing />
        </TabsContent>
      </Tabs>
    </HomeWrapper>
  )
}

export default Profile
