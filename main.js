function discardActiveTab() {
    var nonDiscardedTabs = null;

    // Get the non discarded tabs in the current window
    chrome.tabs.query({ discarded: false, currentWindow: true }, function (tabs) {
        nonDiscardedTabs = tabs;
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];

        if (currentTab) {
            const currentTabId = currentTab.id;
            let smallestDiff = Number.MAX_SAFE_INTEGER;
            let closestId = -1;

            for (const tab of nonDiscardedTabs) {
                if (tab.id == currentTabId) {
                    continue;
                }

                const diff = Math.abs(currentTabId - tab.id);

                if (diff < smallestDiff) {
                    smallestDiff = diff;
                    closestId = tab.id;
                }
            }

            // It's not possible to discard the active tab
            // so switch to a different non-discarded tab and
            // then discard the previous tab

            // If no tab was found don't try switching/discarding the tab
            if (closestId == -1) {
                return;
            }

            // Switch tab
            try {
                chrome.tabs.update(closestId, { "active": true });
            } catch (e) {
                console.log(`Error changing tab to ID ${closestId}: ${e}`);
            }

            // Discard tab
            try {
                chrome.tabs.discard(currentTabId);
            } catch (e) {
                console.log(`Error discarding tab with ID ${currentTabId}: ${e}`);
            }
        }
    });
}

browser.browserAction.onClicked.addListener(discardActiveTab);
