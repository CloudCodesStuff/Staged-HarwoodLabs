import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: 'What kind of projects can I manage with Staged?',
    answer:
      "Staged is designed for any client-based project, especially creative and digital services. It's perfect for freelancers and small studios managing web design, branding, content creation, and consulting projects where you need to share files, organize folders, and gather feedback.",
  },
  {
    question:
      'How is Staged different from using a shared Google Drive or Dropbox?',
    answer:
      'Staged is more than just file sharing. It provides a clean, branded client portal with dedicated spaces for project milestones and feedback threads, so your clients always know where to find the latest files and updates.',
  },
  {
    question: 'Can I customize the portal with my own branding?',
    answer:
      'Yes! You can modify brand colors to the portal. (Custom domains and advanced branding are coming soon.)',
  },

  {
    question: 'Can clients leave feedback or comments?',
    answer:
      'Yes, clients can leave feedback and comments directly on the portal, making collaboration and communication easy and organized.',
  },
  {
    question: 'How are files organized?',
    answer:
      'You can organize files into folders and subfolders for each project, making it easy to keep everything structured and accessible for your clients.',
  },
];

export function Faq() {
  return (
    <section className="px-6 py-24" id="faq">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="mb-6 font-head font-medium text-6xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
            Have questions? We've got answers. If you can't find what you're
            looking for, feel free to contact us.
          </p>
        </div>
        <Accordion className="w-full" collapsible type="single">
          {faqItems.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
