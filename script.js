let TOKEN;
const clientID = "d99e62ec61cf40769714bb2076eb1cf1";
const redirectURI = window.location.origin;
const scope = "user-read-private user-read-email user-top-read";

function authorize() {
    const params = {
        response: "?response_type=token",
        client: "&client_id=" + encodeURIComponent(clientID),
        scopes: "&scope=" + encodeURIComponent(scope),
        redirect: "&redirect_uri=" + encodeURIComponent(redirectURI),
    }

    const { response, client, scopes, redirect } = params;

    const url = `http://accounts.spotify.com/authorize${response}${client}${scopes}${redirect}`;

    window.open(url, "_self");
}

function extractToken() {
    const hash = window.location.hash;

    if (hash && hash.includes("access_token")) {
        const url = hash.replace("#access_token=", "");
        const splits = url.split("&");
        const token = splits[0];
        return token;
    } else {
        return null;
    }
}

window.addEventListener("load", () => {
    TOKEN = extractToken();

    if (TOKEN) {
        fetchNewRealeases();
        fetchFeaturedPlaylists();
        fetchRandomSongs();
    } else {
        authorize();
    }
})

async function fetchNewRealeases() {
    try {
        const params = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            }
        }

        const request = await fetch("https://api.spotify.com/v1/browse/new-releases?limit=5", params);
        const data = await request.json();

        const tracks = data.albums.items;

        for (let items of tracks) {
            const image = items.images[1].url;
            const title = items.name;
            const subtitle = items.artists[0].name;
            const link = items.external_urls.spotify;

            displayNewRealeases(image, title, subtitle, link);
        }
    } catch (e) {
        alert("Something went wrong :(");
        console.log(e);
    }
}

async function fetchFeaturedPlaylists() {
    try {
        const params = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            }
        }

        const request = await fetch("https://api.spotify.com/v1/browse/featured-playlists?limit=5", params);
        const data = await request.json();

        const tracks = data.playlists.items;

        for (let items of tracks) {
            const image = items.images[0].url;
            const title = items.name;
            const subtitle = items.description;
            const link = items.external_urls.spotify;

            displayFeaturedPlaylists(image, title, subtitle, link);
        }
    } catch (e) {
        alert("Something went wrong :(");
        console.log(e);
    }
}

async function fetchRandomSongs() {
    try {
        const params = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            }
        }

        const request = await fetch("https://api.spotify.com/v1/search?q=a&type=track&limit=5", params);
        const data = await request.json();

        const tracks = data.tracks.items;

        for (let items of tracks) {
            const image = items.album.images[1].url;
            const title = items.name;
            const subtitle = items.artists[0].name;
            const link = items.external_urls.spotify;

            displayRandomSongs(image, title, subtitle, link);
        }
    } catch (e) {
        alert("Something went wrong :(");
        console.log(e);
    }
}

function displayNewRealeases(image, title, subtitle, link) {
    const cardWrapper = document.querySelector(".playlist-wrapper");
    const card = document.createElement("div");

    card.classList.add("song-card");

    card.innerHTML = `
    <a class="song-card" href="${link}" target="_blank">
    <div class="img-box">
        <img class="song-img" src="${image}"
            alt="">
        <span class="mdi mdi-play mdi-36px"></span>
    </div>
    <h4>${title}</h4>
    <p>${subtitle}</p>
    </a>`

    cardWrapper.appendChild(card);
}

function displayFeaturedPlaylists(image, title, subtitle, link) {
    const cardWrapper = document.querySelectorAll(".playlist-wrapper")[1];
    const card = document.createElement("div");

    card.classList.add("song-card");

    card.innerHTML = `
    <a class="song-card" href="${link}" target="_blank">
    <div class="img-box">
        <img class="song-img" src="${image}"
            alt="">
        <span class="mdi mdi-play mdi-36px"></span>
    </div>
    <h4>${title}</h4>
    <p>${subtitle}</p>
    </a>`

    cardWrapper.appendChild(card);
}

function displayRandomSongs(image, title, subtitle, link) {
    const cardWrapper = document.querySelectorAll(".playlist-wrapper")[2];
    const card = document.createElement("div");

    card.classList.add("song-card");

    card.innerHTML = `
    <a class="song-card" href="${link}" target="_blank">
    <div class="img-box">
        <img class="song-img" src="${image}"
            alt="">
        <span class="mdi mdi-play mdi-36px"></span>
    </div>
    <h4>${title}</h4>
    <p>${subtitle}</p>
    </a>`

    cardWrapper.appendChild(card);
}