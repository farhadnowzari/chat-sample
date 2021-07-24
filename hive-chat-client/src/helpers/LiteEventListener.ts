interface IEventListener<T> {
    on(handler: { (data?: T) : void}): void;
}

export default class LiteEventListener<T> implements IEventListener<T> {
    
    handlers: { (data?: T): void; }[] = [];

    constructor() {
        this.handlers = [];      
    }

    on(handler: (data?: T) => void): void {
        this.handlers.push(handler);
    }

    trigger(data?:  T): void {
        this.handlers.slice(0).forEach(h => h(data));
    }

}