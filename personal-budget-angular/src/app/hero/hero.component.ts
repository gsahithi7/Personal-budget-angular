import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import Chart from 'chart.js/auto';
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
        this.createChartJSLineChart(data);
      } else {
        console.error("No data available to create pie chart.");
      }
    });
  }

  createD3PieChart(data: any[]) {
   
    const pieData = data.map(d => ({
      category: d.category,
      amount: parseFloat(d.amount)
    }));

    
    const width = 500;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    
    const svg = d3.select("#d3PieChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    
    const pie = d3.pie<any>().value(d => d.amount);

    
    const arc = d3.arc<any>().outerRadius(radius * 0.8).innerRadius(radius * 0.4);

    
    const arcs = svg.selectAll("arc")
      .data(pie(pieData))
      .enter()
      .append("g")
      .attr("class", "arc");

    
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

    
    arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(d => d.data.category)
      .attr("fill", "white"); 
  }

  createChartJSLineChart(data: any[]): void {
    
    const canvas = document.getElementById("chartjsLineChart") as HTMLCanvasElement;
  
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Failed to get the 2D rendering context for the canvas.");
      return;
    }
  
   
    canvas.width = 500; 
    canvas.height = 400; 
  
    
    const labels = data.map(d => d.category);
    const amounts = data.map(d => d.amount);
  
    const chartData = {
      labels: labels,
      datasets: [{
        label: 'Amount ($)',
        data: amounts,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false
      }]
    };
  
    
    new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        
        responsive: false, 
        maintainAspectRatio: false, 
        scales: {
          x: {
            title: {
              display: true,
              text: 'Category'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount ($)'
            }
          }
        }
      }
    });
  }
  
}
