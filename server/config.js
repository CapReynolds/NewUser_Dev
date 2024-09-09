const config = {
    index: {
        port: 5000,
        local: 'http://localhost:',
        consoleMsg: 'Listening on Port ',
        //for production
		// SingleUserScript: '.\\Scripts\\Prod_SingleUser_Final.ps1 ',
		// MultiUserScript: '.\\Scripts\\Prod_MultiUsers.ps1 ',
        // AllADUsersScript: '.\\Scripts\\Prod_AllADUsers.ps1 ',
        // LockoutScript: '.\\Scripts\\Prod_Lockout.ps1 ',
        // UnlockScript: '.\\Scripts\\Prod_UnlockAccount.ps1 ',
        // ExcelPath: '.\\Template\\import_template.xlsm'
        //for development
        SingleUserScript: 'C:\\Users\\avernon\\Documents\\Projects\\NewUser_DEV\\server\\Scripts\\Prod_SingleUser.ps1',
		MultiUserScript: 'C:\\Users\\avernon\\Documents\\Projects\\NewUser_DEV\\server\\Scripts\\Prod_MultiUsers.ps1 ',
        AllADUsersScript: 'C:\\Users\\avernon\\Documents\\Projects\\NewUser_DEV\\server\\Scripts\\Prod_AllADUsers.ps1',
        LockoutScript: 'C:\\Users\\avernon\\Documents\\Projects\\NewUser_DEV\\server\\Scripts\\Prod_Lockout.ps1 ',
        UnlockScript: 'C:\\Users\\avernon\\Documents\\Projects\\NewUser_DEV\\server\\Scripts\\Prod_UnlockAccount.ps1 ',
        ExcelPath: 'C:\\Users\\avernon\\Documents\\Projects\\NewUser_DEV\\server\\Scripts\\import_template.xlsm',
        SingleDisableScript: 'C:\\Users\\avernon\\Documents\\Projects\\NewUser_DEV\\server\\Scripts\\Prod_Disable.ps1',
        MultiisableScript: 'C:\\Users\\avernon\\Documents\\Projects\\NewUser_DEV\\server\\Scripts\\Prod_MultiDisable.ps1',
        AccountInfoScript:'C:\\Users\\avernon\\Documents\\Projects\\NewUser_DEV\\server\\Scripts\\Prod_GetUser.ps1'
    }
}

module.exports = config;