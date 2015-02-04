module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '// <%= pkg.title %> v<%= pkg.version %>\n' + '//\n' + '// Copyright (c) 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' + '// Distributed under MIT License\n' + '//\n' + '// Documentation and full license available at:\n' + '// <%= pkg.homepage %>\n'
    },
    rig: {
      browser: {
        options: {
          banner: '<%=grunt.config.get("meta").banner%>'
        },
        files: {
          'dist/<%= pkg.name %>.js': ['src/<%= pkg.name %>.js']
        }
      },
      amd: {
        options: {
          banner: '<%=grunt.config.get("meta").banner%>'
        },
        files: {
          'dist/<%= pkg.name %>-amd.js': ['src/<%= pkg.name %>-amd.js']
        }
      }
    },
    uglify: {
      browser: {
        options: {
          banner: '<%=grunt.config.get("meta").banner%>'
        },
        files: {
          'dist/<%= pkg.name %>-min.js': ['dist/<%= pkg.name %>.js']
        }
      },
      amd: {
        options: {
          banner: '<%=grunt.config.get("meta").banner%>'
        },
        files: {
          'dist/<%= pkg.name %>-amd-min.js': ['dist/<%= pkg.name %>-amd.js']
        }
      }
    },
    watch: {
      files: '<%=grunt.config.get("lint").files%>',
      tasks: 'default'
    },
    buster: {
      test: {
        'config': 'buster.js',
        'color': 'none',
        'config-group': 'Browser'
      },
      server: {
        'port': '1111'
      }
    },
    jshint: {
      all: ['grunt.js', 'src/**/*.js', 'tests/**/*.js']
    },
    docco: {
      app: {
        src: ['dist/backbone-validation.js'],
        options: {
          template: 'docco/docco.jst',
          css: 'docco/docco.css',
          output: 'docs/'
        }
      }
    },

    shell: {
      npm: {
        command: 'npm publish',
        options: {
          stdout: true,
          stderr: true
        }
      },
      clone: {
        command: 'git clone git@github.com:thedersen/thedersen.github.com.git',
        options: {
          stdout: true,
          stderr: true
        }
      },
      copyDocco: {
        command: 'cp docs/backbone-validation.html thedersen.github.com/projects/backbone-validation/docs/index.html',
        options: {
          stdout: true,
          stderr: true
        }
      },
      copyCss: {
        command: 'cp docs/docco.css thedersen.github.com/projects/backbone-validation/docs/docco.css',
        options: {
          stdout: true,
          stderr: true
        }
      },
      copyExamples: {
        command: 'cp -rf examples/ thedersen.github.com/projects/backbone-validation/examples/',
        options: {
          stdout: true,
          stderr: true
        }
      },
      push: {
        command: 'git commit -am "Updated docs for Backbone.Validation" && git push origin master',
        options: {
          stdout: true,
          stderr: true,
          execOptions: {
            cwd: 'thedersen.github.com'
          }
        }
      },
      cleanup: {
        command: 'rm -rf thedersen.github.com',
        options: {
          stdout: true,
          stderr: true
        }
      }
    }
  });

  grunt.registerTask('default', ['rig', 'jshint', 'buster', 'uglify']);
  grunt.registerTask('publish', ['docco', 'shell']);

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-buster');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-rigger');
};
