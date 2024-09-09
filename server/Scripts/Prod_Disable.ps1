param(
	$accountName
)

#------------------------------------------------------------------------------------------------
#VARIABLES
$date = Get-Date -Format "MM/dd/yyyy"
# $imgPath = "..\public\assets\it_notifications.png"
$imgPath = "C:\Users\avernon\Documents\Projects\NewUser_DEV\public\assets\it_notifications.png"
$logMachinePath = "\\maestro\group3\exchange\newhirescript\Logs"
$csvExportPath = "\\maestro\group3\exchange\newhirescript\Logs\Exports"
$DisabledMultiUserCSV = "DisabledSingleUser.csv"
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

function ExportUser
{
	param
  (
    $flag,
	$userInfo
  )
	try {
		
		$date = Get-Date -Format "MM/dd/yyyy h:mm tt"
		$userInfo | Add-Member -MemberType NoteProperty -Name 'Date' -Value $date

		if(Test-Path $csvExportPath){
			if(Test-Path $csvExportPath\$DisabledMultiUserCSV){
				$null = New-PSDrive Logging -PSProvider FileSystem -Root $csvExportPath 
				$userInfo | Export-Csv Logging:\$DisabledMultiUserCSV -NoTypeInformation -Append
			}
			else {
				$null = New-PSDrive Logging -PSProvider FileSystem -Root $csvExportPath 
				$userInfo | Export-Csv Logging:\$DisabledMultiUserCSV -NoTypeInformation 
			}
			
		}
		else{
			$null = New-PSDrive Logging -PSProvider FileSystem -Root $logMachinePath 
			$null2 = New-Item Logging:\Exports -ItemType Directory
			$userInfo | Export-Csv Logging:\Exports\$DisabledMultiUserCSV -NoTypeInformation -Append
		}
		
		Remove-PSDrive Logging
		
		
		#Send Success Email
		SendEmail $flag $userInfo
		Write-Host "Success All users disabled"
	}
  catch  {
	$flag = "error"
	$msg = "Error Issue exporting these users $_"
	SendEmail $flag $msg
	Write-Host "Error Issue exporting the user $_"
	exit
  }
}

function SendEmail
{
	param
	(
		$statusFlag, 
		$userInfo,
		$msg
	)
  
	#Variables
	$accountName = $userInfo.userName
	$allUserGroups =  $userInfo.userGroups
	#Set Subject line based on status flag
	if($statusFlag -eq "success"){
		$subject = "Account Disabled"
		$groupArr = $allUserGroups -split ' '
		$tableData = @();

		forEach($group in $groupArr){
			$tableData += "<tr><td>$group</td></tr>"
		}
		#Send an email to the team of either a successful account creation or account failure
		#Set bodyhtml
		$bodyHTML = @"
<html>
	<body>
		<center><img style="display: block; margin: 0 auto;" src="cid:it_notifications.png" alt="it_notifications"></center>
		<p style="font-family:Calibri, sans-serif; font-size:12pt">DTG,</p>
		<p style="font-family:Calibri, sans-serif; font-size:12pt"> The account: $accountName has been removed from the below groups: </p>
		<table>
			<th>AD Groups</th>
			$tableData
		</table>
		<p style="font-family:Calibri, sans-serif; font-size:12pt">Thank you,<br>Marvel IT</p>
	</body>
</html>
"@
	}
	else {
		$subject = "Error Disabling Account"
		$bodyHTML = @"
<html>
	<body>
		<center><img style="display: block; margin: 0 auto;" src="cid:it_notifications.png" alt="it_notifications"></center>
		<p style="font-family:Calibri, sans-serif; font-size:12pt">DTG,</p>
		<p style="font-family:Calibri, sans-serif; font-size:12pt"> The account: $accountName was not disabled: </p>
				<p style="font-family:Calibri, sans-serif; font-size:12pt"> Error Message: $msg </p>
		<p style="font-family:Calibri, sans-serif; font-size:12pt">Thank you,<br>Marvel IT</p>
	</body>
</html>
"@
	 }
  
	#Send an email to DTG of the success or failure depending on the flag
	try { 

		#$names = 'Troy Abed Shirley Dean Britta Annie Pierce'
		
		$mailProps = @{
			To= $desktopGroup
			From= "DisabledAccount@marvel.com"
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
	  #To FIX Out-File -FilePath .\Logs\Error_NewUser.txt -NoClobber -append -inputobject $msg 
	}
	
	#exit
}

function LogMsg {
	param(
		[Parameter(Mandatory)]
		$flag,
		$userInfo
	)
	
	if($flag -eq "success")
	{
		Write-Host "Success Account successfully disabled!"
	}
	else{
		Write-Host "Error Account not disabled. "
	}
	
	ExportUser $flag $userInfo 
	#SendEmail  $flag $accountName $allGroups
}

Try {
	
	$userDistinguishedName = (GET-ADUser -Identity $accountName -Properties DistinguishedName | Select-Object DistinguishedName).DistinguishedName
	$allGroups = (GET-ADUSER -Identity $accountName -Properties MemberOf | Select-Object MemberOf).MemberOf
	$userDescription = (GET-ADUser -Identity $accountName -Properties Description | Select-Object Description).Description
	
	
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
	
	$flag = "success"
	$userDetails = new-object psobject -property @{userName=$accountName; userGroups=$allGroups; status="Success: Disabled"}

	LogMsg $flag $userDetails
}
catch {
	#Send Error Message
	$flag = "error"
	$userDetails = new-object psobject -property @{userName=$accountName; userGroups=$allGroups; status="Error: Not Disabled"}
	LogMsg $flag $userDetails
	Write-Host "Error Acount not disabled.. $_"
	exit
}