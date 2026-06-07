/**
 * Replaces every {key} placeholder in a template with its replacement value.
 * Shared by the command handler (command replies) and the app (timer
 * announcements).
 */
export function formatTemplate(
	template: string,
	replacements: Record<string, string | number>,
): string {
	let result = template;
	for (const [key, value] of Object.entries(replacements)) {
		result = result.split(`{${key}}`).join(String(value));
	}
	return result;
}
