export default class SimpleXMLParser {
    private xml: string;
    private parsed: Record<string, string> | null = null;

    constructor(xml: string) {
        this.xml = xml;
        // Remove XML declaration if present
        this.xml = this.xml.replace(/<\?xml[^?]*\?>/, '').trim();
    }

    /**
     * Get content of a specific tag
     */
    getTag(tagName: string): string | null {
        const regex = new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, 'i');
        const match = regex.exec(this.xml);
        return match ? match[1].trim() : null;
    }

    /**
     * Get content of a specific tag with case-insensitive matching
     */
    getTagIgnoreCase(tagName: string): string | null {
        const regex = new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, 'i');
        const match = regex.exec(this.xml);
        return match ? match[1].trim() : null;
    }

    /**
     * Get all tags as key-value pairs
     */
    getAllTags(): Record<string, string> {
        if (this.parsed) return this.parsed;

        const result: Record<string, string> = {};
        const tagRegex = /<(\w+)>([\s\S]*?)<\/\1>/g;
        let match;

        while ((match = tagRegex.exec(this.xml)) !== null) {
            result[match[1]] = match[2].trim();
        }

        this.parsed = result;
        return result;
    }

    /**
     * Check if XML contains an error tag
     */
    hasError(): boolean {
        return this.xml.includes("<Error>") || this.xml.includes("<error>");
    }

    /**
     * Get error information (handles Azure/Common error formats)
     */
    getError(): { code: string | null; message: string | null } {
        const code = this.getTagIgnoreCase("Code") || this.getTagIgnoreCase("ErrorCode");
        const message = this.getTagIgnoreCase("Message") || this.getTagIgnoreCase("Description");
        return { code, message };
    }

    /**
     * Throw error if XML contains error tag
     */
    throwIfError(): void {
        if (this.hasError()) {
            const { code, message } = this.getError();
            throw new Error(`XML Error${code ? ` [${code}]` : ''}: ${message || "Unknown error"}`);
        }
    }

    /**
     * Check if XML is valid (has matching tags)
     */
    isValid(): boolean {
        const stack: string[] = [];
        const tagRegex = /<\/?(\w+)[^>]*>/g;
        let match;

        while ((match = tagRegex.exec(this.xml)) !== null) {
            const tag = match[1];
            const isClosing = match[0].startsWith('</');

            if (isClosing) {
                if (stack.length === 0 || stack.pop() !== tag) {
                    return false;
                }
            } else {
                if (!match[0].endsWith('/>')) {
                    stack.push(tag);
                }
            }
        }

        return stack.length === 0;
    }

    /**
     * Get all tags with their content (for nested structures)
     */
    getAllTagsWithHierarchy(): Array<{ tag: string; content: string; depth: number }> {
        const result: Array<{ tag: string; content: string; depth: number }> = [];
        const stack: { tag: string; depth: number; startIndex: number }[] = [];
        let depth = 0;

        const tagRegex = /<\/?(\w+)[^>]*>/g;
        let match;

        while ((match = tagRegex.exec(this.xml)) !== null) {
            const isClosing = match[0].startsWith('</');
            const tagName = match[1];

            if (!isClosing && !match[0].endsWith('/>')) {
                stack.push({ tag: tagName, depth, startIndex: match.index + match[0].length });
                depth++;
            } else if (isClosing && stack.length > 0 && stack[stack.length - 1].tag === tagName) {
                const opening = stack.pop()!;
                depth--;
                const content = this.xml.substring(opening.startIndex, match.index).trim();
                if (content) {
                    result.push({ tag: tagName, content, depth: opening.depth });
                }
            }
        }

        return result;
    }

    /**
     * Extract specific value with default fallback
     */
    getTagOrDefault(tagName: string, defaultValue: string): string {
        const value = this.getTag(tagName);
        return value !== null ? value : defaultValue;
    }

    /**
     * Check if a specific tag exists
     */
    hasTag(tagName: string): boolean {
        const regex = new RegExp(`<${tagName}>`, 'i');
        return regex.test(this.xml);
    }

    /**
     * Get raw XML string
     */
    getRawXML(): string {
        return this.xml;
    }

    /**
     * Pretty print XML (basic formatting)
     */
    prettyPrint(): string {
        let formatted = "";
        let indent = 0;
        const lines = this.xml.replace(/>\s*</g, '>\n<').split('\n');

        for (const line of lines) {
            if (line.match(/<\/\w+>/)) {
                indent--;
            }
            formatted += "  ".repeat(indent) + line + '\n';
            if (line.match(/<\w+[^>]*[^\/]>/) && !line.match(/<\/\w+>/)) {
                indent++;
            }
        }

        return formatted.trim();
    }

    /**
     * Convert to JSON representation (simple)
     */
    toJSON(): { [key: string]: unknown } {
        return this.getAllTags();
    }

    /**
     * Static method to create parser from fetch response
     */
    static async fromFetch(url: string, options?: RequestInit): Promise<SimpleXMLParser> {
        const response = await fetch(url, options);
        const text = await response.text();
        return new SimpleXMLParser(text);
    }

    /**
     * Static method to parse XML string
     */
    static fromString(xml: string): SimpleXMLParser {
        return new SimpleXMLParser(xml);
    }
}
