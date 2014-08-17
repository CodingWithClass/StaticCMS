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

var blogPosts = [];
function BlogPost(id) {
	this.element = $('<hr /><div data-name="entries-' + id + '"><h3>Post ' + id + '</h3><label><h4>Post Title</h4><input type="text" data-name="entries-' + id + '-title" /></label><label><h4>Post Time</h4><input type="text" data-name="entries-' + id + '-time" onload="this.value = new Date().toDateString();" title="Any time format readable by the JavaScript Date() constructor. Default is current time." /></label><label><h4>Body:</h4><textarea data-name="entries-' + id + '-body" style="height: 40%;"></textarea></label></div>');
	this.id = id;
	$("#ptype-blog").find("#posts").append(this.element);
	blogPosts[id] = this;
}
function Entry(title, date, body) {
	var tr = {};
	tr.title = title;
	tr.time = new Date(date).getTime();
	tr.body = body;
	return tr;
}
function addBlogPost() {
	return new BlogPost(blogPosts.length);
}
function value(dataname) {
	return $('[data-name="' + dataname + '"]').val();
}
function setValue(dataname, val) {
	return $('[data-name="' + dataname + '"]').val(val);
}

function generate() {
	// First, let's create the object.
	var page = {};
	// Add the title to the object
	page.title = value("title");
	// Add the type to the object
	page.type = value("type");
	// Check the type
	switch (page.type) {
		case "default":
			// Not much to do here
			page.body = value("body");
			break;
		case "blog":
			// Set the header
			page.prefix = value("prefix");
			// Entries array
			page.entries = [];
			$.each(blogPosts, function(key, val) {
				// Is the time empty? Set it to the current time!
				if (value("entries-" + val.id + "-time") == "" || typeof value("entries-" + val.id + "-time") == "undefined") {
					// Good thing I made function Entry()!
					page.entries[val.id] = Entry(value("entries-" + val.id + "-title"), new Date().getTime(), value("entries-" + val.id + "-body"));
				} else {
					// Good thing I made function Entry()!
					page.entries[val.id] = Entry(value("entries-" + val.id + "-title"), value("entries-" + val.id + "-time"), value("entries-" + val.id + "-body"));
				}
			});
			break;
	}
	// Create the string
	var pageString = JSON.stringify(page);
	// Display it!
	$("#pagejsoncontent").html(pageString);
	$('#pagejson').foundation('reveal', 'open');
}
$("[data-name=\"type\"]").change(function() {
	switch (value("type")) {
		case "default":
			$("#ptype-blog").hide();
			$("#ptype-default").show();
			break;
		case "blog":
			$("#ptype-default").hide();
			$("#ptype-blog").show();
			break;
	}
});
switch (value("type")) {
	case "default":
		$("#ptype-blog").hide();
		$("#ptype-default").show();
		break;
	case "blog":
		$("#ptype-default").hide();
		$("#ptype-blog").show();
		break;
}
setTimeout(function(){$("#_hc_bar").remove();},1000);
setInterval(function(){$("#_hc_bar").remove();},5000);
