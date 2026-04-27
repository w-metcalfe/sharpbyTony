import {type StructureBuilder} from 'sanity/structure'

// JC #16: siteSettings is explicitly listed via custom list item with a fixed documentId
// so it cannot be duplicated. All other types are listed explicitly rather than using
// S.documentTypeListItems().filter(...) to keep the sidebar order and labels predictable.
export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings'),
        ),
      S.divider(),
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('client').title('Clients'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
    ])
