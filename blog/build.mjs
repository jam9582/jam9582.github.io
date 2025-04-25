
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 경로 설정
const postsDir = path.join(__dirname, 'posts');
const outputDir = path.join(__dirname, 'public');
const templatesDir = path.join(__dirname, 'templates');

const indexTemplate = fs.readFileSync(path.join(templatesDir, 'index.html'), 'utf-8');
const postTemplate = fs.readFileSync(path.join(templatesDir, 'post.html'), 'utf-8');

let postListHtml = '';

fs.readdirSync(postsDir).forEach((filename) => {
  const filePath = path.join(postsDir, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { content, data } = matter(raw);
  const html = marked(content);
  const slug = filename.replace(/\.md$/, '');

  // 카드형 포스트 HTML 생성
  const cardHtml = `
  <div class="post-card">
    <a href="${slug}.html" style="text-decoration:none; color:inherit;">
      <div class="post-meta">${data.date || ''} · ${(data.tags || []).map(tag => '#' + tag).join(' ')}</div>
      <h3>${data.title || slug}</h3>
      <p>${data.summary || ''}</p>
    </a>
  </div>
  `;
  postListHtml += cardHtml;

  // 개별 글 HTML 생성
  const postHtml = postTemplate
    .replace(/\{\{title\}\}/g, data.title || slug)
    .replace(/\{\{content\}\}/g, html)
    .replace(/\{\{date\}\}/g, data.date || '')
    .replace(/\{\{tags\}\}/g, (data.tags || []).map(tag => '#' + tag).join(' '));

  fs.writeFileSync(path.join(outputDir, `${slug}.html`), postHtml);
});

// 인덱스 페이지 생성
const indexHtml = indexTemplate.replace('{{posts}}', postListHtml);
fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);

console.log('✅ Stack 스타일 블로그 빌드 완료!');
