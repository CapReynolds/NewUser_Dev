const config = {
    index: {
        port: 5000,
        local: 'http://localhost:',
        consoleMsg: 'Listening on Port ',
        //for production
	 SingleUserScript: '.\\Scripts\\Prod_SingleUser_Final.ps1 ',
	 MultiUserScript: '.\\Scripts\\Prod_MultiUsers.ps1 ',
         AllADUsersScript: '.\\Scripts\\Prod_AllADUsers.ps1 ',
         LockoutScript: '.\\Scripts\\Prod_Lockout.ps1 ',
         UnlockScript: '.\\Scripts\\Prod_UnlockAccount.ps1 ',
         ExcelPath: '.\\Template\\import_template.xlsm'
    }
}

module.exports = config;
