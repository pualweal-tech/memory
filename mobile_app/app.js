"use strict";
const { dateKey, shift, pretty, escape: esc, moods, stickers, papers, templates } = Memoir;
const store = JournalStore, $ = id => document.getElementById(id);
const icons = { home: '<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>', book: '<path d="M4 4h6l2 2 2-2h6v15h-6l-2 2-2-2H4Z"/><path d="M12 6v14"/>', plan: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18m-13 5 2 2 4-4"/>', me: '<circle cx="12" cy="8" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>', };
const pages = { home: "日页", book: "手账本", plan: "计划", me: "我的" };
const emoji = ["☀️", "🌿", "☕", "🌧️", "✨"];
let selected = dateKey(), page = "home", spaceFilter = "", search = "", taskFilter = "全部", taskSpace = "", timer, dirty = false, submitAction;
let state = store.fresh(), storageIssue = "";
try {
    state = store.read();
}
catch (e) {
    storageIssue = e.message;
}
function notify(msg) { $("toast").textContent = msg; $("toast").hidden = false; clearTimeout(timer); timer = setTimeout(() => $("toast").hidden = true, 3300); }
function change(fn) {
    try {
        state = store.change(fn);
        storageIssue = "";
        render();
        return true;
    }
    catch (e) {
        if ($("modal").open)
            $("form-error").textContent = e.message;
        else
            notify(e.message);
        return false;
    }
}
function button(action, label, cls = "text-btn") { return `<button type="button" data-action="${action}" class="${cls}">${label}</button>`; }
function options(items, value) { return items.map(x => `<option${x === value ? " selected" : ""} value="${esc(x)}">${esc(x)}</option>`).join(""); }
function field(label, control) { return `<label class="field">${label}${control}</label>`; }
function head(kicker, title, action = "") { return `<header class="page-head rowhead"><div><p class="eyebrow">${kicker}</p><h1>${esc(title)}</h1></div>${action}</header>`; }
function week() {
    const weekDay = new Date(selected + "T12:00:00").getDay(), start = shift(selected, -((weekDay + 6) % 7));
    return `<div class="weeks" aria-label="本周日期">${Array.from({ length: 7 }, (_, i) => { const date = shift(start, i); return `<button data-date="${date}" aria-label="${date}" aria-pressed="${date === selected}"><span>${"一二三四五六日"[i]}</span><b>${Number(date.slice(-2))}</b></button>`; }).join("")}</div>`;
}
function taskRow(t) {
    return `<div class="listrow"><button class="toggle" data-task-toggle="${t.id}" aria-label="${esc((t.done ? "重开" : "完成") + t.title)}" aria-pressed="${t.done}"><span>${t.done ? "✓" : ""}</span></button><button class="grow" data-task-edit="${t.id}"><b class="${t.done ? "strike" : ""}">${esc(t.title)}</b><span class="task-meta">${t.high ? '<strong class="priority">优先 · </strong>' : ""}${t.time ? esc(t.time) + " · " : ""}${esc(t.space)}</span></button></div>`;
}
function streak(h) {
    let d = selected, count = 0;
    if (!h.days.includes(d))
        d = shift(d, -1);
    const days = new Set(h.days);
    while (days.has(d)) {
        count++;
        d = shift(d, -1);
    }
    return count;
}
function habitRow(h) {
    const done = h.days.includes(selected);
    return `<div class="listrow"><div class="grow"><b>${esc(h.name)}</b><span class="task-meta">连续 ${streak(h)} 天</span></div><button class="chip" data-habit="${h.id}" aria-label="${esc(h.name)}打卡" aria-pressed="${done}">${done ? "✓ 已打卡" : "打卡"}</button></div>`;
}
function moodCard() {
    const f = state.feelings.find(f => f.date === selected);
    return `<section class="card"><div class="rowhead"><h2>心情天气</h2>${f ? button("feeling", "编辑") : ""}</div><div class="mood-list">${moods.map((m, i) => `<button class="mood-choice" data-mood="${i}" aria-pressed="${m === f?.mood}"><span>${emoji[i]}</span>${m}</button>`).join("")}</div>${f ? `<p class="fine">${esc(f.mood)} · 强度 ${f.level}/5 ${esc(f.tag)}</p>` : ""}</section>`;
}
function cards(notes) {
    if (!notes.length)
        return `<p class="empty">这里还没有日记。</p>`;
    return `<div class="archive-grid">${notes.map(n => `<button class="entry ${n.tape ? "tape" : ""}" data-note="${n.id}"><span class="fine">${n.date} · ${esc(n.space)}</span><h3>${n.sticker === "无" ? "" : n.sticker + " "}${esc(n.title)}</h3><p>${esc(n.blocks.find(b => b.text.trim())?.text || "图片手记")}</p></button>`).join("")}</div>`;
}
function home() {
    const tasks = state.tasks.filter(t => t.date === selected), checked = state.habits.filter(h => h.days.includes(selected)).length;
    const journals = state.notes.filter(n => n.date === selected).slice().reverse();
    return head("Daily pages", selected === dateKey() ? "今天这一页" : pretty(selected, { month: "long", day: "numeric" })) +
        week() + `<section class="cover"><img src="assets/image/night.jpg" alt=""><h2>此刻，记一笔。</h2>${button("new-note", "＋ 写日记", "btn")}</section><div class="home-grid">${moodCard()}<section class="card"><div class="rowhead"><h2>习惯打卡</h2><span class="ring" style="--p:${checked * 100 / Math.max(1, state.habits.length)}%"><b>${checked}/${state.habits.length}</b></span></div>${state.habits.slice(0, 2).map(habitRow).join("")}${state.habits.length > 2 ? button("plan", "查看全部习惯") : ""}</section></div><section class="card section-head"><div class="rowhead"><h2>当日待办</h2>${button("new-task", "＋ 添加")}</div>${tasks.map(taskRow).join("") || '<p class="empty">今天还没有安排。</p>'}</section><div class="rowhead section-head"><h2 class="subhead">当日手记</h2>${button("book", "查看手账本")}</div>${cards(journals)}`;
}
function filteredNotes() { return state.notes.filter(n => (!spaceFilter || n.space === spaceFilter) && [n.title, ...n.blocks.map(b => b.text)].some(v => v.toLowerCase().includes(search.toLowerCase()))).slice().reverse().sort((a, b) => b.date.localeCompare(a.date)); }
function book() {
    return head("Notebook", "手账本", button("new-note", "＋ 写日记", "btn primary")) +
        `<div class="archive-controls"><input type="search" id="find-note" aria-label="搜索日记" placeholder="搜索标题或正文" value="${esc(search)}"><select id="note-space" aria-label="按空间筛选"><option value="">全部空间</option>${options(state.spaces, spaceFilter)}</select></div><div id="results">${cards(filteredNotes())}</div>`;
}
function plan() {
    const tasks = state.tasks.filter(t => t.date === selected && (!taskSpace || t.space === taskSpace) && (taskFilter !== "未完成" || !t.done) && (taskFilter !== "优先" || t.high)).sort((a, b) => Number(a.done) - Number(b.done) || Number(b.high) - Number(a.high) || (a.time || "24").localeCompare(b.time || "24"));
    return head("Agenda", "日程与习惯", button("new-task", "＋ 任务", "btn primary")) + week() +
        `<section class="card"><div class="rowhead"><h2>待办清单</h2><select aria-label="任务空间" id="task-space" style="width:auto;max-width:50%"><option value="">全部空间</option>${options(state.spaces, taskSpace)}</select></div><div class="chips">${["全部", "未完成", "优先"].map(f => `<button class="chip" data-filter="${f}" aria-pressed="${taskFilter === f}">${f}</button>`).join("")}</div>${tasks.map(taskRow).join("") || '<p class="empty">当前没有符合条件的任务。</p>'}</section><section class="card section-head"><div class="rowhead"><h2>习惯打卡</h2>${button("new-habit", "＋ 新习惯")}</div>${state.habits.map(habitRow).join("")}</section>`;
}
function me() {
    const chart = Array.from({ length: 7 }, (_, i) => { const d = shift(selected, i - 6), f = state.feelings.find(x => x.date === d); return `<div><small>${d.slice(5)}</small><span>${f ? emoji[moods.indexOf(f.mood)] : "·"}</span><small>${f ? esc(f.mood) + " " + f.level : "未记"}</small></div>`; }).join("");
    return head("My journal", "我的手账") + `<div class="settings-grid"><section class="card"><h2>手账用纸</h2><div class="chips">${Object.entries(papers).map(([k, v]) => `<button class="chip" data-paper="${k}" aria-pressed="${state.paper === k}">${v}</button>`).join("")}</div></section><section class="card"><div class="rowhead"><h2>生活空间</h2>${button("new-space", "＋ 新空间")}</div>${state.spaces.map((s, i) => `<div class="space-row"><button data-space="${i}">${esc(s)}</button><span class="fine">${state.notes.filter(n => n.space === s).length} 篇</span></div>`).join("")}</section><section class="card"><h2>近七日心情</h2><div class="chart">${chart}</div></section><section class="card"><h2>数据备份</h2><p class="fine">记录保存在当前浏览器。换设备或清理浏览器前，可导出一份 JSON 备份。</p><div class="actions">${button("export", "导出备份", "btn")}${button("import", "恢复备份", "btn")}</div></section></div>`;
}
function render() {
    document.body.dataset.paper = state.paper;
    const nav = Object.entries(pages).map(([key, name]) => `<button class="nav-btn ${page === key ? "active" : ""}" data-page="${key}" ${page === key ? 'aria-current="page"' : ""}><span class="ico" aria-hidden="true"><svg viewBox="0 0 24 24">${icons[key]}</svg></span>${name}</button>`).join("");
    $("side-nav").innerHTML = $("bottom-nav").innerHTML = nav;
    $("pick-date").textContent = pretty(selected, { year: "numeric", month: "short", day: "numeric", weekday: "short" });
    $("screen").innerHTML = (storageIssue ? `<p role="alert" class="card">${esc(storageIssue)}</p>` : "") + ({ home, book, plan, me }[page])();
}
function go(next) { page = next; render(); window.scrollTo(0, 0); }
function modal(title, html, submit, label = "保存") {
    dirty = false;
    submitAction = submit;
    $("submit").type = "submit";
    $("submit").onclick = null;
    $("modal-title").textContent = title;
    $("fields").innerHTML = html;
    $("submit").textContent = label;
    $("form-error").textContent = "";
    $("submit").disabled = false;
    $("modal").showModal();
}
function closeModal() { if ($("submit").disabled)
    return; if (!dirty || confirm("放弃本次未保存的修改？"))
    $("modal").close(); }
$("modal").querySelector(".close").onclick = closeModal;
$("modal").oncancel = e => { e.preventDefault(); closeModal(); };
$("form").oninput = () => { dirty = true; };
$("form").onsubmit = async (e) => {
    e.preventDefault();
    if ($("submit").disabled)
        return;
    $("submit").disabled = true;
    try {
        if (await submitAction(new FormData($("form")))) {
            dirty = false;
            $("modal").close();
        }
    }
    catch (err) {
        $("form-error").textContent = err.message;
    }
    finally {
        $("submit").disabled = false;
    }
};
function chooseDate() { modal("选择日期", field("手账日期", `<input required name="day" type="date" value="${selected}" min="0001-01-01" max="9999-12-31">`), fd => { const d = fd.get("day"); if (!store.day(d))
    throw Error("请选择有效日期。"); selected = d; render(); return true; }, "打开"); }
$("pick-date").onclick = chooseDate;
document.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b || b.closest("#modal"))
        return;
    const d = b.dataset;
    if (d.page)
        go(d.page);
    if (d.date) {
        selected = d.date;
        render();
    }
    if (d.taskToggle)
        change(s => { const t = s.tasks.find(t => t.id === d.taskToggle); if (t)
            t.done = !t.done; });
    if (d.habit)
        change(s => { const h = s.habits.find(h => h.id === d.habit); if (h)
            h.days = h.days.includes(selected) ? h.days.filter(v => v !== selected) : [...h.days, selected]; });
    if (d.taskEdit)
        editTask(d.taskEdit);
    if (d.note)
        readNote(d.note);
    if (d.mood !== undefined)
        editFeeling(moods[Number(d.mood)]);
    if (d.filter) {
        taskFilter = d.filter;
        render();
    }
    if (d.paper)
        change(s => s.paper = d.paper);
    if (d.space !== undefined) {
        spaceFilter = state.spaces[Number(d.space)];
        search = "";
        go("book");
    }
    const action = d.action;
    if (action === "book" || action === "plan")
        go(action);
    if (action === "new-note")
        editNote();
    if (action === "new-task")
        editTask();
    if (action === "new-space" || action === "new-habit")
        addItem(action);
    if (action === "feeling")
        editFeeling();
    if (action === "export")
        exportBackup();
    if (action === "import")
        importBackup();
});
document.addEventListener("input", e => { if (e.target.id === "find-note") {
    search = e.target.value;
    $("results").innerHTML = cards(filteredNotes());
} });
document.addEventListener("change", e => { if (e.target.id === "note-space") {
    spaceFilter = e.target.value;
    render();
} if (e.target.id === "task-space") {
    taskSpace = e.target.value;
    render();
} });
window.addEventListener("storage", e => { if (e.key === store.key || e.key === null) {
    try {
        state = store.read();
        storageIssue = "";
    }
    catch (error) {
        storageIssue = error.message;
    }
    render();
} });
render();
