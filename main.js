let template = JsT.loadById("testTemplate");
document.body.innerHTML += template.render({
    username: "JohnDoe",
    email: "john@localhost",
    messages: "2 new messages"
});