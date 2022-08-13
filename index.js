const express = require('express');
const path = require('path');
const nodecache = require('node-cache');
const Flagsmith = require("flagsmith-nodejs");

const app = express();
const port = process.env.PORT || '3000';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

const flagsmith = new Flagsmith({
    environmentKey: '7wGJnGjuMzoXZBLp6Hi3bs',
    cache: new nodecache({stdTTL : 10, checkperiod: 10}),
});


app.get('/', async (req, res) => {
    let showFooterIcons = false;
    try {
        let footerFeatures = await flagsmith.getEnvironmentFlags();
        showFooterIcons =footerFeatures.isFeatureEnabled('show_footer_icons');
        console.log(showFooterIcons);
    } catch (e) {
        console.log(`Error connecting to flagsmith - ${e.getMessage} `, e);
    }

    console.log(`show footer icons: ${showFooterIcons}`);
    res.render(
        'index',
        {
            title: 'Coming Soon!',
            mainText: 'Eventually Podcast',
            subText: `Drop your email address below and we will let you know when we launch the Eventually podcast. 
      <br>Brought to you by amazing people`,
            showFooterIcons,
        }
    );
});

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
