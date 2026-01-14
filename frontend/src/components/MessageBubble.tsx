import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import { github, atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { cleanText } from '../utils/formatter';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('python', python);

interface Props {
  role: 'user' | 'assistant';
  content: string;
  theme: 'light' | 'dark';
}

export default function MessageBubble({ role, content, theme }: Props) {
  const isUser = role === 'user';
  const isDark = theme === 'dark';

  const bubbleStyle = isUser
    ? 'ml-auto bg-blue-600 text-white'
    : isDark
    ? 'mr-auto bg-[#2b2d31] text-gray-100'
    : 'mr-auto bg-gray-100 text-gray-900';

  const cleaned = cleanText(content || '');
  const codeBlocks = cleaned.match(/```[\s\S]+?```/g);
  const hasCode = !!codeBlocks;

  const renderCode = (block: string, index: number) => {
    const langMatch = block.match(/```(\w+)/);
    const lang = langMatch ? langMatch[1] : 'plaintext';
    const code = block.replace(/```[\w]*\n?/, '').replace(/```$/, '');

    return (
      <div key={`code-${index}`} className="relative group mt-2">
        <SyntaxHighlighter
          language={lang}
          style={isDark ? atomOneDark : github}
          customStyle={{
            borderRadius: '0.75rem',
            padding: '1rem',
            fontSize: '0.85rem',
            background: isDark ? '#1f2023' : '#f5f5f5',
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}
        >
          {code}
        </SyntaxHighlighter>

        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(code)}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Скопировать"
        >
          <img src="/icons/copy.svg" alt="copy" className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const renderText = () => {
    if (!hasCode) {
      return (
        <p className="whitespace-pre-wrap leading-tight break-words m-0">
          {cleaned}
        </p>
      );
    }

    const parts = cleaned.split(/```[\s\S]+?```/g);
    const blocks = cleaned.match(/```[\s\S]+?```/g) || [];

    return parts.map((text, i) => (
      <div key={`block-${i}`} className="mb-2 last:mb-0">
        {text.trim() && (
          <p className="whitespace-pre-wrap leading-tight break-words m-0">
            {cleanText(text)}
          </p>
        )}
        {blocks[i] && renderCode(blocks[i], i)}
      </div>
    ));
  };

  return (
    <div
      className={`
        max-w-full sm:max-w-3xl px-4 py-3 rounded-2xl text-sm
        ${bubbleStyle}
      `}
    >
      {renderText()}
    </div>
  );
}
