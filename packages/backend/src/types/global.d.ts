declare global {
  type JSONPrimitive = string | number | boolean | null;

  type JSONValue = JSONPrimitive | JSONObject | JSONArray;

  interface JSONObject {
    [key: string]: JSONValue;
  }

  interface JSONArray extends Array<JSONValue> {}
}
export {};
