import path from "path";
import fs from "fs";
import { BaseComponent } from "../base/BaseComponent.js";
import { Logger } from "./Logger.js";
import { __basedir } from '../globals.js';


export class ComponentManager {
    private components: BaseComponent[] = [];

    private hasInitialized = false;

    private log: Logger;

    constructor() {
        this.log = new Logger('Component Manager');
    }

    getComponent(id: string) {
        return this.components.find(c => c.id === id);
    }

    async initialize() {
        if (this.hasInitialized) {
            this.log.warn('Component Manager has already been initialized. Skipping...')
            return;
        }

        // Load the components
        this.log.info('Loading components...')
        await this.load();

        // Initialize the components
        for (const component of this.components) {
            this.log.info(`Initializing ${component.name}...`);
            await component.initialize();
            this.log.info(`Initialized ${component.name}!`);
        }

        this.hasInitialized = true;
    }

    private async load() {
        const basePath = path.join(__basedir, 'components');
        const dirs = fs.readdirSync(basePath).filter(
            file => fs.statSync(path.join(__basedir, 'components', file)).isDirectory());
        const files = dirs.map(dir => {
            const dirPath = path.join(basePath, dir);
            const componentFiles = fs.readdirSync(dirPath).filter(file => file.endsWith('.js'));
            return componentFiles.map(file => path.join(dir, file));
        }).flat();
        for (const file of files) {
            const { default: Component } = await import(`../components/${file}`);
            if (Component.prototype instanceof BaseComponent) {
                this.components.push(new Component(this));
            }
        }
    }
}