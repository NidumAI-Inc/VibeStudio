import type { JsonObject } from "./type";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import JsonViewer from "./index";
import KeyVal from "./key-val";

function ObjectViewer({ data, name }: { data: JsonObject; name: string }) {
  const entries = Object.entries(data)

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="object-content">
        <AccordionTrigger className="font-medium cursor-pointer">
          {name}
        </AccordionTrigger>

        <AccordionContent>
          <div className="pl-4 border-l-2 border-gray-200">
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default ObjectViewer
