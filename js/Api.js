/**
 * @param {Object} FuckbookConfig
 * @constructor
 */
 function FuckbookApi(FuckbookConfig) {
  this.FuckbookConfig = FuckbookConfig;
  this.baseUrl = this.FuckbookConfig.baseUrl;
  this.token = this.FuckbookConfig.token;
  delete this.FuckbookConfig['baseUrl'];
  delete this.FuckbookConfig['token'];
}

/**
 * @param data
 * @returns {Promise}
 */
FuckbookApi.prototype.createUser = function (data) {
  var defaults = {
    ip_from_request: true,
    require_valid_username: false
  };
  var queryParams = qs.parse(window.location.search, {
    allowDots: true,
    ignoreQueryPrefix: true,
  });
  data = $.extend(defaults, queryParams, data, this.FuckbookConfig);
  return fetch(this.baseUrl + '/api/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': this.token
    },
    body: JSON.stringify(data)
  })
    .then(function (response) {
      return response.json().then(function (body) {
        if (response.ok) {
          if (null !== body['login_url']) {
            return body['login_url'];
          } else if (body.hasOwnProperty('fallback_url') && null !== body['fallback_url']) {
            return body['fallback_url'];
          }
          alert('Internal error, please try later');
          throw [];
        } else {
          body['errors'].forEach(function (error) {
            if ('blocked' === error.code) {
              alert('Internal error, please try later');
            }
          });
          throw body['errors'];
        }
      });
    });
};

/**
 * @param data
 * @returns {Promise}
 */
 FuckbookApi.prototype.authUser = function (data) {
  data = $.extend(data, this.FuckbookConfig);
  return fetch(this.baseUrl + `/api/user/auth?login=${data.login}&password=${data.password}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': this.token
    },
  })
    .then(function (response) {
      return response.json().then(function (body) {
        if (response.ok) {
          if (null !== body['login_url']) {
            return body['login_url'];
          } else if (body.hasOwnProperty('fallback_url') && null !== body['fallback_url']) {
            return body['fallback_url'];
          }
          alert('Internal error, please try later');
          throw [];
        } else {
          body['errors'].forEach(function (error) {
            if ('blocked' === error.code) {
              alert('Internal error, please try later');
            }
          });
          throw body['errors'];
        }
      });
    });
};
