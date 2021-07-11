const testGetCoursesByCnum = async (option, cnum) => {
    return new Promise(function (resolve, reject) {
        let endpoint = "/courses/general" + "?cnum=" + cnum;
        let url;
        if (option == "DEV")
            url = BASEURL_DEVELOPMENT + endpoint;
        else if (option == "PROD")
            url = BASEURL_PRODUCTION + endpoint;

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200)
                resolve(JSON.parse(this.responseText));
            else if (this.status === 400 || this.status === 401 || this.status === 403)
                reject(JSON.parse(this.responseText));
        };
    })
}

const testGetCoursesTerm = async (option, cnum, attr) => {
    return new Promise(function (resolve, reject) {
        let endpoint = "/courses/term" + "?cnum=" + cnum + "&attr=" + attr;
        let url;
        if (option == "DEV")
            url = BASEURL_DEVELOPMENT + endpoint;
        else if (option == "PROD")
            url = BASEURL_PRODUCTION + endpoint;

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200)
                resolve(JSON.parse(this.responseText));
            else if (this.status === 400 || this.status === 401 || this.status === 403)
                reject(JSON.parse(this.responseText));
        };
    })
}