# Twitch Multi-Task Chat Bot

## Why you should use this

- Free to use
- Easy setup & use
- Easy to customize
- Customizable Multi-language support
- No third-party database required

## **APP Features ✨**

- User features
  - user can create multiple tasks
  - user can edit current tasks
  - user can mark tasks as complete
  - user can delete previous tasks
- Faster performance & smaller file sizes
- Supports multiple languages translations
  - EN - English
  - ES - Español
  - FR - française
  - JP - 日本語

## Content

- [Installation](#installation)
- [Commands](#commands)
  - [Moderators only](#moderators-only)
- [Customization settings](#customization-settings)
  - [settings](#settings)
  - [fonts](#fonts)
  - [scroll](#scroll)
  - [task list](#task-list)
  - [header](#header)
  - [body](#body)
  - [task (individual tasks)](#task-individual-tasks)
  - [checkbox](#checkbox)
  - [bullet point](#bullet-point)
  - [colon](#colon)
- [Aliases](#aliases)
- [Credits](#credits)

## Installation

1. Get auth token from https://twitchapps.com/tmi
2. Copy the token
3. Put it in auth.js, like so:

```js
const oauth = "oauth:1a2b3c4d5e6f7g8h9i1j2k3l";
```

4. Fill in your channel name:

```js
const channel = "JujocoCS";
const username = "YOUR_BOT_ACCOUNT_HERE";
```

5. Fill in the bot username, or your channel's username, depending on which account you authorized in https://twitchapps.com/tmi. In most cases it is the same as your channel name.

```js
const channel = "JujocoCS";
const username = "JujocoCS";
const oauth = "oauth:1a2b3c4d5e6f7g8h9i1j2k3l";
```

6. Add & Setup a `Browser Source` in OBS studio or other streaming software with the local file source pointing to `index.html`

## Commands

### Common

- !taskadd \<task\> , \<task\> - Add a task or multiple tasks
- !taskedit \<number\> \<newTask\> - Edit a single task
- !taskdone \<number\> - Mark a single task as done
- !taskdelete \<number\> - Remove a single task
- !taskcheck - Check your last task

### Moderators only

- !adminclearall - Clear all tasks
- !admincleardone - Clear all done tasks
- !adminclearuser \<username\> - Remove all tasks from a user

For aliases, see [here](#aliases)

## Customization settings

Open the `configs.js` to edit the behavior of the Task List

Open the `base.css` to edit the styles of the Task List

### Behavior Settings

`crossTasksOnDone`: default **true**

- **true**: cross the tasks when they are marked as done
- **false**: don't cross the tasks when they are marked as done

`languageCode`: default **EN**

- **EN**: English translation
- **ES**: Spanish translation
- **FR**: French translation
- **JP**: Japanese translation

`maxTasksPerUser`: default **5**

- **number**: A value between 1 - 10;

`scrollSpeed`: default **50**

- **number**: A value between 1 - 100;

---

### Styles Settings

### Fonts Styles

Font family for the Header & Body \(supports all fonts from [Google Fonts](https://fonts.google.com/)\)

```css
--header-font-family: Roboto Mono;
--body-font-family: Roboto Mono;
```

### App Styles

```css
/* App */
--app-border-color: rgba(144, 0, 0, 0);
--app-border-width: 0px;
--app-border-radius: 8px;
--app-padding: 8px;
--app-bg-image: url(../public/transparent-background.png);
--app-background-color: rgba(129, 129, 129, 0.225);
```

### Header Styles

```css
/* Header */
--header-border-color: black;
--header-border-width: 0px;
--header-border-radius: 4px;
--header-margin-bottom: 10px;
--header-background-color: rgba(0, 0, 0, 0.5);
--header-font-size: 24px;
--header-font-color: white;
--header-font-weight: lighter;
```

### Body Styles

```css
/* Body */
--body-border-color: rgb(0, 0, 0, 0);
--body-border-width: 0px;
--body-border-radius: 4px;
--body-background-color: rgba(0, 0, 0, 0);
```

### Card Styles (individual tasks)

```css
/* Card */
--card-gap-between: 10px;
--card-background-color: rgba(0, 0, 0, 0.8);
--card-border-color: rgba(255, 255, 255, 0.2);
--card-border-width: 1px;
--card-border-radius: 4px;
--card-margin-bottom: 10px;

/* User Name */
--username-font-size: 22px;
--username-color: #ffffff;
--username-font-weight: lighter;

/* User Task */
--task-font-size: 18px;
--task-font-color: #ffffff;
--task-font-weight: lighter;
--task-done-font-color: #2e2e2e;
```

## Aliases

**add task commands:**

- `!addtask`
- `!add`
- `!task`
- `!taska`
- `!taskadd`
- `!atask`
- `!todo`

**delete task commands:**

- `!taskd`
- `!taskdel`
- `!taskdelete`
- `!deltask`
- `!deletetask`
- `!taskr`
- `!taskremove`
- `!rtask`
- `!removetask`
- `!remove`
- `!delete`

**edit task commands:**

- `taske`
- `taskedit`
- `etask`
- `edittask`
- `edit`

**finish task commands:**

- `!taskf`
- `!taskfinish`
- `!ftask`
- `!finishtask`
- `!taskdone`
- `!donetask`
- `!finish`
- `!done`
- `!finished`

**check commands:** \(check last task of yourself or user\)

- `!taskc`
- `!taskcheck`
- `!ctask`
- `!checktask`
- `!mytask`
- `!check`

Note: You can also use it like this: `!check @user` or `!check user`

**help commands:**

- `!taskh`
- `!taskhelp`
- `!htask`
- `!helptask`
- `!tasks`

**admin delete commands:** \(delete a task from a user\) \(mods only\)

- `!taskadel`
- `!adel`
- `!adelete`
- `!admindelete`

**admin clear done commands:** \(clear all done tasks from list\) \(mods only\)

- `!acleardone`
- `!admincleardone`
- `!cleardone`

**admin clear all commands:** \(clear all tasks from list\) \(mods only\)

- `!clearall`
- `!allclear`
- `!adminclearall`
- `!adminallclear`
- `!aclearall`
- `!aclear`
- `!clear`

## Credits

**Author:** [**@JujocoCS**](https://twitch.tv/JujocoCS)

**Inspired by:** [**@RythonDev**](https://twitch.tv/RythonDev) & [**@MohFocus**](https://twitch.tv/MohFocus)
