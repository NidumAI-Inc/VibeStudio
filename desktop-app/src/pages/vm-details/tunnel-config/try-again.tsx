import { LuRefreshCw } from 'react-icons/lu'

import { useTunnelSetupRetry } from '@/hooks/use-tunnel'
import { Button } from '@/components/ui/button'

function TryAgain() {
  const { mutate, isPending } = useTunnelSetupRetry()

  return (
    <>
      <p className="mb-4 text-sm">
        We're working on establishing a connection between your local network and the Native Node Chain. Sometimes this
        can take a moment. Feel free to try again, and we'll do our best to get you connected.
      </p>

      <Button
        variant="secondary"
        className="flex mx-auto"
        onClick={() => mutate()}
        disabled={isPending}
      >
        <LuRefreshCw className={isPending ? "animate-spin" : ""} />
        {isPending ? "Retrying..." : "Try Again"}
      </Button>
    </>
  )
}

export default TryAgain
