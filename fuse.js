const { FuseBox } = require('fuse-box')
const fuse = FuseBox.init({
  homeDir: 'src',
  target: 'browser@es6',
  output: 'js/$name.js',
  useTypescriptCompiler : true,
    log: true,
    debug: true
})

const browser = {
    browser: {
        source: "libs/browser-polyfill.min.js",
        exports: "browser"
    }
}

fuse.bundle('background').instructions(' > background/index.ts').watch()
fuse.bundle('popup').instructions(' > popup/index.ts').watch()
fuse.bundle('result').instructions(' > result/index.ts').watch()
fuse.run()
