import { config, fields, collection, singleton } from '@keystatic/core';

const bilingualText = (label: string, multiline = false) =>
  fields.object(
    {
      de: multiline
        ? fields.text({ label: `${label} (DE)`, multiline: true })
        : fields.text({ label: `${label} (DE)` }),
      en: multiline
        ? fields.text({ label: `${label} (EN)`, multiline: true })
        : fields.text({ label: `${label} (EN)` }),
    },
    { label },
  );

const bilingualDoc = (label: string) =>
  fields.object(
    {
      de: fields.document({
        label: `${label} (DE)`,
        formatting: { inlineMarks: { bold: true, italic: true }, listTypes: { unordered: true, ordered: true } },
        links: true,
      }),
      en: fields.document({
        label: `${label} (EN)`,
        formatting: { inlineMarks: { bold: true, italic: true }, listTypes: { unordered: true, ordered: true } },
        links: true,
      }),
    },
    { label },
  );

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'fnfbn' },
  },
  collections: {
    locations: collection({
      label: 'Locations',
      slugField: 'slug',
      path: 'src/content/locations/*',
      format: { data: 'yaml' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug' } }),
        title: bilingualText('Title'),
        address: bilingualText('Address', true),
        dates: bilingualText('Dates / Schedule', true),
        image: fields.image({
          label: 'Image',
          directory: 'public/uploads/locations',
          publicPath: '/uploads/locations/',
        }),
        link: fields.url({ label: 'External link', description: 'Optional' }),
        order: fields.integer({ label: 'Order', defaultValue: 0 }),
      },
    }),
    contributors: collection({
      label: 'Contributors',
      slugField: 'slug',
      path: 'src/content/contributors/*',
      format: { data: 'yaml' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug' } }),
        name: fields.text({ label: 'Name' }),
        role: bilingualText('Role'),
        photo: fields.image({
          label: 'Photo',
          directory: 'public/uploads/contributors',
          publicPath: '/uploads/contributors/',
        }),
        link: fields.url({ label: 'External link' }),
        order: fields.integer({ label: 'Order', defaultValue: 0 }),
      },
    }),
  },
  singletons: {
    hero: singleton({
      label: 'Hero',
      path: 'src/content/_singletons/hero',
      format: { data: 'yaml' },
      schema: {
        formingLine: bilingualText('Top line (Forming Nature)'),
        formedLine: bilingualText('Bottom line (Formed by Nature)'),
        subtitle: bilingualText('Subtitle'),
        badge: bilingualText('Badge text'),
      },
    }),
    about: singleton({
      label: 'About section',
      path: 'src/content/_singletons/about',
      format: { data: 'yaml' },
      schema: {
        heading: bilingualText('Heading'),
        body: bilingualText('Body', true),
      },
    }),
    teamIntro: singleton({
      label: 'Team intro',
      path: 'src/content/_singletons/team-intro',
      format: { data: 'yaml' },
      schema: {
        heading: bilingualText('Heading'),
        body: bilingualText('Body', true),
      },
    }),
    contributorsSection: singleton({
      label: 'Contributors section',
      path: 'src/content/_singletons/contributors-section',
      format: { data: 'yaml' },
      schema: {
        heading: bilingualText('Heading'),
      },
    }),
    locationsSection: singleton({
      label: 'Locations section',
      path: 'src/content/_singletons/locations-section',
      format: { data: 'yaml' },
      schema: {
        heading: bilingualText('Heading'),
      },
    }),
    contact: singleton({
      label: 'Contact section',
      path: 'src/content/_singletons/contact',
      format: { data: 'yaml' },
      schema: {
        heading: bilingualText('Heading'),
        intro: bilingualText('Intro', true),
        recipientEmail: fields.text({
          label: 'Recipient email',
          description: 'Where Netlify Forms forwards the submissions',
        }),
      },
    }),
    footer: singleton({
      label: 'Footer',
      path: 'src/content/_singletons/footer',
      format: { data: 'yaml' },
      schema: {
        formingLine: bilingualText('Top line'),
        formedLine: bilingualText('Bottom line'),
        subtitle: bilingualText('Subtitle'),
      },
    }),
  },
});
