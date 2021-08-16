import { IMessageHandler } from "./IMessageHandler";
import { Message, MessagePriority } from "./message";
import { MessageSubscriptionNode } from "./messageSubscriptionNode";

export class MessageBus {
    private static _subscriptions: { [code: string]: IMessageHandler[] } = {};

    private static _normalQueueMessagePerUpdate = 10;
    private static _normalMessageQueue: MessageSubscriptionNode[] = [];

    private constructor() {}

    /**
     * Add a subscrition to the specified message code
     *
     * @param code The code to subcribe to
     * @param handler The handler for the message
     *
     * @example
     * MessageBus.addSubscription("EXAMPLE_CODE", handler);
     */
    public static addSubscription(code: string, handler: IMessageHandler) {
        if (MessageBus._subscriptions[code] === undefined) {
            MessageBus._subscriptions[code] = [];
        }

        // If the subscriptions array already has the handler
        if (MessageBus._subscriptions[code].indexOf(handler) !== -1) {
            console.warn(
                `Attempting to add a duplicate handler to code: ${code}. Subscription not added`
            );
        } else {
            MessageBus._subscriptions[code].push(handler);
        }
    }

    /**
     * Remove a subscrition from the specified message code
     *
     * @param code The code to subcribe to
     * @param handler The handler for the message
     *
     * @example
     * MessageBus.removeSubscription("EXAMPLE_CODE", handler);
     */
    public static removeSubscription(code: string, handler: IMessageHandler) {
        if (MessageBus._subscriptions[code] === undefined) {
            console.warn(
                `Cannot unsubscribe handler from code: ${code} because that code is not subscribed to`
            );
            return;
        }

        const nodeIndex = MessageBus._subscriptions[code].indexOf(handler);

        // If the subscriptions array already has the handler
        if (nodeIndex !== -1) {
            MessageBus._subscriptions[code].splice(nodeIndex, 1);
        }
    }

    /**
     * Post a message
     *
     * @param message The message to post
     *
     * @example
     * MessageBus.post(
     *       new Message(code, sender, context, MessagePriority.NORMAL)
     *   );
     */
    public static post(message: Message) {
        console.log(`Message posted: ${message}`);

        const handlers = MessageBus._subscriptions[message.code];
        if (!handlers) return;

        for (const handler of handlers) {
            if (message.priority === MessagePriority.HIGH) {
                handler.onMessage(message);
            } else {
                MessageBus._normalMessageQueue.push(
                    new MessageSubscriptionNode(message, handler)
                );
            }
        }
    }

    /**
     * Update loop
     *
     * @example
     * MessageBus.update();
     */
    public static update() {
        if (MessageBus._normalMessageQueue.length === 0) return;

        const messageLimit = Math.min(
            MessageBus._normalQueueMessagePerUpdate,
            MessageBus._normalMessageQueue.length
        );

        for (let i = 0; i < messageLimit; i++) {
            const node = MessageBus._normalMessageQueue.pop();
            node?.handler.onMessage(node.message);
        }
    }
}
