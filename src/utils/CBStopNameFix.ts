
export const toGTFSMixedCase = (raw: string): string => {
    raw = raw
        // remove _ prefix/suffix for opposite direction (lovely naming scheme)
        .replace(/(?:^_|_$)/, '')
        // replace random underscores with spaces
        .replace(/_/g, ' ')
        // spaces around /
        .replace(/\s*\/\s*/g, " / ")
        // space before (
        .replace(/([^\s])(\()/g, "$1 $2")
        // trim inside ()
        .replace(/\(([^)]+)\)/g, (_, c) => `(${c.trim().replace(/\s+/g, " ")})`);

    // tokenize into words and separators
    const tokens = raw.match(/([a-zA-Z0-9\u00C0-\u00FF'\-]+|[^a-zA-Z0-9\u00C0-\u00FF'\-]+)/g) || [];

    const result = tokens.map(token => {
        if (!/[a-zA-Z0-9\u00C0-\u00FF'\-]/.test(token)) return token; // keep separators

        // roman numerals (1-4 chars, only IVXLCDM)
        if (/^[IVXLCDM]{1,4}$/i.test(token)) return token.toUpperCase();

        // title-case transformation (handles apostrophes/hyphens)
        let mixed = token.includes("'") || token.includes("-")
            ? token.split(/(['-])/).map((part, _) =>
                part === "'" || part === "-"
                    ? part : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                ).join('')
            : token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();

        // number‑letter separation (except routes and ordinals)
        const routePattern = /^[A-Z]+\d+$/;
        const ordinalPattern = /^\d+(Eme|Er|Nd|Rd|Th)$/i;
        if (!routePattern.test(mixed) && !ordinalPattern.test(mixed)) {
            mixed = mixed
                .replace(/(\d)([A-Za-z])/g, "$1 $2")
                .replace(/([A-Za-z])(\d)/g, "$1 $2");
        }

        return mixed;
    }).join('');

    return result.replace(/\s+/g, ' ').trim().replace(/([^\s])(\()/g, "$1 $2");
}

/**
 * Normalizes a token for matching purposes:
 * lowercase, no diacritics, no apostrophes/hyphens.
 * Used to compare tokens across stopName and stopId without
 * being tripped up by punctuation or accent differences.
 */
export const normForMatch = (s: string): string => {
    return s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/['\-]/g, '');
}

/**
 * Fixes random spaces in stopName tokens by merging adjacent tokens
 * whose concatenation (normalised) matches a stopId token.
 *
 * For each matched group:
 *   - Uses the stopId token version (restores apostrophes, ID-side diacritics)
 *   - UNLESS the stopName group itself already contains diacritics, in which
 *     case the raw concatenation of the name tokens is kept (preserves e.g. "Ä").
 * Tokens with no matching stopId token are left as-is (intentionally different
 * words, e.g. "QUARTIER" vs an ID that says "HAY SALAM 1").
 */
const fixTokens = (nameTokens: string[], idTokens: string[]): string[] => {
    const normId = idTokens.map(t => normForMatch(t));
    const hasDiacritics = (s: string): boolean => {
        const nfd = s.normalize("NFD");
        return nfd !== nfd.replace(/[\u0300-\u036f]/g, '');
    };

    const result: string[] = [];
    let i = 0;

    while (i < nameTokens.length) {
        let matched = false;
        let concat = '';

        for (let j = i; j < nameTokens.length; j++) {
            concat += normForMatch(nameTokens[j]);
            const idIdx = normId.indexOf(concat);

            if (idIdx !== -1) {
                const group = nameTokens.slice(i, j + 1);
                // Keep stopName's own diacritics if present; otherwise let stopId
                // supply the canonical form (correct apostrophes, accented chars).
                result.push(group.some(hasDiacritics)
                    ? group.join('')
                    : idTokens[idIdx]);
                i = j + 1;
                matched = true;
                break;
            }
        }

        if (!matched) {
            // No stopId token matches this word → it's an intentional name
            // difference (public name differs from ID). Keep as-is.
            result.push(nameTokens[i]);
            i++;
        }
    }

    return result;
}

/**
 * Fixes a corrupted stop name using the stop ID only as a repair reference.
 *
 * Rules:
 *  - stopName is always the source of truth for *which words* appear.
 *  - stopId is used solely to:
 *      (a) collapse erroneous mid-word spaces ("CIN EMA" → "CINEMA")
 *      (b) restore apostrophes missing from stopName ("D EDUCATION" → "D'EDUCATION")
 *      (c) supply diacritics absent from stopName ("ECOLE" → "ÉCOLE")
 *  - Words present only in stopName (e.g. "QUARTIER" when ID says "HAY SALAM 1")
 *    are never discarded.
 *  - Diacritics already in stopName are always preserved.
 */
export const fixCBStopName = (stopId: string, stopName: string): string => {
    const rawFromId = stopId.replace(/^0:/, '').replace(/(?:^_|_$)/, '');
    const cleanedName = stopName.trim().replace(/\s+/g, ' ');

    if (!cleanedName) return toGTFSMixedCase(rawFromId);

    const nameTokens = cleanedName.split(' ');
    const idTokens   = rawFromId.split(' ').filter(t => t.length > 0);

    const fixed = fixTokens(nameTokens, idTokens).join(' ');
    return toGTFSMixedCase(fixed).replace(/ \. /g, ' / ');
}
