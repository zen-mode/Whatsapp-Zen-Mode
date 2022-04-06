import "../../features/user-can/read-release-notes/read-release-notes-bgs";
import "../../features/extension-can/activate-extn-icon-on-specific-page/activate-extn-icon";
import "../../features/state-machine/state-machine-bgs";
import "../../whatsapp/BackgroundBridge";
import { VisibilitySheduler } from "../../whatsapp/VisibilitySheduler";
import { logger } from "../../whatsapp/StorageLogger";

new VisibilitySheduler();


window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  const payload = {
    errorMsg,
    url,
    lineNumber,
    column,
    errorObj,
  };
  logger.log("ERROR", "Caught background script error", payload);

  return true;
};


