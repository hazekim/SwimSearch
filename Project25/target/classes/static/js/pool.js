console.log("📦 JS AUTO START");

let map;
let markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 53.3498, lng: -6.2603 }, // 예: 더블린
        zoom: 12,
    });

    loadPools();
}

function loadPools() {
    fetch('/api/pools')
        .then(res => res.json())
        .then(data => {
            console.log("✅ Received data:", data);

            const tbody = document.querySelector('#poolInfo tbody');
            tbody.innerHTML = ""; // 테이블 초기화

            data.forEach(pool => {
                // ⬇️ 테이블 행 추가
                const row = document.createElement('tr');
                row.innerHTML = `
          <td>${pool.id}</td>
          <td>${pool.name}</td>
          <td>${pool.address}</td>
          <td>${pool.contact}</td>
          <td>${pool.email}</td>
          <td>${pool.length}</td>
          <td>${pool.depth}</td>
          <td>${pool.lane}</td>
        `;
                tbody.appendChild(row);

                //지도 마커 추가
                if (pool.address) {
                    const geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ address: pool.address }, (results, status) => {
                        if (status === "OK") {
                            const position = results[0].geometry.location;
                            const marker = new google.maps.Marker({
                                map,
                                position,
                                title: pool.name,
                            });

                            // 마커 정보창
                            const infoWindow = new google.maps.InfoWindow({
                                content: `<strong>${pool.name}</strong><br>${pool.address}`
                            });

                            marker.addListener("click", () => {
                                infoWindow.open(map, marker);
                            });

                            markers.push({ id: pool.id, marker, position });

                            // 행 클릭 시 이동
                            row.addEventListener("click", () => {
                                map.setCenter(position);
                                map.setZoom(15);
                                infoWindow.open(map, marker);
                            });
                        } else {
                            console.warn("Geocode failed for:", pool.address, status);
                        }
                    });
                }
            });
        })
        .catch(err => {
            console.error("❌ Fetch failed:", err);
        });
}

// 전역에서 initMap 사용할 수 있게 설정
window.initMap = initMap;
