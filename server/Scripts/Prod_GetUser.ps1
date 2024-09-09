param(
	$accountName
)

#------------------------------------------------------------------------------------------------
#VARIABLES

#Get AD User Account
#$testUser="nfury"



Try{
    #$displayName = (Get-ADUser -Identity $accountName -Properties Name | Select-Object Name).Name
    #Write-Host $displayName
    Get-ADUser -Identity $accountName -Properties Name, Enabled | Select-Object Name, Enabled | ConvertTo-JSON
}
catch{
    Write-Host "NOT FOUND"
}