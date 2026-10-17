/**
 * Offers — generated from research notes on 2026-10-17.
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
  }
];
