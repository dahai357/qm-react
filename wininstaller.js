var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './target/ordermgr-win32-x64',
    outputDirectory: './target/wininstallers',
    authors: 'My App Inc.',
    exe: 'ordermgr.exe'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));