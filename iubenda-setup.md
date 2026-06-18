# Predisposizione Iubenda per BeOx

Il sito e predisposto per collegare Iubenda, ma manca il codice ufficiale generato dall'account BeOx.

## Cosa e gia pronto

- Link a Privacy Policy e Cookie Policy nel footer di tutte le pagine.
- Pagina `privacy.html` con bozza operativa da validare o sostituire con policy Iubenda.
- Pagina `cookie-policy.html` con bozza operativa da validare o sostituire con policy Iubenda.
- Link "Preferenze cookie" nel footer, gia collegato a `data-iubenda-preferences`.
- Checkbox privacy obbligatoria nel modulo contatti.
- Checkbox privacy obbligatoria nell'AI Team Check.
- Checkbox newsletter e marketing separate e facoltative.

## Cosa serve dall'account Iubenda

1. Creare il sito BeOx in Iubenda.
2. Generare Privacy Policy e Cookie Policy.
3. Attivare Cookie Solution / Consent Solution.
4. Copiare lo script Iubenda ufficiale in tutte le pagine HTML, preferibilmente prima di `</head>`.
5. Configurare i servizi realmente usati: Google Analytics, Google Ads, Meta Pixel, LinkedIn Insight Tag, CRM, form, newsletter, hosting, email provider.
6. Bloccare preventivamente gli script marketing/analytics finche l'utente non presta consenso.

## Punto tecnico gia previsto

Il link con attributo `data-iubenda-preferences` prova ad aprire:

```js
window._iub.cs.api.openPreferences()
```

Quando lo script Iubenda sara attivo, il pannello preferenze cookie si aprira direttamente dal footer.
