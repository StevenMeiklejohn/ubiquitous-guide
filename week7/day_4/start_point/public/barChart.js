

var BarChart = function() {

  var container = document.getElementById('barChart')

  var chart = new Highcharts.Chart({
    chart: {
      type: 'bar',
      renderTo: container
    },
    title: {
      text: "Populations Of Countries"
    },
    series: [
      {
        name: "populations",
        data: [80, 75, 12, 12, 14]
      }
      ],
    xAxis: {
      categories: ['America', 'Japan', 'Germany', 'Australia', 'May']
    } 
})
}


