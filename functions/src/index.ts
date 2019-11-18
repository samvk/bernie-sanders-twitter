import { dialogflow, SimpleResponse, BasicCard, Button, Image, Suggestions, LinkOutSuggestion } from 'actions-on-google';
import * as functions from 'firebase-functions';
import getTweet from './get-tweet';
import { excapeXml } from './util';
import { tweetEnhancer, twitterImageUrlEnlarger } from './helper';

/** **** DIALOGFLOW ***** */
const app = dialogflow({ debug: true });

app.intent(['Default Welcome Intent', 'talk'], async (conv) => {
    try {
        const {
            user,
            full_text = '',
        } = await getTweet();

        const {
            id_str,
            name,
            description,
            profile_image_url_https,
        } = user;

        const tweetText = tweetEnhancer(full_text);
        const profileImageUrl = twitterImageUrlEnlarger(profile_image_url_https);

        conv.ask(new SimpleResponse({
            text: "Here's the latest tweet from Bernie Sanders...",
            speech: excapeXml(tweetText),
        }));

        if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
            conv.close();
            return;
        }

        conv.ask(new BasicCard({
            title: name,
            subtitle: description,
            text: tweetText,
            buttons: new Button({
                title: 'Read more',
                url: `https://twitter.com/statuses/${id_str}`,
            }),
            image: new Image({
                url: profileImageUrl,
                alt: `${user.name} profile image`,
            }),
            display: 'WHITE',
        }));
        // conv.ask(new Suggestions(['Donate $2.70', 'Donate $27', 'Donate more!']));
        conv.ask(new Suggestions(['Donate $2.70']));
        conv.ask(new LinkOutSuggestion({ name: '❤️ Donate Now!', url: 'https://secure.actblue.com/donate/samvk-for-sanders?refcode=bernie-sanders-twitter' }));
        // conv.ask(new LinkOutSuggestion({ name: '❤️ Donate Now!2', url: 'https://secure.actblue.com/donate/samvk-for-sanders?refcode=bernie-sanders-twitter2' }));
    } catch (error) {
        console.log(error);
        conv.close('Sorry, something went wrong.');
    }
});

app.intent(['actions_intent_CANCEL', 'actions_intent_NO_INPUT', 'Default Fallback Intent'], (conv) => {
    conv.close(new SimpleResponse({
        speech: `<speak><break time="1ms"/></speak>`, // HACK::there must be a way to have a silent conv.close()...
        text: `👋🇺🇸`,
    }));
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
