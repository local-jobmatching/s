$(document).keyup(function(a) {
  if ($("#loginFormHolder").is(":visible") && $("#loginFormHolder .lbl_signup_error").length > 0) {
    $(".lbl_signup_error").slideUp(300, function() {
      $(this).remove()
    })
  }
});
$(document).on("click", ".showLoginForm", function() {
  $("#stickyLoginButton").fadeOut(300, function() {
    $("#loginFormHolder").fadeIn(300)
  })
});
$(document).on("click", "#closeLogin span", function() {
  $("#loginFormHolder").fadeOut(300, function() {
    $("#stickyLoginButton").fadeIn(300)
  })
});
$(document).ready(function() {
  if (landingLanguage != "DE" && landingLanguage != "AT" && landingLanguage != "CH" || typeof loginFormButtonWillRedirect != "undefined" && loginFormButtonWillRedirect == true) {
    $("#stickyLoginButton, .showLoginForm").attr("href", landingRedirectTo);
    $(document).off("click", ".showLoginForm");
    $(document).on("click", ".showLoginForm", function() {
      window.location = landingRedirectTo
    });
    $("#loginFormHolder").remove()
  }
  $("form#loginform").submit(function(a) {
    a.preventDefault();
    $form = $(this);
    var b = objectifyForm($form);
    $.post("/user/login", b, function(d, c, e) {
      if (d.status == "error") {
        $form.find(".lbl_signup_error").remove();
        $form.find(".login_field:first").append($("<div class='lbl_signup_error'/>").html("Benutzername oder Passwort nicht erkannt."))
      } else {
        window.location = d.url
      }
    })
  })
});
var objectifyForm = function(b) {
  var a = $(b).serializeArray();
  var d = {};
  for (var c = 0; c < a.length; c++) {
    d[a[c].name] = a[c].value
  }
  return d
};
