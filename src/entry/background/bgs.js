import "../../features/user-can/read-release-notes/read-release-notes-bgs";
import "../../features/extension-can/activate-extn-icon-on-specific-page/activate-extn-icon";
import "../../features/state-machine/state-machine-bgs";
import "../../whatsapp/BackgroundBridge";

import { HiddenChatDaemon, SCHEDULE_MODE } from "../../whatsapp/HiddenScheduler";
const d = new HiddenChatDaemon();
d.forseUpdate();
d.setChat('79062267189-1537273735@g.us', SCHEDULE_MODE.ALL_DAYS);

d.setChat('79119122203@c.us', SCHEDULE_MODE.BY_DAY, {
    monday: true, tuesday: true, wednesday: false, thursday: true,
    friday: true, saturday: true, sunday: true
});

d.setChat('79788589408@c.us', SCHEDULE_MODE.CUSTOM_PERIOD, {
   monday: [0,0], tuesday: [0,0], wednesday: [0,0], thursday: [0,0],
   friday: [0,0], saturday: [0,0], sunday: [0,0]
});
