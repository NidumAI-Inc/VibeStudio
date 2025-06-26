import { useRef, useState } from 'react'
import { toast } from 'sonner'

function useClipboardCopy() {
  const [copied, setCopied] = useState(false)
  const selectTextRef = useRef<HTMLInputElement>(null)

  const onCopyClk = (txt: string) => {
    if (!txt) return

    navigator.clipboard.writeText(txt)
    setCopied(true)
    toast.success('Copied to clipboard')

    setTimeout(() => {
      setCopied(false)
    }, 2500)
  }

  const onTextClk = () => {
    if (selectTextRef?.current) {
      selectTextRef.current.select()
    }
  }

  return {
    copied,
    onCopyClk,
    onTextClk,
    selectTextRef,
  }
}

export default useClipboardCopy
