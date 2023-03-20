export interface IBaseComponent {
    id: string,
    name: string,
    initialize(...args: any[]): Promise<void>;
}