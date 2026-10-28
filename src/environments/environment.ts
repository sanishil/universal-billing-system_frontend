export const environment = {
  production: false,
  // Backend runs on port 8080 of whichever host serves the app (localhost or a LAN IP),
  // so the URL no longer needs editing when the machine's IP changes.
  apiUrl: `${window.location.protocol}//${window.location.hostname}:8080/api`,
  recaptchaSiteKey: '6LciLuAtAAAAAPiWE_9oWdA-WMnnkjpjHBTPcR_S'
};
  