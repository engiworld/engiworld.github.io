const english = {
  title: "Request cloud images",
  intro: "Request an EngiWorld environment image on Volcengine or Alibaba Cloud. The project team reviews applications for academic research.",
  provider: "Cloud provider", volcengine: "Volcengine", aliyun: "Alibaba Cloud",
  account: "Receiving cloud account ID", accountHint: "Use the numeric Volcengine main account ID or Alibaba Cloud account UID. Never enter passwords or access keys.",
  environments: "Images or software needed", purpose: "Specific academic use", purposeHint: "Describe the research question, experiment or work you intend to reproduce.",
  email: "Contact email", affiliation: "University or research institution (optional)",
  pledge: "I confirm that the images will be used solely for the academic research described here, with no commercial use.",
  submit: "Submit online", emailButton: "Apply by email", mailTitle: "Email your request", mailIntro: "Send this request to the project mailbox below.",
  mailDraft: "Request text", send: "Open email to send", copy: "Copy request text", sendAndPaste: "Open email and paste the request",
  working: "Submitting…", received: "Request received. Application ID", incomplete: "Check the account ID, academic use and contact email.",
  fallback: "Online submission could not be confirmed. Send the prepared request by email.",
  copied: "Request text copied.", selected: "Request text selected. Copy it to your email.",
};
const chinese = {
  sendAndPaste: "打开邮箱并粘贴申请内容",
  working: "正在提交…", received: "申请已提交，编号", incomplete: "请检查账号 ID、学术用途和联系邮箱。",
  fallback: "在线提交未能确认，请发送下方的申请邮件。",
  copied: "已复制申请内容。", selected: "已选中申请内容，可复制到邮件中。",
};
const nodes = [...document.querySelectorAll("[data-text]")];
const originalChinese = Object.fromEntries(nodes.map(node => [node.dataset.text, node.textContent]));
const dictionary = { zh: { ...originalChinese, ...chinese }, en: english };
const form = document.getElementById("application");
const languageButton = document.getElementById("switch-language");
const submitButton = document.getElementById("submit");
const prepareEmail = document.getElementById("prepare-email");
const submitStatus = document.getElementById("submit-status");
const mailPanel = document.getElementById("mail");
const draft = document.getElementById("email-draft");
const send = document.getElementById("open-email");
const copyStatus = document.getElementById("copy-status");
const mailbox = document.getElementById("recipient").textContent.trim();

let language = "zh";
let lastStatus = "";
let submitted = "";
let requestId;
let previousDetails;
let emailDetails;
let submitting = false;

function renderStatus() {
  const text = dictionary[language];
  submitStatus.textContent = lastStatus ? text[lastStatus] : "";
  if (submitted) submitStatus.textContent += " " + submitted;
}

function setLanguage(next) {
  language = next;
  const text = dictionary[language];
  for (const node of nodes) node.textContent = text[node.dataset.text];
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  languageButton.textContent = language === "zh" ? "English" : "中文";
  languageButton.lang = language === "zh" ? "en" : "zh-CN";
  document.title = text.title + " · EngiWorld";
  renderStatus();
  if (emailDetails) renderEmail(emailDetails);
}

function getDetails() {
  if (!form.reportValidity()) return null;
  const fields = new FormData(form);
  const details = Object.fromEntries(Array.from(fields, ([name, value]) => [name, value.trim()]));
  if (!details.purpose || !details.environments || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(details.email)) {
    lastStatus = "incomplete";
    renderStatus();
    return null;
  }
  const fingerprint = JSON.stringify(details);
  if (fingerprint !== previousDetails || !requestId) {
    requestId = crypto.randomUUID();
    previousDetails = fingerprint;
  }
  return { ...details, id: requestId };
}

function renderEmail(details, scroll = false) {
  const text = dictionary[language];
  const subject = "[EngiWorld] Cloud image request";
  const referenceLabel = language === "zh" ? "申请编号" : "Application ID";
  const entries = [
    [text.provider, text[details.provider]],
    [text.account, details.account],
    [text.environments, details.environments],
    [text.purpose, details.purpose],
    [text.email, details.email],
    [text.affiliation, details.affiliation],
    [referenceLabel, details.id],
  ];
  const body = [subject, ...entries.filter(([, value]) => value).map(([label, value]) => `${label}\n${value}`), text.pledge].join("\n\n");
  draft.value = body;
  const base = `mailto:${mailbox}?subject=${encodeURIComponent(subject)}`;
  const address = base + "&body=" + encodeURIComponent(body);
  const canPrefill = address.length < 1900;
  send.href = canPrefill ? address : base;
  send.textContent = canPrefill ? text.send : text.sendAndPaste;
  mailPanel.hidden = false;
  copyStatus.textContent = "";
  if (scroll) mailPanel.scrollIntoView({ block: "start" });
}

form.addEventListener("input", () => {
  if (emailDetails) {
    emailDetails = null;
    mailPanel.hidden = true;
  }
  if (!submitting && !submitted) {
    lastStatus = "";
    renderStatus();
  }
});

prepareEmail.addEventListener("click", () => {
  const details = getDetails();
  if (details) {
    emailDetails = details;
    renderEmail(details, true);
  }
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (submitting || submitted) return;
  const details = getDetails();
  if (!details) return;
  submitting = true;
  lastStatus = "working";
  renderStatus();
  const controls = Array.from(form.elements);
  controls.forEach(node => { node.disabled = true; });
  try {
    const response = await fetch(form.action, {
      method: "POST", credentials: "omit", redirect: "error",
      body: new URLSearchParams({ ...details, lang: language }),
      signal: AbortSignal.timeout(6500),
    });
    if (response.status === 422) {
      lastStatus = "incomplete";
      return;
    }
    if (response.status === 409) requestId = undefined;
    if (response.status !== 201) throw new Error("Submission not confirmed");
    const result = await response.json();
    if (result.reference !== details.id) throw new Error("Submission receipt missing");
    lastStatus = "received";
    submitted = result.reference;
    emailDetails = null;
    mailPanel.hidden = true;
  } catch {
    lastStatus = "fallback";
    emailDetails = details;
    renderEmail(details, true);
  } finally {
    submitting = false;
    controls.forEach(node => { node.disabled = Boolean(submitted); });
    renderStatus();
  }
});

document.getElementById("copy-email").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(draft.value);
    copyStatus.textContent = dictionary[language].copied;
  } catch {
    draft.focus();
    draft.select();
    copyStatus.textContent = dictionary[language].selected;
  }
});

languageButton.addEventListener("click", () => setLanguage(language === "zh" ? "en" : "zh"));
const preferredLanguage = new URLSearchParams(location.search).get("lang");
setLanguage(preferredLanguage === "en" || (!preferredLanguage && !navigator.language.startsWith("zh")) ? "en" : "zh");
languageButton.hidden = false;
submitButton.disabled = false;
prepareEmail.disabled = false;
