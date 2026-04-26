import { notFound } from 'next/navigation';
import { getAllSeoParams, getSeoPage, LANGS } from '../../../data/seoPages';
import SeoPageTemplate from '../../../components/SeoPageTemplate';
import Layout from '../../../components/Layout';

const BASE_URL = 'https://jetx.vip';

export async function generateStaticParams() {
  return getAllSeoParams();
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;

  if (!LANGS.includes(lang)) return {};

  const page = getSeoPage(slug);
  if (!page) return {};

  const content = page.content[lang];
  if (!content) return {};

  const canonical = `${BASE_URL}/${lang}/${slug}`;

  const languages = {};
  LANGS.forEach((l) => {
    languages[l] = `${BASE_URL}/${l}/${slug}`;
  });
  languages['x-default'] = `${BASE_URL}/en/${slug}`;

  return {
    title: content.title,
    description: content.metaDescription,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: content.title,
      description: content.metaDescription,
      url: canonical,
      siteName: 'JetX.vip',
      type: 'website',
    },
  };
}

export default async function SeoLandingPage({ params }) {
  const { lang, slug } = await params;

  if (!LANGS.includes(lang)) return notFound();

  const page = getSeoPage(slug);
  if (!page) return notFound();

  const content = page.content[lang];
  if (!content) return notFound();

  return (
    <Layout>
      <SeoPageTemplate page={page} lang={lang} />
    </Layout>
  );
}
