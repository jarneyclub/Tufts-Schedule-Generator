const testRegister = (option, callback) => {

    let endpoint = "/auth/register";

    let url;

    if (option == "DEV") {
        url = BASEURL_DEVELOPMENT + endpoint;
    }
    else if (option == "PROD") {
        url = BASEURL_PRODUCTION + endpoint;
    }

    var xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);

    var body = {
        name: "jeremy",
        email: "aaa@gmail.com",
        email_confirmation: "aaa@gmail.com",
        password: "12345"
    };

    xhr.setRequestHeader("Content-type", "application/json");

    var bodyStringified = JSON.stringify(body);

    xhr.send(bodyStringified);

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200)
            callback(JSON.parse(this.responseText));
        else if (this.status === 400 || this.status === 401 || this.status === 403)
            callback(JSON.parse(this.responseText));
    };
}

const testLogin = (option, callback) => {
    let endpoint = "/auth/login";

    let url;

    if (option == "DEV") {
        url = BASEURL_DEVELOPMENT + endpoint;
    }
    else if (option == "PROD") {
        url = BASEURL_PRODUCTION + endpoint;
    }

    var xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);

    var body = {
        email: "aaa@gmail.com",
        password: "12345"
    };

    xhr.setRequestHeader("Content-type", "application/json");

    var bodyStringified = JSON.stringify(body);

    xhr.send(bodyStringified);

    xhr.onreadystatechange = function () {


        if (this.readyState == 4 && this.status == 200) {

            callback(JSON.parse(this.responseText));
        }
        else if (this.status === 400 || this.status === 401 || this.status === 403) {
            callback(JSON.parse(this.responseText));
        }

    };
}