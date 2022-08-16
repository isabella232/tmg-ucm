module.exports = {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog', 
      {
        changelogFile: 'CHANGELOG.md',
      }
    ],
    ['@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    // commit updates to versions, changelogs
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    // package plugin, deploy service
    [
      '@semantic-release/exec',
      {
        prepareCmd: "echo 'deploy worker' && npm run deploy:worker",
      },
    ],
  ],
};
