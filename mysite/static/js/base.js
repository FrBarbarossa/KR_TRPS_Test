function addListener(event, obj, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(event, fn, false);   // modern browsers
    } else {
        obj.attachEvent("on" + event, fn);          // older versions of IE
    }
}

addListener('load', window, showNavbar);

function showNavbar() {
    $.ajax({
        headers: {"X-CSRFToken": getCookie("csrftoken")},
        url: `/accounts/get_nav_info/`,
        type: "GET",
        processData: false,
        contentType: "application/json; charset=UTF-8",
        // on success
        success: function (response) {
            if (response.data) {
                let datum = response.data
                if (datum['type'] == 'profile') {
                    document.getElementById('navbarSupportedContent').innerHTML = `<ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="/polls/tasks">Задания</a>
                </li>
                 <li class="nav-item">
                    <a class="nav-link" href="#">Реферальная программа</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Поддержка</a>
                </li>
                
            </ul>
            <div class="d-flex me-3">
                <h5 id="org_balance" class="text-success">${datum['balance']} у.е.</h5>
            </div>
            <div class="d-flex me-3">
               <h5> <a style="text-decoration: none;outline: none;color: inherit;" href="/accounts/profile">${datum['name']}</a> </h5>
            </div>
            <div class="d-flex me-2">
             <a style="text-decoration: none;outline: none;color: inherit;" href="/accounts/profile">
                <img class="rounded-circle account-img" src=${datum['avatar']}
                         style="cursor: pointer;width:3em; height:3em;"/>
             </a>
            </div>
            <div class="d-flex">
             <a  href="/accounts/logout"><button class="btn btn-danger">Выход</button></a>
            </div>`
                }
                if (datum['type'] == 'anonymous') {
                    document.getElementById('navbarSupportedContent').innerHTML = `<ul class="navbar-nav me-auto mb-2 mb-lg-0">
                 
                <li class="nav-item">
                    <a class="nav-link" href="#">Поддержка</a>
                </li>
                
            </ul>
            
            <div class="d-flex me-3">
                <a href="/accounts/login"><button class="btn btn-primary">Войти</button></a>
            </div>
            <div class="d-flex">
                <a href="/accounts/register"><button class="btn btn-success">Зарегестрироваться</button></a>
            </div>`
                }
                if (datum['type'] == 'organization') {
                    document.getElementById('navbarSupportedContent').innerHTML = `<ul class="navbar-nav me-auto mb-2 mb-lg-0">
             
                <li class="nav-item">
                    <a class="nav-link" href="/polls/organization/${datum['id']}">Организация</a>
                </li>
                 <li class="nav-item">
                    <a class="nav-link" href="#">Реферальная программа</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Поддержка</a>
                </li>
                
            </ul>
          
            <div class="d-flex me-3">
               <h5> <a style="text-decoration: none;outline: none;color: inherit;" href="/accounts/profile">${datum['name']}</a> </h5>
            </div>
            <div class="d-flex me-2">
             <a style="text-decoration: none;outline: none;color: inherit;" href="/accounts/profile">
                <img class="rounded-circle account-img" src=${datum['avatar']}
                         style="cursor: pointer;width:3em; height:3em;"/>
             </a>
            </div>
            <div class="d-flex">
             <a  href="/accounts/logout"><button class="btn btn-danger">Выход</button></a>
            </div>`
                }
                console.log(response.data);
            } else {
                // form_data = [];
            }

            // if (response.status != "Ok") {
            //     alert('Редактирование формы невозможно. Некоторые данные уже были размечены по форме в данной конфигурации.')
            // }
            // if (response.repeat_times) {
            //     document.getElementById('repeats').value = response.repeat_times;
            // }
            // if (response.duration) {
            //     let timeSplited = response.duration.split(":");
            //     console.log(timeSplited);
            //     document.getElementById('minutes').value = timeSplited[0];
            //     document.getElementById('seconds').value = timeSplited[1];
            //
            // }
        },
        // on error
        error: function (response) {
            // alert the error if any error occured
            console.log("Not success message 2");
            console.log(response.responseJSON);
            window.location.replace(document.referrer);
            alert('Error 403 forbidden');
        }
    });
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}