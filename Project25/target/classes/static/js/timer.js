let startTime, timerInterval;

function formatTime(ms) {
    let minutes = String(Math.floor(ms / 60000)).padStart(2, '0');
    let seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
    let milliseconds = String(ms % 1000).padStart(3, '0');
    return `${minutes}:${seconds}.${milliseconds}`;
}

document.getElementById('startBtn').onclick = () => {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        document.getElementById('timer').textContent = formatTime(elapsed);
    }, 50);
    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;
};

document.getElementById('stopBtn').onclick = () => {
    clearInterval(timerInterval);
    const elapsed = Date.now() - startTime;
    const distance = Number(document.getElementById('distanceInput').value);
    if (distance <= 0) {
        alert("Please enter a valid distance.");
        return;
    }

    // 기록 저장 요청
    fetch('/api/records', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            userId: 1, // TODO: 실제 로그인된 사용자로 교체
            poolId: 1, // TODO: 실제 수영장 ID로 교체
            distance: distance,
            timeInMillis: elapsed
        })
    }).then(res => {
        if (res.ok) {
            alert('Record saved successfully!');
            loadRecords();
        } else {
            alert('Failed to save record.');
        }
    }).catch(() => alert('Failed to connect to the server.'));

    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    document.getElementById('timer').textContent = '00:00.000';
};

function loadRecords() {
    fetch('/api/records')
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('recordsTableBody');
            tbody.innerHTML = '';
            data.forEach(record => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                        <td>${record.userId}</td>
                        <td>${record.poolId}</td>
                        <td>${record.distance}</td>
                        <td>${formatTime(record.timeInMillis)}</td>
                        <td>${new Date(record.createdAt).toLocaleString()}</td>
                    `;
                tbody.appendChild(tr);
            });
        })
}
function loadLeaderboard() {
    const poolId = document.getElementById('poolInput').value;
    fetch(`/api/records/leaderboard/${poolId}`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('leaderboardBody');
            tbody.innerHTML = '';
            data.forEach((record, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${record.userId}</td>
                        <td>${record.distance}</td>
                        <td>${formatTime(record.timeInMillis)}</td>
                        <td>${new Date(record.createdAt).toLocaleString()}</td>
                    `;
                tbody.appendChild(tr);
            });
        });
}

loadRecords();
loadLeaderboard();