import * as Twit from 'twit';
import { TWIT_CONFIG } from './config';
 
const twit = new Twit(TWIT_CONFIG);

// `count` applies *before* filter params (which is weird) meaning we need to pad the number we grab
const getLatestTweet = () => (
    twit.get('statuses/user_timeline', { screen_name: 'BernieSanders', count: 10, include_rts: false }).then(({ data }) => data[0])
);

export default getLatestTweet;
