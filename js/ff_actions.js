animationType = "fade";
var regLocation;
var maxNum = 99;
var minNum = 1;
var stepNr = 0;
$(document).ready(function() {
  stepNr = parseInt(stepNr);
  regLocation = $("li #dp-reg").closest('li[class*="step"]').index() + 1;
  if (regLocation < 1) {
    regLocation = $(".field-pseudo").closest('li[class*="step"]').index() + 1
  }
  $(".laststeps").on("click", function() {
    fadeToStepNo(12)
  });
  if (stepNr > 1) {
    fadeToStepNo(regLocation);
    $(pr + " li").removeClass("is-active");
    if (stepNr > 3) {
      updateActive(regLocation + stepNr - 2)
    } else {
      updateActive(regLocation + stepNr - 1)
    }
  }
  if ($(".error").length > 0) {
    $(".error").hide().slideDown(400)
  }
  $(".unibutton").on("click", function() {
    $(".unibutton, .ajxloader").toggle();
  });
  if ($("ul.v12").length === 1) {
    $(".male.iAm").on("click", function() {
      $("select#gender").val("MALE")
    });
    $(".female.iAm").on("click", function() {
      $("select#gender").val("FEMALE")
    });
    $(".male.iSearch").on("click", function() {
      $("#searchGender").val("MALE")
    });
    $(".female.iSearch").on("click", function() {
      $("#searchGender").val("FEMALE")
    });
  }
  $(st + ' [name="password"]').change(function() {
    $(st + ' [name="verifypassword"]').val($(this).val())
  });
  if ($("form.v12").length === 1) {
    $(".iAm.male").on("click", function() {
      $("input[name=usertype]").val("1")
    });
    $(".iAm.female").on("click", function() {
      $("input[name=usertype]").val("2")
    });
    $(".iSearch.female").on("click", function() {
      $("input[name=searchtype]").val("2")
    });
    $(".iSearch.male").on("click", function() {
      $("input[name=searchtype]").val("1")
    })
  }
  $(".iSearch").on("click", function() {
    $(st).removeClass("iSearch-man iSearch-woman");
    $(st).addClass($(this).data("isearch"))
  });
  if ($("form.regFive").length === 1) {
    $(".iAm.female.gender").click(function() {
      $(".iAm.male.gender, .iSearch.female.gender").addClass("inactive");
      $(".iAm.female.gender, .iSearch.male.gender").removeClass("inactive");
      $("input[name=usertype]").val("2");
      $("input[name=searchtype]").val("1")
    });
    $(".iAm.male.gender").click(function() {
      $(".iAm.male.gender, .iSearch.female.gender").removeClass("inactive");
      $(".iAm.female.gender, .iSearch.male.gender").addClass("inactive");
      $("input[name=usertype]").val("1");
      $("input[name=searchtype]").val("2")
    });
    $(".iSearch.female.gender").click(function() {
      $(".iSearch.female.gender").removeClass("inactive");
      $(".iSearch.male.gender").addClass("inactive");
      $("input[name=searchtype]").val("2")
    });
    $(".iSearch.male.gender").click(function() {
      $(".iSearch.female.gender").addClass("inactive");
      $(".iSearch.male.gender").removeClass("inactive");
      $("input[name=searchtype]").val("1")
    })
  }
    pageTweaks();
    $(".toolbar #countup").text(minNum);
    a(maxNum, minNum);
    function b(c) {
        c++;
        $(".toolbar #countup").animate({"font-size": "180%"}, 100);
        $(".toolbar #countup").text(c);
        $(".toolbar #countup").animate({"font-size": "80%"}, 300);
        if (typeof(Session) !== "undefined") {
            Session.set("countupValue", c)
        }
        return c
    }

  function a(d, f) {
    if (d <= f) {
      return
    }
    var g = 7;
    var c = 0.5;
    var e = (Math.random() * (g - c) + c) * 1000;
    setTimeout(function() {
      f = b(f);
      a(d, f)
    }, e)
  }

  $(".forcereg").click(function(c) {
    c.preventDefault();
    $("html, body").animate({scrollTop: $("#registration").offset().top}, 500);
    $(".form-container").delay(500).effect("shake", 1000);
    return false
  })
});
function printFriends() {
  var b = "";
  for (var a = 0; a < confFF.friends.length; a++) {
    b += '<div class="friendprofile">';
    b += '<a class="forcereg"><img src="' + confFF.friends[a][0] + '" /></a>';
    b += '<p class="forcereg">' + confFF.friends[a][1] + "</p>";
    b += "</div>"
  }
  document.write(b)
}
function printBullets() {
  var b = "";
  for (var a = 0; a < confFF.bullets.length; a++) {
    b += "<li>" + confFF.bullets[a] + "</li>"
  }
  document.write(b)
}
function printPosts() {
  var b = "";
  for (var a = 0; a < confFF.posts.length; a++) {
    b += '<div class="post">';
    b += '<div class="post-container">';
    b += '<a class="forcereg"><img src="' + confFF.posts[a].postpic + '" class="postpic" /></a>';
    b += '<div class="user">';
    b += '<span class="username forcereg">' + confFF.posts[a].username + "</span><br/>";
    b += '<span class="sideinfo forcereg">' + getRandomInt(2, 59) + confFF.labels.minutes + "</span>";
    b += "</div>";
    if (confFF.posts[a].post.indexOf("<img") !== -1) {
      b += '<a class="forcereg article">' + confFF.posts[a].post + "</a>"
    } else {
      b += confFF.posts[a].post
    }
    b += '<div class="comments sideinfo forcereg">' + confFF.posts[a].likes + "</div>";
    b += "</div>";
    b += '<div class="post-toolbar"><a class="social like forcereg">' + confFF.labels.like + '</a><a class="social comment forcereg">' + confFF.labels.comment + '</a><a class="social share forcereg">' + confFF.labels.share + '</a><br class="clear"/></div>';
    b += "</div>"
  }
  document.write(b)
}
function promoSidebar() {
  if (typeof confFF.ad !== "undefined") {
    var a = "";
    a += '<article class="promosidebar">';
    a += '<a class="forcereg advert"><img src="' + confFF.ad.img + '" /></a>';
    a += "<h3>" + confFF.ad.headline + "</h3>";
    a += '<p class="message">' + confFF.ad.text + "</p>";
    a += "</article>";
    document.write(a)
  }
}
function getRandomInt(b, a) {
  return Math.floor(Math.random() * (a - b)) + b
}
function fastForwardStart() {
  if (Url.getParameter("ffstart") === "true") {
    $("li.step" + regLocation + " .goPrev").hide();
    gotoStepNo(regLocation)
  }
}
function pageTweaks() {
  fastForwardStart()
}
$(document).keydown(function(a) {
  if (a.keyCode === 13) {
    if (currentStep >= regLocation && $("form input").is(":focus")) {
      $(".is-active .goNext").click()
    }
  }
});
