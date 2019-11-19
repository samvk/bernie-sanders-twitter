import { dialogflow, SimpleResponse, BasicCard, Button, Image, LinkOutSuggestion } from 'actions-on-google';
import * as functions from 'firebase-functions';
import getTweet from './get-tweet';
import { escapeXml, randomPop } from './util';
import { tweetEnhancer, twitterImageUrlEnlarger } from './helper';

/** **** DIALOGFLOW ***** */
const app = dialogflow({ debug: true });

app.intent(['Default Welcome Intent', 'talk'], async (conv) => {
    try {
        const {
            id_str,
            user,
            full_text = '',
        } = await getTweet();

        const {
            name,
            description,
            profile_image_url_https,
        } = user;

        const tweetText = tweetEnhancer(full_text);
        const profileImageUrl = twitterImageUrlEnlarger(profile_image_url_https);

        conv.ask(new SimpleResponse({
            text: "Here's the latest tweet from Bernie Sanders...",
            speech: escapeXml(tweetText),
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
        // Actions on Google does not support donation links yet (https://developers.google.com/assistant/console/policies/general-policies#transactions)
        // conv.ask(new LinkOutSuggestion({ name: '❤️ Donate Now!', url: 'https://secure.actblue.com/donate/samvk-for-sanders?refcode=bernie-sanders-soundboard' }));
        conv.ask(new LinkOutSuggestion({
            name: randomPop(['💕 Join the movement', '🇺🇸 Join the movement', '❤️ Support!', '🔥 Feel The Bern!']),
            url: 'https://berniesanders.com',
        }));
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
