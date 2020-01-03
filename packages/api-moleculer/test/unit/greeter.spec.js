"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moleculer_1 = require("moleculer");
const greeter_service_1 = __importDefault(require("../../services/greeter.service"));
describe("Test 'greeter' service", () => {
    const broker = new moleculer_1.ServiceBroker();
    broker.createService(greeter_service_1.default);
    beforeAll(() => broker.start());
    afterAll(() => broker.stop());
    describe("Test 'greeter.hello' action", () => {
        it("should return with 'Hello Moleculer'", () => {
            expect(broker.call("greeter.hello")).resolves.toBe("Hello Moleculer");
        });
    });
    describe("Test 'greeter.welcome' action", () => {
        it("should return with 'Welcome'", () => {
            expect(broker.call("greeter.welcome", { name: "Adam" })).resolves.toBe("Welcome, Adam");
        });
        it("should reject an ValidationError", () => {
            expect(broker.call("greeter.welcome")).rejects.toBeInstanceOf(moleculer_1.Errors.ValidationError);
        });
    });
});
//# sourceMappingURL=greeter.spec.js.map