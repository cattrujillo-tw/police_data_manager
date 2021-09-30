import React from "react";
import { PlotlyWrapper } from "../common/components/Visualization/PlotlyWrapper";
import districts from "./assets/locationData/NOPD_Police_Districts.json";
import headquarters from "./assets/locationData/districtHeadquarters.json";
import district1 from "./assets/locationData/district1.json";
import district2 from "./assets/locationData/district2.json";
import district3 from "./assets/locationData/district3.json";
import district4 from "./assets/locationData/district4.json";
import district5 from "./assets/locationData/district5.json";
import district6 from "./assets/locationData/district6.json";
import district7 from "./assets/locationData/district7.json";
import district8 from "./assets/locationData/district8.json";

const NOLA_CENTER = { lat: 29.947, lon: -90.07 };
const DEFAULT_ZOOM = 10;

const MapVisualization = props => (
  <PlotlyWrapper
    data={[
      {
        type: "densitymapbox",
        text: ["test"],
        lon: [-90.06989909999999, -90.1],
        lat: [29.9538711, 29.9],
        z: [5, 4],
        radius: 50
      }
      // {
      //   type: "choroplethmapbox",
      //   name: "Complaints by Police District",
      //   geojson: districts,
      //   locations: [
      //     "District 1",
      //     "District 2",
      //     "District 3",
      //     "District 4",
      //     "District 5",
      //     "District 6",
      //     "District 7",
      //     "District 8"
      //   ],
      //   z: [20, 80, 70, 30, 9, 99, 89, 50],
      //   zmin: 0,
      //   zmax: 100,
      //   marker: {
      //     opacity: 0.5
      //   },
      //   colorbar: {
      //     y: 0,
      //     yanchor: "bottom",
      //     title: {
      //       text: "Complaints by Police District"
      //     },
      //     side: "right"
      //   }
      // }
    ]}
    layout={{
      dragmode: "zoom",
      mapbox: {
        style: "open-street-map",
        center: NOLA_CENTER,
        zoom: DEFAULT_ZOOM,
        layers: [
          {
            sourcetype: "geojson",
            source: districts,
            type: "line"
          }
          // {
          //   sourcetype: "geojson",
          //   source: district1,
          //   type: "fill",
          //   color: "rgba(0, 255, 0, 0.5)"
          // },
          // {
          //   sourcetype: "geojson",
          //   source: district2,
          //   type: "fill",
          //   color: "rgba(255, 0, 0, 0.5)"
          // },
          // {
          //   sourcetype: "geojson",
          //   source: district3,
          //   type: "fill",
          //   color: "rgba(0, 0, 0, 0.5)"
          // },
          // {
          //   sourcetype: "geojson",
          //   source: district4,
          //   type: "fill",
          //   color: "rgba(255, 255, 255, 0.5)"
          // },
          // {
          //   sourcetype: "geojson",
          //   source: district5,
          //   type: "fill",
          //   color: "rgba(0, 0, 255, 0.5)"
          // },
          // {
          //   sourcetype: "geojson",
          //   source: district6,
          //   type: "fill",
          //   color: "rgba(255, 0, 255, 0.5)"
          // },
          // {
          //   sourcetype: "geojson",
          //   source: district7,
          //   type: "fill",
          //   color: "rgba(0, 255, 255, 0.5)"
          // },
          // {
          //   sourcetype: "geojson",
          //   source: district8,
          //   type: "fill",
          //   color: "rgba(255, 255, 0, 0.5)"
          // }
          // {
          //     sourcetype: "geojson",
          //     source: headquarters,
          //     type: "symbol",
          //     layout: {
          //         "text-field": ["get", "description"],
          //         "text-variable-anchor": ["top", "bottom", "left", "right"],
          //         "text-radial-offset": 0.5,
          //         "text-justify": "auto",
          //         "icon-image": "village"
          //     }
          // }
        ]
      },
      margin: { r: 0, t: 0, b: 0, l: 0 }
    }}
  />
);

export default MapVisualization;
