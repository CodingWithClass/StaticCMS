/*
StaticCMS is released under the BSD 3-clause license:
Copyright (c) 2014, Zebulon McCorkle
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
function insert(id, data) {
	return $("[data-id=\"" + id + "\"]").html(data);
}
function append(id, data) {
	return $("[data-id=\"" + id + "\"]").append(data);
}
function appendBeginning(id, data) {
	return $("[data-id=\"" + id + "\"]").html(data + $("[data-id=\"" + id + "\"]").html());
}
function remove(id) {
	return $("[data-id=\"" + id + "\"]").remove();
}
function loadPage(site, page, pageid) {
	prevpagename = currpagename;
	currpagename = pageid;
	$('[data-id="' + currpagename + '"]').addClass("active");
	$('[data-id="' + prevpagename + '"]').removeClass("active");
	insert("body", "");
	insert("site-title", site.title);
	insert("title", page.title + " - " + site.title);
	insert("prefix", page.prefix);
	switch (page.type) {
		case "default":
			insert("body", page.body);
			break;
		case "blog":
			$.each(page.entries, function(id, entry) {
				appendBeginning("body", "<hr /><div class=\"blog-entry\" data-id=\"blog-" + id + "\"><h2 class=\"entry-title\">" + entry.title + " <small>" + new Date(entry.time).toDateString() + "</small></h2>" + entry.body + "</div>");
			});
			break;
		default:
			insert("body", page.body);
			break;
	}
}

var site;
var prevpagename;
var currpagename;
$.ajax({
	url: "site.json",
	type: "GET",
	async: false
})
.fail(function(json) {
	try {
		site = JSON.parse(json.responseText);
	} catch (e) {
		throw "\"site.json couldn't be parsed. Fatal error.\"";
	}
});
site.pageJSONs = {};
$.each(site.pages, function(key, value) {
	$.ajax({
		url: "pages/" + value + ".json",
		type: "GET",
		async: false
	})
	.fail(function(json) {
		try {
			site.pageJSONs[value] = JSON.parse(json.responseText);
			append("topbar", '<li data-id="' + value + '"><a href="#" onclick="loadPage(site, site.pageJSONs[\'' + value + '\'], \'' + value + '\');">' + site.pageJSONs[value].title + ' </a></li>');
		} catch (e) {
			throw "\"pages/" + pageName + ".json couldn't be parsed. Fatal error.\"";
		}
	});
});
$.each(site.hide, function(key, value) {
	remove(value);
});
var pageName = window.location.hash.split("#")[1];
if (pageName == "" || typeof pageName == "undefined") {
	window.location = window.location + "#" + site.main;
	pageName = window.location.hash.split("#")[1];
}
if (typeof site.pageJSONs[pageName] == "undefined") {
	loadPage(site, site.pageJSONs["404"], "404");
} else {
	loadPage(site, site.pageJSONs[pageName], pageName);
}
