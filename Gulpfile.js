const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const fs = require('fs');
const path = require('path');

// Define a function to load translation data
function getTranslationData(locale) {
  const translationsPath = `src/translations/${locale}.json`;
  return JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
}

// Define the Gulp task
gulp.task('translations', function() {
  const locales = ['en', 'es']; // Add more locales as needed
  const tasks = locales.map(locale => {
    return gulp.src('src/pages/**/*.html')  // Source HTML templates
      .pipe(data(() => getTranslationData(locale)))  // Load translations
      .pipe(nunjucksRender({
        path: ['src/templates/', 'src/partials/']  // Paths for templates and partials
      }))
      .pipe(gulp.dest(`docs/${locale}`));  // Output to the docs/locale directory
  });

  // Use `return Promise.all` to signal async completion
  return Promise.all(tasks);
});

// Default task
gulp.task('default', gulp.series('translations'));
