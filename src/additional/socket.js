import { downloadFile } from "./utils";

export default class Transport {
  constructor() {
    this.rebuildStructure = null;
    this.names = [];
    this.counter = 0;
    this.socket = new WebSocket("ws://" + window.location.host);
    this.callId = 0;
    this.calls = new Map();
    this.socket.addEventListener("message", ({ data }) => {
      try {
        if (typeof data === "string") {
          const packet = JSON.parse(data);
          const { structure } = packet;
          if (structure && this.rebuildStructure) {
            this.rebuildStructure(structure);
            return;
          }
          const { callId } = packet;
          const promised = this.calls.get(callId);
          if (!promised) return;
          const [resolve, reject] = promised;
          if (packet.error) {
            const { code, message } = packet.error;
            const error = new Error(message);
            error.code = code;
            reject(error);
            return;
          }
          resolve(packet.result);
        } else {
          if (this.names.length !== 0) {
            const item = this.names[this.counter];
            const name = item.slice(item.lastIndexOf("/") + 1);
            downloadFile(name, data);
            this.counter = (this.counter + 1) % this.names.length;
          }
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  clearBuffers() {
    this.buffers = [];
  }

  ready() {
    return new Promise((resolve) => {
      if (this.socket.readyState === WebSocket.OPEN) resolve();
      else this.socket.addEventListener("open", resolve);
    });
  }

  async socketCall(msg, args) {
    const callId = ++this.callId;
    await this.ready();
    return new Promise((resolve, reject) => {
      this.calls.set(callId, [resolve, reject]);
      const packet = { callId, msg, args };
      this.socket.send(JSON.stringify(packet));
    });
  }

  bufferCall(buffer) {
    this.socket.send(buffer);
  }
}
