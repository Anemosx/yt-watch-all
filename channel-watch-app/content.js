(function () {
    'use strict';

    function getChannelId() {
        const metaChannelId = document.querySelector('meta[itemprop="channelId"]');
        if (metaChannelId && metaChannelId.content) {
            return metaChannelId.content;
        }

        const canonicalUrl = document.querySelector('link[rel="canonical"]');
        if (canonicalUrl && canonicalUrl.href && canonicalUrl.href.includes('/channel/')) {
            return canonicalUrl.href.split('/channel/').pop();
        }

        if (location.pathname.startsWith('/channel/')) {
            return location.pathname.split('/channel/')[1].split('/')[0];
        }

        const data = window.ytInitialData;
        if (data) {
            if (data.header?.c4TabbedHeaderRenderer?.channelId) {
                return data.header.c4TabbedHeaderRenderer.channelId;
            }
            if (data.metadata?.channelMetadataRenderer?.externalId) {
                return data.metadata.channelMetadataRenderer.externalId;
            }
            if (data.browse_id && data.browse_id.startsWith('UC')) {
                return data.browse_id;
            }
            if (data.responseContext?.serviceTrackingParams) {
                const service = data.responseContext.serviceTrackingParams.find(s => s.service === 'GFEED');
                if (service) {
                    const channelParam = service.params.find(p => p.key === 'channel_id');
                    if (channelParam) return channelParam.value;
                }
            }
        }

        const channelIdRegex = /"channelId":"(UC[^"]+)"/;
        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
            const match = script.innerHTML.match(channelIdRegex);
            if (match && match[1]) {
                return match[1];
            }
        }

        return null;
    }

    function findVideosShelf() {
        const allShelves = document.querySelectorAll('ytd-shelf-renderer');
        for (const shelf of allShelves) {
            const titleElement = shelf.querySelector('#title');
            if (titleElement) {
                const titleText = titleElement.textContent.trim().toLowerCase();
                if (titleText === 'videos' || titleText === 'uploads') {
                    return shelf;
                }
            }
        }
        return null;
    }

    function setPlaylistUrl(button, channelId, videosShelf) {
        const playlistId = 'UU' + channelId.substring(2);
        let playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;

        // const firstVideo = videosShelf.querySelector('ytd-grid-video-renderer a#thumbnail');
        // if (firstVideo && firstVideo.href) {
        //     try {
        //         const videoUrl = new URL(firstVideo.href);
        //         const videoId = videoUrl.searchParams.get('v');
        //         if (videoId) {
        //             playlistUrl = `https://www.youtube.com/watch?v=${videoId}&list=${playlistId}`;
        //         }
        //     } catch (e) {
        //         console.error("Watch All Extension: Could not parse video URL", e);
        //     }
        // }

        // if (!playlistUrl) {
        //     playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
        // }

        button.href = playlistUrl;
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }


    const BUTTON_ID = 'play-all-videos-button';

    function syncPlayAllButton() {
        const videosShelf = findVideosShelf();
        let button = document.getElementById(BUTTON_ID);

        if (!videosShelf) {
            if (button) button.remove();
            return;
        }

        const channelId = getChannelId();

        if (!channelId || !channelId.startsWith('UC')) {
            if (button) button.remove();
            return;
        }

        if (!button) {
            const shelfTitleH2 = videosShelf.querySelector('h2.style-scope.ytd-shelf-renderer');
            if (!shelfTitleH2) return;

            if (shelfTitleH2.querySelector(`#${BUTTON_ID}`)) return;

            button = document.createElement('a');
            button.id = BUTTON_ID;
            button.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading';
            setPlaylistUrl(button, channelId, videosShelf);
            button.style.alignSelf = 'center';

            const iconDiv = document.createElement('div');
            iconDiv.className = 'yt-spec-button-shape-next__icon';
            iconDiv.setAttribute('aria-hidden', 'true');
            iconDiv.style.width = '24px';
            iconDiv.style.height = '24px';
            iconDiv.style.fill = 'currentColor';
            iconDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="m7 4 12 8-12 8V4z"></path></svg>`;

            const textDiv = document.createElement('div');
            textDiv.className = 'yt-spec-button-shape-next__button-text-content';

            const textSpan = document.createElement('span');
            textSpan.className = 'yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap';
            textSpan.setAttribute('role', 'text');
            textSpan.textContent = 'Play all';
            textDiv.appendChild(textSpan);

            button.appendChild(iconDiv);
            button.appendChild(textDiv);

            shelfTitleH2.appendChild(button);
        }

        setPlaylistUrl(button, channelId, videosShelf);
    }

    const debouncedSync = debounce(syncPlayAllButton, 500);

    const observer = new MutationObserver(() => {
        debouncedSync();
    });

    const initObserver = () => {
        const targetNode = document.querySelector('ytd-page-manager') || document.body;
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });

        setTimeout(debouncedSync, 1000);
    };

    if (document.body) {
        initObserver();
    } else {
        document.addEventListener('DOMContentLoaded', initObserver);
    }

})();
