import { serve } from "bun";
import index from "./index.html";

import type { Report, IPCChildMessage } from "./ipc";

let sndwayData: Report = {
  isConnected: false,
  reading: 0.0,
  timestamp: 0,
}

const childProc = Bun.spawn(["bun", "src/sndwayChildProcess.ts"], {
  ipc(message: IPCChildMessage) {
    switch (message.type) {
      case "report":
        sndwayData = message.message;
    }
  },
});

const server = serve({
  port: 6767,
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/report": {
      async GET(req) {
        return Response.json(sndwayData);
      },
    },
    "/api/report.test": {
      GET(req) {
        let reading = 80 + 50 * (Math.random()) ** 2;
        reading = Math.round(reading * 10) / 10;

        const res: Report = {
          isConnected: false,
          reading,
          timestamp: +(new Date()),
        }

        return Response.json(res);
      }
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
