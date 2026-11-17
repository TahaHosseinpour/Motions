// Persian caption hygiene: we don't write harakat / tanwin in subtitles.
// Strips Arabic diacritics (tanwin, fatha/damma/kasra, shadda, sukun, extended marks,
// superscript alef) but keeps ZWNJ (nim-fasele), digits, punctuation and every real letter.
export const stripDiacritics = (s: string) => s.replace(/[ً-ٰٟ]/g, "");