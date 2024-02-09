
class Response {
    static CODES = {
        214: `Multi-line "help/info" message`,
        218: `Single-line "help/info" message`,
        220: `SNPP Gateway Ready`,
        220: `Okay, Hangup`,
        250: `Successful Transaction`,
        421: `Fatal Error, Connection Terminated`,
        500: `Command Not Implemented`,
        503: `Duplicate Command Entry; Already Entered That`,
        550: `Transaction Failed, but Continue`,
        554: `Transaction Failed, but Continue`,
        552: `Maximum Entries Exceeded`,
    };

    constructor(code, body) {
        this.code = code;
        this.body = body;
    }

    /**
     * Parse a response from a string
     * @param {String}
     * @return {Response}
     */
    static parse(data) {
        const code = data.slice(0,3);
        if ( isNaN(parseInt(code)) ) throw new Error("Bad reponse code: "+code);
        return new this(parseInt(code), data.slice(4));
    }
}

module.exports = Response;
