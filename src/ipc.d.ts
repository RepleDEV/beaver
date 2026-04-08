export interface IPCChildMessage {
    type: "report" | "log";
    message: any;
}

export interface IPCParentMessage {
    request: "getReport" | "setReadRate";
    value?: number;
}

export interface Report {
    isConnected: boolean;
    reading: number;
    timestamp: number;
}
