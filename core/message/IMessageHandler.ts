import { Message } from "./message";

export interface IMessageHandler {
    /**
     * Called when a message is received
     *
     * @param message The message
     */
    onMessage(message: Message): void;
}
