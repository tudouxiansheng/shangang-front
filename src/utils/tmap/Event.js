export default class Event {
    events = {};

    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = new Set();
        }
        this.events[eventName].add(callback);
        return () => {
            this.off(eventName, callback);
        };
    }

    // off(eventName, callback) {
    //     this.events[eventName]?.delete(callback);
    // }

    // fire(eventName, params) {
    //     this.events[eventName]?.forEach((cb) => {
    //         cb(params);
    //     });
    // }
}
