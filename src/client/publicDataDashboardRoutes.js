import React from "react";
import PublicDataDashboardWrapper from "./publicDataDashboard/PublicDataDashboard";
import DashboardAboutWrapper from "./publicDataDashboard/DashboardAbout";
import DashboardGlossaryWrapper from "./publicDataDashboard/DashboardGlossary";
import MapVizPage from "./publicDataDashboard/MapVizPage";

const publicDataDashboardRoutes = [
  {
    path: "/data",
    title: "IPM Complaints Data",
    component: PublicDataDashboardWrapper
  },
  {
    path: "/data/about",
    title: "IPM Complaints Data - About",
    component: DashboardAboutWrapper
  },
  {
    path: "/data/glossary",
    title: "IPM Complaints Data - Tag Glossary",
    component: DashboardGlossaryWrapper
  },
  {
    path: "/data/map",
    title: "Map Visualization",
    component: MapVizPage
  }
];

export default publicDataDashboardRoutes;
