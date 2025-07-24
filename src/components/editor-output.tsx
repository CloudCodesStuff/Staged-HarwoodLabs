'use client';

import Image from 'next/image';
import React from 'react';

const headerSize = {
  1: 'text-3xl md:text-4xl font-bold mt-8 mb-4',
  2: 'text-2xl md:text-3xl font-semibold mt-6 mb-3',
  3: 'text-xl md:text-2xl font-semibold mt-5 mb-2',
  4: 'text-lg md:text-xl font-semibold mt-4 mb-2',
  5: 'text-base md:text-lg font-semibold mt-3 mb-1',
  6: 'text-base font-semibold mt-2 mb-1',
};

const renderers = {
  header: ({ data }: { data: any }) => {
    const Tag = `h${data.level}`;
    return React.createElement(
      Tag,
      {
        className:
          headerSize[data.level as keyof typeof headerSize] || headerSize[3],
      },
      data.text
    );
  },
  list: ({ data }: { data: any }) => {
    const Tag = data.style === 'ordered' ? 'ol' : 'ul';
    return (
      <Tag
        className={`my-2 pl-5 list-${data.style === 'ordered' ? 'decimal' : 'disc'} space-y-1`}
      >
        {data.items.map((item: any, i: number) => {
          if (typeof item === 'string') return <li key={i}>{item}</li>;
          if (typeof item === 'object' && item !== null) {
            // Try to render the content property, fallback to JSON
            return <li key={i}>{item.content ?? JSON.stringify(item)}</li>;
          }
          return null;
        })}
      </Tag>
    );
  },
  paragraph: ({ data }: { data: any }) => (
    <p className="my-4 text-[17px] leading-7">{data.text}</p>
  ),
  quote: ({ data }: { data: any }) => (
    <blockquote className="my-4 border-muted-foreground/20 border-l-4 pl-4 text-lg italic">
      <p>{data.text}</p>
      {data.caption && (
        <cite className="text-sm not-italic">- {data.caption}</cite>
      )}
    </blockquote>
  ),
  image: ({ data }: { data: any }) => (
    <div className="relative my-6 min-h-[15rem] w-full">
      <Image
        alt={data.caption || 'image'}
        className="rounded-lg object-contain"
        fill
        src={data.file.url}
      />
      {data.caption && (
        <p className="mt-1 text-center text-muted-foreground text-sm">
          {data.caption}
        </p>
      )}
    </div>
  ),
};

type EditorOutputProps = {
  content: any;
};

export function EditorOutput({ content }: EditorOutputProps) {
  if (!(content && content.blocks)) {
    return null;
  }

  return (
    <div className="prose prose-stone dark:prose-invert max-w-3xl text-base md:text-lg ">
      {content.blocks.map((block: any) => {
        console.log('EditorOutput block:', block);
        const Renderer = renderers[block.type as keyof typeof renderers];
        if (Renderer) {
          return <Renderer data={block.data} key={block.id} />;
        }
        return null;
      })}
    </div>
  );
}
