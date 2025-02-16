/**
 * @param {FuckbookCommonMapper} commonMapper
 * @param {jQuery} $form
 * @constructor
 */
function SgmproMapper(commonMapper, $form) {
  this.commonMapper = commonMapper;
  this.$form = $form;
}

/**
 * @returns {Object}
 */
SgmproMapper.prototype.getApiParameters = function() {
  var formData = this.commonMapper.extractParamaters();
  return {
    username: formData['login'],
    password: formData['password'],
    email: formData['email'],
    sex: this.extractSex(formData),
    match_sex: this.extractMatchSex(formData),
    birthdate: this.extractBirthdate(formData),
    location: formData['zipCode'],
    require_valid_username: false
  };
};

/**
 * @param {Object} formData
 * @returns {String}
 */
SgmproMapper.prototype.extractSex = function(formData) {
  var genders = {
    'FEMALE': 'female',
    'MALE': 'male',
    'COUPLE': 'couple'
  };
  return genders[formData['gender']];
};

/**
 * @param {Object} formData
 * @returns {String}
 */
SgmproMapper.prototype.extractMatchSex = function(formData) {
  var genders = {
    'FEMALE': 'female',
    'MALE': 'male',
    'COUPLE': 'couple'
  };
  return genders[formData['searchGender']];
};

/**
 * @param {Object} formData
 * @returns {Object}
 */
SgmproMapper.prototype.extractBirthdate = function(formData) {
  var date = '';
  var birthday = new Date(formData['birth_year'], formData['birth_month'], formData['birth_day']);
  if (Object.prototype.toString.call(birthday) === "[object Date]") {
    if (!isNaN(birthday.getTime())) {
      date = birthday.toISOString().split('T')[0]
    }
  }
  return date;
};


/**
 * @param {Object} errors
 */
SgmproMapper.prototype.applyErrors = function(errors) {
  var paramToSelectorMapping = {
    username: '#login',
    password: '#password',
    email: '#email',
    birthdate: '#birthdate'
  };
  $('.invalid-field').removeClass('invalid-field');
  for (var i = 0; i < errors.length; i++) {
    var paramName = errors[i]['field'];
    var selector = paramToSelectorMapping[paramName];
    this.$form.find(selector).addClass('invalid-field');
  }
  this.$form.addClass('invalid-form');
};
