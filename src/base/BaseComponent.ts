import { IBaseComponent } from '../interfaces/IBaseComponent.js';
import { Logger } from '../utils/Logger.js';
import type { ComponentManager } from '../utils/ComponentManager.js';


export class BaseComponent implements IBaseComponent {

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

    async initialize(..._: any[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
}