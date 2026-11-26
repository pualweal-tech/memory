"use strict";
function textInput(name, value = "", max = 120) { return `<input name="${name}" value="${esc(value)}" required maxlength="${max}">`; }
function dateInput(value) { return `<input name="date" type="date" required min="0001-01-01" max="9999-12-31" value="${value}">`; }
function replaceRow(rows, record, original) {
    if (!original) {
        rows.push(record);
        return;
    }
    const index = rows.findIndex(r => r.id === record.id);
    if (index < 0 || JSON.stringify(rows[index]) !== JSON.stringify(original))
        throw Error("这条记录已在其他窗口更改。请重新打开后再修改。");
    rows[index] = record;
}
function removeButton(group, item) {
    if (!item)
        return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "text-btn danger";
    btn.textContent = "删除这条记录";
    btn.onclick = () => {
        if (!confirm("确定删除这条记录？"))
            return;
        if (change(s => { const i = s[group].findIndex(x => x.id === item.id); if (i >= 0) {
            if (JSON.stringify(s[group][i]) !== JSON.stringify(item))
                throw Error("记录已发生变化，请重新打开。");
            s[group].splice(i, 1);
        } })) {
            $("modal").close();
            notify("记录已删除");
        }
    };
    $("fields").append(btn);
}
function editTask(id) {
    const item = state.tasks.find(t => t.id === id);
    const t = item || { id: store.id(), title: "", date: selected, space: taskSpace || state.spaces[0], time: "", done: false, high: false };
    const html = field("任务名称", textInput("title", t.title)) + `<div class="two">${field("日期", dateInput(t.date))}${field("时间（可选）", `<input type="time" name="time" value="${t.time}">`)}</div>` +
        field("归属空间", `<select name="space">${options(state.spaces, t.space)}</select>`) + `<label><input type="checkbox" name="high" ${t.high ? "checked" : ""}> 标为优先任务</label>`;
    modal(item ? "编辑任务" : "添加任务", html, fd => {
        const title = fd.get("title").trim();
        if (!title)
            throw Error("请写一个任务名称。");
        const next = { ...t, title, date: fd.get("date"), space: fd.get("space"), time: fd.get("time"), high: fd.has("high") };
        if (!change(s => replaceRow(s.tasks, next, item)))
            return false;
        notify("任务已保存");
        return true;
    });
    removeButton("tasks", item);
}
function addItem(action) {
    const space = action === "new-space", label = space ? "空间" : "习惯";
    modal("添加" + label, field(label + "名称", textInput("name", "", 60)), fd => {
        const name = fd.get("name").trim();
        if (!name)
            throw Error("请输入名称。");
        return change(s => { if ((space ? s.spaces : s.habits.map(h => h.name)).includes(name))
            throw Error("这个名称已经存在。"); if (space)
            s.spaces.push(name);
        else
            s.habits.push({ id: store.id(), name, days: [] }); });
    });
}
function editFeeling(mood) {
    const current = state.feelings.find(f => f.date === selected), f = current || { mood: moods[0], level: 3, tag: "" };
    modal("记录心情", field("今天的心情", `<select name="mood">${options(moods, mood || f.mood)}</select>`) +
        field("心情强度", `<input type="range" name="level" min="1" max="5" value="${f.level}"><output id="level">${f.level} / 5</output>`) +
        field("标签（可选）", `<input name="tag" maxlength="100" placeholder="例如：独处、专注" value="${esc(f.tag)}">`), fd => {
        const record = { date: selected, mood: fd.get("mood"), level: Number(fd.get("level")), tag: fd.get("tag").trim() };
        if (!change(s => { s.feelings = s.feelings.filter(v => v.date !== selected); s.feelings.push(record); }))
            return false;
        notify("心情已记下");
        return true;
    });
    $("form").elements.level.oninput = e => $("level").textContent = e.target.value + " / 5";
}
function readNote(id) {
    const note = state.notes.find(n => n.id === id);
    if (!note)
        return;
    const blocks = note.blocks.map((b, index) => {
        const text = esc(b.text);
        if (b.kind === "图片")
            return `<figure class="read-photo"><img src="${b.image}" alt="${text || "手记照片"}"><figcaption>${text}</figcaption></figure>`;
        if (b.kind === "引用")
            return `<blockquote>${text}</blockquote>`;
        if (b.kind === "提示")
            return `<aside class="callout">${text}</aside>`;
        if (b.kind === "清单")
            return `<label class="read-check"><input type="checkbox" data-check="${index}" ${b.done ? "checked" : ""}> <span>${text}</span></label>`;
        return `<p class="prose">${text}</p>`;
    }).join("");
    const html = `<article class="reading ${note.tape ? "taped" : ""}"><p class="fine">${note.date} · ${esc(note.space)} ${note.sticker === "无" ? "" : note.sticker}</p>${blocks}</article>`;
    modal(note.title, html, () => false, "编辑手记");
    $("submit").type = "button";
    $("submit").onclick = e => { e.preventDefault(); $("modal").close(); editNote(id); };
    for (const box of $("fields").querySelectorAll("[data-check]")) {
        box.onchange = () => {
            const i = Number(box.dataset.check), expected = note.blocks[i];
            if (!change(s => {
                const block = s.notes.find(n => n.id === id)?.blocks[i];
                if (!block || block.kind !== "清单" || block.text !== expected.text)
                    throw Error("这篇手记已在其他窗口更改，请重新打开。");
                block.done = box.checked;
            }))
                box.checked = !box.checked;
            dirty = false;
        };
    }
}
function blankBlock(kind = "正文", text = "") { return { kind, text, done: false, image: "" }; }
async function imageData(file) {
    if (!/^image\/(?:jpeg|png|webp|gif|avif)$/.test(file.type))
        throw Error("请选择 JPG、PNG、WebP、GIF 或 AVIF 图片。");
    if (file.size > 20 * 1024 * 1024)
        throw Error("图片超过 20 MB，请先缩小。");
    const uri = URL.createObjectURL(file), img = new Image();
    try {
        img.src = uri;
        await img.decode();
        const scale = Math.min(1, 960 / Math.max(img.width, img.height)), canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/jpeg", .76);
    }
    finally {
        URL.revokeObjectURL(uri);
    }
}
function editNote(id, source) {
    const original = state.notes.find(n => n.id === id), n = original || { id: store.id(), date: selected, space: spaceFilter || state.spaces[0], title: "", sticker: "无", tape: false, blocks: [blankBlock()], ...source };
    const html = field("标题", textInput("title", n.title)) + `<div class="two">${field("日期", dateInput(n.date))}${field("归属空间", `<select name="space">${options(state.spaces, n.space)}</select>`)}</div><div class="two">${field("页角贴纸", `<select name="sticker">${options(stickers, n.sticker)}</select>`)}<label class="field">页角装饰<span><input type="checkbox" name="tape" ${n.tape ? "checked" : ""}> 和纸胶带</span></label></div><h3 class="subhead">内容块</h3><div id="blocks"></div><button type="button" id="add-block" class="btn">＋ 添加内容块</button>`;
    modal(original ? "编辑手记" : "写一页手记", html, async (fd) => {
        const title = fd.get("title").trim();
        if (!title)
            throw Error("给这一页起个名字吧。");
        const blocks = [];
        for (const block of $("blocks").children) {
            const kind = block.querySelector("select").value, text = block.querySelector("textarea").value;
            const file = block.querySelector("[type=file]").files[0];
            let image = "";
            if (kind === "图片") {
                image = file ? await imageData(file) : block.dataset.image;
                if (!image)
                    throw Error("请为图片块选择一张图片。");
            }
            blocks.push({ kind, text, done: kind === "清单" && block.querySelector("[type=checkbox]").checked, image });
        }
        const next = { id: n.id, title, date: fd.get("date"), space: fd.get("space"), sticker: fd.get("sticker"), tape: fd.has("tape"), blocks };
        if (!change(s => replaceRow(s.notes, next, original)))
            return false;
        selected = next.date;
        render();
        notify("手记已保存");
        return true;
    });
    function addBlock(b) {
        const node = document.createElement("div");
        node.className = "block";
        node.dataset.image = b.image;
        node.innerHTML = `<div class="rowhead"><select aria-label="内容块类型">${options(store.kinds, b.kind)}</select><button type="button" class="remove">移除</button></div><div class="photo"><img alt="本页照片" hidden><input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" aria-label="选择照片"></div><label class="check"><input type="checkbox" ${b.done ? "checked" : ""}> 已完成</label><textarea aria-label="内容块文字" maxlength="20000" rows="2">${esc(b.text)}</textarea>`;
        const update = () => { const kind = node.querySelector("select").value; node.querySelector(".photo").hidden = kind !== "图片"; node.querySelector(".check").hidden = kind !== "清单"; node.querySelector("textarea").placeholder = ({ 正文: "写下你想记住的事……", 清单: "清单事项", 引用: "值得记住的一句话", 提示: "给自己留个提示", 图片: "写一行照片说明（可选）" })[kind]; };
        const img = node.querySelector("img");
        if (b.image) {
            img.src = b.image;
            img.hidden = false;
        }
        node.querySelector("[type=file]").onchange = e => { const file = e.target.files[0]; if (!file)
            return; const u = URL.createObjectURL(file); img.onload = img.onerror = () => URL.revokeObjectURL(u); img.src = u; img.hidden = false; };
        node.querySelector(".remove").onclick = () => { if ($("blocks").children.length === 1) {
            $("form-error").textContent = "至少保留一个内容块。";
            return;
        } dirty = true; node.remove(); $("form-error").textContent = ""; };
        node.querySelector("select").onchange = update;
        update();
        $("blocks").append(node);
    }
    n.blocks.forEach(addBlock);
    $("add-block").onclick = () => { dirty = true; addBlock(blankBlock()); $("blocks").lastElementChild.querySelector("textarea").focus(); };
    removeButton("notes", original);
}
function exportBackup() {
    try {
        const data = store.read(), uri = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })), link = document.createElement("a");
        link.href = uri;
        link.download = "MEMOIR-" + dateKey() + ".json";
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(uri), 30000);
        notify("已生成手账备份");
    }
    catch (e) {
        notify(e.message);
    }
}
function importBackup() {
    modal("恢复手账备份", `<p class="fine">确认恢复后，这份备份将替换当前浏览器里的手账记录。</p>${field("选择 MEMOIR JSON 备份", '<input required name="backup" type="file" accept=".json,application/json">')}`, async (fd) => {
        const file = fd.get("backup");
        if (!file || file.size > 24 * 1024 * 1024)
            throw Error("请选择 24 MB 以内的手账备份。");
        let data;
        try {
            data = JSON.parse(await file.text());
        }
        catch {
            throw Error("文件无法解析，请选择 JSON 备份。");
        }
        if (!store.valid(data))
            throw Error("备份格式无效，当前记录已保留。");
        if (!confirm(`将恢复 ${data.notes.length} 篇手记、${data.tasks.length} 条任务，替换本机现有记录。继续吗？`))
            return false;
        store.write(data);
        state = data;
        spaceFilter = "";
        taskSpace = "";
        storageIssue = "";
        render();
        notify("备份已恢复");
        return true;
    }, "读取并恢复");
}
function openDraft() {
    const hash = location.hash.slice(1);
    let source;
    if (hash.startsWith("template/")) {
        const t = templates.find(t => t.id === hash.slice(9));
        if (t)
            source = { title: t.name, blocks: t.blocks.map(([k, v]) => blankBlock(k, v)) };
    }
    else if (hash.startsWith("draft?")) {
        const params = new URLSearchParams(hash.slice(6)), s = params.get("sticker");
        source = { title: (params.get("title") || "").slice(0, 120), blocks: [blankBlock("正文", (params.get("body") || "").slice(0, 20000))], sticker: stickers.includes(s) ? s : "无" };
    }
    if (source) {
        go("book");
        editNote(undefined, source);
        $("modal").addEventListener("close", () => { try {
            history.replaceState(null, "", location.href.split("#")[0]);
        }
        catch { } }, { once: true });
    }
}
openDraft();
