var passport = require('passport-strategy');

var URLStrategy = function (options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) { throw new TypeError("URL Strategy needs a verify callback"); }

  passport.Strategy.call(this);
  this.name = 'url';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
  this.queryName = options.queryName;
  this.failureRedirect = options.failureRedirect;


}

URLStrategy.prototype.authenticate = function (req, options) {
  var self = this;

  function verified (err, user, info) {
    if (err) { return self.redirect(self.failureRedirect); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  }

  this._verify(req.query[this.queryName], verified);
}

module.exports = URLStrategy;

/*
  Thanks @yarax and @jaradhanson for clear examples.
 */
