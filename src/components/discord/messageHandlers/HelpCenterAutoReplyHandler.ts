import { Message } from 'discord.js';
import { BaseMessageHandler } from '../base/BaseMessageHandler.js';
import HelpCenterReplies from '../constants/HelpCenterReplies.js';

const HANDLER_ID = 'help-auto-reply';
const HANDLER_NAME = 'Helpcenter Auto Reply Handler';

const replyDictionary = {
    cloudflare: {
        test: new RegExp(/(?:(?:(?:won't)|(?:can'?t)|(?:couldn'?t)|(?:unable to)|(?:failed to)) connect to cloudflare)|(?:(?:(?:can't)|(?:couldn't)|(?:unable to)|(?:failed to)) get cloudflare to work)|(?:cloudflare (?:(?:stopped)|(?:no longer)) work)/gi),
        reply: HelpCenterReplies.CLOUDFLARE_CONN_HELP,
    },
    noSuchHost: {
        test: new RegExp(/(?:no such host)|(?:(?:failed|unable) to resolve host)/gi),
        reply: HelpCenterReplies.NO_SUCH_HOST_HELP,
    },
    noNotifications: {
        test: new RegExp(/(?:(?:(?:i'?m)|app)(?: (?:is not|isn'?t|not))? (?:receiving|getting) (?:notifications|alerts))/gi),
        reply: HelpCenterReplies.NO_NOTIFICATIONS_HELP,
    },
    howToDonate: {
        test: new RegExp(/how (?:can|do) i (?:donate|support)/gi),
        reply: HelpCenterReplies.HOW_TO_DONATE_HELP,
    },
    bestMacos: {
        test: new RegExp(/(?:(?:best|recommended) mac(?:os)? version)|(?:which mac(?:os)?(?: version)? is(?: the)? (?:best|recommended))/gi),
        reply: HelpCenterReplies.BEST_MACOS_HELP,
    },
    whichProxy: {
        test: new RegExp(/(?:(?:which|what) (?:(?:proxy(?: service)? (?:(?:is(?: the)? best|recommended)|(?:should i use))))|(?: is the (?:best|recommended) (?:proxy service|dynamic dns)))/gi),
        reply: HelpCenterReplies.WHICH_PROXY_HELP,
    },
    portForwarding: {
        test: new RegExp(/(?:how (?:(?:do)|(?:can)) i (?:(?:port forward)|(?:(?:set ?up)|use)(?: a)? dynamic dns))/gi),
        reply: HelpCenterReplies.PORT_FORWARDING_HELP,
    },
    whyNeedMac: {
        test: new RegExp(/(?:(?:why|do i need)(?: a)? mac)/gi),
        reply: HelpCenterReplies.WHY_NEED_MAC_HELP,
    },
    howToGetPapiFeatures: {
        test: new RegExp(/(?:(?:how|where) (?:can|do) i (?:get|use|(?:set ?up)) (?:reactions|tapbacks|replies|edit|unsend))/gi),
        reply: HelpCenterReplies.HOW_TO_GET_PAPI_FEATURES_HELP,
    },
    appleScriptReboot: {
        test: new RegExp(/(?:apple ?event timed? out)|(?:can't get (?:(?:buddy)|(?:participant)|(?:chat)) id)/gi),
        reply: HelpCenterReplies.APPLE_SCRIPT_REBOOT_HELP,
    },
    appleScriptEvents: {
        test: new RegExp(/not authorized to send (?:(?:apple)|(?:system)) events/gi),
        reply: HelpCenterReplies.APPLE_SCRIPT_EVENTS_HELP,
    }
};

export default class HelpCenterAutoReplyHandler extends BaseMessageHandler {

    // We want to cache the user's last used auto-reply to prevent spam
    lastAutoReply: Map<string, Message<boolean>> = new Map();

    timeout = 86_400_000;

    cacheClearCount = 0;

    maxCacheClearCount = 100;

    constructor(...args: any[]) {
        super(HANDLER_ID, HANDLER_NAME, ...args);
    }

    async onNewMessage(message: Message<boolean>): Promise<void> {
        try {
            await this.checkForAutoReply(message);
        } catch (e) {
            this.log.error(`Error checking for invite spam: ${e}`);
        }

        // Every 100 (maxCacheClearCount) messages,
        // purge the cache of entries older than 24 hours (timeout)
        this.cacheClearCount++;
        if (this.cacheClearCount >= this.maxCacheClearCount) {
            this.purgeOldCacheEntries();
            this.cacheClearCount = 0;
        }
    }

    async purgeOldCacheEntries(): Promise<void> {
        this.lastAutoReply.forEach((value, key) => {
            if (value.createdTimestamp < (Date.now() - this.timeout)) {
                this.lastAutoReply.delete(key);
            }
        });
    }

    async checkForAutoReply(message: Message<boolean>): Promise<void> {
        for (const [key, value] of Object.entries(replyDictionary)) {
            if (!message.content.match(value.test)) continue;

            // If we've already replied to this user in the last 24 hours, don't reply again
            const dictKey = `${message.author.id}-${key}`
            if (this.lastAutoReply.has(dictKey)) {
                const lastMessage = this.lastAutoReply.get(dictKey);
                if (lastMessage.createdTimestamp > (Date.now() - this.timeout)) continue;
            }

            await this.handleAutoReply(message, value.reply);
            this.lastAutoReply.set(dictKey, message);

            // Once we've replied, break out of the loop
            // so we don't send multiple replies
            break;
        }
    }

    async handleAutoReply(message: Message<boolean>, reply: string): Promise<void> {
        try {
            await message.reply(reply);
        } catch (e) {
            this.log.error(`Error handling auto-reply: ${e}`);
        }
    }
}