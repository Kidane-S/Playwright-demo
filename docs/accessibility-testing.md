# Accessibility testing

Run the automated Axe accessibility checks for all site pages with:

```sh
npm run test:a11y
```

The checks scan Home, About, Dashboard, Contact, and Snake in both dark and
light themes against axe-core's WCAG 2.0, 2.1, and 2.2 A/AA rules. They are
also part of the full Playwright suite run by GitHub Actions before deployment.

Automated checks help identify common accessibility issues, but do not replace
manual keyboard, screen-reader, or usability testing.
