// for some reason twitter sends a tiny verion of their images by default
// (see https://stackoverflow.com/questions/21485205/how-to-get-bigger-size-user-image-with-twitter-api-1-1)
export const twitterImageUrlEnlarger = (url: string) => url.replace('_normal', '');
