'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, BookOpen, RefreshCw, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type Word = { word: string; description: string; useCase: string };
const endpoint = process.env.NEXT_PUBLIC_API_URL || 'https://fiap-bff-10aojr.onrender.com/ask';

function validWords(value: unknown): value is Word[] {
  return Array.isArray(value) && value.length <= 50 && value.every(item => item && ['word', 'description', 'useCase'].every(key => typeof item[key] === 'string' && item[key].trim().length > 0));
}

export default function Home() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const request = useRef<AbortController | null>(null);
  const loadWords = useCallback(async () => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true); setError('');
    const timeout = setTimeout(() => controller.abort('timeout'), 60000);
    try {
      const response = await fetch(endpoint, { signal: controller.signal });
      if (!response.ok) throw new Error(response.status === 429 ? 'Muitas consultas em pouco tempo. Aguarde um minuto e tente novamente.' : 'Não foi possível buscar as palavras agora. Tente novamente em instantes.');
      const result: unknown = await response.json();
      if (!validWords(result)) throw new Error('A resposta recebida está incompleta. Tente buscar as palavras novamente.');
      setWords(result);
      return { ok: true, count: result.length };
    } catch (cause) {
      if (controller.signal.aborted && controller.signal.reason !== 'timeout') return;
      setError(controller.signal.reason === 'timeout' ? 'A consulta demorou mais que o esperado. Tente novamente.' : cause instanceof Error && cause.message !== 'Failed to fetch' ? cause.message : 'Não foi possível conectar. Confira sua conexão e tente novamente.');
    } finally {
      clearTimeout(timeout);
      if (request.current === controller) setLoading(false);
    }
  }, []);
  useEffect(() => { void loadWords(); return () => request.current?.abort(); }, [loadWords]);
  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool: (tool: object, options: { signal: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(context.registerTool({
        name: 'refresh_vocabulary',
        description: 'Busca cinco palavras na API e atualiza os cartões de estudo visíveis.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: true },
        execute: async (input: unknown) => {
          if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length) throw new Error('Use um objeto vazio.');
          const result = await loadWords();
          if (!result?.ok) throw new Error('A consulta não foi concluída. Confira a mensagem na página.');
          return result;
        },
      }, { signal: lifecycle.signal })).catch(() => {});
    } catch { /* Navegadores sem suporte continuam usando a interface normalmente. */ }
    return () => lifecycle.abort();
  }, [loadWords]);


  return (
    <div className="site-shell">
      <a className="skip-link" href="#words">Pular para as palavras</a>
      <header className="site-header">
        <a href="/" className="brand"><span className="brand-mark" aria-hidden="true">w.</span><span>word<span className="brand-light">by</span>word</span></a>
        <span className="header-note"><span className="status-dot" />Seu inglês, uma palavra por vez.</span>
        <span className="language-tag">EN <ArrowRight size={14} aria-hidden="true" /> PT</span>
      </header>
      <main>
        <section className="intro" aria-labelledby="title">
          <div><p className="eyebrow"><BookOpen size={16} aria-hidden="true" /> SEU MOMENTO DE INGLÊS</p><h1 id="title">Pequenas palavras.<br /><span>Novas possibilidades.</span></h1><p className="intro-copy">Descubra palavras, entenda o significado e veja como usar.<br className="desktop-break" /> Um pouco de prática faz parte de uma grande mudança.</p></div>
          <div className="practice-note"><span className="note-number">01 /</span><p>Leia a palavra.<br />Explore o exemplo.<br /><strong>Use em uma frase sua.</strong></p><ArrowUpRight size={26} aria-hidden="true" /></div>
        </section>
        <section id="words" className="word-section" aria-labelledby="words-heading" aria-busy={loading}>
          <div className="section-toolbar"><div><p className="eyebrow">EXPLORE & PRATIQUE</p><h2 id="words-heading">Sua próxima descoberta<span className="count">{words.length || '—'}</span></h2></div><Button className="refresh-button" onClick={() => void loadWords()} disabled={loading}><RefreshCw size={17} aria-hidden="true" className={loading ? 'spin' : ''} />{loading ? 'Buscando palavras…' : 'Buscar novas palavras'}</Button></div>
          <p className="sr-only" role="status" aria-live="polite">{loading ? 'Buscando palavras. Isso pode levar até um minuto.' : error ? '' : `${words.length} palavras disponíveis para estudar.`}</p>
          {error && <div className="message error-message" role="alert"><strong>Vamos tentar de novo?</strong><p>{error}</p>{words.length > 0 && <p>As palavras da última consulta continuam disponíveis abaixo.</p>}<Button variant="outline" className="retry-button" onClick={() => void loadWords()}>Tentar novamente</Button></div>}
          {loading && words.length === 0 ? <div className="word-grid" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <div className="word-card loading-card" key={i}><Skeleton className="h-5 w-10" /><Skeleton className="mt-7 h-10 w-3/5" /><Skeleton className="mt-6 h-5 w-full" /><Skeleton className="mt-2 h-5 w-4/5" /><Skeleton className="mt-9 h-20 w-full" /></div>)}</div> : <div className="word-grid">{words.map((item, index) => <article className="word-card" key={`${index}-${item.word}`}><div className="card-top"><span className="word-index">{String(index + 1).padStart(2, '0')}</span><span className="card-tag">VOCABULÁRIO</span></div><h3 lang="en">{item.word}</h3><p className="word-description">{item.description}</p><div className="example"><p className="example-label">EM CONTEXTO</p><p lang="en">“{item.useCase}”</p></div></article>)}</div>}
          {!loading && !error && words.length === 0 && <div className="message"><strong>Nenhuma palavra por aqui ainda.</strong><p>Busque novas palavras para começar sua prática.</p></div>}
          <div className="section-bottom"><span>Aprender fica mais fácil com contexto.</span><span>Continue curioso. <ArrowUpRight size={16} aria-hidden="true" /></span></div>
        </section>
      </main>
      <footer><a className="footer-brand" href="/">wordbyword.</a><p>Feito para descobrir. Criado por Victor & Marjorie.</p><span>Front-end Engineering · FIAP</span></footer>
    </div>
  );
}
