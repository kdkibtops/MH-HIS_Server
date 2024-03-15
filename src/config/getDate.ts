/**Function to return the date in Egypt
 * @param {boolean} DaylightTimeSaving: if true TimeZone will be set to GMT +3 , if false, EMGT +2
 * @returns {string} current Date & Time
 */

export function getDateInEgypt(): string {
	return new Date()
		.toLocaleString('en-GB', {
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		})
		.toString()
		.replaceAll('/', '-')
		.replace(', ', 'T');
}
