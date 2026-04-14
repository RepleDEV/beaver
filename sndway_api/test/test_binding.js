const SndwayApi = require("../dist/binding.js");
const assert = require("assert");
const { describe, it, before } = require("node:test");
const readline = require("node:readline/promises")

describe("Tests", () => {
    isDeviceConnected = false;

    before(async () => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const ans = await rl.question("Is the device connected? (Y/N)");

        if (ans == "Y") {
            isDeviceConnected = true
            return
        }
    });

    const instance = new SndwayApi();

    it("Should match device connection status", () => {
        const res = instance.open();

        assert.strictEqual(instance.is_connected(), isDeviceConnected)
    });

    if (isDeviceConnected) {
        it("Should give a reading", () => {
            const reading = instance.read();
            const now = +(new Date());

            console.log(`Reading: ${reading.reading}`);
            console.log(`Timestamp delta: ${now - reading.timestamp} ms`);

            assert.notEqual(reading.reading, 0);
        });
    }
});

// function testBasic() {
//     const instance = new SndwayApi();
//     const res = instance.open();
//
//     if (res == 1) {
//         console.log("Device did not open")
//         return;
//     }
//
//     console.log(`Reading: ${JSON.stringify(instance.read())}`);
// }
//
// assert.doesNotThrow(testBasic, undefined, "testBasic threw an expection");
//
// console.log("Tests passed- everything looks OK!");
