/**
 * @param {number} len The length of the ID
 * @param {string} chars the characters to use
 * @returns {string} The generated ID
 */
export function createId(
    len: number = 8,
    chars: string = "ABCDEFGHJKMNPQRSTWXYZ23456789",
): string {
    let id = "";
    for (let i = 0; i < len; i++) {
        id += chars[(Math.random() * chars.length) | 0];
    }
    return id;
}
