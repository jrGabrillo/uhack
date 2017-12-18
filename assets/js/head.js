$(document).ready(function(){
	$('.modal').modal();
});

account = {
	ini:function(){
		var data = this.get();
		this.display(JSON.parse(data));

		$("#log-out").on('click',function(){
			login.kill();
		});
	},
	get:function(){
		var data = system.html('../assets/harmony/Process.php?get-account');
		return data.responseText;
	},
	display:function(data){
		console.log(data);
		var content = "";
		var profile = (data[0][15] == "")?'avatar.png':data[0][15];

		$("#user-account img.profile-image").attr({"src":"../assets/images/profile/"+profile});
		$("#user-account div div a span.display_name").html(`${data[0][7]} ${data[0][8]} ${data[0][9]}`);

		content = `<div id='profile-card' class='card'>
						<div class='card-image waves-effect waves-block waves-light' style='max-height: 70px;'>
							<img class='activator' src='../assets/images/user-bg.jpg' alt=''>
						</div>
						<div class='card-content'>
							<div class='responsive-img activator card-profile-image circle' style='margin-top: -65px;'>
								<img src='../assets/images/profile/${profile}' alt='' class='circle'>
								<a data-cmd='updateAdminPicture' data-value='${profile}' data-name='${data[0][7]} ${data[0][8]} ${data[0][9]}' data-node='${data[0][0]}' data-prop='Picture' class='btn waves-effect white-text no-shadow black' style='font-size: 10px;z-index: 1;padding: 0 12px;top:40px;'>Change</a>
							</div>
							<a data-for='name' data-cmd='updateAdmin' data-value='${data[0][1]}' data-name='${data[0][7]} ${data[0][8]} ${data[0][9]}' data-node='${data[0][0]}' data-prop='Name' class='hide tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update name'>
								<i class='material-icons right hover black-text'>mode_edit</i>
							</a>
							<span class='card-title activator grey-text text-darken-4' for='name'>${data[0][7]} ${data[0][8]} ${data[0][9]}</span>
							<div class='divider'></div>
							<table>
								<tr>
									<td class='bold' style='width:120px'><span style='width:80%;display: inline-block;'><i class='mdi-communication-email cyan-text text-darken-2'></i> Email: </span></td>
									<td class='grey-text truncate' for='email'>${data[0][1]}</td>
									<td>
										<a data-for='email' data-cmd='updateAdmin' data-value='${data[0][5]}' data-name='${data[0][7]} ${data[0][8]} ${data[0][9]}' data-node='${data[0][0]}' data-prop='Email' class=' hide tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update email'>
											<i class='material-icons right hover black-text'>mode_edit</i>
										</a>
									</td>
								</tr>
								<tr>
									<td class='bold'><span style='width:80%;display: inline-block;'><i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Date of Birth: </span></td>
									<td class='grey-text truncate' for='username'>${data[0][2]}</td>
									<td>
										<a data-for='username' data-cmd='updateAdmin' data-value='${data[0][2]}' data-name='${data[0][7]} ${data[0][8]} ${data[0][9]}' data-node='${data[0][0]}' data-prop='Username' class=' hide tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update username'>
											<i class='material-icons right hover black-text'>mode_edit</i>
										</a>
									</td>
								</tr>
								<tr>
									<td class='bold'><span style='width:80%;display: inline-block;' class='truncate'><i class='mdi-action-verified-user cyan-text text-darken-2'></i> Gender</span></td>
									<td></td>
									<td>
										<a data-cmd='updateAdmin' data-name='${data[0][7]} ${data[0][8]} ${data[0][9]}' data-node='${data[0][0]}' data-prop='Password' class=' hide tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update password'>
											<i class='material-icons right hover black-text'>mode_edit</i>
										</a>
									</td>
								</tr>
							</table>
						</div>
					</div>`;
		$("#display_newAdmin").html(content);
	},
}

relationshipManager = {
	ini:function(){
		this.add();
	},
	add:function(){
		$("#form_registerRM").validate({
			rules: {
				field_givenname: {required: true,maxlength: 50},
				field_middlename: {required: true,maxlength: 50},
				field_familyname: {required: true,maxlength: 50},
				field_dateofbirth: {required: true,maxlength: 50},
				field_gender: {required: true,maxlength: 50},
				field_address: {required: true,maxlength: 300},
				field_contact: {required: true,maxlength: 50},
				field_email: {required: true,maxlength: 50,checkEmail:true,validateEmail:true},
				field_password: {required: true,maxlength: 50,checkPassword:true,validatePassword:true},
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
				var data = system.ajax('../assets/harmony/Process.php?set-newRM',_form);
				data.done(function(data){
					if(data == 1){
						Materialize.toast('Saved.',4000);
						App.handleLoadPage("#cmd=index;content=_relationship_manager");
					}
					else{
						Materialize.toast('Cannot process request.',4000);
					}
				});
			}
		}); 
	},
	get:function(id){
		if((typeof id == null) || (id == undefined)){
			var data = system.html('../assets/harmony/Process.php?get-allRM');
			return data.responseText;
		}
		else{
			var data = system.ajax('../assets/harmony/Process.php?get-RM',id);
			return data.responseText;
		}
	},
	list:function(){
		let data = JSON.parse(this.get());
		let content = "";
		let branchList = JSON.parse(branch.get());
		let branchLocation = "";

		$.each(data,function(i,v){
			branchLocation = system.searchJSON(branchList,0,v[9]);
			branchLocation = (branchLocation.length>0)?branchLocation[0][1]:'Not assigned';
			content += `<tr>
							<td width="10%">
								<img src="../assets/images/profile/${v[10]}" class="circle left" width="35px">
							</td>
							<td width="40%">
								<span class=""> ${v[1]} ${v[2]} ${v[3]}</span>
							</td>
							<td width="40%">
								${branchLocation}
							</td>
							<td width="10%">
								<a class="waves-effect waves-orange orange-text right" href="#cmd=index;content=_account_relationship_manager;${v[0]}"><i class="material-icons grey-text">chevron_right</i></a>
							</td>
						</tr>`;
		});

		content = `<table class='table bordered'>
						<thead class='grey lighten-4'>
							<tr>
								<th></th><th>Name</th><th>Branch</th><th></th>
							</tr>
						</thead>
						<tbody>${content}</tbody></table>`;
		$("#display_list").html(content);
	},
	display:function(){
		let id = window.location.hash.substring(1).split(';');
		let data = JSON.parse(this.get(id[2]));
		let rd = JSON.parse(regionalDirector.get()), rdList = '', rdBranch = '';
		let rdConfirm = "";
		let branchList = JSON.parse(branch.get()), rmBranch = '';
		let branchLocation = system.searchJSON(branchList,0,data[9]);

		sales.rm_chart(id[2]);
		sales.rm_list(id[2]);

		$.each(rd,function(i,v){
			rdBranch = system.searchJSON(branchList,0,v[0]);
			rdBranch = (rdBranch.length>0)?rdBranch[0][1]:'Not assigned';
			rdList += `<tr>
							<td width='20%'><img src="../assets/images/profile/${v[10]}" alt="" class="circle responsive-img profile-image" ></td>
							<td width='70%'>${v[1]} ${v[2]} ${v[3]}</br><small>${rdBranch}</small></td>
							<td><a data-cmd='action_reassign' data-node='${v[0]}' class='btn-floating waves-effect waves-light right orange z-depth-0'><i class='material-icons'>folder_shared</i></a></td>
						</tr>`;
		})

		$.each(branchList,function(i,v){
			rmBranch += `<tr>
							<td width='70%'>${v[1].replace('UnionBank of the Philippines ','')}</td>
							<td><a data-cmd='action_branch' data-node='${v[0]}' class='btn-floating waves-effect waves-light right orange z-depth-0'><i class='material-icons'>account_balance</i></a></td>
						</tr>`;
		});

		let data_branch = (data[9] == 'branch')?`<a data-cmd='modal_branch'>No branch assigned</a>`:branchLocation[0][1];

		let content = `<ul class="collection">
							<li class="collection-item avatar">
								<img src="../assets/images/profile/avatar.png" alt="" class="circle responsive-img profile-image" >
								<span class="title bold" style='font-size: 20px;'>
									${data[1]} ${data[2]} ${data[3]} 
									<a class='tooltipped btn-floating waves-effect waves-light right orange z-depth-0' data-cmd='modal_reassign' data-position="left" data-tooltip="Reassign to Regional Director"><i class="material-icons">low_priority</i></a>
								</span><br/>
								<ul class="collapsible z-depth-0" data-collapsible="accordion">
									<li>
										<div class="collapsible-header">
											<i class="material-icons left">location_on</i> ${data_branch}
										</div>
									</li>
									<li>
										<div class="collapsible-header">
											<i class="material-icons left">work</i> ${data[0].substring(0,6)}
										</div>
									</li>
									<li>
										<div class="collapsible-header">
											<i class="material-icons">more_horiz</i>Other information
										</div>
										<div class="collapsible-body">
											<table>
												<tr>
													<td class='bold'>Birthdate</td>
													<td>${data[4]}</td>
												</tr>
												<tr>
													<td class='bold'>Gender</td>
													<td>${data[5]}</td>
												</tr>
												<tr>
													<td class='bold'>Address</td>
													<td>${data[6]}</td>
												</tr>
												<tr>
													<td class='bold'>Email</td>
													<td>${data[7]}</td>
												</tr>
												<tr>
													<td class='bold'>Contact</td>
													<td>${data[8]}</td>
												</tr>
											</table>
										</div>
									</li>
								</ul>
							</li>
						</ul>`;
		$("#display_details .account").html(content);

		$("a[data-cmd='modal_reassign']").on('click',function(){
			$("#modal_confirm").html(`<div class='row'><h5 class="col s10 offset-s1">Select Regional Director</h5></div>
			 							<table class='striped'>${rdList}</table>`);
			$('#modal_confirm').modal('open');
			relationshipManager.update_reassign(id[2])
		});

		$("a[data-cmd='modal_branch']").on('click',function(){
			$("#modal_confirm").html(`<div class='row'><h5 class="col s10 offset-s1">Select Branch</h5></div>
			 							<table class='striped'>${rmBranch}</table>`);
			$('#modal_confirm').modal('open');
			relationshipManager.update_branch(id[2])
		});
	},
	update_reassign:function(id){
		$("a[data-cmd='action_reassign']").on('click',function(e){
			var data = system.ajax('../assets/harmony/Process.php?set-rmReassign',[id,$(this).data('node')]);
			data.done(function(data){
				if(data == 1){
					Materialize.toast('Success.',4000);
					window.location.reload();
				}
				else{
					Materialize.toast('Cannot process request.',4000);
				}
			});
		})
	},
	update_branch:function(id){
		$("a[data-cmd='action_branch']").on('click',function(e){
			var data = system.ajax('../assets/harmony/Process.php?update-rmBranch',[id,$(this).data('node')]);
			data.done(function(data){
				if(data == 1){
					Materialize.toast('Success.',4000);
					window.location.reload();
				}
				else{
					Materialize.toast('Cannot process request.',4000);
				}
			});
		})
	}
}

client = {
	ini:function(){
		this.add();
	},
	add:function(){
		$("#form_registerClient").validate({
			rules: {
				field_givenname: {required: true,maxlength: 50},
				field_middlename: {required: true,maxlength: 50},
				field_familyname: {required: true,maxlength: 50},
				field_dateofbirth: {required: true,maxlength: 50},
				field_gender: {required: true,maxlength: 50},
				field_address: {required: true,maxlength: 300},
				field_contact: {required: true,maxlength: 50},
				field_email: {required: true,maxlength: 50,checkEmail:true,validateEmail:true},
				field_occupation: {required: true,maxlength: 300},
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
				var data = system.ajax('../assets/harmony/Process.php?set-newClient',_form);
				data.done(function(data){
					if(data == 1){
						Materialize.toast('Saved.',4000);
						App.handleLoadPage("#cmd=index;content=_clients");
					}
					else{
						Materialize.toast('Cannot process request.',4000);
					}
				});
			}
		}); 
	},
	get:function(id){
		if((typeof id == null) || (id == undefined)){
			var data = system.html('../assets/harmony/Process.php?get-allClient');
			return data.responseText;
		}
		else{
			var data = system.ajax('../assets/harmony/Process.php?get-client',id);
			return data.responseText;
		}
	},
	list:function(){
		let data = JSON.parse(this.get());
		let content = "";
		$.each(data,function(i,v){
			content += `<tr>
							<td width="10%">
								<img src="../assets/images/profile/avatar.png" class="circle left" width="35px">
							</td>
							<td width="40%">
								<span class=""> ${v[1]} ${v[2]} ${v[3]}</span>
							</td>
							<td width="20%">
								${v[9]}
							</td>
							<td width="30%">
								${v[12]}
							</td>
							<td width="10%">
								<a class="waves-effect waves-orange orange-text right" href="#cmd=index;content=_account_client;${v[0]}"><i class="material-icons grey-text">chevron_right</i></a>
							</td>
						</tr>`;
		});

		content = `<table class='table bordered'>
						<thead class='grey lighten-4'>
							<tr>
								<th></th><th>Name</th><th>Occupation</th><th>Date</th><th></th>
							</tr>
						</thead>
						<tbody>${content}</tbody></table>`;
		$("#display_list").html(content);
	},
	display:function(){
		let id = window.location.hash.substring(1).split(';');
		let data = JSON.parse(this.get(id[2]));

		let plans = JSON.parse(this.getPlan(id[2]));
		// this.listPlan(plans);

		let content = `<ul class="collection">
							<li class="collection-item avatar">
								<img src="../assets/images/profile/avatar.png" alt="" class="circle responsive-img profile-image" >
								<span class="title bold" style='font-size: 20px;'>${data[0][1]} ${data[0][2]} ${data[0][3]}</span><br/>
								<ul class="collapsible z-depth-0" data-collapsible="accordion">
									<li>
										<table>
											<tr>
												<td class='bold'>Occupation</td>
												<td>${data[0][9]}</td>
											</tr>
											<tr>
												<td class='bold'>Birthdate</td>
												<td>${data[0][4]}</td>
											</tr>
											<tr>
												<td class='bold'>Gender</td>
												<td>${data[0][5]}</td>
											</tr>
											<tr>
												<td class='bold'>Address</td>
												<td>${data[0][6]}</td>
											</tr>
											<tr>
												<td class='bold'>Email</td>
												<td>${data[0][7]}</td>
											</tr>
											<tr>
												<td class='bold'>Contact</td>
												<td>${data[0][8]}</td>
											</tr>
										</table>
									</li>
								</ul>
							</li>
						</ul>`;

		$("#display_details .account").html(content);
		$("#display_addPlan").html(`<button data-cmd='modal_addPlan' data-node='${id[2]}' class='btn orange waves-effect waves-light right round-button z-depth-0' type='submit'>Add Plan</button>`);
		

		plan.check(id[2]);
	},
	getPlan:function(id){
		var data = system.ajax('../assets/harmony/Process.php?get-purchasedPlan',id);
		return data.responseText;
	},
	listPlan:function(data){
		if(data.length>0){

		}
		else{
			content = `<div class="center">
							<div class="divider"></div>
							<h5>No plans</h5>
						</div>`;
		}

		$("#display_listPlan").html(content);
	}
}

regionalDirector = {
	ini:function(){
		this.add();
	},
	add:function(){
		$("#form_registerRD").validate({
			rules: {
				field_givenname: {required: true,maxlength: 50},
				field_middlename: {required: true,maxlength: 50},
				field_familyname: {required: true,maxlength: 50},
				field_dateofbirth: {required: true,maxlength: 50},
				field_gender: {required: true,maxlength: 50},
				field_address: {required: true,maxlength: 300},
				field_contact: {required: true,maxlength: 50},
				field_email: {required: true,maxlength: 50,checkEmail:true,validateEmail:true},
				field_password: {required: true,maxlength: 50,checkPassword:true,validatePassword:true},
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
				var data = system.ajax('../assets/harmony/Process.php?set-newRD',_form);
				data.done(function(data){
					if(data == 1){
						Materialize.toast('Saved.',4000);
						App.handleLoadPage("#cmd=index;content=_regional_director");
					}
					else{
						Materialize.toast('Cannot process request.',4000);
					}
				});
			}
		}); 
	},
	get:function(id){
		if((typeof id == null) || (id == undefined)){
			var data = system.html('../assets/harmony/Process.php?get-allRD');
			return data.responseText;
		}
		else{
			var data = system.ajax('../assets/harmony/Process.php?get-RD',id);
			return data.responseText;
		}
	},
	list:function(){
		let data = JSON.parse(this.get());
		let content = "";
		let branchList = JSON.parse(branch.get());
		let branchLocation = "";

		$.each(data,function(i,v){
			branchLocation = system.searchJSON(branchList,0,v[9]);
			branchLocation = (branchLocation.length>0)?branchLocation[0][1]:'Not assigned';

			content += `<tr>
							<td width="10%">
								<img src="../assets/images/profile/avatar.png" class="circle left" width="35px">
							</td>
							<td width="40%">
								<span class=""> ${v[1]} ${v[2]} ${v[3]}</span>
							</td>
							<td width="40%">
								${branchLocation}
							</td>
							<td width="10%">
								<a class="waves-effect waves-orange orange-text right" href="#cmd=index;content=_account_regional_director;${v[0]}"><i class="material-icons grey-text">chevron_right</i></a>
							</td>
						</tr>`;
		});

		content = `<table class='table bordered'>
						<thead class='grey lighten-4'>
							<tr>
								<th></th><th>Name</th><th>Branch</th><th></th>
							</tr>
						</thead>
						<tbody>${content}</tbody></table>`;
		$("#display_list").html(content);
	},
	display:function(){
		let id = window.location.hash.substring(1).split(';');
		let data = JSON.parse(this.get(id[2]));
		let branchList = JSON.parse(branch.get());
		let branchLocation = system.searchJSON(branchList,0,data[9]);
		// sales.rm_chart(id[2]);
		// sales.rm_list(id[2]);

		$.each(branchList,function(i,v){
			branchList += `<option value="${v[0]}">${v[1].replace('UnionBank of the Philippines ','')}</option>`;
		});

		let data_branch = (data[9] == 'branch')?`<div class="input-field" style='margin-top: -10PX;'>
												<select ><option selected >Not assigned</option>${branchList}</select>
											</div>`:branchLocation[0][1];

		let content = `<ul class="collection">
							<li class="collection-item avatar">
								<img src="../assets/images/profile/avatar.png" alt="" class="circle responsive-img profile-image" >
								<span class="title bold" style='font-size: 20px;'>${data[1]} ${data[2]} ${data[3]}</span><br/>
								<ul class="collapsible z-depth-0" data-collapsible="accordion">
									<li>
										<div class="collapsible-header">
											<i class="material-icons left">location_on</i> ${data_branch}
										</div>
									</li>
									<li>
										<div class="collapsible-header">
											<i class="material-icons left">work</i> ${data[0].substring(0,6)}
										</div>
									</li>
									<li>
										<div class="collapsible-header">
											<i class="material-icons">more_horiz</i>Other information
										</div>
										<div class="collapsible-body">
											<table>
												<tr>
													<td class='bold'>Birthdate</td>
													<td>${data[4]}</td>
												</tr>
												<tr>
													<td class='bold'>Gender</td>
													<td>${data[5]}</td>
												</tr>
												<tr>
													<td class='bold'>Address</td>
													<td>${data[6]}</td>
												</tr>
												<tr>
													<td class='bold'>Email</td>
													<td>${data[7]}</td>
												</tr>
												<tr>
													<td class='bold'>Contact</td>
													<td>${data[8]}</td>
												</tr>
											</table>
										</div>
									</li>
								</ul>
							</li>
						</ul>`;
		$("#display_details .account").html(content);
		this.update(id[2]);
		this.getManagingRM(id[2]);
	},
	update:function(id){
		$("select").on('change',function(e){
			var data = system.ajax('../assets/harmony/Process.php?update-rdBranch',[id,$(this).val()]);
			data.done(function(data){
				if(data == 1){
					Materialize.toast('Saved.',4000);
					window.location.reload();
				}
				else{
					Materialize.toast('Cannot process request.',4000);
				}
			})
		})
	},
	getManagingRM:function(id){
		let content = "";
		let branchList = JSON.parse(branch.get());
		let branchLocation = "";
		var data = system.ajax('../assets/harmony/Process.php?get-RDManagingRM',id);
		data.done(function(data){
			data = JSON.parse(data);

			if(data.length>0){
				$.each(data,function(i,v){
					branchLocation = system.searchJSON(branchList,0,v[12]);
					branchLocation = (branchLocation.length>0)?branchLocation[0][1]:'Not assigned';
					content += `<tr>
									<td width="10%">
										<img src="../assets/images/profile/${v[13]}" class="circle left" width="35px">
									</td>
									<td width="40%">
										<span class=""> ${v[4]} ${v[5]} ${v[6]}</span>
									</td>
									<td width="40%">
										${branchLocation}
									</td>
									<td width="10%">
										<a class="waves-effect waves-orange orange-text right" href="#cmd=index;content=_account_regional_director;${v[3]}"><i class="material-icons grey-text">chevron_right</i></a>
									</td>
								</tr>`;
				});
				content = `<h5>Managing Relationship Managers</h5>
								<table class='table bordered'>
								<thead class='grey lighten-4'>
									<tr>
										<th></th><th>Name</th><th>Branch</th><th></th>
									</tr>
								</thead>
								<tbody>${content}</tbody></table>`;
			}
			else{
				content = `<div class="center">
							<div class="divider"></div>
							<h5>No account</h5>
						</div>`;
			}
			$("#display_managingRM").html(content);
		})
	}
}

plan = {
	ini:function(){
		this.add();
	},
	add:function(){
		$("#form_addPlan").validate({
			rules: {
				field_plan: {required: true,maxlength: 50},
				field_description: {required: true,maxlength: 1000},
				field_price: {required: true,maxlength: 50},
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
				var data = system.ajax('../assets/harmony/Process.php?set-newPlan',_form);
				data.done(function(data){
					if(data == 1){
						Materialize.toast('Saved.',4000);
						App.handleLoadPage("#cmd=index;content=_plans");
					}
					else{
						Materialize.toast('Cannot process request.',4000);
					}
				});
			}
		}); 
	},
	get:function(id){
		if((typeof id == null) || (id == undefined)){
			var data = system.html('../assets/harmony/Process.php?get-allPlans');
			return data.responseText;
		}
		else{
			var data = system.ajax('../assets/harmony/Process.php?get-plan',id);
			return data.responseText;
		}
	},
	list:function(){
		let data = JSON.parse(this.get());
		let content = "";
		$.each(data,function(i,v){
			console.log(v);
			content += `<tr>
							<td width="20%">
								<span class=""> ${v[1]}</span>
							</td>
							<td width="60%">
								${v[2]}
							</td>
							<td width="20%">
								${v[3]}
							</td>
						</tr>`;
		});

		content = `<table class='table bordered'>
						<thead class='grey lighten-4'>
							<tr>
								<th>Plan</th><th>Desctiption</th><th>Price</th>
							</tr>
						</thead>
						<tbody>${content}</tbody></table>`;
		$("#display_list").html(content);
	},
	check:function(id){
		let content = "";
		let allplans = JSON.parse(this.get());

		$.each(allplans,function(i,v){
			content += `<tr>
							<td width='70%'>${v[1]}</br><small>${v[3]}</small></td>
							<td><a data-cmd='action_avail' data-node='${v[0]}' class='btn-floating waves-effect waves-light right orange z-depth-0'><i class='material-icons'>check</i></a></td>
						</tr>`;
		});

		$("button[data-cmd='modal_addPlan']").on('click',function(){
			$("#modal_confirm").html(`<div class='row'><h5 class="col s10 offset-s1">Select Plan</h5></div>
			 							<table class='striped'>${content}</table>`);
			$('#modal_confirm').modal('open');
			plan.avail(id);
		});
	},
	avail:function(id){
		$("a[data-cmd='action_avail']").on('click',function(e){
			var data = system.ajax('../assets/harmony/Process.php?avail-plan',[id,$(this).data('node')]);
			data.done(function(data){
				if(data == 1){
					Materialize.toast('Success.',4000);
					window.location.reload();
				}
				else{
					Materialize.toast('Cannot process request.',4000);
				}
			});
		})
	}
}

branch = {
	ini:function(){
		this.add();
	},
	add:function(){
		$("#form_addBranch").validate({
			rules: {
				field_branch: {required: true,maxlength: 50},
				field_location: {required: true,maxlength: 1000},
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
				var data = system.ajax('../assets/harmony/Process.php?set-newBranch',_form);
				data.done(function(data){
					if(data == 1){
						Materialize.toast('Saved.',4000);
						App.handleLoadPage("#cmd=index;content=_branch");
					}
					else{
						Materialize.toast('Cannot process request.',4000);
					}
				});
			}
		}); 
	},
	get:function(id){
		if((typeof id == null) || (id == undefined)){
			var data = system.html('../assets/harmony/Process.php?get-allBranch');
			return data.responseText;
		}
		else{
			var data = system.ajax('../assets/harmony/Process.php?get-plan',id);
			return data.responseText;
		}
	},
	list:function(){
		let data = JSON.parse(this.get());
		let content = "";
		$.each(data,function(i,v){
			console.log(v);
			content += `<tr>
							<td width="20%">
								<span class=""> ${v[1]}</span>
							</td>
							<td width="60%">
								${v[2]}
							</td>
						</tr>`;
		});

		content = `<table class='table bordered'>
						<thead class='grey lighten-4'>
							<tr>
								<th>Branch</th><th>Location</th>
							</tr>
						</thead>
						<tbody>${content}</tbody></table>`;
		$("#display_list").html(content);
	},
}

sales = {
	linechart:function(){
		let ctx = $("#chart_sales");
		let chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"],
				datasets: [{
					label: 'Sales 1',
					data: [12, 19, 3, 5, 2, 3],
					backgroundColor: [
						'rgba(14, 0, 89, 0.2)',
						'rgba(14, 0, 89, 0.2)',
						'rgba(14, 0, 89, 0.2)',
						'rgba(14, 0, 89, 0.2)',
						'rgba(14, 0, 89, 0.2)',
						'rgba(14, 0, 89, 0.2)'
					],
					borderColor: [
						'rgba(14, 0, 89, 1)',
						'rgba(14, 0, 89, 1)',
						'rgba(14, 0, 89, 1)',
						'rgba(14, 0, 89, 1)',
						'rgba(14, 0, 89, 1)',
						'rgba(14, 0, 89, 1)'
					],
					borderWidth: 1
				},
				{
					label: 'Sales 2',
					data: [9, 7, 11, 8, 1, 13],
					backgroundColor: [
						'rgba(247, 127, 0, 0.2)',
						'rgba(247, 127, 0, 0.2)',
						'rgba(247, 127, 0, 0.2)',
						'rgba(247, 127, 0, 0.2)',
						'rgba(247, 127, 0, 0.2)',
						'rgba(247, 127, 0, 0.2)'
					],
					borderColor: [
						'rgba(247, 127, 0, 1)',
						'rgba(247, 127, 0, 1)',
						'rgba(247, 127, 0, 1)',
						'rgba(247, 127, 0, 1)',
						'rgba(247, 127, 0, 1)',
						'rgba(247, 127, 0, 1)'
					],
					borderWidth: 1
				}]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				}
			}
		});
	},
	barchart:function(){
		let ctx = $("#chart_totalSales");
		let chart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: ["M", "T", "W", "Th", "F", "S"],
				datasets: [{
					label: 'Sales 1',
					data: [12, 19, 3, 5, 2, 3],
					backgroundColor: 'rgba(14, 0, 89, 1)',
				},
				{
					label: 'Sales 2',
					data: [9, 7, 11, 8, 1, 13],
					backgroundColor: 'rgba(247, 127, 0, 1)',
				}]
			},
		});
	},
	get_rm:function(id){
		var data = system.ajax('../assets/harmony/Process.php?get-salesRM',id);
		return data.responseText;
	},
	rm_chart:function(id){
		let ctx = $("#rm_sales");
		let chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"],
				datasets: [{
					label: 'Sales 1',
					data: [12, 19, 3, 5, 2, 3],
					backgroundColor: [
						'rgba(14, 0, 89, 0.2)',
						'rgba(14, 0, 89, 0.2)',
						'rgba(14, 0, 89, 0.2)',
						'rgba(14, 0, 89, 0.2)',
						'rgba(14, 0, 89, 0.2)',
						'rgba(14, 0, 89, 0.2)'
					],
					borderColor: [
						'rgba(14, 0, 89, 1)',
						'rgba(14, 0, 89, 1)',
						'rgba(14, 0, 89, 1)',
						'rgba(14, 0, 89, 1)',
						'rgba(14, 0, 89, 1)',
						'rgba(14, 0, 89, 1)'
					],
					borderWidth: 1
				},
				{
					label: 'Sales 2',
					data: [9, 7, 11, 8, 1, 13],
					backgroundColor: [
						'rgba(247, 127, 0, 0.2)',
						'rgba(247, 127, 0, 0.2)',
						'rgba(247, 127, 0, 0.2)',
						'rgba(247, 127, 0, 0.2)',
						'rgba(247, 127, 0, 0.2)',
						'rgba(247, 127, 0, 0.2)'
					],
					borderColor: [
						'rgba(247, 127, 0, 1)',
						'rgba(247, 127, 0, 1)',
						'rgba(247, 127, 0, 1)',
						'rgba(247, 127, 0, 1)',
						'rgba(247, 127, 0, 1)',
						'rgba(247, 127, 0, 1)'
					],
					borderWidth: 1
				}]
			}
		});
	},
	rm_list:function(id){
		let data = JSON.parse(this.get_rm(id));
		let content = "";

		if(data.length>0){

		}
		else{
			content = `<div class="center">
							<div class="divider"></div>
							<h5>No sales</h5>
						</div>`;
			$("#display_listSale").html(content);
		}
	}
}