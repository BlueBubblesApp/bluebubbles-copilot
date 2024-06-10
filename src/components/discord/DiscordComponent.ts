import path from "path";
import fs from "fs";
import { Client, Events, GatewayIntentBits, Guild, REST, Routes } from 'discord.js';
import { BaseComponent } from "../../base/BaseComponent.js";
import { fileURLToPath } from 'url';
import { BaseCommandHandler } from "./base/BaseCommandHandler.js";
import { BaseMessageHandler } from "./base/BaseMessageHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default class DiscordComponent extends BaseComponent {
    private clientId: string;

    private token: string;

    client: Client;

    api: REST;

    commands: NodeJS.Dict<any>[] = [];

    commandHandlers:  { [key: string]: BaseCommandHandler } = {};

    messageHandlers: { [key: string]: BaseMessageHandler } = {};

    constructor(...args: any[]) {
        super('discord', 'Discord Component', ...args);
    }

    async initialize(): Promise<void> {
        this.token = process.env.DISCORD_BOT_TOKEN;
        this.clientId = process.env.DISCORD_CLIENT_ID;
        if (!this.token) throw new Error("DISCORD_BOT_TOKEN is not defined");
        if (!this.clientId) throw new Error("DISCORD_CLIENT_ID is not defined");

        this.log.info("Initializing Discord Client...")
        this.client = await this.initializeDiscordClient(this.token);
        this.api = this.initializeDiscordApi(this.token)

        await this.initializeDiscordComponents();
        await this.registerCommandsWithGuilds();
        this.listenForEvents();
    }

    private listenForEvents() {
        this.log.info("Listening for events...");

        this.client.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return;
        
          // If we have a handler for the command name, invoke it
          const handler = this.commandHandlers[interaction.commandName];
          if (handler) {
            this.log.info(`Handling interaction for command ${interaction.commandName}...`);
            await handler.handle(interaction);
          }
        });

        // If we have a handler for the message, invoke it
        this.client.on(Events.MessageCreate, async message => {
            if (message.author.bot) return;
            for (const handler of Object.keys(this.messageHandlers)) {
                await this.messageHandlers[handler].onNewMessage(message);
            }
        });
          
    }

    private async initializeDiscordClient(token: string): Promise<Client> {
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        await client.login(token);
        return client;
    }

    private initializeDiscordApi(token: string): REST {
        return new REST({ version: '10' }).setToken(token);
    }

    private async initializeDiscordComponents() {
        this.log.info("Initializing Discord Components...");

        // Load the commands from the commands directory
        const commandsPath = path.join(__dirname, 'commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const { default: command } = await import(`./commands/${file}`);
            this.commands.push(command);
        }

        // Load the command handlers from the handlers directory
        // const cmdHandlersPath = path.join(__dirname, 'commandHandlers');
        // const cmdHandlerFiles = fs.readdirSync(cmdHandlersPath).filter(file => file.endsWith('.js'));
        // for (const file of cmdHandlerFiles) {
        //     const { default: BaseCommandHandler } = await import(`./commandHandlers/${file}`);
        //     const Module = new BaseCommandHandler(this.components);
        //     this.commandHandlers[Module.id] = Module;
        // }

        // Load the message event handlers from the handlers directory
        const msgHandlersPath = path.join(__dirname, 'messageHandlers');
        const msgHandlerFiles = fs.readdirSync(msgHandlersPath).filter(file => file.endsWith('.js'));
        for (const file of msgHandlerFiles) {
            const { default: BaseMessageHandler } = await import(`./messageHandlers/${file}`);
            const Module = new BaseMessageHandler(this.components);
            this.messageHandlers[Module.id] = Module;
        }
    }

    async fetchGuild(name: string): Promise<Guild> {
        const guilds = await this.client.guilds.fetch();
        const guild = guilds.find((g) => g.name === name);
        if (!guild) throw new Error("Guild not found");
        return await guild.fetch();
    }

    private async registerCommandsWithGuilds(): Promise<void> {
        const guilds = process.env.DISCORD_GUILDS.split(',').map((g) => g.trim());
        if (!guilds || guilds.length === 0) {
            return this.log.warn("No guilds have been configured for this bot. Commands will not be registered.");
        }

        if (!this.commands || this.commands.length === 0) {
            return this.log.warn("No commands to register with guilds.");
        }
        
        for (const guild of guilds) {
            await this.registerCommandsWithGuild(guild);
        }
    }

    private async registerCommandsWithGuild(guildName: string): Promise<void> {
        this.log.info(`Registering commands with guild: ${guildName}`);
        if (!this.commands || this.commands.length === 0) {
            return this.log.warn("No commands to register with guild.");
        }

        const guild = await this.fetchGuild(guildName);
        await this.registerCommands(guild);
    }

    private async registerCommands(guild: Guild): Promise<void> {
        // The put method is used to fully refresh all commands in the guild with the current set
        await this.api.put(
            Routes.applicationGuildCommands(this.clientId, guild.id),
            { body: this.commands },
        );
    }
}