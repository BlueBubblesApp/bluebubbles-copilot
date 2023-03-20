import { ChatInputCommandInteraction } from 'discord.js';
import GithubComponent from '../../github/GithubComponent.js';
import { BaseHandler } from '../base/BaseHandler.js';

const HANDLER_ID = 'gh-create-issue';
const HANDLER_NAME = 'GitHub Create Issue Handler';

const typeToRepo = {
    android: 'bluebubbles-app',
    desktop: 'bluebubbles-app',
    web: 'bluebubbles-app',
    server: 'bluebubbles-server',
    helper: 'bluebubbles-helper'
};

const typeToLabels = {
    android: ['Android'],
    desktop: ['Desktop'],
    web: ['Web']
};

const issueToLabels = {
    bug: ['Bug'],
    feature: ['Enhancement']
};

const mediaExtensions = [
    'png',
    'jpg',
    'jpeg',
    'gif',
    'tiff',
    'bmp',
    'mp4',
    'mov',
    'avi',
    'webm',
    'mkv',
    'm4v'
];

let organization = process.env.GH_ORGANIZATION;
if (organization == null || organization === '') organization = 'BlueBubblesApp';


export default class GhCreateIssueHandler extends BaseHandler {
    constructor(...args: any[]) {
        super(HANDLER_ID, HANDLER_NAME, ...args)
    }

    async handle(interaction: ChatInputCommandInteraction): Promise<void> {
        const gh = this.components.getComponent('github') as GithubComponent;
        if (!gh) {
            await interaction.reply('GitHub component is not loaded! Please alert the BlueBubbles team.');
            return;
        }

        const appType = interaction.options.get('app_type')?.value as string;
        const title = interaction.options.get('title')?.value as string;
        let body = interaction.options.get('description')?.value as string;
        const issueType = interaction.options.get('issue_type')?.value as string;
        const attachment = interaction.options.getAttachment('attachment', false);
        if (!appType || !title || !body) {
            await interaction.reply('Please provide all required fields.');
            return;
        }

        // Add the attachment if it exists
        if (attachment) {
            let attachmentMd = `[${attachment.name}](${attachment.url})`;
            // Get the attachment URL's extension and prefix with ! if it's an image
            const extension = attachment.url.split('.').pop();
            if (mediaExtensions.includes(extension)) {
                attachmentMd = `!${attachmentMd}`;
            }

            body += `\n\n#### Attachment\n\n${attachmentMd}`;
        }

        // Append the author's username to the body
        const user = `@${interaction.user.username}#${interaction.user.discriminator}`;
        const messageLink = `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${interaction.id}`;
        body += `\n\n#### Issue Metadata\n\n- User: \`${user}\`\n- Context: ${messageLink}`;

        // Create the issue
        const repo = typeToRepo[appType];
        const typeLabels = typeToLabels[appType];
        const issueLabels = issueToLabels[issueType];
        const labels = [...(typeLabels ?? []), ...(issueLabels ?? [])];

        try {
            this.log.info(`Creating issue in [${repo}] with title [${title}]`);
            const issue = await gh.api.issues.create({
                owner: organization,
                repo, title, body, labels
            });

            await interaction.reply(`Issue created! You can view it here: ${issue.data.html_url}`);
        } catch (e) {
            await interaction.reply(`There was an error creating the issue: ${e}`);
        }
    }
}