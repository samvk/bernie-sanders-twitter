import { dialogflow, SimpleResponse, BasicCard, Button, Image, Suggestions, LinkOutSuggestion } from 'actions-on-google';
import * as functions from 'firebase-functions';
import getTweet from './get-tweet';
import { excapeXml } from './util';

/** **** DIALOGFLOW ***** */
const app = dialogflow({ debug: true });

app.intent(['Default Welcome Intent', 'talk'], async (conv) => {

    conv.ask(new SimpleResponse("Here's the latest tweet from Bernie Sanders..."));

    try {
        const {
            user,
            profile_image_url_https,
            text,
        } = await getTweet();

        if (conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
            conv.ask(new BasicCard({
                title: user.name,
                subtitle: user.description,
                text: text,
                buttons: new Button({
                    title: 'Read more',
                    url: user.url,
                }),
                image: new Image({
                    url: profile_image_url_https,
                    alt: `${user.name} profile image`,
                }),
                display: 'WHITE',
            }));
            conv.ask(new Suggestions(['Donate $2.70', 'Donate $27', 'Donate more!']));
            // conv.ask(new LinkOutSuggestion({ name: '❤️ Donate Now!', url: 'https://secure.actblue.com/donate/samvk-for-sanders?refcode=bernie-sanders-twitter' }));
        } else {
            conv.close(new SimpleResponse({
                speech: excapeXml(text),
                text: text,
            }));
        }
    } catch (error) {
        console.log(error);
        conv.close('Sorry, something went wrong.');
    }

});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
