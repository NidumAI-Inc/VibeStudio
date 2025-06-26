import type { JsonArray } from "./type";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import JsonViewer from "./index";
import KeyVal from "./key-val";

function ArrayViewer({ data, name }: { data: JsonArray; name: string }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="array-content">
        <AccordionTrigger className="font-medium cursor-pointer">
          {name}
        </AccordionTrigger>

        <AccordionContent>
          <div className="pl-4 border-l-2 border-gray-200">
            {data.map((item, index) => (
              <div key={index} className="py-1">
                {
                  (item !== null && typeof item === "object")
                    ? <JsonViewer data={item} />
                    : <KeyVal keyName={`${index}`} value={String(item)} />
                }
              </div>
            ))}

            {data.length === 0 && (
              <div className="text-gray-500 italic py-1">Empty array</div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default ArrayViewer
