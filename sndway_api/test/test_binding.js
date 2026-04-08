const SndwayApi = require("../dist/binding.js");
const assert = require("assert");

assert(SndwayApi, "The expected module is undefined");

function testBasic() {
    const instance = new SndwayApi();
    const res = instance.open();

    if (res == 1) {
        console.log("Device did not open")
        return;
    }

    console.log(`Reading: ${JSON.stringify(instance.read())}`);
}

assert.doesNotThrow(testBasic, undefined, "testBasic threw an expection");

console.log("Tests passed- everything looks OK!");
