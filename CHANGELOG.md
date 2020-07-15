# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.7.0](https://github.com/baerrach/gatsby-remark-plantuml/compare/v0.6.0...v0.7.0) (2020-07-15)


### Features

* **attributes:** add support for custom svg attributes ([c43f601](https://github.com/baerrach/gatsby-remark-plantuml/commit/c43f601a208dd1b88862e836bf053dca0ecd223b))
* **command-args:** add JAVA_OPTS ([123a85f](https://github.com/baerrach/gatsby-remark-plantuml/commit/123a85ff97846cf82a2b604842bb347e3d20af73))
* **command-args:** add PLANTUML_OPTS ([26e0584](https://github.com/baerrach/gatsby-remark-plantuml/commit/26e0584792dcf7b645988133344e06e3b3cf274c))
* **command-args:** move argument building into configuration ([7ae1034](https://github.com/baerrach/gatsby-remark-plantuml/commit/7ae1034b550de33680feba44421d6f56d5cc27eb))

## [0.6.0](https://github.com/baerrach/gatsby-remark-plantuml/compare/v0.5.0...v0.6.0) (2020-03-27)


### Bug Fixes

* **error-handling:** fix stderr and stdout issues ([ec7748e](https://github.com/baerrach/gatsby-remark-plantuml/commit/ec7748e512309c5a9f22ecb4569513abca47742e))
* **plantuml:** fix to configuration of custom plantuml jar ([349e619](https://github.com/baerrach/gatsby-remark-plantuml/commit/349e619994f35a0e43bf38ad6c0b40fe202e3ac4)), closes [#10](https://github.com/baerrach/gatsby-remark-plantuml/issues/10)
* **pluginOptions:** handle when plantumljar does not exist ([93bc546](https://github.com/baerrach/gatsby-remark-plantuml/commit/93bc54683da2ddbe778c5f1465b1489e2461a0f0))
* **test-remark-plugin:** remove unused toMatchPlantUmlError matcher ([527c3c9](https://github.com/baerrach/gatsby-remark-plantuml/commit/527c3c931e10a625e10895fe37128c5ec8aa0b07))

## [0.5.0](https://github.com/baerrach/gatsby-remark-plantuml/compare/v0.4.0...v0.5.0) (2020-02-28)


### Bug Fixes

* **utf-8:** fix utf-8 handling ([fbdeb43](https://github.com/baerrach/gatsby-remark-plantuml/commit/fbdeb43)), closes [#9](https://github.com/baerrach/gatsby-remark-plantuml/issues/9)
* **visualize-tests:** fix snapshotsdir ([3351a45](https://github.com/baerrach/gatsby-remark-plantuml/commit/3351a45))

## [0.4.0](https://github.com/baerrach/gatsby-remark-plantuml/compare/v0.3.0...v0.4.0) (2020-01-22)


### Features

* **error-handling:** report plantuml error messages ([6b20e42](https://github.com/baerrach/gatsby-remark-plantuml/commit/6b20e42))

## [0.3.0](https://github.com/baerrach/gatsby-remark-plantuml/compare/v0.2.0...v0.3.0) (2020-01-13)


### Features

* **gatsby-remark-plantuml:** add support for headless ([2a22273](https://github.com/baerrach/gatsby-remark-plantuml/commit/2a22273))

## [0.2.0](https://github.com/baerrach/gatsby-remark-plantuml/compare/v0.1.2...v0.2.0) (2019-10-04)


### Bug Fixes

* **plantuml:** fix race condition with process handling ([0e268b9](https://github.com/baerrach/gatsby-remark-plantuml/commit/0e268b9)), closes [#2](https://github.com/baerrach/gatsby-remark-plantuml/issues/2)
* **plantuml:** use reporter.error instead of panic to avoid failing build ([f690ce6](https://github.com/baerrach/gatsby-remark-plantuml/commit/f690ce6))
* **test:** move snapshot matching to end ([0c72e1f](https://github.com/baerrach/gatsby-remark-plantuml/commit/0c72e1f))


### Features

* **gatsby-remark-plantuml:** add maxWidth option ([8ff1b61](https://github.com/baerrach/gatsby-remark-plantuml/commit/8ff1b61)), closes [#1](https://github.com/baerrach/gatsby-remark-plantuml/issues/1)

### [0.1.2](https://github.com/baerrach/gatsby-remark-plantuml/compare/v0.1.1...v0.1.2) (2019-09-25)


### Bug Fixes

* **plantuml:** fix library location after change 0ee16f5 ([e8fb316](https://github.com/baerrach/gatsby-remark-plantuml/commit/e8fb316))

### [0.1.1](https://github.com/baerrach/gatsby-remark-plantuml/compare/v0.1.0...v0.1.1) (2019-09-25)


### Bug Fixes

* **gatsby:** put index.js into root folder ([0ee16f5](https://github.com/baerrach/gatsby-remark-plantuml/commit/0ee16f5))

## 0.1.0 (2019-09-25)


### Bug Fixes

* **babel:** use babel-preset-gatsby-package 0.2.5 to avoid corejs warnings ([5966e0e](https://github.com/baerrach/gatsby-remark-plantuml/commit/5966e0e))


### Features

* **babel:** configure babel as a copy of gatsby ([0d72de4](https://github.com/baerrach/gatsby-remark-plantuml/commit/0d72de4))
* **changelog:** add CHANGELOG.md shell ([896589f](https://github.com/baerrach/gatsby-remark-plantuml/commit/896589f))
* **emacs:** configure for unix file-coding ([ec47bea](https://github.com/baerrach/gatsby-remark-plantuml/commit/ec47bea))
* **eslint:** configure eslint as a copy from gatsby ([4a35b4c](https://github.com/baerrach/gatsby-remark-plantuml/commit/4a35b4c))
* **git:** add .gitignore ([c50d308](https://github.com/baerrach/gatsby-remark-plantuml/commit/c50d308))
* **npm:** add .npmignore ([3f856ef](https://github.com/baerrach/gatsby-remark-plantuml/commit/3f856ef))
* **plantuml:** add plantuml library ([a5fab71](https://github.com/baerrach/gatsby-remark-plantuml/commit/a5fab71))
* **plantuml:** add plantuml remark handling ([3445e6e](https://github.com/baerrach/gatsby-remark-plantuml/commit/3445e6e))
* **prettier:** configure prettier as a copy from gatsby ([da90390](https://github.com/baerrach/gatsby-remark-plantuml/commit/da90390))
* **visualize:** use sanitizedTestName only in filename ([09d7e3a](https://github.com/baerrach/gatsby-remark-plantuml/commit/09d7e3a))
* **visualize-test:** add script `npm run visualize:tests` to generate svg visualizations ([200f8e2](https://github.com/baerrach/gatsby-remark-plantuml/commit/200f8e2))
