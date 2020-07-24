import Store from './store.js'
import TestRunner from './testRunner.js';

(function runTests(tests) {
    tests.forEach(test => test(new Store(), new TestRunner()));
}(
    [
        // 'it should be able to add a subscribe event, and run publish returning the expected results'
        (function(store, testRunner) {
            console.log('it should be able to add a subscribe event, and run publish returning the expected results');
        
            testRunner.addTest({
                testName: 'subscribe-success',
                context: store.events,
                testFn: store.events.subscribe,
                testData: 'hello, world!',
                eventName: 'test',
                eventCb: (testData) => testData,
                expectedResult: 1
            });
    
            // 'it should be able to add a subscribe event, and pass if the correct number of named events are returned'
            testRunner.unitTest('subscribe-success');
    
            testRunner.addTest({
                testName: 'publish-success',
                context: store.events,
                testFn: store.events.publish,
                eventName: 'test',
                testData: 'hello, world!',
                expectedResult: ['hello, world!']
            });
    
            // 'it should be able to emit a publish event, and pass if the wrong number subscribe results are returned'
            testRunner.unitTest('publish-success');
    
        }),
        (function(store, testRunner) {
            console.log('it should be able to add a subscribe event, and fail if subscribe or publish returns the wrong event data');
    
            testRunner.addTest({
                testName: 'subscribe-fail',
                context: store.events,
                testFn: store.events.subscribe,
                eventName: 'test',
                eventCb: (testData) => testData,
                expectedResult: 2
            });
    
            // 'it should be able to add a subscribe event, and fail if the wrong number of named events are returned'
            testRunner.unitTest('subscribe-fail');
    
            testRunner.addTest({
                testName: 'publish-fail',
                context: store.events,
                testFn: store.events.publish,
                testData: 'hello, world again!',
                eventName: 'test',
                expectedResult: ['not this time']
            });
    
            // 'it should be able to emit a publish event, and fail if the wrong number subscribe results are returned'
            testRunner.unitTest('publish-fail');

        }),
        (function(store, testRunner) {
            console.log('it should be able to add multiple subscribe callbacks, and pass if publish returns correct event data');
    
            testRunner.addTest({
                testName: 'subscribe-success',
                context: store.events,
                testFn: store.events.subscribe,
                eventName: 'test',
                eventCb: (testData) => testData,
                expectedResult: 1
            });
    
            testRunner.addTest({
                testName: 'subscribe-success',
                context: store.events,
                testFn: store.events.subscribe,
                eventName: 'test',
                eventCb: (testData) => testData,
                expectedResult: 1
            });
    
            // 'it should be able to add multiple subscribe events, and pass if the correct number of named events are returned'
            testRunner.unitTest('subscribe-success');
    
            testRunner.addTest({
                testName: 'publish-success',
                context: store.events,
                testFn: store.events.publish,
                eventName: 'test',
                testData: 'hello, world!',
                expectedResult: ['hello, world!', 'hello, world!']
            });
    
            // 'it should be able to emit a publish event, and pass if the corrent number subscribe callbacks are executed and returned as expected values'
            testRunner.unitTest('publish-success');
        }),
        (function(store, testRunner) {
            console.log('it should be able to run all tests in memory');
    
            testRunner.addTest({
                testName: 'subscribe-success1',
                context: store.events,
                testFn: store.events.subscribe,
                eventName: 'test',
                eventCb: (testData) => testData,
                expectedResult: 1
            });
    
            testRunner.addTest({
                testName: 'subscribe-success2',
                context: store.events,
                testFn: store.events.subscribe,
                eventName: 'test',
                eventCb: (testData) => testData,
                expectedResult: 2
            });

            testRunner.addTest({
                testName: 'subscribe-success3',
                context: store.events,
                testFn: store.events.subscribe,
                eventName: 'test',
                eventCb: (testData) => testData,
                expectedResult: 3
            });

            testRunner.addTest({
                testName: 'subscribe-success4',
                context: store.events,
                testFn: store.events.subscribe,
                eventName: 'test',
                eventCb: (testData) => testData,
                expectedResult: 4
            });
    
            testRunner.addTest({
                testName: 'publish-success',
                context: store.events,
                testFn: store.events.publish,
                eventName: 'test',
                testData: 'hello, world!',
                expectedResult: ['hello, world!', 'hello, world!', 'hello, world!', 'hello, world!']
            });

            testRunner.runAllTests();
        })
    ]
    )
)