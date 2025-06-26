import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type props = {
  value: number
  disabled?: boolean
  onSave?: (value: number) => void //made it optional since we commented out edit port option as for now
}

function ExposedInput({ value, onSave, disabled }: props) {
  const [exposed, setExposed] = useState(value)

  useEffect(() => {
    setExposed(value)
  }, [value])

  return (
    <>
      <Input
        type='number'
        value={exposed}
        onChange={(e) => setExposed(Number(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSave(exposed)
          }
        }}
        className='no-number-arrows w-16 border-0 outline-0 shadow-none disabled:opacity-100 ml-[2px]'
        disabled={disabled}
      />

      {value !== exposed && (
        <Button size='icon' className='size-7 p-0' onClick={() => onSave(exposed)}>
          <Check />
        </Button>
      )}
    </>
  )
}

export default ExposedInput
