$(document).ready(function() {
    $('.modal').modal();
});

account = {
    ini: function() {
        var data = this.get();
        this.display(JSON.parse(data));

        $("#log-out").on('click', function() {
            login.kill();
        });
    },
    get: function() {
        var data = system.html('../assets/harmony/Process.php?get-accountRM');
        return data.responseText;
    },
    id: function() {
        let data = JSON.parse(this.get());
        return data[0][0];
    },
    display: function(data) {
        var content = "";
        var profile = (data[0][16] == "") ? 'avatar.png' : data[0][16];

        $("#user-account img.profile-image").attr({
            "src": "../assets/images/profile/" + profile
        });
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

client = {
    ini: function() {
        this.add();
    },
    get: function(id) {
        if ((typeof id == null) || (id == undefined)) {
            var data = system.ajax('../assets/harmony/Process.php?get-allClient', []);
            return data.responseText;
        }
        else{
            var data = system.ajax('../assets/harmony/Process.php?get-client', id);
            return data.responseText;
        }
    },
    list: function() {
        let rm_data = account.id();
        var data = system.ajax('../assets/harmony/Process.php?get-allClientByRM',rm_data);
        data.done(function(data){
        	let result = JSON.parse(data);
        	if(result.length>0){
		        let content = "";
		        $.each(result, function(i, v) {
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
										<th></th><th>Names</th><th>Occupation</th><th>Date</th><th></th>
									</tr>
								</thead>
								<tbody>${content}</tbody></table>`;
		        $("#display_list").html(content);

		        var table = $('#display_list table').DataTable({
		            "order": [[1, 'asc']],
		            bLengthChange: false,
		            "drawCallback": function(settings) {
		                var api = this.api();
		                var rows = api.rows({
		                    page: 'current'
		                }).nodes();
		                var last = null;
		            }
		        });

        	}
        	else{
        		$("#display_list").html("<h6>You do not have customer. <a href='#cmd=index;content=_add_client'>Schedule your first customer now.</a></h6>");
        	}
        });
    },
    display: function() {
        let id = window.location.hash.substring(1).split(';');
        let data = JSON.parse(this.get(id[2]));

        // console.log(this.getPlan(id[2]));
        let plans = JSON.parse(this.getPlan(id[2]));
        this.listPlan(plans);

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
        $("#display_addPlan").html(`<button data-cmd='modal_addPlan' data-node='${id[2]}' class='btn orange waves-effect waves-light right round-button z-depth-0' type='submit'>Set a plan</button>`);

        plan.check(id[2]);
    },
    getPlan: function(id) {
        var data = system.ajax('../assets/harmony/Process.php?get-purchasedPlan', id);
        return data.responseText;
    },
    listPlan: function(data) {
        if (data.length > 0) {
        	$.each(data,function(i,v){
        		console.log(v);
        		content += `
        			<tr>
        				<td>${v[6].substring(0,8)}</td>
        				<td>${v[7]}</td>
        				<td>${v[4]}</td>
        			</tr>
        		`;
        	})

        	content = `
        		<table>
        			<tr>
        				<td>Policy #</td>
        				<td>Plan</td>
        				<td>Date Acquired</td>
        			</tr>
        			${content}
        		</table>
        	`;
        }
        else {
            content = `<div class="center">
							<div class="divider"></div>
							<h5>No plans</h5>
						</div>`;
        }

        $("#display_listPlan").html(content);
    },
    add: function(_new) {
        let rm_id = account.id();
        $("#form_registerClient").validate({
            rules: {
                field_newClient: {
                    required: false,
                    maxlength: 50
                },
                field_givenname: {
                    required: _new,
                    maxlength: 50
                },
                field_middlename: {
                    required: _new,
                    maxlength: 50
                },
                field_familyname: {
                    required: _new,
                    maxlength: 50
                },
                field_dateofbirth: {
                    required: _new,
                    maxlength: 50
                },
                field_gender: {
                    required: _new,
                    maxlength: 50
                },
                field_address: {
                    required: _new,
                    maxlength: 300
                },
                field_contact: {
                    required: _new,
                    maxlength: 50
                },
                field_email: {
                    required: _new,
                    maxlength: 50,
                    checkEmail: _new,
                    validateEmail: _new
                },
                field_occupation: {
                    required: _new,
                    maxlength: 300
                },
                field_oldClientName: {
                    required: _new,
                    maxlength: 50
                },
                field_date: {
                    required: _new,
                    maxlength: 50
                },
                field_time: {
                    required: _new,
                    maxlength: 50
                },
                field_meetingPlace: {
                    required: _new,
                    maxlength: 1000
                },
            },
            errorElement: 'div',
            errorPlacement: function(error, element) {
                var placement = $(element).data('error');
                if (placement) {
                    $(placement).append(error)
                } else {
                    error.insertAfter(element);
                }
            },
            submitHandler: function(form) {
                let _form = $(form).serializeArray();
                let _clientId = $("#display_clientId").html();
                if (_form[0]['value'] == 'on') {
                    var data = system.ajax('../assets/harmony/Process.php?set-newClientByRM', [rm_id, _form]);
                    data.done(function(data) {
                        console.log(data);
                        if (data == 1) {
                            Materialize.toast('Saved.', 4000);
                            App.handleLoadPage("#cmd=index;content=_add_client");
                        } else {
                            Materialize.toast('Cannot process request.', 4000);
                        }
                    });
                } else {
                    var data = system.ajax('../assets/harmony/Process.php?set-clientBooking', [rm_id, _clientId, _form[10]['value'], _form[11]['value'], _form[12]['value']]);
                    data.done(function(data) {
                        console.log(data);
                        if (data == 1) {
                            Materialize.toast('Saved.', 4000);
                            App.handleLoadPage("#cmd=index;content=_add_client");
                        } else {
                            Materialize.toast('Cannot process request.', 4000);
                        }
                    });
                }
            }

        });
    },
}

plan = {
    ini: function() {
        this.add();
    },
    get: function(id) {
        if ((typeof id == null) || (id == undefined)) {
            var data = system.html('../assets/harmony/Process.php?get-allPlans');
            return data.responseText;
        } else {
            var data = system.ajax('../assets/harmony/Process.php?get-plan', id);
            return data.responseText;
        }
    },
    list: function() {
        let data = JSON.parse(this.get());
        let content = "";
        $.each(data, function(i, v) {
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
    check: function(id) {
        let content = "";
        let allplans = JSON.parse(this.get());

        $.each(allplans, function(i, v) {
            content += `<tr>
							<td width='70%'>${v[1]}</br><small>${v[3]}</small></td>
							<td><a data-cmd='action_avail' data-node='${v[0]}' class='btn-floating waves-effect waves-light right orange z-depth-0'><i class='material-icons'>check</i></a></td>
						</tr>`;
        });

        $("button[data-cmd='modal_addPlan']").on('click', function() {
            $("#modal_confirm").html(`<div class='row'><h5 class="col s10 offset-s1">Select Plan</h5></div>
			 							<table class='striped'>${content}</table>`);
            $('#modal_confirm').modal('open');
            plan.avail(id);
        });
    },
    avail: function(id) {
        $("a[data-cmd='action_avail']").on('click', function(e) {
            var data = system.ajax('../assets/harmony/Process.php?avail-plan', [id, $(this).data('node')]);
            data.done(function(data) {
                if (data == 1) {
                    Materialize.toast('Success.', 4000);
                    window.location.reload();
                } else {
                    Materialize.toast('Cannot process request.', 4000);
                }
            });
        })
    }
}

sales = {
	ini:function(){
		$("#subcontent").parent().removeClass('col s12 m8 l8');
		$("#display_side").remove();
		sales.display_customChart();
		sales.display_todayChart();
		sales.display_weekChart();
		sales.display_monthChart();
		sales.display_yearChart();
	    $('.tooltipped').tooltip({delay: 50});
	},
    linechart: function(dom,label,title,data) {
        let ctx = $(dom);
        let chart = new Chart(ctx,{
            type: 'line',
            data: {
                labels: label,
                datasets: [{
                    label: title,
                    data: data,
                    backgroundColor: ['rgba(14, 0, 89, 0.2)'],
                    borderColor: ['rgba(14, 0, 89, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    },
    barchart: function() {
        let ctx = $("#chart_totalSales");
        let chart = new Chart(ctx,{
            type: 'bar',
            data: {
                labels: ["M", "T", "W", "Th", "F", "S"],
                datasets: [{
                    label: 'Sales 1',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: 'rgba(14, 0, 89, 1)',
                }, {
                    label: 'Sales 2',
                    data: [9, 7, 11, 8, 1, 13],
                    backgroundColor: 'rgba(247, 127, 0, 1)',
                }]
            },
        });
    },
    get: function(data) {
        var result = system.ajax('../assets/harmony/Process.php?get-salesByDates', data);
        return result.responseText;
    },
    display_customChart: function() {
        let rm_data = account.id();
        let now_date = moment().format("YYYY-MM-DD");
        $("#field_dateFrom").attr({"max": now_date});
        $("#form_registerClient").on('change', function() {
            let data = $(this).serializeArray();
            $("#field_dateTo").attr({min: data[0]['value']});
            if ((data[0]['value'] != '') && (data[1]['value'] != '')) {
                let result = JSON.parse(sales.get([rm_data,[data[0]['value'],data[1]['value']]]));
                let _dateDiff = moment.duration(moment(data[1]['value']).diff(moment(data[0]['value'])));

				var from = new Date(data[0]['value']);
				var to = new Date(data[1]['value']);
				let label = [], value = [];
				for (var day = from; day <= to; day.setDate(day.getDate() + 1)) {
					var a = system.searchJSON(result,0,moment(day).format("YYYY-MM-DD"));
					if(a.length>0){
						label.push(moment(a[0][0]).format("MMM-DD"));
						value.push(a[0][1]);
					}
					else{
						label.push(moment(day).format("MMM-DD"));
						value.push(0);
					}
				}
				sales.linechart("#chart_sales",label,'Sales: ',value);
            }
        });
    },
    display_todayChart: function(){
        let rm_data = account.id();
        let now_date = moment().format("YYYY-MM-DD");

        let result = system.ajax('../assets/harmony/Process.php?get-salesToday', [rm_data,now_date]);
        result.done(function(data){
        	let result = JSON.parse(data);
	        let time = "";
			let _label = [], _data = [];
			for (let hour = 1; hour <= 23; hour++) {
				for(let minute = 0; minute <= 59; minute++){
					time = moment().format("YYYY-MM-DD HH:mm");
					var a = system.searchJSON(result,0,time);
					if(a.length>0){
						_label.push(moment(a[0][0]).format("HH:mm"));
						_data.push(a[0][1]);
					}
					else{
						_label.push(moment(time).format("HH:mm"));
						_data.push(0);
					}
				}
			}
			sales.linechart("#chart_todaySales canvas",_label,'Sales: ',_data);
        });
    },
    display_weekChart: function(){
        let rm_data = account.id();
        let startWeek = moment().startOf('week').format("YYYY-MM-DD"), endWeek = moment().endOf('week').format("YYYY-MM-DD");
		let label = [], value = [];

        let result = system.ajax('../assets/harmony/Process.php?get-salesByWeek', [rm_data,[startWeek,endWeek]]);
        result.done(function(data){
			let label = [], value = [];
        	let result = JSON.parse(data);
        	$.each(moment.weekdays(),function(i,v){
				var a = system.searchJSON(result,0,v);
				if(a.length>0){
					label.push(a[0][0]);
					value.push(a[0][1]);
				}
				else{
					label.push(v);
					value.push(0);
				}
        	});

			sales.linechart("#chart_weekSales canvas",label,'Sales: ',value);
        });
    },
    display_monthChart: function(){
        let rm_data = account.id();
        let startofMonth = moment().startOf('month').format("YYYY-MM-DD");
		let endofMonth = moment().endOf("month").format("YYYY-MM-DD");

        let result = JSON.parse(sales.get([rm_data,[startofMonth,endofMonth]]));
        let _dateDiff = moment.duration(moment(endofMonth).diff(moment(startofMonth)));

		var from = new Date(startofMonth);
		var to = new Date(endofMonth);
		let label = [], value = [];
		for (var day = from; day <= to; day.setDate(day.getDate() + 1)) {
			var a = system.searchJSON(result,0,moment(day).format("YYYY-MM-DD"));
			if(a.length>0){
				label.push(moment(a[0][0]).format("MMM-DD"));
				value.push(a[0][1]);
			}
			else{
				label.push(moment(day).format("MMM-DD"));
				value.push(0);
			}
		}
		sales.linechart("#chart_monthSales canvas",label,'Sales: ',value);
    },
    display_yearChart: function(){
        let rm_data = account.id();
        let now_date = moment().format("YYYY-MM-DD");
        let startofYear = moment().startOf('year').format("YYYY-MM-DD");
		let endofYear = moment().endOf("year").format("YYYY-MM-DD");

        let result = system.ajax('../assets/harmony/Process.php?get-salesByMonths', [rm_data,[startofYear,endofYear]]);
        result.done(function(data){
			let label = [], value = [];
        	let result = JSON.parse(data);
        	$.each(moment.months(),function(i,v){
				var a = system.searchJSON(result,0,v);
				if(a.length>0){
					label.push(a[0][0]);
					value.push(a[0][1]);
				}
				else{
					label.push(v);
					value.push(0);
				}
        	});
			sales.linechart("#chart_yearSales canvas",label,'Sales: ',value);
        });
    },
}

booking = {
    add: function() {
        let now_date = moment(moment().format("YYYY-MM-DD")).add(1, 'day').format("YYYY-MM-DD");
        $("#field_date").attr({"min": now_date});
        client.add(true);

        $('input.autocomplete').on('keyup', function() {
            let data = system.ajax('../assets/harmony/Process.php?get-searchClient', $(this).val());
            data.done(function(data) {
                let search = {};
                let result = JSON.parse(data);
                $.each(result, function(i, v) {
                    search[`${v[1]} ${v[2]} ${v[3]}`] = {
                        id: v[0],
                        img: `../assets/images/profile/${v[4]}`
                    };
                });

                $('input.autocomplete').autocomplete({
                    data: search,
                    limit: 20,
                    onAutocomplete: function(val) {
                        $("#display_clientId").html(val);
                    },
                    minLength: 1,
                });

                $('.autocomplete-content').on('click', function() {
                    let data = $(this);
                    console.log(data);
                })
            });
        });

        $('#field_newClient').on('change', function() {
            let isChecked = $(this)[0].checked;
            $(".display_error").html("");
            if (isChecked) {
                $("#display_field_oldClientName").addClass('hide');
                $('.collapsible').collapsible('open', 0);
                client.add(true);
            } else {
                $("#display_field_oldClientName").removeClass('hide');
                $('.collapsible').collapsible('close', 0);
                client.add(false);
            }
        })
    },
    get: function(data) {
        var data = system.ajax('../assets/harmony/Process.php?get-bookingByRM', [data]);
        return data.responseText;
    },
    list: function() {
        let rm_data = account.id();
        let result = JSON.parse(this.get(rm_data));
        let data = [];

        $.each(result,function(i,v){
        	data.push({title:`${v[4]} ${v[5]} -Call: ${v[6]}, Place: ${v[3]} `, start:`${v[1]}T${v[2]}`, data:v});
        })

        this.calendar(data);
    },
    calendar: function(data) {
        $('#calendar').fullCalendar({
            header: {
                left: 'prev, next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay,listMonth'
            },
            navLinks: true,
            editable: false,
            eventSources: [{
                events: data,
                color: '#1a237e',
                textColor: '#fff',
            }],
		    eventClick: function(calEvent, jsEvent, view) {
		    	let now = moment().format('YYYY-MM-DD');
		    	console.log(now);
		    	console.log();
		    	let control = (now ==  calEvent.data[1])?'':'disabled';
		    	let content = `
		    		<h6>Customer Meeting</h6>
		    		<table>
		    			<tr>
		    				<td class='bold'>Name: </td>
		    				<td>${calEvent.data[4]} ${calEvent.data[5]}</td>
		    			</tr>
		    			<tr>
		    				<td class='bold'>Date and Time: </td>
		    				<td>${calEvent.data[1]} ${calEvent.data[2]}</td>
		    			</tr>
		    			<tr>
		    				<td class='bold'>Place: </td>
		    				<td>${calEvent.data[3]}</td>
		    			</tr>
		    			<tr>
		    				<td class='bold'>Contact: </td>
		    				<td>${calEvent.data[6]}</td>
		    			</tr>
		    			<tr>
		    				<td colspan='2'>
			    				<a href='' class='btn left indigo darken-5 z-depth-0 waves-effect waves-light round-button'>Set a plan</a>
			    				<a href='#cmd=index;content=_account_client;${calEvent.data[0]}' class='right'>View account</a>
		    				</td>
		    			</tr>
		    		</table>
		    	`;

				$("#modal_confirm .modal-content").html(content);
				$('#modal_confirm .modal-footer').remove();			

				$('#modal_confirm').modal('open');
		        // alert('Meeting with: ' + calEvent.title);
		        // console.log(calEvent.id);
		    }
        })
    },
    getTodaysAppointment:function(){
        let rm_data = account.id();
        var data = system.ajax('../assets/harmony/Process.php?get-bookingByRMToday',[rm_data,moment().format('YYYY-MM-DD')]);
       	data.done(function(data){
       		let result = JSON.parse(data);
       		if(result.length>0){
	       		let content = '';
       			$.each(result,function(i,v){
       				content += `<tr>
						<td width='20%' style='vertical-align: top;'>
							<img src="../assets/images/profile/avatar.png" class="circle left" width="35px">
						</td>	
						<td width='80%'>
							<span class="bold"> ${v[4]} ${v[5]}</span>
							<div> Call: ${v[6]}</div>
							<div> Time: ${v[2]}</div>
							<div> Meet at: ${v[3]}</div>
			    				<a href='' class='btn indigo darken-5 z-depth-0 waves-effect waves-light round-button'>Set a plan</a>
			    				<a href='#cmd=index;content=_account_client;${v[0]}' class=''>View account</a>							
						</td>
					</tr>`;
       			});
       			$("#display_rm_appointment table").html(content);       			
       		}
       		else{
       			$("#display_rm_appointment").html('<h6>You have no appointment today.</h6>');
       		}
       	});
    }
}