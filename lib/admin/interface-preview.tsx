import { CookieConsentBanner } from "@/components/analytics/CookieConsent";
import { PortfolioShell } from "@/components/portfolio-shell";
import { AboutView } from "@/components/site/about-view";
import { ArticleView } from "@/components/site/article-view";
import { CaseStudyView } from "@/components/site/case-study-view";
import { ContactView } from "@/components/site/contact-view";
import { HomeView } from "@/components/site/home-view";
import { JournalIndex } from "@/components/site/journal-index";
import { NotFoundView } from "@/components/site/not-found-view";
import { PrivacyView } from "@/components/site/privacy-view";
import { ServiceView } from "@/components/site/service-view";
import { WorkView } from "@/components/site/work-view";
import { projects } from "@/lib/content";
import { getInterfacePreviewSite, getSite, localizeProject } from "@/lib/i18n";
import { LangProvider } from "@/lib/i18n/context";
import { localePath } from "@/lib/i18n/routes";
import { languageTargets } from "@/lib/i18n/targets";
import { postLang } from "@/lib/post-lang";
import { formatDate, getPosts } from "@/lib/posts";
import { pickRelated } from "@/lib/related-posts";

export function interfacePreview(section: string, draft: Record<string, unknown>, field?: string) {
  const site = getInterfacePreviewSite(draft);
  const posts = getPosts("id");
  let path = "/";
  let view;

  const commonViews: Record<string, string> = {
    location: "about",
    seeTheWork: "about",
    backHome: "notFound",
    backToTop: "journal",
    opensNewTab: "work",
  };
  const viewSection = section === "common" && field
    ? commonViews[field] ?? section
    : section === "services" && field === "more" ? "article" : section;

  switch (viewSection) {
    case "about":
    case "receipt":
      path = "/about";
      view = <AboutView />;
      break;
    case "contact":
    case "note":
      path = "/contact";
      view = <ContactView preview previewField={section === "contact" ? field : undefined} />;
      break;
    case "strip":
    case "work":
      path = "/work";
      view = <WorkView previewEmpty={section === "work" && field?.startsWith("empty")} />;
      break;
    case "caseStudy": {
      const fallback = getSite("en");
      const example = projects.find((project) => !project.draft);
      const project = site.caseStudies[0] ?? fallback.caseStudies[0] ?? (example && localizeProject(example, "id"));
      path = "/work";
      view = project
        ? <CaseStudyView site={site.caseStudies.length ? site : { ...site, works: fallback.works }} project={project} preview />
        : <p className="f-body">A case study is needed to preview this section.</p>;
      break;
    }
    case "journal":
      path = "/journal";
      view = <JournalIndex posts={section === "journal" && field?.startsWith("empty") ? [] : posts} language="id" site={site} />;
      break;
    case "article": {
      const post = posts[0];
      path = "/journal";
      view = post ? (
        <ArticleView
          post={post}
          position={1}
          total={posts.length}
          language="id"
          lang={postLang("id", post.slug, post.alternate)?.link}
          date={formatDate("id", post.date)}
          ui={site.ui}
          related={[
            ...pickRelated(post, posts).map((p) => ({
              href: localePath("id", `/journal/${p.slug}`),
              title: p.title,
              meta: formatDate("id", p.date),
            })),
            ...site.serviceLinks.map((link) => ({ href: link.href, title: link.label, meta: site.ui.services.more })),
          ]}
        />
      ) : <p className="f-body">A Bahasa journal entry is needed to preview this section.</p>;
      break;
    }
    case "services":
      view = site.services[0]
        ? <ServiceView site={site} page={site.services[0]} preview />
        : <p className="f-body">A Bahasa service page is needed to preview this section.</p>;
      break;
    case "privacy":
      view = <PrivacyView site={site} />;
      break;
    case "notFound":
      path = "/missing";
      view = <NotFoundView />;
      break;
    default:
      view = <HomeView latest={posts.slice(0, 3).map((p) => ({
        href: localePath("id", `/journal/${p.slug}`),
        title: p.title,
        date: formatDate("id", p.date),
      }))} />;
  }

  return (
    <LangProvider lang="id" targets={languageTargets()} previewUi={draft}>
      <PortfolioShell previewPath={path}>{view}</PortfolioShell>
      {section === "cookie" && <CookieConsentBanner key="preview-cookie" preview />}
    </LangProvider>
  );
}
