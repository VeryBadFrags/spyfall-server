/**
 * @param {number} len The length of the ID
 * @param {string} possibleChars the characters to use
 * @returns {string} The generated ID
 */
export function createId(
  len: number = 4,
  possibleChars: string = "ABCDEFGHJKMNPQRTWXYZ34579",
): string {
  let id = "";
  for (let i = 0; i < len; i++) {
    id += possibleChars[Math.floor(Math.random() * possibleChars.length)];
  }
  return id;
}
