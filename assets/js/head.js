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
		$.each(data,function(i,v){
			content += `<tr>
							<td width="10%">
								<img src="../assets/images/profile/${v[10]}" class="circle left" width="35px">
							</td>
							<td width="40%">
								<span class=""> ${v[1]} ${v[2]} ${v[3]}</span>
							</td>
							<td width="10%">
								${v[9]}
							</td>
							<td width="40%">
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
		sales.rm_chart(id[2]);
		sales.rm_list(id[2]);
		
		let branch = (data[9] == 'branch')?'<a>Not assigned</a>':data[9];

		let content = `<ul class="collection">
							<li class="collection-item avatar">
								<img src="../assets/images/profile/avatar.png" alt="" class="circle responsive-img profile-image" >
								<span class="title bold" style='font-size: 20px;'>${data[1]} ${data[2]} ${data[3]}</span><br/>
								<ul class="collapsible z-depth-0" data-collapsible="accordion">
									<li>
										<div class="collapsible-header">
											<i class="material-icons left">location_on</i> ${branch}
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
			console.log(v);
			content += `<tr>
							<td width="10%">
								<img src="../assets/images/profile/avatar.png" class="circle left" width="35px">
							</td>
							<td width="40%">
								<span class=""> ${v[1]} ${v[2]} ${v[3]}</span>
							</td>
							<td width="10%">
								${v[9]}
							</td>
							<td width="20%">
								${v[12]}
							</td>
							<td width="30%">
								<a class="waves-effect waves-orange orange-text right" href="#cmd=index;content=account;${v[0]}"><i class="material-icons grey-text">chevron_right</i></a>
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

		$.each(data,function(i,v){
			content += `<tr>
							<td width="10%">
								<img src="../assets/images/profile/avatar.png" class="circle left" width="35px">
							</td>
							<td width="40%">
								<span class=""> ${v[1]} ${v[2]} ${v[3]}</span>
							</td>
							<td width="10%">
								${v[9]}
							</td>
							<td width="40%">
								<a class="waves-effect waves-orange orange-text right" href="#cmd=index;content=account;${v[0]}"><i class="material-icons grey-text">chevron_right</i></a>
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
		console.log('d');
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
		console.log('d');
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