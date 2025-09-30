export default class StringHelper {
    static toTitleCase = (str: string): typeof str => {
        return str.replace(
            /\w\S*/g,
            text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
        );
    }
}