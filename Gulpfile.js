const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const fs = require('fs');

// Define a function to load translation data
function getTranslationData(locale) {
  const translationsPath = `./src/translations/${locale}.json`;
  return JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
}

// Define the Gulp task
gulp.task('translations', function() {
  const locales = ['en', 'es']; // Add more locales as needed
  const tasks = locales.map(locale => {
    return gulp.src('src/templates/**/*.html')
      .pipe(data(() => getTranslationData(locale)))
      .pipe(nunjucksRender({
        path: ['src/templates/']
      }))
      .pipe(gulp.dest(`docs/${locale}`)); // Output each language version to a separate directory
  });

  // Use `return Promise.all` to signal async completion
  return Promise.all(tasks);
});

// Default task
gulp.task('default', gulp.series('translations'));
