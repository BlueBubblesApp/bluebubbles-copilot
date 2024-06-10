import { ComponentManager } from "./utils/ComponentManager.js";
import * as dotenv from 'dotenv';

dotenv.config();


export class BlueBubblesCopilot {

    componentManager: ComponentManager;

    constructor() {
        this.componentManager = new ComponentManager();
    }

    async initialize(): Promise<void> {
        await this.componentManager.initialize();
    }
}