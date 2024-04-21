document.addEventListener("DOMContentLoaded", function() {
    var scoreElement = document.getElementById('score');

    document.getElementById('start').addEventListener('click', function() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/start', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                console.log(xhr.responseText);
                document.getElementById('video_feed').setAttribute('src', '/video_feed');
            }
        };
        xhr.send();
    });

    document.getElementById('stop').addEventListener('click', function() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/stop', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                console.log(xhr.responseText);
                document.getElementById('video_feed').removeAttribute('src');
            }
        };
        xhr.send();
    });

    // Continuously update the score from the response
    var eventSource = new EventSource('/video_feed');
    eventSource.onmessage = function(event) {
        var parts = event.data.split('\r\n\r\n');
        if (parts.length > 1 && parts[1].startsWith('Score:')) {
            scoreElement.textContent = parts[1].substring(7);
        }
    };
});