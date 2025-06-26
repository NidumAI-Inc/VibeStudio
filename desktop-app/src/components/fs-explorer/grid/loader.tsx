import { generateNumberArray } from "@/utils"

import { Skeleton } from "@/components/ui/skeleton"

function Loader() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-6">
      {
        generateNumberArray(20).map((i) => (
          <div key={i} className="dfc gap-3 p-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-3.5 w-full" />
          </div>
        ))
      }
    </div>
  )
}

export default Loader
