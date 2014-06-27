'use strict';

describe('Service: Methods', function () {

  // load the service's module
  beforeEach(module('apiManApp'));

  // instantiate service
  var Methods;
  beforeEach(inject(function (_Methods_) {
    Methods = _Methods_;
  }));

  it('should do something', function () {
    expect(!!Methods).toBe(true);
  });

});
