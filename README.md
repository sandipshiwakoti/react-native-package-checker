<div align="center">
  <img src="public/logo.svg" alt="React Native Package Checker Logo" width="200" style="margin-bottom: 0;"/>
  <div style="font-family: 'Inter', sans-serif; margin-top: 0;">
    <h1><strong>React Native Package Checker</strong></h1>
    <p>Check your React Native packages for New Architecture compatibility in seconds ⚡️</p>
  </div>

<p align="center">
    <a href="https://github.com/sandipshiwakoti/react-native-package-checker/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/sandipshiwakoti/react-native-package-checker" alt="License" />
    </a>
    <a href="https://github.com/sandipshiwakoti/react-native-package-checker/stargazers">
      <img src="https://img.shields.io/github/stars/sandipshiwakoti/react-native-package-checker" alt="GitHub Stars" />
    </a>
    <a href="https://react-native-package-checker.vercel.app">
      <img src="https://img.shields.io/badge/view-live%20demo-blue" alt="Live Demo" />
    </a>
  </p>
</div>

![Demo](./docs/assets/demo.gif)

## Features

- 📦 **Upload & Analyze**: Drop your package.json and get instant compatibility analysis
- 🔍 **Bulk Package Checking**: Check multiple packages simultaneously for New Architecture compatibility
- 📊 **Comprehensive Analysis**: View package details such as maintenance, platforms, TypeScript, quality score, GitHub stats, alternatives & more
- 🔎 **Quick Search & Filters**: Easily find and filter packages based on various criteria
- 💾 **Export & Share**: Download analysis in PDF/Excel to share with your team

## Getting Started

Visit [react-native-package-checker.vercel.app](https://react-native-package-checker.vercel.app) to use the website directly.

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/sandipshiwakoti/react-native-package-checker.git
cd react-native-package-checker
```

````

2. Install dependencies:
```bash
bun install
````

3. Start the development server:

```bash
bun dev
```

4. Open http://localhost:3000 in your browser.

## FAQ

### 1. Why was this website created?

The React Native Directory website doesn't support checking multiple packages simultaneously for New Architecture compatibility. This website fills that gap by allowing developers to check their entire package.json dependencies at once, saving time during migration planning.

### 2. How accurate is the data?

All package information is sourced from the [React Native Directory](https://reactnative.directory), the official package database maintained by the React Native team. We're grateful for their work in maintaining this valuable resource. The data is as accurate as the directory's latest updates.

## Tech Stack

<p align="center">
  <a href="https://nextjs.org">
    <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  </a>
  <a href="https://www.radix-ui.com">
    <img src="https://img.shields.io/badge/Radix_UI-black?style=for-the-badge&logo=radixui&logoColor=white" alt="Radix UI" />
  </a>
  <a href="https://ui.shadcn.com">
    <img src="https://img.shields.io/badge/shadcn/ui-black?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
  </a>
  <a href="https://tailwindcss.com">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  </a>
  <a href="https://tanstack.com/query">
    <img src="https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white" alt="React Query" />
  </a>
  <a href="https://www.typescriptlang.org">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="https://bun.sh">
    <img src="https://img.shields.io/badge/Bun-black?style=for-the-badge&logo=bun&logoColor=white" alt="Bun" />
  </a>
   <a href="https://playwright.dev">
    <img src="https://img.shields.io/badge/-playwright-%232EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
  </a>
  <a href="https://sentry.io">
    <img src="https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white" alt="Sentry" />
  </a>
</p>

## Alternative Tools

While React Native Package Checker provides instant web-based bulk package analysis with visual reporting and sharing capabilities, here are other useful tools in the ecosystem:

**[Expo Doctor](https://docs.expo.dev/workflow/doctor/)**

✓ Built-in package compatibility checker

✗ Limited to Expo projects

✗ Requires local installation and setup

✗ CLI-only interface, no visual feedback

**[React Native Directory](https://reactnative.directory)**

✓ Official directory maintained by the React Native team

✗ Requires checking packages individually

✗ Manual tracking needed for multiple packages

✗ No export or sharing capabilities

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](.github/CONTRIBUTING.md) for details on how to submit pull requests, report issues, and contribute to the project.

For major changes, please open an issue first to discuss what you would like to change.

## Support

If you find this project helpful, please consider:

- ⭐️ [Starring the repository](https://github.com/sandipshiwakoti/react-native-package-checker/stargazers)
- 🐛 [Reporting bugs](https://github.com/sandipshiwakoti/react-native-package-checker/issues/new?labels=bug&template=bug_report.md)
- 💡 [Suggesting new features](https://github.com/sandipshiwakoti/react-native-package-checker/issues/new?labels=enhancement&template=feature_request.md)
- 🔄 [Sharing with the React Native community](https://twitter.com/intent/tweet?text=🚀%20Discovered%20a%20great%20tool!%20React%20Native%20Package%20Checker%20helps%20verify%20New%20Architecture%20compatibility%20for%20all%20your%20packages%20in%20seconds%20⚡️%20Try%20it%20out:%20https://react-native-package-checker.vercel.app)

## License

This project is licensed under the [MIT License](https://github.com/sandipshiwakoti/react-native-package-checker/blob/main/LICENSE).
