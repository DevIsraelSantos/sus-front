import { prisma } from "@/prisma";
import { LogType } from "@prisma/client";

export class Logger {
    constructor(
        private readonly fileId: number
    ) { }

    async registerLog(message: string, type: LogType): Promise<void> {
        await prisma.logFile.create({
            data: {
                fileId: this.fileId,
                message,
                type
            }
        })
    }

    async log(message: string): Promise<void> {
        await this.registerLog(message, LogType.INFO)
    }

    async error(message: string): Promise<void> {
        await this.registerLog(message, LogType.ERROR)
    }

    async warn(message: string): Promise<void> {
        await this.registerLog(message, LogType.WARNING)
    }
}