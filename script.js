async function fetchWebInfo() {
    const input = document.getElementById('urlInput').value;
    const message = document.getElementById('message');
    const result = document.getElementById('result');
    const buttons = document.querySelectorAll('button');

    message.textContent = '';
    result.value = '';

    // Split input by newlines and filter out empty lines
    const urls = input.split('\n').map(u => u.trim()).filter(u => u.length > 0);

    if (urls.length === 0) {
        message.textContent = 'URLを入力してください。';
        message.style.color = 'red';
        return;
    }

    // Validate all URLs
    const invalidUrls = urls.filter(url => !/^https?:\/\/.+/.test(url));
    if (invalidUrls.length > 0) {
        message.textContent = '正しいURLを入力してください。';
        message.style.color = 'red';
        return;
    }

    message.textContent = '取得しています...';
    message.style.color = 'black';
    buttons.forEach(btn => btn.disabled = true); //ボタン無効化

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
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
                title ? `"${title}"` : '',
                (author || org) ? `(${author || org})` : '',
                `(${url})`,
                `(${accessDate})`
            ].filter(Boolean).join('，');

            results.push(`[${i + 1}] ${info}`);
            successCount++;
        } catch (e) {
            results.push(`[${i + 1}] URLにアクセスできませんでした: ${url}`);
            errorCount++;
        }
    }

    result.value = results.join('\n\n');
    
    if (errorCount === 0) {
        message.textContent = `取得に成功しました。（${successCount}件）`;
        message.style.color = 'green';
    } else if (successCount === 0) {
        message.textContent = `すべてのURLの取得に失敗しました。（${errorCount}件）`;
        message.style.color = 'red';
    } else {
        message.textContent = `取得完了: 成功 ${successCount}件, 失敗 ${errorCount}件`;
        message.style.color = 'orange';
    }
    
    buttons.forEach(btn => btn.disabled = false); //ボタン有効化
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
