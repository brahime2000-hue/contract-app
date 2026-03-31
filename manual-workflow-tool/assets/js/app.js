const STORAGE_KEY = "kamili-workflow-desk";
const AUTH_STORAGE_KEY = "kamili-workflow-desk-auth";
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets.readonly",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/documents",
].join(" ");
const DEFAULT_START_ROW = 3;
const ROW_WINDOW_SIZE = 50;
const MAX_EMPTY_ROW_SCAN = 200;
const YOUTUBE_LINK_PREVIEW_LENGTH = 47;

const elements = {
  toggleSettings: document.getElementById("toggle-settings"),
  settingsPanel: document.getElementById("settings-panel"),
  sheetId: document.getElementById("sheet-id"),
  sheetGid: document.getElementById("sheet-gid"),
  startRow: document.getElementById("start-row"),
  driveFolderId: document.getElementById("drive-folder-id"),
  googleClientId: document.getElementById("google-client-id"),
  loadCurrentRow: document.getElementById("load-current-row"),
  currentTitle: document.getElementById("current-title"),
  copyLink: document.getElementById("copy-link"),
  youtubeLink: document.getElementById("youtube-link"),
  lastDocLink: document.getElementById("last-doc-link"),
  googleStatus: document.getElementById("google-status"),
  progressBadge: document.getElementById("progress-badge"),
  scriptContent: document.getElementById("script-content"),
  listingContent: document.getElementById("listing-content"),
  scriptCharCount: document.getElementById("script-char-count"),
  submitItem: document.getElementById("submit-item"),
  skipItem: document.getElementById("skip-item"),
  reloadCurrent: document.getElementById("reload-current"),
  appStatus: document.getElementById("app-status"),
  tabButtons: Array.from(document.querySelectorAll("[data-tab-target]")),
  tabPanels: Array.from(document.querySelectorAll("[data-tab-panel]")),
};

const state = {
  settings: {
    sheetId: "",
    gid: "",
    startRow: DEFAULT_START_ROW,
    folderId: "",
    clientId: "",
  },
  currentRow: null,
  currentItem: null,
  reachedEnd: false,
  activeTab: "script",
  showSettings: false,
  busy: false,
  lastCreatedDoc: null,
  sheetMeta: null,
  rowWindowCache: null,
  drafts: {
    workflowKey: "",
    row: null,
    script: "",
    listing: "",
  },
  auth: {
    token: "",
    expiresAt: 0,
    clientId: "",
  },
};

let gisReadyPromise = null;
let requestEmbedHeightSync = () => {};

bootstrap();

function bootstrap() {
  restoreState();
  restoreAuthState();
  hydrateForm();
  updateTabs();
  updateSettingsPanel();
  updateCurrentItem();
  updateGoogleStatus();
  updateProgressBadge();
  updateActionButtons();
  setStatus(
    state.currentRow
      ? `Resume is ready at row ${state.currentRow}. Load the row when you want to continue.`
      : "Fill in your Google IDs, then load the current row.",
    "neutral"
  );
  attachEvents();
  initEmbedHeightReporting();
}

function attachEvents() {
  elements.loadCurrentRow.addEventListener("click", handleLoadCurrentRow);
  elements.reloadCurrent.addEventListener("click", handleReloadCurrentRow);
  elements.submitItem.addEventListener("click", handleSubmit);
  elements.skipItem.addEventListener("click", handleSkip);
  elements.copyLink.addEventListener("click", handleCopyLink);
  elements.toggleSettings.addEventListener("click", handleToggleSettings);

  elements.scriptContent.addEventListener("input", persistDraftsFromEditors);
  elements.listingContent.addEventListener("input", persistDraftsFromEditors);
  elements.scriptContent.addEventListener("paste", handleEditorPaste);
  elements.listingContent.addEventListener("paste", handleEditorPaste);

  for (const input of [
    elements.sheetId,
    elements.sheetGid,
    elements.startRow,
    elements.driveFolderId,
    elements.googleClientId,
  ]) {
    input.addEventListener("input", handleSettingsInput);
  }

  for (const button of elements.tabButtons) {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tabTarget;
      persistState();
      updateTabs();
    });
  }
}

function restoreState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    const saved = JSON.parse(raw);
    const savedStartRow = Math.max(
      DEFAULT_START_ROW,
      normalizePositiveInteger(saved.settings?.startRow, DEFAULT_START_ROW)
    );

    state.settings = {
      sheetId: saved.settings?.sheetId || "",
      gid: saved.settings?.gid || "",
      startRow: savedStartRow,
      folderId: saved.settings?.folderId || "",
      clientId: saved.settings?.clientId || "",
    };
    state.currentRow = Number.isInteger(saved.currentRow)
      ? Math.max(DEFAULT_START_ROW, saved.currentRow)
      : null;
    state.reachedEnd = saved.reachedEnd === true;
    state.activeTab = saved.activeTab === "listing" ? "listing" : "script";
    state.showSettings = saved.showSettings === true;
    state.lastCreatedDoc =
      saved.lastCreatedDoc && saved.lastCreatedDoc.url
        ? {
            id: saved.lastCreatedDoc.id || "",
            name: saved.lastCreatedDoc.name || "Open last created Google Doc",
            url: saved.lastCreatedDoc.url,
          }
        : null;
    state.drafts = {
      workflowKey: saved.drafts?.workflowKey || "",
      row: Number.isInteger(saved.drafts?.row) ? saved.drafts.row : null,
      script: saved.drafts?.script || "",
      listing: saved.drafts?.listing || "",
    };
  } catch (error) {
    console.error("Could not restore workflow state:", error);
  }
}

function restoreAuthState() {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return;
    }

    const saved = JSON.parse(raw);
    const expiresAt = Number(saved?.expiresAt) || 0;
    const token = typeof saved?.token === "string" ? saved.token : "";
    const clientId = typeof saved?.clientId === "string" ? saved.clientId : "";

    if (!token || !clientId || expiresAt <= Date.now()) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    state.auth = {
      token,
      expiresAt,
      clientId,
    };
  } catch (error) {
    console.error("Could not restore workflow auth state:", error);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

function hydrateForm() {
  elements.sheetId.value = state.settings.sheetId;
  elements.sheetGid.value = state.settings.gid;
  elements.startRow.value = state.settings.startRow;
  elements.driveFolderId.value = state.settings.folderId;
  elements.googleClientId.value = state.settings.clientId;
  restoreDraftsForCurrentRow();
}

function persistState() {
  const payload = {
    settings: state.settings,
    currentRow: state.currentRow,
    reachedEnd: state.reachedEnd,
    activeTab: state.activeTab,
    showSettings: state.showSettings,
    lastCreatedDoc: state.lastCreatedDoc,
    drafts: state.drafts,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function persistAuthState() {
  const hasValidToken =
    Boolean(state.auth.token) &&
    Boolean(state.auth.clientId) &&
    Number(state.auth.expiresAt) > Date.now();

  if (!hasValidToken) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      token: state.auth.token,
      expiresAt: state.auth.expiresAt,
      clientId: state.auth.clientId,
    })
  );
}

function clearAuthState() {
  state.auth = {
    token: "",
    expiresAt: 0,
    clientId: "",
  };
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

function handleSettingsInput() {
  const previousClientId = state.settings.clientId;
  state.settings = collectSettings({ allowPartial: true });
  if (previousClientId && previousClientId !== state.settings.clientId) {
    clearAuthState();
  }
  persistState();
  updateProgressBadge();
  updateGoogleStatus();
}

function collectSettings({ allowPartial = false, requireFolderId = true } = {}) {
  const settings = {
    sheetId: elements.sheetId.value.trim(),
    gid: elements.sheetGid.value.trim(),
    startRow: Math.max(
      DEFAULT_START_ROW,
      normalizePositiveInteger(elements.startRow.value, DEFAULT_START_ROW)
    ),
    folderId: elements.driveFolderId.value.trim(),
    clientId: elements.googleClientId.value.trim(),
  };

  if (allowPartial) {
    return settings;
  }

  if (!settings.sheetId) {
    throw new Error("Enter the Google Sheet ID.");
  }

  if (!settings.gid || !/^\d+$/.test(settings.gid)) {
    throw new Error("Enter a numeric Sheet GID.");
  }

  if (requireFolderId && !settings.folderId) {
    throw new Error("Enter the Google Drive Folder ID.");
  }

  if (!settings.clientId) {
    throw new Error("Enter your Google OAuth Client ID.");
  }

  return settings;
}

function normalizePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function formatYoutubeLinkPreview(url) {
  if (!url) {
    return "YouTube";
  }

  if (url.length <= YOUTUBE_LINK_PREVIEW_LENGTH) {
    return url;
  }

  return `${url.slice(0, YOUTUBE_LINK_PREVIEW_LENGTH)}...`;
}

function getWorkflowKey(settings = state.settings) {
  return [settings.sheetId, settings.gid, settings.folderId].join("::");
}

function getSourceKey(settings = state.settings) {
  return [settings.sheetId, settings.gid].join("::");
}

function updateTabs() {
  for (const button of elements.tabButtons) {
    const isActive = button.dataset.tabTarget === state.activeTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  }

  for (const panel of elements.tabPanels) {
    const isActive = panel.dataset.tabPanel === state.activeTab;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  }
}

function updateSettingsPanel() {
  elements.settingsPanel.hidden = !state.showSettings;
  elements.settingsPanel.style.display = state.showSettings ? "" : "none";
  elements.toggleSettings.textContent = state.showSettings ? "Hide Settings Panel" : "Show Settings Panel";
  elements.toggleSettings.setAttribute("aria-expanded", String(state.showSettings));
  requestEmbedHeightSync();
}

function clearCopyLinkCopiedState() {
  elements.copyLink.classList.remove("is-copied");
  if (elements.copyLink._copiedTimer) {
    window.clearTimeout(elements.copyLink._copiedTimer);
    elements.copyLink._copiedTimer = 0;
  }
}

function handleToggleSettings() {
  state.showSettings = !state.showSettings;
  persistState();
  updateSettingsPanel();
}

function updateCurrentItem() {
  elements.currentTitle.textContent = state.currentItem?.title || (state.reachedEnd ? "No more rows" : "Waiting for row data");

  const youtubeUrl = toSafeUrl(state.currentItem?.youtubeLink);
  clearCopyLinkCopiedState();
  elements.copyLink.disabled = !youtubeUrl;
  if (youtubeUrl) {
    elements.youtubeLink.textContent = formatYoutubeLinkPreview(youtubeUrl);
    elements.youtubeLink.href = youtubeUrl;
    elements.youtubeLink.title = youtubeUrl;
    elements.youtubeLink.classList.remove("is-disabled");
  } else {
    elements.youtubeLink.textContent = "YouTube";
    elements.youtubeLink.href = "#";
    elements.youtubeLink.title = "No link loaded";
    elements.youtubeLink.classList.add("is-disabled");
  }

  if (state.lastCreatedDoc?.url) {
    elements.lastDocLink.hidden = false;
    elements.lastDocLink.href = state.lastCreatedDoc.url;
    elements.lastDocLink.textContent = `Open last created Google Doc: ${state.lastCreatedDoc.name}`;
  } else {
    elements.lastDocLink.hidden = true;
    elements.lastDocLink.removeAttribute("href");
    elements.lastDocLink.textContent = "Open last created Google Doc";
  }
}

function updateGoogleStatus() {
  const now = Date.now();
  const hasValidToken = state.auth.token && state.auth.expiresAt > now;

  if (!state.settings.clientId) {
    elements.googleStatus.textContent = "OAuth client ID required";
    elements.googleStatus.dataset.tone = "error";
    return;
  }

  if (hasValidToken && state.auth.clientId === state.settings.clientId) {
    elements.googleStatus.textContent = "Google connected";
    elements.googleStatus.dataset.tone = "success";
    return;
  }

  elements.googleStatus.textContent = "Google not connected";
  elements.googleStatus.dataset.tone = "neutral";
}

function updateProgressBadge() {
  if (Number.isInteger(state.currentRow)) {
    elements.progressBadge.textContent = `Current row ${state.currentRow}`;
    return;
  }

  const startRow = normalizePositiveInteger(elements.startRow.value, state.settings.startRow || DEFAULT_START_ROW);
  elements.progressBadge.textContent = `Start row ${startRow}`;
}

function updateActionButtons() {
  const hasLoadedRow = Number.isInteger(state.currentRow) && Boolean(state.currentItem);
  const hasScript = elements.scriptContent.value.trim().length > 0;
  const hasListing = elements.listingContent.value.trim().length > 0;
  const canSubmit = hasLoadedRow && hasScript && hasListing;

  elements.loadCurrentRow.disabled = state.busy;
  elements.reloadCurrent.disabled = state.busy;
  elements.submitItem.disabled = state.busy || !canSubmit;
  elements.skipItem.disabled = state.busy || !hasLoadedRow;
}

function formatCharacterCount(value) {
  const count = Array.from(value || "").length;
  return `${count.toLocaleString()} chars`;
}

function updateCharacterCounts() {
  if (elements.scriptCharCount) {
    elements.scriptCharCount.textContent = formatCharacterCount(elements.scriptContent.value);
  }
}

function setStatus(message, tone = "neutral") {
  elements.appStatus.textContent = message;
  elements.appStatus.dataset.tone = tone;
}

function notifyParent(type, payload = {}) {
  if (window.parent === window) {
    return;
  }

  window.parent.postMessage(
    {
      type,
      ...payload,
    },
    "*"
  );
}

function setBusy(nextBusy) {
  state.busy = nextBusy;
  updateActionButtons();
}

function persistDraftsFromEditors() {
  if (Number.isInteger(state.currentRow)) {
    state.drafts = {
      workflowKey: getWorkflowKey(),
      row: state.currentRow,
      script: elements.scriptContent.value,
      listing: elements.listingContent.value,
    };
    persistState();
  }

  updateCharacterCounts();
  updateActionButtons();
}

function restoreDraftsForCurrentRow() {
  const shouldRestore =
    Number.isInteger(state.currentRow) &&
    state.drafts.workflowKey === getWorkflowKey() &&
    state.drafts.row === state.currentRow;

  elements.scriptContent.value = shouldRestore ? state.drafts.script : "";
  elements.listingContent.value = shouldRestore ? state.drafts.listing : "";
  updateCharacterCounts();
  updateActionButtons();
}

function clearDrafts() {
  state.drafts = {
    workflowKey: "",
    row: null,
    script: "",
    listing: "",
  };
  persistState();
}

function clearEditors() {
  elements.scriptContent.value = "";
  elements.listingContent.value = "";
  updateCharacterCounts();
  updateActionButtons();
}

function handleEditorPaste(event) {
  const pastedText = event.clipboardData?.getData("text/plain");
  if (!pastedText) {
    return;
  }

  event.preventDefault();

  const textarea = event.currentTarget;
  const start = textarea.selectionStart ?? textarea.value.length;
  const end = textarea.selectionEnd ?? textarea.value.length;
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);
  const normalizedText = pastedText.replace(/\r\n/g, "\n").replace(/\n+$/g, "");
  const insertion = `${normalizedText}\n\n`;

  textarea.value = `${before}${insertion}${after}`;

  const nextCursorPosition = before.length + insertion.length;
  textarea.selectionStart = nextCursorPosition;
  textarea.selectionEnd = nextCursorPosition;
  textarea.scrollTop = textarea.scrollHeight;

  persistDraftsFromEditors();
}

async function handleLoadCurrentRow() {
  const previousSettings = { ...state.settings };
  const previousSourceKey = getSourceKey(previousSettings);

  try {
    setBusy(true);
    setStatus("Authorizing Google and loading the current row...");

    const nextSettings = collectSettings({ requireFolderId: false });
    const nextSourceKey = getSourceKey(nextSettings);
    const shouldResetRow =
      previousSourceKey !== nextSourceKey ||
      normalizePositiveInteger(previousSettings.startRow, nextSettings.startRow) !== nextSettings.startRow ||
      !Number.isInteger(state.currentRow);

    if (previousSourceKey !== nextSourceKey) {
      state.sheetMeta = null;
      state.rowWindowCache = null;
    }

    state.settings = nextSettings;
    state.reachedEnd = false;
    state.currentRow = shouldResetRow ? nextSettings.startRow : state.currentRow;
    persistState();
    updateGoogleStatus();
    updateProgressBadge();

    await loadRow(state.currentRow);
  } catch (error) {
    revealSettingsOnValidationError(error);
    setStatus(error.message, "error");
  } finally {
    setBusy(false);
  }
}

async function handleReloadCurrentRow() {
  const nextSettings = collectSettings({ requireFolderId: false });
  const restartRow = nextSettings.startRow;

  const confirmed = window.confirm(
    `Start again from row ${restartRow}? This will load that row from Google Sheets and clear the Reference Script + Prompt Tabs area.`
  );
  if (!confirmed) {
    return;
  }

  try {
    setBusy(true);
    setStatus(`Loading row ${restartRow} from Google Sheets...`);

    const workflowChanged = getSourceKey(state.settings) !== getSourceKey(nextSettings);
    state.settings = nextSettings;
    state.reachedEnd = false;

    if (workflowChanged) {
      state.sheetMeta = null;
      state.rowWindowCache = null;
    }

    state.currentRow = restartRow;

    persistState();
    updateGoogleStatus();
    updateProgressBadge();

    await loadRow(state.currentRow);
    notifyParent("workflow-row-load", {
      rowNumber: state.currentRow,
      title: state.currentItem?.title || ""
    });
  } catch (error) {
    revealSettingsOnValidationError(error);
    setStatus(error.message, "error");
  } finally {
    setBusy(false);
  }
}

async function handleSubmit() {
  if (!state.currentItem || !Number.isInteger(state.currentRow)) {
    setStatus("Load a row before submitting.", "error");
    return;
  }

  const script = elements.scriptContent.value.trim();
  const listing = elements.listingContent.value.trim();

  if (!script || !listing) {
    setStatus("Both SCRIPT and LISTING are required before submitting.", "error");
    updateActionButtons();
    return;
  }

  try {
    setBusy(true);
    const nextSettings = collectSettings();
    if (state.currentItem.sourceKey !== getSourceKey(nextSettings)) {
      throw new Error("Sheet settings changed after this row was loaded. Reload the row before submitting.");
    }

      state.settings = nextSettings;
      persistState();
      updateGoogleStatus();
      const docTitle = state.currentItem.title || `Row ${state.currentRow}`;

    setStatus(`Creating Google Doc "${docTitle}"...`);

    const documentInfo = await createGoogleDoc(state.settings.folderId, docTitle, {
      script,
      listing,
    });

    state.lastCreatedDoc = documentInfo;
    notifyParent("workflow-submit-success", {
      rowNumber: state.currentRow,
      title: docTitle,
      url: documentInfo?.url || "",
    });
    state.currentRow += 1;
    state.currentItem = null;
    state.reachedEnd = false;
    state.activeTab = "script";
    clearDrafts();
    clearEditors();
    persistState();
    updateTabs();
    updateCurrentItem();
    updateProgressBadge();

    try {
      await loadRow(state.currentRow);
      setStatus(`Created "${docTitle}" and loaded row ${state.currentRow}.`, "success");
    } catch (loadError) {
      setStatus(
        `The Google Doc was created, but loading row ${state.currentRow} failed: ${loadError.message}`,
        "error"
      );
    }
  } catch (error) {
    revealSettingsOnValidationError(error);
    setStatus(error.message, "error");
  } finally {
    updateCurrentItem();
    setBusy(false);
  }
}

async function handleSkip() {
  if (!Number.isInteger(state.currentRow)) {
    setStatus("Load a row before skipping.", "error");
    return;
  }

  const skippedRow = state.currentRow;

  try {
    setBusy(true);
    const nextSettings = collectSettings({ requireFolderId: false });
    if (state.currentItem?.sourceKey && state.currentItem.sourceKey !== getSourceKey(nextSettings)) {
      throw new Error("Sheet settings changed after this row was loaded. Reload the row before skipping.");
    }

    state.settings = nextSettings;
    state.currentRow += 1;
    state.currentItem = null;
    state.reachedEnd = false;
    clearDrafts();
    clearEditors();
    persistState();
    updateCurrentItem();
    updateProgressBadge();
    setStatus(`Skipped row ${skippedRow}. Loading row ${state.currentRow}...`);
    await loadRow(state.currentRow);
    if (!state.reachedEnd) {
      setStatus(`Skipped row ${skippedRow}. Row ${state.currentRow} is ready.`, "success");
    }
  } catch (error) {
    revealSettingsOnValidationError(error);
    setStatus(error.message, "error");
  } finally {
    setBusy(false);
  }
}

async function handleCopyLink() {
  const youtubeUrl = toSafeUrl(state.currentItem?.youtubeLink);
  if (!youtubeUrl) {
    setStatus("There is no link to copy yet.", "error");
    return;
  }

    try {
      await navigator.clipboard.writeText(youtubeUrl);
      elements.copyLink.classList.add("is-copied");
      setStatus("YouTube link copied.", "success");
    } catch (error) {
      setStatus("Clipboard access failed in this browser context.", "error");
    }
}

async function loadRow(rowNumber) {
  if (!Number.isInteger(rowNumber) || rowNumber < 1) {
    throw new Error("Current row is invalid. Check the Start Row value.");
  }

  const sheetMeta = await resolveSheetMeta();
  const currentItem = await findNextValidRow(sheetMeta, rowNumber);

  if (!currentItem) {
    state.currentRow = rowNumber;
    state.currentItem = null;
    state.reachedEnd = true;
    clearDrafts();
    clearEditors();
    persistState();
    updateCurrentItem();
    updateProgressBadge();
    updateActionButtons();
    setStatus(`You reached the end of the filled rows starting from row ${rowNumber}.`, "neutral");
    return;
  }

  state.currentRow = currentItem.rowNumber;
  state.currentItem = currentItem;
  state.reachedEnd = false;
  persistState();
  restoreDraftsForCurrentRow();
  updateCurrentItem();
  updateProgressBadge();
  updateActionButtons();

  const skippedLabel =
    currentItem.rowNumber === rowNumber
      ? ""
      : ` Ignored empty rows and jumped from ${rowNumber} to ${currentItem.rowNumber}.`;

  setStatus(
    `Row ${currentItem.rowNumber} is ready. Paste SCRIPT and LISTING, then submit.${skippedLabel}`,
    "success"
  );
}

function readCell(values, index) {
  return String(values[index] ?? "").trim();
}

function buildRange(sheetTitle, startRow, endRow = startRow) {
  const escapedTitle = sheetTitle.replace(/'/g, "''");
  return `'${escapedTitle}'!A${startRow}:I${endRow}`;
}

async function findNextValidRow(sheetMeta, startRow) {
  let rowNumber = startRow;
  const lastRowToCheck = startRow + MAX_EMPTY_ROW_SCAN - 1;

  while (rowNumber <= lastRowToCheck) {
    const rowWindow = await fetchRowWindow(sheetMeta.title, rowNumber);
    const windowEnd = Math.min(rowWindow.endRow, lastRowToCheck);

    for (let currentRow = rowNumber; currentRow <= windowEnd; currentRow += 1) {
      const values = getCachedRowValues(rowWindow, currentRow);
      const currentItem = mapRowToItem(values, currentRow);

      if (!isRowEffectivelyEmpty(currentItem)) {
        return currentItem;
      }
    }

    rowNumber = windowEnd + 1;
  }

  return null;
}

async function fetchRowWindow(sheetTitle, rowNumber) {
  const sourceKey = getSourceKey(state.settings);

  if (
    state.rowWindowCache &&
    state.rowWindowCache.sourceKey === sourceKey &&
    state.rowWindowCache.sheetTitle === sheetTitle &&
    rowNumber >= state.rowWindowCache.startRow &&
    rowNumber <= state.rowWindowCache.endRow
  ) {
    return state.rowWindowCache;
  }

  const startRow = rowNumber;
  const endRow = rowNumber + ROW_WINDOW_SIZE - 1;
  const range = buildRange(sheetTitle, startRow, endRow);
  const encodedSheetId = encodeURIComponent(state.settings.sheetId);
  const encodedRange = encodeURIComponent(range);
  const data = await googleFetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodedSheetId}/values/${encodedRange}`
  );

  state.rowWindowCache = {
    sourceKey,
    sheetTitle,
    startRow,
    endRow,
    rows: Array.isArray(data.values) ? data.values : [],
  };

  return state.rowWindowCache;
}

function getCachedRowValues(rowWindow, rowNumber) {
  const rowIndex = rowNumber - rowWindow.startRow;
  const rowValues = rowWindow.rows[rowIndex];
  return Array.isArray(rowValues) ? rowValues : [];
}

function mapRowToItem(values, rowNumber) {
  const currentItem = {
    rowNumber,
    num: readCell(values, 0),
    ref: readCell(values, 2),
    language: readCell(values, 3),
    youtubeLink: readCell(values, 8),
    sourceKey: getSourceKey(state.settings),
  };

  currentItem.title = [currentItem.num, currentItem.ref, currentItem.language]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (!currentItem.title) {
    currentItem.title = `Row ${rowNumber}`;
  }

  return currentItem;
}

function isRowEffectivelyEmpty(item) {
  return !item.num && !item.ref && !item.language && !item.youtubeLink;
}

async function resolveSheetMeta() {
  if (
    state.sheetMeta &&
    state.sheetMeta.sheetId === state.settings.sheetId &&
    state.sheetMeta.gid === state.settings.gid
  ) {
    return state.sheetMeta;
  }

  const encodedSheetId = encodeURIComponent(state.settings.sheetId);
  const data = await googleFetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodedSheetId}?fields=sheets.properties(sheetId,title)`
  );
  const targetGid = Number.parseInt(state.settings.gid, 10);
  const match = data.sheets?.find((sheet) => Number(sheet.properties?.sheetId) === targetGid);

  if (!match?.properties?.title) {
    throw new Error(`No sheet tab matched GID ${state.settings.gid}.`);
  }

  state.sheetMeta = {
    sheetId: state.settings.sheetId,
    gid: state.settings.gid,
    title: match.properties.title,
  };

  return state.sheetMeta;
}

function normalizeTabContent(content) {
  return String(content || "").replace(/\r\n/g, "\n").trim();
}

async function getDriveItemName(fileId) {
  const encodedFileId = encodeURIComponent(fileId);
  const item = await googleFetch(
    `https://www.googleapis.com/drive/v3/files/${encodedFileId}?fields=id,name&supportsAllDrives=true`
  );

  return item?.name?.trim() || "";
}

async function getDocumentTabs(documentId) {
  const encodedDocumentId = encodeURIComponent(documentId);
  const document = await googleFetch(
    `https://docs.googleapis.com/v1/documents/${encodedDocumentId}?includeTabsContent=true`
  );

  return Array.isArray(document.tabs) ? flattenTabs(document.tabs) : [];
}

function flattenTabs(tabs) {
  const allTabs = [];

  for (const tab of tabs) {
    allTabs.push(tab);

    if (Array.isArray(tab.childTabs) && tab.childTabs.length > 0) {
      allTabs.push(...flattenTabs(tab.childTabs));
    }
  }

  return allTabs;
}

async function createGoogleDoc(folderId, title, content) {
  const file = await googleFetch(
    "https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink&supportsAllDrives=true",
    {
      method: "POST",
      body: {
        name: title,
        mimeType: "application/vnd.google-apps.document",
        parents: [folderId],
      },
    }
  );

  const [folderNameResult, tabs] = await Promise.all([
    getDriveItemName(folderId).catch(() => ""),
    getDocumentTabs(file.id),
  ]);

  const firstTabId = tabs[0]?.tabProperties?.tabId || "";
  const listingTabTitle = folderNameResult || "LISTING";
  const requests = [];

  if (firstTabId) {
    requests.push({
      updateDocumentTabProperties: {
        tabProperties: {
          tabId: firstTabId,
          title: "SCRIPT",
        },
        fields: "title",
      },
    });
  }

  requests.push({
    addDocumentTab: {
      tabProperties: {
        title: listingTabTitle,
        index: 1,
      },
    },
  });

  const updateResponse = await googleFetch(`https://docs.googleapis.com/v1/documents/${file.id}:batchUpdate`, {
    method: "POST",
    body: {
      requests,
    },
  });

  const addTabReply = updateResponse?.replies?.find((reply) => reply.addDocumentTab);
  const listingTabId = addTabReply?.addDocumentTab?.tabProperties?.tabId || "";
  const scriptContent = normalizeTabContent(content.script);
  const listingContent = normalizeTabContent(content.listing);
  const insertRequests = [];

  if (scriptContent) {
    insertRequests.push({
      insertText: {
        location: firstTabId ? { index: 1, tabId: firstTabId } : { index: 1 },
        text: scriptContent,
      },
    });
  }

  if (listingContent) {
    insertRequests.push({
      insertText: {
        location: listingTabId ? { index: 1, tabId: listingTabId } : { index: 1 },
        text: listingContent,
      },
    });
  }

  if (insertRequests.length > 0) {
    await googleFetch(`https://docs.googleapis.com/v1/documents/${file.id}:batchUpdate`, {
      method: "POST",
      body: {
        requests: insertRequests,
      },
    });
  }

  return {
    id: file.id,
    name: file.name || title,
    url: file.webViewLink || `https://docs.google.com/document/d/${file.id}/edit`,
  };
}

async function googleFetch(url, options = {}, retry = true) {
  const token = await ensureAccessToken();
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  let body = options.body;
  if (body && !(body instanceof FormData) && typeof body !== "string") {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body,
  });

  if (response.status === 401 && retry) {
    clearAuthState();
    updateGoogleStatus();
    return googleFetch(url, options, false);
  }

  if (!response.ok) {
    throw new Error(await extractGoogleError(response));
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

async function ensureAccessToken() {
  const settings = collectSettings({ requireFolderId: false });

  if (state.auth.token && state.auth.expiresAt > Date.now() && state.auth.clientId === settings.clientId) {
    return state.auth.token;
  }

  await waitForGoogleIdentity();

  return new Promise((resolve, reject) => {
    const requestToken = (promptValue) => {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: settings.clientId,
        scope: GOOGLE_SCOPES,
        prompt: promptValue,
        callback: (response) => {
          if (response.error) {
            if (promptValue === "" && shouldRetryWithConsent(response.error)) {
              requestToken("consent");
              return;
            }

            reject(new Error(response.error_description || response.error));
            return;
          }

          state.auth = {
            token: response.access_token,
            expiresAt: Date.now() + Math.max((response.expires_in || 3600) - 60, 60) * 1000,
            clientId: settings.clientId,
          };
          persistAuthState();
          updateGoogleStatus();
          resolve(response.access_token);
        },
      });

      tokenClient.requestAccessToken();
    };

    requestToken("");
  });
}

function waitForGoogleIdentity() {
  if (window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }

  if (!gisReadyPromise) {
    gisReadyPromise = new Promise((resolve, reject) => {
      const timeoutAt = Date.now() + 12000;

      const check = () => {
        if (window.google?.accounts?.oauth2) {
          resolve();
          return;
        }

        if (Date.now() > timeoutAt) {
          reject(new Error("Google Identity Services could not be loaded."));
          return;
        }

        window.setTimeout(check, 100);
      };

      check();
    });
  }

  return gisReadyPromise;
}

async function extractGoogleError(response) {
  try {
    const payload = await response.json();
    return (
      payload.error?.message ||
      payload.error_description ||
      response.statusText ||
      "Google API request failed."
    );
  } catch (error) {
    return response.statusText || "Google API request failed.";
  }
}

function toSafeUrl(value) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);
    return /^https?:$/i.test(url.protocol) ? url.toString() : "";
  } catch (error) {
    return "";
  }
}

function shouldRetryWithConsent(errorCode) {
  return [
    "interaction_required",
    "consent_required",
    "login_required",
    "access_denied",
  ].includes(errorCode);
}

function revealSettingsOnValidationError(error) {
  if (!error?.message?.startsWith("Enter ")) {
    return;
  }

  state.showSettings = true;
  persistState();
  updateSettingsPanel();
}

function initEmbedHeightReporting() {
  if (window.parent === window) {
    return;
  }

  const embedRoot = document.querySelector(".workflow-embed");

  const reportHeight = () => {
    const height = Math.max(
      Math.ceil(embedRoot?.scrollHeight || 0),
      Math.ceil(embedRoot?.offsetHeight || 0),
      Math.ceil(document.body?.scrollHeight || 0)
    );

    window.parent.postMessage(
      {
        type: "workflow-embed-height",
        height,
      },
      "*"
    );
  };

  const scheduleHeightReport = () => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(reportHeight);
    });
  };

  requestEmbedHeightSync = scheduleHeightReport;

  window.addEventListener("load", scheduleHeightReport);
  window.addEventListener("resize", scheduleHeightReport);

  if (window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(scheduleHeightReport);
    resizeObserver.observe(document.documentElement);
    if (document.body) {
      resizeObserver.observe(document.body);
    }
  }

  scheduleHeightReport();
}
