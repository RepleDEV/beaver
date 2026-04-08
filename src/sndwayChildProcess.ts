import SndwayAPI from "../sndway_api/lib/binding";

import type { IPCChildMessage, IPCParentMessage, Report } from "./ipc";

const OPEN_RATE_HZ = 1;
let read_rate_hz = 2;

function sendToParent(message: any) {
    if (process.send)
        process.send(message);
}

function log(log_msg: string) {
    const message: IPCChildMessage = {
        type: "log",
        message: log_msg,
    };

    sendToParent(message);
}

const api = new SndwayAPI();

let isConnected = false;
let latestReading = 0.0;
let latestTimestamp = 0;

let checkOpen = true;
let isReading = false;

function sendReport() {
    const report: Report = {
        isConnected,
        reading: latestReading,
        timestamp: latestTimestamp,
    };

    const message: IPCChildMessage = {
        type: "report",
        message: report,
    };

    sendToParent(message);
}

async function startCheck() {
    while (true) {
        if (checkOpen) {
            const res = api.open();

            if (res == 0) {
                isConnected = true;

                checkOpen = false;
                isReading = true;
            }

            await Bun.sleep(1000 / OPEN_RATE_HZ);

            continue;
        } else if (isReading) {
            const res = api.read();

            if (res.reading == 0) {
                isConnected = false;

                checkOpen = true;
                isReading = false;
            }

            latestReading = res.reading / 10;
            latestTimestamp = res.timestamp;

            sendReport();

            await Bun.sleep(1000 / read_rate_hz);

            continue;
        }
        break;
    }
}

startCheck();

process.on("message", (message: IPCParentMessage) => {

});
