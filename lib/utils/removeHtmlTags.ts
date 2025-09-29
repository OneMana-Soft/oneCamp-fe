export function removeHtmlTags(htmlString: string): string {
    return htmlString.replace(/<[^>]*>/g, '');
}