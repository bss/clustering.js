clustering.js i a very simple clustering library.

Algorithms
===
Currently the library consist of:

* Simple k-means (Lloyd's algorithm)
* DBScan

Usage
===

k-means
---
See http://en.wikipedia.org/wiki/K-means_clustering for general explanation of algorithm.

	var data = [{id: 1, x: 1, y: 1}, 
	            {id: 2, x: 7, y: 5}, 
	            {id: 3, x: 6, y: 4}, ]

	var cluster = clustering.kmeans()
	  .size(4)	// Number of k-means clusters
	  .iterations(100)	// Number of iterations to run
	  .key(function (d) { return d.index; }) // Uniqly identifies an item
	  .x(function (d, obj) { 
	    if (arguments.length == 2) {
	      if(typeof(obj.x) == "undefined") obj.x = d.x;
	      return obj; 
	    } else {
	      return d.x;
	    }
	    return;
	  }) // Used to calculate the mean x value in the cluster
	  .y(function (d, obj) { 
	    if (arguments.length == 2) {
	      if(typeof(obj.x) == "undefined") obj.x = d.x;
	      return obj; 
	    } else {
	      return d.x;
	    }
	    return;
	  }) // Used to calculate the mean y value in the cluster
	  .distance(function (a, b) { return Math.sqrt( Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2) ); }); // Distance function

	var result = cluster.data(data)
	  .run();

dbscan
---
See http://en.wikipedia.org/wiki/DBSCAN for general explanation of algorithm.

	var data = [{id: 1, x: 1, y: 1}, 
				{id: 2, x: 7, y: 5}, 
				{id: 3, x: 6, y: 4}, ]

	var cluster = clustering.dbscan()
	  .epsilon(3)	// Distance value (eps in wikipedia article)
	  .minSize(1)	// Minimum size of cluster (MinPts in wikipedia article)
	  .key(function (d) { return String(d.id); }) // Uniqly identifies an item
	  .distance(function (a, b) { return Math.sqrt( Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2) ); }); // Distance function

	var result = cluster.data(data)
	  .run();

Contributions
===
Additional algorithms or improvements/bug fixes on existing are very welcome.

Authors
===

* Bo Stendal Sørensen ([@bss](https://github.com/bss))

License
===
Copyright (C) 2012 Bo Stendal Sørensen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.