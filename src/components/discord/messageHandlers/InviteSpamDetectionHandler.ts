import { Message } from 'discord.js';
import { BaseMessageHandler } from '../base/BaseMessageHandler.js';
import { Sema } from 'async-sema';
import DirectMessages from '../constants/DirectMessages.js';
import ModerationMessages from '../constants/ModerationMessages.js';

const HANDLER_ID = 'invite-spam-detection';
const HANDLER_NAME = 'Invite Spam Detection';

type InviteLinkItem = {
    message: Message<boolean>,
    time: number,
    deleted: boolean,
    count: number
}

export default class InviteSpamDetectionHandler extends BaseMessageHandler {

    // Map of sender to the last time they sent an invite link
    inviteLinkCache: Map<string, InviteLinkItem> = new Map();

    sema: Sema;

    constructor(...args: any[]) {
        super(HANDLER_ID, HANDLER_NAME, ...args);

        this.sema = new Sema(1);
    }

    async onNewMessage(message: Message<boolean>): Promise<void> {
        try {
            await this.checkForInviteSpam(message);
        } catch (e) {
            this.log.error(`Error checking for invite spam: ${e}`);
        }
    }

    async checkForInviteSpam(message: Message<boolean>): Promise<void> {
        // Check to see if the message contains an invite link.
        // If it has, and the user has sent an invite link within the last 10 seconds, delete the message.
        const spamMatch = message.content.match(/discord\.gg\/[a-zA-Z0-9]+/);
        if (!spamMatch) {
            this.inviteLinkCache.delete(message.author.id);
            return;
        }

        try {
            await this.sema.acquire();
            await this.handleInviteSpam(message);
        } catch (e) {
            this.log.error(`Error handling invite spam: ${e}`);
        } finally {
            this.sema.release();
        }
    }

    async handleInviteSpam(message: Message<boolean>): Promise<void> {
        let deleted = false;
        let count = 0;

        this.log.debug(`Invite link detected from ${message.author.username}`);
        if (this.inviteLinkCache.has(message.author.id)) {
            const prevInvite = this.inviteLinkCache.get(message.author.id);
            const messageTime = message.createdTimestamp;

            // Take action if the user has sent multiple invite links within
            // a short period of time (30 seconds).
            if (messageTime - prevInvite.time < 30000) {
                count = prevInvite.count + 1;
                if (!prevInvite.deleted) {
                    await this.deleteMessage(prevInvite.message);
                }

                await this.deleteMessage(message);
                deleted = true;

                if (count === 1) {
                    await this.kickUser(message);
                } else if (count >= 2) {
                    await this.banUser(message);
                }
            } else {
                // 2+ offenses, but not within the last 30 seconds.
                // Re-warn the user and reset the count
                await this.warnUser(message);
                count = 0;
            }
        } else {
            // First offense
            await this.warnUser(message);
        }

        this.inviteLinkCache.set(message.author.id, { message, time: Date.now(), deleted, count });
    }

    async kickUser(message: Message<boolean>): Promise<void> {
        try {
            this.log.info(`Kicking ${message.author.username}...`);
            await message.author.send(DirectMessages.kickMessage(message.author.username));
            await message.guild.members.kick(message.author, ModerationMessages.kickReason);
        } catch (e) { 
            this.log.error(`Error kicking user: ${e}`);
        }
    }

    async banUser(message: Message<boolean>, reason = ModerationMessages.banReason, deleteMessageSeconds = 7 * 24 * 60 * 60): Promise<void> {
        try {
            this.log.info(`Banning ${message.author.username}...`);
            await message.author.send(DirectMessages.banMessage(message.author.username));
            await message.guild.members.ban(message.author, { deleteMessageSeconds, reason });
        } catch (e) {
            this.log.error(`Error banning user: ${e}`);
        }
    }

    async warnUser(message: Message<boolean>): Promise<void> {
        try {
            this.log.debug(`Warning ${message.author.username}...`);
            await message.author.send(DirectMessages.inviteSpamWarningMessage(message.author.username));
        } catch (e) {
            this.log.error(`Error banning user: ${e}`);
        }
    }

    async deleteMessage(message: Message<boolean>): Promise<void> {
        try {
            this.log.info(`Deleting invite spam from ${message.author.username}...`);
            await message.delete();
        } catch (e) {
            this.log.error(`Error deleting message: ${e}`);
        }
    }
}