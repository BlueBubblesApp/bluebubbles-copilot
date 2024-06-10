import { Message } from 'discord.js';
import { BaseHandler } from './BaseHandler.js';


export class BaseMessageHandler extends BaseHandler {
    onNewMessage(_message: Message<boolean>): Promise<void> {
        throw new Error("Method not implemented.");
    }
}