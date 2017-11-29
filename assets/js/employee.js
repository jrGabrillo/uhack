$(document).ready(function(){
	$('.modal').modal();
});

account = {
	ini:function(){
		var data = system.ajax('../assets/harmony/Process.php?get-employeeAccount',"");
		data.done(function(data){
			data = JSON.parse(data);
			var profile = ((data[0][12] == "") || data[0][12] == null)?"avatar.jpg":data[0][12];

			$("#user-account img.profile-image").attr({"src":"../assets/images/profile/"+profile});
			$("#user-account div div a span.display_name").html(data[0][4]);

			$("#log-out").on('click',function(){
				login.kill();
			})
		});
	},
	get:function(){
		var data = system.ajax('../assets/harmony/Process.php?get-employeeAccount',"");
		return JSON.parse(data.responseText);
	},
	details:function(){
		var data = this.get();
		var id = data[0][0];
		points.display(id);
		var content = "";
		var data = system.ajax('../assets/harmony/Process.php?get-employeeDetails',id);
		data.done(function(data){
			data = JSON.parse(data);
			if(data.length<=0){
				var data = system.xml("pages.xml");
				$(data.responseText).find("errorContent").each(function(i,content){
					$("#display_error").html(content);
				});
			}
			else{
				$("#display_employeeDetails").removeClass('hidden');
				$("#display_error").addClass('hidden');

				if(Number(data[0][15]) == 1){
					status = "Active";
					var actions = `<button disabled data-cmd='deactivateEmployee' data-name='${data[0][4]}' data-node='${data[0][0]}' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>
								  	<i class='mdi-action-lock-open right grey-text'></i>
								  </button>`;	
				}
				else if(Number(data[0][15]) == 2){
					status = "Pending";
					var actions = `<button disabled data-cmd='activateEmployee' data-name='${data[0][4]}' data-node='${data[0][0]}' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>
								  	<i class='mdi-action-lock right grey-text'></i>
								  </button>`;	
				}
				else{
					status = "Deactivated";
					var actions = `<button disabled data-cmd='activateEmployee' data-name='${data[0][4]}' data-node='${data[0][0]}' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>
								  	<i class='mdi-action-lock right grey-text'></i>
								  </button>`;	
				}

				var profile = ((data[0][12] == "") || (data[0][12] == null))?"avatar.jpg":data[0][12];
				content = `<div id='profile-card' class='card'>
							<div class='card-image waves-effect waves-block waves-light' style='max-height: 70px;'>
								<img class='activator' src='../assets/images/user-bg.jpg' alt='user background'>
							</div>
							<div class='card-stacked'>
								<div class='card-content'>
									<div class=' responsive-img activator card-profile-image circle' style='margin-top: -65px;'>
										<img src='../assets/images/profile/${profile}' alt='' class='circle'>
										<a data-value='${profile}' data-cmd='updateEmployeePicture' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-prop='Picture' class='btn waves-effect white-text no-shadow black' style='font-size: 10px;z-index: 1;padding: 0 12px;top:40px;'>Change</a>
									</div>
									<a data-value='${JSON.stringify([data[0][4],data[0][5],data[0][3]])}' data-cmd='updateEmployee' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-prop='Name' class='tooltipped waves-effect black-text no-shadow right' data-position='left' data-delay='50' data-tooltip='Update account'>
										<i class='material-icons right hover black-text'>mode_edit</i>
									</a>
									<span class='card-title activator grey-text text-darken-4 bold'>${data[0][4]} ${data[0][5]} ${data[0][3]} </span>
									<div class='divider'></div>
									<table>
										<tr>
											<td class='bold' width='120px'><i class='mdi-action-info-outline cyan-text text-darken-2'></i> Status: </td>
											<td class='grey-text'>${status}</td>
										</tr>
										<tr>
											<td class='bold'><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Nickname: </span></td>
											<td class='grey-text'>${data[0][6]}</td>
											<td>
												<a data-value='${data[0][6]}' data-cmd='updateEmployee' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-prop='Nickname' class='tooltipped waves-effect black-text no-shadow right' data-position='left' data-delay='50' data-tooltip='Update Nickname'>
													<i class='material-icons right hover black-text'>mode_edit</i>
												</a>
											</td>
										</tr>
										<tr>
											<td class='bold'><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-work cyan-text text-darken-2'></i> Position: </span></td>
											<td class='grey-text'>${data[0][13]}</td>
											<td>
												<a data-value='${data[0][13]}' data-cmd='updateEmployee' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-prop='Position' class='tooltipped waves-effect black-text no-shadow right' data-position='left' data-delay='50' data-tooltip='Update Position'>
													<i class='material-icons right hover black-text'>mode_edit</i>
												</a>
											</td>
										</tr>
										<tr>
											<td class='bold'><span style='width:80%;display: inline-block;' class='truncate'> <i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Phone: </span></td>
											<td class='grey-text'>${data[0][9]}</td>
											<td>
												<a data-value='${data[0][9]}' data-cmd='updateEmployee' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-prop='Phone' class='tooltipped waves-effect black-text no-shadow right' data-position='left' data-delay='50' data-tooltip='Update phone'>
													<i class='material-icons right hover black-text'>mode_edit</i>
												</a>
											</td>
										</tr>
										<tr>
											<td class='bold'><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-communication-email cyan-text text-darken-2'></i> Email: </span></td>
											<td class='grey-text'>${data[0][10]}</td>
											<td>
												<a data-value='${data[0][10]}' data-cmd='updateEmployee' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-prop='Email' class='tooltipped waves-effect black-text no-shadow right' data-position='left' data-delay='50' data-tooltip='Update Email'>
													<i class='material-icons right hover black-text'>mode_edit</i>
												</a>
											</td>
										</tr>
										<tr>
											<td class='bold'><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-maps-map cyan-text text-darken-2'></i> Address: </span></td>
											<td class='grey-text'>${data[0][11]}</td>
											<td>
												<a data-value='${data[0][11]}' data-cmd='updateEmployee' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-prop='Address' class='tooltipped waves-effect black-text no-shadow right' data-position='left' data-delay='50' data-tooltip='Update Address'>
													<i class='material-icons right hover black-text'>mode_edit</i>
												</a>
											</td>
										</tr>
										<tr>
											<td class='bold'><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-cached cyan-text text-darken-2'></i> Gender: </span></td>
											<td class='grey-text'>${data[0][7]}</td>
											<td>
												<a data-value='${data[0][7]}' data-cmd='updateEmployee' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-prop='Gender' class='tooltipped waves-effect black-text no-shadow right' data-position='left' data-delay='50' data-tooltip='Update Gender'>
													<i class='material-icons right hover black-text'>mode_edit</i>
												</a>
											</td>
										</tr>
										<tr>
											<td class='bold'><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-event cyan-text text-darken-2'></i> Date of Birth: </span></td>
											<td class='grey-text'>${data[0][8]}</td>
											<td>
												<a data-value='${data[0][8]}' data-cmd='updateEmployee' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-prop='Date of Birth' class='tooltipped waves-effect black-text no-shadow right' data-position='left' data-delay='50' data-tooltip='Update Date of Birth'>
													<i class='material-icons right hover black-text'>mode_edit</i>
												</a>
											</td>
										</tr>
										<tr>
											<td class='bold'><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-account-box cyan-text text-darken-2'></i> Employee ID: </span></td>
											<td colspan='2' class='grey-text'>${data[0][1]}</td>
										</tr>
										<tr>
											<td class='bold'><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-verified-user cyan-text text-darken-2'></i> Password</span></td>
											<td colspan='2'>
												<a data-cmd='updateEmployee' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-prop='Password' class='tooltipped waves-effect black-text no-shadow right' data-position='left' data-delay='50' data-tooltip='Update password'>
													<i class='material-icons right hover black-text'>mode_edit</i>
												</a>
											</td>
										</tr>
									</table>
								</div>
							</div>
						</div>`;
				$("#profile").html(content);

				account.update();
				account.updatePicture();
			}
		});
	},
	update:function(){
		$("a[data-cmd='updateEmployee']").on('click',function(){
			var data = $(this).data();
			var id = data.node;

			var content = `<h4>Change ${data.prop}</h4>
						  	<form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>
						  		<label for='field_${data.prop}'>${data.prop}: </label>
						  		<input id='field_${data.prop}' type='text' name='field_${data.prop}' data-error='.error_${data.prop}' value='${data.value}'>
						  		<div class='error_${data.prop}'></div>
						  		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>
						  		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>
						  	</form>`;
			$("#modal_confirm .modal-content").html(content);
			$('#modal_confirm .modal-footer').html("");			

			if(data.prop == "Name"){
				var content = `<h4>Change ${data.prop}</h4>
							  <form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>
							  		<div class='col s12'>
							  			<label for='field_gname'>Given Name: </label>
							  			<input id='field_gname' type='text' name='field_gname' data-error='.error_gname' value='${data.value[0]}'>
							  			<div class='error_gname'></div>
							  		</div>
							  		<div class='col s12'>
							  			<label for='field_mname'>Middle Name: </label>
							  			<input id='field_mname' type='text' name='field_mname' data-error='.error_mname' value='${data.value[1]}'>
							  			<div class='error_mname'></div>
							  		</div>
							  		<div class='col s12'>
							  			<label for='field_fname'>Family Name: </label>
							  			<input id='field_fname' type='text' name='field_fname' data-error='.error_fname' value='${data.value[2]}'>
							  			<div class='error_fname'></div>
							  		</div>
							  		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>
							  		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>
							  </form>`;
				$("#modal_confirm .modal-content").html(content);
				$('#modal_confirm').modal('open');			
				$("#form_update").validate({
					rules: {
						field_gname: {required: true,maxlength: 50},
						field_mname: {required: true,maxlength: 50},
						field_fname: {required: true,maxlength: 50},
					},
					errorElement : 'div',
					errorPlacement: function(error, element) {
						var placement = $(element).data('error');
						if(placement){
							$(placement).append(error);
						} 
						else{
							error.insertAfter(element);
						}
					},
					submitHandler: function (form) {
						var _form = $(form).serializeArray();
						var data = system.ajax('../assets/harmony/Process.php?update-requestEmployee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Request sent. Wait for admin\'s approval',4000);
								$('#modal_confirm').modal('close');	
								App.handleLoadPage("#cmd=index;content=account");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
					}
				}); 
			}			
			else if(data.prop == "Nickname"){
				$('#modal_confirm').modal('open');			
				$("#form_update").validate({
					rules: {
						field_Nickname: {required: true,maxlength: 50},
					},
					errorElement : 'div',
					errorPlacement: function(error, element) {
						var placement = $(element).data('error');
						if(placement){
							$(placement).append(error)
						} 
						else{
							error.insertAfter(element);
						}
					},
					submitHandler: function (form) {
						var _form = $(form).serializeArray();
						var data = system.ajax('../assets/harmony/Process.php?update-requestEmployee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Request sent. Wait for admin\'s approval',4000);
								$('#modal_confirm').modal('close');	
								App.handleLoadPage("#cmd=index;content=account");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
					}
				}); 
			}			
			else if(data.prop == "Position"){
				$('#modal_confirm').modal('open');			
				$("#form_update").validate({
					rules: {
						field_Nickname: {required: true,maxlength: 50},
					},
					errorElement : 'div',
					errorPlacement: function(error, element) {
						var placement = $(element).data('error');
						if(placement){
							$(placement).append(error)
						} 
						else{
							error.insertAfter(element);
						}
					},
					submitHandler: function (form) {
						var _form = $(form).serializeArray();
						var data = system.ajax('../assets/harmony/Process.php?update-requestEmployee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Request sent. Wait for admin\'s approval',4000);
								$('#modal_confirm').modal('close');	
								App.handleLoadPage("#cmd=index;content=account");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
					}
				}); 
			}			
			else if(data.prop == "Phone"){
				$('#modal_confirm').modal('open');			
				$("#form_update").validate({
					rules: {
						field_Name: {required: true,maxlength: 50},
					},
					errorElement : 'div',
					errorPlacement: function(error, element) {
						var placement = $(element).data('error');
						if(placement){
							$(placement).append(error)
						} 
						else{
							error.insertAfter(element);
						}
					},
					submitHandler: function (form) {
						var _form = $(form).serializeArray();
						var data = system.ajax('../assets/harmony/Process.php?update-requestEmployee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Request sent. Wait for admin\'s approval',4000);
								$('#modal_confirm').modal('close');	
								App.handleLoadPage("#cmd=index;content=account");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
					}
				}); 
			}			
			else if(data.prop == "Email"){
				$('#modal_confirm').modal('open');			
				$("#form_update").validate({
					rules: {
						field_Email: {required: true,maxlength: 50,checkEmail:true},
					},
					errorElement : 'div',
					errorPlacement: function(error, element) {
						var placement = $(element).data('error');
						if(placement){
							$(placement).append(error)
						} 
						else{
							error.insertAfter(element);
						}
					},
					submitHandler: function (form) {
						var _form = $(form).serializeArray();
						var data = system.ajax('../assets/harmony/Process.php?update-requestEmployee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Request sent. Wait for admin\'s approval',4000);
								$('#modal_confirm').modal('close');	
								App.handleLoadPage("#cmd=index;content=account");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
					}
				}); 
			}
			else if(data.prop == "Address"){
				$('#modal_confirm').modal('open');			
				$("#form_update").validate({
					rules: {
						field_Email: {required: true,maxlength: 50,checkEmail:true},
					},
					errorElement : 'div',
					errorPlacement: function(error, element) {
						var placement = $(element).data('error');
						if(placement){
							$(placement).append(error)
						} 
						else{
							error.insertAfter(element);
						}
					},
					submitHandler: function (form) {
						var _form = $(form).serializeArray();
						var data = system.ajax('../assets/harmony/Process.php?update-requestEmployee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Request sent. Wait for admin\'s approval',4000);
								$('#modal_confirm').modal('close');	
								App.handleLoadPage("#cmd=index;content=account");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
					}
				}); 
			}
			else if(data.prop == "Gender"){
				var content = `<h4>Change ${data.prop}</h4>
							  <form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>
							  		<div class='col s12'>
							  		<label for='field_gender' class='active'>Gender: </label>
							  		<select name='field_Gender'>
							  			<option selected>Male</option>
							  			<option>Female</option>
							  		</select>
							  		</div>
							  		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>
							  		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>
							  </form>`;
				$("#modal_confirm .modal-content").html(content);
				$('#modal_confirm').modal('open');			
				$("select").material_select();
				$("#form_update").validate({
					rules: {
						field_Email: {required: true,maxlength: 50,checkEmail:true},
					},
					errorElement : 'div',
					errorPlacement: function(error, element) {
						var placement = $(element).data('error');
						if(placement){
							$(placement).append(error)
						} 
						else{
							error.insertAfter(element);
						}
					},
					submitHandler: function (form) {
						var _form = $(form).serializeArray();
						var data = system.ajax('../assets/harmony/Process.php?update-requestEmployee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Request sent. Wait for admin\'s approval',4000);
								$('#modal_confirm').modal('close');	
								App.handleLoadPage("#cmd=index;content=account");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
					}
				}); 
			}
			else if(data.prop == "Date of Birth"){
				var content = `<h4>Change ${data.prop}</h4>
							  <form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>
							  		<label for='field_dob'>Date of birth: </label>
							  		<input id='field_dob' type='text' name='field_dob' data-error='.error_dob' value='${data.value}'>
							  		<div class='error_dob'></div>
							  		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>
							  		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>
							  </form>`;
				$("#modal_confirm .modal-content").html(content);

				$('#modal_confirm').modal('open');			
				$("#form_update").validate({
					rules: {
						field_dob: {required: true,maxlength: 50,checkDate:true},
					},
					errorElement : 'div',
					errorPlacement: function(error, element) {
						var placement = $(element).data('error');
						if(placement){
							$(placement).append(error)
						} 
						else{
							error.insertAfter(element);
						}
					},
					submitHandler: function (form) {
						var _form = $(form).serializeArray();
						var data = system.ajax('../assets/harmony/Process.php?update-requestEmployee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Request sent. Wait for admin\'s approval',4000);
								$('#modal_confirm').modal('close');	
								App.handleLoadPage("#cmd=index;content=account");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
					}
				}); 
			}
			else if(data.prop == "Password"){
				$('#modal_confirm').modal('open');			
				$("#field_Password").val("");
				$("#field_Password").attr({"type":"password"});
				$("#form_update").append("<p><input type='checkbox' id='showPassword'><label for='showPassword'>Show password</label></p>");
				$("#form_update").append(`<div class='display_notes'>
								*<strong>Password</strong> must contain atleast 1 number, 1 uppercase letter, 1 lowercare letter, 1 special character* and 6 character length. <br/>
								<u>Special characters are ! @ $ % *</u>
							</div>`);

				$("#showPassword").on("click",function(){
					if($(this).is(':checked')){
						$("#field_Password").attr({"type":"text"});						
					}
					else{
						$("#field_Password").attr({"type":"password"});						
					}
				})

				$("#form_update").validate({
					rules: {
						field_Password: {required: true,maxlength: 50,checkPassword:true,validatePassword:true},
					},
					errorElement : 'div',
					errorPlacement: function(error, element) {
						var placement = $(element).data('error');
						if(placement){
							$(placement).append(error)
						} 
						else{
							error.insertAfter(element);
						}
					},
					submitHandler: function (form) {
						var _form = $(form).serializeArray();
						var data = system.ajax('../assets/harmony/Process.php?update-requestEmployee',[id,_form]);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								system.clearForm();
								Materialize.toast('Password updated.',4000);
								$('#modal_confirm').modal('close');	
								App.handleLoadPage("#cmd=index;content=account");
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
					}
				}); 
			}
		});
	},
	updatePicture:function(){
		$("a[data-cmd='updateEmployeePicture']").on('click',function(){
			var data = $(this).data();
			var id = data.node;
			var picture = "../assets/images/profile/avatar.jpg";
			var content = `<h4>Change ${data.prop}</h4>
  								<div class='row'>
  									<div class='col s12'>
										<div id='profile_picture2' class='ibox-content no-padding border-left-right '></div>
									</div>
								</div>`;
			$("#modal_confirm .modal-content").html(content);
			$('#modal_confirm').removeClass('modal-fixed-footer');			
			$('#modal_confirm .modal-footer').remove();			
			$('#modal_confirm').modal('open');			

			var content =   `<div class='image-crop col s12' style='margin-bottom:5px;'>
								<img width='100%' src='${picture}'>
							</div>
							<div class='btn-group col s12'>
								<label for='inputImage' class='btn blue btn-floating btn-flat tooltipped' data-tooltip='Load image' data-position='top'>
									<input type='file' accept='image/*' name='file' id='inputImage' class='hide'>
									<i class='material-icons right hover white-text'>portrait</i>
								</label>
								<button class='btn blue btn-floating btn-flat tooltipped' data-cmd='cancel' type='button' data-tooltip='Cancel' data-position='top'>
									<i class='material-icons right hover white-text'>close</i>
								</button>
								<button class='btn blue btn-floating btn-flat hidden tooltipped right' data-cmd='save' type='button' data-tooltip='Save' data-position='top'>
									<i class='material-icons right hover white-text'>save</i>
								</button>
							</div>`;
			$("#profile_picture2").html(content);
			$('.tooltipped').tooltip({delay: 50});

			var $inputImage = $("#inputImage");
			var status = true;
			if(window.FileReader){
				$inputImage.change(function() {
					var fileReader = new FileReader(),
							files = this.files,
							file;
					file = files[0];

					if (/^image\/\w+$/.test(file.type)) {
						fileReader.readAsDataURL(file);
						fileReader.onload = function () {
							$inputImage.val("");

							var $image = $(".image-crop > img")
							$($image).cropper({
								aspectRatio: 1/1,
								autoCropArea: 0.80,
								preview: ".avatar-preview",
								built: function () {
									$(".cropper-container").attr({'style':'left:0px !important;top:0px;width:100%;height:100%;'});

									$("button[data-cmd='save']").removeClass('hidden');
									$("button[data-cmd='rotate']").removeClass('hidden');
									
									$("button[data-cmd='save']").click(function(){											
										$(this).html("<i class='mdi-action-cached icon-spin'></i>").addClass('disabled');
										if(status){
											var data = system.ajax('../assets/harmony/Process.php?update-requestEmployeePicture',[id,$image.cropper("getDataURL")]); // 
											data.done(function(data){
												Materialize.toast('Request sent. Wait for admin\'s approval',4000);
												system.clearForm();
												App.handleLoadPage("#cmd=index;content=account");
												$('#modal_confirm').modal('close');	
											});
											status = false;
										}
									});
								}
							});

							$image.cropper("reset", true).cropper("replace", this.result);

							$("button[data-cmd='rotate']").click(function(){
								var data = $(this).data('option');
								$image.cropper('rotate', data);
							});

						};
					}
					else{
						showMessage("Please choose an image file.");
					}
				});
			}
			else{
				$inputImage.addClass("hide");
			}				
			$("button[data-cmd='cancel']").click(function(){
				$('#modal_confirm').modal('close');	
			});
		});
	},
	upload:function(){
		var $inputImage = $("#field_file"), status = true, res = "";
		if(window.FileReader){
			$inputImage.on('change',function(){
				$("#field_file").addClass("disabled");
				var files = this.files, file = files[0].name.split('.');
				if((file[1] == "csv") || (file[1] == "xlsx")){ // 
					var data = system.xml("pages.xml");
					$(data.responseText).find("tableEmployeePreview").each(function(i,content){
						$("#field_file").parse({
							config: {
								complete: function(results, file) {
									$("#display_importLoading").removeClass('zoomOut').html("");
									system.preloader("#display_importLoading");
									system.loading(true);
									var data = [],count = 0, search = [];
									var employeeList = [];

									var employerID = localStorage.getItem('client_id');
									employeeList = system.ajax('../assets/harmony/Process.php?get-employeeByID',employerID);
									employeeList = JSON.parse(employeeList.responseText);
									if(results['data'].length<=2000){
										Materialize.toast("Removing duplicated entries.",2000);
										setTimeout(function(){
											$("#importPreview").html(content);
											$("#display_import").removeClass('hidden');

											for(var x=1;x<(results['data'].length-1);x++){
												if(results['data'][x][0] != ""){
													search = system.searchJSON(employeeList,1,results['data'][x][0]);
													if(search.length==0)												
														data.push(results['data'][x]);
												}
											}

											var table = $('#importPreview table').DataTable({
												data: data,
												"order": [[ 0, 'asc' ]],
												deferRender:	true,
												iDisplayLength: 100,
												sScrollY:		"300px",
												sScrollX:		"100%",
												bScrollCollapse: true,
												columns: [
													{data: "",
														render: function ( data, type, full ){
															count++;
															return count+".";
														}
													},
													{data: "",
														render: function ( data, type, full ){
															return (full[0]!="")?`<span>${full[0]}</span>`:null;
														}
													},
													{data: "",
														render: function ( data, type, full ){
															return (full[2]!="")?`<span>${full[2]}</span>`:null;
														}
													},
													{data: "",
														render: function ( data, type, full ){
															return (full[1]!="")?`<span>${full[1]}</span>`:null;
														}
													},
													{data: "",
														render: function ( data, type, full ){
															return (full[3]!="")?`<span>${full[3]}</span>`:null;
														}
													},
													{data: "",
														render: function ( data, type, full ){
															return (full[4]!="")?`<span>${full[4]}</span>`:null;
														}
													},
													{data: "",
														render: function ( data, type, full ){
															return (full[5]!="")?`<span>${full[5]}</span>`:null;
														}
													},
												],
											});

											table.on( 'order.dt search.dt', function () {
												table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
													cell.innerHTML = i+1;
												} );
											} ).draw();


											if(data.length>0){
												account.saveUpload(data);
											}
											else{
												$(".display_loading").html("<span class='red-text'>All data are already in the system.</span>");
											}

											$("#display_import").removeClass('hidden');
											$("#display_importLoading").addClass('animated zoomOut').html("");
										},1000)
									}
									else{
										Materialize.toast("Too much information. Try uploading up to 2000 rows. ",4000);
										$("#display_import").addClass('hidden');
										$("#display_importLoading").addClass('animated zoomOut').html("");
									}
								}
							},
							before: function(file, inputElem){
								$("#display_excelFile").html(file.name);
							},
							error: function(err, file, inputElem, reason){
								Materialize.toast("MS Excel file is corrupted.",4000);
								$("#display_import").addClass('hidden');
								$("#display_importLoading").html("");
							},
						});
					});
				}
				else{
					$("#display_import").addClass('hidden');
					$("#display_excelFile").html("");
					Materialize.toast("MS Excel file is not valid. Try a CSV file.",4000);
				}
			});
		}
		else{
			$inputImage.addClass("hide");
		}	 			
	},
	saveUpload:function(_data){
		$("#save_import").on("click",function(){
			Materialize.toast('Importing...',4000);
			$(this).addClass('disabled');
			var data = system.xml("pages.xml");
			$(data.responseText).find("loader2").each(function(i,content){
				$(".display_loading").html(content);
				setTimeout(function(){
					_data = ($.type(_data) == "array")?JSON.stringify(_data):_data;
					var client = localStorage.getItem('client_id')
					var data = system.ajax('../assets/harmony/Process.php?set-newBulkEmployeeAdmin',[_data,client]);
					data.done(function(data){
						if(data == 1){
							Materialize.toast('Saved.',4000);
							App.handleLoadPage("#cmd=index;content=focusClient");
						}
						else{
							Materialize.toast('Cannot process request.',4000);
							$(".display_loading").html("");
						}
					});
				},1000);
			});

		});
	},
}

activity = {
	getPointsActivity:function(id){
		var content = "";
		var data = system.ajax('../assets/harmony/Process.php?get-employeePointsActivityAdmin',id);
		data.done(function(data){
			data = JSON.parse(data);
			if(data.length<=0){
				$("#pointsActivity").html("<h4 class='center'>No points activity</h4>");
			}
			else{
				$.each(data,function(i,v){
					content += `<tr>
									<td width='1px'>${(i+1)}. </td>
									<td>${v[1]}</td>
									<td>${v[2]}</td>
									<td>${v[5]}</td>
									<td>${v[3]}</td>
								</tr>`;
				})					
				$("#pointsActivity table tbody").html(content);

				var table = $('#pointsActivity table').DataTable({
					"order": [[ 0, 'asc' ]],
					"bLengthChange":false,
					"drawCallback": function ( settings ) {
						var api = this.api();
						var rows = api.rows( {page:'current'} ).nodes();
						var last=null;
					}
				});
			}
		});
	},
	getBuysActivity:function(id){
		var content = "";
		var data = system.ajax('../assets/harmony/Process.php?get-employeeBuysActivityAdmin',id);
		data.done(function(data){
			data = JSON.parse(data);
			if(data.length<=0){
				$("#buyingActivity").html("<h4 class='center'>No buying activity</h4>");
			}
			else{
				$.each(data,function(i,v){
					content += `<tr>
									<td width='1px'>${(i+1)}. </td>
									<td width='20%'>${v[0].substring(0,6)}</td>
									<td width='30%'>${v[2]}</td>
									<td width='30%'>${v[3]}</td>
									<td width='30%'>${v[4]}</td>
									<td width='9%'>
										<a data-cmd='showOrder' data-node='${v[0]}' data-meta='${JSON.stringify([v[0],v[2],v[3],v[4]])}' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-4 right' data-position='left' data-delay='0' data-tooltip='Show details'>
											<i class='material-icons right hover black-text'>more_vert</i>
										</a>
									</td>
								</tr>`;
				})					
				$("#buyingActivity table tbody").html(content);

				var table = $('#buyingActivity table').DataTable({
					"order": [[ 0, 'asc' ]],
					"bLengthChange":false,
					"drawCallback": function ( settings ) {
						var api = this.api();
						var rows = api.rows( {page:'current'} ).nodes();
						var last=null;
					}
				});

				$("a[data-cmd='showOrder']").on('click',function(){
					var data = $(this).data();
					var content = "";
					console.log(data);
					$("#modal_popUp table").remove();

					var subTotal = 0;
					var orders = system.ajax('../assets/harmony/Process.php?get-orders',data.node);
					orders.done(function(orders){
						var orders = JSON.parse(orders);
						content = `<thead><tr>
								  <th class='center'></th>						
								  <th class='center'>Product</th>						
								  <th class='center'>Quantity</th>						
								  <th class='center'>Price</th>						
								  <th class='center'>Total</th>						
								  </tr></thead>`;						

						$.each(orders,function(i,v){
							var product = ((v[17] == "") || (v[17] == null))?"default.png":v[17];
							subTotal = subTotal + (v[10]*v[1]);
							content += `<tr>
									  <td class='center'><img src='../assets/images/products/${product}' alt='Thumbnail' class='valign profile-image' width='80px'></td>
									  <td class='center'>${v[8]}</td>
									  <td class='center'>${v[1]}</td>
									  <td class='center'>${v[10]}</td>
									  <td class='center'>${(v[10]*v[1])}</td>
									  </tr>`;						
						})
						$('#modal_popUp .modal-content').html(`<strong>Order ID:</strong> ${data.meta[0].substring(0,6)}<br/><strong>Order Date:</strong> ${data.meta[1]}<br/>\n<strong>Order Delivered:</strong> ${data.meta[2]}<br/>\n<strong>Status:</strong> ${data.meta[3]}`);			
						$("#modal_popUp .modal-footer").before(`<table class='striped bordered highlight'>${content}<tr><td colspan='4'><strong class='right' >Total</strong></td><td class='center'>${subTotal}</td></tr></table>`);
						$("#modal_popUp .modal-footer").html("<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Close</a>");
						$('#modal_popUp').modal('open');			

						console.log(orders);
					});
				});
			}
		});
	}
}

points = {
	ini:function(){
		var data = system.ajax('../assets/harmony/Process.php?get-employeeAccount',"");
		data = JSON.parse(data.responseText);
		var id = data[0][0];
		this.display(id);
		activity.getPointsActivity(id);
		activity.getBuysActivity(id);
		let wish = wishlist.get(id);
		wishlist.list(wish);
	},
	display:function(id){
		let data = this.get(id);
		data = (data.length<=0)?0:data[0][2];
		$("#display_points span").html(data);
	},
	get:function(id){
		var data = system.ajax('../assets/harmony/Process.php?get-employeePointsAdmin',id);
		return JSON.parse(data.responseText);
	}
}

wishlist = {
	ini:function(){
		let id = profile.get()[0][0];
		this.get(id);
	},
	get:function(id){
		let ret = [];
		let data = system.ajax('../assets/harmony/Process.php?get-wishlistDetail',id);
		data.done(function(data){
			ret = JSON.parse(data);
		});
		return ret;
	},
	remove:function(id){
		let data = system.ajax('../assets/harmony/Process.php?update-removeWishlist',id);
		return data.responseText;
	},
	list:function(list){
		let acct = account.get();
		let pts = points.get(acct[0][0]);
		pts = (pts[0][2]*1);
		let content = "",search = [], disabled = "", category = "", categoryList = "";
		let cartList = cart.get();

		// let id = profile.get()[0][0];
		// let wishItems = wishlist.get(id);
		// list = ((list == "") || (list == null))?JSON.parse(product.get()):list;

		$.each(list,function(i,v){
			search = system.searchJSON(cartList,0,v[0]);
			if((search.length<=0) && (pts > (v[8]*1)))
				disabled = `<li>
								<a data-cmd='addCart' data-node='${v[0]}' data-meta='${JSON.stringify([v[0],v[2],v[3],v[4]])}'>
									Add to cart
								</a>
							</li>`;

			content += `<div class='col l4 m4 s12' id='cart_${v[0]}'>
							<div class='card' style='overflow:hidden;'>
								<div class='card-image'>
									<img alt='placeholder' src='../assets/images/products/${v[15]}' style='width:100%'>
									<span class='card-title' style='width:100%;'>
										<a class='dropdown-button btn-floating btn-flat waves-effect grey lighten-4 right' data-position='left' data-tooltip='Details' data-activates='dropdown_${v[0]}'>
											<i class="material-icons hover black-text">more_vert</i>
										</a>
										<ul class='dropdown-content' id='dropdown_${v[0]}'>
											<li>
												<a class='activator'>
													Details
												</a>
											</li>
											${disabled}
											<li>
												<a data-cmd='removeWishlist' data-node='${v[0]}' data-meta='${JSON.stringify([v[0],v[2],v[3],v[4]])}'>
													Remove
												</a>
											</li>
										</ul>
									</span>
								</div>
								<div class='card-content'>
									<span class="card-title grey-text text-darken-4 ">${v[6]}</span>
									<span class=''>${v[8]} points</span>
								</div>
								<div class="card-reveal" style='overflow-y:scroll;'>
									<span class="card-title grey-text text-darken-4">${v[6]}<i class="material-icons right">close</i></span>
									<p>${v[10]}</p>
								</div>
							</div>
						</div>`; 
		});

		$("#wishlist").html(content);

		$('.dropdown-button').dropdown({
			inDuration: 300,
			outDuration: 225,
			constrainWidth: false,
			hover: true,
			gutter: 0,
			belowOrigin: false, 
			alignment: 'right',
		});

		$("a[data-cmd='removeWishlist']").on('click',function(){
			$(this).attr({"disabled":true});
			let data = $(this).data();
			if(wishlist.remove(data.node) == 1){
				Materialize.toast('Success.',4000);
				$(`#cart_${[data.node]}`).remove();
			}
			else{
				Materialize.toast('Cannot remove this list. Try again later.',4000);
			}
		});

		$("a[data-cmd='addCart']").on('click',function(){
			$(this).parent().remove();
			let data = $(this).data();
			let cartCount = cart.count();
			localStorage.setItem(`cartCount`,((cartCount*1)+1));
			localStorage.setItem(`cart-${((cartCount*1)+1)}`,JSON.stringify([data.node,0]));
			Materialize.toast('Thanks! You bought 1 product.',4000);
		});
	},
};

cart = {
	count:function(){
		let cartList = 0;
		if((localStorage.getItem('cartCount') == null) || (typeof localStorage.getItem('cartCount') == undefined)){
			localStorage.setItem('cartCount',0);
		}
		else{
			cartList= localStorage.getItem('cartCount');
		}
		return cartList;
	},	
	get:function(){
		let data = [];
		let cartList;
		let count = localStorage.getItem('cartCount');
		for(x=1;x<=count;x++){
			cartList = localStorage.getItem('cart-'+x);
			if(cartList != null){
				data.push(["cart-"+x,JSON.parse(cartList)]);
			}
		}
		return data;
	},
};