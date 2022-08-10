//create map
var map = L.map('map', { zoomControl: true }).setView([51.505, -0.09], 15);
if (L.Browser.mobile) {
    map.removeControl(map.zoomControl);
}
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 0.5,
    maxZoom: 19,
    attribution: '© OpenStreetMap',
    
}).addTo(map);
let marker;

var southWest = L.latLng(-89.98155760646617, -180),
    northEast = L.latLng(89.99346179538875, 180);
var bounds = L.latLngBounds(southWest, northEast);

map.setMaxBounds(bounds);

//show my location
function myLocation() {
    navigator.geolocation.getCurrentPosition((cords) => {
        // console.log(cords.coords);
        let lat = cords.coords.latitude
        let lng = cords.coords.longitude
        let myCords = [lat, lng]
        // marker.remove()
        fylToCords(myCords)
    })
}

fetch('https://api.ipify.org?format=json')
    .then((res) => res.json())
    .then((data) => findLocation(data.ip, 'local'))
myLocation() 

//find location by ip
const apiKey = 'at_M76DncpFribp6oichDmL74Kjhoo5F'
async function findLocation(ip, option) {
    try {
        const res = await fetch(`https://geo.ipify.org/api/v2/country,city,vpn?apiKey=${apiKey}&ipAddress=${ip}`);
        const data = await res.json();
        var ip = ip
        var location = data.location.region
        var timezone = data.location.timezone
        var isp = data.isp
        var lat = data.location.lat
        var lng = data.location.lng
        var cords = [lat, lng]
        if (option == "local") {
            updateDetails(ip, location, timezone, isp)
        }
        else if (option == "global") {
            fylToCords(cords)
            updateDetails(ip, location, timezone, isp)
        }
    } catch (error) {
        console.log("error");
    }
}

//update location details
function updateDetails(ip, location, timezone, isp) {
    const locationDetails = document.querySelectorAll('.location-details .content')
    locationDetails[0].innerText = `${ip}`
    locationDetails[1].innerText = `${location}`
    locationDetails[2].innerText = `UTC ${timezone}`
    locationDetails[3].innerText = `${isp}`
}

function fylToCords(cords) {
    map.flyTo(cords, map.getZoom(), {
        animate: true,
        duration: 2
    });
    marker = L.marker(cords).addTo(map);
}

const ipForm = document.querySelector(".ip-form")
const ipInput = ipForm.querySelector("input")
ipForm.addEventListener("submit", (e) => {
    marker.remove()
    e.preventDefault()
    findLocation(ipInput.value, 'global')
    ipInput.value = ''
})