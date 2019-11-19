import * as Twit from 'twit';
import { TWIT_CONFIG } from './config';

import Status = Twit.Twitter.Status;

const twit = new Twit(TWIT_CONFIG);

// `count` applies *before* filter params (which is weird) meaning we need to pad the count we grab
const tweetParams = {
    screen_name: 'BernieSanders',
    count: 5,
    include_rts: false,
    tweet_mode: 'extended', // undocumented: returns full text as `full_text` key
};

const getLatestTweet = () => (
    twit
        .get('statuses/user_timeline', tweetParams)
        .then(({ data }) => (data as Status[])[0])
);

export default getLatestTweet;
