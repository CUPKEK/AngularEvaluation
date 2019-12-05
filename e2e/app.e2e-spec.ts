import { EvaluationPage } from './app.po';

describe('evaluation App', function() {
  let page: EvaluationPage;

  beforeEach(() => {
    page = new EvaluationPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
