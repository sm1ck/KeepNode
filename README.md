# KeepNode
Web3 app for checking status of the Keep nodes.

The idea to create this application came to me when I remembered about Google Page Speed service for checking the status of the site. What I liked the most about it is tips for improving your site and show you how many score have your site.

This app uses abi to access smart contracts and displays information about the operator of your node. Connection to the app goes through MetaMask. You can use it in your browser with the extension or in your smartphone through the native MetaMask app.

The app uses accurate data on the required minimum value of unbonded ETH through sortition pools and accurate data on the required minimum value of stake in delegation.

The project structure is very simple:
- several html files to display site in browser
- main file with application code app.js
- pictures and styles, libraries
- php script for ping a port through a socket

At the moment, this is my first experience of creating decentralized applications, so there may be some errors or inaccuracies. You can report them via Issue.

Author: Herobrine#1852

Screenshots:

<img src="img/screenshots/screen4.png?raw=true" width="400"/><br>
<img src="img/screenshots/screen1.png?raw=true" width="400"/><br>
<img src="img/screenshots/screen2.png?raw=true" width="400"/><br>
<img src="img/screenshots/screen3.png?raw=true" width="400"/><br>
