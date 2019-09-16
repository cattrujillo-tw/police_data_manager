import React from "react";
import { mount } from "enzyme";
import { disciplinaryProceedingsMenuOptions } from "./disciplinaryProceedingsMenuOptions";
import MenuNavigator from "./MenuNavigator";
import { BrowserRouter as Router } from "react-router-dom";
import { complaintManagerMenuOptions } from "./complaintManagerMenuOptions";

describe("MenuNavigator", () => {
  test("if menuType is disciplinaryProceedingsOptions, menu items should be Complaints,Export, and Logout", () => {
    const wrapper = mount(
      <Router>
        <MenuNavigator menuType={disciplinaryProceedingsMenuOptions} />
      </Router>
    );

    expect(wrapper.find('[data-test="complaints"]').exists()).toBeTrue();
    expect(wrapper.find('[data-test="exports"]').exists()).toBeTrue();
    expect(wrapper.find('[data-test="logOutButton"]').exists()).toBeTrue();
    expect(wrapper.find('[data-test="archivedCases"]').exists()).toBeFalse();
  });

  test("if menuType is complaintManagerMenuOptions, menu items should be Archived Cases, Export, and Logout", () => {
    const wrapper = mount(
      <Router>
        <MenuNavigator menuType={complaintManagerMenuOptions} />
      </Router>
    );

    expect(wrapper.find('[data-test="archivedCases"]').exists()).toBeTrue();
    expect(wrapper.find('[data-test="exports"]').exists()).toBeTrue();
    expect(wrapper.find('[data-test="logOutButton"]').exists()).toBeTrue();
    expect(wrapper.find('[data-test="complaints"]').exists()).toBeFalse();
  });
});