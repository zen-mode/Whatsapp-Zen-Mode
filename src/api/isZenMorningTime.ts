import moment from "moment";
import {StateItemNames, ZEN_MORNING_HOUR} from "../data/dictionary";
import {get_extn_storage_item_value} from "../../utility-belt/helpers/extn/storage";

export async function isZenMorningTime():Promise<boolean> {
  const lastActivityDate = (await get_extn_storage_item_value(StateItemNames.LAST_ACTIVITY_DATE)) as string | undefined;
  const today = moment();
  const isMorning = today.hour() >= ZEN_MORNING_HOUR;
  if (!lastActivityDate) {
    return isMorning;
  }
  const [normalizedTodayDate, normalizedLastDate] = [today, moment(lastActivityDate)].map(date => {
    date.set('hour', ZEN_MORNING_HOUR);
    date.set('minute', 0);
    date.set('second', 0);
    date.set('millisecond', 0);

    return date;
  });

  return isMorning && normalizedTodayDate!.isAfter(normalizedLastDate);
}
