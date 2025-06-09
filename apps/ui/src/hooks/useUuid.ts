import { useState } from "react";
import { v4 as uuidV4 } from "uuid";

export default function useUuid(defaultUuid: string) {
  const [uuid, setUuid] = useState<string>(defaultUuid);
  const renewUuid = () => {
    const id = uuidV4();
    setUuid(id);
    return id;
  };
  const clearUuid = () => {
    setUuid("");
  };
  return { uuid, renewUuid, clearUuid };
}
