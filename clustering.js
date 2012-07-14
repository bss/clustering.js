(function (exports) {
  exports.clustering = {kmeans: kmeans, 
                        dbscan: dbscan};

  function kmeans() {
    var self = {},
      key,
      distance = function (a,b) { return 0; },
      data = [],
      assigned = {},
      clusters = [],
      iterations = 1,
          size = 1,
          x = function (p) { return p.x; },
          y = function (p) { return p.y; };

    self.key  = function (_) {
      if (!arguments.length) return key;
      key = _;
      return self;
    };

    self.x  = function (_) {
      if (!arguments.length) return x;
      x = _;
      return self;
    };

    self.y  = function (_) {
      if (!arguments.length) return y;
      y = _;
      return self;
    };

    self.distance  = function (_) {
      if (!arguments.length) return distance;
      distance = _;
      return self;
    };

    self.data = function (_) {
      if (!arguments.length) return data;
      data = _;
      return self;
    };

    self.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return self;
    };

    self.iterations = function(x) {
      if (!arguments.length) return iterations;
      iterations = x;
      return self;
    };

    self.run = function() {
        var means = [],
            seen = {},
            n = Math.min(size, data.length);

        // Initialize k random (unique!) means.
        for (var i = 0, m = 2 * n; i < m; i++) {
          var p = data[~~(Math.random() * data.length)], id = key(p);
          if (!(id in seen)) {
            seen[id] = 1;
            var obj = {};
            obj = x(p, obj);
            obj = y(p, obj);
            if (means.push(obj) >= n) break;
          }
        }
        n = means.length;

        // For each iteration, create a kd-tree of the current means.
        var mean;
        for (var j = 0; j < iterations; j++) {
          var kd = kdtree()
            .axes([x, y])
            .points(means);

          // Clear the state.
          for (var i = 0; i < n; i++) {
            mean = means[i];
            mean.sumX = 0;
            mean.sumY = 0;
            mean.size = 0;
            mean.data = [];
          }

          // Find the mean closest to each point.
          for (var i = 0; i < data.length; i++) {
            var point = data[i];
            mean = kd.find(point);
            mean.sumX += x(point);
            mean.sumY += y(point);
            mean.size++;
            mean.data.push(point);
          }

          // Compute the new means.
          for (var i = 0; i < n; i++) {
            mean = means[i];
            if (!mean.size) continue; // overlapping mean
            mean.x = mean.sumX / mean.size;
            mean.y = mean.sumY / mean.size;
          }
        }
        
        return means.map(function (m) { return m.data; });
      };

    return self;
  }

  function kdtree() {
    var self = {},
        axes = [function (d) { return d.x; }, function (d) { return d.y; }],
        root,
        points = [];

    self.axes = function(x) {
      if (!arguments.length) return axes;
      axes = x;
      return self;
    };

    self.points = function(x) {
      if (!arguments.length) return points;
      points = x;
      root = null;
      return self;
    };

    self.find = function(x) {
      return find(self.root(), x, root).point;
    };

    self.root = function(x) {
      return root || (root = node(points, 0));
    };

    function node(points, depth) {
      if (!points.length) return;
      var axis = axes[depth % axes.length], median = points.length >> 1;
      points.sort(order(axis)); // could use random sample to speed up here
      return {
        axis: axis,
        point: points[median],
        left: node(points.slice(0, median), depth + 1),
        right: node(points.slice(median + 1), depth + 1)
      };
    }

    function distance(a, b) {
      var sum = 0;
      for (var i = 0; i < axes.length; i++) {
        var axis = axes[i], d = axis(a) - axis(b);
        sum += d * d;
      }
      return sum;
    }

    function order(axis) {
      return function(a, b) {
        a = axis(a);
        b = axis(b);
        return a < b ? -1 : a > b ? 1 : 0;
      };
    }

    function find(node, point, best) {
      if (distance(node.point, point) < distance(best.point, point)) best = node;
      if (node.left) best = find(node.left, point, best);
      if (node.right) {
        var d = node.axis(node.point) - node.axis(point);
        if (d * d < distance(best.point, point)) best = find(node.right, point, best);
      }
      return best;
    }

    return self;
  }

  function dbscan() {
    var self = {},
      epsilon,
      minSize,
      key,
      distance = function (a,b) { return 0; },
      data = [],
      assigned = {},
      clusters = [];

    self.key  = function (_) {
      if (!arguments.length) return key;
      key = _;
      return self;
    };

    self.distance  = function (_) {
      if (!arguments.length) return distance;
      distance = _;
      return self;
    };

    self.epsilon  = function (_) {
      if (!arguments.length) return epsilon;
      epsilon = _;
      return self;
    };

    self.minSize = function (_) {
      if (!arguments.length) return minSize;
      minSize = _;
      return self;
    };

    self.data = function (_) {
      if (!arguments.length) return data;
      data = _;
      return self;
    };

    self.run = function () {
      assigned = {};
      clusters = [];
      data.forEach(function (d, _) {
        id = key(d);
        if ( !(id in assigned)) {  // Only go through unvisited points
          assigned[id] = 1; // Marks as visited
          var neighbours = findNeighbours(d);
          if ( neighbours.length < minSize) {
                assigned[id] = -1; // Mark as noise
            } else {
            var clusterIdx = clusters.length; // Next cluster index
            clusters[clusterIdx] = [];  // new cluster
            expandCluster(d, neighbours, clusterIdx);
          }
        }
      });
      return clusters;
    };

    function findNeighbours(d) {
      var neighbours = [];
      data.forEach(function (n, _) {
        if ( key(n) != key(d) ) {
          if (distance(d, n) <= epsilon) {
            neighbours.push(n);
          }
        }
      });
      return neighbours;
    }

    function expandCluster(d, neighbours, clusterIdx) {
      clusters[clusterIdx].push(d);
      assigned[key(d)] = clusterIdx;
      neighbours.forEach(function (n, i) {
        if ( !(key(n) in assigned)) {  // n not yet visited?
          var localNeighbours = findNeighbours(n);  // NP is neighbours'
          if (localNeighbours.length >= minSize) {
            //neighbours = neighbours.concat(localNeighbours);
            expandCluster(n, localNeighbours, clusterIdx);
          }
        }
        if (assigned[key(n)] === -1) {  // n not yet assigned to a cluster?
          clusters[clusterIdx].push(n);
          assigned[key(n)] = clusterIdx;
        }
      });
    }

    return self;
  }
})(this);