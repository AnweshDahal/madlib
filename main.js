// importing the electron modules
const electron = require("electron");




// importing the url module
const url = require("url");

// importing the path module
const path = require("path");

// importing objects from electron module
const {app, BrowserWindow, Menu, ipcMain} = electron;

// SET ENV
// process.env.NODE_ENV = 'development';

// variables to hold the windows
let mainWindow;
let formWindow;
let resultWindow;


// Listen for the app to be ready
app.on('ready',function(){
    mainWindow = new BrowserWindow({
        // enabling node integration as the newer version of node.js doesnot suport thsi
        webPreferences:{
            nodeIntegration: true
        },
        frame: false
    });
    // load the HTML file in the window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "mainWindow.html"),
        protocol: "file",
        slashes: true
    }));
    // Quit app on close
    mainWindow.on('closed', function(){
        app.quit();
    })
    // Custom Menu
    // Build Menu From Template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
    
});

// Catch homebutton:click
ipcMain.on('homebutton:click', function (e, item) {
    var htmlname = item + '.html';
    console.log("catched homebutton:click");
    createFormWindow(htmlname);
});


// Handel form window
function createFormWindow(htmlname){
    // Create form window
    formWindow = new BrowserWindow({
        title: 'Fill the Blanks',
        webPreferences: {
            nodeIntegration: true
        },
        frame: false
    });
    // load the HTML file into the window
    formWindow.loadURL(url.format({
        pathname: path.join(__dirname, htmlname),
        protocol: 'file',
        slashes: true
    }));
    // Garbage Collections Handel 
    formWindow.on('close', function(){
        formWindow = null;
    })
}

// catch blank values
ipcMain.on('blankvalues', function (e, item, name) {
    createResultWindow(name, item);
});

function createResultWindow(htmlname, item){
    resultWindow = new BrowserWindow({
        title: "Paragraph",
        webPreferences: {
            nodeIntegration: true
        },
        frame: false
    });

    resultWindow.loadURL(url.format({
        pathname: path.join(__dirname, htmlname),
        protocol: 'file',
        slashes: true
    }));

    resultWindow.webContents.on('did-finish-load', function(){
        resultWindow.webContents.send('blankValues', item);
    })
    // Garbage Collection
    resultWindow.on('close', function(){
        resultWindow = null;
    })
}
// create Menu Template
const mainMenuTemplate =[
    {
        label: 'File',
        submenu:[
            {
                label: 'Quit',
                accelerator: process.platfom == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
]

// Add developer tools item if the app is in production
if(process.env.NODE_ENV != 'production'){
    // adds to the end of the list
    mainMenuTemplate.push(
        {
            label: 'Developer Tools',
            submenu:[
                {
                    // toggle dev tools
                    label: 'Toggle DevTools',
                    accelerator: process.platfrom == 'darwin' ? 'Command+I' : 'Ctrl+I',
                    click(item, focusedWindow){
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    // add quick reload
                    role: 'reload'
                }
            ]
        },
    );
};