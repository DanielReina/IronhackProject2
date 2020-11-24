let mapInstance

function initApp() {

      drawMap()
    
  getUsersFromApi()
}
    
function drawMap() {
    // let center = { lat: user.location.coordinates[0], lng: user.location.coordinates[1] }
    mapInstance = new google.maps.Map(document.querySelector('#map'), {
        center: {
            lat: 37.381884,
            lng: -5.987307
        }, zoom: 14

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
    let id = document.querySelector('#deleteMe').value
    console.log(id)
    
    apiHandler
      .getOneUser(id)
      .then(response => {
       console.log(id)
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