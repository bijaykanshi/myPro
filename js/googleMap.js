var googleMap = {
   myPos: {},
   markers: [],
   address: [],
   getDiv: function (data) {
      var userName = data.name,
          id = data.id;
      userName = (userName.indexOf(" ") > 0) ? userName.replace(/\s/g, "_") : userName;
      href='javascript:register_popup(' + '"' + id + '"' + "," + '"' + userName + '"' +');',
      div = '<div class="sidebar-name infoWindow"><a href=' + href + '>'  + '<span>' + data.name + '</span></a><button onclick = "showDetail()">View Profile</button>' + '</div>';
      //div += '<div onclick = "showDetail()">View Profile</div>';
      return div;
  },
   initializeMarkerClusters: function(rows) {
      rows = rows[0];
      infowindow = new google.maps.InfoWindow();
      googleMap.markers = [];
            for(i=0; i<rows.length; i++) {
              var latLng = new google.maps.LatLng(rows[i].lattitude, rows[i].longitude),
                  marker,
                  clusterOptions,
                  globalMarker;
              //var latLng = new google.maps.LatLng(45.4214, -75.6919)
               marker = new MarkerWithLabel({
                 position: latLng,
                 draggable: true,
                 raiseOnDrag: true,
                 map: map,
                 labelContent: rows[i].name,
                 labelAnchor: new google.maps.Point(30, 0),
                 labelClass: "labels", // the CSS class for the label
                 labelStyle: {opacity: 0.75}
               });
              marker.data = rows[i];
              googleMap.markers.push(marker);

              //makeDiv(i, 15, "Marker #");
               google.maps.event.addListener(googleMap.markers[i], 'click', function(e) {
                  infowindow.setContent(getDiv(this.data));
                  infowindow.open(map, this);
                });
            }
            clusterOptions = { zoomOnClick: false }
            markerCluster = new MarkerClusterer(map, googleMap.markers, clusterOptions);
            globalMarker = googleMap.markers.slice();
            google.maps.event.addListener(markerCluster, 'clusterclick', function(cluster) {
              var content = '',
                  mapCluster = [];
              var info = new google.maps.MVCObject;
              info.set('position', cluster.center_);

              //----
              //Get markers
              var markers = cluster.getMarkers();

              var titles = "<table class = 'table' ng-controller = 'mapCtrl'> <tbody>";
              
              //Get all the titles
              for(var i = 0; i < markers.length; i++) {
                
                  //titles += googleMap.getDiv(markers[i].data);
                  titles += '<tr><td>'+markers[i].data.name+'</td><td><button ng-click = "openModal();">show Profile</button></td></tr>'
                  mapCluster[i] = markers[i].data;
              }
              titles += '</table> </tbody>';
              var scope = angular.element(
                  document.
                  getElementById("mapId")).
                  scope();
                  scope.$apply(function () {
                      scope.mapCluster = mapCluster;
              });
              infowindow.close();
              infowindow.setContent(titles); //set infowindow content to titles
              infowindow.open(map, info);
              google.maps.event.addListener(map, 'zoom_changed', function() { infowindow.close() });

            });
    },
    
    initialize: function(myInfo) {
      var lat = googleMap.myPos.lat || myInfo.lattitude,
          lng = googleMap.myPos.lng || myInfo.longitude,
          mapOptions = {
            center: new google.maps.LatLng(lat, lng),
            zoom: 9,
            disableDoubleClickZoom: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

      map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
    },
    ajaxRequest: function(method, url, data, dec) {
      var xmlhttp,
        me = this,
        parsed,
        results;
        
      if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
      }
      else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      xmlhttp.onreadystatechange=function() {
         if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            if (dec === 'address') {
                googleMap.extractAddress(xmlhttp);
            }
        }
      }
      xmlhttp.open(method, url, true);
      xmlhttp.send(data);
  },
  extractAddress: function(data) {
    var parsed,
        results,
        j;
     parsed = JSON.parse(data.responseText);
     results = parsed.results[0].address_components;
     googleMap.address = results;
     var scope = angular.element(document.getElementById("loginPage")).scope();
     if (scope) {
        scope.$apply(function () {
          scope.extractAddress();
       });
     }
  }
}
window.onload = function() {
   if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var url;
          googleMap.myPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          //url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng="'+position.coords.latitude+'","'+position.coords.longitude+'"&sensor=true';
          url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=28.5821072,77.3266879&sensor=true';
          googleMap.ajaxRequest('GET', url, undefined, 'address');
        }, 
        function(data) {
          chat.global.openModal('template/modals/popupMsg.html', 'popupMsg', {msg: commonMsg.map_error});
      });
    } else {
        chat.global.openModal('template/modals/popupMsg.html', 'popupMsg', {msg: commonMsg.map_error});
    }
};
var jsWork = {
    uploadPiczz: function (evt) {
        var file = event.target.files[0],
            formData = new FormData(),
            name = file.name,
            extension = name.substring(name.lastIndexOf('.'), name.length);
        formData.append('file', file);
        formData.append('id', chat.global.myInfo.id);
        formData.append('decision', 'imageupload');
        this.ajaxRequest('POST', '/fileUpload', formData, extension);
        var tgt = evt.target || window.event.srcElement,
        files = tgt.files;
        if (FileReader && files && files.length) {
            var fr = new FileReader();
            fr.onload = function () {
                var name = document.getElementsByName(chat.global.myInfo.id);
                name[0].src = fr.result;
                name[1].src = fr.result;
            }
            fr.readAsDataURL(files[0]);
        }
    },
    ajaxRequest: function(method, url, data, extension) {
        var xmlhttp,
            me = this;
          
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function() {
           if (xmlhttp.readyState==4 && xmlhttp.status==200) {
              console.log('success');
          }
        }
        xmlhttp.open(method, url, true);
        xmlhttp.send(data);
      }
}
//global.openModal('template/modals/popupMsg.html', 'popupMsg', {msg: commonMsg.map_error});