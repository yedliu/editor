import FormworkLinkedPreview from '@/formwork/views/formworkLinkedPreview';
import FormworkLinkView from '@/formwork/views/formworkLinkView';
import React from 'react';
import { PureComponent } from 'react';

export default class FormworkCombinedPage extends PureComponent<any> {
  render() {
    return (
      <div>
        <FormworkLinkedPreview />
      </div>
    );
  }
}
