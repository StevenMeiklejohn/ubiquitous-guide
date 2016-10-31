var LineChart = function() {

  var container = document.getElementById('lineChart')

  var chart = new Highcharts.Chart({
    chart: {
      type: 'line',
      renderTo: container
    },
    title: {
      text: "Number Of Pokemon I've Caught"
    },
    series: [
      {
        name: "Water Pokemon",
        data: [2, 7, 10, 12, 14]
      },
      {
        name: "Fire Pokemon",
        data: [4, 3, 5, 18, 11 ]
      }
      ],
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
    } 

})

}