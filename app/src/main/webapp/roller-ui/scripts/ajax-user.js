/*
* Licensed to the Apache Software Foundation (ASF) under one or more
*  contributor license agreements.  The ASF licenses this file to You
* under the Apache License, Version 2.0 (the "License"); you may not
* use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.  For additional information regarding
* copyright in this work, please see the NOTICE file in the top level
* directory of this distribution.
*/

// Used in: MemberInvite.jsp, UserAdmin.jsp

function createRequestObject() {
    let ro;
    const browser = navigator.appName;
    if (browser === "Microsoft Internet Explorer") {
        ro = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        ro = new XMLHttpRequest();
    }
    return ro;
}

const http = createRequestObject();
let init = false;
let isBusy = false;
const userURL = "<%= request.getContextPath() %>" + "/roller-ui/authoring/userdata?length=50";

function onUserNameFocus(enabled) {
    if (!init) {
        init = true;
        const u = userURL;
        if (enabled != null) u = u + "&enabled=" + enabled;
        sendUserRequest(u);
    } else {
        const userSubmitButton = document.getElementById("user-submit");
        userSubmitButton.disabled = true;
    }
}

function onUserNameChange(enabled) {
    const u = userURL;
    if (enabled != null) u = u + "&enabled=" + enabled;
    const userName = document.getElementById("userName");
    if (userName.value.length > 0) u = u + "&startsWith=" + userName.value;
    sendUserRequest(u);
}

function onUserSelected() {
    const userList = document.getElementById("userList");
    const user = userList.options[userList.options.selectedIndex];
    const userName = document.getElementById("userName");
    userName.value = user.value;

    const userSubmitButton = document.getElementById("user-submit");
    userSubmitButton.disabled = false;
}

function sendUserRequest(url) {
    if (isBusy) return;
    isBusy = true;
    http.open('get', url);
    http.onreadystatechange = handleUserResponse;
    http.send(null);
}

function handleUserResponse() {
    if (http.readyState === 4) {
        const userList = document.getElementById("userList");
        for (let i = userList.options.length; i >= 0; i--) {
            userList.options[i] = null;
        }
        const data = http.responseText;
        if (data.indexOf("\n") !== -1) {
            const lines = data.split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].indexOf(',') !== -1) {
                   const userArray = lines[i].split(',');
                   userList.options[userList.length] =
                      new Option(userArray[0] + " (" + userArray[1] + ")", userArray[0]);
                }
            }
        }

    }
    isBusy = false;
}
