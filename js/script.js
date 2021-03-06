var map;
var ubicacion;
var geocoder;
var latLng;
var zoom;
var markers = [];
var list = [];
////////////////////////////////////////////////////////////////media

var myLatLng = {lat: -37.3455956, lng: -59.1401387};

var param = {
  q: "",
  geocode: "-37.3455956,-59.1401387,3111953km",
  count: 100,
  result_type: null
}

$("#save").on("click", mostrarMarcadores);

function initMap() {
  var opt = { minZoom: 2, maxZoom: 18 };
  // Create a marker and set its position.
  /*  marker = new google.maps.Marker({
  map: map,
  position: myLatLng,
  title: 'Hello World!'
});*/
geocoder = new google.maps.Geocoder();
geocoder.geocode({address: "Tandil"}, function(results, status) {
  console.log(results);
  ubicacion = {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()};
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: ubicacion.lat, lng: ubicacion.lng},
    zoom: 14,
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_CENTER}
    });
    latLng = map.getCenter().lat()
    zoom = map.getZoom();
    mpp = 156543.03392 * Math.cos(latLng * Math.PI / 180) / Math.pow(2, zoom);
    map.setOptions(opt);
    google.maps.event.addListener(map, 'click', function(event) {
      addMarker(event.latLng, map);
    });
  })
}

function load(string){
  var arreglo = string.split(',');

  var coordenadas = new google.maps.LatLng({lat: parseFloat(arreglo[0]), lng: parseFloat(arreglo[1])});
  $("#lugar").val(arreglo[2]);
  $("#idcliente").val(arreglo[3]);
  addMarker(coordenadas, map);
}

function mostrarMarcadores(){
  var string = "";
  for (var i = 0; i < markers.length; i++) {
    if (!(markers[i] === undefined)) {
      string += "<div>load("+'"'+markers[i].position.lat()+","+markers[i].position.lng()+","+markers[i].label+'"'+")</div>";
      //console.log("load("+'"'+markers[i].position.lat()+","+markers[i].position.lng()+","+markers[i].label+'"'+")");
    }
  }
  $("#load").html(string)
}

function show() {
  $(".marcadores").animate({width:'300px'},350);
}

function hide() {
  $(".marcadores").animate({width:'5px'},350);
}

$(".marcadores").hover(show, hide);

function addMarker(location, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  var marker = new google.maps.Marker({
    position: location,
    label: $("#lugar")[0].value +","+ $("#idcliente")[0].value,
    map: map,
    animation: google.maps.Animation.DROP
  });
  markers.push(marker);
  google.maps.event.addListener(marker, "rightclick", function (e) {
    marker.setMap(null);
    for (var i = 0; i < markers.length; i++) {
      if (markers[i] === undefined || markers[i].map === null) {
        markers[i] = undefined;
      }markers[i]
    }
  });
  $(".marcadores").append("<div>"+$("#lugar")[0].value +", Cliente: "+ $("#idcliente")[0].value+"</div>");
  var marks = $(".marcadores div");
  list.push(marks[(marks.length - 1)]);
  $(list[(list.length - 1)]).on("click", function() {
    ubicacion = {
      lat: markers[$(list).index(this)].position.lat(),
      lng: markers[$(list).index(this)].position.lng()
    };
    map.setCenter(ubicacion);
    //map.setCenter(ubicacion);
  })
}

$("#submit").on("click", function(){
  var calle = $("#lugar")[0].value;
  if ($("#rad").prop('checked')) {
    calle += ' ,tandil, buenos aires, argentina';
  }
  else {
    calle += ' , argentina';
  }
  geocoder.geocode({address: calle}, function(results, status) {
    if (status === 'OK') {
      var finaldir = "";
      if (results.length > 1) {
        var mensaje = "";
        for (var i = 0; i < results.length; i++) {
          mensaje += i+" - "+results[i].formatted_address+"\n";
        }
        finaldir = prompt(mensaje, "0");
        if (finaldir === null) {
          alert("no city");
          return;
        }
      }
      else {
        finaldir = 0;
      }
      ubicacion = {
        lat: results[finaldir].geometry.location.lat(),
        lng: results[finaldir].geometry.location.lng()
      };
      map.setCenter(ubicacion);
      addMarker(results[finaldir].geometry.location, map)
    }
    else{
      alert("no se encontro el lugar");
    }
  })
})



/*
geocoder.geocode({address: 'constitucion 272, tandil'}, function(results, status) {
if (status === 'OK') {
ubicacion = {
lat: results[0].geometry.location.lat(),
lng: results[0].geometry.location.lng()
};
map.setCenter(ubicacion);
marker = new google.maps.Marker({
position : results[0].geometry.location,
Map : map
});
}
else{
if (!(locacion === "")) {
var anuncio = "<div class='alerta mensaje'>no se encontro el lugar</div>"
$("#anuncio").append(anuncio);
$(".alerta").fadeOut(2000);
}
}
})
*/
