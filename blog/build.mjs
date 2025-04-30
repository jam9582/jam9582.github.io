import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { marked } from 'marked';
import { join } from 'path';
import matter from 'gray-matter';

const postsDir = './blog/posts';
const outputDir = './blog/docs';
const templateDir = './blog/templates';

if (!existsSync(outputDir)) {
  mkdirSync(outputDir);
}

const posts = readdirSync(postsDir).filter(file => file.endsWith('.md'));

const postTemplate = readFileSync(join(templateDir, 'post.html'), 'utf-8');
const indexTemplate = readFileSync(join(templateDir, 'index.html'), 'utf-8');

const postCards = [];

posts.forEach(file => {
  const slug = file.replace('.md', '');
  const raw = readFileSync(join(postsDir, file), 'utf-8');
  const { data, content } = matter(raw);

  const htmlContent = marked(content);

  const finalPost = postTemplate
    .replace('{{title}}', data.title || slug)
    .replace('{{date}}', data.date || '')
    .replace('{{tags}}', (data.tags || []).map(tag => `#${tag}`).join(' '))
    .replace('{{content}}', htmlContent);

  writeFileSync(join(outputDir, `${slug}.html`), finalPost);

  postCards.push(`
    <div class="post-card">
      <a href="${slug}.html" style="text-decoration:none; color:inherit;">
        <div class="post-meta">${data.date || ''} · ${(data.tags || []).map(tag => `#${tag}`).join(' ')}</div>
        <h3>${data.title || slug}</h3>
        <p>${data.summary || ''}</p>
      </a>
    </div>
  `);
});

const finalIndex = indexTemplate.replace('{{posts}}', postCards.join('\n'));
writeFileSync(join(outputDir, 'index.html'), finalIndex);
