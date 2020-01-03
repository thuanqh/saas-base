"use strict";
const GreeterService = {
    name: "greeter",
    /**
     * Service settings
     */
    settings: {},
    /**
     * Service dependencies
     */
    dependencies: [],
    /**
     * Actions
     */
    actions: {
        /**
         * Say a 'Hello'
         *
         * @returns
         */
        hello: () => "Hello Moleculer",
        /**
         * Welcome a username
         *
         * @param {String} name - User name
         */
        welcome: {
            params: {
                name: "string",
            },
            handler: ctx => `Welcome, ${ctx.params.name}`,
        },
    },
    /**
     * Events
     */
    events: {},
    /**
     * Methods
     */
    methods: {},
};
module.exports = GreeterService;
//# sourceMappingURL=greeter.service.js.map