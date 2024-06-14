# Contributing to this project (thank you!)

Thank you for considering contributing! We welcome all kinds of contributions, including bug reports, feature requests, and code improvements. Please follow these guidelines to help us review and accept your contributions.

1.  [Reporting Bugs](#reporting-bugs)
2.  [Contributing Code](#contributing-code)
3.  [Code of Conduct](#code-of-conduct)
4.  [Thank You](#thank-you)

## Reporting Bugs

If you think you've found a bug, first browse the issues tab to see if it has already been reported.

If not, please provide the following information when opening a new issue:

1. **Version**: which version of the app you are using.
2. **Browser/OS/OBS**: which browser, Operating system, and OBS you are using?
3. **Reproduction**: detailed steps to reproduce the issue, including any relevant configuration.
4. **Expected behavior**: what should have happened?
5. **Actual behavior**: what happened instead?
6. **Screenshots**: if the problem is visual, include a screenshot.

## Contributing Code

If you want to contribute code, you can do so by following these 3 steps:

### Step #1: Fork the Repository

1. **Fork the Repository**: Click the "Fork" button in the upper right corner of the repository's home page.

2. **Clone Your Fork**: Once you have forked the repository, clone your fork to your local machine.

3. **Create a branch** for your contributions.
    ```bash
    git checkout -b feat/my-feature
    ```
    example: `git checkout -b feat/new-translation`

### Step #2: Make Your Changes

1. **Make Your Changes**: Make the necessary changes in your fork's files.

2. **Run the Tests**: Make sure all tests pass.

    ```bash
    pnpm test  or  npm run test
    ```

3. **Commit Your Changes**: Write clear and concise commit messages.

    ```bash
    git add .
    git commit -m "feat(translation): add Ukrainian translation for the app"
    ```

4. **Push Your Changes**: Push your changes to Your fork on GitHub.

    ```bash
    git push origin feat/my-feature
    ```

### Step #3: Submit a Pull Request

1. Open a Pull Request: Go to the "Pull Requests" tab of the original repository and click "New Pull Request" to open a new pull request.

2. Fill out the pull request form by adding a title and description for your pull request. Be descriptive about what changes you made and why.

3. Submit the Pull Request: Click the "Create Pull Request" button to submit your pull request.

All code will be reviewed before being merged into the main branch and tested for security vulnerabilities.

#### Commit Message Format

```
<type>(<detail>): <short summary>
  │       │             │
  │       │             └─⫸ Very short detailed message of the change you made
  │       │
  │       └─⫸ Commit Scope: One word detail of the change you made. examples:
  │                         twitch | browser | styles | commands | youtube | etc.
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test
```

commit example:

```
feat(translation): add Ukrainian translation for the app
```

The `<type>` and `<short summary>` fields are mandatory, the `(<scope>)` field is optional.

##### Type must be one of the following:

-   **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
-   **ci**: Changes to our CI configuration files and scripts (examples: CircleCi, SauceLabs)
-   **docs**: Documentation only changes
-   **feat**: A new feature <- most common, use this if you're not sure.
-   **fix**: A bug fix
-   **perf**: A code change that improves performance
-   **refactor**: A code change that neither fixes a bug nor adds a feature
-   **test**: Adding missing tests or correcting existing tests

## Code of Conduct

Everyone is invited to participate in the community and related projects:
I want to create a welcoming and friendly environment.
Harassment of participants or other unethical and unprofessional behavior will not be tolerated in this spaces.
Check out the [Contributor Covenant](CODE_OF_CONDUCT.md) for more in-depth information.

## Thank You

Thank you - :) Jujoco! 🎉
