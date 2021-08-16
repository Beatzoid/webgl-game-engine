import { IMessageHandler } from "./IMessageHandler";
import { Message } from "./message";

export class MessageSubscriptionNode {
    /* The message */
    public message: Message;

    /* The handler */
    public handler: IMessageHandler;

    public constructor(message: Message, handler: IMessageHandler) {
        this.message = message;
        this.handler = handler;
    }
}
