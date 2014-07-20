var currentPage = "home";
var previousPage = null;

function update() {
	$("#body").load(currentPage +  "-module.html", function() {
		$("#page-" + previousPage).removeClass("active");
		$("#page-" + currentPage).addClass("active");
		previousPage = currentPage;
	});
}

function page(to) {
	currentPage = to;
	update();
}
