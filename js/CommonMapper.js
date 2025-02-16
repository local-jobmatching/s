function FuckbookCommonMapper($form) {
  this.$form = $form;
}

/**
 * @returns {Object}
 */
FuckbookCommonMapper.prototype.extractParamaters = function () {
  var serializedForm = this.$form.serializeArray();
  var formData = {};
  for (var i = 0; i < serializedForm.length; i++) {
    var field = serializedForm[i];
    formData[field['name']] = field['value'];
  }
  return formData;
};
