param (
    $name
)

#Credentials for accessing AD
#$username = 'newhirescript'
#$password = ''


#$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
#$credential = New-Object System.Management.Automation.PSCredential $username, $securePassword

Get-ADUser -Filter 'Name -like $name' -Property Name, PasswordLastSet, accountexpirationdate, accountexpires, lockedout, SAMAccountName | Select-Object -Property Name, @{Name="PasswordLastSet"; Expression={$_.PasswordLastSet.ToString("MM-dd-yyyy")}}, accountexpirationdate, accountexpires, lockedout, SAMAccountName | ConvertTo-JSON

#Get-ADUser -Filter 'Name -like $name' -properties accountexpirationdate, PasswordLastSet, accountexpires, lockedout | ConvertTo-JSON