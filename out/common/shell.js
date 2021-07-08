"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecShell = void 0;
const cp = require("child_process");
function ExecShell(cmd) {
    return new Promise((resolve, reject) => {
        console.log(`Executing Command: ${cmd}`);
        cp.exec(cmd, (err, out) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            console.log(out);
            return resolve(out);
        });
    });
}
exports.ExecShell = ExecShell;
//# sourceMappingURL=shell.js.map