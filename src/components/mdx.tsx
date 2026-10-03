import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import {
  Accordion,
  Accordions,
} from 'fumadocs-ui/components/accordion';
import type { MDXComponents } from 'mdx/types';
import {
  StableDistribution,
  StableReleaseDownload,
  StableReleaseLink,
  StableReleaseName,
  StableRequirements,
} from './stable-release';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    img: (props) => <ImageZoom {...(props as any)} />,
    ImageZoom,
    Accordion,
    Accordions,
    Step,
    Steps,
    StableReleaseName,
    StableReleaseDownload,
    StableReleaseLink,
    StableRequirements,
    StableDistribution,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
