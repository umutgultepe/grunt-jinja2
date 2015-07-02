# grunt-jinja2

> render jinja2 template to html using original jinja2 (in python)

NO WINDOWS SUPPORT

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-jinja2 --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-jinja2');
```

## The "jinja2" task

### Overview
In your project's Gruntfile, add a section named `jinja2` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  jinja2: {
    options: {
      template_path: 'templates',
      context_path: 'context'
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.template_path
Type: `String`
Default value: `templates`

only source that under template_path will be rendered

#### options.context_path
Type: `String`
Default value: `context`

the src path (relative to template_path) + context_path should be the path of .json context file.

NOTE: the .json file must be the same name as your template name, eg: `index.html` will use the context of `index.json` as its context.

#### options.global_context_file (optional)
Tpye: `String`
Default value: `null`

When provide this option like this: `"global_context_file" : "my_global_context.json"`. The context of `my_global_context.json` will apply to all rendered tempates. 

#### options.maximum_concurrent_processes
Type: `int`
Default value: `null`

When provided, this option will limit the number concurrent rendering processes to the specified value. If you are receiving EAGAIN or EMFILE errors, this option might just save you.

### Usage Examples

#### Default Options
In this example, template file `templates/page.html` will be rendered without context.

```js
grunt.initConfig({
  jinja2: {
    options: {},
    files: {
      'dest/page.html': 'templates/page.html',
    },
  },
});
```

#### Custom Options
In this example, template files under `test/fixtures/templates` will be rendered with context files in `test/fixtures/context`

```js
grunt.initConfig({
  jinja2: {
    test: {
      options: {
        template_path: 'test/fixtures/templates',
        context_path: 'test/fixtures/context',
        global_context_file : "test/fixures/global.json"
      },
      files:[{
        expand: true,
        cwd: 'test/fixtures/templates',
        src: ['*.html'],
        dest: 'tmp',
        ext: '.html'
      }]
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 0.1.1 09-12-13
* 0.1.0 08-12-13
