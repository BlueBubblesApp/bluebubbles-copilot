import { Logger } from '../../../utils/Logger.js';
import { IBaseHandler } from '../interfaces/IBaseHandler.js';
import { ComponentManager } from '../../../utils/ComponentManager.js';


export class BaseHandler implements IBaseHandler {

    id: string;

    name: string;

    log: Logger;

    components: ComponentManager;

    constructor(...args: any[]) {
        this.id = args[0];
        this.name = args[1];
        this.components = args[2];
        this.log = new Logger(this.name);
    }

    async handle(..._: any[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
}