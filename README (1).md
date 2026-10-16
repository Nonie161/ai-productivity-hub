# AI Workplace Productivity Assistant

A modern, responsive SaaS-style web application designed to help professionals work more efficiently with AI-powered workplace tools. The interface features a soft pink, elegant gold, and warm white color palette, with a dashboard layout and sidebar navigation.

## Project Overview

The **AI Workplace Productivity Assistant** brings common workplace tasks into one interface. Users can draft professional emails, summarize research material, and interact with a workplace chatbot.

The project is designed as a **frontend-first application without a custom backend or database**. Real AI responses require a configured AI provider or supported integration. If no provider is configured, the application should clearly identify any demo responses rather than presenting them as genuine AI-generated content.

## Features

### 1. Smart Email Generator
- Generate email drafts from user-provided instructions and context.
- Choose between **Formal**, **Friendly**, and **Persuasive** tones.
- Edit the generated subject and email body.
- Copy or regenerate drafts.

### 2. AI Research Assistant
- Summarize pasted text and article content.
- Produce key insights, findings, and actionable recommendations.
- Accept website URLs where supported.
- Explain when a website cannot be accessed and allow users to paste the relevant text instead.

### 3. AI Workplace Chatbot
- Interactive chat interface for workplace questions and tasks.
- Help with brainstorming, problem-solving, and drafting content.
- Generate responses based on the user's prompt and context.

### 4. Dashboard and User Experience
- Responsive dashboard with sidebar navigation.
- Modern SaaS-inspired cards, forms, and editable results.
- Blush pink, gold, warm white, and charcoal visual theme.
- Copy, edit, and regenerate actions where applicable.
- Loading, empty, and error states.

### 5. Responsible AI
- Display a disclaimer that AI responses may contain errors.
- Encourage users to review generated content before using it professionally.
- Do not represent simulated demo output as genuine AI-generated content.

> **Implementation note:** The features above describe the intended project scope. Confirm each feature against the current application before claiming it is fully implemented.

## Technologies and Tools

The exact stack depends on the options selected when generating the project in Lovable. A typical implementation may use:

- **Lovable** — AI-assisted application development.
- **React** — component-based user interface.
- **TypeScript** — typed JavaScript, if enabled in the generated project.
- **Vite** — development server and build tooling, if included.
- **Tailwind CSS** — utility-first styling, if included.
- **Lucide** — icons, if included.
- **Browser storage** — optional local history without a database.
- **AI provider or supported integration** — required for genuine AI responses.

Check the project's `package.json` and source files to confirm which technologies are actually installed. No custom backend or database is required for the frontend-only version.

## Setup Instructions

### Prerequisites

- A modern web browser.
- [Node.js](https://nodejs.org/) and npm, if running the project locally.
- The generated project source code downloaded or exported from Lovable.

### 1. Get the project

Create the app in [Lovable](https://lovable.dev/), then export or sync the generated source code to your computer or GitHub repository.

### 2. Open the project folder

Open a terminal in the folder containing `package.json`.

### 3. Install dependencies

```bash
npm install
```

### 4. Configure AI access (if needed)

For real AI responses, configure an AI provider or integration supported by your project. Follow that provider's setup instructions and use a secure server-side proxy or managed integration for secret API keys.

**Do not put private API keys in frontend source code or commit them to GitHub.** If no AI integration is configured, use a clearly labeled demo mode.

### 5. Start the development server

For a typical Vite-based project:

```bash
npm run dev
```

Open the local URL printed in the terminal. The exact command may vary depending on the generated project's `package.json`.

### 6. Create a production build

For a project that defines the standard Vite build script:

```bash
npm run build
```

Use the scripts listed in `package.json` if they differ from these examples.

## Usage

1. Open the application dashboard.
2. Select **Email Generator**, **Research Assistant**, or **AI Chatbot** from the sidebar.
3. Enter your instructions, context, or research text.
4. Choose the relevant options, such as email tone.
5. Review and edit the result before copying or using it.
6. Verify important facts and recommendations independently.

## Responsible AI Disclaimer

AI-generated content can be inaccurate, incomplete, or out of date. Review all output before sending emails, making business decisions, or sharing research. Do not submit confidential, sensitive, or personal information unless the configured AI provider and your organization's policies permit it.

## Contributing

Contributions and suggestions are welcome:

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Submit a pull request describing the changes.

## License

No license has been specified yet. Add a `LICENSE` file before distributing or reusing this project if you want to define the terms under which others may use it.
