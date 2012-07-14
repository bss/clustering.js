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