export function formatDate(dateStr) {
    const [day, month, yy] = dateStr.split('/');

    const dd = day.padStart(2, '0');
    const mm = month.padStart(2, '0');

    return `${dd}/${mm}/${yy}`;
}
