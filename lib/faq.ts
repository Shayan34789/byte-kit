export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "Are Byte-Kit tools really free?",
    answer:
      "Yes. Every tool is free to use with no limits, no sign-up, and no paid tiers.",
  },
  {
    question: "Is my data uploaded to a server?",
    answer:
      "No. All tools run entirely in your browser using JavaScript and built-in browser APIs. Nothing you paste or upload ever leaves your device.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. There are no accounts, no login, and nothing to manage — just open a tool and use it.",
  },
  {
    question: "Which browsers are supported?",
    answer:
      "Any modern browser, including Chrome, Edge, Firefox, and Safari. The tools rely on standard web APIs available in all of them.",
  },
  {
    question: "Can I use the tools offline?",
    answer:
      "Once a page has loaded, the tools make no network requests at all, so they keep working even if your connection drops.",
  },
  {
    question: "Are my files safe with the image tools?",
    answer:
      "Yes. Images are processed locally with the Canvas API and never uploaded anywhere. The EXIF Remover can even strip hidden location and device metadata before you share a photo.",
  },
];
