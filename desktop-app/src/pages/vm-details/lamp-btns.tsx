import { useLampActions, useLampStatus } from "@/hooks/use-vm"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type propsT = {
  id: string
  port: number
  statusPort: number
}

function LampBtns({ id, port, statusPort }: propsT) {
  const { data, isLoading } = useLampStatus(id, statusPort)
  const { mutate, isPending } = useLampActions(id, port)

  const disabled = isLoading || isPending

  return (
    <Card className="flex-row items-center p-4 mt-4">
      <h3 className="flex-1 text-lg font-semibold">LAMP Server</h3>
      {
        data?.isLive ? (
          <>
            <Button
              onClick={() => mutate('restart')}
              disabled={disabled}
            >
              Restart
            </Button>

            <Button
              variant='destructive'
              onClick={() => mutate('stop')}
              disabled={disabled}
            >
              Stop
            </Button>
          </>
        ) : (
          <Button
            onClick={() => mutate('start')}
            disabled={disabled}
          >
            Start
          </Button>
        )
      }
    </Card>
  )
}

export default LampBtns
