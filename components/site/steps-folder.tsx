import { Folder } from "@/components/site/folder";

// Numbered "how it works" folder used on /contact and /services. Copy comes
// from ui.json (`contact.next`, `services.process`) and its Bahasa overlay.

export type StepsCopy = {
  tab: string;
  heading: string;
  steps: { title: string; body: string }[];
  noteHeading: string;
  note: string;
};

export function StepsFolder({ copy, n, id }: { copy: StepsCopy; n: string; id: string }) {
  const headingId = `${id}-heading`;
  return (
    <Folder tab={copy.tab} n={n} id={id} bodyClassName="f-steps" labelledBy={headingId}>
      <h2 id={headingId} className="f-case-h">
        {copy.heading}
      </h2>
      <ol className="f-steps__list" role="list">
        {copy.steps.map((step, i) => (
          <li key={step.title} className="f-steps__item">
            <span className="f-meta f-steps__n" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="f-body">{step.title}</h3>
              <p className="f-action f-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="f-steps__note">
        <h3 className="f-meta">{copy.noteHeading}</h3>
        <p className="f-body">{copy.note}</p>
      </div>
    </Folder>
  );
}
