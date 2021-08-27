import React from "react";
import { PlotlyWrapper } from "../common/components/Visualization/PlotlyWrapper";
import districts from "./assets/locationData/NOPD_Police_Districts.json";

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
            color: "rgba(255, 100, 50, 0.5)"
          }
        ]
      },
      margin: { r: 0, t: 0, b: 0, l: 0 }
    }}
  />
);

export default MapVisualization;
