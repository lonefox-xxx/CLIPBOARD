const msgid = document.querySelector('#id')
const button = document.querySelector('.button')
const msg_area = document.querySelector('#msg_content')
const copy = document.querySelector('.copy')
const inputarea = document.querySelector('.inputarea')
const create_button = document.querySelector('.create_new')
const content_section = document.querySelector('.content_section')
const insert_button = document.querySelector('.insert')
const inserdata = document.querySelector('#content')
const insert_msgid = document.querySelector('#insert_msgid')

button.addEventListener('click', () => {
    if (msgid.value != "") {
        button.classList.add('button_active')
        button.disabled = true;
        getdata(msgid.value)
        console.log(msgid.value);
    }
    msgid.value = ""
})
copy.addEventListener('click', () => {
    if (msg_area.innerHTML != "") {
        copy.classList.add('copy_active')
        copy.disabled = true;
        copy.innerHTML = "COPYED"
        navigator.clipboard.writeText(msg_area.innerHTML)
        setTimeout(() => {
            copy.classList.remove('copy_active')
            copy.disabled = false;
            copy.innerHTML = "COPY"
        }, 3000);
    }
})

msg_area.addEventListener('mouseover', () => {
    // alert('ok')
})
function getdata(id) {
    const body = {
        id: id,
    };

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'access control check ': 'Access-Control-Allow-Origin'
        },
        body: JSON.stringify(body)
    };

    fetch(`https://gqcc41bhic.execute-api.us-west-2.amazonaws.com/prod/get_cache/online-clipboard/${id}`)
        .then(response => response.json())
        .then(data => {
            const msg = data.cache_values

            const text = totext(msg)
            msg_area.innerHTML = text

            button.classList.remove('button_active')
            button.disabled = false;
        })
        .catch(error => console.error(error));

}

function totext(data) {
    const base64string = data;
    const withoutPrefix = base64string.replace("data:text/plain;base64,", "");
    const decoder = new TextDecoder("utf-8");
    const plaintext = decoder.decode(new Uint8Array(atob(withoutPrefix).split("").map(c => c.charCodeAt(0))));
    return plaintext

}

create_button.addEventListener('click', () => {
    content_section.classList.toggle('flipcard')
    if (create_button.innerHTML === "INSERT") {
        create_button.innerHTML = "RETRIEVE";
    } else {
        create_button.innerHTML = "INSERT";
    }

})

insert_button.addEventListener('click', () => {
    if (inserdata.value != "") {
        insert_data(inserdata.value);
        inserdata.value = ""
        insert_msgid.innerHTML = "getting...."
        insert_button.classList.add('button_active')
    }
})

function insert_data(data) {
    const base64text = textToBase64(data)
    const putdata = putdta(base64text);
    // console.log(putdata);
}

function textToBase64(text) {
    return btoa(text);
}

function putdta(msg) {
    var url = "https://gqcc41bhic.execute-api.us-west-2.amazonaws.com/prod/create_cache";

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", url);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            const response = JSON.parse(xhr.responseText)
            const id = response.cache_id;

            insert_msgid.innerHTML = id
            insert_button.classList.add('button_active')

        }
    };

    const cache_id = Math.floor(1000 + Math.random() * 9000);

    var data = `{"cache_id":${cache_id},"game_id":"online-clipboard","cache_values":"data:text/plain;base64,${msg}","expiry":1000}`;

    xhr.send(data);

}

inserdata.addEventListener('dblclick', () => {

    navigator.clipboard.readText().then(clipText => {

        inserdata.value = clipText
    });

})
