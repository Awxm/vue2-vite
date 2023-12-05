/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 *
 * Version: 5.4.1 (2020-07-08)
 */
(function(domGlobals) {
  // eslint-disable-next-line no-undef
  const global = tinymce.util.Tools.resolve('tinymce.PluginManager');

  const noop = function() {};
  const constant = function(value) {
    return function() {
      return value;
    };
  };
  const never = constant(false);
  const always = constant(true);

  const none = function() {
    return NONE;
  };
  var NONE = (function() {
    const eq = function(o) {
      return o.isNone();
    };
    const call = function(thunk) {
      return thunk();
    };
    const id = function(n) {
      return n;
    };
    const me = {
      fold(n, _s) {
        return n();
      },
      is: never,
      isSome: never,
      isNone: always,
      getOr: id,
      getOrThunk: call,
      getOrDie(msg) {
        throw new Error(msg || 'error: getOrDie called on none.');
      },
      getOrNull: constant(null),
      getOrUndefined: constant(undefined),
      or: id,
      orThunk: call,
      map: none,
      each: noop,
      bind: none,
      exists: never,
      forall: always,
      filter: none,
      equals: eq,
      equals_: eq,
      toArray() {
        return [];
      },
      toString: constant('none()'),
    };
    return me;
  })();
  var some = function(a) {
    const constant_a = constant(a);
    const self = function() {
      return me;
    };
    const bind = function(f) {
      return f(a);
    };
    var me = {
      fold(n, s) {
        return s(a);
      },
      is(v) {
        return a === v;
      },
      isSome: always,
      isNone: never,
      getOr: constant_a,
      getOrThunk: constant_a,
      getOrDie: constant_a,
      getOrNull: constant_a,
      getOrUndefined: constant_a,
      or: self,
      orThunk: self,
      map(f) {
        return some(f(a));
      },
      each(f) {
        f(a);
      },
      bind,
      exists: bind,
      forall: bind,
      filter(f) {
        return f(a) ? me : NONE;
      },
      toArray() {
        return [a];
      },
      toString() {
        return `some(${a})`;
      },
      equals(o) {
        return o.is(a);
      },
      equals_(o, elementEq) {
        return o.fold(never, (b) => elementEq(a, b));
      },
    };
    return me;
  };
  const from = function(value) {
    return value === null || value === undefined ? NONE : some(value);
  };
  const Option = {
    some,
    none,
    from,
  };

  const exists = function(xs, pred) {
    for (let i = 0, len = xs.length; i < len; i++) {
      const x = xs[i];
      if (pred(x, i)) {
        return true;
      }
    }
    return false;
  };
  const map = function(xs, f) {
    const len = xs.length;
    const r = new Array(len);
    for (let i = 0; i < len; i++) {
      const x = xs[i];
      r[i] = f(x, i);
    }
    return r;
  };

  const contains = function(str, substr) {
    return str.indexOf(substr) !== -1;
  };

  const emojiMatches = function(emoji, lowerCasePattern) {
    return (
      contains(emoji.title.toLowerCase(), lowerCasePattern) ||
      exists(emoji.keywords, (k) => contains(k.toLowerCase(), lowerCasePattern))
    );
  };
  const emojisFrom = function(list, pattern, maxResults) {
    const matches = [];
    const lowerCasePattern = pattern.toLowerCase();
    const reachedLimit = maxResults.fold(
      () => never,
      (max) =>
        function(size) {
          return size >= max;
        },
    );
    for (let i = 0; i < list.length; i++) {
      if (pattern.length === 0 || emojiMatches(list[i], lowerCasePattern)) {
        matches.push({
          value: list[i].char,
          text: list[i].title,
          icon: list[i].char,
        });
        if (reachedLimit(matches.length)) {
          break;
        }
      }
    }
    return matches;
  };

  const init = function(editor, database) {
    editor.ui.registry.addAutocompleter('emoticons', {
      ch: ':',
      columns: 'auto',
      minChars: 2,
      fetch(pattern, maxResults) {
        return database.waitForLoad().then(() => {
          const candidates = database.listAll();
          return emojisFrom(candidates, pattern, Option.some(maxResults));
        });
      },
      onAction(autocompleteApi, rng, value) {
        editor.selection.setRng(rng);
        editor.insertContent(value);
        autocompleteApi.hide();
      },
    });
  };

  const Cell = function(initial) {
    let value = initial;
    const get = function() {
      return value;
    };
    const set = function(v) {
      value = v;
    };
    return {
      get,
      set,
    };
  };

  const last = function(fn, rate) {
    let timer = null;
    const cancel = function() {
      if (timer !== null) {
        domGlobals.clearTimeout(timer);
        timer = null;
      }
    };
    const throttle = function() {
      const args = [];
      for (let _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      if (timer !== null) {
        domGlobals.clearTimeout(timer);
      }
      timer = domGlobals.setTimeout(() => {
        fn.apply(null, args);
        timer = null;
      }, rate);
    };
    return {
      cancel,
      throttle,
    };
  };

  const insertEmoticon = function(editor, ch) {
    editor.insertContent(ch);
  };

  var __assign = function() {
    __assign =
      Object.assign ||
      function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (const p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };

  const { hasOwnProperty } = Object.prototype;
  const shallow = function(old, nu) {
    return nu;
  };
  const baseMerge = function(merger) {
    return function() {
      const objects = new Array(arguments.length);
      for (let i = 0; i < objects.length; i++) {
        objects[i] = arguments[i];
      }
      if (objects.length === 0) {
        throw new Error("Can't merge zero objects");
      }
      const ret = {};
      for (let j = 0; j < objects.length; j++) {
        const curObject = objects[j];
        for (const key in curObject) {
          if (hasOwnProperty.call(curObject, key)) {
            ret[key] = merger(ret[key], curObject[key]);
          }
        }
      }
      return ret;
    };
  };
  const merge = baseMerge(shallow);

  const { keys } = Object;
  const hasOwnProperty$1 = Object.hasOwnProperty;
  const each = function(obj, f) {
    const props = keys(obj);
    for (let k = 0, len = props.length; k < len; k++) {
      const i = props[k];
      const x = obj[i];
      f(x, i);
    }
  };
  const map$1 = function(obj, f) {
    return tupleMap(obj, (x, i) => ({
      k: i,
      v: f(x, i),
    }));
  };
  var tupleMap = function(obj, f) {
    const r = {};
    each(obj, (x, i) => {
      const tuple = f(x, i);
      r[tuple.k] = tuple.v;
    });
    return r;
  };
  const has = function(obj, key) {
    return hasOwnProperty$1.call(obj, key);
  };

  const global$1 = tinymce.util.Tools.resolve('tinymce.Resource');

  const global$2 = tinymce.util.Tools.resolve('tinymce.util.Delay');

  const global$3 = tinymce.util.Tools.resolve('tinymce.util.Promise');

  const DEFAULT_ID = 'tinymce.plugins.emoticons';
  const getEmoticonDatabaseUrl = function(editor, pluginUrl) {
    return editor.getParam('emoticons_database_url', `${pluginUrl}/js/emojis${editor.suffix}.js`);
  };
  const getEmoticonDatabaseId = function(editor) {
    return editor.getParam('emoticons_database_id', DEFAULT_ID, 'string');
  };
  const getAppendedEmoticons = function(editor) {
    return editor.getParam('emoticons_append', {}, 'object');
  };

  const ALL_CATEGORY = 'All';
  const categoryNameMap = {
    symbols: 'Symbols',
    people: 'People',
    animals_and_nature: 'Animals and Nature',
    food_and_drink: 'Food and Drink',
    activity: 'Activity',
    travel_and_places: 'Travel and Places',
    objects: 'Objects',
    flags: 'Flags',
    user: 'User Defined',
  };
  const translateCategory = function(categories, name) {
    return has(categories, name) ? categories[name] : name;
  };
  const getUserDefinedEmoticons = function(editor) {
    const userDefinedEmoticons = getAppendedEmoticons(editor);
    return map$1(userDefinedEmoticons, (value) => ({
      keywords: [],
      category: 'user',
      ...value,
    }));
  };
  const initDatabase = function(editor, databaseUrl, databaseId) {
    const categories = Cell(Option.none());
    const all = Cell(Option.none());
    const processEmojis = function(emojis) {
      const cats = {};
      const everything = [];
      each(emojis, (lib, title) => {
        const entry = {
          title,
          keywords: lib.keywords,
          char: lib.char,
          category: translateCategory(categoryNameMap, lib.category),
        };
        const current = cats[entry.category] !== undefined ? cats[entry.category] : [];
        cats[entry.category] = current.concat([entry]);
        everything.push(entry);
      });
      categories.set(Option.some(cats));
      all.set(Option.some(everything));
    };
    editor.on('init', () => {
      global$1.load(databaseId, databaseUrl).then(
        (emojis) => {
          const userEmojis = getUserDefinedEmoticons(editor);
          processEmojis(merge(emojis, userEmojis));
        },
        (err) => {
          domGlobals.console.log(`Failed to load emoticons: ${err}`);
          categories.set(Option.some({}));
          all.set(Option.some([]));
        },
      );
    });
    const listCategory = function(category) {
      if (category === ALL_CATEGORY) {
        return listAll();
      }
      return categories
        .get()
        .bind((cats) => Option.from(cats[category]))
        .getOr([]);
    };
    var listAll = function() {
      return all.get().getOr([]);
    };
    const listCategories = function() {
      return [ALL_CATEGORY].concat(keys(categories.get().getOr({})));
    };
    const waitForLoad = function() {
      if (hasLoaded()) {
        return global$3.resolve(true);
      }
      return new global$3((resolve, reject) => {
        let numRetries = 15;
        var interval = global$2.setInterval(() => {
          if (hasLoaded()) {
            global$2.clearInterval(interval);
            resolve(true);
          } else {
            numRetries--;
            if (numRetries < 0) {
              domGlobals.console.log(`Could not load emojis from url: ${databaseUrl}`);
              global$2.clearInterval(interval);
              reject(false);
            }
          }
        }, 100);
      });
    };
    var hasLoaded = function() {
      return categories.get().isSome() && all.get().isSome();
    };
    return {
      listCategories,
      hasLoaded,
      waitForLoad,
      listAll,
      listCategory,
    };
  };

  const patternName = 'pattern';
  const open = function(editor, database) {
    const initialState = {
      pattern: '',
      results: emojisFrom(database.listAll(), '', Option.some(300)),
    };
    const currentTab = Cell(ALL_CATEGORY);
    const scan = function(dialogApi) {
      const dialogData = dialogApi.getData();
      const category = currentTab.get();
      const candidates = database.listCategory(category);
      const results = emojisFrom(
        candidates,
        dialogData[patternName],
        category === ALL_CATEGORY ? Option.some(300) : Option.none(),
      );
      dialogApi.setData({ results });
    };
    const updateFilter = last((dialogApi) => {
      scan(dialogApi);
    }, 200);
    const searchField = {
      label: 'Search',
      type: 'input',
      name: patternName,
    };
    const resultsField = {
      type: 'collection',
      name: 'results',
    };
    const getInitialState = function() {
      const body = {
        type: 'tabpanel',
        tabs: map(database.listCategories(), (cat) => ({
          title: cat,
          name: cat,
          items: [searchField, resultsField],
        })),
      };
      return {
        title: 'Emoticons',
        size: 'normal',
        body,
        initialData: initialState,
        onTabChange(dialogApi, details) {
          currentTab.set(details.newTabName);
          updateFilter.throttle(dialogApi);
        },
        onChange: updateFilter.throttle,
        onAction(dialogApi, actionData) {
          if (actionData.name === 'results') {
            insertEmoticon(editor, actionData.value);
            dialogApi.close();
          }
        },
        buttons: [
          {
            type: 'cancel',
            text: 'Close',
            primary: true,
          },
        ],
      };
    };
    const dialogApi = editor.windowManager.open(getInitialState());
    dialogApi.focus(patternName);
    if (!database.hasLoaded()) {
      dialogApi.block('Loading emoticons...');
      database
        .waitForLoad()
        .then(() => {
          dialogApi.redial(getInitialState());
          updateFilter.throttle(dialogApi);
          dialogApi.focus(patternName);
          dialogApi.unblock();
        })
        .catch((_err) => {
          dialogApi.redial({
            title: 'Emoticons',
            body: {
              type: 'panel',
              items: [
                {
                  type: 'alertbanner',
                  level: 'error',
                  icon: 'warning',
                  text: '<p>Could not load emoticons</p>',
                },
              ],
            },
            buttons: [
              {
                type: 'cancel',
                text: 'Close',
                primary: true,
              },
            ],
            initialData: {
              pattern: '',
              results: [],
            },
          });
          dialogApi.focus(patternName);
          dialogApi.unblock();
        });
    }
  };

  const register = function(editor, database) {
    const onAction = function() {
      return open(editor, database);
    };
    editor.ui.registry.addButton('emoticons', {
      tooltip: 'Emoticons',
      icon: 'emoji',
      onAction,
    });
    editor.ui.registry.addMenuItem('emoticons', {
      text: 'Emoticons...',
      icon: 'emoji',
      onAction,
    });
  };

  function Plugin() {
    global.add('emoticons', (editor, pluginUrl) => {
      const databaseUrl = getEmoticonDatabaseUrl(editor, pluginUrl);
      const databaseId = getEmoticonDatabaseId(editor);
      const database = initDatabase(editor, databaseUrl, databaseId);
      register(editor, database);
      init(editor, database);
    });
  }

  Plugin();
})(window);
