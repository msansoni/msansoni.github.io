// RFactor Barcelona Telemetry from a Carrera GT
d3.csv("data.csv", cast, main);

var vCar, rThrottlePedal, pBrakeF1, x, y, y_rThrottlePedal, line, line_rThrottlePedal, margin = {},
    clip_top, clip_bottom, svg_top, svg_bottom, g_top, g_bottom, n;

function main(data) {
    // Data
    vCar = data.map(function(x) {
        return x.vCar;
    });
    rThrottlePedal = data.map(function(x) {
        return x.rThrottlePedal;
    });
    pBrakeF1 = data.map(function(x) {
        return x.pBrakeF1;
    });

    // Plots
    init();
}

function init() {
    n = 3000;

    svg_top = d3.select("#svg_top");
    svg_bottom = d3.select("#svg_bottom");
    g_top = svg_top.append("g");
    g_bottom = svg_bottom.append("g");

    x = d3.scaleLinear()
        .domain([0, n - 1]);

    y = d3.scaleLinear()
        .domain([40, 255]);

    y_rThrottlePedal = d3.scaleLinear()
        .domain([-100, 100]);

    y_pBrakeF1 = d3.scaleLinear()
        .domain([0, 200]);

    line = d3.line()
        .x(function(d, i) {
            return x(i);
        })
        .y(function(d, i) {
            return y(d);
        });

    line_rThrottlePedal = d3.line()
        .x(function(d, i) {
            return x(i);
        })
        .y(function(d, i) {
            return y_rThrottlePedal(d);
        });

    line_pBrakeF1 = d3.line()
        .x(function(d, i) {
            return x(i);
        })
        .y(function(d, i) {
            return y_pBrakeF1(d);
        });

    draw();
    render();
}

function draw() {
    clip_top = g_top.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")

    clip_bottom = g_bottom.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")

    g_top.append("g")
        .attr("clip-path", "url(#clip)")
        .append("path")
        .datum(vCar)
        .attr("class", "line")
        .attr("id", "vCar");

    g_bottom.append("g")
        .attr("clip-path", "url(#clip)")
        .append("path")
        .datum(rThrottlePedal)
        .attr("class", "line_rThrottlePedal")
        .attr("id", "rThrottlePedal");

    g_bottom.append("g")
        .attr("clip-path", "url(#clip)")
        .append("path")
        .datum(pBrakeF1)
        .attr("class", "line_pBrakeF1")
        .attr("id", "pBrakeF1")
        .transition()
        .duration(20)
        .ease(d3.easeLinear)
        .on("start", stream_data);
}

d3.select(window).on('resize', resize);

function resize() {
    render();
}

function render() {
    var element_width = d3.select('.col-xl-6').node().getBoundingClientRect().width;
    updateDimensions(element_width);

    x.range([0, width]);
    y.range([height, 0]);
    y_rThrottlePedal.range([height, 0]);
    y_pBrakeF1.range([height, 0]);

    svg_top
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom);
    g_top.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg_bottom
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom);
    g_bottom.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    clip_top
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom);

    clip_bottom
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom);
}

function updateDimensions(winWidth) {
    margin.top = 20;
    margin.right = 0;
    margin.left = 0;
    margin.bottom = 20;

    width = winWidth - margin.left - margin.right;
    height = 200 - margin.top - margin.bottom;
}

function stream_data() {
    vCar.push(vCar[0]);
    rThrottlePedal.push(rThrottlePedal[0]);
    pBrakeF1.push(pBrakeF1[0]);

    lines = d3.selectAll('.line')
        .attr("d", line)
        .attr("transform", null)
        .on("mouseover", function(d) {
            lines.style("stroke-width", "3px");
        })
        .on("mouseout", function() {
            lines.style("stroke-width", "1.5px");
        });

    lines_rThrottlePedal = d3.selectAll('.line_rThrottlePedal')
        .attr("d", line_rThrottlePedal)
        .attr("transform", null)
        .on("mouseover", function(d) {
            lines_rThrottlePedal.style("stroke-width", "3px");
        })
        .on("mouseout", function() {
            lines_rThrottlePedal.style("stroke-width", "1.5px");
        });

    lines_pBrakeF1 = d3.selectAll('.line_pBrakeF1')
        .attr("d", line_pBrakeF1)
        .attr("transform", null)
        .on("mouseover", function(d) {
            lines_pBrakeF1.style("stroke-width", "3px");
        })
        .on("mouseout", function() {
            lines_pBrakeF1.style("stroke-width", "1.5px");
        });

    d3.active(this)
        .attr("transform", "translate(" + x(-1) + ",0)")
        .transition()
        .on("start", stream_data);

    vCar.shift();
    rThrottlePedal.shift();
    pBrakeF1.shift();
}

function cast(d) {
    d.vCar = +d.vCar;
    d.rThrottlePedal = +d.rThrottlePedal;
    d.pBrakeF1 = +d.pBrakeF1;
    return d;
}
