"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function dtmiToFileName(dtmi) {
    return dtmi.replace(/:/g, '.').replace(/\;/g, '.v');
}
exports.default = dtmiToFileName;
//# sourceMappingURL=DtmiToFileName.js.map