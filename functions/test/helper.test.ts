import {
    twitterImageUrlEnlarger,
    tweetEnhancer,
} from '../src/helper';

test('twitterImageUrlEnlarger returns the URL for a larger image', () => {
    expect(
        twitterImageUrlEnlarger('https://pbs.twimg.com/profile_images/822547732376207360/5g0FC8XX_normal.jpg')
    ).toBe(
        'https://pbs.twimg.com/profile_images/822547732376207360/5g0FC8XX.jpg'
    );
});

describe('tweetEnhancer', () => {
    test('fixes newlines', () => {
        expect(tweetEnhancer('Line 1.\n\nLine 2.\n\nLine 3.') ).toBe('Line 1.  \nLine 2.  \nLine 3.');
    });
    test('removes twitter links', () => {
        expect(tweetEnhancer('Line 1 https://t.co/abc123')).toBe('Line 1');
        expect(tweetEnhancer('Line 1 https://www.twitter.com/vNj1t574H6.')).toBe('Line 1.');
    });
});
