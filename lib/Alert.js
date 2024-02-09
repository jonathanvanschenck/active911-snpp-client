
const Connection = require("./Connection.js");

class Alert {
    constructor({ call="Alert", place, address, city, priority, date, time, map, unit, id, details=[], info, timeout }={}) {

        this.call = call;
        this.place = place;
        this.address = address;
        this.city = city;
        this.priority = priority;
        this.date = date;
        this.time = time;
        this.map = map;
        this.unit = unit;
        this.id = id;
        this.details = [];
        for ( const [key, value] of details ) this.set(key, value);
        this.info = info;
        this.timeout = timeout;

        this.connection = new Connection({ timeout:this.timeout });

    }

    set(key, value) {
        this.details.push([key.toUpperCase(), JSON.stringify(value)]);
    }


    toString() {
        let string = `CALL: ${this.call}\n`;
        if ( this.place ) string = string + `PLACE: ${this.place}\n`;
        if ( this.address ) string = string + `ADDR: ${this.address}\n`;
        if ( this.city ) string = string + `CITY: ${this.city}\n`;
        if ( this.priority ) string = string + `PRI: ${this.priority}\n`;
        if ( this.date ) string = string + `DATE: ${this.date}\n`;
        if ( this.time ) string = string + `TIME: ${this.time}\n`;
        if ( this.map ) string = string + `MAP: ${this.map}\n`;
        if ( this.unit ) string = string + `UNIT: ${this.unit}\n`;
        if ( this.id ) string = string + `ID: ${this.id}\n`;
        for ( const [key, value] of this.details ) string = string + `${key}: ${value}\n`;
        if ( this.info ) string = string + `INFO: ${this.info}\n`;

        return string;
    }

    async send({ host, port, pager_id }) {
        await this.connection.connect({ host, port });
        await this.connection.PAGE(pager_id);
        await this.connection.DATA(this.toString());
        await this.connection.SEND();
        await this.connection.QUIT();
    }
}


module.exports = Alert;
