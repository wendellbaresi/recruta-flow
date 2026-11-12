var VIPS = [
  "SEU_EMAIL_AQUI@gmail.com"
];

function checkAccess() {
  var email = Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail();
  return email && VIPS.indexOf(email.toLowerCase()) !== -1;
}

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Recruta Flow R&S Inteligente - OneCode')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}