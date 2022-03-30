import "../../features/user-can/read-release-notes/read-release-notes-bgs";
import "../../features/extension-can/activate-extn-icon-on-specific-page/activate-extn-icon";
import "../../features/state-machine/state-machine-bgs";
import "../../whatsapp/BackgroundBridge";
import { VisibilitySheduler } from "../../whatsapp/VisibilitySheduler";
import {storageLog} from "../../whatsapp/Storage"

new VisibilitySheduler();

window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
    // console.log('Caught background script error');
    // console.log('errorMsg: ' + errorMsg);
    // console.log('url: ' + url);
    // console.log('lineNumber: ' + lineNumber);
    // console.log('column: ' + column);
    // console.log('errorObj follows:');
    // console.log(errorObj);
    storageLog(errorMsg);
    return true;
};

// throw new Error('Is this error caught?');

