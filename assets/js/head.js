$(document).ready(function(){
	$('.modal').modal();
});

account = {
	ini:function(){
		var data = this.get();
		this.display(JSON.parse(data));
		// this.list();
		// this.add();

		$("#log-out").on('click',function(){
		    login.kill();
		});
	},
	get:function(){
		var data = system.html('../assets/harmony/Process.php?get-account');
		return data.responseText;
	},
	management:function(){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addAccount").each(function(i,content){
			$("#modal .modal-content").html(content);
			$('#modal').modal('open');			
		});
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
		account.update();
		account.updatePicture();
	},
	list:function(){
		let content = "";
		let data = system.html('../assets/harmony/Process.php?get-listAdmin');
		let admin = account.get();
		admin = JSON.parse(admin);
		let actions = "", status = "";
		data.done(function(data){
			data = JSON.parse(data);
			$.each(data,function(i,v){

				if(admin[0][0] != v[0]){
					if(Number(v[6]) == 1){
						status = "Active";
						actions = `<a data-cmd='deactivateAdmin' data-name='${v[1]}' data-node='${v[0]}' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>
									  	<i class='material-icons right hover black-text'>lock_open</i>
									</a>`;	
					}
					else{
						status = "Deactivated";
						actions = `<a data-cmd='deleteAdmin' data-name='${v[1]}' data-node='${v[0]}' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Delete account' data-cmd='update'>
									  	<i class='material-icons right hover black-text'>delete_forever</i>
									</a>
									<a data-cmd='activateAdmin' data-name='${v[1]}' data-node='${v[0]}' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>
									  	<i class='material-icons right hover black-text'>lock_outline</i>
									</a>`;	
					}					
					content += `<tr>
									<td>${v[1]}</td>
									<td>${status}</td>
									<td>${actions}</td>
								</tr>`;
				}
			})	

			content = `<table class='table bordered'>
							<tr>
								<th>Name</th><th>Status</th><th></th>
							</tr>${content}</table>`;
			$("#display_adminList").html(content);

			account.deactivate();
			account.activate();
			account.delete();
		});
	},
	add:function(){
		$("#add_admin").on('click',function(){
			var data = system.xml("pages.xml");
			$(data.responseText).find("addAccount").each(function(i,content){
				$("#modal_popUp .modal-content").html(content);
				$('#modal_popUp').modal('open');			

				$("#form_registerAdmin").validate({
				    rules: {
				        field_name: {required: true,maxlength: 50},
				        field_email: {required: true,maxlength: 50,checkEmail:true,validateEmail:true},
				        field_username: {required: true,maxlength: 50,checkUsername:true,validateUsername:true},
				        field_password: {required: true,maxlength: 50,checkPassword:true,validatePassword:true},
				        // field_capabilities: {required: true,maxlength: 500},
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
						var data = system.ajax('../assets/harmony/Process.php?set-newAdmin',_form);
						data.done(function(data){
							if(data == 1){
								var text = `<h1>Congratulations</h1>, you are now registered. You can login using <u>${_form[2]['value']}</u> as you username and <u>${_form[3]['value']}</u>
											as your password. <a href='http://localhost/kaboomRewards/login.html'>Just follow this link</a>`;
								var data = system.send_mail(_form[1]['value']+',info@rnrdigitalconsultancy.com','New admin Registration',text);
								if(data.responseText != ""){
									system.clearForm();
									Materialize.toast('Saved.',4000);
									App.handleLoadPage("#cmd=index;content=account");
								}
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			});
		});
	},
	update:function(){
		$("a[data-cmd='updateAdmin']").on('click',function(){
			let _this = this;
			var data = $(this).data();
			var content = `<h5>Change ${data.prop}</h5>
						  <form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>
						  		<label for='field_${data.prop}'>${data.prop}: </label>
						  		<input id='field_${data.prop}' value='${data.value}' type='text' name='field_${data.prop}' data-error='.error_${data.prop}'>
						  		<div class='error_${data.prop}'></div>
						  		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>
						  		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>
						  </form>`;
			$("#modal_confirm .modal-content").html(content);
			$('#modal_confirm .modal-footer').html("");			

			if(data.prop == "Name"){
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-admin',_form);
							ajax.done(function(ajax){
								if(ajax == 1){
									Materialize.toast('Name updated.',4000);
									$('#modal_confirm').modal('close');	
									$(`*[for='${data.for}']`).html(_form[0]['value']);
									$(_this).attr({'data-value':_form[0]['value']});
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}			
			else if(data.prop == "Email"){
				$('#modal_confirm').modal('open');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true,validateEmail:true},
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-admin',_form);
							ajax.done(function(ajax){
								if(ajax == 1){
									Materialize.toast('Email updated.',4000);
									$('#modal_confirm').modal('close');	
									$(`*[for='${data.for}']`).html(_form[0]['value']);
									$(_this).attr({'data-value':_form[0]['value']});
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}
			else if(data.prop == "Username"){
				$('#modal_confirm').modal('open');			
				$("#form_update").validate({
				    rules: {
				        field_Username: {required: true,maxlength: 50,checkUsername:true,validateUsername:true},
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-admin',_form);
							ajax.done(function(ajax){
								if(ajax == 1){
									Materialize.toast('Username updated.',4000);
									$('#modal_confirm').modal('close');	
									$(`*[for='${data.for}']`).html(_form[0]['value']);
									$(_this).attr({'data-value':_form[0]['value']});
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}
			else if(data.prop == "Password"){
				$('#modal_confirm').modal('open');			
				$('#modal_confirm .modal-footer').remove();			
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
						var data = system.ajax('../assets/harmony/Process.php?update-admin',_form);
						data.done(function(data){
							if(data == 1){
								$('#modal_confirm').modal('close');
								Materialize.toast('Password updated.',1000,'',function(){
									location.reload();									
								});
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
		$("a[data-cmd='updateAdminPicture']").on('click',function(){
			var data = $(this).data();
			var picture = "../assets/images/avatar.jpg";
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
								<button class='btn blue btn-flat hidden right white-text' data-cmd='save' type='button'>
									Save
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
								    	$(this).html("Uploading...").addClass('disabled');
								    	if(status){
											var data = system.ajax('../assets/harmony/Process.php?update-adminPicture',["picture",$image.cropper("getDataURL")]);
											data.done(function(data){
												Materialize.toast('Picture has been changed.',4000);
												data = account.get();
												account.display(JSON.parse(data));
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
	deactivate:function(){
		$("a[data-cmd='deactivateAdmin']").on('click',function(){
			var id = $(this).data('node');
			var content = `Are you sure DEACTIVATE ${$(this).data('name')}'s account?<br/>
						  <label for='field_description'>Remarks: </label>
						  <textarea class='materialize-textarea' data-field='field_description' name='field_description'></textarea>`;
			$("#modal_confirm .modal-content").html(content);
			$("#modal_confirm .modal-footer").html(`<a class='waves-effect btn-flat modal-action modal-close'>Cancel</a>
													<a data-cmd='button_proceed' class='waves-effect waves-blue blue btn-flat modal-action white-text'>Proceed</a>`);
			$('#modal_confirm').modal('open');			

			$("a[data-cmd='button_proceed']").on("click",function(){
				var remarks = $("textarea[data-field='field_description']").val();
				if(remarks.length == 0){
						Materialize.toast('Remarks is required.',4000);
				}
				else if(remarks.length > 800){
						Materialize.toast('Statement is too long.',4000);
				}
				else{
					var data = system.ajax('../assets/harmony/Process.php?deactivate-admin',[id,remarks]);
					data.done(function(data){
						if(data == 1){
							Materialize.toast('Account deactivaded.',4000);
							account.list();
							$('#modal_confirm').modal('close');	
						}
						else{
							Materialize.toast('Cannot process request.',4000);
						}
					});
				}
			});
		})
	},
	activate:function(){
		$("a[data-cmd='activateAdmin']").on('click',function(){
			var id = $(this).data('node');
			$("#modal_confirm .modal-content").html("Arey you sure ACTIVATE "+$(this).data('name')+"'s account?");
			$("#modal_confirm .modal-footer").html(`<a class='waves-effect btn-flat modal-action modal-close'>Cancel</a>
													<a data-cmd='button_proceed' class='white-text waves-effect waves-blue blue btn-flat modal-action modal-close'>Proceed</a>`);
			$('#modal_confirm').modal('open');			

			$("a[data-cmd='button_proceed']").on("click",function(){
				var data = system.ajax('../assets/harmony/Process.php?activate-admin',id);
				data.done(function(data){
					console.log(data);
					if(data == 1){
						Materialize.toast('Account activaded.',4000);
						account.list();
						$('#modal_confirm').modal('close');	
					}
					else{
						Materialize.toast('Cannot process request.',4000);
					}
				});
			});
		})
	},
	delete:function(){
		$("a[data-cmd='deleteAdmin']").on('click',function(){
			var id = $(this).data('node');
			$("#modal_confirm .modal-content").html("Arey you sure DELETE "+$(this).data('name')+"'s account?");
			$("#modal_confirm .modal-footer").html(`<a class='waves-effect btn-flat modal-action modal-close'>Cancel</a>
													<a data-cmd='button_proceed' class='white-text waves-effect waves-blue blue btn-flat modal-action modal-close'>Proceed</a>`);
			$('#modal_confirm').modal('open');			

			$("a[data-cmd='button_proceed']").on("click",function(){
				var data = system.ajax('../assets/harmony/Process.php?delete-admin',id);
				data.done(function(data){
					if(data == 1){
						Materialize.toast('Account deleted.',4000);
						account.list();
						$('#modal_confirm').modal('close');	
					}
					else{
						Materialize.toast('Cannot process request.',4000);
					}
				});
			});
		})
	}
}

client = {
	ini:function(){
		client.list();
		client.add();
	},
	refresh:function(){
	    var hash = window.location.hash;
	    var hash = hash.split(';');
	    var id = hash[2];
		client.details(id);
	},
	get:function(){
		var data = system.html('../assets/harmony/Process.php?get-clients');
		return data;
	},
	list:function(){
		var content = "", search;
		var data = client.get();
		data = JSON.parse(data.responseText);
		if(data.length>0){			
			var getEmployee = system.ajax('../assets/harmony/Process.php?get-allEmployeeCount',"");
			getEmployee = JSON.parse(getEmployee.responseText);
			$.each(data,function(i,v){
				var logo = (v[7] == "")?'avatar.jpg':v[7];
				search = system.searchJSON(getEmployee,1,v[0]);
				search = (search.length > 0)?search[0][0]:0;
				content += `<tr>
								<td width='1px'>${(i+1)}. </td>
								<td><img src='../assets/images/profile/${logo}' alt='Thumbnail' class='responsive-img valign profile-image' width='100px'></td>
								<td width='400px'>${v[1]}</td>
								<td>${search}</td>
								<td width='10px'>Active</td>
								<td width='1px'>
									<a data-cmd='update' data-node='${v[0]}' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Show'>
										<i class='material-icons right hover black-text'>more_vert</i>
									</a>
								</td>
							</tr>`;
			});

			content = `<table class='table bordered' id='products'>
						<thead>
							<tr>
								<th>#</th><th>Logo</th><th>Client</th><th># of Employees</th><th>Status</th><th></th>
							</tr>
						</thead>
						</tbody>${content}</tbody>
						</table>`;
			$("#display_clientList").html(content);

			var table = $('#products').DataTable({
		        "order": [[ 0, 'asc' ]],
		        bLengthChange: false,
		        iDisplayLength: -1,
		        "drawCallback": function ( settings ) {
		            var api = this.api();
		            var rows = api.rows( {page:'current'} ).nodes();
		            var last=null;
		        }
		    });

			$('.dataTable').on('click', 'tbody tr', function() {
				var data = table.row(this).data();
				data = $.parseHTML(data[5]);
				data = data[0].dataset.node;
		    	$(location).attr('href',`#cmd=index;content=focusClient;${data}`);			
			});
		}
		else{
			$("#display_clientList").html("<h5 class='center'>No Clients to show.</h5>");
		}
	},
	listGrid:function(){
		var data = system.xml("pages.xml");
		var _content = "";
		$(data.responseText).find("product").each(function(i,content){
			for(x=0;x<=100;x++){
				_content += content.innerHTML;
			}
			$("#products").html(_content);
		});
	},
	add:function(){
		$("#add_client").on('click',function(){
			var data = system.xml("pages.xml");
			$(data.responseText).find("addClient").each(function(i,content){
				$("#modal_popUp .modal-content").html(content);
				$('#modal_popUp').modal('open');		

				$("#field_password").on('focus',function(){
					$("#note_password").removeClass('zoomOut hidden').addClass("zoomIn");
				}).on('blur',function(){
					$("#note_password").removeClass('zoomIn').addClass('zoomOut hidden');
				})

				$("#form_addClient").validate({
				    rules: {
				        field_name: {required: true,maxlength: 50},
				        field_phone: {required: true,maxlength: 50},
				        field_email: {required: true,maxlength: 50,checkEmail:true,validateEmail:true},
				        field_address: {required: true,maxlength: 50},
				        field_accountName: {required: true,maxlength: 50},
				        field_accountPhone: {required: true,maxlength: 50},
				        field_accountEmail: {required: true,maxlength: 50},
				        field_username: {required: true,maxlength: 50,checkUsername:true},
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
						var data = system.ajax('../assets/harmony/Process.php?set-newClient',_form);
						data.done(function(data){
							if(data == 1){
								var text = `<h1>Congratulations</h1>, you are now registered. You can login using <u>${_form[2]['value']}</u> as you username and <u>${_form[5]['value']}</u>
											as your password. <a href='http://localhost/kaboomRewards/login.html'>Just follow this link</a>`;
								var data = system.send_mail('rufo.gabrillo@gmail.com,info@rnrdigitalconsultancy.com','Employer Registration',text);
								if(data.responseText != ""){
									Materialize.toast('Saved.',4000);
									system.clearForm();
									client.refresh();
								}
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				});
			});
		})
	},
	companyProfile(data){
		data = data[0];
		console.log('xx');
		if(Number(data[5]) == 1){
			status = "Active";
			var actions = `<a data-cmd='deactivateEmployer' data-name='${data[1]}' data-node='${data[0]}' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>
						  	<i class='material-icons right hover black-text'>lock_open</i>
						  </a>`;	
		}
		else{
			status = "Deactivated";
			var actions = `<a data-cmd='activateEmployer' data-name='${data[1]}' data-node='${data[0]}' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>
						  	<i class='material-icons right hover black-text'>lock</i>
						  </a>`;	
		}

		var profile = ((data[7] == "") || data[7] == null)?"avatar.jpg":data[7];

		content = `<div id='profile-card' class='card'>
				    <div class='card-image waves-effect waves-block waves-light' style='max-height: 70px;'>
				        <img class='activator' src='../assets/images/user-bg.jpg' alt='user background'>
				    </div>
				    <div class='card-content'>
				        <div class=' responsive-img activator card-profile-image circle' style='margin-top: -65px;'>
				        	<img src='../assets/images/profile/${profile}' alt='' class='circle'>
				        	<a data-cmd='updateCompanyLogo' data-value='${profile}' data-name='${data[1]}' data-node='${data[0]}' data-prop='Picture' class='hide btn waves-effect white-text no-shadow black' style='font-size: 10px;z-index: 1;padding: 0 12px;top:40px;'>Change</a>
						</div>
						<a data-for='companyName' data-cmd='updateCompany' data-value='${data[1]}' data-name='${data[1]}' data-node='${data[0]}' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update account'>
							<i class='material-icons right hover black-text'>mode_edit</i>
						</a>
				        <span for='companyName' class='card-title activator grey-text text-darken-4'>${data[1]} </span>
						<div class='divider'></div>
						<table>
							<tr>
								<td class='bold truncate' style='width:120px'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Phone:</td>
								<td class='grey-text truncate' for='companyPhone'> ${data[4]}</td>
								<td>
									<a data-for='companyPhone' data-cmd='updateCompany' data-value='${data[4]}' data-name='${data[1]}' data-node='${data[0]}' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update phone'>
										<i class='material-icons right hover black-text'>mode_edit</i>
									</a>
								</td>
							</tr>
							<tr>
								<td class='bold truncate' style='width:120px'><i class='mdi-communication-email cyan-text text-darken-2'></i> Email:</td>
								<td class='grey-text truncate' for='companyEmail'> ${data[3]}</td>
								<td>
									<a data-for='companyEmail' data-cmd='updateCompany' data-value='${data[3]}' data-name='${data[1]}' data-node='${data[0]}' data-prop='Email' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update email'>
										<i class='material-icons right hover black-text'>mode_edit</i>
									</a>
								</td>
							</tr>
							<tr>
								<td class='bold truncate' style='width:120px'><i class='mdi-action-room cyan-text text-darken-2'></i> Address:</td>
								<td class='grey-text truncate' for='companyAddress'> ${data[2]}</td>
								<td>
									<a data-for='companyAddress' data-cmd='updateCompany' data-value='${data[2]}' data-name='${data[1]}' data-node='${data[0]}' data-prop='Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update address'>
										<i class='material-icons right hover black-text'>mode_edit</i>
									</a>
								</td>
							</tr>
						</table>
				    </div>
				</div>`;
		$("#companyProfile").html(content);	
	},
	accountProfile(data){
		data = data[0];
		if(Number(data[8]) == 1){
			status = "Active";
			var actions = `<a data-for='accountStatus' data-cmd='deactivateEmployer' data-name='${data[2]}' data-node='${data[0]}' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>
						  	<i class='material-icons right hover black-text'>lock_open</i>
						  </a>`;
		}
		else{
			status = "Deactivated";
			var actions = `<a data-for='accountStatus' data-cmd='activateEmployer' data-name='${data[2]}' data-node='${data[0]}' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>
						  	<i class='material-icons right hover black-text'>lock</i>
						  </a>`;
		}

		var profile = ((data[7] == "") || data[7] == null)?"avatar.jpg":data[7];

		content = `<div id='profile-card' class='card'>
				    <div class='card-image waves-effect waves-block waves-light' style='max-height: 70px;'>
				        <img class='activator' src='../assets/images/user-bg.jpg' alt='user background'>
				    </div>
				    <div class='card-content'>
				        <div class=' responsive-img activator card-profile-image circle' style='margin-top: -65px;'>
				        	<img src='../assets/images/profile/${profile}' alt='' class='circle'>
				        	<a data-cmd='updateEmployerPicture' data-value='${profile}' data-name='${data[2]}' data-node='${data[0]}' data-prop='Picture' class='hide btn waves-effect white-text no-shadow black' style='font-size: 10px;z-index: 1;padding: 0 12px;top:40px;'>Change</a>
						</div>
						<a data-for='accountName' data-cmd='updateEmployer' data-value='${data[2]}' data-name='${data[2]}' data-node='${data[0]}' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update account'>
							<i class='material-icons right hover black-text'>mode_edit</i>
						</a>
				        <span class='card-title activator grey-text text-darken-4' for='accountName'>${data[2]} </span>
						<div class='divider'></div>
						<table>
							<tr>
								<td class='bold truncate' style='width:120px'><i class='mdi-action-perm-identity cyan-text text-darken-2'></i> HR Officer</td>
								<td class='grey-text truncate'></td>
								<td></td>
							</tr>
							<tr>
								<td class='bold truncate' style='width:120px'><i class='mdi-action-info-outline cyan-text text-darken-2'></i> Status:</td>
								<td class='grey-text truncate' for='accountStatus'> ${status} </td>
								<td>${actions}</td>
							</tr>
							<tr>
								<td class='bold truncate' style='width:120px'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Phone:</td>
								<td class='grey-text truncate' for='accountPhone'> ${data[4]}</td>
								<td>
									<a data-for='accountPhone' data-cmd='updateEmployer' data-value='${data[4]}' data-name='${data[1]}' data-node='${data[0]}' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update phone'>
										<i class='material-icons right hover black-text'>mode_edit</i>
									</a>
								</td>
							</tr>
							<tr>
								<td class='bold truncate' style='width:120px'><i class='mdi-communication-email cyan-text text-darken-2'></i> Email:</td>
								<td class='grey-text truncate' for='accountEmail'> ${data[3]}</td>
								<td>
									<a data-for='accountEmail' data-cmd='updateEmployer' data-value='${data[3]}' data-name='${data[1]}' data-node='${data[0]}' data-prop='Email' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update email'>
										<i class='material-icons right hover black-text'>mode_edit</i>
									</a>
								</td>
							</tr>
							<tr>
								<td class='bold truncate' style='width:120px'><i class='mdi-action-verified-user cyan-text text-darken-2'></i> Username:</td>
								<td class='grey-text truncate' for='accountUsername'> ${data[5]}</td>
								<td>
									<a data-for='accountUsername' data-cmd='updateEmployer' data-value='${data[5]}' data-name='${data[1]}' data-node='${data[0]}' data-prop='Username' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update account'>
										<i class='material-icons right hover black-text'>mode_edit</i>
									</a>
								</td>
							</tr>
							<tr>
								<td class='bold truncate' style='width:120px'><i class='mdi-action-verified-user cyan-text text-darken-2'></i> Password</td>
								<td class='grey-text truncate'></td>
								<td>
									<button disabled class='tooltipped btn-floating waves-effect black-text no-shadow right'>
										<i class='material-icons right hover black-text'>mode_edit</i>
									</button>
								</td>
							</tr>
						</table>
				    </div>
				</div>`;
		$("#accountProfile").html(content);	
	},
	details:function(id){
		client.optionConfirm(id);
		var content = "";
		var getEmployer = system.ajax('../assets/harmony/Process.php?get-clientDetails',id);
		getEmployer.done(function(data_getEmployer){
			data_getEmployer = JSON.parse(data_getEmployer);
			var getEmployer = system.ajax('../assets/harmony/Process.php?get-employerByID',id);
			getEmployer = JSON.parse(getEmployer.responseText);

			var getEmployees = system.ajax('../assets/harmony/Process.php?get-employeeByID',id);
			getEmployees = JSON.parse(getEmployees.responseText);

			client.companyProfile(data_getEmployer);
			client.accountProfile(getEmployer);

			if(getEmployees.length > 0){
				employee.list(id);
			}
			else{
				$("#employees").html("<div class='col s12 center'>No employees yet</div>");
			}
		});

		$("#options a[data-cmd='add_employee']").on('click',function(){
			employee.add(id);
		});

		$("#options a[data-cmd='bulk_upload']").on('click',function(){
	    	$(location).attr('href','#cmd=index;content=upload_employee;'+id);			
		});

		$("#options a[data-cmd='points_upload']").on('click',function(){
	    	$(location).attr('href','#cmd=index;content=upload_points;'+id);			
		});

		client.deactivate();
		client.activate();
		client.update();
		client.updatePicture();
	},
	update:function(){
		$("a[data-cmd='updateEmployer']").on('click',function(){
			let _this = this;
			var data = $(this).data();
			var id = data.node;

			var content = `<h5>Change ${data.prop}</h5>
						  <form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>
						  		<label for='field_${data.prop}'>${data.prop}: </label>
						  		<input id='field_${data.prop}' value='${data.value}' type='text' name='field_${data.prop}' data-error='.error_${data.prop}'>
						  		<div class='error_${data.prop}'></div>
						  		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>
						  		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>
						  </form>`;
			$("#modal_confirm .modal-content").html(content);
			$('#modal_confirm .modal-footer').html("");			

			if(data.prop == "Name"){
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the product name.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-employer',[id,_form]);
							ajax.done(function(ajax){
								if(ajax == 1){
									$(`*[for='${data.for}']`).html(_form[0]['value']);
									$(_this).attr({'data-value':_form[0]['value']});
									Materialize.toast('Name updated.',4000);
									$('#modal_confirm').modal('close');	
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-employer',[id,_form]);
							ajax.done(function(ajax){
								if(ajax == 1){
									$(`*[for='${data.for}']`).html(_form[0]['value']);
									$(_this).attr({'data-value':_form[0]['value']});
									$('#modal_confirm').modal('close');	
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}
			else if(data.prop == "Email"){
				$('#modal_confirm').modal('open');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true,validateEmail:true},
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-employer',[id,_form]);
							ajax.done(function(ajax){
								if(ajax == 1){
									$(`*[for='${data.for}']`).html(_form[0]['value']);
									$(_this).attr({'data-value':_form[0]['value']});
									Materialize.toast('Email updated.',4000);
									$('#modal_confirm').modal('close');	
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}
			else if(data.prop == "Address"){
				$('#modal_confirm').modal('open');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true,validateEmail:true},
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-employer',[id,_form]);
							ajax.done(function(ajax){
								if(ajax == 1){
									$(`*[for='${data.for}']`).html(_form[0]['value']);
									$(_this).attr({'data-value':_form[0]['value']});
									Materialize.toast('Address updated.',4000);
									$('#modal_confirm').modal('close');	
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}
			else if(data.prop == "Username"){
				$('#modal_confirm').modal('open');			
				$("#form_update").validate({
				    rules: {
				        field_Username: {required: true,maxlength: 50,checkUsername:true,validateUsername:true},
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-employer',[id,_form]);
							ajax.done(function(ajax){
								if(ajax == 1){
									$(`*[for='${data.for}']`).html(_form[0]['value']);
									$(_this).attr({'data-value':_form[0]['value']});
									Materialize.toast('Username updated.',4000);
									$('#modal_confirm').modal('close');	
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}
			else if(data.prop == "Password"){
				$('#modal_confirm').modal('open');			
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
						var ajax = system.ajax('../assets/harmony/Process.php?update-employer',[id,_form]);
						ajax.done(function(ajax){
							if(ajax == 1){
								$(`*[for='${data.for}']`).html(_form[0]['value']);
								$(_this).attr({'data-value':_form[0]['value']});
								Materialize.toast('Password updated.',4000);
								$('#modal_confirm').modal('close');	
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				}); 
			}
		});

		$("a[data-cmd='updateCompany']").on('click',function(){
			let _this = this;
			var data = $(this).data();
			var id = data.node;

			var content = `<h5>Change ${data.prop}</h5>
						  <form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>
						  		<label for='field_${data.prop}'>${data.prop}: </label>
						  		<input id='field_${data.prop}' value='${data.value}' type='text' name='field_${data.prop}' data-error='.error_${data.prop}'>
						  		<div class='error_${data.prop}'></div>
						  		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>
						  		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>
						  </form>`;
			$("#modal_confirm .modal-content").html(content);
			$('#modal_confirm .modal-footer').html("");			

			if(data.prop == "Name"){
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-company',[id,_form]);
							ajax.done(function(ajax){
								if(ajax == 1){
									$(`*[for='${data.for}']`).html(_form[0]['value']);
									$(_this).attr({'data-value':_form[0]['value']});
									Materialize.toast('Name updated.',4000);
									$('#modal_confirm').modal('close');	
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-company',[id,_form]);
							ajax.done(function(ajax){
								if(ajax == 1){
									$(`*[for='${data.for}']`).html(_form[0]['value']);
									$(_this).attr({'data-value':_form[0]['value']});
									Materialize.toast('Phone updated.',4000);
									$('#modal_confirm').modal('close');	
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}			
			else if(data.prop == "Email"){
				$('#modal_confirm').modal('open');			
				$("#form_update").validate({
				    rules: {
				        field_Email: {required: true,maxlength: 50,checkEmail:true,validateEmail:true},
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-company',[id,_form]);
							ajax.done(function(ajax){
								if(ajax == 1){
									$(`*[for='${data.for}']`).html(_form[0]['value']);
									$(_this).attr({'data-value':_form[0]['value']});
									Materialize.toast('Email updated.',4000);
									$('#modal_confirm').modal('close');	
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}
			else if(data.prop == "Address"){
				$('#modal_confirm').modal('open');			
				$("#form_update").validate({
				    rules: {
				        field_Address: {required: true,maxlength: 100},
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
						if(data.value == _form[0]['value']){
							Materialize.toast('You did not even change the value.',4000);
						}
						else{
							var ajax = system.ajax('../assets/harmony/Process.php?update-company',[id,_form]);
							ajax.done(function(ajax){
								if(ajax == 1){
									$(`*[for='${data.for}']`).html(_form[0]['value']);
									$(_this).attr({'data-value':_form[0]['value']});
									Materialize.toast('Address updated.',4000);
									$('#modal_confirm').modal('close');	
								}
								else{
									Materialize.toast('Cannot process request.',4000);
								}
							});
						}
				    }
				}); 
			}
		});
	},
	updatePicture:function(){
		$("a[data-cmd='updateEmployerPicture']").on('click',function(){
			var data = $(this).data();
			console.log(data);
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
											var data = system.ajax('../assets/harmony/Process.php?update-employerPicture',[id,$image.cropper("getDataURL")]); // 
											data.done(function(data){
												Materialize.toast('Picture has been changed.',4000);
												App.handleLoadPage("#cmd=index;content=focusClient;"+id);
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

		$("a[data-cmd='updateCompanyLogo']").on('click',function(){
			var data = $(this).data();
			console.log(data);
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
									<i class='large mdi-editor-publish'></i>
								</label>
								<button class='btn blue btn-floating btn-flat tooltipped' data-cmd='cancel' type='button' data-tooltip='Cancel' data-position='top'>
									<i class='mdi-navigation-close'></i>
								</button>
								<button class='btn blue btn-floating btn-flat hidden tooltipped right' data-cmd='save' type='button' data-tooltip='Save' data-position='top'>
									<i class='mdi-content-save'></i>
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
											var data = system.ajax('../assets/harmony/Process.php?update-employerCompanyLogo',[id,$image.cropper("getDataURL")]); // 
											data.done(function(data){
												Materialize.toast('Picture has been changed.',4000);
												App.handleLoadPage("#cmd=index;content=focusClient;"+id);
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
	deactivate:function(){
		$("a[data-cmd='deactivateEmployer']").on('click',function(){
			var id = $(this).data('node');
			$("#modal_confirm .modal-content").html(`Arey you sure DEACTIVATE ${$(this).data('name')}'s account?<br/>
													<label for='field_description'>Remarks: </label>
													<textarea class='materialize-textarea' data-field='field_description' name='field_description'></textarea>
													<a class='waves-effect btn-flat modal-action modal-close'>Cancel</a>
												    <a data-cmd='button_proceed' class='waves-effect waves-blue blue white-text btn-flat modal-action'>Proceed</a>`);
			$('#modal_confirm .modal-footer').html("");			
			$('#modal_confirm').modal('open');			

			$("a[data-cmd='button_proceed']").on("click",function(){
				var remarks = $("textarea[data-field='field_description']").val();
				if(remarks.length == 0){
						Materialize.toast('Remarks is required.',4000);
				}
				else if(remarks.length > 800){
						Materialize.toast('Statement is too long.',4000);
				}
				else{
					var data = system.ajax('../assets/harmony/Process.php?deactivate-employer',[id,remarks]);
					data.done(function(data){
						if(data == 1){
							Materialize.toast('Account deactivaded.',4000);
							App.handleLoadPage("#cmd=index;content=focusClient;"+id);
							$('body').attr({'style':'unset'});
						}
						else{
							Materialize.toast('Cannot process request.',4000);
						}
					});
				}
			});
		})
	},
	activate:function(){
		$("a[data-cmd='activateEmployer']").on('click',function(){
			var id = $(this).data('node');
			$("#modal_confirm .modal-content").html(`Arey you sure ACTIVATE ${$(this).data('name')}'s account?
													<div class='row'>
														<a class='waves-effect btn-flat modal-action modal-close'>Cancel</a>
														<a data-cmd='button_proceed' class='waves-effect waves-blue blue white-text btn-flat modal-action modal-close'>Proceed</a>
													</div>`);
			$('#modal_confirm .modal-footer').html("");			
			$('#modal_confirm').modal('open');			

			$("a[data-cmd='button_proceed']").on("click",function(){
				var data = system.ajax('../assets/harmony/Process.php?activate-employer',id);
				data.done(function(data){
					if(data == 1){
						Materialize.toast('Account activaded.',4000);
						App.handleLoadPage("#cmd=index;content=focusClient;"+id);
						$('body').attr({'style':'unset'});
					}
					else{
						Materialize.toast('Cannot process request.',4000);
					}
				});
			});
		})
	},
	view:function(id){
		var content = "";
		var getEmployee = system.ajax('../assets/harmony/Process.php?get-searchByEmployeeID',id);
		getEmployee.done(function(data){
			data = JSON.parse(data);
			var profile = (data[0][14] == "")?"avatar.jpg":data[0][14];
			var position = ((data[0][4] == "") || data[0][4] == null)?"Not assigned":data[0][4];
			var address = ((data[0][13] == "") || data[0][13] == null)?"Not assigned":data[0][13];
			var contactNumber = ((data[0][11] == "") || data[0][11] == null)?"Not assigned":data[0][11];

			content = `<div class='row'>
							<div class='col s3 m2 l2'>
								<img src='../assets/images/avatar.jpg' alt='Employee logo' class='circle center responsive-img valign profile-image'>
							</div>
							<div class='col s9 m10 l10'>
								<ul class='collection with-header'>
									<li class='collection-header'>
										<h4>${data[0][6]} ${data[0][5]} <small> ${data[0][1]} </small></h4>
									</li>
									<li class='collection-item'>
							    		<div><i class='mdi-action-perm-identity cyan-text text-darken-2'></i> ${position}</div>
									</li>
									<li class='collection-item'>
							    		<div><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> ${contactNumber}</div>
									</li>
									<li class='collection-item'>
							    		<div><i class='mdi-communication-email cyan-text text-darken-2'></i> ${data[0][12]}</div>
									</li>
									<li class='collection-item'>
							    		<div><i class='mdi-action-room cyan-text text-darken-2'></i> ${address}</div>
									</li>
									<li class='collection-item'>
							    		<div><i class='mdi-social-cake cyan-text text-darken-2'></i> ${data[0][10]}</div>
									</li>
								</ul>
							</div>
						</div>`;
			$("#modal_popUp .modal-content").html(content);
			$('#modal_popUp').modal('open');			
		});
	},	
	sendAccount:function(count){
		// system.send_mail('rufo.gabrillo@gmail.com','Testing email capability','Test test');
		var loop = 0;
		do{
			loop++;
			console.log(loop);
			var data = system.send_mail('rufo.gabrillo@gmail.com','Testing email capability','Test test');
			console.log();
		}
		while(count<10);
	},
	getConfirmCount:function(id){
		var value = 0;
		var data = system.ajax('../assets/harmony/Process.php?get-confirmStatus',id);
		data.done(function(data){
			value = data;
		});
		return value;
	},
	optionConfirm:function(id){
		console.log();
		content = `<div class='card-panel' style='margin-top: 0px;'>
						<div class='row'>
							<div class='center-align'>
								<div class='col s12'>
									<p>Do you want to send the remaining employee account? There are <span class='counter'>0/0</span>.<br/>Please do not interrupt the system until it is done sending accounts.<br/></p>
									<button class='btn' data-cmd='sendAccounts'>Send</button>
								</div
							</div>
						</div>
					</div>`;
		$("#confirmList").html(content);
		$("#confirmList p span.counter").html(`${client.getConfirmCount(id)} left`);

		$("button[data-cmd='sendAccounts']").on('click',function(){
			client.getConfirm(id);
			console.log('x');
		})
	},
	getConfirm:function(id){
		var content = "";
		var data = system.ajax('../assets/harmony/Process.php?get-confirmByID',id);
		data.done(function(data){
			data = JSON.parse(data);
			if(data.length>0){
				content = `<div class='card-panel' style='margin-top: 0px;'>
								<div class='row'>
									<div class='center-align'>
										<div class='col s12'>
											<p>Sending employee account confirmation. <span class='counter'>0/0</span><br/>Please do not interrupt.<br/><br/><span class='loader'></span></p>
										</div>
									</div>
								</div>
							</div>`;
				$("#confirmList").html(content);
				$("#confirmList p span.counter").html(data.length+" left");
				var data = system.xml("pages.xml");
				$(data.responseText).find("loader2").each(function(i,content){
					$("#confirmList p span.loader").html(content);
				});
				Materialize.toast('Sending account confirmation.',1000,'',function(){
					client.sendConfirm(id);
				});
			}
		});			
	},
	sendConfirm:function(id){
		var data = system.ajax('../assets/harmony/Process.php?get-confirmAccountStatus',id);
		data.done(function(data){
			// console.log(data);
			if(data <= 0){
				location.reload(true);
			}
			else{
				client.getConfirm(id);
			}
		}).fail(function(data){
			// console.log(data);
			Materialize.toast('Sending account confirmation will resume in less than a minute.',30000,'',function(){
				location.reload(true);
			});
		});
	}
}

product = {
	ini:function(){
		this.add();
		this.list();
	},
	refresh:function(){
	    var hash = window.location.hash;
	    var hash = hash.split(';');
	    var id = hash[2];
		product.display(id);
	},
	get:function(){
		var data = system.html('../assets/harmony/Process.php?get-products');
		return data.responseText;
	},
	display:function(id){
		var content = "", image = "", productImage = '',chips = [],chipsContent = "";
		var data = system.ajax('../assets/harmony/Process.php?get-productDetails',id);
		data.done(function(data){
			data = JSON.parse(data);
			productImage = ((data[0][10] == "") || (data[0][10] == null))?"default.png":data[0][10];
			if(data[0][4].length>0){
				if(data[0][4][0] == "["){
					chips = JSON.parse(data[0][4]);
					$.each(chips,function(i,v){
						chipsContent += "<div class='chip'>"+v+"</div>";
					});
				}
				else{
					chipsContent = data[0][4];
				}
			}
			else{
				chipsContent = "No category";				
			}

			image = `<div class='card-profile-image'>
					  	<img class='activator' width='100%' draggable='false' src='../assets/images/products/${productImage}' alt='product-img'>
					  	<a data-cmd='updateProductPicture' data-value='${productImage}' data-node='${data[0][0]}' data-prop='Picture' class='btn waves-effect white-text no-shadow black' style='font-size: 10px;z-index: 1;padding: 0 12px;top: -36px;'>Change</a>
					</div>`;
			content = `
					<table>
						<tr>
							<td class='bold'>Product:</td>
							<td class='grey-text'>${data[0][1]}</td>
							<td>
								<a data-cmd='updateProduct' data-value='${data[0][1]}' data-node='${data[0][0]}' data-prop='Product' class='right tooltipped btn-floating waves-effect no-shadow white right' data-position='left' data-delay='0' data-tooltip='Update'>
									<i class='material-icons right black-text hover'>mode_edit</i>
								</a>
							</td>
						</tr>
						<tr>
							<td class='bold'>Price:</td>
							<td class='grey-text'>${data[0][3]}</td>
							<td>
								<a data-cmd='updateProduct' data-value='${data[0][3]}' data-node='${data[0][0]}' data-prop='Price' class='right tooltipped btn-floating waves-effect no-shadow white right' data-position='left' data-delay='0' data-tooltip='Update'>
									<i class='material-icons right black-text hover'>mode_edit</i>
								</a>
							</td>
						</tr>
						<tr>
							<td class='bold'>Quantity:</td>
							<td class='grey-text'>${data[0][2]}</td>
							<td>
								<a data-cmd='updateProduct' data-value='${data[0][2]}' data-node='${data[0][0]}' data-prop='Quantity' class='right tooltipped btn-floating waves-effect no-shadow white right' data-position='left' data-delay='0' data-tooltip='Update'>
									<i class='material-icons right black-text hover'>mode_edit</i>
								</a>
							</td>
						</tr>
						<tr>
							<td class='bold'>Category:</td>
							<td class='grey-text'>${chipsContent}</td>
							<td>
								<a data-cmd='updateProduct' data-value='${data[0][4]}' data-node='${data[0][0]}' data-prop='Category' class='right tooltipped btn-floating waves-effect no-shadow white right' data-position='left' data-delay='0' data-tooltip='Update'>
									<i class='material-icons right black-text hover'>mode_edit</i>
								</a>
							</td>
						</tr>
						<tr>
							<td class='bold' style='vertical-align:baseline;'>Description:</td>
							<td class='grey-text'>${data[0][5]}</td>
							<td>
								<a data-cmd='updateProduct' data-value='${data[0][5]}' data-node='${data[0][0]}' data-prop='Description' class='right tooltipped btn-floating waves-effect no-shadow white right' data-position='left' data-delay='0' data-tooltip='Update'>
									<i class='material-icons right black-text hover'>mode_edit</i>
								</a>
							</td>
						</tr>
						<tr>
							<td class='bold'>Status:</td>
							<td class='grey-text'>${data[0][6]}</td>
							<td>
								<a data-cmd='updateProduct' data-value='${data[0][6]}' data-node='${data[0][0]}' data-prop='Status' class='right tooltipped btn-floating waves-effect no-shadow white right' data-position='left' data-delay='0' data-tooltip='Update'>
									<i class='material-icons right black-text hover'>mode_edit</i>
								</a>
							</td>
						</tr>
						<tr>
							<td class='bold'>Date added:</td>
							<td class='grey-text'>${data[0][7]}</td>
							<td></td>
						</tr>
					</table>`;
			$("#product").html(`<div class='col s12 m3 l3' style='padding-top: 0.5rem;'>${image}</div><div class='col s12 m9 l9'>${content}</div>`);
			
			$("a[data-cmd='updateProduct']").on('click',function(){
				var data = $(this).data();
				data = [data.node,data.prop,data.value];
				product.update(id,data);
			});

			$("a[data-cmd='updateProductPicture']").on('click',function(){
				var data = $(this).data();
				data = [data.node,data.prop,data.value];
				product.updatePicture(id,data);
			})
		});
	},
	update:function(id,data){
		if(data[1] == "Product"){
			var content = `<h4>Change ${data[1]}</h4>
						  <form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>
						  		<div class='col s12'>
						  			<label for='field_product'>${data[1]}: </label>
						  			<input id='field_product' type='text' name='field_product' data-error='.error_product' value='${data[2]}'>
						  			<div class='error_product'></div>
						  		</div>
						  		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>
						  		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>
						  </form>`;
			$("#modal_confirm .modal-content").html(content);
			$('#modal_confirm').modal('open');			
			$("#form_update").validate({
			    rules: {
			        field_product: {required: true,maxlength: 50},
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
					if(data[2] == _form[0]['value']){
						Materialize.toast('You did not even change the product name.',4000);
					}
					else{
						var ajax = system.ajax('../assets/harmony/Process.php?update-product',[id,_form]);
						ajax.done(function(ajax){
							console.log(ajax);
							if(ajax == 1){
								system.clearForm();
								Materialize.toast('Product updated.',4000);
								$('#modal_confirm').modal('close');	
								product.refresh();
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
					}
			    }
			}); 
		}	
		else if(data[1] == "Price"){
			var content = `<h4>Change ${data[1]}</h4>
						  <form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>
						  		<div class='col s12'>
						  			<label for='field_price'>${data[1]}: </label>
						  			<input id='field_price' type='number' name='field_price' data-error='.error_price' value='${data[2]}'>
						  			<div class='error_price'></div>
						  		</div>
						  		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>
						  		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>
						  </form>`;
			$("#modal_confirm .modal-content").html(content);
			$('#modal_confirm').modal('open');			
			$("#form_update").validate({
			    rules: {
			        field_price: {required: true,maxlength: 50,checkCurrency:true},
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
					if(data[2] == _form[0]['value']){
						Materialize.toast('You did not even change the product name.',4000);
					}
					else{
						var ajax = system.ajax('../assets/harmony/Process.php?update-product',[id,_form]);
						ajax.done(function(ajax){
							if(ajax == 1){
								system.clearForm();
								Materialize.toast('Product updated.',4000);
								$('#modal_confirm').modal('close');	
								product.refresh();
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
					}
			    }
			}); 
		}			
		else if(data[1] == "Quantity"){
			var content = `<h4>Change ${data[1]}</h4>
						  <form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>
						  		<div class='col s12'>
						  			<label for='field_qty'>${data[1]}: </label>
						  			<input id='field_qty' type='number' name='field_qty' data-error='.error_qty' value='${data[2]}'>
						  			<div class='error_qty'></div>
						  		</div>
						  		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>
						  		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>
						  </form>`;
			$("#modal_confirm .modal-content").html(content);
			$('#modal_confirm').modal('open');			
			$("#form_update").validate({
			    rules: {
			        field_qty: {required: true,maxlength: 50,checkPositiveNumber:true},
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
					if(data[2] == _form[0]['value']){
						Materialize.toast('You did not even change the product name.',4000);
					}
					else{
						var ajax = system.ajax('../assets/harmony/Process.php?update-product',[id,_form]);
						ajax.done(function(ajax){
							console.log(ajax);
							if(ajax == 1){
								system.clearForm();
								Materialize.toast('Product updated.',4000);
								$('#modal_confirm').modal('close');	
								product.refresh();
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
					}
			    }
			}); 
		}			
		else if(data[1] == "Category"){

			let productCategory = product.getCategory();
			let categoryContent = "";
			productCategory = JSON.parse(productCategory);

			for(let c of productCategory){
				if(data[2] == c[1]){
					categoryContent += `<option selected>${c[1]}</option>`;
				}
				else{
					categoryContent += `<option>${c[1]}</option>`;
				}
			}
			$("#field_category").html(categoryContent);

			var content = `<h4>Change ${data[1]}</h4>
						  <form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>
						  		<div class='col s12'>
						  			<label for='field_categories'>${data[1]}: </label>
						  			<select id='field_categories' type='text' length='100' name='field_categories' data-error='.error_categories'>${categoryContent}</select>
						  			<div class='error_categories'></div>
						  		</div>
						  		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>
						  		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>
						  </form>`;
			$("#modal_confirm .modal-content").html(content);
			$('#modal_confirm').modal('open');		
		    $("select").material_select();

			$("#form_update").validate({
			    rules: {
			        field_categories: {required: true,maxlength: 50,checkCurrency:true},
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
					if(data[2] == _form[0]['value']){
						Materialize.toast('You did not even change the category.',4000);
					}
					else{
						var ajax = system.ajax('../assets/harmony/Process.php?update-product',[id,_form]);
						ajax.done(function(ajax){
							console.log(ajax);
							if(ajax == 1){
								system.clearForm();
								Materialize.toast('Product updated.',4000);
								$('#modal_confirm').modal('close');	
								product.refresh();
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
					}
			    }
			}); 
		}			
		else if(data[1] == "Description"){
			var content = `<h4>Change ${data[1]}</h4>
						  <form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>
						  		<div class='row'>
						  			<div class='col s12'>
						  				<label for='field_price'>${data[1]}: </label>
						  				<textarea class='materialize-textarea' id='field_description' data-field='field_description' data-error='.error_description' name='field_description'>${data[2]}</textarea>
						  				<div class='error_description'></div>
						  			</div>
						  		</div>
						  		<button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Save</button>
						  		<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Cancel</a>
						  </form>`;
			$("#modal_popUp .modal-content").html(content);
			$('#modal_popUp').modal('open');

			system.froala("#field_description");

			$("#form_update").validate({
			    rules: {
			        field_description: {required: true,maxlength: 1000},
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
					if(data[2] == _form[0]['value']){
						Materialize.toast('You did not even change the product name.',4000);
					}
					else{
						var ajax = system.ajax('../assets/harmony/Process.php?update-product',[id,_form]);
						ajax.done(function(ajax){
							console.log(ajax);
							if(ajax == 1){
								system.clearForm();
								Materialize.toast('Description is updated.',4000);
								$('#modal_popUp').modal('close');	
								product.refresh();
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
					}
			    }
			}); 
		}			
		else if(data[1] == "Status"){
			var content = `<h4>Change Status</h4>
						  <form id='form_update' class='formValidate' method='get' action='' novalidate='novalidate'>
						  		<div class='col s12'>
						  		<label for='field_status' class='active'>${data[1]}: </label>
						  		<select name='field_status'>
						  			<option selected>Published</option>
						  			<option>Pending</option>
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
			        field_status: {required: true,maxlength: 50},
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
					var ajax = system.ajax('../assets/harmony/Process.php?update-product',[id,_form]);
					ajax.done(function(ajax){
						console.log(ajax);
						if(ajax == 1){
							system.clearForm();
							Materialize.toast('status is updated.',4000);
							$('#modal_confirm').modal('close');	
								product.refresh();
						}
						else{
							Materialize.toast('Cannot process request.',4000);
						}
					});
			    }
			}); 
		}
	},
	updatePicture:function(id,data){
		var picture = `../assets/images/products/${data[2]}`;
		var content = `<h4>Change product image</h4>
						<div class='row'>
							<div class='col s12'>
								<div id='profile_picture2' class='ibox-content no-padding border-left-right '></div>
							</div>
						</div>`;
		$("#modal_confirm .modal-content").html(content);
		$('#modal_confirm .modal-footer').html("");			
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
							<button class='btn blue white-text btn-flat hidden right' data-cmd='save' type='button'>
								Save
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
							    	$(this).html("Uploading...").addClass('disabled');
							    	if(status){
										var ajax = system.ajax('../assets/harmony/Process.php?update-productPicture',[id,$image.cropper("getDataURL")]);
										ajax.done(function(ajax){
											console.log(ajax);
											if(ajax == 1){
												Materialize.toast('Picture has been changed.',4000);
												$('#modal_confirm').modal('close');	
												product.refresh();
											}
											else{
												Materialize.toast('Cannot process request.',4000);
											}
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
	},
	list:function(){
		var content = "", chips = [],chipsContent = "";
		var data = product.get();
		data = JSON.parse(data);
		$.each(data,function(i,v){
			var prodPicture = ((v[10] == "") || (v[10] == null))?"default.png":v[10];
			content += `<tr>
							<td width='1px'>${(i+1)}. </td>
							<td><img src='../assets/images/products/${prodPicture}' alt='${v[1]} Picture' class='valign profile-image' height='50px'></td>
							<td width='300px'>${v[1]}</td>
							<td>${v[2]}</td>
							<td>${v[3]}</td>
							<td>published</td>
							<td width='1px'>
								<a href='#cmd=index;content=focusProduct;${v[0]}' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='0' data-tooltip='Show Details' data-cmd='update'>
									<i class='material-icons right hover black-text'>more_vert</i>
								</a>
							</td>
						</tr>`;
		});

		content = `<table class='table bordered center' id='products'>
					<thead>
						<tr>
							<th>#</th><th>Thumbnail</th><th>Product</th><th>Qty</th><th>Price</th><th>Status</th><th></th>
						</tr>
					</thead>
					</tbody>${content}</tbody>
					</table>`;
		$("#display_productList").html(content);

		var table = $('#products').DataTable({
	        "order": [[ 0, 'asc' ]],
	        "bLengthChange": false,
	        "pageLength": 50,
	        "drawCallback": function ( settings ) {
	            var api = this.api();
	            var rows = api.rows( {page:'current'} ).nodes();
	            var last=null;
	        }
	    });
	},
	listGrid:function(){
		var data = system.xml("pages.xml");
		var _content = "";
		$(data.responseText).find("product").each(function(i,content){
			console.log();
			for(x=0;x<=100;x++){
				_content += content.innerHTML;
			}
			$("#products").html(_content);
		});
	},
	add:function(){
		$("#add_product").on('click',function(){
			var data = system.xml("pages.xml");
			$(data.responseText).find("addProduct").each(function(i,content){
				$("#modal_popUp .modal-content").html(content);
				$('#modal_popUp').modal('open');

				let productCategory = product.getCategory();
				let categoryContent = "";
				productCategory = JSON.parse(productCategory);

				for(let c of productCategory){
					categoryContent += `<option>${c[1]}</option>`;
				}
				$("#field_category").html(categoryContent);

				let productBrand = product.getBrands();
				let brandContent = "";
				productBrand = JSON.parse(productBrand);
				console.log(productBrand);

				for(let b of productBrand){
					brandContent += `<option>${b[1]}</option>`;
				}

				$("#field_brand").html(brandContent);
			    $("select").material_select();

				$("#form_addProduct").validate({
				    rules: {
				        field_productName: {required: true,maxlength: 50},
				        field_qty: {required: true,maxlength: 50,checkPositiveNumber:true},
				        field_price: {required: true,maxlength: 50,checkCurrency:true},
				        field_description: {required: true,maxlength: 900},
				        field_category: {required: false},
				        field_brand: {required: false},
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
						console.log(_form);
						var data = system.ajax('../assets/harmony/Process.php?set-newProductAdmin',_form);
						data.done(function(data){
							console.log(data);
							if(data == 1){
								$('#modal_popUp').modal('close');	
								Materialize.toast('Saved.',4000);
								system.clearForm();
								product.ini();
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				});
			});
		})
	},
	addBrands:function(){
		$("#add_brand").on("click",function(){
			var data = system.xml("pages.xml");
			$(data.responseText).find("addBrand").each(function(i,content){
				$("#modal_popUp .modal-content").html(content);
				$('#modal_popUp').modal('open');


		        var $inputImage = $("#field_file");
	            var $image = $(".image-crop > img");
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

					            $($image).cropper({
					            	aspectRatio: 1/1,
								    autoCropArea: 0.80,
								    preview: ".avatar-preview",
								    built: function () {
				    		    		$(".cropper-container").attr({'style':'left:0px !important;top:0px;width:100%;height:100%;'});
				    		    		$("#button_icon").removeAttr("disabled");
								    }
								});
		                        $image.cropper("reset", true).cropper("replace", this.result);
		                    };
		                }
		                else{
							Materialize.toast('Please choose an image file.',4000);
		                }
		            });
		        }
		        else{
		            $inputImage.addClass("hide");
		        }

				$("#form_addBrand").validate({
				    rules: {
				        field_brand: {required: true,maxlength: 300},
				        field_remarks: {required: true,maxlength: 500},
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
						_form.push($image.cropper("getDataURL"));
						var data = system.ajax('../assets/harmony/Process.php?set-addBrand',_form);
						data.done(function(data){
							if(data == 1){
								Materialize.toast('Brand added.',1000,'',function(){
									$('#modal_popUp').modal('close');	
									product.listBrands();
								});
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				});
			});
		});
	},
	getBrands:function(){
		var data = system.html('../assets/harmony/Process.php?get-brands');
		return data.responseText;
	},
	listBrands:function(){
		var data = JSON.parse(this.getBrands());
		if(data.length>0){
			var content = "";
			$.each(data,function(i,v){
				var brandICon = ((v[3] == "") || (v[3] == null))?"default.png":v[3];
				content += `<tr>
								<td width='1px'>${(i+1)}. </td>
								<td><img src='../assets/images/brand/${brandICon}' alt='${v[1]} logo' class='valign profile-image' height='50px'></td>
								<td width='300px'>${v[1]}</td>
								<td>${v[2]}</td>
								<td width='1px'>
									<a class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-node='${v[0]}' data-name='${v[1]}' data-cmd='deleteBrand' data-position='left' data-delay='0' data-tooltip='Delete' data-cmd='update'>
										<i class='material-icons right hover black-text'>delete</i>
									</a>
								</td>
							</tr>`;
			});

			content = `<table class='table bordered center' id='brands'>
						<thead>
							<tr>
								<th>#</th><th>Thumbnail</th><th>Brand</th><th>Description</th><th></th>
							</tr>
						</thead>
						</tbody>${content}</tbody>
						</table>`;
			$("#display_brands").html(content);

			var table = $('#brands').DataTable({
		        "order": [[ 0, 'asc' ]],
		        "bLengthChange": false,
		        "pageLength": 50,
		        "drawCallback": function ( settings ) {
		            var api = this.api();
		            var rows = api.rows( {page:'current'} ).nodes();
		            var last=null;
		        }
		    });

		    $("a[data-cmd='deleteBrand']").on('click',function(){
		    	var data = $(this).data();
		    	product.deleteBrand([data.name, data.node]);
		    });
		}
		else{
			$("#display_brands").html("<h4 class='grey-text center'>No brand is on the list. Add a brand.</h4>");
		}
		this.addBrands();
	},
	deleteBrand:function(data){
		var productData = data;
		var content = `Are you sure DELETE ${productData[0]}?`;
		$("#modal_confirm .modal-content").html(content);
		$("#modal_confirm .modal-footer").html(`<a class='waves-effect waves-red red white-text btn-flat modal-action modal-close'>Cancel</a>
												<a data-cmd='button_proceed' class='waves-effect waves-grey btn-flat modal-action'>Proceed</a>`);
		$('#modal_confirm').modal('open');
		$("a[data-cmd='button_proceed']").on("click",function(){
			var data = system.ajax('../assets/harmony/Process.php?set-deleteBrand',productData[1]);
			data.done(function(data){
				console.log(data);
				if(data == 1){
					Materialize.toast('Brand deleted.',1000,'',function(){
						$('#modal_confirm').modal('close');	
						product.listBrands();
					});
				}
				else{
					Materialize.toast('Cannot process request.',4000);
				}
			});
		});
	},
	addCategory:function(){
		$("#add_category").on("click",function(){
			var data = system.xml("pages.xml");
			$(data.responseText).find("addCategory").each(function(i,content){
				$("#modal_popUp .modal-content").html(content);
				$('#modal_popUp').modal('open');	
				$('.tooltipped').tooltip({delay: 50});

		        var $inputImage = $("#field_file");
	            var $image = $(".image-crop > img");
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

					            $($image).cropper({
					            	aspectRatio: 1/1,
								    autoCropArea: 0.80,
								    preview: ".avatar-preview",
								    built: function () {
				    		    		$(".cropper-container").attr({'style':'left:0px !important;top:0px;width:100%;height:100%;'});
				    		    		$("#button_icon").removeAttr("disabled");
								    }
								});
		                        $image.cropper("reset", true).cropper("replace", this.result);
		                    };
		                }
		                else{
							Materialize.toast('Please choose an image file.',4000);
		                }
		            });
		        }
		        else{
		            $inputImage.addClass("hide");
		        }

				$("#form_addCategory").validate({
				    rules: {
				        field_category: {required: true,maxlength: 300},
				        field_file: {required: true},
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
					submitHandler: function(form){
    		    		$("#button_icon").attr({"disabled":"true"});
						var _form = $(form).serializeArray();
						_form.push($image.cropper("getDataURL"));
						var data = system.ajax('../assets/harmony/Process.php?set-addCategory',_form);
						data.done(function(data){
							if(data == 1){
								Materialize.toast('Category added.',1000,'',function(){
									$('#modal_popUp').modal('close');	
									product.listCategory();
								});
							}
							else{
								Materialize.toast('Cannot process request.',4000);
		    		    		$("#button_icon").removeAttr("disabled");
							}
						});
				    }
				});
			});
		});
	},
	getCategory:function(){
		var data = system.html('../assets/harmony/Process.php?get-category');
		return data.responseText;
	},
	listCategory:function(){
		var data = JSON.parse(product.getCategory());
		if(data.length>0){
			var content = "";
			$.each(data,function(i,v){
				var brandICon = ((v[2] == "") || (v[2] == null))?"default.png":v[2];
				content += `<tr>
								<td width='1px'>${(i+1)}. </td>
								<td><img src='../assets/images/icon/${brandICon}' alt='${v[1]} logo' class='valign profile-image' height='50px'></td>
								<td width='300px'>${v[1]}</td>
								<td width='1px'>
									<a class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-node='${v[0]}' data-name='${v[1]}' data-cmd='deleteCategory' data-position='left' data-delay='0' data-tooltip='Delete' data-cmd='update'>
										<i class='material-icons right hover black-text'>delete</i>
									</a>
								</td>
							</tr>`;
			});

			content =   `<table class='table bordered center' id='brands'>
							<thead>
								<tr>
									<th>#</th><th>Icon</th><th>Category</th><th></th>
								</tr>
							</thead>
							</tbody>${content}</tbody>
						</table>`;
			$("#display_category").html(content);

			var table = $('#brands').DataTable({
		        "order": [[ 0, 'asc' ]],
		        "bLengthChange": false,
		        "pageLength": 50,
		        "drawCallback": function ( settings ) {
		            var api = this.api();
		            var rows = api.rows( {page:'current'} ).nodes();
		            var last=null;
		        }
		    });

		    $("a[data-cmd='deleteCategory']").on('click',function(){
		    	var data = $(this).data();
		    	product.deleteCategory([data.name, data.node]);
		    });
		}
		else{
			$("#display_category").html("<h4 class='grey-text center'>No category is on the list. Add a category.</h4>");
		}
		this.addCategory();
	},
	deleteCategory:function(data){
		var productData = data;
		var content = `Are you sure DELETE ${productData[0]}?`;
		$("#modal_confirm .modal-content").html(content);
		$("#modal_confirm .modal-footer").html(`<a class='waves-effect waves-red red white-text btn-flat modal-action modal-close'>Cancel</a>
												<a data-cmd='button_proceed' class='waves-effect waves-grey btn-flat modal-action'>Proceed</a>`);
		$('#modal_confirm').modal('open');
		$("a[data-cmd='button_proceed']").on("click",function(){
			var data = system.ajax('../assets/harmony/Process.php?set-deleteCategory',productData[1]);
			data.done(function(data){
				console.log(data);
				if(data == 1){
					Materialize.toast('Category deleted.',1000,'',function(){
						$('#modal_confirm').modal('close');	
						product.listCategory();
					});
				}
				else{
					Materialize.toast('Cannot process request.',4000);
				}
			});
		});
	},
}	

employee = {
	ini:function(id){
		points.add(id);
		employee.getPoints(id);
		employee.getPointsActivity(id);
		employee.getBuysActivity(id);
		employee.details(id);
	},
	get:function(){
		var data = system.html('../assets/harmony/Process.php?get-employee');
		return data;
	},
	getAccount:function(id){
		var data = system.ajax('../assets/harmony/Process.php?get-employeeDetails',id);
		return JSON.parse(data.responseText);
	},
	add:function(id){
		var data = system.xml("pages.xml");
		$(data.responseText).find("addEmployee").each(function(i,content){
			$("#modal_popUp .modal-content").html(content);
			$('#modal_popUp').modal('open');		
		    $("select").material_select();

			$("#form_addEmployee").validate({
			    rules: {
			        field_gname: {required: true,maxlength: 50},
			        field_mname: {required: true,maxlength: 50},
			        field_fname: {required: true,maxlength: 50},
			        field_nickname: {required: true,maxlength: 50},
			        field_dob: {required: true,maxlength: 50,checkDate:true},
			        field_gender: {required: true,maxlength: 50},
			        field_address: {required: true,maxlength: 100},
			        field_phone: {required: true,maxlength: 50},
			        field_email: {required: true,maxlength: 100,checkEmail:true,validateEmail:true},
			        field_position: {required: true,maxlength: 50,},
			        field_employeeID: {required: true,maxlength: 50,validateEmployeeID:true},
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
					var data = system.ajax('../assets/harmony/Process.php?set-newEmployee',[_form,id]);
					data.done(function(data){
						if(data == 1){
							var text = `<h1>Congratulations</h1>, you are now registered. You can login using <u>${_form[2]['value']}</u> as you username and <u>${_form[5]['value']}</u> as your password. <a href='http://loginocalhost/kaboomRewards/login.html'>Just follow this link</a>`;
							var data = system.send_mail(_form[8]['value'],'Employee Registration',text);
							if(data.responseText != ""){
								Materialize.toast('Saved.',4000);
								system.clearForm();
						    	$(location).attr('href',"#cmd=index;content=focusClient");			
							}
						}
						else{
							Materialize.toast('Cannot process request.',4000);
						}
					});
			    }
			});
		});
	},
	list:function(id){
		var data = system.ajax('../assets/harmony/Process.php?get-employeeByID',id);
		data = JSON.parse(data.responseText);

		var content = "", actions = "";
		$.each(data,function(i,v){
			var profile = ((v[12] == "") || (v[12] == null))?'avatar.jpg':v[12];

			if(Number(v[15]) == 1){
				actions = "<i class='mdi-action-lock-open right black-text' data-position='left' data-delay='50' data-tooltip='Active'></i>";	
			}
			else{
				actions = "<i class='mdi-action-lock right black-text' data-position='left' data-delay='50' data-tooltip='Deactivated'></i>";	
			}
			content += `<tr>
							<td width='1px'>${(i+1)} </td>\n
							<td><img src='../assets/images/profile/${profile}' alt='Thumbnail' class='responsive-img valign profile-image' style='width:50px;'>${actions}</td>\n
							<td width='200px'><p>${v[1]}</p></td>\n
							<td width='200px'><p>${v[3]}</p></td>\n
							<td width='200px'><p>${v[4]}</p></td>\n
							<td>\n
								<a data-studentID='${v[1]}' data-node='${v[0]}' data-cmd='view' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='50' data-tooltip='Show Details'>\n
									<i class='material-icons right hover black-text'>more_vert</i>
								</a>\n
							</td>\n
						</tr>\n`;
		})	

		$("#employees table tbody").html(content);
		var table = $('#employees table').DataTable({
	        "order": [[ 0, 'asc' ]],
	        "drawCallback": function ( settings ) {
	            var api = this.api();
	            var rows = api.rows( {page:'current'} ).nodes();
	            var last=null;
	        }
	    });

		$('.dataTable').on('click', 'tbody tr', function() {
			var data = table.row(this).data();
			data = $.parseHTML(data[5]);
	    	$(location).attr('href',`#cmd=index;content=focusEmployee;${data[0].dataset.node}`);			
		});
	},
	details:function(id){
		let content = "";
		let data = employee.getAccount(id);
		if(data.length<=0){
			let content = system.xml("pages.xml");
			$(content.responseText).find("errorContent").each(function(i,content){
				$("#display_error").html("No information to display.");
			});
		}
		else{
			$("#display_employeeDetails").removeClass('hidden');
			$("#display_error").addClass('hidden');

			if(Number(data[0][15]) == 1){
				status = "Active";
				var actions = `<a data-cmd='deactivateEmployee' data-name='${data[0][4]}' data-node='${data[0][0]}' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Deactivate account' data-cmd='update'>
							  	<i class='material-icons right hover black-text'>lock_open</i>
							  </a>`;	
			}
			else{
				status = "Deactivated";
				var actions = `<a data-cmd='activateEmployee' data-name='${data[0][4]}' data-node='${data[0][0]}' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Activate account' data-cmd='update'>
							  	<i class='material-icons right hover black-text'>lock</i>
							  </a>`;	
			}

			var profile = ((data[0][12] == "") || (data[0][12] == null))?"avatar.jpg":data[0][12];
			content = `<div id='profile-card' class='card'>
					    <div class='card-image waves-effect waves-block waves-light' style='max-height: 70px;'>
					        <img class='activator' src='../assets/images/user-bg.jpg' alt='user background'>
					    </div>
					    <div class='card-content'>
					        <div class=' responsive-img activator card-profile-image circle' style='margin-top: -65px;'>
					        	<img src='../assets/images/profile/${profile}' alt='' class='circle'>
					        	<a data-value='${profile}' data-cmd='updateEmployeePicture' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-prop='Picture' class='hide btn waves-effect white-text no-shadow black' style='font-size: 10px;z-index: 1;padding: 0 12px;top:40px;'>Change</a>
							</div>
							<a data-for='employeeName' data-value='${JSON.stringify([data[0][4],data[0][5],data[0][3]])}' data-cmd='updateEmployee' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-prop='Name' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update account'>
								<i class='material-icons right hover black-text'>mode_edit</i>
							</a>
					        <span class='card-title activator grey-text text-darken-4' for='employeeName'>${data[0][4]} ${data[0][5]} ${data[0][3]} </span>
							<div class='divider'></div>
							<table>
								<tr>
									<td class='bold truncate' style='width:120px'><i class='mdi-action-info-outline cyan-text text-darken-2'></i> Status: </td>
									<td class='grey-text truncate'>${status}</td>
									<td>${actions}</td>
								</tr>
								<tr>
									<td class='bold truncate' style='width:120px'><i class='mdi-action-perm-identity cyan-text text-darken-2'></i> Nickname: </td>
									<td class='grey-text truncate' for='employeeNickname'>${data[0][6]}</td>
									<td>
										<a data-for='employeeNickname' data-value='${data[0][6]}' data-cmd='updateEmployee' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-node='${data[0][0]}' data-prop='Nickname' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update phone'>
											<i class='material-icons right hover black-text'>mode_edit</i>
										</a>
									</td>
								</tr>
								<tr>
									<td class='bold truncate' style='width:120px'><i class='mdi-action-work cyan-text text-darken-2'></i> Position: </td>
									<td class='grey-text truncate' for='employeePosition'>${data[0][13]}</td>
									<td>
										<a data-for='employeePosition' data-value='${data[0][13]}' data-cmd='updateEmployee' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-node='${data[0][0]}' data-prop='Position' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update phone'>
											<i class='material-icons right hover black-text'>mode_edit</i>
										</a>
									</td>
								</tr>
								<tr>
									<td class='bold truncate' style='width:120px'><i class='mdi-action-perm-phone-msg cyan-text text-darken-2'></i> Phone: </td>
									<td class='grey-text truncate' for='employeePhone'>${data[0][9]}</td>
									<td>
										<a data-for='employeePhone' data-value='${data[0][9]}' data-cmd='updateEmployee' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-node='${data[0][0]}' data-prop='Phone' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update phone'>
											<i class='material-icons right hover black-text'>mode_edit</i>
										</a>
									</td>
								</tr>
								<tr>
									<td class='bold truncate' style='width:120px'><i class='mdi-communication-email cyan-text text-darken-2'></i> Email: </td>
									<td class='grey-text truncate' for='employeeEmail'>${data[0][10]}</td>
									<td>
										<a data-for='employeeEmail' data-value='${data[0][10]}' data-cmd='updateEmployee' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-node='${data[0][0]}' data-prop='Email' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update phone'>
											<i class='material-icons right hover black-text'>mode_edit</i>
										</a>
									</td>
								</tr>
								<tr>
									<td class='bold truncate' style='width:120px'><i class='mdi-maps-map cyan-text text-darken-2'></i> Address: </td>
									<td class='grey-text truncate' for='employeeAddress'>${data[0][11]}</td>
									<td>
										<a data-for='employeeAddress' data-value='${data[0][11]}' data-cmd='updateEmployee' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-node='${data[0][0]}' data-prop='Address' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update phone'>
											<i class='material-icons right hover black-text'>mode_edit</i>
										</a>
									</td>
								</tr>
								<tr>
									<td class='bold truncate' style='width:120px'><i class='mdi-action-cached cyan-text text-darken-2'></i> Gender:</td>
									<td class='grey-text truncate' for='employeeGender'> ${data[0][7]}</td>
									<td>
										<a data-for='employeeGender' data-value='${data[0][7]}' data-cmd='updateEmployee' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-node='${data[0][0]}' data-prop='Gender' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update phone'>
											<i class='material-icons right hover black-text'>mode_edit</i>
										</a>
									</td>
								</tr>
								<tr>
									<td class='bold truncate' style='width:120px'><i class='mdi-action-event cyan-text text-darken-2'></i> Date of Birth:</td>
									<td class='grey-text truncate' for='employeeDOB'> ${data[0][8]}</td>
									<td>
										<a data-for='employeeDOB' data-value='${data[0][8]}' data-cmd='updateEmployee' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-node='${data[0][0]}' data-prop='Date of Birth' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update phone'>
											<i class='material-icons right hover black-text'>mode_edit</i>
										</a>
									</td>
								</tr>
								<tr>
									<td class='bold truncate' style='width:120px'><i class='mdi-action-account-box cyan-text text-darken-2'></i> Employee ID:</td>
									<td class='grey-text truncate'> ${data[0][1]}</td>
									<td>
										<button disabled data-cmd='updateEmployee' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-node='${data[0][0]}' data-prop='Employee ID' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update phone'>
											<i class='material-icons right hover black-text'>mode_edit</i>
										</button>
									</td>
								</tr>
								<tr>
									<td class='bold truncate' style='width:120px'><i class='mdi-action-verified-user cyan-text text-darken-2'></i> Password</td>
									<td class='grey-text truncate'> </td>
									<td>
										<button disabled data-cmd='updateEmployee' data-name='${data[0][4]} ${data[0][5]} ${data[0][3]}' data-node='${data[0][0]}' data-node='${data[0][0]}' data-prop='Password' class='tooltipped btn-floating waves-effect black-text no-shadow white right' data-position='left' data-delay='50' data-tooltip='Update password'>
											<i class='material-icons right hover black-text'>mode_edit</i>
										</button>
									</td>
								</tr>
							</table>
					    </div>
					</div>`;
			$("#profile").html(content);

			employee.deactivate();
			employee.activate();
			employee.update();
			employee.updatePicture();


			$("#add_points").attr({"data-email":data[0][10]});

			if(data[0][15] == 0){
				$("#add_points").attr({'disabled':'true'});
			}
			else{
				$("#add_points").removeAttr('disabled');					
			}
		}
	},
	update:function(){
		$("a[data-cmd='updateEmployee']").on('click',function(){
			let _this = this;
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
							$(placement).append(error)
						} 
						else{
							error.insertAfter(element);
						}
					},
					submitHandler: function (form) {
						var _form = $(form).serializeArray();

						var ajax = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						ajax.done(function(ajax){
							if(ajax == 1){
								$(`*[for='${data.for}']`).html();
								$(_this).attr({'data-value':`${_form[0]['value']} ${_form[1]['value']} ${_form[2]['value']}`});
								Materialize.toast('Name updated.',4000);
								$('#modal_confirm').modal('close');	
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
						var ajax = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						ajax.done(function(ajax){
							console.log(ajax);
							if(ajax == 1){
								$(`*[for='${data.for}']`).html(_form[0]['value']);
								$(_this).attr({'data-value':_form[0]['value']});
								Materialize.toast('Name updated.',4000);
								$('#modal_confirm').modal('close');	
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
						var ajax = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						ajax.done(function(ajax){
							if(ajax == 1){
								$(`*[for='${data.for}']`).html(_form[0]['value']);
								$(_this).attr({'data-value':_form[0]['value']});
								Materialize.toast('Name updated.',4000);
								$('#modal_confirm').modal('close');	
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
						var ajax = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						ajax.done(function(ajax){
							if(ajax == 1){
								$(`*[for='${data.for}']`).html(_form[0]['value']);
								$(_this).attr({'data-value':_form[0]['value']});
								Materialize.toast('Name updated.',4000);
								$('#modal_confirm').modal('close');	
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
				        field_Email: {required: true,maxlength: 50,checkEmail:true,validateEmail:true},
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
						var ajax = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						ajax.done(function(ajax){
							if(ajax == 1){
								$(`*[for='${data.for}']`).html(_form[0]['value']);
								$(_this).attr({'data-value':_form[0]['value']});
								Materialize.toast('Email updated.',4000);
								$('#modal_confirm').modal('close');	
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
				        field_Email: {required: true,maxlength: 50,checkEmail:true,validateEmail:true},
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
						var ajax = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						ajax.done(function(ajax){
							if(ajax == 1){
								$(`*[for='${data.for}']`).html(_form[0]['value']);
								$(_this).attr({'data-value':_form[0]['value']});
								Materialize.toast('Address updated.',4000);
								$('#modal_confirm').modal('close');	
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
				        field_Email: {required: true,maxlength: 50,checkEmail:true,validateEmail:true},
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
						var ajax = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						ajax.done(function(ajax){
							if(ajax == 1){
								$(`*[for='${data.for}']`).html(_form[0]['value']);
								$(_this).attr({'data-value':_form[0]['value']});
								Materialize.toast('Gender updated.',4000);
								$('#modal_confirm').modal('close');	
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
						var ajax = system.ajax('../assets/harmony/Process.php?update-employee',[id,_form]);
						ajax.done(function(ajax){
							if(ajax == 1){
								$(`*[for='${data.for}']`).html(_form[0]['value']);
								$(_this).attr({'data-value':_form[0]['value']});
								Materialize.toast('Date of birth updated.',4000);
								$('#modal_confirm').modal('close');	
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
			console.log(data);
			var id = data.node;
			var picture = "../assets/images/profile/avatar.jpg";
			var content = "<h4>Change "+data.prop+"</h4>"+
  							"	<div class='row'>"+
  							"		<div class='col s12'>"+
							"			<div id='profile_picture2' class='ibox-content no-padding border-left-right '></div>"+
							"		</div>"+
							"	</div>";
			$("#modal_confirm .modal-content").html(content);
			$('#modal_confirm').removeClass('modal-fixed-footer');			
			$('#modal_confirm .modal-footer').remove();			
			$('#modal_confirm').modal('open');			

    		var content =   "<div class='image-crop col s12' style='margin-bottom:5px;'>"+
							"	<img width='100%' src='"+picture+"'>"+
							"</div>"+
							"<div class='btn-group col s12'>"+
							"	<label for='inputImage' class='btn blue btn-floating btn-flat tooltipped' data-tooltip='Load image' data-position='top'>"+
							"		<input type='file' accept='image/*' name='file' id='inputImage' class='hide'>"+
							"		<i class='large mdi-editor-publish'></i>"+
							"	</label>"+
							"	<button class='btn blue btn-floating btn-flat tooltipped' data-cmd='cancel' type='button' data-tooltip='Cancel' data-position='top'>"+
							"		<i class='mdi-navigation-close'></i>"+
							"	</button>"+
							"	<button class='btn blue btn-floating btn-flat hidden tooltipped right' data-cmd='save' type='button' data-tooltip='Save' data-position='top'>"+
							"		<i class='mdi-content-save'></i>"+
							"	</button>"+
							"</div>";
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
											var data = system.ajax('../assets/harmony/Process.php?update-employeePicture',[id,$image.cropper("getDataURL")]); // 
											data.done(function(data){
												Materialize.toast('Picture has been changed.',4000);
												system.clearForm();
												App.handleLoadPage("#cmd=index;content=focusEmployee;"+id);
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
	deactivate:function(){
		$("a[data-cmd='deactivateEmployee']").on('click',function(){
			var id = $(this).data('node');
			var content = `Arey you sure DEACTIVATE ${$(this).data('name')}'s account?<br/>
						  <label for='field_description'>Remarks: </label>
						  <textarea class='materialize-textarea' data-field='field_description' name='field_description'></textarea>`;
			$("#modal_confirm .modal-content").html(content);
			$("#modal_confirm .modal-footer").html(`<a class='waves-effect btn-flat modal-action modal-close'>Cancel</a>
												   <a data-cmd='button_proceed' class='waves-effect waves-blue blue white-text btn-flat modal-action'>Proceed</a>`);
			$('#modal_confirm').modal('open');			

			$("a[data-cmd='button_proceed']").on("click",function(){
				var remarks = $("textarea[data-field='field_description']").val();
				if(remarks.length == 0){
						Materialize.toast('Remarks is required.',4000);
				}
				else if(remarks.length > 800){
						Materialize.toast('Statement is too long.',4000);
				}
				else{
					var data = system.ajax('../assets/harmony/Process.php?deactivate-employee',[id,remarks]);
					data.done(function(data){
						if(data == 1){
							Materialize.toast('Account deactivaded.',4000);
							employee.details(id);
							$('#modal_confirm').modal('close');	
						}
						else{
							Materialize.toast('Cannot process request.',4000);
						}
					});
				}
			});
		})
	},
	activate:function(){
		$("a[data-cmd='activateEmployee']").on('click',function(){
			var id = $(this).data('node');
			$("#modal_confirm .modal-content").html(`Arey you sure ACTIVATE ${$(this).data('name')}'s account?`);
			$("#modal_confirm .modal-footer").html(`<a class='waves-effect btn-flat modal-action modal-close'>Cancel</a>
												   <a data-cmd='button_proceed' class='waves-effect waves-blue blue white-text btn-flat modal-action modal-close'>Proceed</a>`);
			$('#modal_confirm').modal('open');			

			$("a[data-cmd='button_proceed']").on("click",function(){
				var data = system.ajax('../assets/harmony/Process.php?activate-employee',id);
				data.done(function(data){
					if(data == 1){
						Materialize.toast('Account activaded.',4000);
						employee.details(id);
						$('#modal_confirm').modal('close');	
					}
					else{
						Materialize.toast('Cannot process request.',4000);
					}
				});
			});
		})
	},
	getPoints:function(id){
		var data = system.ajax('../assets/harmony/Process.php?get-employeePointsAdmin',id);
		data.done(function(data){
			data = JSON.parse(data);
			data = (data.length<=0)?0:data[0][2];
			$("#employees h2 span.actual-points").html(data)
		});
	},
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
			        bLengthChange:false,
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
									<td width='20%'>${v[0].substring(0,8)}</td>
									<td width='30%'>${v[2]}</td>
									<td width='30%'>${v[3]}</td>
									<td width='30%'>${v[4]}</td>
									<td width='9%'>
										<a data-cmd='showOrder' data-node='${v[0]}' data-meta='${JSON.stringify([v[0],v[2],v[3],v[4]])}' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='0' data-tooltip='Show details'>
											<i class='material-icons right hover black-text'>more_vert</i>
										</a>
									</td>
								</tr>`;
				})					
				$("#buyingActivity table tbody").html(content);
			    $("select").material_select();
			    $(".dropdown-button").dropdown();

				var table = $('#buyingActivity table').DataTable({
			        "order": [[ 0, 'asc' ]],
			        bLengthChange:false,
			        "drawCallback": function ( settings ) {
			            var api = this.api();
			            var rows = api.rows( {page:'current'} ).nodes();
			            var last=null;
			        }
			    });

				$("a[data-cmd='showOrder']").on('click',function(){
					var data = $(this).data();
					var orders = system.ajax('../assets/harmony/Process.php?get-orders',data.node);
					orders.done(function(orders){
						var orders = JSON.parse(orders);
						sales.viewOrders([data,orders]);
					});
				});
			}
		});
	},
	upload:function(_id){
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
									var data = [],count = 0, search = [], search2 = [];
									var employeeList = [];

									employeeList = system.ajax('../assets/harmony/Process.php?get-employeeByID',_id);
									employeeList = JSON.parse(employeeList.responseText);
									confirmList = system.ajax('../assets/harmony/Process.php?get-confirmByID',_id);
									confirmList = JSON.parse(confirmList.responseText);

									if((results['data'][0].length == 6) && (results['data'][0][5] == 'EMAIL') && (results['data'].length<=2000)){
										Materialize.toast("Removing duplicated entries.",2000);
										setTimeout(function(){
											$("#importPreview").html(content);
						                	$("#display_import").removeClass('hidden');

											for(var x=1;x<(results['data'].length-1);x++){
												if(results['data'][x][0] != ""){
													search = system.searchJSON(employeeList,1,results['data'][x][0]);
													search2 = system.searchJSON(confirmList,1,results['data'][x][0]);

													if((search.length==0) && (search2.length==0))												
														data.push(results['data'][x]);
												}
											}

							                var table = $('#importPreview table').DataTable({
							                    data: data,
										        "order": [[ 0, 'asc' ]],
										        deferRender:    true,
										        iDisplayLength: 100,
												sScrollY:        "300px",
												sScrollX:        "100%",
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
												employee.saveUpload(_id,data);
											}
											else{
												$(".display_loading").html("<span class='red-text'>All data are already in the system.</span>");
											}

						                	$("#display_import").removeClass('hidden');
											$("#display_importLoading").addClass('animated zoomOut').html("");
										},1000)
									}
									else{
										Materialize.toast(`It seems that you are uploading a data that is not validated or<br/> either of the following:<br/>
															&bull; Your are uploading too many data; <br/>&bull; You are uploading unformatted CSV file.`,
															10000);
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
	saveUpload:function(_id,_data){
        $("#save_import").on("click",function(){
			Materialize.toast('Importing...',4000);
        	$(this).addClass('disabled');
			var data = system.xml("pages.xml");
			$(data.responseText).find("loader2").each(function(i,content){
				$(".display_loading").html(content);
	        	setTimeout(function(){
	        		_data = ($.type(_data) == "array")?JSON.stringify(_data):_data;
					var data = system.ajax('../assets/harmony/Process.php?set-BulkEmployee',[_data,_id]);
					data.done(function(data){
						if(data == 1){
							Materialize.toast('Saved. The system will send account confirmation to the list.',4000);
							App.handleLoadPage(`#cmd=index;content=focusClient;${_id}`);
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
	download:function(){
		let content = `
			<h5>Download Employee Spreadsheet</h5>
			<p>
				After downloading the file fill in the list with new employees. Make sure you save it as CSV file. System will only accept CSV file.
			</p>
			<div class='divider'></div>
			<p>
				<a href='../assets/files/employees.xlsx' target='_blank' class="btn btn-flat red white-text waves-effect waves-light right modal-close">Download</a>
				<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Close</a>
			</p>
		`;

		$("a[data-cmd='download']").on('click',function(){
			console.log("xxx");
			$("#modal_popUp .modal-content").html(content);
			$('#modal_popUp').modal('open');
		})	
	}
}

points = {
	add:function(id){ // email on points rewards
		$("#add_points").on("click",function(){
			let email = $(this).data('email');
			var data = system.xml("pages.xml");
			$(data.responseText).find("addPoints").each(function(i,content){
				$("#modal_popUp .modal-content").html(content);
				$('#modal_popUp').modal('open');	

				$("#form_addPoints").validate({
				    rules: {
				        field_points: {required: true,minlength: 1,checkPositiveNumber:true},
				        field_remarks: {required: true,maxlength: 500},
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
						var data = system.ajax('../assets/harmony/Process.php?set-addPointsAdmin',[_form,id]);
						data.done(function(data){
							if(data == 1){
								var text = `<h1>Hello</h1></br>You received ${_form[0]['value']}.`;
								var data = system.send_mail(email,'Points Rewards',text);
								Materialize.toast('Points added.',1000,'',function(){
									location.reload(true);
								});
							}
							else{
								Materialize.toast('Cannot process request.',4000);
							}
						});
				    }
				});
			});
		});
	},
	upload:function(_id){
        var $inputImage = $("#field_file"), status = true, res = "";
        if(window.FileReader){
            $inputImage.on('change',function(){
            	$("#field_file").addClass("disabled");
                var files = this.files, file = files[0].name.split('.');
                if((file[1] == "csv") || (file[1] == "xlsx")){ // 
					var data = system.xml("pages.xml");
					$(data.responseText).find("tablePointsPreview").each(function(i,content){
						$("#field_file").parse({
							config: {
								complete: function(results, file) {
									$("#display_importLoading").removeClass('zoomOut').html("");
							    	system.preloader("#display_importLoading");
									system.loading(true);
									var data = [],count = 0, search = [];
									var employeeList = [];

									employeeList = system.ajax('../assets/harmony/Process.php?get-employeeByID',_id);
									employeeList = JSON.parse(employeeList.responseText);

									if((employeeList.length>0)&& ((results['data'][0].length == 4) && (results['data'][0][3] == 'Points')) && (results['data'].length<=2000)){
										Materialize.toast("Validating data. This may take a minute.",2000);
										setTimeout(function(){
											$("#importPreview").html(content);
						                	$("#display_import").removeClass('hidden');

											for(var x=1;x<(results['data'].length-1);x++){
												if(results['data'][x][0] != ""){
													search = system.searchJSON(employeeList,1,results['data'][x][0]);
													if(search.length==1)												
														data.push(results['data'][x]);
												}
											}

							                var table = $('#importPreview table').DataTable({
							                    data: data,
										        "order": [[ 0, 'asc' ]],
										        deferRender:    true,
										        iDisplayLength: 100,
												sScrollY:        "300px",
												sScrollX:        "100%",
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
							                                return (full[2]!="")?`<span>${full[1]}</span>`:null;
							                            }
							                        },
							                        {data: "",
							                            render: function ( data, type, full ){
							                                return (full[1]!="")?`<span>${full[2]}</span>`:null;
							                            }
							                        },
							                        {data: "",
							                            render: function ( data, type, full ){
							                                return (full[3]!="")?`<span>${full[3]}</span>`:null;
							                            }
							                        }
							                    ]
							                });

											table.on( 'order.dt search.dt', function () {
											    table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
											        cell.innerHTML = i+1;
											    } );
											} ).draw();

											if(data.length>0){
												points.saveUpload(_id,data);
											}
											else{
												$(".display_loading").html("<span class='red-text'>All data are already in the system.</span>");
											}

						                	$("#display_import").removeClass('hidden');
											$("#display_importLoading").addClass('animated zoomOut').html("");
										},1000)
									}
									else{
										Materialize.toast(`It seems that you are uploading a data that is not validated or<br/> either of the following:<br/> 
															&bull; No employees yet; <br/>&bull; Your are uploading too many data; <br/>&bull; You are uploading unformatted CSV file.`,
											10000);
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
	saveUpload:function(_id,_data){	
        $("#save_import").on("click",function(){
			Materialize.toast('Importing...',1000);
        	$(this).addClass('disabled');
			var data = system.xml("pages.xml");
			$(data.responseText).find("loader2").each(function(i,content){
				$(".display_loading").html(content);
	        	setTimeout(function(){
	        		_data = ($.type(_data) == "array")?JSON.stringify(_data):_data;
					var data = system.ajax('../assets/harmony/Process.php?set-uploadPointsAdmin',[_data,_id]);
					data.done(function(data){
						console.log(data);
						if(data == 1){
							Materialize.toast('Saved.',4000);
							App.handleLoadPage("#cmd=index;content=focusClient;"+_id);
						}
						else{
							Materialize.toast('Cannot process request.',4000);
							$(".display_loading").html("");
						}
					});
	        	},1000);
			});
        });
	}
}

request = {
	ini:function(){
	},
	get:function(req,min,offset){
		if(req == 'points'){
			var data = system.ajax('../assets/harmony/Process.php?get-requestPoints',[min,offset]);
			data = data.responseText;
			return data;					
		}
		else{
			var data = system.ajax('../assets/harmony/Process.php?get-requestAccountUpdate',[min,offset]);
			data = data.responseText;
			return data;					
		}
	},
	accountUpdate:function(){
		var content = "", profile = "", req = "", reqCount = "", reqContent = "", genderCall = "", value = "";
		var data = request.get('account update',10,0);
		data = JSON.parse(data);
		if(data.length>0){
			$.each(data,function(i,v){
				profile = (v[0][12] == "")?'avatar.jpg':v[0][12];

				if(v[0][7] == "Male")
					genderCall = "his";
				else
					genderCall = "her";

				if(v[1].length==1)
					reqCount = `<span class=''>${v[1].length} request</span>`;
				else
					reqCount = `<span class=''>${v[1].length} requests</span>`;

				reqContent = "";
				$.each(v[1],function(i2,v2){
					if(v2[5] == "Name"){
						var chunk = JSON.parse(v2[4]);
						value = chunk[1]+" "+chunk[2]+" "+chunk[0];
					}
					else if(v2[5] == "Profile Picture"){
						value = "click to show picture";				
					}
					else{
						value = v2[4];
					}

					reqContent += `<li style='padding:10px; border-bottom: 1px solid #ccc;'>${v[0][4]} wants to change ${genderCall} ${v2[5]} to <u>${value}.</u>
								   <a data-cmd='approve' data-node='${v[0][0]}' data-request='${v2[0]}' class='blue-text hover'>Approve</a>
								   <a data-cmd='cancel' data-node='${v[0][0]}' data-request='${v2[0]}' class='black-text hover'>Cancel</a>
								  </li>`;
				});

				content += `<li class='avatar'>
							   <div class='collapsible-header' style='padding-top: 10px;padding-bottom: 10px;'>
							   	<img src='../assets/images/profile/${profile}' class='circle' width='42px' height='42px'/>
									${v[0][4]} ${v[0][3]}
									<a data-cmd='viewRequests' data-node='${v[0][0]}'>${reqCount}</a>
								</div>
							   <div class='collapsible-body'>
									<ul style='margin: 20px;'>${reqContent}</ul>
								</div>
							</li>`; 
			})
			$("#display_requestsList ul").append(content);
			$("#display_requestsList ul li").removeClass('active');
		    $('.collapsible').collapsible();

			$("a[data-cmd='approve']").on('click',function(){
				var data = $(this).data();
				request.optionsAccountUpdate(['approve',data]);
			});

			$("a[data-cmd='cancel']").on('click',function(){
				var data = $(this).data();
				request.optionsAccountUpdate(['cancel',data]);
			});
		}
		else{
			$("#display_requestsList ul").append("<h4 class='center'>No account update request</h4>");
		}
	},
	points:function(){
		var content = "", profile = "", req = "", reqCount = "", reqContent = "", genderCall = "", value = "";
		var data = request.get('points',10,0);
		data = JSON.parse(data);
		if(data.length>0){
			$.each(data,function(i,v){
				profile = (v[0][12] == "")?'avatar.jpg':v[0][12];

				if(v[0][7] == "Male")
					genderCall = "his";
				else
					genderCall = "her";

				if(v[1].length==1)
					reqCount = `<span class=''>${v[1].length} request</span>`;
				else
					reqCount = `<span class=''>${v[1].length} requests</span>`;

				reqContent = "";
				$.each(v[1],function(i2,v2){
					if(v2[5] == "Name"){
						var chunk = JSON.parse(v2[4]);
						value = chunk[1]+" "+chunk[2]+" "+chunk[0];
					}
					else if(v2[5] == "Profile Picture"){
						value = "click to show picture";				
					}
					else{
						value = v2[4];
					}

					reqContent += `<li style='padding:10px; border-bottom: 1px solid #ccc;'> ${v[0][4]} wants to change ${genderCall} ${v2[5]} to <u>${value}.</u>
								   <a data-cmd='approve' data-node='${v[0][0]}' data-request='${v2[0]}' class='blue-text hover'>Approve</a>
								   <a data-cmd='cancel' data-node='${v[0][0]}' data-request='${v2[0]}' class='black-text hover'>Cancel</a>
								  </li>`;
				});

				content += `<li class='avatar'>
							   <div class='collapsible-header' style='padding-top: 10px;padding-bottom: 10px;'>
							   	<img src='../assets/images/profile/${profile}' class='circle' width='42px' height='42px'/>
									${v[0][4]} ${v[0][3]}
									<a data-cmd='viewRequests' data-node='${v[0][0]}'>${reqCount}</a>
								</div>
							   <div class='collapsible-body'>
									<ul style='margin: 20px;'>${reqContent}</ul>
								</div>
							</li>`; 
			})
			$("#display_requestsList ul").append(content);
			$("#display_requestsList ul li").removeClass('active');
		    $('.collapsible').collapsible();

			$("a[data-cmd='approve']").on('click',function(){
				var data = $(this).data();
				request.optionsPoints(['approve',data]);
			});

			$("a[data-cmd='cancel']").on('click',function(){
				var data = $(this).data();
				request.optionsPoints(['cancel',data]);
			});
		}
		else{
			$("#display_requestsList ul").append("<h4 class='center'>No points request</h4>");
		}
	},
	optionsAccountUpdate:function(data){
		var content = "Are you sure you want to ${data[0]} the request?<br/><br/>";
		$("#modal_confirm .modal-content").html(content);
		$('#modal_confirm .modal-footer').html("<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Close</a><button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Proceed</button>");			
		$('#modal_confirm').modal('open');			

		$("button[data-cmd='button_proceed']").on('click',function(){
			console.log(data);
			if(data[0] == 'approve'){
				var ajax = system.ajax('../assets/harmony/Process.php?request-approve',data[1]);
				ajax.done(function(ajax){
					console.log(ajax);
					if(ajax == 1){
						Materialize.toast('Account updated.',4000);
						$('#modal_confirm').modal('close');	
						App.handleLoadPage("#cmd=index;content=request_accountUpdate;");
					}
					else{
						Materialize.toast('Cannot process request.',4000);
					}
				});
			}
			else{
				var ajax = system.ajax('../assets/harmony/Process.php?request-cancel',data[1]);
				ajax.done(function(ajax){
					console.log(ajax);
					if(ajax == 1){
						Materialize.toast('Request cancelled.',4000);
						$('#modal_confirm').modal('close');	
						App.handleLoadPage("#cmd=index;content=request_accountUpdate;");
					}
					else{
						Materialize.toast('Cannot process request.',4000);
					}
				});

			}
		});
	},
	optionsPoints:function(data){
		var content = "Are you sure you want to "+data[0]+" the additional points?<br/><br/>";
		$("#modal_confirm .modal-content").html(content);
		$('#modal_confirm .modal-footer').html("<a class='waves-effect waves-grey grey-text btn-flat modal-action modal-close right'>Close</a><button type='submit' data-cmd='button_proceed' class='waves-effect waves-grey grey lighten-5 blue-text btn-flat modal-action right'>Proceed</button>");			
		$('#modal_confirm').modal('open');			

		$("button[data-cmd='button_proceed']").on('click',function(){
			console.log(data);
			if(data[0] == 'approve'){
				var ajax = system.ajax('../assets/harmony/Process.php?request-approvePoints',data[1]);
				ajax.done(function(ajax){
					console.log(ajax);
					if(ajax == 1){
						Materialize.toast('Points updated.',4000);
						$('#modal_confirm').modal('close');	
						App.handleLoadPage("#cmd=index;content=request_points;");
					}
					else{
						Materialize.toast('Cannot process request.',4000);
					}
				});
			}
			else{
				var ajax = system.ajax('../assets/harmony/Process.php?request-cancelPoints',data[1]);
				ajax.done(function(ajax){
					console.log(ajax);
					if(ajax == 1){
						Materialize.toast('Request cancelled.',4000);
						$('#modal_confirm').modal('close');	
						App.handleLoadPage("#cmd=index;content=request_points;");
					}
					else{
						Materialize.toast('Cannot process request.',4000);
					}
				});

			}
		});
	}
}

sales = {
	ini:function(){
		const list = this.get();
		this.list(list);
		console.log("xxx");
	},
	get:function(){
		const data = system.html('../assets/harmony/Process.php?get-sales');
		return data.responseText;
	},
	viewOrders:function(data){
		let subTotal = 0;
		let status = ["Pending","Place Order","For Delivery","Closed","Canceled"];
		let statusContent = "";
		$("#modal table").remove();

		let content = `<thead><tr>
					  <th class='center'></th>
					  <th class='center'>Product</th>
					  <th class='center'>Quantity</th>
					  <th class='center'>Price</th>
					  <th class='center'>Total</th>
				  </tr></thead>`;						

		$.each(data[1],function(i,v){
			var product = ((v[17] == "") || (v[17] == null))?"default.png":v[17];
			subTotal = subTotal + (v[10]*v[1]);
			content += `<tr>
						  <td class='center'><img src='../assets/images/products/${product}' alt='Thumbnail' class='valign profile-image' width='80px'></td>
						  <td class='center'>${v[8]}</td>
						  <td class='center'>${v[1]}</td>
						  <td class='center'>${v[10]}</td>
						  <td class='center'>${(v[10]*v[1])}</td>
					  </tr>`;						
		});

		for(let s of status){
			if(s == data[0].meta[3]){
				statusContent += `<option selected>${s}</option>`;
			}
			else{
				statusContent += `<option>${s}</option>`;
			}
		}

		$('#modal .modal-content').html(`<div class='row'>
											<div class='col s3'>
												<table>
													<tr>
														<td class='bold'>Order ID:</td>
														<td>${(data[0].meta[0].substring(0,8))}</td>
													</tr>
													<tr>
														<td class='bold'>Order Date:</td>
														<td>${data[0].meta[1]}</td>
													</tr>
													<tr>
														<td class='bold'>Order Delivered:</td>
														<td>${data[0].meta[2]}</td>
													</tr>
													<tr>
														<td class='bold'>Status:</td>
														<td><select id="field_status">${statusContent}</select></td>
													</tr>
												</table>
											</div>
											<div class='col s9'>
												<div class='card'>
													<table class='striped bordered highlight'>${content}
														<tr><td colspan='4'><strong class='right'>Total</strong></td><td class='center'>${subTotal}</td></tr>
													</table>
												</div>
											</div>`);

	    $("select").material_select();
		$('#modal').modal('open');

		$("#field_status").on('change',function(){
			let statusData = $(this).val();
			sales.updateStatus([data[0].meta[0],statusData]);
		});
	},
	list:function(data){
		const list = JSON.parse(data);
		let content = "";

		if(data.length<=0){
			$("#buyingActivity").html("<h4 class='center'>No buying activity</h4>");
		}
		else{
			$.each(list,function(i,v){
				profile = (v[17] == "")?'avatar.jpg':v[17];
				content += `<tr>
								<td width='1px'>${(i+1)}. </td>
								<td width='20%' class-'center'>
									<img src='../assets/images/profile/${profile}' class='circle' width='42px' height='42px'/><br/>
									<span>${v[9]} ${v[8]}</span>
								</td>
								<td width='20%'>${v[0].substring(0,8)}</td>
								<td width='30%'>${v[2]}</td>
								<td width='30%'>${v[3]}</td>
								<td width='30%'>${v[4]}</td>
								<td width='9%'>
									<a data-cmd='showOrder' data-node='${v[0]}' data-meta='${JSON.stringify([v[0],v[2],v[3],v[4]])}' class='tooltipped btn-floating waves-effect black-text no-shadow grey lighten-5 right' data-position='left' data-delay='0' data-tooltip='Show details'>
										<i class='material-icons right hover black-text'>more_vert</i>
									</a>
								</td>
							</tr>`;
			});

			content = `<table class='display dataTable bordered' width="100%">
				            <thead>
				                <tr>	
				                    <td width='1%'>#</td>
				                    <td>Ordered By</td>
				                    <td>Order ID</td>
				                    <td>Order Date</td>
				                    <td>Order Delivered</td>
				                    <td>Status</td>
				                    <td></td>
				                </tr>
				            </thead>
				            <tbody>${content}</tbody>
				        </table>`;

			$("#display_orderList").html(content);
		    $("select").material_select();
		    $(".dropdown-button").dropdown();

			var table = $('#display_orderList table').DataTable({
		        "order": [[ 0, 'asc' ]],
		        bLengthChange:false,
		        "drawCallback": function ( settings ) {
		            var api = this.api();
		            var rows = api.rows( {page:'current'} ).nodes();
		            var last=null;
		        }
		    });

			$("a[data-cmd='showOrder']").on('click',function(){
				var data = $(this).data();
				var orders = system.ajax('../assets/harmony/Process.php?get-orders',data.node);
				orders.done(function(orders){
					var orders = JSON.parse(orders);
					sales.viewOrders([data,orders]);
				});
			});
		}
	},
	updateStatus:function(statusData){
		const data = system.ajax('../assets/harmony/Process.php?update-orderStatus',statusData);
		data.done(function(returnData){
			if(returnData == 1){
				Materialize.toast(`Order has been ${statusData[1]}.`,4000);
				$('#modal').modal('close');	
				sales.ini();
			}
			else{
				Materialize.toast('Cannot process request.',4000);
			}
		});
	}
}