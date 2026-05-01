import { Group, Select, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { MSHeroBanner } from './client';

runtime.registerComponent(MSHeroBanner, {
  type: 'primitive-hero-banner',
  label: 'Basic / Hero Banner',
  icon: 'image',
  props: {
    className: Style(),
    layout: Select({
      label: 'Layout',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      defaultValue: 'left',
    }),
    image: Group({
      label: 'Image',
      props: {
        src: TextInput({ label: 'Image URL', defaultValue: '/hero-banner.jpg' }),
        alt: TextInput({ label: 'Alt Text', defaultValue: 'Hero banner image' }),
      },
    }),
    heading: TextInput({ label: 'Heading', defaultValue: 'Welcome to Our Store' }),
    text: TextInput({
      label: 'Text',
      defaultValue: 'Discover amazing products and exclusive offers tailored just for you.',
    }),
    button: Group({
      label: 'Button',
      props: {
        text: TextInput({ label: 'Button Text', defaultValue: 'Shop Now' }),
        href: TextInput({ label: 'Button Link (optional)', defaultValue: '' }),
        variant: Select({
          label: 'Button Variant',
          options: [
            { value: 'primary', label: 'Primary' },
            { value: 'secondary', label: 'Secondary' },
            { value: 'tertiary', label: 'Tertiary' },
            { value: 'ghost', label: 'Ghost' },
          ],
          defaultValue: 'primary',
        }),
      },
    }),
  },
});
