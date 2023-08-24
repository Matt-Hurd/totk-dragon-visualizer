import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Pane, Popup, TileLayer } from "react-leaflet";
import L, { LatLngBounds } from "leaflet";

import faroshData from './assets/rails/Farosh.json'
import naydraData from './assets/rails/Naydra.json'
import dinraalData from './assets/rails/Dinraal.json'

import blankIconUrl from './assets/blank.png'

import "leaflet/dist/leaflet.css";

import "./leaflet_tile_workaround.js";
import { getDragonPosition } from "./DragonCalcculations.js";
import { Rail } from "./DragonRailTypes.js";

const outerBounds = new LatLngBounds([-5000, 6000], [5000, -6000]);

const TILE_SIZE = 256;
const MAP_SIZE = [24000, 20000];

const crs = L.Util.extend({}, L.CRS.Simple, {
  transformation: new L.Transformation(4 / TILE_SIZE, MAP_SIZE[0] / TILE_SIZE, 4 / TILE_SIZE, MAP_SIZE[1] / TILE_SIZE),
});


const icon = L.icon({
  iconUrl: blankIconUrl,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const DragonMap: React.FC = () => {
  const [railData, setRailData] = useState<{ [key: string]: Rail }>({});
  const [timeMinutes, setTimeMinutes] = useState<number>(0);
  const [currentPositions, setCurrentPositions] = useState<{
    [key: string]: { x: number; y: number; z: number } | null;
  }>({});
  const [mapType, setMapType] = useState("Surface");

  useEffect(() => {
    const dragons = {"Farosh": faroshData, "Naydra": naydraData, "Dinraal": dinraalData};

    Object.entries(dragons).forEach(([dragon, dragonData]) => {
          setRailData((prevState) => ({ ...prevState, [dragon]: dragonData }));
    });
  }, []);

  useEffect(() => {
    const newPositions: { [key: string]: { x: number; y: number; z: number } | null } = {};
    Object.keys(railData).forEach((dragon) => {
      if (railData[dragon]) {
        let offset = 0;
        if (dragon === "Farosh") offset = 2081;
        if (dragon === "Dinraal") offset = 2865;
        if (dragon === "Naydra") offset = 2321;
        newPositions[dragon] = getDragonPosition(timeMinutes * 60 + offset, railData[dragon]);
      }
    });
    setCurrentPositions(newPositions);
  }, [timeMinutes, railData]);

  const convertToMapCoords = (x: number, z: number) => {
    return [z, x];
  };

  const mapUrl =
    mapType === "Surface"
      ? "https://objmap-totk.zeldamods.org/game_files/map//Ground/maptex/{z}/{x}/{y}.webp"
      : "https://objmap-totk.zeldamods.org/game_files/map//Depths/maptex/{z}/{x}/{y}.webp";

  return (
    <div className="parent">
      <label>
        Minutes since game start:
        <input type="number" value={timeMinutes} min="0" onChange={(e) => setTimeMinutes(parseFloat(e.target.value))} />
      </label>
      <button onClick={() => setMapType(mapType === "Surface" ? "Depths" : "Surface")}>
        Toggle Map (Current: {mapType})
      </button>
      <div className="mapContainer">
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          bounds={outerBounds}
          zoom={0}
          maxZoom={7}
          minZoom={-5}
          crs={crs}
          keyboard={false}
        >
          <Pane name="tile_bg" style={{ zIndex: 1 }}>
            <TileLayer url={mapUrl} bounds={outerBounds} />
          </Pane>
          {Object.keys(currentPositions).map((dragon) => {
            const pos = currentPositions[dragon];
            if (pos) {
              const [lat, lng] = convertToMapCoords(pos.x, pos.z);
              return (
                <Marker key={dragon} position={[lat, lng]} icon={icon}>
                  <Popup autoPan={false}>
                    {dragon} <br />
                    {Math.round(pos.x)} | {-Math.round(pos.z)} | {Math.round(pos.y)}
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default DragonMap;
