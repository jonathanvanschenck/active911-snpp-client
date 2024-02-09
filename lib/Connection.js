
const { createConnection } = require("net");
const { EventEmitter } = require("events");

const Response = require("./Response.js");

const TERM = "\r\n";

class Connection extends EventEmitter {
    constructor({ timeout=10000 }={}) {
        super();

        this.sock = null;

        this.config = {
            timeout
        };

    }

    async connect({ host="localhost", port=444 }={}) {
        return new Promise((resolve, reject) => {

            this.sock = createConnection({host, port});

            const ctimebomb = setTimeout(() => {
                this.sock.kill();
                this.sock = null;
                reject(new Error("Connection timed out"));
            }, this.config.timeout);

            this.once("response", (response) => {

                clearTimeout(ctimebomb);
                if ( response.code == 220 ) {
                    this.emit("connected");
                    resolve(new Error(`Connection rejected: ${response.code} ${response.body}`));
                } else {
                    this.sock.kill();
                    this.sock = null;
                    reject(new Error(`Connection rejected: ${response.code} ${response.body}`));
                }
            });


            // Bubble up the errors
            this.sock.on("error", (err) => {
                this.emit("error", err);
            });

            // Listen for hangup
            this.sock.on("end", () => {
                this.sock = null;
                this.emit("disconnected");
            });


            this.sock.on("data", data => this._on_data(data.toString()));


        });
    }

    async disconnect({}={}) {
        if ( this.sock ) {
            this.sock.kill();
            this.sock = null;
        }
        this.emit("disconnected");
    }

    async _write(msg, { timeout }={}) {
        return new Promise((resolve,reject) => {
            let timebomb = null;

            this.once("response", (response) => {
                clearTimeout(timebomb);
                resolve(response);
            });

            if ( timeout !== 0 ) {
                timebomb = setTimeout(() => {
                    this.off("response", res);
                    reject(new Error("timeout"));
                }, timeout || this.config.timeout);
            }

            this.sock.write(msg + TERM);
            this.emit("send", msg);
        });
    }

    async PAGE(id) {
        return this._write("PAGE "+id).then(response => {
            if ( response.code != 250 ) {
                throw new Error(`Rejected: ${response.code} ${response.body}`);
            } else {
                return response;
            }
        });
    }
    async DATA(msg) {
        return this._write("DATA").then(response => {
            if ( response.code != 354 ) {
                throw new Error(`Rejected: ${response.code} ${response.body}`);
            } else {
                return this._write(msg+TERM+".");
            }
        }).then(response => {
            if ( response.code != 250 ) {
                throw new Error(`Rejected: ${response.code} ${response.body}`);
            } else {
                return response;
            }
        });
    }
    async SEND() {
        return this._write("SEND").then(response => {
            if ( response.code != 250 ) {
                throw new Error(`Rejected: ${response.code} ${response.body}`);
            } else {
                return response;
            }
        });
    }
    async QUIT() {
        return this._write("QUIT").then(response => {
            if ( response.code != 221 ) {
                throw new Error(`Rejected: ${response.code} ${response.body}`);
            } else {
                return response;
            }
        });
    }

    _on_data(data) {
        for ( const msg of data.split(TERM) ) {
            if ( !msg ) continue;
            try {
                const response = Response.parse(msg);
                this.emit("response", response);
            } catch (e) {/* ignore */}
        }
    }
}

module.exports = Connection;
