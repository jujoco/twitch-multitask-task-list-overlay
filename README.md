# Twitch Chatbot Multitask Task List Overlay

<img src="./images/live-sample.png">
<br >
<img src="./images/customize-sample.png">

## What and Why?

A TaskList Widget for Twitch TV which allows users to interact with the broadcaster's stream.
Viewers can create, edit, mark as done, and delete tasks from the list. This TaskList widget is designed to help streamers and their viewers to keep track of tasks, goals, or objectives during a stream. It is easy to use, and fast to setup. The TaskList widget is designed to be used in OBS or other streaming software as a Browser Source.

## **APP Features ✨**

-   Free to use
-   Easy setup
-   Easy to customize
-   Fast performance & super lightweight (19 kB bundle size)
-   No coding required
-   Customizable Multi-language support
-   No third-party database required
-   User features
    -   user can create multiple tasks
    -   user can edit tasks
    -   user can mark tasks as done
    -   user can delete tasks from their list
-   Supports multiple languages translations
    -   EN - English
    -   ES - Español
    -   FR - française
    -   JP - 日本語
    -   UA - українська

## Table of Contents

-   [Installation Instructions](#installation-instructions)
-   [Customization settings](#customization-settings)
    -   [Behavior Settings](#behavior-settings)
    -   [Styles Settings](#styles-settings)
    -   [Fonts Styles](#fonts-styles)
    -   [App Styles](#app-styles)
    -   [Header Styles](#header-styles)
    -   [Card Styles (individual cards)](#card-styles-individual-cards)
-   [Commands](#commands)
    -   [Commands for Everyone](#commands-for-everyone)
    -   [Commands for Broadcasters and Moderators](#commands-for-broadcasters-and-moderators)
-   [Aliases](#aliases)
-   [Credits](#credits)

## Installation Introduction

1. **Download this repo** - Download this repo by clicking on the green `Code` button and selecting `Download ZIP`.

2. **Unzip the Download** - Once the download is complete, unzip the downloaded file to a location on your computer where you can easily access it and remember where it is.

3. **Setup a Browser Source in OBS** - Open OBS and add a new `Browser Source` to your scene. Name it `TaskList overlay` or something you can easily remember.

4. **Select the Local file checkbox** - In the Browser Source settings, select `Local file` and then `Browse` to the location where you unzipped the downloaded files. Select the `index.html` file and click `Open`.

5. **Set the Width and Height** - Next, in the Browser Source, set the width and height. I recommend 660px Width and 1600px Height. Adjust as needed.

6. **Done!** - Select OK to save!. Read the [Customization settings](#customization-settings) section to customize the MultiTask list widget and connect it to your Twitch chat.

<img width="500px" src="./images/obs-source-example.png"/>

## Customization settings

Open the `configs.js` file and modify the following settings to customized the TaskList widget Behavior & Appearance.

> IMPORTANT! — Any changes you make to the `configs.js` file will require you to click the `Refresh Cache of Current Page` button in Browser Source you just created to see the style changes you make. (see image above, #5.)

### Twitch oAuth - Required

1. Get auth token from https://twitchapps.com/tmi
2. open `configs.js` file
3. Replace `OAUTHTOKEN` with your token
4. Replace `CHANNEL` with your channel name
5. Replace `USERNAME` with your username — in most cases it is the same as your channel name.

```js
twitch_oauth = "OAUTHTOKEN",
twitch_channel = "CHANNEL",
twitch_username = "USERNAME",
```

When you are done, it should look something like this:

```js
twitch_oauth = "oauth:138kjl2a0r3dpaf93asdf",
twitch_channel = "jujococs",
twitch_username = "jujococs",
```

### Behavior Settings

`languageCode`: Default = **"EN"**

-   **"EN"**: English translation
-   **"ES"**: Spanish translation
-   **"FR"**: French translation
-   **"JP"**: Japanese translation
-   **"UA"**: Ukrainian translation

`maxTasksPerUser`: Default = **5**

-   **number**: A value between 1 - 10.

`scrollSpeed`: Default = **40**

-   **number**: A value between 1 - 100.

`showUsernameColor`: Default = **true**

-   **true**: will shows the user's twitch chat color
-   **false**: will show the color you set in the `username-color` style

`headerFeature`: Default = "timer"

Enable one will disable the others.

-   **"timer"**: Display a timer in the header
-   **"text"**: Display a custom text in the header
-   **"commands"**: Display commands tips in the header
-   **"tasks-only"**: Display only the tasks count in the header

`headerCustomText`: Default = "Custom Text"

HeaderFeature above must be set to "Text"

`testMode`: Default = **false**

-   **false**: turn OFF test mode.
-   **true**: turn ON test mode.

Use this to test the TaskList without affecting the real task list and visually see the style changes you make. When test mode is OFF, the TaskList will work as normal and remove any test tasks.

### Styles Settings

The following settings are for styling the TaskList. Default values are provided below. If at any point you want to reset the styles to the default values you can find the default values below next to each style name.

**Font Family** - selection available @ https://fonts.google.com

-   headerFontFamily: "Roboto Mono"
-   cardFontFamily: "Roboto Mono"

**App Styles**

-   appBorderRadius: Default = **"5px"**
-   appPadding: Default = **"8px"**
-   appBackgroundImage: Default = **"url(../images/transparent-image.png)"**
-   appBackgroundColor: Default = **"rgba(0, 0, 0, 0)"**

**Header Styles**

-   headerDisplay: Default = **"flex"**
-   headerBorderRadius: Default = **"6px"**
-   headerMarginBottom: Default = **"6px"**
-   headerBackgroundColor: Default = **"rgba(45, 45, 45, 0.7)"**
-   headerFontSize: Default = **"20px"**
-   headerFontColor: Default = **"#FFFFFF"**
-   headerFontWeight: Default = **"normal"**

**Card Styles**

-   cardGapBetween: Default = **"6px"**
-   cardBorderRadius: Default = **"6px"**
-   cardBackgroundColor: Default = **"rgba(45, 45, 45, 0.7)"**

**Username Styles**

-   usernameFontSize: Default = **"18px"**
-   usernameColor: Default = **"#FFFFFF"**
-   usernameFontWeight: Default = **"normal"**

**Task Styles**

-   taskFontSize: Default = **"16px"**
-   taskFontColor: Default = **"#FFFFFF"**
-   taskFontWeight: Default = **"normal"**
-   taskDoneFontColor: Default = **"#aaaaaa"**
-   taskDoneFontStyle: Default = **"#italic"**
-   taskDoneTextDecoration: Default = **"none"**

## Commands

### Commands for Everyone

-   `!task` - Add task(s) (multiple tasks must be separated by a comma)

    -   example: `!task read ch. 3`
    -   example: `!task prep for exam, walk dog`

-   `!edit` - Edit a single task

    -   example: `!edit 1 read ch. 4`
    -   example: `!edit 2 walk cat`

-   `!done` - Mark task(s) as done (multiple tasks must be separated by a comma)

    -   example: `!done 1`
    -   example: `!done 2, 3`

-   `!delete` - Delete task(s) (multiple tasks must be separated by a comma)

    -   example: `!delete 1`
    -   example: `!delete 2, 3`

-   `!check` - Check your remaining tasks

    -   example: `!check`

-   `!credit` - Show the credits

    -   example: `!credit`

### Commands for Broadcasters and Moderators

-   `!timer` - Set the focus and break timer for a session (in minutes)

    -   example: `!timer 60/10`
    -   example: `!timer 90/15`

-   `!clearlist` - Clear all tasks from the list

    -   example: `!clearlist`

-   `!cleardone` - Clear all done tasks

    -   example: `!cleardone`

-   `!clearuser` - Remove all tasks from a User (case sensitive username)

    -   example: `!clearuser JujocoCS`

## Aliases

### User Commands

**add task commands:**

-   `!task`
-   `!añadir` (Spanish)
-   `!ajouter` (French)
-   `!追加` (Japanese)
-   `!додати` (Ukrainian)

**edit task commands:**

-   `!edit`
-   `!editar` (Spanish)
-   `!modifier` (French)
-   `!編集` (Japanese)
-   `!редагувати` (Ukrainian)

**complete task commands:**

-   `!done`
-   `!hecho` (Spanish)
-   `!terminé` (French)
-   `!完了` (Japanese)
-   `!готово` (Ukrainian)

**delete task commands:**

-   `!delete`
-   `!eliminar` (Spanish)
-   `!supprimer` (French)
-   `!削除` (Japanese)
-   `!видалити` (Ukrainian)

**check commands:**

-   `!check`
-   `!comprobar` (Spanish)
-   `!vérifier` (French)
-   `!チェック` (Japanese)
-   `!перевірити` (Ukrainian)

**help commands:**

-   `!help`
-   `!ayuda` (Spanish)
-   `!aide` (French)
-   `!ヘルプ` (Japanese)
-   `!допомога` (Ukrainian)

**extra commands:**

-   `!credit`
-   `!crédito` (Spanish)
-   `!crédit` (French)
-   `!クレジット` (Japanese)
-   `!кредит` (Ukrainian)

## Credits

**Author:** [**@JujocoCS**](https://twitch.tv/JujocoCS)
