import "../../features/user-can/read-release-notes/read-release-notes-bgs";
import "../../features/extension-can/activate-extn-icon-on-specific-page/activate-extn-icon";
import "../../features/state-machine/state-machine-bgs";
import "../../whatsapp/BackgroundBridge";

import { HiddenChatDaemon, DayOfTheWeek, VisibilityShedule, WeekShedule } from "../../whatsapp/HiddenScheduler";
const d = new HiddenChatDaemon();
// d.updateChatsVisibility();

// d.setChat('120363040944507914@g.us', SCHEDULE_MODE.ALL_DAYS);

const testShedule =  {
        [DayOfTheWeek.MON]: [480, 1260],
        [DayOfTheWeek.TUE]: [480, 1260],
        [DayOfTheWeek.WED]: [480, 1260],
        [DayOfTheWeek.THU]: [480, 1260],
        [DayOfTheWeek.FRI]: [480, 1260],
        [DayOfTheWeek.SAT]: [480, 540],
        [DayOfTheWeek.SUN]: [480, 540],
    }
console.log("testShedule", testShedule);
d.setShedule('120363040944507914@g.us', testShedule);

// d.setChat('79119122203@c.us', SCHEDULE_MODE.BY_DAY, {
//     monday: true, tuesday: true, wednesday: false, thursday: true,
//     friday: true, saturday: true, sunday: true
// });

// d.setChat('79788589408@c.us', SCHEDULE_MODE.CUSTOM_PERIOD, {
//    monday: [0,0], tuesday: [0,0], wednesday: [0,0], thursday: [0,0],
//    friday: [0,0], saturday: [0,0], sunday: [0,0]
// });
