var googleTranslateConfig = {
    lang: "id"
};

function translate() {
    TranslateInit(googleTranslateConfig)
}

function TranslateInit(e) {
    e.langFirstVisit && !Cookies.get("googtrans") && TranslateCookieHandler("/auto/" + e.langFirstVisit);
    let a = TranslateGetCode(e);
    TranslateHtmlHandler(a), a == e.lang && TranslateCookieHandler(null, e.domain), new google.translate
        .TranslateElement({
            pageLanguage: e.lang,
            multilanguagePage: !0
        }), TranslateEventHandler("click", "[data-google-lang]", (function(a) {
            TranslateCookieHandler("/" + e.lang + "/" + a.getAttribute("data-google-lang"), e.domain),
                window.location.reload()
        }))
}

function TranslateGetCode(e) {
    return (null != Cookies.get("googtrans") && "null" != Cookies.get("googtrans") ? Cookies.get("googtrans") : e
        .lang).match(/(?!^\/)[^\/]*$/gm)[0]
}

function TranslateCookieHandler(e, a) {
    // let n = window.location.hostname;
    let n = window.location.hostname.match(/^(?:.*?\.)?([a-zA-Z0-9\-_]{3,}\.(?:\w{2,8}|\w{2,4}\.\w{2,4}))$/)[1];
    Cookies.set("googtrans", e), Cookies.set("googtrans", e, {
        domain: "." + document.domain,
        sameSite: 'None',
        secure: true
    }), Cookies.remove("googtrans", {
        domain: "." + n,
        sameSite: 'None',
        secure: true
    }), "undefined" != a && (Cookies.set("googtrans", e, {
        domain: a,
        sameSite: 'None',
        secure: true
    }), Cookies.set("googtrans", e, {
        domain: "." + a,
        sameSite: 'None',
        secure: true
    }))
}

function TranslateEventHandler(e, a, n) {
    document.addEventListener(e, (function(e) {
        let t = e.target.closest(a);
        t && n(t)
    }))
}

function TranslateHtmlHandler(e) {
    null !== document.querySelector('[data-google-lang="' + e + '"]') && document.querySelector(
            '[data-google-lang="' + e + '"]').classList.add(
            "active"),
        // document.querySelector('.language a').innerHTML = e.toUpperCase()
        document.querySelector('.language a').innerHTML = '';
    var active = document.querySelector('[data-google-lang="' + e + '"]').innerHTML;
    document.querySelector('.language a').innerHTML = active;

}