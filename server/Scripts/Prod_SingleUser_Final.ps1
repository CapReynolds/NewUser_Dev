param(
	$firstName,
	$lastName,
	$title,
	$legalEntity,
	$state,
	$supervisor,
	$department,
	$email,
	$computer,
	$gender,
	$accountStatus, 
	$pernr_start,
	$vpn_Groups,
	$okta_Groups,
	$username_passed,
	$pass,
	$authType,
	$loggedUser
)

<#
Enter-PSSession -ComputerName vernon-alcott -Credential $credential
& 'E:\inetpub\wwwroot\WebSite\CORP-NewUserScript\build\Scripts\test2.ps1' -Credential $credential

Exit-PSSession
Write-Host "This is the last username: "$env:username "on Computer: " $env:ComputerName "on Domain: "$env:UserDomain
#>

<#
Invoke-Command -ComputerName vernon-alcott -Credential $credential -ScriptBlock {
 param (
	$firstName,
	$lastName,
	$startDate,
	$title,
	$legalEntity,
	$state,
	$supervisor,
	$department,
	$email,
	$computer,
	$gender,
	$accountStatus,
	$credential
 )#>


#------------------------------------------------------------------------------------------------
#VARIABLES
#$desktopGroup = "avernon@marvel.com"
$desktopGroup = "NY-DesktopSupport@marvel.com"
$errorLogPath = "Error_SingleUserLog.txt"
$successLogPath = "Success_SingleUser.txt"
$testLogPath = "Test_Log.txt"
$newHireFolder = "\\maestro\group3\exchange\newhirescript"
$logMachinePath = "\\maestro\group3\exchange\newhirescript\Logs"
$csvExportPath = "\\maestro\group3\exchange\newhirescript\Logs\Exports"
$CreatedUsercsv = "CreatedUser.csv"
$newUser = @()
$flag = "success"
$imgPath = "..\public\assets\it_notifications.png"
$usrPassword = "AmazingFantasy15!"

#Credentials for accessing AD
$username = 'newhirescript'
$password = 'Th3Inf!n!tyGauntl3t&St0n3s%'


$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential $username, $securePassword
#------------------------------------------------------------------------------------------------


#Functions

function SetUser
{
	param(
		$firstName,
		$lastName,
		$startDate,
		$title,
		$legalEntity,
		$state,
		$supervisor,
		$department,
		$email,
		$computer,
		$gender,
		$accountStatus,
		$pernr_start,
		$vpn_Groups,
		$okta_Groups
	)
	try {
		
		$pernrNum, $startDate = $pernr_start -split ":"
		
		$newUserObj += [pscustomobject] @{
				firstName = $firstName
				lastName = $lastName 
				startDate = $startDate
				title = $title
				legalEntity = $legalEntity
				stateFull = $state
				supervisor = $supervisor
				displayName = $lastName + ", " + $firstName
				department = If($accountStatus -eq "full" -OR $accountStatus -eq "nm-marvel") {$department} Else {"Temp Users-Users"}
				description = If ($state -eq "California" -AND $department -ne "Disney") {"LA - " +  $department.split("-")[0] +" "+ $department.split("-")[1]} ElseIf ($state -eq "California" -AND $department -eq "Disney") {"LA - " + $department} ElseIf ($state -eq "California" -AND $department -ne "Disney") {"LA - " +  $department.split("-")[0] +" " + $department.split("-")[1]} ElseIf ($state -eq "California" -AND $department -eq "Disney") {"LA - " + $department} ElseIf ($state -eq "New York" -AND $department -ne "Disney") {"NY - " +  $department.split("-")[0] +" "+ $department.split("-")[1]} Else {"NY - " + $department}
				computer = $computer
				gender = $gender
				info = $email
				accountStatus = $accountStatus
				status = ""
				msg = ""
				pernr = If ($pernrNum){$pernrNum} Else {""}
				vpnGroups = If ($vpn_Groups){$vpn_Groups} Else {""}
				oktaGroups = If ($okta_Groups){$okta_Groups} Else {""}
			}

		return $newUserObj
	}
	catch{
		$flag = "failure"
		$msg = "Failure to set user"
		
		#Log the error and skip this user in the loop
		LogUsr $usr $flag $msg
		Write-Host "Error Account not created. Failure to set user properties"
		exit
	}

}

function AddtoGroups
{
	param
	(
		[Parameter(Mandatory)]
		$usrObj
	)
	
	try{
		
		#Get the username, computer choice, gender, state
		$newUsername = $usrObj.userName
		$machine = $usrObj.computer
		$usrGender = $usrObj.gender
		$userState = $usrObj.stateFull
		$userStatus = $usrObj.accountStatus
		$groups =@()
		
		If($usrObj.vpnGroups){
			$userVPNGroups = $usrObj.vpnGroups.Split(",")
			
			ForEach ($item in $userVPNGroups){ 
				$groups += $item 			
			}
			
		}
		
		If($usrObj.oktaGroups){
			$userOktaGroups = $usrObj.oktaGroups.Split(",")
			
			ForEach ($item in $userOktaGroups){ 
				$groups += $item 			
			}
		}

		#Set the computer and location group based on location and machine type
		if($userState -eq 'California'){
			$computerGroup = if($machine -eq 'mac') {"All-LA-MAC Users"} else {"all-ny-mac"}
			$locationGroup = "All-Marvel (Grand Central)"
		}
		else{
			$computerGroup = if($machine -eq 'mac') {"all-ny-mac"} else {"all-ny-pc"}
			$locationGroup = "All-Marvel (NY)"
		}
		
		#Set the gender group based on gender
		$genderGroup = if($usrGender -eq 'female') {"NY-All Women"} else {"NY-All Men"}
		
		#Create the groups object
		if($userStatus -eq "temp")
		{
			$groupsToAdd = @('MVL-Phishing-EOL', 'SP-HOME-Visitors', 'WW-PMM Portal', 'NY-Interns', 'APP-TEMP-EMAIL', $computerGroup, $genderGroup, $locationGroup)
		}
		elseif($userStatus -eq "nm-marvel"){
			$groupsToAdd = @('APP-NM-EMAIL', $computerGroup)
		}
		else {
			$groupsToAdd = @('MVL-Phishing-EOL', 'SP-HOME-Visitors', 'WW-PMM Portal', $computerGroup, $genderGroup, $locationGroup)
		}
			
		ForEach ($group in $groupsToAdd){ 
			$groups += $group			
		}
		
		#Add to user groups
		ForEach ($group in $groups){ 
			Add-ADGroupMember -Identity $group -Members $newUsername -Credential $credential 			
		}
	}
	catch {
		$flag = "failure"
		$msg = "Failure to add account to groups $_"
		LogUsr $usrObj $flag $msg
		Write-Host "Error Failure to add account to AD groups"
		exit
	}
}	

function SendEmail
{
	param
	(
		[Parameter(Mandatory)]
		$usrInfo,
		$statusFlag, 
		$msg
	)
  
	#Variables
	#$imgPath = "C:\Users\avernon\Documents\Assets\it_notifications.png"
	$date = Get-Date -Format "MM/dd/yyyy h:mm tt"
	
	#Set Subject line based on status flag
	if($statusFlag -eq "success"){
	  $subject = "New Account Has Been Created"
	}
	else {
		$subject = "Error Creating New Account"
	 }
  
	
  
  
	#Send an email to DTG of the success or failure depending on the flag
	try { 
		#Send an email to the team of either a successful account creation or account failure
		#Set bodyhtml
		$bodyHTML = @"
<html>
	<body>
		<center><img style="display: block; margin: 0 auto;" src="cid:it_notifications.png" alt="it_notifications"></center>
		<p style="font-family:Calibri, sans-serif; font-size:12pt">DTG,</p>
		<p style="font-family:Calibri, sans-serif; font-size:12pt"> $date : $msg</p>
		<p style="font-family:Calibri, sans-serif; font-size:12pt">Thank you,<br>Marvel IT</p>
	</body>
</html>
"@
		$mailProps = @{
			To= $desktopGroup
			From= "NewUserAccount@marvel.com"
			Body= $bodyHTML
			Subject= $subject
			SmtpServer='oci-smtp.marvel.nyc.ent'
			Attachments=$imgPath
		}
		
		Send-MailMessage @mailProps -BodyAsHtml
		Write-Host "Success Account Created!"
	}
	catch {
	  #If an error occurs write the file to an error log
	  Write-Host "Error Sending: " $_
	  #To FIX Out-File -FilePath .\Logs\Error_NewUser.txt -NoClobber -append -inputobject $msg 
	}
	
	#exit
}

function AddAttributes
{
	param
	(
		$usrObj
	)
	
	#variables
	$propList = @(
		'password', 'streetAddress', 'postalCode', 'state', 'city', 'upn', 'email'
	)
	
	$usrObjStateFull = $usrObj.stateFull
	
	if($usrObjStateFull -eq 'California'){
		$userState = "CA"
		$userStateFull = $usrObjStateFull
		$userAddress = "1048 Grand Central Avenue"
		$userPostalCode = "91201"
		$city = "Glendale"
		$descState = "LA"
	}
	else {
		$userState = "NY"
		$userStateFull = $usrObjStateFull
		$userAddress = "1290 Avenue of Americas"
		$userPostalCode = "10104"
		$city = "New York"
		$descState = "NY"
	}
	
	#Replace the hyphen for the department
	#$department = $department -replace '-',' '
	
	$usrObjCopy = [pscustomobject] @{
			password = $usrPassword
			streetAddress = $userAddress
			postalCode = $userPostalCode
			state = $userState
			city = $city
			upn = if($usrObj.accountStatus -eq "full") {$usrObj.username +"@marvel.com"} ElseIf ($usrObj.accountStatus -eq "nm-marvel") {$usrObj.username +"@nm-marvel.com"} Else {$usrObj.username +"@temp-marvel.com"}
			email = if($usrObj.accountStatus -eq "full") {$usrObj.username +"@marvel.com"} ElseIf ($usrObj.accountStatus -eq "nm-marvel") {$usrObj.username +"@nm-marvel.com"} Else {$usrObj.username +"@temp-marvel.com"}
		}
	
	try {
		Foreach ($prop in $propList) {
			$usrObj | Add-Member -MemberType NoteProperty -Name $prop -Value $usrObjCopy.$prop
		} 
	}
	catch{
		$flag = "failure"
		$msg = "Failure to add Attributes"
		#Send email of a failure to add the attributes and create the account
		#SendEmail $usrObj $flag $msg
		LogUsr $usrObj $flag $msg
		Write-Host "Error Account not created. Failure to add attributes"
		exit
	}
	return $usrObj
}

function CreateUsername
{
	param
	(
		$usrObj
	)
	
	#Counter for the initial character in first name, and trim the last name
	$initialCounter = 0
	$lastNameTrimmed = $usrObj.lastName.replace(" ", "").replace("-","")
	
	#Check to see if the username already exists in AD
	$tempUsername = ($usrObj.firstName[0][0] + $lastNameTrimmed).toLower()
	
	$aduser = Get-ADUser -Filter "sAMAccountName -eq '$tempUsername' -or sAMAccountName -eq '$tempUsername'" -Properties givenName, sn, EmailAddress -Credential $credential

	while($aduser -ne $null)
	{
		#Username exists, check if account is the same or if a new username needs to be created
		#Check if first name and last name are the same
		$firstName = $usrObj.firstName
		$lastName = $usrObj.lastName
		
		if(($firstName -eq $aduser.givenName) -and ($lastName -eq $aduser.sn)){
			
			$errorMsg = "Account not created. The user: $tempUsername already exists in Active Directory."
			$flag = "failure"
			
			#log the error and Send an email of that the account is not created, and user already exists in AD
			LogUsr $usrObj $flag $errorMsg
			Write-Host "Error Account not created. The user: $tempUsername already exists in Active Directory."
			exit
		}
		else {
			#Create new username by adding an extra initial from first name and check if it exists
			try {
				$initialCounter++
				$tempUsername = ($firstName.SubString(0, $initialCounter) + $lastNameTrimmed).toLower()
				$aduser = Get-ADUser -Filter "sAMAccountName -eq '$tempUsername' -or sAMAccountName -eq '$tempUsername'" -Properties givenName, sn, EmailAddress -Credential $credential
			}
			catch {
				$flag = "failure"
				$msg = "Error creating username"
				
				LogUsr $usrObj $flag $msg
				Write-Host "Error Account not created. The user: $tempUsername already exists in Active Directory."
				exit
			}
		}
	}	
	
	$usrObj | Add-Member -MemberType NoteProperty -Name 'userName' -Value $tempUsername
	return $usrObj
}

function GetManager
{
	param
	(
		$usrObj
	)
	try {
		#Find the users manager in AD
		#$num = $usrObj.supervisor.split("").count
		#$first = $usrObj.supervisor.split("")[0]
		#$last = $usrObj.supervisor.split("")[$num - 1]
		#$manager = Get-ADUser -Filter "sn -like '$last*' -and givenName -like '$first*'" -Credential $credential

		#New Manager search
		$fullName = $usrObj.supervisor
		
		$manager = Get-ADUser -Filter "Name -like '$fullName'" -Credential $credential
			
		
		$num = $usrObj.supervisor.split(",").count
		$first = $usrObj.supervisor.split(",")[1].Trim()
		$last = $usrObj.supervisor.split(",")[0]
		$tempUsername = ($usrObj.firstName[0][0] + $lastNameTrimmed).toLower()
		
		if($manager -eq $null){
			#Log the failure and send the notification email and break out of the script
			$sup = $usrObj.supervisor
			$acc = $usrObj.username
			$errorMsg = "New account '$tempUsername' not created. Error getting the manager or manager not found - '$manager'"
			
			$flag = "failure"
			LogUsr $usrObj $flag $errorMsg
			Write-Host "Error New account '$tempUsername' not created. Error getting the manager or manager not found - '$manager'"
			exit
		}
		else{
			#Check if multiple managers were grabbed and take the one that matches the original first name
			if($manager.length -gt 0){
				ForEach ($option in $manager){
					if($option.givenName -eq $first){
						$tmp = $option
					}	
				}
				$manager = $tmp 
			}
			#Get the user's manager's path
			$managerPath = $manager.DistinguishedName.split(",",3)[2]
		}

		$managerDN = $manager.DistinguishedName
		$usrObj | Add-Member -MemberType NoteProperty -Name 'ManagerDN' -Value $managerDN
		
		
	}
	catch {
		$flag = "failure"
		$errorMsg = "Error getting the manager, $manager , on the new account $_" 
		LogUsr $newUser $flag $errorMsg
		Write-Host "Error New Account not created, error getting the manager on the new account" 
		exit
	}
}

function GetusrPath
{
	param
	(
		$usrObj
	)
	try {
		#Get the user's department
		$department = $usrObj.department
		
		#Get the user's state
		$state = $usrObj.stateFull
		
		$accountType = $usrObj.accountStatus
		
		#Example $department: Publishing-Advertising Sales
		if($accountType -eq "full"){
		
			$ou1 = "OU=" + $department.split("-")[1] + ","
			$ou2 = "OU=" + $department.split("-")[0] + ","
			
			if($state -eq 'California'){
				$ou3 = $ou1 + $ou2 + "OU=MARVEL-LA,DC=MARVEL,DC=NYC,DC=ENT"
			}
			else{
				$ou3 = $ou1 + $ou2 + "OU=MARVEL-NYC,DC=MARVEL,DC=NYC,DC=ENT"
			}
			
		}
		else {
			if($department -eq "Disney"){
				$ou1 = "OU=Disney,"
				
				if($state -eq 'California'){
					$ou3 = $ou1 + "OU=MARVEL-LA,DC=MARVEL,DC=NYC,DC=ENT"
				}
				else{
					$ou3 = $ou1 + "OU=MARVEL-NYC,DC=MARVEL,DC=NYC,DC=ENT"
				}
			}
			else {
				$ou1 = "OU=Users,OU=TEMP Users,"
				
				if($state -eq 'California'){
					$ou3 = $ou1 + "OU=MARVEL-LA,DC=MARVEL,DC=NYC,DC=ENT"
				}
				else{
					$ou3 = $ou1 + "OU=MARVEL-NYC,DC=MARVEL,DC=NYC,DC=ENT"
				}
			}
		
		}

		$usrDNPath = $ou3
		
		if($usrObj.department -eq "Disney"){
				$usrObj.department = $department
		}
		else{
			<# if($usrObj.accountStatus -eq "temp"){
				$usrObj.department = $usrObj.description
			}
			else {
				$usrObj.department = $department.split("-")[1]
			}#>
			$usrObj.department = $usrObj.description
		}
	
		
		$usrObj | Add-Member -MemberType NoteProperty -Name 'usrDNPath' -Value $usrDNPath
		
		
		return $usrDNPath
		
	}
	catch {
		$flag = "failure"
		$errorMsg = "Error getting the path on the new account" 
		LogUsr $newUser $flag $msg
		Write-Host "Error New Account not created, error getting the path on the new account" 
		exit
	}
}

function AddtoAD
{
	param
	(
		$usrObj,
		$userPath
	)
	
	#End Date for NM Users
	$endDate = (Get-Date).AddMonths(6)
	$endDateString = $endDate.ToString("M/dd/yyyy hh:mm:ss tt")
	
	#Create new AD User
	try{
		if($usrObj.info){
			if($usrObj.department -eq "Disney" -OR $usrObj.accountStatus -eq "nm-marvel"){
				New-ADUser -UserPrincipalName $usrObj.email -SamAccountName $usrObj.username -Name $usrObj.displayName -OtherAttributes @{
					'displayName'=$usrObj.displayName; 
					'givenName'=$usrObj.firstName;
					'sn'=$usrObj.lastName;
					'Title'=$usrObj.title;
					'Department'=$usrObj.department;
					'Description'=$usrObj.description;
					'Manager'=$usrObj.ManagerDN;
					'Company'=$usrObj.legalEntity;
					'physicalDeliveryOfficeName'=$usrObj.city;
					'StreetAddress'=$usrObj.streetAddress;
					'l'=$usrObj.city;
					'st'=$usrObj.state;
					'PostalCode'=$usrObj.postalCode;
					'c'="US";
					'co'="United States";
					'info'=$usrObj.info;
					'CountryCode'="840";
					'adminDescription'="User_NoGalSync";
				} -Type user -Path $userPath -Accountpassword (ConvertTo-SecureString $usrPassword -AsPlainText -Force)  -Enabled $true -Credential $credential
			}
			ElseIf  ($usrObj.accountStatus -eq "temp" -OR $usrObj.accountStatus -eq "full"){
				If ($usrObj.pernr){
					New-ADUser -UserPrincipalName $usrObj.email -SamAccountName $usrObj.username -Name $usrObj.displayName -OtherAttributes @{
						'displayName'=$usrObj.displayName; 
						'givenName'=$usrObj.firstName;
						'sn'=$usrObj.lastName;
						'Title'=$usrObj.title;
						'Department'=$usrObj.department;
						'Description'=$usrObj.description;
						'Manager'=$usrObj.ManagerDN;
						'Company'=$usrObj.legalEntity;
						'physicalDeliveryOfficeName'=$usrObj.city;
						'StreetAddress'=$usrObj.streetAddress;
						'l'=$usrObj.city;
						'st'=$usrObj.state;
						'PostalCode'=$usrObj.postalCode;
						'c'="US";
						'co'="United States";
						'info'=$usrObj.info;
						'CountryCode'="840";
						'extensionAttribute12'="Marvel Entertainment";
						'employeeID'=$usrObj.pernr;
					} -Type user -Path $userPath -Accountpassword (ConvertTo-SecureString $usrPassword -AsPlainText -Force)  -Enabled $true -Credential $credential
				}
				Else{
					New-ADUser -UserPrincipalName $usrObj.email -SamAccountName $usrObj.username -Name $usrObj.displayName -OtherAttributes @{
						'displayName'=$usrObj.displayName; 
						'givenName'=$usrObj.firstName;
						'sn'=$usrObj.lastName;
						'Title'=$usrObj.title;
						'Department'=$usrObj.department;
						'Description'=$usrObj.description;
						'Manager'=$usrObj.ManagerDN;
						'Company'=$usrObj.legalEntity;
						'physicalDeliveryOfficeName'=$usrObj.city;
						'StreetAddress'=$usrObj.streetAddress;
						'l'=$usrObj.city;
						'st'=$usrObj.state;
						'PostalCode'=$usrObj.postalCode;
						'c'="US";
						'co'="United States";
						'info'=$usrObj.info;
						'CountryCode'="840";
						'extensionAttribute12'="Marvel Entertainment";
					} -Type user -Path $userPath -Accountpassword (ConvertTo-SecureString $usrPassword -AsPlainText -Force)  -Enabled $true -Credential $credential
				}
			}
			Else{
				New-ADUser -UserPrincipalName $usrObj.email -SamAccountName $usrObj.username -Name $usrObj.displayName -OtherAttributes @{
					'displayName'=$usrObj.displayName; 
					'givenName'=$usrObj.firstName;
					'sn'=$usrObj.lastName;
					'Title'=$usrObj.title;
					'Department'=$usrObj.department;
					'Description'=$usrObj.description;
					'Manager'=$usrObj.ManagerDN;
					'Company'=$usrObj.legalEntity;
					'physicalDeliveryOfficeName'=$usrObj.city;
					'StreetAddress'=$usrObj.streetAddress;
					'l'=$usrObj.city;
					'st'=$usrObj.state;
					'PostalCode'=$usrObj.postalCode;
					'c'="US";
					'co'="United States";
					'info'=$usrObj.info;
					'CountryCode'="840";
				} -Type user -Path $userPath -Accountpassword (ConvertTo-SecureString $usrPassword -AsPlainText -Force)  -Enabled $true -Credential $credential
			}
		}
		else{
			If($usrObj.department -eq "Disney" -AND $usrObj.accountStatus -eq "nm-marvel"){
				New-ADUser -UserPrincipalName $usrObj.email -SamAccountName $usrObj.username -Name $usrObj.displayName -OtherAttributes @{
					'displayName'=$usrObj.displayName; 
					'givenName'=$usrObj.firstName;
					'sn'=$usrObj.lastName;
					'Title'=$usrObj.title;
					'Department'=$usrObj.department;
					'Description'=$usrObj.description;
					'Manager'=$usrObj.ManagerDN;
					'Company'=$usrObj.legalEntity;
					'physicalDeliveryOfficeName'=$usrObj.city;
					'StreetAddress'=$usrObj.streetAddress;
					'l'=$usrObj.city;
					'st'=$usrObj.state;
					'PostalCode'=$usrObj.postalCode;
					'c'="US";
					'co'="United States";
					'CountryCode'="840";
					'adminDescription'="User_NoGalSync";
				} -Type user -Path $userPath -Accountpassword (ConvertTo-SecureString $usrPassword -AsPlainText -Force)  -Enabled $true -Credential $credential
			}
			ElseIf  ($usrObj.accountStatus -eq "temp" -OR $usrObj.accountStatus -eq "full"){
				if($usrObj.pernr){
					New-ADUser -UserPrincipalName $usrObj.email -SamAccountName $usrObj.username -Name $usrObj.displayName -OtherAttributes @{
						'displayName'=$usrObj.displayName; 
						'givenName'=$usrObj.firstName;
						'sn'=$usrObj.lastName;
						'Title'=$usrObj.title;
						'Department'=$usrObj.department;
						'Description'=$usrObj.description;
						'Manager'=$usrObj.ManagerDN;
						'Company'=$usrObj.legalEntity;
						'physicalDeliveryOfficeName'=$usrObj.city;
						'StreetAddress'=$usrObj.streetAddress;
						'l'=$usrObj.city;
						'st'=$usrObj.state;
						'PostalCode'=$usrObj.postalCode;
						'c'="US";
						'co'="United States";
						'CountryCode'="840";
						'extensionAttribute12'="Marvel Entertainment";
						'employeeID'=$usrObj.pernr;
					} -Type user -Path $userPath -Accountpassword (ConvertTo-SecureString $usrPassword -AsPlainText -Force)  -Enabled $true -Credential $credential
				}
				Else{
					New-ADUser -UserPrincipalName $usrObj.email -SamAccountName $usrObj.username -Name $usrObj.displayName -OtherAttributes @{
						'displayName'=$usrObj.displayName; 
						'givenName'=$usrObj.firstName;
						'sn'=$usrObj.lastName;
						'Title'=$usrObj.title;
						'Department'=$usrObj.department;
						'Description'=$usrObj.description;
						'Manager'=$usrObj.ManagerDN;
						'Company'=$usrObj.legalEntity;
						'physicalDeliveryOfficeName'=$usrObj.city;
						'StreetAddress'=$usrObj.streetAddress;
						'l'=$usrObj.city;
						'st'=$usrObj.state;
						'PostalCode'=$usrObj.postalCode;
						'c'="US";
						'co'="United States";
						'CountryCode'="840";
						'extensionAttribute12'="Marvel Entertainment";
					} -Type user -Path $userPath -Accountpassword (ConvertTo-SecureString $usrPassword -AsPlainText -Force)  -Enabled $true -Credential $credential
				}
				
			}
			Else {
				New-ADUser -UserPrincipalName $usrObj.email -SamAccountName $usrObj.username -Name $usrObj.displayName -OtherAttributes @{
					'displayName'=$usrObj.displayName; 
					'givenName'=$usrObj.firstName;
					'sn'=$usrObj.lastName;
					'Title'=$usrObj.title;
					'Department'=$usrObj.department;
					'Description'=$usrObj.description;
					'Manager'=$usrObj.ManagerDN;
					'Company'=$usrObj.legalEntity;
					'physicalDeliveryOfficeName'=$usrObj.city;
					'StreetAddress'=$usrObj.streetAddress;
					'l'=$usrObj.city;
					'st'=$usrObj.state;
					'PostalCode'=$usrObj.postalCode;
					'c'="US";
					'co'="United States";
					'CountryCode'="840";
				} -Type user -Path $userPath -Accountpassword (ConvertTo-SecureString $usrPassword -AsPlainText -Force)  -Enabled $true -Credential $credential
			}
		}
		
		if($usrObj.accountStatus -eq "nm-marvel"){
			$tempIdentity = $usrObj.userName
			Set-ADAccountExpiration -Identity $tempIdentity -DateTime $endDateString -Credential $credential 
		} 
	}
	catch{
		$flag = "failure"
		$tmpU = $newuser.username
		$errorMsg = "Error creating new user account $tmpU - $_" 
		LogUsr $newUser $flag $errorMsg
		Write-Host "Error Account not created, unable to add the user account $tmpU to AD"
		exit
	} 
}

function LogUsr
{
	param
  (
    [Parameter(Mandatory)]
	$usrObj,
	$logFlag,
	$logMsg
  )
	try{
		$usrObj.status = $logFlag
		
		if($logFlag -eq "success"){
			$logDirectory = $successLogPath
			
			$usrObj.msg = "Account Created"
		}
		else {
			$logDirectory = $errorLogPath
			
			$usrObj.msg = $logMsg
		}
		
		# Log the user account
		#$logMachinePath = '\\blob\exchange\newhirescript\Logs'
		
		if(Test-Path $logMachinePath){
			$null = New-PSDrive Logging -PSProvider FileSystem -Root $logMachinePath -Credential $credential 
			$usrObj | Format-List | Out-File -FilePath Logging:\$logDirectory -Append
		}
		else{
			$null = New-PSDrive Logging -PSProvider FileSystem -Root $newHireFolder -Credential $credential 
			$null2 = New-Item Logging:\Logs -ItemType Directory
			$usrObj | Format-List | Out-File -FilePath Logging:\Logs\$logDirectory -Append
		}
		
		Remove-PSDrive Logging
		
	}
	catch{
		Write-Host "An Error occurred Logging the user $_" $logMsg
	}
}

function ExportUser
{
	param
  (
    [Parameter(Mandatory)]
	$usr
  )
	try {
		$flag = "success"
		$msg = "New user has been created"
		$start = $usr.startDate
		
		LogUsr $usr $flag $msg
		$date = Get-Date -Format "MM/dd/yyyy h:mm tt"
		$usr | Add-Member -MemberType NoteProperty -Name 'Date' -Value $date
		
		# Export CSV of the created user account
		#$csvExportPath = "\\blob\exchange\newhirescript\Logs\Exports"
		
		
		if(Test-Path $csvExportPath){
			$null = New-PSDrive Logging -PSProvider FileSystem -Root $csvExportPath -Credential $credential 
			$usr | Export-Csv Logging:\$CreatedUsercsv -NoTypeInformation -Append
		}
		else{
			$null = New-PSDrive Logging -PSProvider FileSystem -Root $logMachinePath -Credential $credential 
			$null2 = New-Item Logging:\Exports -ItemType Directory
			$usr | Export-Csv Logging:\Exports\$CreatedUsercsv -NoTypeInformation -Append
		}
		
		Remove-PSDrive Logging
		
		
		#Send Success Email
		$newAccount = $usr.userName
		$successMsg = " Account <b>$newAccount</b> has been created. Start Date: <b>$start</b>. Account details are in the csv CreatedUser.csv"
		SendEmail $usr $flag $successMsg
	}
  catch  {
	$flag = "failure"
	$msg = "Error Issue exporting the user $_"
	LogUsr $usr $flag $msg
	Write-Host "Error Issue exporting the user $_"
	exit
  }
}

function LogUsrTest
{
	param
  (
    [Parameter(Mandatory)]
	$firstName,
	$lastName,
	$title,
	$legalEntity,
	$state,
	$supervisor,
	$department,
	$email,
	$computer,
	$gender,
	$accountStatus,
	$pernr_start,
	$vpn_Groups,
	$okta_Groups,
	$logFlag
  )
	try{
		
		$pernrNum, $startDate = $pernr_start -split ":"
		$vpnArray = $vpn_Groups.Split(",")
		$oktaArray = $okta_Groups.Split(",")
		
		$testObj += [pscustomobject] @{
			firstName = $firstName
			lastName = $lastName 
			displayName = $lastName + ", " + $firstName
			title = $title
			legalEntity = $legalEntity
			stateFull = $state
			supervisor = $supervisor
			start = $startDate
			pernrNum = $pernrNum
			pernr_start = $pernr_start
			computer = $computer
			gender = $gender
			info = $email
			accountStatus = $accountStatus
			status = ""
			msg = ""
			vpn_groups = [string]$vpnArray
			okta_groups = [string]$oktaArray
		}
		
		
		if($logFlag -eq "success"){
			$logDirectory = $testLogPath
			
			$testObj.msg = "TEST "
		}
		
		
		# Log the user account
		
		#For truncated output
		
		if(Test-Path $logMachinePath){
			$null = New-PSDrive Logging -PSProvider FileSystem -Root $logMachinePath -Credential $credential 
			$testObj | Format-List | Out-File -FilePath Logging:\$logDirectory -Append
		}
		else{
			$null = New-PSDrive Logging -PSProvider FileSystem -Root $newHireFolder -Credential $credential 
			$null2 = New-Item Logging:\Logs -ItemType Directory
			$testObj | Format-List | Out-File -FilePath Logging:\Logs\$logDirectory -Append
		}
		
		Remove-PSDrive Logging
		
	}
	catch{
		Write-Host "An Error occurred Logging the user in LogTest $_" 
	}
}

try{

	#$flag2 = "success"
	#LogUsrTest $firstName $lastName $title $legalEntity $state $supervisor $department $email $computer $gender $accountStatus $pernr_start $vpnGroups $oktaGroups $flag2
	#Write-Host "About to SetUser"
	#Call SetUser to create a newUser object
	$newUser = SetUser $firstName $lastName $startDate $title $legalEntity $state $supervisor $department $email $computer $gender $accountStatus $pernr_start $vpn_Groups $okta_Groups
	#Write-Host "About to createusername"
	#Call CreateUsername to create a username for the user
	$newUser = CreateUsername $newUser
	#Write-Host "About to add attributes"
	#Call AddAttributes to add attributes to the user 
	$newUser = AddAttributes $newUser
	#Write-Host "About to getmanager"
	#Call GetManager to get the manager and the managers path
	GetManager $newUser
	#Write-Host "About to get usrpath"
	#Call GetusrPath for the user's path
	$usrPath = GetusrPath $newUser
	#Write-Host "About to add to ad"
	#Call AddtoAD to add the account to AD 
	AddtoAD $newUser $usrPath
	#Write-Host "About to call addtoGroups to add to groups"
	#Call AddtoGroups to add account to user groups
	AddtoGroups $newUser
	#Write-Host "About to export user"
	#Call ExportUser to export the new account  
	ExportUser $newUser
	
	
}catch {
	$flag = "error"
	$msg = "An error occurred...somewhere $_"
	Write-Host $msg
	LogUsr $newUser $flag $msg
	Write-Host "An error occurred somewhere creating the account"
	exit
}

	
	
<#
} -ArgumentList $firstName, $lastName, $startDate, $title, $legalEntity, $state, $supervisor, $department, $email, $computer, $gender, $accountStatus, $credential
#>