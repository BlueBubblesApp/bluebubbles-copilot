
import { ChatInputCommandInteraction } from 'discord.js';
import { BaseHandler } from './BaseHandler.js';


export class BaseCommandHandler extends BaseHandler {
    handle(_interaction: ChatInputCommandInteraction): Promise<void> {
        throw new Error("Method not implemented.");
    }
}