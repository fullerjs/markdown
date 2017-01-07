'use strict';
const marked = require('marked');
const hljs = require('highlight.js');

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  smartypants: true,
  highlight: (code, lang) => {
    if (lang) {
      return hljs.highlight(lang, code).value;
    }

    return hljs.highlightAuto(code).value;
  }
});

module.exports = function(f, mat, options, next) {
  mat.getContent(content => {
    marked(content.toString(), (err, html) => {
      if (err) {
        next({
          message: err.message,
          file: err.filename === 'input' ? mat.dst().path : err.filename
          // line: err.line,
          // column: err.column,
          // extract: err.extract.join('\n')
        });
      } else {
        next(null, mat.setContent(html));
      }
    });
  });
};
