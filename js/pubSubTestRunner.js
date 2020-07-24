import PubSub from './pubsub.js';
import Store from './store.js';

class AssertionLibrary {
    
    constructor() {
        const self = this;
        self._expected = undefined;
        self._constructing = true;

        if (this._expected || this._constructing) {
            this.to = {
                Equal: (val) => self.equal(val),
                notEqual: (val) => self.notEqual(val),
                beTrue: () => self.beTrue(),
                beTruthy: () => self.beTruthy(),
                beFalse: () => self.beFalse(),
                beFalsey: () => self.beFalsey(),
            };
            this.toBe = {
                Array: () => self.isArray(),
                Undefined: () => self.isUndefined(),
                String: () => self.isString(),
                Object: () => self.isObject(),
            };
        } else {
            this.throwError()
        }

        this._constructing = false;
        
    }

    set expected(value) {
        this._expected = value;
    }

    Expect(val) {
        this._expected = val;
        return this;
    }

    equal(val) {
        return this._expected ? val === this._expected : this.throwError();
    }

    notEqual(val) {
        this.reset();
        return val !== this._expected;
    }

    beTrue() {
        this.reset();
        return this._expected === true;
    }

    beTruthy() {
        this.reset();
        return Boolean(this._expected);
    }

    beFalse() {
        this.reset();
        return this._expected === false;
    }

    beFalsey() {
        this.reset();
        return Boolean(this._expected);
    }

    isArray() {
        this.reset();
        return Object.prototype.toString.call(this._expected) === '[object Array]';
    }

    isUndefined() {
        this.reset();
        return typeof this._expected === 'undefined';
    }

    isString() {
        this.reset();
        return typeof this._expected === 'string';
    }

    isObject() {
        this.reset();
        return this._expected !== null && typeof this._expected === 'object';
    }

    reset() {
        setTimeout(() => {
            this._expected = undefined;
        }, 1);
    }

    throwError(msg = 'You must set expect(val) first') {
        throw new Error(msg);
    }
}

export default class PubSubTestRunner {

    constructor() {
        this.tests = {};
        this.lib = new AssertionLibrary();
    }

    addTest(definition) {
        let { context, testName, testFn, testData, eventName, eventCb, expectedResult } = definition;

        this.tests[testName] = {
            testName,
            context,
            testFn,
            testData,
            eventName,
            eventCb,
            expectedResult
        };
    }

    runAllTests() {
        Object.keys(this.tests).forEach(test => this.unitTest(test));
    }

    unitTest(testName) {

        if (!(testName in this.tests)) {
            console.error(`${testName} is not scheduled for testing.`);
            return false;
        }

        let currentTest = this.tests[testName];

        switch (currentTest.testName.split('-')[0]) {
            case 'subscribe':
                this.testSubscribe(currentTest);
                break;
            case 'publish':
                this.testPublish(currentTest);
                break;
            default:
                break;
        }

    }

    testSubscribe(currentTest) {
        try {
            currentTest.result = currentTest.testFn.call(currentTest.context, currentTest.eventName, currentTest.eventCb);
            currentTest.success = this.lib.Expect(currentTest.result).to.Equal(currentTest.expectedResult);
         } catch (err) {
             console.error(err);
         }

         this.print(currentTest)
    }

    testPublish(currentTest) {
        try {
            currentTest.result = currentTest.testFn.call(currentTest.context, currentTest.eventName, currentTest.testData)
            currentTest.success = currentTest.result.map((res, i) => this.lib.Expect(res).to.Equal(currentTest.expectedResult[i]));
         } catch (err) {
             console.error(err);
         }

         this.print(currentTest)
    }

    print(currentTest) {
        if (Array.isArray(currentTest.result)) this.printAllResults(currentTest);
        else this.printSingularResult(currentTest);
    }

    printSingularResult(currentTest) {
        if (!currentTest.success) {
            console.log(`%c '${currentTest.testName}' test failed. Expected: ${currentTest.expectedResult}, Actual: ${currentTest.result}`, 'color: red');
            return false;
        }

        console.log(`%c '${currentTest.testName}' test passed. Expected: ${currentTest.expectedResult}, Actual: ${currentTest.result}`, 'color: green');
        return true;
    }

    printAllResults(currentTest) {
        currentTest.result.forEach((test, i) => {
            
            if (!currentTest.success[i]) {
                console.log(`%c '${currentTest.testName}' test failed. Expected: ${currentTest.expectedResult[i]}, Actual: ${currentTest.result[i]}`, 'color: red');
                return false;
            }
    
            console.log(`%c '${currentTest.testName}' test passed. Expected: ${currentTest.expectedResult[i]}, Actual: ${currentTest.result[i]}`, 'color: green');
        });
    }

}