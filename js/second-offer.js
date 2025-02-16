var secondOffer = function (loginUrl) {
	var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
	var iOS = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent) && !window.MSStream;
	var secondOfferLink = 'https://tracker.cmclicks000.com/click.php?key=d5gh7jwcujwuw6hzp5dw&zone=so_lp';
	var searchParams = new URLSearchParams(window.location.search);
	var oid = searchParams.get("oid");

	if (oid) {
		secondOfferLink+='&oid='+oid
	}

	if ( isSafari && iOS ) {
		window.location.href = loginUrl;
	} else {
		window.open(loginUrl, '_blank');
		window.location.href = secondOfferLink;
	} 
}
