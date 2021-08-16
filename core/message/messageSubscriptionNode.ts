import { IMessageHandler } from "./IMessageHandler";
import { Message } from "./message";

export class MessageSubscriptionNode {
    /* The message */
    public message: Message;

    /* The handler */
    public handler: IMessageHandler;

    /**
     * Creates a new message subscription node
     *
     * @param message The message
     * @param handler The handler
     *
     * @example
     * new MessageSubscriptionNode(message, handler);
     */
    public constructor(message: Message, handler: IMessageHandler) {
        this.message = message;
        this.handler = handler;
    }
}
