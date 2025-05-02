async function fetchWebInfo() {
    const url = document.getElementById('urlInput').value;
    const message = document.getElementById('message');
    const result = document.getElementById('result');
    const buttons = document.querySelectorAll('button');

    message.textContent = '';
    result.value = '';

    if (!/^https?:\/\/.+/.test(url)) {
        message.textContent = '正しいURLを入力してください。';
        message.style.color = 'red';
        return;
    }

    message.textContent = '取得しています...';
    message.style.color = 'black';
    buttons.forEach(btn => btn.disabled = true); //ボタン無効化

    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, "text/html");

        const title = doc.querySelector('title')?.innerText || '';
        const author = doc.querySelector('meta[name="author"]')?.content || '';
        const org = doc.querySelector('meta[property="og:site_name"]')?.content || '';
        const today = new Date();
        const accessDate = `参照日：${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日`;

        const info = [
            title ? `“${title}”` : '',
            (author || org) ? `(${author || org})` : '',
            `(${url})`,
            `(${accessDate})`
        ].filter(Boolean).join('，');

        result.value = info;
        message.textContent = '取得に成功しました。';
        message.style.color = 'green';
    } catch (e) {
        message.textContent = 'URLにアクセスできませんでした。';
        message.style.color = 'red';
    } finally {
        buttons.forEach(btn => btn.disabled = false); //ボタン有効化
    }
}

function copyToClipboard() {
    const result = document.getElementById('result');
    if (result.value.trim()) {
        navigator.clipboard.writeText(result.value);
        document.getElementById('message').textContent = 'コピーしました。';
        document.getElementById('message').style.color = 'green';
    } else {
        document.getElementById('message').textContent = 'コピーするテキストがありません。';
        document.getElementById('message').style.color = 'red';
    }
}