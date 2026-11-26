"use strict";
const { templates, stickers, moods, escape: esc } = Memoir;
const $ = id => document.getElementById(id);
let sticker = "🌿", mood = 2;
$("sample-task").onclick = event => {
    const button = event.currentTarget, done = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(done));
    button.textContent = (done ? "☑" : "□") + "　散步十分钟";
};
$("sample-mood").onclick = () => { mood = (mood + 1) % moods.length; $("sample-mood").textContent = ["☀️", "🌿", "☕", "🌧️", "✨"][mood] + " " + moods[mood]; };
function preview() {
    const title = $("try-title").value, body = $("try-text").value;
    $("live-title").textContent = title || "无标题";
    $("live-text").textContent = body;
    $("live-sticker").textContent = sticker === "无" ? "" : sticker;
    const data = new URLSearchParams({ title, body, sticker });
    $("take-draft").href = "../mobile_app/index.html#draft?" + data;
    for (const button of $("stickers").children)
        button.setAttribute("aria-pressed", String(button.textContent === sticker));
}
for (const item of stickers) {
    const button = document.createElement("button");
    button.className = "chip";
    button.textContent = item;
    button.setAttribute("aria-label", "贴纸 " + item);
    button.onclick = () => { sticker = item; preview(); };
    $("stickers").append(button);
}
$("try-title").oninput = $("try-text").oninput = preview;
preview();
function gallery(group) {
    $("gallery").innerHTML = templates.filter(item => group === "全部" || item.group === group).map(item => '<a class="template" href="../mobile_app/index.html#template/' + item.id + '"><img alt="" loading="lazy" src="assets/image/' + encodeURIComponent(item.photo) + '"><div><span class="fine">' + esc(item.group) + '</span><h3>' + esc(item.name) + '</h3><p>' + esc(item.intro) + '</p></div></a>').join("");
    for (const button of $("filters").children)
        button.setAttribute("aria-pressed", String(button.textContent === group));
}
for (const group of ["全部", "日常", "规划", "心情"]) {
    const button = document.createElement("button");
    button.textContent = group;
    button.className = "chip";
    button.onclick = () => gallery(group);
    $("filters").append(button);
}
gallery("全部");
const sim = $("sim-dialog");
$("simulate").onclick = () => { const frame = sim.querySelector("iframe"); if (!frame.hasAttribute("src"))
    frame.src = "../mobile_app/index.html"; sim.showModal(); };
sim.querySelector("button").onclick = () => sim.close();
