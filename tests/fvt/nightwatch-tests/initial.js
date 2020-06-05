
module.exports = {
    '@disabled': false,  // This will prevent the test module from running.

    after: (browser, done) => {
        console.log('After called')
        browser
            .closeWindow()
            .end(done);
    },

    'Navigate to the DemoDOI - valid zip': async (browser) => {
        const demodoi = browser.page.demodoi();
        const { cityName } = demodoi.section;

        await demodoi.navigate().waitForElementVisible('@inputText');

        await demodoi.setValue('@inputText', [
            'wellington',
            browser.Keys.ENTER
        ]);

        await demodoi.waitForElementVisible('@table');

        cityName.expect.element('@firstApp').text.to.equal('wellington');
    },

    'Navigate to the DemoDOI - invalid zip': async (browser) => {
        const demodoi = browser.page.demodoi();

        await demodoi.navigate().waitForElementVisible('@inputText');

        await demodoi.setValue('@inputText', [
            'hamil',
            browser.Keys.ENTER
        ]);

        await demodoi.waitForElementNotPresent('@table');

        demodoi.expect.element('@cityNotFound').text.to.equal('city not found');
    },

    'Navigate to the DemoDOI - invalid input': async (browser) => {
        const demodoi = browser.page.demodoi();

        await demodoi.navigate().waitForElementVisible('@inputText');

        await demodoi.setValue('@inputText', [
            '..22/',
            browser.Keys.ENTER
        ]);

        await demodoi.waitForElementNotPresent('@table');

        demodoi.expect.element('@invalidCity').text.to.equal('* should be a valid city name only');
    },
    'Navigate to the DemoDOI - click event': async (browser) => {
        const demodoi = browser.page.demodoi();

        await demodoi.navigate().waitForElementVisible('@map');

        await demodoi.click(document.getElementById("map.marker.Hamilton"))
        
        await demodoi.waitForElementNotPresent('@table');

        cityName.expect.element('@firstApp').text.to.equal('Hamilton');
    },
    'Navigate to the DemoDOI - click empty text box': async (browser) => {
        const demodoi = browser.page.demodoi();

        await demodoi.navigate().waitForElementVisible('@inputText');

        await demodoi.click('@inputText');

        await demodoi.waitForElementVisible('@table', 1000);

        cityName.expect.element('@table').visible.to.equal('false');
    },
};