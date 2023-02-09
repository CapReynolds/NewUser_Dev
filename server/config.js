const config = {
    index: {
        port: 5000,
        local: 'http://localhost:',
        consoleMsg: 'Listening on Port ',
		SingleUserScript: '.\\Scripts\\Prod_SingleUser.ps1 ',
		MultiUserScript: '.\\Scripts\\Prod_MultiUsers.ps1 '
    }
}

module.exports = config;