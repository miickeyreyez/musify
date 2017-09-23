import { MusifyAngularPage } from './app.po';

describe('musify-angular App', () => {
  let page: MusifyAngularPage;

  beforeEach(() => {
    page = new MusifyAngularPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
