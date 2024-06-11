import { ChatInputCommandInteraction } from 'discord.js';
import { BaseCommandHandler } from '../base/BaseCommandHandler.js';
import HelpCenterLinks from '../constants/HelpCenterLinks.js';

const HANDLER_ID = 'help';
const HANDLER_NAME = 'Help Center Handler';


export default class HelpCenterHandler extends BaseCommandHandler {
    constructor(...args: any[]) {
        super(HANDLER_ID, HANDLER_NAME, ...args)
    }

    async handle(interaction: ChatInputCommandInteraction): Promise<void> {
        const article = interaction.options.get('article')?.value as string;
        if (!article) {
            await interaction.reply('Please select an article!');
            return;
        }

        if (!Object.keys(HelpCenterLinks).includes(article)) {
            await interaction.reply('Invalid article selected!');
            return;
        }

        await interaction.reply(`Here is your link: ${HelpCenterLinks[article]}`);
    }
}