var completeData = {};
var Text_0 = [];
var Text_1 = [];
var Text_2 = [];
var Text_3 = [];
var CreatedTimes=[];
function drawChart(canvasId, UpdatedTimes, Text_0, chartLabel) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    // Create a new chart instance
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: UpdatedTimes, // Make sure these are formatted correctly
            datasets: [{
                label: chartLabel,
                data: Text_0,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        tooltipFormat: 'll'
                    },
                    title: {
                        display: true,
                        text: 'Updated Time'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }
    });
}


function fetchData() {


    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = 'https://yogahacktest.kintone.com/k/v1/records.json?app=3';

    fetch(proxyUrl + targetUrl, {
        method: 'GET', // This specifies that it's a GET request
        headers: {
            'X-Cybozu-API-Token': 'xi278sPuBQOIqVLrQ6IHBMA3BNHUBiMWXGwqvzzK',
            'X-Requested-With': 'XMLHttpRequest' // This is often necessary when using CORS Anywhere
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        completeData = data;
        console.log(completeData);
        // Iterate over each record and collect the values of Text_0 to Text_3 and createdTime
        completeData.records.forEach(record => {
            if ('Text' in record) {
                Text_0.push(parseInt(record['Text'].value, 10));  // Convert string to integer
            }
            if ('Text_0' in record) {
                Text_1.push(parseInt(record['Text_0'].value, 10));  // Convert string to integer
            }
            if ('Text_1' in record) {
                Text_2.push(parseInt(record['Text_1'].value, 10));  // Convert string to integer
            }
            if ('Text_2' in record) {
                Text_3.push(parseInt(record['Text_2'].value, 10));  // Convert string to integer
            }
            if ('Updated_datetime' in record) {
                CreatedTimes.push(record['Updated_datetime']);  // Collect creation time
            }
        });
        drawChart("myChart",CreatedTimes, Text_0,"RIGHT LEG");
        drawChart("myChart1",CreatedTimes, Text_1,"LEFT LEG");
        drawChart("myChart2",CreatedTimes, Text_2,"MAT POS 1");
        drawChart("myChart3",CreatedTimes, Text_3,"MAT POS 2");
    })
    .catch(error => console.error('Error:', error));
}

fetchData();

