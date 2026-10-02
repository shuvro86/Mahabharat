export function escapeRegExp(value: string): string {
  return Array.from(value, character => "\\^$.*+?()[]{}|".includes(character) ? "\\" + character : character).join("");
}
