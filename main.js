const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, Menu, BrowserWindow, ipcMain } = electron;

let MainWindow;
let AddWindow;

process.env.NODE_ENV = 'production';

// Listen for the app to be ready
app.on('ready', () => {
    //create new Window
    MainWindow = new BrowserWindow({
        webPreferences:{
            nodeIntegration: true
        }
    });

    //Load Html in to the window
    MainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'MainWindow.html'),
        slashes: true,
        protocol: "file:"
    }));

    //Quiit Main App on close
    MainWindow.on("closed", () => {
        app.quit();
    });

    //Build Menu From Template
    const MainMenu = Menu.buildFromTemplate(MainMenuTemplate);

    //Insert Menu
    MainWindow.setMenu(MainMenu);
});


function CreateAddWindow() {
    AddWindow = new BrowserWindow({
        height: 200,
        width: 300,
        title: 'Add Item',
        webPreferences:{
            nodeIntegration: true
        }
    });

    AddWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'AddWindow.html'),
        protocol: "file:",
        slashes: true
    }));
}

ipcMain.on('Item:add',(e,item)=>{
    MainWindow.webContents.send('item:add',item);
    AddWindow.close();
})


const MainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    CreateAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click(){
                    MainWindow.webContents.send('Item:Clear')
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'command+Q' : 'ctrl+Q',
                click() {
                    app.quit()
                }
            }
        ]
    }
]

if (process.platform == 'darwin') {
    MainMenuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    MainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'command+I' : 'ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}