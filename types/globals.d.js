/**
 * @global
 * @typedef {Object} Configs
 * @property {AuthConfigs} auth - The authentication configuration
 * @property {SettingsConfigs} settings - The settings configuration
 * @property {StyleConfigs} styles - The styles configuration
 * @property {AdminConfigs} admin - The admin configuration
 * @property {UserConfigs} user - The user configuration
 */

/**
 * @typedef {Object} AuthConfigs
 * @property {string} auth.twitch_oauth - The Twitch oauth token
 * @property {string} auth.twitch_channel - The Twitch channel
 * @property {string} auth.twitch_username - The Twitch username
 */

/**
 * @typedef {Object} SettingsConfigs
 * @property {string} settings.languageCode - The language code
 * @property {string} settings.maxTasksPerUser - The maximum tasks per user
 * @property {string} settings.scrollSpeed - The scroll speed
 * @property {boolean} settings.showUsernameColor - The show username color
 * @property {string} settings.headerDisplay - The header display
 * @property {string} settings.headerText - The header text
 * @property {boolean} settings.testMode - The test mode
 */

/**
 * @typedef {Object} StyleConfigs
 * @property {string} styles.headerFontFamily - The header font family
 * @property {string} styles.cardFontFamily - The card font family
 * @property {string} styles.appBorderRadius - The app border radius
 * @property {string} styles.appPadding - The app padding
 * @property {string} styles.appBackgroundImage - The app background image
 * @property {string} styles.appBackgroundColor - The app background color
 * @property {string} styles.headerDisplay - The header display
 * @property {string} styles.headerBorderRadius - The header border radius
 * @property {string} styles.headerMarginBottom - The header margin bottom
 * @property {string} styles.headerBackgroundColor - The header background color
 * @property {string} styles.headerFontSize - The header font size
 * @property {string} styles.headerFontColor - The header font color
 * @property {string} styles.headerFontWeight - The header font weight
 * @property {string} styles.bodyBackgroundColor - The body background color
 * @property {string} styles.cardGapBetween - The card gap between
 * @property {string} styles.cardBorderRadius - The card border radius
 * @property {string} styles.cardBackgroundColor - The card background color
 * @property {string} styles.usernameFontSize - The username font size
 * @property {string} styles.usernameColor - The username color
 * @property {string} styles.usernameFontWeight - The username font weight
 * @property {string} styles.taskFontSize - The task font size
 * @property {string} styles.taskFontColor - The task font color
 * @property {string} styles.taskFontWeight - The task font weight
 * @property {string} styles.taskDoneFontColor - The task done font color
 * @property {string} styles.taskDoneFontStyle - The task done font style
 * @property {string} styles.taskDoneTextDecoration - The task done text decoration
 */

/**
 * @typedef {Object} AdminConfigs
 * @property {Object} admin.commands - The admin commands
 * @property {Object} admin.responseTo - The admin response to
 */

/**
 * @typedef {Object} UserConfigs
 * @property {Object} user.commands - The user commands
 * @property {Object} user.responseTo - The user response to
 */
