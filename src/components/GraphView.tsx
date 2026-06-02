"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Dynamically import force graph so it only loads on client
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

export default function GraphView({ data }: { data: any }) {
  const router = useRouter();
  const graphRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    // Make it responsive to window size
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight - 100, // Leave room for header
    });
    
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 100,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full border rounded-lg overflow-hidden bg-gray-50">
      <ForceGraph2D
        ref={graphRef}
        graphData={data}
        width={dimensions.width}
        height={dimensions.height}
        nodeLabel="name"
        nodeAutoColorBy="group"
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkColor={() => '#999'}
        linkLabel="label"
        onNodeClick={(node: any) => {
          router.push(`/person/${node.id}`);
        }}
        nodeCanvasObject={(node: any, ctx: any, globalScale: number) => {
          const label = node.name;
          const fontSize = 14 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#0f172a'; // text color
          ctx.fillText(label, node.x, node.y);

          node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
        }}
        nodePointerAreaPaint={(node: any, color: string, ctx: any) => {
          ctx.fillStyle = color;
          const bckgDimensions = node.__bckgDimensions;
          bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
        }}
      />
    </div>
  );
}
