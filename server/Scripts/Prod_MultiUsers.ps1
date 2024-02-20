param(
	$data
)

#------------------------------------------------------------------------------------------------
#VARIABLES
$desktopGroup = "avernon@marvel.com"
$logMachine = 'vernon-alcott'
$userObjects = @()
[System.Collections.ArrayList]$userObjectsList = $userObjects
$logFolderPath = "\\$logMachine\C$\Users\newhirescript\Documents\Scripts\User\CreateUser\Logs"
$errorLogPath = "\\$logMachine\C$\Users\newhirescript\Documents\Scripts\User\CreateUser\Logs\Error_MultiUser.txt"
$successLogPath = "\\$logMachine\C$\Users\newhirescript\Documents\Scripts\User\CreateUser\Logs\Success_MultiUser.txt"
$csvPath = "\\$logMachine\C$\Users\newhirescript\Documents\Scripts\User\CreateUser\Exports\NewAccountsCSV\CreatedUser.csv"
$newUser = @()
$flag = "success"
$logDirectory2 = "\\$logMachine\C$\Users\newhirescript\Documents\Scripts\User\CreateUser\Logs\BlahBlah.txt"
$imgPath = "..\public\assets\it_notifications.png"

#Credentials for AD Access and logging
$username = ''
$password = ''
#$username = 'newhirescript'
#$password = ''

$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential $username, $securePassword
#------------------------------------------------------------------------------------------------


#Functions
function ConvertData
{
	param(
		$users
	)
	
	try {
		
$template = @'
{accountStatus*:full},{firstName:James},{lastName:Rhodes},{title:a title here},{legalEntity:Marvel Entertainment},{state:Washington},{department:Corporate-IT},{supervisor:Steve Rogers},{startDate:11/1/22},{computer:windows},{gender:male},{email:test@yahoo.com}
{accountStatus*:nm-marvel},{firstName:Stephen},{lastName:Strange},{title:a title here},{legalEntity:Marvel Entertainment},{state:Virginia},{department:Publishing-IT},{supervisor:Wong Wong},{startDate:11/1/22},{computer:windows},{gender:male},{email:null}
{accountStatus*:temp},{firstName:Jane},{lastName:Foster},{title:Some Other Title},{legalEntity:Marvel Universe},{state:Mexico},{department:Digital Media-Sales and Distribution},{supervisor:Odin},{startDate:11/2/22},{computer:mac},{gender:female},{email:test2@google.com}
{accountStatus*:temp},{firstName:Jennifer},{lastName:Walters},{title:She-Hulk},{legalEntity:Marvel Entertainment},{state:California},{department:Publishing-Sales and Games},{supervisor:Bruce Banner},{startDate:11/2/22},{computer:windows},{gender:other},{email:test01@yahoo.com}
{accountStatus*:full},{firstName:Jennifer},{lastName:Smith Foster},{title: Superhero},{legalEntity:Marvel Entertainment},{state:New York},{department:Corporate-Finance and Accounting},{supervisor:Johnny Storm},{startDate:9/2/23},{computer:mac},{gender:female},{email:test2@aol.com}
{accountStatus*:nm-marvel},{firstName:Betsy},{lastName:Brandt},{title:Captain Britain},{legalEntity:Marvel Universe},{state:Virginia},{department:Publishing-Productions},{supervisor:Ulysses Claw},{startDate:11/1/22},{computer:mac},{gender:nonconforming},{email:NULL}
'@
		
		#Convert the string data to an usrs object
		$usrs = $users | ConvertFrom-String -TemplateContent $template
		
		return $usrs
	}
	catch {
		$errorMsg = $_
		SendError $errorMsg
		LogError $errorMsg
		#Out-File -FilePath .\Logs\Error_NewUser.txt -NoClobber -append -inputobject $_
		exit
	}
}

function SetUser
{
	param(
		$usr
	)
	try {
		
		$userEmail = $usr.email.toLower() 
		if($usr.state -eq "NY")
		{
			$fullState = "New York"
		}
		else{
			$fullState = "California"
		}
		
		if($userEmail -ne "null"){
			$newUserObj += [pscustomobject] @{
				firstName = $usr.firstName
				lastName = $usr.lastName 
				startDate = $usr.startDate
				title = $usr.title
				legalEntity = $usr.legalEntity
				stateFull = $fullState
				supervisor = $usr.supervisor
				displayName = $usr.lastName + ", " + $usr.firstName
				department = If($usr.accountStatus -eq "full") {$usr.department} Else {"Temp Users-Users"}
				description = If ($fullState -eq "California" -AND $usr.department -ne "Disney") {"LA - " +  $usr.department.split("-")[0] +" "+ $usr.department.split("-")[1]} ElseIf ($fullState -eq "California" -AND $usr.department -eq "Disney") {"LA - " + $usr.department} ElseIf ($fullState -eq "California" -AND $usr.department -ne "Disney") {"LA - " +  $usr.department.split("-")[0] +" " + $usr.department.split("-")[1]} ElseIf ($fullState -eq "California" -AND $usr.department -eq "Disney") {"LA - " + $usr.department} ElseIf ($fullState -eq "New York" -AND $usr.department -ne "Disney") {"NY - " +  $usr.department.split("-")[0] +" "+ $usr.department.split("-")[1]} Else {"NY - " + $usr.department}
				computer = $usr.computer
				gender = $usr.gender
				info = $usr.email
				accountStatus = $usr.accountStatus
				status = ""
				msg = ""
			}
		}
		else{
			$newUserObj += [pscustomobject] @{
				firstName = $usr.firstName
				lastName = $usr.lastName 
				startDate = $usr.startDate
				title = $usr.title
				legalEntity = $usr.legalEntity
				stateFull = $usr.state
				supervisor = $usr.supervisor
				displayName = $usr.lastName + ", " + $usr.firstName
				department = If($usr.accountStatus -eq "full" -OR $usr.accountStatus -eq "nm-marvel") {$usr.department} Else {"Temp Users-Users"}
				description = If ($fullState -eq "California" -AND $usr.department -ne "Disney") {"LA - " +  $usr.department.split("-")[0] +" "+ $usr.department.split("-")[1]} ElseIf ($fullState -eq "California" -AND $usr.department -eq "Disney") {"LA - " + $usr.department} ElseIf ($fullState -eq "California" -AND $usr.department -ne "Disney") {"LA - " +  $usr.department.split("-")[0] +" " + $usr.department.split("-")[1]} ElseIf ($fullState -eq "California" -AND $usr.department -eq "Disney") {"LA - " + $usr.department} ElseIf ($fullState -eq "New York" -AND $usr.department -ne "Disney") {"NY - " +  $usr.department.split("-")[0] +" "+ $usr.department.split("-")[1]} Else {"NY - " + $usr.department}
				computer = $usr.computer
				gender = $usr.gender
				accountStatus = $usr.accountStatus
				status = ""
				msg = ""
			}
		}
	
		return $newUserObj
	}
	catch{
		$flag = "failure"
		$msg = "Failure to set user"
		
		#Log the error and skip this user in the loop
		LogUsr $usr $flag $msg
		continue
	}

}

function LogUsr
{
	param
  (
    [Parameter(Mandatory)]
	$obj,
	$logFlag,
	$logMsg
  )

	if($logFlag -eq "success"){
		$logDirectory = $successLogPath
	}
	else {
		$logDirectory = $errorLogPath
	}
	
	$obj.status = $logFlag
	$obj.msg = $logMsg
	$logFolder = $logFolderPath

	Invoke-Command -ComputerName $logMachine -Credential $credential -ScriptBlock {
		 param (
			$logFolder,
			$logDirectory,
			$obj
		 )
	
		if(Test-Path $logFolder){
			#Out-File -FilePath $logDirectory -NoClobber -append -inputobject $logMsg
			$obj | Format-List | Out-File -FilePath $logDirectory -Append
		}
		else{
			$null = New-Item $logFolder -ItemType Directory
			$obj | Format-List | Out-File -FilePath $logDirectory -Append
			#Out-File -FilePath $logDirectory -NoClobber -append -inputobject $logMsg
		}	 
	
	} -ArgumentList $logFolder, $logDirectory, $obj
	
	#add the user and use void to suppress the return value
	[void]$userObjectsList.add($obj)
	
	
}

function LogError
{
	param
	(
	[Parameter(Mandatory)]
		$logMessage
	)
	
	Invoke-Command -ComputerName $logMachine -Credential $credential -ScriptBlock {
	param(
		$errorLogPath,
		$logMessage
	)
		Out-File -FilePath $errorLogPath -NoClobber -append -inputobject $logMessage 
		
	} -ArgumentList $errorLogPath, $logMessage
	 
}
		
function TrimData
{
	param
	(
		$usrObj
	)

	foreach($prop in $usrObj){
		if(($prop -ne "gender") -and ($prop -ne "info") -and ($prop -ne "department") -and ($prop -ne "displayName") -and ($prop -ne "startDate"))
		{
			$tmp = $usrObj[$prop] -replace ('[^a-zA-Z\d\s:]', '')
			$usrObj[$prop] = $tmp
		}
	}
	return $usrObj 
}

function CreateUsername
{
	param
	(
		$usrObj
	)
	try {
		
		#Counter for the initial character in first name, and trim the last name of any whitespaces
		$initialCounter = 0
		$lastNameTrimmed = $usrObj.lastName.replace(" ", "").replace("-","")
	
		#Check to see if the username already exists in AD
		$tempUsername = ($usrObj.firstName[0][0] + $lastNameTrimmed).toLower()
		$aduser = Get-ADUser -Filter "sAMAccountName -eq '$tempUsername' -or sAMAccountName -eq '$tempUsername'" -Properties givenName, sn, EmailAddress -Credential $credential 
		
		while($aduser -ne $null)
		{
			#Username exists, check if account is the same or if a new username needs to be created
			#Check if first name and last name are the same as the found aduser
			$firstName = $usrObj.firstName
			$lastName = $usrObj.lastName
			
			if(($firstName -eq $aduser.givenName) -and ($lastName -eq $aduser.sn)){
				
				$msg = "Account not created. The user: $tempUsername already exists in Active Directory."
				$flag = "failure"
				
				#Break out of the loop and then log the error on the user
				break
				#exit
			}
			else {
				#Create new username by adding an extra character from first name and check if it exists
				try {
					$initialCounter++
					$tempUsername = ($firstName.SubString(0, $initialCounter) + $lastNameTrimmed).toLower()
					$aduser = Get-ADUser -Filter "sAMAccountName -eq '$tempUsername' -or sAMAccountName -eq '$tempUsername'" -Properties givenName, sn, EmailAddress -Credential $credential 
				}
				catch {
					$flag = "failure"
					$msg = "Error creating username"
					
					#Break out of the loop and then log the error on the user
					break
				}
			}
		}	
		#Add the username as a property on the object
		$usrObj | Add-Member -MemberType NoteProperty -Name 'userName' -Value $tempUsername
		
		#if the flag is a failure log the failure and exit the parent loop, otherwise return the user object
		if($flag -eq "failure")
		{
			LogUsr $usrObj $flag $msg
			continue
		}
		else{
				return $usrObj
		}
		
	}
	catch{
		$flag = "failure"
		$msg = "Failure to create username"
		#Log the error and skip this user in the loop
		LogUsr $usrObj $flag $msg
		continue
	}
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
	
	#If the State is California set the attributes to correspond to that state, otherwise for NY
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
	
	#create a copy of the user object to then assign to the user object
	<#
	if($usrObj.department -eq "Temp Users-Users"){
		$usrObjCopy = [pscustomobject] @{
			password = "newid!01"
			streetAddress = $userAddress
			postalCode = $userPostalCode
			state = $userState
			city = $city
			upn = $usrObj.username +"@temp-marvel.com"
			email = $usrObj.username +"@temp-marvel.com"
		}
	}
	else {
		$usrObjCopy = [pscustomobject] @{
			password = "newid!01"
			streetAddress = $userAddress
			postalCode = $userPostalCode
			state = $userState
			city = $city
			upn = $usrObj.username +"@marvel.com"
			email = $usrObj.username +"@marvel.com"
		}
	}#>
	
	$usrObjCopy = [pscustomobject] @{
			password = "newid!01"
			streetAddress = $userAddress
			postalCode = $userPostalCode
			state = $userState
			city = $city
			upn = if($usrObj.accountStatus -eq "full") {$usrObj.username +"@marvel.com"} ElseIf ($usrObj.accountStatus -eq "nm-marvel") {$usrObj.username +"@nm-marvel.com"} Else {$usrObj.username +"@temp-marvel.com"}
			email = if($usrObj.accountStatus -eq "full") {$usrObj.username +"@marvel.com"} ElseIf ($usrObj.accountStatus -eq "nm-marvel") {$usrObj.username +"@nm-marvel.com"} Else {$usrObj.username +"@temp-marvel.com"}
		}
	
	#Assign the usr object copy to the user obj
	try {
		Foreach ($prop in $propList) {
			$usrObj | Add-Member -MemberType NoteProperty -Name $prop -Value $usrObjCopy.$prop
		} 
	}
	catch{
		$flag = "failure"
		$msg = "Failure to add Attributes"
		#Log the error and skip this user in the loop
		LogUsr $usrObj $flag $msg
		continue
	}
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
		$num = $usrObj.supervisor.split("").count
		$first = $usrObj.supervisor.split("")[0]
		$last = $usrObj.supervisor.split("")[$num - 1]
		$manager = Get-ADUser -Filter "sn -like '$last*' -and givenName -like '$first*'" -Credential $credential 
		
		if($manager -eq $null){
			#Log the failure and send the notification email and break out of the script
			#Write-Host "Error getting the manager or manager not found" -ForegroundColor Green
			$sup = $usrObj.supervisor
			$acc = $usrObj.username
			$errorMsg = "New account $tempUsername not created. Error getting the manager or manager not found - $sup"
			
			$flag = "failure"
			LogUsr $usrObj $flag $errorMsg
			continue
			#Write-Host "Error New account $tempUsername not created. Error getting the manager or manager not found - $sup"
			#exit
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
		
		#Set the Manager DN as a property on the user object
		$managerDN = $manager.DistinguishedName
		$usrObj | Add-Member -MemberType NoteProperty -Name 'ManagerDN' -Value $managerDN
		
	}
	catch {
		$flag = "failure"
		$errorMsg = "Error getting the manager on the new account" 
		#Log the error and skip this user in the loop
		LogUsr $newUser $flag $errorMsg
		continue
		
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
			$ou1 = "OU=" + $department.split("-")[1] + ","
			$ou2 = "OU=" + $department.split("-")[0] + ","
			
			if($state -eq 'California'){
				$ou3 = $ou1 + $ou2 + "OU=MARVEL-LA,DC=MARVEL,DC=NYC,DC=ENT"
			}
			else{
				$ou3 = $ou1 + $ou2 + "OU=MARVEL-NYC,DC=MARVEL,DC=NYC,DC=ENT"
			}
		}
		$usrDNPath = $ou3
		
		#remove after the hyphen ex Publishing-Advertising, dept becomes Advertising
		if($usrObj.department -eq "Disney"){
				$usrObj.department = $department
		}
		else{
			$usrObj.department = $department.split("-")[1]
		}
		
		$usrObj | Add-Member -MemberType NoteProperty -Name 'usrDNPath' -Value $usrDNPath
		
		
		return $usrDNPath
		
	}
	catch {
		$flag = "failure"
		$errorMsg = "Error getting the path on the new account" 
		#Log the error and skip this user in the loop
		LogUsr $newUser $flag $msg
		continue
	}
}

function AddtoAD
{
	param
	(
		$usrObj,
		$userPath
	)
	
	#Create new AD User
	try{
		if($usrObj.info){
			if($usrObj.department -eq "Disney" -AND $usrObj.accountStatus -eq "nm-marvel"){
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
				} -Type user -Path $userPath -Accountpassword (ConvertTo-SecureString "newid!01" -AsPlainText -Force)  -Enabled $true -Credential $credential 
			}
			ElseIf  ($usrObj.accountStatus -eq "temp" -OR $usrObj.accountStatus -eq "full"){
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
				} -Type user -Path $userPath -Accountpassword (ConvertTo-SecureString "newid!01" -AsPlainText -Force)  -Enabled $true -Credential $credential 
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
				} -Type user -Path $userPath -Accountpassword (ConvertTo-SecureString "newid!01" -AsPlainText -Force)  -Enabled $true -Credential $credential 
			}
		}
		else{
			if($usrObj.department -eq "Disney" -AND $usrObj.accountStatus -eq "nm-marvel"){
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
				} -Type user -Path $userPath -Accountpassword (ConvertTo-SecureString "newid!01" -AsPlainText -Force)  -Enabled $true -Credential $credential 
			}
			ElseIf  ($usrObj.accountStatus -eq "temp" -OR $usrObj.accountStatus -eq "full"){
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
				} -Type user -Path $userPath -Accountpassword (ConvertTo-SecureString "newid!01" -AsPlainText -Force)  -Enabled $true -Credential $credential 
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
				} -Type user -Path $userPath -Accountpassword (ConvertTo-SecureString "newid!01" -AsPlainText -Force)  -Enabled $true -Credential $credential 
			}
		}
	}
	catch{
		$flag = "failure"
		$tmpU = $newuser.username
		$errorMsg = "Error creating new user account $tmpU - $_" 
		#Log the error and skip this user in the loop
		LogUsr $newUser $flag $errorMsg
		continue
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
		
		if($userStatus -eq "nm-marvel"){
			$groups = @('APP-NM-EMAIL', 'APP-VPN-HITACHI-HCI', 'NY-VPN Hitachi HCI', 'HCI - End User')
	
		}
		else{
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
			$groups = @('MVL-Phishing-EOL', 'SP-HOME-Visitors', 'WW-PMM Portal', $computerGroup, $genderGroup, $locationGroup)
		}
		#Add to user groups
		ForEach ($group in $groups){ 
			Add-ADGroupMember -Identity $group -Members $newUsername -Credential $credential 
		}
	}
	catch {
		$flag = "failure"
		$msg = "Failure to add account to groups $_"
		#Log the error and skip this user in the loop
		LogUsr $usrObj $flag $msg
		continue
	}
}	

function ExportUser
{
	param
  (
    [Parameter(Mandatory)]
	$newUser
  )
	try {
		$flag = "success"
		$msg = "New user has been created. Account details in the CSV CreatedUser.csv"
		
		Invoke-Command -ComputerName $logMachine -Credential $credential -ScriptBlock {
			 param (
				$newUser,
				$csvPath
			 )
			 
			# Export CSV of the created user account
			$newUser | Export-Csv $csvPath -NoTypeInformation -Append
			 
		} -ArgumentList $newUser, $csvPath

		LogUsr $newUser $flag $msg
	}
  catch  {
	$flag = "failure"
	$msg = "Error exporting the user $_"
	
	#Log the error and skip this user in the loop
	LogUsr $newUser $flag $msg
	continue
	#exit
  }
}

function SendEmail
{
	param
	(
		[Parameter(Mandatory)]
		$allusrs
	)
  
  
	#Variables
	$date = Get-Date -Format "MM/dd/yyyy h:mm tt"
	
	$subject = "New Account Import"
	$count = $userObjectsList.Count 
	$tableData = "<table style = 'border: 1px solid black; width: 100%'>
		<tr>
			<th>Start Date</th>
			<th>Account</th>
			<th>Display Name</th>
			<th>Status</th>
			<th>Message</th>
		</tr>"
		
	Foreach ($user in $userObjectsList) {
		
		$username = $user.userName
		$displayName = if($user.displayName) {$user.displayName} Else {$user.lastName +", "+ $user.firstName}
		$status = $user.status
		$message = $user.msg
		$start = $user.startDate
		
		$tableData += "<tr><td>"+$start+"</td><td>"+$username+"</td><td>"+$displayName+"</td><td><b>"+$status+"</b></td><td>"+$message+"</td></tr>"
		
	}
	
	$tableData += "</tr></table>"
	
	
	#Send an email to DTG of the success or failure depending on the flag
	try { 
		#Send an email to the team of either a successful account creation or account failure
		#Set bodyhtml
		
		$bodyHTML = @"
<html>
	<body>
		<center><img style="display: block; margin: 0 auto;" src="cid:it_notifications.png" alt="it_notifications"></center>
		<p style="font-family:Calibri, sans-serif; font-size:12pt">Hello DTG,</p>
		<p style="font-family:Calibri, sans-serif; font-size:12pt">$date The ($count) below accounts have been submitted for creation:</p>
		<p style="font-family:Calibri, sans-serif; font-size:12pt">$tableData</p>
		<p style="font-family:Calibri, sans-serif; font-size:12pt">Thank you,<br>Marvel IT</p>
	</body>
</html>
"@
		$mailProps = @{
			To= $desktopGroup
			From= "NewUserAccount@marvel.com"
			Body= $bodyHTML
			Subject= $subject
			SmtpServer='smtpny.marvel.nyc.ent'
			Attachments=$imgPath
		}
			
		Send-MailMessage @mailProps -BodyAsHtml
	}
	catch {
	  #If an error occurs write the file to an error log
	  $msg += "An Error occurred sending an email to DTG"
	  LogError $msg
	}
	
}

function SendError
{
	param
	(
		[Parameter(Mandatory)]
		$errMsg
	)
  
  
	#Variables
	$date = Get-Date -Format "MM/dd/yyyy h:mm tt"
	
	$subject = "New User CSV Upload Error"
	
	
	#Send an email to DTG of the success or failure depending on the flag
	try { 
		#Send an email to the team of either a successful account creation or account failure
		#Set bodyhtml
		
		$bodyHTML = @"
<html>
	<body>
		<center><img style="display: block; margin: 0 auto;" src="cid:it_notifications.png" alt="it_notifications"></center>
		<p style="font-family:Calibri, sans-serif; font-size:12pt">Hello DTG,</p>
		<p style="font-family:Calibri, sans-serif; font-size:12pt">$date An error occurred  uploading the CSV.<br> Further details can be found in: Error_NewUser.txt $errMsg</p>
		<p style="font-family:Calibri, sans-serif; font-size:12pt">Thank you,<br>Marvel IT</p>
	</body>
</html>
"@
		$mailProps = @{
			To= $desktopGroup
			From= "NewUserAccount@marvel.com"
			Body= $bodyHTML
			Subject= $subject
			SmtpServer='smtpny.marvel.nyc.ent'
			Attachments=$imgPath
		}
			
		Send-MailMessage @mailProps -BodyAsHtml
		#Write-Host "Email Sent"
	}
	catch {
	  #If an error occurs write the file to an error log
	  $msg += "An Error occurred sending an error email to DTG"
	  LogError $msg
	}
	
}



try{
	
	#Call ConvertData to convert the string into an all user object
	$allUsers = ConvertData $data
	
	foreach($user in $allUsers){
		try{
			#Set the user and properties
			$newUser = SetUser $user
			
			#Trim any excess data
			#$newUser = TrimData $newUser
			
			#Call CreateUsername to create a username for the user
			$newUser = CreateUsername $newUser
		
			#Call AddAttributes to add attributes to the user 
			$newUser = AddAttributes $newUser
		
			#Call GetManager to get the manager and the managers path
			GetManager $newUser
			
			#Call GetusrPath for the user's path
			$usrPath = GetusrPath $newUser
			
			#Call AddtoAD to add the account to AD 
			AddtoAD $newUser $usrPath
			
			#Call AddtoGroups to add account to user groups maybe add status here
			AddtoGroups $newUser
		
			#Call ExportUser to export the new account  
			ExportUser $newUser
			
		}
		catch {
			$flag = "failure"
			#$newUser.status = $flag
			$msg = "An error occurred... $_"
			LogUsr $newUser $flag $msg
		}
	}
	
	SendEmail $userObjectsList
}
catch{
	
	$errorMsg = "Unknown Error $_" 
	SendError $errorMsg
	LogError $errorMsg
}