# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.2.0](https://github.com/jujoco/twitch-multitask-task-list-overlay/compare/v2.1.0...v2.2.0) (2025-03-08)

## [2.1.0](https://github.com/jujoco/twitch-multitask-task-list-overlay/compare/v2.0.0...v2.1.0) (2025-03-03)


### Features

* **command:** add !focus command ([2334025](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/233402500cfcbd8c542a6215881e29986139bf6a))
* **focus:** unfocus a task after it has been completed ([#38](https://github.com/jujoco/twitch-multitask-task-list-overlay/issues/38)) ([134685c](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/134685ccfd01d77b05da9cdd7b74f802cee2bf43))


### Bug Fixes

* **#39:** !clearDone - remove users with no task from LS ([2f266df](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/2f266dfc02ee226832944fb38881e548d5450224)), closes [#39](https://github.com/jujoco/twitch-multitask-task-list-overlay/issues/39)

## [2.0.0](https://github.com/jujoco/twitch-multitask-task-list-overlay/compare/v1.1.0...v2.0.0) (2024-12-29)

## 1.1.0 (2024-12-23)


### Features

* add audio to indicate when focus/break timer ends ([fbecd90](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/fbecd9090e7c8da982ec2b721a9b87c9451ef136))
* **command:** fix !check command to response to users with no tasks ([e00e37c](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/e00e37cb5ea3d38eebefdb69648f2c358b61dd43))
* **command:** should reply with string, not task id. user request issue [#14](https://github.com/jujoco/twitch-multitask-task-list-overlay/issues/14) ([68e5a58](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/68e5a5832a638ebc8d5ee86e929e210e911996b7))
* **config:** update defaults for shaper text 2x ([769f933](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/769f933f6c7e3d8826fb6c354dbd88fd48bb7dfa))
* **docs:** update docs ([5423ced](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/5423cedccf2615dc18cda40405cb014c4f3801c3))
* **i18n:** add ES, FR, JP alias to doc & config ([424412c](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/424412c93ad1f8dc87939b454991df246a6868af))
* **i18n:** part2: add ES, FR, JP alias to doc & config ([eefacd1](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/eefacd11899c24c81860681ff82b39e71237b0e3))
* **style:** refactor to keep size constant for users ([f4f6ece](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/f4f6eceb1b8c21ab0a6accc39f1bae71bd8f490a))
* **style:** simplify paddding, wording, config options ([6887bd0](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/6887bd01f64d9b11b9ca727b80c2f30d6ecc35b4))


### Bug Fixes

* colorName bug ([4aaf444](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/4aaf44410b7c63c71733d3a5f5ac1f022c484bd5))
* **config:** remove nested commands causing bug ([712de5b](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/712de5bb923a066ea8396d04c65d36faa66b4f22))
* **css:** add 2x gap for Consistency ([fddbc1c](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/fddbc1ce326ff16c25297c6653aaa9b7e87657f8))
* delete users w/ 0 task from localStorage ([86ec09e](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/86ec09e391c59ba738d5e111df8630b2d52491d3))
* patch delete all command & add test ([b5eabd7](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/b5eabd7e6b59feba0fd2bdfcb00ebd95fcf1507d))
* rebuild bundle - fix scroll bug ([81b7320](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/81b73202f9b0b2634a74c158a956d2710d6d4b1c))
* **test:** fix test mode bug with update to command name ([2c736f9](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/2c736f98827018b14654f85b3f0a8d6f03dee5b9))
* testMode fix with userList.clearUserList() to clear list object and LS.userList ([90a5e5f](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/90a5e5f15209c5a15fa4ea454a8e90ec660ee23f))
* when connect is dropped or twitch servers get swapped reconnect. ([77a7e70](https://github.com/jujoco/twitch-multitask-task-list-overlay/commit/77a7e703003f97990286c32af13076027bf2dd68))
