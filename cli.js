#!/usr/bin/env node

const { Alert } = require("./index.js");

function help() {
    console.log("");
    console.log("a911-snpp: Active911 SNPP Client CLI Tool");
    console.log("  Usage:  a911-snpp <REQUIRED|UTILITIES> [OPTIONS]");
    console.log("");
    console.log("UTILITY");
    console.log("  -h,--help               : Display this help menu");
    console.log("     --version            : Display the version");
    console.log("");
    console.log("REQUIRED");
    console.log("  -H,--host               :");
    console.log("  -p,--pager-id           :");
    console.log("  -t,--call               :");
    console.log("  -l,--place              :");
    console.log("  -a,--address            :");
    console.log("");
    console.log("OPTIONAL");
    console.log("  -P,--port               :");
    console.log("  -c,--city               :");
    console.log("     --priority           :");
    console.log("  -u,--unit               :");
    console.log("     --date               :");
    console.log("  -T,--time               :");
    console.log("     --map                :");
    console.log("  -i,--id                 :");
    console.log("  -I,--info               :");
    console.log("  -d,--detail             : Additional detail field. Takes the format of 'KEY=VALUE'. Option is repeateable");
    console.log("     --timeout            : Set the TCP timeout for SNPP communication in seconds (default is 20 seconds)");
    console.log("  -v,--verbose            : Control if the tool uses verbose logging");
    console.log("");
}


const args = process.argv.slice(2);
if ( !args.length ) {
    console.error("Missing arguments");
    process.exit(1);
}


const send = {
    port: 444,
};
const opts = {
    timeout: 20*1000
};
const details = [];
let verbose = false;

function parse_detail(str) {
    const [ _, key, value ] = str.match(/(^[^=\s]+)\s*=\s*(.+)/) ?? [];
    if ( !key || !value ) return false;
    details.push([ key, value ]);
    return true;
}

let arg;
while ( args.length ) switch ( arg = args.shift() ) {
    // Utils
    case "-H":
    case "--help":
        help();
        process.exit(0);
    case "--version":
        console.log(require("./package.json").version);
        process.exit(0);

    // Required
    case "-h":
    case "--host":
        arg = args.shift();
        if ( !arg ) {
            console.error("Missing argument for --host");
            process.exit(1);
        }
        send.host = arg;
        break;
    case "-p":
    case "--pager-id":
        arg = args.shift();
        if ( !arg ) {
            console.error("Missing argument for --pager-id");
            process.exit(1);
        }
        send.pager_id = arg;
        break;
    case "-t":
    case "--call":
        arg = args.shift();
        if ( !arg ) {
            console.error("Missing argument for --call");
            process.exit(1);
        }
        opts.call = arg;
        break;
    case "-l":
    case "--place":
        arg = args.shift();
        if ( !arg ) {
            console.error("Missing argument for --place");
            process.exit(1);
        }
        opts.place = arg;
        break;
    case "-a":
    case "--address":
        arg = args.shift();
        if ( !arg ) {
            console.error("Missing argument for --address");
            process.exit(1);
        }
        opts.address = arg;
        break;
    case "-c":
    case "--city":
        arg = args.shift();
        if ( !arg ) {
            console.error("Missing argument for --city");
            process.exit(1);
        }
        opts.city = arg;
        break;

    // Optionals
    case "-P":
    case "--port":
        arg = parseInt(args.shift());
        if ( !arg || isNaN(arg) ) {
            console.error("Missing argument for --port");
            process.exit(1);
        }
        send.port = arg;
        break;
    case "--priority":
        arg = args.shift();
        if ( !arg ) {
            console.error("Missing argument for --priority");
            process.exit(1);
        }
        opts.priority = arg;
        break;
    case "-u":
    case "--unit":
        arg = args.shift();
        if ( !arg ) {
            console.error("Missing argument for --unit");
            process.exit(1);
        }
        opts.unit = arg;
        break;
    case "--date":
        arg = args.shift();
        if ( !arg ) {
            console.error("Missing argument for --date");
            process.exit(1);
        }
        opts.date = arg;
        break;
    case "-T":
    case "--time":
        arg = args.shift();
        if ( !arg ) {
            console.error("Missing argument for --time");
            process.exit(1);
        }
        opts.time = arg;
        break;
    case "--map":
        arg = args.shift();
        if ( !arg ) {
            console.error("Missing argument for --map");
            process.exit(1);
        }
        opts.map = arg;
        break;
    case "-i":
    case "--id":
        arg = args.shift();
        if ( !arg ) {
            console.error("Missing argument for --id");
            process.exit(1);
        }
        opts.id = arg;
        break;
    case "-I":
    case "--info":
        arg = args.shift();
        if ( !arg ) {
            console.error("Missing argument for --info");
            process.exit(1);
        }
        opts.info = arg;
        break;
    case "-d":
    case "--detail":
        arg = args.shift();
        if ( !arg ) {
            console.error("Missing argument for --detail");
            process.exit(1);
        }
        if ( !parse_detail(arg) ) {
            console.error(`Failed to parse --detail '${arg}'`);
            process.exit(1);
        }
        break;
    case "--timeout":
        arg = parseFloat(args.shift());
        if ( !arg || isNaN(arg) ) {
            console.error("Bad argument for --timeout");
            process.exit(1);
        }
        opts.timeout = arg * 1e3; // convert to ms
        break;
    case "-v":
    case "--verbose":
        verbose = true;
        break;


    default:
        console.error(`Unrecognized argument '${arg}'`);
        process.exit(1);
}

if ( !send.host ) {
    console.error("Missing argument --host");
    process.exit(1);
}
if ( !send.pager_id ) {
    console.error("Missing argument --pager-id");
    process.exit(1);
}
if ( !opts.call ) {
    console.error("Missing argument --call");
    process.exit(1);
}
if ( !opts.place ) {
    console.error("Missing argument --place");
    process.exit(1);
}
if ( !opts.address ) {
    console.error("Missing argument --address");
    process.exit(1);
}

if ( verbose ) {
    console.log("Parsed values:");
    for ( const key in send ) console.log(`${key}='${send[key]}'`);
    for ( const key in opts ) console.log(`${key}='${opts[key]}'`);
    for ( const [key,value] of details ) console.log(`${key}='${value}'`);

    console.log("");
    console.log("Preparing Alert");
}

const alert = new Alert(opts)
if ( verbose ) console.log("Attaching details");
for ( const [key,value] of details ) alert.set(key, value);

if ( verbose ) {
    console.log("");
    console.log("");
    console.log("Attempting to send alert");
    alert.connection.on("connected", () => {
        console.log("... Connection established with server"); 
    });
    alert.connection.on("disconnected", () => {
        console.log("... Connection with server destroyed"); 
    });

    alert.connection.on("send", (data) => {
        for ( const line of data.replace(/\r/g,"").split("\n") ) if ( line ) console.log(`SENT >>> ${line}`);
    });
    alert.connection.on("response", ({ code, body }) => {
        console.log(`RECV <<< ${code} : ${body}`);
    });
}

let success = false;
alert.connection.on("response", ({ code }) => {
    // Check if the SEND was successful
    if ( code == 250 ) success = true;
});

alert.connection.on("error", (err) => {
    console.error("");
    console.error("Socket error! Cannot continue.");
    console.error(err);
    console.error("");
    process.exit(255);
});

!async function() {
    await alert.send(send);

    if ( success && verbose ) {
        console.log("");
        console.log("Alert was successful");
    }

    if ( !success ) {
        console.error("");
        console.error("Alert was not successfully sent!");
        process.exit(2);
    }

    process.exit(0);
}();
