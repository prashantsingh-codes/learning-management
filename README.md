<div align="center">

# 🎓 LearnSphere — Cloud-Native Learning Management System

An enterprise-grade, serverless Learning Management System (LMS) built with **Next.js 16**, **React 19**, **AWS Serverless Architecture (Lambda, DynamoDB, S3, CloudFront)**, **Stripe Payments**, and **Clerk Authentication**.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![AWS](https://img.shields.io/badge/AWS-Serverless-FF9900?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/)
[![DynamoDB](https://img.shields.io/badge/Amazon-DynamoDB-4053D6?style=for-the-badge&logo=amazon-dynamodb)](https://aws.amazon.com/dynamodb/)
[![CloudFront](https://img.shields.io/badge/Amazon-CloudFront-D05C4C?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/cloudfront/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk)](https://clerk.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

[Explore Features](#-key-features) • [Architecture](#-cloud--system-architecture) • [Tech Stack](#-technical-stack) • [Quick Start](#-quick-start-guide) • [API & Data Model](#-data-modeling--database-design)

</div>

---

## 🌟 Executive Overview

**LearnSphere** is a high-performance, full-stack video learning and course marketplace platform engineered for massive scalability, low latency, and zero server maintenance.

Engineered with modern full-stack best practices, it addresses real-world challenges including:

- **Direct-to-Cloud Video Ingestion**: Presigned S3 uploads bypassing application servers for gigabyte-scale video files.
- **Global Low-Latency Streaming**: Accelerated video delivery via Amazon CloudFront edge nodes with fine-grained CORS and byte-range request support.
- **Microservice-Free Serverless Backend**: Express 5 application packaged with `serverless-http` deployed on AWS Lambda container images via Amazon ECR.
- **Resilient Financial Transactions**: PCI-compliant Stripe Payment Element integration with automatic client-secret synchronization and failure recovery.
- **Modern State Management**: Normalized server caching, optimistic updates, and instant UI feedback powered by Redux Toolkit Query (RTK Query).

---

## 🏗️ Cloud & System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Vercel Edge)"]
        UI["Next.js 16 App Router\n(React 19 + Tailwind CSS)"]
        RTK["Redux Toolkit Query\n(Client Cache & State)"]
        StripeUI["Stripe Elements\n(Payment Form)"]
        AuthUI["Clerk Auth Provider"]
    end

    subgraph Security ["Identity & Edge Gateway"]
        CF["Amazon CloudFront CDN\n(Global Edge Distribution)"]
        APIGW["Amazon API Gateway\n(REST API Stage: /prod)"]
        Clerk["Clerk Identity Provider\n(JWT & RBAC Session)"]
    end

    subgraph Compute ["Serverless Compute"]
        Lambda["AWS Lambda (lm_lambda)\nDocker Image (ECR)\nExpress 5 + serverless-http"]
    end

    subgraph Storage ["Cloud Data & Storage"]
        S3["Amazon S3 Bucket\n(Raw Video Chunks & Presigned URLs)"]
        DDB[("Amazon DynamoDB\n(Single-Table Modeling with Dynamoose)")]
    end

    subgraph External ["Payment Engine"]
        StripeAPI["Stripe API\n(PaymentIntents & Webhooks)"]
    end

    UI -->|Render & Prefetch| RTK
    RTK -->|JWT Authenticated API Calls| APIGW
    APIGW -->|Proxy Integration| Lambda
    Lambda -->|Authenticate Session| Clerk
    Lambda -->|CRUD Operations| DDB
    Lambda -->|Generate Presigned PUT URLs| S3
    Lambda -->|Create Payment Intents| StripeAPI
    StripeUI -->|Confirm Payment| StripeAPI

    UI -->|Direct Upload via Presigned URL| S3
    UI -->|Stream Video with Byte-Ranges| CF
    CF -->|Origin Pull & Edge Cache| S3
```

---

## 🚀 Key Features

### 👨‍🎓 Student Experience

- **Course Discovery & Search**: Fast multi-attribute filtering (category, price, difficulty level) with debounced search.
- **Seamless 3-Step Checkout Wizard**:
  - Step 1: Order verification & guest/account onboarding.
  - Step 2: Payment processing via Stripe Elements with dark-theme styling, automatic card detection, and error handling.
  - Step 3: Instant transaction receipt and automated enrollment confirmation.
- **Interactive Video Player**:
  - Native HTML5 video player with adaptive stream buffering and byte-range scrubbing.
  - Automatic completion tracking: marks chapter completed when user reaches **80%** watch time.
  - Chapter notes, resource downloads, and interactive quiz tabs.
- **Student Dashboard**: Real-time course progress tracking, billing invoice history, and enrolled course library.

### 👩‍🏫 Instructor & Creator Studio

- **Dynamic Curriculum Builder**: Drag-and-drop course reordering, multi-section organizing, and chapter management.
- **Direct S3 Video Uploader**: FilePond-integrated direct chunk upload generating AWS S3 Presigned URLs to prevent server memory saturation.
- **Teacher Analytics & Billing**: Real-time sales calculations, enrollment numbers, revenue charts, and transaction audits.
- **Course Publishing Lifecycle**: Draft, review, publish, and archive workflows.

### 🔐 Security & Infrastructure Excellence

- **Role-Based Access Control (RBAC)**: Fine-grained middleware authorization segregating teacher and student endpoints via Clerk.
- **Zero-Downtime CI/CD Pipeline**: GitHub Actions automatically builds multi-stage Docker images, pushes to Amazon ECR, and triggers zero-downtime AWS Lambda code updates.
- **Enterprise Storage Policies**: S3 Bucket ownership enforcement, block public access, Origin Access Control (OAC), and CloudFront managed CORS preflight policies.

---

## 🛠️ Technical Stack

| Domain                   | Technologies                                                                |
| ------------------------ | --------------------------------------------------------------------------- |
| **Frontend Framework**   | **Next.js 16.2** (App Router, Server & Client Components, Turbopack)        |
| **UI Library & Styling** | **React 19.2**, **Tailwind CSS**, **Radix UI Primitives**, **Lucide Icons** |
| **State & API Cache**    | **Redux Toolkit 2.x**, **RTK Query** with automatic cache invalidation      |
| **Authentication**       | **Clerk** (Social Login, JWT Tokens, User Metadata, Custom Sessions)        |
| **Payment Gateway**      | **Stripe** (Elements, PaymentIntents API, Webhooks)                         |
| **Backend Runtime**      | **Node.js 22**, **Express 5**, **TypeScript**, **serverless-http**          |
| **Serverless Compute**   | **AWS Lambda** (Container image runtime via Amazon ECR)                     |
| **API Gateway**          | **Amazon API Gateway** (REST API with proxy routes)                         |
| **Database**             | **Amazon DynamoDB** with **Dynamoose ODM**                                  |
| **Media & CDN**          | **Amazon S3** (Presigned URLs) + **Amazon CloudFront** (Global Edge CDN)    |
| **DevOps & Containers**  | **Docker** (Multi-stage build), **GitHub Actions** (CI/CD to AWS)           |

---

## 📊 Data Modeling & Database Design

The database layer utilizes **Amazon DynamoDB** via Dynamoose to ensure single-digit millisecond latency at any read/write volume:

```mermaid
erDiagram
    COURSE ||--o{ TRANSACTION : generates
    COURSE ||--o{ USER_COURSE_PROGRESS : tracks

    COURSE {
        string courseId PK
        string teacherId FK
        string teacherName
        string title
        string description
        string category
        string image
        float price
        string level
        string status
        string createdAt
        string updatedAt
    }

    TRANSACTION {
        string transactionId PK
        string userId FK
        string courseId FK
        string paymentProvider
        float amount
        string dateTime
    }

    USER_COURSE_PROGRESS {
        string userId PK
        string courseId FK
        float overallProgress
        string enrollmentDate
        string lastAccessedTimestamp
    }
```

---

## 📂 Project Structure

```text
learning-management/
├── .github/
│   └── workflows/
│       └── deploy-server.yml      # CI/CD: Automated ECR Build & Lambda Deployment
├── client/                        # Next.js 16 Frontend
│   ├── public/                    # Static assets & public media
│   ├── src/
│   │   ├── app/
│   │   │   ├── (dashboard)/       # Authenticated Student & Teacher Dashboards
│   │   │   │   ├── teacher/       # Courses manager, creation, analytics
│   │   │   │   └── user/          # Enrolled courses, video player, billing
│   │   │   ├── (nondashboard)/    # Public Landing, Search & Checkout Wizard
│   │   │   │   ├── checkout/      # Multi-step checkout (Details, Payment, Completion)
│   │   │   │   └── search/        # Course catalog with faceted search
│   │   │   ├── globals.css        # Tailored dark-mode tokens & CSS utilities
│   │   │   └── layout.tsx         # Root layout with Clerk & Redux providers
│   │   ├── components/            # Reusable UI primitives & compound components
│   │   ├── hooks/                 # Custom React hooks (Checkout, Progress, Auth)
│   │   ├── lib/                   # Utility helpers, Zod validation schemas
│   │   └── state/
│   │       ├── api.ts             # Central RTK Query API slice with custom baseQuery
│   │       └── index.ts           # Redux store configuration
│   ├── package.json
│   └── tailwind.config.ts
├── server/                        # Express 5 Serverless Backend
│   ├── src/
│   │   ├── controllers/           # Course, Transaction, User Progress handlers
│   │   ├── models/                # Dynamoose DynamoDB schemas (Course, Transaction, Progress)
│   │   ├── routes/                # Express API routing with Clerk authentication guards
│   │   ├── seed/                  # Database seeding scripts & mock datasets
│   │   └── index.ts               # Server bootstrap, middleware & Lambda handler export
│   ├── Dockerfile                 # Multi-stage production container image
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## ⚙️ Quick Start Guide

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **pnpm**
- **AWS CLI** configured with appropriate IAM credentials
- **Docker** (optional, for local containerized server execution)

### 1. Clone Repository

```bash
git clone https://github.com/prashantsingh-codes/learning-management.git
cd learning-management
```

### 2. Configure Environment Variables

#### Client Configuration (`client/.env.local`):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001
NEXT_PUBLIC_LOCAL_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/signin
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
```

#### Server Configuration (`server/.env`):

```env
PORT=8001
NODE_ENV=development
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-s3-bucket-name
CLOUDFRONT_DOMAIN=https://your-cloudfront-distribution.cloudfront.net
STRIPE_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 3. Run Locally

#### Start the Server:

```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:8001
```

#### Start the Client:

```bash
cd ../client
npm install
npm run dev
# Next.js app available at http://localhost:3000
```

---

## 🚢 CI/CD & Deployment Strategy

```mermaid
sequenceDiagram
    autonumber
    actor Developer
    participant GitHub as GitHub Actions
    participant ECR as Amazon ECR
    participant Lambda as AWS Lambda
    participant Vercel as Vercel Edge

    Developer->>GitHub: git push origin main
    par Frontend Deployment
        GitHub->>Vercel: Trigger Build Hook
        Vercel->>Vercel: Next.js SSG + SSR Compilation
        Vercel-->>Developer: Live on Vercel Edge Network
    and Backend Deployment
        GitHub->>GitHub: Check changed paths (server/**)
        GitHub->>GitHub: Docker Build & Tag (SHA + latest)
        GitHub->>ECR: Docker Push Image
        GitHub->>Lambda: aws lambda update-function-code
        Lambda->>Lambda: Deploy Container & Warm Function
        Lambda-->>Developer: Zero-Downtime Serverless API Live
    end
```

---

## 👨‍💻 Engineering Highlights & Problem Solving

- **Cross-Origin Media Streaming**: Resolved complex browser media playback deadlocks by configuring AWS CloudFront with a dedicated `Managed-CORS-With-Preflight` Response Headers Policy and migrating from synthetic player wrappers to native HTML5 video engines with byte-range support.
- **Stripe PCI Compliance & UX Optimization**: Implemented seamless payment recovery with automatic client-secret synchronization, night-mode tokenization, and fallback public keys ensuring checkout success across development, preview, and production environments.
- **Memory-Safe Video Upload Pipeline**: Bypassed server memory limits by implementing direct-to-S3 signed URLs (`s3.getSignedUrl('putObject')`), allowing teachers to upload large video files directly from the browser with zero server CPU utilization.

---

## 👤 Author

**Prashant Singh**

- **GitHub**: [@prashantsingh-codes](https://github.com/prashantsingh-codes)
- **LinkedIn**: [Connect on LinkedIn](https://www.linkedin.com/in/prashant-singh-codes/)

---

<div align="center">
  <sub>Built with modern software engineering principles, cloud architecture, and attention to detail.</sub>
</div>
