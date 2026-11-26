"use strict";
window.Memoir = (() => {
    const templates = [
        { id: "morning", name: "晨间一页", group: "日常", photo: "break first.jpg", intro: "从早餐和一件期待的小事开始。", blocks: [["正文", "醒来时，我的第一种感受是……"], ["清单", "今天想为自己做的一件事"]] },
        { id: "travel", name: "城市漫游", group: "日常", photo: "night.jpg", intro: "把路上的风景和偶遇装进一页。", blocks: [["引用", "今天停下脚步的地方"], ["正文", "我看见了……"]] },
        { id: "focus", name: "深度学习", group: "规划", photo: "plan.jpg", intro: "留出专注时间，把进度写下来。", blocks: [["提示", "这次专注的目标"], ["清单", "完成一个学习小节"], ["正文", "我还想弄懂……"]] },
        { id: "mood", name: "心情急救箱", group: "心情", photo: "night.jpg", intro: "安放心情，也写下让你安心的事。", blocks: [["正文", "此刻我感受到……"], ["提示", "一个可以照顾自己的小行动"]] },
        { id: "habit", name: "21 天习惯手记", group: "规划", photo: "exercise.jpg", intro: "用一条小记录，留住今天的坚持。", blocks: [["清单", "完成今天的小习惯"], ["正文", "坚持过后，我发现……"]] }
    ];
    const moods = ["欣喜", "治愈", "充实", "低落", "期待"];
    const stickers = ["无", "☀️", "🌿", "☕", "🌙", "🌷", "🍋"];
    const papers = { white: "素白", kraft: "牛皮纸", sage: "鼠尾草", night: "夜读" };
    function dateKey(date = new Date()) {
        return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
    }
    function shift(day, offset) { const value = new Date(day + "T12:00:00"); value.setDate(value.getDate() + offset); return dateKey(value); }
    function pretty(day, options) { return new Date(day + "T12:00:00").toLocaleDateString("zh-CN", options); }
    function escape(value) { return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch])); }
    return { templates, moods, stickers, papers, dateKey, shift, pretty, escape };
})();
