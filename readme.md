# Fullstack Todo App & System Design Project

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

_A modern fullstack application with comprehensive system design documentation_

</div>

---

## Table of Contents

- [Overview](#overview)
- [Assignment](#assignment)
- [Part 1: Todo Application](#part-1-todo-application)
  - [Features & Technologies](#features--technologies)
  - [Quick Start](#quick-start)
  - [Testing](#testing)
  - [Development](#development)
  - [Backend Architecture](#backend-architecture)
  - [Frontend Architecture](#frontend-architecture)
- [Part 2: System Design](#part-2-system-design)
- [Future Improvements](#future-improvements)

---

## Overview

This repository showcases two complementary aspects of modern software development:

> **🎯 Part 1:** A production-ready fullstack Todo application demonstrating best practices in TypeScript, React, and Express.js
>
> **🏛️ Part 2:** Comprehensive system design documentation for a Live Shopping feature, showcasing architectural thinking and scalability considerations

_This project was developed with AI assistance under careful direction, supervision, and full understanding of the implementation._

---

## Assignment

📄 **Assignment Details:** [`assignment.md`](assignment.md)

---

## Part 1: Todo Application

A modern, type-safe fullstack todo application built with industry best practices.

### Features & Technologies

<table>
<tr>
<td width="50%">

**🔧 Core Technologies**

- 📘 **Strict TypeScript** - Type safety throughout
- ⚡ **Express.js** - Robust backend framework
- ⚛️ **React** - Modern frontend library
- 📦 **pnpm** - Fast, efficient package manager

</td>
<td width="50%">

**🛡️ Code Quality**

- 🔍 **ESLint** - Code linting and standards
- 💅 **Prettier** - Consistent code formatting
- 🧪 **Vitest** - Fast unit testing
- 📚 **OpenAPI** - Auto-generated documentation

</td>
</tr>
</table>

### Quick Start

#### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd terrific

# 2. Install backend dependencies
cd "fullstack todo app/backend"
pnpm install

# 3. Install frontend dependencies
cd "../frontend"
pnpm install
```

#### Running the Application

**Backend Server:**

```bash
cd "fullstack todo app/backend"
pnpm dev
```

🌐 **API Documentation:** `http://localhost:8080/`

**Frontend Development Server:**

```bash
cd "fullstack todo app/frontend"
pnpm dev
```

🎨 **Application:** `http://localhost:3000`

### Testing

<div align="left">

| Test Type               | Command          | Description                                                                                                              |
| ----------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 🧪 **Unit Tests**       | `pnpm test`      | Run comprehensive test suites                                                                                            |
| 🔌 **API Tests**        | Multiple formats | cURL, HTTPie, Insomnia, VSCode REST [`fullstack todo app/backend/api-tests/`](fullstack%20todo%20app/backend/api-tests/) |
| 🎯 **Vitest Extension** | IDE Integration  | Real-time test execution                                                                                                 |

</div>

### Development

> 💡 **Pro Tip:** Install recommended VSCode extensions for the best development experience

### Backend Architecture

Built on the robust [Express TypeScript Boilerplate by GeekyAnts](https://github.com/GeekyAnts/express-typescript)

#### Architecture Highlights

**🎯 Modular Design**

- 🛣️ **Routes** - API endpoint definitions
- 🎮 **Controllers** - Request/response handling
- ⚙️ **Services** - Business logic layer
- 🗄️ **Repositories** - Data access layer

**🛡️ Built-in Middleware**

- 📝 Request logging
- ❌ Error handling
- 🚦 Rate limiting

**📚 Documentation**

- 🔄 Auto-generated OpenAPI specs
- 🧪 Interactive API testing
- 📖 Comprehensive endpoint documentation

📋 **Todo API Documentation:** [`todos.md`](fullstack%20todo%20app/todos.md)

### Frontend Architecture

#### Technology Choices

**🏗️ Build Tool (rspack)**

- ⚡ Lightning-fast build speeds
- 🌟 Excellent community support
- 🔧 Comprehensive capabilities

**⚛️ Framework (React)**

- 🌍 Widespread adoption
- 🏗️ Rich ecosystem
- 👥 Developer familiarity

**💅 Styling (styled-jsx)**

- 🎯 Component-scoped styling
- 🤖 AI-recommended approach
- 🔧 Rsbuild integration

---

### Future Improvements

#### 🌐 **Deployment & Infrastructure**

- ☁️ **Cloudflare Deployment** - Migrate to serverless architecture
- 🔄 **Framework Migration** - Consider Hono.js for serverless compatibility
- 👤 **User Authentication** - Implement sign-in and user-specific data

#### 🏗️ **Development Experience**

- 📦 **Monorepo Structure** - Explore Turborepo or Nx
- 🧪 **E2E Testing** - Implement Playwright or Cypress
- 🔄 **CI/CD Pipeline** - GitHub Actions integration

#### 🎯 **API Enhancements**

- 📊 **Performance Monitoring**
- 🔒 **Enhanced Security**
- 📈 **Analytics Integration**

---

<div align="center">

**Built with ❤️ using modern web technologies**

_TypeScript • React • Express.js • OpenAPI • Vitest_

</div>

## Part 2: System Design

### Live Shopping Architecture

Comprehensive system design for a scalable Live Shopping feature.

📐 **Design Document:** [`Live Shopping Architecture`](system%20design%20and%20architecture/live_shopping_architecture.md)

> 🤖 **AI-Generated & Reviewed:** This document provides a solid foundation for implementing a production-ready Live Shopping system.
