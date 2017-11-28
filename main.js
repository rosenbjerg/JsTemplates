let template = JsT.loadById("testTemplate2", true);
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
    document.body.innerHTML += templates.templ2.render({
        items:  "<li>Test 1</li>" +
                "<li>Test 2</li>" +
                "<li>Test 3</li>"
    });
    document.body.innerHTML += templates.dawdaw.render({
        Tags: "<tr>" +
        "<td>T1</td>" +
        "<td>T2</td>" +
        "<td>T3</td>" +
        "</tr>"
    });
});
