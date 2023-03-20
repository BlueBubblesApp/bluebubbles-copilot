import path from "path";
import fs from "fs";
import { Client, Events, GatewayIntentBits, Guild, REST, Routes } from 'discord.js';
import { BaseComponent } from "../../base/BaseComponent.js";
import { fileURLToPath } from 'url';
import { ComponentManager } from "../../utils/ComponentManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default class DiscordComponent extends BaseComponent {
    private clientId: string;

    private token: string;

    client: Client;

    api: REST;

    commands: NodeJS.Dict<any>[] = [];

    handlers: BaseComponent[] = [];

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

        this.log.info("Initializing Discord Components...")
        await this.initializeDiscordComponents();

        this.log.info("Registering commands with guilds...")
        await this.registerCommandsWithGuild('BlueBubbles');

        this.log.info("Listening for events...")
        this.listenForEvents();
    }

    private listenForEvents() {
        this.client.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return;
        
          // If we have a handler for the command name, invoke it
          const handler = this.handlers[interaction.commandName];
          if (handler) {
            this.log.info(`Handling interaction for command ${interaction.commandName}...`);
            await handler.handle(interaction);
          }
        });
    }

    private async initializeDiscordClient(token: string): Promise<Client> {
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages
            ]
        });

        await client.login(token);
        return client;
    }

    private initializeDiscordApi(token: string): REST {
        return new REST({ version: '10' }).setToken(token);
    }

    private async initializeDiscordComponents() {
        // Load the commands from the commands directory
        const commandsPath = path.join(__dirname, 'commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const { default: command } = await import(`./commands/${file}`);
            this.commands.push(command);
        }

        // Load the command handlers from the handlers directory
        const handlersPath = path.join(__dirname, 'handlers');
        const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'));
        for (const file of handlerFiles) {
            const { default: Handler } = await import(`./handlers/${file}`);
            const Module = new Handler(this.components);
            this.handlers[Module.id] = Module;
        }
    }

    async fetchGuild(name: string): Promise<Guild> {
        const guilds = await this.client.guilds.fetch();
        const guild = guilds.find((g) => g.name === name);
        if (!guild) throw new Error("Guild not found");
        return await guild.fetch();
    }

    private async registerCommandsWithGuild(guildName: string): Promise<void> {
        if (!this.commands || this.commands.length === 0) {
            console.warn("No commands to register");
            return;
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