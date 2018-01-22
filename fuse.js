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

fuse.bundle('background').shim(browser).instructions(' > background/index.ts').watch()
fuse.bundle('popup').shim(browser).instructions(' > popup/index.ts').watch()
fuse.bundle('result').shim(browser).instructions(' > result/index.ts').watch()
fuse.run()
