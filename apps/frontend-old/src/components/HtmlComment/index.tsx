export const HtmlComment = ({ text }: { text: string }) => (
  <span dangerouslySetInnerHTML={{ __html: `<!-- ${text} -->` }} />
);
