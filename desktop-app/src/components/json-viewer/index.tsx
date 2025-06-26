import type { JsonValue } from "./type";

import ObjectViewer from "./object-viewer";
import ArrayViewer from "./array-viewer";
import KeyVal from "./key-val";

type props = {
  data: JsonValue;
}

function JsonViewer({ data }: props) {
  return Object.entries(data).map(([key, value]) => {
    if (value === null || typeof value !== "object") {
      return <KeyVal keyName={key} value={value === null ? "null" : String(value)} />
    }

    if (Array.isArray(value)) {
      return <ArrayViewer data={value} name={key} />
    }

    return <ObjectViewer data={value} name={key} />
  })
}

export default JsonViewer
