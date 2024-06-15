# Ember Addon V2 Scanner

A CLI tool to scan your Ember project for addons that have a V2 version available.

## Usage

Execute the following command in the root of your Ember project:

```sh
npx ember-addon-v2-scanner@latest
```

### Example output

```bash
$ npx ember-addon-v2-scanner@latest

Gathering Ember Addon dependency info for 'super-rentals'
✔ Successfully compiled addon info
┌─────────┬────────────────────────────────┬─────────────────┬────────────────┬─────────────┬────────────────────┐
│ (index) │ NPM Name                       │ Current version │ Latest version │ On V2 Addon │ V2 Addon available │
├─────────┼────────────────────────────────┼─────────────────┼────────────────┼─────────────┼────────────────────┤
│ 0       │ '@ember/string'                │ '3.1.1'         │ '3.1.1'        │ '❌'        │ '❌'               │
│ 1       │ '@glimmer/component'           │ '1.1.2'         │ '1.1.2'        │ '❌'        │ '❌'               │
│ 2       │ '@glimmer/tracking'            │ '1.1.2'         │ '1.1.2'        │ '❌'        │ '❌'               │
│ 3       │ 'broccoli-asset-rev'           │ '3.0.0'         │ '3.0.0'        │ '❌'        │ '❌'               │
│ 4       │ 'ember-cli-app-version'        │ '6.0.1'         │ '7.0.0'        │ '❌'        │ '❌'               │
│ 5       │ 'ember-cli-babel'              │ '8.2.0'         │ '8.2.0'        │ '❌'        │ '❌'               │
│ 6       │ 'ember-cli-dependency-checker' │ '3.3.2'         │ '3.3.2'        │ '❌'        │ '❌'               │
│ 7       │ 'ember-cli-flash'              │ '4.0.0'         │ '5.1.0'        │ '❌'        │ '✅'               │
│ 8       │ 'ember-cli-inject-live-reload' │ '2.1.0'         │ '2.1.0'        │ '❌'        │ '❌'               │
│ 9       │ 'ember-cli-typescript'         │ '3.0.0'         │ '5.3.0'        │ '❌'        │ '❌'               │
│ 10      │ 'ember-click-outside'          │ '6.1.0'         │ '6.1.0'        │ '✅'        │ '✅'               │
│ 11      │ 'ember-fetch'                  │ '8.1.2'         │ '8.1.2'        │ '❌'        │ '❌'               │
│ 12      │ 'ember-get-config'             │ '2.1.1'         │ '2.1.1'        │ '❌'        │ '❌'               │
│ 13      │ 'ember-heroicons'              │ '0.4.0'         │ '0.5.0'        │ '❌'        │ '❌'               │
│ 14      │ 'ember-load-initializers'      │ '2.1.2'         │ '2.1.2'        │ '❌'        │ '❌'               │
│ 15      │ 'ember-modifier'               │ '4.1.0'         │ '4.1.0'        │ '✅'        │ '✅'               │
│ 16      │ 'ember-phosphor-icons'         │ '0.3.0'         │ '0.3.0'        │ '✅'        │ '✅'               │
│ 17      │ 'ember-qunit'                  │ '7.0.0'         │ '8.1.0'        │ '❌'        │ '✅'               │
│ 18      │ 'ember-resolver'               │ '11.0.1'        │ '12.0.1'       │ '❌'        │ '❌'               │
│ 19      │ 'ember-source'                 │ '5.2.0'         │ '5.9.0'        │ '❌'        │ '❌'               │
│ 20      │ 'ember-template-imports'       │ '3.4.2'         │ '4.1.1'        │ '❌'        │ '❌'               │
│ 21      │ 'loader.js'                    │ '4.7.0'         │ '4.7.0'        │ '❌'        │ '❌'               │
│ 22      │ 'prember'                      │ '2.0.0'         │ '2.0.0'        │ '❌'        │ '❌'               │
│ 23      │ 'qunit-dom'                    │ '2.0.0'         │ '3.1.2'        │ '❌'        │ '❌'               │
└─────────┴────────────────────────────────┴─────────────────┴────────────────┴─────────────┴────────────────────┘
There are addons available that are on V1 but have a V2 version available 🎉
- ember-qunit (latest: 8.1.0)
- ember-cli-flash (latest: 5.1.0)
```

## Why?

The Ember v2 addon format aligns Ember CLI classic addons with modern, static NPM packages. The direct benefit you get from upgrading to v2 is that the addon no longer has to be built as part of your app, which leads to faster build times.

Does your favorite addon not yet have a v2 version? Visit the addon's GitHub repo and see if you can aid with the conversion, and help make Ember builds faster for everyone! 🚀

## See also

- V2 Addon spec: https://github.com/embroider-build/embroider/tree/main/docs
- V2 Addon Migration Guide: https://github.com/embroider-build/embroider/blob/main/docs/porting-addons-to-v2.md
- V2 Addon Blueprint: https://github.com/embroider-build/addon-blueprint

## Acknowledgements

This project is based on [dependency-maintainers](https://github.com/NullVoxPopuli/dependency-maintainers) by [NullVoxPopuli](https://github.com/NullVoxPopuli/).
