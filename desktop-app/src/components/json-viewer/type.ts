
export type Primitive = string | number | boolean | null | undefined
export type JsonObject = { [key: string]: JsonValue }
export type JsonArray = JsonValue[]
export type JsonValue = Primitive | JsonObject | JsonArray
