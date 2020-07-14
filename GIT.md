# Commit message format #

The commit message format specified by the [conventional
changelog](https://github.com/conventional-changelog/conventional-changelog)
standard is enforced by husky as a git hook on `commit-msg` to run
[commitlint](https://github.com/conventional-changelog/commitlint).

## ~/.gitmessage ##

You can create a `~/.gitmessage` file with the following contents so that it is
automatically included with your editor when you create a commit message. Handy
to get a summary of the formatting rules.


```


# Please use the following guidelines to format all your commit
# messages:
#
#     <type>(<scope>): <subject>
#     <BLANK LINE>
#     <body>
#     <BLANK LINE>
#     <footer>
#
# Please note that:
#  - The HEADER is a single line of max. 50 characters that
#    contains a succinct description of the change. It contains a
#    type, an optional scope, and a subject
#       + <type> describes the kind of change that this commit is
#                providing. Allowed types are:
#             * feat (feature)
#             * fix (bug fix)
#             * docs (documentation)
#             * style (formatting, missing semicolons, …)
#             * refactor
#             * test (when adding missing tests)
#             * chore (maintain)
#       + <scope> can be anything specifying the place of the commit
#                 change
#       + <subject> is a very short description of the change, in
#                   the following format:
#             * imperative, present tense: “change” not
#               “changed”/“changes”
#             * no capitalised first letter
#             * no dot (.) at the end
#  - The BODY should include the motivation for the change and
#    contrast this with previous behavior and must be phrased in
#    imperative present tense
#  - The FOOTER other than BREAKING CHANGE: <description> may be provided
#    and follow a convention similar to git trailer format.
#
#  See https://www.conventionalcommits.org/en/v1.0.0/#summary for more information
```

# Release #

## Cutting a release ##

Cutting a release is done as per the [convential changelong cutting
release](https://github.com/conventional-changelog/standard-version#cutting-releases)
instructions.

```
npm run release
```

However, with a `0.x` release the scheme changes, see [when you're in 0.x minor
bumps are for breaking changes, patch is for non-breaking
changes](https://github.com/conventional-changelog/standard-version/issues/460#issuecomment-540999674).
For that you need to [manually specify
release-as](https://github.com/conventional-changelog/standard-version#release-as-a-target-type-imperatively-npm-version-like)

For example, to release as `0.3.0`

```
npm run release -- --release-as 0.3.0
```
