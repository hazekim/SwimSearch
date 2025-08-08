let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 53.3498, lng: -6.2603 }, // 더블린 중심
        zoom: 12,
    });

    loadPoolMarkers();
}

function loadPoolMarkers() {
    fetch('/api/pools') // PoolInfoController에서 데이터 가져옴
        .then(res => res.json())
        .then(data => {
            data.forEach(pool => {
                if (!pool.address) return;

                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ address: pool.address }, (results, status) => {
                    if (status === "OK") {
                        new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location,
                            title: pool.name,
                        });
                    } else {
                        console.error("Geocode 오류: ", status, pool.address);
                    }
                });
            });
        });
}
