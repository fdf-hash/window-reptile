const { spawn } = require('child_process');
const { ipcMain  } = require('electron');

ipcMain.on('start-exe', (event, savePath) => {
    // 启动应用程序的命令和参数
    const command = savePath;
    const args = [];
    // 创建一个子进程来启动应用程序
    const appProcess = spawn(command, args);

    // 输出启动日志
    appProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        event.reply('start-exe', true);
    });

    // 输出错误日志
    appProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        event.reply('start-exe', false);
    });

    // 监听进程退出事件
    appProcess.on('close', (code) => {
        console.log(`子进程退出，退出码 ${code}`);
    });
});