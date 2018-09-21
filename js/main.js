// ----
// Main
// ----

// Last modified
var len = document.lastModified.length;
var date = document.lastModified.substring(0,len-8).replace(/ /g,'').split('/');
var year = date[2];
date = date[2] + '-' + date[0] + '-' + date[1];
document.getElementById("lastModified").innerHTML = date;

// Store Steam prices from JSON into memory
var storePrices;
var file = "../resources/data.json";

var jsonFile = new XMLHttpRequest();
jsonFile.open("GET", file);
jsonFile.onreadystatechange = function() {
	if(this.readyState === 4) {
		if(this.status === 200 || this.status == 0) {
			storePrices = JSON.parse(this.responseText);
		}
	}
}
jsonFile.send();

// GET requests
var steamCardReq = new XMLHttpRequest();

// Work-around for no access-control-allow-origin header in the URLs used:
// git clone https://github.com/Rob--W/cors-anywhere.git
// cd cors-anywhere/
// heroku create
// git push heroku master
var proxy = "https://cabbagecanfly-cors.herokuapp.com";

steamCardReq.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var arr = JSON.parse(this.responseText);
		arr = arr.data;

		var insertHTML = function (el) {
			var tBody = document.getElementById("table_content");
			var row = tBody.insertRow();
		
			// Product name
			var cell = row.insertCell();
			cell.innerHTML = el[0][1];

			// Badge price
			cell = row.insertCell();
			cell.innerHTML = el[2];

			// Product price
			cell = row.insertCell();
			if (storePrices[el[0][0]] != undefined) {
				if (storePrices[el[0][0]]['initial'] != -1) {
					cell.innerHTML = "$" + storePrices[el[0][0]]['initial'] / 100;
					// Cost ratio
					cell = row.insertCell();
					cell.innerHTML = (parseFloat(el[2].substring(1)) / (storePrices[el[0][0]]['initial'] / 100)).toFixed(2);
				} else {
					cell.innerHTML = "N/A";
					// Cost ratio
					cell = row.insertCell();
					cell.innerHTML = "N/A";
				}
			}
			else {
				cell.innerHTML = "N/A";
				cell = row.insertCell();
				cell.innerHTML = "N/A";
			}
		};

		var i = 0;

		var insertHTMLLoop = function (loop) {
			var loopEnd = i + loop;
			while (i < loopEnd && i < arr.length) {
				insertHTML(arr[i]);
				i++;
			}
		};

		var j = 0;
		var interval = 115;
		while (j < arr.length / 100) {
			setTimeout(function() {
				insertHTMLLoop(100);
			}, j * interval);
			j++;
		}

		var id;
		var hr = document.getElementById("progress");
		var val = document.getElementById("progressVal");
		var hrProgress = function() {
			hr.style.width = (i / arr.length * 100) + '%';
			val.innerHTML = Math.round(i / arr.length * 100) + '%';
			if (i >= arr.length) {
				val.classList.add("fadeAway");
				clearInterval(id);
			}
		};
		var id = setInterval(hrProgress, 10);
	}
};

var url = "https://www.steamcardexchange.net/api/request.php?GetBadgePrices_Guest";
steamCardReq.open("GET", proxy + "/" + url);
steamCardReq.send();
