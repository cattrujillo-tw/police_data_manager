import { mount } from "enzyme";
import DashboardNavBar from "./DashboardNavBar";
import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import dashboardStylingDesktop from "./dashboardStyling/dashboardStylingDesktop";
import { BrowserRouter as Router } from "react-router-dom";

describe("Dashboard NavBar", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <Router>
        <MuiThemeProvider theme={dashboardStylingDesktop}>
          <DashboardNavBar />
        </MuiThemeProvider>
      </Router>
    );
  });

  test("should render the navbar in the public data dashboard with correct styling", () => {
    expect(wrapper).toMatchSnapshot();
  });

  test("should navigate to About page when About button is clicked on", async () => {
    const aboutLink = wrapper.find('[data-testid="aboutLink"]').first();

    aboutLink.simulate("click");

    expect(aboutLink.prop("to")).toEqual("/data/about");
  });

  test("should navigate to glossary page when Glossary button is clicked on", async () => {
    const glossaryLink = wrapper.find('[data-testid="glossaryLink"]').first();

    glossaryLink.simulate("click");

    expect(glossaryLink.prop("to")).toEqual("/data/glossary");
  });
});
