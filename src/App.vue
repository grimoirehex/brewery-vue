
<script setup>
import { ref } from 'vue'

//List of all breweries in city
const brews = ref (null)
//Holds all details of selected brewery
const brewDetail = ref(null)

//Specific details for selected brewery
const brewNameDetail = ref('')
const brewStreetDetail = ref('')
const brewCityDetail = ref('')
const brewStateDetail = ref('')
const brewPostalDetail = ref('')
const brewLongitudeDetail = ref('')
const brewLatitudeDetail = ref('')

//Starts app by pulling in all breweries in the city
load();
async function load() {
  let data=await fetch('https://api.openbrewerydb.org/breweries?by_city=huntsville')

  brews.value=await data.json()
}

//This function is called when the button associated with a brewery is clicked
//It uses the "ID" of the brewery to direct the API to send only the details of that particular brewery 
async function details(id)
{
let data = await fetch('https://api.openbrewerydb.org/breweries/'+id)

brewDetail.value=await data.json()

//Once the json data is loaded, we assign the specific values
brewNameDetail.value =  await brewDetail.value.name;
brewStreetDetail.value =  await brewDetail.value.street;
brewCityDetail.value = await brewDetail.value.city;
brewStateDetail.value = await brewDetail.value.state;
brewPostalDetail.value = await brewDetail.value.postal_code;
brewLongitudeDetail.value =  await brewDetail.value.longitude;
brewLatitudeDetail.value = await brewDetail.value.latitude;

//Update the google map marker location
updateMarker({lat: parseFloat(brewLatitudeDetail.value), lng: parseFloat(brewLongitudeDetail.value)});
}

//This function accesses a custom API 
//Since only 1 brewery is available, there is no need to specify which ID to use
async function custom()
{
let data = await fetch('https://brewmap.azurewebsites.net/api/BrewTrigger')

brewDetail.value=await data.json()

//Once the json data is loaded, we assign the specific values
brewNameDetail.value =  await brewDetail.value.name;
brewStreetDetail.value =  await brewDetail.value.street;
brewCityDetail.value = await brewDetail.value.city;
brewStateDetail.value = await brewDetail.value.state;
brewPostalDetail.value = await brewDetail.value.postal_code;
brewLongitudeDetail.value =  await brewDetail.value.longitude;
brewLatitudeDetail.value = await brewDetail.value.latitude;

//Update the google map marker location
updateMarker({lat: parseFloat(brewLatitudeDetail.value), lng: parseFloat(brewLongitudeDetail.value)});
}

//Giving the map and marker default values
const markexample = [{id:'myID' , position:{lat: 34.7277523, lng: -86.5932014}}]
const markerValue = ref(null);
const mapCenter = ref({lat: 34.7277523, lng: -86.5932014})

//Moves the map to the correct location, and places a marker if possible
const updateMarker = (val) => {markerValue.value = val; mapCenter.value = val; }

</script>

<template>
<div>
<!-- Info that is displayed in upper left, detailing what the app does --> 
<div class="description">
  This application uses the <a href = "https://www.openbrewerydb.org/" target="_blank"  rel="noopener noreferrer">Open Brewery DB API</a>to display brewery data for the city of Huntsville, AL.<br/>
  Due to the community driven nature of the API, complete information isn't always available. For example the brewery "Paradune Brewing" <a href ="https://api.openbrewerydb.org/breweries/paradune-brewing-huntsville" target="_blank"  rel="noopener noreferrer"> doesn't have longitude or latitude data in the database.</a>
  <br/>When possible, a marker will use the longitude and latitude data to show the location of the selected brewery.
<br/><br/>
For demonstration purposes, a custom API has been created to display information for the brewery "Straight To Ale"
  <button v-on:click="custom()" >View Details For : (Straight to Ale) Using Custom API </button>
</div>

<!-- Shows all information relevant to location of the brewery and marker placement-->
<div class="info">
<label>Name: <input style='width:100%'  v-cloak v-model="brewNameDetail"></label>
<label>Street Address: <input style='width:100%' v-model="brewStreetDetail"></label>
<label>City: <input style='width:100%' v-model="brewCityDetail"></label>
<label>State: <input style='width:100%'  v-model="brewStateDetail"></label>
<label>Zip Code: <input style='width:100%' v-model="brewPostalDetail"></label>
<label>Longitude: <input style='width:100%' v-model="brewLongitudeDetail"></label>
<label>Latitude: <input style='width:100%' v-model="brewLatitudeDetail"></label>
</div>

<div class = "float-container">
<!--List of breweries-->
<div class="breweries">
<ul v-for="brew in brews" v-bind:key="brew.id">
 <div class="single-brewery">
 <li>{{ brew.name }} </li> 
 <li>Type of Brewery : {{ brew.brewery_type }}</li>
 <li>Address : {{ brew.street}} , {{brew.city}} , {{brew.state}} , {{brew.postal_code}}</li>
 <li>Website : <a v-bind:href = brew.website_url target="_blank"  rel="noopener noreferrer">{{brew.website_url}}</a></li>
 <button v-on:click="details(brew.id)" >View Details For : {{brew.name}}</button>
 </div>
</ul>
</div>

<!--google map-->
<div class="map">
<GMapMap
      :center=(mapCenter)
      :zoom="15"     
      map-type-id="terrain"
      style="width: 1000px; height: 600px"
  >
    <GMapMarker 
        :key="marker.id"
        :position=(markerValue)
        v-for="marker in markexample"     
        >           
          <GMapInfoWindow>
        <div class = "marker-name">
          {{brewNameDetail}}    
          </div>     
          <div class ="marker-info"> 
          {{brewStreetDetail}}
          {{brewCityDetail}}
          {{brewStateDetail}}
          {{brewPostalDetail}}
          </div>
      </GMapInfoWindow> 
       
    </GMapMarker>          
    
  </GMapMap>
</div>
</div>

    </div>
</template>

<style>
.description{
  display: block;
  float: left;
  width: 40%;
  font: 24px sans-serif;
}

.custom{
  float: left;
  width: 40%;
}

.float-container{
  position: fixed;
  top: 35%;  
}

.marker-info{
  color: blue;
}

.marker-name{
  color: black;
}

.info{
  font: 12px sans-serif;
  float: right;
  display:grid;
  padding-right: 20%;  
}

.single-brewery{
  border: 1px solid gray;
}

.breweries {
font: 24px sans-serif;
 width: 49%;
 height: 600px;
    float: left;   

    border: 1px solid gray;
overflow: scroll;
}

.map{
   width: 49%;
  height: 500px;
    float: right;    

}
</style>