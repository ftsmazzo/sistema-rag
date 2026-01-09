const { src, dest } = require('gulp');

function buildIcons() {
  return src('nodes/**/*.svg')
    .pipe(dest({ dist: 'dist/nodes' }));
}

exports.build = {
  icons: buildIcons,
};
