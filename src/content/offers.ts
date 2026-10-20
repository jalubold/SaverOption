/**
 * Offers — generated from research notes on 2026-10-17 and 2026-10-19.
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
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-17",
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
      "checkedAt": "2026-10-17",
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
      "checkedAt": "2026-10-17",
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
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-17",
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
      "checkedAt": "2026-10-17",
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
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-17",
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
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-17",
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
      "checkedAt": "2026-10-17",
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
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-17",
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
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-17",
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
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-17",
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
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-17",
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
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Taken from the provider's official site via search extracts. Not yet confirmed on the live page.",
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
      ]
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
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Taken from the provider's official site via search extracts. Not yet confirmed on the live page.",
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
      ]
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
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Taken from the provider's official site via search extracts. Not yet confirmed on the live page.",
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
      ]
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
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Taken from the provider's official site via search extracts. Not yet confirmed on the live page.",
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
      ]
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
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-17",
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
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-17",
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
      "checkedAt": "2026-10-17",
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
      "checkedAt": "2026-10-17",
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
      "Requires a Mac; BetterDisplay 5 needs macOS 26 Tahoe (26.3 or later), BetterDisplay 4 supports macOS Ventura (13.2 or later) through Tahoe"
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
    "updatedAt": "2026-10-17",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-17",
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
    "updatedAt": "2026-10-19",
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
      "status": "unverified",
      "method": "Search extracts of AWS's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
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
      "status": "unverified",
      "method": "Search extracts of Cloudflare's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
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
      "status": "unverified",
      "method": "Search extracts of DigitalOcean's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
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
      "status": "unverified",
      "method": "Search extracts of MongoDB's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
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
      "status": "unverified",
      "method": "Search extracts of Oracle's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
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
      "status": "unverified",
      "method": "Search extracts of Vercel's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
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
      "status": "unverified",
      "method": "Search extracts of Neon's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
    "status": "published",
    "source": "official",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of NVIDIA's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
    "status": "published",
    "source": "official",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of ElevenLabs's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
    "status": "published",
    "source": "official",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of OpenAI's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
    "status": "published",
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
      ]
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
    "updatedAt": "2026-10-19",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19",
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
    "updatedAt": "2026-10-19",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of PostHog's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Intercom's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Sentry's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Mixpanel's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Zendesk's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of HubSpot's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Figma's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Notion's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of AWS's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Microsoft's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Oracle's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Cloudflare's official page; live page not checked",
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
      ]
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
      "checkedAt": "2026-10-19",
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
    "updatedAt": "2026-10-19",
    "status": "published",
    "source": "official",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of OpenAI's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-19",
    "status": "published",
    "source": "official",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Kiro (AWS)'s official page; live page not checked",
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
      ]
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
      "status": "unverified",
      "method": "Search extracts of Cognition (Devin)'s official page; live page not checked",
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
      ]
    },
    "links": {
      "officialUrl": "https://devin.ai/blog/gemini-4-argon",
      "redeemUrl": "https://docs.devin.ai/desktop/models"
    },
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-19",
    "status": "published",
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
    "updatedAt": "2026-10-19",
    "status": "published",
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
      "status": "unverified",
      "method": "Search extracts of Figma's official page; live page not checked",
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
      ]
    },
    "links": {
      "officialUrl": "https://www.figma.com/pricing-faq/",
      "redeemUrl": "https://help.figma.com/hc/en-us/articles/44193259600535-Code-layers-in-Figma-Design"
    },
    "publishedAt": "2026-10-19",
    "updatedAt": "2026-10-19",
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
    "updatedAt": "2026-10-20",
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
      "status": "unverified",
      "method": "Search extracts of Clockify's official page; live page not checked",
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
      ]
    },
    "links": {
      "officialUrl": "https://clockify.me/help/administration/updates-to-clockify-free-plan",
      "redeemUrl": "https://clockify.me/pricing"
    }
  },
  {
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-20",
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
      "status": "unverified",
      "method": "Search extracts of Calendly's official page; live page not checked",
      "note": "Official site was not reachable from the research environment; figures taken from search-result extracts of the provider's own pages. Re-check before publishing as verified.",
      "evidence": [
        {
          "claim": "Free plan contents",
          "quote": "Free: Always free. Includes: Scheduling - One event type - One calendar connection - One-on-one scheduling - Customizable booking page - Browser extension"
        }
      ]
    },
    "links": {
      "officialUrl": "https://calendly.com/pricing"
    }
  },
  {
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-20",
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
      "status": "unverified",
      "method": "Search extracts of Shopify's official page; live page not checked",
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
      ]
    },
    "links": {
      "officialUrl": "https://www.shopify.com/pricing",
      "redeemUrl": "https://www.shopify.com/start"
    }
  },
  {
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-20",
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
      "status": "unverified",
      "method": "Search extracts of 1Password's official page; live page not checked",
      "note": "Official site was not reachable from the research environment; figures taken from search-result extracts of the provider's own pages. Re-check before publishing as verified.",
      "evidence": [
        {
          "claim": "Trial length and card",
          "quote": "Try free for 14 days, no credit card required"
        }
      ]
    },
    "links": {
      "officialUrl": "https://1password.com/pricing/business"
    }
  },
  {
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-20",
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
      "status": "unverified",
      "method": "Search extracts of Slack's official page; live page not checked",
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
      ]
    },
    "links": {
      "officialUrl": "https://slack.com/help/articles/27204752526611-Feature-limitations-on-the-free-version-of-Slack",
      "redeemUrl": "https://slack.com/pricing/free"
    }
  },
  {
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-20",
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
      "status": "unverified",
      "method": "Search extracts of Dropbox's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Framer's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Descript's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Blackmagic Design's official page; live page not checked",
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
      ]
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
      "Free for as long as the use is part of your studies or the course you teach",
      "Includes 50 GB of storage"
    ],
    "publishedAt": "2026-10-20",
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Sketch's official page; live page not checked",
      "note": "sketch.com was not reachable from the research environment. An older Sketch blog post mentions 5GB of storage; the 50 GB figure is from the current support page. The support page also says \"for one year\" while stating use is free for as long as it is part of your studies or teaching; access may need re-applying (renewal) after a year.",
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
        }
      ]
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
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Riverside's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Restream's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-20",
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
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Google's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Trello's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Airtable's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Mailchimp's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Kit's official page; live page not checked",
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
      ]
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
    "updatedAt": "2026-10-20",
    "status": "published",
    "verification": {
      "status": "unverified",
      "method": "Search extracts of Buffer's official page; live page not checked",
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
      ]
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
  }
];
