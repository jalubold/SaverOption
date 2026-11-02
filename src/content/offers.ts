/**
 * Offers — generated from research notes on 2026-10-17, 2026-10-19, 2026-10-23 and 2026-11-02.
 * Sources are the providers' own sites. `verification.status` says whether the
 * live page was checked ("verified") or the facts came from the provider's site
 * via search extracts only ("unverified"). Supporting quotes are kept in
 * `verification.evidence`.
 * Offers change: re-check before relying on any figure.
 */
import type { Offer } from "@/lib/types";

export const offers: Offer[] = [
  {
    "id": "o-github-student-developer-pack",
    "slug": "github-student-developer-pack",
    "productId": "github",
    "title": "GitHub Student Developer Pack for verified students",
    "summary": "Verified students get access to the Student Developer Pack, a collection of 80+ developer tools and resources from GitHub and partner companies, through GitHub Education.",
    "description": "The Student Developer Pack is part of GitHub Education's student benefits. Once a student is verified, they can browse and claim partner offers for developer tools from the GitHub Education portal.\n\nTo qualify, applicants must be enrolled in a degree- or diploma-granting program (including high school, college, university or homeschool), be at least 13, have a personal GitHub account and provide proof of current student status. Some schools require an academic email address.\n\nStudent verification lasts two years before revalidation is needed. Partner offers are governed by each partner's own terms, can change, and cannot be redeemed multiple times.",
    "type": "student",
    "categories": [
      "student-discounts",
      "software-deals"
    ],
    "source": "official",
    "claim": {
      "method": "application",
      "note": "Apply from GitHub's Education benefits settings; partner offers are claimed individually after approval."
    },
    "requirements": {
      "approvalRequired": true,
      "studentVerification": true
    },
    "eligibility": [
      "Enrolled in a degree- or diploma-granting program, such as a high school, college, university or homeschool",
      "At least 13 years old",
      "Has a GitHub personal account",
      "Can provide documents proving current student status (academic email where the school requires it)",
      "Teachers, researchers, faculty and staff are not eligible for the Pack"
    ],
    "redemption": [
      "Go to github.com/settings/education/benefits",
      "Under GitHub Education, click Start an application",
      "Complete the form and submit the application",
      "After approval, open the GitHub Education portal and claim the partner offers you want"
    ],
    "terms": [
      "Student validation lasts for 2 years, after which you need to revalidate",
      "Offers may not be redeemed multiple times",
      "Some partners do not allow stacking with previously redeemed free trials",
      "Third-party offers can change at the partner's request and are governed by the partner's own terms"
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against GitHub's official documentation source (github/docs repository)",
      "evidence": [
        {
          "claim": "Pack size and nature",
          "quote": "GitHub Education Benefits include access to the Student Developer Pack (the Pack), a selection of 80+ resources for students."
        },
        {
          "claim": "Verification required; teachers not eligible",
          "quote": "All users must be actively verified as a student by the GitHub Education team. You can become verified directly from your GitHub profile. Note that teachers, researchers, faculty, staff, and other educational users can get free and discounted access to GitHub, but are not eligible for the Pack."
        },
        {
          "claim": "Validity period",
          "quote": "Student validation lasts for 2 years, after which you will need to revalidate your student status."
        },
        {
          "claim": "Minimum age",
          "quote": "All users must be 13 years of age or older. Certain third-party offers may have additional age restrictions."
        },
        {
          "claim": "No multiple redemptions",
          "quote": "Offers may not be redeemed multiple times."
        },
        {
          "claim": "No stacking with prior trials for some partners",
          "quote": "Some partners do not allow the “stacking” of promotional offers, so if users have previously redeemed a free trial, access via the Pack may not be available."
        },
        {
          "claim": "Enrollment requirement (apply page)",
          "quote": "Are enrolled in a degree- or diploma-granting program, such as a high school, college, university, or homeschool."
        },
        {
          "claim": "Proof of status, account and age (apply page)",
          "quote": "Provide documents that prove your current student status. ... Own a GitHub personal account. ... Are at least 13 years old."
        },
        {
          "claim": "Application steps (apply page)",
          "quote": "Navigate to your Education benefits settings. Under \"GitHub Education\", click Start an application. Complete the form, then click Submit application."
        },
        {
          "claim": "Approval before use (apply page)",
          "quote": "Once your application is approved, navigate to your GitHub Education portal to use your GitHub Education benefits, such as free access to professional developer tools."
        },
        {
          "claim": "Source note",
          "quote": "Terms read from GitHub's official docs source (github/docs repository, commit dae83f7, 2026-10-16) because docs.github.com was not reachable from the research environment; quotes have GitHub's docs variables resolved."
        }
      ]
    },
    "links": {
      "officialUrl": "https://docs.github.com/en/education/about-github-education/github-education-for-students/github-terms-and-conditions-for-the-student-developer-pack"
    },
    "placement": {
      "featured": true,
      "featuredRank": 2
    },
    "audiences": [
      "students",
      "developers"
    ]
  },
  {
    "id": "o-github-copilot-student-free",
    "slug": "github-copilot-student-free",
    "productId": "github-copilot",
    "title": "GitHub Copilot Student: free Copilot plan for verified students",
    "summary": "Students verified through GitHub Education can activate Copilot Student, a free Copilot plan that includes an allowance of GitHub AI Credits and most agent features.",
    "description": "Copilot Student is an individual Copilot plan offered at no cost to students verified through GitHub Education. According to GitHub's plan comparison, it includes an allowance of GitHub AI Credits and agent features (excluding third-party agents), with models available through automatic model selection only.\n\nVerification and Copilot activation are separate steps; GitHub notes the benefit can take several days to apply after approval. GitHub reevaluates eligibility every month.",
    "type": "student",
    "categories": [
      "student-discounts",
      "ai-tools"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "Free for verified students"
    },
    "claim": {
      "method": "verification",
      "note": "Requires an approved GitHub Education student application; then activate from Education benefits settings."
    },
    "requirements": {
      "studentVerification": true
    },
    "eligibility": [
      "Verified student on GitHub Education"
    ],
    "redemption": [
      "Go to github.com/settings/education/benefits (apply and complete student verification first if needed)",
      "Under \"Free GitHub developer resources for students and teachers\", click Learn more",
      "Follow the prompts to activate Copilot Student and set your Copilot use policies"
    ],
    "terms": [
      "GitHub reevaluates eligibility every month",
      "Models are available through automatic model selection only on this plan",
      "Third-party agents are excluded",
      "Free access granted as a verified student cannot be cancelled"
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against GitHub's official documentation source (github/docs repository)",
      "evidence": [
        {
          "claim": "Free access for verified students",
          "quote": "Verified students on GitHub Education get free access to Copilot's features."
        },
        {
          "claim": "Monthly eligibility check",
          "quote": "GitHub reevaluates your eligibility every month."
        },
        {
          "claim": "Activation steps",
          "quote": "Under \"Free GitHub developer resources for students and teachers\", click Learn more. Follow the prompts to activate Copilot Student, configuring the Copilot use policies to meet your needs."
        },
        {
          "claim": "Activation may be delayed",
          "quote": "Approval and Copilot activation are separate steps. The student benefit can take several days to finish applying after verification."
        },
        {
          "claim": "Plan price and inclusions (plans page)",
          "quote": "| Copilot Student | Free | An allowance of GitHub AI Credits | Included Excludes third-party agents | Auto model selection only |"
        },
        {
          "claim": "Model access (plans page)",
          "quote": "On Copilot Free and Copilot Student plans, access to models is available through Copilot auto model selection only."
        },
        {
          "claim": "Cannot cancel free access",
          "quote": "If you have been granted free access to Copilot as a verified student, teacher, or maintainer of a popular open source project, you won’t be able to cancel your plan."
        },
        {
          "claim": "Source note",
          "quote": "Terms read from GitHub's official docs source (github/docs repository, commit dae83f7, 2026-10-16) because docs.github.com was not reachable from the research environment; quotes have GitHub's docs variables resolved."
        }
      ]
    },
    "links": {
      "officialUrl": "https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/enable-copilot/set-up-for-students"
    },
    "placement": {
      "featured": true,
      "featuredRank": 6
    },
    "audiences": [
      "students",
      "ai-tools",
      "developers"
    ]
  },
  {
    "id": "o-github-copilot-pro-free-teachers",
    "slug": "github-copilot-pro-free-teachers",
    "productId": "github-copilot",
    "title": "GitHub Copilot Pro free for verified teachers",
    "summary": "Teachers verified through GitHub Education can get Copilot Pro, normally $10 USD per month, at no cost.",
    "description": "GitHub gives verified teachers on GitHub Education free access to Copilot Pro, its paid individual Copilot plan. The same free access is also available to maintainers of popular open-source repositories.\n\nTo apply for teacher benefits, GitHub requires applicants to be an educator, faculty member or researcher with a verifiable school-issued email address and documents proving school affiliation. GitHub reevaluates eligibility every month, and free access granted this way cannot be cancelled.",
    "type": "student",
    "categories": [
      "student-discounts",
      "ai-tools"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "regularPrice": 10,
      "regularPeriod": "month",
      "dealPrice": 0,
      "period": "month",
      "savingsLabel": "Copilot Pro ($10 USD/month) free for verified teachers"
    },
    "claim": {
      "method": "verification",
      "note": "Requires an approved GitHub Education teacher application; eligible accounts see a Copilot Pro access page in Copilot settings."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Verified teacher on GitHub Education",
      "Educator, faculty member or researcher with a verifiable school-issued email address and documents proving school affiliation"
    ],
    "redemption": [
      "Apply to GitHub Education as a teacher from github.com/settings/education/benefits",
      "After approval, open Copilot settings from your profile menu",
      "On the GitHub Copilot Pro eligibility page, click Get access to GitHub Copilot",
      "Configure Copilot use policies and click Save and complete"
    ],
    "terms": [
      "GitHub reevaluates eligibility every month",
      "Free access granted as a verified teacher cannot be cancelled"
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against GitHub's official documentation source (github/docs repository)",
      "evidence": [
        {
          "claim": "Teachers qualify for free Copilot Pro",
          "quote": "There are two ways to qualify for free access to Copilot Pro: As a verified teacher on GitHub Education."
        },
        {
          "claim": "Monthly eligibility check",
          "quote": "GitHub reevaluates your eligibility every month."
        },
        {
          "claim": "Claim steps",
          "quote": "If you qualify for free access to Copilot, you will see a page titled \"GitHub Copilot Pro\" informing you that you are eligible. Click Get access to GitHub Copilot."
        },
        {
          "claim": "Regular price (plans page)",
          "quote": "| Copilot Pro | $10 USD per month (free for some users) |"
        },
        {
          "claim": "Teacher requirements (teacher apply page)",
          "quote": "Be an educator, faculty member, or researcher. Have a verifiable school-issued email address. Upload documents that prove your school affiliation. Have a personal account on GitHub."
        },
        {
          "claim": "Cannot cancel free access",
          "quote": "If you have been granted free access to Copilot as a verified student, teacher, or maintainer of a popular open source project, you won’t be able to cancel your plan."
        },
        {
          "claim": "Source note",
          "quote": "Terms read from GitHub's official docs source (github/docs repository, commit dae83f7, 2026-10-16) because docs.github.com was not reachable from the research environment; quotes have GitHub's docs variables resolved."
        }
      ]
    },
    "links": {
      "officialUrl": "https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/enable-copilot/set-up-for-teachers-and-os-maintainers"
    },
    "audiences": [
      "students",
      "ai-tools",
      "developers"
    ]
  },
  {
    "id": "o-github-codespaces-students-180-core-hours",
    "slug": "github-codespaces-students-180-core-hours",
    "productId": "github-codespaces",
    "title": "GitHub Codespaces: up to 180 core hours per month for verified students",
    "summary": "Verified GitHub Education students get free GitHub Codespaces usage on their personal accounts, up to 180 core hours per month, matching the allowance included with GitHub Pro.",
    "description": "As part of GitHub Education's student benefits, verified students can use GitHub Codespaces cloud development environments for free on their personal accounts, up to 180 core hours per month. GitHub states the monthly storage and core-hour allowance is equivalent to what GitHub Pro accounts include.\n\nCodespaces used inside GitHub Classroom assignment repositories are billed to the organization that owns the classroom and do not count against the student's personal allowance.",
    "type": "student",
    "categories": [
      "student-discounts",
      "free-credits"
    ],
    "source": "official",
    "claim": {
      "method": "verification",
      "note": "Available to students verified through GitHub Education."
    },
    "requirements": {
      "studentVerification": true
    },
    "eligibility": [
      "Verified student on GitHub Education",
      "Applies to personal accounts"
    ],
    "redemption": [
      "Apply to GitHub Education as a student and get verified",
      "Use GitHub Codespaces from your personal account"
    ],
    "terms": [
      "Up to 180 core hours per month",
      "Classroom assignment usage is charged to the classroom's organization, not the student's allowance"
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against GitHub's official documentation source (github/docs repository)",
      "evidence": [
        {
          "claim": "Free usage amount",
          "quote": "Verified students get free use of GitHub Codespaces, up to 180 core hours per month, for their personal accounts. The monthly amount of storage and core hours of usage available to students is equivalent to the amount included with GitHub Pro accounts."
        },
        {
          "claim": "Classroom usage billing",
          "quote": "If students use GitHub Codespaces in their assignment repositories for GitHub Classroom, the usage will be charged to the organization that owns the classroom, and will not affect the usage for a student's personal account."
        },
        {
          "claim": "Source note",
          "quote": "Terms read from GitHub's official docs source (github/docs repository, commit dae83f7, 2026-10-16) because docs.github.com was not reachable from the research environment; quotes have GitHub's docs variables resolved."
        }
      ]
    },
    "links": {
      "officialUrl": "https://docs.github.com/en/education/about-github-education/github-education-for-students/about-github-education-for-students"
    },
    "audiences": [
      "students",
      "developers"
    ]
  },
  {
    "id": "o-github-education-teachers-free-github-team",
    "slug": "github-education-teachers-free-github-team",
    "productId": "github",
    "title": "GitHub Education for teachers: free GitHub Team",
    "summary": "Verified educators can apply through GitHub Education for free GitHub Team, which allows unlimited users and private repositories, alongside classroom and community resources.",
    "description": "GitHub Education offers a teacher track for educators, faculty members and researchers. Verified teachers can apply for GitHub Team at no cost, which GitHub describes as allowing unlimited users and private repositories, for example for a class or school club.\n\nApplicants need a verifiable school-issued email address, documents proving school affiliation and a personal GitHub account. Verified teachers also get access to the GitHub Education portal with GitHub Classroom overviews and community resources.",
    "type": "student",
    "categories": [
      "student-discounts",
      "software-deals"
    ],
    "source": "official",
    "claim": {
      "method": "application",
      "note": "Apply from GitHub's Education benefits settings."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Educator, faculty member or researcher",
      "Verifiable school-issued email address",
      "Documents proving school affiliation",
      "Personal GitHub account"
    ],
    "redemption": [
      "Go to github.com/settings/education/benefits",
      "Under GitHub Education, click Start an application",
      "Complete the form and submit it",
      "After approval, use the GitHub Education portal to access teacher benefits"
    ],
    "terms": [],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against GitHub's official documentation source (github/docs repository)",
      "evidence": [
        {
          "claim": "Free GitHub Team for teachers",
          "quote": "Apply for free GitHub Team, which allows unlimited users and private repositories."
        },
        {
          "claim": "Audience",
          "quote": "As a faculty member at an accredited educational institution, you can apply for GitHub Education, which includes GitHub Education benefits and resources."
        },
        {
          "claim": "Requirements (teacher apply page)",
          "quote": "Be an educator, faculty member, or researcher. Have a verifiable school-issued email address. Upload documents that prove your school affiliation. Have a personal account on GitHub."
        },
        {
          "claim": "Approval before use (teacher apply page)",
          "quote": "Once your application is approved, navigate to your GitHub Education portal to use your GitHub Education benefits."
        },
        {
          "claim": "Source note",
          "quote": "Terms read from GitHub's official docs source (github/docs repository, commit dae83f7, 2026-10-16) because docs.github.com was not reachable from the research environment; quotes have GitHub's docs variables resolved."
        }
      ]
    },
    "links": {
      "officialUrl": "https://docs.github.com/en/education/about-github-education/github-education-for-teachers/about-github-education-for-teachers"
    },
    "audiences": [
      "students",
      "developers"
    ]
  },
  {
    "id": "o-office-365-a1-free-students-educators",
    "slug": "office-365-a1-free-students-educators",
    "productId": "office-365",
    "title": "Office 365 A1 free for students and educators",
    "summary": "Students and educators with an eligible education email address can get Office 365 A1, which includes the web versions of core Office apps, at no cost.",
    "description": "Office 365 A1 is Microsoft's donated education plan. It includes the web-based versions of Outlook, Word, Excel, PowerPoint and OneNote, plus PC-only versions of Publisher and Access. Microsoft donates it to eligible institutions and lets students and educators with an eligible education email address sign up for free.\n\nThe plan can be used while the person works at or is enrolled in a qualified educational institution, and eligibility may be re-verified at any time. If it expires, apps drop to a view-only reduced-functionality mode and institution-linked online services stop working until status is re-verified or the user moves to a personal plan.",
    "type": "student",
    "categories": [
      "student-discounts",
      "software-deals"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "Free (donated by Microsoft)"
    },
    "claim": {
      "method": "verification",
      "note": "Sign up with an eligible education email address."
    },
    "requirements": {
      "studentVerification": true
    },
    "eligibility": [
      "Students and educators with an eligible education email address",
      "Must be working at or enrolled in a qualified educational organization"
    ],
    "redemption": [
      "Open the Office 365 Education page and choose Get started for students (or for institutions)",
      "Sign up with an eligible education email address"
    ],
    "terms": [
      "Usable as long as you work at or are enrolled in a qualified educational organization",
      "Eligibility may be re-verified at any time",
      "On expiry, apps become view-only and institution email-linked online services stop working",
      "Some plans show as not available in certain markets"
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against the provider's official page",
      "evidence": [
        {
          "claim": "Who can get it free",
          "quote": "Educators and students with an eligible education email address can get Office 365 A1 for free."
        },
        {
          "claim": "Plan contents",
          "quote": "Includes the web-based versions of core apps (Outlook, Word, Excel, PowerPoint, OneNote)"
        },
        {
          "claim": "Plan contents",
          "quote": "Includes PC-only versions of Microsoft Publisher and Microsoft Access"
        },
        {
          "claim": "Price",
          "quote": "Office 365 A1 ... Free ... Donated by Microsoft"
        },
        {
          "claim": "Donation to institutions",
          "quote": "Microsoft donates Office 365 A1 for Education to eligible institutions (for educators and students) at no cost"
        },
        {
          "claim": "Duration and re-verification",
          "quote": "You can use the Office 365 Education plan as long as you are working at, or enrolled in, a qualified educational organization. Your eligibility may be re-verified at any time."
        },
        {
          "claim": "Expiry behaviour",
          "quote": "The Office 365 applications enter a reduced-functionality mode, which means that you can view documents, but you cannot edit or create new documents."
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.microsoft.com/en-us/education/products/office"
    },
    "placement": {
      "featured": true,
      "featuredRank": 4
    },
    "audiences": [
      "students",
      "office-tools"
    ]
  },
  {
    "id": "o-azure-for-students-100-credit",
    "slug": "azure-for-students-100-credit",
    "productId": "microsoft-azure",
    "title": "Azure for Students: $100 Azure credit, renewable yearly",
    "summary": "Students who sign up with an eligible university or school email get $100 in Azure credit, renewable each year they remain a student, plus access to Azure free products.",
    "description": "Azure for Students is Microsoft's cloud offer for students. Signing up with an eligible university or school email address provides $100 in Azure credit that can be renewed each year the user is still a student.\n\nStudents can also use Azure's free products: some are always free to all Azure customers, while others are free for 12 months to new customers only.",
    "type": "student",
    "categories": [
      "student-discounts",
      "free-credits"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "creditValue": 100,
      "savingsLabel": "$100 Azure credit, renewable each year as a student"
    },
    "claim": {
      "method": "verification",
      "note": "Sign up for Azure for Students with an eligible school email."
    },
    "requirements": {
      "studentVerification": true
    },
    "eligibility": [
      "Student with an eligible university or school email address"
    ],
    "redemption": [
      "Open Azure for Students via Sign up for students on Microsoft's Azure for Education page",
      "Sign up using an eligible university or school email address"
    ],
    "terms": [
      "Credit is renewable each year the user is still a student",
      "Some free products are free for 12 months to new customers only"
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against the provider's official page",
      "evidence": [
        {
          "claim": "Credit amount and renewal",
          "quote": "Students can build in the cloud for free with Azure for Students. They can use an eligible university or school email to sign up and receive $100 in credit, renewable each year the user is still a student."
        },
        {
          "claim": "Free products",
          "quote": "Plus, they can take advantage of free products (some are always free to all Azure customers, and some are free for 12 months to new customers only)."
        },
        {
          "claim": "Corroborated on Microsoft's student page",
          "quote": "Start with $100 Azure credit"
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.microsoft.com/en-us/education/products/azure-for-education"
    },
    "audiences": [
      "students",
      "developers"
    ]
  },
  {
    "id": "o-google-cloud-300-free-trial-credit",
    "slug": "google-cloud-300-free-trial-credit",
    "productId": "google-cloud",
    "title": "$300 Google Cloud free trial credit for new customers",
    "summary": "New Google Cloud customers receive $300 in credit to try Google Cloud products. The trial runs for up to 3 months or until the credit is used up.",
    "description": "Google Cloud gives new customers a $300 credit that can be spent on Google Cloud products, for example to build a proof of concept. The trial begins when a billing account is created in the Google Cloud console.\n\nThe trial ends at the earliest of three points: usage fees exceeding the $300 credit, 3 months after the start date (unused credit then expires), or upgrading to a paid account. Google states that you are not charged until you activate a full paid account.\n\nThe trial has limits. Compute Engine use is capped at eight concurrent cores, cryptocurrency mining is not allowed, and some services and features are unavailable during the trial.",
    "type": "free-credits",
    "categories": [
      "free-credits",
      "free-trials",
      "software-deals"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "creditValue": 300,
      "durationMonths": 3,
      "savingsLabel": "$300 credit for up to 3 months"
    },
    "claim": {
      "method": "link",
      "note": "Sign up and create a billing account in the Google Cloud console; the trial starts on that date."
    },
    "requirements": {
      "newCustomersOnly": true
    },
    "eligibility": [
      "Only new Google Cloud Platform customers are eligible.",
      "U.S. and/or Mexican federal, state or local government entities are not eligible unless Google agrees in writing."
    ],
    "redemption": [
      "Go to the Google Cloud free program page and start the free sign-up.",
      "Create a billing account in the Google Cloud console; this sets the Free Trial Start Date.",
      "Use the $300 credit on Google Cloud products before it runs out or expires."
    ],
    "terms": [
      "The trial ends when usage fees exceed the $300 credit, 3 months after the start date, or when you upgrade to a paid account, whichever comes first.",
      "Unused credit expires 3 months after the Free Trial Start Date, including if you upgrade early.",
      "Compute Engine use is limited to eight cores of concurrent usage.",
      "Cryptocurrency mining is not permitted.",
      "Some services and features are not available under the trial.",
      "Google may terminate or modify the Free Trial at any time."
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against the provider's official page",
      "evidence": [
        {
          "claim": "creditValue 300, new customers",
          "quote": "New customers get $300 in free credit to try Google Cloud products and build a proof of concept. You won’t be charged until you activate your full paid account."
        },
        {
          "claim": "newCustomersOnly true; government exclusion (Free Trial terms, https://cloud.google.com/terms/free-trial)",
          "quote": "Only new Google Cloud Platform customers are eligible to participate in the Free Trial. U.S. and/or Mexican federal, state, or local government entities are not eligible to participate in the Free Trial unless agreed to by Google in writing."
        },
        {
          "claim": "durationMonths 3; trial start and end conditions (Free Trial terms, https://cloud.google.com/terms/free-trial)",
          "quote": "The Free Trial starts when Customer creates a billing account in the Google Cloud console (“Free Trial Start Date”) and ends on the earlier of: (i) the date that Customer’s fees for usage exceed the $300 credit provided under the Free Trial, (ii) 3 months from the Free Trial Start Date (on this date any unused credit will expire), or (iii) the date that Customer upgrades to a paid Google Cloud Platform account."
        },
        {
          "claim": "Unused credit expiry after upgrade (Free Trial terms)",
          "quote": "Any unused credits will expire 3 months after the Free Trial Start Date."
        },
        {
          "claim": "Compute Engine core limit (Free Trial terms)",
          "quote": "Customer’s use of Google Compute Engine is restricted to only eight cores of concurrent usage per Free Trial (as further described in Documentation)."
        },
        {
          "claim": "No crypto mining (Free Trial terms)",
          "quote": "Customer may not use the Services to engage in mining cryptocurrency."
        },
        {
          "claim": "Some services unavailable (Free Trial terms)",
          "quote": "Certain Services and features will not be available under the Free Trial, as indicated in the Google Cloud console."
        },
        {
          "claim": "Google may modify trial (Free Trial terms)",
          "quote": "Google may terminate or modify the Free Trial at any time with or without notice to Customer."
        }
      ]
    },
    "links": {
      "officialUrl": "https://cloud.google.com/free"
    },
    "placement": {
      "featured": true,
      "featuredRank": 1
    },
    "audiences": [
      "developers"
    ]
  },
  {
    "id": "o-google-cloud-free-tier",
    "slug": "google-cloud-free-tier",
    "productId": "google-cloud",
    "title": "Google Cloud Free Tier: 20+ products with monthly free usage",
    "summary": "Google Cloud offers free monthly usage of more than 20 products, up to set limits. This usage is not deducted from the $300 trial credit.",
    "description": "Separately from the $300 trial credit, Google Cloud's Free Tier lets eligible customers use more than 20 products at no charge up to monthly usage limits. Examples include one e2-micro Compute Engine instance per month, 5 GB-months of Cloud Storage Standard Storage, 1 TB of BigQuery queries per month and 2 million Cloud Run requests per month.\n\nGoogle states that the free usage limits do not expire but may change. Usage above the limits is billed at normal rates.",
    "type": "free-plan",
    "categories": [
      "free-credits",
      "software-deals"
    ],
    "source": "official",
    "claim": {
      "method": "automatic",
      "note": "Free usage applies to eligible accounts up to each product's monthly limit."
    },
    "eligibility": [
      "Available for eligible Google Cloud customers (as stated by Google)."
    ],
    "redemption": [
      "Sign up for Google Cloud.",
      "Use Free Tier products within their stated free usage limits."
    ],
    "terms": [
      "No charge up to each product's specified free usage limit.",
      "The free usage limit does not expire but is subject to change.",
      "Free Tier usage is not charged against the $300 trial credit."
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against the provider's official page",
      "evidence": [
        {
          "claim": "20+ products with free monthly usage, separate from trial credit",
          "quote": "Get free usage of AI APIs, Compute Engine, BigQuery, and other popular products up to monthly limits—not charged against your $300 free credit."
        },
        {
          "claim": "No charge up to limits; limits don't expire; eligibility",
          "quote": "There is no charge to use these products up to their specified free usage limit. The free usage limit does not expire, but is subject to change. Available for eligible customers."
        },
        {
          "claim": "Compute Engine allowance",
          "quote": "1 e2-micro instance per month"
        },
        {
          "claim": "Cloud Storage allowance",
          "quote": "5 GB-months Standard Storage"
        },
        {
          "claim": "BigQuery allowance",
          "quote": "1 TB queries per month"
        },
        {
          "claim": "Cloud Run allowance",
          "quote": "2 million requests per month"
        },
        {
          "claim": "20+ products count",
          "quote": "20+ products with free tier"
        }
      ]
    },
    "links": {
      "officialUrl": "https://cloud.google.com/free"
    },
    "audiences": [
      "developers"
    ]
  },
  {
    "id": "o-google-for-startups-cloud-program-credits",
    "slug": "google-for-startups-cloud-program-credits",
    "productId": "google-cloud",
    "title": "Google for Startups Cloud Program: up to $350,000 in Cloud credits",
    "summary": "Funded startups can apply for Google Cloud credits over two years: up to $200,000, or up to $350,000 for AI startups. There is also a $2k Start tier for earlier-stage startups.",
    "description": "The Google for Startups Cloud Program gives accepted startups Google Cloud credits over two years. AI startups can receive 100% of usage up to $250,000 in year 1 and 20% up to another $100,000 in year 2. Other startups can receive up to $100,000 in year 1 and 20% up to another $100,000 in year 2. The program also lists Gemini and Gemma model credits, 12 months of Google Workspace Business Plus, monthly Google Maps Platform credits and technical support.\n\nThe funded tiers (Scale and Scale AI) are for startups with verifiable Pre-Seed to Series A funding. A Start ($2k) tier is for startups founded in the past 2 years that have a working MVP and plan to raise venture funding.\n\nYou apply with a Google Cloud billing account ID, an active company website, and an email address on the same domain as the website. Google Cloud decides acceptance at its sole discretion. Credits cover first-party, pay-as-you-go Google Cloud products only.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits",
      "ai-tools"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "creditValue": 350000,
      "durationMonths": 24,
      "savingsLabel": "Up to $350,000 in credits over two years (AI startups)"
    },
    "claim": {
      "method": "application",
      "note": "Apply online; approved credits go to the Google Cloud billing account named in the application."
    },
    "requirements": {
      "approvalRequired": true
    },
    "regions": {
      "scope": "limited",
      "note": "Customers must be located in a region where Google Cloud is available in GA and can be bought through self-service purchasing."
    },
    "eligibility": [
      "Funded tiers (Scale and Scale AI): startups with verifiable Pre-Seed to Series A funding, founded within the last 3-5 years depending on tier.",
      "Start ($2k) tier: startups founded in the past 2 years with a working MVP, a clear business model and plans to seek venture funding soon.",
      "Not eligible: companies that have IPO'd or been acquired, educational institutions, government entities, nonprofits, personal blogs, dev shops, consultancies or agencies, and cryptocurrency mining companies.",
      "Non-venture funding (private equity, bank loans, government programs, grants, crowdfunding, friends and family) does not qualify for the Scale tier.",
      "Company website domain must match the applicant's email domain."
    ],
    "redemption": [
      "Have your 18-character Google Cloud billing account ID ready.",
      "Make sure your company website is active and describes the company, team and product.",
      "Apply using an email address on your company's domain.",
      "If approved, credits are issued to the selected billing account."
    ],
    "terms": [
      "Acceptance is at the sole discretion of Google Cloud.",
      "Credits apply only to Google-owned first-party Google Cloud Platform products billed pay-as-you-go or by consumption; subscription, pre-pay, annual-license and third-party products are excluded.",
      "Third-party models are billed directly and are not covered by program credits.",
      "Credits may only be used by the original applicant and cannot be shared, split or resold.",
      "Workspace and Maps benefits require separate applications."
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against the provider's official page",
      "evidence": [
        {
          "claim": "creditValue 350000 over two years",
          "quote": "Up to $350,000 in Cloud credits over two years."
        },
        {
          "claim": "AI startups credit structure",
          "quote": "Year 1: 100% up to $250,000 USD in Google Cloud credits; Year 2: 20% up to an additional $100,000 USD in Google Cloud credits."
        },
        {
          "claim": "Other startups credit structure (listed under 'Other startups:')",
          "quote": "Year 1: 100% up to $100,000 USD in Google Cloud credits; Year 2: 20% up to an additional $100,000 USD in Google Cloud credits."
        },
        {
          "claim": "Tiers",
          "quote": "Start ($2k) tier is designed for startups founded in the past 2 years, with a working MVP, a clear business model, and plans to seek venture funding soon."
        },
        {
          "claim": "Funded tiers",
          "quote": "Our Funded program tiers (Scale, and Scale AI) range from $200K - $350k in credits, and are designed for growing startups with verifiable Pre-Seed to Series A funding."
        },
        {
          "claim": "Funding / founding window",
          "quote": "For startups with Pre-Seed to Series A funding, founded within the last 3-5 years."
        },
        {
          "claim": "approvalRequired; exclusions",
          "quote": "*Acceptance into this program is at the sole discretion of Google Cloud. We are unable to accept companies that have IPO’d or been acquired, educational institutions, government entities, nonprofits, personal blogs or content, dev shops, consultancies or agencies, cryptocurrency mining companies, or a company distributing tokens contrary to regulatory guidance in its jurisdiction."
        },
        {
          "claim": "Region limitation",
          "quote": "Customers must be located in a region where Google Cloud is available in GA, and available through self-service purchasing (for example, without any specialized contracts or terms of sale)."
        },
        {
          "claim": "Non-venture funding excluded from Scale tier",
          "quote": "Please note that non-venture funding like private equity, bank loans government innovation programs, grants, crowdfunding, or friends and family do not qualify for the Scale tier."
        },
        {
          "claim": "Domain match requirement",
          "quote": "In order to be approved for credits, your company website domain must match your email domain"
        },
        {
          "claim": "Billing account ID",
          "quote": "This is the 18-character Google Cloud billing account ID which can be found in your console here. Upon approval credits will be issued directly to this account"
        },
        {
          "claim": "Eligible products",
          "quote": "Offer applies solely to Google-owned and built first-party (1P) Google Cloud Platform products billed on a pay-as-you-go (PayG) or consumption basis. All 1P products billed through subscription, pre-pay, or annual license are excluded, as are all third-party (3P) products and services, including any 3P offerings listed in Google Cloud Marketplace or Model Garden."
        },
        {
          "claim": "Third-party models excluded",
          "quote": "2. Third-party models are billed directly and are not covered by the program credits."
        },
        {
          "claim": "Non-transferable",
          "quote": "Credits may only be used by the original applicant and cannot be shared, split, or resold; doing so will result in termination of credits and program enrollment."
        },
        {
          "claim": "Additional benefits",
          "quote": "12 months of Google Workspace Business Plus at no extra cost."
        }
      ]
    },
    "links": {
      "officialUrl": "https://cloud.google.com/startup"
    },
    "placement": {
      "featured": true,
      "featuredRank": 3
    },
    "audiences": [
      "startups",
      "developers"
    ]
  },
  {
    "id": "o-google-cloud-students-google-skills-credits",
    "slug": "google-cloud-students-google-skills-credits",
    "productId": "google-cloud",
    "title": "200 free Google Skills credits for students",
    "summary": "Students can request 200 free Google Skills credits for Google Cloud hands-on labs, skill badges and courses. The credits expire one year after they are issued.",
    "description": "Google Cloud for Education gives students free access to Google Cloud training on Google Skills, including online labs, skill badges and courses. Students can request 200 free Google Skills credits through a form on the Google Cloud students page.\n\nThese credits are for Google Skills training content, not for general Google Cloud usage. They expire one year after they are issued.",
    "type": "student",
    "categories": [
      "student-discounts",
      "free-credits"
    ],
    "source": "official",
    "claim": {
      "method": "application",
      "note": "Credits are requested through the 'Request credits' form on the Google Cloud students page."
    },
    "eligibility": [
      "Students (the offer is published on Google Cloud's student page)."
    ],
    "redemption": [
      "Open the Google Cloud for students page.",
      "Select 'Request credits' and complete the request form.",
      "Use the credits for labs, skill badges and courses on Google Skills."
    ],
    "terms": [
      "Credits expire one year after they are issued.",
      "Credits are Google Skills training credits, not Google Cloud billing credits."
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against the provider's official page",
      "evidence": [
        {
          "claim": "200 Google Skills credits for students",
          "quote": "Students can request access to free online labs, skill badges, and courses through Google Skills."
        },
        {
          "claim": "Credit amount",
          "quote": "200 free Google Skills credits"
        },
        {
          "claim": "Expiry one year after issue",
          "quote": "Credits expire one year after they are issued"
        },
        {
          "claim": "Claim via request",
          "quote": "Request credits"
        }
      ]
    },
    "links": {
      "officialUrl": "https://cloud.google.com/edu/students"
    },
    "audiences": [
      "students",
      "developers"
    ]
  },
  {
    "id": "o-microsoft-for-startups-azure-credits",
    "slug": "microsoft-for-startups-azure-credits",
    "productId": "microsoft-azure",
    "title": "Microsoft for Startups: up to $150,000 in Startup credits",
    "summary": "Microsoft for Startups gives startups access to AI models, developer tools and up to $150,000 in Startup credits that can be used on eligible Azure services.",
    "description": "Microsoft for Startups is Microsoft's program for founders. It offers Startup credits, AI tools and technical resources. Microsoft says startups can access up to $150,000 in Startup credits, which can be applied to eligible Azure services from early development through production workloads.\n\nStartups apply online and receive a confirmation email. Microsoft says it typically evaluates applications in about three business days. The landing page does not list detailed eligibility criteria or how long the credits remain valid, and the full $150,000 amount is described as an upper limit.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits",
      "ai-tools"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "creditValue": 150000,
      "savingsLabel": "Up to $150,000 in Startup credits"
    },
    "claim": {
      "method": "application",
      "note": "Apply through the 'Get started now' link on the Microsoft for Startups page."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Startups that apply to and are accepted into Microsoft for Startups. Detailed criteria are not listed on the landing page."
    ],
    "redemption": [
      "Go to the Microsoft for Startups page and select 'Get started now'.",
      "Complete the application.",
      "Wait for the evaluation, typically about three business days.",
      "Apply the credits to eligible Azure services."
    ],
    "terms": [
      "Credits can be applied across eligible Azure services.",
      "The amount is stated as 'up to $150,000'; the actual amount may be lower."
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against the provider's official page",
      "evidence": [
        {
          "claim": "creditValue up to 150000",
          "quote": "Access cutting-edge AI models, developer tools, and up to $150,000 in credits, backed by Microsoft’s global customer network, enterprise-grade security, and privacy you can trust."
        },
        {
          "claim": "Credits usable on eligible Azure services",
          "quote": "Credits can be applied across eligible Azure services to support your startup from early development through production workloads."
        },
        {
          "claim": "Program description",
          "quote": "The program offers benefits like Startup credits, AI tools, and resources to help you build, scale, and sell your solutions."
        },
        {
          "claim": "approvalRequired; evaluation time (from https://www.microsoft.com/en-us/startups/investors)",
          "quote": "After applying, startups receive a confirmation email. The Microsoft for Startups team typically takes three business days to evaluate applications, though response times may be delayed if additional information verification is needed."
        },
        {
          "claim": "Corroborating amount (from https://www.microsoft.com/en-us/startups/ai)",
          "quote": "Sign up today to explore Microsoft for Startups and discover the tools, resources, expertise, and opportunities available to help support your startup’s growth, with access to up to $150K in Startup credits."
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.microsoft.com/en-us/startups"
    },
    "audiences": [
      "startups",
      "developers"
    ]
  },
  {
    "id": "o-notion-for-startups",
    "slug": "notion-for-startups",
    "productId": "notion",
    "title": "Notion for Startups: up to 6 months of the Business Plan free",
    "summary": "New, non-paying startups can get up to 6 months of Notion's Business Plan, including Notion AI, at no cost. The length depends on whether the startup applies through a Notion partner.",
    "description": "Notion runs a startup program that gives eligible new customers free time on its Business Plan, which includes Notion AI.\n\nStartups affiliated with a Notion partner can receive up to 6 months free by requesting a code from the partner and including it in the application. Startups without a partner may qualify for 3 months, and SMBs, service businesses or teams under 10 employees that do not meet the startup criteria may receive 1 month.\n\nApplications are reviewed and Notion must be able to verify company details such as a working website and company email.",
    "type": "startup",
    "categories": [
      "software-deals",
      "saas-discounts",
      "startup-perks",
      "ai-tools"
    ],
    "source": "official",
    "pricing": {
      "durationMonths": 6,
      "savingsLabel": "Up to 6 months of Business Plan free",
      "currency": "USD"
    },
    "claim": {
      "method": "application",
      "note": "Partner-affiliated startups request a code from their partner and include it in the application."
    },
    "requirements": {
      "newCustomersOnly": true,
      "approvalRequired": true
    },
    "eligibility": [
      "New, non-paying Notion customers only",
      "6-month offer: affiliated with a Notion partner, with a valid Notion domain, a public company website, a company email and fewer than 100 employees",
      "3-month offer: startups without a partner that meet Notion's startup criteria and can be verified",
      "1-month offer: SMBs, service-based businesses or teams under 10 employees"
    ],
    "redemption": [
      "If affiliated with a partner, request a code from that partner",
      "Submit the application from Notion's startup program page, including the partner code if you have one",
      "Wait for Notion to verify the application"
    ],
    "terms": [
      "Incomplete or unclear company information can prevent verification",
      "The 3- and 6-month offers are intended for startups with scalable, tech-related products"
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "evidence": [
        {
          "claim": "6 months free of Business Plan with Notion AI for partner-affiliated startups",
          "quote": "If you're affiliated with one of our partners and meet the program requirements, you may be eligible for 6 months free of Notion's Business Plan (including Notion AI)."
        },
        {
          "claim": "3-month offer without a partner",
          "quote": "You may still qualify for a 3 month offer if you meet our startup eligibility criteria and we can verify your application details."
        },
        {
          "claim": "1-month fallback tier",
          "quote": "This typically applies when a company doesn't meet our startup eligibility criteria or we're unable to fully verify startup status based on the information provided."
        },
        {
          "claim": "New customers only",
          "quote": "To qualify, you must be a new, non-paying Notion customer and meet our program requirements."
        },
        {
          "claim": "Verification can be affected by incomplete info",
          "quote": "Incomplete or unclear information (e.g., an inactive website, limited company presence, or insufficient business details) can also impact our ability to verify eligibility."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.notion.com/help/notion-for-startups"
    },
    "audiences": [
      "startups",
      "office-tools"
    ]
  },
  {
    "id": "o-atlassian-for-startups",
    "slug": "atlassian-for-startups",
    "productId": "atlassian-cloud",
    "title": "Atlassian for Startups: Premium cloud products free for 12 months",
    "summary": "Eligible startups can use the Premium edition of Atlassian cloud products such as Jira and Confluence for $0 for 12 months, for up to 50 users.",
    "description": "Atlassian for Startups gives approved early-stage companies 12 months of Atlassian cloud products at no cost, including Jira and Confluence Premium, for up to 50 users.\n\nThe program is aimed at VC-funded startups or companies associated with a partner accelerator or incubator that have raised no more than US$10 million and are not existing paid Atlassian customers.\n\nEvery application is reviewed, and Atlassian may ask for proof of funding. Each startup can enroll for one 12-month period.",
    "type": "startup",
    "categories": [
      "software-deals",
      "saas-discounts",
      "startup-perks"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "durationMonths": 12,
      "savingsLabel": "Premium for $0 for 12 months, up to 50 users"
    },
    "claim": {
      "method": "application"
    },
    "requirements": {
      "newCustomersOnly": true,
      "approvalRequired": true
    },
    "eligibility": [
      "Not an existing Atlassian paid customer",
      "VC funded or associated with a partner accelerator and/or incubator",
      "Has not raised more than US$10 million in external funding"
    ],
    "redemption": [
      "Apply on the Atlassian for Startups page",
      "Provide additional information such as proof of funding if requested",
      "Once approved, use the products free for 12 months"
    ],
    "terms": [
      "Up to 50 users",
      "Each eligible startup can enroll for one 12-month period"
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "evidence": [
        {
          "claim": "Premium for $0 for 12 months, up to 50 users",
          "quote": "Eligible startups can get the Premium edition of our products for $0 for 12 months for up to 50 users."
        },
        {
          "claim": "Eligibility criteria",
          "quote": "Your company is not an existing Atlassian paid customer, VC funded or associated with a partner accelerator and/or incubator, and has not raised more than US$10 million in external funding."
        },
        {
          "claim": "Applications are reviewed; proof of funding may be requested",
          "quote": "You may be asked to provide additional information, such as proof of funding (e.g., Crunchbase or Pitchbook profile)."
        },
        {
          "claim": "One enrollment per startup",
          "quote": "Each eligible startup can enroll for one 12-month period."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.atlassian.com/software/startups"
    },
    "audiences": [
      "startups",
      "businesses",
      "office-tools"
    ]
  },
  {
    "id": "o-linear-for-startups",
    "slug": "linear-for-startups",
    "productId": "linear",
    "title": "Linear for Startups: up to 6 months of the Business plan free via partners",
    "summary": "Startups affiliated with an official Linear partner can get up to six months of Linear's Business plan free. The offer is for non-paying Linear users with fewer than 50 employees.",
    "description": "Linear offers a startup promotion that is only available through its official partners, such as accelerators and investors, which provide a dedicated link or code.\n\nEligible companies receive up to six months of the Business plan at no cost. After the promotional period the subscription renews at the standard rate unless the team switches plans or cancels.\n\nThe redeeming user must be an admin of the Linear workspace.",
    "type": "startup",
    "categories": [
      "software-deals",
      "saas-discounts",
      "startup-perks"
    ],
    "source": "official",
    "pricing": {
      "durationMonths": 6,
      "savingsLabel": "Up to 6 months of Business free",
      "currency": "USD"
    },
    "claim": {
      "method": "link",
      "note": "Requires a dedicated link or code from an official Linear partner."
    },
    "requirements": {
      "newCustomersOnly": true
    },
    "eligibility": [
      "Affiliated with an official Linear partner",
      "Non-paying Linear user",
      "Fewer than 50 employees"
    ],
    "redemption": [
      "Get the dedicated link or code from your Linear partner",
      "Log in to Linear as a workspace admin",
      "Redeem the link or code"
    ],
    "terms": [
      "Renews automatically at the standard rate when the discount ends unless you switch plans or cancel beforehand"
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "evidence": [
        {
          "claim": "Up to six months free of Business plan",
          "quote": "up to six months free"
        },
        {
          "claim": "Eligibility",
          "quote": "non-paying Linear users with less than 50 employees"
        },
        {
          "claim": "Partner requirement",
          "quote": "Only companies affiliated with an official Linear partner can participate"
        },
        {
          "claim": "Admin requirement",
          "quote": "You need to be an admin of your Linear workspace and logged into your account to redeem the offer."
        },
        {
          "claim": "Renewal",
          "quote": "the subscription automatically renews at the standard rate unless you switch plans or cancel beforehand"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://linear.app/startups"
    },
    "audiences": [
      "startups",
      "developers",
      "office-tools"
    ]
  },
  {
    "id": "o-google-ai-pro-free-for-us-students",
    "slug": "google-ai-pro-free-for-us-students",
    "productId": "google-ai-pro",
    "title": "Google AI Pro free for one year for eligible U.S. college students",
    "summary": "Eligible U.S. college students aged 18+ can get one year of Google AI Pro at no cost, redeemable until December 31, 2026. It renews at $19.99/month unless cancelled.",
    "description": "Google offers a free year of its Google AI Pro plan to eligible U.S. college students aged 18 and over. Students in many other countries are offered Google AI Plus instead under separate regional terms.\n\nA valid payment method is required at sign-up, and the plan charges $19.99 per month after the free period unless cancelled. Student status must be re-verified each year to keep access.\n\nThe offer must be redeemed by December 31, 2026.",
    "type": "student",
    "categories": [
      "software-deals",
      "ai-tools",
      "student-discounts",
      "free-trials"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "durationMonths": 12,
      "renewalPrice": 19.99,
      "renewalPeriod": "month",
      "savingsLabel": "1 year of Google AI Pro free"
    },
    "claim": {
      "method": "verification"
    },
    "requirements": {
      "cardRequired": true,
      "studentVerification": true
    },
    "regions": {
      "scope": "limited",
      "note": "Google AI Pro offer is for U.S. college students; other markets have a separate Google AI Plus student offer."
    },
    "eligibility": [
      "Eligible U.S. college students",
      "Aged 18 or older",
      "Eligibility must be verified each year"
    ],
    "redemption": [
      "Go to Google's Gemini for Students page",
      "Verify your student status",
      "Add a valid payment method and start the plan"
    ],
    "terms": [
      "Valid form of payment required at sign-up",
      "Charges $19.99/month after the trial ends unless cancelled earlier",
      "Redeem by December 31, 2026"
    ],
    "expiresAt": "2026-12-31",
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "evidence": [
        {
          "claim": "Eligibility: U.S. college students 18+, verified yearly",
          "quote": "The free Google AI Pro student offer is available to eligible U.S. college students ages 18+. Eligibility must be verified each year to maintain access."
        },
        {
          "claim": "Redemption deadline",
          "quote": "Redeem until December 31, 2026"
        },
        {
          "claim": "Payment method required",
          "quote": "Valid form of payment required at sign-up."
        },
        {
          "claim": "Renewal price",
          "quote": "Unless cancelled earlier, Google AI Pro will automatically charge $19.99/month after the trial ends."
        },
        {
          "claim": "One year duration",
          "quote": "eligible college students can get one year of Google AI Pro in the US, or Google AI Plus in 140+ countries at no cost."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://gemini.google/students/"
    },
    "audiences": [
      "students",
      "ai-tools"
    ]
  },
  {
    "id": "o-canva-pro-30-day-free-trial",
    "slug": "canva-pro-30-day-free-trial",
    "productId": "canva",
    "title": "Canva Pro 30-day free trial",
    "summary": "Canva offers a 30-day free trial of Canva Pro, available once per account and once per payment method.",
    "description": "Canva lets users try its Pro plan free for 30 days. The trial can be used once per Canva account and once per payment method.\n\nDuring the trial, AI usage allowances match Canva Free; the larger AI allowance applies after purchasing a paid plan. If the trial was started without payment details it ends automatically without a charge.\n\nEnding the trial early from Billing starts the paid plan immediately and forfeits remaining trial days.",
    "type": "free-trial",
    "categories": [
      "software-deals",
      "free-trials",
      "ai-tools"
    ],
    "source": "official",
    "pricing": {
      "dealPrice": 0,
      "savingsLabel": "30 days of Canva Pro free",
      "currency": "USD"
    },
    "claim": {
      "method": "link"
    },
    "eligibility": [
      "One trial per Canva account",
      "One trial per payment method"
    ],
    "redemption": [
      "Go to canva.com/pro",
      "Start the free trial",
      "Check the trial end date under Billing in account settings"
    ],
    "terms": [
      "Trials include the same AI allowance as Canva Free",
      "Skipping the trial early forfeits remaining trial days",
      "If started without payment details, the trial ends automatically with no charge"
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Taken from the provider's official site via search extracts. Not yet confirmed on the live page.",
      "evidence": [
        {
          "claim": "30-day trial",
          "quote": "You can try Canva Pro for free with a 30-day trial."
        },
        {
          "claim": "Once per account and payment method",
          "quote": "The free trial is available once per Canva account and once per payment method."
        },
        {
          "claim": "AI allowance during trial",
          "quote": "Trials include the same size allowance as Canva Free."
        },
        {
          "claim": "Ending early",
          "quote": "you'll lose any remaining trial days if you skip your trial early"
        },
        {
          "claim": "No charge without payment details",
          "quote": "If you started a free trial without providing payment details, your trial ends automatically and you won't be charged."
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.canva.com/pro/"
    },
    "audiences": [
      "creators",
      "designers",
      "freelancers",
      "marketing-tools"
    ]
  },
  {
    "id": "o-penpot-open-source-design-tool",
    "slug": "penpot-open-source-design-tool",
    "productId": "penpot",
    "title": "Penpot: self-host the open-source design platform",
    "summary": "Penpot is released under the Mozilla Public License 2.0 and can be deployed on your own infrastructure as an open-source alternative to hosted design tools.",
    "description": "Penpot is a collaborative design and prototyping platform built around open standards like SVG, CSS, HTML and JSON. Its inspect tab exposes code for designs directly.\n\nThe project is deployment agnostic: it can be used through the developer's hosted service or installed on your own servers, with documented options including Docker and Kubernetes.\n\nThe source code is licensed under MPL-2.0, which grants a royalty-free licence. A separate paid plan, Penpot Enterprise, targets organisations that need advanced governance, security and administration.",
    "type": "open-source",
    "categories": [
      "open-source"
    ],
    "source": "official",
    "pricing": {
      "dealPrice": 0,
      "savingsLabel": "Royalty-free MPL-2.0 licence",
      "currency": "USD"
    },
    "claim": {
      "method": "link",
      "note": "Download from the official repository and self-host (Docker, Kubernetes and other options)"
    },
    "eligibility": [
      "Anyone able to accept the terms of the Mozilla Public License 2.0"
    ],
    "redemption": [
      "Open the official Penpot repository on GitHub",
      "Follow the self-hosting instructions (Docker, Kubernetes or other options)",
      "Run Penpot on your own infrastructure"
    ],
    "terms": [
      "Licensed under the Mozilla Public License, v. 2.0",
      "Penpot Enterprise is a separate paid plan"
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against the project's official GitHub repository (README and licence)",
      "evidence": [
        {
          "claim": "Licence",
          "quote": "This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0."
        },
        {
          "claim": "Licence grant is royalty-free (from LICENSE file, https://raw.githubusercontent.com/penpot/penpot/develop/LICENSE)",
          "quote": "Each Contributor hereby grants You a world-wide, royalty-free, non-exclusive license:"
        },
        {
          "claim": "Open source and designed for self-hosting",
          "quote": "Built on open source and designed for self-hosting, it puts teams in complete control of their design environment"
        },
        {
          "claim": "Hosted or self-deployed",
          "quote": "You can use it in our SAAS or deploy it anywhere."
        },
        {
          "claim": "Install options",
          "quote": "Learn how to install it with Docker, Kubernetes, Elestio or other options on our website."
        },
        {
          "claim": "Open standards",
          "quote": "Penpot works with open standards like SVG, CSS, HTML, and JSON."
        },
        {
          "claim": "Paid enterprise plan exists",
          "quote": "Penpot Enterprise is our paid plan for organizations that need to scale their design work across multiple teams"
        },
        {
          "claim": "Provider",
          "quote": "Penpot is a Kaleidos’ open source project"
        }
      ]
    },
    "links": {
      "officialUrl": "https://github.com/penpot/penpot"
    },
    "placement": {
      "featured": true,
      "featuredRank": 5
    },
    "audiences": [
      "designers"
    ]
  },
  {
    "id": "o-plausible-community-edition-self-hosted",
    "slug": "plausible-community-edition-self-hosted",
    "productId": "plausible-community-edition",
    "title": "Plausible Community Edition: free self-hosted analytics",
    "summary": "Plausible Community Edition is the AGPL-3.0 self-hosted version of Plausible's privacy-focused analytics, with no fees payable to the developer.",
    "description": "Plausible Community Edition (CE) is the self-hosted edition of Plausible, a lightweight, cookie-free web analytics tool. The developer describes it as free as in beer; you only cover your own server, CDN and backup costs.\n\nCE is a long-term release published twice per year, so newer features reach it later than the managed cloud service. Some premium features (marketing funnels, ecommerce revenue goals, SSO and the sites API) are not included, and bot filtering is more basic.\n\nCE is community supported only, without premium support. You can host it on any server in any country and get direct access to the raw database.",
    "type": "open-source",
    "categories": [
      "open-source"
    ],
    "source": "official",
    "pricing": {
      "dealPrice": 0,
      "savingsLabel": "Free to self-host",
      "currency": "USD"
    },
    "claim": {
      "method": "link",
      "note": "Download and self-host from the official repository"
    },
    "eligibility": [],
    "redemption": [
      "Open the official Plausible repository on GitHub",
      "Follow the Community Edition installation guide",
      "Run Plausible CE on your own server"
    ],
    "terms": [
      "Licensed under the GNU AGPL v3 or any later version",
      "You pay for your own infrastructure (server, CDN, backups)",
      "Community support only; no premium support",
      "Long-term release published twice per year",
      "Excludes marketing funnels, ecommerce revenue goals, SSO and the sites API"
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against the project's official GitHub repository (README and licence)",
      "evidence": [
        {
          "claim": "Licence",
          "quote": "GNU Affero General Public License Version 3 (AGPLv3) or any later version."
        },
        {
          "claim": "Free self-hosted edition",
          "quote": "we have a free as in beer and self-hosted solution called Plausible Community Edition (CE)"
        },
        {
          "claim": "No fees to the developer",
          "quote": "You never have to pay any fees to us."
        },
        {
          "claim": "Product description",
          "quote": "Open source, privacy-first web analytics. Lightweight, cookie-free Google Analytics alternative. Self-hosted or cloud."
        },
        {
          "claim": "Release cadence",
          "quote": "It's a long term release published twice per year so latest features and improvements won't be immediately available."
        },
        {
          "claim": "Features not in CE",
          "quote": "marketing funnels, ecommerce revenue goals, SSO and sites API"
        },
        {
          "claim": "Support",
          "quote": "CE is community supported only."
        },
        {
          "claim": "Hosting location",
          "quote": "You have full control and can host your instance on any server in any country that you wish."
        },
        {
          "claim": "Cloud is a paid subscription (no price stated on page)",
          "quote": "There's a cost associated with providing an analytics service so we charge a subscription fee."
        }
      ]
    },
    "links": {
      "officialUrl": "https://github.com/plausible/analytics"
    },
    "audiences": [
      "marketing-tools"
    ]
  },
  {
    "id": "o-nextcloud-self-hosted-file-sync",
    "slug": "nextcloud-self-hosted-file-sync",
    "productId": "nextcloud",
    "title": "Nextcloud: self-host your own file sync and collaboration server",
    "summary": "Nextcloud server is licensed under the AGPLv3 or later and can be installed on your own hardware; the official All-in-One installer is free for up to 100 users.",
    "description": "Nextcloud lets you keep files, contacts and calendars synchronised between your devices on a server you choose, and can be extended with hundreds of apps.\n\nNextcloud All-in-One (AIO) is the official installation method and bundles most features into one instance, with Nextcloud Office available as an optional component.\n\nAccording to the AIO documentation, up to 100 users are free; larger deployments are possible with the paid Nextcloud Enterprise offering from Nextcloud GmbH.",
    "type": "open-source",
    "categories": [
      "open-source"
    ],
    "source": "official",
    "pricing": {
      "dealPrice": 0,
      "savingsLabel": "Free for up to 100 users (AIO)",
      "currency": "USD"
    },
    "claim": {
      "method": "link",
      "note": "Install on your own hardware or with the official All-in-One installer"
    },
    "eligibility": [
      "Free use via All-in-One covers up to 100 users; more requires Nextcloud Enterprise"
    ],
    "redemption": [
      "Open the official Nextcloud All-in-One repository on GitHub",
      "Follow the installation instructions on your own server",
      "Enable optional components such as Nextcloud Office if needed"
    ],
    "terms": [
      "Contributions since June 16, 2016 are licensed under the AGPLv3 or any later version",
      "More than 100 users are possible with Nextcloud Enterprise"
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against the project's official GitHub repository (README and licence)",
      "evidence": [
        {
          "claim": "Licence",
          "quote": "licensed under the AGPLv3 or any later version"
        },
        {
          "claim": "Self-hosting",
          "quote": "Install a server by yourself on your hardware or by using one of our ready-to-use appliances"
        },
        {
          "claim": "Server of your choice",
          "quote": "You can store your files, contacts, calendars, and more on a server of your choosing."
        },
        {
          "claim": "Sync features",
          "quote": "You keep your files, contacts, calendars, and more synchronized amongst your devices."
        },
        {
          "claim": "Apps",
          "quote": "Expandable with hundreds of Apps"
        },
        {
          "claim": "Paid enterprise offering exists",
          "quote": "Nextcloud Enterprise provided by Nextcloud GmbH."
        },
        {
          "claim": "Official install method (from https://raw.githubusercontent.com/nextcloud/all-in-one/main/readme.md)",
          "quote": "The official Nextcloud installation method. Nextcloud AIO provides easy deployment and maintenance with most features included in this one Nextcloud instance."
        },
        {
          "claim": "Free up to 100 users (AIO FAQ)",
          "quote": "Up to 100 users are free, more are possible with Nextcloud Enterprise"
        },
        {
          "claim": "Nextcloud Office optional in AIO",
          "quote": "Nextcloud Office (optional)"
        }
      ]
    },
    "links": {
      "officialUrl": "https://github.com/nextcloud/server"
    },
    "audiences": [
      "businesses",
      "office-tools"
    ]
  },
  {
    "id": "o-mattermost-self-hosted-team-chat",
    "slug": "mattermost-self-hosted-team-chat",
    "productId": "mattermost",
    "title": "Mattermost: self-hosted open-core team chat",
    "summary": "Mattermost publishes monthly compiled releases under an MIT licence and documents self-hosted deployment via Docker, Ubuntu, tar or Kubernetes.",
    "description": "Mattermost is an open-core collaboration platform with chat, workflow automation, voice calling, screen sharing and AI integration. It is written in Go and React and relies on PostgreSQL.\n\nCompiled versions produced by Mattermost, Inc. are licensed under an MIT licence, with a new compiled release every month on the 16th. Builds made from source are covered by the GNU AGPL v3.0 (with stated exceptions) or a commercial licence, and admin tools and configuration files are under Apache 2.0.\n\nThe repository also contains a separate enterprise licence file, so some functionality may sit outside the open-source licences; check the licence files before deploying.",
    "type": "open-source",
    "categories": [
      "open-source"
    ],
    "source": "official",
    "pricing": {
      "savingsLabel": "MIT-licensed compiled releases",
      "currency": "USD"
    },
    "claim": {
      "method": "link",
      "note": "Deploy a self-hosted instance via Docker, Ubuntu, tar or Kubernetes"
    },
    "eligibility": [],
    "redemption": [
      "Open the official Mattermost repository on GitHub",
      "Choose a deployment guide (Docker, Ubuntu, tar or Kubernetes)",
      "Install and configure your own Mattermost instance"
    ],
    "terms": [
      "Compiled versions produced by Mattermost, Inc. are licensed under MIT",
      "Self-built versions from source: GNU AGPL v3.0 (with exceptions) or a commercial licence",
      "Admin tools and configuration files: Apache License v2.0",
      "Use of the Mattermost trademark requires prior written approval"
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against the project's official GitHub repository (README and licence)",
      "evidence": [
        {
          "claim": "Open core and self-hosted",
          "quote": "Mattermost is an open core, self-hosted collaboration platform that offers chat, workflow automation,"
        },
        {
          "claim": "Monthly MIT compiled releases",
          "quote": "A new compiled version is released under an MIT license every month on the 16th."
        },
        {
          "claim": "Self-hosted deployment",
          "quote": "Deploy a Mattermost Self-hosted instance in minutes via Docker, Ubuntu, or tar."
        },
        {
          "claim": "Deployment choice",
          "quote": "Deploy Mattermost on-premises, or try it for free in the cloud."
        },
        {
          "claim": "MIT for compiled builds (LICENSE.txt, https://raw.githubusercontent.com/mattermost/mattermost/master/LICENSE.txt)",
          "quote": "You are licensed to use compiled versions of the Mattermost platform produced by Mattermost, Inc. under an MIT LICENSE"
        },
        {
          "claim": "AGPL for source builds (LICENSE.txt)",
          "quote": "Under the Free Software Foundation's GNU AGPL v3.0, subject to the exceptions outlined in this policy"
        },
        {
          "claim": "Apache for admin tools/config (LICENSE.txt)",
          "quote": "under the Apache License v2.0"
        }
      ]
    },
    "links": {
      "officialUrl": "https://github.com/mattermost/mattermost"
    },
    "audiences": [
      "businesses",
      "office-tools"
    ]
  },
  {
    "id": "o-betterdisplay-pro-perpetual-licence",
    "slug": "betterdisplay-pro-perpetual-licence",
    "productId": "betterdisplay",
    "title": "BetterDisplay Pro: perpetual licence, not a subscription",
    "summary": "BetterDisplay Pro is sold as a perpetual licence for $21.99 / €19.99 and includes at least one year of updates, including major upgrades in that period.",
    "description": "BetterDisplay gives Mac users control over their displays from the menu bar. Many features are free for non-business use, while features marked in the documentation require a Pro licence.\n\nThe Pro licence is perpetual rather than a subscription: you keep using the versions covered by your licence. A purchase includes at least one year of updates, including major upgrades released during that period, and access to the current major version plus previous versions where needed for compatibility.\n\nA 14-day trial covers all Pro features. The developer states that betterdisplay.pro is the only official site and warns about lookalike sites.",
    "type": "lifetime",
    "categories": [
      "lifetime-deals",
      "software-deals"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 21.99,
      "period": "one-time",
      "savingsLabel": "Perpetual $21.99 licence"
    },
    "claim": {
      "method": "link",
      "note": "Buy at betterdisplay.pro or in the app under Settings > Pro > Buy BetterDisplay Pro"
    },
    "lifetime": {
      "licenceCovers": "Perpetual use of covered versions; at least one year of updates, including major upgrades released during that period"
    },
    "eligibility": [
      "Requires a Mac; BetterDisplay 5 needs macOS 26 Tahoe (26.3 or later) and fully supports macOS 27 Golden Gate; BetterDisplay 4 supports macOS Ventura (13.2 or later), Sonoma, Sequoia and Tahoe, and its latest version adds macOS 27 Golden Gate compatibility"
    ],
    "redemption": [
      "Optionally evaluate all Pro features with the 14-day trial",
      "Purchase a Pro licence at betterdisplay.pro or in the app under Settings > Pro > Buy BetterDisplay Pro",
      "Keep using the versions covered by your licence after the update period"
    ],
    "terms": [
      "Price listed as $21.99 / €19.99; price, currency and taxes may vary by country or state",
      "Includes at least one year of updates, including major upgrades released during that period",
      "Covers the current major version and previous versions where needed for compatibility",
      "Licence terms and refund policy are published separately at betterdisplay.pro/license (not reviewed here)"
    ],
    "publishedAt": "2026-10-17",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against the project's official GitHub repository (README and licence)",
      "evidence": [
        {
          "claim": "Price and currency",
          "quote": "Pricing is $21.99 / €19.99; price, currency, and taxes may vary by country or state."
        },
        {
          "claim": "Perpetual, not subscription",
          "quote": "The license is perpetual, not a subscription: you can continue using the versions covered by your license."
        },
        {
          "claim": "Updates period",
          "quote": "Your purchase includes at least one year of updates, including major upgrades released during that period."
        },
        {
          "claim": "Version coverage",
          "quote": "A Pro license provides access to the current major version and previous versions where needed for compatibility."
        },
        {
          "claim": "Free tier",
          "quote": "Many features are available free for non-business use."
        },
        {
          "claim": "Trial",
          "quote": "A 14-day trial lets you evaluate all Pro features before purchasing."
        },
        {
          "claim": "In-app purchase path",
          "quote": "You can also purchase a license in the app under Settings > Pro > Buy BetterDisplay Pro."
        },
        {
          "claim": "Official channels",
          "quote": "The only official site is betterdisplay.pro, the GitHub repository is waydabber/BetterDisplay."
        },
        {
          "claim": "System requirements (v5)",
          "quote": "BetterDisplay 5: Apple Silicon and Intel Macs running macOS 26 Tahoe (26.3 or later)"
        },
        {
          "claim": "System requirements (v4)",
          "quote": "BetterDisplay 4: Macs running macOS Ventura (13.2 or later), Sonoma, Sequoia, Tahoe."
        },
        {
          "claim": "Price unchanged",
          "quote": "Pricing is $21.99 / €19.99; price, currency, and taxes may vary by country or state."
        },
        {
          "claim": "Perpetual licence",
          "quote": "The license is perpetual, not a subscription: you can continue using the versions covered by your license."
        },
        {
          "claim": "v5 system requirements now include macOS 27",
          "quote": "BetterDisplay 5: Apple Silicon and Intel Macs running macOS 26 Tahoe (26.3 or later), with full support for macOS 27 Golden Gate."
        },
        {
          "claim": "v4 updated for macOS 27",
          "quote": "BetterDisplay 4: Macs running macOS Ventura (13.2 or later), Sonoma, Sequoia, Tahoe. The latest version of BetterDisplay 4 was updated with macOS 27 Golden Gate compatibility."
        }
      ]
    },
    "links": {
      "officialUrl": "https://github.com/waydabber/BetterDisplay"
    },
    "audiences": [
      "freelancers"
    ]
  },
  {
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "source": "official",
    "id": "o-aws-activate-startup-credits",
    "slug": "aws-activate-startup-credits",
    "productId": "aws",
    "title": "AWS Activate: up to $200,000 in AWS credits for startups",
    "summary": "AWS Activate gives startups AWS credits: $1,000 on the Founders tier for self-funded startups, and up to $200,000 on the Portfolio tier for startups backed by an Activate Provider.",
    "description": "AWS Activate is Amazon Web Services' credit program for startups. The Founders tier offers $1,000 in Activate Credits to self-funded startups that are not linked to an Activate Provider; AWS says select startups may qualify for up to $5,000 over time.\n\nThe Portfolio tier is for startups associated with an Activate Provider, such as an accelerator, angel investor or venture capital firm. Applicants need an Organization ID (Org ID) from that provider. Current AWS pages list this tier at up to $200,000; some older AWS pages still show $100,000.\n\nApplicants should be pre-Series B, founded in the last 10 years, and have a working company website. Startups can reapply for a larger package, but the award is typically the difference from what they already received.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 200000
    },
    "claim": {
      "method": "application",
      "note": "Apply through the AWS Activate site. Portfolio applicants enter the Org ID from their Activate Provider."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Founded in the past 10 years",
      "Self-funded or pre-Series B (most recent funding round within the last 12 months, if applicable)",
      "A fully functioning company website",
      "New to Activate Credits, or requesting more than previously received",
      "Portfolio tier: associated with an Activate Provider and holding its Organization ID"
    ],
    "redemption": [
      "Choose the Founders tier, or get an Org ID from your Activate Provider for the Portfolio tier",
      "Submit the application on the AWS Activate site",
      "Wait for AWS to notify you of your application status"
    ],
    "terms": [
      "Founders tier: $1,000 in Activate Credits; select startups may qualify for up to $5,000 over time",
      "Org IDs are confidential and are not promotional codes",
      "Reapplying for a higher package typically awards only the difference from your previous credits"
    ],
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Official pages could not be loaded from the research environment (WebFetch DNS failures, curl blocked). Facts and quotes come from search-engine extracts of the provider's own pages; quotes may be excerpted. Re-check the live page before marking verified. AWS pages conflict on the Portfolio maximum: newer pages say up to $200,000, older pages (e.g. the step-by-step guide and gaming page) say up to $100,000. Confirm the figure before publishing.",
      "evidence": [
        {
          "claim": "Founders amount",
          "quote": "The Activate Founders tier offers $1,000 in AWS Activate Credits to support early-stage startups. Select startups may qualify for up to $5,000 over time."
        },
        {
          "claim": "Portfolio amount (current pages)",
          "quote": "Up to $200,000 USD in Activate Credits"
        },
        {
          "claim": "Portfolio Org ID requirement",
          "quote": "you must have an Organization ID (Org ID) from your Activate Provider, such as an accelerator, angel investor, and venture capital firm"
        },
        {
          "claim": "Funding stage",
          "quote": "self-funded or pre-Series B (most recent funding round must be within the last 12 months, if applicable)"
        },
        {
          "claim": "Website",
          "quote": "a fully functioning company website"
        },
        {
          "claim": "Company age",
          "quote": "founded in the past 10 years"
        },
        {
          "claim": "Org ID not a promo code",
          "quote": "An Org ID is not a promotional code and should not be shared publicly."
        },
        {
          "claim": "Reapplying",
          "quote": "if you have $10K in credits and apply for $200K, you could receive an additional $190K—bringing your total to $200K overall."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://aws.amazon.com/startups/credits/"
    },
    "audiences": [
      "startups",
      "developers"
    ]
  },
  {
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "source": "official",
    "id": "o-cloudflare-startup-program-credits",
    "slug": "cloudflare-startup-program-credits",
    "productId": "cloudflare",
    "title": "Cloudflare Startup Program: up to $350,000 in credits for startups",
    "summary": "Cloudflare's Startup Program gives eligible startups $10k, $100k or $350k in credits depending on funding, valid for one year or until used up.",
    "description": "Cloudflare's Startup Program awards credits in three tiers. Tier 3 ($10k) is for bootstrapped or self-funded startups with under $1M raised. Tier 2 ($100k) and Tier 1 ($350k) are for startups funded by an affiliated partner, with under $5M and $5M or more raised respectively.\n\nApplicants need to be incorporated within the last 10 years, have raised no later than Series B, and be building a technology product. Credits last one year or until fully consumed, whichever comes first, and some services have their own caps.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 350000
    },
    "claim": {
      "method": "application",
      "note": "Apply on Cloudflare's Startup Program page; review typically takes up to 48 hours."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Incorporated within the last 10 years",
      "Raised funding no later than Series B",
      "Building a technology product",
      "A live website, a public presence on LinkedIn, X or GitHub, and a business email on your domain",
      "Tier 2 and Tier 1 require funding from an affiliated partner",
      "Educational institutions, personal blogs, consultancies, service-based agencies, MSPs and resellers are not a good fit"
    ],
    "redemption": [
      "Apply on Cloudflare's Startup Program page",
      "Wait for review, which typically takes up to 48 hours"
    ],
    "terms": [
      "Credits are valid for one year or until fully consumed, whichever comes first",
      "Upgrading tiers does not reset the 1-year program expiration date",
      "One-time opportunity per startup; credits cannot be transferred between accounts",
      "R2 is covered up to a $10,000 cap and Workers AI is capped by tier",
      "Domain registration is excluded; AI Gateway is temporarily not covered"
    ],
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Official pages could not be loaded from the research environment (WebFetch DNS failures, curl blocked). Facts and quotes come from search-engine extracts of the provider's own pages; quotes may be excerpted. Re-check the live page before marking verified. Older Cloudflare blog posts describe a $5K/$25K/$100K/$250K structure; the current startups page says tiers were updated.",
      "evidence": [
        {
          "claim": "Tier amounts",
          "quote": "$10k (Tier 3)"
        },
        {
          "claim": "Tier amounts",
          "quote": "$100k (Tier 2)"
        },
        {
          "claim": "Tier amounts",
          "quote": "$350k (Tier 1)"
        },
        {
          "claim": "Tier 3 criteria",
          "quote": "Bootstrapped or self-funded, under $1M raised"
        },
        {
          "claim": "Maximum",
          "quote": "up to $350,000 in credits"
        },
        {
          "claim": "Validity",
          "quote": "Credits are valid for one year or until fully consumed, whichever comes first."
        },
        {
          "claim": "Upgrade does not extend",
          "quote": "the upgrade does not reset your 1-year program expiration date"
        },
        {
          "claim": "One time, non-transferable",
          "quote": "The Startup Program is a one-time opportunity per startup and credits cannot be transferred between accounts."
        },
        {
          "claim": "Not a fit",
          "quote": "educational institutions, personal blogs, consultancies, service-based agencies, MSPs, and resellers"
        },
        {
          "claim": "Review time",
          "quote": "up to 48 hours"
        },
        {
          "claim": "R2 cap",
          "quote": "up to a $10,000 cap"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.cloudflare.com/startups/"
    },
    "audiences": [
      "startups",
      "developers"
    ]
  },
  {
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "source": "official",
    "id": "o-digitalocean-startups-hatch-credits",
    "slug": "digitalocean-startups-hatch-credits",
    "productId": "digitalocean",
    "title": "DigitalOcean Startups (Hatch): cloud credits through approved partners",
    "summary": "DigitalOcean's startup program, formerly Hatch, awards cloud credits to new startups through approved DigitalOcean Startups partners. The award level depends on the partner.",
    "description": "DigitalOcean Startups, which DigitalOcean also refers to as Hatch, gives credits to startups through approved DigitalOcean Startups partners such as accelerators, incubators and venture firms. DigitalOcean does not publish a single award amount; startups are told to contact their program manager at the partner.\n\nThe program prioritizes AI-native startups and is for new startups that have not used prior credits with DigitalOcean. Service-based businesses are not eligible. Core credits don't cover GPU Droplet usage; GPU credits are a separate benefit for select customers after review.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "claim": {
      "method": "application",
      "note": "Credits are awarded through an approved DigitalOcean Startups partner; contact your partner's program manager."
    },
    "requirements": {
      "approvalRequired": true,
      "newCustomersOnly": true
    },
    "eligibility": [
      "Affiliated with an approved DigitalOcean Startups partner",
      "New startups that have not used prior credits with DigitalOcean",
      "Service-based startups (consulting, web/app development, marketing agencies) are not eligible",
      "AI-native startups are prioritized"
    ],
    "redemption": [
      "Confirm your accelerator, incubator or investor is a DigitalOcean Startups partner",
      "Contact the program manager at your partner to learn your award level and apply"
    ],
    "terms": [
      "Core credits do not cover GPU Droplet usage and may only be used with Qualifying Program Services",
      "GPU credits are a separate benefit for select customers after review of a GPU credit application",
      "Credits are not transferable and are forfeited if not used"
    ],
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Official pages could not be loaded from the research environment (WebFetch DNS failures, curl blocked). Facts and quotes come from search-engine extracts of the provider's own pages; quotes may be excerpted. Re-check the live page before marking verified. Older Hatch blog posts cite up to $50,000 and up to $100,000; the current page gives no fixed amount, so no figure is included.",
      "evidence": [
        {
          "claim": "Partner-awarded",
          "quote": "DigitalOcean awards startups credits through approved DigitalOcean Startups partners. To learn more about your eligibility award level, please contact your program manager at your DigitalOcean Startups Partner."
        },
        {
          "claim": "Hatch naming",
          "quote": "DigitalOcean Startups (Hatch) infrastructure credits"
        },
        {
          "claim": "Service businesses excluded",
          "quote": "service-based startups (consulting services, web/app development services, marketing agencies, etc.) are not eligible"
        },
        {
          "claim": "New startups only",
          "quote": "new startups that have not used prior credits with DigitalOcean"
        },
        {
          "claim": "GPU exclusion",
          "quote": "Core credits do not cover GPU Droplet usage"
        },
        {
          "claim": "GPU credits separate",
          "quote": "GPU credits are a separate benefit that is made available to select customers after review of their GPU credit application and infrastructure needs."
        },
        {
          "claim": "Non-transferable",
          "quote": "The credits are not transferable, and if you do not use them, they will be forfeited."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.digitalocean.com/startups"
    },
    "audiences": [
      "startups",
      "developers"
    ]
  },
  {
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "source": "official",
    "id": "o-mongodb-for-startups-atlas-credits",
    "slug": "mongodb-for-startups-atlas-credits",
    "productId": "mongodb-atlas",
    "title": "MongoDB for Startups: free MongoDB Atlas credits and Voyage AI tokens",
    "summary": "MongoDB for Startups gives early-stage startups free MongoDB Atlas credits, Voyage AI tokens and one-on-one technical advice.",
    "description": "MongoDB for Startups offers free MongoDB Atlas credits, Voyage AI tokens, one-on-one technical advice, co-marketing opportunities and access to MongoDB's partner network. MongoDB does not state a credit amount on the pages we could check.\n\nThe base tier is for early-stage startups under 7 years old and at Series A or earlier, building a single software-based product. Both new and existing Atlas users can apply. Startups have 12 months to activate their promo code and 12 months to use their credits after activation.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "claim": {
      "method": "application",
      "note": "Apply on the MongoDB for Startups page; approved startups receive a promo code."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Early-stage: less than 7 years old and Series A or earlier",
      "Building a single software-based product",
      "New to the program",
      "Active website and LinkedIn profile",
      "Development shops and agencies are not eligible",
      "New and existing MongoDB Atlas users can apply"
    ],
    "redemption": [
      "Apply on the MongoDB for Startups page",
      "Once approved, activate your promo code within 12 months"
    ],
    "terms": [
      "Startups have 12 months to activate their promo code",
      "Once activated, credits must be used within 12 months",
      "Extensions are considered case by case"
    ],
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Official pages could not be loaded from the research environment (WebFetch DNS failures, curl blocked). Facts and quotes come from search-engine extracts of the provider's own pages; quotes may be excerpted. Re-check the live page before marking verified. No current credit amount was found on MongoDB's pages; older pages mention $500 and a 2023 AI track mentioned up to $25,000, so no figure is included.",
      "evidence": [
        {
          "claim": "Benefits",
          "quote": "free MongoDB Atlas credits, Voyage AI tokens, one-on-one technical advice, co-marketing opportunities, and access to our partner network"
        },
        {
          "claim": "Base tier age/stage",
          "quote": "Early-stage: Less than 7 years old and Series A or earlier"
        },
        {
          "claim": "Activation and usage window",
          "quote": "Startups have 12 months to activate their promo code. Once activated, startups have 12 months to use your Atlas credits."
        },
        {
          "claim": "Extensions",
          "quote": "considered on a case-by-case basis"
        },
        {
          "claim": "Existing users",
          "quote": "accepting both new and existing MongoDB Atlas users"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.mongodb.com/solutions/startups"
    },
    "audiences": [
      "startups",
      "developers"
    ]
  },
  {
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "source": "official",
    "id": "o-oracle-startup-growth-engine-oci-credits",
    "slug": "oracle-startup-growth-engine-oci-credits",
    "productId": "oracle-cloud-infrastructure",
    "title": "Oracle Startup Growth Engine: USD 5,000 to USD 60,000 in OCI Universal Credits",
    "summary": "Oracle's Startup Growth Engine gives selected startups Oracle Cloud Infrastructure Universal Credits worth USD 5,000 to USD 60,000, available for 12 months.",
    "description": "The Oracle Startup Growth Engine is Oracle's program for selected startups and digital native companies building on Oracle Cloud Infrastructure (OCI). Its global terms say awards of Universal Credits range from USD 5,000 to USD 60,000 and are available for twelve months from when they are made available.\n\nThe program targets legally registered technology companies with digital products or platforms that can use OCI at scale. Oracle approves each award, may run due diligence, and requires onboarding and an order document. Unused credits expire at the end of the period; after credits run out, the tenancy moves to Pay As You Go pricing.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 60000,
      "durationMonths": 12
    },
    "claim": {
      "method": "application",
      "note": "Apply through Oracle's Startup Growth Engine page; Oracle approves each award."
    },
    "requirements": {
      "approvalRequired": true
    },
    "regions": {
      "scope": "limited",
      "note": "Offered only to business entities in countries or territories designated by Oracle."
    },
    "eligibility": [
      "Legally registered technology company developing digital products or platforms that can use OCI at scale",
      "Existing OCI customers may be included with a substantial business case for growth accepted by Oracle",
      "Business entity in a country or territory designated by Oracle"
    ],
    "redemption": [
      "Apply through the Oracle Startup Growth Engine page",
      "Complete Oracle's review, onboarding and order document"
    ],
    "terms": [
      "Credits are available for twelve months from the date they are made available",
      "Unused credits expire at the end of the period and have no cash value",
      "When credits run out, the tenancy moves to Pay As You Go pricing",
      "Oracle may conduct due diligence on applicants"
    ],
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Official pages could not be loaded from the research environment (WebFetch DNS failures, curl blocked). Facts and quotes come from search-engine extracts of the provider's own pages; quotes may be excerpted. Re-check the live page before marking verified. Regional versions conflict: the Latin America rules (PDF) state USD 5.000 to USD 100.000 and 3 to 12 months. Figures here are from the global/Europe terms page.",
      "evidence": [
        {
          "claim": "Credit range",
          "quote": "the value of Universal Credits available under the Program ranges from USD 5,000 to USD 60,000"
        },
        {
          "claim": "Duration",
          "quote": "available for a period of twelve (12) months from the date they are made available"
        },
        {
          "claim": "Program purpose",
          "quote": "selected startups and digital native companies ready to build and scale on Oracle Cloud Infrastructure (OCI)"
        },
        {
          "claim": "Regions",
          "quote": "the Program is offered solely to business entities in the countries or territories designated by Oracle"
        },
        {
          "claim": "Due diligence",
          "quote": "Oracle may conduct due diligence on applicants"
        },
        {
          "claim": "After credits",
          "quote": "Pay As You Go (PAYG) pricing"
        }
      ],
      "checkedAt": "2026-11-02"
    },
    "links": {
      "officialUrl": "https://www.oracle.com/europe/artificial-intelligence/startup-growth-engine/terms/",
      "redeemUrl": "https://www.oracle.com/europe/artificial-intelligence/startup-growth-engine/"
    },
    "audiences": [
      "startups",
      "developers"
    ]
  },
  {
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "source": "official",
    "id": "o-vercel-for-startups-credits",
    "slug": "vercel-for-startups-credits",
    "productId": "vercel",
    "title": "Vercel for Startups: up to $30,000 in Vercel credits for partner-backed startups",
    "summary": "Startups affiliated with an approved Vercel Startups Partner can get up to $30,000 in credits on Enterprise terms for one year.",
    "description": "Vercel for Startups is for startups affiliated with an approved Startups Partner, typically accelerators and venture capital firms. The credit amount depends on the arrangement between Vercel and the partner, up to a maximum of $30,000.\n\nCredits run on Enterprise terms for one year or until used up and can be applied to seats, data transfer, compute, AI Gateway, v0 and more. No more than 50% of each month's credit can go to AI Gateway. A valid payment method must be on file.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 30000,
      "durationMonths": 12
    },
    "claim": {
      "method": "application",
      "note": "Apply through Vercel's startups page; review takes about 5-7 days."
    },
    "requirements": {
      "approvalRequired": true,
      "cardRequired": true
    },
    "eligibility": [
      "Affiliated with an approved Vercel Startups Partner",
      "No prior Vercel for Startups credits",
      "Series A or earlier, applying within 12 months of the most recent funding round",
      "A company website and an email address on that domain"
    ],
    "redemption": [
      "Check that your accelerator or VC is a Vercel Startups Partner (VCs can request to join)",
      "Apply on the Vercel for Startups page",
      "After approval, accept the terms; credits and Enterprise access go live within 5-7 business days"
    ],
    "terms": [
      "Credits last one year or until used up; unused amounts do not roll over",
      "No more than 50% of each month's credit can be used on AI Gateway",
      "A valid payment method must be on file for credits to be active",
      "Vercel can revoke credits at any time, including for abuse",
      "These terms apply to startups accepted on or after August 6, 2026"
    ],
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Official pages could not be loaded from the research environment (WebFetch DNS failures, curl blocked). Facts and quotes come from search-engine extracts of the provider's own pages; quotes may be excerpted. Re-check the live page before marking verified.",
      "evidence": [
        {
          "claim": "Partner requirement",
          "quote": "affiliated with an approved Startups Partner"
        },
        {
          "claim": "Amount",
          "quote": "may vary, up to a maximum of $30,000"
        },
        {
          "claim": "Use of credits",
          "quote": "can be applied to seats, data transfer, compute, AI Gateway, v0, and more"
        },
        {
          "claim": "AI Gateway cap",
          "quote": "No more than 50% of each month's credit"
        },
        {
          "claim": "Payment method",
          "quote": "A valid payment method must be on file"
        },
        {
          "claim": "Timing",
          "quote": "5-7 business days"
        },
        {
          "claim": "Terms date",
          "quote": "accepted on or after August 6, 2026"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://vercel.com/startups/credits"
    },
    "audiences": [
      "startups",
      "developers"
    ]
  },
  {
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "source": "official",
    "id": "o-neon-startup-credits",
    "slug": "neon-startup-credits",
    "productId": "neon",
    "title": "Neon for Startups: up to $200K in combined Neon and Databricks credits",
    "summary": "Through the Databricks Startup Program, qualifying startups can get up to $200K in combined Neon and Databricks credits; self-funded startups can get up to $1,000 in Neon credits.",
    "description": "Neon's startups page describes the Databricks Startup Program, which covers both Neon and Databricks credits. Qualifying venture-backed startups, or those in recognized accelerators, can receive up to $200K in combined credits.\n\nEarly-stage, self-funded startups with less than $1M in funding can get up to $1,000 in Neon credits, plus onboarding support and early access to features. Existing Neon users can apply, and approved credits are added to their current account.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 200000
    },
    "claim": {
      "method": "application",
      "note": "Apply on Neon's startups page."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Self-funded tier: early-stage, self-funded startups with less than $1M in funding",
      "Larger package: venture-backed companies with at least $1M in funding, or startups in recognized accelerators",
      "Existing Neon users can apply"
    ],
    "redemption": [
      "Apply on Neon's startups page",
      "If approved, credits are added to your Neon account"
    ],
    "terms": [
      "The $200K figure is combined Neon and Databricks credits, not Neon credits alone"
    ],
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Official pages could not be loaded from the research environment (WebFetch DNS failures, curl blocked). Facts and quotes come from search-engine extracts of the provider's own pages; quotes may be excerpted. Re-check the live page before marking verified. Neon's pricing page and a 2025 blog post still cite up to $100k in Neon credits; the startups page cites up to $200K combined with Databricks. Validity period for the current program was not confirmed.",
      "evidence": [
        {
          "claim": "Maximum",
          "quote": "up to $200K in credits"
        },
        {
          "claim": "Self-funded tier",
          "quote": "up to $1,000 in Neon credits"
        },
        {
          "claim": "Self-funded criteria",
          "quote": "less than $1M in funding"
        },
        {
          "claim": "Existing users",
          "quote": "credits are added to their current account"
        }
      ],
      "checkedAt": "2026-11-02"
    },
    "links": {
      "officialUrl": "https://neon.com/startups"
    },
    "audiences": [
      "startups",
      "developers"
    ]
  },
  {
    "id": "o-nvidia-inception-startups",
    "slug": "nvidia-inception-startups",
    "productId": "nvidia-inception",
    "title": "NVIDIA Inception: free startup program with cloud credits and DLI training",
    "summary": "NVIDIA Inception is free to join and gives incorporated startups access to cloud credits, Deep Learning Institute course codes and preferred pricing on some NVIDIA hardware.",
    "description": "NVIDIA Inception is NVIDIA's program for technology startups. NVIDIA says there are no application fees, membership fees or equity requirements, and startups can apply at any funding stage without needing revenue.\n\nMember benefits include free cloud credits from NVIDIA and partners, codes for free self-paced NVIDIA Deep Learning Institute courses with special pricing on instructor-led workshops, and preferred pricing on a subset of NVIDIA's enterprise-grade GPUs.\n\nTo be a member, a company needs a working website, must be officially incorporated and less than 10 years old, needs a clear use case for NVIDIA technology and must be run by at least one active founder.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits",
      "ai-tools"
    ],
    "claim": {
      "method": "application",
      "note": "Apply through NVIDIA's Inception program page."
    },
    "eligibility": [
      "Officially incorporated company with a working website",
      "Less than 10 years old",
      "Has a clear use case for NVIDIA technology",
      "Actively operated by at least one founder",
      "Any funding stage; revenue is not required"
    ],
    "redemption": [
      "Go to NVIDIA's Inception program page",
      "Submit an application for your company",
      "Once a member, claim the benefits you need"
    ],
    "terms": [
      "No application fees, membership fees or equity requirements",
      "Preferred GPU pricing applies to a subset of NVIDIA's enterprise-grade GPUs"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "source": "official",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "NVIDIA's US FAQ and some regional pages word the eligibility differently (for example, requiring at least one employed developer); check the live FAQ before applying.",
      "evidence": [
        {
          "claim": "Free to join",
          "quote": "there are no application fees, membership fees, or equity requirements for NVIDIA Inception"
        },
        {
          "claim": "Eligibility",
          "quote": "Members must maintain a working website, be officially incorporated, be less than 10 years old, have a clear use case for NVIDIA technology, and be actively operated by at least one founder."
        },
        {
          "claim": "Any funding stage",
          "quote": "regardless of your company's current funding stage"
        },
        {
          "claim": "Revenue not required",
          "quote": "generating revenue isn't required for membership"
        },
        {
          "claim": "Cloud credits",
          "quote": "free cloud credits from NVIDIA and partners"
        },
        {
          "claim": "DLI training",
          "quote": "codes for free self-paced courses and special pricing for instructor-led workshops through the NVIDIA Deep Learning Institute"
        },
        {
          "claim": "Preferred GPU pricing",
          "quote": "preferred pricing on a subset of our enterprise-grade GPUs"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.nvidia.com/en-us/startups/"
    },
    "audiences": [
      "startups",
      "ai-tools",
      "developers"
    ]
  },
  {
    "id": "o-elevenlabs-startup-grants",
    "slug": "elevenlabs-startup-grants",
    "productId": "elevenlabs",
    "title": "ElevenLabs Startup Grants: 12 months free and 33M characters",
    "summary": "Startups with fewer than 25 employees can apply for an ElevenLabs grant of 12 months free with 33M characters, which ElevenLabs puts at over 680 hours of Conversational AI audio.",
    "description": "ElevenLabs Startup Grants give accepted startups 12 months of free access with 33M characters. ElevenLabs extended the grant to 12 months, up from 3, and describes it as over 680 hours of Conversational AI audio.\n\nThe program is open to startups and companies with less than 25 employees at the time of application. Applicants need a business or monetization strategy. Agencies, consulting firms and SMBs are not eligible, and ElevenLabs does not award grants to companies building projects for children aged 18 or under.\n\nIf accepted, the account is upgraded immediately. If all 33M characters are used before the 12 months end, the plan converts to a Free plan unless you have chosen otherwise.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits",
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "durationMonths": 12,
      "savingsLabel": "12 Months free, 33M Characters"
    },
    "claim": {
      "method": "application",
      "note": "Apply on the ElevenLabs Startup Grants page."
    },
    "requirements": {
      "approvalRequired": true
    },
    "regions": {
      "scope": "global",
      "note": "Open to eligible startups anywhere in the world."
    },
    "eligibility": [
      "Startup or company with less than 25 employees at the time of application",
      "Has a business or monetization strategy",
      "Agencies, consulting firms and SMBs are not eligible",
      "Not building projects for children aged 18 or under"
    ],
    "redemption": [
      "Go to the ElevenLabs Startup Grants page",
      "Submit the application describing how you plan to use ElevenLabs",
      "If accepted, your account is upgraded"
    ],
    "terms": [
      "The grant is valid for 12 months",
      "If you use all 33M characters before the 12 months end, the plan converts to a Free plan unless you have selected otherwise"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "source": "official",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "The ElevenLabs blog states the grant as 33 million credits while the pricing pages say 33M characters; the pricing-page wording is used here.",
      "evidence": [
        {
          "claim": "Grant size and length",
          "quote": "12 Months free, 33M Characters, valid for 12 months"
        },
        {
          "claim": "Extended to 12 months",
          "quote": "Startup Grants are now available for 12 months, up from 3."
        },
        {
          "claim": "Audio hours",
          "quote": "ElevenLabs Startup Grants just got bigger: now 12 months and over 680 hours of Conversational AI audio"
        },
        {
          "claim": "Employee limit",
          "quote": "open to all startups or companies with less than 25 employees at the time of receiving the application"
        },
        {
          "claim": "Worldwide",
          "quote": "startups and small companies with fewer than 25 employees, anywhere in the world"
        },
        {
          "claim": "Monetization strategy",
          "quote": "Only applications with a business or monetization strategy should apply."
        },
        {
          "claim": "Excluded companies",
          "quote": "Agencies, consulting firms and SMBs are not eligible for an ElevenLabs Grant."
        },
        {
          "claim": "No children's projects",
          "quote": "We are unable to award grants to companies that are building projects for children aged 18 or under."
        },
        {
          "claim": "Account upgrade",
          "quote": "If accepted, your ElevenLabs account will be upgraded immediately."
        },
        {
          "claim": "Conversion to Free plan",
          "quote": "If you use all your 33M text characters prior to the conclusion of the 12month grant term, your plan will automatically convert to a Free plan, unless you have selected otherwise."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://elevenlabs.io/startup-grants"
    },
    "audiences": [
      "startups",
      "ai-tools",
      "developers",
      "creators"
    ]
  },
  {
    "id": "o-openai-startups-vc-partner-credits",
    "slug": "openai-startups-vc-partner-credits",
    "productId": "openai-api",
    "title": "OpenAI for Startups: API credits for startups backed by partner VCs",
    "summary": "Startups backed by a VC in OpenAI's partner network may get free API credits, rate limit upgrades and time with OpenAI's technical team, using a referral code from their investor.",
    "description": "OpenAI's startup program works through venture capital firms in its partner network, which OpenAI says includes Thrive Capital, Sequoia, a16z, Kleiner Perkins and Conviction Partners.\n\nStartups backed by one of these firms may be eligible for free API credits, rate limit upgrades and time with OpenAI's solutions engineers or other technical staff. OpenAI does not publish a credit amount on the page.\n\nThe application asks for a unique referral code from your VC. Founders should ask their investor whether it is in OpenAI's network and how to access OpenAI resources.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits",
      "ai-tools"
    ],
    "claim": {
      "method": "application",
      "note": "Apply with a referral code from a VC in OpenAI's partner network."
    },
    "eligibility": [
      "Backed by a VC in OpenAI's partner network",
      "Has a unique referral code from that VC"
    ],
    "redemption": [
      "Ask your investor whether it is in OpenAI's partner network",
      "Get a referral code from your VC",
      "Submit OpenAI's startup application with the referral code"
    ],
    "terms": [
      "OpenAI says startups may be eligible; benefits are not guaranteed"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "source": "official",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "No credit amount is published on the startup page.",
      "evidence": [
        {
          "claim": "Partner VCs",
          "quote": "Some VCs, like Thrive Capital, Sequoia, a16z, Kleiner Perkins, and Conviction Partners, are part of our partner network."
        },
        {
          "claim": "Benefits",
          "quote": "free API credits, rate limit upgrades, and time with our solutions engineers or other technical team members"
        },
        {
          "claim": "Ask your investor",
          "quote": "will know if they're in our network and how to access OpenAI resources"
        },
        {
          "claim": "Referral code required",
          "quote": "A unique referral code from your VC."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://openai.com/business/why-openai/startups/"
    },
    "audiences": [
      "startups",
      "ai-tools",
      "developers"
    ]
  },
  {
    "id": "o-cohere-startup-program",
    "slug": "cohere-startup-program",
    "productId": "cohere",
    "title": "Cohere Startup Program: 25% discount on all Cohere models for up to 12 months",
    "summary": "Startups at Series B or earlier can apply for a 25% discount on all Cohere models for up to 12 months, plus access to Cohere's technical team.",
    "description": "Cohere's Startup Program is for startups with Series B funding or earlier that want to make AI the heart of their work. Accepted startups get a 25% discount on all Cohere models for up to 12 months.\n\nParticipants can also work with Cohere's technical team, and Cohere regularly spotlights work from the program. Cohere says it is initially rolling out the program with a select group of customers.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "saas-discounts",
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "savingsLabel": "25% discount on all Cohere models for up to 12 months"
    },
    "claim": {
      "method": "application",
      "note": "Apply through Cohere's Startup Program application form."
    },
    "eligibility": [
      "Startup with Series B funding or earlier"
    ],
    "redemption": [
      "Go to Cohere's Startup Program page",
      "Complete the Startup Program application"
    ],
    "terms": [
      "The discount applies for up to 12 months",
      "Cohere is initially rolling out the program with a select group of customers"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "archived",
    "source": "official",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Cohere's official page; live page not checked",
      "evidence": [
        {
          "claim": "Discount",
          "quote": "Get a 25% discount on all Cohere models for up to 12 months"
        },
        {
          "claim": "Eligibility",
          "quote": "startups, with Series B funding or earlier, that want to make AI the heart of their work"
        },
        {
          "claim": "Limited rollout",
          "quote": "initially rolling out the program with a select group of customers"
        },
        {
          "claim": "Publicity",
          "quote": "regularly spotlights the innovations from the startup program"
        }
      ],
      "note": "On 23 October 2026 the program's pages redirected to Cohere's homepage; the program appears to have ended."
    },
    "links": {
      "officialUrl": "https://cohere.com/startup-program",
      "redeemUrl": "https://cohere.com/startup-program-application"
    },
    "audiences": [
      "startups",
      "ai-tools",
      "developers",
      "businesses"
    ]
  },
  {
    "id": "o-datadog-for-startups",
    "slug": "datadog-for-startups",
    "productId": "datadog",
    "title": "Datadog for Startups: a year of Datadog with up to $100k in credits",
    "summary": "Partner-referred startups at Series A or earlier can get a year of free Datadog Pro, with up to $100k in credits for the whole Datadog platform.",
    "description": "Datadog for Startups gives accepted startups a year of Datadog, with up to $100k in credits that can be used across the entire Datadog platform during the first year.\n\nTo qualify, a company must be Series A or earlier, new to Datadog, and referred through one of Datadog's official referral partners. Current or prior Datadog customers, and companies that have already received Datadog for Startups credits, are not eligible.\n\nAfter acceptance, startups must confirm credit activation within 30 days or the acceptance expires. The region chosen when creating the account cannot be changed after the program starts, and accounts left inactive for three months get a warning and 30 days to start using products.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "creditValue": 100000,
      "durationMonths": 12
    },
    "claim": {
      "method": "application",
      "note": "Apply through one of Datadog's referral partners; a Datadog trial can be used while the application is reviewed."
    },
    "requirements": {
      "approvalRequired": true,
      "newCustomersOnly": true
    },
    "eligibility": [
      "Company is Series A or earlier",
      "New to Datadog: not a current or prior Datadog customer, and has not previously received Datadog for Startups credits",
      "Referred through one of Datadog's official referral partners"
    ],
    "redemption": [
      "Get referred by one of Datadog's referral partners and submit an application",
      "Optionally sign up for Datadog's 2-week trial while the application is reviewed",
      "After acceptance, confirm credit activation within 30 days"
    ],
    "terms": [
      "Credits apply to the entire Datadog platform for the first year",
      "Acceptance expires if credit activation is not completed within 30 days",
      "The account region cannot be changed after the program starts",
      "If the account is inactive for three months, you get a warning and 30 days to start using products",
      "Creating an account means agreeing to Datadog's Master Subscription Agreement"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against Datadog's official program page",
      "evidence": [
        {
          "claim": "Credit amount and duration",
          "quote": "A year of Datadog (up to $100k in credits)"
        },
        {
          "claim": "Headline benefit",
          "quote": "Ship faster, monitor smarter, and scale confidently with a year of free Datadog Pro"
        },
        {
          "claim": "Credits cover the whole platform",
          "quote": "Use your credits for the entire Datadog platform for your first year with Datadog."
        },
        {
          "claim": "Eligibility",
          "quote": "To qualify, your company must be Series A or earlier, new to Datadog, and referred through an official partner."
        },
        {
          "claim": "Referral required",
          "quote": "All applicants must come through one of our referral partners."
        },
        {
          "claim": "New customers only",
          "quote": "you cannot be a current or prior Datadog customer, nor can you have previously received DDFS credits."
        },
        {
          "claim": "Activation deadline",
          "quote": "If you do not complete this step within 30 days, your acceptance will expire."
        },
        {
          "claim": "Region is fixed",
          "quote": "you cannot change it after you start the program."
        },
        {
          "claim": "Inactivity rule",
          "quote": "If your account remains inactive for three months, you'll receive a warning and have 30 days to start utilizing products."
        },
        {
          "claim": "Trial during review",
          "quote": "Datadog’s Trial is a 2-week trial that is available to all companies to experience the value of our entire platform."
        },
        {
          "claim": "Agreement",
          "quote": "By creating an account, you agree to the Master Subscription Agreement."
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.datadoghq.com/partner/datadog-for-startups/"
    },
    "audiences": [
      "startups",
      "developers",
      "businesses"
    ]
  },
  {
    "id": "o-posthog-for-startups",
    "slug": "posthog-for-startups",
    "productId": "posthog",
    "title": "PostHog for Startups: $50,000 in PostHog credits for 12 months",
    "summary": "Startups under 2 years old that have raised less than $5m can apply for $50,000 in PostHog credits, valid for 12 months.",
    "description": "PostHog for Startups gives eligible young companies $50,000 in PostHog credits, valid for 12 months from the time of application.\n\nTo qualify, a company must be less than 2 years old and have raised less than $5m in funding, and must apply with a company email domain.\n\nPostHog's startups page and handbook say that from September 14, 2026, credits cannot be applied to AI tools such as PostHog AI. Credits also cannot be used toward a BAA.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "creditValue": 50000,
      "durationMonths": 12
    },
    "claim": {
      "method": "application",
      "note": "Apply through the form on PostHog's startups page."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Company is less than 2 years old",
      "Company has raised less than $5m in funding",
      "Applicant uses a company email domain"
    ],
    "redemption": [
      "Go to posthog.com/startups",
      "Submit the startup program application"
    ],
    "terms": [
      "Credits are valid for 12 months, starting at application",
      "From September 14, 2026, credits can't be applied to AI tools such as PostHog AI",
      "Credits cannot be used toward a BAA"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Search extracts mentioned another PostHog page saying credits work across every product; the AI-tools exclusion comes from the startups page FAQ and handbook. Re-check on the live page.",
      "evidence": [
        {
          "claim": "Credit amount and duration (handbook)",
          "quote": "$50,000 in PostHog credits (valid for 12 months)"
        },
        {
          "claim": "Eligibility (startups page FAQ)",
          "quote": "less than 2 years old and have raised less than $5m funding"
        },
        {
          "claim": "Eligibility (comparison table)",
          "quote": "<$5m in funding and <2 years old"
        },
        {
          "claim": "AI tools exclusion",
          "quote": "From September 14, 2026, credits can't be applied to AI tools"
        },
        {
          "claim": "BAA exclusion (handbook)",
          "quote": "Cannot use credits toward a BAA due to legal risk."
        }
      ],
      "checkedAt": "2026-11-02"
    },
    "links": {
      "officialUrl": "https://posthog.com/startups"
    },
    "audiences": [
      "startups",
      "developers",
      "marketing-tools"
    ]
  },
  {
    "id": "o-intercom-early-stage-program",
    "slug": "intercom-early-stage-program",
    "productId": "intercom",
    "title": "Intercom Early Stage program: 93% off Intercom in year 1",
    "summary": "Early-stage startups with up to $10M in funding and fewer than 15 employees can get 93% off Intercom in year 1, 50% off in year 2 and 25% off in year 3.",
    "description": "Intercom's Early Stage program gives eligible startups a discount on Intercom that steps down over three years: 93% off in Year 1, 50% off in Year 2 and 25% off in Year 3. The program also includes an allowance of Fin AI agent outcomes.\n\nTo qualify, a startup must have raised up to $10 million, have fewer than 15 employees and must not currently be an Intercom customer.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "saas-discounts"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "savingsLabel": "93% off in Year 1, 50% off in Year 2, 25% off in Year 3"
    },
    "claim": {
      "method": "application",
      "note": "Apply from Intercom's Early Stage page."
    },
    "requirements": {
      "approvalRequired": true,
      "newCustomersOnly": true
    },
    "eligibility": [
      "Raised up to $10 million in funding",
      "Fewer than 15 employees",
      "Not currently an Intercom customer"
    ],
    "redemption": [
      "Go to intercom.com/early-stage",
      "Submit the Early Stage program application"
    ],
    "terms": [
      "The discount is 93% in Year 1, 50% in Year 2 and 25% in Year 3",
      "Companies with more than 15 employees are not eligible"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Older Intercom pages show 90% off; the current Early Stage page and the /traction page show 93%. Fin outcome allowances differ between the program page and the help center, so they are left out.",
      "evidence": [
        {
          "claim": "Headline offer (Intercom /traction page title)",
          "quote": "Startups get 93% off Intercom + 1 year of Fin free"
        },
        {
          "claim": "Discount steps",
          "quote": "93% off in Year 1, 50% off in Year 2, and 25% off in Year 3"
        },
        {
          "claim": "Funding limit (help center)",
          "quote": "raised up to $10 million"
        },
        {
          "claim": "Team size (help center)",
          "quote": "fewer than 15 employees"
        },
        {
          "claim": "New customers only (help center)",
          "quote": "must currently not be an Intercom customer"
        },
        {
          "claim": "Employee cap (FAQ)",
          "quote": "If your company has more than 15 employees, you're not eligible for the Early Stage Program."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.intercom.com/early-stage"
    },
    "audiences": [
      "startups",
      "businesses",
      "marketing-tools"
    ]
  },
  {
    "id": "o-sentry-for-startups",
    "slug": "sentry-for-startups",
    "productId": "sentry",
    "title": "Sentry for Startups: up to $5,000 in credits",
    "summary": "Startups founded in the last 2 years that have raised less than $5M can apply for up to $5,000 in Sentry credits and priority support.",
    "description": "Sentry for Startups offers up to $5,000 in Sentry credits plus priority support. The credits expire after 12 months.\n\nTo qualify, a company must have been founded in the last 2 years, have raised less than $5M in venture capital and be new to paying for Sentry. Founders from YC or a16z speedrun are directed to a separate deal that does not stack with these credits.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "creditValue": 5000,
      "durationMonths": 12
    },
    "claim": {
      "method": "application",
      "note": "Apply on Sentry's startup application page."
    },
    "requirements": {
      "approvalRequired": true,
      "newCustomersOnly": true
    },
    "eligibility": [
      "Founded in the last 2 years",
      "Raised less than $5M in venture capital",
      "New to paying for Sentry"
    ],
    "redemption": [
      "Go to sentry.io/for/startups/apply/",
      "Submit the application"
    ],
    "terms": [
      "Credits expire after 12 months"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "evidence": [
        {
          "claim": "Credit amount and support",
          "quote": "up to $5,000 in credits and priority support"
        },
        {
          "claim": "Expiry (apply page)",
          "quote": "expire after 12 months"
        },
        {
          "claim": "Founding date (apply page)",
          "quote": "founded in the last 2 years"
        },
        {
          "claim": "Funding limit (apply page)",
          "quote": "raised less than $5M in venture capital"
        },
        {
          "claim": "New paying customers only (apply page)",
          "quote": "new to paying for Sentry"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://sentry.io/for/startups/",
      "redeemUrl": "https://sentry.io/for/startups/apply/"
    },
    "audiences": [
      "startups",
      "developers"
    ]
  },
  {
    "id": "o-miro-startup-program",
    "slug": "miro-startup-program",
    "productId": "miro",
    "title": "Miro Startup Program: $1,000 credit for partner startups",
    "summary": "Startups connected with a Miro Startup Program partner are eligible for a $1,000 Miro credit; other startups can apply individually for a $500 credit.",
    "description": "The Miro Startup Program gives startups connected with one of Miro's startup program partners a $1,000 credit. Startups not connected to a partner can apply as an individual startup for a $500 credit.\n\nPartner-connected startups must have fewer than 30 employees, be independently owned and operated, and not be admins or members of paid Miro subscriptions. The credit should be activated within 6 months, and the card on file is charged once the credit limit is reached.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "creditValue": 1000
    },
    "claim": {
      "method": "application",
      "note": "Apply through Miro's startup application page, via a partner or as an individual startup."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Fewer than 30 employees",
      "Independently owned and operated",
      "Not admins or members of paid Miro subscriptions",
      "Connected to a Miro Startup Program partner for the $1,000 credit; other startups can apply individually for $500"
    ],
    "redemption": [
      "Go to miro.com/startups/apply/",
      "Submit the application"
    ],
    "terms": [
      "The credit should be activated within 6 months",
      "When the credit limit is reached, your card starts getting charged"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-19",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Miro's official page; live page not checked",
      "evidence": [
        {
          "claim": "Partner credit amount (help center)",
          "quote": "Startups connected with our Miro Startup Program partners are eligible for $1,000 credit."
        },
        {
          "claim": "Individual startup credit (help center)",
          "quote": "If you aren't connected to one of our startup program partners, you can still apply as an individual startup for $500 credit."
        },
        {
          "claim": "Employee cap (help center)",
          "quote": "have fewer than 30 employees"
        },
        {
          "claim": "Other partner-path requirements (help center)",
          "quote": "not be admins or members of paid Miro subscriptions, be connected to a Miro Startup Program partner, be independently owned and operated"
        },
        {
          "claim": "Activation window (help center)",
          "quote": "Your credit should be activated within 6 months."
        },
        {
          "claim": "Charges after credit (help center)",
          "quote": "When you reach the credit limit ($1,000 or $500), your card will start getting charged."
        }
      ]
    },
    "links": {
      "officialUrl": "https://help.miro.com/hc/en-us/articles/360014912819-Miro-Startup-Program",
      "redeemUrl": "https://miro.com/startups/apply/"
    },
    "audiences": [
      "startups",
      "designers",
      "office-tools"
    ]
  },
  {
    "id": "o-mixpanel-for-startups",
    "slug": "mixpanel-for-startups",
    "productId": "mixpanel",
    "title": "Mixpanel for Startups: first year free on the Startup Plan",
    "summary": "Startups incorporated less than five years ago with no more than $8 million raised can get a free year of Mixpanel's Startup Plan.",
    "description": "Mixpanel for Startups gives eligible startups one free year on Mixpanel's Startup Plan, which covers up to 1 billion events per year.\n\nTo qualify, a startup must have been incorporated less than five years ago, have raised no more than $8 million (USD) in total funding, and must not have redeemed other Mixpanel offers or been on a paid plan.\n\nAccepted startups must begin sending data to Mixpanel within 90 days of acceptance; those who don't are removed from the program and cannot rejoin.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "saas-discounts"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "durationMonths": 12
    },
    "claim": {
      "method": "application",
      "note": "Apply on Mixpanel's Startup Plan application page."
    },
    "requirements": {
      "approvalRequired": true,
      "newCustomersOnly": true
    },
    "eligibility": [
      "Incorporated less than five years ago",
      "Raised no more than $8 million (USD) in total funding",
      "Has not previously redeemed other Mixpanel offers and has not been on a paid plan"
    ],
    "redemption": [
      "Go to mixpanel.com/startups-apply/",
      "Submit the Startup Plan application",
      "After acceptance, start sending data to Mixpanel within 90 days"
    ],
    "terms": [
      "The Startup Plan covers up to 1 billion events per year",
      "Startups that don't send data within 90 days of acceptance are removed and cannot rejoin"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Older Mixpanel blog posts describe a previous credit-based version (up to $50,000); the current docs describe the free Startup Plan.",
      "evidence": [
        {
          "claim": "Incorporation age",
          "quote": "incorporated less than five years ago"
        },
        {
          "claim": "Funding limit",
          "quote": "raised no more than $8 million (USD) in total funding"
        },
        {
          "claim": "No prior offers or paid plan",
          "quote": "Haven't previously redeemed other Mixpanel offers and haven't been on a paid plan"
        },
        {
          "claim": "Event volume",
          "quote": "up to 1 billion events per year"
        },
        {
          "claim": "90-day data requirement",
          "quote": "removed from the program and prohibited from rejoining"
        }
      ],
      "checkedAt": "2026-11-02"
    },
    "links": {
      "officialUrl": "https://docs.mixpanel.com/docs/pricing/startup-program",
      "redeemUrl": "https://mixpanel.com/startups-apply/"
    },
    "audiences": [
      "startups",
      "marketing-tools"
    ]
  },
  {
    "id": "o-zendesk-for-startups",
    "slug": "zendesk-for-startups",
    "productId": "zendesk",
    "title": "Zendesk for Startups: six months free for up to 50 agents",
    "summary": "New Zendesk customers that qualify for the startups program get a monthly credit for six months for up to 50 agents on Zendesk Suite and Sell.",
    "description": "The Zendesk for Startups program gives approved startups a monthly credit for six months for up to 50 agents, redeemable for Zendesk Suite and Sell.\n\nThe program is for brand-new Zendesk customers. Zendesk's own pages give different employee and funding thresholds (for example, fewer than 50 employees and up to Series A in the support article, and higher limits on the main startups page), so check the current application page for the exact criteria.\n\nApplicants are notified of their approval status by email.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-trials"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "durationMonths": 6
    },
    "claim": {
      "method": "application",
      "note": "Apply through Zendesk's startups program application page."
    },
    "requirements": {
      "approvalRequired": true,
      "newCustomersOnly": true
    },
    "eligibility": [
      "New Zendesk customer",
      "Employee and funding limits differ between Zendesk's pages; check the current application page"
    ],
    "redemption": [
      "Apply through Zendesk's startups program page",
      "Wait for the approval email from Zendesk"
    ],
    "terms": [
      "Monthly credit for six months for up to 50 agents",
      "Credit is redeemable for Zendesk Suite and Sell"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Zendesk's pages conflict on eligibility: the support article says fewer than 50 employees and Series A or below; the main startups page says fewer than 250 employees (50-249 need a partner referral), no more than Series B, and under 10 years old. The main page also mentions terms of up to two years with partner referrals.",
      "evidence": [
        {
          "claim": "Credit length and agent cap (support article)",
          "quote": "monthly credit for six (6) months of up to fifty (50) Agents redeemable for the Zendesk Suite+ Sell for free"
        },
        {
          "claim": "Eligibility (support article, older thresholds)",
          "quote": "new Zendesk customer, fewer than 50 employees, and raised up to a Series A in venture funding"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://support.zendesk.com/hc/en-us/articles/4408822027418-Startups-program-qualifications-approval-process",
      "redeemUrl": "https://www.zendesk.com/business/startups/"
    },
    "audiences": [
      "startups",
      "businesses"
    ]
  },
  {
    "id": "o-hubspot-for-startups",
    "slug": "hubspot-for-startups",
    "productId": "hubspot",
    "title": "HubSpot for Startups: up to 90% off in year one",
    "summary": "Eligible startups that have raised Pre-seed, Seed or Series A funding can get up to 90% off new HubSpot Professional or Enterprise products in year one.",
    "description": "HubSpot for Startups offers eligible startups up to 90% off in year one, with smaller discounts in later years.\n\nThe top tier is for startups that have raised Pre-seed, Seed or Series A funding and have not raised Series B or later. Startups qualify through one of HubSpot's approved partners (VCs, accelerators, incubators and entrepreneurial organizations), or if HubSpot can verify their funding independently.\n\nThe pricing applies to net-new customers purchasing Professional or Enterprise level products.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "saas-discounts"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "savingsLabel": "up to 90% off in year one"
    },
    "claim": {
      "method": "application",
      "note": "Apply from the HubSpot for Startups page, through a partner or with verified funding."
    },
    "requirements": {
      "approvalRequired": true,
      "newCustomersOnly": true
    },
    "eligibility": [
      "Raised Pre-seed, Seed or Series A funding, and not Series B or later (for the 90% tier)",
      "Affiliated with one of HubSpot's approved partners, or funding verifiable by HubSpot"
    ],
    "redemption": [
      "Go to hubspot.com/startups",
      "Apply through your partner or with verified funding"
    ],
    "terms": [
      "Applies to net-new customers purchasing Professional or Enterprise level products"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Later-year discounts differ between HubSpot pages (50%/25% on the main page, 50%/30% on a partner page), so they are left out.",
      "evidence": [
        {
          "claim": "Headline discount",
          "quote": "up to 90% off in year one"
        },
        {
          "claim": "Stage cutoff (Y Combinator partner page)",
          "quote": "have not raised Series B or later"
        },
        {
          "claim": "Partner route",
          "quote": "if you're affiliated with a VC, accelerator, incubator, or entrepreneurial organization, chances are they are one of our 4,000+ approved partners"
        },
        {
          "claim": "Product and customer scope",
          "quote": "HubSpot for Startups pricing applies to net-new customers purchasing Professional or Enterprise level products."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.hubspot.com/startups"
    },
    "audiences": [
      "startups",
      "businesses",
      "marketing-tools"
    ]
  },
  {
    "id": "o-jetbrains-student-pack",
    "slug": "jetbrains-student-pack",
    "productId": "jetbrains-ides",
    "title": "JetBrains Student Pack: free access to all JetBrains IDEs for verified students",
    "summary": "Full-time students in a program lasting one year or more can get free access to all JetBrains IDEs after verifying their student status. The licence is renewed each year.",
    "description": "The JetBrains Student Pack gives verified students free access to all JetBrains IDEs. Students verify with a university email address, an ISIC/ITIC card or a GitHub Student Developer Pack account.\n\nThe pack is for full-time students in a program lasting one year or more, and the licences may only be used for non-commercial educational purposes, including academic research. The subscription is renewed through a renewal link in the JetBrains Account. After the Student Pack expires, JetBrains offers 40% off any JetBrains product for two years.",
    "type": "student",
    "categories": [
      "student-discounts",
      "software-deals"
    ],
    "source": "official",
    "claim": {
      "method": "verification",
      "note": "Verify with a university email, an ISIC/ITIC card or a GitHub Student Developer Pack account."
    },
    "requirements": {
      "studentVerification": true,
      "cardRequired": false
    },
    "eligibility": [
      "Full-time student in a program lasting one year or more",
      "Programs shorter than one year are not eligible for the Student Pack"
    ],
    "redemption": [
      "Open the JetBrains Student Pack page and start an application",
      "Verify with a university email address, an ISIC/ITIC card or a GitHub Student Developer Pack account",
      "Renew each year with the renewal link in your JetBrains Account"
    ],
    "terms": [
      "Licences are strictly for non-commercial educational purposes, including academic research",
      "JetBrains sends a renewal reminder email two weeks before the subscription expires",
      "40% off any JetBrains product for two years after the Student Pack expires"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-19",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of JetBrains's official page; live page not checked",
      "note": "Quotes come from search-engine extracts of the official page. The live page could not be fetched from the research environment (outbound access to the provider's site was blocked), so an editor should re-check it before marking this verified.",
      "evidence": [
        {
          "claim": "Free access to all IDEs",
          "quote": "all JetBrains IDEs"
        },
        {
          "claim": "No card; eligibility",
          "quote": "No card required... Full-time student in a program lasting one year or more."
        },
        {
          "claim": "Short programs excluded",
          "quote": "Student licenses are available only to those enrolled in accredited educational programs lasting longer than one year."
        },
        {
          "claim": "Non-commercial use",
          "quote": "JetBrains IDE licenses for students are strictly for non-commercial educational purposes, including academic research."
        },
        {
          "claim": "Renewal",
          "quote": "the renewal link, which you can find in your JetBrains Account or in the automatic email reminder we send two weeks before your subscription expires"
        },
        {
          "claim": "Graduation discount",
          "quote": "You'll receive 40% off any JetBrains product for two years after your Student Pack expires."
        },
        {
          "claim": "Verification options (search extract, paraphrased by the search tool)",
          "quote": "a university email address, an ISIC/ITIC card, or a GitHub Student Developer Pack account"
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.jetbrains.com/academy/student-pack/"
    },
    "audiences": [
      "students",
      "developers"
    ]
  },
  {
    "id": "o-figma-for-education",
    "slug": "figma-for-education",
    "productId": "figma",
    "title": "Figma for Education: free Figma access for verified students and educators",
    "summary": "Students and educators in a classroom, from high schools to universities and select bootcamps, can get free Figma access after verifying with a school-issued email.",
    "description": "Figma for Education provides free Figma access to students and educators in a classroom, including high schools, universities and select bootcamps or online courses.\n\nApplicants log in to the Figma account they want verified and apply at figma.com/education/apply with a school-issued email address; non-school emails are rejected automatically. Higher-education applicants complete verification through SheerID. Access is time-limited and has to be renewed by reapplying.",
    "type": "student",
    "categories": [
      "student-discounts",
      "software-deals"
    ],
    "source": "official",
    "claim": {
      "method": "verification",
      "note": "Apply at figma.com/education/apply with a school-issued email address."
    },
    "requirements": {
      "studentVerification": true
    },
    "eligibility": [
      "Students and educators in a classroom, including high schools, universities and select bootcamps or online courses",
      "A school-issued email address is required"
    ],
    "redemption": [
      "Log in to the Figma account you want verified",
      "Go to figma.com/education/apply and choose your institution type",
      "Higher-education applicants complete verification through SheerID"
    ],
    "terms": [
      "Non-school email addresses are rejected automatically",
      "Access expires and you must reapply to renew"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of the official page. The live page could not be fetched from the research environment (outbound access to the provider's site was blocked), so an editor should re-check it before marking this verified.",
      "evidence": [
        {
          "claim": "Free access for students and educators",
          "quote": "Figma for Education provides free Figma access to students and educators."
        },
        {
          "claim": "Eligible learners",
          "quote": "students and educators in a classroom, which includes high schools, universities, and select bootcamps or online courses"
        },
        {
          "claim": "School email; auto-rejection",
          "quote": "non-school emails will be auto-rejected"
        },
        {
          "claim": "Apply flow (search extract, paraphrased by the search tool)",
          "quote": "Log in to the Figma account you want verified, then go to figma.com/education/apply. ... For higher ed, select Higher Ed and complete the SheerID verification."
        },
        {
          "claim": "Renewal (search extract, paraphrased by the search tool)",
          "quote": "you must reapply to renew"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://help.figma.com/hc/en-us/articles/360041061214-Figma-for-Education",
      "redeemUrl": "https://www.figma.com/education/apply"
    },
    "audiences": [
      "students",
      "designers"
    ]
  },
  {
    "id": "o-notion-education-plan-free",
    "slug": "notion-education-plan-free",
    "productId": "notion",
    "title": "Notion Education Plan: free for individual students and educators with a school email",
    "summary": "Individual students and teachers at accredited colleges and universities can use Notion's Education Plan for free on a one-member workspace by verifying with a school email.",
    "description": "Notion offers a free plan for individual students and teachers at accredited colleges and universities. Eligibility is checked through a school email address, which must be the primary email on the Notion account; student IDs and other documents are not accepted. The school must be listed in the World Higher Education Database.\n\nThe plan is for a one-member workspace. Each school email can claim the offer once, on one workspace. Status is re-verified once a year; if it can't be verified, the workspace and its content move to the Free Plan.",
    "type": "student",
    "categories": [
      "student-discounts",
      "saas-discounts"
    ],
    "source": "official",
    "claim": {
      "method": "verification",
      "note": "Verified through a school email that is the primary email on your Notion account."
    },
    "requirements": {
      "studentVerification": true
    },
    "eligibility": [
      "Individual students and teachers at accredited colleges and universities",
      "Your school must be listed in the World Higher Education Database",
      "A school email must be the main email on your Notion account",
      "Student IDs and other documents are not accepted"
    ],
    "redemption": [
      "Sign up for Notion, or change your account's primary email to your school email",
      "Claim the education offer on a one-member workspace",
      "Re-verify with your school email once a year"
    ],
    "terms": [
      "Each school email can claim the offer once, on one workspace, even if that workspace is later deleted",
      "If you can no longer verify with a valid education email, the workspace and its content move to the Free Plan"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of the official page. The live page could not be fetched from the research environment (outbound access to the provider's site was blocked), so an editor should re-check it before marking this verified.",
      "evidence": [
        {
          "claim": "Annual re-verification",
          "quote": "To keep using the free Education Plan, you'll need to verify your student status once a year with your school email."
        },
        {
          "claim": "Primary email requirement",
          "quote": "to stay on the Education Plan, your school email must stay active and remain the main email on your Notion account."
        },
        {
          "claim": "Fallback to Free Plan",
          "quote": "If you can no longer verify with a valid education email, your workspace (including all your content) moves to the Free Plan. You don't need to do anything"
        },
        {
          "claim": "One claim per school email",
          "quote": "Your school email works for the student offer one time, on one workspace. Once your school email has claimed the offer, you can't use it to claim the offer again on a new workspace. This is true even if you delete the first workspace you used it on."
        },
        {
          "claim": "No ID documents",
          "quote": "We don't accept student IDs or other documentation to verify a student or educator status."
        },
        {
          "claim": "Eligibility and WHED listing (search extract, paraphrased by the search tool)",
          "quote": "individual students and teachers at accredited colleges and universities. Your school must be listed in the World Higher Education Database."
        },
        {
          "claim": "One-member workspace (search extract, paraphrased by the search tool)",
          "quote": "a free plan for a one-member workspace"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.notion.com/help/notion-for-education"
    },
    "audiences": [
      "students",
      "office-tools"
    ]
  },
  {
    "id": "o-aws-free-tier-credits",
    "slug": "aws-free-tier-credits",
    "productId": "aws",
    "title": "AWS Free Tier: up to $200 in AWS credits for new customers",
    "summary": "New AWS customers receive $100 in credits on sign-up and can earn up to $100 more by completing activities. The Free plan lasts up to 6 months.",
    "description": "New AWS customers receive USD $100 in credits after creating an account, regardless of account plan, and can earn up to another USD $100 by completing activities in the Explore AWS widget.\n\nOn the Free plan, the account expires 6 months after it was opened or once the Free Tier credits are used up, whichever comes first, and the Free plan cannot be extended. Accounts that are not upgraded within 90 days of the Free plan ending are permanently erased.",
    "type": "free-credits",
    "categories": [
      "free-credits",
      "free-trials"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "creditValue": 200
    },
    "claim": {
      "method": "automatic",
      "note": "$100 is added after sign-up; the rest is earned by completing activities in the Explore AWS widget."
    },
    "requirements": {
      "newCustomersOnly": true
    },
    "eligibility": [
      "New AWS customers only"
    ],
    "redemption": [
      "Create an AWS account",
      "Receive USD $100 in credits after sign-up",
      "Complete activities in the Explore AWS widget to earn up to USD $100 more"
    ],
    "terms": [
      "The Free plan expires 6 months after account opening or when Free Tier credits are used up, whichever is earlier",
      "The Free plan cannot be extended beyond 6 months",
      "If you don't upgrade within 90 days, AWS permanently erases the account and its content"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of the official page. The live page could not be fetched from the research environment (outbound access to the provider's site was blocked), so an editor should re-check it before marking this verified. Credit expiry was left out: the FAQ gives both 6 and 12 months, and the Free Tier Terms say twelve months from account opening.",
      "evidence": [
        {
          "claim": "Up to $200 total",
          "quote": "New customers receive up to $200 in AWS credits, $100 upon sign-up and up to $100 more as you explore foundational AWS services."
        },
        {
          "claim": "$100 at sign-up regardless of plan",
          "quote": "If you are new to AWS, you receive USD $100 in credits after you create an account regardless of your account plan."
        },
        {
          "claim": "Up to $100 more for activities",
          "quote": "You can earn up to an additional $100 Free Tier credits by completing activities in the Explore AWS widget by their specified completion date."
        },
        {
          "claim": "New customers only",
          "quote": "The Free plan and Free Tier credits are available only to new AWS customers."
        },
        {
          "claim": "Free plan expiry",
          "quote": "Your Free plan expires the earlier of (1) 6 months from the date you opened your AWS account, or (2) once you have exhausted your Free Tier credits."
        },
        {
          "claim": "No extension",
          "quote": "No, you cannot extend your Free plan beyond 6 months."
        },
        {
          "claim": "Account erased if not upgraded",
          "quote": "If you don't upgrade your account within 90 days, AWS will permanently erase your AWS account and all its content."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://aws.amazon.com/free/free-tier-faqs/",
      "redeemUrl": "https://aws.amazon.com/free/"
    },
    "audiences": [
      "developers"
    ]
  },
  {
    "id": "o-azure-free-account-200-credit",
    "slug": "azure-free-account-200-credit",
    "productId": "microsoft-azure",
    "title": "Azure free account: $200 credit for the first 30 days for new customers",
    "summary": "New Azure customers get a $200 credit to use in the first 30 days, plus a limited quantity of free services for 12 months.",
    "description": "The Azure free account gives new customers $200 of Azure credit in their billing currency for the first 30 days, and a limited quantity of free services for 12 months. The credit can't be used for third-party Marketplace purchases.\n\nThe offer is limited to one account per new customer. Upgrading to pay-as-you-go early keeps any remaining credit available for the full 30 days from sign-up. This is separate from Azure for Students.",
    "type": "free-credits",
    "categories": [
      "free-credits",
      "free-trials"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "creditValue": 200
    },
    "claim": {
      "method": "automatic",
      "note": "The credit is applied when you sign up for an Azure free account."
    },
    "requirements": {
      "newCustomersOnly": true
    },
    "eligibility": [
      "New Azure customers; one account with free services and $200 credit per new customer"
    ],
    "redemption": [
      "Sign up for an Azure free account",
      "Use the $200 credit within the first 30 days",
      "Move to pay-as-you-go to keep using services after the credit or 30 days run out"
    ],
    "terms": [
      "Credit not used by the end of the first 30 days is lost",
      "The credit can't be used for third-party Marketplace purchases",
      "Upgrading early keeps remaining credit available for the full 30 days from sign-up",
      "After the first 30 days and up to 12 months after sign-up, only a limited quantity of some services is free"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of the official page. The live page could not be fetched from the research environment (outbound access to the provider's site was blocked), so an editor should re-check it before marking this verified.",
      "evidence": [
        {
          "claim": "$200 for 30 days; 12 months of free services",
          "quote": "$200 Azure credit in your billing currency for the first 30 days and a limited quantity of free services for 12 months"
        },
        {
          "claim": "One per new customer",
          "quote": "There is a limit of one account with free services and $200 credit per new customer."
        },
        {
          "claim": "Remaining credit after upgrade",
          "quote": "any credit you have remaining will still be available for the full 30 days from when you created your free account"
        },
        {
          "claim": "Limited free services after 30 days",
          "quote": "after the first 30 days and up to 12 months after sign-up, you can only use a limited quantity of some services"
        },
        {
          "claim": "Move to pay-as-you-go",
          "quote": "you'll need to move to pay-as-you-go pricing within 30 days or after you've used your credit (whichever happens first) to continue to receive free services"
        },
        {
          "claim": "Marketplace exclusion (search extract, paraphrased by the search tool)",
          "quote": "The $200 credit is usable on any service, except for third-party Marketplace purchases"
        }
      ],
      "checkedAt": "2026-11-02"
    },
    "links": {
      "officialUrl": "https://azure.microsoft.com/en-us/pricing/purchase-options/azure-account"
    },
    "audiences": [
      "developers"
    ]
  },
  {
    "id": "o-oracle-cloud-free-tier",
    "slug": "oracle-cloud-free-tier",
    "productId": "oracle-cloud-infrastructure",
    "title": "Oracle Cloud Free Tier: $300 in credits for 30 days plus Always Free services",
    "summary": "Oracle Cloud's Free Trial gives $300 of cloud credits valid for up to 30 days, alongside a set of Always Free services with no time limit.",
    "description": "The Oracle Cloud Free Trial provides $300 of cloud credits that are valid for up to 30 days and can be spent on any eligible Oracle Cloud Infrastructure service. Unused credits expire at the end of the 30-day period. The US$300 credit is available in select countries.\n\nSeparately, Oracle offers Always Free services that do not expire. Resources identified as Always Free are not reclaimed when the trial ends. Your credit card is not charged unless you upgrade your account.",
    "type": "free-credits",
    "categories": [
      "free-credits",
      "free-trials"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "creditValue": 300
    },
    "claim": {
      "method": "automatic",
      "note": "Credits are applied when you sign up for Oracle Cloud Free Tier."
    },
    "regions": {
      "scope": "limited",
      "note": "The US$300 credit is available in select countries."
    },
    "eligibility": [
      "Available in select countries"
    ],
    "redemption": [
      "Sign up for Oracle Cloud Free Tier",
      "Spend the $300 credit on eligible Oracle Cloud Infrastructure services within 30 days",
      "Keep using Always Free resources after the trial"
    ],
    "terms": [
      "Unused credits expire automatically at the end of the 30-day period",
      "Always Free resources are not reclaimed when the trial ends",
      "Your credit card is not charged unless you upgrade your account",
      "With some special Free Trial offers, the account does not continue as an Always Free account after the trial"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of the official page. The live page could not be fetched from the research environment (outbound access to the provider's site was blocked), so an editor should re-check it before marking this verified.",
      "evidence": [
        {
          "claim": "$300 for up to 30 days",
          "quote": "The Free Trial provides you with $300 of cloud credits that are valid for up to 30 days. You can spend these credits on any eligible Oracle Cloud Infrastructure service."
        },
        {
          "claim": "Unused credits expire",
          "quote": "Any credits that are unused at the end of the 30-day period will automatically expire."
        },
        {
          "claim": "Select countries",
          "quote": "US$300 cloud credit is available in select countries and valid for up to 30 days"
        },
        {
          "claim": "Always Free never expire",
          "quote": "a set of Always Free offers that never expire"
        },
        {
          "claim": "Always Free not reclaimed",
          "quote": "resources identified as Always Free will not be reclaimed"
        },
        {
          "claim": "Card not charged",
          "quote": "Your credit card will not be charged unless you upgrade your account."
        },
        {
          "claim": "Special offers exception",
          "quote": "With some special Free Trial offers, your account will not continue as an Always Free account after the trial expires."
        }
      ],
      "checkedAt": "2026-11-02"
    },
    "links": {
      "officialUrl": "https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier.htm",
      "redeemUrl": "https://www.oracle.com/cloud/free/"
    },
    "audiences": [
      "developers"
    ]
  },
  {
    "id": "o-cloudflare-workers-free-plan",
    "slug": "cloudflare-workers-free-plan",
    "productId": "cloudflare-workers",
    "title": "Cloudflare Workers Free plan: 100,000 requests per day",
    "summary": "Cloudflare's Workers Free plan includes 100,000 requests per day with 10 ms of CPU time per invocation, and requests to static assets are free and unlimited.",
    "description": "The Workers Free plan lets you run serverless code on Cloudflare's network at no cost, with a daily limit of 100,000 requests that resets at midnight UTC. Each invocation can use 10 milliseconds of CPU time. Requests to static assets are free and unlimited.\n\nWhen a Worker exceeds the daily request limit, Cloudflare returns Error 1027. The Workers Paid plan has a minimum charge of $5 USD per month.",
    "type": "free-plan",
    "categories": [
      "software-deals",
      "free-credits"
    ],
    "source": "official",
    "claim": {
      "method": "automatic",
      "note": "The Free plan applies when you create Workers on a Cloudflare account without upgrading."
    },
    "eligibility": [
      "Any Cloudflare account on the Workers Free plan"
    ],
    "redemption": [
      "Create a Cloudflare account",
      "Deploy a Worker on the Workers Free plan"
    ],
    "terms": [
      "Daily limit of 100,000 requests, resetting at midnight UTC",
      "Exceeding the daily limit returns Error 1027",
      "10 ms of CPU time per invocation",
      "Requests to static assets are free and unlimited"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of the official page. The live page could not be fetched from the research environment (outbound access to the provider's site was blocked), so an editor should re-check it before marking this verified.",
      "evidence": [
        {
          "claim": "Daily request limit and reset",
          "quote": "Accounts on the Workers Free plan have a daily request limit of 100,000 requests, resetting at midnight UTC. When a Worker exceeds this limit, Cloudflare returns Error 1027."
        },
        {
          "claim": "Static assets",
          "quote": "Requests to static assets are free and unlimited."
        },
        {
          "claim": "CPU time (search extract, paraphrased by the search tool)",
          "quote": "10 milliseconds of CPU time per invocation"
        },
        {
          "claim": "Paid plan minimum",
          "quote": "a minimum charge of $5 USD per month for an account"
        }
      ],
      "checkedAt": "2026-11-02"
    },
    "links": {
      "officialUrl": "https://developers.cloudflare.com/workers/platform/pricing/"
    },
    "audiences": [
      "developers"
    ]
  },
  {
    "id": "o-autodesk-education-plan",
    "slug": "autodesk-education-plan",
    "productId": "autodesk",
    "title": "Autodesk Education plan: free one-year access for eligible students and educators",
    "summary": "Eligible students and educators get free, one-year, single-user access to Autodesk software for educational purposes, renewable while they remain eligible.",
    "description": "Autodesk's Education plan gives eligible students and educators free, one-year, single-user access to Autodesk software for educational purposes. Access can be renewed while you remain eligible.\n\nAutodesk uses SheerID to check eligibility, which can involve documents proving enrollment or employment at a qualified educational institution. The software may only be used for learning, training and research, not for commercial, professional or other for-profit purposes.",
    "type": "student",
    "categories": [
      "student-discounts",
      "software-deals"
    ],
    "source": "official",
    "claim": {
      "method": "verification",
      "note": "Eligibility is checked through SheerID."
    },
    "requirements": {
      "studentVerification": true
    },
    "eligibility": [
      "Students and educators at a qualified educational institution",
      "Products must be used only for educational purposes"
    ],
    "redemption": [
      "Sign in to the Autodesk Education Community",
      "Confirm your eligibility through SheerID, uploading proof of enrollment or employment if asked",
      "Download the software you need"
    ],
    "terms": [
      "Access is single-user and lasts one year, renewable while you remain eligible",
      "Use is limited to learning, training and research; commercial, professional or other for-profit use is not allowed"
    ],
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-19",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Autodesk's official page; live page not checked",
      "note": "Quotes come from search-engine extracts of the official page. The live page could not be fetched from the research environment (outbound access to the provider's site was blocked), so an editor should re-check it before marking this verified.",
      "evidence": [
        {
          "claim": "Free one-year single-user access",
          "quote": "free, one-year, single-user access to Autodesk software for educational purposes"
        },
        {
          "claim": "Allowed use",
          "quote": "learning, training, and research"
        },
        {
          "claim": "No commercial use",
          "quote": "It may not be used for commercial, professional, or any other for-profit purposes."
        },
        {
          "claim": "SheerID verification (search extract, paraphrased by the search tool)",
          "quote": "Autodesk uses a third party, SheerID, to check eligibility."
        },
        {
          "claim": "Renewal (search extract, paraphrased by the search tool)",
          "quote": "access can be renewed each year while the person stays eligible"
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.autodesk.com/support/account/education/students-educators/overview",
      "redeemUrl": "https://www.autodesk.com/education/home"
    },
    "audiences": [
      "students",
      "designers"
    ]
  },
  {
    "id": "o-claude-for-teachers-free-year",
    "slug": "claude-for-teachers-free-year",
    "productId": "claude",
    "title": "Claude for Teachers: a free year of Claude for verified US K-12 educators (sign up by June 30, 2027)",
    "summary": "Verified K-12 educators in the US get Claude for Teachers free, with premium Claude features, teaching skills and curriculum connectors. Signing up by June 30, 2027 gives a full year of free access.",
    "description": "Claude for Teachers gives verified K-12 educators in the US free access to premium Claude capabilities, a library of teaching skills and a connection to evidence-based curricula through Learning Commons, mapped to academic standards in all 50 states. It also includes Claude Code and Cowork.\n\nAnthropic says educators who sign up by June 30, 2027 get a full year of free access. Training is off for verified teacher accounts, and the plan comes with its own teacher terms. Claude for Teachers is for individual educators; schools and districts have a separate free offering with centrally managed accounts.",
    "type": "free-plan",
    "categories": [
      "ai-tools",
      "student-discounts"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "durationMonths": 12
    },
    "claim": {
      "method": "verification",
      "note": "Get verified as a US K-12 educator from the Claude for Teachers page."
    },
    "regions": {
      "scope": "limited",
      "note": "US K-12 educators only."
    },
    "eligibility": [
      "Verified K-12 educator in the US",
      "For individual educators; schools and districts use a separate offering",
      "Educators only, consistent with Claude's 18-and-over policy"
    ],
    "redemption": [
      "Go to claude.com/solutions/teachers",
      "Select Get verified / Verify now and complete educator verification",
      "Sign up by June 30, 2027 to get the full year of free access"
    ],
    "terms": [
      "Sign up by June 30, 2027 for a full year of free access",
      "Training is off for verified teacher accounts",
      "Extra usage limits apply; price and plans are subject to change at Anthropic's discretion"
    ],
    "expiresAt": "2027-06-30",
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-19",
    "status": "published",
    "source": "official",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against Anthropic's official program page",
      "evidence": [
        {
          "claim": "Who gets it and what it includes",
          "quote": "We're introducing Claude for Teachers, providing verified K-12 educators in the US free access to premium Claude capabilities, a library of teaching skills, and a direct connection to evidence-based curricula, mapped to academic standards in all 50 states."
        },
        {
          "claim": "End date and duration (announcement)",
          "quote": "Once verified, educators can access Claude for Teachers entirely free. Sign up by June 30, 2027, for a full year of access."
        },
        {
          "claim": "End date (program page)",
          "quote": "Sign up by June 30, 2027 for your full year of free access."
        },
        {
          "claim": "Price on program page",
          "quote": "For US K-12 teachers Serving verified teachers across US school systems Free Verify now ... Free account with access to premium Claude features"
        },
        {
          "claim": "Individual educators vs. districts",
          "quote": "Claude for Teachers is for individual educators. On August 28, 2026 we launched a dedicated offering for schools and districts."
        },
        {
          "claim": "Includes Claude Code and Cowork",
          "quote": "Claude for Teachers includes Claude Code and Cowork, which means Claude can carry work forward on its own."
        },
        {
          "claim": "Educators only, 18+",
          "quote": "Claude for Teachers is for educators only, consistent with Claude's 18-and-over policy."
        },
        {
          "claim": "No training on teacher accounts",
          "quote": "Training is off for verified teacher accounts."
        },
        {
          "claim": "Usage and price caveat",
          "quote": "*Extra usage limits apply. Prices shown don’t include applicable tax. Price and plans are subject to change at Anthropic’s discretion."
        }
      ]
    },
    "links": {
      "officialUrl": "https://claude.com/solutions/teachers",
      "redeemUrl": "https://claude.ai/teachers"
    },
    "audiences": [
      "students",
      "ai-tools"
    ]
  },
  {
    "id": "o-chatgpt-plus-4-months-free-us-college-students",
    "slug": "chatgpt-plus-4-months-free-us-college-students",
    "productId": "chatgpt",
    "title": "ChatGPT Plus free for 4 months for eligible U.S. college students (claim by October 31, 2026)",
    "summary": "OpenAI's 2026 Back to School offer gives eligible U.S. college and graduate students four free months of ChatGPT Plus, including ChatGPT Work. It must be claimed by October 31, 2026.",
    "description": "Current full-time and part-time college and graduate students at eligible U.S. degree-granting institutions can claim four months of ChatGPT Plus at no cost. Enrollment is verified through SheerID while signed in to the ChatGPT account that should receive the offer.\n\nA payment method is required to activate the offer, but you are not charged during the four free months. After the promotion the subscription renews at $20 per month unless cancelled. If you cancel early, Plus stays active through the current billing period and the remaining free months are forfeited. Existing Plus subscribers billed directly by ChatGPT can claim it; subscriptions billed through the Apple App Store or Google Play are not supported while they remain store-billed.",
    "type": "student",
    "categories": [
      "student-discounts",
      "ai-tools",
      "free-trials"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "period": "month",
      "durationMonths": 4,
      "renewalPrice": 20,
      "renewalPeriod": "month"
    },
    "claim": {
      "method": "verification",
      "note": "Verify enrollment through SheerID on the ChatGPT students page while signed in."
    },
    "requirements": {
      "studentVerification": true,
      "cardRequired": true
    },
    "regions": {
      "scope": "limited",
      "note": "Students at eligible U.S. degree-granting institutions."
    },
    "eligibility": [
      "Current full-time or part-time college or graduate student",
      "Enrolled at an eligible U.S. degree-granting institution",
      "Not billed through the Apple App Store or Google Play"
    ],
    "redemption": [
      "Go to chatgpt.com/students/2026 and sign in to the ChatGPT account you want credited",
      "Verify your enrollment through SheerID",
      "Add a payment method if you are a new Plus subscriber",
      "Claim by October 31, 2026"
    ],
    "terms": [
      "Claim by October 31, 2026",
      "Renews at $20/month after the promotion unless cancelled",
      "Cancelling early forfeits the remaining promotional months",
      "Store-billed (Apple App Store or Google Play) subscriptions are not supported"
    ],
    "expiresAt": "2026-10-31",
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-11-02",
    "status": "archived",
    "source": "official",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of the official page because the page could not be fetched from the research environment; re-check wording and the end date against the live page before publishing. The landing page headline frames the offer as \"4 months of ChatGPT Work on us\" (an \"$80 value\"), while the help article describes it as ChatGPT Plus including ChatGPT Work. The verbatim deadline quote (\"Claim by October 31\") has no year; the year 2026 comes from the offer page URL (/students/2026/) and from search summaries of the help article, which give the deadline as October 31, 2026.",
      "evidence": [
        {
          "claim": "Offer headline",
          "quote": "Get 4 months of ChatGPT Work on us"
        },
        {
          "claim": "Deadline",
          "quote": "Claim by October 31"
        },
        {
          "claim": "Eligibility",
          "quote": "current full-time and part-time college and graduate students enrolled at eligible U.S. degree-granting institutions"
        },
        {
          "claim": "Store-billed subscriptions excluded",
          "quote": "subscriptions billed through the Apple App Store or Google Play are not supported while they remain store-billed"
        },
        {
          "claim": "Cancellation",
          "quote": "any remaining promotional months are forfeited when the cancellation takes effect"
        },
        {
          "claim": "Renewal price",
          "quote": "renews at $20/month unless you cancel"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://help.openai.com/en/articles/20001493-chatgpt-back-to-school-offer-for-students",
      "redeemUrl": "https://chatgpt.com/students/2026/"
    },
    "audiences": [
      "students",
      "ai-tools"
    ]
  },
  {
    "id": "o-gemini-4-argon-introductory-api-pricing",
    "slug": "gemini-4-argon-introductory-api-pricing",
    "productId": "gemini-api",
    "title": "Gemini 4 Argon introductory API pricing: $2 input / $10 output per 1M tokens until November 30, 2026",
    "summary": "Google is charging an introductory rate for Gemini 4 Argon on the Gemini API's paid tier until November 30, 2026, after which the price doubles to $4 input and $20 output per 1M tokens.",
    "description": "Gemini 4 Argon launched on the Gemini Developer API at an introductory price of $2 per 1M input tokens and $10 per 1M output tokens on the standard paid tier. Google states that after the introductory period expires on November 30, 2026, the price becomes $4 per 1M input tokens and $20 per 1M output tokens.\n\nThe model is not available on the Gemini API Free tier. Other tiers (such as Priority and Batch) have their own introductory rates that also change after November 30, 2026; check the pricing page for the tier you use.",
    "type": "discount",
    "categories": [
      "ai-tools",
      "saas-discounts"
    ],
    "claim": {
      "method": "automatic",
      "note": "The introductory rate applies to paid-tier Gemini API usage of Gemini 4 Argon until November 30, 2026."
    },
    "eligibility": [
      "Gemini API paid tier (the model is not available on the Free tier)"
    ],
    "redemption": [
      "Use the Gemini 4 Argon model on a paid Gemini API project; billing uses the introductory rate until November 30, 2026"
    ],
    "terms": [
      "Introductory input price is $2.00 per 1M tokens through November 30, 2026, then $4.00 starting December 1, 2026",
      "After November 30, 2026, $4 per 1M input tokens and $20 per 1M output tokens apply"
    ],
    "expiresAt": "2026-11-30",
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-19",
    "status": "published",
    "source": "official",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Google's official page; live page not checked",
      "note": "Quotes come from search-engine extracts of the official page because the page could not be fetched from the research environment; re-check wording and the end date against the live page before publishing.",
      "evidence": [
        {
          "claim": "Pricing table: free tier unavailable; introductory input price and end date",
          "quote": "Input price | Not available | $2.00 through November 30, 2026.$4.00 starting December 1, 2026."
        },
        {
          "claim": "Price after the introductory period (blog)",
          "quote": "After the introductory period expires on November 30, 2026, the price of $4 per 1M input tokens and $20 per 1M output tokens will apply."
        },
        {
          "claim": "Launch price (blog)",
          "quote": "$2 per million input tokens and $10 per million output tokens"
        },
        {
          "claim": "Region: Gemini API Additional Terms: region restriction",
          "quote": "You may only access the Services (or make API Clients available to users) within an available region."
        },
        {
          "claim": "Region: Available regions page",
          "quote": "Available regions for Google AI Studio and Gemini API"
        }
      ]
    },
    "links": {
      "officialUrl": "https://ai.google.dev/gemini-api/docs/pricing"
    },
    "regions": {
      "scope": "limited",
      "note": "Only in the countries and territories where the Gemini API is available (see ai.google.dev/gemini-api/docs/available-regions)."
    },
    "audiences": [
      "ai-tools",
      "developers"
    ]
  },
  {
    "id": "o-kiro-startup-credits-2026",
    "slug": "kiro-startup-credits-2026",
    "productId": "kiro",
    "title": "Kiro startup credits: up to a year of free Kiro Pro+ for early-stage to Series A startups (apply by December 31, 2026)",
    "summary": "AWS's Kiro startup program offers early-stage to Series A startups up to a year's worth of free Kiro Pro+. The 2026 program terms run from April 7 to December 31, 2026.",
    "description": "Kiro, the AI coding IDE from AWS, runs a startup credits program that gives eligible early-stage to Series A startups up to 1 year's worth of free Kiro Pro+. The amount of promotion credits depends on the tier you select, and applications are reviewed on a rolling basis.\n\nYou need an AWS account whose email address uses a domain matching your startup's corporate website. Startups with active AWS Activate credits are not eligible, although Activate credits can already be used for Kiro. The offer is limited to one subscription per startup, credits expire one year after they are issued, and once credits run out the account switches to standard Kiro Pro+ billing.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "ai-tools",
      "free-credits"
    ],
    "claim": {
      "method": "application",
      "note": "Apply through AWS Startups at aws.amazon.com/startups/credits/kiro."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Early-stage to Series A startup",
      "AWS account whose email domain matches the startup's corporate website",
      "No active AWS Activate credits",
      "Applicants must be 18 years and older"
    ],
    "redemption": [
      "Create an AWS account if you don't have one",
      "Apply at aws.amazon.com/startups/credits/kiro and choose a tier",
      "Wait for the rolling review; the decision is sent to your AWS account email",
      "After approval, credits are added to your AWS account; sign in to Kiro through IAM Identity Center"
    ],
    "terms": [
      "Program terms run from April 7, 2026 to December 31, 2026",
      "Limited to one subscription per startup; credits can be received once",
      "Credits expire one year after issuance",
      "When credits run out, the account switches to standard Kiro Pro+ billing"
    ],
    "expiresAt": "2026-12-31",
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "source": "official",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of the official page because the page could not be fetched from the research environment; re-check wording and the end date against the live page before publishing. The end date is from the 2026 program terms; the startups page itself only says \"for a limited time\". AWS may modify or cancel the offer at any time.",
      "evidence": [
        {
          "claim": "Offer",
          "quote": "for a limited time only, early stage to Series A startups globally can apply for up to 1-year's worth of free Kiro Pro+"
        },
        {
          "claim": "Program dates (terms)",
          "quote": "April 7, 2026 to December 31, 2026"
        },
        {
          "claim": "Activate exclusion",
          "quote": "Startups with active AWS Activate Credits are not eligible for this promotion, but don't worry, Activate credits can be used for Kiro."
        },
        {
          "claim": "Email domain requirement",
          "quote": "must include a domain name matching the domain name for your startup's corporate website"
        },
        {
          "claim": "Rolling review",
          "quote": "Applications will be reviewed on a rolling basis"
        },
        {
          "claim": "One per startup",
          "quote": "Offer limited to 1 subscription per startup. You may only receive Kiro credits once under this promotion."
        },
        {
          "claim": "Credit expiry",
          "quote": "Credits expire 1 year after the date of issuance"
        },
        {
          "claim": "After credits run out",
          "quote": "Once credits run out, your AWS Account will automatically switch to standard Kiro Pro+ billing."
        },
        {
          "claim": "Age",
          "quote": "18 years and older"
        },
        {
          "claim": "Region: Scope wording (startups page)",
          "quote": "early stage to Series A startups in most countries or regions globally can apply for up to one year's worth of Kiro Pro+ credits"
        },
        {
          "claim": "Region: Excluded countries (startups FAQ)",
          "quote": "Excludes individuals living in Argentina, Belarus, Brazil, China/GCR, Cuba, France, Germany, Iran, Italy, Mexico, North Korea, Poland, Russia, Spain, Syria, the region of Crimea, the so-called Donetsk People's Republic region (DNR), the so-called Luhansk People's Republic region (LNR), and the United Arab Emirates."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://kiro.dev/startups/terms/",
      "redeemUrl": "https://kiro.dev/startups/"
    },
    "regions": {
      "scope": "limited",
      "note": "Excludes individuals living in Argentina, Belarus, Brazil, China/GCR, Cuba, France, Germany, Iran, Italy, Mexico, North Korea, Poland, Russia, Spain, Syria, Crimea, the so-called DNR and LNR regions, and the United Arab Emirates."
    },
    "audiences": [
      "startups",
      "ai-tools",
      "developers"
    ]
  },
  {
    "id": "o-perplexity-amex-1000-computer-credits",
    "slug": "perplexity-amex-1000-computer-credits",
    "productId": "perplexity",
    "title": "Perplexity Enterprise: 1,000 bonus Computer Credits when you pay with a U.S. American Express card (ends March 29, 2027)",
    "summary": "Perplexity gives a one-time bonus of 1,000 Perplexity Computer Credits to Enterprise Pro or Enterprise Max accounts paid on perplexity.ai with a U.S. American Express card between October 1, 2026 and March 29, 2027.",
    "description": "Under Perplexity's American Express partnership, paying for a new or existing Perplexity Enterprise Pro or Enterprise Max subscription on perplexity.ai with a U.S. American Express card earns a one-time bonus of 1,000 Perplexity Computer Credits. Perplexity's offer page says the offer ends 03/29/2027.\n\nThe bonus is limited to one per eligible Perplexity account, not per seat. Credits can take up to 90 days after the eligible charge to arrive, expire 60 calendar days after they are awarded, and are forfeited if the Perplexity subscription is cancelled.",
    "type": "free-credits",
    "categories": [
      "free-credits",
      "ai-tools"
    ],
    "claim": {
      "method": "automatic",
      "note": "Pay for Perplexity Enterprise Pro or Enterprise Max on perplexity.ai with an eligible U.S. American Express card."
    },
    "regions": {
      "scope": "limited",
      "note": "U.S. American Express cards."
    },
    "eligibility": [
      "New or existing Perplexity Enterprise Pro or Enterprise Max subscription",
      "Paid on perplexity.ai with a U.S. American Express card between 10/1/2026 and 3/29/2027"
    ],
    "redemption": [
      "Pay for Perplexity Enterprise Pro or Enterprise Max on perplexity.ai with a U.S. American Express card",
      "Wait for the 1,000 Computer Credits to post (up to 90 days after the eligible charge)"
    ],
    "terms": [
      "Offer ends 03/29/2027",
      "One bonus of 1,000 Computer Credits per eligible Perplexity account, not per seat",
      "Credits expire 60 calendar days after they are awarded",
      "Credits are forfeited if the Perplexity subscription is cancelled"
    ],
    "expiresAt": "2027-03-29",
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-19",
    "status": "published",
    "source": "official",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Perplexity's official page; live page not checked",
      "note": "Quotes come from search-engine extracts of the official page because the page could not be fetched from the research environment; re-check wording and the end date against the live page before publishing. The same page also describes a separate American Express statement-credit offer that requires enrolling the card with American Express; it is not covered here.",
      "evidence": [
        {
          "claim": "End date",
          "quote": "Offer ends 03/29/2027"
        },
        {
          "claim": "Eligible purchases",
          "quote": "Eligible purchases include existing or new Perplexity Enterprise Pro or Enterprise Max subscriptions."
        },
        {
          "claim": "Purchase window",
          "quote": "between 10/1/2026 and 3/29/2027"
        },
        {
          "claim": "Bonus amount and limit",
          "quote": "one (1) bonus of 1,000 Perplexity Computer Credits per eligible Perplexity Account (not per seat)"
        },
        {
          "claim": "Posting time",
          "quote": "up to 90 days after the eligible charge"
        },
        {
          "claim": "Expiry and forfeiture",
          "quote": "expire 60 calendar days after they are awarded, and will be forfeited upon cancellation of your Perplexity subscription"
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.perplexity.ai/hub/partnerships/amex"
    },
    "audiences": [
      "ai-tools",
      "businesses"
    ]
  },
  {
    "id": "o-devin-gemini-4-argon-75-off-october-2026",
    "slug": "devin-gemini-4-argon-75-off-october-2026",
    "productId": "devin-desktop",
    "title": "Gemini 4 Argon at 75% off list price in Devin Desktop and Devin CLI (through October 27, 2026)",
    "summary": "Cognition is offering Gemini 4 Argon in Devin Desktop (formerly Windsurf) and Devin CLI at 75% off list price through October 27, 2026, by adding an extra 50% discount on top of Google's introductory pricing.",
    "description": "Gemini 4 Argon is live in Devin Desktop and Devin CLI. Through October 27, 2026, Cognition adds an extra 50% discount on top of Google's 50% introductory pricing, which works out to 75% off list price. During the promotion the token rates are $1.00 per 1M input tokens, $5.00 per 1M output tokens and $0.05 per 1M cached input tokens.\n\nAfter October 27, Devin's docs say Google's introductory rate of $2.00 input / $10.00 output per 1M tokens applies through December 1, 2026, and list pricing applies afterward. Credit-based enterprise customers get a separate deal: Gemini 4 Argon is half price in credits (25, 35 and 45 credits for Low, Medium and High) through October 27, 2026.",
    "type": "discount",
    "categories": [
      "ai-tools",
      "saas-discounts"
    ],
    "pricing": {
      "currency": "USD",
      "savingsLabel": "75% off list price through October 27, 2026"
    },
    "claim": {
      "method": "automatic",
      "note": "Pick Gemini 4 Argon in the Devin Desktop or Devin CLI model selector; the discounted rate is applied to usage through October 27, 2026."
    },
    "eligibility": [
      "Devin Desktop or Devin CLI users who select Gemini 4 Argon",
      "Credit-based enterprise customers get a separate half-price credit rate through October 27, 2026"
    ],
    "redemption": [
      "Open Devin Desktop or Devin CLI",
      "Select Gemini 4 Argon in the model selector",
      "Usage through October 27, 2026 is billed at the promotional rate"
    ],
    "terms": [
      "75% off list price runs through October 27, 2026",
      "The discount combines Google's 50% introductory pricing with an extra 50% discount from Devin",
      "Google's introductory pricing runs through December 1, 2026, then list pricing applies"
    ],
    "expiresAt": "2026-10-27",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of the official page because the page could not be fetched from the research environment; re-check wording and the end date against the live page before publishing. Devin's docs give the introductory-rate end as December 1, 2026 while Google's own pricing page says November 30, 2026; only the October 27 date is used here. No country restriction is stated in the offer terms; not labelled worldwide because the provider does not say so explicitly.",
      "evidence": [
        {
          "claim": "Offer and end date (blog)",
          "quote": "Gemini 4 Argon is now live in Devin Desktop and Devin CLI, at 75% off list price through October 27, 2026."
        },
        {
          "claim": "How the discount is built (blog)",
          "quote": "That combines Google's 50% introductory pricing, which runs through December 1, 2026, with an extra 50% discount in Devin through October 27, 2026."
        },
        {
          "claim": "Promotional token rates (docs)",
          "quote": "with an additional 50% off ($1.00/1M input, $5.00/1M output, $0.05/1M cache input) through October 27, 2026"
        },
        {
          "claim": "Enterprise credit rate (docs)",
          "quote": "Gemini 4 Argon is half price (25, 35, and 45 credits for Low, Medium, and High) through October 27, 2026."
        },
        {
          "claim": "Enterprise credit rate scope (docs)",
          "quote": "This only applies to credit-based enterprise customers."
        },
        {
          "claim": "Region basis",
          "quote": "No country or region restriction appears in the blog announcement or the models docs pricing note checked above; offer applies to self-serve usage in the product."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://devin.ai/blog/gemini-4-argon",
      "redeemUrl": "https://docs.devin.ai/desktop/models"
    },
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-11-02",
    "status": "archived",
    "source": "official",
    "audiences": [
      "ai-tools",
      "developers"
    ]
  },
  {
    "id": "o-vercel-ai-gateway-laya-free-october-2026",
    "slug": "vercel-ai-gateway-laya-free-october-2026",
    "productId": "vercel",
    "title": "Laya decision model free on Vercel AI Gateway (through October 31, 2026)",
    "summary": "Vercel AI Gateway is serving Convai Innovations' Laya decision model for free through October 31, 2026, when requests are served by Boundless.",
    "description": "Laya, a decision model from Convai Innovations, is available on Vercel AI Gateway. Through October 31, 2026, both model IDs, convaiinnovations/laya and convaiinnovations/laya-free, are free when served by the provider Boundless.\n\nThe -free ID routes to Boundless and stops serving when the promotion ends. Promotional pricing is applied automatically at request time.",
    "type": "free-plan",
    "categories": [
      "ai-tools",
      "free-credits"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Call convaiinnovations/laya or convaiinnovations/laya-free through Vercel AI Gateway; promotional pricing is applied at request time."
    },
    "eligibility": [
      "Vercel AI Gateway users"
    ],
    "redemption": [
      "Set up Vercel AI Gateway on your Vercel account",
      "Send requests to convaiinnovations/laya or convaiinnovations/laya-free",
      "Requests served by Boundless are free through October 31, 2026"
    ],
    "terms": [
      "Free only when served by Boundless",
      "The -free model ID stops serving after the promotion"
    ],
    "expiresAt": "2026-10-31",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Vercel's official page; live page not checked",
      "note": "Quotes come from search-engine extracts of the official page because the page could not be fetched from the research environment; re-check wording and the end date against the live page before publishing. No country restriction is stated in the offer terms; not labelled worldwide because the provider does not say so explicitly.",
      "evidence": [
        {
          "claim": "Free window and end date (changelog)",
          "quote": "Through October 31, 2026, both convaiinnovations/laya and convaiinnovations/laya-free are free when served by Boundless."
        },
        {
          "claim": "-free ID ends with the promotion (changelog)",
          "quote": "The -free ID routes to Boundless and stops serving after the promotion."
        },
        {
          "claim": "Automatic application (AI Gateway page)",
          "quote": "Promotional pricing applies automatically at request time."
        },
        {
          "claim": "Region basis",
          "quote": "The changelog terms quoted above contain no country or region restriction; AI Gateway is a self-serve online service."
        }
      ]
    },
    "links": {
      "officialUrl": "https://vercel.com/changelog/laya-decision-model-now-available-on-ai-gateway-free-through-october-31",
      "redeemUrl": "https://vercel.com/ai-gateway/models/laya-free"
    },
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-11-02",
    "status": "archived",
    "source": "official",
    "audiences": [
      "developers",
      "ai-tools"
    ]
  },
  {
    "id": "o-figma-code-layers-no-ai-credits-november-2026",
    "slug": "figma-code-layers-no-ai-credits-november-2026",
    "productId": "figma",
    "title": "Figma code layers: generating and editing code uses no AI credits (through November 4)",
    "summary": "During the open beta of code layers in Figma Design, generating and editing code inside a code layer does not use AI credits through November 4; after that, code layer tasks use AI credits like other agentic AI features.",
    "description": "Figma launched code layers in Figma Design in open beta on October 15, 2026. Until November 4, generating and editing code inside code layers does not use AI credits. Other work the Figma agent does as part of the same request still consumes AI credits.\n\nAfter November 4, all code layer tasks use AI credits like Figma's other agentic AI features. Code layers is rolling out gradually, so some accounts may see the feature later than others.",
    "type": "free-plan",
    "categories": [
      "ai-tools",
      "software-deals"
    ],
    "claim": {
      "method": "automatic",
      "note": "No action needed: code-layer generation and editing are not charged AI credits until November 4."
    },
    "eligibility": [
      "Figma Design users with access to code layers (open beta, rolling out gradually)"
    ],
    "redemption": [
      "Open a Figma Design file",
      "Create or edit a code layer",
      "Code generation and editing inside the code layer does not use AI credits until November 4"
    ],
    "terms": [
      "Only code generation and editing inside code layers is free; other Figma agent work in the same request still uses AI credits",
      "After November 4, all code layer tasks use AI credits"
    ],
    "expiresAt": "2026-11-04",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of the official page because the page could not be fetched from the research environment; re-check wording and the end date against the live page before publishing. Figma's verbatim lines say \"November 4\" without a year; the year 2026 comes from the open beta launch post dated October 15, 2026 and search extracts of the help center. Figma's help center and Config India page disagree on whether K-12 Education plans have access, so plan eligibility is left out. No country restriction is stated in the offer terms; not labelled worldwide because the provider does not say so explicitly.",
      "evidence": [
        {
          "claim": "Free window (pricing FAQ)",
          "quote": "Free through November 4: Generating and editing code inside code layers."
        },
        {
          "claim": "Other agent work still billed (pricing FAQ)",
          "quote": "The Figma agent's other work related to your request still consumes AI credits."
        },
        {
          "claim": "After the end date (help center)",
          "quote": "After November 4, all code layer tasks will use AI credits like other agentic AI features."
        },
        {
          "claim": "Open beta launch (blog, dated October 15, 2026)",
          "quote": "code layers is rolling out in open beta starting today, and will use AI credits."
        },
        {
          "claim": "Region basis",
          "quote": "The pricing FAQ and help-center terms quoted above contain no country or region restriction; the window applies within the Figma product."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.figma.com/pricing-faq/",
      "redeemUrl": "https://help.figma.com/hc/en-us/articles/44193259600535-Code-layers-in-Figma-Design"
    },
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-23",
    "status": "published",
    "source": "official",
    "audiences": [
      "designers",
      "ai-tools"
    ]
  },
  {
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-20",
    "status": "published",
    "source": "official",
    "id": "o-wave-starter-free-plan",
    "slug": "wave-starter-free-plan",
    "productId": "wave",
    "title": "Wave Starter plan: free invoicing and accounting for US and Canadian businesses",
    "summary": "Wave's Starter Plan is free and covers basic accounting and invoicing. It is available to businesses in the United States and Canada, and no credit card is needed.",
    "description": "Wave's Starter Plan is its free tier, with basic bookkeeping and invoicing. Wave says it remains committed to offering the Starter Plan for free.\n\nPaid extras such as accepting online payments, receipt scanning and payroll can be added on top, and the paid Pro Plan adds features such as auto-importing bank transactions. Card payments carry processing fees on every plan.\n\nWave is available only to businesses located in the United States and Canada.",
    "type": "free-plan",
    "categories": [
      "software-deals",
      "saas-discounts"
    ],
    "audiences": [
      "freelancers",
      "businesses"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "period": "month"
    },
    "claim": {
      "method": "automatic",
      "note": "Choose the free option when you create a Wave account."
    },
    "requirements": {
      "cardRequired": false
    },
    "regions": {
      "scope": "limited",
      "note": "United States and Canada only"
    },
    "eligibility": [
      "Businesses located in the United States or Canada"
    ],
    "redemption": [
      "Create a Wave account in a web browser or the Wave mobile app",
      "Choose the free Starter option during setup"
    ],
    "terms": [
      "No credit card is required for the free plan",
      "Online payments, receipt scanning and payroll are paid add-ons"
    ],
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Wave's official page; live page not checked",
      "note": "Official site was not reachable from the research environment; figures taken from search-result extracts of the provider's own pages. Re-check before publishing as verified.",
      "evidence": [
        {
          "claim": "Region",
          "quote": "Wave is available for businesses located in the United States and Canada."
        },
        {
          "claim": "No card required",
          "quote": "For the free plan, no credit card info is required!"
        },
        {
          "claim": "Starter stays free",
          "quote": "remains committed to offering the Starter Plan for free"
        },
        {
          "claim": "Existing users moved to Starter",
          "quote": "starting June 10, 2024, these businesses will automatically be part of the free Starter Plan, with the option of upgrading to the Pro Plan at any time"
        }
      ]
    },
    "links": {
      "officialUrl": "https://support.waveapps.com/hc/en-us/articles/208621296-Is-Wave-free",
      "redeemUrl": "https://www.waveapps.com"
    }
  },
  {
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-20",
    "status": "published",
    "source": "official",
    "id": "o-zoho-invoice-free",
    "slug": "zoho-invoice-free",
    "productId": "zoho-invoice",
    "title": "Zoho Invoice: free invoicing with up to 500 invoices per year",
    "summary": "Zoho Invoice is free for small businesses, with no credit card, ads or hidden fees. The free plan allows up to two users, three projects and 500 invoices per year.",
    "description": "Zoho made Zoho Invoice completely free for small and medium-sized businesses and says it will remain ad-free and will never sell your data.\n\nThe free plan lets you add up to two users, create up to three projects and send up to 500 invoices per year. It covers invoices, payment reminders, payment collection and expense recording.\n\nLimits are quoted from Zoho's US pricing page; Zoho runs regional pricing pages for other countries.",
    "type": "free-plan",
    "categories": [
      "software-deals",
      "saas-discounts"
    ],
    "audiences": [
      "freelancers",
      "businesses"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up for Zoho Invoice; no payment details are needed."
    },
    "requirements": {
      "cardRequired": false
    },
    "regions": {
      "scope": "global",
      "note": "Zoho announced Zoho Invoice as free for SMBs everywhere; limits quoted from the US pricing page."
    },
    "eligibility": [
      "Small and medium-sized businesses"
    ],
    "redemption": [
      "Go to Zoho Invoice's pricing page",
      "Sign up for a free account"
    ],
    "terms": [
      "Up to two users",
      "Up to three projects",
      "Up to 500 invoices per year",
      "No credit cards, ads or hidden fees"
    ],
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Zoho's official page; live page not checked",
      "note": "Official site was not reachable from the research environment; figures taken from search-result extracts of the provider's own pages. Re-check before publishing as verified.",
      "evidence": [
        {
          "claim": "Free-plan limits (US pricing page)",
          "quote": "Add up to two users. Create a maximum of three projects. Send up to 500 invoices per year."
        },
        {
          "claim": "No card, ads or fees",
          "quote": "No credit cards, no ads, and no hidden fees."
        },
        {
          "claim": "Free for SMBs",
          "quote": "Zoho Invoice will now be completely free for all small and medium-sized businesses"
        },
        {
          "claim": "Data and ads",
          "quote": "We will never sell your data, and Zoho Invoice will remain ad-free"
        },
        {
          "claim": "Worldwide (blog title)",
          "quote": "Leveling the playing field: Zoho Invoice is now free for SMBs everywhere"
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.zoho.com/us/invoice/pricing/"
    }
  },
  {
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-23",
    "status": "published",
    "source": "official",
    "id": "o-clockify-free-plan",
    "slug": "clockify-free-plan",
    "productId": "clockify",
    "title": "Clockify Free plan: unlimited time tracking for up to 5 users",
    "summary": "Clockify's Free plan includes unlimited time tracking for unlimited projects, tasks and clients, for up to 5 active users including the owner.",
    "description": "Clockify's Free plan covers the time tracker, timesheet, calendar, mobile and desktop apps, and reports, with unlimited tracking across projects, tasks and clients.\n\nThe Free plan is capped at 5 active users, counting the workspace owner. During a free trial there is no limit on invites, but when the trial ends only the first 4 invitees plus the owner stay active. Moving to a paid plan means every user needs a paid seat.",
    "type": "free-plan",
    "categories": [
      "software-deals",
      "saas-discounts"
    ],
    "audiences": [
      "freelancers",
      "businesses"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up for Clockify and stay on the Free plan."
    },
    "eligibility": [
      "Individuals and teams of up to 5 active users, including the owner"
    ],
    "redemption": [
      "Sign up for a Clockify account",
      "Keep 5 or fewer active members in the workspace to remain on the Free plan"
    ],
    "terms": [
      "5 active users maximum, including the owner",
      "After a trial ends, only the first 4 invitees plus the owner stay active",
      "On a paid plan, every user requires a paid seat"
    ],
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Official site was not reachable from the research environment; figures taken from search-result extracts of the provider's own pages. Re-check before publishing as verified.",
      "evidence": [
        {
          "claim": "Unlimited tracking",
          "quote": "unlimited time tracking for an unlimited number of: Projects, Tasks, and Clients"
        },
        {
          "claim": "User cap",
          "quote": "5 total active users, including the owner"
        },
        {
          "claim": "After trial",
          "quote": "the Free plan will only keep your first 4 invitees + owner active"
        },
        {
          "claim": "Paid seats",
          "quote": "every user requires a paid seat"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://clockify.me/help/administration/updates-to-clockify-free-plan",
      "redeemUrl": "https://clockify.me/pricing"
    }
  },
  {
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-23",
    "status": "published",
    "source": "official",
    "id": "o-calendly-free-plan",
    "slug": "calendly-free-plan",
    "productId": "calendly",
    "title": "Calendly Free plan: one event type and one calendar connection, always free",
    "summary": "Calendly's Free plan is always free and includes one event type, one calendar connection, one-on-one scheduling, a customizable booking page and a browser extension.",
    "description": "Calendly lists its Free plan as always free. It includes one event type, one calendar connection and one-on-one scheduling, along with a customizable booking page and a browser extension.\n\nIt suits freelancers and solo professionals who need a single bookable meeting type; group and team scheduling are on paid plans.",
    "type": "free-plan",
    "categories": [
      "software-deals",
      "saas-discounts"
    ],
    "audiences": [
      "freelancers",
      "office-tools"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up for Calendly and choose the Free plan."
    },
    "eligibility": [
      "Anyone with a Calendly account"
    ],
    "redemption": [
      "Go to Calendly's pricing page",
      "Sign up and choose the Free plan"
    ],
    "terms": [
      "One event type",
      "One calendar connection",
      "One-on-one scheduling"
    ],
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Official site was not reachable from the research environment; figures taken from search-result extracts of the provider's own pages. Re-check before publishing as verified.",
      "evidence": [
        {
          "claim": "Free plan contents",
          "quote": "Free: Always free. Includes: Scheduling - One event type - One calendar connection - One-on-one scheduling - Customizable booking page - Browser extension"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://calendly.com/pricing"
    }
  },
  {
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-23",
    "status": "published",
    "source": "official",
    "id": "o-shopify-free-trial-1-dollar-3-months",
    "slug": "shopify-free-trial-1-dollar-3-months",
    "productId": "shopify",
    "title": "Shopify: free 3-day trial, then $1 per month for the first 3 months",
    "summary": "Shopify starts with a free 3-day trial with no credit card required. After the trial, most plans cost $1 per month for the first 3 months, then standard monthly pricing applies.",
    "description": "Shopify offers a free 3-day trial with no credit card required. After the trial, most plans start at $1 per month for the first 3 months before switching to standard monthly pricing.\n\nThe offer applies to most plans, not all; check the pricing page for your country and plan before signing up.",
    "type": "free-trial",
    "categories": [
      "free-trials",
      "saas-discounts"
    ],
    "audiences": [
      "businesses",
      "creators"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 1,
      "period": "month",
      "durationMonths": 3,
      "savingsLabel": "3 months for $1/mo"
    },
    "claim": {
      "method": "automatic",
      "note": "Applied when you start a store from Shopify's sign-up page."
    },
    "requirements": {
      "cardRequired": false
    },
    "eligibility": [
      "People starting a new Shopify store"
    ],
    "redemption": [
      "Go to shopify.com/start",
      "Start the free 3-day trial",
      "Pick a plan after the trial to get $1 per month for the first 3 months"
    ],
    "terms": [
      "The trial lasts 3 days and needs no credit card",
      "The $1 price applies to most plans, not all",
      "Standard monthly pricing applies after the first 3 months"
    ],
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Official site was not reachable from the research environment; figures taken from search-result extracts of the provider's own pages. Re-check before publishing as verified.",
      "evidence": [
        {
          "claim": "Trial and $1 months",
          "quote": "Shopify starts with a free 3-day trial—no credit card required. After your trial, most plans start at just $1 per month for the first 3 months, then switch to standard monthly pricing."
        },
        {
          "claim": "Start page wording",
          "quote": "Start for free, then get 3 months for $1/mo."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.shopify.com/pricing",
      "redeemUrl": "https://www.shopify.com/start"
    }
  },
  {
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-23",
    "status": "published",
    "source": "official",
    "id": "o-1password-business-14-day-trial",
    "slug": "1password-business-14-day-trial",
    "productId": "1password-business",
    "title": "1Password Business: 14-day free trial, no credit card required",
    "summary": "1Password lets businesses try its Business plan free for 14 days without entering a credit card.",
    "description": "1Password offers a 14-day free trial of 1Password Business so teams can test it before choosing a plan. No credit card is needed to start.\n\nThe trial is useful for small businesses and startups moving shared passwords out of spreadsheets and chat into a managed password vault.",
    "type": "free-trial",
    "categories": [
      "free-trials",
      "software-deals"
    ],
    "audiences": [
      "businesses",
      "startups"
    ],
    "claim": {
      "method": "automatic",
      "note": "Start the trial from 1Password's business pricing page."
    },
    "requirements": {
      "cardRequired": false
    },
    "eligibility": [
      "Businesses and teams creating a new 1Password Business account"
    ],
    "redemption": [
      "Go to 1Password's business pricing page",
      "Choose Business and start the free trial"
    ],
    "terms": [
      "The trial lasts 14 days",
      "No credit card is required to start"
    ],
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Official site was not reachable from the research environment; figures taken from search-result extracts of the provider's own pages. Re-check before publishing as verified.",
      "evidence": [
        {
          "claim": "Trial length and card",
          "quote": "Try free for 14 days, no credit card required"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://1password.com/pricing/business"
    }
  },
  {
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-23",
    "status": "published",
    "source": "official",
    "id": "o-slack-free-plan",
    "slug": "slack-free-plan",
    "productId": "slack",
    "title": "Slack Free plan: team messaging with 90 days of message history",
    "summary": "Slack's free version is free to use, with access to the most recent 90 days of message and file history; data older than one year is deleted.",
    "description": "On Slack's free version, workspaces can see the most recent 90 days of message and file history, and data in the workspace that is more than one year old is deleted. Upgrading reveals messages and files beyond the 90-day limit.\n\nFree workspaces that haven't had a Slack Connect trial may be offered a 90-day trial of Slack Pro, once per workspace, with no credit card required.",
    "type": "free-plan",
    "categories": [
      "software-deals",
      "saas-discounts"
    ],
    "audiences": [
      "office-tools",
      "businesses",
      "startups"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Create a Slack workspace; it starts on the free version."
    },
    "eligibility": [
      "Any team creating a Slack workspace"
    ],
    "redemption": [
      "Go to slack.com and create a workspace",
      "Stay on the free version or upgrade later"
    ],
    "terms": [
      "Only the most recent 90 days of message and file history are available",
      "Workspace data more than one year old is deleted",
      "The 90-day Pro trial offered to eligible teams can be applied only once per workspace"
    ],
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Official site was not reachable from the research environment; figures taken from search-result extracts of the provider's own pages. Re-check before publishing as verified.",
      "evidence": [
        {
          "claim": "History limit and deletion",
          "quote": "On the free version of Slack, you'll be limited to the most recent 90 days of message and file history, and all data in your workspace that's more than one year old will be deleted. When you upgrade, your messages and files beyond the 90-day limit will be revealed."
        },
        {
          "claim": "Pro trial for eligible teams",
          "quote": "Eligible teams will have access to Slack's Pro plan and all its premium features, including Slack Connect, for 90 days. This trial offer can be applied only once per workspace."
        },
        {
          "claim": "No card for trial",
          "quote": "You won't need to add a credit card to accept the trial offer."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://slack.com/help/articles/27204752526611-Feature-limitations-on-the-free-version-of-Slack",
      "redeemUrl": "https://slack.com/pricing/free"
    }
  },
  {
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-23",
    "status": "published",
    "source": "official",
    "id": "o-dropbox-sign-free-plan",
    "slug": "dropbox-sign-free-plan",
    "productId": "dropbox-sign",
    "title": "Dropbox Sign free plan: 3 signature requests per month",
    "summary": "Dropbox Sign's free plan includes 3 signature requests per month, with up to 3 signers per document. Self-signing doesn't count toward the limit.",
    "description": "Dropbox Sign's free plan lets you send 3 signature requests per month. Self-signing doesn't count towards that limit, and documents sent to signers in a single bundle count as one request.\n\nEach document can have up to 3 signers on the free plan. When a request is completed you receive a PDF of the signed documents plus an audit trail. The allowance renews monthly on the day of the month you signed up, not on the 1st.",
    "type": "free-plan",
    "categories": [
      "software-deals",
      "saas-discounts"
    ],
    "audiences": [
      "freelancers",
      "businesses"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up for a free Dropbox Sign account."
    },
    "eligibility": [
      "Anyone with a Dropbox Sign account"
    ],
    "redemption": [
      "Go to Dropbox Sign",
      "Create a free account and send up to 3 signature requests per month"
    ],
    "terms": [
      "3 signature requests per month",
      "Up to 3 signers per document",
      "Self-signing doesn't count toward the 3 requests",
      "A single bundle of documents sent to signers counts as one request",
      "The allowance renews on your sign-up day each month"
    ],
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Official site was not reachable from the research environment; figures taken from search-result extracts of the provider's own pages. Re-check before publishing as verified.",
      "evidence": [
        {
          "claim": "Monthly allowance and self-signing",
          "quote": "Self-signing doesn't count towards your 3 free signature requests per month."
        },
        {
          "claim": "Bundles",
          "quote": "As long as you send the document(s) to the signer(s) in a single bundle, it counts as only one signature request."
        },
        {
          "claim": "Signers per document",
          "quote": "If you're on a Dropbox Sign free plan, you can have up to 3 signers per document."
        },
        {
          "claim": "Audit trail",
          "quote": "When your signature request is completed, you'll receive a PDF of the signed document(s) plus an audit trail."
        },
        {
          "claim": "Rolling renewal",
          "quote": "if you used your documents on January 17th, 20th, and 21st, your pages will not renew on February 1st. You will still be out of docs until they renew on February 17th."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://help.dropbox.com/plans/dropbox-sign-free-plan",
      "redeemUrl": "https://sign.dropbox.com"
    }
  },
  {
    "id": "o-adobe-express-free-plan",
    "slug": "adobe-express-free-plan",
    "productId": "adobe-express",
    "title": "Adobe Express Free plan: 5GB storage and 100,000+ templates",
    "summary": "Adobe Express has a Free plan with 5GB of storage, 10 days of version history and access to 100,000+ static and video templates.",
    "description": "Adobe Express offers an ongoing Free plan. Adobe's help page lists 5GB of storage, 10 days of version history and access to more than 100,000 static and video templates.\n\nPremium editing features, such as background removal and bulk resize, require an upgrade to a paid plan.",
    "type": "free-plan",
    "categories": [
      "software-deals"
    ],
    "audiences": [
      "designers",
      "creators",
      "marketing-tools"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up for a free Adobe account at adobe.com/express."
    },
    "eligibility": [
      "Anyone with an Adobe account"
    ],
    "redemption": [
      "Go to adobe.com/express",
      "Sign up for a free Adobe account and start designing"
    ],
    "terms": [
      "Storage: 5GB",
      "Version history: 10 days",
      "Premium editing features such as remove background and bulk resize require an upgrade"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Adobe's official page; live page not checked",
      "note": "Adobe's help page lists 5GB of storage; some older Adobe Express marketing pages say 2GB. Confirm on the live pricing page.",
      "evidence": [
        {
          "claim": "Storage",
          "quote": "Storage · 5GB"
        },
        {
          "claim": "Version history",
          "quote": "Version history · 10 days"
        },
        {
          "claim": "Templates",
          "quote": "access to 100,000+ static and video templates"
        },
        {
          "claim": "Premium features need an upgrade",
          "quote": "premium editing features such as remove background, bulk resize, and more"
        }
      ]
    },
    "links": {
      "officialUrl": "https://helpx.adobe.com/express/web/adobe-express-subscription/free.html",
      "redeemUrl": "https://www.adobe.com/express/pricing"
    }
  },
  {
    "id": "o-framer-for-students",
    "slug": "framer-for-students",
    "productId": "framer",
    "title": "Framer for students: free Basic plan for students in a certified program",
    "summary": "Students enrolled in a certified in-person or online program can apply for a free Framer Basic plan; Framer reviews applications within 5 working days.",
    "description": "Framer's education program gives students free access to its Basic plan, including hosting for a site and full access to the design canvas and CMS.\n\nTo qualify, you must be enrolled in a certified in-person or online program, such as a high school, college or university. Framer reviews applications within 5 working days, and you can keep using a free account while you wait.",
    "type": "student",
    "categories": [
      "student-discounts",
      "software-deals"
    ],
    "audiences": [
      "students",
      "designers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "application",
      "note": "Apply through Framer's student education page."
    },
    "requirements": {
      "approvalRequired": true,
      "studentVerification": true
    },
    "eligibility": [
      "Enrolled in a certified in-person or online program, such as a high school, college or university"
    ],
    "redemption": [
      "Go to Framer's education page for students",
      "Submit the student application",
      "Wait for review (Framer aims for within 5 working days)"
    ],
    "terms": [
      "Applications are reviewed before the plan is granted"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "framer.com was not reachable from the research environment.",
      "evidence": [
        {
          "claim": "Program headline",
          "quote": "Framer for education: Students get Framer for free"
        },
        {
          "claim": "Eligibility",
          "quote": "enrolled in a certified in-person or online program, like a high school, college, or university"
        },
        {
          "claim": "Review time",
          "quote": "within 5 working days"
        },
        {
          "claim": "What's included (Framer blog)",
          "quote": "hosting for a site, full access to the design canvas and CMS"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.framer.com/education/students/"
    }
  },
  {
    "id": "o-webflow-starter-free-site-plan",
    "slug": "webflow-starter-free-site-plan",
    "productId": "webflow",
    "title": "Webflow Starter: free site plan with 50 CMS items and 2 static pages",
    "summary": "Webflow's free Starter Site plan allows up to 1,000 monthly visits, 50 CMS items and 2 static pages, published on a .webflow.io subdomain.",
    "description": "Every Webflow site starts on the free Starter Site plan. It allows up to 1,000 monthly visits, 50 CMS items and 2 static pages, and lets you publish the site on a .webflow.io subdomain.\n\nIt suits trying Webflow or building a small personal or portfolio site before moving to a paid Site plan.",
    "type": "free-plan",
    "categories": [
      "software-deals"
    ],
    "audiences": [
      "designers",
      "freelancers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "New sites start on the Starter Site plan when you sign up."
    },
    "eligibility": [
      "Anyone with a Webflow account"
    ],
    "redemption": [
      "Sign up for a Webflow account",
      "Create a site; it starts on the free Starter Site plan"
    ],
    "terms": [
      "Up to 1,000 monthly visits",
      "Up to 50 CMS items and 2 static pages",
      "Sites publish on the .webflow.io subdomain"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Webflow's official page; live page not checked",
      "note": "webflow.com was not reachable from the research environment. Bandwidth figures conflict between Webflow pages, so bandwidth is left out.",
      "evidence": [
        {
          "claim": "Starter limits and subdomain",
          "quote": "up to 1,000 monthly visits, 50 CMS items, and 2 static pages, and comes with the ability to publish your site on the .webflow.io subdomain"
        }
      ]
    },
    "links": {
      "officialUrl": "https://help.webflow.com/hc/en-us/articles/33961232582419-Choose-a-Site-plan",
      "redeemUrl": "https://webflow.com/pricing"
    }
  },
  {
    "id": "o-descript-free-plan",
    "slug": "descript-free-plan",
    "productId": "descript",
    "title": "Descript Free plan: 1 media hour per month and 100 AI credits",
    "summary": "Descript's Free plan includes 1 media hour per month and a one-time grant of 100 AI credits, with exports up to 720p.",
    "description": "Descript has an ongoing Free plan for trying its text-based video and audio editor. It includes 1 media hour per month, counted on media you upload or record, and a one-time grant of 100 AI credits for Underlord and Descript's other AI tools.\n\nOn the Free plan, exports are limited to 720p with a watermark. Unused media time and credits do not carry over to the next month.",
    "type": "free-plan",
    "categories": [
      "software-deals",
      "ai-tools"
    ],
    "audiences": [
      "creators",
      "ai-tools"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up for a free Descript account."
    },
    "eligibility": [
      "Anyone with a Descript account"
    ],
    "redemption": [
      "Go to descript.com/pricing",
      "Sign up for the Free plan"
    ],
    "terms": [
      "1 media hour per month",
      "100 AI credits, granted one time",
      "Exports up to 720p with a watermark"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "descript.com was not reachable from the research environment. Some older Descript tool pages describe 100 credits per month and one watermark-free export; the main pricing page wording (one-time credits, 720p with watermark) is used here.",
      "evidence": [
        {
          "claim": "Media hours",
          "quote": "1 media hour"
        },
        {
          "claim": "AI credits",
          "quote": "The free plan includes 100 AI credits, one time, to spend on Underlord and the other AI tools."
        },
        {
          "claim": "Export limit",
          "quote": "720p"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.descript.com/pricing"
    }
  },
  {
    "id": "o-davinci-resolve-free",
    "slug": "davinci-resolve-free",
    "productId": "davinci-resolve",
    "title": "DaVinci Resolve: free version for Mac, Windows and Linux",
    "summary": "Blackmagic Design offers DaVinci Resolve as a free download that works with virtually all 8-bit video formats at up to 60fps and up to Ultra HD 3840 x 2160; the paid Studio version costs $295.",
    "description": "DaVinci Resolve, Blackmagic Design's editing, color, effects and audio application, is available as a free download for Mac, Windows and Linux.\n\nThe free version works with virtually all 8-bit video formats at up to 60fps, in resolutions as high as Ultra HD 3840 x 2160. DaVinci Resolve Studio, the paid version, adds the DaVinci AI Neural Engine, more Resolve FX, 10-bit video up to 120 frames per second and resolutions beyond 4K, and is listed at $295.",
    "type": "free-plan",
    "categories": [
      "software-deals"
    ],
    "audiences": [
      "creators"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "link",
      "note": "Download the free (non-Studio) installer from Blackmagic Design's DaVinci Resolve page."
    },
    "eligibility": [
      "Anyone; no purchase needed for the free version"
    ],
    "redemption": [
      "Go to Blackmagic Design's DaVinci Resolve page",
      "Choose the free DaVinci Resolve download (not Studio) for Mac, Windows or Linux"
    ],
    "terms": [
      "Free version: virtually all 8-bit video formats at up to 60fps, up to Ultra HD 3840 x 2160",
      "Higher frame rates, 10-bit and resolutions beyond 4K require DaVinci Resolve Studio"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "blackmagicdesign.com was not reachable from the research environment.",
      "evidence": [
        {
          "claim": "Free version limits",
          "quote": "virtually all 8-bit video formats at up to 60fps in resolutions as high as Ultra HD 3840 x 2160"
        },
        {
          "claim": "Platforms",
          "quote": "Mac, Windows and Linux"
        },
        {
          "claim": "Studio additions",
          "quote": "DaVinci AI Neural Engine, dozens of additional Resolve FX"
        },
        {
          "claim": "Studio video support",
          "quote": "10-bit video up to 120 frames per second and resolutions beyond 4K"
        },
        {
          "claim": "Studio price",
          "quote": "$295"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.blackmagicdesign.com/products/davinciresolve"
    }
  },
  {
    "id": "o-affinity-free-with-canva-account",
    "slug": "affinity-free-with-canva-account",
    "productId": "affinity",
    "title": "Affinity: free with a Canva account",
    "summary": "Canva makes the full Affinity design app free for everyone with a Canva account, including Canva Free users; Canva paid plans add Canva AI tools inside Affinity.",
    "description": "Affinity, Canva's professional vector, pixel and layout app, is free for anyone who signs in with a Canva account, including Canva Free users. Canva paid plans additionally unlock Canva AI tools inside Affinity, such as Generative Fill, Generative Expand and Generate Image/Vector.\n\nYou need to be online to download the app and activate the licence. After that, Affinity can be used offline, even for extended periods. Signing in means accepting the Affinity Additional Terms and Canva's Privacy Policy.",
    "type": "free-plan",
    "categories": [
      "software-deals"
    ],
    "audiences": [
      "designers",
      "creators"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Install Affinity and sign in with a free Canva account."
    },
    "eligibility": [
      "Anyone with a Canva account, including Canva Free users"
    ],
    "redemption": [
      "Install the Affinity app",
      "Open Affinity and select Sign in with Canva",
      "Select Allow to connect your Canva account",
      "Select Launch"
    ],
    "terms": [
      "Canva AI tools in Affinity require a Canva paid plan",
      "An internet connection is needed to download and activate the licence; after that, no connection is required",
      "Logging in means you agree to the Affinity Additional Terms and Canva's Privacy Policy",
      "Canva may suspend, remove, modify or limit access to the Affinity software at any time without notice"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Canva's official page; live page not checked",
      "note": "canva.com and affinity.studio were not reachable from the research environment.",
      "evidence": [
        {
          "claim": "Free for everyone; paid plans add Canva AI",
          "quote": "Everyone, even Canva Free users, can use Affinity, but Canva paid plans can unlock incredibly powerful Canva AI tools such as Generative Fill, Generative Expand, Generate Image/Vector, and more directly in Affinity."
        },
        {
          "claim": "Online activation, then offline use",
          "quote": "You will need to be online to download and activate your license with your free Canva account. From then on, there is no requirement to be online, even with extended offline periods."
        },
        {
          "claim": "Sign-in steps",
          "quote": "Install the Affinity app if you haven't already. Open Affinity and select Sign in with Canva. Select Allow to connect your Canva account. Select Launch — you're in!"
        },
        {
          "claim": "Terms on login",
          "quote": "When you log in to Affinity with your Canva account, you agree to the Affinity Additional Terms and Canva's Privacy Policy."
        },
        {
          "claim": "Canva may change access (Affinity Terms)",
          "quote": "may suspend, remove, modify or disable (or impose limits on) access to the currently available Affinity Software and/or any Affinity-Licensed Content at any time without notice and without liability to you"
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.canva.com/en_in/help/free-affinity-access/",
      "redeemUrl": "https://www.affinity.studio/download"
    }
  },
  {
    "id": "o-sketch-education-plan",
    "slug": "sketch-education-plan",
    "productId": "sketch",
    "title": "Sketch Education plan: free Workspace with 50 GB storage for students and teachers",
    "summary": "Eligible students and teachers get a free Sketch Workspace with 50 GB of storage and an Editor seat for the Mac app, for as long as Sketch is part of their studies or teaching.",
    "description": "Sketch's Education plan gives a free Workspace with 50 GB of storage and Editor seats, with access to the Mac app. Students currently enrolled in studies and employed teachers receive a Workspace with 1 Editor seat; academic institutions can get multiple seats if they meet Sketch's criteria.\n\nStudents and teachers can use Sketch free for as long as the use is part of their studies or the course they teach. The plan is not available for home learning or self-education, and there is a minimum age of 16.",
    "type": "student",
    "categories": [
      "student-discounts",
      "software-deals"
    ],
    "audiences": [
      "students",
      "designers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "application",
      "note": "Sign up for a Sketch account and submit the education form on sketch.com/education."
    },
    "requirements": {
      "studentVerification": true
    },
    "eligibility": [
      "Students currently enrolled in studies",
      "Teachers currently employed at an educational institution",
      "Minimum age of 16",
      "Not available for home learning or self-education"
    ],
    "redemption": [
      "Go to sketch.com/education",
      "Create a Sketch account and submit your education status for review"
    ],
    "terms": [
      "Students and teachers get a Workspace with 1 Editor seat, which allows access to the Mac app",
      "Includes a free Workspace with 50 GB of storage and access to the Mac app for one year",
      "Renewals are available: re-apply through the Sketch for Education page to request an extension, which Sketch reviews",
      "Includes 50 GB of storage"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "sketch.com was not reachable from the research environment. An older Sketch blog post mentions 5GB of storage; the 50 GB figure is from the current support page. The support page also says \"for one year\" while stating use is free for as long as it is part of your studies or teaching; access may need re-applying (renewal) after a year. Updated 2026-11-02 from search extracts of the provider's page; live page not opened.",
      "evidence": [
        {
          "claim": "What the plan includes",
          "quote": "a free Workspace with 50 GB of storage and Editor seats (depending on your education status) with access to the Mac app for one year"
        },
        {
          "claim": "Seats for students and teachers",
          "quote": "Students currently enrolled in studies and employed Teachers can receive a Workspace with 1 Editor seat, which allows access to the Mac app."
        },
        {
          "claim": "Duration",
          "quote": "for as long as the use is part of your studies or the course you're teaching"
        },
        {
          "claim": "Exclusion",
          "quote": "isn't available for home learning or self-education purposes"
        },
        {
          "claim": "Minimum age",
          "quote": "minimum age requirement of 16"
        },
        {
          "claim": "Access is for one year, not open-ended",
          "quote": "An Education plan includes a free Workspace with 50 GB of storage and Editor seats (depending on your education status) with access to the Mac app for one year."
        },
        {
          "claim": "Renewal requires re-applying",
          "quote": "Re-apply through the Sketch for Education page to request an extension, and our team will review it."
        },
        {
          "claim": "Eligibility unchanged (16+, enrolled students; employed teachers)",
          "quote": "Students must be 16 years of age or older, be enrolled at a College, University, High school, or an online course duration of at least 2 months. For Teachers, you'll need to provide proof of your employment."
        }
      ],
      "checkedAt": "2026-11-02"
    },
    "links": {
      "officialUrl": "https://www.sketch.com/support/subscriptions/plans/education/whats-an-education-plan/",
      "redeemUrl": "https://www.sketch.com/education/"
    }
  },
  {
    "id": "o-riverside-free-plan",
    "slug": "riverside-free-plan",
    "productId": "riverside",
    "title": "Riverside Free plan: 2 hours of multi-track recordings, up to 720p",
    "summary": "Riverside's Free plan lets you try 2 hours of multi-track recordings with separate audio and video tracks, at up to 720p video quality, with a Riverside watermark.",
    "description": "Riverside offers an ongoing Free plan for recording podcasts and video interviews. It includes 2 hours of multi-track recordings, with separate audio and video tracks for each participant, and video quality up to 720p.\n\nRecordings on the Free plan carry a Riverside watermark; removing it requires a paid plan.",
    "type": "free-plan",
    "categories": [
      "software-deals"
    ],
    "audiences": [
      "creators"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up for a free Riverside account."
    },
    "eligibility": [
      "Anyone with a Riverside account"
    ],
    "redemption": [
      "Go to riverside.com/pricing",
      "Sign up for the Free plan"
    ],
    "terms": [
      "2 hours of multi-track recordings (separate audio and video tracks)",
      "Up to 720p video quality",
      "Recordings include a Riverside watermark"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "riverside.com was not reachable from the research environment. A Riverside blog post says the 2-hour cap applies to exporting separate tracks, not to recording or editing.",
      "evidence": [
        {
          "claim": "Multi-track hours",
          "quote": "Try 2 hours of multi-track recordings (Separate audio and video tracks)"
        },
        {
          "claim": "Video quality",
          "quote": "Up to 720p video quality"
        },
        {
          "claim": "Watermark (Riverside blog)",
          "quote": "Riverside's free plan adds a watermark to your recordings. To remove the watermark, upgrade to a paid plan"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://riverside.com/pricing"
    }
  },
  {
    "id": "o-restream-free-plan",
    "slug": "restream-free-plan",
    "productId": "restream",
    "title": "Restream Free plan: stream to 2 channels at once",
    "summary": "Restream's Free plan lets you stream to two channels at the same time from Restream Studio (in 720p) or OBS, with Restream branding on the stream.",
    "description": "Restream's Free plan lets you broadcast to two channels at the same time, from Restream Studio or from OBS. Restream Studio output on the Free plan is 720p, and streams carry Restream branding.\n\nPaid plans add more channels, remove Restream branding and add destinations such as Facebook Pages, Groups and custom RTMP.",
    "type": "free-plan",
    "categories": [
      "software-deals"
    ],
    "audiences": [
      "creators",
      "marketing-tools"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up for a free Restream account."
    },
    "eligibility": [
      "Anyone with a Restream account"
    ],
    "redemption": [
      "Sign up for a free Restream account",
      "Add and enable up to two channels, then go live from Restream Studio or OBS"
    ],
    "terms": [
      "Up to 2 channels at once",
      "Restream Studio in 720p",
      "Restream branding on your stream",
      "Facebook Pages, Groups and custom RTMP require an upgrade"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "restream.io was not reachable from the research environment. Paid plan prices conflict between Restream pages and are left out.",
      "evidence": [
        {
          "claim": "Two channels, Studio or OBS; upgrade benefits",
          "quote": "Stream to two channels at the same time on the free plan, from Studio or OBS. Upgrade to stream to more channels, remove Restream branding and add Facebook Pages, Groups or custom RTMP."
        },
        {
          "claim": "Studio resolution and branding",
          "quote": "The Free plan includes streaming to 2 channels at once, Restream Studio in 720p, and Restream branding on your stream."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://restream.io/multistreaming",
      "redeemUrl": "https://restream.io/pricing"
    }
  },
  {
    "id": "o-canva-education-free-k12",
    "slug": "canva-education-free-k12",
    "productId": "canva",
    "title": "Canva Education: free premium features for K-12 teachers and their students",
    "summary": "Canva Education is free for K-12 teachers, their students and qualified school districts; teachers verify their status and invite their students.",
    "description": "Canva Education gives eligible K-12 (primary and secondary) teachers and their students access to Canva's premium features for free. Canva commits that it will remain 100% free for K-12 educators, their students and qualified school districts and institutions.\n\nTeachers sign up and verify their teaching status, either instantly or by uploading a document. Students cannot sign up on their own: they must be invited by their teacher, school or district. School administrators can disable access.\n\nCanva Education is not available to college and university students; Canva for Campus is a separate paid offering for higher education.",
    "type": "student",
    "categories": [
      "student-discounts",
      "software-deals"
    ],
    "audiences": [
      "students",
      "designers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "verification",
      "note": "Teachers sign up and verify their teaching status; students join by teacher invitation."
    },
    "requirements": {
      "studentVerification": true
    },
    "eligibility": [
      "K-12 (primary and secondary) teachers who can confirm their teaching status",
      "K-12 students invited by their teacher, school or school district",
      "Qualified K-12 school districts and institutions",
      "Not available to college and university students"
    ],
    "redemption": [
      "Go to canva.com/education and sign up as a teacher",
      "Complete verification (instant, or by uploading a document confirming your teaching status)",
      "Invite your students"
    ],
    "terms": [
      "Premium features are free for eligible K-12 teachers and students unless disabled by school administrators",
      "Students must be invited by their teacher, school or school district",
      "Canva for Campus, for higher education, is a paid offering"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Canva's official page; live page not checked",
      "note": "canva.com was not reachable from the research environment.",
      "evidence": [
        {
          "claim": "Free commitment",
          "quote": "Canva Education will remain 100% free for K-12 (primary and secondary) educators, their students, as well as qualified school districts and institutions"
        },
        {
          "claim": "Premium features free unless disabled",
          "quote": "Eligible K-12 teachers and students can access premium features for free, unless disabled by school administrators"
        },
        {
          "claim": "Teacher verification",
          "quote": "You might be eligible for instant verification. If not, you'll need to upload a document to confirm your teaching status."
        },
        {
          "claim": "Students need an invite",
          "quote": "Students must be invited by their teacher, school or school district"
        },
        {
          "claim": "Higher education is a paid offering",
          "quote": "Canva for Campus is our paid offering designed for full campus-wide rollouts at higher education institutions."
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.canva.com/education/"
    }
  },
  {
    "id": "o-microsoft-365-business-free-trial",
    "slug": "microsoft-365-business-free-trial",
    "productId": "microsoft-365-business",
    "title": "Microsoft 365 for business: free 30-day trial",
    "summary": "Organizations can try Microsoft 365 Business Basic, Business Standard, Business Premium, Microsoft Defender for Business or Microsoft 365 Apps for business free for one month.",
    "description": "Microsoft offers a free 30-day trial of its Microsoft 365 for business plans. You don't need an existing Microsoft account to sign up: pick a plan on the Microsoft 365 products site and select \"Try free for 1 month\". Trial subscriptions include 25 licenses for the trial period, and trial tenants are limited to 300 GB of pooled storage across OneDrive, SharePoint and Exchange Online.\n\nAt the end of the trial, the subscription renews to an annual paid subscription by default unless you turn off recurring billing in the Microsoft 365 admin center. If you cancel before the trial ends, your card isn't charged.",
    "type": "free-trial",
    "categories": [
      "free-trials",
      "software-deals"
    ],
    "audiences": [
      "office-tools",
      "businesses",
      "startups"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "durationMonths": 1
    },
    "claim": {
      "method": "automatic",
      "note": "Choose a plan on the Microsoft 365 products site and select \"Try free for 1 month\"."
    },
    "eligibility": [
      "Available for Microsoft 365 Business Basic, Business Standard, Business Premium, Microsoft Defender for Business and Microsoft 365 Apps for business",
      "No existing Microsoft account is needed to sign up for the trial"
    ],
    "redemption": [
      "Go to the Microsoft 365 products site",
      "Select the plan you want and choose \"Try free for 1 month\"",
      "Follow the steps to set up your account"
    ],
    "terms": [
      "The trial lasts one month (30 days)",
      "Trial subscriptions include 25 free licenses for the trial period",
      "Trial subscriptions are limited to 300 GB of pooled storage across OneDrive, SharePoint and Exchange Online",
      "At the end of the trial the subscription renews to an annual term by default unless recurring billing is turned off",
      "Cancel by turning off recurring billing before the trial ends and your card isn't charged",
      "Microsoft can suspend access if payment isn't received after the trial ends"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-23",
      "method": "Checked against Microsoft's official documentation source (MicrosoftDocs/microsoft-365-docs repository)",
      "evidence": [
        {
          "claim": "Free 30-day trial of business plans",
          "quote": "This article shows you how to sign up for a free 30-day trial or buy a Microsoft 365 for business subscription, including Microsoft 365 Business Basic, Microsoft 365 Business Standard, Microsoft 365 Business Premium, Microsoft Defender for Business, or Microsoft 365 Apps for business."
        },
        {
          "claim": "No Microsoft account needed",
          "quote": "You don't need an existing Microsoft account to sign up for a free trial."
        },
        {
          "claim": "Sign-up steps",
          "quote": "Go to the Microsoft 365 Products site. Select the plan that you want, such as Microsoft 365 Business Standard, scroll down the page, and select Try free for 1 month. On the next page, follow the steps to set up your account."
        },
        {
          "claim": "Storage limit",
          "quote": "If you have a Microsoft 365 trial, your subscription is limited to 300 GB of pooled storage. Pooled storage provides a single pool of storage for each tenant, and spans OneDrive, SharePoint Online, and Exchange Online."
        },
        {
          "claim": "Trial-only tenant limits",
          "quote": "Trial-only tenants are limited to 30 days and 300 GB."
        },
        {
          "claim": "25 licenses",
          "quote": "All trial subscriptions include 25 free licenses for the duration of the trial period."
        },
        {
          "claim": "Auto-renewal",
          "quote": "At the end of your trial period, your subscription renews to an annual term subscription by default, unless you turn off recurring billing from inside of Billing > Your products."
        },
        {
          "claim": "Cancel without charge",
          "quote": "If you decide to cancel your trial subscription before the free trial period ends, go to the Microsoft 365 admin center and turn off recurring billing. The trial automatically expires when your month ends, and your credit card isn't charged."
        },
        {
          "claim": "Suspension for non-payment",
          "quote": "Microsoft reserves the right to suspend access to its products and services if payment isn't received after your one-month free trial ends. Storage for trials is limited."
        },
        {
          "claim": "Source note",
          "quote": "Terms read from Microsoft's official docs source (MicrosoftDocs/microsoft-365-docs repository, file microsoft-365/commerce/try-or-buy-microsoft-365.md, ms.date 04/23/2026) because learn.microsoft.com was not reachable from the research environment."
        }
      ]
    },
    "links": {
      "officialUrl": "https://learn.microsoft.com/en-us/microsoft-365/commerce/try-or-buy-microsoft-365",
      "redeemUrl": "https://www.aka.ms/office365signup"
    }
  },
  {
    "id": "o-google-workspace-14-day-free-trial",
    "slug": "google-workspace-14-day-free-trial",
    "productId": "google-workspace",
    "title": "Google Workspace 14-day free trial for up to 10 users",
    "summary": "New Google Workspace sign-ups start with a 14-day free trial for up to 10 users; the payment method isn't charged until the trial ends.",
    "description": "When you sign up for Google Workspace you start on a 14-day free trial that up to 10 users can use. Your payment method isn't charged until the trial ends, and you can cancel during the trial without being charged.\n\nThe paid subscription begins automatically when the trial ends. Adding an 11th user ends the trial early and starts the paid subscription for all users. If the trial ends without billing set up, the account is suspended. Sign-ups made from Android or iOS handle billing through Google Play or the device's Settings app instead.",
    "type": "free-trial",
    "categories": [
      "free-trials",
      "software-deals"
    ],
    "audiences": [
      "office-tools",
      "businesses",
      "startups",
      "freelancers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "The trial starts automatically when you sign up for Google Workspace."
    },
    "eligibility": [
      "New Google Workspace sign-ups",
      "Up to 10 users during the trial"
    ],
    "redemption": [
      "Sign up for Google Workspace on the Google Workspace site",
      "Add a payment method; it isn't charged until the trial ends",
      "Verify your domain within 9 days of starting the trial"
    ],
    "terms": [
      "The trial lasts 14 days",
      "The trial is limited to 10 users; adding an 11th user ends the trial and starts the paid subscription for all users",
      "The paid subscription begins automatically when the trial ends",
      "Cancelling within the 14-day trial means you aren't charged",
      "If the trial ends and billing isn't set up, the account is suspended",
      "The subscription can be cancelled during the trial if the domain isn't verified within 9 days or billing isn't set up by the end of the trial"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of the official page. The live page could not be fetched from the research environment (outbound access to the provider's site was blocked), so an editor should re-check it before marking this verified.",
      "evidence": [
        {
          "claim": "14-day trial for up to 10 users",
          "quote": "When you sign up for Google Workspace, you start with a 14-day free trial subscription. Up to 10 users can explore the features of Google Workspace."
        },
        {
          "claim": "Payment method not charged during trial",
          "quote": "your payment method will not be charged until your free trial ends"
        },
        {
          "claim": "Automatic start of paid subscription",
          "quote": "Your paid subscription automatically begins when your trial ends."
        },
        {
          "claim": "10-user limit",
          "quote": "Your Google Workspace trial is limited to 10 users. To add more than 10 users, you must set up billing. When you add an 11th user, you are prompted to end your trial and your paid subscription begins for all users."
        },
        {
          "claim": "Cancel without charge",
          "quote": "If you cancel within your 14 day trial period, you will not be charged."
        },
        {
          "claim": "Suspension without billing",
          "quote": "If your trial period ends and you haven't set up billing, your account will be suspended."
        },
        {
          "claim": "Domain verification deadline",
          "quote": "your subscription will be canceled during your free trial if you do not: Verify your domain within 9 days of starting your trial or set up billing by the end of the trial."
        },
        {
          "claim": "Mobile sign-ups",
          "quote": "you instead manage billing in Google Play (Android) or the Settings app (iOS)."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://knowledge.workspace.google.com/admin/getting-started/about-your-google-workspace-free-trial",
      "redeemUrl": "https://workspace.google.com/"
    }
  },
  {
    "id": "o-zoom-basic-free-plan",
    "slug": "zoom-basic-free-plan",
    "productId": "zoom-workplace",
    "title": "Zoom Basic free plan: meetings up to 40 minutes with up to 100 participants",
    "summary": "Zoom's free Basic plan lets you host unlimited meetings for up to 100 participants, with each meeting limited to 40 minutes.",
    "description": "Zoom's Basic plan is free. It lets you host an unlimited number of meetings with up to 100 participants, and each meeting can last up to 40 minutes. Paid Zoom Workplace plans remove the 40-minute limit.",
    "type": "free-plan",
    "categories": [
      "software-deals"
    ],
    "audiences": [
      "office-tools",
      "businesses",
      "freelancers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "New Zoom accounts start on the free Basic plan."
    },
    "eligibility": [
      "Anyone who signs up for a free Zoom account"
    ],
    "redemption": [
      "Sign up for a free Zoom account",
      "Host meetings on the Basic plan"
    ],
    "terms": [
      "Meetings are limited to 40 minutes",
      "Up to 100 participants per meeting",
      "Unlimited number of meetings"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Zoom's official page; live page not checked",
      "note": "Quotes come from search-engine extracts of the official page. The live page could not be fetched from the research environment (outbound access to the provider's site was blocked), so an editor should re-check it before marking this verified. Both quotes are short extracts that the search tool may have paraphrased; check the exact wording on zoom.us/pricing.",
      "evidence": [
        {
          "claim": "Free plan limits (search extract, paraphrased by the search tool)",
          "quote": "up to 40 minutes per meeting for up to 100 participants"
        },
        {
          "claim": "Unlimited meetings (search extract, paraphrased by the search tool)",
          "quote": "host an unlimited number of meetings for up to 100 participants, with a meeting duration limit of 40 minutes"
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.zoom.com/en/products/virtual-meetings/features/free-video-conferencing/",
      "redeemUrl": "https://zoom.us/pricing"
    }
  },
  {
    "id": "o-trello-free-plan",
    "slug": "trello-free-plan",
    "productId": "trello",
    "title": "Trello Free plan: up to 10 collaborators per Workspace",
    "summary": "Trello's Free plan is free for up to 10 collaborators per Workspace, with unlimited cards and up to 10 open boards per Workspace.",
    "description": "Trello's Free plan costs nothing for Workspaces with up to 10 collaborators and includes unlimited cards. A free Workspace can have up to 10 open boards at a time.\n\nThe 10-collaborator limit applies to the whole Workspace rather than each board. If a free Workspace goes over the limit, its boards become view-only until it is back within the limit or upgraded.",
    "type": "free-plan",
    "categories": [
      "software-deals"
    ],
    "audiences": [
      "office-tools",
      "freelancers",
      "startups"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "New Trello Workspaces start on the Free plan."
    },
    "eligibility": [
      "Any Trello Workspace with up to 10 collaborators"
    ],
    "redemption": [
      "Sign up for Trello",
      "Create a Workspace and boards on the Free plan"
    ],
    "terms": [
      "Up to 10 collaborators per Workspace",
      "The collaborator limit applies to the Workspace, not to individual boards",
      "Free Workspaces are limited to 10 open boards at a time",
      "Boards in a Workspace over the collaborator limit become view-only"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of the official page. The live page could not be fetched from the research environment (outbound access to the provider's site was blocked), so an editor should re-check it before marking this verified. The unlimited-cards feature is from the search tool's summary of trello.com/pricing and is not quoted.",
      "evidence": [
        {
          "claim": "10 collaborators per Workspace (search extract, paraphrased by the search tool)",
          "quote": "free for up to 10 collaborators per Workspace"
        },
        {
          "claim": "Limit applies per Workspace",
          "quote": "the 10 Collaborator limit for our free plan applies to the Workspace your board is in rather than the board itself"
        },
        {
          "claim": "Over-limit consequence",
          "quote": "the boards in this Workspace will become view-only"
        },
        {
          "claim": "Open board limit",
          "quote": "Free Trello Workspaces are limited to 10 open boards at a time"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://trello.com/pricing"
    }
  },
  {
    "id": "o-airtable-free-plan",
    "slug": "airtable-free-plan",
    "productId": "airtable",
    "title": "Airtable Free plan: 1,000 records per base and up to 5 editors",
    "summary": "Airtable's Free plan allows 1,000 records per base and up to 5 collaborators with Editor or Creator permissions, plus unlimited read-only collaborators.",
    "description": "Airtable's Free plan lets a workspace build bases with up to 1,000 records each. The record limit is counted across all tables in a base.\n\nFree workspaces can have up to 5 collaborators with Editor or Creator permissions and an unlimited number of read-only collaborators.",
    "type": "free-plan",
    "categories": [
      "software-deals"
    ],
    "audiences": [
      "office-tools",
      "startups",
      "businesses"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "New Airtable workspaces start on the Free plan."
    },
    "eligibility": [
      "Any Airtable workspace on the Free plan"
    ],
    "redemption": [
      "Sign up for Airtable",
      "Create bases in a Free plan workspace"
    ],
    "terms": [
      "1,000 records per base",
      "Record limits are counted across all tables in a base",
      "Up to 5 collaborators with Editor or Creator permissions",
      "Unlimited collaborators with read-only permissions"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of the official page. The live page could not be fetched from the research environment (outbound access to the provider's site was blocked), so an editor should re-check it before marking this verified.",
      "evidence": [
        {
          "claim": "Record limit (search extract, paraphrased by the search tool)",
          "quote": "1000 records per base"
        },
        {
          "claim": "Records counted across tables",
          "quote": "record limits are cumulative across all tables in a base"
        },
        {
          "claim": "Editor limit",
          "quote": "Free plan workspaces are limited to 5 collaborators with Editor or Creator permissions"
        },
        {
          "claim": "Read-only collaborators",
          "quote": "Free plan workspaces include unlimited collaborators with \"Read only\" permissions"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://support.airtable.com/articles/2277136852-airtable-plans-overview",
      "redeemUrl": "https://www.airtable.com/pricing"
    }
  },
  {
    "id": "o-mailchimp-free-plan",
    "slug": "mailchimp-free-plan",
    "productId": "mailchimp",
    "title": "Mailchimp Free plan: up to 250 contacts and 500 email sends per month",
    "summary": "Mailchimp's Free plan includes up to 250 contacts and 500 email sends per month, with a daily limit of 250 sends.",
    "description": "Mailchimp's Free plan lets you keep up to 250 contacts and send up to 500 emails a month, with no more than 250 sends per day.\n\nIf you go over the 250-contact limit, Mailchimp holds sending of live and test emails until you upgrade to a paid plan or reduce your contact count.",
    "type": "free-plan",
    "categories": [
      "software-deals"
    ],
    "audiences": [
      "marketing-tools",
      "businesses",
      "freelancers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Choose the Free plan when signing up for Mailchimp."
    },
    "eligibility": [
      "Any Mailchimp account on the Free plan"
    ],
    "redemption": [
      "Go to Mailchimp's pricing page",
      "Sign up and choose the Free plan"
    ],
    "terms": [
      "Up to 250 contacts",
      "500 email sends per month, with a daily limit of 250",
      "Going over 250 contacts puts a hold on sending live and test emails until you upgrade or reduce your contacts"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of the official page. The live page could not be fetched from the research environment (outbound access to the provider's site was blocked), so an editor should re-check it before marking this verified. Older Mailchimp pages still describe a retired legacy Free plan (2,000 contacts); the figures here are from the current help article.",
      "evidence": [
        {
          "claim": "Monthly and daily send limits",
          "quote": "The monthly email send limit for the Free plan is 500 sends (daily limit of 250)."
        },
        {
          "claim": "Contact and send limits (search extract, paraphrased by the search tool)",
          "quote": "up to 250 contacts and 500 sends per month, with a daily send limit of 250"
        },
        {
          "claim": "Over the contact limit",
          "quote": "If you exceed the 250 contact limit in your Free plan, a hold is placed on sending live emails or test emails until you upgrade to a paid plan or reduce your contact total."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://mailchimp.com/help/about-mailchimp-pricing-plans/",
      "redeemUrl": "https://mailchimp.com/pricing/marketing/"
    }
  },
  {
    "id": "o-brevo-free-plan",
    "slug": "brevo-free-plan",
    "productId": "brevo",
    "title": "Brevo Free plan: 300 emails per day and storage for up to 100,000 contacts",
    "summary": "Brevo's Free plan includes 300 email sends per day and storage for up to 100,000 contacts, with marketing automation for up to 2,000 contacts.",
    "description": "Brevo's Free plan includes 300 email sends per day and lets you store up to 100,000 contacts. Unused daily sends don't carry over. You can upload contacts straight away and start sending once Brevo approves your account for sending.\n\nMulti-channel marketing automation on the Free plan covers up to 2,000 contacts.",
    "type": "free-plan",
    "categories": [
      "software-deals"
    ],
    "audiences": [
      "marketing-tools",
      "businesses",
      "startups"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "New Brevo accounts start on the Free plan."
    },
    "eligibility": [
      "Any Brevo account on the Free plan, once approved for sending"
    ],
    "redemption": [
      "Sign up for Brevo",
      "Upload your contacts",
      "Start sending once Brevo approves your account for sending"
    ],
    "terms": [
      "300 email sends per day; unused sends don't roll over",
      "Storage for up to 100,000 contacts",
      "Sending starts after Brevo approves the account",
      "Marketing automation covers up to 2,000 contacts"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Brevo's official page; live page not checked",
      "note": "Quotes come from search-engine extracts of the official page. The live page could not be fetched from the research environment (outbound access to the provider's site was blocked), so an editor should re-check it before marking this verified. The no-rollover term is from the search tool's summary of the help article and is not quoted.",
      "evidence": [
        {
          "claim": "Daily sends and contact storage",
          "quote": "The Free plan includes 300 daily email sends and storage for up to 100,000 contacts."
        },
        {
          "claim": "Approval before sending (search extract, paraphrased by the search tool)",
          "quote": "once Brevo approves your account for sending, you can start sending up to 300 emails per day"
        },
        {
          "claim": "Automation limit (search extract, paraphrased by the search tool)",
          "quote": "multi-channel marketing automation is available on the Free plan for up to 2,000 contacts"
        }
      ]
    },
    "links": {
      "officialUrl": "https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans",
      "redeemUrl": "https://www.brevo.com/pricing/"
    }
  },
  {
    "id": "o-kit-free-plan",
    "slug": "kit-free-plan",
    "productId": "kit",
    "title": "Kit Free plan: email marketing for up to 10,000 subscribers",
    "summary": "Kit (formerly ConvertKit) offers a Free plan for up to 10,000 subscribers with unlimited forms, landing pages and email broadcasts.",
    "description": "Kit's Free plan covers up to 10,000 subscribers and includes unlimited forms, landing pages and email broadcasts, tagging and segmentation, and digital products and subscriptions.\n\nVisual automations, email sequences and some other features are reserved for the paid Creator and Creator Pro plans. Kit keeps one recommendation slot on the Free plan, and Paid Recommendation earnings from that slot go to Kit. If you grow past 10,000 subscribers, you need to upgrade to keep sending.",
    "type": "free-plan",
    "categories": [
      "software-deals"
    ],
    "audiences": [
      "marketing-tools",
      "creators"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Choose the Free plan when signing up for Kit."
    },
    "eligibility": [
      "Creators with up to 10,000 subscribers"
    ],
    "redemption": [
      "Go to Kit's pricing page",
      "Sign up for the Free plan"
    ],
    "terms": [
      "Up to 10,000 subscribers",
      "Visual automations and email sequences need a paid Creator or Creator Pro plan",
      "Paid Recommendation earnings from Kit's recommendation slot on the Free plan go to Kit",
      "Above 10,000 subscribers you need a paid plan to keep sending"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of the official page. The live page could not be fetched from the research environment (outbound access to the provider's site was blocked), so an editor should re-check it before marking this verified. The list of included and paid-only features is from the search tool's summary of help.kit.com and should be re-checked.",
      "evidence": [
        {
          "claim": "Subscriber limit (search extract, paraphrased by the search tool)",
          "quote": "up to 10,000 active subscribers"
        },
        {
          "claim": "Paid-plan features",
          "quote": "These features live on the Creator and Creator Pro plans."
        },
        {
          "claim": "Recommendation slot",
          "quote": "any Paid Recommendation earnings generated from that slot will go to Kit"
        },
        {
          "claim": "Going over the limit",
          "quote": "You'll need to upgrade to a paid plan to keep sending. Everything you've built stays exactly where it is."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://help.kit.com/en/articles/16627071-the-kit-free-plan",
      "redeemUrl": "https://kit.com/pricing"
    }
  },
  {
    "id": "o-buffer-free-plan",
    "slug": "buffer-free-plan",
    "productId": "buffer",
    "title": "Buffer Free plan: up to 3 channels with 10 scheduled posts each",
    "summary": "Buffer's Free plan lets you connect up to 3 social channels and keep 10 scheduled posts per channel, up to 30 in total.",
    "description": "Buffer's Free plan supports up to three social media channels. Each channel can have 10 posts scheduled at a time, so up to 30 in total; when a post is published its slot frees up again.\n\nIf you connect more than three channels on the Free plan, the extra channels are locked. Paid plans are billed per channel, including the channels you already had on the Free plan.",
    "type": "free-plan",
    "categories": [
      "software-deals"
    ],
    "audiences": [
      "marketing-tools",
      "creators",
      "freelancers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "New Buffer accounts can stay on the Free plan."
    },
    "eligibility": [
      "Any Buffer account with up to three channels"
    ],
    "redemption": [
      "Sign up for Buffer",
      "Connect up to three social channels",
      "Schedule posts from the queue"
    ],
    "terms": [
      "Up to 3 channels",
      "10 scheduled posts per channel, up to 30 in total",
      "A slot frees up once a scheduled post is published",
      "Channels beyond the three-channel limit are locked",
      "Upgrading means paying for each channel, including those connected on the Free plan"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of the official page. The live page could not be fetched from the research environment (outbound access to the provider's site was blocked), so an editor should re-check it before marking this verified.",
      "evidence": [
        {
          "claim": "Scheduled posts per channel",
          "quote": "The Free plan allows 10 scheduled posts per channel. Once a post is published, the slot becomes available again."
        },
        {
          "claim": "Total queue",
          "quote": "On the Free plan you can keep 10 scheduled posts per channel, up to 30 in total across three channels."
        },
        {
          "claim": "Channel limit",
          "quote": "Channels will be locked if you exceed the three-channel limit for the Free plan."
        },
        {
          "claim": "Upgrade billing",
          "quote": "If you decide to upgrade to a paid plan, you will pay for each channel — including any channels you had while on the Free plan."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://buffer.com/pricing"
    }
  },
  {
    "id": "o-ahrefs-free-webmaster-tools",
    "slug": "ahrefs-free-webmaster-tools",
    "productId": "ahrefs",
    "title": "Ahrefs Free (Ahrefs Webmaster Tools): free Site Audit and Site Explorer for sites you verify",
    "summary": "Ahrefs' free account gives site owners free Site Audit, Site Explorer and Web Analytics for websites they verify, with no credit card or trial period.",
    "description": "Ahrefs' free account, which grew out of Ahrefs Webmaster Tools, gives website owners free access to SEO tools for their own sites. Site Explorer, Site Audit and Web Analytics need you to verify ownership first, which you can do through Google Search Console, a DNS record or an HTML file.\n\nSite Audit allows 5,000 crawl credits per verified project per month, and Site Explorer shows up to 1,000 keywords, backlinks or top pages at a time. Ahrefs says the account needs no credit card and has no trial period.",
    "type": "free-plan",
    "categories": [
      "software-deals"
    ],
    "audiences": [
      "marketing-tools",
      "businesses",
      "developers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "verification",
      "note": "Sign up for Ahrefs Free, then verify ownership of your website."
    },
    "requirements": {
      "cardRequired": false
    },
    "eligibility": [
      "Website owners who can verify ownership of their site"
    ],
    "redemption": [
      "Sign up for Ahrefs Free",
      "Verify ownership of your website through Google Search Console, a DNS record or an HTML file",
      "Use Site Explorer, Site Audit and Web Analytics on your verified project"
    ],
    "terms": [
      "Site Explorer, Site Audit and Web Analytics work only on websites you have verified",
      "Site Audit: 5,000 crawl credits per verified project per month",
      "Site Explorer shows up to 1,000 keywords, backlinks or top pages at a time",
      "No credit card and no trial period"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Ahrefs's official page; live page not checked",
      "note": "Quotes come from search-engine extracts of the official page. The live page could not be fetched from the research environment (outbound access to the provider's site was blocked), so an editor should re-check it before marking this verified. Ahrefs' own pages are not fully consistent about the free tier's scope; re-check limits on the help article before verifying.",
      "evidence": [
        {
          "claim": "Verification required",
          "quote": "Some tools — Site Explorer, Site Audit, and Web Analytics — require you to verify ownership of your website first."
        },
        {
          "claim": "Verification methods",
          "quote": "The easiest way to do this is via Google Search Console, although you can verify your ownership by adding a DNS record or HTML file."
        },
        {
          "claim": "No card or trial",
          "quote": "no credit card, no trial period, no hidden charges"
        },
        {
          "claim": "Site Audit allowance (search extract, paraphrased by the search tool)",
          "quote": "5,000 crawl credits per verified project per month"
        },
        {
          "claim": "Site Explorer cap (search extract, paraphrased by the search tool)",
          "quote": "1000 keywords, backlinks, or top pages at once"
        }
      ]
    },
    "links": {
      "officialUrl": "https://help.ahrefs.com/en/articles/13002606-what-can-i-use-for-free-in-ahrefs",
      "redeemUrl": "https://ahrefs.com/webmaster-tools"
    }
  },
  {
    "id": "o-sublime-text-personal-licence-one-time",
    "slug": "sublime-text-personal-licence-one-time",
    "productId": "sublime-text",
    "title": "Sublime Text personal licence: $99 one-time, with 3 years of updates",
    "summary": "A Sublime Text personal licence is a one-time $99 purchase that includes three years of updates and keeps working after that window ends.",
    "description": "Sublime Text is a code and text editor from Sublime HQ. Personal licences are sold as a one-time purchase rather than a subscription, with the store listing a total of $99 USD.\n\nEach personal licence includes three years of updates. The licence does not expire after that: you can keep using versions released within three years of purchase, and only newer versions need a paid upgrade. Licences are per user, so you can use your key on every computer where you are the primary user, including at work.\n\nPersonal licences are for personal ownership only. Businesses and organisations must buy business licences, which are per-seat subscriptions. Sublime HQ offers refunds within 30 days of purchase.",
    "type": "lifetime",
    "categories": [
      "lifetime-deals",
      "software-deals"
    ],
    "audiences": [
      "developers"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 99,
      "period": "one-time",
      "savingsLabel": "One-time $99, 3 years of updates"
    },
    "claim": {
      "method": "link",
      "note": "Buy a personal licence on the Sublime Text page of the Sublime HQ store"
    },
    "lifetime": {
      "licenceCovers": "One user on every computer where they are the primary user; 3 years of updates, and versions released in that window keep working after it ends",
      "refundPolicy": "Refunds available within 30 days of purchase; email Sublime HQ to claim"
    },
    "eligibility": [
      "Personal licences are only for personal ownership",
      "Businesses and organisations must buy a business licence (a per-seat subscription) instead"
    ],
    "redemption": [
      "Open the Sublime Text page in the Sublime HQ store",
      "Buy a personal licence",
      "Use the licence key on each computer where you are the primary user"
    ],
    "terms": [
      "Store total listed as $99 USD",
      "Includes 3 years of updates; after 3 years an upgrade is required to receive further updates",
      "Licences do not expire; an upgrade fee applies only if you want versions released 3 or more years after purchase",
      "Licences are per user, not per machine",
      "Refunds available within 30 days of purchase"
    ],
    "links": {
      "officialUrl": "https://www.sublimehq.com/store/text",
      "redeemUrl": "https://www.sublimehq.com/store/text"
    },
    "source": "official",
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search extracts of sublimehq.com (store and Sales FAQ); the live store page was not opened. Re-check the $99 total (the extract shows it as a checkout total) and the upgrade price, which search extracts gave as $80 on the upgrade page but which is not included here. An older sublimetext.com copy of the FAQ describes Sublime Text 3 terms and was ignored.",
      "evidence": [
        {
          "claim": "Price",
          "quote": "Total: $99 USD"
        },
        {
          "claim": "One-time purchase with 3 years of updates",
          "quote": "a one-time purchase that includes 3 years of updates ... After 3 years, an upgrade will be required to receive further updates."
        },
        {
          "claim": "Licence does not expire",
          "quote": "Individual licenses are valid for 3 years of updates, but do not expire after 3 years. Only if you wish to use newer versions will an upgrade fee be required."
        },
        {
          "claim": "Per-user licence on all your computers",
          "quote": "As licenses are per-user, you're welcome to use your license key on all computers where you are the primary user, including at work."
        },
        {
          "claim": "Personal vs business",
          "quote": "Personal licenses are only available for personal ownership: businesses and organizations must purchase a business license."
        },
        {
          "claim": "Business licences are subscriptions",
          "quote": "first you purchase a subscription with a given number of seats, and then allocate the seats to individual users"
        },
        {
          "claim": "Refunds",
          "quote": "Refunds are available within 30 days of purchasing. Please send us an email if you wish to claim a refund."
        }
      ],
      "checkedAt": "2026-10-23"
    }
  },
  {
    "id": "o-typora-one-time-licence-3-devices",
    "slug": "typora-one-time-licence-3-devices",
    "productId": "typora",
    "title": "Typora: $14.99 one-time licence for up to 3 devices",
    "summary": "Typora is a one-time $14.99 purchase (before tax) with no subscription; one licence activates on up to three of your own devices and does not expire.",
    "description": "Typora is a Markdown editor and reader. Instead of a subscription, it is sold as a one-time licence listed at $14.99 before tax.\n\nA licence is granted to one person and can be activated on up to three of that person's devices, with no expiration. Different operating systems, user accounts and virtual machines count as separate devices, and activating a fourth device deactivates the oldest one. Typora does not sell bulk licences, so organisations need one licence per user.\n\nYou can evaluate Typora free for 15 days before buying, and Typora offers a full refund within 30 days of the licence purchase.",
    "type": "lifetime",
    "categories": [
      "lifetime-deals",
      "software-deals"
    ],
    "audiences": [
      "creators",
      "developers",
      "office-tools"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 14.99,
      "period": "one-time",
      "savingsLabel": "One-time $14.99, no subscription"
    },
    "claim": {
      "method": "link",
      "note": "Buy at typora.io or store.typora.io; the licence code is emailed after purchase"
    },
    "lifetime": {
      "licenceCovers": "One person, activated on up to 3 devices, with no expiration",
      "refundPolicy": "Full refund within 30 days of the licence purchase"
    },
    "eligibility": [
      "A licence is for one person; organisations need one licence per user (no bulk licences)"
    ],
    "redemption": [
      "Optionally evaluate Typora free for 15 days",
      "Buy a licence at typora.io or store.typora.io",
      "Activate the emailed licence code on up to three of your devices"
    ],
    "terms": [
      "Listed at $14.99, tax not included",
      "One-time payment, not a subscription",
      "Up to 3 devices per licence; different operating systems, user accounts and virtual machines count as separate devices",
      "Activating a fourth device automatically deactivates the oldest",
      "Full refund within 30 days of purchase; requests can be rejected if the licence code was resold"
    ],
    "links": {
      "officialUrl": "https://support.typora.io/purchase/",
      "redeemUrl": "https://store.typora.io/"
    },
    "source": "official",
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search extracts of typora.io, store.typora.io and support.typora.io; live pages not checked. The store FAQ was summarised as starting the 30-day refund window when evaluation begins, while the support FAQ says 30 days from purchase; the purchase-date wording is used here, so re-check it. Some store/support pages may be several years old.",
      "evidence": [
        {
          "claim": "Price",
          "quote": "$ 14.99 (without tax) x 1"
        },
        {
          "claim": "One-time payment",
          "quote": "It is one-time payment, not subscription."
        },
        {
          "claim": "Three devices, no expiry",
          "quote": "A Typora license is granted to the \"user\", which can be activated on up to 3 devices from one person for one license with no expiration time."
        },
        {
          "claim": "Refund",
          "quote": "If you're not satisfied with Typora for any reason, you will be able to get a full refund within 30 days from the license purchase."
        },
        {
          "claim": "Free trial",
          "quote": "Yes, we offer a 15-day free trial for the stable version, during which you can test and evaluate Typora."
        }
      ],
      "checkedAt": "2026-10-23"
    }
  },
  {
    "id": "o-cleanshot-x-basic-one-time-licence",
    "slug": "cleanshot-x-basic-one-time-licence",
    "productId": "cleanshot-x",
    "title": "CleanShot Basic: $35 one-time Mac licence with a year of updates",
    "summary": "CleanShot Basic is a one-time $35 purchase for the Mac app with one year of updates and 1 GB of Cloud storage; renewing updates is optional at $19 a year.",
    "description": "CleanShot X is a screenshot and screen recording app for macOS. Its Basic plan is a one-time purchase listed at $35, which CleanShot describes as \"pay once, use forever\".\n\nThe purchase includes one year of updates, after which renewing for further updates is optional at $19 per year. A free CleanShot Cloud account comes with the licence, with 1 GB of storage on Basic, but you don't need Cloud to use the app or its other features.\n\nCleanShot X requires macOS 13.0 or newer, and purchases come with a 30-day money-back guarantee.",
    "type": "lifetime",
    "categories": [
      "lifetime-deals",
      "software-deals"
    ],
    "audiences": [
      "designers",
      "creators",
      "developers"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 35,
      "period": "one-time",
      "renewalPrice": 19,
      "renewalPeriod": "year",
      "savingsLabel": "Pay once, use forever"
    },
    "claim": {
      "method": "link",
      "note": "Buy CleanShot Basic on cleanshot.com/buy"
    },
    "lifetime": {
      "licenceCovers": "Use of the Mac app with one year of updates; optional update renewal at $19/year; includes a free CleanShot Cloud account with 1 GB storage",
      "refundPolicy": "30-day money-back guarantee"
    },
    "eligibility": [
      "Requires a Mac running macOS 13.0 or newer"
    ],
    "redemption": [
      "Open the CleanShot pricing page",
      "Choose CleanShot Basic and complete the one-time purchase",
      "Optionally renew updates at $19/year after the first year"
    ],
    "terms": [
      "One-time price listed as $35",
      "Includes one year of updates; renewal at $19/year is optional",
      "Includes a free CleanShot Cloud account with 1 GB storage; Cloud isn't required to use the app",
      "Basic Cloud fair-use limits: 5 GB bandwidth and 300 uploads per month",
      "30-day money-back guarantee"
    ],
    "links": {
      "officialUrl": "https://cleanshot.com/pricing",
      "redeemUrl": "https://cleanshot.com/buy"
    },
    "source": "official",
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search extracts of cleanshot.com (pricing, buy, FAQ, fair-use pages); live pages not checked. Many third-party listings still show an older $29 price for the former \"App + Cloud Basic\" plan; the official pricing extract shows CleanShot Basic at $35, so re-check the current price. The extracts did not say what happens to app versions released after the update year.",
      "evidence": [
        {
          "claim": "Price and one-time model",
          "quote": "CleanShot Basic $35 Pay once, use forever"
        },
        {
          "claim": "Updates and renewal",
          "quote": "Includes one year of updates, with optional renewal at $19/year"
        },
        {
          "claim": "Cloud account optional",
          "quote": "When purchasing a CleanShot license, you will get a free CleanShot Cloud account. However, using CleanShot Cloud isn't required to use the app or any other features."
        },
        {
          "claim": "Refund",
          "quote": "Try CleanShot risk-free with our 30-day money-back guarantee."
        },
        {
          "claim": "System requirement",
          "quote": "CleanShot requires macOS 13.0 or newer"
        },
        {
          "claim": "Basic fair-use limits (search summary of cleanshot.com/fair-use)",
          "quote": "5 GB bandwidth per month and 300 uploads per month"
        }
      ],
      "checkedAt": "2026-10-23"
    }
  },
  {
    "id": "o-nova-one-time-licence-mac-code-editor",
    "slug": "nova-one-time-licence-mac-code-editor",
    "productId": "nova",
    "title": "Nova by Panic: $99 licence that never expires, with a year of updates",
    "summary": "Panic sells its Mac code editor Nova for $99 plus tax as a licence that never expires; it includes one year of updates, with optional renewals at $49 a year.",
    "description": "Nova is Panic's code editor for the Mac. It is sold for $99 plus tax, and Panic says a purchased copy of Nova will never expire or deactivate.\n\nThe price includes one year of updates. After that year you stop receiving major updates until you renew, which is optional and costs $49 per year plus tax, the same rate however long ago the licence lapsed. You can keep using the latest version you were eligible for indefinitely, and minor point releases of that version still arrive.\n\nOne licence covers all the Macs you personally use, as long as you are the only user; people sharing a Mac each need their own licence. A free trial lets you use Nova for up to 30 days from first launch.",
    "type": "lifetime",
    "categories": [
      "lifetime-deals",
      "software-deals"
    ],
    "audiences": [
      "developers",
      "freelancers"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 99,
      "period": "one-time",
      "renewalPrice": 49,
      "renewalPeriod": "year",
      "savingsLabel": "$99 once; licence never expires"
    },
    "claim": {
      "method": "link",
      "note": "Buy at nova.app/buy"
    },
    "lifetime": {
      "licenceCovers": "All Macs used by the buyer (single user); one year of updates; keep using the latest eligible version indefinitely; optional renewal at $49/year"
    },
    "eligibility": [
      "Mac only",
      "A licence covers one person; several people sharing one Mac each need a licence"
    ],
    "redemption": [
      "Optionally try Nova free for up to 30 days",
      "Buy a licence at nova.app/buy",
      "Renew for another year of updates at $49/year if you want new major versions"
    ],
    "terms": [
      "Price listed as $99 + tax",
      "Includes one year of updates",
      "Your purchased copy never expires or deactivates",
      "After the update year, no further major updates until you renew; minor point releases of your eligible version continue",
      "Renewal is $49/year + tax, regardless of how long ago the licence expired"
    ],
    "links": {
      "officialUrl": "https://nova.app/buy/",
      "redeemUrl": "https://nova.app/buy/"
    },
    "source": "official",
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search extracts of nova.app/buy and Panic's help pages (help.panic.com, help.nova.app); live pages not checked. No refund terms appeared in the extracts, so refundPolicy is omitted; check Panic's EULA. The multi-Mac quote is a close paraphrase from the search summary of Panic's help page.",
      "evidence": [
        {
          "claim": "Price",
          "quote": "for just $99 + tax"
        },
        {
          "claim": "Renewal price",
          "quote": "$49/year + tax starting the following year"
        },
        {
          "claim": "Licence never expires",
          "quote": "your purchased copy of Nova will never expire or deactivate"
        },
        {
          "claim": "After the update year",
          "quote": "once that one year period is over, you will not receive any further major updates until you renew your license. (You can keep using the latest version of Nova you were eligible for indefinitely, however!)"
        },
        {
          "claim": "Renewal rate fixed",
          "quote": "that rate remains the same no matter how long ago your license expired"
        },
        {
          "claim": "Multiple Macs (close paraphrase)",
          "quote": "Panic's license permits use of the app on all Macs in use by the buyer, provided the buyer is the only user"
        },
        {
          "claim": "Free trial",
          "quote": "Use it for up to 30 days from launch."
        }
      ],
      "checkedAt": "2026-10-23"
    }
  },
  {
    "id": "o-things-3-one-time-purchase-no-subscription",
    "slug": "things-3-one-time-purchase-no-subscription",
    "productId": "things-3",
    "title": "Things 3: one-time purchase per platform, no subscription",
    "summary": "Things 3 is a one-time App Store purchase for each Apple platform with no subscription; the Mac version is listed at $49.99 in the US and Things Cloud sync is free.",
    "description": "Things 3 is a to-do list app from Cultured Code for Apple devices. Cultured Code states that it is a one-time purchase for each platform and that there are no subscriptions. Syncing between devices with Things Cloud is free.\n\nThe Mac, iPhone, iPad and Vision Pro versions are sold separately. Things is sold only through Apple's App Store, where the Mac version is listed at $49.99 in the US; Cultured Code sets prices in US dollars and Apple converts them for other currencies.\n\nThe Mac version has a 15-day free trial, and buying from inside the trial keeps your existing to-dos. Recent releases such as Things 3.24 have shipped as free updates.",
    "type": "lifetime",
    "categories": [
      "lifetime-deals",
      "software-deals"
    ],
    "audiences": [
      "office-tools",
      "freelancers"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 49.99,
      "period": "one-time",
      "savingsLabel": "One-time purchase, no subscription"
    },
    "claim": {
      "method": "link",
      "note": "Buy from Apple's App Store; Things can't be bought outside the App Store"
    },
    "lifetime": {
      "licenceCovers": "One-time purchase per platform (Mac, iPhone, iPad and Vision Pro sold separately); free Things Cloud sync; feature updates such as 3.24 delivered free"
    },
    "eligibility": [
      "Requires an Apple device; each platform version is bought separately",
      "Sold only through Apple's App Store"
    ],
    "redemption": [
      "Optionally try the Mac version free for 15 days",
      "Buy Things 3 from the App Store for each platform you use",
      "Sign in to Things Cloud to sync your devices for free"
    ],
    "terms": [
      "One-time purchase for each platform; no subscriptions",
      "Mac version listed at $49.99 in the US; Apple converts prices for other currencies",
      "Mac, iPhone, iPad and Vision Pro versions are sold separately",
      "Things Cloud sync is free"
    ],
    "links": {
      "officialUrl": "https://culturedcode.com/things/pricing/",
      "redeemUrl": "https://culturedcode.com/things/mac/appstore/"
    },
    "source": "official",
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Cultured Code's official page; live page not checked",
      "note": "Quotes come from search extracts of culturedcode.com (pricing page, support articles, Mac App Store page, blog); live pages not checked. Only the Mac price ($49.99) was consistently shown; older Cultured Code pages list iPhone $9.99 and iPad $19.99, and a February 2024 post lists Vision Pro at $29.99, so those are left out. App Store purchases follow Apple's refund process; Cultured Code's own refund wording was not found.",
      "evidence": [
        {
          "claim": "One-time purchase, no subscription",
          "quote": "Things 3 is a one-time purchase for each platform; there are no subscriptions."
        },
        {
          "claim": "App Store only",
          "quote": "it's not possible to buy Things outside the App Store"
        },
        {
          "claim": "Mac price (Mac App Store listing linked from culturedcode.com)",
          "quote": "$49.99"
        },
        {
          "claim": "Platforms sold separately (search summary of pricing page)",
          "quote": "Things for Mac, Things for iPad, Things for iPhone, and Things for Vision are sold separately"
        },
        {
          "claim": "Free sync",
          "quote": "Sync through Things Cloud is free."
        },
        {
          "claim": "Free updates",
          "quote": "a free update on the App Store for Mac, iPad, iPhone, Watch, and Vision Pro"
        }
      ]
    }
  },
  {
    "id": "o-n8n-community-edition-self-hosted",
    "slug": "n8n-community-edition-self-hosted",
    "productId": "n8n",
    "title": "n8n Community Edition: free to self-host under a fair-code licence",
    "summary": "n8n's Community Edition is free to self-host under the Sustainable Use License, a fair-code licence that n8n itself says is not open source; n8n Cloud is a separate paid subscription.",
    "description": "n8n is a workflow automation platform that mixes visual building with custom code. The self-hosted Community Edition is free and runs on your own infrastructure. You can use it indefinitely without registering, or register for free to unlock extra features such as debugging in the editor and custom execution data.\n\nThe code is fair-code and source-available rather than open source: the Sustainable Use License only allows use or modification for your own internal business purposes, or for non-commercial or personal use. n8n says it does not call itself open source because OSI-approved licences cannot restrict use. Files marked \".ee.\" fall under a separate n8n Enterprise License, and a commercial licence is needed to host n8n as a service, white-label it, or let outside parties build or edit workflows.\n\nn8n Cloud is a paid subscription with its own terms; the Sustainable Use License does not apply to it.",
    "type": "open-source",
    "categories": [
      "open-source"
    ],
    "audiences": [
      "developers",
      "businesses",
      "startups"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "Free to self-host (fair-code)"
    },
    "claim": {
      "method": "link",
      "note": "Install the self-hosted Community Edition from the official repository or n8n's docs"
    },
    "eligibility": [
      "Free for your own internal business purposes, or for non-commercial or personal use",
      "A commercial licence is needed if outside parties create or edit workflows, or to host n8n as a service or white-label it"
    ],
    "redemption": [
      "Follow n8n's self-hosting docs to install the Community Edition",
      "Optionally register with an email for free to unlock extra features",
      "Contact license@n8n.io about licence edge cases"
    ],
    "terms": [
      "Licensed under the Sustainable Use License (fair-code), not an OSI-approved open-source licence",
      "Use or modification only for your own internal business purposes or for non-commercial or personal use",
      "Files with \".ee.\" in the filename or directory are licensed under the n8n Enterprise License, not the Sustainable Use License",
      "Applies to self-hosted n8n only; n8n Cloud is a paid subscription with its own terms"
    ],
    "links": {
      "officialUrl": "https://docs.n8n.io/n8n-community-license",
      "redeemUrl": "https://github.com/n8n-io/n8n"
    },
    "source": "official",
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of n8n's official page; live page not checked",
      "note": "Quotes come from search extracts of docs.n8n.io (Community license, Sustainable Use License, licence FAQ), support.n8n.io and the n8n-io/n8n GitHub repository; live pages not checked. n8n Cloud plan prices were left out because the pricing-page extract was about 14 months old and in euros. The outside-parties rule is summarised from the support FAQ; re-check the exact wording.",
      "evidence": [
        {
          "claim": "Community licence is free for self-hosting",
          "quote": "The Community license, officially the Sustainable Use License (\"SUL\"), is free and applies to the self-hosted version of n8n only."
        },
        {
          "claim": "n8n Cloud is paid",
          "quote": "n8n Cloud is a paid subscription with its own terms; this page doesn't apply to it."
        },
        {
          "claim": "Fair-code licences (README)",
          "quote": "n8n is fair-code distributed under the Sustainable Use License and n8n Enterprise License"
        },
        {
          "claim": "Use restriction",
          "quote": "You may use or modify the software only for your own internal business purposes or for non-commercial or personal use."
        },
        {
          "claim": "Not called open source",
          "quote": "according to the Open Source Initiative (OSI), open source licenses can't include limitations on use, so we do not call ourselves open source"
        },
        {
          "claim": "Enterprise files",
          "quote": "source code files that contain \".ee.\" in their filename or \".ee\" in their dirname are NOT licensed under the Sustainable Use License."
        },
        {
          "claim": "Who can use it free (support FAQ, summarised)",
          "quote": "if only you or people in your organization create or edit workflows, you can use the Community edition for free"
        }
      ]
    }
  },
  {
    "id": "o-immich-self-hosted-photo-video-management",
    "slug": "immich-self-hosted-photo-video-management",
    "productId": "immich",
    "title": "Immich: free, self-hosted photo and video library (AGPL-3.0)",
    "summary": "Immich is a self-hosted photo and video management solution licensed under AGPL-3.0; the maintainers say nothing sits behind a paywall and paying is optional.",
    "description": "Immich is a self-hosted photo and video management solution that aims to let you browse, search and organise your photos and videos without sacrificing your privacy. It is licensed under the GNU AGPL v3, and the project says it will stay AGPL without a contributor licence agreement.\n\nThe recommended install uses Docker Compose. The docs list at least 6 GB of RAM and 2 CPU cores (8 GB and 4 cores recommended), and advise keeping the Postgres database on local SSD storage rather than a network share. The quick start points to Google Takeout for photos that are not on your phone, and existing photo folders can be added as an external library.\n\nThe maintainers say nothing will be put behind a paywall and that you are free to use the software without paying. An optional supporter purchase, for one user or a whole server, helps fund the project.",
    "type": "open-source",
    "categories": [
      "open-source"
    ],
    "audiences": [
      "creators",
      "developers"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "Free to self-host"
    },
    "claim": {
      "method": "link",
      "note": "Install with Docker Compose following the official Immich docs"
    },
    "eligibility": [
      "Anyone able to run Docker on their own server and accept the AGPL-3.0 terms"
    ],
    "redemption": [
      "Read the Immich quick start or Docker Compose install guide",
      "Download the compose file and example env file, then start the containers",
      "Optionally buy a supporter licence to fund development"
    ],
    "terms": [
      "Licensed under the GNU AGPL v3",
      "At least 6 GB RAM and 2 CPU cores; 8 GB RAM and 4 cores recommended",
      "Requires the docker compose command; the older docker-compose is no longer supported",
      "No features behind a paywall; the supporter purchase is optional"
    ],
    "links": {
      "officialUrl": "https://immich.app",
      "redeemUrl": "https://docs.immich.app/overview/quick-start/"
    },
    "source": "official",
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Immich's official page; live page not checked",
      "note": "Quotes come from search extracts of the immich-app/immich GitHub repository and discussions, and docs.immich.app; live pages not checked. Supporter prices from a July 2024 announcement ($24.99 individual, $99.99 server) are left out because they may have changed. Immich offers no paid cloud version in the sources found. The hardware figures are summarised from the quick start and requirements pages.",
      "evidence": [
        {
          "claim": "What it is (repository description)",
          "quote": "High performance self-hosted photo and video management solution."
        },
        {
          "claim": "Licence",
          "quote": "Immich is available as open source under the terms of the GNU AGPL v3 License."
        },
        {
          "claim": "No paywall",
          "quote": "nothing will ever be put behind any paywalls"
        },
        {
          "claim": "Paying is optional",
          "quote": "you are free to use the software without purchasing, with no paywalls, ever. However, we do ask that if you find value in the software and are able to, you purchase immich."
        },
        {
          "claim": "Database storage advice",
          "quote": "The Postgres database (DB_DATA_LOCATION) should ideally use local SSD storage, and never a network share of any kind."
        },
        {
          "claim": "Goal",
          "quote": "browse, search and organize your photos and videos with ease, without sacrificing your privacy"
        }
      ]
    }
  },
  {
    "id": "o-twenty-crm-self-hosted-free",
    "slug": "twenty-crm-self-hosted-free",
    "productId": "twenty",
    "title": "Twenty CRM: self-host free with all Pro features",
    "summary": "Twenty's open-source CRM is free to self-host and includes all Pro features; its managed cloud plans start at $9 per user per month.",
    "description": "Twenty is an open-source CRM you can self-host to fully own your infrastructure, or run on Twenty's managed cloud. The free self-hosted edition includes all Pro features, community support via Discord and full control over your data.\n\nThe code is licensed mostly under AGPLv3, with certain packages under MIT and certain files under a commercial licence. Commercial self-hosted features, such as SSO and row-level permissions in the Organization tier ($19 per user per month), need a licence key; if that subscription ends, those features stop working but your instance and data keep running on your servers.\n\nSelf-hosting uses Docker Compose and needs at least 2 GB of RAM. Twenty's paid plans start at $9 per user per month for Pro.",
    "type": "open-source",
    "categories": [
      "open-source"
    ],
    "audiences": [
      "businesses",
      "startups",
      "developers"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "Free to self-host"
    },
    "claim": {
      "method": "link",
      "note": "Install with the Docker Compose guide in Twenty's self-hosting docs"
    },
    "eligibility": [
      "Anyone able to run Docker on their own server and accept the AGPL-3.0 terms",
      "SSO, row-level permissions and audit logs need a paid Organization licence key"
    ],
    "redemption": [
      "Follow the Docker Compose guide in Twenty's self-host docs",
      "Use the install script, or download .env and docker-compose.yml and run docker compose up -d",
      "Set SERVER_URL to your public URL and use a reverse proxy with SSL for production"
    ],
    "terms": [
      "Code mostly AGPLv3; some packages MIT and some files under a commercial licence",
      "Free self-hosted edition includes all Pro features, with community support via Discord",
      "Commercial self-hosted features need a licence key; they stop if the subscription ends, but the instance and data keep running",
      "Requires at least 2 GB RAM and Docker Compose"
    ],
    "links": {
      "officialUrl": "https://twenty.com/pricing",
      "redeemUrl": "https://docs.twenty.com/developers/self-host/capabilities/docker-compose"
    },
    "source": "official",
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search extracts of twenty.com (home, pricing, terms) and docs.twenty.com (pricing plans, Docker Compose guide); live pages not checked. Re-check the $9 Pro and $19 Organization per-user prices and whether they assume annual billing, which the extracts did not say.",
      "evidence": [
        {
          "claim": "Self-host or managed cloud",
          "quote": "self-host to fully own their infrastructure, or run it on our managed cloud for a zero-ops setup"
        },
        {
          "claim": "Free self-hosted edition",
          "quote": "Free (Self-Hosted) includes all Pro features, community support via Discord, and full control over your data."
        },
        {
          "claim": "Licence",
          "quote": "the GNU Affero General Public License v3 (AGPLv3), with certain packages under the MIT license and certain files under a commercial license"
        },
        {
          "claim": "Commercial features need a key",
          "quote": "commercial features of the self-hosted edition require a valid license key purchased from us"
        },
        {
          "claim": "Paid plans from $9 (pricing page title)",
          "quote": "Twenty CRM Pricing — Plans from $9 per User per Month"
        },
        {
          "claim": "Self-host requirement",
          "quote": "at least 2GB of RAM"
        }
      ],
      "checkedAt": "2026-10-23"
    }
  },
  {
    "id": "o-documenso-community-edition-self-hosted",
    "slug": "documenso-community-edition-self-hosted",
    "productId": "documenso",
    "title": "Documenso Community Edition: free self-hosted e-signing (AGPL-3.0)",
    "summary": "Documenso's self-hosted Community Edition is listed as free forever with no usage limits and includes the full core under AGPL-3.0; enterprise features need a licence key.",
    "description": "Documenso is an open-source document signing platform that describes itself as the open-source DocuSign alternative. Self-hosted Documenso includes the full core functionality under the AGPL-3.0 licence.\n\nThe Community Edition is listed as free forever, with no usage limits and community-only support. Documenso's comparison table frames it for testing, evaluation and internal proofs of concept. Enterprise features such as SSO, white-labelling the embedded editor and 21 CFR Part 11 compliance are unlocked with a paid licence key, and Documenso also runs a hosted service with paid plans, including an Individual plan listed at $25 per month.\n\nThe docs cover Docker, Docker Compose, Railway and Kubernetes deployments. You must supply your own signing certificate, because the Docker image does not include one.",
    "type": "open-source",
    "categories": [
      "open-source"
    ],
    "audiences": [
      "businesses",
      "freelancers",
      "startups"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "Free forever to self-host"
    },
    "claim": {
      "method": "link",
      "note": "Deploy the Community Edition by following Documenso's self-hosting docs"
    },
    "eligibility": [
      "Anyone able to run the app on their own infrastructure and accept the AGPL-3.0 terms",
      "Enterprise features (SSO, embed editor white label, 21 CFR Part 11) require a licence key"
    ],
    "redemption": [
      "Read Documenso's self-hosting docs",
      "Deploy with Docker, Docker Compose, Railway or Kubernetes",
      "Add your own signing certificate so documents can be signed"
    ],
    "terms": [
      "Core functionality licensed under AGPL-3.0",
      "Community Edition: free forever, no usage limits, community-only support",
      "Intended use listed as testing, evaluation and internal proofs of concept",
      "No signing certificate is bundled in the Docker image"
    ],
    "links": {
      "officialUrl": "https://documenso.com/self-hosted",
      "redeemUrl": "https://docs.documenso.com/docs/self-hosting"
    },
    "source": "official",
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Documenso's official page; live page not checked",
      "note": "Quotes come from search extracts of documenso.com (self-hosted and pricing pages), docs.documenso.com and the documenso/documenso GitHub README; live pages not checked. Documenso's licensing page reportedly also describes the Community Edition as suited to open-source projects and internal tools, which is broader than the pricing table; re-check the intended-use wording. Re-check the $25/month hosted Individual price.",
      "evidence": [
        {
          "claim": "Positioning (GitHub)",
          "quote": "The Open Source DocuSign Alternative."
        },
        {
          "claim": "Licence and enterprise key",
          "quote": "Self-hosted Documenso includes full core functionality under the AGPL-3.0 license. If you need enterprise features such as SSO, embed editor white label, or 21 CFR Part 11 compliance, you can activate them with a license key."
        },
        {
          "claim": "Community Edition is free forever",
          "quote": "Pricing: Free Forever; Intended Use: Testing, Evaluation, Internal POCs; Usage Limits: None; Application Support: Community Only"
        },
        {
          "claim": "Deployment options (README)",
          "quote": "We support a variety of deployment methods including Docker, Docker Compose, Railway, Kubernetes, and manual deployment."
        },
        {
          "claim": "Signing certificate",
          "quote": "Documenso does not bundle a signing certificate in the Docker image."
        },
        {
          "claim": "Hosted paid plan (search summary of pricing page)",
          "quote": "a hosted \"Individual\" plan at $25/month"
        }
      ]
    }
  },
  {
    "id": "o-umami-self-hosted-analytics-free",
    "slug": "umami-self-hosted-analytics-free",
    "productId": "umami",
    "title": "Umami: free, MIT-licensed self-hosted web analytics",
    "summary": "Umami's privacy-focused analytics is open source under the MIT licence and free to self-host, including for commercial use; Umami Cloud adds a free Hobby plan and a $20/month Pro plan.",
    "description": "Umami is a privacy-focused web and product analytics platform and an open-source alternative to Google Analytics, Mixpanel and Amplitude. It is released under the MIT licence, which allows unlimited commercial use, and Umami says it can be self-hosted for free.\n\nYou can run it on your own servers with Docker, Kubernetes or any Node.js hosting, then add one script tag to your site to start collecting data.\n\nUmami also runs a hosted service. Umami Cloud's Hobby plan is $0 per month for up to 100K events, one website and six months of data retention, and the Pro plan is $20 per month. Some features, such as email reports and the streaming API, are only in the cloud version.",
    "type": "open-source",
    "categories": [
      "open-source"
    ],
    "audiences": [
      "developers",
      "marketing-tools",
      "businesses"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "Free to self-host"
    },
    "claim": {
      "method": "link",
      "note": "Self-host from the official repository with Docker, Kubernetes or Node.js hosting"
    },
    "eligibility": [
      "Anyone; the MIT licence allows commercial use"
    ],
    "redemption": [
      "Deploy Umami on your own server with Docker, Kubernetes or Node.js hosting",
      "Add the Umami tracking script tag to your website",
      "View your analytics in your own Umami instance"
    ],
    "terms": [
      "Released under the MIT licence",
      "Free to self-host, including commercial use",
      "Email reports and the streaming API are only available in Umami Cloud",
      "Umami Cloud: Hobby $0/month (up to 100K events, 1 website, 6 months retention); Pro $20/month"
    ],
    "links": {
      "officialUrl": "https://umami.is/pricing",
      "redeemUrl": "https://github.com/umami-software/umami"
    },
    "source": "official",
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Umami's official page; live page not checked",
      "note": "Quotes come from search extracts of umami.is (pricing and developers pages) and docs.umami.is; live pages not checked. The MIT licence was confirmed from GitHub listings that were mostly forks of the repository; the official repo URL (github.com/umami-software/umami) was not shown directly in the search results and should be re-checked.",
      "evidence": [
        {
          "claim": "Free to self-host",
          "quote": "Umami is open-source and can be self-hosted for free."
        },
        {
          "claim": "Commercial use",
          "quote": "The MIT license also allows unlimited commercial use."
        },
        {
          "claim": "Cloud-only features",
          "quote": "Cloud also includes additional features like email reports and the streaming API that are not available in the self-hosted version."
        },
        {
          "claim": "Hosting options",
          "quote": "with Docker, Kubernetes, or any Node.js hosting"
        },
        {
          "claim": "Setup",
          "quote": "add one script tag to your site and you are collecting data immediately"
        },
        {
          "claim": "Hobby cloud plan (search summary of pricing page)",
          "quote": "$0 per month and includes up to 100K events per month, 1 website, 6 months of data retention"
        },
        {
          "claim": "Pro cloud plan (search summary of pricing page)",
          "quote": "The Pro plan is $20 per month and includes 1 million events, up to 20 websites, and 2 years of retention."
        }
      ]
    }
  },
  {
    "id": "o-heygen-voice-turbo-free-api-november-2026",
    "slug": "heygen-voice-turbo-free-api-november-2026",
    "productId": "heygen",
    "title": "HeyGen Voice Turbo text-to-speech free on the HeyGen API (through November 30, 2026)",
    "summary": "HeyGen's Turbo Free text-to-speech model, heygen-voice-1-turbo-free, can be called at no cost through November 30, 2026, with no credit balance needed. It runs on shared capacity with no availability guarantee.",
    "description": "HeyGen launched HeyGen Voice Turbo, a text-to-speech model, in October 2026. Until November 30, 2026, developers can use it for free by setting the model to heygen-voice-1-turbo-free on a HeyGen speech endpoint. Free requests do not need a credit balance.\n\nThe free model works with public voices and HeyGen Voice 1 instant clones. Requests to other models, including the default model and paid Turbo, are still billed, and a free request never switches to a paid model.\n\nEach endpoint allows 30 requests per minute per workspace member by default. All Turbo Free users share a limited pool of capacity, so requests can return HTTP 429 even below that limit, and HeyGen does not guarantee availability, response time or time to first audio for the free model.",
    "type": "free-plan",
    "categories": [
      "ai-tools",
      "free-credits"
    ],
    "audiences": [
      "developers",
      "ai-tools",
      "creators"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Set the model to heygen-voice-1-turbo-free on a HeyGen text-to-speech endpoint; no credit balance is needed."
    },
    "eligibility": [
      "Developers using the HeyGen API"
    ],
    "redemption": [
      "Set up HeyGen API access for your workspace",
      "Call a text-to-speech endpoint with the model set to heygen-voice-1-turbo-free",
      "Use a public voice or a HeyGen Voice 1 instant clone"
    ],
    "terms": [
      "Free until November 30, 2026",
      "Works with public voices and HeyGen Voice 1 instant clones only",
      "Other models, including paid Turbo, are still billed; free requests never switch to a paid model",
      "30 requests per minute per workspace member per endpoint by default",
      "Shared capacity: HTTP 429 is possible even below your request limit",
      "Availability, response time and time to first audio are not guaranteed"
    ],
    "expiresAt": "2026-11-30",
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of HeyGen's developer docs (Text to Speech page) and HeyGen's blog post 'HeyGen Voice Turbo Is Free for Developers'; the live pages could not be fetched from the research environment. Extracts described the end date as both 'until' and 'through' November 30, 2026, so re-check the exact wording and whether the last day is included. Paid Turbo pricing differs between sources ($4 vs $7.50 per 1M characters), so no regular price is listed. No country or region restriction appeared in the extracts.",
      "evidence": [
        {
          "claim": "Free window and model ID (developer docs)",
          "quote": "HeyGen Voice Turbo Free is free until November 30, 2026. ... set the model to \"heygen-voice-1-turbo-free\""
        },
        {
          "claim": "No credit balance; supported voices (developer docs)",
          "quote": "Free requests do not require a credit balance. They work with a public voice or a HeyGen Voice 1 instant clone."
        },
        {
          "claim": "Other models still billed (developer docs)",
          "quote": "Other models are still billed, and a free request never switches to a paid model."
        },
        {
          "claim": "Rate limit and shared capacity (developer docs)",
          "quote": "Each endpoint allows 30 requests per minute per workspace member by default ... all Turbo Free users share a limited amount of capacity. You can receive HTTP 429 even if you are below your request limit."
        },
        {
          "claim": "No service guarantee (developer docs)",
          "quote": "service availability, response time, and time to first audio are not guaranteed"
        },
        {
          "claim": "Notice before changes (HeyGen blog)",
          "quote": "we'll give advance notice before anything changes"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.heygen.com/blog/heygen-voice-turbo",
      "redeemUrl": "https://developers.heygen.com/docs/voices/heygen-voice-speech"
    }
  },
  {
    "id": "o-mistral-ai-studio-experiment-free-api-plan",
    "slug": "mistral-ai-studio-experiment-free-api-plan",
    "productId": "mistral-ai-studio",
    "title": "Mistral Studio Free mode: free API access by default, no card",
    "summary": "Mistral AI's Experiment plan lets developers try the Mistral API for free with only a verified phone number and no credit card. Requests on this plan may be used to train Mistral's models.",
    "description": "Mistral AI's Experiment plan is a free tier of its API, intended for experimentation, evaluation and prototyping. Mistral says all you need is a verified phone number, one per plan, and no credit card is required.\n\nAPI requests made on the Experiment plan may be used to train Mistral's models. You can upgrade to the Scale plan at any time for higher limits and pay-per-use billing. If your phone number is already linked to another account, Mistral suggests cancelling that subscription, upgrading to Scale or using a different number.",
    "type": "free-plan",
    "categories": [
      "ai-tools",
      "free-credits"
    ],
    "audiences": [
      "developers",
      "ai-tools"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "link",
      "note": "Free mode is the default for new Mistral Studio accounts; open the Studio console, go to API Keys and create a key."
    },
    "requirements": {
      "cardRequired": false
    },
    "eligibility": [
      "Anyone with a verified phone number (one phone number per plan)"
    ],
    "redemption": [
      "Sign in to Mistral's console",
      "Choose the Experiment plan and verify your phone number",
      "Generate an API key"
    ],
    "terms": [
      "Free mode has the lowest limits, intended for evaluation and prototyping",
      "Usage and rate limits apply",
      "Under Free mode, Mistral may use your input and output data to train its models",
      "If pay-as-you-go isn't enabled, usage can stop until the next billing period once the included monthly usage runs out"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Mistral AI's official page; live page not checked",
      "note": "Quotes come from search-engine extracts of Mistral's help center article on the Experiment plan, the docs page 'Activate Studio and generate an API key' and Mistral's September 2024 free-tier announcement; the live pages could not be fetched. Rate limits for the Experiment plan were not found on Mistral's own pages (third-party figures exist but were not used). An older quickstart mentioned adding payment information; the help center and current docs say no card is needed. Updated 2026-11-02 from search extracts of the provider's page; live page not opened.",
      "evidence": [
        {
          "claim": "Phone verification only (help center)",
          "quote": "all you need is a verified phone number (one phone number per plan)"
        },
        {
          "claim": "No card (help center)",
          "quote": "no credit card is required"
        },
        {
          "claim": "Training on requests (help center)",
          "quote": "API requests made under the Experiment plan may be used to train our models"
        },
        {
          "claim": "Upgrade path (help center)",
          "quote": "upgrade to the Scale plan at any time for higher limits and pay-per-use billing"
        },
        {
          "claim": "Free API access, phone prerequisite (docs)",
          "quote": "Experiment plan: free API access, no credit card required ... a phone number for verification"
        },
        {
          "claim": "Purpose of the free tier (Mistral announcement, September 2024)",
          "quote": "experimentation, evaluation, and prototyping at no cost"
        },
        {
          "claim": "Free mode is the default state for new accounts",
          "quote": "Free mode is the default state for new accounts."
        },
        {
          "claim": "Free API access without a card",
          "quote": "API access enabled by default with no credit card required. Usage and rate limits apply."
        },
        {
          "claim": "Free mode limits",
          "quote": "Free mode (the default) has the lowest limits, intended for evaluation and prototyping."
        },
        {
          "claim": "Training on Free mode data",
          "quote": "under Free mode, we may use your data (input and output) to train our artificial intelligence models"
        }
      ],
      "checkedAt": "2026-11-02"
    },
    "links": {
      "officialUrl": "https://docs.mistral.ai/getting-started/quickstarts/studio/activate-and-generate-api-key",
      "redeemUrl": "https://console.mistral.ai"
    }
  },
  {
    "id": "o-lovable-free-plan-daily-credits",
    "slug": "lovable-free-plan-daily-credits",
    "productId": "lovable",
    "title": "Lovable Free plan: 5 daily build credits (up to 30 a month)",
    "summary": "Lovable's Free plan includes 5 build credits a day, up to 30 a month, plus monthly Cloud credits, for building apps with its AI builder at no cost.",
    "description": "Lovable's Free plan costs $0 and grants 5 build credits per day, up to 30 per month. It also includes a monthly grant of 20 Cloud credits.\n\nDaily build credits expire at the end of each day and do not roll over. For more usage, Lovable lists the Pro plan at $25 per month with 100 monthly credits on top of 5 daily credits.",
    "type": "free-plan",
    "categories": [
      "ai-tools",
      "free-credits"
    ],
    "audiences": [
      "ai-tools",
      "developers",
      "startups"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "5 daily credits, up to 30 a month"
    },
    "claim": {
      "method": "link",
      "note": "Sign up at lovable.dev to start on the Free plan."
    },
    "eligibility": [
      "Anyone with a Lovable account"
    ],
    "redemption": [
      "Create a Lovable account",
      "Build from prompts; daily build credits are granted automatically"
    ],
    "terms": [
      "5 build credits per day, up to 30 per month",
      "Daily build credits expire at the end of each day and don't roll over",
      "Monthly grant of 20 Cloud credits"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of lovable.dev/pricing and its FAQ; the live page could not be fetched, and the extracts were partly paraphrased. The pricing FAQ was summarised as saying some regional plans cap daily credits at 30 per month, which may change the Free plan's limits in some countries; re-check. The extracts also mentioned a small allowance of credits for AI features inside user apps; the figure was unclear, so it is left out.",
      "evidence": [
        {
          "claim": "Daily build credits (pricing page)",
          "quote": "daily grant of 5 build credits, up to 30 a month"
        },
        {
          "claim": "Cloud credits (pricing page)",
          "quote": "monthly grants of 20 Cloud credits"
        },
        {
          "claim": "No rollover (pricing page)",
          "quote": "Included daily build credits expire at the end of each day and don't roll over."
        },
        {
          "claim": "Pro plan for comparison (pricing page)",
          "quote": "Pro: $25 per month, 100 monthly credits and 5 daily credits"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://lovable.dev/pricing"
    }
  },
  {
    "id": "o-bolt-new-free-plan-1m-tokens",
    "slug": "bolt-new-free-plan-1m-tokens",
    "productId": "bolt-new",
    "title": "Bolt.new Free plan: 1M tokens per month with a 300K daily limit",
    "summary": "Bolt.new's Free plan includes 1 million tokens a month, with a daily limit of 300,000, plus website hosting and public and private projects.",
    "description": "Bolt.new's Free plan costs $0 and includes 1M tokens per month, with a daily limit of 300K tokens. It covers public and private projects, website hosting with up to 333k web requests, and a 10MB file upload limit. Websites on the Free plan carry Bolt branding.\n\nThe Pro plan, at $25 per month, removes the daily token limit, starts at 10M tokens per month and rolls unused tokens over to the next month.",
    "type": "free-plan",
    "categories": [
      "ai-tools",
      "free-credits"
    ],
    "audiences": [
      "ai-tools",
      "developers",
      "startups"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "1M tokens per month"
    },
    "claim": {
      "method": "link",
      "note": "Sign up at bolt.new to start on the Free plan."
    },
    "eligibility": [
      "Anyone with a Bolt.new account"
    ],
    "redemption": [
      "Sign up at bolt.new",
      "Build from prompts; usage counts against the daily and monthly token limits"
    ],
    "terms": [
      "1M tokens per month",
      "300K tokens daily limit",
      "Bolt branding on websites",
      "10MB file upload limit",
      "Hosting includes up to 333k web requests"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of bolt.new/pricing; the live page could not be fetched. Third-party guides say Free plan tokens do not roll over; the official extracts only say rollover is a Pro feature, so the listing does not state it for Free. Re-check token figures, which Bolt has changed before.",
      "evidence": [
        {
          "claim": "Free plan price and monthly tokens (pricing page)",
          "quote": "Free $0 ... 1M tokens per month"
        },
        {
          "claim": "Daily limit (pricing page)",
          "quote": "300K tokens daily limit"
        },
        {
          "claim": "Included features (pricing page)",
          "quote": "Public and private projects ... Bolt branding on websites ... 10MB file upload limit ... Website hosting ... Up to 333k web requests"
        },
        {
          "claim": "Pro plan for comparison (pricing page)",
          "quote": "Pro $25/month ... No daily token limit ... Start at 10M tokens per month ... Unused tokens roll over to the next month"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://bolt.new/pricing"
    }
  },
  {
    "id": "o-deepl-api-developer-plan-1m-free-characters",
    "slug": "deepl-api-developer-plan-1m-free-characters",
    "productId": "deepl-api",
    "title": "DeepL API Developer plan: test the API free with 1,000,000 characters",
    "summary": "DeepL's API Developer plan lets developers test the DeepL API for free, with a one-time total of 1,000,000 characters that does not reset.",
    "description": "DeepL's Developer plan is a free way to test the DeepL API. It has a total translation limit of 1,000,000 characters. This is a one-time allowance, not a monthly quota: once it is used it does not reset, and you need to upgrade to the Growth plan to keep translating.\n\nDeepL's help center also lists the older API Free plan, which allowed up to 500,000 characters per month; this listing covers the Developer plan. On the Growth plan with monthly billing, DeepL includes 1 million characters and 10 hours of speech-to-text.",
    "type": "free-plan",
    "categories": [
      "ai-tools",
      "free-credits"
    ],
    "audiences": [
      "developers",
      "ai-tools"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "1,000,000 characters free (one-time total)"
    },
    "claim": {
      "method": "link",
      "note": "Sign up for the DeepL API and choose the Developer plan."
    },
    "eligibility": [
      "Developers signing up for the DeepL API"
    ],
    "redemption": [
      "Sign up for the DeepL API and choose the Developer plan",
      "Use your API key until the 1,000,000-character total is reached",
      "Upgrade to the Growth plan to continue"
    ],
    "terms": [
      "Total translation limit of 1,000,000 characters",
      "The allowance does not reset",
      "Upgrade to Growth is required once the limit is reached"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of DeepL's help center articles 'DeepL API plans' and 'Usage count and billing in DeepL API'; the live pages could not be fetched, and some extracts were paraphrased. DeepL's API lineup changed in 2026 (third-party guides say API Free and API Pro can no longer be bought), so re-check that the Developer plan is still free and how sign-up works. Third-party sources say DeepL has asked for a card for identification on free API sign-ups; DeepL's own wording was not found, so card requirements are left out.",
      "evidence": [
        {
          "claim": "Free testing plan (help center, DeepL API plans)",
          "quote": "The Developer plan lets developers test the DeepL API for free"
        },
        {
          "claim": "Total limit (help center, DeepL API plans)",
          "quote": "total translation limit of 1,000,000 characters"
        },
        {
          "claim": "No reset; upgrade to Growth (help center, DeepL API plans)",
          "quote": "Once that is used, it will not reset and you must upgrade to Growth."
        },
        {
          "claim": "Older API Free plan (help center)",
          "quote": "DeepL API Free allows developers to translate up to 500,000 characters per month for free."
        },
        {
          "claim": "Growth plan allowance (help center, usage and billing)",
          "quote": "monthly billing term ... 1 million characters and 10 hours of speech to text"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://support.deepl.com/hc/en-us/articles/360021200939-DeepL-API-plans",
      "redeemUrl": "https://www.deepl.com/pro-api"
    }
  },
  {
    "id": "o-railway-free-trial-5-dollar-credit",
    "slug": "railway-free-trial-5-dollar-credit",
    "productId": "railway",
    "title": "Railway Free Trial: one-time $5 credit for up to 30 days, no card needed",
    "summary": "New Railway users can start a Free Trial with a one-time $5 credit for any usage, valid for 30 days and with no credit card; afterwards the account moves to the Free plan with $1 of credit a month.",
    "description": "Railway's Free Trial gives new users access to basic features for up to 30 days, with a one-time grant of $5. The credit applies to any usage on the platform and expires after 30 days. You can sign up without a credit card.\n\nWhen the 30 days pass or the $5 is spent, the account reverts to the Free plan, which includes $1 of free credit per month that does not roll over. Accounts that are not verified get a trial with some network restrictions. Trial credit left over when upgrading carries over to a paid plan, though it may not apply to the first billing cycle.",
    "type": "free-credits",
    "categories": [
      "free-credits",
      "free-trials"
    ],
    "audiences": [
      "developers",
      "startups"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "creditValue": 5,
      "savingsLabel": "One-time $5 credit for 30 days"
    },
    "claim": {
      "method": "automatic",
      "note": "The one-time $5 grant is applied when a new user signs up for the Free Trial."
    },
    "requirements": {
      "cardRequired": false,
      "newCustomersOnly": true
    },
    "eligibility": [
      "New Railway users"
    ],
    "redemption": [
      "Sign up at railway.com to start the Free Trial",
      "The one-time $5 credit is applied to usage on the platform",
      "Unverified accounts get a trial with some network restrictions"
    ],
    "terms": [
      "Trial lasts up to 30 days",
      "The $5 credit expires in 30 days",
      "Afterwards the account reverts to the Free plan with $1 of free credit per month, which does not roll over",
      "Carried-over trial credit may not apply to the first billing cycle"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of Railway's docs (Free Trial page and Pricing FAQs); the live pages could not be fetched. The trial terms matched across several versions of the docs, but plan prices differed between pages, so no paid-plan price is listed. Re-check what counts as a verified account.",
      "evidence": [
        {
          "claim": "Trial length and $5 grant (Free Trial docs)",
          "quote": "The trial gives access to basic features for up to 30 days and includes a one-time grant of $5."
        },
        {
          "claim": "Credit use and expiry (Free Trial docs)",
          "quote": "The credits will be applied towards any usage on the platform and expire in 30 days."
        },
        {
          "claim": "After the trial (Free Trial docs)",
          "quote": "After 30 days passes or $5 is spent, the free trial reverts to the Free plan, which provides $1 of free credit per month. The credit does not roll over month to month."
        },
        {
          "claim": "No credit card (Pricing FAQs)",
          "quote": "Can I try Railway without a credit-card? Yes. As a new Railway user, you can sign up for a Free Trial. You will receive a one-time grant of $5 to use on resources."
        },
        {
          "claim": "Unverified accounts (Free Trial docs)",
          "quote": "If your account is not verified, your trial will have some network restrictions."
        },
        {
          "claim": "Credit on upgrade (Free Trial docs)",
          "quote": "carried-over Trial credits may not be applied to your first billing cycle"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://docs.railway.com/pricing/free-trial",
      "redeemUrl": "https://railway.com"
    }
  },
  {
    "id": "o-canva-for-nonprofits-free-team-50-users",
    "slug": "canva-for-nonprofits-free-team-50-users",
    "productId": "canva",
    "title": "Canva for Nonprofits: Canva Pro features free for one team of up to 50 users",
    "summary": "Eligible registered nonprofits get Canva's premium features plus team collaboration tools free for one team of up to 50 users, with extra seats at 50% off Canva Enterprise.",
    "description": "Canva for Nonprofits gives eligible organizations one team of up to 50 users for free. The team gets the premium features of Canva Pro along with Canva's team and collaboration tools. Organizations that need more people can add seats at 50% off Canva Enterprise.\n\nThe program is for registered nonprofits, NGOs and social impact organizations with clearly stated charitable missions. The organization must be officially registered as a charitable nonprofit (such as a 501(c)(3) in the US), independent from government and not run for commercial profit. Government agencies, political organizations, educational institutions, for-profit companies, most other 501(c) types and grant-making foundations are not eligible.\n\nApplicants submit Canva's nonprofit application form and complete verification. Canva's help center says it replies by email, typically within 72 hours, though verification can take longer. Country-specific requirements and required documents are listed in Canva's eligibility guidelines.",
    "type": "free-plan",
    "categories": [
      "saas-discounts",
      "software-deals"
    ],
    "audiences": [
      "designers",
      "creators",
      "businesses"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "Free for one team of up to 50 users; additional seats 50% off Canva Enterprise"
    },
    "claim": {
      "method": "application",
      "note": "Submit the Canva for Nonprofits application form from a Canva account, then complete verification."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Registered nonprofits, NGOs and social impact organizations with clearly stated charitable missions",
      "Officially registered as a charitable nonprofit (such as a 501(c)(3) in the US), independent from government and not operating for commercial profit",
      "Not eligible: government agencies, political organizations, educational institutions, for-profit companies, most other 501(c) types and grant-making foundations",
      "Country-specific requirements and documents are set out in Canva's eligibility guidelines"
    ],
    "redemption": [
      "Check Canva's nonprofit eligibility guidelines",
      "Make sure you have a Canva account with a valid email address",
      "Review the program Terms and Conditions",
      "Submit the nonprofit application form",
      "Complete verification; Canva replies by email"
    ],
    "terms": [
      "One team of up to 50 users is free",
      "Includes Canva Pro premium features plus team and collaboration tools",
      "Additional seats are 50% off Canva Enterprise",
      "Meeting the criteria does not guarantee approval",
      "Applications are most often rejected for missing or unclear documentation, a mismatched organization category or unconfirmed affiliation"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Canva's official page; live page not checked",
      "note": "Quotes come from search-engine extracts of canva.com nonprofit pages and help center articles because the pages could not be fetched from the research environment. Regional versions of the pages use slightly different wording (users vs members, organisation spelling) but agree on the 50-user team and the 50% Enterprise seat discount. Re-check the 72-hour reply time (shown on the US help page but not the UK one) and country-specific documentation rules on the live page. No region scope is set because Canva points to country-specific guidelines rather than stating global availability.",
      "evidence": [
        {
          "claim": "Free team size (nonprofits FAQ)",
          "quote": "All nonprofits can have one team of up to 50 users for free."
        },
        {
          "claim": "Additional seat discount (nonprofits FAQ)",
          "quote": "Additional seats are 50% off on Canva Enterprise."
        },
        {
          "claim": "What the free team includes",
          "quote": "all the premium features of Canva Pro, plus team and collaboration tools, for free"
        },
        {
          "claim": "Who qualifies",
          "quote": "registered nonprofits, NGOs, and social impact organizations with clearly stated charitable missions"
        },
        {
          "claim": "Registration requirement",
          "quote": "officially registered as a charitable nonprofit (like a 501(c)(3) in the US), independent from government, and not operating for commercial profit"
        },
        {
          "claim": "Exclusions (as extracted)",
          "quote": "Government agencies, political organizations, educational institutions, for-profit companies, most other 501(c) types, and grant-making foundations are not eligible."
        },
        {
          "claim": "Country rules",
          "quote": "check our full eligibility guidelines for country-specific requirements and required documentation"
        },
        {
          "claim": "Seat limit change (newsroom)",
          "quote": "Supporting nonprofits with 50 free Canva for Teams seats"
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.canva.com/nonprofits/",
      "redeemUrl": "https://www.canva.com/help/canva-for-nonprofits/"
    }
  },
  {
    "id": "o-monday-com-for-nonprofits-10-free-seats",
    "slug": "monday-com-for-nonprofits-10-free-seats",
    "productId": "monday-com",
    "title": "monday.com for Nonprofits: 10 free Pro seats, then 70% off each additional seat",
    "summary": "Eligible nonprofits get their first 10 Pro seats free on monday.com, 70% off every seat from the 11th, and 33% off an Enterprise upgrade, on an annual subscription.",
    "description": "monday.com's nonprofit plan gives eligible organizations 10 free Pro seats on its Work Management, CRM, Service and Dev products. Seats from the 11th onward are 70% off, and nonprofits that need Enterprise can upgrade at 33% off. Campaigns, automation packages and WorkCanvas are also discounted (70% on Pro, 33% on Enterprise).\n\nThe organization must be recognized as a charity, nonprofit, nongovernmental or social change organization in its country; in the US, 501(c)(3) status qualifies. Trade associations, legislative or political organizations and educational institutions are among the excluded categories, and monday.com makes the final decision.\n\nTo apply, create a monday.com account and submit the nonprofit application form with your legal documents. Goodstack reviews applications, and approved accounts are moved to the nonprofit plan after the organization consents by email. The discount needs a one-year subscription, and eligibility must be reconfirmed each year.",
    "type": "discount",
    "categories": [
      "saas-discounts",
      "software-deals"
    ],
    "audiences": [
      "office-tools",
      "businesses"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "savingsLabel": "10 free seats, then 70% off each seat from the 11th"
    },
    "claim": {
      "method": "application",
      "note": "Create a monday.com account, then submit the nonprofit application form with your organization's legal documentation."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Organizations recognized as a charity, nonprofit, nongovernmental or social change organization in their country",
      "US organizations can qualify with 501(c)(3) status; other countries' equivalent government-issued charitable status is accepted",
      "Excluded categories include trade associations, legislative or political organizations and educational institutions",
      "monday.com decides eligibility at its sole discretion"
    ],
    "redemption": [
      "Create a monday.com account",
      "Submit the nonprofit application form with your legal documentation",
      "Goodstack reviews the application",
      "After approval, give consent by email to move the account to the nonprofit plan",
      "The discounted plan should appear on the account within about 2 to 3 days"
    ],
    "terms": [
      "First 10 seats are free on the Pro plan",
      "70% off each seat from the 11th seat",
      "Enterprise upgrade at 33% off",
      "Requires a one-year subscription; monthly plans don't get the discount",
      "Eligibility must be reconfirmed every year, or full price applies"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of monday.com's nonprofit eligibility and pricing pages and its support article, because the pages could not be fetched from the research environment. monday.com's support articles differ on product scope: the current one lists Work Management, CRM, Service and Dev on Pro, while another says accounts created after March 2024 get 10 free seats on each product and older accounts may only have Work Management. Re-check product scope and the annual-only rule on the live pages.",
      "evidence": [
        {
          "claim": "Free seats (nonprofit pricing page)",
          "quote": "your first 10 seats are free"
        },
        {
          "claim": "Plan structure (eligibility page, as extracted)",
          "quote": "Nonprofit Plan ... 10 free seats ... 70% discount per seat from the 11th seat ... Enterprise ... 33% discount"
        },
        {
          "claim": "Products covered (support article, as extracted)",
          "quote": "10 free seats on Work Management, CRM, Service, and Dev on the Pro plan"
        },
        {
          "claim": "Products for newer accounts (support article)",
          "quote": "accounts created after March 2024 can also enjoy the first 10 seats on each monday.com product for free"
        },
        {
          "claim": "Eligibility (support article, as extracted)",
          "quote": "recognized as a charity, nonprofit, nongovernmental, or social change organization in its country"
        },
        {
          "claim": "Annual commitment (eligibility page, as extracted)",
          "quote": "agree to a one-year subscription ... monthly plans don't get the discount ... eligibility must be reconfirmed each year, or the full price applies"
        },
        {
          "claim": "Application process (support article, as extracted)",
          "quote": "create a monday.com account first, then submit the nonprofit application form ... reviewed by Goodstack ... approved accounts should see the discounted plan within about 2 to 3 days"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://support.monday.com/hc/en-us/articles/115005321269-monday-com-for-nonprofits",
      "redeemUrl": "https://monday.com/nonprofits/eligibility"
    }
  },
  {
    "id": "o-asana-for-nonprofits-50-off",
    "slug": "asana-for-nonprofits-50-off",
    "productId": "asana",
    "title": "Asana for Nonprofits: 50% off paid Asana plans",
    "summary": "Qualifying nonprofits and public libraries can get 50% off a paid Asana plan after verifying their status through Asana's nonprofit program.",
    "description": "Asana for Nonprofits gives qualifying organizations 50% off a paid Asana plan. Asana says the discount applies to all eligible nonprofits regardless of budget size, and its help center says it can be applied to monthly or annual plans.\n\nThe program covers nonprofits with 501(c)(3) designation and public libraries with valid nonprofit status, plus organizations with equivalent international designations. Applicants fill out a short form confirming their affiliation and eligibility; Asana works with Goodstack to verify it, and eligible organizations receive a discount code with instructions for applying it to their plan.",
    "type": "discount",
    "categories": [
      "saas-discounts",
      "software-deals"
    ],
    "audiences": [
      "office-tools",
      "businesses"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "savingsLabel": "50% off"
    },
    "claim": {
      "method": "application",
      "note": "Complete Asana's nonprofit form; after Goodstack verifies eligibility you receive a discount code and instructions."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Nonprofits with 501(c)(3) designation",
      "Public libraries with valid nonprofit status",
      "Organizations with equivalent international designations",
      "Available regardless of the organization's budget size"
    ],
    "redemption": [
      "Fill out Asana's short nonprofit form confirming your affiliation and your organization's eligibility",
      "Asana and Goodstack verify eligibility",
      "If eligible, you get a discount code and instructions for applying it to your Asana plan"
    ],
    "terms": [
      "50% off the paid plan you choose",
      "Can be applied to monthly or annual plans, per Asana's help center",
      "Asana's FAQ says the discount lasts as long as you stay with Asana"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of asana.com and help.asana.com because the pages could not be fetched from the research environment. Asana's pages name the eligible plans differently (one says Premium or Business, an older page says Starter or Advanced, another says any plan), so the title says 'paid plans'; re-check which tiers the current form covers. Country coverage is unclear: the help center extract mentions 25 countries while Asana's forum announced worldwide availability, so no region scope is set. A separate Asana page was reported to exclude hospitals; confirm before relying on it.",
      "evidence": [
        {
          "claim": "Discount size (nonprofit page)",
          "quote": "50% off any plan of your choice"
        },
        {
          "claim": "Plans named in expansion announcement",
          "quote": "eligible nonprofits 50% off Premium or Business"
        },
        {
          "claim": "Budget size",
          "quote": "the 50% discount now applies to all eligible nonprofits, regardless of budget size"
        },
        {
          "claim": "Who qualifies",
          "quote": "available only to qualifying nonprofits with 501(c)(3) designation and public libraries with valid nonprofit status"
        },
        {
          "claim": "International organizations",
          "quote": "organizations with equivalent international designations"
        },
        {
          "claim": "Monthly or annual (help center, as extracted)",
          "quote": "eligible nonprofits can apply for the 50% discount on monthly or annual plans"
        },
        {
          "claim": "Application and verification (as extracted)",
          "quote": "fill out a short form to confirm you're affiliated with your organization and that it's eligible ... Asana then works with Goodstack to verify your eligibility ... your discount code, along with instructions to apply it to your Asana plan"
        },
        {
          "claim": "Duration (FAQ, as extracted)",
          "quote": "it lasts forever unless you choose to leave Asana"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://asana.com/industry/nonprofit"
    }
  },
  {
    "id": "o-hostinger-black-friday-2026-web-hosting-sale",
    "slug": "hostinger-black-friday-2026-web-hosting-sale",
    "productId": "hostinger-web-hosting",
    "title": "Hostinger Black Friday 2026: up to 82% off web hosting (October 19 to December 14, 2026)",
    "summary": "Hostinger's Black Friday sale runs from October 19 to December 14, 2026, with web hosting from $2.49/mo on a 48-month term and discounts on VPS, domains and its AI website builder.",
    "description": "Hostinger's 2026 Black Friday sale runs from October 19 to December 14, 2026, covering Black Friday and Cyber Week. Hostinger advertises up to 82% off web hosting, with a free domain, email and SSL included. Premium web hosting is listed at $2.49/mo on a 48-month term ($119.52 in total, against a regular $585.12), renewing at $10.99/mo.\n\nThe sale also covers domains, the AI website builder, VPS hosting (listed at up to 67% off), ecommerce and web apps hosting. Hostinger's AI website builder deals page says early-access prices opened on October 19 and full Black Friday pricing begins on November 9, so listed prices may change during the sale.",
    "type": "discount",
    "categories": [
      "saas-discounts",
      "software-deals"
    ],
    "audiences": [
      "businesses",
      "freelancers",
      "developers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "regularPrice": 12.19,
      "regularPeriod": "month",
      "dealPrice": 2.49,
      "period": "month",
      "durationMonths": 48,
      "renewalPrice": 10.99,
      "renewalPeriod": "month",
      "savingsLabel": "Up to 82% off web hosting"
    },
    "claim": {
      "method": "automatic",
      "note": "Sale prices are listed on Hostinger's Black Friday pages; pick a plan and term and check out on hostinger.com."
    },
    "eligibility": [
      "Purchases of Hostinger plans during the sale period, October 19 to December 14, 2026"
    ],
    "redemption": [
      "Open Hostinger's Black Friday page",
      "Choose a plan and billing term",
      "Check out at the listed sale price"
    ],
    "terms": [
      "Sale runs from October 19 to December 14, 2026",
      "Premium web hosting: $2.49/mo on a 48-month term ($119.52 total, regular $585.12)",
      "The 48-month Premium plan renews at $10.99/mo",
      "Web hosting plans include a free domain, email and SSL",
      "Full Black Friday pricing on the AI website builder begins November 9; early-access prices apply before then"
    ],
    "expiresAt": "2026-12-14",
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of hostinger.com Black Friday pages because the pages could not be fetched from the research environment. Hostinger's pages disagree on the Premium discount (80% on the hosting page vs 82% elsewhere), and cached copies show other totals (e.g. $143.52) and coupon-only prices, so re-check the current price, term and renewal rate at checkout. The early-access vs full-price split (November 9) is stated on the AI builder deals page; it is not clear whether hosting prices also change on that date. Affiliate coupon codes seen on third-party sites are not included.",
      "evidence": [
        {
          "claim": "Sale dates",
          "quote": "The Hostinger Black Friday sale runs from October 19 to December 14, 2026"
        },
        {
          "claim": "Headline discount and inclusions (as extracted)",
          "quote": "up to 82% off web hosting, with a free domain, email, and SSL included"
        },
        {
          "claim": "Starting price",
          "quote": "From $12.19 $2.49/mo"
        },
        {
          "claim": "Premium 48-month total and renewal (as extracted)",
          "quote": "48-month total ... $119.52 ... regular price $585.12 ... renewal at $10.99/mo"
        },
        {
          "claim": "Other categories (as extracted)",
          "quote": "VPS plans show discounts of up to 67% off, and ecommerce is listed at 75% off"
        },
        {
          "claim": "Early access vs full price (AI builder page, as extracted)",
          "quote": "early access prices open on 19 October, and the full Black Friday price begins on 9 November"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.hostinger.com/black-friday",
      "redeemUrl": "https://www.hostinger.com/black-friday-web-hosting-deals"
    }
  },
  {
    "id": "o-ibm-bob-annual-subscription-20-off-october-2026",
    "slug": "ibm-bob-annual-subscription-20-off-october-2026",
    "productId": "ibm-bob",
    "title": "IBM Bob: 20% off a new annual subscription (through October 31, 2026)",
    "summary": "IBM is taking 20% off new annual IBM Bob subscriptions bought on ibm.com, applied automatically at checkout, until October 31, 2026.",
    "description": "IBM Bob is IBM's AI coding agent. Until October 31, 2026, IBM's store page for Bob Pro offers 20% off an annual subscription, applied automatically at checkout. The offer is for new subscriptions only.\n\nPromotional pricing covers only the first subscription term; renewals are excluded from promotions. Bob Pro is listed at $20 per month with 50 Bobcoins, IBM's usage unit for Bob.",
    "type": "discount",
    "categories": [
      "saas-discounts",
      "ai-tools"
    ],
    "audiences": [
      "developers",
      "ai-tools"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "savingsLabel": "20% off your annual subscription"
    },
    "claim": {
      "method": "automatic",
      "note": "Choose the annual subscription for IBM Bob in the IBM store; the discount is applied at checkout."
    },
    "requirements": {
      "newCustomersOnly": true
    },
    "eligibility": [
      "New annual subscriptions to IBM Bob bought on ibm.com",
      "Renewals are not eligible"
    ],
    "redemption": [
      "Open the IBM Bob product page in the IBM store",
      "Select the annual subscription",
      "The 20% discount is applied automatically at checkout"
    ],
    "terms": [
      "Offer valid until October 31, 2026",
      "New subscriptions only",
      "Promotional pricing applies only to the initial subscription term; renewals are excluded"
    ],
    "expiresAt": "2026-10-31",
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-11-02",
    "status": "archived",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of IBM's official page; live page not checked",
      "note": "Quotes come from search-engine extracts of IBM's store page for Bob Pro because the page could not be fetched from the research environment. The store lists Pro at $20.00/month or $240.00/year per instance with the annual option labelled 'Save 20%'; $240 is exactly 12 x $20, so it is unclear whether $240 is the price before or after the promotion, and no annual deal price is recorded. One search extract of ibm.com/products/offers-and-discounts described the offer as covering the first annual subscription to any Bob plan sold on ibm.com, but a second search could not find that wording, so the listing relies on the Bob Pro store page. Re-check before October 31.",
      "evidence": [
        {
          "claim": "Offer, eligibility, end date and claim method (store page)",
          "quote": "Get 20% off on your Annual subscription. New subscriptions only. Offer valid until October 31st, 2026 Offer applied automatically at checkout"
        },
        {
          "claim": "Renewals excluded (store terms, as extracted)",
          "quote": "promotional pricing is valid only for new subscriptions and the initial applicable subscription term. Renewals are excluded from promotions."
        },
        {
          "claim": "Listed prices (store page)",
          "quote": "$20.00/month per instance ... $240.00/year per instance ... Save 20%"
        },
        {
          "claim": "Pro plan allowance (pricing page, as extracted)",
          "quote": "Pro ... $20 per month with 50 Bobcoins"
        },
        {
          "claim": "What Bob is (IBM product page)",
          "quote": "the AI development partner that helps teams plan, build, test, secure, and modernize applications faster with built-in governance and control"
        },
        {
          "claim": "Offers page description (single extract; not re-confirmed)",
          "quote": "first annual subscription to any Bob plan sold via ibm.com ... October 31, 2026"
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.ibm.com/store/en/us/products/EIDCYNQT",
      "redeemUrl": "https://www.ibm.com/store/en/us/products/EIDCYNQT"
    }
  },
  {
    "id": "o-raycast-pro-yearly-billing-20-off",
    "slug": "raycast-pro-yearly-billing-20-off",
    "productId": "raycast",
    "title": "Raycast Pro: 20% off with yearly billing ($96 a year instead of $120)",
    "summary": "Raycast Pro costs $96 a year on yearly billing, 20% less than $120 for twelve months at the $10 monthly price, and comes with a 7-day free trial.",
    "description": "Raycast Pro adds Raycast AI, Cloud Sync and other Pro features to the free Raycast app. It costs $10 a month on monthly billing, or $96 a year on yearly billing, which Raycast lists as 20% off ($8 a month instead of $120 a year).\n\nYearly subscriptions are billed on the day you subscribe and then on the same date each year. Pro comes with a 7-day free trial, and billing starts on the day the trial ends.",
    "type": "discount",
    "categories": [
      "saas-discounts",
      "software-deals"
    ],
    "audiences": [
      "developers",
      "office-tools",
      "ai-tools"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "regularPrice": 120,
      "regularPeriod": "year",
      "dealPrice": 96,
      "period": "year",
      "savingsLabel": "Yearly -20%"
    },
    "claim": {
      "method": "automatic",
      "note": "Choose yearly billing when subscribing to Raycast Pro."
    },
    "eligibility": [
      "Anyone subscribing to Raycast Pro on yearly billing"
    ],
    "redemption": [
      "Open Raycast's pricing page",
      "Choose Raycast Pro with yearly billing",
      "Start the 7-day free trial; billing starts when the trial ends"
    ],
    "terms": [
      "Pro is $10 a month billed monthly, or $96 a year billed yearly",
      "Yearly subscriptions bill on the day you subscribe, then on the same date each year",
      "Pro comes with a 7-day free trial"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of raycast.com and manual.raycast.com because the pages could not be fetched from the research environment. Raycast changed its AI plans in September 2026 (Pro, Pro+ and Max); the extracts say Pro stays at $10 a month with 500 credits. Re-check the yearly price and the 20% label on the live pricing page.",
      "evidence": [
        {
          "claim": "Yearly discount and price (Pro/pricing page)",
          "quote": "Yearly -20% Raycast Pro Access to all features, and AI. $8/ month $120 $96 billed annually"
        },
        {
          "claim": "Monthly vs yearly price (billing manual table)",
          "quote": "Raycast Pro | $10 | $96 | 500 | Fast and powerful models"
        },
        {
          "claim": "Yearly billing date (billing manual, as extracted)",
          "quote": "Yearly subscriptions to Pro, Pro+, or Max bill on the day you subscribe, then on the same date each year"
        },
        {
          "claim": "Free trial (billing manual, as extracted)",
          "quote": "For the Pro plan, which comes with a 7-day free trial, billing starts on the day the trial ends"
        },
        {
          "claim": "Cloud Sync platforms (Pro page)",
          "quote": "syncing Snippets, Notes, Chats between your Mac, Windows, and iOS devices"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.raycast.com/pricing",
      "redeemUrl": "https://www.raycast.com/pro"
    }
  },
  {
    "id": "o-notion-plus-yearly-billing-save-20",
    "slug": "notion-plus-yearly-billing-save-20",
    "productId": "notion",
    "title": "Notion Plus: save up to 20% with yearly billing",
    "summary": "Notion's pricing page offers savings of up to 20% when paid plans such as Plus are billed yearly instead of monthly.",
    "description": "Notion's paid plans can be billed monthly or yearly, and Notion's pricing page says yearly billing saves up to 20%. Plus, the plan Notion describes as for small teams and professionals to work together, is listed at $10 per member per month.\n\nNotion says 'up to' 20%, so the exact saving depends on the plan. Check the billing toggle on the pricing page for the yearly per-member price before buying.",
    "type": "discount",
    "categories": [
      "saas-discounts",
      "software-deals"
    ],
    "audiences": [
      "office-tools",
      "businesses",
      "freelancers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "savingsLabel": "Save up to 20% with yearly"
    },
    "claim": {
      "method": "automatic",
      "note": "Choose yearly billing when upgrading to a paid Notion plan."
    },
    "eligibility": [
      "Notion workspaces upgrading to a paid plan, such as Plus, on yearly billing"
    ],
    "redemption": [
      "Open Notion's pricing page",
      "Switch the billing option to yearly",
      "Upgrade to Plus"
    ],
    "terms": [
      "Savings are 'up to' 20%; the exact saving varies by plan",
      "Plus is listed at $10 per member per month"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of notion.com/pricing because the page could not be fetched from the research environment. The extracts did not show which billing period the $10 Plus figure reflects or the yearly per-member price, so no regular or deal price is recorded. Re-check both prices on the live page.",
      "evidence": [
        {
          "claim": "Yearly saving (pricing page toggle)",
          "quote": "Save up to 20% with yearly"
        },
        {
          "claim": "Plus listed price (pricing page)",
          "quote": "$10 per member / month"
        },
        {
          "claim": "Plus plan description (pricing page)",
          "quote": "For small teams and professionals to work together"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.notion.com/pricing"
    }
  },
  {
    "id": "o-zoho-one-30-day-free-trial",
    "slug": "zoho-one-30-day-free-trial",
    "productId": "zoho-one",
    "title": "Zoho One: 30-day free trial, no credit card required",
    "summary": "Zoho's sign-up page for Zoho One offers a 30-day free trial of the whole suite with no credit card required.",
    "description": "Zoho One bundles Zoho's business applications into one subscription, which Zoho describes as an operating system for business. Zoho's own sign-up page for Zoho One advertises a 30-day free trial and says no credit card is required.\n\nAt 30 days, the trial is about twice the length of the usual 14-day SaaS trial, which gives a business time to test several Zoho apps together before choosing a plan.",
    "type": "free-trial",
    "categories": [
      "free-trials",
      "saas-discounts"
    ],
    "audiences": [
      "businesses",
      "startups",
      "office-tools"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "30-day free trial"
    },
    "claim": {
      "method": "link",
      "note": "Sign up on Zoho One's sign-up page; the trial starts with the new account."
    },
    "requirements": {
      "cardRequired": false
    },
    "eligibility": [
      "Businesses creating a Zoho One account through Zoho's sign-up page"
    ],
    "redemption": [
      "Go to Zoho One's sign-up page",
      "Enter your name, company, email and password",
      "Confirm the one-time password Zoho sends by email to start the trial"
    ],
    "terms": [
      "The trial lasts 30 days",
      "No credit card is required to start"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Zoho's official page; live page not checked",
      "note": "Quotes come from search extracts of Zoho's own Zoho One sign-up and product pages; zoho.com was not opened directly. The 30-day, no-card wording appears on several Zoho One sign-up variants. Re-check the trial length and post-trial pricing on zoho.com/one/pricing before marking verified; pricing and the app count were not confirmed from Zoho's own pages, so they are left out.",
      "evidence": [
        {
          "claim": "Trial length (Zoho One sign-up page banner)",
          "quote": "30-days free trial"
        },
        {
          "claim": "No card needed (Zoho One sign-up page banner)",
          "quote": "No credit card required"
        },
        {
          "claim": "What Zoho One is (zoho.com/one/business-software.html)",
          "quote": "Meet the Operating System for Business"
        },
        {
          "claim": "Shared services across the suite (zoho.com/one/business-software.html)",
          "quote": "Zoho One Services work across the system, giving you out-of-the-box AI, business intelligence, unified communication tools, and simplified software administration."
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.zoho.com/one/",
      "redeemUrl": "https://www.zoho.com/one/signup.html"
    }
  },
  {
    "id": "o-pipedrive-14-day-free-trial",
    "slug": "pipedrive-14-day-free-trial",
    "productId": "pipedrive",
    "title": "Pipedrive: 14-day free trial with full access, no credit card required",
    "summary": "Pipedrive offers a 14-day free trial of its sales CRM with full access and no credit card required.",
    "description": "Pipedrive, a sales CRM built around a visual deal pipeline, offers a 14-day free trial. Pipedrive's own pages say the trial gives full access and needs no credit card.\n\nPipedrive's help center explains what happens next: if you add billing details during the trial, the account converts to a paid account when the trial ends. If you don't, access to the account is restricted, and the trial account and its data are deleted shortly after the trial expires, so export anything you want to keep.",
    "type": "free-trial",
    "categories": [
      "free-trials",
      "saas-discounts"
    ],
    "audiences": [
      "businesses",
      "startups",
      "freelancers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "14-day free trial"
    },
    "claim": {
      "method": "link",
      "note": "Start the trial from Pipedrive's free trial page."
    },
    "requirements": {
      "cardRequired": false
    },
    "eligibility": [
      "Anyone signing up for a new Pipedrive account"
    ],
    "redemption": [
      "Go to Pipedrive's free trial page",
      "Sign up to start the 14-day trial",
      "Add billing details before the trial ends if you want to keep the account"
    ],
    "terms": [
      "The trial lasts 14 days",
      "No credit card is required to start",
      "Without billing details, access is restricted when the trial ends and the trial account and its data are deleted shortly after"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Pipedrive's official page; live page not checked",
      "note": "Quotes come from search extracts of pipedrive.com and support.pipedrive.com; the live pages were not opened. The trial-expiry quotes are close paraphrases of the help-center article (dated November 2024 in the extract), so re-check its wording. Which plan the trial covers was not stated on Pipedrive's own pages in the results, so it is left out.",
      "evidence": [
        {
          "claim": "Trial length and card (pipedrive.com homepage)",
          "quote": "14-day free trial, no credit card required"
        },
        {
          "claim": "Access level (pipedrive.com/en/crm-free-trial)",
          "quote": "Full access"
        },
        {
          "claim": "No card on the trial page (pipedrive.com/en/crm-free-trial)",
          "quote": "No credit card required"
        },
        {
          "claim": "After the trial without billing details (support.pipedrive.com, near-verbatim)",
          "quote": "The trial account and its data are deleted shortly after the trial expires."
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.pipedrive.com/en/crm-free-trial"
    }
  },
  {
    "id": "o-monday-com-14-day-pro-trial",
    "slug": "monday-com-14-day-pro-trial",
    "productId": "monday-com",
    "title": "monday.com: 14-day free trial of the Pro plan, no credit card needed",
    "summary": "New monday.com sign-ups automatically get a free 14-day trial of the Pro plan, with no credit card needed.",
    "description": "When you sign up for monday.com, your account automatically joins a free 14-day trial of the Pro plan. No credit card is needed to start.\n\nThe Pro plan is the only plan offered as a trial, and trials can't be extended. When the trial ends, you can buy a paid plan or move to the Free plan; if you do neither, the account deactivates without a charge.",
    "type": "free-trial",
    "categories": [
      "free-trials",
      "saas-discounts"
    ],
    "audiences": [
      "businesses",
      "office-tools",
      "startups"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "14-day Pro plan trial"
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up for monday.com; the Pro trial starts automatically."
    },
    "requirements": {
      "cardRequired": false
    },
    "eligibility": [
      "New monday.com sign-ups"
    ],
    "redemption": [
      "Sign up for a monday.com account",
      "The 14-day Pro plan trial starts automatically",
      "Check the remaining trial time in the Billing section under Administration"
    ],
    "terms": [
      "The trial is of the Pro plan only; other plans aren't offered as trials",
      "The trial lasts 14 days and can't be extended",
      "No credit card is needed; if you don't upgrade, the account deactivates"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of monday.com's official page; live page not checked",
      "note": "Quotes come from search extracts of monday.com's support article 'All about the monday.com free trial' and its pricing pages; the live pages were not opened. Some third-party sites say every paid plan has a trial, which conflicts with monday.com's own statement that only Pro is trialed; the official wording is used here. Re-check the article before marking verified.",
      "evidence": [
        {
          "claim": "Trial plan and length (support.monday.com)",
          "quote": "When signing up for a monday.com trial, you will automatically join our free 14-day Pro plan trial"
        },
        {
          "claim": "Only Pro is trialed (support.monday.com)",
          "quote": "At this time, we don't offer trials of different plans."
        },
        {
          "claim": "No extensions (support.monday.com)",
          "quote": "Free trials can't be extended."
        },
        {
          "claim": "No card needed (monday.com pricing pages)",
          "quote": "Unlimited users and boards. No credit card needed."
        }
      ]
    },
    "links": {
      "officialUrl": "https://support.monday.com/hc/en-us/articles/360010594079"
    }
  },
  {
    "id": "o-freshdesk-14-day-free-trial",
    "slug": "freshdesk-14-day-free-trial",
    "productId": "freshdesk",
    "title": "Freshdesk: 14-day free trial of the help desk, no credit card required",
    "summary": "Freshworks offers a 14-day free trial of Freshdesk with no credit card required, including its core help desk features.",
    "description": "Freshworks offers a 14-day free trial of Freshdesk, its customer support help desk, with no credit card required. Freshworks says the core features, including workflow automation, team collaboration, self-service, analytics and insights, are all available during the trial.\n\nYou can invite up to 2 team members to join the trial. At the end, Freshdesk's help center says you can buy a paid plan to continue.",
    "type": "free-trial",
    "categories": [
      "free-trials",
      "saas-discounts"
    ],
    "audiences": [
      "businesses",
      "startups"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "14-day free trial"
    },
    "claim": {
      "method": "link",
      "note": "Sign up for the trial on Freshworks' Freshdesk pages."
    },
    "requirements": {
      "cardRequired": false
    },
    "eligibility": [
      "Teams creating a new Freshdesk account"
    ],
    "redemption": [
      "Go to Freshworks' Freshdesk free trial page",
      "Sign up for the 14-day trial",
      "Invite up to 2 team members to try it with you"
    ],
    "terms": [
      "The trial lasts 14 days",
      "No credit card is required to start",
      "Up to 2 team members can be invited to the trial"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search extracts of freshworks.com and support.freshdesk.com; the live pages were not opened. Freshdesk's help center also says you can move to a 'Free Program' after the trial, but a third-party blog says the free tier is no longer shown on public pages, so that option is left out. Re-check whether a free tier still exists and which signup page (Freshdesk or Freshdesk Omni) the trial link leads to.",
      "evidence": [
        {
          "claim": "Trial length and card (freshworks.com/freshdesk/helpdesk-system)",
          "quote": "Sign up for a 14-day free trial. No credit card required."
        },
        {
          "claim": "Team members (freshworks.com/freshdesk/pricing/free/)",
          "quote": "Users can also invite up to 2 team members to join the free trial"
        },
        {
          "claim": "Features in the trial (freshworks.com/freshdesk/pricing/free/)",
          "quote": "Freshdesk's core features support workflow automation, team collaboration, self-service, analytics and insights. These features are all available in the free trial."
        },
        {
          "claim": "After the trial (support.freshdesk.com, near-verbatim)",
          "quote": "purchase any paid plan to continue seamlessly or move to the Free Program if you're still evaluating"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.freshworks.com/freshdesk/pricing/free/"
    }
  },
  {
    "id": "o-apple-creator-studio-college-students-educators",
    "slug": "apple-creator-studio-college-students-educators",
    "productId": "apple-creator-studio",
    "title": "Apple Creator Studio for college students and educators: $2.99/month or $29.99/year",
    "summary": "Verified college students and educators can subscribe to Apple Creator Studio, with Final Cut Pro, Logic Pro and Pixelmator Pro, for $2.99 a month or $29.99 a year instead of $12.99 or $129.",
    "description": "Apple Creator Studio is Apple's subscription to its pro creative apps: Final Cut Pro, Logic Pro, Pixelmator Pro, Motion, Compressor and MainStage, plus premium content and AI features in Keynote, Pages, Numbers and Freeform. The regular price is $12.99 a month or $129 a year.\n\nVerified college students enrolled at, and verified educators employed at, a degree-granting college or university can subscribe at $2.99 a month or $29.99 a year. After your status is verified you start a free trial and then the subscription, and Apple asks you to reverify once a year.\n\nStudents and educators who don't qualify can instead buy Apple's Pro Apps Bundle for Education, which has the one-time purchase versions of Final Cut Pro, Motion, Compressor, Logic Pro and MainStage.",
    "type": "student",
    "categories": [
      "student-discounts",
      "software-deals"
    ],
    "audiences": [
      "students",
      "creators",
      "designers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "regularPrice": 12.99,
      "regularPeriod": "month",
      "dealPrice": 2.99,
      "period": "month",
      "savingsLabel": "$2.99/month or $29.99/year for college students and educators"
    },
    "claim": {
      "method": "verification",
      "note": "Verify college student or educator status through Apple, then start the trial and subscription."
    },
    "requirements": {
      "studentVerification": true
    },
    "eligibility": [
      "Verified college students enrolled in a degree-granting college or university",
      "Verified educators employed at a degree-granting college or university"
    ],
    "redemption": [
      "Go to Apple Creator Studio's student and educator page",
      "Verify your student or educator status; you may be asked to sign in to your institution's portal, use a code sent to your school email, or upload documents such as a student ID or paystub",
      "Follow the onscreen steps to start the free trial and subscribe"
    ],
    "terms": [
      "Prices shown are US prices: $2.99/month or $29.99/year, versus $12.99/month or $129/year",
      "Apple asks you to reverify your status once a year",
      "You can cancel at any time at least a day before your renewal date"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search extracts of creatorstudio.apple.com and Apple Support articles 125029 and 126312; the live pages were not opened. The exact price formatting on creatorstudio.apple.com was not visible in the extract. The length of the student trial wasn't clear from the extracts, so it is left out. Other countries have local prices. Some reports say Apple now uses UNiDAYS for student verification in the US, while Apple's support page names other routes; re-check the verification steps.",
      "evidence": [
        {
          "claim": "Education pricing (creatorstudio.apple.com)",
          "quote": "$2.99 per month or $29.99 per year"
        },
        {
          "claim": "Price is for students and educators only (creatorstudio.apple.com/info/student)",
          "quote": "a price only college students and educators can get"
        },
        {
          "claim": "Eligibility (support.apple.com/125029)",
          "quote": "if you're a verified college student enrolled in or a verified educator employed at a degree-granting college or university, you can subscribe to Apple Creator Studio at a discounted monthly or yearly rate"
        },
        {
          "claim": "Included apps (support.apple.com/125029)",
          "quote": "a collection of creativity and productivity apps from Apple that includes Final Cut Pro, Logic Pro, Pixelmator Pro, Motion, Compressor, and MainStage"
        },
        {
          "claim": "Extras in iWork and Freeform (support.apple.com/125029)",
          "quote": "The subscription also includes premium content and AI features in Keynote, Pages, Numbers, and Freeform."
        },
        {
          "claim": "Sign-up after verification (support.apple.com/126312, near-verbatim)",
          "quote": "after your eligibility is verified, follow the onscreen steps to start a free trial and purchase a college student or educator subscription"
        },
        {
          "claim": "Cancellation (creatorstudio.apple.com)",
          "quote": "You can cancel your subscription at any time at least a day before your renewal date."
        },
        {
          "claim": "Annual reverification (support.apple.com/126312)",
          "quote": "Once a year, Apple will ask you to reverify your status."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://creatorstudio.apple.com/info/student",
      "redeemUrl": "https://support.apple.com/126312"
    }
  },
  {
    "id": "o-adobe-creative-cloud-pro-students-teachers",
    "slug": "adobe-creative-cloud-pro-students-teachers",
    "productId": "adobe-creative-cloud",
    "title": "Adobe Creative Cloud Pro for students and teachers: US$19.99/month for the first year",
    "summary": "Eligible students 13 and older and teachers can get Creative Cloud Pro on an annual plan for US$19.99/month for the first year, then US$39.99/month, against a regular US$69.99/month.",
    "description": "Adobe sells Creative Cloud Pro, its plan with 20+ creative apps and Adobe Firefly generative AI, to eligible students 13 and older and to teachers for US$19.99 a month for the first year. After the first year the membership bills at Adobe's standard student and teacher rate, currently US$39.99 a month. The regular Creative Cloud Pro price is US$69.99 a month.\n\nThe offer is on an annual plan with a 12-month commitment. Adobe checks eligibility through the school-issued email address you give at purchase; if it can't be verified, Adobe may ask for proof such as a school ID card, transcript or tuition bill after you buy.",
    "type": "student",
    "categories": [
      "student-discounts",
      "software-deals"
    ],
    "audiences": [
      "students",
      "designers",
      "creators"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "regularPrice": 69.99,
      "regularPeriod": "month",
      "dealPrice": 19.99,
      "period": "month",
      "durationMonths": 12,
      "renewalPrice": 39.99,
      "renewalPeriod": "month",
      "savingsLabel": "US$19.99/mo for the first year"
    },
    "claim": {
      "method": "verification",
      "note": "Buy the student and teacher plan with your school-issued email; Adobe may ask for proof of eligibility after purchase."
    },
    "requirements": {
      "studentVerification": true
    },
    "eligibility": [
      "Students aged 13 and older at an accredited institution",
      "Teachers at an accredited institution"
    ],
    "redemption": [
      "Go to Adobe's Creative Cloud for students and teachers page",
      "Buy the annual plan using your school-issued email address",
      "If asked, upload proof of eligibility such as a school ID card, report card, transcript or tuition bill"
    ],
    "terms": [
      "Annual plan with a 12-month commitment",
      "US$19.99/month applies to the first year; it then bills at the standard rate, currently US$39.99/month",
      "Prices shown are US prices and exclude applicable taxes"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Adobe's official page; live page not checked",
      "note": "Quotes come from search extracts of adobe.com's student pricing pages and an Adobe help (helpx) FAQ; the live pages were not opened. The verification quote came from a regional (Malaysia) helpx page, so re-check the US version. Adobe ran a shorter US$15.99/month promotion from August 17 to September 2, 2026, which has ended; the US$19.99 standard student offer is listed here. One extract said the first-year price is for first-time memberships only; re-check that before adding a new-customers flag.",
      "evidence": [
        {
          "claim": "Price, age and renewal (adobe.com/products/pricing-info/ccste-pricing-info.html)",
          "quote": "Eligible students 13 and older and teachers can purchase an annual membership for a reduced price of US$19.99/mo for the first year. At the end of the offer term, the membership bills at the standard rate, currently US$39.99/mo."
        },
        {
          "claim": "Regular price and first-year price (adobe.com student Creative Cloud page)",
          "quote": "Regularly at US$69.99/mo Alternatively at US$19.99/mo"
        },
        {
          "claim": "First year then standard rate (adobe.com student Creative Cloud page)",
          "quote": "Pay US$19.99/mo for the first year and US$39.99/mo after that."
        },
        {
          "claim": "Verification (helpx.adobe.com students and teachers FAQ, near-verbatim)",
          "quote": "If you don't have a school-issued email address or your email address cannot be verified, additional proof of eligibility may be requested after purchase."
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.adobe.com/creativecloud/buy/students",
      "redeemUrl": "https://www.adobe.com/products/pricing-info/ccste-pricing-info.html"
    }
  },
  {
    "id": "o-unity-student-plan-free",
    "slug": "unity-student-plan-free",
    "productId": "unity",
    "title": "Unity Student plan: free Unity Pro Editor for students 16 and older",
    "summary": "Unity's free Student plan gives students 16 and older at an accredited institution the latest Unity Pro Editor for personal use.",
    "description": "The Unity Student plan is free and meant for individual students to use on their own computers. It includes the latest version of the Unity Pro Editor.\n\nYou must be 16 or older and enrolled at an accredited educational institution, and you apply as either a post-secondary or a secondary student. Unity verifies student status when you apply, and in most cases verification is instant. The plan isn't available in Mainland China, Macau, Iran, Syria, Taiwan or Hong Kong, where Unity suggests Unity Personal instead.",
    "type": "student",
    "categories": [
      "student-discounts",
      "software-deals"
    ],
    "audiences": [
      "students",
      "developers",
      "creators"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "verification",
      "note": "Apply on Unity's Student plan page and verify that you are an enrolled student."
    },
    "requirements": {
      "studentVerification": true
    },
    "regions": {
      "scope": "limited",
      "note": "Not available in Mainland China, Macau, Iran, Syria, Taiwan and Hong Kong"
    },
    "eligibility": [
      "Students aged 16 and older",
      "Enrolled at an accredited educational institution (post-secondary or secondary)",
      "For individual use on your own computer"
    ],
    "redemption": [
      "Go to Unity's Student plan page",
      "Choose Post-Secondary or Secondary to match your studies",
      "Verify your student status and agree to the processing of your personal information"
    ],
    "terms": [
      "For individual students on personal computers; classroom and lab installs need a separate education licence",
      "Not available in Mainland China, Macau, Iran, Syria, Taiwan and Hong Kong"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search extracts of unity.com/products/unity-student and Unity's support article on Student plan eligibility; the live pages were not opened. The extra benefits listed differ between page versions (Odin Inspector licence, Synty asset bundle, Unity Cloud access, Asset Store discount), so only the Pro Editor is listed. A localized Unity page says the plan lasts one year and can be renewed while enrolled; re-check that and the revenue limit some third-party sites mention.",
      "evidence": [
        {
          "claim": "Free, for individual students (unity.com/products/unity-student)",
          "quote": "The Unity Student plan is free and intended for individual students to use on their personal computers."
        },
        {
          "claim": "Includes Pro Editor (unity.com/products/unity-student)",
          "quote": "the latest version of the Unity Pro Editor"
        },
        {
          "claim": "Eligibility (support.unity.com)",
          "quote": "This plan is available for students who are 16 years and older and are enrolled in an accredited educational institution."
        },
        {
          "claim": "Regional limits (unity.com/products/unity-student)",
          "quote": "The Unity Student Plan is currently not available in Mainland China, Macau, Iran, Syria, Taiwan, and Hong Kong."
        },
        {
          "claim": "Verification speed (Unity student page)",
          "quote": "in most cases, verification is instantaneous"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://unity.com/products/unity-student"
    }
  },
  {
    "id": "o-miro-education-plan-free",
    "slug": "miro-education-plan-free",
    "productId": "miro",
    "title": "Miro Education plan: free for students (2 years) and educators (no end date)",
    "summary": "Miro's free Education plan gives students 2 years of access with teams of up to 10, and educators access with no end date and teams of up to 100.",
    "description": "Miro gives its Education plan free to students and staff of educational institutions. For educators the plan is valid with no end date and allows up to 100 members in a team; for students it is valid for two years and allows 10 members in a team. It includes unlimited active boards and high-resolution export without a watermark, with limited Miro AI and no Video chat or Rally.\n\nTo apply, you fill in Miro's form with an educational email address ending in .edu or .k12, or on your public institution's domain; without one, you can send proof of your affiliation. Processing can take up to 10 days. Schools, colleges, universities, technical schools, MBA schools and accredited online schools qualify; non-accredited institutions, vocational and retraining programs and research labs don't.",
    "type": "student",
    "categories": [
      "student-discounts",
      "software-deals"
    ],
    "audiences": [
      "students",
      "designers",
      "office-tools"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "application",
      "note": "Apply through the Education plan form linked from Miro's Help Center."
    },
    "requirements": {
      "approvalRequired": true,
      "studentVerification": true
    },
    "eligibility": [
      "Students and educators at middle schools, high schools, junior colleges, colleges, universities, technical schools, MBA schools or accredited online schools",
      "An educational email ending in .edu or .k12 or on your public institution's domain, or proof of affiliation",
      "Not for non-accredited institutions, vocational and retraining programs, or research labs"
    ],
    "redemption": [
      "Open Miro's Education plan article in the Help Center",
      "Complete the application form with your educational email and a document showing your student or staff status",
      "Wait for Miro to process the application (up to 10 days)"
    ],
    "terms": [
      "Students: valid for two years, up to 10 members in a team",
      "Educators: valid with no end date, up to 100 members in a team",
      "Limited Miro AI; no Video chat or Rally"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Miro's official page; live page not checked",
      "note": "Quotes come from search extracts of Miro's Help Center article 'Education plan'; the live page was not opened. One later extract of the same article didn't show the two-year and team-size terms, though a university guide repeats them; one deal site says one year, which conflicts. Re-check the validity periods and team sizes before marking verified.",
      "evidence": [
        {
          "claim": "Educators (help.miro.com Education plan)",
          "quote": "valid forever for educators"
        },
        {
          "claim": "Students (help.miro.com Education plan)",
          "quote": "valid for two years for students"
        },
        {
          "claim": "Email requirement (help.miro.com Education plan)",
          "quote": "ends in *.edu or *.k12, or belongs to the domain of your public educational institution"
        },
        {
          "claim": "Processing time (help.miro.com Education plan)",
          "quote": "Processing may take us up to 10 days"
        },
        {
          "claim": "Features (help.miro.com Education plan)",
          "quote": "Unlimited active boards"
        },
        {
          "claim": "Limits (help.miro.com Education plan)",
          "quote": "No Video chat / Rally"
        }
      ]
    },
    "links": {
      "officialUrl": "https://help.miro.com/hc/en-us/articles/360017730473-Education-plan"
    }
  },
  {
    "id": "o-auth0-for-startups",
    "slug": "auth0-for-startups",
    "productId": "auth0",
    "title": "Auth0 for Startups: one year of the B2B Professional plan free",
    "summary": "Young, venture-backed startups with under $5M raised and under $1M ARR can get one year of Auth0's B2B Professional plan at no cost, with up to 100,000 monthly active users.",
    "description": "Auth0's startup program gives eligible early-stage companies one year of its B2B Professional plan for free. The plan includes up to 100,000 monthly active users and enterprise features such as single sign-on and multi-factor authentication.\n\nTo qualify, a company must be venture-backed with less than $5M in funding, have less than $1M in annual recurring revenue and be less than two years from its date of incorporation. Existing paid Auth0/Okta customers and startups that have been in the program before are excluded.\n\nAuth0 suggests starting on its Free plan while building and applying to the program once you need features like Enterprise MFA or more Organizations. Companies that don't qualify can still use the Free plan.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "saas-discounts"
    ],
    "audiences": [
      "startups",
      "developers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "durationMonths": 12,
      "savingsLabel": "One year of B2B Professional free, up to 100,000 MAU"
    },
    "claim": {
      "method": "application",
      "note": "Apply on Auth0's startups page; Auth0 suggests applying once you outgrow the Free plan."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Venture-backed with less than $5M in funding",
      "Less than $1M in annual recurring revenue",
      "Less than two years from the date of incorporation",
      "Not an existing paid Auth0/Okta customer (enterprise or paid self-service plans)",
      "Not a previous member of the Auth0 for Startups program"
    ],
    "redemption": [
      "Use the Auth0 Free plan while you build your product",
      "When you need more features, such as Enterprise MFA or more Organizations, apply on the Auth0 for Startups page",
      "If you are not eligible, you can keep using Auth0's Free plan"
    ],
    "terms": [
      "Covers one year of the B2B Professional plan",
      "Includes up to 100,000 monthly active users",
      "Includes enterprise features such as SSO and MFA",
      "A company can only take part in the program once"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of auth0.com/startups and its partner variants (e.g. auth0.com/startups/vip); they may be excerpted. The 100,000 MAU wording came from an Auth0-hosted page in the same results. Re-check what happens at the end of the 12 months on the live FAQ, since the extracts were cut off there.",
      "evidence": [
        {
          "claim": "One year of B2B Professional",
          "quote": "Get one year of our B2B Professional capabilities so your users and AI agents can more securely access what they need."
        },
        {
          "claim": "100,000 MAU and SSO/MFA included",
          "quote": "The Auth0 for Startups program offers eligible early-stage companies one year of the B2B Professional plan for free. This includes up to 100,000 monthly active users (MAU) and enterprise features like SSO and MFA."
        },
        {
          "claim": "Eligibility criteria",
          "quote": "Venture-backed with less than $5M in funding; Less than $1M in annual recurring revenue; Less than two years from the date of incorporation"
        },
        {
          "claim": "Exclusions",
          "quote": "Offer not valid for existing paid Auth0/Okta customers (including both enterprise and paid self service plans) or startups that have previously been members of the Auth0 for Startups program."
        },
        {
          "claim": "When to apply",
          "quote": "Use the Auth0 Free Plan as you begin developing your product. Once you need more features, like Enterprise MFA, or additional Organizations, move onto the next step"
        },
        {
          "claim": "Fallback for ineligible companies",
          "quote": "If you're not eligible for this program, you can still try Auth0 for free at: https://auth0.com/signup"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://auth0.com/startups"
    }
  },
  {
    "id": "o-webflow-for-startups",
    "slug": "webflow-for-startups",
    "productId": "webflow",
    "title": "Webflow for Startups: 100% off the first full year of a CMS site plan",
    "summary": "New Webflow customers with fewer than 50 employees, under $15M raised and a Webflow startup partner can get their first full year of a CMS site plan free.",
    "description": "Webflow's startup program gives eligible startups 100% off their first full year of a CMS site plan.\n\nTo qualify, a startup must have raised less than $15 million, have fewer than 50 employees, be a new Webflow customer and work with one of Webflow's startup partners, such as an accelerator or investor. All of the criteria must be met.\n\nApplications are reviewed by Webflow within 3-4 business days, and applications from personal email addresses are not accepted. Accepted startups receive a promo code, which Webflow's help center says works with monthly billing only.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "saas-discounts"
    ],
    "audiences": [
      "startups",
      "designers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "durationMonths": 12,
      "savingsLabel": "100% off your first full year of a CMS site plan"
    },
    "claim": {
      "method": "application",
      "note": "Apply with a company email; accepted startups get a promo code for monthly billing."
    },
    "requirements": {
      "newCustomersOnly": true,
      "approvalRequired": true
    },
    "eligibility": [
      "Raised less than $15 million in funding",
      "Fewer than 50 employees",
      "New Webflow customer",
      "Working with one of Webflow's startup partners",
      "Must meet all of the criteria"
    ],
    "redemption": [
      "Submit the Webflow for Startups application using a company email address",
      "Wait for Webflow to review the application (3-4 business days)",
      "If accepted, apply the promo code to a site plan on monthly billing"
    ],
    "terms": [
      "Applications from personal email addresses are not accepted",
      "Promo code applies to monthly billing only, not yearly billing"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Webflow's official page; live page not checked",
      "note": "Quotes come from search-engine extracts of webflow.com/startups, the application page and a Webflow help center article; they may be excerpted. The help center article reportedly names the covered plan as the Premium Site plan (and legacy CMS Site plan), while the application page says CMS site plan; re-check which current site plan the code covers. Partner-specific pages (e.g. webflow.com/solutions/yc) exist with their own wording.",
      "evidence": [
        {
          "claim": "Benefit",
          "quote": "100% off your first full year of a CMS site plan"
        },
        {
          "claim": "Eligibility criteria",
          "quote": "raised fewer than 15 million dollars in funding, a new Webflow customer, fewer than 50 employees, and working with one of Webflow's startup partners"
        },
        {
          "claim": "All criteria required",
          "quote": "Startups must meet all criteria above to qualify."
        },
        {
          "claim": "Company email required",
          "quote": "Applications with personal email addresses will not be accepted."
        },
        {
          "claim": "Review time",
          "quote": "our team will review your application within 3-4 business days"
        },
        {
          "claim": "Monthly billing only (help center)",
          "quote": "the promo code applies only to monthly billing and won't work with yearly billing"
        }
      ]
    },
    "links": {
      "officialUrl": "https://webflow.com/startups",
      "redeemUrl": "https://webflow.com/startups/startups-application"
    }
  },
  {
    "id": "o-retool-for-startups",
    "slug": "retool-for-startups",
    "productId": "retool",
    "title": "Retool for Startups: 100% off Team or Business for a year, worth up to $60K",
    "summary": "Startups up to Series A with under $10M raised can get a 100% off coupon for one year of a monthly Retool Team or Business plan, worth up to $60K, then 25% off the second year.",
    "description": "Retool's startup program gives eligible startups a 100% off coupon for one year on a monthly Team or Business plan, with a value of up to $60k. In the second year, the startup gets 25% off its paid plan.\n\nThe program is for bootstrapped, angel-funded, debt-funded, pre-seed, seed and Series A companies that have raised less than $10 million in total and were founded within the last 10 years. Applicants must be new customers on a monthly Team or Business plan; organisations that have been on a paid plan for several billing cycles or were in the program before are excluded.\n\nTo claim it, you upgrade to the monthly plan you want and then apply. Retool confirms acceptance by email and applies the discount to the first invoice at the end of the first billing cycle.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "saas-discounts"
    ],
    "audiences": [
      "startups",
      "developers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "durationMonths": 12,
      "savingsLabel": "100% off for one year, up to $60k in value"
    },
    "claim": {
      "method": "application",
      "note": "Upgrade to a monthly Team or Business plan first, then submit the application."
    },
    "requirements": {
      "newCustomersOnly": true,
      "approvalRequired": true
    },
    "eligibility": [
      "Bootstrapped, angel-funded, debt-funded, pre-seed, seed or Series A",
      "Raised less than $10 million in total funding",
      "Founded within the last 10 years",
      "New Retool customer on the monthly Team or Business plan",
      "Not already on a paid plan for multiple billing cycles, and not a past member of Retool's startup program"
    ],
    "redemption": [
      "Upgrade to the monthly Team or Business plan you want",
      "Submit the startup program application",
      "Wait for a confirmation email on acceptance",
      "The discount is applied to the first invoice at the end of the first billing cycle"
    ],
    "terms": [
      "Monthly Team or Business plans only; not for annual plans or the Enterprise tier",
      "Cannot be combined with other sales discounts",
      "An organisation can only be accepted to one of Retool's discount programs",
      "25% off the paid plan in the second year"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of retool.com/startups and docs.retool.com/support/discount-programs; they may be excerpted. Older Retool blog posts and changelogs cite $1,200 or $25,000 in credits; the current program page and docs cite the 100% coupon worth up to $60k. Some accelerators (e.g. YC, Techstars) reportedly offer partner codes with more; not included.",
      "evidence": [
        {
          "claim": "Benefit and second-year discount",
          "quote": "Eligible Startups receive a 100% off coupon for one year, with a value up to $60k, to access a monthly subscription to Retool's Team or Business plan. They'll then get 25% off for their second year."
        },
        {
          "claim": "Funding stage",
          "quote": "bootstrapped, angel-funded, debt-funded, pre-seed, seed, or Series A"
        },
        {
          "claim": "Funding cap and age",
          "quote": "raised less than $10 million in total funding, and were founded within the last 10 years"
        },
        {
          "claim": "Plan limits",
          "quote": "Organizations can only be accepted to one of the three discount programs, and the discounts cannot be used for our Enterprise tier or any annual plans."
        },
        {
          "claim": "How the discount is applied",
          "quote": "Acceptance is confirmed by email, and the discount is applied automatically to the first invoice at the end of the first billing cycle."
        },
        {
          "claim": "No stacking",
          "quote": "the startup discount can't be combined with other sales discounts"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://retool.com/startups"
    }
  },
  {
    "id": "o-amplitude-startup-scholarship",
    "slug": "amplitude-startup-scholarship",
    "productId": "amplitude",
    "title": "Amplitude Startup Scholarship: one year of the Growth plan free",
    "summary": "Startups with under $10M in funding and fewer than 20 employees can get one year of Amplitude's Growth plan at no cost, with 200,000 monthly tracked users.",
    "description": "Amplitude's Startup Scholarship is a temporary plan that gives qualifying startups one year of the Growth plan at no cost, with an allowance of 200,000 monthly tracked users (MTUs).\n\nTo qualify, a company must have less than $10 million in funding and fewer than 20 employees. Amplitude reviews applications within two business days and contacts applicants by email; accepted startups can use the Growth plan straight away.\n\nThe scholarship cannot be extended past one year. At the end of the year, the startup can upgrade to the paid Growth plan or go back to the Free plan. Amplitude also runs a separate Tech for Black Founders track with higher limits.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "saas-discounts"
    ],
    "audiences": [
      "startups",
      "marketing-tools"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "durationMonths": 12,
      "savingsLabel": "One year of the Growth plan at no cost"
    },
    "claim": {
      "method": "application",
      "note": "Start from amplitude.com/startups; the application appears after you create or sign in to an Amplitude account."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Less than $10 million in funding",
      "Fewer than 20 employees",
      "Both criteria must be met"
    ],
    "redemption": [
      "Go to amplitude.com/startups and choose to join",
      "New users create an Amplitude account; Free plan users sign in to their existing account",
      "Monthly Plus subscribers cancel and wait for the downgrade before applying; annual Plus or Growth customers email scholarship@amplitude.com",
      "Amplitude reviews the application within two business days and replies by email"
    ],
    "terms": [
      "One year of the Growth plan with 200,000 MTUs",
      "No extensions past one year",
      "After the year, upgrade to the Growth plan or return to the Free plan"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Amplitude's official page; live page not checked",
      "note": "Quotes come from search-engine extracts of amplitude.com/startups and Amplitude's docs FAQ (amplitude.com/docs/faq/startup-scholarship-plan); they may be excerpted. A 2020-era Amplitude launch post cited under $5M funding; the current docs cite under $10M. Amplitude also hosts an older 'startups-old' page, so re-check the live startups page wording and the application steps for existing paid subscribers.",
      "evidence": [
        {
          "claim": "One year of Growth at no cost",
          "quote": "The Startup Scholarship is a temporary plan that gives qualifying startups one year of the Growth plan at no cost."
        },
        {
          "claim": "MTU allowance",
          "quote": "You get 200,000 MTUs, more than enough to reach product-market fit."
        },
        {
          "claim": "Eligibility",
          "quote": "To qualify, your company must meet both criteria: Less than $10 million in funding, Fewer than 20 employees"
        },
        {
          "claim": "Review and start",
          "quote": "We'll review your application within two business days, then contact you via email. If you're accepted into a program, you can start using everything in the Growth plan for free immediately."
        },
        {
          "claim": "After one year",
          "quote": "At the end of one year, you'll have the option to either upgrade to the Growth plan or go back to the Free plan."
        }
      ]
    },
    "links": {
      "officialUrl": "https://amplitude.com/startups"
    }
  },
  {
    "id": "o-algolia-startup-program-credits",
    "slug": "algolia-startup-program-credits",
    "productId": "algolia",
    "title": "Algolia Startup Program: up to $10,000 in credits for 12 months",
    "summary": "Young startups that are new to Algolia can get up to USD 10,000 in credits for Algolia's Grow Plan, usable for 12 months from acceptance.",
    "description": "Algolia's Startup Program gives accepted startups the right to use up to USD 10,000 worth of Algolia services under the Grow Plan, at list price.\n\nThe credits can be used for 12 months from the date the startup is accepted, and any unused credits expire after that with no extension. The clock starts at acceptance, not at product launch.\n\nAlgolia's program terms require that the company was incorporated no more than three years before applying, has raised less than USD 5,000,000 in equity funding and is not a previous or existing paid Algolia subscriber. Some versions of Algolia's startup page list looser limits, so check the current criteria before applying.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "audiences": [
      "startups",
      "developers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "creditValue": 10000,
      "durationMonths": 12,
      "savingsLabel": "Up to USD 10,000 in Algolia credits"
    },
    "claim": {
      "method": "application",
      "note": "Apply on Algolia's startups page."
    },
    "requirements": {
      "newCustomersOnly": true,
      "approvalRequired": true
    },
    "eligibility": [
      "Incorporated no more than three years before applying (per the program terms)",
      "Raised less than USD 5,000,000 in equity funding (per the program terms)",
      "Not a previous or existing paid Algolia subscriber",
      "Some Algolia startup pages instead list less than 7 years old and less than $15M raised"
    ],
    "redemption": [
      "Apply on Algolia's startups page",
      "Once accepted, use the credits on Grow Plan services"
    ],
    "terms": [
      "Credits cover Grow Plan services, valued at Algolia's list price",
      "Usable for 12 months from acceptance into the program",
      "Unused credits expire after 12 months, with no extension"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of Algolia's startup program terms (algolia.com/de/policies/startup-program-terms, effective May 27, 2025) and its startups pages; they may be excerpted. Algolia-hosted pages disagree on eligibility: the terms and one industries page say under 3 years and under $5M, while other copies (Spanish page, industries-and-solutions URL) say under 7 years and under $15M. Re-check which criteria are live before marking verified.",
      "evidence": [
        {
          "claim": "Credit amount, plan and validity",
          "quote": "Participants will be granted a right to use up to USD 10,000 worth of Algolia Services available under the Grow Plan based on Algolia's list price during a period of 12 months from the Participant's acceptance to the Program only."
        },
        {
          "claim": "Unused credits expire",
          "quote": "After this 12-month period, any unused Credits will expire without the possibility of an extension."
        },
        {
          "claim": "Eligibility in the terms",
          "quote": "have been incorporated as a legal entity no more than three (3) years prior to their application; have raised less than USD5,000,000 in equity funding; not be a previous or existing paid subscriber of Algolia"
        },
        {
          "claim": "Startup page headline",
          "quote": "$10,000 in Algolia Credits (See Terms)"
        },
        {
          "claim": "Conflicting criteria on other Algolia pages",
          "quote": "Less than 7 years old; Less than $15M in total funding raised"
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://www.algolia.com/industries/startups"
    }
  },
  {
    "id": "o-stripe-atlas-2500-stripe-credits",
    "slug": "stripe-atlas-2500-stripe-credits",
    "productId": "stripe-atlas",
    "title": "Stripe Atlas: $2,500 in Stripe product credits for newly incorporated startups",
    "summary": "Companies incorporated through Stripe Atlas on or after October 16, 2025 get $2,500 in Stripe credits, valid for one year from the incorporation date.",
    "description": "Stripe gives every company incorporated through Stripe Atlas on or after October 16, 2025 $2,500 in Stripe product credits. The credits activate automatically on the day the company is incorporated and are valid for one year from that date.\n\nThe credits show up as a deduction of fees when the company pays out its Stripe balance, and they cannot be moved to another Stripe account. Companies incorporated before October 16, 2025 received a different offer: waived Stripe payment fees on their first $100,000 in revenue for a year.\n\nAtlas itself costs a one-time $500 fee, which covers incorporation and the first year of registered agent service, then $100 a year. Atlas companies also get partner discounts, which Stripe says can change and may carry the partners' own eligibility rules.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "audiences": [
      "startups",
      "businesses"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "creditValue": 2500,
      "durationMonths": 12,
      "savingsLabel": "$2,500 in Stripe product credits"
    },
    "claim": {
      "method": "automatic",
      "note": "Credits activate automatically on the day your Atlas company is incorporated."
    },
    "eligibility": [
      "Company incorporated through Stripe Atlas on or after October 16, 2025",
      "Companies incorporated earlier received waived Stripe payment fees instead"
    ],
    "redemption": [
      "Incorporate your company through Stripe Atlas",
      "Credits activate automatically on incorporation day",
      "Credits are applied as a deduction of fees when you pay out your Stripe balance"
    ],
    "terms": [
      "Valid for 1 year from the incorporation date",
      "Cannot be transferred to another Stripe account",
      "Atlas costs a one-time $500 fee, then $100 a year after the first year",
      "Partner perks are subject to change and to each partner's own eligibility rules"
    ],
    "publishedAt": "2026-10-23",
    "updatedAt": "2026-10-23",
    "status": "published",
    "verification": {
      "status": "verified",
      "method": "Checked against the provider's live official page",
      "note": "Quotes come from search-engine extracts of stripe.com/atlas and Stripe support articles (Atlas Fee Credits FAQ, Waived payments processing fees for Atlas users); they may be excerpted. Re-check which Stripe fees or products the credits can offset on the live FAQ. Partner perk amounts (e.g. AWS, Mercury, Xero) vary by page and region and were not included.",
      "evidence": [
        {
          "claim": "Eligibility and amount",
          "quote": "All Stripe Atlas companies incorporated on or after October 16, 2025 will receive $2,500 in credits."
        },
        {
          "claim": "Automatic, 1-year validity, non-transferable",
          "quote": "These credits are automatically applied to the Atlas account after incorporation, and are valid for 1 year from the incorporation date. Credits cannot be transferred to another Stripe account."
        },
        {
          "claim": "How credits are applied",
          "quote": "you'll see them applied upon paying out your Stripe balance (as a deduction of fees)"
        },
        {
          "claim": "Atlas page wording",
          "quote": "$2,500 in Stripe product credits for use in their first year after incorporation"
        },
        {
          "claim": "Earlier companies got a different offer",
          "quote": "waived fees on Stripe payments for 1 year after incorporation, on your first $100,000 USD in revenue"
        },
        {
          "claim": "Partner offers can change",
          "quote": "Atlas's partners may require your company to satisfy their own eligibility or compliance requirements before offering these benefits."
        }
      ],
      "checkedAt": "2026-10-23"
    },
    "links": {
      "officialUrl": "https://stripe.com/atlas",
      "redeemUrl": "https://support.stripe.com/questions/atlas-fee-credits-faq"
    }
  },
  {
    "id": "o-akamai-cloud-100-dollar-free-credit",
    "slug": "akamai-cloud-100-dollar-free-credit",
    "productId": "akamai-cloud",
    "title": "Akamai Cloud: $100 free credit for 60 days for new customers",
    "summary": "New Akamai Cloud (formerly Linode) customers get a US$100 promotional credit to use within 60 days. A payment method is needed to confirm identity, but Akamai says it won't charge you during the trial.",
    "description": "Akamai's cloud computing service, formerly Linode, gives new customers a US$100 credit to try the platform. Akamai's promotional pages describe it as a 60-day credit.\n\nThe credit can be used on many Compute plans, Object Storage, Block Storage and NodeBalancers; GPU plans are excluded from the promotion. A valid payment method is required to confirm your identity, but Akamai says it won't charge you during the trial. Unused credit expires automatically, and any usage beyond the credit amount is billed at standard rates.",
    "type": "free-credits",
    "categories": [
      "free-credits",
      "free-trials"
    ],
    "audiences": [
      "developers",
      "startups"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 100,
      "savingsLabel": "US$100 credit"
    },
    "claim": {
      "method": "link",
      "note": "Sign up through Akamai's free-credit landing page; the credit is added to the new account."
    },
    "requirements": {
      "cardRequired": true,
      "newCustomersOnly": true
    },
    "eligibility": [
      "New Akamai Cloud customers only"
    ],
    "redemption": [
      "Open Akamai's US$100 credit page",
      "Create an account with an email address or Google or GitHub sign-on",
      "Add a valid payment method to confirm your identity"
    ],
    "terms": [
      "Credit must be used within 60 days",
      "GPU plans are excluded from the promotion",
      "Unused credit expires automatically",
      "Usage above the credit amount is charged at standard rates"
    ],
    "links": {
      "officialUrl": "https://www.akamai.com/lp/free-credit-100"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified. The 60-day window was stated in extracts of Akamai's pricing FAQ and referral pages rather than the landing page itself. The landing page in the search index was about 390 days old.",
      "evidence": [
        {
          "claim": "Credit amount (landing page title)",
          "quote": "Try Akamai Cloud with a US$100 Credit*"
        },
        {
          "claim": "New customers only",
          "quote": "offer valid for new customers only"
        },
        {
          "claim": "Payment method, no charge during trial",
          "quote": "A valid payment method is required to confirm your identity, but we will not charge you during your trial."
        },
        {
          "claim": "GPU exclusion (trial FAQ)",
          "quote": "GPU plans are excluded from this promotion"
        },
        {
          "claim": "Expiry and overage",
          "quote": "Unused service credits will automatically expire, and we will charge you our standard rates for any service over the allotted credit amount"
        },
        {
          "claim": "60-day window (Akamai promo and referral pages, per search extract)",
          "quote": "credits expire 60 days from activation"
        }
      ]
    }
  },
  {
    "id": "o-vultr-digital-startup-program-credits",
    "slug": "vultr-digital-startup-program-credits",
    "productId": "vultr",
    "title": "Vultr Digital Start-up Program: up to $100,000 in cloud credits",
    "summary": "Startups with recent Series A to Series E funding can apply for up to $100,000 in Vultr credit to migrate to Vultr, plus up to 35% in long-term discounts and prioritized support.",
    "description": "The Vultr Digital Start-up Program is for funded startups moving their infrastructure to Vultr. The program page lists up to US$100,000 in free credit to get started on a Vultr migration, up to 35% in long-term Vultr discounts, executive sponsorship, a technical architecture review, dedicated account management and prioritized technical support.\n\nTo qualify, a startup must have secured recent Series A, B, C, D or E financing. Applicants name their senior-most technical executive and senior-most cloud infrastructure leader, share their last 6 months of cloud compute invoices, and agree to be publicly referenceable as a program member. This is separate from the Digital Start-up tier of Vultr's partner program.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "audiences": [
      "startups",
      "developers"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 100000,
      "savingsLabel": "Up to $100,000 (USD) in free credit"
    },
    "claim": {
      "method": "application",
      "note": "Apply on the Vultr Digital Start-up Program page."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Recent Series A, B, C, D or E financing",
      "Name your senior-most technical executive (CTO or equivalent) and senior-most cloud infrastructure leader",
      "Share your last 6 months of cloud compute invoices",
      "Agree to be publicly referenceable as a member of the program"
    ],
    "redemption": [
      "Go to Vultr's Digital Start-up Program page",
      "Submit the application with the requested contacts and invoices",
      "Wait for Vultr's review"
    ],
    "terms": [
      "The credit is meant to get started on a Vultr migration",
      "Long-term discounts of up to 35% are part of the program"
    ],
    "links": {
      "officialUrl": "https://discover.vultr.com/startup-program"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified.",
      "evidence": [
        {
          "claim": "Credit amount",
          "quote": "Up to $100,000 (USD) in free credit to get started on your Vultr migration"
        },
        {
          "claim": "Discounts",
          "quote": "up to 35% in long-term Vultr discounts"
        },
        {
          "claim": "Funding requirement",
          "quote": "Your startup must have secured recent Series A, B, C, D, or E financing to be eligible for the program"
        },
        {
          "claim": "Invoices",
          "quote": "share your last 6 months of cloud compute invoices"
        },
        {
          "claim": "Public reference",
          "quote": "agree to be publicly referenceable as a member of the Vultr Digital Start-up Program"
        }
      ]
    }
  },
  {
    "id": "o-ibm-cloud-200-dollar-credit-30-days",
    "slug": "ibm-cloud-200-dollar-credit-30-days",
    "productId": "ibm-cloud",
    "title": "IBM Cloud: USD 200 credit for 30 days on a new Pay-as-you-go account",
    "summary": "IBM Cloud gives a USD 200 credit to try IBM Cloud products for 30 days. You get it by upgrading to a Pay-as-you-go account, and it is for first-time Pay-as-you-go accounts only.",
    "description": "IBM Cloud's free tier page offers a USD 200 credit to use on IBM Cloud products for 30 days. To receive it, you first upgrade your account to Pay-as-you-go; the credit is only for first-time Pay-as-you-go accounts and can't be used on third-party offerings.\n\nSeparately, a free IBM Cloud account includes more than 40 always-free products with no time limit, which don't depend on the 30-day credit.",
    "type": "free-credits",
    "categories": [
      "free-credits",
      "free-trials"
    ],
    "audiences": [
      "developers",
      "businesses"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 200,
      "savingsLabel": "USD 200 credit"
    },
    "claim": {
      "method": "automatic",
      "note": "Create an IBM Cloud account and upgrade it to Pay-as-you-go to receive the credit."
    },
    "requirements": {
      "newCustomersOnly": true
    },
    "eligibility": [
      "First-time IBM Cloud Pay-as-you-go accounts"
    ],
    "redemption": [
      "Create an IBM Cloud account",
      "Upgrade the account to Pay-as-you-go",
      "Use the credit on IBM Cloud products within 30 days"
    ],
    "terms": [
      "The credit is available for 30 days",
      "Not usable on third-party offerings"
    ],
    "links": {
      "officialUrl": "https://www.ibm.com/products/cloud/free",
      "redeemUrl": "https://cloud.ibm.com/registration"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified. IBM's sign-up page gave conflicting statements on whether a credit card is needed, so cardRequired is left out.",
      "evidence": [
        {
          "claim": "30-day window",
          "quote": "available for 30 days"
        },
        {
          "claim": "Pay-as-you-go upgrade (FAQ)",
          "quote": "To receive the USD 200 credit, you first need to upgrade to a Pay-as-you-go account"
        },
        {
          "claim": "First-time accounts, no third-party offerings (FAQ)",
          "quote": "available for first-time Pay-as-you-go accounts only and cannot be used with third-party offerings"
        },
        {
          "claim": "Always-free products",
          "quote": "access over 40 always-free products without time limits"
        }
      ]
    }
  },
  {
    "id": "o-confluent-cloud-400-dollar-free-trial",
    "slug": "confluent-cloud-400-dollar-free-trial",
    "productId": "confluent-cloud",
    "title": "Confluent Cloud: $400 in free credit for a 30-day trial",
    "summary": "New Confluent Cloud sign-ups get $400 in credit. The free trial ends after 30 days or when the credit is used up, whichever comes first.",
    "description": "Confluent Cloud, Confluent's managed data streaming service built on Apache Kafka, gives new sign-ups $400 in credit. Confluent's billing FAQ says the free trial ends after 30 days or once the $400 credit is used, whichever happens first, and that the trial can't be paused.\n\nYou must add a payment method before creating resources, but it isn't charged until the free trial ends.",
    "type": "free-credits",
    "categories": [
      "free-credits",
      "free-trials"
    ],
    "audiences": [
      "developers",
      "startups",
      "businesses"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 400,
      "savingsLabel": "$400 in credits"
    },
    "claim": {
      "method": "automatic",
      "note": "The credit is applied when you sign up for Confluent Cloud."
    },
    "requirements": {
      "cardRequired": true
    },
    "eligibility": [
      "New Confluent Cloud sign-ups"
    ],
    "redemption": [
      "Sign up on Confluent Cloud's start-for-free page",
      "Add a payment method before creating resources",
      "Use the $400 credit within 30 days"
    ],
    "terms": [
      "The trial ends after 30 days or when the $400 credit is used, whichever happens first",
      "The free trial can't be paused",
      "The payment method isn't charged until the free trial ends"
    ],
    "links": {
      "officialUrl": "https://www.confluent.io/confluent-cloud/tryfree/"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified. Trial terms come from the Confluent Cloud billing FAQ at docs.confluent.io/cloud/current/billing/billing-faq.html. An older Confluent page said no card was required; the newer FAQ is used here.",
      "evidence": [
        {
          "claim": "Credit on sign-up (homepage)",
          "quote": "$400 in credits to start building right away"
        },
        {
          "claim": "Trial length (billing FAQ)",
          "quote": "after 30 days or after you use your $400 USD credit, whichever happens first"
        },
        {
          "claim": "Payment method needed (billing FAQ)",
          "quote": "To create any resources in Confluent Cloud, you must add a payment method."
        },
        {
          "claim": "No charge during trial (billing FAQ)",
          "quote": "Your payment method isn't charged until your free trial ends."
        },
        {
          "claim": "Can't pause (billing FAQ)",
          "quote": "No, you cannot pause the free trial."
        }
      ]
    }
  },
  {
    "id": "o-snowflake-30-day-trial-400-credits",
    "slug": "snowflake-30-day-trial-400-credits",
    "productId": "snowflake",
    "title": "Snowflake: 30-day free trial with $400 in credits",
    "summary": "Snowflake's free trial gives full access to the Snowflake AI Data Cloud with $400 in credits for 30 days. The trial ends when either limit is reached.",
    "description": "Snowflake's trial gives access to the AI Data Cloud with $400 in free credits, for 30 days or until the credits are used, whichever comes first. The trial page also lists a separate option with $40 in free inferences for the Cortex Code CLI.\n\nTo keep using Snowflake after the trial, you add a credit card and convert the account. If you don't convert before the trial expires, the account is suspended and you may lose access to your data. Snowflake's education team says it can't extend trials.",
    "type": "free-credits",
    "categories": [
      "free-credits",
      "free-trials"
    ],
    "audiences": [
      "developers",
      "businesses",
      "startups"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 400,
      "savingsLabel": "$400 in free credits"
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up for a trial account on Snowflake's sign-up page."
    },
    "eligibility": [
      "New Snowflake trial accounts"
    ],
    "redemption": [
      "Go to signup.snowflake.com and create a trial account",
      "To keep the account, add a credit card in Snowsight and convert it before the trial ends"
    ],
    "terms": [
      "The trial lasts 30 days or until $400 of credits is used, whichever comes first",
      "Accounts not converted before the trial expires are suspended",
      "Trials can't be extended by Snowflake's education team"
    ],
    "links": {
      "officialUrl": "https://www.snowflake.com/en/snowflake-trial/",
      "redeemUrl": "https://signup.snowflake.com/"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified. No extract said whether a card is needed to start the trial, so cardRequired is left out.",
      "evidence": [
        {
          "claim": "Credit amount (trial page)",
          "quote": "$400 in free credits"
        },
        {
          "claim": "Trial limit (Snowflake FAQ)",
          "quote": "30 days or $400 in credits (whichever comes first)"
        },
        {
          "claim": "Card after the trial (Snowflake University FAQ)",
          "quote": "if you use up the $400 or 30 days have passed, you will have to enter a credit card to continue"
        },
        {
          "claim": "Suspension if not converted (trial FAQ)",
          "quote": "your account will be suspended and you may lose access to your data"
        },
        {
          "claim": "Cortex Code CLI option (trial page)",
          "quote": "$40 in free inferences"
        }
      ]
    }
  },
  {
    "id": "o-alibaba-cloud-ai-catalyst-program-credits",
    "slug": "alibaba-cloud-ai-catalyst-program-credits",
    "productId": "alibaba-cloud",
    "title": "Alibaba Cloud AI Catalyst Program: up to $120k in credits for AI startups",
    "summary": "AI-first companies founded within the last 10 years can apply for up to $120k in Alibaba Cloud credits and up to 2B free Model Studio tokens. The promotion runs until 31 March 2027.",
    "description": "Alibaba Cloud's AI Catalyst Program supports companies that use AI as their core technology. Selected companies can receive up to US$120k in cloud credits and up to 2 billion free tokens on Model Studio, Alibaba Cloud's model platform, together with support from industry experts, access to AI products and tools, and go-to-market resources.\n\nApplicants must be unlisted, founded within the last 10 years and have an accessible website, and must submit a proposal for how they plan to use Alibaba Cloud and its AI tools. Accounts under resellers or distributors aren't eligible, and acceptance is at Alibaba Cloud's discretion. Credit amounts and validity vary; credits can't be used on domain purchases, CDN, Alibaba Cloud Academy, Alibaba Cloud Marketplace or prepaid products. The startup credit terms say the promotion runs from 1 August 2026 to 31 March 2027.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits",
      "ai-tools"
    ],
    "audiences": [
      "startups",
      "ai-tools",
      "developers"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 120000,
      "savingsLabel": "up to $120k cloud credits support"
    },
    "claim": {
      "method": "application",
      "note": "Apply on the AI Catalyst Program page with a proposal for using Alibaba Cloud."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Uses AI as its core technology to develop its main products or solutions",
      "Unlisted and founded within the last 10 years",
      "Has an accessible website",
      "Submits a proposal for how it will use Alibaba Cloud and its AI tools",
      "Not an account under a reseller or distributor"
    ],
    "redemption": [
      "Go to the AI Catalyst Program page",
      "Submit the application and proposal",
      "Wait for Alibaba Cloud's review"
    ],
    "terms": [
      "Credits can't be applied to domain purchases, CDN, Alibaba Cloud Academy, Alibaba Cloud Marketplace or prepaid products and services",
      "Credit validity varies with the credit amount",
      "The promotion runs from 1 August 2026 to 31 March 2027"
    ],
    "expiresAt": "2027-03-31",
    "links": {
      "officialUrl": "https://www.alibabacloud.com/en/startup"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified. The end date comes from the Startup Cloud Credits Terms & Conditions page (alibabacloud.com/en/startup/terms-and-conditions); confirm it applies to the AI Catalyst Program. Eligibility wording (unlisted, founded within 10 years, accessible website) was paraphrased in the extract, so no verbatim quote is given for it.",
      "evidence": [
        {
          "claim": "Credit amount",
          "quote": "up to $120k cloud credits support"
        },
        {
          "claim": "Model Studio tokens",
          "quote": "up to 2B free Model Studio tokens"
        },
        {
          "claim": "Exclusions",
          "quote": "cannot be applied to domain purchase, CDN, Alibaba Cloud Academy, Alibaba Cloud Marketplace and prepaid products / services"
        },
        {
          "claim": "Credit validity",
          "quote": "Credit validity varies based on the credit amount"
        },
        {
          "claim": "Promotion period (Startup Cloud Credits Terms & Conditions)",
          "quote": "begins on August 1st, 2026 and ends on March 31st, 2027"
        }
      ]
    }
  },
  {
    "id": "o-scaleway-founders-program-credits",
    "slug": "scaleway-founders-program-credits",
    "productId": "scaleway",
    "title": "Scaleway Founders Program: up to €1,000 in cloud credits for young startups",
    "summary": "Startups under 5 years old with fewer than 50 employees that aren't yet Scaleway customers can apply for up to €1,000 in Scaleway cloud credits, valid for 12 months.",
    "description": "The Founders Program is the entry tier of Scaleway's Startup Program, for young projects and startups migrating to Scaleway. It gives up to €1,000 in cloud credits to use over one year on Scaleway's products, with self-serve support only. The credits are valid for 12 months and aren't renewable.\n\nTo qualify, the company must be under 5 years old, have fewer than 50 employees and not already be a Scaleway customer. Scaleway reviews applications in under 21 business days. Startups further along can look at the Early Stage and Growth Stage tiers; the Growth Stage page lists up to €36,000 in credits over a one-year collaboration.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "audiences": [
      "startups",
      "developers"
    ],
    "pricing": {
      "currency": "EUR",
      "creditValue": 1000,
      "durationMonths": 12,
      "savingsLabel": "up to €1,000 in cloud credits"
    },
    "claim": {
      "method": "application",
      "note": "Apply on the Founders Program page."
    },
    "requirements": {
      "approvalRequired": true,
      "newCustomersOnly": true
    },
    "eligibility": [
      "Entity under 5 years old",
      "Fewer than 50 employees",
      "Not an existing Scaleway customer"
    ],
    "redemption": [
      "Go to Scaleway's Founders Program page",
      "Submit the application",
      "Applications are reviewed in under 21 business days"
    ],
    "terms": [
      "Credits are valid for 12 months and aren't renewable",
      "Self-serve support only, with no customer success manager"
    ],
    "links": {
      "officialUrl": "https://www.scaleway.com/en/startup-program/founders-program/"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified. Scaleway's main Startup Program page gave Early Stage figures that differ from the Early Stage page, so no Early Stage amount is listed.",
      "evidence": [
        {
          "claim": "Credit amount and duration",
          "quote": "up to €1,000 in cloud credits to use over one year on our multi-cloud products"
        },
        {
          "claim": "Age limit",
          "quote": "Entity must be under 5 years old"
        },
        {
          "claim": "Headcount",
          "quote": "Fewer than 50 employees"
        },
        {
          "claim": "New customers only",
          "quote": "Must not be an existing customer of Scaleway"
        },
        {
          "claim": "Growth Stage tier",
          "quote": "up to €36,000 in cloud credits"
        }
      ]
    }
  },
  {
    "id": "o-ovhcloud-startup-program-credits",
    "slug": "ovhcloud-startup-program-credits",
    "productId": "ovhcloud",
    "title": "OVHcloud Startup Program: €10,000 in cloud credits, up to €100,000 for scaleups",
    "summary": "OVHcloud's Startup Program gives pre-seed and seed startups €10,000 in free cloud credits for 12 months, and selected Series A-and-later scaleups up to €100,000, plus time with OVHcloud engineers.",
    "description": "OVHcloud's Startup Program has two levels. Start, for pre-seed and seed startups, includes €10,000 of free cloud credits for 12 months, 6 hours of one-to-one time with an engineer, and visibility and access to market and funding. Scale, for selected startups and scaleups funded at Series A or later, includes up to €100,000 of free cloud credits and up to 20 hours with an engineer.\n\nOne application covers both levels and can be sent at any time; OVHcloud says it replies within a week. The program is free, and OVHcloud takes no compensation or equity. Credits are valid for up to 12 months and cover Public Cloud and Hosted Private Cloud. Amounts differ by country site: the US site lists up to $12,000 at Start level and up to $120,000 at Scale level.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "audiences": [
      "startups",
      "developers"
    ],
    "pricing": {
      "currency": "EUR",
      "creditValue": 100000,
      "durationMonths": 12,
      "savingsLabel": "up to €100,000 of free cloud credits"
    },
    "claim": {
      "method": "application",
      "note": "Apply with the Apply button on the OVHcloud country site that matches your business address."
    },
    "requirements": {
      "approvalRequired": true
    },
    "regions": {
      "scope": "global",
      "note": "Apply through the OVHcloud country site for your business address. The US site lists amounts in US dollars ($12,000 Start, $120,000 Scale)."
    },
    "eligibility": [
      "Start: pre-seed and seed startups",
      "Scale: selected startups and scaleups funded at Series A or later"
    ],
    "redemption": [
      "Go to the OVHcloud Startup Program site and check you are on the right country site",
      "Click Apply and submit the single application",
      "OVHcloud says it replies within a week"
    ],
    "terms": [
      "Credits are valid for a maximum of 12 months",
      "Credits cover Public Cloud and Hosted Private Cloud solutions",
      "No compensation or equity is taken"
    ],
    "links": {
      "officialUrl": "https://startup.ovhcloud.com/en/"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified.",
      "evidence": [
        {
          "claim": "Start level credits",
          "quote": "€10,000 of free cloud credits"
        },
        {
          "claim": "Scale level credits",
          "quote": "up to €100,000 of free cloud credits"
        },
        {
          "claim": "Start level audience",
          "quote": "pre-seed & seed startups"
        },
        {
          "claim": "Scale level audience",
          "quote": "selected series-A (and beyond) funded startups and scaleups"
        },
        {
          "claim": "Response time",
          "quote": "We will let you know within a week if you have been accepted"
        },
        {
          "claim": "No equity",
          "quote": "We do not request any form of compensation and will not take any shares in your startup"
        },
        {
          "claim": "Credit validity",
          "quote": "Credits are valid for a maximum of 12 months"
        },
        {
          "claim": "US site amounts",
          "quote": "up to $12,000 of OVHcloud free public cloud credits"
        }
      ]
    }
  },
  {
    "id": "o-civo-250-dollar-free-credit",
    "slug": "civo-250-dollar-free-credit",
    "productId": "civo",
    "title": "Civo: $250 free credit for a one-month trial",
    "summary": "New Civo accounts can claim $250 of free credit for a one-month trial of Civo's cloud, including managed Kubernetes. A payment card must be added to receive the credit.",
    "description": "Civo offers a one-month free trial with $250 in credit, usable against any Civo service. For security and validation, a payment card has to be added to the account to receive the credit, and you have 3 months from sign-up to add one.\n\nOnce issued, the credit expires at the end of the month after the month it was issued. It is non-transferable and has no cash alternative.",
    "type": "free-credits",
    "categories": [
      "free-credits",
      "free-trials"
    ],
    "audiences": [
      "developers",
      "startups"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 250,
      "savingsLabel": "$250 free credit"
    },
    "claim": {
      "method": "automatic",
      "note": "The credit is issued once you sign up and add a payment card."
    },
    "requirements": {
      "cardRequired": true
    },
    "eligibility": [
      "New Civo accounts"
    ],
    "redemption": [
      "Sign up at dashboard.civo.com",
      "Add a payment card within 3 months of sign-up to receive the $250 credit"
    ],
    "terms": [
      "The credit expires at the end of the month after it is issued",
      "Non-transferable, with no cash alternative",
      "Valid against any Civo services"
    ],
    "links": {
      "officialUrl": "https://www.civo.com/",
      "redeemUrl": "https://dashboard.civo.com/signup"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified. A Civo Academy page says no credit card is required to start; Civo's terms say a card is needed to receive the credit, so cardRequired is set to true.",
      "evidence": [
        {
          "claim": "Trial and credit (homepage)",
          "quote": "Free trial – 1 month, $250 free credit."
        },
        {
          "claim": "Card required",
          "quote": "For security and validation purposes, a payment card needs to be added to your Civo account to receive your $250 credit."
        },
        {
          "claim": "Time to claim",
          "quote": "You have 3 months from sign up to add a card to claim your free credit."
        },
        {
          "claim": "Expiry",
          "quote": "it will expire at the end of the month that follows the credit being issued"
        }
      ]
    }
  },
  {
    "id": "o-cockroachdb-cloud-400-dollar-trial-credits",
    "slug": "cockroachdb-cloud-400-dollar-trial-credits",
    "productId": "cockroachdb-cloud",
    "title": "CockroachDB Cloud: $400 in free trial credits for new organizations",
    "summary": "A new CockroachDB Cloud organization starts with $400 in free credits for a 30-day trial. Only the first organization a user signs up for qualifies.",
    "description": "When you sign up for CockroachDB Cloud, Cockroach Labs' managed distributed SQL database, your new organization starts with $400 in free credits; the pricing page describes this as a 30-day free trial.\n\nOnly the first organization a user signs up for gets trial credits, and the offer doesn't apply to organizations billed by invoice.",
    "type": "free-credits",
    "categories": [
      "free-credits",
      "free-trials"
    ],
    "audiences": [
      "developers",
      "startups"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 400,
      "savingsLabel": "$400 in free credits"
    },
    "claim": {
      "method": "automatic",
      "note": "The credits are added to a new organization when you sign up."
    },
    "requirements": {
      "newCustomersOnly": true
    },
    "eligibility": [
      "The first organization a user signs up for",
      "Organizations not billed by invoice"
    ],
    "redemption": [
      "Sign up for CockroachDB Cloud",
      "Create your organization; the trial credits are added to its account"
    ],
    "terms": [
      "30-day free trial",
      "Only the first organization a user signs up for is eligible",
      "Doesn't apply to organizations billed by invoice"
    ],
    "links": {
      "officialUrl": "https://www.cockroachlabs.com/docs/cockroachcloud/free-trial"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified.",
      "evidence": [
        {
          "claim": "Credit amount (docs)",
          "quote": "your new organization's account starts with $400 in free credits"
        },
        {
          "claim": "Trial length (pricing page)",
          "quote": "30-day free trial"
        },
        {
          "claim": "First organization only (docs)",
          "quote": "Only the first organization a user signs up for is eligible for free trial credits."
        },
        {
          "claim": "Invoice-billed organizations excluded (docs)",
          "quote": "The free trial offer does not apply to organizations that are billed by invoice."
        }
      ]
    }
  },
  {
    "id": "o-clickhouse-cloud-startup-offer-5000-credits",
    "slug": "clickhouse-cloud-startup-offer-5000-credits",
    "productId": "clickhouse-cloud",
    "title": "ClickHouse for Startups: $5,000 in ClickHouse Cloud credits for 12 months",
    "summary": "Startups from ClickHouse's partner accelerators and VCs that are under three years old, pre-Series D and new to ClickHouse Cloud can apply for $5,000 in credits for 12 months, plus support and promotion opportunities.",
    "description": "ClickHouse's startup offer gives $5,000 in ClickHouse Cloud credits for 12 months, with support and opportunities for promotion and speaking. It is for startups in one of ClickHouse's partner programs; the list includes Antler, Bessemer, Blackbird, Google for Startups, Lightspeed, Merantix, Station F, TechLeap and Techstars. Companies must be less than three years old, pre-Series D and new to ClickHouse Cloud, and need a verification code from their accelerator, incubator or VC.\n\nTo apply, you start a ClickHouse Cloud trial and then submit the application form with your ClickHouse Organization ID. Under the program agreement, benefits are limited, meeting the criteria doesn't guarantee approval, and a company can receive the benefits only once. Y Combinator companies have a separate offer.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "audiences": [
      "startups",
      "developers"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 5000,
      "durationMonths": 12,
      "savingsLabel": "$5000 in ClickHouse Cloud credits for 12 months"
    },
    "claim": {
      "method": "application",
      "note": "Needs a verification code from a partner accelerator, incubator or VC."
    },
    "requirements": {
      "approvalRequired": true,
      "newCustomersOnly": true
    },
    "eligibility": [
      "Member of a ClickHouse partner program (for example Antler, Bessemer, Google for Startups, Lightspeed, Station F or Techstars)",
      "Less than three years old",
      "Pre-Series D",
      "New to ClickHouse Cloud"
    ],
    "redemption": [
      "Get a verification code from your accelerator, incubator or VC",
      "Sign up for a ClickHouse Cloud trial",
      "Submit the application form with your ClickHouse Organization ID and company details",
      "Wait for approval"
    ],
    "terms": [
      "Credits are valid for 12 months",
      "Availability is limited and approval is at ClickHouse's sole discretion",
      "A company can receive the program benefits only once"
    ],
    "links": {
      "officialUrl": "https://clickhouse.com/startup-offer"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified. The age, stage and partner-list criteria were paraphrased in the extract, so no verbatim quote is given for them. Program agreement: clickhouse.com/legal/agreements/cloud-startup-program.",
      "evidence": [
        {
          "claim": "Credit amount and duration",
          "quote": "$5000 in ClickHouse Cloud credits for 12 months"
        },
        {
          "claim": "Offer summary (clickhouse.com/llms.txt)",
          "quote": "founders can apply for $5000 in ClickHouse Cloud credits, expert training, and promotion opportunities"
        },
        {
          "claim": "Limited availability (program agreement)",
          "quote": "availability of Program Benefits is limited"
        },
        {
          "claim": "No guaranteed approval (program agreement)",
          "quote": "meeting the eligibility criteria does not guarantee approval"
        },
        {
          "claim": "Once per company (program agreement)",
          "quote": "Company is eligible to receive Program Benefits only once"
        }
      ]
    }
  },
  {
    "id": "o-clickhouse-cloud-300-dollar-free-trial",
    "slug": "clickhouse-cloud-300-dollar-free-trial",
    "productId": "clickhouse-cloud",
    "title": "ClickHouse Cloud: $300 in free credits for 30 days, no card needed",
    "summary": "Every new ClickHouse Cloud organization starts with $300 in credits to use over 30 days, and signing up doesn't require a credit card.",
    "description": "New ClickHouse Cloud organizations get $300 in credits to use over 30 days. The trial ends when the credits are used up or the 30 days pass, whichever comes first.\n\nClickHouse's quick-start docs say no credit card is required to sign up. If you add a payment method during the trial, the credits are still used first.",
    "type": "free-credits",
    "categories": [
      "free-credits",
      "free-trials"
    ],
    "audiences": [
      "developers",
      "startups"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 300,
      "savingsLabel": "$300 in credits"
    },
    "claim": {
      "method": "automatic",
      "note": "The credits are added when you create a new ClickHouse Cloud organization."
    },
    "requirements": {
      "cardRequired": false,
      "newCustomersOnly": true
    },
    "eligibility": [
      "New ClickHouse Cloud organizations"
    ],
    "redemption": [
      "Sign up for ClickHouse Cloud and create an organization"
    ],
    "terms": [
      "Credits must be used within 30 days",
      "The trial ends when the credits run out or 30 days pass, whichever comes first"
    ],
    "links": {
      "officialUrl": "https://clickhouse.com/pricing"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified.",
      "evidence": [
        {
          "claim": "Credit amount and window (pricing page)",
          "quote": "$300 in credits to use over 30 days"
        },
        {
          "claim": "No card (quick-start docs)",
          "quote": "no credit card is required to sign up"
        },
        {
          "claim": "Credits used before card (pricing page)",
          "quote": "your credits are still used first"
        }
      ]
    }
  },
  {
    "id": "o-jetbrains-startup-program-50-off",
    "slug": "jetbrains-startup-program-50-off",
    "productId": "jetbrains-ides",
    "title": "JetBrains Startup Program: 50% off IDEs, team tools and JetBrains AI",
    "summary": "Privately owned startups founded within the last five years get 50% off up to 10 IDE subscriptions, 10 team or learning tool subscriptions and 10 JetBrains AI subscriptions over five years.",
    "description": "JetBrains' Startup Program gives eligible startups 50% off commercial subscriptions. The discount covers up to 10 IDE subscriptions, 10 paid team or learning tool subscriptions and 10 JetBrains AI subscriptions over a five-year period, and it expires five years after approval or once the purchase limit is reached.\n\nTo qualify, a company must be privately owned, provide evidence that it was established within the last five years, and have a website or other discoverable online presence. The discount is given once per organization and doesn't extend to subsidiaries. It applies to per-user commercial licences, not floating licences. Startups in JetBrains partner incubators and accelerators have a separate route.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "saas-discounts",
      "software-deals"
    ],
    "audiences": [
      "startups",
      "developers"
    ],
    "pricing": {
      "currency": "USD",
      "durationMonths": 60,
      "savingsLabel": "50% off"
    },
    "claim": {
      "method": "application",
      "note": "Apply with the Startup Discount Plan form."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Privately owned company",
      "Can show it was established within the last five years",
      "Has a website or other discoverable online presence"
    ],
    "redemption": [
      "Go to jetbrains.com/startups",
      "Fill in the Startup Discount Plan form with evidence of your founding date",
      "Buy subscriptions with the approved discount"
    ],
    "terms": [
      "Up to 10 IDE, 10 paid team or learning tool, and 10 JetBrains AI subscriptions over five years",
      "Expires five years after approval or when the purchase limit is reached",
      "Once per organization; not extended to subsidiaries or other companies in the same group",
      "Commercial per-user licences only; not floating licences"
    ],
    "links": {
      "officialUrl": "https://www.jetbrains.com/startups/",
      "redeemUrl": "https://www.jetbrains.com/shop/eform/startup"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified. The 50% figure came from the search extract's summary of the startups page rather than a quoted sentence.",
      "evidence": [
        {
          "claim": "Scope of discount",
          "quote": "purchases of up to 10 IDE subscriptions, 10 paid team or learning tool subscriptions, and 10 JetBrains AI subscriptions over a five-year period"
        },
        {
          "claim": "Eligibility",
          "quote": "Your company is privately owned. You can provide evidence proving that your company was established within the last five years. Your company has a website or other discoverable online presence."
        },
        {
          "claim": "Once per organization",
          "quote": "The Startup Program Discount is provided once per organization and cannot be extended to subsidiaries or other companies within the same organization."
        },
        {
          "claim": "No floating licences",
          "quote": "the Startup Program Discount cannot be applied to floating licenses or other subscription options"
        },
        {
          "claim": "Expiry",
          "quote": "The Startup Program Discount expires five years after the date of your Startup Program Discount approval confirmation or once you have met the limit for discounted purchases"
        }
      ]
    }
  },
  {
    "id": "o-render-startup-program-credits",
    "slug": "render-startup-program-credits",
    "productId": "render",
    "title": "Render Startup Program: $500 Founder credits, larger tiers through VC partners",
    "summary": "Render gives qualified seed-funded startups $500 in Founder credits, with larger credit tiers of $2,500 to $25,000 for startups applying through Render's accelerator and VC partners. Credits are valid for a year.",
    "description": "Render's Startup Program has four tiers. Prototype, the Founder credit offer, gives $500 in credits plus onboarding resources to new customers with at least $25K in seed funding, at Series A or earlier, under four years old and with less than $50M raised. Build gives $2,500 ($5K for select partners) to startups coming through an enrolled partner. Scale gives $10K to startups with under $1M in funding, or $25K with $1M or more, for startups funded by an enrolled top-tier VC and under five years old. An AI tier, with no amount listed, is for startups with at least $2.5M from an enrolled top-tier VC.\n\nBuild, Scale and AI applications go through Render's partners: your accelerator or VC provides a link through its perks program. All credits are valid for one year from approval. Render separately offers up to $10K in migration credits to teams moving production infrastructure.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "audiences": [
      "startups",
      "developers"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 500,
      "durationMonths": 12
    },
    "claim": {
      "method": "application",
      "note": "Build, Scale and AI tiers are applied for through a link from your accelerator or VC partner."
    },
    "requirements": {
      "approvalRequired": true,
      "newCustomersOnly": true
    },
    "eligibility": [
      "Prototype: new customer, at least $25K in seed funding, Series A or earlier, under four years old, less than $50M raised",
      "Build: comes through an enrolled accelerator or VC partner",
      "Scale: funded by an enrolled top-tier VC and under five years old",
      "AI: at least $2.5M in funding from an enrolled top-tier VC"
    ],
    "redemption": [
      "Go to render.com/startups",
      "For Build, Scale or AI, get the application link from your accelerator or VC's perks program",
      "Submit the application and wait for approval"
    ],
    "terms": [
      "All credits are valid for one year from approval",
      "Credit amounts by tier: Prototype $500; Build $2,500 ($5K for select partners); Scale $10K or $25K"
    ],
    "links": {
      "officialUrl": "https://render.com/startups"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified. Tier amounts and criteria were summarised from a table on the page rather than quoted. One extract mentioned a top tier of up to $100,000 that the detailed extract did not show, so no maximum is claimed.",
      "evidence": [
        {
          "claim": "Founder credit offer",
          "quote": "All qualified startups are eligible for our Founder credit offer"
        },
        {
          "claim": "Credit validity",
          "quote": "all credits are valid for 1-year from time of approval"
        },
        {
          "claim": "Partner route",
          "quote": "Your accelerator or VC should have a perks program for portfolio companies and can provide you a link to apply through their program."
        },
        {
          "claim": "Migration credits",
          "quote": "Migrating production infrastructure? Get up to $10K in migration credits."
        }
      ]
    }
  },
  {
    "id": "o-fly-io-startup-credits",
    "slug": "fly-io-startup-credits",
    "productId": "fly-io",
    "title": "Fly.io for Startups: up to $15,000 in credits",
    "summary": "Venture- or accelerator-backed Seed and Series A startups can apply for up to $15,000 in Fly.io credits and a shared Slack channel with the Fly.io team. Credits expire after a year.",
    "description": "Fly.io's startup program gives Seed and Series A startups up to $15,000 in Fly.io credits and a shared Slack channel with the Fly.io team. Companies must be backed by a venture firm or an accelerator and must not have received Fly.io startup credits before; bootstrapped companies aren't eligible, and Fly.io may ask for a short email introduction to your investor or accelerator.\n\nCredits apply to Machines, Sprites, Managed Postgres, volumes and bandwidth, but not to support plans, compliance packages or Machine reservations. They expire one year after being added to your organization. A person reviews each application, and Fly.io replies by email within a week.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "audiences": [
      "startups",
      "developers"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 15000,
      "durationMonths": 12,
      "savingsLabel": "up to $15,000 in Fly.io credits"
    },
    "claim": {
      "method": "application",
      "note": "Apply on the Fly.io for Startups page."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Seed or Series A startups",
      "Backed by a venture firm or an accelerator (bootstrapped companies aren't eligible)",
      "Haven't received Fly.io startup credits before"
    ],
    "redemption": [
      "Apply on fly.io/startups",
      "Be ready to verify funding with a short email introduction to your investor or accelerator",
      "Fly.io replies by email within a week"
    ],
    "terms": [
      "Credits expire one year after they are added to your organization",
      "Credits cover Machines, Sprites, Managed Postgres, volumes and bandwidth",
      "Credits don't cover support plans, compliance packages or Machine reservations"
    ],
    "links": {
      "officialUrl": "https://fly.io/startups/"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified.",
      "evidence": [
        {
          "claim": "Credit amount and Slack channel",
          "quote": "Seed and Series A startups can apply for up to $15,000 in Fly.io credits and a shared Slack channel with the Fly.io team"
        },
        {
          "claim": "Backing requirement",
          "quote": "Startups at the Seed or Series A stage that are backed by a venture firm or an accelerator"
        },
        {
          "claim": "First-time only",
          "quote": "haven't received Fly.io startup credits before"
        },
        {
          "claim": "Expiry",
          "quote": "Credits expire one year after they're added to your organization"
        }
      ]
    }
  },
  {
    "id": "o-temporal-cloud-startup-program-6000-credits",
    "slug": "temporal-cloud-startup-program-6000-credits",
    "productId": "temporal-cloud",
    "title": "Temporal Cloud for Startups: $6,000 in credits for a year",
    "summary": "Funded startups that have raised $30M or less within the last 3 years can get $6,000 in free Temporal Cloud credits for one year on the Business plan.",
    "description": "Temporal's startup program gives eligible companies $6,000 in free Temporal Cloud credits for one year on the Business plan; Temporal estimates this covers up to 10 to 12 months of usage. It is for funded startups that have raised $30M or less, with the funding raised within the last 3 years.\n\nYou need a Temporal Cloud account where you have run your first Workflow, and Temporal says applicants must have active usage to be accepted. Members of Google Cloud for Startups and AWS Activate have separate partner offers with different amounts.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "audiences": [
      "startups",
      "developers"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 6000,
      "durationMonths": 12,
      "savingsLabel": "$6,000 in free credits for 1 year"
    },
    "claim": {
      "method": "application",
      "note": "Apply on Temporal's startup program application page."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Funded startup that has raised $30M or less",
      "Funding raised within the last 3 years",
      "Temporal Cloud account with active usage (first Workflow already run)"
    ],
    "redemption": [
      "Create a Temporal Cloud account and run your first Workflow",
      "Apply at temporal.io/startup/apply",
      "Wait for acceptance"
    ],
    "terms": [
      "Credits are for one year on the Business plan"
    ],
    "links": {
      "officialUrl": "https://temporal.io/startup",
      "redeemUrl": "https://temporal.io/startup/apply"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified. An older Temporal blog post described $2,400 in credits; the current startup page states $6,000.",
      "evidence": [
        {
          "claim": "Credit amount",
          "quote": "$6,000 in free credits for 1 year on our Business Plan"
        },
        {
          "claim": "Funding cap",
          "quote": "funded startups that have raised $30M or less"
        },
        {
          "claim": "Funding recency (FAQ)",
          "quote": "within the last 3 years"
        },
        {
          "claim": "Active usage (apply page)",
          "quote": "startups must have a Temporal Cloud account with active usage in order to be accepted"
        },
        {
          "claim": "Expected coverage (FAQ)",
          "quote": "up to 10 - 12 months of usage"
        }
      ]
    }
  },
  {
    "id": "o-new-relic-for-startups",
    "slug": "new-relic-for-startups",
    "productId": "new-relic",
    "title": "New Relic for Startups: free observability for Series A and earlier startups",
    "summary": "Qualified Series A and earlier startups can apply for free New Relic platform access for five users with a monthly data allowance, all AI features and engineering support.",
    "description": "New Relic relaunched its startup program in June 2026. Accepted startups get free access to the New Relic observability platform for five users with a generous monthly data ingest allowance, all AI features including AI monitoring and the SRE Agent, and direct engineering support.\n\nThe program is for qualified Series A and earlier startups, which can join through a VC or accelerator referral or apply directly. There is no fee to take part, and New Relic accepts or rejects applications at its discretion. Companies that don't qualify can use New Relic's free tier, which includes 100 GB of data ingest a month.",
    "type": "startup",
    "categories": [
      "startup-perks"
    ],
    "audiences": [
      "startups",
      "developers"
    ],
    "pricing": {
      "currency": "USD",
      "savingsLabel": "five users and generous data ingest per month, free"
    },
    "claim": {
      "method": "application",
      "note": "Apply at newrelic.com/startups or through a VC or accelerator referral."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Qualified startups at Series A or earlier"
    ],
    "redemption": [
      "Apply at newrelic.com/startups, or ask your VC or accelerator for a referral",
      "Wait for New Relic's decision"
    ],
    "terms": [
      "No fee to participate",
      "New Relic may accept or reject any application at its sole discretion"
    ],
    "links": {
      "officialUrl": "https://newrelic.com/solutions/industry/startups"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified. The program terms page is dated 2022. An older AWS Activate page listed different criteria (pre-Series B, under 100 employees, under 10 years old); the 2026 launch pages are used here. The length of free access isn't stated.",
      "evidence": [
        {
          "claim": "Benefit (June 2026 press release)",
          "quote": "five users and generous data ingest per month, free"
        },
        {
          "claim": "AI features (press release)",
          "quote": "AI monitoring, SRE Agent and the full AI toolset"
        },
        {
          "claim": "Eligibility (launch blog)",
          "quote": "qualified Series A and earlier startups"
        },
        {
          "claim": "No fee (program terms)",
          "quote": "There is no initial fee to participate in the Program."
        },
        {
          "claim": "Discretion (program terms)",
          "quote": "New Relic may accept or reject any Program application, in its sole discretion"
        }
      ]
    }
  },
  {
    "id": "o-pinecone-for-startups",
    "slug": "pinecone-for-startups",
    "productId": "pinecone",
    "title": "Pinecone for Startups: free Standard tier and Pro Support, plus usage credits",
    "summary": "Startups with fewer than 100 employees at Series A or earlier can apply for free access to Pinecone's Standard tier and Pro Support, plus usage credits and discounts.",
    "description": "Pinecone for Startups supports early-stage companies building AI applications on Pinecone's vector database. Accepted startups get free access to the Standard tier and Pro Support, and also receive usage credits and discounts; the program page doesn't state a credit amount.\n\nTo qualify, a company must have fewer than 100 employees and be at Series A or earlier.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits",
      "ai-tools"
    ],
    "audiences": [
      "startups",
      "developers",
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "savingsLabel": "free access to Pinecone's Standard Tier and Pro Support"
    },
    "claim": {
      "method": "application",
      "note": "Apply on the Pinecone for Startups page."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Fewer than 100 employees",
      "Series A or earlier"
    ],
    "redemption": [
      "Go to the Pinecone for Startups page",
      "Submit the application"
    ],
    "terms": [
      "The credit amount isn't stated on the program page"
    ],
    "links": {
      "officialUrl": "https://www.pinecone.io/startup-program/"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified.",
      "evidence": [
        {
          "claim": "Benefit",
          "quote": "free access to Pinecone's Standard Tier and Pro Support"
        },
        {
          "claim": "Credits and discounts",
          "quote": "usage credits and discounts"
        },
        {
          "claim": "Headcount",
          "quote": "fewer than 100 employees"
        },
        {
          "claim": "Stage",
          "quote": "Series A or earlier"
        }
      ]
    }
  },
  {
    "id": "o-pinecone-standard-trial-300-credits",
    "slug": "pinecone-standard-trial-300-credits",
    "productId": "pinecone",
    "title": "Pinecone Standard trial: $300 in credits for 21 days",
    "summary": "Pinecone organizations can start a 21-day Standard plan trial with $300 in credits and no up-front payment. Each organization gets one trial.",
    "description": "Pinecone's Standard plan trial gives $300 in credits over 21 days, with access to Standard plan features and limits and no up-front payment. Each organization can have only one trial. Organizations already on Standard or Enterprise, or that first subscribed through a marketplace partner, can't start one; organizations on the Starter plan can upgrade to the trial at any time.\n\nWhen the trial ends or the credits run out, quotas are blocked and console access is limited to billing until you add a payment method, upgrade to Enterprise or downgrade to Starter.",
    "type": "free-credits",
    "categories": [
      "free-credits",
      "free-trials",
      "ai-tools"
    ],
    "audiences": [
      "developers",
      "ai-tools",
      "startups"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 300,
      "savingsLabel": "$300 in credits over 21 days"
    },
    "claim": {
      "method": "automatic",
      "note": "Start the Standard trial from the Pinecone console."
    },
    "requirements": {
      "cardRequired": false
    },
    "eligibility": [
      "Organizations not already on Standard or Enterprise",
      "Organizations that didn't first subscribe through a marketplace partner",
      "One trial per organization"
    ],
    "redemption": [
      "Sign in to the Pinecone console (Starter-plan organizations can upgrade at any time)",
      "Start the Standard plan trial"
    ],
    "terms": [
      "The trial lasts 21 days or until the $300 is used",
      "After the trial, quotas are blocked until you add a payment method, upgrade to Enterprise or downgrade to Starter"
    ],
    "links": {
      "officialUrl": "https://docs.pinecone.io/guides/organizations/manage-billing/standard-trial"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified. The 'no up-front payment' and eligibility details were paraphrased in the extract, so they are not quoted.",
      "evidence": [
        {
          "claim": "Credit and length",
          "quote": "$300 in credits over 21 days"
        },
        {
          "claim": "One trial per organization",
          "quote": "Each organization is allowed only one trial"
        },
        {
          "claim": "Starter upgrades (2025 release notes)",
          "quote": "organizations on the Starter plan can now upgrade to a Standard plan trial at any time"
        }
      ]
    }
  },
  {
    "id": "o-aiven-for-startups-credits",
    "slug": "aiven-for-startups-credits",
    "productId": "aiven",
    "title": "Aiven for Startups: $12,000 to $100,000 in credits for 12 months",
    "summary": "Startups founded within seven years, from pre-seed to Series B, can apply for $12,000 to $100,000 in Aiven credits for managed open-source data services, to use over 12 months.",
    "description": "Aiven for Startups gives credits for Aiven's managed data services, from $12,000 up to $100,000, to use over 12 months. The tier depends on the startup's stage of growth and funding, and Aiven added a $12,000 tier for startups not affiliated with its partners.\n\nCompanies must have been founded within the last seven years, have raised external funding from pre-seed to Series B, and provide a company website and business email address. Startups that haven't raised funding can still apply if they're affiliated with an accelerator, incubator or co-working space in Aiven's partner network. The program is for technology companies and isn't open to agencies, consultancies, NGOs or educational institutions. Startup credits can be received only once.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits"
    ],
    "audiences": [
      "startups",
      "developers"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 100000,
      "durationMonths": 12,
      "savingsLabel": "$12,000 up to $100,000 in Aiven credits"
    },
    "claim": {
      "method": "application",
      "note": "Apply on the Aiven for Startups page."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Founded within the last seven years",
      "External funding from pre-seed to Series B, or affiliation with an Aiven partner accelerator, incubator or co-working space",
      "Company website and business email address",
      "Technology companies only; not agencies, consultancies, NGOs or educational institutions"
    ],
    "redemption": [
      "Go to aiven.io/startups",
      "Submit the application"
    ],
    "terms": [
      "Credits are used over 12 months",
      "The credit tier depends on stage of growth and funding",
      "Startup credits can be received only once"
    ],
    "links": {
      "officialUrl": "https://aiven.io/startups"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified.",
      "evidence": [
        {
          "claim": "Credit range and duration",
          "quote": "$12,000 up to $100,000 in Aiven credits to power your data infrastructure over the course of 12 months"
        },
        {
          "claim": "Tier basis",
          "quote": "determined by the stage of growth and funding of your startup"
        },
        {
          "claim": "Unfunded startups",
          "quote": "If you haven't raised funding yet, you can still apply as long as you are affiliated with one of the accelerators, incubators or co-working spaces in our partner network"
        },
        {
          "claim": "Non-partner tier (press release)",
          "quote": "a new $12,000 tier specifically tailored for startups not affiliated with our partners"
        },
        {
          "claim": "Excluded organizations",
          "quote": "is only available to innovative technology companies and at the moment is not open to agencies, consulting companies, NGOs or educational institutions"
        },
        {
          "claim": "Once only",
          "quote": "You can only receive Startup credits once"
        }
      ]
    }
  },
  {
    "id": "o-elastic-cloud-14-day-free-trial",
    "slug": "elastic-cloud-14-day-free-trial",
    "productId": "elastic-cloud",
    "title": "Elastic Cloud: 14-day free trial, no credit card",
    "summary": "Elastic Cloud's 14-day free trial needs no credit card to sign up and covers both Elastic Cloud Serverless and Elastic Cloud Hosted.",
    "description": "Elastic offers a 14-day free trial of Elastic Cloud, its managed Elasticsearch and Elastic Stack service. No credit card is needed to sign up for the initial trial, and the trial includes both Elastic Cloud Serverless and Elastic Cloud Hosted.\n\nTo keep using the service after the trial, you add a credit card or another payment method.",
    "type": "free-trial",
    "categories": [
      "free-trials"
    ],
    "audiences": [
      "developers",
      "businesses"
    ],
    "claim": {
      "method": "automatic",
      "note": "Register with your contact details to start the trial."
    },
    "requirements": {
      "cardRequired": false
    },
    "eligibility": [
      "New Elastic Cloud trial sign-ups"
    ],
    "redemption": [
      "Go to Elastic Cloud's trial sign-up page",
      "Register with your contact details"
    ],
    "terms": [
      "The trial lasts 14 days",
      "A payment method is needed to continue after the trial"
    ],
    "links": {
      "officialUrl": "https://www.elastic.co/cloud/cloud-trial-overview",
      "redeemUrl": "https://www.elastic.co/cloud/elasticsearch-service/signup"
    },
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search-engine extracts of the provider's official page; the live page could not be fetched",
      "note": "Unverified: the provider's site was blocked by this session's network policy, so the live page was not read. Facts and quotes come only from search-engine extracts of the provider's own pages and may be trimmed; re-check them on the live page before marking verified. Trial resource limits differed between an old pricing FAQ and the observability trial page, so none are listed.",
      "evidence": [
        {
          "claim": "Trial length (sign-up page title)",
          "quote": "Sign up for the Elasticsearch Service with a free 14-day Cloud trial"
        },
        {
          "claim": "No card to sign up (trial FAQ)",
          "quote": "no credit card is required to sign up for the initial Elastic Cloud trial"
        },
        {
          "claim": "Payment after the trial (trial FAQ)",
          "quote": "A credit card or other payment methods will be needed if you wish to continue using the service after the trial period ends."
        }
      ]
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-claude-pro-annual-billing-discount",
    "slug": "claude-pro-annual-billing-discount",
    "productId": "claude",
    "title": "Claude Pro billed annually: $17 a month ($200 up front) instead of $20 monthly",
    "summary": "Paying for Claude Pro yearly costs $200 up front, which Anthropic lists as $17 per month, compared with $20 when billed monthly.",
    "description": "Anthropic offers an annual subscription discount on Claude Pro. On the Claude pricing page, Pro is listed at $17 per month with the annual discount, billed as $200 up front, or $20 if billed monthly.\n\nThe discount applies when you choose annual billing for Pro. The Free plan stays at $0, and the higher Max and Ultra plans are listed separately.",
    "type": "discount",
    "categories": [
      "ai-tools",
      "saas-discounts"
    ],
    "audiences": [
      "ai-tools",
      "freelancers",
      "developers"
    ],
    "pricing": {
      "currency": "USD",
      "regularPrice": 20,
      "regularPeriod": "month",
      "dealPrice": 200,
      "period": "year",
      "savingsLabel": "Annual subscription discount"
    },
    "claim": {
      "method": "automatic",
      "note": "Choose annual billing when you upgrade to Pro."
    },
    "eligibility": [
      "Anyone subscribing to Claude Pro who chooses annual billing"
    ],
    "redemption": [
      "Go to claude.com/pricing",
      "Choose the Pro plan and select annual billing",
      "Pay $200 up front for the year"
    ],
    "terms": [
      "$200 is billed up front for the year",
      "Pro costs $20 per month if billed monthly"
    ],
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against Anthropic's official Claude pricing page",
      "evidence": [
        {
          "claim": "Annual price and monthly comparison",
          "quote": "Per month with annual subscription discount ($200 billed up front). $20 if billed monthly."
        },
        {
          "claim": "Headline Pro price",
          "quote": "$17"
        }
      ]
    },
    "links": {
      "officialUrl": "https://claude.com/pricing"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-claude-for-nonprofits-team-plan",
    "slug": "claude-for-nonprofits-team-plan",
    "productId": "claude",
    "title": "Claude for Nonprofits: Team plan at $8 per user a month, or $3 in low- and middle-income countries",
    "summary": "Registered nonprofits, K-12 schools and some mission-based healthcare providers can get Claude's Team plan, including Claude Code, at $8 per user per month, or $3 for nonprofits in low- and middle-income countries.",
    "description": "Anthropic's nonprofit pricing covers the Claude Team plan, which includes Claude and Claude Code. The Nonprofit standard price is $8 per user per month, and Nonprofit access is $3 per user per month for nonprofits based in low- or middle-income countries. For comparison, Claude's pricing page lists a standard Team seat at $20 per seat per month billed annually, or $25 billed monthly.\n\nNonprofit pricing is open to registered 501(c)(3) organizations and their international equivalents, K-12 public and private schools, and certain mission-based healthcare providers such as independent Critical Access Hospitals, Rural Emergency Hospitals, Federally Qualified Health Centers and Rural Health Clinics.\n\nTeam plans cover 2 to 150 seats. Team customers verify their status through Goodstack in about two to three minutes and get an email to finish setup with the discount applied. Larger organizations on Enterprise are verified by Anthropic's nonprofit sales team.",
    "type": "discount",
    "categories": [
      "ai-tools",
      "saas-discounts"
    ],
    "audiences": [
      "businesses",
      "ai-tools",
      "office-tools"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 8,
      "period": "month"
    },
    "claim": {
      "method": "verification",
      "note": "Team plan: verify nonprofit status with Goodstack. Enterprise: verified by Anthropic's nonprofit sales team."
    },
    "requirements": {
      "approvalRequired": true
    },
    "regions": {
      "scope": "global",
      "note": "Open to registered 501(c)(3) organizations and their international equivalents; the $3 price is for nonprofits based in low- or middle-income countries."
    },
    "eligibility": [
      "Registered 501(c)(3) organizations and their international equivalents",
      "K-12 public and private schools",
      "Certain mission-based healthcare providers, including independent Critical Access Hospitals, Rural Emergency Hospitals, Federally Qualified Health Centers and Rural Health Clinics",
      "The $3 Nonprofit access price is for nonprofits based in low- or middle-income countries"
    ],
    "redemption": [
      "Go to claude.com/solutions/nonprofits",
      "For the Team plan, complete the Goodstack nonprofit verification (about 2-3 minutes)",
      "Once approved, follow the emailed link to finish setup with the discount applied",
      "For Enterprise, contact Anthropic's nonprofit sales team"
    ],
    "terms": [
      "Team plan covers 2-150 seats, with a minimum of 2 seats",
      "Prices are per user per month",
      "Enterprise nonprofit pricing is set during the sales process"
    ],
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against Anthropic's official Claude for Nonprofits page",
      "note": "The nonprofit page lists per-user prices but no percentage discount; the standard Team seat price ($20 annual / $25 monthly) comes from claude.com/pricing.",
      "evidence": [
        {
          "claim": "Nonprofit standard price",
          "quote": "Nonprofit standard / $8/user / Per month"
        },
        {
          "claim": "Nonprofit access price",
          "quote": "$3/user / Per month. For nonprofits based in low- or middle-income countries"
        },
        {
          "claim": "Eligibility",
          "quote": "Nonprofit pricing is open to registered 501(c)(3) organizations and their international equivalents"
        },
        {
          "claim": "Schools",
          "quote": "as well as K-12 public and private schools."
        },
        {
          "claim": "Healthcare providers",
          "quote": "Certain mission-based healthcare providers are also eligible, including independent Critical Access Hospitals,"
        },
        {
          "claim": "Team verification",
          "quote": "Team plan customers complete a quick (~2-3 minute) verification through our partner Goodstack."
        },
        {
          "claim": "Seat range",
          "quote": "Organizations with up to 150 seats can get started now by verifying nonprofit status with Goodstack."
        },
        {
          "claim": "Minimum seats",
          "quote": "Minimum 2 seats"
        },
        {
          "claim": "Enterprise verification",
          "quote": "Enterprise customers are verified directly by our nonprofit sales team during the sales process."
        },
        {
          "claim": "Setup",
          "quote": "Once approved, you’ll get an email to finish setup with the discount already applied."
        },
        {
          "claim": "Includes Claude Code",
          "quote": "Includes Claude and Claude Code"
        },
        {
          "claim": "Standard Team seat price (pricing page)",
          "quote": "Per seat / month if billed annually. $25 if billed monthly."
        }
      ]
    },
    "links": {
      "officialUrl": "https://claude.com/solutions/nonprofits"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-claude-for-open-source-6-months-ultra",
    "slug": "claude-for-open-source-6-months-ultra",
    "productId": "claude",
    "title": "Claude for Open Source: 6 months of Claude Ultra free for eligible maintainers and contributors",
    "summary": "Open-source maintainers and contributors who meet one of Anthropic's criteria can apply for six months of Claude Ultra, the $200-a-month plan, at no cost.",
    "description": "Anthropic's Claude for Open Source program gives eligible open-source maintainers and contributors six months of Claude Ultra on Anthropic. Ultra is listed at $200 per month on Claude's pricing page.\n\nYou qualify if you meet any one of the criteria: you maintain packages others build on (500 or more dependent repos, 100 or more dependent packages, or 200,000 or more combined monthly downloads), you're a listed committer or maintainer on a recognized foundation or language project, you've had 100 or more pull requests merged into repos you don't own in the last 12 months, one of your repos has had 20 or more unique external contributors in the last 12 months, or a repo you maintain has an OpenSSF criticality score of 0.4 or above. If you maintain something the ecosystem quietly depends on but don't fit the list, Anthropic asks you to apply anyway.\n\nAfter six months, a previous paid plan resumes at your prior plan and rate unless you cancel; otherwise the account returns to the free plan.",
    "type": "free-plan",
    "categories": [
      "ai-tools",
      "open-source"
    ],
    "audiences": [
      "developers",
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "regularPrice": 200,
      "regularPeriod": "month",
      "dealPrice": 0,
      "period": "month",
      "durationMonths": 6,
      "savingsLabel": "6 months of Claude Ultra on us"
    },
    "claim": {
      "method": "application",
      "note": "Apply from the Claude for Open Source page."
    },
    "eligibility": [
      "Maintain packages others build on: 500 or more dependent repos, 100 or more dependent packages, or 200,000 or more combined monthly downloads",
      "Or be a listed committer or maintainer on a recognized foundation or language project (for example CPython or the Rust team)",
      "Or have authored 100 or more pull requests merged into repos you don't own in the last 12 months",
      "Or have a repo with 20 or more unique external contributors with merged pull requests in the last 12 months",
      "Or maintain a repo with an OpenSSF criticality score of 0.4 or above",
      "Maintainers of something the ecosystem depends on who don't fit the list are invited to apply and explain"
    ],
    "redemption": [
      "Go to the Claude for Open Source page",
      "Click Apply now and describe what you maintain or contribute to",
      "If accepted, Claude Ultra is applied to your account for six months"
    ],
    "terms": [
      "The free Claude Ultra subscription lasts six months",
      "If you had a paid plan, it resumes at your prior plan and rate unless you cancel; otherwise the account returns to the free plan",
      "Program terms and conditions apply"
    ],
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against Anthropic's official Claude for Open Source page",
      "note": "No application deadline or recipient cap is stated on the page.",
      "evidence": [
        {
          "claim": "Offer",
          "quote": "Thank you for everything you ship. 6 months of Claude Ultra on us."
        },
        {
          "claim": "Package maintainers",
          "quote": "You maintain packages that others build on: 500 or more dependent repos, 100 or more dependent packages"
        },
        {
          "claim": "Foundation maintainers",
          "quote": "You're a listed committer or maintainer on a recognized foundation or language project: CPython, Rust team"
        },
        {
          "claim": "Active contributors",
          "quote": "You've authored 100 or more pull requests merged into repos you don't own in the last 12 months"
        },
        {
          "claim": "Community builders",
          "quote": "One of your repos has had 20 or more unique external contributors with merged pull requests in the last 12 months"
        },
        {
          "claim": "Download threshold",
          "quote": "200,000 or more combined monthly downloads"
        },
        {
          "claim": "Critical infrastructure",
          "quote": "Any repo you maintain has an OpenSSF criticality score of 0.4 or above"
        },
        {
          "claim": "Apply anyway",
          "quote": "If you maintain something the ecosystem quietly depends on, apply anyway and tell us about it."
        },
        {
          "claim": "After six months",
          "quote": "If you had a paid plan, it resumes at your prior plan and rate unless you cancel;"
        },
        {
          "claim": "Return to free",
          "quote": "otherwise your account returns to the free plan."
        },
        {
          "claim": "Ultra list price (pricing page)",
          "quote": "$200 Per month"
        }
      ]
    },
    "links": {
      "officialUrl": "https://claude.com/contact-sales/claude-for-oss"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-claude-team-plan-for-scientists",
    "slug": "claude-team-plan-for-scientists",
    "productId": "claude",
    "title": "Claude Team plan for scientists: free standard seats for 12 months for academic and nonprofit labs",
    "summary": "Principal investigators at universities and nonprofit research institutes can set up a Claude Team plan where standard seats are free and premium seats cost $15 a month for the first 12 months.",
    "description": "Anthropic's Claude Team plan for scientists gives research groups promotional pricing for 12 months from sign-up: standard seats are free (regularly $20 a month) and premium seats, with 5x usage limits, are $15 a month (regularly $100). Anthropic announced it on August 27, 2026 with an initial 10,000 seats for scientists around the world and said it intends to extend the program beyond that.\n\nThe plan is for principal investigators or the equivalent at accredited universities and nonprofit research institutes. The PI verifies their institutional affiliation, briefly describes the research, and then adds lab members. Groups can have 1-25 seats; larger groups should contact Anthropic. For-profit companies, contract research organizations and industry R&D teams are directed to the regular Team and Enterprise plans.\n\nAfter 12 months, seats renew at the then-current price for the plan, and groups with no activity for 90 days may be returned to standard Team pricing.",
    "type": "discount",
    "categories": [
      "ai-tools",
      "saas-discounts"
    ],
    "audiences": [
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "regularPrice": 20,
      "regularPeriod": "month",
      "dealPrice": 0,
      "period": "month",
      "durationMonths": 12,
      "savingsLabel": "Standard seats are free"
    },
    "claim": {
      "method": "verification",
      "note": "Use Verify now on the program page to confirm institutional affiliation; final pricing is confirmed after verification."
    },
    "requirements": {
      "approvalRequired": true
    },
    "regions": {
      "scope": "global",
      "note": "Anthropic describes the seats as open to scientists around the world; no country list is given."
    },
    "eligibility": [
      "Principal investigators (PIs) or equivalent at accredited universities and nonprofit research institutes",
      "Not for for-profit companies, contract research organizations or industry R&D teams",
      "1-25 seats per group; larger groups contact Anthropic"
    ],
    "redemption": [
      "Go to the Claude Team plan for scientists page and click Verify now",
      "Confirm your institutional affiliation and briefly describe your research",
      "Once verified, add the researchers in your lab to the plan"
    ],
    "terms": [
      "Promotional pricing applies for 12 months from sign-up",
      "Premium seats (5x usage limits) are $15 per month during the promotion",
      "After 12 months, seats renew at the then-current price for this plan",
      "Groups with no activity for 90 days may be returned to standard Team pricing",
      "Limited availability; final pricing is confirmed after verification at sign-up; terms apply"
    ],
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against Anthropic's official program page and announcement",
      "evidence": [
        {
          "claim": "Standard seats free",
          "quote": "Standard seats are free."
        },
        {
          "claim": "Premium seat price",
          "quote": "Premium seats are $15 per month."
        },
        {
          "claim": "Regular prices",
          "quote": "regularly $20/month ... regularly $100/month"
        },
        {
          "claim": "Duration",
          "quote": "Promotional pricing applies for 12 months from sign-up, and to charges after that date."
        },
        {
          "claim": "Renewal",
          "quote": "After 12 months, seats renew at the then-current price for this plan."
        },
        {
          "claim": "Inactivity",
          "quote": "If a group has no activity for 90 days, we may return it to standard Team pricing"
        },
        {
          "claim": "Eligibility",
          "quote": "Principal investigators (PIs) or equivalent at accredited universities and nonprofit research institutes"
        },
        {
          "claim": "Not for industry",
          "quote": "If you are a for-profit company, contract research organization, or industry R&D team, please see"
        },
        {
          "claim": "Group size",
          "quote": "1–25 seats per group; contact us for larger groups."
        },
        {
          "claim": "Verification",
          "quote": "You'll confirm your institutional affiliation and tell us briefly about your research."
        },
        {
          "claim": "Limited availability",
          "quote": "Limited availability, final pricing confirmed after verification at sign up; terms apply."
        },
        {
          "claim": "Seats announced (Aug 27, 2026 post)",
          "quote": "opening 10,000 seats for scientists around the world"
        },
        {
          "claim": "Premium usage (announcement)",
          "quote": "Standard seats will be free and premium seats with 5x usage limits will be available for $15 per month."
        }
      ]
    },
    "links": {
      "officialUrl": "https://claude.com/programs/team-plan-for-scientists"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-anthropic-ai-for-science-api-credits",
    "slug": "anthropic-ai-for-science-api-credits",
    "productId": "claude-developer-platform",
    "title": "Anthropic AI for Science: free Claude API credits for research projects",
    "summary": "Researchers at academic and nonprofit institutions can apply for free Claude API credits for high-impact scientific projects; Anthropic reviews applications monthly.",
    "description": "Anthropic's AI for Science program gives free Claude API credits to researchers attached to research institutions who work on scientific topics Anthropic considers high priority. Anthropic's help center says successful applicants get up to $20,000 in API credits for a six-month period, while its August 27, 2026 announcement says researchers can apply for up to $50,000 in credits per project.\n\nApplications are reviewed by Anthropic's team, including subject-matter experts, and evaluated on the first Monday of each month. Selection looks at scientific merit and potential impact, and proposals go through biosecurity screening.\n\nThe credits are for API use only; they don't apply to the Claude web app and don't give access to non-standard or non-public models.",
    "type": "free-credits",
    "categories": [
      "ai-tools",
      "free-credits"
    ],
    "audiences": [
      "developers",
      "ai-tools"
    ],
    "claim": {
      "method": "application",
      "note": "Apply through the AI for Science application form linked from Anthropic's help center article."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Researchers attached to research institutions, in academia or nonprofit organizations",
      "Research on scientific topics Anthropic considers high priority",
      "Proposals pass Anthropic's biosecurity screening"
    ],
    "redemption": [
      "Read the AI for Science program article in Anthropic's help center",
      "Complete the application form with details about your team and research project",
      "Anthropic evaluates submissions on the first Monday of each month; if successful, credits are applied to your account"
    ],
    "terms": [
      "Help center: up to $20,000 in API credits for a six-month period (the August 2026 announcement says up to $50,000 per project)",
      "Credits are for API use and do not apply to the Claude web app",
      "No access to non-standard or non-public models"
    ],
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against Anthropic's official help center article and announcements",
      "note": "Anthropic's pages disagree on the maximum: the help center article (dated March 16, 2026) says up to $20,000 for six months; the August 27, 2026 'expanding support for scientists' post says up to $50,000 per project. No creditValue is set until Anthropic aligns them.",
      "evidence": [
        {
          "claim": "Credit amount (help center, March 2026)",
          "quote": "If successful, we will apply up to $20,000 in API credits to your account for a 6-month period."
        },
        {
          "claim": "Credit amount (announcement, Aug 27, 2026)",
          "quote": "apply to our AI for Science program for up to $50,000 in credits per project."
        },
        {
          "claim": "Eligibility",
          "quote": "The AI for Science program is designed for researchers attached to research institutions"
        },
        {
          "claim": "Who can apply (announcement)",
          "quote": "Any researcher is eligible to apply."
        },
        {
          "claim": "How to apply",
          "quote": "Please complete the following application form with details about your team and research project"
        },
        {
          "claim": "Review schedule",
          "quote": "We evaluate submissions on the first Monday of each month."
        },
        {
          "claim": "Review by team",
          "quote": "Applications will be reviewed by our team, including subject matter experts in relevant fields."
        },
        {
          "claim": "API only",
          "quote": "Note that these credits are for API use and do not apply to the Claude web app."
        },
        {
          "claim": "Model access",
          "quote": "This program does not provide access to non-standard or non-public models."
        },
        {
          "claim": "Biosecurity screening",
          "quote": "Biosecurity screening: ensuring proposed research could not enable harmful applications"
        }
      ]
    },
    "links": {
      "officialUrl": "https://support.claude.com/en/articles/11199177-anthropic-s-ai-for-science-program"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-modal-starter-30-free-compute-monthly",
    "slug": "modal-starter-30-free-compute-monthly",
    "productId": "modal",
    "title": "Modal Starter plan: $30 of free compute every month",
    "summary": "Modal's Starter plan has no base fee and includes $30 of free compute each month for GPUs and CPUs, with usage above that billed pay-as-you-go.",
    "description": "Modal's Starter plan costs $0 plus compute and includes $30 of free compute credits every month. It comes with 3 workspace seats, 100 containers and 10 concurrent GPUs.\n\nUsage beyond the monthly free amount is billed per second, pay-as-you-go, without pre-purchasing compute. The free allotment doesn't apply to Shared Endpoints, which are billed per token. Modal's paid Team plan ($250 plus compute a month) includes $100 of monthly credits.",
    "type": "free-plan",
    "categories": [
      "ai-tools",
      "free-credits"
    ],
    "audiences": [
      "developers",
      "ai-tools",
      "startups"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "period": "month",
      "creditValue": 30
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up for Modal; the Starter plan's monthly free compute applies automatically."
    },
    "eligibility": [
      "Any Modal account on the Starter plan"
    ],
    "redemption": [
      "Sign up at modal.com",
      "Stay on the Starter plan",
      "Run workloads; the first $30 of compute each month is free"
    ],
    "terms": [
      "$30 of free compute per month on the Starter plan",
      "Usage beyond the free amount is billed pay-as-you-go",
      "The free allotment does not apply to Shared Endpoints, which are billed per token",
      "Starter includes 3 workspace seats, 100 containers and 10 GPU concurrency"
    ],
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Modal's official pricing page; live page not checked",
      "note": "The live page could not be fetched from the research environment (the host is not on the session's allowed network list), so the quotes below are search-engine extracts of the provider's own pages and may be shortened. Re-check the live page before publishing as verified.",
      "evidence": [
        {
          "claim": "Starter price",
          "quote": "$0 + compute / month"
        },
        {
          "claim": "Monthly free compute",
          "quote": "$30 of free compute per month"
        },
        {
          "claim": "Plan limits",
          "quote": "3 workspace seats, 100 containers, 10 GPU concurrency"
        },
        {
          "claim": "Shared Endpoints excluded",
          "quote": "does not apply to Shared Endpoints"
        },
        {
          "claim": "Team plan",
          "quote": "$250 + compute"
        }
      ]
    },
    "links": {
      "officialUrl": "https://modal.com/pricing"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-modal-for-startups-credits",
    "slug": "modal-for-startups-credits",
    "productId": "modal",
    "title": "Modal for Startups: free compute credits for VC-backed startups",
    "summary": "Early-stage startups new to Modal that have raised from Modal's partner VCs, or more than $1M from any fund, can apply for a one-time grant of free compute credits.",
    "description": "Modal's startup program gives free compute credits to early-stage companies. The Seed to Series A tier is for startups new to Modal that have raised any amount from a VC in Modal's partner network, or more than $1M from any fund. A separate tier for companies that have raised over $30M or are past Series B (with a partner-network VC) is custom for rapidly growing AI-native companies.\n\nCredits are a one-time grant, and you can't reapply once you've received credits in a given tier. Modal also says startups in AWS Activate can unlock additional Modal credits. Credit amounts depend on the tier and approval.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits",
      "ai-tools"
    ],
    "audiences": [
      "startups",
      "developers",
      "ai-tools"
    ],
    "claim": {
      "method": "application",
      "note": "Apply on Modal's startups page."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Startups new to Modal",
      "Seed to Series A: raised any amount of VC from Modal's partner network, or more than $1M from any fund",
      "Scaling tier: raised over $30M or past Series B, with a VC in Modal's partner network"
    ],
    "redemption": [
      "Go to modal.com/startups",
      "Submit the application with your funding details",
      "If approved, credits are added to your Modal workspace"
    ],
    "terms": [
      "Credits are a one-time grant; you may not reapply once you have received credits in a given tier",
      "Credit amounts vary by tier and approval",
      "AWS Activate members may unlock additional Modal credits"
    ],
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Modal's official startups and pricing pages; live pages not checked",
      "note": "The live page could not be fetched from the research environment (the host is not on the session's allowed network list), so the quotes below are search-engine extracts of the provider's own pages and may be shortened. Re-check the live page before publishing as verified. Modal's page does not publish a fixed credit amount, so none is set.",
      "evidence": [
        {
          "claim": "Program label",
          "quote": "Free credits for rising startups"
        },
        {
          "claim": "Pricing page mention",
          "quote": "Early-stage startups can get free compute credits on Modal"
        },
        {
          "claim": "Seed to Series A eligibility",
          "quote": "raised any amount of VC from Modal's partner network, or more than $1M from any fund"
        },
        {
          "claim": "Scaling tier",
          "quote": "Custom for rapidly growing AI-native companies"
        },
        {
          "claim": "One-time grant",
          "quote": "Credits are a one-time grant and you may not reapply once you have received credits in a given tier"
        }
      ]
    },
    "links": {
      "officialUrl": "https://modal.com/startups"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-groqcloud-free-plan",
    "slug": "groqcloud-free-plan",
    "productId": "groqcloud",
    "title": "GroqCloud Free plan: try the Groq API at $0 within free-tier rate limits",
    "summary": "GroqCloud's Free plan lets anyone build and test with the Groq API at no cost, with usage capped by organization-level rate limits.",
    "description": "Groq lists a Free plan at $0 on GroqCloud, described as great for anyone to get started with its APIs, with build-and-test access and community support.\n\nUsage on the Free plan is capped by rate limits (requests and tokens per minute and per day), which apply to the whole organization rather than to individual users. Your organization's exact limits are shown on the Limits page in the GroqCloud console. Spend limits and higher rate limits are only on the paid Developer tier.",
    "type": "free-plan",
    "categories": [
      "ai-tools",
      "free-credits"
    ],
    "audiences": [
      "developers",
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "link",
      "note": "Sign up at console.groq.com and create an API key."
    },
    "eligibility": [
      "Anyone who signs up for a GroqCloud account"
    ],
    "redemption": [
      "Go to console.groq.com and sign up",
      "Create an API key",
      "Check your organization's limits under Settings > Limits"
    ],
    "terms": [
      "Usage is capped by Free-tier rate limits",
      "Rate limits apply at the organization level, not per user",
      "Spend limits are only available on paid plans"
    ],
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Groq's official console billing and rate-limit pages; live pages not checked",
      "note": "The live page could not be fetched from the research environment (the host is not on the session's allowed network list), so the quotes below are search-engine extracts of the provider's own pages and may be shortened. Re-check the live page before publishing as verified. Groq does not publish free-tier numbers on a public page; limits vary by model and are shown in the console.",
      "evidence": [
        {
          "claim": "Free plan",
          "quote": "Great for anyone to get started with our APIs"
        },
        {
          "claim": "Organization-level limits",
          "quote": "Rate limits apply at the organization level, not individual users"
        },
        {
          "claim": "Where limits are shown",
          "quote": "you can view the current, exact rate limits for your organization on the limits page in your account settings"
        }
      ]
    },
    "links": {
      "officialUrl": "https://console.groq.com/docs/rate-limits",
      "redeemUrl": "https://console.groq.com"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-pinecone-starter-free-plan",
    "slug": "pinecone-starter-free-plan",
    "productId": "pinecone",
    "title": "Pinecone Starter: free serverless vector database with 2 GB storage",
    "summary": "Pinecone's Starter plan is free and includes up to 2 GB of serverless storage, 2M write units and 1M read units per month.",
    "description": "Pinecone's Starter plan is a free tier of its managed vector database. It includes up to 2 GB of storage, 2 million write units and 1 million read units per month, with the write and read quotas resetting monthly.\n\nStarter is limited to one project, five serverless indexes in AWS us-east-1, five assistants and two members. Pinecone Assistant file storage is free up to 1 GB per organization on Starter.",
    "type": "free-plan",
    "categories": [
      "ai-tools",
      "free-credits"
    ],
    "audiences": [
      "developers",
      "ai-tools",
      "startups"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "period": "month"
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up for Pinecone; new organizations start on Starter."
    },
    "eligibility": [
      "Anyone who creates a Pinecone account"
    ],
    "redemption": [
      "Sign up at pinecone.io",
      "Create a serverless index on the Starter plan"
    ],
    "terms": [
      "Up to 2 GB storage, 2M write units and 1M read units per month",
      "1 project, 5 serverless indexes in AWS us-east-1, 5 assistants and 2 members",
      "Upgrade to a paid plan for more capacity, regions and members"
    ],
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Pinecone's official pricing page, docs and blog; live pages not checked",
      "note": "The live page could not be fetched from the research environment (the host is not on the session's allowed network list), so the quotes below are search-engine extracts of the provider's own pages and may be shortened. Re-check the live page before publishing as verified. The search index's copy of the pricing page was old, so the Starter limits should be re-checked.",
      "evidence": [
        {
          "claim": "Starter allowances (blog)",
          "quote": "2GB of storage, 2M Write Units, and 1M Read Units per month"
        },
        {
          "claim": "Starter allowances (pricing)",
          "quote": "up to 2 GB storage, 2M write units, and 1M read units per month"
        },
        {
          "claim": "Starter limits (docs)",
          "quote": "1 project, 5 serverless indexes in AWS us-east-1, 5 assistants, and 2 members"
        },
        {
          "claim": "Assistant storage (docs)",
          "quote": "free up to 1 GB per org"
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.pinecone.io/pricing/"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-qdrant-cloud-free-tier-1gb-cluster",
    "slug": "qdrant-cloud-free-tier-1gb-cluster",
    "productId": "qdrant-cloud",
    "title": "Qdrant Cloud free tier: a 1 GB vector search cluster, free forever, no credit card",
    "summary": "Qdrant Cloud's free tier gives you a single-node cluster with 1 GB RAM, 0.5 vCPU and 4 GB disk, with no credit card needed.",
    "description": "Qdrant Cloud offers a free-forever cluster for testing and prototyping. It's a single node with 1 GB of RAM, 0.5 vCPU and 4 GB of disk, which Qdrant says is enough for about 1M vectors of 768 dimensions. You don't need a credit card to sign up.\n\nThe free cluster has no high availability, and backups aren't available (only manual snapshots and restores through the API). Unused free clusters are suspended after a week of inactivity and deleted after four weeks.",
    "type": "free-plan",
    "categories": [
      "ai-tools",
      "open-source"
    ],
    "audiences": [
      "developers",
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Create a free cluster in the Qdrant Cloud console."
    },
    "requirements": {
      "cardRequired": false
    },
    "eligibility": [
      "Anyone with a Qdrant Cloud account"
    ],
    "redemption": [
      "Sign up for Qdrant Cloud",
      "Create a cluster and choose the free tier",
      "Pick an AWS, Google Cloud or Azure region"
    ],
    "terms": [
      "Single node: 1 GB RAM, 0.5 vCPU, 4 GB disk",
      "No high availability; no backups (manual snapshots only)",
      "Suspended after a week of inactivity and deleted after four weeks of inactivity"
    ],
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Qdrant's official pricing page and cloud docs; live pages not checked",
      "note": "The live page could not be fetched from the research environment (the host is not on the session's allowed network list), so the quotes below are search-engine extracts of the provider's own pages and may be shortened. Re-check the live page before publishing as verified.",
      "evidence": [
        {
          "claim": "Free forever",
          "quote": "free forever"
        },
        {
          "claim": "No card",
          "quote": "you don't need a credit card to join"
        },
        {
          "claim": "Resources",
          "quote": "1 GB RAM, 0.5 vCPU, and 4 GB disk"
        },
        {
          "claim": "Capacity",
          "quote": "about 1 M vectors of 768 dimensions"
        },
        {
          "claim": "Limitations",
          "quote": "The Free Tier is ideal for testing, and prototypes being limited to 1GB RAM and 4GB disk without high availability"
        }
      ]
    },
    "links": {
      "officialUrl": "https://qdrant.tech/pricing/"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-cloudflare-workers-ai-10000-free-neurons-daily",
    "slug": "cloudflare-workers-ai-10000-free-neurons-daily",
    "productId": "cloudflare-workers-ai",
    "title": "Cloudflare Workers AI: 10,000 Neurons a day free",
    "summary": "Workers AI includes 10,000 Neurons per day at no charge on both the Workers Free and Workers Paid plans; usage above that costs $0.011 per 1,000 Neurons.",
    "description": "Cloudflare's Workers AI lets you run open models, from LLMs to image and speech models, on Cloudflare's network. Every account gets 10,000 Neurons per day at no charge, on both the Workers Free and Workers Paid plans. Neurons are Cloudflare's unit for AI compute; each model's price is listed in Neurons and tokens.\n\nOn the Workers Paid plan (from $5 a month), usage beyond the free daily allocation is billed at $0.011 per 1,000 Neurons. Some resource-intensive models are only available on the Paid plan.",
    "type": "free-plan",
    "categories": [
      "ai-tools",
      "free-credits"
    ],
    "audiences": [
      "developers",
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Available on any Cloudflare account using Workers AI."
    },
    "eligibility": [
      "Any Cloudflare account on the Workers Free or Workers Paid plan"
    ],
    "redemption": [
      "Sign in to the Cloudflare dashboard",
      "Call a Workers AI model from a Worker or the REST API"
    ],
    "terms": [
      "10,000 Neurons per day at no charge",
      "Above the free allocation, $0.011 per 1,000 Neurons on Workers Paid",
      "Some resource-intensive models are restricted to the Paid plan"
    ],
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Cloudflare's official Workers AI pricing docs; live page not checked",
      "note": "The live page could not be fetched from the research environment (the host is not on the session's allowed network list), so the quotes below are search-engine extracts of the provider's own pages and may be shortened. Re-check the live page before publishing as verified.",
      "evidence": [
        {
          "claim": "Free allocation",
          "quote": "10,000 Neurons per day at no charge"
        },
        {
          "claim": "Overage price",
          "quote": "$0.011 per 1,000 Neurons"
        }
      ]
    },
    "links": {
      "officialUrl": "https://developers.cloudflare.com/workers-ai/platform/pricing/"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-vercel-ai-gateway-5-dollar-credit-every-30-days",
    "slug": "vercel-ai-gateway-5-dollar-credit-every-30-days",
    "productId": "vercel",
    "title": "Vercel AI Gateway: $5 of free model credits every 30 days",
    "summary": "Vercel accounts get $5 of AI Gateway credits every 30 days to try models from the gateway's catalog; the free credit stops once you buy AI Gateway credits.",
    "description": "Vercel AI Gateway gives one API for many AI model providers. Vercel says that when you sign up for a Vercel account you get $5 of credits every 30 days to try any model from its model list. The free credit starts with your first AI Gateway request and is a recurring monthly allowance rather than an expiring trial.\n\nBuying AI Gateway credits moves your team to the paid tier, and the monthly free credit then no longer applies.",
    "type": "free-credits",
    "categories": [
      "ai-tools",
      "free-credits"
    ],
    "audiences": [
      "developers",
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 5,
      "period": "month"
    },
    "claim": {
      "method": "automatic",
      "note": "Make your first AI Gateway request from a Vercel account to start the free credit."
    },
    "eligibility": [
      "Vercel accounts on the AI Gateway free tier (no purchased AI Gateway credits)"
    ],
    "redemption": [
      "Sign up for or sign in to Vercel",
      "Create an AI Gateway API key",
      "Make a request; the $5 credit starts with your first AI Gateway request"
    ],
    "terms": [
      "$5 of credits every 30 days",
      "Free credits start when you make your first AI Gateway request",
      "Purchasing AI Gateway Credits moves your team to the paid tier and ends the monthly free credit"
    ],
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Vercel's official AI Gateway page and docs; live pages not checked",
      "note": "The live page could not be fetched from the research environment (the host is not on the session's allowed network list), so the quotes below are search-engine extracts of the provider's own pages and may be shortened. Re-check the live page before publishing as verified. A Vercel Community thread reported a $5 credit not renewing for one Hobby account; Vercel's docs still describe it as recurring.",
      "evidence": [
        {
          "claim": "Monthly credit",
          "quote": "When you sign up for a Vercel account, you get $5 of credits every 30 days to try out any model from our model list."
        },
        {
          "claim": "Not a trial (FAQ)",
          "quote": "The free tier is a monthly included credit, not an expiring trial."
        },
        {
          "claim": "Start of credit",
          "quote": "Your free credits start when you make your first AI Gateway request."
        },
        {
          "claim": "Ends on purchase",
          "quote": "Purchasing AI Gateway Credits moves your team to the paid tier, and the monthly free credit no longer applies."
        }
      ]
    },
    "links": {
      "officialUrl": "https://vercel.com/ai-gateway"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-runway-free-plan-125-credits",
    "slug": "runway-free-plan-125-credits",
    "productId": "runway",
    "title": "Runway Free plan: 125 one-time credits for AI video and images",
    "summary": "Runway's Free plan includes a one-time grant of 125 credits that doesn't expire, for trying a limited set of its generative tools.",
    "description": "Runway's Free plan comes with 125 credits, granted once. The credits don't expire, but they also don't renew or refresh once spent, and Free users can't buy extra credits.\n\nThe Free plan covers a limited set of Runway's generative AI tools; the Standard plan and above unlock all of its image and video models and a monthly credit allowance.",
    "type": "free-plan",
    "categories": [
      "ai-tools",
      "free-trials"
    ],
    "audiences": [
      "creators",
      "designers",
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up for a free Runway account."
    },
    "eligibility": [
      "Anyone who signs up for a Runway account"
    ],
    "redemption": [
      "Sign up at runwayml.com",
      "Use your 125 credits on the tools available to the Free plan"
    ],
    "terms": [
      "125 credits, one time; they do not expire but do not renew",
      "Credits cannot be purchased on the Free plan",
      "Only a limited set of generative tools is available on Free"
    ],
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Runway's official help center; live page not checked",
      "note": "The live page could not be fetched from the research environment (the host is not on the session's allowed network list), so the quotes below are search-engine extracts of the provider's own pages and may be shortened. Re-check the live page before publishing as verified.",
      "evidence": [
        {
          "claim": "Credit grant",
          "quote": "125 credits (one time)"
        },
        {
          "claim": "No expiry, no renewal",
          "quote": "does not expire, and does not renew or refresh once spent"
        },
        {
          "claim": "No purchases on Free",
          "quote": "credits cannot be purchased on a Free plan"
        }
      ]
    },
    "links": {
      "officialUrl": "https://help.runwayml.com/hc/en-us/articles/50404627334547-Free-plan-details"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-suno-free-plan-50-daily-credits",
    "slug": "suno-free-plan-50-daily-credits",
    "productId": "suno",
    "title": "Suno Free plan: 50 credits a day, about 10 songs",
    "summary": "Suno's free plan refreshes up to 50 credits every day, which Suno says is enough for about 10 songs, for personal, non-commercial use.",
    "description": "Suno's free Basic plan gives up to 50 credits, replenished once a day on UTC time, which Suno says is enough to make 10 songs a day. Unused credits don't carry over.\n\nSongs made on the free plan are for personal, non-commercial use: they can't be monetized but can be shared with your Suno link. Paid Pro and Premier plans use monthly credits instead of a daily allowance.",
    "type": "free-plan",
    "categories": [
      "ai-tools"
    ],
    "audiences": [
      "creators",
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up for a free Suno account."
    },
    "eligibility": [
      "Anyone with a Suno account"
    ],
    "redemption": [
      "Sign up at suno.com",
      "Create songs with your daily credits"
    ],
    "terms": [
      "Up to 50 credits, replenished once daily (UTC)",
      "Credits don't carry over to the next day",
      "Free-plan songs are for personal, non-commercial use and can't be monetized"
    ],
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Suno's official help center; live pages not checked",
      "note": "The live page could not be fetched from the research environment (the host is not on the session's allowed network list), so the quotes below are search-engine extracts of the provider's own pages and may be shortened. Re-check the live page before publishing as verified.",
      "evidence": [
        {
          "claim": "Daily credits",
          "quote": "up to 50 credits replenished once daily"
        },
        {
          "claim": "Songs per day",
          "quote": "enough to make 10 songs per day"
        },
        {
          "claim": "Non-commercial",
          "quote": "only intended for personal, non-commercial use"
        },
        {
          "claim": "No monetization",
          "quote": "These songs cannot be monetized, but can be shared using your Suno link."
        }
      ]
    },
    "links": {
      "officialUrl": "https://suno.com/pricing"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-elevenlabs-free-plan-10000-credits",
    "slug": "elevenlabs-free-plan-10000-credits",
    "productId": "elevenlabs",
    "title": "ElevenLabs Free plan: 10,000 credits a month",
    "summary": "ElevenLabs' Free plan includes 10,000 credits a month for its voice AI tools, for non-commercial use with attribution.",
    "description": "ElevenLabs' Free plan costs $0 and includes 10,000 credits each month, which ElevenLabs puts at roughly 10 minutes of audio. Free users get three custom voice slots for creating voices with Voice Design.\n\nUnused credits don't roll over on the Free plan, and content made on it can be used non-commercially with attribution.",
    "type": "free-plan",
    "categories": [
      "ai-tools",
      "free-credits"
    ],
    "audiences": [
      "creators",
      "developers",
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "period": "month"
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up for a free ElevenLabs account."
    },
    "eligibility": [
      "Anyone with an ElevenLabs account"
    ],
    "redemption": [
      "Sign up at elevenlabs.io",
      "Use your monthly credits in the app or the API"
    ],
    "terms": [
      "10,000 credits per month",
      "Rollover does not apply to the Free plan",
      "Non-commercial use with attribution"
    ],
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of ElevenLabs' official pricing page and docs; live pages not checked",
      "note": "The live page could not be fetched from the research environment (the host is not on the session's allowed network list), so the quotes below are search-engine extracts of the provider's own pages and may be shortened. Re-check the live page before publishing as verified.",
      "evidence": [
        {
          "claim": "Free plan credits",
          "quote": "Free $0 (10,000 credits)"
        },
        {
          "claim": "No rollover",
          "quote": "Rollover does not apply to the Free plan."
        },
        {
          "claim": "Non-commercial use",
          "quote": "If you are on the free plan, you can use the content non-commercially with attribution."
        },
        {
          "claim": "Voice slots",
          "quote": "three custom voice slots"
        }
      ]
    },
    "links": {
      "officialUrl": "https://elevenlabs.io/pricing"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-codex-for-open-source-chatgpt-pro",
    "slug": "codex-for-open-source-chatgpt-pro",
    "productId": "chatgpt",
    "title": "Codex for Open Source: six months of ChatGPT Pro with Codex for open-source maintainers",
    "summary": "OpenAI's Codex for Open Source program offers core maintainers of widely used open-source projects six months of ChatGPT Pro with Codex, with Codex Security access and API credits as optional extras.",
    "description": "OpenAI's Codex for Open Source program supports open-source maintainers with six months of ChatGPT Pro with Codex. Core maintainers with write access can also get conditional access to Codex Security, and API credits for coding, maintainer automation and release work are available from a $1 million fund.\n\nThe program is for primary or core maintainers of active projects with meaningful usage or ecosystem importance; you can also nominate another maintainer. If your project doesn't fit the criteria but plays an important role in the ecosystem, OpenAI asks you to apply anyway and explain why.\n\nOpenAI decides which benefits an approved applicant gets at its sole discretion, and availability, duration and scope may vary. Codex Security and API credits may require separate review. You need a valid ChatGPT account, and OpenAI may ask for proof of identity or maintainer status.",
    "type": "free-plan",
    "categories": [
      "ai-tools",
      "open-source"
    ],
    "audiences": [
      "developers",
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "period": "month",
      "durationMonths": 6
    },
    "claim": {
      "method": "application",
      "note": "Apply, or nominate a maintainer, on OpenAI's Codex for Open Source page."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Primary or core maintainers of active open-source projects with meaningful usage or ecosystem importance",
      "Projects that don't fit the criteria but play an important ecosystem role can apply and explain why",
      "A valid ChatGPT account",
      "Codex Security access is for core maintainers with write access"
    ],
    "redemption": [
      "Go to OpenAI's Codex for Open Source page",
      "Submit the application for your project (or nominate another maintainer)",
      "If approved, the benefits are applied to your ChatGPT account"
    ],
    "terms": [
      "Benefits are granted at OpenAI's sole discretion",
      "Availability, duration, scope and timing may vary by applicant, repository or use case",
      "Codex Security access and API credits may require separate review and additional terms",
      "OpenAI may verify identity, repository affiliation or maintainer status"
    ],
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of OpenAI's official Codex for Open Source page and program terms; live pages not checked",
      "note": "The live page could not be fetched from the research environment (the host is not on the session's allowed network list), so the quotes below are search-engine extracts of the provider's own pages and may be shortened. Re-check the live page before publishing as verified.",
      "evidence": [
        {
          "claim": "Main benefit",
          "quote": "six months of ChatGPT Pro with Codex"
        },
        {
          "claim": "Codex Security",
          "quote": "conditional access to Codex Security for core maintainers with write access"
        },
        {
          "claim": "Discretion",
          "quote": "approved applicants may receive one or more of the following benefits, as determined by OpenAI in its sole discretion"
        },
        {
          "claim": "Variation",
          "quote": "Availability, duration, scope, and timing of any benefit may vary by applicant, repository, or use case."
        },
        {
          "claim": "Apply anyway",
          "quote": "If your project doesn't fit the criteria but it plays an important role in the ecosystem, apply anyway and explain why."
        }
      ]
    },
    "links": {
      "officialUrl": "https://developers.openai.com/community/codex-for-oss"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-deepgram-200-free-credit",
    "slug": "deepgram-200-free-credit",
    "productId": "deepgram",
    "title": "Deepgram: $200 of free API credit, no credit card",
    "summary": "New Deepgram accounts get $200 in free credit for its speech-to-text, text-to-speech and voice agent APIs, with no credit card required and no expiry.",
    "description": "Deepgram gives new sign-ups $200 in free credit on its pay-as-you-go plan, with no credit card needed. Deepgram says the credit doesn't expire and that the pay-as-you-go plan has no minimums.\n\nThe credit can be used across Deepgram's APIs, including speech-to-text and voice agents.",
    "type": "free-credits",
    "categories": [
      "ai-tools",
      "free-credits"
    ],
    "audiences": [
      "developers",
      "ai-tools",
      "startups"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 200
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up in the Deepgram console."
    },
    "requirements": {
      "cardRequired": false
    },
    "eligibility": [
      "New Deepgram accounts"
    ],
    "redemption": [
      "Go to console.deepgram.com/signup",
      "Create an account",
      "Create an API key and start making requests"
    ],
    "terms": [
      "$200 in free credit",
      "No credit card required",
      "The credit does not expire"
    ],
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Deepgram's official pricing page, console sign-up page and docs; live pages not checked",
      "note": "The live page could not be fetched from the research environment (the host is not on the session's allowed network list), so the quotes below are search-engine extracts of the provider's own pages and may be shortened. Re-check the live page before publishing as verified.",
      "evidence": [
        {
          "claim": "Credit amount",
          "quote": "$200 in free credit"
        },
        {
          "claim": "Docs",
          "quote": "signup is free and includes $200 in credit"
        },
        {
          "claim": "No card",
          "quote": "no credit card required"
        }
      ]
    },
    "links": {
      "officialUrl": "https://deepgram.com/pricing",
      "redeemUrl": "https://console.deepgram.com/signup"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-assemblyai-50-free-credits",
    "slug": "assemblyai-50-free-credits",
    "productId": "assemblyai",
    "title": "AssemblyAI: $50 in free speech-to-text credits that don't expire",
    "summary": "New AssemblyAI accounts get $50 in credits for pre-recorded and real-time speech-to-text, Speech Understanding and Guardrails; the credits don't expire.",
    "description": "AssemblyAI gives new accounts $50 in credits covering pre-recorded and real-time speech-to-text, Speech Understanding and Guardrails. The credits don't expire, and any unused credits stay on your account when you upgrade by adding a credit card. LLM Gateway is not included in the free tier.\n\nWhen the free credits run out, you add a card to keep using the API. Free accounts can start 5 new streams per minute, compared with 100 for pay-as-you-go accounts.",
    "type": "free-credits",
    "categories": [
      "ai-tools",
      "free-credits"
    ],
    "audiences": [
      "developers",
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "creditValue": 50
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up for an AssemblyAI account."
    },
    "eligibility": [
      "New AssemblyAI accounts"
    ],
    "redemption": [
      "Sign up at assemblyai.com",
      "Copy your API key from the dashboard",
      "Transcribe audio until the $50 credit is used"
    ],
    "terms": [
      "$50 in credits; they do not expire",
      "LLM Gateway is excluded from the free tier",
      "Free accounts can start 5 new streams per minute",
      "Add a credit card to continue after the credits are used"
    ],
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of AssemblyAI's official billing and pricing docs; live page not checked",
      "note": "The live page could not be fetched from the research environment (the host is not on the session's allowed network list), so the quotes below are search-engine extracts of the provider's own pages and may be shortened. Re-check the live page before publishing as verified. Some AssemblyAI marketing pages describe the free allowance in hours instead (up to 185 hours pre-recorded / 333 hours streaming); the billing docs' $50 figure is used here.",
      "evidence": [
        {
          "claim": "Credit amount",
          "quote": "$50 in credits"
        },
        {
          "claim": "No expiry",
          "quote": "Credits do not expire"
        },
        {
          "claim": "LLM Gateway excluded",
          "quote": "LLM Gateway is excluded from the free tier"
        },
        {
          "claim": "Stream limit",
          "quote": "5 new streams per minute"
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.assemblyai.com/docs/billing-and-pricing"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-langsmith-developer-free-plan",
    "slug": "langsmith-developer-free-plan",
    "productId": "langsmith",
    "title": "LangSmith Developer plan: free for one seat with 5,000 traces a month",
    "summary": "LangSmith's Developer plan is $0 for one seat and includes up to 5,000 base traces a month for tracing and evaluating LLM apps.",
    "description": "LangChain's LangSmith Developer plan is free for a single seat and includes up to 5,000 base traces per month for observability and evaluation of LLM apps and agents.\n\nWithout a payment method on file, the 5,000-trace limit is a hard cap. Adding a payment method removes the cap and bills extra traces pay-as-you-go. The Plus plan ($39 per seat) adds more seats and 10,000 base traces.",
    "type": "free-plan",
    "categories": [
      "ai-tools"
    ],
    "audiences": [
      "developers",
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "period": "month"
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up for LangSmith; new accounts start on the Developer plan."
    },
    "eligibility": [
      "Individual developers (one seat)"
    ],
    "redemption": [
      "Sign up at smith.langchain.com",
      "Create an API key and send traces from your app"
    ],
    "terms": [
      "1 seat",
      "Up to 5,000 base traces per month, then pay-as-you-go",
      "Without a payment method, 5,000 traces is a hard monthly cap"
    ],
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of LangChain's official pricing page and LangSmith docs; live pages not checked",
      "note": "The live page could not be fetched from the research environment (the host is not on the session's allowed network list), so the quotes below are search-engine extracts of the provider's own pages and may be shortened. Re-check the live page before publishing as verified.",
      "evidence": [
        {
          "claim": "Trace allowance",
          "quote": "up to 5k base traces / mo, then pay-as-you-go"
        },
        {
          "claim": "Price",
          "quote": "$0 per seat"
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.langchain.com/pricing"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-together-ai-startup-accelerator-credits",
    "slug": "together-ai-startup-accelerator-credits",
    "productId": "together-ai",
    "title": "Together AI Startup Accelerator: up to $50K in platform credits for AI-native startups",
    "summary": "Startups accepted to Together AI's Startup Accelerator get free platform credits (up to $30K, or up to $50K for companies that have raised over $10M), plus engineering time and go-to-market support.",
    "description": "Together AI's Startup Accelerator is a selection-based program for AI-native startups. On the program page, accepted startups get up to $30K in free platform credits with 6 hours of engineering time, or up to $50K with 10 hours for companies that have raised more than $10M. Credits can be used for serverless inference, fine-tuning, dedicated endpoints and instant clusters, and the program includes go-to-market support.\n\nCredits don't apply to Reserved GPU Clusters. Together AI also runs a separate, invite-only research credits program.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "free-credits",
      "ai-tools"
    ],
    "audiences": [
      "startups",
      "developers",
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "savingsLabel": "up to 50K USD free credits"
    },
    "claim": {
      "method": "application",
      "note": "Apply on the Startup Accelerator page; acceptance is selective."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "AI-native startups accepted to the program",
      "The up-to-$50K tier is for companies that have raised over $10M"
    ],
    "redemption": [
      "Go to together.ai/startup-accelerator",
      "Apply with your company details",
      "If accepted, credits are added to your Together AI account"
    ],
    "terms": [
      "Credits do not apply to Reserved GPU Clusters",
      "Selection-based; acceptance isn't guaranteed",
      "Credit tier depends on funding raised"
    ],
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Together AI's official Startup Accelerator page and announcement; live pages not checked",
      "note": "The live page could not be fetched from the research environment (the host is not on the session's allowed network list), so the quotes below are search-engine extracts of the provider's own pages and may be shortened. Re-check the live page before publishing as verified. Together AI's original announcement blog lists lower funding-based tiers (for example up to $15K for companies with up to $5M raised); the program page's figures are used here.",
      "evidence": [
        {
          "claim": "Credit ceiling",
          "quote": "up to 50K USD free credits to use on the Together AI platform"
        },
        {
          "claim": "Base tier",
          "quote": "up to $30K in free platform credits"
        },
        {
          "claim": "Exclusion",
          "quote": "Credits do not apply to Reserved GPU Clusters"
        },
        {
          "claim": "Selection",
          "quote": "targeted selection-based program"
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.together.ai/startup-accelerator"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-tavily-researcher-1000-free-credits",
    "slug": "tavily-researcher-1000-free-credits",
    "productId": "tavily",
    "title": "Tavily Researcher plan: 1,000 free search API credits a month, no credit card",
    "summary": "Tavily's free Researcher plan includes 1,000 API credits each month for its web search API, with no credit card required.",
    "description": "Tavily's Researcher plan is free and includes 1,000 API credits per month for searching, extracting and crawling the web from AI agents and LLM apps. No credit card is required.\n\nCredits reset on the first day of each month, regardless of billing date. Beyond the plan's credits, Tavily charges $0.008 per credit pay-as-you-go.",
    "type": "free-plan",
    "categories": [
      "ai-tools",
      "free-credits"
    ],
    "audiences": [
      "developers",
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "period": "month"
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up for Tavily to get an API key with the free monthly credits."
    },
    "requirements": {
      "cardRequired": false
    },
    "eligibility": [
      "Every new Tavily account"
    ],
    "redemption": [
      "Sign up at tavily.com",
      "Copy your API key",
      "Use up to 1,000 credits per month"
    ],
    "terms": [
      "1,000 API credits per month",
      "Credits reset on the first day of each month",
      "Pay-as-you-go beyond the limit at $0.008 per credit"
    ],
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Tavily's official pricing page and docs; live pages not checked",
      "note": "The live page could not be fetched from the research environment (the host is not on the session's allowed network list), so the quotes below are search-engine extracts of the provider's own pages and may be shortened. Re-check the live page before publishing as verified.",
      "evidence": [
        {
          "claim": "Monthly credits",
          "quote": "1,000 API credits per month"
        },
        {
          "claim": "Reset",
          "quote": "Your API credits reset on the first day of each month, regardless of the billing date."
        },
        {
          "claim": "Overage price",
          "quote": "$0.008 per credit"
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.tavily.com/pricing"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-weights-and-biases-free-academic-plan",
    "slug": "weights-and-biases-free-academic-plan",
    "productId": "weights-and-biases",
    "title": "Weights & Biases academic plan: free Pro features for academic research",
    "summary": "Students, professors and postdocs doing non-commercial academic research can get a free W&B Pro-level academic licence with unlimited tracked hours, 200 GB of storage and up to 100 seats.",
    "description": "Weights & Biases offers a free academic licence to academic institutions doing research not connected to a for-profit entity. It's intended for students, professors and postdoctoral researchers and includes Pro features, unlimited tracked hours, 200 GB of cloud storage, up to 25 GB a month of Weave data ingestion and up to 100 seats.\n\nYou need an email address affiliated with an academic institution. The licence can't be used for commercial purposes, government research or consulting, and W&B may ask for proof of enrollment or employment. W&B, now part of CoreWeave, also lists the plan on CoreWeave's pricing page as CoreWeave Forge Academic.",
    "type": "student",
    "categories": [
      "student-discounts",
      "ai-tools"
    ],
    "audiences": [
      "students",
      "developers",
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "application",
      "note": "Apply for the academic plan from W&B's pricing or research page using your academic email."
    },
    "eligibility": [
      "Students, professors and postdoctoral researchers at academic institutions",
      "Research not connected to a for-profit entity",
      "An active email address affiliated with an academic institution"
    ],
    "redemption": [
      "Go to wandb.ai/site/research",
      "Sign up with your academic email and apply for the academic plan",
      "W&B's docs say you can start with a 30-day trial and convert it to the academic plan"
    ],
    "terms": [
      "No commercial use, government research or consulting",
      "Proof of enrollment or employment may be requested",
      "W&B may modify, discontinue, suspend or terminate free plans at any time"
    ],
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of W&B's official research page, pricing page, docs and terms; live pages not checked",
      "note": "The live page could not be fetched from the research environment (the host is not on the session's allowed network list), so the quotes below are search-engine extracts of the provider's own pages and may be shortened. Re-check the live page before publishing as verified. The academic plan also appears as 'CoreWeave Forge Academic' on wandb.ai/site/pricing after the CoreWeave rebrand.",
      "evidence": [
        {
          "claim": "Inclusions",
          "quote": "unlimited tracked hours, 200GB of cloud storage, up to 25GB/month of Weave data ingestion, and up to 100 seats"
        },
        {
          "claim": "Academic email",
          "quote": "an active email address affiliated with an academic institution"
        },
        {
          "claim": "Discretion",
          "quote": "W&B reserves the right to modify, discontinue, suspend or terminate any free subscription plans at any time."
        }
      ]
    },
    "links": {
      "officialUrl": "https://wandb.ai/site/research/"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-github-copilot-free-plan",
    "slug": "github-copilot-free-plan",
    "productId": "github-copilot",
    "title": "GitHub Copilot Free: 2,000 code completions a month at no cost",
    "summary": "Copilot Free gives any GitHub user 2,000 code completions a month plus limited chat and agent usage, with access to models such as Haiku 4.5 and GPT-5 mini.",
    "description": "GitHub Copilot Free is a no-cost Copilot plan for individual GitHub users. It includes 2,000 code completions per month and a limited monthly allowance of chat and agent usage, with access to models including Haiku 4.5 and GPT-5 mini. It works with the Copilot CLI and agent mode.\n\nChat on current plans draws on GitHub AI Credits, so check your account's Copilot usage page for your remaining allowance. Verified students and teachers, and maintainers of popular open-source projects, can get paid Copilot plans free through separate GitHub programs.",
    "type": "free-plan",
    "categories": [
      "ai-tools"
    ],
    "audiences": [
      "developers",
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "period": "month"
    },
    "claim": {
      "method": "automatic",
      "note": "Enable Copilot Free from your GitHub account or in a supported editor."
    },
    "eligibility": [
      "Individual GitHub users"
    ],
    "redemption": [
      "Sign in to GitHub",
      "Open the Copilot plans page and choose Free",
      "Sign in to Copilot in your editor or the CLI"
    ],
    "terms": [
      "2,000 completions per month",
      "Limited chat and agent usage each month",
      "Model availability may change"
    ],
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of GitHub's official Copilot plans page; live page not checked",
      "note": "The live page could not be fetched from the research environment (the host is not on the session's allowed network list), so the quotes below are search-engine extracts of the provider's own pages and may be shortened. Re-check the live page before publishing as verified. Older GitHub pages cite 50 chat requests a month for Free; the current plans page describes chat as limited and credit-based without a fixed number, so no chat figure is given.",
      "evidence": [
        {
          "claim": "Completions",
          "quote": "2,000 completions per month"
        },
        {
          "claim": "Models",
          "quote": "Access to Haiku 4.5, GPT-5 mini, and more"
        },
        {
          "claim": "CLI and agent mode",
          "quote": "Free plan supports CLI and agent mode"
        }
      ]
    },
    "links": {
      "officialUrl": "https://github.com/features/copilot/plans"
    }
  },
  {
    "source": "official",
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "id": "o-amazon-q-developer-free-tier",
    "slug": "amazon-q-developer-free-tier",
    "productId": "amazon-q-developer",
    "title": "Amazon Q Developer Free Tier: AI coding help with monthly limits at no cost",
    "summary": "Amazon Q Developer has a perpetual Free Tier for AWS Builder ID and IAM users, with a monthly allowance of agentic requests in the IDE and CLI.",
    "description": "Amazon Q Developer, AWS's AI coding assistant, has a perpetual Free Tier with monthly limits for users signed in with an AWS Builder ID or as an IAM user. AWS lists 50 agentic requests per month for chat and agentic coding in the IDE or CLI, and free users can also transform up to 1,000 lines of Java code a month.\n\nOn the Free Tier you can also ask up to 25 questions per account per month that need account or resource context, including cost-management questions. The Pro tier costs $19 per user per month and raises the limits.",
    "type": "free-plan",
    "categories": [
      "ai-tools"
    ],
    "audiences": [
      "developers",
      "ai-tools"
    ],
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "period": "month"
    },
    "claim": {
      "method": "automatic",
      "note": "Sign in to Amazon Q Developer with an AWS Builder ID or IAM user."
    },
    "eligibility": [
      "Users signed in with an AWS Builder ID or as an AWS IAM user"
    ],
    "redemption": [
      "Install the Amazon Q Developer extension or CLI",
      "Sign in with an AWS Builder ID (free) or IAM user"
    ],
    "terms": [
      "Monthly limits apply to agentic requests",
      "Up to 25 questions per account per month that require account or resource context",
      "Pro tier is $19 per user per month for expanded limits"
    ],
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of AWS's official Amazon Q Developer pricing page and FAQs; live pages not checked",
      "note": "The live page could not be fetched from the research environment (the host is not on the session's allowed network list), so the quotes below are search-engine extracts of the provider's own pages and may be shortened. Re-check the live page before publishing as verified. The 50 agentic requests and 1,000 lines of Java figures were read from the pricing table extract rather than a full sentence; re-check them on the live page.",
      "evidence": [
        {
          "claim": "Perpetual free tier",
          "quote": "Amazon Q Developer offers an perpetual Free Tier with monthly limits available to users logged in as an AWS Identity and Access Management (IAM) user or AWS Builder ID user."
        },
        {
          "claim": "Free tier features",
          "quote": "Limited agentic requests per month Access latest Claude models Use in the IDE or CLI"
        },
        {
          "claim": "Account-context questions",
          "quote": "Under the Amazon Q Developer Free Tier, you can ask up to 25 questions per account per month that require account or resource context to answer (including cost management questions)."
        },
        {
          "claim": "Pro price",
          "quote": "Pro Tier: Expanded limits $19/mo. per user"
        }
      ]
    },
    "links": {
      "officialUrl": "https://aws.amazon.com/q/developer/pricing/"
    }
  },
  {
    "id": "o-github-for-nonprofits-free-team-plan",
    "slug": "github-for-nonprofits-free-team-plan",
    "productId": "github",
    "title": "GitHub for Nonprofits: free GitHub Team plan or 25% off GitHub Enterprise Cloud",
    "summary": "Verified nonprofits can get GitHub Team free, with unlimited private repositories and unlimited users, or 25% off GitHub Enterprise Cloud.",
    "description": "GitHub for Nonprofits gives verified nonprofit organizations a choice of a free GitHub Team plan or 25% off the GitHub Enterprise Cloud plan. GitHub's FAQ says the free Team plan includes unlimited private repositories and unlimited users. GitHub also points nonprofits to its Nonprofit Developer Pack, a curated set of free and discounted services from GitHub and partners.\n\nThe program is open to registered 501(c)(3) organizations and their equivalents in other countries that are non-governmental, non-academic, non-commercial and non-political. GitHub first checks the organization against a validated database; if that check doesn't validate it, the organization submits a form with its country of registration, registration ID and proof of status, such as a 501(c)(3) letter.",
    "type": "free-plan",
    "categories": [
      "software-deals",
      "saas-discounts"
    ],
    "audiences": [
      "developers",
      "businesses"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "Free GitHub Team plan, or 25% off GitHub Enterprise Cloud"
    },
    "claim": {
      "method": "application",
      "note": "Sign in to the GitHub for Nonprofits portal with your GitHub organization account; submit proof of status if automatic validation fails."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Registered 501(c)(3) nonprofit or equivalent organization",
      "Non-governmental, non-academic, non-commercial and non-political in nature",
      "Social-sector groups without registered nonprofit status are not currently supported"
    ],
    "redemption": [
      "Open the GitHub for Nonprofits portal and sign in with your GitHub organization account",
      "GitHub checks whether your organization is already validated",
      "If it isn't, submit the form with your country of registration, registration ID and proof of status (for example a 501(c)(3) letter)",
      "Once verified, choose the free Team plan or the 25% Enterprise Cloud discount"
    ],
    "terms": [
      "Free GitHub Team plan includes unlimited private repositories and unlimited users",
      "Alternative: 25% off the GitHub Enterprise Cloud plan"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-11-02",
      "method": "Checked against the provider's official program page",
      "note": "github.com/solutions/industry/nonprofits was read directly. The page does not state how long verification takes.",
      "evidence": [
        {
          "claim": "Offer",
          "quote": "Verified nonprofits get exclusive access to a free GitHub Team plan or 25% off the GitHub Enterprise cloud plan."
        },
        {
          "claim": "Team plan contents (FAQ)",
          "quote": "are eligible for a free GitHub Team Plan with unlimited private repositories and unlimited users"
        },
        {
          "claim": "Registered status required",
          "quote": "At this time, we only support registered 501(c)(3) or equivalent organizations."
        },
        {
          "claim": "Eligible organizations",
          "quote": "Nonprofit organizations that are 501(c)(3) or equivalent"
        },
        {
          "claim": "Manual verification",
          "quote": "submit a form with your country of registration, registration ID, and proof of status"
        },
        {
          "claim": "Nonprofit Developer Pack",
          "quote": "a curated collection of free and discounted services from GitHub and our partners"
        }
      ]
    },
    "links": {
      "officialUrl": "https://github.com/solutions/industry/nonprofits",
      "redeemUrl": "https://nonprofits.github.com/getting-started"
    }
  },
  {
    "id": "o-slack-for-nonprofits-free-pro-85-off-business-plus",
    "slug": "slack-for-nonprofits-free-pro-85-off-business-plus",
    "productId": "slack",
    "title": "Slack for Nonprofits: free Pro plan for workspaces of up to 250 members, 85% off Business+",
    "summary": "Qualifying nonprofits get Slack Pro free for workspaces with 250 or fewer members, 85% off Pro above that size, and 85% off Business+ at any size.",
    "description": "Slack for Nonprofits upgrades qualifying workspaces with 250 or fewer members to the Pro plan for free. Larger workspaces get 85% off Pro, and workspaces of any size get 85% off Business+. Slack says it can also extend the discount to qualifying Enterprise deployments of 1,000+ members; those organizations contact Slack.\n\nSlack accepts organizations with valid charitable status from the IRS, a local charity regulator or a TechSoup Global partner, and decides qualification at its own discretion. Religious organizations, schools and colleges (which can use Slack for Education instead), government offices, hospitals and health-insurance-related organizations, and private foundations are excluded. A Workspace Owner applies, and each workspace needs its own application.",
    "type": "discount",
    "categories": [
      "saas-discounts",
      "software-deals"
    ],
    "audiences": [
      "office-tools",
      "businesses"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "savingsLabel": "Free Pro for workspaces of 250 or fewer members; 85% off Business+"
    },
    "claim": {
      "method": "application",
      "note": "A Workspace Owner submits the Slack for Nonprofits application; each workspace applies separately."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Valid charitable status from the IRS, a local charity regulator or a TechSoup Global partner",
      "Not eligible: religious organizations, schools and colleges (see Slack for Education), government offices, hospitals and health-insurance-related organizations, private foundations",
      "Slack decides qualification at its sole discretion"
    ],
    "redemption": [
      "Sign in as a Workspace Owner",
      "Submit the Slack for Nonprofits application from Slack's help center article",
      "Repeat the application for each workspace you want discounted"
    ],
    "terms": [
      "Pro: free for workspaces with 250 or fewer members; 85% off for larger workspaces",
      "Business+: 85% off for workspaces of any size",
      "Enterprise deployments of 1,000+ members: contact Slack"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Slack's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (slack.com is not on the session's network allowlist), so facts and quotes come from search-engine extracts of slack.com pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified. The eligibility and exclusion list is taken from the search summary of the same help article rather than a verbatim quote. An older version of the article (using the former Standard/Plus plan names) said fees paid before approval are not refunded; that is not repeated in the terms because the current wording wasn't confirmed.",
      "evidence": [
        {
          "claim": "Pro plan terms",
          "quote": "Pro Plan: We offer workspaces with 250 or fewer members a free upgrade, and an 85% discount for workspaces above that size."
        },
        {
          "claim": "Business+ terms",
          "quote": "Business+ Plan: We offer workspaces of any size an 85% discount."
        },
        {
          "claim": "Enterprise",
          "quote": "Slack extends the Slack for Nonprofits discount to qualifying workspaces on Slack Enterprise plans for deployments of 1,000+ members in an organization. Please contact us to learn more."
        }
      ]
    },
    "links": {
      "officialUrl": "https://slack.com/help/articles/204368833-Apply-for-the-Slack-for-Nonprofits-discount"
    }
  },
  {
    "id": "o-google-workspace-for-nonprofits-no-cost",
    "slug": "google-workspace-for-nonprofits-no-cost",
    "productId": "google-workspace",
    "title": "Google Workspace for Nonprofits: no-cost edition for eligible nonprofits",
    "summary": "Nonprofits approved through Google for Nonprofits can use the Google Workspace for Nonprofits edition at no cost, for up to 2,000 users with pooled storage.",
    "description": "Google Workspace for Nonprofits is a no-cost Workspace edition for organizations approved through Google for Nonprofits. Google says organizations can cover up to 2,000 employees or volunteers at no cost, with 100 TB of storage pooled across users. Google's help center notes that new accounts can add up to 300 users and can contact Workspace support from the Admin console to request more. Nonprofits that need more features can move to paid Business or Enterprise editions at discounted nonprofit prices.\n\nTo qualify, an organization must be registered as a charitable organization in a supported country or region, be verified by Google's validation partner (Goodstack), meet its country's requirements and accept the Google for Nonprofits Additional Terms of Service. In the US that means 501(c)(3) status (or a group exemption with proven affiliation); fiscally sponsored organizations without their own status are not eligible. Governmental entities, hospitals and health care organizations, and schools and universities are excluded, though philanthropic arms of schools and healthcare foundations can qualify.",
    "type": "free-plan",
    "categories": [
      "software-deals",
      "saas-discounts"
    ],
    "audiences": [
      "office-tools",
      "businesses"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "No cost for eligible nonprofits"
    },
    "claim": {
      "method": "application",
      "note": "Join Google for Nonprofits, pass Goodstack verification, then activate Google Workspace for Nonprofits."
    },
    "requirements": {
      "approvalRequired": true
    },
    "regions": {
      "scope": "limited",
      "note": "Available only in the countries and regions Google for Nonprofits supports; check Google's country list."
    },
    "eligibility": [
      "Registered charitable organization in a country or region Google for Nonprofits supports",
      "Verified as a nonprofit by Google's validation partner, Goodstack",
      "US: registered with the IRS as 501(c)(3), or a group exempt organization affiliated with a 501(c)(3) central nonprofit; fiscally sponsored organizations without their own status are not eligible",
      "Not eligible: governmental entities, hospitals or health care organizations, schools, academic institutions or universities (philanthropic arms of schools and healthcare foundations can qualify)",
      "Must agree to the Google for Nonprofits Additional Terms of Service"
    ],
    "redemption": [
      "Request a Google for Nonprofits account and complete Goodstack verification",
      "Once approved, activate Google Workspace for Nonprofits from the Google for Nonprofits console",
      "Set up your domain and users in the Google Admin console"
    ],
    "terms": [
      "Up to 2,000 users at no cost; new accounts start with up to 300 users and can request more from Workspace support",
      "100 TB of storage pooled across users",
      "Paid Business and Enterprise editions are available at discounted nonprofit prices"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Google's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (google.com / support.google.com is not on the session's network allowlist), so facts and quotes come from search-engine extracts of google.com / support.google.com pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified. Storage (100 TB pooled), the 300-user starting limit and the exclusion list come from search summaries of Google's help and eligibility pages. Google's pages name Goodstack as the verification partner; an older FAQ names Percent.",
      "evidence": [
        {
          "claim": "No cost",
          "quote": "Eligible nonprofits have access to Nonprofits edition at no cost."
        },
        {
          "claim": "User ceiling",
          "quote": "Organizations can help up to 2,000 employees or volunteers at no cost."
        },
        {
          "claim": "Verification time",
          "quote": "Most requests are reviewed in 2-14 business days."
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.google.com/nonprofits/offerings/workspace/",
      "redeemUrl": "https://www.google.com/nonprofits/about/eligibility/"
    }
  },
  {
    "id": "o-notion-for-nonprofits-50-off-business",
    "slug": "notion-for-nonprofits-50-off-business",
    "productId": "notion",
    "title": "Notion for Nonprofits: 50% off the Business plan",
    "summary": "Verified nonprofits can get 50% off Notion's Business plan, for up to three workspaces per organization.",
    "description": "Notion for Nonprofits gives verified organizations 50% off Notion's Business plan. Notion says the program currently covers only the Business plan.\n\nOrganizations apply through Notion's form with their organization details and the Workspace ID (found under Settings → General, at the bottom of the tab). Each organization can request the discount for up to three workspaces. Verification takes about 3 to 7 business days, and Notion emails you once the organization is approved; free-plan workspaces can then upgrade at the discounted price.",
    "type": "discount",
    "categories": [
      "saas-discounts",
      "software-deals"
    ],
    "audiences": [
      "office-tools",
      "businesses"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "savingsLabel": "50% off the Business plan"
    },
    "claim": {
      "method": "application",
      "note": "Submit Notion's nonprofit form with your organization details and Workspace ID."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Nonprofit organizations that pass Notion's verification",
      "Business plan only"
    ],
    "redemption": [
      "Find your Workspace ID under Settings → General, at the bottom of the tab",
      "Submit your organization's details through Notion's nonprofit form",
      "Wait about 3 to 7 business days for verification; Notion emails you on approval",
      "Upgrade to the Business plan at the discounted price"
    ],
    "terms": [
      "Covers the Business plan only",
      "Up to three workspaces per organization"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Notion's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (notion.com is not on the session's network allowlist), so facts and quotes come from search-engine extracts of notion.com pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified. The three-workspace limit, Workspace ID step and 3–7 business-day review come from the search summary of notion.com/nonprofits. A June 2024 Notion release note mentioned nonprofit discounts on the Plus plan; the current page says Business plan only, so the title follows the current page.",
      "evidence": [
        {
          "claim": "Discount",
          "quote": "50% off our Business plan"
        },
        {
          "claim": "Plan scope",
          "quote": "Currently, this program is only eligible for the Business Plan."
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.notion.com/nonprofits"
    }
  },
  {
    "id": "o-atlassian-social-impact-license-free-up-to-25-seats",
    "slug": "atlassian-social-impact-license-free-up-to-25-seats",
    "productId": "atlassian-cloud",
    "title": "Atlassian Social Impact License: Jira, Confluence, Loom and Teamwork Collection free for up to 25 seats",
    "summary": "Eligible nonprofits and social enterprises get Jira, Confluence, Loom and Teamwork Collection at 100% off on annual plans of up to 25 seats, with Social Impact discounts on seats above that.",
    "description": "Atlassian's Social Impact License (formerly the Community License) gives eligible nonprofits and social enterprises 50–100% off Atlassian Cloud. The 100% tier covers Jira and Confluence Standard or Premium, Loom Business or Business + AI, and Teamwork Collection Standard or Premium, free for up to 25 seats billed annually. Seats above 25 are charged with the relevant Social Impact discount, and existing monthly customers need to move to annual billing.\n\nOrganizations registered in low or lower-middle income countries can get an 85% Global Access discount on Standard and Premium editions of Atlassian Cloud and Marketplace apps instead of the standard 75%. Atlassian uses Goodstack to verify that organizations are recognized nonprofits in their country of registration (or valid social enterprises under Atlassian's definition), non-governmental and non-political, and decides qualification at its sole discretion.",
    "type": "discount",
    "categories": [
      "saas-discounts",
      "software-deals"
    ],
    "audiences": [
      "developers",
      "office-tools",
      "businesses"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "100% off up to 25 seats on annual plans; 50–100% off for eligible organizations"
    },
    "claim": {
      "method": "application",
      "note": "Start a trial of the apps, then submit the Social Impact License request; the discount is applied after Goodstack verification."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Recognized as a nonprofit in the country where you are registered, or a valid social enterprise under Atlassian's definition",
      "Non-governmental and non-political",
      "Verified through Goodstack; Atlassian decides qualification at its sole discretion"
    ],
    "redemption": [
      "Choose your Atlassian Cloud apps and start a free trial",
      "Submit the Social Impact License request",
      "After verification, the discount is applied to your subscription"
    ],
    "terms": [
      "100% off Jira, Confluence and Teamwork Collection (Standard or Premium) and Loom (Business or Business + AI) for up to 25 seats",
      "The 100% discount is only available on annual plans; monthly customers must switch to annual billing",
      "Seats above 25 are charged with the relevant Social Impact discount",
      "Organizations in low or lower-middle income countries: 85% off Standard and Premium editions of Atlassian Cloud and Marketplace apps instead of the standard 75%"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Atlassian's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (atlassian.com is not on the session's network allowlist), so facts and quotes come from search-engine extracts of atlassian.com pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified. The annual-only quote appears in Atlassian's community announcement; the other quotes come from atlassian.com nonprofit pages. A community forum answer says religious organizations are not eligible; confirm on the live eligibility page. This is a separate program from the existing Atlassian for Startups offer.",
      "evidence": [
        {
          "claim": "Free tier",
          "quote": "for free up to 25 seats billed annually"
        },
        {
          "claim": "Annual plans only",
          "quote": "The 100% off discount on Jira, Loom, Confluence, and Teamwork Collection is only available on annual plans up to 25 seats."
        },
        {
          "claim": "Seats above 25",
          "quote": "you will be charged for each seat with the relevant Social Impact discount"
        },
        {
          "claim": "Verification partner",
          "quote": "Atlassian partners with Goodstack, a social impact technology platform, to verify that applying organizations meet Atlassian's eligibility criteria"
        },
        {
          "claim": "Global Access discount",
          "quote": "85% off Standard and Premium editions of any Atlassian Cloud apps and Marketplace apps instead of the standard 75% off"
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.atlassian.com/teams/nonprofits/discount-pricing",
      "redeemUrl": "https://www.atlassian.com/software/views/social-impact-license-request"
    }
  },
  {
    "id": "o-salesforce-power-of-us-10-donated-licenses",
    "slug": "salesforce-power-of-us-10-donated-licenses",
    "productId": "salesforce",
    "title": "Salesforce Power of Us: 10 donated Enterprise Edition licenses for nonprofits",
    "summary": "Through the Power of Us program, eligible nonprofits get 10 donated Salesforce Enterprise Edition licenses, either Agentforce Nonprofit or Sales and Service, that don't expire.",
    "description": "Salesforce's Power of Us (P10) program donates 10 Enterprise Edition licenses to eligible organizations. Approved organizations pick one bundle: 10 Agentforce Nonprofit – Enterprise Edition licenses (formerly Nonprofit Cloud) or 10 Sales and Service – Enterprise Edition licenses. Organizations already on Unlimited Edition choose product discounts instead. The licenses are free and don't expire, but remain subject to Salesforce's Master Subscription Agreement, and Salesforce offers discounts on additional licenses to eligible nonprofits.\n\nApplicants sign in to the Power of Us Portal with a Trailblazer ID and provide a tax ID and legal documentation such as a 501(c)(3) letter or equivalent. One donation is generally provided per Employer Identification Number (EIN), and fiscally sponsored organizations are accepted. Approval doesn't exempt an organization from US state or local sales tax.",
    "type": "free-plan",
    "categories": [
      "software-deals",
      "saas-discounts"
    ],
    "audiences": [
      "businesses"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "10 donated Enterprise Edition licenses"
    },
    "claim": {
      "method": "application",
      "note": "Apply through the Power of Us Portal using a Trailblazer ID."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Eligible nonprofit organizations (Salesforce's application article also covers educational institutions)",
      "Tax ID and legal documentation, such as a 501(c)(3) letter or equivalent",
      "Fiscally sponsored organizations are accepted",
      "One donation is generally provided per EIN"
    ],
    "redemption": [
      "Sign in to the Power of Us Portal with a Trailblazer ID (create one if prompted)",
      "Submit the application with your tax ID and legal documents",
      "After approval, choose the Agentforce Nonprofit or Sales and Service license bundle"
    ],
    "terms": [
      "10 Agentforce Nonprofit – Enterprise Edition licenses or 10 Sales and Service – Enterprise Edition licenses",
      "Donated licenses are free and do not expire, subject to Salesforce's Master Subscription Agreement and product terms",
      "Organizations on Unlimited Edition choose product discounts instead",
      "Approval does not exempt an organization from US state or local sales tax",
      "Discounts on additional licenses are available to eligible nonprofits"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Salesforce's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (help.salesforce.com is not on the session's network allowlist), so facts and quotes come from search-engine extracts of help.salesforce.com pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified. Approval time differs between sources: the help article says the approval email arrives within 3 business days, while a Trailhead module says up to 2 weeks, so no time is stated in the offer.",
      "evidence": [
        {
          "claim": "Bundles",
          "quote": "10 Nonprofit – Enterprise Edition licenses or 10 Sales and Service – Enterprise Edition licenses"
        },
        {
          "claim": "Current product name",
          "quote": "10 Agentforce Nonprofit – Enterprise Edition licenses (formerly Nonprofit Cloud)"
        },
        {
          "claim": "No expiry",
          "quote": "free of charge and do not expire"
        },
        {
          "claim": "One per EIN",
          "quote": "one donation is generally provided per Employer Identification Number (EIN)"
        }
      ]
    },
    "links": {
      "officialUrl": "https://help.salesforce.com/s/articleView?id=004754266&language=en_US&type=1"
    }
  },
  {
    "id": "o-microsoft-365-business-basic-nonprofit-grant",
    "slug": "microsoft-365-business-basic-nonprofit-grant",
    "productId": "microsoft-365-business",
    "title": "Microsoft 365 Business Basic free for eligible nonprofits (up to 300 users)",
    "summary": "Eligible nonprofits can get up to 300 granted Microsoft 365 Business Basic licenses at no cost, with web and mobile Office apps; Business Premium is discounted rather than granted.",
    "description": "Microsoft's nonprofit program grants eligible organizations up to 300 Microsoft 365 Business Basic licenses at no cost. Business Basic includes the web and mobile versions of the Office apps, not the desktop apps. Microsoft has discontinued the free Business Premium grant; nonprofits can instead buy Business Premium and other Microsoft 365 plans at nonprofit discounts.\n\nGranted licenses are for paid nonprofit staff and unpaid executive staff who act as the organization's leadership, not program participants, members or donors. Microsoft's FAQ says nonprofits must keep at least 85% active usage of their granted licenses or risk disqualification from future grants. Organizations register through Microsoft's nonprofit program and claim the grant from the Nonprofit Hub once approved.",
    "type": "free-plan",
    "categories": [
      "software-deals",
      "saas-discounts"
    ],
    "audiences": [
      "office-tools",
      "businesses"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "Business Basic free for up to 300 users"
    },
    "claim": {
      "method": "application",
      "note": "Register with Microsoft's nonprofit program, then claim the Business Basic grant in the Nonprofit Hub."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Nonprofit organizations approved through Microsoft's nonprofit program",
      "Granted licenses are for paid staff and unpaid executive staff only, not program participants, members or donors"
    ],
    "redemption": [
      "Register your organization with Microsoft's nonprofit program",
      "After approval, sign in to the Nonprofit Hub",
      "Claim the Microsoft 365 Business Basic grant and assign licenses"
    ],
    "terms": [
      "Up to 300 granted Business Basic licenses",
      "Web and mobile apps only; desktop Office apps are not included",
      "Nonprofits must keep at least 85% active usage of granted licenses or risk disqualification from future grants",
      "The Business Premium grant has been discontinued; Business Premium is available at a nonprofit discount"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Microsoft's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (microsoft.com / learn.microsoft.com is not on the session's network allowlist), so facts and quotes come from search-engine extracts of microsoft.com / learn.microsoft.com pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified. Microsoft's nonprofit pricing page (search snapshot about six months old) listed Business Premium at $5.50 user/month paid yearly for nonprofits; that price is left out because it wasn't confirmed as current. The staff-only rule for granted licenses comes from the search summary of Microsoft's FAQ.",
      "evidence": [
        {
          "claim": "Grant size",
          "quote": "up to 300 granted licenses of Microsoft 365 Business Basic"
        },
        {
          "claim": "Usage requirement",
          "quote": "nonprofits must manage within 85% active usage of all granted assigned licenses"
        },
        {
          "claim": "Business Premium grant ended",
          "quote": "Microsoft 365 Business Premium grant discontinued"
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.microsoft.com/en-us/microsoft-365/business/nonprofit-plans-and-pricing",
      "redeemUrl": "https://www.microsoft.com/en-us/nonprofits/offers-for-nonprofits"
    }
  },
  {
    "id": "o-zoho-mail-forever-free-plan",
    "slug": "zoho-mail-forever-free-plan",
    "productId": "zoho-mail",
    "title": "Zoho Mail Forever Free plan: custom-domain email for up to 5 users",
    "summary": "Zoho Mail's Forever Free plan hosts email for one custom domain for up to 5 users, with web and mobile app access.",
    "description": "Zoho Mail's Forever Free plan lets a small team host business email on one custom domain for up to 5 users at no cost. Access is through the web and Zoho's free mobile apps; IMAP and POP access aren't available on free accounts.\n\nThe free plan is currently offered only to accounts signed up under Zoho's US, IN and EU data centers. If you upgrade to a paid plan, every user is billed at that plan's per-user rate.",
    "type": "free-plan",
    "categories": [
      "software-deals",
      "saas-discounts"
    ],
    "audiences": [
      "office-tools",
      "businesses",
      "freelancers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "Free for up to 5 users on one domain"
    },
    "claim": {
      "method": "automatic",
      "note": "Choose the Forever Free plan when signing up for Zoho Mail and verify your domain."
    },
    "regions": {
      "scope": "limited",
      "note": "Only for accounts signed up under Zoho's US, IN and EU data centers."
    },
    "eligibility": [
      "Accounts signed up under Zoho's US, IN or EU data centers",
      "One domain, up to 5 users"
    ],
    "redemption": [
      "Sign up for Zoho Mail and choose the Forever Free plan",
      "Add and verify your domain",
      "Create mailboxes for up to 5 users"
    ],
    "terms": [
      "Up to 5 users and one domain",
      "Web and free mobile app access only; no IMAP or POP",
      "Upgrading to a paid plan bills every user at that plan's per-user rate"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Zoho's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (zoho.com is not on the session's network allowlist), so facts and quotes come from search-engine extracts of zoho.com pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified. Search summaries also gave 5 GB of storage per user and a 25 MB attachment limit; those are left out because no verbatim quote was available. Older community posts mention a 25-user free tier, which is outdated.",
      "evidence": [
        {
          "claim": "5 users free (page title)",
          "quote": "Create Custom Domain Email Address in Zoho Mail - Free for 5 Users"
        },
        {
          "claim": "Users and domain",
          "quote": "you can add up to 5 users to an organization and host one domain for free with web-only access"
        },
        {
          "claim": "Data-center restriction",
          "quote": "currently available only for accounts signed up under the US, IN, and EU data centers"
        },
        {
          "claim": "Access limits",
          "quote": "IMAP and POP access are not available for the free accounts. Access is only available via web and free mobile applications."
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.zoho.com/mail/zohomail-pricing.html",
      "redeemUrl": "https://www.zoho.com/mail/custom-domain-email.html"
    }
  },
  {
    "id": "o-clickup-free-forever-plan",
    "slug": "clickup-free-forever-plan",
    "productId": "clickup",
    "title": "ClickUp Free Forever plan: unlimited members, 60 MB of storage",
    "summary": "ClickUp's Free Forever plan costs $0 and lets a workspace have unlimited members and guests, with 60 MB of file storage.",
    "description": "ClickUp's Free Forever plan is a $0 plan with no time limit. Free Forever workspaces can have an unlimited number of members and guests at no charge.\n\nThe main limits are on storage and usage: ClickUp lists 60 MB of file storage on the free plan (only file attachments count toward it), and its own blog puts the other meaningful limits at five Spaces and 100 automation executions a month.",
    "type": "free-plan",
    "categories": [
      "software-deals",
      "saas-discounts"
    ],
    "audiences": [
      "office-tools",
      "startups",
      "businesses"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up for ClickUp; new workspaces can stay on Free Forever."
    },
    "eligibility": [
      "Anyone with a ClickUp account"
    ],
    "redemption": [
      "Sign up at clickup.com",
      "Create a workspace on the Free Forever plan",
      "Invite members and guests"
    ],
    "terms": [
      "Unlimited members and guests",
      "60 MB of file storage; only file attachments count toward storage",
      "ClickUp's blog lists five Spaces and 100 automation executions a month as the other key limits"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of ClickUp's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (clickup.com is not on the session's network allowlist), so facts and quotes come from search-engine extracts of clickup.com pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified. One third-party review cites 100 MB of storage; ClickUp's pricing page, help center and blog all say 60 MB.",
      "evidence": [
        {
          "claim": "Unlimited members",
          "quote": "Free Forever Workspaces can have an unlimited number of members and guests at no charge."
        },
        {
          "claim": "Limits (ClickUp blog)",
          "quote": "60 MB of file storage, five Spaces, and 100 automation executions a month"
        }
      ]
    },
    "links": {
      "officialUrl": "https://clickup.com/pricing"
    }
  },
  {
    "id": "o-docusign-esignature-30-day-free-trial",
    "slug": "docusign-esignature-30-day-free-trial",
    "productId": "docusign-esignature",
    "title": "Docusign eSignature: 30-day free trial, no credit card required",
    "summary": "Try Docusign eSignature free for 30 days with no credit card; the trial includes many Business Pro features.",
    "description": "Docusign offers a 30-day free trial of eSignature that only needs an email address and a password; no credit card is required. The trial lets you try many of the top features of the Business Pro plan, such as reusable templates, collaborative comments, basic and advanced fields and signing reminders, and you can send documents you create or upload to other people for signature.\n\nBecause no card is taken, you aren't charged when the trial ends. Recipients don't need a Docusign account to sign.",
    "type": "free-trial",
    "categories": [
      "free-trials",
      "saas-discounts"
    ],
    "audiences": [
      "businesses",
      "freelancers",
      "office-tools"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "30-day free trial"
    },
    "claim": {
      "method": "link",
      "note": "Start from Docusign's trial sign-up page."
    },
    "requirements": {
      "cardRequired": false
    },
    "eligibility": [
      "Anyone with a valid email address"
    ],
    "redemption": [
      "Open Docusign's free trial page",
      "Sign up with your email address and a password",
      "Start sending documents for signature"
    ],
    "terms": [
      "30-day trial",
      "No credit card required; you are not charged when the trial ends",
      "Includes many Business Pro plan features",
      "Signers do not need a Docusign account"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Docusign's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (docusign.com is not on the session's network allowlist), so facts and quotes come from search-engine extracts of docusign.com pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified. Several of the Docusign pages in the results were dated (up to about three years old); confirm current trial length and any envelope limits on the sign-up page.",
      "evidence": [
        {
          "claim": "Length (page title)",
          "quote": "Try DocuSign eSignature free for 30 days"
        },
        {
          "claim": "No card",
          "quote": "No credit card required"
        },
        {
          "claim": "Features covered",
          "quote": "allows you to try many of the top features of Docusign eSignature, as found in our Business Pro Plan"
        }
      ]
    },
    "links": {
      "officialUrl": "https://trial.docusign.com/",
      "redeemUrl": "https://trial.docusign.com/"
    }
  },
  {
    "id": "o-quickbooks-online-50-off-first-3-months",
    "slug": "quickbooks-online-50-off-first-3-months",
    "productId": "quickbooks-online",
    "title": "QuickBooks Online: 50% off for the first 3 months for new customers",
    "summary": "New QuickBooks customers get 50% off the base monthly price for their first 3 months when they buy instead of starting a free trial.",
    "description": "Intuit offers new QuickBooks customers 50% off for the first 3 months on QuickBooks Online (and on QuickBooks Workforce and Time), with no coupon code. You choose the 3-month discount option when signing up for a monthly plan; it can't be combined with the 30-day free trial or other QuickBooks offers.\n\nThe discount applies to the base monthly price only, not per-employee or per-contractor fees, state tax filing fees or add-ons. After the 3-month introductory period you're charged monthly at the then-current price, and Intuit says that if you cancel within the first 3 months you won't need to pay extra. Intuit can change or end the offer at any time.",
    "type": "discount",
    "categories": [
      "saas-discounts",
      "software-deals"
    ],
    "audiences": [
      "businesses",
      "freelancers",
      "startups"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "period": "month",
      "durationMonths": 3,
      "savingsLabel": "50% off for 3 months"
    },
    "claim": {
      "method": "automatic",
      "note": "Choose the 3-month discount option when buying a monthly plan; no coupon code needed."
    },
    "requirements": {
      "newCustomersOnly": true
    },
    "eligibility": [
      "New QuickBooks customers",
      "Monthly plan purchased with the 3-month discount option"
    ],
    "redemption": [
      "Go to QuickBooks' pricing or discounts page",
      "Pick a plan and choose the buy-now option with 50% off for 3 months (not the free trial)",
      "Complete checkout"
    ],
    "terms": [
      "Discount applies to the base monthly price only; per-employee, per-contractor, state tax filing and add-on fees are excluded",
      "Free trials aren't eligible for the discount",
      "Can't be combined with any other QuickBooks offer",
      "After the introductory period you're charged monthly at the then-current price",
      "Intuit may modify or end the offer at any time"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Intuit's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (quickbooks.intuit.com is not on the session's network allowlist), so facts and quotes come from search-engine extracts of quickbooks.intuit.com pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified. Search metadata suggests the /discounts/ page is older than Intuit's pricing pages, which also showed 50% off for 3 months. Plan prices are left out because the extracts didn't make clear whether the figures shown were regular or discounted prices. No end date was stated.",
      "evidence": [
        {
          "claim": "New customers only",
          "quote": "The 50% off discount for first 3 months is only available to new QuickBooks customers."
        },
        {
          "claim": "Not with free trial",
          "quote": "Free trials aren't eligible for a discount."
        },
        {
          "claim": "No stacking",
          "quote": "This offer can't be combined with any other QuickBooks offers."
        },
        {
          "claim": "After the offer",
          "quote": "After the Introductory Period, you'll be charged on a monthly basis thereafter at the then-current price."
        },
        {
          "claim": "Can end",
          "quote": "Intuit reserves the right to modify or terminate this offer at any time."
        }
      ]
    },
    "links": {
      "officialUrl": "https://quickbooks.intuit.com/discounts/",
      "redeemUrl": "https://quickbooks.intuit.com/pricing/"
    }
  },
  {
    "id": "o-freshbooks-30-day-free-trial",
    "slug": "freshbooks-30-day-free-trial",
    "productId": "freshbooks",
    "title": "FreshBooks: 30-day free trial, no credit card required",
    "summary": "FreshBooks offers a 30-day free trial of its accounting and invoicing software with no credit card required, and you can cancel anytime.",
    "description": "FreshBooks lets new users try its accounting, invoicing and time-tracking software free for 30 days without entering a credit card, and you can cancel anytime.\n\nIf you buy a plan afterwards, FreshBooks says you can contact it within the first 30 days after purchase for a full refund if you aren't satisfied.",
    "type": "free-trial",
    "categories": [
      "free-trials",
      "saas-discounts"
    ],
    "audiences": [
      "freelancers",
      "businesses"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "30-day free trial"
    },
    "claim": {
      "method": "link",
      "note": "Sign up from FreshBooks' signup page."
    },
    "requirements": {
      "cardRequired": false
    },
    "eligibility": [
      "New FreshBooks users"
    ],
    "redemption": [
      "Open FreshBooks' signup page",
      "Create an account (no card needed)",
      "Use FreshBooks free for 30 days"
    ],
    "terms": [
      "30-day trial",
      "No credit card required",
      "Cancel anytime",
      "Full refund available within 30 days of a purchase if you aren't satisfied"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of FreshBooks's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (freshbooks.com is not on the session's network allowlist), so facts and quotes come from search-engine extracts of freshbooks.com pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified. FreshBooks' US pricing page also showed a time-limited discount (80% off for 4 months in a recent extract; other pages showed different promotions). It is not listed because the current terms and end date couldn't be confirmed.",
      "evidence": [
        {
          "claim": "Trial and no card",
          "quote": "30 days free with no credit card required"
        },
        {
          "claim": "Money-back guarantee",
          "quote": "contact us anytime within the first 30 days after your purchase for a full refund"
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.freshbooks.com/pricing",
      "redeemUrl": "https://www.freshbooks.com/signup"
    }
  },
  {
    "id": "o-mailerlite-nonprofit-30-off",
    "slug": "mailerlite-nonprofit-30-off",
    "productId": "mailerlite",
    "title": "MailerLite for Nonprofits: 30% off all paid plans",
    "summary": "Registered nonprofits get 30% off any paid MailerLite plan, for as long as they subscribe, after submitting proof of nonprofit status.",
    "description": "MailerLite gives officially registered nonprofit organizations 30% off its paid subscription plans, on both legacy (Classic) and new MailerLite. The discount doesn't cover add-ons, applies only to future purchases and stays valid indefinitely. Only the biggest available discount applies, so the 30% nonprofit discount replaces the 10% annual-billing discount rather than stacking with it.\n\nFree-plan users start a 14-day free trial, choose \"nonprofit\" as their industry and contact MailerLite support with official proof of nonprofit status before buying a paid plan. Existing accounts set the industry and contact support before purchasing. Separately, MailerLite sponsors selected organizations with free access to its Power plan for 2 years.",
    "type": "discount",
    "categories": [
      "saas-discounts",
      "software-deals"
    ],
    "audiences": [
      "marketing-tools",
      "businesses"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "savingsLabel": "30% off paid plans"
    },
    "claim": {
      "method": "application",
      "note": "Set your account industry to nonprofit and contact MailerLite support with proof of status before buying a paid plan."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Nonprofit organizations officially registered and recognized by the relevant governmental authority",
      "Official proof of nonprofit status required"
    ],
    "redemption": [
      "Free-plan users: start a 14-day free trial and choose \"nonprofit\" as the industry",
      "Existing accounts: set the industry to nonprofit",
      "Contact MailerLite support with proof of nonprofit status before purchasing a paid plan"
    ],
    "terms": [
      "Applies to all paid subscription plans on legacy (Classic) and new MailerLite; add-ons excluded",
      "Only the biggest available discount applies; it replaces the 10% annual discount",
      "Applies to future purchases only, not past transactions",
      "Valid indefinitely"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of MailerLite's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (mailerlite.com is not on the session's network allowlist), so facts and quotes come from search-engine extracts of mailerlite.com pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified. The claim steps, add-on exclusion, no-stacking rule and indefinite validity come from search summaries of MailerLite's help article and nonprofit terms (https://www.mailerlite.com/legal/terms-for-nonprofit-discount).",
      "evidence": [
        {
          "claim": "Discount size (terms page title)",
          "quote": "Terms of 30% discount for nonprofit organizations at MailerLite"
        },
        {
          "claim": "Plan scope",
          "quote": "The Discount applies to all paid subscription plans in both Legacy (Classic) and new MailerLite."
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.mailerlite.com/help/nonprofit-discount",
      "redeemUrl": "https://www.mailerlite.com/mailerlite-for-nonprofits"
    }
  },
  {
    "id": "o-tally-free-plan-unlimited-forms",
    "slug": "tally-free-plan-unlimited-forms",
    "productId": "tally",
    "title": "Tally Free plan: unlimited forms and submissions",
    "summary": "Tally's free plan includes unlimited forms and unlimited submissions, plus payments, signatures and file uploads, within its fair-use guidelines.",
    "description": "Tally's free plan gives you unlimited forms and unlimited submissions at no cost, as long as you stay within Tally's fair usage guidelines. Free forms can collect payments, signatures and file uploads, with conditional logic and custom thank-you pages.\n\nFile uploads on the free plan are limited to 10 MB per file. Paid plans add team workspaces, unlimited file uploads, custom CSS, code injection and custom domains (Pro), and email verification and submission data retention controls (Business).",
    "type": "free-plan",
    "categories": [
      "software-deals",
      "saas-discounts"
    ],
    "audiences": [
      "marketing-tools",
      "startups",
      "freelancers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0
    },
    "claim": {
      "method": "automatic",
      "note": "Sign up at tally.so; new accounts are on the free plan."
    },
    "eligibility": [
      "Anyone with a Tally account"
    ],
    "redemption": [
      "Sign up at tally.so",
      "Create forms on the free plan"
    ],
    "terms": [
      "Unlimited forms and submissions, subject to Tally's fair usage guidelines",
      "File uploads limited to 10 MB per file on the free plan"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Tally's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (tally.so is not on the session's network allowlist), so facts and quotes come from search-engine extracts of tally.so pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified. Tally's pages disagree on the Pro price ($24/month on the pricing page vs $29/month in help articles), so paid prices are left out.",
      "evidence": [
        {
          "claim": "Free plan",
          "quote": "Tally gives you unlimited forms and submissions, completely free, as long as you stay within our fair usage guidelines."
        },
        {
          "claim": "Free features",
          "quote": "Unlimited forms, Unlimited submissions, Collect payments, Collect signatures, Collect file uploads"
        },
        {
          "claim": "Upload limit",
          "quote": "Our file uploads have a 10MB file size limit."
        },
        {
          "claim": "Paid features",
          "quote": "Upgrade to Tally Pro plan, and you unlock a suite of pro tools: team workspaces, unlimited file uploads, custom CSS, code injection, and custom domains. Tally Business unlocks email verification and submissions data retention control."
        }
      ]
    },
    "links": {
      "officialUrl": "https://tally.so/pricing"
    }
  },
  {
    "id": "o-typeform-nonprofit-educator-discount",
    "slug": "typeform-nonprofit-educator-discount",
    "productId": "typeform",
    "title": "Typeform for Nonprofits and Educators: 40% off yearly plans or 25% off monthly",
    "summary": "People working for a nonprofit, NGO or as educators can get a Typeform coupon for 40% off a yearly plan or 25% off a monthly plan, for as long as they subscribe.",
    "description": "Typeform offers an Educator/NGO discount: 40% off forever on a yearly plan, or 25% off forever on a monthly plan. The discount must match your billing period, so the yearly discount only applies to yearly plans and the monthly discount to monthly plans.\n\nTo get it, fill out Typeform's form to ask support for a coupon, then enter the code on the plan page and click Apply. The discount doesn't make you exempt from sales tax; tax-exempt organizations complete Typeform's separate exemption process before upgrading or renewing.",
    "type": "discount",
    "categories": [
      "saas-discounts",
      "software-deals"
    ],
    "audiences": [
      "marketing-tools",
      "businesses"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "savingsLabel": "40% off yearly plans or 25% off monthly plans, forever"
    },
    "claim": {
      "method": "application",
      "note": "Request a coupon from Typeform support through the form in the help article, then apply it on the plan page."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "People who work for a nonprofit organization or an NGO, or educators"
    ],
    "redemption": [
      "Open Typeform's nonprofit, NGO and student discounts help article",
      "Fill out the form to ask Typeform support for a coupon",
      "On the plan page, enter the code in the discount box and click Apply"
    ],
    "terms": [
      "Yearly plans: 40% off forever; monthly plans: 25% off forever",
      "The discount must match your plan's billing period",
      "Doesn't exempt you from sales tax"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Typeform's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (help.typeform.com is not on the session's network allowlist), so facts and quotes come from search-engine extracts of help.typeform.com pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified. The help article title also mentions student discounts, but student terms didn't appear in the extract, so this offer covers educators and NGOs only. A community post (not official policy) says the code must be applied before purchase.",
      "evidence": [
        {
          "claim": "Monthly discount",
          "quote": "Educator/NGO monthly: 25% discount forever on a monthly plan"
        },
        {
          "claim": "Yearly discount",
          "quote": "Educator/NGO yearly: 40% discount forever on a yearly plan"
        },
        {
          "claim": "Eligibility question",
          "quote": "Do you work for a non-profit organization or an NGO?"
        },
        {
          "claim": "How to apply",
          "quote": "When you're ready to apply for a discount, just fill out this form to ask our support team for a coupon."
        },
        {
          "claim": "Sales tax",
          "quote": "If you're currently receiving a charity or nonprofit discount you will not be automatically exempt from paying sales tax"
        }
      ]
    },
    "links": {
      "officialUrl": "https://help.typeform.com/hc/en-us/articles/360039728951-Non-profit-NGO-and-student-discounts-at-Typeform"
    }
  },
  {
    "id": "o-typeform-for-startups-75-off-business-yearly",
    "slug": "typeform-for-startups-75-off-business-yearly",
    "productId": "typeform",
    "title": "Typeform for Startups: 75% off the Business plan for a year",
    "summary": "Early-stage startups that aren't already paying Typeform customers can get 75% off a yearly Business plan for one year.",
    "description": "Typeform's startup discount gives qualifying startups 75% off the Business plan for a year. The discount is only available on a yearly plan, and it's for new customers, not companies already paying for Typeform.\n\nTypeform's two pages state different thresholds. Its help center lists seed-stage startups with under $1M in funding and under $1M in lifetime revenue. Its startup page FAQ lists startups with less than $5M in funding, fewer than 50 employees and less than 5 years old. Check the form on Typeform's startup page for the criteria that currently apply.",
    "type": "startup",
    "categories": [
      "startup-perks",
      "saas-discounts"
    ],
    "audiences": [
      "startups",
      "marketing-tools"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "period": "year",
      "durationMonths": 12,
      "savingsLabel": "75% off the Business plan for a year"
    },
    "claim": {
      "method": "application",
      "note": "Apply through the form on Typeform's startup page."
    },
    "requirements": {
      "newCustomersOnly": true,
      "approvalRequired": true
    },
    "eligibility": [
      "Not already a paying Typeform customer",
      "Startup page FAQ: less than $5M in funding, fewer than 50 employees, less than 5 years old",
      "Help center: seed stage, under $1M in funding and under $1M in lifetime revenue"
    ],
    "redemption": [
      "Open Typeform's startup page",
      "Submit the startup application form",
      "Apply the discount to a yearly Business plan"
    ],
    "terms": [
      "75% off the Business plan for one year",
      "Yearly Business plan only"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Typeform's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (typeform.com is not on the session's network allowlist), so facts and quotes come from search-engine extracts of typeform.com pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified. Typeform's help center and startup page give different eligibility thresholds; both are listed. A 2022 press release set a sign-up deadline of January 1, 2023, but the current pages still describe the offer with no end date.",
      "evidence": [
        {
          "claim": "Discount (help center)",
          "quote": "If you meet the criteria below, you can sign up to get started with Typeform at 75% off our Business plan for a year. This discount is only available on a yearly plan."
        },
        {
          "claim": "Criteria (startup page FAQ)",
          "quote": "To qualify, your startup must be: 1. Not already be a paying Typeform customer 2. Less then $5M in funding 3. Less then 50 employees 4. Less then 5 years old"
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.typeform.com/typeform-startups",
      "redeemUrl": "https://www.typeform.com/typeform-startups"
    }
  },
  {
    "id": "o-squarespace-14-day-free-trial",
    "slug": "squarespace-14-day-free-trial",
    "productId": "squarespace",
    "title": "Squarespace: 14-day free trial, no credit card required",
    "summary": "Build and preview a Squarespace website free for 14 days without entering a credit card, then upgrade during or after the trial.",
    "description": "Squarespace lets you start a 14-day free trial site without giving credit card details: go to squarespace.com and click Get started. You can build and preview a full site during the trial.\n\nSquarespace has no permanent free plan. You can move to a paid plan during or after the trial to publish the site.",
    "type": "free-trial",
    "categories": [
      "free-trials",
      "saas-discounts"
    ],
    "audiences": [
      "creators",
      "freelancers",
      "businesses"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "14-day free trial"
    },
    "claim": {
      "method": "automatic",
      "note": "Click Get started on squarespace.com; the trial starts without a card."
    },
    "requirements": {
      "cardRequired": false
    },
    "eligibility": [
      "Anyone starting a new Squarespace site"
    ],
    "redemption": [
      "Go to squarespace.com and click Get started",
      "Pick a template and build your site",
      "Upgrade to a paid plan during or after the 14 days"
    ],
    "terms": [
      "14-day trial",
      "No credit card needed to start",
      "No permanent free plan; a paid plan is needed after the trial"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Squarespace's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (squarespace.com is not on the session's network allowlist), so facts and quotes come from search-engine extracts of squarespace.com pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified.",
      "evidence": [
        {
          "claim": "Trial length and how to start",
          "quote": "To start a 14-day free trial, visit squarespace.com and click Get started."
        },
        {
          "claim": "No card",
          "quote": "You don't need to give your credit card information to start a trial."
        }
      ]
    },
    "links": {
      "officialUrl": "https://support.squarespace.com/hc/en-us/articles/206536827-Start-a-Squarespace-trial-site",
      "redeemUrl": "https://www.squarespace.com/free-website-builder-trial"
    }
  },
  {
    "id": "o-webflow-nonprofit-50-off-premium-site-plan",
    "slug": "webflow-nonprofit-50-off-premium-site-plan",
    "productId": "webflow",
    "title": "Webflow for Nonprofits: 50% off an annual Premium Site plan for 12 months",
    "summary": "Eligible nonprofit organizations get 50% off a new annual Premium Site plan for 12 months, one discount per Webflow Workspace per year.",
    "description": "Webflow's Nonprofit Organization (NPO) discount gives eligible organizations 50% off a new annual Premium Site plan for 12 months. It doesn't cover other Site plans, Workspace or Ecommerce plans, or add-ons, and it's limited to one discount per Webflow Workspace per 12-month period.\n\nEligible organizations are primarily engaged in charitable, religious, educational, scientific or literary work, public safety testing, amateur sports, or preventing cruelty to children or animals. Applicants upload one government-issued document, such as an IRS determination letter, a charity registration certificate, an incorporation document or a foreign equivalent. The code only works on a new plan: existing paid users have to cancel and repurchase, and Webflow Support can't apply it manually.",
    "type": "discount",
    "categories": [
      "saas-discounts",
      "software-deals"
    ],
    "audiences": [
      "designers",
      "businesses"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "period": "year",
      "durationMonths": 12,
      "savingsLabel": "50% off an annual Premium Site plan for 12 months"
    },
    "claim": {
      "method": "application",
      "note": "Apply with one government-issued document; the discount code works on a new annual Premium Site plan."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Organizations primarily engaged in charitable, religious, educational, scientific or literary work, public safety testing, amateur sports, or preventing cruelty to children or animals",
      "One government-issued document: IRS determination letter, charity registration certificate, incorporation document or foreign equivalent",
      "You can apply on behalf of another nonprofit without a role in its Workspace"
    ],
    "redemption": [
      "Submit Webflow's NPO discount application with one supporting document",
      "Use the discount code when buying a new annual Premium Site plan",
      "If you already have an active paid plan, cancel it and repurchase with the code"
    ],
    "terms": [
      "50% off a new annual Premium Site plan for 12 months",
      "Not valid on other Site plans, Workspace or Ecommerce plans, or add-ons",
      "One discount per Webflow Workspace per 12-month period",
      "Can't be added to an existing active plan; Webflow Support can't apply it manually"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Webflow's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (help.webflow.com is not on the session's network allowlist), so facts and quotes come from search-engine extracts of help.webflow.com pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified. The exclusions and the cancel-and-repurchase rule come from the search summary of the same help article. Older Webflow wishlist posts describe different nonprofit terms; the help center article is treated as current.",
      "evidence": [
        {
          "claim": "Discount",
          "quote": "Webflow offers a 50% discount off an annual Premium Site plan for 12 months for eligible nonprofit organizations."
        },
        {
          "claim": "Documents",
          "quote": "Accepted documents include IRS determination letters, charity registration certificates, incorporation documents, or foreign equivalents. Upload one document only."
        },
        {
          "claim": "Limit",
          "quote": "Limit: one discount per Webflow Workspace per 12-month period."
        }
      ]
    },
    "links": {
      "officialUrl": "https://help.webflow.com/hc/en-us/articles/33961230168467-Nonprofit-Organization-NPO-discount"
    }
  },
  {
    "id": "o-box-nonprofit-starter-plan-10-free-licenses",
    "slug": "box-nonprofit-starter-plan-10-free-licenses",
    "productId": "box",
    "title": "Box for Nonprofits: first 10 licenses free on the Starter plan",
    "summary": "TechSoup-verified nonprofits get their first 10 Box licenses free on the Starter plan, and Box plans at a minimum 50% discount.",
    "description": "Through Box.org, eligible nonprofits get their first 10 Box licenses free as part of the Starter plan (minimum 3 users). Box says all of its plans are at least 50% off for eligible nonprofit organizations, so larger teams can move to discounted Business plans.\n\nTo qualify, an organization needs legal status in its country equivalent to US 501(c)(3) status and must be verified by the TechSoup Global Network or its local TechSoup partner through a Validation Token, which Box says can take 2 to 5 business days.",
    "type": "free-plan",
    "categories": [
      "software-deals",
      "saas-discounts"
    ],
    "audiences": [
      "office-tools",
      "businesses"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "First 10 licenses free on the Starter plan; Box plans at least 50% off"
    },
    "claim": {
      "method": "verification",
      "note": "Get a TechSoup Validation Token, then sign up for Box's nonprofit plans through Box.org."
    },
    "requirements": {
      "approvalRequired": true
    },
    "eligibility": [
      "Recognized legal status in your country equivalent to 501(c)(3) status under the US Internal Revenue Code",
      "Verified by TechSoup Global Network or your local TechSoup partner via a Validation Token"
    ],
    "redemption": [
      "Request a Validation Token from TechSoup or your local TechSoup partner",
      "Go to Box.org's Get started page and choose the nonprofit Starter plan",
      "Enter your Validation Token to activate the nonprofit pricing"
    ],
    "terms": [
      "First 10 licenses free on the Starter plan (minimum 3 users)",
      "All Box plans at a minimum 50% discount for eligible nonprofits"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Box's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (box.org is not on the session's network allowlist), so facts and quotes come from search-engine extracts of box.org pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified. Box Community threads report that nonprofits who first created an individual free box.com account sometimes couldn't switch to Starter without contacting Box sales or billing@box.com. The redemption steps are a summary of Box.org's Get started page as extracted.",
      "evidence": [
        {
          "claim": "Free licenses",
          "quote": "As a nonprofit, your first 10 licenses are free as part of our Starter plan."
        },
        {
          "claim": "Eligibility",
          "quote": "Nonprofit organizations are eligible for discounted Box products if the organization has a recognized legal status in its respective country equal to 501(c)(3) status under the United States Internal Revenue Code. In addition, organizations must be verified by TechSoup Global Network or the local TechSoup partner via a Validation Token."
        },
        {
          "claim": "Minimum discount",
          "quote": "All Box plans are at a minimum 50% discount for eligible nonprofit organizations."
        }
      ]
    },
    "links": {
      "officialUrl": "https://www.box.org/use-box"
    }
  },
  {
    "id": "o-bitwarden-teams-enterprise-14-day-free-trial",
    "slug": "bitwarden-teams-enterprise-14-day-free-trial",
    "productId": "bitwarden",
    "title": "Bitwarden Teams and Enterprise: 14-day free trial for new organizations",
    "summary": "New Bitwarden Teams, Enterprise and Families organizations come with a built-in 14-day free trial; a free two-person organization is also available.",
    "description": "When you create a new Bitwarden organization on the Families, Teams or Enterprise plan, it starts with a built-in 14-day free trial. Bitwarden doesn't charge until the trial is over, and you can cancel any time from the organization's Settings tab. Upgrading an existing organization doesn't start a new trial.\n\nBitwarden also has a free organization option that lets two users share items in up to two collections, without payment details. Bitwarden's business pricing page lists Teams at $4 per user per month and Enterprise at $6 per user per month, both billed annually.",
    "type": "free-trial",
    "categories": [
      "free-trials",
      "saas-discounts"
    ],
    "audiences": [
      "businesses",
      "developers"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "14-day free trial"
    },
    "claim": {
      "method": "automatic",
      "note": "Create a new Teams or Enterprise organization; the trial starts automatically."
    },
    "eligibility": [
      "New Bitwarden organizations (upgrading an existing organization doesn't start a trial)"
    ],
    "redemption": [
      "Sign in to Bitwarden",
      "Create a new organization and pick Teams or Enterprise",
      "Use it free for 14 days; cancel from the organization's Settings tab if needed"
    ],
    "terms": [
      "14-day trial built into new Families, Teams and Enterprise organizations",
      "No charge until the trial ends; cancel any time from organization Settings",
      "Upgrading an existing organization doesn't start a trial",
      "Listed prices after the trial: Teams $4 and Enterprise $6 per user per month, billed annually"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Bitwarden's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (bitwarden.com is not on the session's network allowlist), so facts and quotes come from search-engine extracts of bitwarden.com pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified. The quotes come from Bitwarden's help pages (organizations overview and quick start) and its business pricing page; some help pages in the results were several years old, so re-check trial terms and prices. No Bitwarden nonprofit discount could be confirmed.",
      "evidence": [
        {
          "claim": "Trial",
          "quote": "New Families, Teams, and Enterprise organization have a 14 day free trial built in!"
        },
        {
          "claim": "Existing organizations",
          "quote": "Upgrading an existing organization to a higher plan will not initiate a 14-day free trial like creating a new organization would."
        },
        {
          "claim": "Prices",
          "quote": "Teams — $4.00 per user per month, billed annually. ... Enterprise — $6.00 per month per user, billed annually."
        }
      ]
    },
    "links": {
      "officialUrl": "https://bitwarden.com/help/about-organizations/",
      "redeemUrl": "https://bitwarden.com/pricing/business/"
    }
  },
  {
    "id": "o-zapier-professional-14-day-free-trial",
    "slug": "zapier-professional-14-day-free-trial",
    "productId": "zapier",
    "title": "Zapier: 14-day free trial of the Professional plan, no payment method required",
    "summary": "New Zapier accounts are enrolled in a free 14-day Professional plan trial with no payment method required, and the account doesn't auto-upgrade when it ends.",
    "description": "Every new Zapier account is automatically enrolled in a free 14-day trial of the Professional plan. No payment method is needed, and the account doesn't auto-upgrade when the trial ends, so there's no surprise charge.\n\nZapier's pricing page lists the Professional plan at $19.99/month billed annually after the trial, with 750 tasks per month.",
    "type": "free-trial",
    "categories": [
      "free-trials",
      "saas-discounts"
    ],
    "audiences": [
      "businesses",
      "startups"
    ],
    "source": "official",
    "pricing": {
      "currency": "USD",
      "dealPrice": 0,
      "savingsLabel": "14-day Professional plan trial"
    },
    "claim": {
      "method": "automatic",
      "note": "Create a new Zapier account; the trial starts automatically."
    },
    "requirements": {
      "cardRequired": false,
      "newCustomersOnly": true
    },
    "eligibility": [
      "New Zapier accounts"
    ],
    "redemption": [
      "Sign up for a Zapier account",
      "The 14-day Professional trial starts automatically",
      "Choose a paid plan before the trial ends if you want to keep Professional features"
    ],
    "terms": [
      "14-day trial of the Professional plan",
      "No payment method required",
      "Account does not auto-upgrade when the trial ends"
    ],
    "publishedAt": "2026-11-02",
    "updatedAt": "2026-11-02",
    "status": "published",
    "verification": {
      "status": "unverified",
      "checkedAt": "2026-11-02",
      "method": "Search extracts of Zapier's official page; live page not checked",
      "note": "The live page could not be fetched from the research environment (help.zapier.com is not on the session's network allowlist), so facts and quotes come from search-engine extracts of help.zapier.com pages. Quotes are the wording shown in those extracts; re-check them on the live page before publishing as verified. Zapier also runs a 15% nonprofit discount, but no verbatim quote of its terms was available, so it isn't listed.",
      "evidence": [
        {
          "claim": "Trial",
          "quote": "When you create a new Zapier account, you're instantly enrolled in a free 14-day trial of the Zapier Professional plan."
        },
        {
          "claim": "No card, no auto-upgrade",
          "quote": "No payment method is required, and your account will not auto-upgrade when the trial ends."
        },
        {
          "claim": "Price after trial (pricing page)",
          "quote": "$19.99/month (billed annually after 14-day free trial)"
        }
      ]
    },
    "links": {
      "officialUrl": "https://help.zapier.com/hc/en-us/articles/8496197192461-Get-started-with-your-free-Zapier-trial",
      "redeemUrl": "https://zapier.com/pricing"
    }
  }
];
