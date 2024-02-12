import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DataserviceService } from '../dataservice.service';

@Component({
  selector: 'pb-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {

  constructor(private dataService: DataserviceService) { }

  ngOnInit(): void {
    this.fetchDataAndCreateChart();
  }

  fetchDataAndCreateChart(): void {
    this.dataService.fetchDataIfNeeded();
    this.dataService.getData().subscribe((data: any[]) => {
      if (data && data.length > 0) {
        this.createD3PieChart(data);
      } else {
        console.error("No data available to create pie chart.");
      }
    });
  }

  createD3PieChart(data: any[]) {
    // Set up the data for the pie chart
    const pieData = data.map(d => ({
      category: d.category,
      amount: parseFloat(d.amount)
    }));

    // Define the dimensions of the pie chart
    const width = 500;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    // Create an SVG element
    const svg = d3.select("#d3PieChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Create the pie generator
    const pie = d3.pie<any>().value(d => d.amount);

    // Create the arc generator
    const arc = d3.arc<any>().outerRadius(radius * 0.8).innerRadius(radius * 0.4);

    // Generate the pie chart slices
    const arcs = svg.selectAll("arc")
      .data(pie(pieData))
      .enter()
      .append("g")
      .attr("class", "arc");

    // Add the pie slices
    arcs.append("path")
      .attr("d", d => arc(d)!)
      .attr("fill", (d, i) => d3.schemeCategory10[i])
      .on("mouseover", function (d) {
        d3.select(this).transition()
          .duration(200)
          .attr("d", arc
            .innerRadius(radius * 0.4)
            .outerRadius(radius * 0.9)
          );
      })
      .on("mouseout", function (d) {
        d3.select(this).transition()
          .duration(200)
          .attr("d", arc);
      });

    // Add text labels without polylines
    arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(d => d.data.category)
      .attr("fill", "white"); // Set text color to white to make it more visible
  }

}
