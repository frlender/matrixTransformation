var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 700 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([-6,6])
    .range([0, width]);
var y = d3.scale.linear()
    .domain([-6,6])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");


var svg = d3.select(".col").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height/2 + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("x");

svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+width/2+ ",0)")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("y")

var generateDots = function(count) {
  var start = -3;
  var stop = 3;
  var step = (stop-start)/count;
  var range = d3.range(start,stop+step,step);
  var dots = [];
  range.forEach(function(e){
    range.forEach(function(e2){
      dots.push([e,e2]);
    });
  });
  return dots;
}

var colors = d3.scale.category10();
var color= function(d) {
  if(d[0]<0&&d[1]>0)
    return colors(0);
  else if(d[0]>0&&d[1]>0)
    return colors(1);
  else if(d[0]<0&&d[1]<0)
    return colors(2);
  else if(d[0]>0&&d[1]<0)
    return colors(3);
  else
    return "white";
}


var originData = generateDots(16);
var data = originData;
var sums = data.map(function(e) {
  return e[0]+e[1];
})
var min = d3.min(sums);
var max = d3.max(sums);
// var color = d3.scale.linear().domain([min,max]).range(['black','red']);
svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", function(d) { return x(d[0]); })
      .attr("cy", function(d) { return y(d[1]); })
      .style("fill", function(d) { return color(d); });

d3.select('#transform').on('click',transform);
d3.select('#load').on('click',load);

var line = d3.svg.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]); });


var mat,vectors;
function load() {
  var matStr = d3.select('textarea').property('value');
  mat = matStr.split('\n').map(function(e) {
    return e.split(',').map(function(e2) {
      return parseFloat(e2);
    })
  });
  var eigen = numeric.eig(mat);
  vectors = numeric.transpose(eigen.E.x);
  d3.select('#alert').text('');
  if(eigen.E.y){
    d3.select('#alert').text("Complex eigenvectors!")
  }
  var lineData = getLineData(vectors);
  d3.select('.line').remove();
  svg.append('path')
    .datum(lineData)
    .attr('class',"line")
    .attr('d',line);
}

function getLineData(vectors) {
  var res = [];
  res.push(vectors[0]);
  res.push([0,0]);
  res.push(vectors[1]);
  return res;
}

var transformed = false;
function transform() {
  var duration = 3000
  var currentVectors;
  if(!transformed){
    transformed = true;
    currentVectors = vectors.map(function(vector) {
      return numeric.dot(mat,vector)
    });
    data = data.map(function(e) {
      return numeric.dot(mat,e);
    });
  }else{
    transformed = false;
    currentVectors = vectors;
    data = originData;
  }

  svg.selectAll('.dot').data(data)
    .transition().duration(duration)
    .attr("cx", function(d) { return x(d[0]); })
    .attr("cy", function(d) { return y(d[1]); });
  svg.select('.line').datum(getLineData(currentVectors))
    .transition().duration(duration)
    .attr("d",line);
}

function loadTheta(theta){
  
}

// implement pure roation, svd
