import { IMessageHandler } from "./IMessageHandler";
import { MessageBus } from "./messageBus";

export enum MessagePriority {
    NORMAL,
    HIGH
}

export class Message {
    /* The message code */
    public code: string;

    /* The message data */
    public context: any;

    /* The sender of the message */
    public sender: any;

    public priority: MessagePriority;

    public constructor(
        code: string,
        sender: any,
        context?: any,
        priority: MessagePriority = MessagePriority.NORMAL
    ) {
        this.code = code;
        this.sender = sender;
        this.context = context;
        this.priority = priority;
    }

    /**
     * Send a message
     * @param code The code to send
     * @param sender The sender of the message
     * @param context The context of the message
     */
    public static send(code: string, sender: any, context?: any) {
        MessageBus.post(
            new Message(code, sender, context, MessagePriority.NORMAL)
        );
    }

    /**
     * Send a high priority message
     * @param code The code to send
     * @param sender The sender of the message
     * @param context The context of the message
     */
    public static sendPriority(code: string, sender: any, context?: any) {
        MessageBus.post(
            new Message(code, sender, context, MessagePriority.HIGH)
        );
    }

    /**
     * Subscribe to a code
     * @param code The code to subscribe to
     * @param handler The handler for the code
     */
    public static subscribe(code: string, handler: IMessageHandler) {
        MessageBus.addSubscription(code, handler);
    }

    /**
     * Unsubscribe from a code
     * @param code The code to unsubscribe from
     * @param handler The handler for the code
     */
    public static unsubscribe(code: string, handler: IMessageHandler) {
        MessageBus.removeSubscription(code, handler);
    }
}
