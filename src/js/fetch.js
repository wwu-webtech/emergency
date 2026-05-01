const url = 'https://content.getrave.com/cap/wwu/channel1';
const dataEl = document.getElementById('data');
const statusEl = document.getElementById('status');

function renderFromXML(xmlDoc) {
    const alerts = Array.from(xmlDoc.getElementsByTagName('alert'));
    
    // If no <alert> elements, fall back to showing raw XML
    if (!alerts.length) {
        dataEl.textContent = new XMLSerializer().serializeToString(xmlDoc);
        return;
    }
    
    dataEl.innerHTML = '';
    const frag = document.createDocumentFragment();
    
    alerts.forEach((alertEl, idx) => {
        const status_alert = document.createElement('div');
        status_alert.className = 'status-alert';     
        
        const icon = document.createElement('p');
        icon.className = 'material-icons';
        icon.setAttribute('aria-hidden', 'true');
        icon.innerText = 'error_outline';
        status_alert.append(icon); 
        
        const heading = document.createElement('h2');
        heading.textContent = alertEl.getElementsByTagName('headline')[0].textContent;
        status_alert.append(heading);
        
        const body = document.createElement('div');
        body.className = 'body';        
        body.innerHTML = alertEl.getElementsByTagName('description')[0].innerHTML;
        status_alert.append(body); 
        
        frag.appendChild(status_alert);
    });
    
    dataEl.appendChild(frag);
}

async function fetchData() {
    try {
        statusEl.textContent = 'Fetching...';
        // Add a cache-busting query param and request no-store to avoid browser cache
        const requestUrl = url + (url.includes('?') ? '&' : '?') + '_=' + Date.now();
        console.log(requestUrl);
        const res = await fetch(requestUrl, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const text = await res.text();
        
        // Try to parse as XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'application/xml');
        const parserError = xmlDoc.getElementsByTagName('parsererror')[0];
        if (parserError) {
            // Not valid XML; show raw text
            dataEl.textContent = text;
        } else {
            renderFromXML(xmlDoc);
        }
        
        statusEl.textContent = 'Last updated: ' + new Date().toLocaleTimeString();
    } catch (err) {
        statusEl.textContent = 'Error: ';
        dataEl.textContent = '';
    }
}

// Fetch immediately, then every 30 seconds
fetchData();
setInterval(fetchData, 30000);