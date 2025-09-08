import sanitizeHtml from 'sanitize-html';
import * as cheerio from 'cheerio';

export function sanitizeNonTrustedHtml(html?: string) {
  if (!html) return undefined;

  return sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'video', 'audio'],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes, // Keep existing allowed attributes
      img: ['src', 'alt', 'width', 'height'], // Add attributes for <img>
      video: ['src', 'alt', 'width', 'height', 'controls'],
      audio: ['src', 'controls'],
      div: ['style'],
      '*': ['data-*', 'class'],
    },
  });
}

export function fixAttachmentsLinks(html?: string) {
  if (!html) return undefined;
  const $ = cheerio.load(html);
  $('.bn-file-name-with-icon').each(function (this) {
    const originalDiv = $(this);
    const contentBlock = originalDiv.closest('.bn-block-content');
    const url = contentBlock.attr('data-url');
    const originalFileWithIconHtml = originalDiv.html();
    let anchor = $('<a></a>').attr('href', url).addClass('bn-file-name-with-icon');
    if (originalFileWithIconHtml) {
      anchor = anchor.html(originalFileWithIconHtml);
    }
    originalDiv.replaceWith(anchor);
  });
  return $.html();
}
