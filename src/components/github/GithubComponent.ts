import { BaseComponent } from "../../base/BaseComponent.js";
import { Octokit } from '@octokit/rest';
import { createAppAuth } from "@octokit/auth-app";

const COMPONENT_ID = 'github';
const COMPONENT_NAME = 'GitHub Component';


export default class GithubComponent extends BaseComponent {
    private appId: string;

    private installationId: string;

    private privateKey: string;

    private clientId: string;

    private clientSecret: string;

    api: Octokit;

    constructor(...args: any[]) {
        super(COMPONENT_ID, COMPONENT_NAME, ...args);
    }

    async initialize(): Promise<void> {
        this.appId = process.env.GH_APP_ID;
        this.installationId = process.env.GH_INSTALLATION_ID;
        this.privateKey = process.env.GH_PRIVATE_KEY.replaceAll("\\n", "\n");
        this.clientId = process.env.GH_CLIENT_ID;
        this.clientSecret = process.env.GH_CLIENT_SECRET;
        if (!this.appId) throw new Error("GH_APP_ID is not defined");
        if (!this.installationId) throw new Error("GH_INSTALLATION_ID is not defined");
        if (!this.privateKey) throw new Error("GH_PRIVATE_KEY is not defined");
        if (!this.clientId) throw new Error("GH_CLIENT_ID is not defined");
        if (!this.clientSecret) throw new Error("GH_CLIENT_SECRET is not defined");

        this.api = new Octokit({
            authStrategy: createAppAuth,
            auth: {
                appId: this.appId,
                privateKey: this.privateKey,
                clientId: this.clientId,
                clientSecret: this.clientSecret,
                installationId: this.installationId
            },
            userAgent: "BlueBubbles/Copilot v1.0.0"
        });
    }
}