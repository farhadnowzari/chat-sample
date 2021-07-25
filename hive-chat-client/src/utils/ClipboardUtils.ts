export default class ClipboardUtils {
    static saveToClipboard(text: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            navigator.clipboard.writeText(text).then(() => {
                resolve();
            }, () => reject());
        });
    }
}