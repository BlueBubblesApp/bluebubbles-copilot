export class Logger {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    info(message: string) {
        console.log(`[${new Date().toISOString()}][${this.name}] ${message}`);
    }

    error(message: string) {
        console.error(`[${new Date().toISOString()}][${this.name}] ${message}`);
    }

    warn(message: string) {
        console.warn(`[${new Date().toISOString()}][${this.name}] ${message}`);
    }

    debug(message: string) {
        console.debug(`[${new Date().toISOString()}][${this.name}] ${message}`);
    }
}