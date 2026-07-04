import { getRelay } from "$lib/config";
import { isValid, parse } from "date-fns";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params, url }) => {
  const info = getRelay(params.relay);

  const dateParam = url.searchParams.get("d");
  let date: string | null = null;
  if (dateParam) {
    const parsed = parse(dateParam, "yyyyMMdd", new Date());
    if (isValid(parsed)) {
      date = dateParam;
    } else {
      console.error("Invalid date parameter:", dateParam);
    }
  }

  return {
    relayKey: params.relay,
    info,
    date,
  };
};
