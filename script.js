// ==========================================
// TV REMOTE CSS INJECTION (DYNAMIC)
// ==========================================
(function injectTVCss() {
    if (!document.getElementById('tv-focus-style')) {
        const tvCss = document.createElement('style');
        tvCss.id = 'tv-focus-style';
        tvCss.innerHTML = `
            .tv-focus { outline: 3px solid #ffcc00 !important; outline-offset: 2px; box-shadow: 0 0 15px #ffcc00 !important; transform: scale(1.05); background-color: rgba(255, 204, 0, 0.2) !important; transition: all 0.2s; }
            input.tv-focus { transform: scale(1.02); }
        `;
        document.head.appendChild(tvCss);
    }
})();

// === TV DETECTOR (For TV Performance Fix) ===
var isStrictSmartTV = /SmartTV|WebOS|Tizen|Roku|AppleTV|BRAVIA|NetCast|VIDAA/i.test(navigator.userAgent);
// ============================================

// ==========================================
// OPTIMIZED ADSTERRA SMARTLINK SYSTEM (NON-BLOCKING)
// ==========================================
/*
const SMARTLINK_URLS = [
    'https://www.profitablecpmratenetwork.com/q5bzrqysvg?key=8228f2c179574eafcbc8f068a65f15d9',
    'https://www.effectivecpmnetwork.com/ygty1zsf?key=b2f15083eed2a8d89132f615d6f46a20',
    'https://www.effectivecpmnetwork.com/wt4z30i3?key=2e2741296f162ea901f34a97fe0fbb20',
    'https://www.effectivecpmnetwork.com/m3vu26jd?key=0f69b97de19f8858ea437593044be69a'
];
*/
const AD_COOLDOWN_MS = 5 * 60 * 1000;
let adTriggerReady = false;
let isAdClosedByUser = false;

function hasPremiumAccess() {
    const token = localStorage.getItem('obiramPremiumToken');
    if (!token) return false;
    try {
        const data = JSON.parse(atob(token));
        if (data.premium && data.exp > Date.now()) { return true; } 
        else {
            localStorage.removeItem('obiramPremiumToken'); 
            localStorage.removeItem('obiramPremiumStatus'); 
            localStorage.removeItem('obiramPremiumSig');
            return false;
        }
    } catch(e) { return false; }
}

function checkAdStatus() {
    if (hasPremiumAccess()) {
        adTriggerReady = false;
        const stickyAd = document.getElementById('sticky-ad-banner');
        if (stickyAd) stickyAd.style.display = 'none';
        return;
    }
    const lastAdTime = parseInt(localStorage.getItem('obiramLastAdClickTime') || '0');
    if (Date.now() - lastAdTime > AD_COOLDOWN_MS) {
        adTriggerReady = true;
    } else {
        adTriggerReady = false;
    }
}

function triggerAd() {
    let currentAdIndex = parseInt(localStorage.getItem('obiramAdIndex') || '0');
    const targetUrl = SMARTLINK_URLS[currentAdIndex % SMARTLINK_URLS.length];
    
    currentAdIndex++;
    localStorage.setItem('obiramAdIndex', currentAdIndex.toString());
    localStorage.setItem('obiramLastAdClickTime', Date.now().toString());
    adTriggerReady = false;

    try {
        const a = document.createElement('a');
        a.href = targetUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (e) {
        window.open(targetUrl, '_blank');
    }
}

document.addEventListener('click', function(e) {
    if (!adTriggerReady || !e.isTrusted) return; 
    const isExcluded = e.target.closest('#p-back, #drawer-close-btn, #search-close-btn, #close-ad-btn, .header-left-controls, #numpad-wrapper, .p-btn, #p-servers-wrapper');
    if (isExcluded) return;
    triggerAd();
}, true);

document.addEventListener('keydown', function(e) {
    if (!adTriggerReady) return;
    if (e.key === 'Enter' || e.key === ' ') {
        if (e.key === ' ' && e.target.tagName === 'INPUT') return;
        const activeEl = document.activeElement;
        if (activeEl && activeEl.closest('#p-back, #drawer-close-btn, #search-close-btn, #close-ad-btn, .header-left-controls, #numpad-wrapper, .p-btn, #p-servers-wrapper')) return;
        triggerAd();
    }
}, true);

window.addEventListener('pageshow', function(event) { if (event.persisted) checkAdStatus(); });
document.addEventListener('DOMContentLoaded', () => { setTimeout(checkAdStatus, 2000); });
setInterval(checkAdStatus, 2000);

document.addEventListener('DOMContentLoaded', () => {
    const closeAdBtn = document.getElementById('close-ad-btn');
    if (closeAdBtn) { 
        closeAdBtn.addEventListener('click', (e) => { 
            e.stopPropagation(); 
            isAdClosedByUser = true; 
            document.getElementById('sticky-ad-banner').style.display = 'none'; 
        }); 
    }
});

// ==========================================
// DYNAMIC SEO METADATA INJECTION
// ==========================================
function updateDynamicSEO(channel) {
    if (!channel) return;
    const title = `${channel.name} Live Free Online - SRB TV`;
    const desc = `Watch ${channel.name} live streaming free online on SRB TV. এসআরবি টিভিতে ${channel.name} সরাসরি দেখুন কোনো বাফারিং ছাড়াই।`;
    const url = `${window.location.origin}${window.location.pathname}?channel=${channel.slug}`;

    document.title = title;
    if(document.getElementById('meta-desc')) document.getElementById('meta-desc').content = desc;
    if(document.getElementById('og-title')) document.getElementById('og-title').content = title;
    if(document.getElementById('og-desc')) document.getElementById('og-desc').content = desc;
    if(document.getElementById('og-image')) document.getElementById('og-image').content = channel.logoUrl;
    if(document.getElementById('og-url')) document.getElementById('og-url').content = url;
    if(document.getElementById('canonical-url')) document.getElementById('canonical-url').href = url;

    let script = document.getElementById('dynamic-seo-schema');
    if(!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'dynamic-seo-schema';
        document.head.appendChild(script);
    }
    script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BroadcastEvent",
        "name": title,
        "description": desc,
        "image": channel.logoUrl,
        "isLiveBroadcast": true,
        "url": url
    });
}

function resetDynamicSEO() {
    const defaultTitle = "এসআরবি টিভি (SRB TV) - Watch Free Live TV Channels Online";
    const defaultDesc = "এসআরবি টিভি (SRB TV) তে দেখুন দেশি-বিদেশি লাইভ টিভি চ্যানেল একদম ফ্রিতে। Watch sports, news, and entertainment live tv channels online on SRB TV.";
    const defaultUrl = window.location.origin + window.location.pathname;
    const defaultLogo = "https://lh3.googleusercontent.com/d/1B0ayWW5xma3GilQHOoWPaGpMrqCcQ9sz";

    document.title = defaultTitle;
    if(document.getElementById('meta-desc')) document.getElementById('meta-desc').content = defaultDesc;
    if(document.getElementById('og-title')) document.getElementById('og-title').content = defaultTitle;
    if(document.getElementById('og-desc')) document.getElementById('og-desc').content = defaultDesc;
    if(document.getElementById('og-image')) document.getElementById('og-image').content = defaultLogo;
    if(document.getElementById('og-url')) document.getElementById('og-url').content = defaultUrl;
    if(document.getElementById('canonical-url')) document.getElementById('canonical-url').href = defaultUrl;

    const script = document.getElementById('dynamic-seo-schema');
    if(script) script.remove();
}

// ==========================================
// MAIN APP LOGIC
// ==========================================
const DEFAULT_LOGO_URL = 'https://lh3.googleusercontent.com/d/1iM4PZ4Ra90vtIsfQVlzS3-MKbe07U27q';
const WORKER_URL = "https://raw.githubusercontent.com/srshehab71/SRB-Tv-Zone/main/srbtv.m3u";
const corsProxy = 'https://iptvtest068.emonsa4.workers.dev/?';

let channelsList = []; let displayedChannels = []; let currentChannelIndex = -1; let favorites = [];
let isAutoplayEnabled = localStorage.getItem('obiramAutoPlayLast') === 'true';
let hls = null; let mpegtsPlayer = null; let shakaPlayerInstance = null; let shakaPolyfillsInstalled = false;
let currentChannel = null; let currentServerIndex = 0; let serversToTry = [];
let currentTryIndex = 0; let isUsingProxy = false; let hideTimer = null; 
let currentBrightness = 1; let isAppInitialized = false; let savedScrollPosition = 0;

let isSwiping = false, startX = 0, startY = 0, swipeDirection = null, swipeZone = null, startVol = 1, startBright = 1, osdTimer = null;
let channelInputBuffer = ''; let channelInputTimer = null; let activeGridIndex = -1;
let currentAspectMode = 0;
const aspectRatioModes = [ { name: 'Stretch', className: 'aspect-stretch' }, { name: 'Fit', className: 'aspect-fit' }, { name: 'Zoom', className: 'aspect-zoom' } ];

const video = document.getElementById("video-player"); const wrap = document.getElementById("videoWrap");
const playerOverlay = document.getElementById("video-player-overlay"); const list = document.getElementById("channel-grid");
const splashLogo = document.getElementById("splash-logo"); const searchInput = document.getElementById("search-input");
const pUi = document.getElementById("player-ui"); const pNum = document.getElementById("p-num");
const pLogo = document.getElementById("p-logo"); const pName = document.getElementById("p-name");
const pServers = document.getElementById("p-servers"); const channelInputOverlay = document.getElementById("channel-input-overlay");
const SHARE_URL = 'https://srbtv.vercel.app/tv/';

let enterClickCount = 0; let enterClickTimer = null; let isTvNavMode = false;
let currentFocusIndex = 0; let focusElements = []; let isHeaderFocus = false; let headerFocusIndex = 0;
let drawerFocusIndex = 0; let modalFocusIndex = 1;

function makeSlug(text) { return text.toString().toLowerCase().trim().replace(/[\s]+/g, '-').replace(/[^\w\-\u0980-\u09FF]+/g, '').replace(/\-\-+/g, '-').replace(/^-+|-+$/g, ''); }

document.addEventListener('DOMContentLoaded', () => { initApp(); });

// 🔴 UI ENHANCEMENTS
function setupPlayerUIEnhancements() {
    const pNameEl = document.getElementById('p-name');
    if (pNameEl && !pNameEl.parentElement.classList.contains('p-name-container')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'p-name-container';
        pNameEl.parentNode.insertBefore(wrapper, pNameEl);
        wrapper.appendChild(pNameEl);
    }

    if (!document.getElementById('numpad-wrapper')) {
        const numpadHTML = `
            <div id="numpad-wrapper">
                <div id="numpad-container">
                    <div class="numpad-display" id="numpad-display"></div>
                    <div class="numpad-grid">
                        <button class="num-btn">1</button><button class="num-btn">2</button><button class="num-btn">3</button>
                        <button class="num-btn">4</button><button class="num-btn">5</button><button class="num-btn">6</button>
                        <button class="num-btn">7</button><button class="num-btn">8</button><button class="num-btn">9</button>
                        <button class="num-btn clear-btn">C</button><button class="num-btn">0</button><button class="num-btn ok-btn">OK</button>
                    </div>
                </div>
                <button id="numpad-toggle-btn" title="Type Channel Number"><svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/></svg></button>
            </div>
        `;
        pUi.insertAdjacentHTML('beforeend', numpadHTML);

        const npToggle = document.getElementById('numpad-toggle-btn');
        const npContainer = document.getElementById('numpad-container');
        const npDisplay = document.getElementById('numpad-display');
        
        npToggle.onclick = (e) => { e.stopPropagation(); npContainer.classList.toggle('visible'); npDisplay.innerText = channelInputBuffer; showControls(); if(isTvNavMode) setTimeout(updateFocusElements, 100); };
        document.querySelectorAll('.num-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation(); showControls();
                const val = btn.innerText;
                if (val === 'C') { channelInputBuffer = channelInputBuffer.slice(0, -1); } 
                else if (val === 'OK') { goToChannelByInput(); npContainer.classList.remove('visible'); } 
                else { if (channelInputBuffer.length < 4) channelInputBuffer += val; }
                npDisplay.innerText = channelInputBuffer;
                if (channelInputOverlay) { if (channelInputBuffer) { channelInputOverlay.textContent = channelInputBuffer; channelInputOverlay.style.display = 'block'; } else { channelInputOverlay.style.display = 'none'; } }
                clearTimeout(channelInputTimer);
                if (channelInputBuffer && val !== 'OK' && val !== 'C') { channelInputTimer = setTimeout(() => { goToChannelByInput(); npContainer.classList.remove('visible'); }, 3000); }
            };
        });
    }

    const serverWrapper = document.getElementById('p-servers-wrapper');
    if (serverWrapper) {
        let isDown = false; let startX; let scrollLeft; let isDragging = false;
        serverWrapper.addEventListener('mousedown', (e) => { isDown = true; isDragging = false; serverWrapper.classList.add('active'); startX = e.pageX - serverWrapper.offsetLeft; scrollLeft = serverWrapper.scrollLeft; });
        serverWrapper.addEventListener('mouseleave', () => { isDown = false; serverWrapper.classList.remove('active'); });
        serverWrapper.addEventListener('mouseup', () => { isDown = false; serverWrapper.classList.remove('active'); setTimeout(() => { isDragging = false; serverWrapper.classList.remove('is-dragging'); }, 50); });
        serverWrapper.addEventListener('mousemove', (e) => { if (!isDown) return; e.preventDefault(); const x = e.pageX - serverWrapper.offsetLeft; const walk = (x - startX) * 2; if (Math.abs(x - startX) > 5) { isDragging = true; serverWrapper.classList.add('is-dragging'); } serverWrapper.scrollLeft = scrollLeft - walk; });
    }
}

// 🔴 SMART SCROLL CHECK
function checkSmartScroll() {
    const pName = document.getElementById('p-name');
    const container = pName.parentElement;
    pName.classList.remove('smart-scroll');
    void pName.offsetWidth;
    setTimeout(() => { if (pName.scrollWidth > container.clientWidth) { pName.classList.add('smart-scroll'); } }, 200);
}

async function fetchSettings() {
    try {
        const res = await fetch(`https://playlist.emonsa4.workers.dev/settings?t=${Date.now()}`);
        const data = await res.json();
        const mq = data.marqueeData && data.marqueeData['general'];
        const container = document.getElementById('marquee-container');
        const textEl = document.getElementById('marquee-text');
        if (mq && mq.active && mq.text.trim() !== '') { textEl.textContent = mq.text; container.classList.remove('hidden'); } else { container.classList.add('hidden'); }
    } catch (e) {}
}

function initApp() {
    if (window.location.hash === '#player') history.replaceState(null, '', window.location.pathname + window.location.search);
    wrap.classList.add(aspectRatioModes[currentAspectMode].className);
    video.controls = false; video.volume = 1; video.muted = false; video.playsInline = true;
    pLogo.onerror = function() { this.src = DEFAULT_LOGO_URL; };
    setupPlayerUIEnhancements(); fetchSettings(); loadFavorites(); setupEventListeners(); setupPlayerEvents(); fetchAllChannels();
    setInterval(() => { if (document.visibilityState === 'visible') fetchChannelsSilently(); }, 5 * 60 * 1000);
}

// M3U Parser with DRM Support
function parseM3uWithServers(m3uText) {
    const channelMap = new Map();
    const lines = m3uText.split(/\r?\n/);

    let currentCh = null;
    let currentDrm = null;

    for (let i = 0; i < lines.length; i++) {

        const line = lines[i].trim();
        if (!line) continue;

        if (line.startsWith('#EXTINF:')) {

            currentDrm = null;

            const nameParts = line.split(',');
            const name = nameParts[nameParts.length - 1].trim();

            const logoMatch = line.match(/tvg-logo="([^"]*)"/i);
            const idMatch = line.match(/tvg-id="([^"]*)"/i);

            currentCh = {
                name: name,
                tvgId: idMatch ? idMatch[1] : "",
                slug: makeSlug(name),
                logoUrl: logoMatch ? logoMatch[1] : DEFAULT_LOGO_URL,
                servers: []
            };

        } else if (line.startsWith('#KODITVE-PROP:license_type=')) {

            if (!currentDrm) currentDrm = {};
            currentDrm.type = line.split('=')[1].trim().toLowerCase();

        } else if (line.startsWith('#KODITVE-PROP:license_key=')) {

            if (!currentDrm) currentDrm = {};
            currentDrm.key = line.substring(line.indexOf('=') + 1).trim();

        } else if (line.startsWith('#EXT-X-MEDIA:') && currentCh) {

            const nameMatch = line.match(/NAME="([^"]*)"/);
            const urlMatch = line.match(/URI="([^"]*)"/);

            if (nameMatch && urlMatch) {
                currentCh.servers.push({
                    name: nameMatch[1],
                    url: urlMatch[1],
                    drm: currentDrm
                });
            }

        } else if (!line.startsWith('#') && line.startsWith('http') && currentCh) {

            const key = (currentCh.tvgId || currentCh.name).trim().toLowerCase();

            if (!channelMap.has(key)) {

                currentCh.servers.unshift({
                    name: "Server 1",
                    url: line,
                    drm: currentDrm
                });

                channelMap.set(key, currentCh);

            } else {

                const ch = channelMap.get(key);

                ch.servers.push({
                    name: `Server ${ch.servers.length + 1}`,
                    url: line,
                    drm: currentDrm
                });

            }

            currentCh = null;
            currentDrm = null;
        }
    }

    const parsedChannels = Array.from(channelMap.values());

    parsedChannels.forEach((ch, index) => {
        ch.originalIndex = index;
    });

    return parsedChannels;
}

async function fetchAllChannels() {
    const loadingOverlay = document.getElementById('loading-overlay'); loadingOverlay.classList.remove('hidden'); 
    try {
        document.getElementById('loading-text').textContent = `Loading Channels...`;
        const response = await fetch(`${WORKER_URL}?t=${Date.now()}`);
        channelsList = parseM3uWithServers(await response.text()); 
        if (channelsList.length > 0) renderChannels(channelsList); 
    } catch (error) {} 
    finally { 
        setTimeout(() => { 
            loadingOverlay.classList.add('hidden'); 
            window.appLoadedFully = true; clearTimeout(window.obiramLoadTimer);
            if (!isAppInitialized) {
                isAppInitialized = true; 
                const urlChannelSlug = new URLSearchParams(window.location.search).get('channel');
                let targetIndex = urlChannelSlug ? displayedChannels.findIndex(c => c.slug === urlChannelSlug) : -1;
                let isDirectLink = targetIndex > -1;
                if (isDirectLink) { updateDynamicSEO(displayedChannels[targetIndex]); } 
                if (targetIndex === -1 && isAutoplayEnabled) {
                    const lastSlug = localStorage.getItem('obiramLastChannelSlug'); 
                    if (lastSlug) targetIndex = displayedChannels.findIndex(c => c.slug === lastSlug);
                }
                if (targetIndex > -1) { 
                    if (isDirectLink || window.innerWidth > 768) { openPlayer(targetIndex, false); } 
                    else {
                        document.getElementById('resume-target-index').value = targetIndex;
                        document.getElementById('resume-channel-logo').src = displayedChannels[targetIndex].logoUrl;
                        document.getElementById('resume-channel-name').textContent = displayedChannels[targetIndex].name;
                        document.getElementById('resume-overlay').style.display = 'flex';
                        updateModalFocus(true);
                    }
                }
            }
        }, 500); 
    }
}

async function fetchChannelsSilently() {
    try {
        const response = await fetch(`${WORKER_URL}?t=${Date.now()}`);
        if (!response.ok) return;
        const newChannelsList = parseM3uWithServers(await response.text());
        if (newChannelsList.length > 0) {
            let currentSlug = currentChannelIndex > -1 ? displayedChannels[currentChannelIndex].slug : ""; 
            channelsList = newChannelsList;
            const query = searchInput.value.toLowerCase().trim(); 
            renderChannels(query ? channelsList.filter(c => c.name.toLowerCase().includes(query)) : channelsList);
            if (currentSlug) currentChannelIndex = displayedChannels.findIndex(c => c.slug === currentSlug);
        }
    } catch (error) {} 
}

function loadFavorites() { favorites = [...new Set(JSON.parse(localStorage.getItem('obiramTvFavorites') || '[]'))]; }
function saveFavorites() { localStorage.setItem('obiramTvFavorites', JSON.stringify(favorites)); }
function sortChannels(channelsArr) { 
    return [...channelsArr].sort((a, b) => {
        const aFav = favorites.includes(a.name + '|' + a.logoUrl); const bFav = favorites.includes(b.name + '|' + b.logoUrl);
        if (aFav && !bFav) return -1; if (!aFav && bFav) return 1; return a.originalIndex - b.originalIndex;
    }); 
}

function renderChannels(channelsToRender) {
    list.innerHTML = ''; activeGridIndex = -1; displayedChannels = sortChannels(channelsToRender);
    if (!displayedChannels.length) { list.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #888;'>No channels found.</p>"; return; }
    const fragment = document.createDocumentFragment();
    displayedChannels.forEach((channel) => {
        const isFav = favorites.includes(channel.name + '|' + channel.logoUrl);
        const favIcon = isFav ? `<div style="position:absolute; top:8px; right:8px; color:#ffcc00;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg></div>` : '';
        const card = document.createElement('div'); card.className = 'channel-card'; card.dataset.index = displayedChannels.indexOf(channel);
        card.innerHTML = `${favIcon}<div class="channel-logo-wrapper"><img src="${channel.logoUrl}" onerror="this.src='${DEFAULT_LOGO_URL}'"></div><span class="channel-name">${channel.name}</span>`;
        card.onclick = () => openPlayer(parseInt(card.dataset.index), false);
        fragment.appendChild(card);
    });
    list.appendChild(fragment); setActiveCard(0);
}

function setActiveCard(index, shouldScroll = false) {
    const cards = list.querySelectorAll('.channel-card'); if (!cards.length) return;
    if (activeGridIndex > -1 && cards[activeGridIndex]) { cards[activeGridIndex].classList.remove('active'); }
    activeGridIndex = Math.max(0, Math.min(index, cards.length - 1)); cards[activeGridIndex].classList.add('active');
    if (shouldScroll) { cards[activeGridIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
}

function showControls() {
    pUi.classList.add("visible"); clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { 
        if (!document.getElementById('custom-settings-menu').classList.contains('visible') && !document.getElementById('quality-submenu').classList.contains('visible') && !(document.getElementById('numpad-container') && document.getElementById('numpad-container').classList.contains('visible'))) { pUi.classList.remove("visible"); } 
    }, 4000);
}

function closeMenus() { 
    document.getElementById('custom-settings-menu').classList.remove('visible'); document.getElementById('quality-submenu').classList.remove('visible'); 
    const np = document.getElementById('numpad-container'); if(np) np.classList.remove('visible');
}

function enterFullscreen() { 
    const req = wrap.requestFullscreen || wrap.webkitRequestFullscreen || wrap.mozRequestFullScreen || wrap.msRequestFullscreen; 
    if (req && !document.fullscreenElement && !document.webkitFullscreenElement) { 
        let promise = req.call(wrap); 
        if (promise) { promise.then(() => { if (window.innerWidth <= 768 && screen.orientation && screen.orientation.lock) { screen.orientation.lock('landscape').catch(() => {}); } }).catch(() => {}); } 
    } else if (video.webkitEnterFullscreen) { video.webkitEnterFullscreen(); } 
}

function exitFullscreen() { 
    const exitReq = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen; 
    if ((document.fullscreenElement || document.webkitFullscreenElement) && exitReq) { exitReq.call(document).catch(() => {}); } 
    if (screen.orientation && screen.orientation.unlock) { screen.orientation.unlock(); } 
}

function destroyPlayer() {
    if (hls) { hls.destroy(); hls = null; }
    if (typeof mpegtsPlayer !== 'undefined' && mpegtsPlayer) { mpegtsPlayer.destroy(); mpegtsPlayer = null; }
    if (shakaPlayerInstance) { 
        shakaPlayerInstance.unload().catch(()=>{}); 
        shakaPlayerInstance.destroy(); 
        shakaPlayerInstance = null; 
    }
    if (window.stallCheckInterval) { clearInterval(window.stallCheckInterval); window.stallCheckInterval = null; }
    video.pause(); video.removeAttribute("src"); video.load();
    document.getElementById('menu-item-quality').classList.add('disabled'); document.getElementById('quality-value').textContent = 'Auto';
    currentBrightness = 1; video.style.filter = 'brightness(1)';
}

function closePlayer() {
    destroyPlayer();
    playerOverlay.style.display = "none"; document.body.classList.remove('player-open');
    closeMenus(); exitFullscreen(); currentChannelIndex = -1;
    resetDynamicSEO(); history.replaceState(null, '', window.location.pathname); 
    setTimeout(() => { window.scrollTo(0, savedScrollPosition); }, 50);
    const stickyAd = document.getElementById('sticky-ad-banner');
    if (stickyAd && !isAdClosedByUser && !hasPremiumAccess()) stickyAd.style.display = 'flex';
}

window.addEventListener('popstate', (e) => { 
    if (playerOverlay.style.display === "flex") {
        if (!new URLSearchParams(window.location.search).has('channel') && !(e.state && e.state.playerOpen)) { closePlayer(); }
    }
});

function handleFullscreenChange() { 
    if (!(document.fullscreenElement || document.webkitFullscreenElement) && playerOverlay.style.display === "flex") { 
        (window.history.state && window.history.state.playerOpen) ? window.history.back() : closePlayer(); 
    } 
}
document.addEventListener('fullscreenchange', handleFullscreenChange); document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

function updateFavoriteUI() {
    if(!currentChannel) return;
    const isFav = favorites.includes(currentChannel.name + '|' + currentChannel.logoUrl);
    const label = document.getElementById('favorite-label'); const item = document.getElementById('menu-item-favorites');
    if(isFav) { label.textContent = "Remove from Favorites"; item.classList.add('active'); } else { label.textContent = "Add to Favorites"; item.classList.remove('active'); }
}

function toggleFavorite() {
    if(!currentChannel) return;
    const uniqueId = currentChannel.name + '|' + currentChannel.logoUrl; const index = favorites.indexOf(uniqueId);
    if (index > -1) { favorites.splice(index, 1); } else { favorites.push(uniqueId); }
    saveFavorites(); updateFavoriteUI();
    const q = searchInput.value.trim().toLowerCase(); renderChannels(q ? channelsList.filter(c => c.name.toLowerCase().includes(q)) : channelsList);
    closeMenus();
}

function setupServerMenu(servers) {
    if(!pServers) return; pServers.innerHTML = ''; 
    if (!servers || servers.length <= 1) { pServers.style.display = 'none'; return; }
    pServers.style.display = 'flex';
    servers.forEach((server, index) => {
        const btn = document.createElement('button'); btn.className = 'server-pill'; btn.dataset.serverIndex = index; btn.textContent = server.name;
        btn.onclick = (e) => { 
            e.stopPropagation(); 
            if (document.getElementById('p-servers-wrapper').classList.contains('is-dragging')) return; 
            localStorage.setItem('obiram_main_srv_pref_' + currentChannel.slug, index);
            serversToTry = []; for (let i = 0; i < servers.length; i++) { serversToTry.push((index + i) % servers.length); }
            currentTryIndex = 0; loadStreamForServer(index); closeMenus();
        };
        pServers.appendChild(btn);
    });
}

function updateServerUI(index) { 
    if(!pServers) return; 
    Array.from(pServers.querySelectorAll('.server-pill')).forEach(el => el.classList.remove('active')); 
    const btn = pServers.querySelector(`[data-server-index="${index}"]`); 
    if (btn) { btn.classList.add('active'); btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }
}

function loadStreamForServer(serverIndex) {
    currentServerIndex = serverIndex; isUsingProxy = false;
    let server = currentChannel && currentChannel.servers[serverIndex] ? currentChannel.servers[serverIndex] : null;
    if (!server || !server.url) { splashLogo.style.display = "none"; return; }
    updateServerUI(serverIndex); startStream(server.url, server.drm);
}

function handleFailover() {
    let server = currentChannel.servers[currentServerIndex];
    let currentUrl = server?.url || "";
    const isSensitiveURL = /token=|expire=|roarzone|edge/i.test(currentUrl);
    if (!isUsingProxy && !isSensitiveURL && currentUrl) { isUsingProxy = true; startStream(corsProxy + encodeURIComponent(currentUrl), server?.drm); return; }
    currentTryIndex++;
    if (currentTryIndex < serversToTry.length) { loadStreamForServer(serversToTry[currentTryIndex]); } else { splashLogo.style.display = "none"; }
}

function setupQualityMenu(levels, type = 'hls') {
    const qualityMenu = document.getElementById('quality-submenu');
    const settingsMenu = document.getElementById('custom-settings-menu');
    qualityMenu.innerHTML = '';
    if (!levels || levels.length <= 1) {
      document.getElementById('menu-item-quality').classList.add('disabled'); document.getElementById('quality-value').textContent = 'Auto'; return;
    }
    document.getElementById('menu-item-quality').classList.remove('disabled');
    
    const backBtn = document.createElement('div');
    backBtn.className = 'menu-item back-item'; backBtn.innerHTML = `<span class="arrow">‹</span><span class="label">Quality</span>`;
    backBtn.onclick = e => { e.stopPropagation(); qualityMenu.classList.remove('visible'); settingsMenu.classList.add('visible'); if(typeof isTvNavMode !== 'undefined' && isTvNavMode) setTimeout(updateFocusElements, 100); };
    qualityMenu.appendChild(backBtn);
    
    const autoOpt = document.createElement('div'); 
    autoOpt.className = 'menu-item'; autoOpt.dataset.levelIndex = "-1"; autoOpt.innerHTML = `<span class="label">Auto</span>`;
    autoOpt.onclick = e => { 
        e.stopPropagation(); 
        if (type === 'hls' && hls) { hls.currentLevel = -1; updateQualityUI(-1, 'hls'); }
        else if (type === 'shaka' && shakaPlayerInstance) { 
            shakaPlayerInstance.configure({ abr: { enabled: true } }); 
            updateQualityUI(-1, 'shaka'); 
        }
        closeMenus(); if(typeof isTvNavMode !== 'undefined' && isTvNavMode) setTimeout(updateFocusElements, 100);
    };
    qualityMenu.appendChild(autoOpt);
    
    const uniqueLevels = [];
    levels.forEach((level, index) => {
      if (level.height) {
        const existing = uniqueLevels.find(l => l.height === level.height);
        if (!existing) { uniqueLevels.push({ ...level, originalIndex: level.originalIndex !== undefined ? level.originalIndex : index }); } 
        else if (level.bitrate > existing.bitrate) { existing.originalIndex = level.originalIndex !== undefined ? level.originalIndex : index; existing.bitrate = level.bitrate; }
      }
    });
    
    uniqueLevels.sort((a, b) => b.height - a.height).forEach(level => {
      const opt = document.createElement('div'); opt.className = 'menu-item'; opt.dataset.levelIndex = level.originalIndex; opt.innerHTML = `<span class="label">${level.height}p</span>`;
      opt.onclick = e => { 
          e.stopPropagation(); 
          if (type === 'hls' && hls) { hls.currentLevel = level.originalIndex; updateQualityUI(level.originalIndex, 'hls'); }
          else if (type === 'shaka' && shakaPlayerInstance) { 
              shakaPlayerInstance.configure({ abr: { enabled: false } }); 
              let tracks = shakaPlayerInstance.getVariantTracks();
              let selectedTrack = tracks.find(t => t.id === level.originalIndex);
              if (selectedTrack) shakaPlayerInstance.selectVariantTrack(selectedTrack, true);
              updateQualityUI(level.originalIndex, 'shaka'); 
          }
          closeMenus(); if(typeof isTvNavMode !== 'undefined' && isTvNavMode) setTimeout(updateFocusElements, 100);
      };
      qualityMenu.appendChild(opt);
    });
    
    let currentLevel = -1;
    if(type === 'hls' && hls) currentLevel = hls.currentLevel !== undefined ? hls.currentLevel : -1;
    else if (type === 'shaka' && shakaPlayerInstance) { 
        const auto = shakaPlayerInstance.getConfiguration().abr.enabled; 
        const activeTrack = shakaPlayerInstance.getVariantTracks().find(t => t.active);
        currentLevel = auto ? -1 : (activeTrack ? activeTrack.id : -1); 
    }
    updateQualityUI(currentLevel, type);
}
  
function updateQualityUI(index, type = 'hls') {
    const qualityMenu = document.getElementById('quality-submenu'); const valEl = document.getElementById('quality-value');
    if (!qualityMenu || !valEl) return;
    Array.from(qualityMenu.querySelectorAll('.menu-item')).forEach(el => el.classList.remove('active'));
    if (index === -1) {
      valEl.textContent = 'Auto'; const autoEl = qualityMenu.querySelector('[data-level-index="-1"]'); if(autoEl) autoEl.classList.add('active');
    } else {
      let heightStr = '';
      if (type === 'hls' && hls && hls.levels && hls.levels[index]) { heightStr = hls.levels[index].height; } 
      else if (type === 'shaka' && shakaPlayerInstance) { 
          const track = shakaPlayerInstance.getVariantTracks().find(t => t.id === index); 
          if(track) heightStr = track.height; 
      }
      if(heightStr) { valEl.textContent = `${heightStr}p`; const activeEl = qualityMenu.querySelector(`[data-level-index="${index}"]`); if(activeEl) activeEl.classList.add('active'); }
    }
}

// UNIVERSAL VIDEO PLAYER (DRM + DASH + HLS + TS) WITH 30 SECONDS LIVE DELAY (CRIFY TV STYLE)
function startStream(rawUrl, drmInfo = null) {
    if (typeof destroyPlayer === 'function') destroyPlayer(); 
    else {
        if (hls) { hls.destroy(); hls = null; }
        if (typeof mpegtsPlayer !== 'undefined' && mpegtsPlayer) { mpegtsPlayer.destroy(); mpegtsPlayer = null; }
        if (shakaPlayerInstance) { 
            shakaPlayerInstance.unload().catch(()=>{}); 
            shakaPlayerInstance.destroy(); 
            shakaPlayerInstance = null; 
        }
        if (window.stallCheckInterval) { clearInterval(window.stallCheckInterval); window.stallCheckInterval = null; }
        video.pause(); video.removeAttribute("src"); video.load();
        document.getElementById('menu-item-quality').classList.add('disabled'); document.getElementById('quality-value').textContent = 'Auto';
        currentBrightness = 1; video.style.filter = 'brightness(1)';
    }
    
    splashLogo.style.display = "block"; splashLogo.style.opacity = "1"; video.style.display = "none";
    let url = rawUrl; const isSensitiveURL = /token=|expire=|roarzone|edge/i.test(url);
    if (isSensitiveURL && url.includes('?url=')) { try { url = new URL(url).searchParams.get('url') || url; } catch (e) {} }
    
    const isTS = url.toLowerCase().includes('.ts'); 
    const isDASH = url.toLowerCase().includes('.mpd');
    const hasDRM = drmInfo !== null;
    const nativeSupported = video.canPlayType('application/vnd.apple.mpegurl');
    let shakaRetryCount = 0; 
    
    const playNative = () => {
      video.src = url; video.muted = false;
      let playPromise = video.play(); if (playPromise !== undefined) playPromise.catch(() => {});
      video.onerror = () => { if (!isSensitiveURL && typeof handleFailover === 'function') handleFailover(); else splashLogo.style.display = "none"; };
    };

    if (window.shaka && !shakaPolyfillsInstalled) {
        shaka.polyfill.installAll();
        shakaPolyfillsInstalled = true;
    }
  
    var hlsConfig = isStrictSmartTV ? { enableWorker: false, maxBufferLength: 15, maxMaxBufferLength: 30, maxBufferSize: 20 * 1024 * 1024, liveSyncDurationCount: 3 } : { enableWorker: true };
    var mpegtsConfig = isStrictSmartTV ? { enableWorker: false, enableStashBuffer: false, lazyLoad: false } : { enableWorker: true, enableStashBuffer: true, stashInitialSize: 384, lazyLoad: false };
  
    if (isTS && typeof mpegts !== 'undefined' && mpegts.getFeatureList().mseLivePlayback) {
      mpegtsPlayer = mpegts.createPlayer({ type: 'mpegts', isLive: true, url: url }, mpegtsConfig);
      mpegtsPlayer.attachMediaElement(video); mpegtsPlayer.load(); video.muted = false;
      var playPromise = mpegtsPlayer.play(); if (playPromise !== undefined) playPromise.catch(function(){});
      mpegtsPlayer.on(mpegts.Events.ERROR, function () { if(!isSensitiveURL && typeof handleFailover === 'function') { handleFailover(); } else { splashLogo.style.display = "none"; } });
    } 
    else if ((isDASH || hasDRM) && window.shaka && shaka.Player.isBrowserSupported()) {
      shakaPlayerInstance = new shaka.Player(video);
      
      // 🔴 30 SECONDS DELAY & MAX STABILITY CONFIGURATION 🔴
      let playerConfig = { 
          abr: { 
              enabled: true,
              defaultBandwidthEstimate: 300000, 
              restrictions: {
                  maxHeight: 720,               // Limit Quality to 720p
                  maxBandwidth: 2000000         // Limit Bandwidth to 2Mbps
              }
          }, 
          streaming: { 
              bufferingGoal: 30,       // Buffer 30 seconds ahead
              rebufferingGoal: 5,      
              bufferBehind: 15,        
              jumpLargeGaps: false,    // TURNED OFF auto-skip
              smallGapLimit: 2.5,
              retryParameters: { maxAttempts: 10, baseDelay: 1000, timeout: 10000 } 
          },
          manifest: {
              defaultPresentationDelay: 30, // Force 30 seconds behind live edge
              dash: { autoCorrectDrift: true }, 
              retryParameters: { maxAttempts: 10, baseDelay: 1000, timeout: 10000 }
          },
          drm: {
              retryParameters: { maxAttempts: 10, baseDelay: 1000, timeout: 10000 }
          }
      };

      if (drmInfo) {
          if (drmInfo.type === 'clearkey') {
              let keys = drmInfo.key.split(':');
              if (keys.length === 2) {
                  playerConfig.drm.clearKeys = {};
                  playerConfig.drm.clearKeys[keys[0]] = keys[1]; 
              }
          } else if (drmInfo.type === 'widevine') {
              playerConfig.drm.servers = { 'com.widevine.alpha': drmInfo.key };
          } else if (drmInfo.type === 'playready') {
              playerConfig.drm.servers = { 'com.microsoft.playready': drmInfo.key };
          }
      }

      shakaPlayerInstance.configure(playerConfig);

      // --- 🔴 SMART SILENT RECONNECT LOGIC (Using Unload & Load) ---
      shakaPlayerInstance.addEventListener('error', function (error) {
          if (error.detail && error.detail.severity === 2) { 
              if (shakaRetryCount < 5) {
                  shakaRetryCount++;
                  
                  // Silently unload and reload
                  if(shakaPlayerInstance) {
                      shakaPlayerInstance.unload().then(() => {
                          setTimeout(() => {
                              shakaPlayerInstance.load(url, null).then(() => {
                                  video.play().catch(e=>{});
                              }).catch(e => {
                                  if(shakaRetryCount >= 5) {
                                      if(!isSensitiveURL && typeof handleFailover === 'function') handleFailover(); else splashLogo.style.display = "none";
                                  }
                              });
                          }, 2000);
                      }).catch(()=>{});
                  }
              } else {
                  if(!isSensitiveURL && typeof handleFailover === 'function') handleFailover(); else splashLogo.style.display = "none";
              }
          }
      });

      shakaPlayerInstance.load(url).then(function() {
          video.muted = false;
          let playPromise = video.play(); if (playPromise !== undefined) playPromise.catch(function(){});
          
          let tracks = shakaPlayerInstance.getVariantTracks();
          let videoTracks = tracks.filter(t => t.height).map(t => ({ height: t.height, bitrate: t.bandwidth, originalIndex: t.id }));
          
          if(videoTracks.length > 0) { setupQualityMenu(videoTracks, 'shaka'); }
      }).catch(function(e) {
          if(!isSensitiveURL && typeof handleFailover === 'function') { handleFailover(); } else { splashLogo.style.display = "none"; }
      });

      shakaPlayerInstance.addEventListener('adaptation', function() {
          if (shakaPlayerInstance.getConfiguration().abr.enabled) {
              let activeTrack = shakaPlayerInstance.getVariantTracks().find(t => t.active);
              if (activeTrack && activeTrack.height) { document.getElementById('quality-value').textContent = 'Auto (' + activeTrack.height + 'p)'; }
          }
      });
    }
    else if (isStrictSmartTV && nativeSupported && !isTS && !isDASH) { playNative(); }
    else if (Hls.isSupported() && !isTS && !isDASH) {
      if(isSensitiveURL) hlsConfig = {}; 
      hls = new Hls(hlsConfig); hls.loadSource(url); hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) { setupQualityMenu(data.levels, 'hls'); video.muted = false; var playPromise = video.play(); if (playPromise !== undefined) playPromise.catch(function(){}); });
      hls.on(Hls.Events.LEVEL_SWITCHED, function(e, data) { if (hls.autoLevelEnabled && hls.levels[data.level]) { document.getElementById('quality-value').textContent = 'Auto (' + hls.levels[data.level].height + 'p)'; } });
      hls.on(Hls.Events.ERROR, function (event, data) { 
          if (data.fatal) { 
              if (isSensitiveURL && nativeSupported) { playNative(); return; } 
              if (data.type === Hls.ErrorTypes.MEDIA_ERROR) { hls.recoverMediaError(); } 
              else if(!isSensitiveURL && typeof handleFailover === 'function') { handleFailover(); } 
              else { splashLogo.style.display = "none"; } 
          } 
      });
    } 
    else if (nativeSupported && !isTS && !isDASH) { playNative(); } 
    else { splashLogo.style.display = "none"; }
}

function openPlayer(index, keepCurrentState = false) {
    if (isNaN(index) || index < 0 || index >= displayedChannels.length) return;
    savedScrollPosition = window.scrollY; document.body.classList.add('player-open');
    currentChannelIndex = index; currentChannel = displayedChannels[index];
    const stickyAd = document.getElementById('sticky-ad-banner'); if (stickyAd) stickyAd.style.display = 'none';
    updateDynamicSEO(currentChannel);
    const newUrl = window.location.pathname + '?channel=' + currentChannel.slug + '#player';
    if (playerOverlay.style.display !== 'flex') { history.pushState({ playerOpen: true }, 'Player', newUrl); } else { history.replaceState({ playerOpen: true }, 'Player', newUrl); }
    localStorage.setItem('obiramLastLogoUrl', currentChannel.logoUrl); localStorage.setItem('obiramLastChannelSlug', currentChannel.slug);
    playerOverlay.style.display = "flex"; pNum.innerText = (currentChannel.originalIndex + 1) + "."; pLogo.src = currentChannel.logoUrl; pName.innerText = currentChannel.name;
    checkSmartScroll(); setActiveCard(index, true); updateFavoriteUI();
    let preferredIndex = 0; const savedPref = parseInt(localStorage.getItem('obiram_main_srv_pref_' + currentChannel.slug));
    if (!isNaN(savedPref) && savedPref >= 0 && savedPref < currentChannel.servers.length) { preferredIndex = savedPref; }
    serversToTry = []; for (let i = 0; i < currentChannel.servers.length; i++) { serversToTry.push((preferredIndex + i) % currentChannel.servers.length); }
    currentTryIndex = 0; setupServerMenu(currentChannel.servers); loadStreamForServer(serversToTry[currentTryIndex]);
    showControls(); window.scrollTo(0, 0);
    if(!keepCurrentState) enterFullscreen();
}

function showToastMessage(msg) {
    let toast = document.getElementById('tv-toast');
    if (!toast) {
        toast = document.createElement('div'); toast.id = 'tv-toast';
        toast.style.cssText = 'position:fixed;top:15%;left:50%;transform:translateX(-50%);background:var(--theme-color-pink, #e83d84);color:#fff;padding:12px 24px;border-radius:25px;z-index:999999;font-weight:bold;font-size:16px;box-shadow:0 5px 15px rgba(0,0,0,0.5);transition:opacity 0.3s;pointer-events:none;opacity:0;';
        document.body.appendChild(toast);
    }
    toast.textContent = msg; toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

function updateFocusElements() {
    focusElements.forEach(el => el.classList.remove('tv-focus')); focusElements = [];
    const qMenu = document.getElementById('quality-submenu'); const sMenu = document.getElementById('custom-settings-menu');
    const npMenu = document.getElementById('numpad-container');
    if (qMenu && qMenu.classList.contains('visible')) { focusElements = Array.from(qMenu.querySelectorAll('.menu-item:not(.disabled)')); } 
    else if (sMenu && sMenu.classList.contains('visible')) { focusElements = Array.from(sMenu.querySelectorAll('.menu-item:not(.disabled)')); } 
    else if (npMenu && npMenu.classList.contains('visible')) { focusElements = Array.from(npMenu.querySelectorAll('.num-btn')); } 
    else { focusElements = [document.getElementById('p-back'), ...Array.from(document.querySelectorAll('.server-pill')), document.getElementById('p-prev'), document.getElementById('p-next'), document.getElementById('p-reload'), document.getElementById('p-fs'), document.getElementById('p-set'), document.getElementById('numpad-toggle-btn')].filter(el => el && el.offsetParent !== null && window.getComputedStyle(el).display !== 'none'); }
    if (focusElements.length > 0) { if (currentFocusIndex >= focusElements.length) currentFocusIndex = 0; if (currentFocusIndex < 0) currentFocusIndex = 0; focusElements[currentFocusIndex].classList.add('tv-focus'); focusElements[currentFocusIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' }); }
}

function moveFocus(step) {
    updateFocusElements(); if (focusElements.length === 0) return; focusElements[currentFocusIndex].classList.remove('tv-focus');
    currentFocusIndex += step; if (currentFocusIndex >= focusElements.length) currentFocusIndex = 0; if (currentFocusIndex < 0) currentFocusIndex = focusElements.length - 1;
    focusElements[currentFocusIndex].classList.add('tv-focus'); focusElements[currentFocusIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' }); showControls(); 
}

function getDrawerElements() { return [document.getElementById('drawer-close-btn'), ...Array.from(document.querySelectorAll('.drawer-menu li a'))].filter(el => el && el.offsetParent !== null); }

function updateDrawerFocus() {
    const els = getDrawerElements(); els.forEach(el => el.classList.remove('tv-focus'));
    if(els.length === 0) return;
    if(drawerFocusIndex < 0) drawerFocusIndex = els.length - 1; if(drawerFocusIndex >= els.length) drawerFocusIndex = 0;
    els[drawerFocusIndex].classList.add('tv-focus'); els[drawerFocusIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updateModalFocus(isResume = false) {
    const btns = isResume ? [document.getElementById('resume-close-btn'), document.getElementById('resume-play-btn')].filter(b => b && b.offsetParent !== null) : [document.getElementById('modal-cancel-btn'), document.getElementById('modal-ok-btn')].filter(b => b && window.getComputedStyle(b).display !== 'none');
    btns.forEach(b => b.classList.remove('tv-focus'));
    if(btns.length === 0) return;
    if(modalFocusIndex < 0) modalFocusIndex = btns.length - 1; if(modalFocusIndex >= btns.length) modalFocusIndex = 0;
    btns[modalFocusIndex].classList.add('tv-focus');
}

function setupPlayerEvents() {
    wrap.onmousemove = wrap.onclick = wrap.ontouchstart = showControls;
    video.addEventListener('playing', () => { splashLogo.style.display = "none"; video.style.display = "block"; });
    document.getElementById("p-fs").onclick = () => { (document.fullscreenElement || document.webkitFullscreenElement) ? exitFullscreen() : enterFullscreen(); };
    document.getElementById("p-back").onclick = () => { (window.history.state && window.history.state.playerOpen) ? window.history.back() : closePlayer(); };
    document.getElementById("p-prev").onclick = () => { if(displayedChannels.length > 0) { resetChannelInput(); openPlayer(currentChannelIndex > 0 ? currentChannelIndex - 1 : displayedChannels.length - 1, true); } };
    document.getElementById("p-next").onclick = () => { if(displayedChannels.length > 0) { resetChannelInput(); openPlayer(currentChannelIndex < displayedChannels.length - 1 ? currentChannelIndex + 1 : 0, true); } };
    document.getElementById("p-reload").onclick = () => { if(currentChannel) loadStreamForServer(currentServerIndex); };

    document.getElementById("p-set").onclick = (e) => {
        e.stopPropagation(); const settingsMenu = document.getElementById('custom-settings-menu'); const qualityMenu = document.getElementById('quality-submenu');
        if (qualityMenu.classList.contains('visible')) { qualityMenu.classList.remove('visible'); settingsMenu.classList.add('visible'); } else { settingsMenu.classList.toggle('visible'); }
        if (isTvNavMode) setTimeout(updateFocusElements, 100);
    };

    wrap.addEventListener('click', (e) => { if (!e.target.closest('.settings-menu-container') && !e.target.closest('#p-set') && !e.target.closest('#numpad-wrapper')) { closeMenus(); } });
    document.getElementById('menu-item-quality').onclick = (e) => { e.stopPropagation(); if (document.getElementById('menu-item-quality').classList.contains('disabled')) return; document.getElementById('custom-settings-menu').classList.remove('visible'); document.getElementById('quality-submenu').classList.add('visible'); if (isTvNavMode) setTimeout(updateFocusElements, 100); };
    document.getElementById('menu-item-aspect').onclick = (e) => { e.stopPropagation(); currentAspectMode = (currentAspectMode + 1) % aspectRatioModes.length; const newMode = aspectRatioModes[currentAspectMode]; aspectRatioModes.forEach(mode => wrap.classList.remove(mode.className)); wrap.classList.add(newMode.className); document.getElementById('aspect-value').textContent = newMode.name; closeMenus(); if(isTvNavMode) setTimeout(updateFocusElements, 100); };
    document.getElementById('menu-item-pip').onclick = async (e) => { e.stopPropagation(); closeMenus(); if (!document.pictureInPictureEnabled) return; try { video !== document.pictureInPictureElement ? await video.requestPictureInPicture() : await document.exitPictureInPicture(); } catch (err) {} };
    document.getElementById('menu-item-favorites').onclick = (e) => { e.stopPropagation(); toggleFavorite(); };
    document.getElementById('menu-item-share-player').onclick = (e) => { e.stopPropagation(); closeMenus(); let shareText = `🔴 Live Now: অবিরাম টিভিতে এখন চলছে **${currentChannel.name}**!\nকোনো বাফারিং ছাড়াই সরাসরি খেলা বা খবর দেখতে নিচের লিংকে ক্লিক করুন 👇\n${SHARE_URL}?channel=${currentChannel.slug}`; if (navigator.share) { navigator.share({ title: 'SRB Live TV', text: shareText }).catch(()=>{}); } else { navigator.clipboard.writeText(shareText); alert("Copied!"); } };
    
    function showOSD(type, value) {
        const osd = document.getElementById('osd-indicator'); const percent = Math.round(value * 100);
        document.getElementById('osd-icon').innerHTML = type === 'volume' ? (percent === 0 ? `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>` : `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`) : `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06z"/></svg>`;
        document.getElementById('osd-text').textContent = `${percent}%`; document.getElementById('osd-fill').style.width = `${percent}%`;
        osd.classList.add('visible'); clearTimeout(osdTimer); osdTimer = setTimeout(() => osd.classList.remove('visible'), 1500);
    }

    wrap.addEventListener('touchstart', e => {
        if (e.target.closest('button, input, .settings-menu-container, .server-pill, #numpad-wrapper')) return;
        isSwiping = true; startX = e.touches[0].clientX; startY = e.touches[0].clientY; swipeDirection = null;
        swipeZone = startX > window.innerWidth / 2 ? 'volume' : 'brightness'; startVol = video.volume; startBright = currentBrightness;
    }, { passive: true });

    document.addEventListener('touchmove', e => {
        if (!isSwiping || playerOverlay.style.display !== "flex") return;
        const dX = e.touches[0].clientX - startX; const dY = e.touches[0].clientY - startY;
        if (!swipeDirection) { if (Math.abs(dX) > 15 && Math.abs(dX) > Math.abs(dY)) { swipeDirection = 'horizontal'; } else if (Math.abs(dY) > 15) { swipeDirection = 'vertical'; } }
        if (swipeDirection === 'vertical') { 
            e.preventDefault(); const percentageChange = -dY / (window.innerHeight * 0.4); 
            if (swipeZone === 'volume') { let newVol = Math.max(0, Math.min(1, startVol + percentageChange)); video.volume = newVol; video.muted = newVol === 0; showOSD('volume', newVol); } else { let newBright = Math.max(0.1, Math.min(1, startBright + percentageChange)); currentBrightness = newBright; video.style.filter = `brightness(${newBright})`; showOSD('brightness', newBright); } 
        } else if (swipeDirection === 'horizontal') { e.preventDefault(); }
    }, { passive: false });

    document.addEventListener('touchend', e => { 
        if (!isSwiping || playerOverlay.style.display !== "flex") return; 
        if (swipeDirection === 'horizontal' && Math.abs(e.changedTouches[0].clientX - startX) > 70) { if (e.changedTouches[0].clientX - startX > 0) { document.getElementById("p-prev").click(); } else { document.getElementById("p-next").click(); } } 
        isSwiping = false; swipeDirection = null; 
    });

    document.addEventListener('keydown', e => {
        if (e.defaultPrevented) return;
        const isPlayerOpen = playerOverlay.style.display === "flex"; const isSearchFocused = document.activeElement === searchInput;
        if (isSearchFocused && e.key !== "ArrowDown" && e.key !== "Enter" && e.key !== "Escape") return;

        if (isPlayerOpen) {
            if (e.key >= '0' && e.key <= '9') { e.preventDefault(); if (channelInputBuffer.length >= 4) channelInputBuffer = ''; channelInputBuffer += e.key; if (channelInputOverlay) { channelInputOverlay.textContent = channelInputBuffer; channelInputOverlay.style.display = 'block'; } clearTimeout(channelInputTimer); channelInputTimer = setTimeout(goToChannelByInput, 2000); return; }

            if (e.key === 'Enter') {
                e.preventDefault(); if (channelInputBuffer) { goToChannelByInput(); return; }
                enterClickCount++;
                if (enterClickCount === 1) {
                    enterClickTimer = setTimeout(() => {
                        if (enterClickCount === 1) { if (isTvNavMode && focusElements[currentFocusIndex]) { focusElements[currentFocusIndex].click(); setTimeout(updateFocusElements, 100); } else { showControls(); } }
                        enterClickCount = 0;
                    }, 1500); 
                } else if (enterClickCount === 3) {
                    clearTimeout(enterClickTimer); enterClickCount = 0; isTvNavMode = !isTvNavMode; showToastMessage(isTvNavMode ? "TV Navigation: ON" : "TV Navigation: OFF");
                    if (isTvNavMode) { showControls(); currentFocusIndex = 0; updateFocusElements(); } else focusElements.forEach(el => el.classList.remove('tv-focus'));
                }
                return;
            }

            if (isTvNavMode) {
                switch (e.key) {
                    case 'ArrowRight': case 'ArrowDown': e.preventDefault(); moveFocus(1); break;
                    case 'ArrowLeft': case 'ArrowUp': e.preventDefault(); moveFocus(-1); break;
                    case 'Backspace': case 'Escape': e.preventDefault(); if (document.getElementById('quality-submenu').classList.contains('visible') || document.getElementById('custom-settings-menu').classList.contains('visible') || (document.getElementById('numpad-container') && document.getElementById('numpad-container').classList.contains('visible'))) { closeMenus(); setTimeout(updateFocusElements, 100); } else { document.getElementById("p-back").click(); } break;
                }
                return;
            }

            switch (e.key) {
                case 'Backspace': case 'Escape': if (channelInputBuffer && e.key !== 'Escape') { e.preventDefault(); channelInputBuffer = channelInputBuffer.slice(0, -1); channelInputOverlay.textContent = channelInputBuffer; clearTimeout(channelInputTimer); if (channelInputBuffer) channelInputTimer = setTimeout(goToChannelByInput, 2000); else channelInputOverlay.style.display = 'none'; } else { e.preventDefault(); document.getElementById("p-back").click(); } break;
                case 'ArrowUp': e.preventDefault(); video.volume = Math.min(1, video.volume + 0.05); video.muted = false; showOSD('volume', video.volume); break;
                case 'ArrowDown': e.preventDefault(); video.volume = Math.max(0, video.volume - 0.05); if(video.volume === 0) video.muted = true; showOSD('volume', video.volume); break;
                case 'ArrowLeft': e.preventDefault(); document.getElementById("p-prev").click(); break;
                case 'ArrowRight': e.preventDefault(); document.getElementById("p-next").click(); break;
                case ' ': case 'MediaPlayPause': e.preventDefault(); video.paused ? video.play() : video.pause(); break;
                case 'f': case 'F': e.preventDefault(); document.getElementById("p-fs").click(); break;
                case 'm': case 'M': e.preventDefault(); video.muted = !video.muted; showOSD('volume', video.muted ? 0 : video.volume); break;
            }
        } else {
            const cards = list.querySelectorAll('.channel-card'); if (!cards.length) return;
            if (e.target.tagName === 'INPUT' && e.target.id === 'search-input') {
                if (e.key === 'ArrowDown') { e.preventDefault(); e.target.blur(); isHeaderFocus = false; setActiveCard(Math.max(0, activeGridIndex), true); }
                if (e.key === 'Escape') { e.preventDefault(); topHeader.classList.remove('search-active'); searchInput.value = ''; performSearch(); e.target.blur(); }
                if (e.key === 'Enter') { e.target.blur(); }
                return;
            }

            let hElements = [document.getElementById('menu-toggle-btn'), document.getElementById('search-input'), document.getElementById('search-toggle-btn'), document.getElementById('refresh-button')].filter(el => el && el.offsetParent !== null && window.getComputedStyle(el).display !== 'none');
            if (isHeaderFocus) {
                e.preventDefault(); hElements.forEach(el => el.classList.remove('tv-focus'));
                switch(e.key) {
                    case 'ArrowLeft': headerFocusIndex--; break;
                    case 'ArrowRight': headerFocusIndex++; break;
                    case 'ArrowDown': isHeaderFocus = false; setActiveCard(Math.max(0, activeGridIndex), true); return;
                    case 'Enter': if (hElements[headerFocusIndex]) { if (hElements[headerFocusIndex].tagName === 'INPUT') { hElements[headerFocusIndex].focus(); hElements[headerFocusIndex].classList.add('tv-focus'); } else { hElements[headerFocusIndex].click(); } } return;
                }
                if (headerFocusIndex < 0) headerFocusIndex = 0; if (headerFocusIndex >= hElements.length) headerFocusIndex = hElements.length - 1;
                if(hElements[headerFocusIndex]) hElements[headerFocusIndex].classList.add('tv-focus');
                return;
            }

            const columns = Math.max(1, Math.floor(list.clientWidth / (cards[0].offsetWidth + 20))); let newIndex = activeGridIndex;
            switch (e.key) {
                case 'ArrowUp': if (activeGridIndex < columns && hElements.length > 0) { isHeaderFocus = true; headerFocusIndex = 0; if(cards[activeGridIndex]) cards[activeGridIndex].classList.remove('active'); hElements[headerFocusIndex].classList.add('tv-focus'); e.preventDefault(); return; } newIndex -= columns; break;
                case 'ArrowDown': newIndex += columns; break;
                case 'ArrowLeft': newIndex--; break;
                case 'ArrowRight': newIndex++; break;
                case 'Enter': e.preventDefault(); if (cards[activeGridIndex]) cards[activeGridIndex].click(); return;
                case 'Escape': case 'Backspace': if (topHeader.classList.contains('search-active')) { e.preventDefault(); topHeader.classList.remove('search-active'); searchInput.value = ''; performSearch(); } break;
            }
            if (newIndex !== activeGridIndex) setActiveCard(newIndex, true);
        }
    });

    list.addEventListener('mouseover', e => { const card = e.target.closest('.channel-card'); if (card) { const index = Array.from(list.querySelectorAll('.channel-card')).indexOf(card); if (index !== -1) setActiveCard(index, false); } });
    
    const hiddenInput = document.createElement('input'); hiddenInput.type = 'hidden'; hiddenInput.id = 'resume-target-index'; document.body.appendChild(hiddenInput);
}

function resetChannelInput() { clearTimeout(channelInputTimer); channelInputBuffer = ''; if (channelInputOverlay) channelInputOverlay.style.display = 'none'; const npDisplay = document.getElementById('numpad-display'); if(npDisplay) npDisplay.innerText = '';}
function goToChannelByInput() { if (!channelInputBuffer) return; const targetChannelNum = parseInt(channelInputBuffer, 10); resetChannelInput(); const actualChannel = channelsList.find(c => c.originalIndex === targetChannelNum - 1); if (actualChannel) { const targetDisplayIndex = displayedChannels.findIndex(c => c.slug === actualChannel.slug); if (targetDisplayIndex >= 0) openPlayer(targetDisplayIndex, false); } }

function setupEventListeners() {
    const topHeader = document.getElementById('sticky-header'); const navDrawer = document.getElementById('nav-drawer'); const navOverlay = document.getElementById('nav-overlay'); const modalOverlay = document.getElementById('custom-modal-overlay');
    function debounce(func, wait) { let timeout; return function(...args) { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), wait); }; }
    
    const performSearch = () => { const query = searchInput.value.toLowerCase().trim(); renderChannels(query ? channelsList.filter(c => c.name.toLowerCase().includes(query)) : channelsList); };
    document.getElementById('search-toggle-btn').addEventListener('click', () => { topHeader.classList.add('search-active'); searchInput.focus(); });
    document.getElementById('search-close-btn').addEventListener('click', () => { topHeader.classList.remove('search-active'); searchInput.value = ''; performSearch(); });
    document.getElementById('search-button').addEventListener('click', performSearch); searchInput.addEventListener('input', debounce(performSearch, 300));
    document.getElementById('refresh-button').addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); fetchAllChannels(); });
    
    const openDrawer = () => { navDrawer.classList.add('open'); navOverlay.classList.add('open'); document.body.classList.add('drawer-open'); drawerFocusIndex = 0; updateDrawerFocus(); }; 
    const closeDrawer = () => { navDrawer.classList.remove('open'); navOverlay.classList.remove('open'); document.body.classList.remove('drawer-open'); getDrawerElements().forEach(el => el.classList.remove('tv-focus')); }; 
    
    document.getElementById('menu-toggle-btn').addEventListener('click', openDrawer); document.getElementById('drawer-close-btn').addEventListener('click', closeDrawer); navOverlay.addEventListener('click', closeDrawer);

    const hideModal = () => { modalOverlay.style.display = 'none'; };
    function showCustomModal(options) { 
        document.getElementById('modal-title').textContent = options.title; document.getElementById('modal-text').innerHTML = options.html; 
        let okBtn = document.getElementById('modal-ok-btn'); let newOkBtn = okBtn.cloneNode(true); newOkBtn.textContent = options.okText || 'OK'; okBtn.parentNode.replaceChild(newOkBtn, okBtn); newOkBtn.addEventListener('click', options.onOk || hideModal); 
        let cancelBtn = document.getElementById('modal-cancel-btn'); 
        if (options.cancelText) { let newCancelBtn = cancelBtn.cloneNode(true); newCancelBtn.textContent = options.cancelText; cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn); newCancelBtn.style.display = 'inline-block'; newCancelBtn.addEventListener('click', options.onCancel || hideModal); modalFocusIndex = 1; } else { cancelBtn.style.display = 'none'; modalFocusIndex = 0; } 
        modalOverlay.style.display = 'flex'; closeDrawer(); updateModalFocus(false); 
    }

    const updateAutoplayUI = () => { const text = document.getElementById('autoplay-status-text'); if (isAutoplayEnabled) { text.textContent = 'ON'; text.style.background = 'var(--theme-color-pink)'; text.style.color = '#fff'; } else { text.textContent = 'OFF'; text.style.background = '#444'; text.style.color = '#ccc'; } }; 
    document.getElementById('menu-autoplay-toggle').addEventListener('click', (e) => { e.preventDefault(); isAutoplayEnabled = !isAutoplayEnabled; localStorage.setItem('obiramAutoPlayLast', isAutoplayEnabled); updateAutoplayUI(); }); 
    document.getElementById('menu-copyright').addEventListener('click', (e) => { e.preventDefault(); showCustomModal({ title: 'Copyright', html: "<p>SRB TV does not stream any of the channels...</p>" }); }); 
    document.getElementById('menu-telegram').addEventListener('click', (e) => { e.preventDefault(); window.open('#', '_blank'); closeDrawer(); }); 
    document.getElementById('menu-contact').addEventListener('click', (e) => { e.preventDefault(); showCustomModal({ title: 'Contact Us', html: `<div style="text-align: left;"><p><b>Website:</b> https://srbtv.vercel.app </p></div>`, okText: 'Close' }); }); 
    document.getElementById('menu-update').addEventListener('click', (e) => { e.preventDefault(); showCustomModal({ title: 'Update', html: '<p>Open official page?</p>', okText: 'Update', onOk: () => { window.open('#', '_blank'); hideModal(); }, cancelText: 'Cancel' }); }); 
    document.getElementById('menu-exit').addEventListener('click', (e) => { e.preventDefault(); showCustomModal({ title: 'Exit', html: '<p>Close app?</p>', okText: 'Exit', onOk: () => window.close(), cancelText: 'Stay' }); });

    document.getElementById('resume-close-btn').addEventListener('click', () => { document.getElementById('resume-overlay').style.display = 'none'; }); 
    document.getElementById('resume-play-btn').addEventListener('click', () => { document.getElementById('resume-overlay').style.display = 'none'; let targetIndex = document.getElementById('resume-target-index').value; if (targetIndex !== "") openPlayer(parseInt(targetIndex), false); });
}

// ==========================================
// ANTI AD-BLOCKER SYSTEM
// ==========================================
function detectAdBlocker() {
    if (typeof hasPremiumAccess === 'function' && hasPremiumAccess()) return;
    const fakeAd = document.createElement('div');
    fakeAd.className = 'ad-banner adsbox doubleclick sponsor';
    fakeAd.style.cssText = 'position:absolute; top:-999px; left:-999px; width:1px; height:1px;';
    document.body.appendChild(fakeAd);

    setTimeout(() => {
        const isBlocked = fakeAd.offsetHeight === 0 || window.getComputedStyle(fakeAd).display === 'none';
        fakeAd.remove();

        if (isBlocked) {
            if(typeof closePlayer === 'function') closePlayer();
            const blockOverlay = document.createElement('div');
            blockOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.95); z-index:999999999; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:20px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);';
            blockOverlay.innerHTML = `
                <svg width="80" height="80" viewBox="0 0 24 24" fill="#ff3b3b" style="animation: pulseGlow 2s infinite;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                <h2 style="color:#fff; margin-top:20px; font-family:sans-serif; font-size: 1.8rem;">Ad Blocker Detected!</h2>
                <p style="color:#ccc; max-width:400px; font-family:sans-serif; line-height:1.6; margin-top:10px;">
                    অবিরাম টিভি সম্পূর্ণ ফ্রি, আমরা সার্ভার খরচ মেটাতে অ্যাডের উপর নির্ভরশীল। দয়া করে আপনার <b>Ad Blocker বন্ধ করুন</b>।
                </p>
                <div style="display:flex; flex-wrap:wrap; gap:15px; margin-top:30px; justify-content:center;">
                    <button onclick="window.location.reload()" style="background:#e83d84; color:#fff; border:none; padding:12px 25px; border-radius:25px; font-weight:bold; cursor:pointer; font-size:15px; box-shadow: 0 4px 15px rgba(232, 61, 132, 0.4);">I've Disabled It (Refresh)</button>
                    <button onclick="window.location.href='support.html'" style="background:#222; color:#fff; border:1px solid #555; padding:12px 25px; border-radius:25px; font-weight:bold; cursor:pointer; font-size:15px;">Get Premium (Ad-Free)</button>
                </div>
            `;
            document.body.appendChild(blockOverlay);
        }
    }, 1500); 
}
document.addEventListener('DOMContentLoaded', () => { setTimeout(detectAdBlocker, 2000); });

// ==========================================
// LANDSCAPE / FULLSCREEN PROMPT LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const landscapeOverlay = document.getElementById('landscape-prompt-overlay');
    const landscapeBtn = document.getElementById('landscape-btn');
    const landscapeCloseBtn = document.getElementById('landscape-close-btn');
    const landscapeLogo = document.getElementById('landscape-channel-logo');

    window.showLandscapePrompt = function() {
        if (landscapeOverlay && typeof currentChannel !== 'undefined' && currentChannel) {
            landscapeLogo.src = currentChannel.logoUrl; 
            landscapeOverlay.style.display = 'flex';
        }
    };

    if (landscapeOverlay) {
        landscapeCloseBtn.addEventListener('click', () => { landscapeOverlay.style.display = 'none'; });
        landscapeBtn.addEventListener('click', () => { landscapeOverlay.style.display = 'none'; enterFullscreen(); });
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                const playerOverlay = document.getElementById("video-player-overlay");
                if (playerOverlay && playerOverlay.style.display === "flex") {
                    const isMobile = window.innerWidth <= 768;
                    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
                    if (isMobile && !isFullscreen) { window.showLandscapePrompt(); }
                }
            }
        });
    }
});

const originalEnterFullscreen = enterFullscreen;
enterFullscreen = function() {
    const req = wrap.requestFullscreen || wrap.webkitRequestFullscreen || wrap.mozRequestFullScreen || wrap.msRequestFullscreen; 
    if (req && !document.fullscreenElement && !document.webkitFullscreenElement) { 
        let promise = req.call(wrap); 
        if (promise) { 
            promise.then(() => { if (window.innerWidth <= 768 && screen.orientation && screen.orientation.lock) { screen.orientation.lock('landscape').catch(() => {}); } }).catch(() => {
                if (window.innerWidth <= 768 && typeof window.showLandscapePrompt === 'function') { window.showLandscapePrompt(); }
            }); 
        } 
    } else if (video.webkitEnterFullscreen) { video.webkitEnterFullscreen(); } 
};

// ==========================================
// ON-LOAD LIVE TOKEN CHECKER
// ==========================================
(function checkTokenLiveSync() {
    const token = localStorage.getItem('obiramPremiumToken');
    if (!token) return;
    try {
        const data = JSON.parse(atob(token));
        if (!data.code) return; 
        const TOKEN_API_BASE = "https://tokenpro.emonsa98.workers.dev"; 
        fetch(`${TOKEN_API_BASE}/api/check`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ code: data.code }) })
        .then(res => res.json())
        .then(resData => {
            if (resData.valid === false) { localStorage.removeItem('obiramPremiumToken'); localStorage.removeItem('obiramPremiumStatus'); window.location.reload(); }
        }).catch(e => {}); 
    } catch(e) {}
})();
