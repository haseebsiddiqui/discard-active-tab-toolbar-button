function switchToTab(someTabId) {
    try {
        chrome.tabs.update(someTabId, { "active": true });
    } catch (e) {
        console.log(`Error changing tab to ID ${someTabId}: ${e}`);
    }
}

function discardTab(someTabId) {
    try {
        chrome.tabs.discard(someTabId);
    } catch (e) {
        console.log(`Error discarding tab with ID ${someTabId}: ${e}`);
    }
}

function findPrevOrNextTab(currentId, nonDiscardedTabs) {
    let currentTabIndex = -1;

    // Get the current tab's index
    for (let i = 0; i < nonDiscardedTabs.length; i++) {
        if (nonDiscardedTabs[i] != undefined && nonDiscardedTabs[i].id === currentId) {
            currentTabIndex = i;
            break;
        }
    }

    // Go backward and check previous tabs
    for (let i = currentTabIndex; i >= 0; i--) {
        if (nonDiscardedTabs[i] != undefined && nonDiscardedTabs[i].id !== currentId) {
            return nonDiscardedTabs[i].id;
        }
    }

    // Couldn't find a tab going backward so go forward instead
    for (let i = currentTabIndex; i < nonDiscardedTabs.length; i++) {
        if (nonDiscardedTabs[i] != undefined && nonDiscardedTabs[i].id !== currentId) {
            return nonDiscardedTabs[i].id;
        }
    }

    // Couldn't find a tab to switch to
    return -1;
}

function discardActiveTab() {
    var nonDiscardedTabs = null;

    // Get the non discarded tabs in the current window
    chrome.tabs.query({ discarded: false, currentWindow: true }, function (tabs) {
        nonDiscardedTabs = tabs;
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];

        if (!currentTab) {
            return;
        }

        const currentTabId = currentTab.id;
        const foundId = findPrevOrNextTab(currentTabId, nonDiscardedTabs);

        if (foundId !== -1) {
            // It's not possible to discard the active tab
            // so switch to a different non-discarded tab and
            // then discard the previous tab
            switchToTab(foundId);
            discardTab(currentTabId);
        }
    });
}

browser.browserAction.onClicked.addListener(discardActiveTab);
