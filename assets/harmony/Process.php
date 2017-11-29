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
	//setters
		if(isset($_GET['set-newAdmin'])){
	        $id = $function->PDO_IDGenerator('tbl_admin','id');
			$date = $function->PDO_DateAndTime();
			$data = $_POST['data'];

			$password = $function->password($data[3]['value']);

			$query = $function->PDO("INSERT INTO tbl_admin(id,name,username,password,email,status,`date`,capabilities,picture) VALUES ('{$id}','{$data[0]['value']}','{$data[2]['value']}','{$password}','{$data[1]['value']}','1','{$date}','admin','avatar.png')");
			if($query->execute()){
				$log = $function->log("add","admin","Added admin with an ID of ".$id);
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-newProductAdmin'])){
			$data = $_POST['data'];
	        $id = $function->PDO_IDGenerator('tbl_product','id');
			$date = $function->PDO_DateAndTime();

			$user = $function->getAdmin();
			$query = $function->PDO("INSERT INTO tbl_product(id,product_name,qty,price,category,description,picture,brand,status,`date`,addedby,lastupdateby) VALUES ('{$id}','{$data[0]['value']}','{$data[1]['value']}','{$data[2]['value']}','{$data[4]['value']}','{$data[3]['value']}','default.png','{$data[5]['value']}','Published','{$date}','{$user}','{$user}')");
			if($query->execute()){
				$function->log("add",$user,"Added product with an ID of ".$id);
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}	

		if(isset($_GET['set-newClient'])){
			$data = $_POST['data'];
	        $companyID = $function->PDO_IDGenerator('tbl_company','id');
			$date = $function->PDO_DateAndTime();
		    $id = $companyID.'-0';
			$password = $function->password($data[8]['value']);

			$query = $function->PDO("INSERT INTO tbl_company(id,company_name,address,email,contact_number,logo,status,`date`) VALUES ('{$companyID}','{$data[0]['value']}','{$data[3]['value']}','{$data[2]['value']}','{$data[1]['value']}','logo.png','1','{$date}'); INSERT INTO tbl_employer(id,company_id,name,email,constact_number,picture,username,password,status,`date`) VALUES ('{$id}','{$companyID}','{$data[4]['value']}','{$data[6]['value']}','{$data[5]['value']}','avatar.png','{$data[7]['value']}','{$password}','1','{$date}')");
			if($query->execute()){
				$function->log("add","Admin","Added employer with an id of \'".$id."\' in tbl_employer.");
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}	

		if(isset($_GET['set-newEmployee'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
			$user = $data[1];
			$numEmployees = $function->PDO("SELECT COUNT(*) FROM tbl_employee WHERE company_id = '{$user}';");
			$count = $numEmployees[0][0];
		    $id = $user.'-'.($count++);
			$password = $function->password($data[0][11]['value']);
			
			$query = $function->PDO("INSERT INTO tbl_employee(id,employee_id,company_id,family_name,given_name,middle_name,nickname,gender,date_of_birth,contact_number,	email,address,picture,position,password,status,`date`) VALUES ('{$id}','{$data[0][10]['value']}','{$user}','{$data[0][2]['value']}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][3]['value']}','{$data[0][5]['value']}','{$data[0][4]['value']}','{$data[0][7]['value']}','{$data[0][8]['value']}','{$data[0][6]['value']}','avatar.png','{$data[0][9]['value']}','{$password}','1','{$date}')");
			if($query->execute()){
				$query2 = $function->PDO("INSERT INTO tbl_points(id,employee_id,company_id,points) VALUES ('{$id}',{$function->escape($data[0][10]['value'])},'{$user}',0)");
				if($query2->execute()){
					$function->log("add","Admin","Added employee with an id of \'".$id."\' in tbl_employee.");
					echo 1;
				}
				else{
					$query3 = $function->PDO("DELETE tbl_employee WHERE id = '{$id}';");
					echo 0;
					$Data = $query2->errorInfo();
					print_r($Data);
				}
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}	

		if(isset($_GET['set-newBulkEmployee'])){
			$q1 = ""; $count = 0;
			$date = $function->PDO_DateAndTime();
			$user = $function->getUser();
			$numEmployees = $function->PDO("SELECT * FROM tbl_employee WHERE company_id = '{$user}'");
			$count = count($numEmployees);

			$data = $_POST['data'];
			$data = json_decode($data);

			foreach ($data as $key => $value) {
				$dob = date("m/j/Y",strtotime($value[3]));
				$email = (count($value)>5)?$function->escape($value[5]):"";
		        $id = $user.'-'.($count++);
		        $password = $function->password($id);
		        if((count($data)-1) <= $key){
					$q1 .= "('{$id}',{$function->escape($value[0])},'{$user}','{$password}',{$function->escape($value[2])},{$function->escape($value[1])},{$function->escape($value[4])},'{$dob}',{$email},'1','{$date}')";
		        }
		        else{
					$q1 .= "('{$id}',{$function->escape($value[0])},'{$user}','{$password}',{$function->escape($value[2])},{$function->escape($value[1])},{$function->escape($value[4])},'{$dob}',{$email},'1','{$date}'),";
		        }
			}

			$log = $function->log("add",$user,"adding bulk employee in tbl_employer.");

			$query = $function->PDO("INSERT INTO  tbl_employee(id,employee_id,employer_id,password,family_name,given_name,gender,date_of_birth,email,status,`date`) VALUES".$q1);
			if($query->execute()){
				$function->log($log,$user,"Added ".(count($data))." employee in tbl_employer.");
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}	

		if(isset($_GET['set-newBulkEmployeeAdmin'])){
			$q1 = ""; $q2 = "";
			$date = $function->PDO_DateAndTime();
			$data = $_POST['data'];
			$user = $data[1];

			$numEmployees = $function->PDO("SELECT COUNT(*) FROM tbl_employee WHERE company_id = '{$user}';");
			$count = $numEmployees[0][0];
			$data = json_decode($data[0]);

			foreach ($data as $key => $value) {
				$dob = date("m/j/Y",strtotime($value[3]));
				$email = (count($value)>5)?$function->escape($value[5]):"";
		        $id = $user.'-'.($count++);
		        $password = $function->password($id);
				$points = $function->PDO("SELECT * FROM tbl_points WHERE employee_id = {$function->escape($value[0])} AND company_id = '{$user}';");
		        if((count($data)-1) <= $key){
					$q1 .= "('{$id}',{$function->escape($value[0])},'{$user}','{$password}',{$function->escape($value[2])},{$function->escape($value[1])},{$function->escape($value[4])},'{$dob}',{$email},1,'{$date}')";
					if(count($points)==0){
						$q2 .= "('{$id}',{$function->escape($value[0])},'{$user}',0)";
					}
		        }
		        else{
					$q1 .= "('{$id}',{$function->escape($value[0])},'{$user}','{$password}',{$function->escape($value[2])},{$function->escape($value[1])},{$function->escape($value[4])},'{$dob}',{$email},1,'{$date}'),";
					if(count($points)==0){
						$q2 .= "('{$id}',{$function->escape($value[0])},'{$user}',0),";
					}
		        }
			}

			$query = $function->PDO("INSERT INTO tbl_employee(id,empolyee_id,company_id,password,family_name,given_name,gender,date_of_birth,email,status,`date`) VALUES".$q1.";");
			if($query->execute()){
				$query2 = $function->PDO("INSERT INTO tbl_points(id,employee_id,company_id,points) VALUES".$q2.";");
				if($query2->execute()){
					$log = $function->log("add","Admin","Added ".(count($data))." employee in tbl_employer.");
					echo 1;
				}
				else{
					$query3 = $function->PDO("DELETE tbl_employee WHERE company_id = '{$user}';");
					echo 0;
					$Data = $query2->errorInfo();
					print_r($Data);
				}
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}	

		if(isset($_GET['set-BulkEmployee'])){
			$q1 = ""; $q2 = "";
			$date = $function->PDO_DateAndTime();
			$data = $_POST['data'];
			$company_id = $data[1];

			$numEmployees = $function->PDO("SELECT COUNT(*) FROM tbl_employee WHERE company_id = '{$company_id}';");
			$count = $numEmployees[0][0];
			$data = json_decode($data[0]);

			foreach ($data as $key => $value) {
				$dob = date("m/j/Y",strtotime($value[3]));
				$email = (count($value)>5)?strtolower($function->escape($value[5])):"";
		        $id = $company_id.'-'.($count++);
		        // $password = $function->password($id);
		        if((count($data)-1) <= $key){
					$q1 .= "('{$id}',{$function->escape($value[0])},'{$company_id}',{$function->escape($value[2])},{$email},'',0)";
		        }
		        else{
					$q1 .= "('{$id}',{$function->escape($value[0])},'{$company_id}',{$function->escape($value[2])},{$email},'',0),";
		        }
			}

			$query = $function->PDO("INSERT INTO tbl_accountconfirmation(id,employee_id,company_id,name,email,meta_data,sent) VALUES".$q1.";");
			if($query->execute()){
				$log = $function->log("Add Employees","Admin","Added ".(count($data))." employees to company with an id "+$company_id);
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}	

		if(isset($_GET['set-uploadPointsAdmin'])){
			$q1 = "";$q2 = "";
			$date = $function->PDO_DateAndTime();
			$data = $_POST['data'];
			$user = $data[1];
			$numEmployees = $function->PDO("SELECT COUNT(*) FROM tbl_pointsactivity");
			$count = $numEmployees[0][0];

			$data = json_decode($data[0]);

			foreach($data as $key => $value){
				$points = (int)$value[3];
		        $id = $user.'-'.($count++);
				$email = (count($value)>5)?$function->escape($value[2]):"";

				$currentPoints = $function->PDO("SELECT * FROM tbl_points WHERE employee_id = {$function->escape($value[0])};");
				$newpoints = ((count($currentPoints)>0)?$currentPoints[0][2]:0)+$points;

				$q1 .= "UPDATE tbl_points SET points = '{$newpoints}' WHERE employee_id = {$function->escape($value[0])} AND company_id = '{$user}';";
		        if((count($data)-1) <= $key){
					$q2 .= "('{$id}','{$points}','admin',{$function->escape($value[0])},'{$date}','')";
		        }
		        else{
					$q2 .= "('{$id}','{$points}','admin',{$function->escape($value[0])},'{$date}',''),";
		        }
			}

			$query = $function->PDO($q1);
			if($query->execute()){
				$query2 = $function->PDO("INSERT INTO tbl_pointsactivity(id,points,addedby,employee_id,`date`,remarks) VALUES".$q2);
				if($query2->execute()){
					$log = $function->log("add","admin","adding bulk points employees");
					echo 1;
				}
				else{
					$Data = $query2->errorInfo();
					print_r($Data);
				}
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}	

		if(isset($_GET['set-addPointsAdmin'])){
			$date = $function->PDO_DateAndTime();
			$data = $_POST['data'];
			$employee_id = $data[1];
			$quantity = $function->PDO("SELECT COUNT(*) FROM tbl_pointsactivity");
			$count = $quantity[0][0];
			$points = (int)$data[0][0]['value'];
			$currentPoints = $function->PDO("SELECT * FROM tbl_points WHERE id = '{$employee_id}';");
			$newpoints = $currentPoints[0][2]+$points;
	        $id = $currentPoints[0][3].'-'.($count+1);
	        $remarks = $function->escape($data[0][1]['value']);

			$query = $function->PDO("UPDATE tbl_points SET points = '{$newpoints}' WHERE id = '{$employee_id}' AND company_id = '{$currentPoints[0][3]}';");
			if($query->execute()){
				$query2 = $function->PDO("INSERT INTO tbl_pointsactivity(id,points,addedby,employee_id,`date`,remarks) VALUES('{$id}','{$points}','admin','{$currentPoints[0][1]}','{$date}',{$remarks})");
				if($query2->execute()){
					$log = $function->log("add","admin","adding '{$points}' points employees");
					echo 1;
				}
				else{
					$Data = $query2->errorInfo();
					print_r($Data);
				}
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-addBrand'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
	        $id = $function->PDO_IDGenerator('tbl_brand','id');
			$brand = $function->escape($data[0]['value']);
			$description = $function->escape($data[1]['value']);
			$picture = $function->saveBrand($data[2]);
			$query = $function->PDO("INSERT INTO tbl_brand(id,brandName,brandDescription,icon,date) VALUES ('{$id}',{$brand},{$description},'{$picture}','{$date}');");
			if($query->execute()){
				$log = $function->log2("Admin","Added {$brand} Brand;","Brand");
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);	
			}
		}

		if(isset($_GET['set-deleteBrand'])){
			$data = $_POST['data'];
			$query = $function->PDO("DELETE FROM tbl_brand WHERE id = '{$data}'");
			if($query->execute()){
				$log = $function->log2("Admin","Deleted a brand; '${data}'.","Brand");
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-addCategory'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
	        $id = $function->PDO_IDGenerator('tbl_productcategories','id');
			$category = $function->escape($data[0]['value']);
			$picture = $function->saveIcon($data[1]);

			$query = $function->PDO("INSERT INTO tbl_productcategories(id,category,icon,date) VALUES ('{$id}',{$category},'{$picture}','{$date}');");
			if($query->execute()){
				$log = $function->log2("Admin","Added {$category} Brand;","Brand");
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-deleteCategory'])){
			$data = $_POST['data'];
			$query = $function->PDO("DELETE FROM tbl_productcategories WHERE id = '{$data}'");
			if($query->execute()){
				$log = $function->log2("Admin","Deleted a category; '${data}'.","Category");
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-wishlist'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
	        $id = $function->PDO_IDGenerator('tbl_wishlist','id');

			$query = $function->PDO("INSERT INTO tbl_wishlist(id,product_id,employee_id,date,status) VALUES ('{$id}','{$data[1]}','{$data[0]}','{$date}',1);");
			if($query->execute()){
				$log = $function->log2($data[1],"Added  wishlist","Wishlist");
				echo 1;
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}

		if(isset($_GET['set-orders'])){
			$q1 = ""; $q2 = ""; $q3 = ""; $points = 0; $spent = 0;
			$data = $_POST['data'];
			$user = $function->getEmployee();
			$date = $function->PDO_DateAndTime();
	        $orderID = $function->PDO_IDGenerator('tbl_orders','id');
			$numProd = $function->PDO("SELECT COUNT(*) FROM tbl_orderdetails");
			$count = $numProd[0][0];

			foreach ($data as $key => $value) {
				$qty = $value[1][1];
				$points = $points + $qty;
		        $id = $user.'-'.($count++);
				$prodQty = $function->PDO("SELECT * FROM tbl_product WHERE id = '{$value[1][0]}';");
				$_prodQty = $prodQty[0][2]-$qty;

				$spent = $spent + ($prodQty[0][3] * $qty);

		        if((count($data)-1) <= $key){
					$q1 .= "('{$id}',{$qty},'{$value[1][0]}','{$orderID}','{$date}','',1)";
					$q2 .= "UPDATE tbl_product SET qty = '{$_prodQty}' WHERE id = '{$value[1][0]}'";
		        }
		        else{
					$q1 .= "('{$id}',{$qty},'{$value[1][0]}','{$orderID}','{$date}','',1),";
					$q2 .= "UPDATE tbl_product SET qty = '{$_prodQty}' WHERE id = '{$value[1][0]}'";
		        }
			}

			$currentPoints = $function->PDO("SELECT * FROM tbl_points WHERE id = '{$user}';");
			$newpoints = $currentPoints[0][2]-$spent;

			if($newpoints>=0){
				$query = $function->PDO("INSERT INTO tbl_orders(id,employee_id,order_date,date_delivered,status) VALUES ('{$orderID}','{$user}','{$date}','','Pending'); INSERT INTO tbl_orderdetails(id,qty,product_id,order_id,order_date,order_delivered,status) VALUES ".$q1.";".$q2.";");
				if($query->execute()){
					$_query = $function->PDO("UPDATE tbl_points SET points = '{$newpoints}' WHERE id = '{$user}';");
					if($_query->execute()){
						$log = $function->log("add",$user,"Placed orders. Order ID: "+$orderID);
						echo 1;
					}
				}
				else{
					$Data = $query->errorInfo();
					print_r($Data);
				}
			}
			else{
				echo 2;
			}
		}	

		if(isset($_GET['set-newPendingEmployee'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
			$user = $data[1];
			$numEmployees = $function->PDO("SELECT COUNT(*) FROM tbl_employee WHERE company_id = '{$user}';");
			$count = $numEmployees[0][0];
		    $id = $user.'-'.($count++);
			$password = $function->password($data[0][11]['value']);
			
			$query = $function->PDO("INSERT INTO tbl_employee(id,employee_id,company_id,family_name,given_name,middle_name,nickname,gender,date_of_birth,contact_number,	email,address,picture,position,password,status,`date`) VALUES ('{$id}','{$data[0][10]['value']}','{$user}','{$data[0][2]['value']}','{$data[0][0]['value']}','{$data[0][1]['value']}','{$data[0][3]['value']}','{$data[0][5]['value']}','{$data[0][4]['value']}','{$data[0][7]['value']}','{$data[0][8]['value']}','{$data[0][6]['value']}','avatar.jpg','{$data[0][9]['value']}','{$password}','2','{$date}')");
			if($query->execute()){
				$query2 = $function->PDO("INSERT INTO tbl_points(id,employee_id,company_id,points) VALUES ('{$id}',{$function->escape($data[0][10]['value'])},'{$user}',0)");
				if($query2->execute()){
					$function->log("add","Employer","Added employee with an id of \'".$id."\' in tbl_employee.");
					echo 1;
				}
				else{
					$query3 = $function->PDO("DELETE tbl_employee WHERE id = '{$id}';");
					echo 0;
					$Data = $query2->errorInfo();
					print_r($Data);
				}
			}
			else{
				$Data = $query->errorInfo();
				print_r($Data);
			}
		}	

		if(isset($_GET['set-addPendingPointsAdmin'])){
	        $id = $function->PDO_IDGenerator('tbl_request','id');
			$date = $function->PDO_DateAndTime();
			$user = $function->getUser();
			$data = $_POST['data'];
			$_id = explode("-", $data[1]);
			$query = $function->PDO("SELECT * FROM tbl_pointbalance WHERE id = '{$_id[0]}'");

			if($query[0][1]>=$data[0][0]['value']){
				$newBalance = (int)$query[0][1] - (int)$data[0][0]['value'];
				$query2 = $function->PDO("INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Add Points','{$user}','{$data[1]}','{$data[0][0]['value']}','{$data[0][1]['value']}','0','{$date}'); UPDATE tbl_pointbalance SET balance = '{$newBalance}' WHERE id = '{$_id[0]}'");
				if($query2->execute()){
					$log = $function->log2($data[1],"Added points to "+$data[1]+"Waiting for admin's confirmation.","Points");
					echo 1;
				}
				else{
					$Data = $query2->errorInfo();
					print_r($Data);
				}
			}
			else{
				echo 0;
			}
		}

		if(isset($_GET['set-addPendingPointsEmployer'])){
	        $id = $function->PDO_IDGenerator('tbl_request','id');
			$date = $function->PDO_DateAndTime();
			$user = $function->getUser();
			$data = $_POST['data'];
			$_id = explode("-", $data[1]);
			$query = $function->PDO("SELECT * FROM tbl_pointbalance WHERE id = '{$_id[0]}'");

			if($query[0][1]>=$data[0][0]['value']){
				$newBalance = (int)$query[0][1] - (int)$data[0][0]['value'];
				$query2 = $function->PDO("INSERT INTO tbl_request(id,header,request_by,request_to,value,remarks,status,`date`) VALUES ('{$id}','Add Points','{$user}','{$data[1]}','{$data[0][0]['value']}','{$data[0][1]['value']}','0','{$date}'); UPDATE tbl_pointbalance SET balance = '{$newBalance}' WHERE id = '{$_id[0]}'");
				if($query2->execute()){
					$log = $function->log2($data[1],"Added points to "+$data[1]+"Waiting for admin's confirmation.","Points");
					echo 1;
				}
				else{
					$Data = $query2->errorInfo();
					print_r($Data);
				}
			}
			else{
				echo 0;
			}
		}

		if(isset($_GET['set-confirmEmployeeAccount'])){
			$data = $_POST['data'];
			$date = $function->PDO_DateAndTime();
			$tempAccount = $function->PDO("SELECT * FROM tbl_accountconfirmation WHERE id = '{$data[1]}'");

			$user = $function->escape($data[1]);
			$company_id = $tempAccount[0][2];
			$employee_id = $tempAccount[0][1];
			$email = $function->escape($tempAccount[0][4]);
			$password = $function->password($data[0][8]['value']);
			$numEmployees = $function->PDO("SELECT COUNT(*) FROM tbl_employee WHERE company_id = '{$company_id}';");
			$count = $numEmployees[0][0];
		    $id = $company_id.'-'.($count++);

			$query = $function->PDO("INSERT INTO tbl_employee(id,employee_id,company_id,family_name,given_name,middle_name,nickname,gender,date_of_birth,contact_number,	email,address,picture,position,password,status,`date`) VALUES ('{$id}','{$employee_id}','{$company_id}',{$function->escape($data[0][0]['value'])},{$function->escape($data[0][1]['value'])},{$function->escape($data[0][2]['value'])},{$function->escape($data[0][3]['value'])},{$function->escape($data[0][4]['value'])},{$function->escape($data[0][5]['value'])},{$function->escape($data[0][7]['value'])},{$email},{$function->escape($data[0][6]['value'])},'avatar.jpg','Employee','{$password}','1','{$date}'); INSERT INTO tbl_points(id,employee_id,company_id,points) VALUES ('{$id}','{$employee_id}','{$company_id}',0); DELETE FROM tbl_accountconfirmation WHERE id = '{$data[1]}'");
			if($query->execute()){
				$function->log("Confirmation",$id,"Confirmed account");
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