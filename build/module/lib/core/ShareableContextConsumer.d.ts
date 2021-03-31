import { ContextConsumer } from './ContextConsumer';
import { ContextManager } from './ContextManager';
import { ShareableBase } from './ShareableBase';
/**
 * @hidden
 */
export declare class ShareableContextConsumer extends ShareableBase implements ContextConsumer {
    protected contextManager: ContextManager;
    /**
     * Keep track of subscription state
     */
    private isSubscribed;
    /**
     * Creates a subscription to WebGL rendering context events from the contextManager but
     * defers synchronization (because this is a base class).
     * The contextManager must be defined.
     * @param contextManager The ContextManager that will be subscribed to for WebGL rendering context events.
     */
    constructor(contextManager: ContextManager);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
    /**
     * Instructs the consumer to subscribe to context events.
     *
     * This method is idempotent; calling it more than once with the same <code>ContextManager</code> does not change the state.
     */
    private subscribe;
    /**
     * Instructs the consumer to unsubscribe from context events.
     *
     * This method is idempotent; calling it more than once does not change the state.
     */
    private unsubscribe;
    /**
     *
     */
    synchUp(): void;
    /**
     *
     */
    cleanUp(): void;
    contextFree(): void;
    contextGain(): void;
    contextLost(): void;
    /**
     * Provides access to the underlying WebGL context.
     */
    get gl(): WebGLRenderingContext;
}
