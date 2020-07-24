import PubSub from '../lib/pubsub.js';

/**
 * CONSTANTS
 */
const $STORE = {
    MUTATION: 'mutation',
    MUTATIONS: 'mutations',
    ACTION: 'action',
    ACTIONS: 'actions',
};

const $STATUS = { 
    RESTING: 'resting', 
    ACTION: 'action',
    MUTATION: 'mutation',
};

const $STATE_CHANGE = 'stateChange';

/**
 * Store
 */
export default class Store {
    constructor(params = {}) {
        let self = this;

        self.actions = {};
        self.mutations = {};
        self.state = {};
        self.status = $STATUS.RESTING
        self.events = new PubSub();

        if (params.hasOwnProperty($STORE.ACTIONS)) {
            self.actions = params.actions;
        }

        if (params.hasOwnProperty($STORE.MUTATIONS)) {
            self.mutations = params.mutations;
        }

        self.state = new Proxy((params.state || {}), {
            set: function(state, key, value) {

                state[key] = value;
                console.log(`${$STATE_CHANGE} { ${key}: ${value} }`);
                
                self.events.publish('stateChange');
                self.events.publish('updateLocalStorage', self.state);

                if (self.status !== $STATUS.MUTATION) {
                    console.warn(`You should use a mutation to set ${key}`);
                }

                self.status = $STATUS.RESTING;

                return true;
            }
        });
    };

    dispatch(actionKey, payload) {
        let self = this;

        if (typeof self.actions[actionKey] !== 'function') {
            console.error(`Actions '${actionKey} doesn't exist.`);
            return false;
        }

        console.groupCollapsed(`ACTION: ${actionKey}`);

        self.status = $STATUS.ACTION;

        self.actions[actionKey](self, payload);

        console.groupEnd();

        return true;
    };

    commit(mutationKey, payload) {
        let self = this;

        if (typeof self.mutations[mutationKey] !== 'function') {
            console.error(`Mutation '${mutationKey}' does not exist;`);
            return false;
        }

        self.status = $STATUS.MUTATION;

        self.state = Object.assign(self.state, self.mutations[mutationKey](self.state, payload));

        return 
    };

}