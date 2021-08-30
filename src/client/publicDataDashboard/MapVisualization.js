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
        type: "scattermapbox",
        text: ["test"],
        lon: [-90.06989909999999],
        lat: [29.9538711],
        marker: { color: "fuchsia", size: 10 }
      }
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
            type: "fill",
            color: "rgba(0, 255, 0, 0.5)"
          },
          {
            sourcetype: "geojson",
            source: headquarters,
            type: "symbol",
            layout: {
              "text-field": ["get", "description"],
              "text-variable-anchor": ["top", "bottom", "left", "right"],
              "text-radial-offset": 0.5,
              "text-justify": "auto",
              "icon-image": "village"
            }
          }
        ]
      },
      margin: { r: 0, t: 0, b: 0, l: 0 }
    }}
  />
);

export default MapVisualization;
