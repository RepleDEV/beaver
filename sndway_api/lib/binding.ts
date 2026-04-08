const addon = require('../build/Release/sndway_api-native');

interface Report {
    reading: number,
    timestamp: number,
}

interface ISndwayApiNative {
    open(): number;
    read(): Report;
    close(): void;
    is_connected(): boolean;
};

class SndwayApi {
    constructor() {
        this._addonInstance = new addon.SndwayApi()
    }

    open(): number {
        return this._addonInstance.open();
    }

    read(): Report {
        return this._addonInstance.read();
    }

    close(): void {
        this._addonInstance.close();
        return;
    }

    is_connected(): boolean {
        return this._addonInstance.is_connected();
    }

    // private members
    private _addonInstance: ISndwayApiNative;
}

export = SndwayApi;
