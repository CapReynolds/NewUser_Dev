param(
	$data
)

#------------------------------------------------------------------------------------------------
#VARIABLES

#Get AD User Account
#$testUser="nfury"
$date = Get-Date -Format "MM/dd/yyyy"
# $imgPath = "..\public\assets\it_notifications.png"
$imgPath = "C:\Users\avernon\Documents\Projects\NewUser_DEV\public\assets\it_notifications.png"
$logMachinePath = "\\maestro\group3\exchange\newhirescript\Logs"
$csvExportPath = "\\maestro\group3\exchange\newhirescript\Logs\Exports"
$DisabledMultiUserCSV = "DisabledMultiUser.csv"
$desktopGroup = "avernon@marvel.com"

<#
#Credentials for accessing AD
$username = ''
$password = ''

#$username = 'newhirescript'
#$password = ''


$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential $username, $securePassword
#>

#FUNCTIONS

function SendEmail
{
	param
	(
		$statusFlag, 
		$allremovedAccounts,
		$msg
	)
  
	#Variables
	
	#Set Subject line based on status flag
	if($statusFlag -eq "success"){
	  $subject = "Disabled Accounts"
	}
	else {
		$subject = "Error Disabling Accounts"
		$bodyHTML = @"
<html>
	<body>
		<center><img style="display: block; margin: 0 auto;" src="cid:it_notifications.png" alt="it_notifications"></center>
		<p style="font-family:Calibri, sans-serif; font-size:12pt">DTG,</p>
		<p style="font-family:Calibri, sans-serif; font-size:12pt"> There was an issue processing the csv list to disable: </p>
		<p style="font-family:Calibri, sans-serif; font-size:12pt"> Error message: $msg </p>
		<p style="font-family:Calibri, sans-serif; font-size:12pt">Thank you,<br>Marvel IT</p>
	</body>
</html>
"@
	 }
  
	#Send an email to DTG of the success or failure depending on the flag
	try { 
		$tableData = @();

		forEach($user in $allremovedAccounts){
			
			$userGroups = $user.userGroups
			$displayname = $user.userName
			$status = $user.status
			
			$tableData += "<tr><td>$displayname</td><td>$status</td></tr>"

			forEach($group in $userGroups){
				$tableData += "<tr><td></td><td></td><td>$group</td></tr>"
			}
		}
		#Send an email to the team of either a successful account creation or account failure
		#Set bodyhtml
		$bodyHTML = @"
<html>
	<body>
		<center><img style="display: block; margin: 0 auto;" src="cid:it_notifications.png" alt="it_notifications"></center>
		<p style="font-family:Calibri, sans-serif; font-size:12pt">DTG,</p>
		<p style="font-family:Calibri, sans-serif; font-size:12pt"> The below accounts have been disabled and removed from the associated groups: </p>
		<table>
            <th>Account Name</th>
			<th>Status</th>
			<th>AD Groups</th>
			$tableData
		</table>
		<p style="font-family:Calibri, sans-serif; font-size:12pt">Thank you,<br>Marvel IT</p>
	</body>
</html>
"@
		$mailProps = @{
			To= $desktopGroup
			From= "DisabledAccounts@marvel.com"
			Body= $bodyHTML
			Subject= $subject
			SmtpServer='oci-smtp.marvel.nyc.ent'
			Attachments=$imgPath
		}
		
		Send-MailMessage @mailProps -BodyAsHtml
		
	}
	catch {
	  #If an error occurs write the file to an error log
	  Write-Host "Error Sending Email: " $_
	  
	}
	
	#exit
}

function LogUsrs {
	param(
		[Parameter(Mandatory)]
		$removedAccounts,
		$flag,
		$msg
	)

	ExportUsers $flag $removedAccounts 
}

function DisableUser {
	param(
		$accountName
	)

	try {
		$userDetails = @()
		
        $allGroups = (GET-ADUSER -Identity $accountName -Properties MemberOf | Select-Object MemberOf).MemberOf
		
		#Check if already disabled
		
        #Remove User Account from Groups
        foreach($group in $allGroups){
                Remove-ADGroupMember -Identity $group -Members $accountName -Confirm:$false
                
        }

        #Disable AD Account
        Disable-ADAccount -Identity $accountName

        #Update AD Account Description
        $date = Get-Date -Format "MM/dd/yyyy"
        Set-ADUser $accountName -Description ("Disabled " + $date  + " - " + $userDescription)

        #Move AD User to Disabled Id'S OU 
        if($userDistinguishedName -Match "Marvel-NYC"){
            Get-ADUser -Identity $accountName | Move-ADObject -TargetPath 'OU=Disabled IDs,OU=MARVEL-NYC,DC=MARVEL,DC=NYC,DC=ENT'
        }
        else{
            Get-ADUser $accountName | Move-ADObject -TargetPath 'OU=Disabled IDs,OU=MARVEL-LA,DC=MARVEL,DC=NYC,DC=ENT'
        }
        

        $userDetails = new-object psobject -property @{userName=$accountName; userGroups=$allGroups; status="Successfully Disabled"}

		return $userDetails
	}
	catch {
		$userDetails = new-object psobject -property @{userName=$accountName; userGroups=$allGroups; status="Error Disabling: $_"}
		return $userDetails
	}
}

function ExportUsers
{
	param
  (
    $flag,
	$allusersRemoved
  )
	try {
		
		$date = Get-Date -Format "MM/dd/yyyy h:mm tt"
		$allusersRemoved | Add-Member -MemberType NoteProperty -Name 'Date' -Value $date

		if(Test-Path $csvExportPath){
			if(Test-Path $csvExportPath\$DisabledMultiUserCSV){
				$null = New-PSDrive Logging -PSProvider FileSystem -Root $csvExportPath 
				$allusersRemoved | Export-Csv Logging:\$DisabledMultiUserCSV -NoTypeInformation -Append
			}
			else {
				$null = New-PSDrive Logging -PSProvider FileSystem -Root $csvExportPath 
				$allusersRemoved | Export-Csv Logging:\$DisabledMultiUserCSV -NoTypeInformation 
			}
			
		}
		else{
			$null = New-PSDrive Logging -PSProvider FileSystem -Root $logMachinePath 
			$null2 = New-Item Logging:\Exports -ItemType Directory
			$allusersRemoved | Export-Csv Logging:\Exports\$DisabledMultiUserCSV -NoTypeInformation -Append
		}
		
		Remove-PSDrive Logging
		
		
		#Send Success Email
		SendEmail $flag $allusersRemoved
		Write-Host "Success All users disabled"
	}
  catch  {
	$flag = "error"
	$msg = "Error Issue exporting these users $_"
	SendEmail $flag $allusersRemoved $msg
	Write-Host "Error Issue exporting the user $_"
	exit
  }
}


Try {
   
    $allaccounts = @()
	$allaccounts2 = @()
    $accountsToRemove = $data -split ","

    foreach($accountName in $accountsToRemove){
        #for each Account on the list
        
		$userDetails = DisableUser $accountName
		$allaccounts2 += $userDetails
		
		
    }

	
	$flag = "success"
	$msg = "Success All accounts are processed"
	#LogUsrs $accountsToRemove $flag $msg
	LogUsrs $allaccounts2 $flag 
    exit
}
catch {
	#Send Error Message
	
	$flag = "error"
	$msg = "An error occurred.. $_"
	#$allaccounts = @()
	SendEmail $accountsToRemove $flag $msg
}