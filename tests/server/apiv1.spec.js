
const requireHelper = require('./requireHelper');
const apiv1 = requireHelper.require('routes/apiv1');
const App = requireHelper.require('src/App')
const assert = require('chai').assert;
const sinon = require('sinon');

// create mock request and response
let reqMock = {};

let resMock = {};
resMock.status = function () {
    return this;
};
resMock.send = function () {
    return this;
};
resMock.end = function () {
    return this;
};
sinon.spy(resMock, "status");
sinon.spy(resMock, "send");


describe('Get Weather', function () {

    it('with without city name', function () {
        reqMock = {
            query: {

            }
        };

        apiv1.getWeather(reqMock, resMock);

        assert(resMock.status.lastCall.calledWith(400), 'Unexpected status code:' + resMock.status.lastCall.args);
    });

    it('with valid city name and error from request call', function () {
        reqMock = {
            query: {
                zip: "Hamilton"
            }
        };

        const request = function (obj, callback) {
            callback("error", null, null);
        };

        apiv1.__set__("request", request);

        apiv1.getWeather(reqMock, resMock);

        assert(resMock.status.lastCall.calledWith(400), 'Unexpected response:' + resMock.status.lastCall.args);
        assert(resMock.send.lastCall.calledWith('Failed to get the data'), 'Unexpected response:' + resMock.send.lastCall.args);
    });

    it('with incomplete city name', function () {
        reqMock = {
            query: {
                zip: "Hamil"
            }
        };

        const request = function (obj, callback) {
            callback(null, null, {});
        };

        apiv1.__set__("request", request);

        apiv1.getWeather(reqMock, resMock);

        assert(resMock.status.lastCall.calledWith(400), 'Unexpected response:' + resMock.status.lastCall.args);
        assert(resMock.send.lastCall.args[0].msg === 'Failed', 'Unexpected response:' + resMock.send.lastCall.args);
    });

    it('with valid City Name', function () {
        reqMock = {
            query: {
                zip: "Hamilton"
            }
        };

        const body = {
            cod: 200,
            name: 'Hamilton',
            weather: [
                {
                    main: 'cold'
                }
            ],
            main: {
                temp: 20
            }
        };

        const request = function (obj, callback) {
            callback(null, null, body);
        };

        apiv1.__set__("request", request);

        apiv1.getWeather(reqMock, resMock);

        assert(resMock.status.lastCall.calledWith(200), 'Unexpected response:' + resMock.status.lastCall.args);
        assert(resMock.send.lastCall.args[0].city === 'Hamilton', 'Unexpected response:' + resMock.send.lastCall.args[0].city);
        assert(resMock.send.lastCall.args[0].weather === 'Conditions are cold and temperature is 20 C', 'Unexpected response:' + resMock.send.lastCall.args[0].weather);
    });
});
