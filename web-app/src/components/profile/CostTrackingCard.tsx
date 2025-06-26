/**
 * Cost Tracking Card Component
 *
 * This component displays the user's API usage costs and spending breakdown.
 * It shows total costs and per-stream breakdowns to help users monitor their spending.
 *
 * Key Features:
 * - Fetches and displays total cost data
 * - Shows per-stream cost breakdown in a table
 * - Handles usage limit exceeded scenarios
 * - Provides manual refresh functionality
 * - Uses Zustand for authentication state
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DollarSign, RefreshCw } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { apiService } from '@/services/api'
import { useAuthStore } from '@/store/authStore' // Zustand store for auth state
import { useToast } from '@/hooks/use-toast'

// TypeScript interface for cost data structure
interface CostData {
  totalCost: number // Total cost across all streams
  streamCosts?: Record<string, number> // Per-stream cost breakdown
  result?: string // API response status
}

const CostTrackingCard = () => {
  // Get user data from custom auth hook (for compatibility)
  const { user } = useAuth()

  // Get authentication data from Zustand store
  const { token, userId } = useAuthStore()

  // Toast hook for user notifications
  const { toast } = useToast()

  // Component state for cost data and loading status
  const [costData, setCostData] = useState<CostData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Fetch cost data from the API
   *
   * Makes an authenticated request to get the user's total costs
   * and per-stream breakdown. Handles various response scenarios.
   */
  const fetchCostData = async () => {
    // Validate authentication before making API call
    if (!userId || !token) {
      // console.log('❌ No user ID or token available');
      return
    }

    setIsLoading(true)
    try {
      // console.log('📊 Fetching cost data for user ID:', userId);

      // Make authenticated API call to get cost data
      const response = await apiService.getUserTotalCost(userId, token)
      // console.log('📊 Cost data response:', response);

      // Handle special case where user has exceeded usage limits
      if (response.result === 'LIMIT_EXCEEDED') {
        toast({
          title: 'Usage Limit Exceeded',
          description: 'Your usage limit has been exceeded.',
          variant: 'destructive',
        })
      } else {
        // Process and format the cost data for display
        const costData: CostData = {
          totalCost: response.totalCost || 0,
          streamCosts: response.streamCosts || {},
          result: response.result || 'OK',
        }
        // console.log('✅ Setting cost data:', costData);
        setCostData(costData)
      }
    } catch (error) {
      // console.error('❌ Failed to fetch cost data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load cost data',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch cost data when component mounts or auth state changes
  useEffect(() => {
    fetchCostData()
  }, [userId, token])

  return (
    <Card className='bg-white border-gray-200'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            {/* Card title with dollar sign icon */}
            <CardTitle className='text-black flex items-center gap-2'>
              <DollarSign className='w-5 h-5 text-blue-500' />
              Usage & Costs
            </CardTitle>
            <CardDescription className='text-gray-600'>Track your API usage and associated costs</CardDescription>
          </div>

          {/* Refresh button to manually reload cost data */}
          <Button
            variant='outline'
            size='sm'
            onClick={fetchCostData}
            disabled={isLoading}
            className='border-gray-200 hover:bg-gray-50 text-black'>
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {costData ? (
          <>
            {/* Total cost display section */}
            <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
              <div className='text-sm text-gray-600'>Total Cost</div>
              <div className='text-2xl font-bold text-blue-600'>${costData.totalCost.toFixed(4)}</div>
            </div>

            {/* Per-stream breakdown table (only shown if there are stream costs) */}
            {costData.streamCosts && Object.keys(costData.streamCosts).length > 0 && (
              <div>
                <h4 className='text-black font-medium mb-3'>Per-Stream Breakdown</h4>
                <div className='rounded-md border border-gray-200'>
                  <Table>
                    <TableHeader>
                      <TableRow className='border-gray-200'>
                        <TableHead className='text-black'>Stream ID</TableHead>
                        <TableHead className='text-black text-right'>Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Map through each stream cost and display in table rows */}
                      {Object.entries(costData.streamCosts).map(([streamId, cost]) => (
                        <TableRow key={streamId} className='border-gray-200'>
                          <TableCell className='text-gray-600 font-mono text-sm'>
                            {/* Truncate long stream IDs for better display */}
                            {streamId.substring(0, 16)}...
                          </TableCell>
                          <TableCell className='text-gray-600 text-right'>${cost.toFixed(4)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </>
        ) : (
          // Loading or no data state
          <div className='text-center py-8 text-gray-600'>
            {isLoading ? 'Loading cost data...' : 'No cost data available'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CostTrackingCard
