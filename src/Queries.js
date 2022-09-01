import { Field, Query } from '@tilework/opus';

export const getCategoriesQuery = () => {
  return new Query('categories', true)
    .addField('name');
}
export const getCurrenciesQuery = () => {
  return new Query('currencies', true)
    .addField('label')
    .addField('symbol');
}
export const getCategorysProducts = (category) => {
  return new Query('category', true)
    .addArgument('input', 'CategoryInput', {
      title: category
    })
    .addField('name')
    .addField(new Field('products', true)
      .addField('id')
      .addField('gallery')
      .addField('brand')
      .addField('name')
      .addField(new Field('prices', false)
        .addField(new Field('currency')
          .addField('label')
          .addField('symbol')
        )
        .addField('amount')
      )
      .addField(new Field('attributes', true)
        .addField('id')
        .addField('name')
        .addField('type')
        .addField(new Field('items')
          .addField('displayValue')
          .addField('value')
          .addField('id')
        )
      )
      .addField('inStock')
    );
}
export const getProductQuery = (id) => {
  return new Query('product', false)
    .addArgument('id', 'String!', id)
    .addField('id')
    .addField('gallery')
    .addField('brand')
    .addField('name')
    .addField(new Field('attributes', true)
      .addField('id')
      .addField('name')
      .addField('type')
      .addField(new Field('items')
        .addField('displayValue')
        .addField('value')
        .addField('id')
      )
    )
    .addField(new Field('prices', false)
      .addField(new Field('currency')
        .addField('label')
        .addField('symbol')
      )
      .addField('amount')
    )
    .addField('inStock')
    .addField('description')
}
