export function isZeroEpoch(dateString: string) {
    if (dateString == "") {
        return true;
    }
    return (
        dateString == "0001-01-01T00:00:00Z" || dateString == "1970-01-01T00:00:00Z"
    );
}