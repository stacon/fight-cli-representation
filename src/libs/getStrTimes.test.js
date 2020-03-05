const {getStrTimes} = require('.');
const expect = require('expect');

describe('getStrTimes', () => {
    it('should return the str "lalos" 5 times', () => {
        // THEN
        expect(getStrTimes('lalos', 5)).toEqual('laloslaloslaloslaloslalos');
    });

    it('should return the str "lalos" 5 times delimetered with /', () => {
        // THEN
        expect(getStrTimes('lalos', 5, "/")).toEqual('lalos/lalos/lalos/lalos/lalos');
    });
})