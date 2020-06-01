/**
 * Chequeo si la ISS esta pasando por arriba de Buenos Aires (?)
 */

// https://github.com/rowanwins/point-in-polygon-hao
const checkPoly = require('point-in-polygon-hao');
const fetch = require('node-fetch');
const dayjs = require('dayjs');
const where = require('where');

// ISS Position - http://api.open-notify.org/iss-now.json
const getISSLocation = async () => {
  try {
    const response = await fetch('http://api.open-notify.org/iss-now.json');
    const json = await response.json();
    const { message, iss_position, timestamp } = json;

    if (!message || message !== 'success') return null;

    const { latitude, longitude } = iss_position;
    const lugar = nombreLugar(latitude, longitude);
    console.log({
      iss: json,
      timestamp: dayjs(timestamp * 1000).format('MMM D, YYYY h:mm A'),
      lugar: await lugar
    });

    return [latitude, longitude];
  } catch (error) {
    console.error('Oops! hubo el siguiente temita: ', error);
  }
}

const nombreLugar = async (latitude, longitude) => {
  const lugar = await new where.Point(
    parseFloat(latitude),
    parseFloat(longitude)
  );
  const geocoder = await new where.Geocoder;
  const location = await geocoder.fromPoint(lugar);
  if (location.error) return location.error;
  console.log({ location });

  return location;
}

// Coordinates to Location 1 - https://github.com/bergie/where
// Coordinates to Location 2 - https://github.com/kolegm/search-destination
const POLIGONOS = [{
  nombre: 'Buenos Aires',
  data: [
    [-34.404644, -58.655842],
    [-34.377446, -58.379626],
    [-34.610606, -58.058162],
    [-34.869459, -58.557076]
  ]
},
{
  // otros lugares?
}];

const ISSPasando = async () => {
  const iss = await getISSLocation();
  const chequeo = checkPoly(iss, POLIGONOS[0].data);
  console.log({ chequeo });

  return chequeo;
};

module.exports = ISSPasando;