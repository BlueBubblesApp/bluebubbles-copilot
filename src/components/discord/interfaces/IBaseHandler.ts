import { ChatInputCommandInteraction } from "discord.js";


export interface IBaseHandler {
    id: string,
    name: string,
    handle(interaction: ChatInputCommandInteraction): Promise<void>;
}