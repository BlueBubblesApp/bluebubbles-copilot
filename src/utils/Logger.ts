export class Logger {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    info(message: string) {
        console.log(`[${this.name}] ${message}`);
    }

    error(message: string) {
        console.error(`[${this.name}] ${message}`);
    }

    warn(message: string) {
        console.warn(`[${this.name}] ${message}`);
    }

    debug(message: string) {
        console.debug(`[${this.name}] ${message}`);
    }
}