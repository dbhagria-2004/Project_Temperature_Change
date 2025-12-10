const margin = { top: 50, right: 90, bottom: 50, left: 80},
      width = 750 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const svg = d3.select("#heatmap")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltip = d3.select(".tooltip");

d3.csv("../data/berkeley_decade_month_avg.csv", d3.autoType).then(data => {

  const decades = [...new Set(data.map(d => d.Decade))];

  const x = d3.scaleBand()
    .domain(decades)
    .range([0, width])
    .padding(0.02);

  const y = d3.scaleBand()
    .domain(months)
    .range([0, height])
    .padding(0.02);

  const color = d3.scaleSequential()
    .interpolator(d3.interpolateGreens)
    .domain([
        d3.min(data, d => d.Mean),
        d3.max(data, d => d.Mean)
    ]);

  // Axes
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("font-size", "11px");

  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("font-size", "11px");

  // Heatmap cells
  svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", d => x(d.Decade))
    .attr("y", d => y(d.Month))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .attr("fill", d => color(d.Mean))
    .on("mousemove", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(`
            <strong>Decade:</strong> ${d.Decade}s<br>
            <strong>Month:</strong> ${d.Month}<br>
            <strong>Avg Anomaly:</strong> ${d.Mean.toFixed(2)} °C
          `)
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY - 20 + "px");
    })
    .on("mouseleave", () => tooltip.style("opacity", 0));

  // =====================
  // LEGEND
  // =====================

  const legendHeight = 200;
  const legendWidth = 14;

  const legendScale = d3.scaleLinear()
    .domain(color.domain())
    .range([legendHeight, 0]);

  const legendAxis = d3.axisRight(legendScale)
    .ticks(5)
    .tickFormat(d => `${d}°C`);

  const legend = svg.append("g")
    .attr("transform",
      `translate(${width + 40}, ${(height - legendHeight) / 2})`
    );

  const defs = svg.append("defs");
  const gradient = defs.append("linearGradient")
    .attr("id", "legend-gradient")
    .attr("x1", "0%")
    .attr("y1", "100%")
    .attr("x2", "0%")
    .attr("y2", "0%");

  d3.range(0, 1.01, 0.1).forEach(t => {
    gradient.append("stop")
      .attr("offset", `${t * 100}%`)
      .attr("stop-color", color(
        color.domain()[0] + t * (color.domain()[1] - color.domain()[0])
      ));
  });

  legend.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#legend-gradient)");

  legend.append("g")
    .attr("transform", `translate(${legendWidth},0)`)
    .call(legendAxis);

  legend.append("text")
    .attr("x", -10)
    .attr("y", -12)
    .style("font-size", "12px")
    .style("font-weight", "600")
    .text("Avg Temp Anomaly (°C)");
});
