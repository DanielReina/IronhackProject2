
function drawMap(){
    
  const mapInstance = new google.maps.Map(document.querySelector('#map'), {
    center: {
      lat: 37.381884,
      lng: -5.987307
    }, zoom: 14

  })

}


    new google.maps.Marker({
        map: mapInstance,
        position: directions.ironhackBCN.coords,
        title: directions.ironhackBCN.title
    })