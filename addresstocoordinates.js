var apikey = "your google API key here"
var coords = [];
var fileuri = "cities.csv";
var container = document.getElementById("csvrows");

var resolve = function(addr, bar) {
	var xhr = new XMLHttpRequest();
	query = "https://maps.googleapis.com/maps/api/geocode/json?address=" + addr + "&key=" + apikey;
	xhr.open("GET", query, false);
	xhr.send()
	oneloaded(bar)
	var j = JSON.parse(xhr.responseText);
	return j
};

var tablerow = function(c) {
	console.log(c);
	return "<td>" + c[0] + "</td>" + "<td>"  + c[1] + "</td>" + "<td>" + c[2] + "</td>";
};

var csvrow = function(c) {
	return c[0] + "," + c[1] + "," + c[2] + "\n";
};

var initLoading = function(data) {
	elem = document.getElementById("loadingcontainer");
	bar = document.createElement("div")
	bar.className = "loadingbar";
	bar.innerText = data.length;
	bar.setAttribute("itemstoload", data.length);
	bar.setAttribute("itemsloaded", 0);
	elem.appendChild(bar);
	return bar
}

var oneloaded = function(b) {
	b.setAttribute("itemsloaded", +b.getAttribute("itemsloaded") + 1);
	b.style.width = String(b.getAttribute("itemsloaded") / b.getAttribute("itemstoload") * 100) + "%";
	b.innerText = b.getAttribute("itemsloaded");
	if(b.getAttribute("itemstoload") == b.getAttribute("itemsloaded")) {
		b.innerHTML = "<div id='bellissima' class='spin'>Bellissima!</span> " + b.innerText;
	}
}

document.getElementById("fileuri").innerText = fileuri;

d3.csv(fileuri, function(error, data) {
	if(error) {
		console.log(error);
		container.innerText = error.type;
	}
	
	console.log(data);

	bar = initLoading(data);
	
	data.forEach(function(d, i) {
		setTimeout(function() {
			georesult = resolve(d.city, bar)['results'][0]['geometry']['location'];
			entry = [d.city, georesult.lat, georesult.lng];
			coords.push(entry);
			container.innerText += csvrow(entry);

		}, i * 300);
	});
	console.log("eventually, when all timeouts have ran, use console.table(coords) to inspect what data was received");
});
