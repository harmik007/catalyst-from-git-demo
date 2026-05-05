import {
  Select,
  Style,
  TextInput,
} from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { MSProductGrid } from './client';

runtime.registerComponent(MSProductGrid, {
  type: 'primitive-product-grid',
  label: 'Catalog / Product Grid',
  icon: 'gallery',
  props: {
    className: Style(),
    productIds: TextInput({
      label: 'Product IDs',
      defaultValue: '86,97,103',
      description: 'Comma-separated product IDs (e.g., 86,97,103)',
    }),
    aspectRatio: Select({
      label: 'Aspect ratio',
      options: [
        { value: '1:1', label: 'Square' },
        { value: '5:6', label: '5:6' },
        { value: '3:4', label: '3:4' },
      ],
      defaultValue: '1:1',
    }),
    colorScheme: Select({
      label: 'Text Color Scheme',
      options: [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
      ],
      defaultValue: 'light',
    }),
    enableDragDrop: Select({
      label: 'Enable Drag & Drop',
      options: [
        { value: 'enabled', label: 'Enabled' },
        { value: 'disabled', label: 'Disabled' },
      ],
      defaultValue: 'enabled',
    }),
  },
});
