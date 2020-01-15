var map, infoWindow; 
var marker; 
var circle;
var FullAddress;
var uLat = 29.7604; 
var uLng = -95.3698; 
var RestType="mexican";  // 01/12/2020  RWK

function addMarker(location) { 
  var our_icon = { 
    url: "../static/images/EE_edited.png", // url 
    scaledSize: new google.maps.Size(35, 50), // scaled size 
    origin: new google.maps.Point(0, 0), // origin 
  }; 
 
  return new google.maps.Marker({ 
    position: location, 
    map: map, 
    icon: our_icon 
  }); 
} 

function FindAddress(alat, alng)
{
  console.log("from FindAddress", alat, alng);
  //var lat = parseFloat(document.getElementById("txtLatitude").value);
  //var lng = parseFloat(document.getElementById("txtLongitude").value);
  var latlng = new google.maps.LatLng(alat, alng);
  var geocoder = geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                alert("Location: " + results[1].formatted_address);
                document.getElementById("CenterBox").value = results[1].formatted_address;
            }
        }
    });
};


function initMap() { 
   map = new google.maps.Map(document.getElementById('map'), { 
   // center: { lat: 29.7604, lng: -95.3698 }, 
   center: { lat: uLat, lng: uLng }, 
   zoom: 14, 
   streetViewControl: false 
  }); 
  infoWindow = new google.maps.InfoWindow; 
 
  place = new google.maps.LatLng(uLat, uLng); 
  marker = addMarker(place) 
 
  console.log(marker); 

  var trafficLayer = new google.maps.TrafficLayer(); 
  var transitLayer = new google.maps.TransitLayer(); 
  var bikeLayer = new google.maps.BicyclingLayer(); 

  d3.select('#traffic-b').on('click', () => { 
    trafficLayer.setMap(map); 
    transitLayer.setMap(null); 
    bikeLayer.setMap(null); 
  }); 
  d3.select('#transit-b').on('click', () => { 
    trafficLayer.setMap(null); 
    transitLayer.setMap(map); 
    bikeLayer.setMap(null); 
  }); 
  d3.select('#bike-b').on('click', () => { 
    trafficLayer.setMap(null); 
    transitLayer.setMap(null); 
    bikeLayer.setMap(map); 
  }); 
  
  d3.select('#my-loc').on('click', () => { 
  console.log("My Location Clicked");
  if (navigator.geolocation) { 
      navigator.geolocation.getCurrentPosition(function (position) { 
        var pos = { 
          lat: position.coords.latitude, 
          lng: position.coords.longitude 
        }; 
        infoWindow.setPosition(pos); 
        marker.setMap(null); 
        marker = addMarker(pos) 
        map.setCenter(pos); 
        drawCircle(pos.lat, pos.lng, "2", "my-loc2");     // 01/14/2020
        FullAddress=FindAddress(pos.lat, pos.lng);
      }, function () { 
        handleLocationError(true, infoWindow, map.getCenter()); 
      }); 
    } else { 
      // Browser doesn't support Geolocation 
     handleLocationError(false, infoWindow, map.getCenter()); 
    } 
  }); 

  d3.select('#clear').on('click', () => { 
    console.log("clear Button Clicked");
    trafficLayer.setMap(null); 
    transitLayer.setMap(null); 
    bikeLayer.setMap(null); 
    circle.setMap(null);
  }); 
} 
 
function handleLocationError(browserHasGeolocation, infoWindow, pos) { 
  infoWindow.setPosition(pos); 
  infoWindow.setContent(browserHasGeolocation ? 
    'Error: The Geolocation service failed.' : 
    'Error: Your browser doesn\'t support geolocation.'); 
  infoWindow.open(map); 
} 
 
function getVals() { 
  console.log("getVals Button clicked ", uLat, uLng); 
 
  var noAddress=true;
  var noRadius=true;

  var AddressEntry = document.getElementById("CenterBox"); 
  var CenterEntry = document.getElementById("RadiusBox"); 
  var okayAddress = false;
  var okayRadius = false;
 
  if (AddressEntry.value == null || 
    AddressEntry.value == undefined || 
    AddressEntry.value.length == 0) 
  { 
    alert("The Address or City Box is empty.\n" + 
      "Please enter a place and then click on GO."); 
  } 
  else
  { okayAddress=true}

  if (CenterEntry.value == null || 
    CenterEntry.value == undefined || 
    CenterEntry.value.length == 0) 
  { okayRadius=false} 
  else
  { okayRadius=true}
 
  var xAddress = document.getElementById("CenterBox").value; 
  var xRadius = document.getElementById("RadiusBox").value; 
 
  console.log("Before okayAddress: ", xAddress, xRadius, okayAddress, okayRadius); 
 
  if (okayAddress)
  {
    //Begin geocoding 
    const platform = new H.service.Platform({ apikey: 't5hFrMbJixJv02I9pJWLb5ZdQbkmeiuHf5OpBGSLRdU' }); 
    searchText = xAddress; 
    var thislat; 
    var thislng; 

    const geocoder = platform.getGeocodingService(); 
    geocoder.geocode({ searchText }, result => { 
      // console.log(result); 
      const location = result.Response.View[0].Result[0].Location.DisplayPosition; 
      const { Latitude: thislat, Longitude: thislng } = location; 
      uLat=thislat;
      uLng=thislng;
      console.log("Within okayAddress: ", thislat, thislng, uLat, uLng); 
      ReinitMap(thislat, thislng);
      if (xRadius !== 0) drawCircle(uLat, uLng, xRadius, "ID-1");
    }); 
  }
 
  if (okayRadius) 
  {
    console.log("Radius: ", uLat, uLng, xRadius); 
    if (xRadius !== 0) drawCircle(uLat, uLng, xRadius, "ID-2"); 
  }
}; 
 
function drawCircle(xlat, xlng, xradius, xfrom) { 
  console.log("from drawCircle ", xlat, xlng, xradius, xfrom); 
  var center = new google.maps.LatLng(xlat, xlng); 
  circle = new google.maps.Circle 
    ({ 
      center: center, 
      map: map, 
      radius: xradius * 1609.34,   //*1609.34,          // IN METERS. 
      fillColor: '#FF6600', 
      fillOpacity: 0.2, 
      strokeColor: "#FFFF", 
      strokeWeight: 1         // DON'T SHOW CIRCLE BORDER. 
    }); 
  console.log("After Circle Draw");                   // 01/12/2020 RWK along with code below
  var DumStr=document.getElementById("myRestarauntType");
  xRestType=DumStr.innerText;
  var pos = xRestType.indexOf(":");       // 01/14/2020  changed from !!!: to :
  var TypeStr=xRestType.slice(pos+2)+" ";    // 01/14/2020  changed from +4 to +2
  console.log("|"+TypeStr+"|");
  var pos2=TypeStr.indexOf(" ");
  console.log(pos2);
  var RestCategory=TypeStr.substr(0,pos2);
  console.log(RestCategory);
  RestType=RestCategory;
  resturants(xlat, xlng, xradius*1609.34);
}; 
 
function ReinitMap(xLat, xLng) { 
  map = new google.maps.Map(document.getElementById('map'), { 
    // center: { lat: 29.7604, lng: -95.3698 }, 
    center: { lat: xLat, lng: xLng }, 
    zoom: 14, 
    streetViewControl: false 
  }); 
  var trafficLayer = new google.maps.TrafficLayer(); 
  var transitLayer = new google.maps.TransitLayer(); 
  var bikeLayer = new google.maps.BicyclingLayer(); 
 
  d3.select('#traffic-b').on('click', () => { 
    trafficLayer.setMap(map); 
    transitLayer.setMap(null); 
    bikeLayer.setMap(null); 
  }); 
  d3.select('#transit-b').on('click', () => { 
    trafficLayer.setMap(null); 
    transitLayer.setMap(map); 
    bikeLayer.setMap(null); 
    drawCircle(uLat,uLng,0, "ID-3");
  }); 
  d3.select('#bike-b').on('click', () => { 
    trafficLayer.setMap(null); 
    transitLayer.setMap(null); 
    bikeLayer.setMap(map); 
  }); 
  d3.select('#my-loc').on('click', () => { 
    console.log("My Location Clicked");
    if (navigator.geolocation) { 
        navigator.geolocation.getCurrentPosition(function (position) { 
          var pos = { 
            lat: position.coords.latitude, 
            lng: position.coords.longitude 
          }; 
          infoWindow.setPosition(pos); 
          marker.setMap(null); 
          marker = addMarker(pos) 
          map.setCenter(pos); 
          drawCircle(pos.lat, pos.lng, "1", "my-loc2");
          FullAddress=FindAddress(pos.lat, pos.lng);
        }, function () { 
          handleLocationError(true, infoWindow, map.getCenter()); 
        }); 
      } else { 
        // Browser doesn't support Geolocation 
       handleLocationError(false, infoWindow, map.getCenter()); 
      } 
    }); 
  d3.select('#clear').on('click', () => { 
    trafficLayer.setMap(null); 
    transitLayer.setMap(null); 
    bikeLayer.setMap(null); 
    circle.setMap(null);
  }); 
  marker.setMap(null) 
  new_place = new google.maps.LatLng(xLat, xLng); 
  marker = addMarker(new_place); 
} 

// 01/13/2020  RWK
function resturants(xLat, xLng, Radius)
{
  var pyrmont = {lat: xLat, lng: xLng};
  console.log(map);
  restType=RestType.toLowerCase();
  // restType="mexican";
  console.log("From Restaurant: ", "|"+restType+"|", " Circle Radius: ", Radius);
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(
    {location: pyrmont, radius: Radius/2, type: ['restaurant'], keyword:[restType]},
    function(results, status) {
      if (status !== 'OK') {console.log(status); return;}
      console.log("Number of Items @restaurant: "+results.length);
      createMarkers(results, restType);
    });
}

function createMarkers(places, RestType) {
  var NumRests=places.length;
  console.log("Number of Markers to be: "+NumRests);
  var placesList = document.getElementById('places');

  for (var i = 0; place = places[i]; i++) 
  {
    console.log("["+i+"]");
    console.log(place.name, place.vicinity);
    console.log(place.geometry.location);
    
    var image = 
    {
      url: place.icon,
      size: new google.maps.Size(51, 51),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(10, 20),
      scaledSize: new google.maps.Size(15, 15)
    };

    var ResMarker = new google.maps.Marker({
      map: map,
      icon: image,
      title: place.name+'\n'+place.vicinity,           // 01/14/2020 RWK
      position: place.geometry.location
    });

    // var li = document.createElement('li');
    // li.textContent = place.name;
    // placesList.appendChild(li);

    // bounds.extend(place.geometry.location);
  }
  // map.fitBounds(bounds);
}