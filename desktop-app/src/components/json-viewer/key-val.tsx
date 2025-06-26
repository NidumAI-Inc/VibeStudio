import { Check, Copy } from "lucide-react";

import useClipboardCopy from "@/hooks/use-clipboard-copy";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function CopyText({ keyName }: { keyName: string }) {
  const { copied, selectTextRef, onTextClk, onCopyClk } = useClipboardCopy()

  return (
    <div className="relative">
      <Input
        readOnly
        ref={selectTextRef}
        type="text"
        value={keyName}
        onClick={onTextClk}
        className="pr-10"
      />

      <Button
        size="icon"
        variant="ghost"
        onClick={() => onCopyClk(keyName)}
        className="absolute top-1/2 right-0 -translate-y-1/2 text-gray-400"
      >
        {copied ? <Check /> : <Copy />}
      </Button>
    </div>
  )
}

function KeyVal({ keyName, value }: { keyName: string; value: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <CopyText keyName={keyName} />
      <CopyText keyName={value} />
    </div>
  )
}

export default KeyVal
