let template = JsT.loadById("testTemplate", true);
template.setFormatter("user.messages.length", function (val) {
    return val + " new messages";
});
document.body.innerHTML += template.render({
    title: "Mail view",
    user: {
        name: "JohnDoe",
        email: "john@localhost",
        messages: ["Hi", "Welcome", "Goddag"]
    }
});

JsT.get("templates.html", function (templates) {
    document.body.innerHTML += templates.templ1.render();
    document.body.innerHTML += templates.templ2.render();
});