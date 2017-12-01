<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
}

//secure this file
include("Functions.php");
session_start();
$function = new DatabaseClasses;

    if (isset($_GET['kill-session'])){
        print_r(session_destroy());
    }

	if(isset($_GET['chkConnection'])){
		print_r($function->chkConnection());
	}

	if(isset($_GET['chkUserLogin'])){
		if(isset($_SESSION['kaboom']))
			print_r($_SESSION['kaboom']);
		else
			print_r("0");
	}

	if(isset($_GET['restoreTablesFromFile'])){
		$data = $_POST['data'];
		print_r($data);
		$query = $function->PDO($data);
		if($query->execute()){
			echo 1;
		}
		else{
			echo 0;
		}
	}

	if(isset($_GET['login'])){
		$data = $_POST['data'];
		$email = $data[0]['value'];
		$password = $data[1]['value'];
		$date = new DateTime();
		$hash = $date->getTimestamp();
		$account = 0;

		$query = $function->PDO("SELECT * FROM tbl_account WHERE email = '{$email}'");
		if(count($query)>0){
			if($function->testPassword($password,$query[0][2]) && ($query[0][5] == 1)){
				$_SESSION["uhack"] = [$email,$password,$hash];

				if($query[0][4]==1)
					$account = 'head';
				else if($query[0][4]==2)
					$account = 'rd';
				else
					$account = 'rm';					

				print_r(json_encode(["Active",$account]));
			}
			else if($function->testPassword($password,$query[0][3]) && ($query[0][5] == 2)){
				print_r(json_encode(["Deactivated",1]));
			}
			else{
				print_r(json_encode(["Failed",2]));
			}
		}
		else{
			print_r(json_encode(["Failed",2]));
		}
	}

	if(isset($_GET['marketLogin'])){
		$data = $_POST['data'];
		$username = $data[0]['value'];
		$password = $data[1]['value'];
		$date = new DateTime();
		$hash = $date->getTimestamp();

		$query = $function->PDO("SELECT * FROM tbl_employee WHERE employee_id = '{$username}'");
		if(count($query)>0){
			if($function->testPassword($password,$query[0][14]) && ($query[0][15] == 1)){
				$_SESSION["kaboom"] = [$username,$password,$hash];
				print_r("Active");
			}
			else{
				print_r("Deactivated");				
			}
		}
		else{
			echo 0;
		}
	}

    if(isset($_GET['validateEmail'])){
        $data = $_POST['data'];
		$count = 0;
        $query = $function->PDO("SELECT count(*) FROM tbl_account WHERE email = '{$data}'");
		$count = $count + $query[0][0];
		print_r($count);
    }

	if(isset($_GET['validateBrand'])){
		$data = $_POST['data'];
		$count = 0;
		$query = $function->PDO("SELECT count(*) FROM tbl_brand WHERE brandName = '{$data}'");
		$count = $count + $query[0][0];
		print_r($count);
	}

	if(isset($_GET['validateCompanyPoints'])){
		$data = $_POST['data'];
		$data = explode("-", $data);
		// print_r($data[0]);
		$query = $function->PDO("SELECT * FROM tbl_pointbalance WHERE id = '{$data[0]}'");
		if(count($query)>0){
			print_r($query[0][1]);
		}
		else{
			echo 0;
		}
	}

	//getters
		if(isset($_GET['get-account'])){
			$query = $function->PDO("SELECT * FROM tbl_account as a INNER JOIN tbl_retailbankinghead as b ON a.email = b.email WHERE a.email = '{$_SESSION['uhack'][0]}'");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-allRD'])){
			$query = $function->PDO("SELECT * FROM tbl_regionaldirector");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-allRM'])){
			$query = $function->PDO("SELECT * FROM tbl_relationshipmanager");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-RM'])){
			$data = $_POST['data'];
			$query = $function->PDO("SELECT * FROM tbl_relationshipmanager WHERE id = '{$data}'");
			print_r(json_encode($query[0]));
		}

		if(isset($_GET['get-salesRM'])){
			$data = $_POST['data'];
			$query = $function->PDO("SELECT * FROM tbl_sale WHERE rm_id = '{$data}'");
			print_r(json_encode($query));
		}		

		if(isset($_GET['get-allClient'])){
			$query = $function->PDO("SELECT * FROM tbl_customer");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-allPlans'])){
			$query = $function->PDO("SELECT * FROM tbl_plan");
			print_r(json_encode($query));
		}

		if(isset($_GET['get-allBranch'])){
			$query = $function->PDO("SELECT * FROM tbl_branch");
			print_r(json_encode($query));
		}

	//setters
		if(isset($_GET['set-newRD'])){
	        $id = $function->PDO_IDGenerator('tbl_account','id');
			$date = $function->PDO_DateAndTime();
			$data = $_POST['data'];
			$password = $function->password($data[8]['value']);

			print_r($data);
			$query = $function->PDO("INSERT INTO tbl_regionaldirector(id,given_name,middle_name,family_name,date_of_birth,gender,address,email,contact_number,branch_id,picture,status,date_registered) VALUES ('{$id}','{$data[0]['value']}','{$data[1]['value']}','{$data[2]['value']}','{$data[3]['value']}','{$data[4]['value']}','{$data[5]['value']}','{$data[7]['value']}','{$data[6]['value']}','branch','avatar.png','1','{$date}'); INSERT INTO tbl_account(id,email,password,account_id,category,status) VALUES ('{$id}','{$data[7]['value']}','{$password}','{$id}',2,1);");
			if($query->execute()){
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newRM'])){
	        $id = $function->PDO_IDGenerator('tbl_account','id');
			$date = $function->PDO_DateAndTime();
			$data = $_POST['data'];
			$password = $function->password($data[8]['value']);

			$query = $function->PDO("INSERT INTO tbl_relationshipmanager(id,given_name,middle_name,family_name,date_of_birth,gender,address,email,contact_number,branch_id,picture,status,date_registered) VALUES ('{$id}','{$data[0]['value']}','{$data[1]['value']}','{$data[2]['value']}','{$data[3]['value']}','{$data[4]['value']}','{$data[5]['value']}','{$data[7]['value']}','{$data[6]['value']}','branch','avatar.png','1','{$date}'); INSERT INTO tbl_account(id,email,password,account_id,category,status) VALUES ('{$id}','{$data[7]['value']}','{$password}','{$id}',3,1);");
			if($query->execute()){
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newClient'])){
	        $id = $function->PDO_IDGenerator('tbl_customer','id');
			$date = $function->PDO_DateAndTime();
			$data = $_POST['data'];

			$query = $function->PDO("INSERT INTO tbl_customer(id,given_name,middle_name,family_name,date_of_birth,gender,address,email,contact_number,occupation,picture,status,date_registered) VALUES ('{$id}','{$data[0]['value']}','{$data[1]['value']}','{$data[2]['value']}','{$data[3]['value']}','{$data[4]['value']}','{$data[5]['value']}','{$data[6]['value']}','{$data[7]['value']}','{$data[8]['value']}','avatar.png','1','{$date}');");
			if($query->execute()){
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newPlan'])){
	        $id = $function->PDO_IDGenerator('tbl_plan','id');
			$date = $function->PDO_DateAndTime();
			$data = $_POST['data'];
			print_r($data);
			$query = $function->PDO("INSERT INTO tbl_plan(id,title,description,price) VALUES ('{$id}','{$data[0]['value']}','{$data[1]['value']}','{$data[2]['value']}');");
			if($query->execute()){
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newBranch'])){
	        $id = $function->PDO_IDGenerator('tbl_branch','id');
			$date = $function->PDO_DateAndTime();
			$data = $_POST['data'];
			$query = $function->PDO("INSERT INTO tbl_branch(id,branch_name,branch_location) VALUES ('{$id}','{$data[0]['value']}','{$data[1]['value']}');");
			if($query->execute()){
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

    // update
		if(isset($_GET['update-admin'])){
			$data = $_POST['data'];
			$user = $function->getAdmin();
			$session = $_SESSION['kaboom'];
			if($data[0]['name'] == "field_Name"){
				$name = $data[0]['value'];
				$query = $function->PDO("UPDATE tbl_admin SET name = '{$name}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Name is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[0]['name'] == "field_Email"){
				$email = $data[0]['value'];
				$query = $function->PDO("UPDATE tbl_admin SET email = '{$email}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Email Updated","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[0]['name'] == "field_Username"){
				$username = $data[0]['value'];
				$query = $function->PDO("UPDATE tbl_admin SET username = '{$username}' WHERE id = '{$user}';");
				if($query->execute()){
					$_SESSION["kaboom"] = [$username,$session[1],$session[2]];
					$log = $function->log2($user,"Username Updated","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[0]['name'] == "field_Password"){
				$password = $function->password($data[0]['value']);
				$query = $function->PDO("UPDATE tbl_admin SET password = '{$password}' WHERE id = '{$user}';");
				if($query->execute()){
					$_SESSION["kaboom"] = [$session[0],$password,$session[2]];
					$log = $function->log2($user,"Password updated","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-adminPicture'])){
			$data = $_POST['data'];
			$user = $function->getAdmin();

			$session = $_SESSION['kaboom'];
			$picture = $function->saveImage($user,$data[1]);
			$query = $function->PDO("UPDATE tbl_admin SET picture = '{$picture}' WHERE id = '{$user}';");
			if($query->execute()){
				$log = $function->log2($user,"Picture is updated to {$picture}.","Update");
				echo 1;
			}
			else{
				unlink('../images/profile/'.$picture);
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['update-company'])){
			$data = $_POST['data'];
			$user = $data[0];

			if($data[1][0]['name'] == "field_Name"){
				$name = $data[1][0]['value'];
				$query = $function->PDO("UPDATE tbl_company SET company_name = '{$name}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Name is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Email"){
				$email = $data[1][0]['value'];
				$query = $function->PDO("UPDATE tbl_company SET email = '{$email}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Email is updated to {$email}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Address"){
				$address = $data[1][0]['value'];
				$query = $function->PDO("UPDATE tbl_company SET address = '{$address}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"address is updated to {$address}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Phone"){
				$phone = $data[1][0]['value'];
				$query = $function->PDO("UPDATE tbl_company SET contact_number = '{$phone}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Phone is updated to {$phone}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-employer'])){
			$data = $_POST['data'];
			$user = $data[0];

			if($data[1][0]['name'] == "field_Name"){
				$name = $data[1][0]['value'];
				$query = $function->PDO("UPDATE tbl_employer SET name = '{$name}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Name is updated to {$name}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Email"){
				$email = $data[1][0]['value'];
				$query = $function->PDO("UPDATE tbl_employer SET email = '{$email}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Email is updated to {$email}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Username"){
				$username = $data[1][0]['value'];
				$query = $function->PDO("UPDATE tbl_employer SET username = '{$username}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Username is updated to {$username}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Phone"){
				$phone = $data[1][0]['value'];
				$query = $function->PDO("UPDATE tbl_employer SET constact_number = '{$phone}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Phone is updated to {$phone}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-employerProfile'])){
			$data = $_POST['data'];
			$user = $data[0];
			$session = $_SESSION['kaboom'];
			// print_r($data);
			// print_r($session);

			if($data[1][0]['name'] == "field_Username"){
				$username = $data[1][0]['value'];
				$query = $function->PDO("UPDATE tbl_employer SET username = '{$username}' WHERE id = '{$user}';");
				if($query->execute()){
					$_SESSION["kaboom"] = [$username,$session[1],$session[2]];
					$log = $function->log2($user,"Username is updated to {$username}.","Update");
					echo 1;
				}                         
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Password"){
				$password = $function->password($data[1][0]['value']);
				$query = $function->PDO("UPDATE tbl_employer SET password = '{$password}' WHERE id = '{$user}';");
				if($query->execute()){
					$_SESSION["kaboom"] = [$session[0],$password,$session[2]];
					$log = $function->log2($user,"Password updated","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}

		if(isset($_GET['update-employerPicture'])){
			$data = $_POST['data'];
			$user = $data[0];

			$picture = $function->saveImage($user,$data[1]);
			$query = $function->PDO("UPDATE tbl_employer SET picture = '{$picture}' WHERE id = '{$user}';");
			if($query->execute()){
				$log = $function->log2($user,"Picture is updated to {$picture}.","Update");
				echo 1;
			}
			else{
				unlink('../images/profile/'.$picture);
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['update-employerCompanyLogo'])){
			$data = $_POST['data'];
			$user = $data[0];

			$picture = $function->saveImage($user,$data[1]);
			$query = $function->PDO("UPDATE tbl_company SET 	logo = '{$picture}' WHERE id = '{$user}';");
			if($query->execute()){
				$log = $function->log2($user,"Logo is updated to {$picture}.","Update");
				echo 1;
			}
			else{
				unlink('../images/profile/'.$picture);
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['update-employee'])){
			$data = $_POST['data'];
			$user = $data[0];
			// print_r($data);

			if($data[1][0]['name'] == "field_gname"){
				$query = $function->PDO("UPDATE tbl_employee SET family_name = '{$data[1][2]['value']}', given_name = '{$data[1][0]['value']}', middle_name = '{$data[1][1]['value']}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Name is updated to {$data[1][0]['value']} {$data[1][1]['value']} {$data[1][2]['value']}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Nickname"){
				$nickname = $data[1][0]['value'];
				$query = $function->PDO("UPDATE tbl_employee SET nickname = '{$nickname}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Nickname is updated to {$nickname}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Position"){
				$position = $data[1][0]['value'];
				$query = $function->PDO("UPDATE tbl_employee SET position = '{$position}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Position is updated to {$position}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Phone"){
				$phone = $data[1][0]['value'];
				$query = $function->PDO("UPDATE tbl_employee SET contact_number = '{$phone}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Phone is updated to {$phone}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Email"){
				$email = $data[1][0]['value'];
				$query = $function->PDO("UPDATE tbl_employee SET email = '{$email}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Email is updated to {$email}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Address"){
				$address = $data[1][0]['value'];
				$query = $function->PDO("UPDATE tbl_employee SET address = '{$address}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Address is updated to {$address}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Gender"){
				$gender = $data[1][0]['value'];
				$query = $function->PDO("UPDATE tbl_employee SET gender = '{$gender}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Gender is updated to {$gender}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_dob"){
				$date_of_birth = $data[1][0]['value'];
				$query = $function->PDO("UPDATE tbl_employee SET date_of_birth = '{$date_of_birth}' WHERE id = '{$user}';");
				if($query->execute()){
					$log = $function->log2($user,"Gender is updated to {$date_of_birth}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}
		
		if(isset($_GET['update-employeePicture'])){
			$data = $_POST['data'];
			$user = $data[0];

			$picture = $function->saveImage($user,$data[1]);
			$query = $function->PDO("UPDATE tbl_employee SET picture = '{$picture}' WHERE id = '{$user}';");
			if($query->execute()){
				$log = $function->log2($user,"Picture is updated to {$picture}.","Update");
				echo 1;
			}
			else{
				unlink('../images/profile/'.$picture);
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['update-requestEmployee'])){
			$data = $_POST['data'];
			$user = $data[0];
	        $id = $function->PDO_IDGenerator('tbl_request','id');
			$date = $function->PDO_DateAndTime();

			if($data[1][0]['name'] == "field_gname"){
				$value = json_encode([$data[1][2]['value'],$data[1][0]['value'],$data[1][1]['value']]);
				$value = $function->escape($value);
				$query = $function->PDO("INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Update Employee Account','{$user}','Admin',{$value},'Name','0','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to update employee account");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Nickname"){
				$value =  $function->escape($data[1][0]['value']);
				$query = $function->PDO("INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Update Employee Account','{$user}','Admin',{$value},'Nickname','0','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to update employee account");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Position"){
				$value =  $function->escape($data[1][0]['value']);
				$query = $function->PDO("INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Update Employee Account','{$user}','Admin',{$value},'Position','0','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to update employee account");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Phone"){
				$value =  $function->escape($data[1][0]['value']);
				$query = $function->PDO("INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Update Employee Account','{$user}','Admin',{$value},'Contact Number','0','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to update employee account");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Email"){
				$value =  $function->escape($data[1][0]['value']);
				$query = $function->PDO("INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Update Employee Account','{$user}','Admin',{$value},'Email','0','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to update employee account");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Address"){
				$value =  $function->escape($data[1][0]['value']);
				$query = $function->PDO("INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Update Employee Account','{$user}','Admin',{$value},'Address','0','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to update employee account");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Gender"){
				$value =  $function->escape($data[1][0]['value']);
				$query = $function->PDO("INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Update Employee Account','{$user}','Admin',{$value},'Gender','0','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to update employee account");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_dob"){
				$value =  $function->escape($data[1][0]['value']);
				$query = $function->PDO("INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Update Employee Account','{$user}','Admin',{$value},'Date of Birth','0','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to update employee account");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_Password"){
				$session = $_SESSION['kaboom'];
				$password = $function->password($data[1][0]['value']);
				$query = $function->PDO("UPDATE tbl_employee SET password = '{$password}' WHERE id = '{$user}';");
				if($query->execute()){
					$_SESSION["kaboom"] = [$session[0],$password,$session[2]];
					$log = $function->log2($user,"Password updated","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}
		
		if(isset($_GET['update-requestEmployeePicture'])){
			$data = $_POST['data'];
			$user = $data[0];
	        $id = $function->PDO_IDGenerator('tbl_request','id');
			$date = $function->PDO_DateAndTime();

			$picture = $function->saveImage($user,$data[1]);
			$query = $function->PDO("INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Update Employee Account','{$user}','Admin','{$picture}','Profile Picture','0','{$date}')");
			if($query->execute()){
				$log = $function->log("request",$user,"Request to update employee account");
				echo 1;
			}
			else{
				unlink('../images/profile/'.$picture);
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['update-product'])){
			$data = $_POST['data'];
			$id = $data[0];

			if($data[1][0]['name'] == "field_product"){
				$query = $function->PDO("UPDATE tbl_product SET product_name = '{$data[1][0]['value']}' WHERE id = '{$id}';");
				if($query->execute()){
					$log = $function->log2($id,"Product name is updated to {$data[1][0]['value']}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_price"){
				$query = $function->PDO("UPDATE tbl_product SET price = '{$data[1][0]['value']}' WHERE id = '{$id}';");
				if($query->execute()){
					$log = $function->log2($id,"Product price is updated to {$data[1][0]['value']}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_qty"){
				$query = $function->PDO("UPDATE tbl_product SET qty = '{$data[1][0]['value']}' WHERE id = '{$id}';");
				if($query->execute()){
					$log = $function->log2($id,"Product SKU is updated to {$data[1][0]['value']}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_categories"){
				$query = $function->PDO("UPDATE tbl_product SET category = '{$data[1][0]['value']}' WHERE id = '{$id}';");
				if($query->execute()){
					$log = $function->log2($id,"Product categories are updated to {$data[1][0]['value']}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_description"){
				$query = $function->PDO("UPDATE tbl_product SET description = '{$data[1][0]['value']}' WHERE id = '{$id}';");
				if($query->execute()){
					$log = $function->log2($id,"Product description are updated to {$data[1][0]['value']}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else if($data[1][0]['name'] == "field_status"){
				$query = $function->PDO("UPDATE tbl_product SET status = '{$data[1][0]['value']}' WHERE id = '{$id}';");
				if($query->execute()){
					$log = $function->log2($id,"Product status is updated to {$data[1][0]['value']}.","Update");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
		}
		
		if(isset($_GET['update-productPicture'])){
			$data = $_POST['data'];
			$id = $data[0];

			$picture = $function->saveProductImage($id,$data[1]);
			$query = $function->PDO("UPDATE tbl_product SET picture = '{$picture}' WHERE id = '{$id}';");
			if($query->execute()){
				$log = $function->log2($id,"Product picture is updated to {$picture}.","Update");
				echo 1;
			}
			else{
				unlink('../images/products/'.$picture);
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['update-wishlist'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();

			$query = $function->PDO("UPDATE tbl_product SET status = '0' WHERE id = '{$id}';");
			if($query->execute()){
				$log = $function->log2($id,"Removed wishlist with an id of '{$id}","Wishlist");
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['update-removeWishlist'])){
			$data = $_POST['data'];
			$query = $function->PDO("DELETE FROM `tbl_wishlist` WHERE id = '{$data}';");
			if($query->execute()){
				$log = $function->log2($data,"Removed wishlist with an id of '{$data}","Wishlist");
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['update-orderStatus'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
			$query = $function->PDO("UPDATE tbl_orders SET status = '{$data[1]}' WHERE id = '{$data[0]}';");
			if($query->execute()){
				$log = $function->log2($data[0],"Updated order with an id of '{$data[0]}'","Orders");
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

	    // activate account
		    if(isset($_GET['activate-admin'])){
				$user = $function->getUser();
		    	$data = $_POST['data'];
				$query = $function->PDO("UPDATE tbl_admin SET status = '1' WHERE id = '{$data}';");
				if($query->execute()){
					$log = $function->log2($user,"Activating admin account","Active");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		    if(isset($_GET['delete-admin'])){
				$user = $function->getUser();
		    	$data = $_POST['data'];
				$query = $function->PDO("DELETE FROM tbl_admin WHERE id = '{$data}';");
				if($query->execute()){
					$log = $function->log2($user,"Removing admin account","Delete");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		    if(isset($_GET['activate-employer'])){
				$user = $function->getUser();
		    	$data = $_POST['data'];
				$query = $function->PDO("UPDATE tbl_employer SET status = '1' WHERE id = '{$data}';");
				if($query->execute()){
					$log = $function->log2($user,"Activating admin account","Active");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		    if(isset($_GET['activate-employee'])){
				$user = $function->getUser();
		    	$data = $_POST['data'];
				$query = $function->PDO("UPDATE tbl_employee SET status = '1' WHERE id = '{$data}';");
				if($query->execute()){
					$log = $function->log2($user,"Activating employee account","Active");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		    if(isset($_GET['request-activate-employee'])){
				$data = $_POST['data'];
		        $id = $function->PDO_IDGenerator('tbl_request','id');
				$date = $function->PDO_DateAndTime();
				$user = $function->getUser();
				$employee_id = $data[0];

				$query = $function->PDO("INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Deactivate Employee','{$user}','{$employee_id}','1','{$data[1]}','1','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to activate employee ".$employee_id);
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

	    // de-activate account
		    if(isset($_GET['deactivate-admin'])){
				$user = $function->getUser();
		    	$data = $_POST['data'];
				$query = $function->PDO("UPDATE tbl_admin SET status = '0' WHERE id = '{$data[0]}';");
				if($query->execute()){
					$log = $function->log2($user,$data[1],"Deactivate");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		    if(isset($_GET['deactivate-employer'])){
				$user = $function->getUser();
		    	$data = $_POST['data'];
				$remarks = json_encode($data);
				$query = $function->PDO("UPDATE tbl_employer SET status = '0' WHERE id = '{$data[0]}';");
				if($query->execute()){
					$log = $function->log2($user,$remarks,"Deactivate");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		    if(isset($_GET['deactivate-employee'])){
				$user = $function->getUser();
		    	$data = $_POST['data'];
				$remarks = json_encode($data);
				$query = $function->PDO("UPDATE tbl_employee SET status = '0' WHERE id = '{$data[0]}';");
				if($query->execute()){
					$log = $function->log2($user,$remarks,"Deactivate");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		    if(isset($_GET['request-deactivate-employee'])){
				$data = $_POST['data'];
		        $id = $function->PDO_IDGenerator('tbl_request','id');
				$date = $function->PDO_DateAndTime();
				$user = $function->getUser();
				$employee_id = $data[0];

				$query = $function->PDO("INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Deactivate Employee','{$user}','{$employee_id}','0','{$data[1]}','1','{$date}')");
				if($query->execute()){
					$log = $function->log("request",$user,"Request to deactivate employee ".$employee_id);
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		// request

		   	/*
				status code:
					0. pending
					1. accepted
					2. declined
					3. invisible
		   	*/

			if(isset($_GET['get-requestAccountUpdate'])){
				$data = $_POST['data'];
				$account = [];
				$requests = [];
				$val = [];
				$q1 = $function->PDO("SELECT DISTINCT(request_by) FROM tbl_request LIMIT {$data[1]}, {$data[0]}");
				foreach ($q1 as $i => $v) {
					$account = $function->PDO("SELECT * FROM tbl_employee WHERE id = '{$v[0]}'");
					$requests = $function->PDO("SELECT * FROM tbl_request WHERE request_by = '{$v[0]}' AND header = 'Update Employee Account' AND status = 0");
					if(count($requests)>0){
						$val[] = [$account[0],$requests];
					}
				}
				print_r(json_encode($val));
			}

			if(isset($_GET['get-requestPoints'])){
				$data = $_POST['data'];
				$account = [];
				$requests = [];
				$val = [];
				$q1 = $function->PDO("SELECT DISTINCT(request_to) FROM tbl_request LIMIT {$data[1]}, {$data[0]}");
				foreach ($q1 as $i => $v) {
					$account = $function->PDO("SELECT * FROM tbl_employee WHERE id = '{$v[0]}'");
					$requests = $function->PDO("SELECT * FROM tbl_request WHERE request_to = '{$v[0]}' AND header = 'Add Points' AND status = 0");
					if(count($requests)>0){
						$val[] = [$account[0],$requests];
					}
				}
				print_r(json_encode($val));
			}

		    if(isset($_GET['request-approve'])){
		    	$data = $_POST['data'];
				$q1 = $function->PDO("SELECT * FROM tbl_request WHERE id = '{$data['request']}'");
		    	if($q1[0][5] == 'Name'){
		    		$names = json_decode($q1[0][4]);
		    		$id = $q1[0][2];
					$query = $function->PDO("UPDATE tbl_employee SET family_name = '{$names[0]}', given_name = '{$names[1]}', middle_name = '{$names[2]}' WHERE id = '{$id}'; UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
					if($query->execute()){
						$log = $function->log2($id,"Name has been changed.","Accepted Request");
						echo 1;
					}
					else{
						$Data = $query->errorInfo();
						print_r($Data);
					}
		    	}
		    	else if($q1[0][5] == 'Nickname'){
		    		$value = $q1[0][4];
		    		$id = $q1[0][2];
					$query = $function->PDO("UPDATE tbl_employee SET nickname = '{$value}' WHERE id = '{$id}'; UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
					if($query->execute()){
						$log = $function->log2($id,"Nickname has been changed.","Accepted Request");
						echo 1;
					}
					else{
						$Data = $query->errorInfo();
						print_r($Data);
					}
		    	}
		    	else if($q1[0][5] == 'Position'){
		    		$value = $q1[0][4];
		    		$id = $q1[0][2];
					$query = $function->PDO("UPDATE tbl_employee SET 	position = '{$value}' WHERE id = '{$id}'; UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
					if($query->execute()){
						$log = $function->log2($id,"Position has been changed.","Accepted Request");
						echo 1;
					}
					else{
						$Data = $query->errorInfo();
						print_r($Data);
					}
		    	}
		    	else if($q1[0][5] == 'Contact Number'){
		    		$value = $q1[0][4];
		    		$id = $q1[0][2];
					$query = $function->PDO("UPDATE tbl_employee SET contact_number = '{$value}' WHERE id = '{$id}'; UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
					if($query->execute()){
						$log = $function->log2($id,"Contact Number has been changed.","Accepted Request");
						echo 1;
					}
					else{
						$Data = $query->errorInfo();
						print_r($Data);
					}
		    	}
		    	else if($q1[0][5] == 'Date of Birth'){
		    		$value = $q1[0][4];
		    		$id = $q1[0][2];
					$query = $function->PDO("UPDATE tbl_employee SET date_of_birth = '{$value}' WHERE id = '{$id}'; UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
					if($query->execute()){
						$log = $function->log2($id,"Date  of birth has been changed.","Accepted Request");
						echo 1;
					}
					else{
						$Data = $query->errorInfo();
						print_r($Data);
					}
		    	}
		    	else if($q1[0][5] == 'Email'){
		    		$value = $q1[0][4];
		    		$id = $q1[0][2];
					$query = $function->PDO("UPDATE tbl_employee SET email = '{$value}' WHERE id = '{$id}'; UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
					if($query->execute()){
						$log = $function->log2($id,"Email has been changed.","Accepted Request");
						echo 1;
					}
					else{
						$Data = $query->errorInfo();
						print_r($Data);
					}
		    	}
		    	else if($q1[0][5] == 'Address'){
		    		$value = $q1[0][4];
		    		$id = $q1[0][2];
					$query = $function->PDO("UPDATE tbl_employee SET 	address = '{$value}' WHERE id = '{$id}'; UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
					if($query->execute()){
						$log = $function->log2($id,"Address has been changed.","Accepted Request");
						echo 1;
					}
					else{
						$Data = $query->errorInfo();
						print_r($Data);
					}
		    	}
		    	else if($q1[0][5] == 'Gender'){
		    		$value = $q1[0][4];
		    		$id = $q1[0][2];
					$query = $function->PDO("UPDATE tbl_employee SET 	gender = '{$value}' WHERE id = '{$id}'; UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
					if($query->execute()){
						$log = $function->log2($id,"Gender has been changed.","Accepted Request");
						echo 1;
					}
					else{
						$Data = $query->errorInfo();
						print_r($Data);
					}
		    	}
		    	else if($q1[0][5] == 'Profile Picture'){
		    		$value = $q1[0][4];
		    		$id = $q1[0][2];
					$query = $function->PDO("UPDATE tbl_employee SET picture = '{$value}' WHERE id = '{$id}'; UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
					if($query->execute()){
						$log = $function->log2($id,"Picture has been changed.","Accepted Request");
						echo 1;
					}
					else{
						$Data = $query->errorInfo();
						print_r($Data);
					}
		    	}
		    }

		    if(isset($_GET['request-cancel'])){
		    	// print_r($q1);
		    	$data = $_POST['data'];
	    		$id = $data['node'];
				$query = $function->PDO("UPDATE tbl_request SET status = '2' WHERE id = '{$data['request']}';");
				if($query->execute()){
						$log = $function->log2($id,"Request to change has been cancelled.","Cancelled Request");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		    if(isset($_GET['request-approvePoints'])){
		    	$data = $_POST['data'];
				$date = $function->PDO_DateAndTime();
				$quantity = $function->PDO("SELECT COUNT(*) FROM tbl_pointsactivity");
				$q1 = $function->PDO("SELECT * FROM tbl_request WHERE id = '{$data['request']}'");
				$count = $quantity[0][0];
				$employee_id = $data['node'];
				$points = (int)$q1[0][4];
				$currentPoints = $function->PDO("SELECT * FROM tbl_points WHERE id = '{$employee_id}';");
				$newpoints = $currentPoints[0][2]+$points;
		        $id = $currentPoints[0][3].'-'.($count+1);

				$query = $function->PDO("UPDATE tbl_points SET points = '{$newpoints}' WHERE id = '{$employee_id}' AND company_id = '{$currentPoints[0][3]}'; INSERT INTO tbl_pointsactivity(id,points,addedby,employee_id,`date`,remarks) VALUES('{$id}','{$points}','admin','{$currentPoints[0][1]}','{$date}','No remarks'); UPDATE tbl_request SET status = '1' WHERE id = '{$data['request']}';");
				if($query->execute()){
					$log = $function->log2($employee_id,"Points has been added.","Points Request");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		    if(isset($_GET['request-cancelPoints'])){
		    	$data = $_POST['data'];
				$employee_id = $data['node'];
				$q1 = $function->PDO("SELECT * FROM tbl_request WHERE id = '{$data['request']}'");
				$q2 = $function->PDO("SELECT * FROM tbl_points WHERE id = '{$employee_id}';"); // just to get comany id
				$company_id = $q2[0][3];
				$queryPointBalance = $function->PDO("SELECT * FROM tbl_pointbalance WHERE id = '{$company_id}'");
		    	$newBalance = (int)$q1[0][4] + (int)($queryPointBalance[0][1]);

				$query = $function->PDO("UPDATE tbl_pointbalance SET balance = '{$newBalance}' WHERE id = '{$company_id}'; UPDATE tbl_request SET status = '2' WHERE id = '{$data['request']}';");
				if($query->execute()){
					$log = $function->log2($employee_id,"Points has been added.","Points Request");
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
		    }

		// recover account

			if(isset($_GET['email-code'])){
		    	$data = $_POST['data'];
				$id = $function->PDO_IDGenerator('tbl_forgotpassword','id');
				$date = $function->PDO_DateAndTime();
				$x = new DateTime();
				$data = $function->escape($_POST['data']);
				$code = substr(sha1($x->getTimestamp()),0,8);

				$subject = 'Forgot password';
				$message = "Here is your forgot password code: {$code}. Disregard this email if you haven't request for password recovery";

				$query = $function->PDO("SELECT COUNT(*) FROM tbl_forgotpassword WHERE email = {$data}");
				if($query[0][0]>0){
					$query = $function->PDO("DELETE FROM tbl_forgotpassword WHERE email = {$data}");
					if($query->execute()){
						$queryRecovery = $function->PDO("INSERT INTO tbl_forgotpassword(id,email,code,`date`) VALUES ('{$id}',{$data},'{$code}','{$date}')");
						if($queryRecovery->execute()){
					        $result = mail($_POST['data'],$subject,$message);
					        print_r($result);
						}
						else{
							$Data = $queryRecovery->errorInfo();
							print_r($Data);
						}
					}
				}
				else{
					$queryRecovery = $function->PDO("INSERT INTO tbl_forgotpassword(id,email,code,`date`) VALUES ('{$id}',{$data},'{$code}','{$date}')");
					if($queryRecovery->execute()){
				        $result = mail($_POST['data'],$subject,$message);
				        print_r($result);
					}
					else{
						$Data = $queryRecovery->errorInfo();
						print_r($Data);
					}
				}
			}

			if(isset($_GET['validate-code'])){
		    	$data = $_POST['data'];
		    	$data = $function->escape($_POST['data']);
				$query = $function->PDO("SELECT COUNT(*) FROM tbl_forgotpassword WHERE code = {$data}");

				print_r($query[0][0]);
			}

			if(isset($_GET['recover-password'])){
		    	$data = $_POST['data'];
				$query = $function->PDO("SELECT email FROM tbl_forgotpassword WHERE code = '{$data[1]}'");
				$email = $query[0][0];
				$password = $function->password($data[0]);
				$id = "";

				$queryAdmin = $function->PDO("SELECT id FROM tbl_admin WHERE email = '{$email}'");
				$queryEmployer = $function->PDO("SELECT id FROM tbl_employer WHERE email = '{$email}'");
				$queryEmployee = $function->PDO("SELECT id FROM tbl_employee WHERE email = '{$email}'");

				if(count($queryAdmin)>0){
					$id = $queryAdmin[0][0];
					$queryRecover = $function->PDO("UPDATE tbl_admin SET password = '{$password}' WHERE id = '{$id}'");
				}
				else if(count($queryEmployer)>0){
					$id = $queryEmployer[0][0];
					$queryRecover = $function->PDO("UPDATE tbl_employer SET password = '{$password}' WHERE id = '{$id}'");
				}
				else if(count($queryEmployee)>0){
					$id = $queryEmployee[0][0];
					$queryRecover = $function->PDO("UPDATE tbl_employee SET password = '{$password}' WHERE id = '{$id}'");
				}


				if($queryRecover->execute()){
					$log = $function->log2($id,"Account has been recovered.","Account recovered.");
					$query = $function->PDO("DELETE FROM tbl_forgotpassword WHERE code = '{$data[1]}'");
					$query->execute();
					echo 1;
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}

    //backups
	    if(isset($_GET['buckup-db'])){
			$db = $function->db_buckup();
	    	// print_r($db);
	        $file = sha1('rufongabrillojr').'-'.time().'.sql';
	        $handle = fopen('../db/'.$file, 'w+');

	        if(fwrite($handle, $db)){
	        	fclose($handle);
	        	print_r(json_encode([1,$file]));
	        }
	    }	

	    if(isset($_GET['get-dbFiles'])){
	    	$dir = '../db';$_files = [];$data = "";
			$files = array_diff(scandir($dir), array('..', '.'));
			foreach ($files as $i => $v){
				$data = stat($dir."/".$v);
				$data = date("F j, Y",$data['mtime']);
				$_files[] = [$v,$data];
			}
			// print_r($_files);
			print_r(json_encode($_files));
	    }
	    
	    if(isset($_GET['send-mail'])){
	    	$data = $_POST['data'];
	        $receiver = $data[0];
	        $subject =  $data[1];
	        $message = $data[2];

	        $result = $function->mailTemplate("{$receiver}, rufo.gabrillo@gmail.com, info@rnrdigitalconsultancy.com",$subject,$message);
	        print_r($result);
	    }
?>

