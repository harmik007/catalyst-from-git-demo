import { TextInput, Style } from '@makeswift/runtime/controls';
import { runtime } from '~/lib/makeswift/runtime';
import { MSProductGrid } from './client';

runtime.registerComponent(MSProductGrid, {
  type: 'product-grid',
  label: 'Custom / Product Grid',
  props: {
    className: Style(),
    productIds: TextInput({
      label: 'Product IDs (comma separated)',
      placeholder: '12,45,78',
    }),
  },
});