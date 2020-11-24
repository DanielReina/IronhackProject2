let mapInstance

function initApp() {

  
    
  getUsersFromApi()
}
    
function drawMap(user) {
    let center = { lat: user.location.coordinates[0], lng: user.location.coordinates[1] }
    mapInstance = new google.maps.Map(document.querySelector('#map'), {
        center, zoom: 14

    })

}


class PlacesApiHandler {

    constructor() {

        console.log('API handler inicializada')

        this.axiosApp = axios.create({
            baseURL: 'http://localhost:3000/api/usuarios'
        })
    }
 getOneUser = placeId => this.axiosApp.get(`/${placeId}`)

}

const apiHandler = new PlacesApiHandler()

function getUsersFromApi() {
    let id = document.querySelector('#map').getAttribute('userId')
    console.log(id)
    
    apiHandler
      .getOneUser(id)
      .then(response => {
          console.log(id)
              drawMap(response.data)
        drawMarkers(response.data)
      })
      .catch(err => console.log(err))
}

function drawMarkers(user) {

    console.log(mapInstance)

        let position = { lat: user.location.coordinates[0], lng: user.location.coordinates[1] }

        new google.maps.Marker({
            map: mapInstance,
            position,
            title: user.name
        })
  

    mapInstance.setCenter({ lat: users.location.coordinates[0], lng: users.location.coordinates[1] })
}