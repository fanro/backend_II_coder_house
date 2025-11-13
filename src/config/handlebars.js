import { engine } from 'express-handlebars';

export const configurarHandlebars = (app) => {
  app.engine(
    'handlebars',
    engine({
      helpers: {
        eq: function (a, b) {
          return a === b;
        },
        range: function (start, end) {
          const result = [];
          for (let i = start; i <= end; i++) {
            result.push(i);
          }
          return result;
        },
        add: function (a, b) {
          return a + b;
        },
        subtract: function (a, b) {
          return a - b;
        },
      },
    })
  );

  app.set('view engine', 'handlebars');
  app.set('views', './src/views');
};
