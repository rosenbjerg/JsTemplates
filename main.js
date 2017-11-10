let template = JsT.loadById("testTemplate");
template.setFormatter("messages", function (val) {
    return val + " new messages";
});
document.body.innerHTML += template.render({
    username: "JohnDoe",
    email: "john@localhost",
    messages: 2
});