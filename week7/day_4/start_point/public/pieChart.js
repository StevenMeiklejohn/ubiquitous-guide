var PieChart = function(title, data) {

  var container = document.getElementById('pieChart');

  var chart = new Highcharts.Chart({
    chart: {
      type: 'pie',
      renderTo: container
    },
    title: title,

    series: [
      {
        name: "Type",
        data: data
        }
    ]

    })
  }