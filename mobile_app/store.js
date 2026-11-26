"use strict";
window.JournalStore = (() => {
    const key = "memoir.journal.v1", { dateKey, stickers, papers, moods } = Memoir;
    const kinds = ["正文", "清单", "引用", "提示", "图片"];
    const id = () => crypto.randomUUID?.() || ("m" + Date.now().toString(36) + Math.random().toString(36).slice(2));
    const fresh = () => ({ version: 1, paper: "white", spaces: ["生活", "学习", "工作", "灵感"], tasks: [], notes: [], feelings: [], habits: [
            { id: "walk", name: "散步十分钟", days: [] }, { id: "read", name: "读几页书", days: [] }
        ] });
    const string = (x, limit) => typeof x === "string" && x.length <= limit;
    const title = x => string(x, 120) && x.trim().length > 0;
    const day = x => typeof x === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x) && Number.isFinite(Date.parse(x + "T12:00:00")) && dateKey(new Date(x + "T12:00:00")) === x;
    const unique = a => new Set(a).size === a.length;
    const rows = (a, check) => Array.isArray(a) && a.every(x => x && typeof x === "object" && typeof x.id === "string" && /^[\w-]{1,80}$/.test(x.id) && check(x)) && unique(a.map(x => x.id));
    function valid(s) {
        if (!s || s.version !== 1 || !Object.hasOwn(papers, s.paper) || !Array.isArray(s.spaces) || !s.spaces.length || !s.spaces.every(title) || !unique(s.spaces))
            return false;
        return rows(s.tasks, t => title(t.title) && day(t.date) && s.spaces.includes(t.space) && typeof t.high === "boolean" && typeof t.done === "boolean" && typeof t.time === "string" && /^(?:|(?:[01]\d|2[0-3]):[0-5]\d)$/.test(t.time))
            && rows(s.habits, h => title(h.name) && Array.isArray(h.days) && h.days.every(day) && unique(h.days))
            && Array.isArray(s.feelings) && s.feelings.every(f => f && day(f.date) && moods.includes(f.mood) && Number.isInteger(f.level) && f.level >= 1 && f.level <= 5 && string(f.tag, 100)) && unique(s.feelings.map(f => f.date))
            && rows(s.notes, n => title(n.title) && day(n.date) && s.spaces.includes(n.space) && stickers.includes(n.sticker) && typeof n.tape === "boolean" && Array.isArray(n.blocks) && n.blocks.length > 0 && n.blocks.every(b => b && kinds.includes(b.kind) && string(b.text, 20000) && typeof b.done === "boolean" && typeof b.image === "string" && (b.image === "" || (/^data:image\/(?:png|jpeg|webp);base64,[a-zA-Z0-9+/]+=*$/.test(b.image) && b.image.length < 1600000))));
    }
    function read() {
        const raw = localStorage.getItem(key);
        if (raw === null)
            return fresh();
        const data = JSON.parse(raw);
        if (!valid(data))
            throw new Error("手账数据格式异常，请先备份浏览器数据，再从有效备份恢复。");
        return data;
    }
    function write(data) { if (!valid(data))
        throw new Error("内容格式不完整，请检查日期、标题和图片。"); try {
        localStorage.setItem(key, JSON.stringify(data));
    }
    catch {
        throw new Error("浏览器未能保存，可能是空间不足或存储受限。请保留当前内容，缩小图片或导出备份。");
    } }
    function change(fn) { const data = read(); fn(data); write(data); return data; }
    return { key, kinds, id, day, read, write, valid, change, fresh };
})();
