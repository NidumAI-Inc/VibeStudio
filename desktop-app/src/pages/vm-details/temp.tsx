import type { JsonObject, JsonValue } from "@/components/json-viewer/type";

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
    <div className="mb-4">
      <div className="mb-0.5">{keyName}</div>
      <CopyText keyName={value} />
    </div>
  )
}

function ObjectViewer({ data, name }: { data: JsonObject; name: string }) {
  const entries = Object.entries(data)

  return (
    <div className="mb-4 p-4 border border-gray-200 rounded-md">
      <div className="mb-2 font-medium">{name}</div>

      {entries.map(([key, value], index) => (
        <div key={key + index} className="py-1">
          {
            (value !== null && typeof value === "object")
              ? <JsonViewer data={value} />
              : <KeyVal keyName={key} value={String(value)} />
          }
        </div>
      ))}
      {entries.length === 0 && (
        <div className="text-gray-500 italic py-1">Empty object</div>
      )}
    </div>
  )
}

type props = {
  data: JsonValue;
}

function JsonViewer({ data }: props) {
  return Object.entries(data).map(([key, value]) => {
    if (value === null || typeof value !== "object") {
      return <KeyVal keyName={key} value={value === null ? "null" : String(value)} />
    }

    return <ObjectViewer data={value} name={key} />
  })
}

export default JsonViewer