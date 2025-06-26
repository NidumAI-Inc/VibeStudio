import { generateNumberArray } from "@/utils"

import { Skeleton } from "@/components/ui/skeleton"

function Loader() {
  return generateNumberArray(20).map((i) => (
    <tr key={i}>
      <td className="py-2 px-4">
        <div className="df">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-40" />
        </div>
      </td>

      <td className="py-2 px-4">
        <Skeleton className="h-4 w-16" />
      </td>

      <td className="py-2 px-4">
        <Skeleton className="h-4 w-36" />
      </td>
    </tr>
  ))
}

export default Loader
