import { visit } from 'unist-util-visit';
import type { Node } from 'unist';

interface TextNode extends Node {
  type: 'text';
  value: string;
}

interface ElementNode extends Node {
  type: 'element';
  tagName: string;
  properties?: Record<string, any>;
  children?: Node[];
}

interface MdxJsxFlowElementNode extends Node {
  type: 'mdxJsxFlowElement';
  name: string;
  attributes: Array<{
    type: 'mdxJsxAttribute';
    name: string;
    value: string;
  }>;
  children: Node[];
}

export function remarkShortcodes() {
  return (tree: Node) => {
    visit(tree, 'text', (node: TextNode, index, parent) => {
      if (!node.value || !parent || index === undefined) return;

      let modified = false;
      let newValue = node.value;

      // Process YouTube shortcodes
      newValue = newValue.replace(
        /{% youtube (.*?) %}/g,
        (match, videoId) => {
          modified = true;
          return `<YouTubeEmbed videoId="${videoId.trim()}" />`;
        }
      );

      // Process Twitter shortcodes
      newValue = newValue.replace(
        /{% (tweet|twitter) (.*?) %}/g,
        (match, shortcodeName, tweetId) => {
          modified = true;
          return `<TwitterEmbed tweetId="${tweetId.trim()}" />`;
        }
      );

      if (modified) {
        // Split the content and create new nodes
        const parts = newValue.split(/(<YouTubeEmbed[^>]*\/>|<TwitterEmbed[^>]*\/>)/);
        const newNodes: Node[] = [];

        parts.forEach((part) => {
          if (part.startsWith('<YouTubeEmbed')) {
            // Extract videoId from the component string
            const videoIdMatch = part.match(/videoId="([^"]*)"/);
            const videoId = videoIdMatch ? videoIdMatch[1] : '';
            
            newNodes.push({
              type: 'mdxJsxFlowElement',
              name: 'YouTubeEmbed',
              attributes: [
                {
                  type: 'mdxJsxAttribute',
                  name: 'videoId',
                  value: videoId,
                }
              ],
              children: [],
            } as MdxJsxFlowElementNode);
          } else if (part.startsWith('<TwitterEmbed')) {
            // Extract tweetId from the component string
            const tweetIdMatch = part.match(/tweetId="([^"]*)"/);
            const tweetId = tweetIdMatch ? tweetIdMatch[1] : '';
            
            newNodes.push({
              type: 'mdxJsxFlowElement',
              name: 'TwitterEmbed',
              attributes: [
                {
                  type: 'mdxJsxAttribute',
                  name: 'tweetId',
                  value: tweetId,
                }
              ],
              children: [],
            } as MdxJsxFlowElementNode);
          } else if (part.trim()) {
            // Regular text content
            newNodes.push({
              type: 'text',
              value: part,
            } as TextNode);
          }
        });

        // Replace the current node with the new nodes
        if (parent.children && Array.isArray(parent.children)) {
          parent.children.splice(index, 1, ...newNodes);
        }
      }
    });
  };
}