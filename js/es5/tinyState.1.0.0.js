/**
 * Publish/Subscribe Manager
 */
var PubSub = function () {
    this.events = {};
};

PubSub.prototype.subscribe = function (event, callback) {
    var self = this;

    if (!self.events.hasOwnProperty(event)) {
        self.events[event] = [];
    }

    return self.events[event].push(callback);
};

PubSub.prototype.publish = function (event, data) {
    data = data || {};

    let self = this;

    if (!self.events.hasOwnProperty(event)) {
        return [];
    }

    return self.events[event].map(function(eventCallback) {
        return eventCallback(data);
    });
};

/**
 * Registered action functions
 */

var actions = {
    addItem: function (context, payload) {
        context.commit('addItem', payload);
    },
    clearItem: function (context, payload) {
        context.commit('clearItem', payload);
    }
};

/**
 * Registered mutations functions
 */
var mutations = {
    addItem: function (state, payload) {
        state.items.push(payload);

        return state;
    },
    clearItem: function (state, payload) {
        state.items.splice(payload.index, 1);

        return state;
    }
};

var state = {
    items: localStorage.getItem('stateTodo') 
        ? 
            JSON.parse(localStorage.getItem('stateTodo')).items 
        : 
            [
                'I made this',
                'I also made this',
                'Followed by this. I know right.'
            ]
};