module.exports.rerenderWait = 5000;
module.exports.roundtripWait = 25000;
module.exports.pause = 2000;
module.exports.dataLoadWait = 3000;
module.exports.animationPause = 1000;

module.exports.waitMoveAndClick = (context, cssSelector) => {
  return context
    .waitForElementPresent(cssSelector, this.rerenderWait)
    .moveToElement(cssSelector, undefined, undefined)
    .click(cssSelector, this.logOnClick);
};

module.exports.logOnClick = result => {
  console.log(result.status == 0 ? `✔ Click successful` : `✖ Click failed`);
};
