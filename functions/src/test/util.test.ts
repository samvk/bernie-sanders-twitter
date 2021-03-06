import {
    randomPop,
    escapeXml,
} from '../util';

test('randomPop returns a random item from the array (mocked)', () => {
    const mathRandomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(randomPop(['alpha', 'bravo'])).toBe('alpha');
    mathRandomSpy.mockRestore();
});

test('escapeXml escapes XML special characters', () => {
    expect(
        escapeXml(`<note>"Singin' in the Rain" has 1 Golden Globe win & 2 nominations.</note>`)
    ).toBe(
        `&lt;note&gt;&quot;Singin&apos; in the Rain&quot; has 1 Golden Globe win &amp; 2 nominations.&lt;/note&gt;`
    );
});
