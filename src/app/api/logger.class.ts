export class Logger {
    constructor(
        private readonly file: string
    ){}

    public log(message: string): void {
        console.log(`[${new Date().toISOString()}] ${message}`);
    }
}