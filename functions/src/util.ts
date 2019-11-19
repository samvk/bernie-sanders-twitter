export const randomPop = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

export const escapeXml = (str: string) => (
    str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
);
